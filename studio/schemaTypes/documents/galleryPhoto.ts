import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'galleryPhoto',
	title: 'Gallery Photo',
	type: 'document',
	fields: [
		defineField({
			name: 'category',
			type: 'reference',
			to: [{ type: 'category' }],
			validation: (r) => r.required(),
		}),
		defineField({ name: 'image', type: 'imageWithAlt', validation: (r) => r.required() }),
		defineField({ name: 'caption', type: 'string' }),
		defineField({ name: 'order', type: 'number' }),
	],
	orderings: [
		{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
	],
	preview: { select: { title: 'caption', subtitle: 'category.name', media: 'image' } },
})
