import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'stat',
	title: 'Stat',
	type: 'document',
	fields: [
		defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'chartData',
			type: 'array',
			of: [{ type: 'number' }],
			description: '4 values (0-100) driving the CSS mini bar chart.',
		}),
		defineField({ name: 'order', type: 'number' }),
	],
	orderings: [
		{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
	],
	preview: { select: { title: 'label', subtitle: 'value' } },
})
