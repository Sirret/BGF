import { defineField, defineType } from 'sanity'
import { ICON_OPTIONS } from '../iconOptions'

export default defineType({
	name: 'category',
	title: 'Category',
	type: 'document',
	fields: [
		defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'description', type: 'text' }),
		defineField({ name: 'icon', type: 'string', options: { list: ICON_OPTIONS } }),
		defineField({ name: 'anchor', type: 'string' }),
		defineField({ name: 'featured', type: 'boolean', initialValue: false }),
		defineField({ name: 'order', type: 'number' }),
	],
	orderings: [
		{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
	],
	preview: { select: { title: 'title', subtitle: 'name' } },
})
