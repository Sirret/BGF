import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'homePage',
	title: 'Home Page',
	type: 'document',
	fields: [
		defineField({
			name: 'aboutSummary',
			type: 'object',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),
				defineField({ name: 'paragraph', type: 'text' }),
				defineField({ name: 'image', type: 'imageWithAlt' }),
				defineField({ name: 'ctaLabel', type: 'string' }),
				defineField({ name: 'ctaHref', type: 'string' }),
			],
		}),
		defineField({
			name: 'callToAction',
			type: 'object',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),
				defineField({ name: 'paragraph', type: 'text' }),
				defineField({ name: 'image', type: 'imageWithAlt' }),
				defineField({ name: 'buttons', type: 'array', of: [{ type: 'button' }] }),
			],
		}),
	],
	preview: { prepare: () => ({ title: 'Home Page' }) },
})
