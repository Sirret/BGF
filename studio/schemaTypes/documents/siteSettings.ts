import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'siteSettings',
	title: 'Site Settings',
	type: 'document',
	fields: [
		defineField({
			name: 'org',
			type: 'object',
			fields: [
				defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'tagline', type: 'string' }),
				defineField({ name: 'subline', type: 'string' }),
				defineField({ name: 'logo', type: 'imageWithAlt' }),
				defineField({ name: 'registered', type: 'string' }),
			],
		}),
		defineField({
			name: 'contact',
			type: 'object',
			fields: [
				defineField({ name: 'email', type: 'string' }),
				defineField({ name: 'phone', type: 'string' }),
				defineField({ name: 'phone2', type: 'string' }),
				defineField({ name: 'address', type: 'string' }),
			],
		}),
		defineField({
			name: 'social',
			type: 'object',
			fields: [
				defineField({ name: 'facebook', type: 'url' }),
				defineField({ name: 'instagram', type: 'url' }),
				defineField({ name: 'twitter', type: 'url' }),
				defineField({ name: 'linkedin', type: 'url' }),
			],
		}),
		defineField({
			name: 'forms',
			type: 'object',
			fields: [defineField({ name: 'web3formsAccessKey', type: 'string' })],
		}),
	],
	preview: {
		select: { title: 'org.name' },
		prepare: ({ title }) => ({ title: title ?? 'Site Settings' }),
	},
})
