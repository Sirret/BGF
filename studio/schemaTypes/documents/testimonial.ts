import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'testimonial',
	title: 'Testimonial',
	type: 'document',
	fields: [
		defineField({ name: 'quote', type: 'text', validation: (r) => r.required() }),
		defineField({ name: 'author', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'role', type: 'string' }),
		defineField({ name: 'location', type: 'string' }),
		defineField({ name: 'order', type: 'number' }),
	],
	orderings: [
		{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
	],
	preview: { select: { title: 'author', subtitle: 'role' } },
})
