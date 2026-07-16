/**
 * One-time/rerunnable content seed: reads the site's original site/src/data/*.json
 * files, uploads their referenced local images/files as Sanity assets, and
 * createOrReplace()s the equivalent Sanity documents with deterministic _ids
 * (so rerunning after editing a JSON file safely overwrites, never duplicates).
 *
 * Requires SANITY_API_TOKEN (Editor/Administrator) in studio/.env — see
 * studio/.env.example. Run with: npm run seed (from studio/).
 */
import 'dotenv/config'
import { createClient, type SanityClient } from '@sanity/client'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SITE_ROOT = path.resolve(__dirname, '../../site')
const SITE_PUBLIC = path.join(SITE_ROOT, 'public')
const SITE_DATA = path.join(SITE_ROOT, 'src/data')

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset) {
	throw new Error('SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET missing — check studio/.env')
}
if (!token) {
	throw new Error(
		'SANITY_API_TOKEN missing from studio/.env. Generate a write token (Editor or ' +
			'Administrator permission) at https://www.sanity.io/manage for this project, ' +
			'then add SANITY_API_TOKEN=<token> to studio/.env (already gitignored).',
	)
}

const client: SanityClient = createClient({
	projectId,
	dataset,
	apiVersion: '2026-07-09',
	token,
	useCdn: false,
})

async function readJson<T>(filename: string): Promise<T> {
	const raw = await fs.readFile(path.join(SITE_DATA, filename), 'utf-8')
	return JSON.parse(raw) as T
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')
}

function toPortableText(paragraphs: string[] = []) {
	return paragraphs.map((text) => ({
		_type: 'block' as const,
		_key: randomUUID(),
		style: 'normal' as const,
		markDefs: [],
		children: [{ _type: 'span' as const, _key: randomUUID(), text, marks: [] }],
	}))
}

// Sanity's asset store is content-addressed (SHA1 of the bytes), so
// re-uploading an unchanged file is cheap and returns the existing asset —
// this cache just avoids redundant upload calls within a single run for
// images/files referenced by more than one JSON entry.
const assetCache = new Map<string, { _type: string; _id: string }>()

async function uploadAsset(kind: 'image' | 'file', relPath: string) {
	const cacheKey = `${kind}:${relPath}`
	const cached = assetCache.get(cacheKey)
	if (cached) return cached
	const absPath = path.join(SITE_PUBLIC, relPath.replace(/^\//, ''))
	const buffer = await fs.readFile(absPath)

	// The asset upload endpoint has been intermittently returning transient
	// 503s (upstream connection resets) mid-run — retry with backoff instead
	// of letting one flaky request kill an otherwise-successful seed pass.
	const maxAttempts = 4
	let lastError: unknown
	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			const asset = await client.assets.upload(kind, buffer, { filename: path.basename(relPath) })
			assetCache.set(cacheKey, asset)
			console.log(`  uploaded ${kind}: ${relPath} -> ${asset._id}`)
			return asset
		} catch (err) {
			lastError = err
			if (attempt < maxAttempts) {
				const delayMs = 1000 * 2 ** (attempt - 1)
				console.warn(`  upload of ${relPath} failed (attempt ${attempt}/${maxAttempts}), retrying in ${delayMs}ms...`)
				await new Promise((resolve) => setTimeout(resolve, delayMs))
			}
		}
	}
	throw lastError
}

async function imageWithAlt(relPath: string | undefined, alt: string) {
	if (!relPath) return undefined
	const asset = await uploadAsset('image', relPath)
	return {
		_type: 'image' as const,
		asset: { _type: 'reference' as const, _ref: asset._id },
		alt,
	}
}

async function fileAsset(relPath: string | undefined) {
	if (!relPath) return undefined
	const asset = await uploadAsset('file', relPath)
	return { _type: 'file' as const, asset: { _type: 'reference' as const, _ref: asset._id } }
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

interface CategoryJson {
	name: string
	title: string
	description: string
	icon: string
	anchor: string
	featured: boolean
}

async function seedCategories(): Promise<Map<string, string>> {
	console.log('Seeding categories...')
	const categories = await readJson<CategoryJson[]>('categories.json')
	const idByName = new Map<string, string>()
	for (const [index, cat] of categories.entries()) {
		const id = `category-${slugify(cat.name)}`
		await client.createOrReplace({
			_id: id,
			_type: 'category',
			name: cat.name,
			title: cat.title,
			description: cat.description,
			icon: cat.icon,
			anchor: cat.anchor,
			featured: cat.featured,
			order: index,
		})
		idByName.set(cat.name, id)
	}
	return idByName
}

interface ProjectJson {
	title: string
	slug: string
	category: string
	status: 'completed' | 'ongoing'
	image: string
	images: { src: string; alt: string }[]
	files: { name: string; url: string; type: string }[]
	description: string
	impact: string
	location: string
	date: string
	featured: boolean
}

async function seedProjects(categoryIds: Map<string, string>) {
	console.log('Seeding projects...')
	const projects = await readJson<ProjectJson[]>('projects.json')
	for (const p of projects) {
		const categoryId = categoryIds.get(p.category)
		if (!categoryId) throw new Error(`Project "${p.title}" references unknown category "${p.category}"`)
		const images = await Promise.all(p.images.map((img) => imageWithAlt(img.src, img.alt)))
		const files = await Promise.all(
			p.files.map(async (f) => ({ _key: randomUUID(), name: f.name, file: await fileAsset(f.url) })),
		)
		await client.createOrReplace({
			_id: `project-${p.slug}`,
			_type: 'project',
			title: p.title,
			slug: { _type: 'slug', current: p.slug },
			category: { _type: 'reference', _ref: categoryId },
			status: p.status,
			image: await imageWithAlt(p.image, p.title),
			images: images.filter(Boolean),
			files,
			description: p.description,
			impact: p.impact,
			location: p.location,
			date: p.date,
			featured: p.featured,
		})
	}
}

interface NewsJson {
	title: string
	slug: string
	type: string
	date: string
	author: string
	image: string
	images: { src: string; alt: string }[]
	excerpt: string
	content: string[]
	featured: boolean
}

async function seedNews() {
	console.log('Seeding news articles...')
	const articles = await readJson<NewsJson[]>('news.json')
	for (const a of articles) {
		const images = await Promise.all(a.images.map((img) => imageWithAlt(img.src, img.alt)))
		await client.createOrReplace({
			_id: `newsArticle-${a.slug}`,
			_type: 'newsArticle',
			title: a.title,
			slug: { _type: 'slug', current: a.slug },
			type: a.type,
			date: new Date(a.date).toISOString(),
			author: a.author,
			image: await imageWithAlt(a.image, a.title),
			images: images.filter(Boolean),
			excerpt: a.excerpt,
			content: toPortableText(a.content),
			featured: a.featured,
		})
	}
}

interface GalleryJson {
	id: string
	category: string
	image: string
	alt: string
	caption: string
}

async function seedGallery(categoryIds: Map<string, string>) {
	console.log('Seeding gallery photos...')
	const photos = await readJson<GalleryJson[]>('gallery.json')
	for (const [index, photo] of photos.entries()) {
		const categoryId = categoryIds.get(photo.category)
		if (!categoryId) throw new Error(`Gallery photo "${photo.id}" references unknown category "${photo.category}"`)
		await client.createOrReplace({
			_id: `galleryPhoto-${photo.id}`,
			_type: 'galleryPhoto',
			category: { _type: 'reference', _ref: categoryId },
			image: await imageWithAlt(photo.image, photo.alt),
			caption: photo.caption,
			order: index,
		})
	}
}

interface StatJson {
	id: string
	label: string
	value: string
	chartData: number[]
}

async function seedStats() {
	console.log('Seeding stats...')
	const stats = await readJson<StatJson[]>('stats.json')
	for (const [index, s] of stats.entries()) {
		await client.createOrReplace({
			_id: `stat-${s.id}`,
			_type: 'stat',
			label: s.label,
			value: s.value,
			chartData: s.chartData,
			order: index,
		})
	}
}

interface TeamJson {
	id: string
	name: string
	position: string
	photo: string
	bio: string
}

async function seedTeam() {
	console.log('Seeding team members...')
	const team = await readJson<TeamJson[]>('team.json')
	for (const [index, member] of team.entries()) {
		await client.createOrReplace({
			_id: `teamMember-${member.id}`,
			_type: 'teamMember',
			name: member.name,
			position: member.position,
			photo: await imageWithAlt(member.photo, member.name),
			bio: member.bio,
			order: index,
		})
	}
}

interface TestimonialJson {
	id: string
	quote: string
	author: string
	role: string
	location: string
}

async function seedTestimonials() {
	console.log('Seeding testimonials...')
	const testimonials = await readJson<TestimonialJson[]>('testimonials.json')
	for (const [index, t] of testimonials.entries()) {
		await client.createOrReplace({
			_id: `testimonial-${t.id}`,
			_type: 'testimonial',
			quote: t.quote,
			author: t.author,
			role: t.role,
			location: t.location,
			order: index,
		})
	}
}

interface TimelineJson {
	year: string
	title: string
	description: string
}

async function seedTimeline() {
	console.log('Seeding timeline events...')
	const timeline = await readJson<TimelineJson[]>('timeline.json')
	for (const event of timeline) {
		await client.createOrReplace({
			_id: `timelineEvent-${event.year}`,
			_type: 'timelineEvent',
			year: event.year,
			title: event.title,
			description: event.description,
		})
	}
}

// ---------------------------------------------------------------------------
// Singletons
// ---------------------------------------------------------------------------

async function seedSiteSettings() {
	console.log('Seeding site settings...')
	const site = await readJson<any>('site.json')
	await client.createOrReplace({
		_id: 'siteSettings',
		_type: 'siteSettings',
		org: {
			name: site.org.name,
			tagline: site.org.tagline,
			subline: site.org.subline,
			logo: await imageWithAlt(site.org.logo, site.org.name),
			registered: site.org.registered,
		},
		contact: site.contact,
		social: site.social,
		forms: site.forms,
	})
}

async function seedHomePage() {
	console.log('Seeding home page...')
	const home = await readJson<any>('home.json')
	await client.createOrReplace({
		_id: 'homePage',
		_type: 'homePage',
		aboutSummary: {
			label: home.aboutSummary.label,
			title: home.aboutSummary.title,
			subtitle: home.aboutSummary.subtitle,
			paragraph: home.aboutSummary.paragraph,
			image: await imageWithAlt(home.aboutSummary.image, home.aboutSummary.imageAlt),
			ctaLabel: home.aboutSummary.ctaLabel,
			ctaHref: home.aboutSummary.ctaHref,
		},
		callToAction: {
			label: home.callToAction.label,
			title: home.callToAction.title,
			subtitle: home.callToAction.subtitle,
			paragraph: home.callToAction.paragraph,
			image: await imageWithAlt(home.callToAction.image, home.callToAction.imageAlt),
			buttons: home.callToAction.buttons,
		},
	})
}

async function seedAboutPage() {
	console.log('Seeding about page...')
	const about = await readJson<any>('about.json')
	await client.createOrReplace({
		_id: 'aboutPage',
		_type: 'aboutPage',
		hero: {
			...about.hero,
			backgroundImage: await imageWithAlt(about.hero.backgroundImage, about.hero.title),
		},
		story: {
			label: about.story.label,
			heading: about.story.heading,
			paragraphs: about.story.paragraphs,
			image: await imageWithAlt(about.story.image, about.story.imageAlt),
			ctaLabel: about.story.ctaLabel,
			ctaHref: about.story.ctaHref,
		},
		mission: about.mission,
		vision: about.vision,
		coreValues: about.coreValues.map((cv: any) => ({ ...cv, _key: randomUUID() })),
		cta: {
			label: about.cta.label,
			heading: about.cta.heading,
			subtitle: about.cta.subtitle,
			image: await imageWithAlt(about.cta.image, about.cta.imageAlt),
		},
	})
}

// Neither contact.json nor impact.json ever specified a hero backgroundImage
// (the live site's PageHero silently fell back to the homepage hero image
// for both) — seeded here with hero-bg.jpg so that accidental-but-live visual
// result becomes an explicit, editable field instead. Swap the image in
// Studio any time.
const HERO_PLACEHOLDER_IMAGE = '/images/hero-bg.jpg'

async function seedContactPage() {
	console.log('Seeding contact page...')
	const contact = await readJson<any>('contact.json')
	await client.createOrReplace({
		_id: 'contactPage',
		_type: 'contactPage',
		hero: {
			...contact.hero,
			backgroundImage: await imageWithAlt(HERO_PLACEHOLDER_IMAGE, contact.hero.title),
		},
		infoSection: contact.infoSection,
		formSection: contact.formSection,
	})
}

async function seedDonatePage() {
	console.log('Seeding donate page...')
	const donate = await readJson<any>('donate.json')
	await client.createOrReplace({
		_id: 'donatePage',
		_type: 'donatePage',
		hero: {
			...donate.hero,
			backgroundImage: await imageWithAlt(donate.hero.backgroundImage, donate.hero.title),
		},
		waysToGiveSection: donate.waysToGiveSection,
		otherWaysSection: donate.otherWaysSection,
	})
}

async function seedGetInvolvedPage() {
	console.log('Seeding get-involved page...')
	const gi = await readJson<any>('get-involved.json')
	await client.createOrReplace({
		_id: 'getInvolvedPage',
		_type: 'getInvolvedPage',
		hero: {
			...gi.hero,
			backgroundImage: await imageWithAlt(gi.hero.backgroundImage, gi.hero.title),
		},
		volunteerSection: gi.volunteerSection,
		donateSection: gi.donateSection,
		partnershipSection: gi.partnershipSection,
	})
}

async function seedImpactPage() {
	console.log('Seeding impact page...')
	const impact = await readJson<any>('impact.json')
	await client.createOrReplace({
		_id: 'impactPage',
		_type: 'impactPage',
		hero: {
			...impact.hero,
			backgroundImage: await imageWithAlt(HERO_PLACEHOLDER_IMAGE, impact.hero.title),
		},
		statsSection: impact.statsSection,
		testimonialsSection: impact.testimonialsSection,
		timelineSection: impact.timelineSection,
	})
}

async function seedPrivacyPolicyPage() {
	console.log('Seeding privacy policy page...')
	const pp = await readJson<any>('privacy-policy.json')
	await client.createOrReplace({
		_id: 'privacyPolicyPage',
		_type: 'privacyPolicyPage',
		hero: {
			...pp.hero,
			backgroundImage: await imageWithAlt(pp.hero.backgroundImage, pp.hero.title),
		},
		lastUpdated: pp.lastUpdated,
		sections: pp.sections.map((s: any) => ({ ...s, _key: randomUUID() })),
	})
}

// ---------------------------------------------------------------------------

async function main() {
	const categoryIds = await seedCategories()
	await seedProjects(categoryIds)
	await seedGallery(categoryIds)
	await seedNews()
	await seedStats()
	await seedTeam()
	await seedTestimonials()
	await seedTimeline()
	await seedSiteSettings()
	await seedHomePage()
	await seedAboutPage()
	await seedContactPage()
	await seedDonatePage()
	await seedGetInvolvedPage()
	await seedImpactPage()
	await seedPrivacyPolicyPage()
	console.log('Seed complete.')
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
