import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'newsArticle',
	title: 'News Article',
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
			name: 'type',
			type: 'string',
			options: { list: ['Announcement', 'Press Release', 'Event'] },
			validation: (r) => r.required(),
		}),
		defineField({ name: 'date', type: 'datetime', validation: (r) => r.required() }),
		defineField({ name: 'author', type: 'string' }),
		defineField({ name: 'image', type: 'imageWithAlt' }),
		defineField({ name: 'images', type: 'array', of: [{ type: 'imageWithAlt' }] }),
		defineField({ name: 'excerpt', type: 'text' }),
		defineField({ name: 'content', type: 'array', of: [{ type: 'block' }] }),
		defineField({ name: 'featured', type: 'boolean', initialValue: false }),
	],
	orderings: [{ title: 'Date, newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
	preview: { select: { title: 'title', subtitle: 'type', media: 'image' } },
})
