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
				defineField({ name: 'tiktok', type: 'url' }),
			],
		}),
		defineField({
			name: 'forms',
			type: 'object',
			fields: [defineField({ name: 'web3formsAccessKey', type: 'string' })],
		}),
		defineField({
			name: 'activeCampaign',
			title: 'Active Campaign',
			type: 'object',
			description: 'Optional current fundraising campaign, shown as a banner on Projects and a smaller card on Donate. Swap out for a future campaign by editing these fields — not tied to any one URL.',
			fields: [
				defineField({ name: 'active', type: 'boolean', initialValue: false }),
				defineField({ name: 'title', type: 'string' }),
				defineField({ name: 'description', type: 'text' }),
				defineField({ name: 'url', type: 'url' }),
				defineField({ name: 'ctaLabel', type: 'string' }),
			],
		}),
	],
	preview: {
		select: { title: 'org.name' },
		prepare: ({ title }) => ({ title: title ?? 'Site Settings' }),
	},
})
