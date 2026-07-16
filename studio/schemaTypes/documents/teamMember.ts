import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'teamMember',
	title: 'Team Member',
	type: 'document',
	fields: [
		defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'position', type: 'string' }),
		defineField({ name: 'photo', type: 'imageWithAlt' }),
		defineField({ name: 'bio', type: 'text' }),
		defineField({ name: 'order', type: 'number' }),
	],
	orderings: [
		{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
	],
	preview: { select: { title: 'name', subtitle: 'position', media: 'photo' } },
})
