import type { SchemaTypeDefinition } from 'sanity'

import imageWithAlt from './objects/imageWithAlt'
import heroSection from './objects/heroSection'
import button from './objects/button'
import missionVisionBlock from './objects/missionVisionBlock'

import siteSettings from './documents/siteSettings'
import homePage from './documents/homePage'
import aboutPage from './documents/aboutPage'
import contactPage from './documents/contactPage'
import donatePage from './documents/donatePage'
import getInvolvedPage from './documents/getInvolvedPage'
import impactPage from './documents/impactPage'
import privacyPolicyPage from './documents/privacyPolicyPage'
import partnerPage from './documents/partnerPage'

import category from './documents/category'
import project from './documents/project'
import newsArticle from './documents/newsArticle'
import galleryPhoto from './documents/galleryPhoto'
import stat from './documents/stat'
import teamMember from './documents/teamMember'
import testimonial from './documents/testimonial'
import timelineEvent from './documents/timelineEvent'

export const schemaTypes: SchemaTypeDefinition[] = [
	// shared objects
	imageWithAlt,
	heroSection,
	button,
	missionVisionBlock,
	// singleton documents
	siteSettings,
	homePage,
	aboutPage,
	contactPage,
	donatePage,
	getInvolvedPage,
	impactPage,
	privacyPolicyPage,
	partnerPage,
	// collection documents
	category,
	project,
	newsArticle,
	galleryPhoto,
	stat,
	teamMember,
	testimonial,
	timelineEvent,
]

// Document type names that should be locked to exactly one instance in the
// Studio (see sanity.config.ts's structure/newDocumentOptions).
export const SINGLETON_TYPES = [
	'siteSettings',
	'homePage',
	'aboutPage',
	'contactPage',
	'donatePage',
	'getInvolvedPage',
	'impactPage',
	'privacyPolicyPage',
	'partnerPage',
] as const
