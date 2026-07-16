import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'button',
	title: 'Button',
	type: 'object',
	fields: [
		defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'href', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'variant',
			type: 'string',
			options: { list: ['accent', 'outline', 'ghost'] },
			validation: (r) => r.required(),
		}),
	],
})
