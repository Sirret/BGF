import { defineField, defineType } from 'sanity'
import { formSectionBaseFields } from '../formFields'

export default defineType({
	name: 'getInvolvedPage',
	title: 'Get Involved Page',
	type: 'document',
	fields: [
		defineField({ name: 'hero', type: 'heroSection' }),
		defineField({
			name: 'volunteerSection',
			type: 'object',
			fields: [
				...formSectionBaseFields,
				defineField({ name: 'interestOptions', type: 'array', of: [{ type: 'string' }] }),
				defineField({ name: 'availabilityOptions', type: 'array', of: [{ type: 'string' }] }),
			],
		}),
		defineField({
			name: 'donateSection',
			type: 'object',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),
				defineField({ name: 'ctaLabel', type: 'string' }),
				defineField({ name: 'ctaHref', type: 'string' }),
			],
		}),
		defineField({
			name: 'partnershipSection',
			type: 'object',
			fields: [
				...formSectionBaseFields,
				defineField({ name: 'paragraphs', type: 'array', of: [{ type: 'text' }] }),
			],
		}),
	],
	preview: { prepare: () => ({ title: 'Get Involved Page' }) },
})
