import { defineField, defineType } from 'sanity'
import { ICON_OPTIONS } from '../iconOptions'

export default defineType({
	name: 'aboutPage',
	title: 'About Page',
	type: 'document',
	fields: [
		defineField({ name: 'hero', type: 'heroSection' }),
		defineField({
			name: 'story',
			type: 'object',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'paragraphs', type: 'array', of: [{ type: 'text' }] }),
				defineField({ name: 'image', type: 'imageWithAlt' }),
				defineField({ name: 'ctaLabel', type: 'string' }),
				defineField({ name: 'ctaHref', type: 'string' }),
			],
		}),
		defineField({ name: 'mission', type: 'missionVisionBlock' }),
		defineField({ name: 'vision', type: 'missionVisionBlock' }),
		defineField({
			name: 'coreValues',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'coreValue',
					fields: [
						defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
						defineField({ name: 'description', type: 'text' }),
						defineField({ name: 'icon', type: 'string', options: { list: ICON_OPTIONS } }),
					],
				},
			],
		}),
		defineField({
			name: 'cta',
			type: 'object',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),
				defineField({ name: 'image', type: 'imageWithAlt' }),
			],
		}),
	],
	preview: { prepare: () => ({ title: 'About Page' }) },
})
