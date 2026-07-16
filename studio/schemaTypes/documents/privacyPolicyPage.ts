import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'privacyPolicyPage',
	title: 'Privacy Policy Page',
	type: 'document',
	fields: [
		defineField({ name: 'hero', type: 'heroSection' }),
		defineField({ name: 'lastUpdated', type: 'date' }),
		defineField({
			name: 'sections',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'policySection',
					fields: [
						defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
						defineField({ name: 'paragraphs', type: 'array', of: [{ type: 'text' }] }),
						defineField({ name: 'list', type: 'array', of: [{ type: 'string' }] }),
						defineField({ name: 'closingParagraphs', type: 'array', of: [{ type: 'text' }] }),
					],
				},
			],
		}),
	],
	preview: { prepare: () => ({ title: 'Privacy Policy Page' }) },
})
