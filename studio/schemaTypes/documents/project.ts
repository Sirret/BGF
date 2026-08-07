import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'project',
	title: 'Project',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'category',
			type: 'reference',
			to: [{ type: 'category' }],
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'status',
			type: 'string',
			options: { list: ['completed', 'ongoing'] },
			validation: (r) => r.required(),
		}),
		defineField({ name: 'image', type: 'imageWithAlt' }),
		defineField({ name: 'images', type: 'array', of: [{ type: 'imageWithAlt' }] }),
		defineField({
			name: 'files',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'projectFile',
					fields: [
						defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
						defineField({ name: 'file', type: 'file', validation: (r) => r.required() }),
					],
				},
			],
		}),
		defineField({
			name: 'subline',
			title: 'Subline (preview card summary)',
			type: 'string',
			description: 'One short sentence shown on the projects grid and other preview cards, in place of the full description.',
		}),
		defineField({
			name: 'description',
			title: 'Description (full, project detail page)',
			type: 'text',
			description: 'Full write-up shown on the project detail page. Separate paragraphs with a blank line.',
		}),
		defineField({
			name: 'impacts',
			title: 'Impact statements',
			type: 'array',
			of: [{ type: 'string' }],
			description: 'One or more impact statements. The first is used on preview cards; the full list is shown on the project detail page. Order the most important one first.',
		}),
		defineField({ name: 'location', type: 'string' }),
		defineField({ name: 'date', type: 'date' }),
		defineField({ name: 'featured', type: 'boolean', initialValue: false }),
	],
	orderings: [{ title: 'Date, newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
	preview: {
		select: { title: 'title', subtitle: 'category.name', media: 'image' },
	},
})
