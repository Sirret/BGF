import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'heroSection',
	title: 'Hero',
	type: 'object',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'subtitle', type: 'text' }),
		defineField({ name: 'breadcrumb', type: 'string' }),
		defineField({ name: 'backgroundImage', type: 'imageWithAlt' }),
	],
})
