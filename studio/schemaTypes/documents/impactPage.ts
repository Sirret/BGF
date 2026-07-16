import { defineField, defineType } from 'sanity'

const sectionHeading = {
	type: 'object' as const,
	fields: [
		defineField({ name: 'label', type: 'string' }),
		defineField({ name: 'title', type: 'string', validation: (r: any) => r.required() }),
		defineField({ name: 'subtitle', type: 'text' }),
	],
}

export default defineType({
	name: 'impactPage',
	title: 'Impact Page',
	type: 'document',
	fields: [
		// Impact's hero has no backgroundImage in the original JSON, but
		// PageHero.astro silently fell back to the homepage hero image when
		// none was set — using heroSection here (with a seeded image) keeps
		// that same visual result explicit instead of accidental.
		defineField({ name: 'hero', type: 'heroSection' }),
		defineField({ name: 'statsSection', ...sectionHeading }),
		defineField({ name: 'testimonialsSection', ...sectionHeading }),
		defineField({ name: 'timelineSection', ...sectionHeading }),
	],
	preview: { prepare: () => ({ title: 'Impact Page' }) },
})
