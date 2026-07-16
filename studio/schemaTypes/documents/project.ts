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
		defineField({ name: 'description', type: 'text' }),
		defineField({ name: 'impact', type: 'text' }),
		defineField({ name: 'location', type: 'string' }),
		defineField({ name: 'date', type: 'date' }),
		defineField({ name: 'featured', type: 'boolean', initialValue: false }),
	],
	orderings: [{ title: 'Date, newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
	preview: {
		select: { title: 'title', subtitle: 'category.name', media: 'image' },
	},
})
