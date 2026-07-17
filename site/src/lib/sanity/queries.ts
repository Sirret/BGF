import groq from 'groq';
import { sanityClient } from 'sanity:client';
import type { Image } from '@sanity/types';

export type SanityImage = Image & { alt?: string };

export interface CategoryRef {
	_id: string;
	name: string;
	title: string;
	anchor: string;
}

export interface Category extends CategoryRef {
	description?: string;
	icon?: string;
	featured?: boolean;
}

export interface ProjectFile {
	_key: string;
	name: string;
	url: string;
}

export interface Project {
	_id: string;
	title: string;
	slug: string;
	category: CategoryRef;
	status: 'completed' | 'ongoing';
	image?: SanityImage;
	images?: SanityImage[];
	files?: ProjectFile[];
	description?: string;
	impact?: string;
	location?: string;
	date?: string;
	featured?: boolean;
}

export interface NewsArticle {
	_id: string;
	title: string;
	slug: string;
	type: string;
	date: string;
	author?: string;
	image?: SanityImage;
	images?: SanityImage[];
	excerpt?: string;
	content?: unknown[]; // Portable Text blocks — rendered via astro-portabletext
	featured?: boolean;
}

export interface GalleryPhoto {
	_id: string;
	category: CategoryRef;
	image: SanityImage;
	caption?: string;
}

export interface Stat {
	_id: string;
	label: string;
	value: string;
	chartData: number[];
}

export interface TeamMember {
	_id: string;
	name: string;
	position?: string;
	photo?: SanityImage;
	bio?: string;
}

export interface Testimonial {
	_id: string;
	quote: string;
	author: string;
	role?: string;
	location?: string;
}

export interface TimelineEvent {
	_id: string;
	year: string;
	title: string;
	description?: string;
}

// ---------------------------------------------------------------------------
// Singletons
// ---------------------------------------------------------------------------

// siteSettings is read from a dozen+ independent call sites (Navbar, Footer,
// BaseLayout, 404, ContactInfo/Form, VolunteerForm/PartnershipSection,
// WaysToGive, PrivacyPolicyContent) — memoized per build process so that
// doesn't mean a dozen+ duplicate network round-trips during `astro build`.
let _siteSettings: any | null = null;
export async function getSiteSettings() {
	if (_siteSettings) return _siteSettings;
	_siteSettings = await sanityClient.fetch(groq`*[_type == "siteSettings"][0]`);
	return _siteSettings;
}

export const getHomePage = () => sanityClient.fetch(groq`*[_type == "homePage"][0]`);
export const getAboutPage = () => sanityClient.fetch(groq`*[_type == "aboutPage"][0]`);
export const getContactPage = () => sanityClient.fetch(groq`*[_type == "contactPage"][0]`);
export const getDonatePage = () => sanityClient.fetch(groq`*[_type == "donatePage"][0]`);
export const getGetInvolvedPage = () => sanityClient.fetch(groq`*[_type == "getInvolvedPage"][0]`);
export const getImpactPage = () => sanityClient.fetch(groq`*[_type == "impactPage"][0]`);
export const getPrivacyPolicyPage = () => sanityClient.fetch(groq`*[_type == "privacyPolicyPage"][0]`);
export const getPartnerPage = () => sanityClient.fetch(groq`*[_type == "partnerPage"][0]`);

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const getAllCategories = (): Promise<Category[]> =>
	sanityClient.fetch(groq`*[_type == "category"] | order(order asc)`);

export const getFeaturedCategories = (): Promise<Category[]> =>
	sanityClient.fetch(groq`*[_type == "category" && featured == true] | order(order asc)`);

// Replaces the old build-time `assertKnownCategories` string-array guard now
// that category is a reference — returns the distinct category names
// actually in use by a project.
export const getUsedProjectCategoryNames = (): Promise<string[]> =>
	sanityClient.fetch(groq`array::unique(*[_type == "project"].category->name)`);

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

// Full shape for every consumer (grid cards only need a subset, detail pages
// need everything) — one projection avoids drift between a "list" and
// "detail" shape, and getStaticPaths() needs the full document up front
// since Astro.props receives the whole object at build time.
const projectProjection = groq`{
	...,
	"slug": slug.current,
	category->{_id, name, title, anchor},
	files[]{_key, name, "url": file.asset->url},
}`;

export const getAllProjects = (): Promise<Project[]> =>
	sanityClient.fetch(groq`*[_type == "project"] | order(date desc) ${projectProjection}`);

export const getFeaturedProjects = (limit = 3): Promise<Project[]> =>
	sanityClient.fetch(groq`*[_type == "project" && featured == true] | order(date desc)[0...$limit] ${projectProjection}`, {
		limit,
	});

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

const newsProjection = groq`{ ..., "slug": slug.current }`;

export const getAllNews = (): Promise<NewsArticle[]> =>
	sanityClient.fetch(groq`*[_type == "newsArticle"] | order(date desc) ${newsProjection}`);

export const getFeaturedNews = (limit = 3): Promise<NewsArticle[]> =>
	sanityClient.fetch(groq`*[_type == "newsArticle" && featured == true] | order(date desc)[0...$limit] ${newsProjection}`, {
		limit,
	});

// ---------------------------------------------------------------------------
// Gallery, stats, team, testimonials, timeline
// ---------------------------------------------------------------------------

export const getAllGalleryPhotos = (): Promise<GalleryPhoto[]> =>
	sanityClient.fetch(groq`*[_type == "galleryPhoto"] | order(order asc){ ..., category->{_id, name, title, anchor} }`);

export const getAllStats = (): Promise<Stat[]> => sanityClient.fetch(groq`*[_type == "stat"] | order(order asc)`);

export const getAllTeamMembers = (): Promise<TeamMember[]> =>
	sanityClient.fetch(groq`*[_type == "teamMember"] | order(order asc)`);

export const getAllTestimonials = (): Promise<Testimonial[]> =>
	sanityClient.fetch(groq`*[_type == "testimonial"] | order(order asc)`);

export const getAllTimelineEvents = (): Promise<TimelineEvent[]> =>
	sanityClient.fetch(groq`*[_type == "timelineEvent"] | order(year asc)`);
