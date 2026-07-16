import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'donatePage',
	title: 'Donate Page',
	type: 'document',
	fields: [
		defineField({ name: 'hero', type: 'heroSection' }),
		defineField({
			name: 'waysToGiveSection',
			type: 'object',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),
				defineField({
					name: 'bankTransfer',
					type: 'object',
					fields: [
						defineField({ name: 'label', type: 'string' }),
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'bankName', type: 'string' }),
						defineField({ name: 'accountNumber', type: 'string' }),
						defineField({ name: 'swiftCode', type: 'string' }),
					],
				}),
				defineField({
					name: 'mobileMoney',
					type: 'object',
					fields: [
						defineField({ name: 'label', type: 'string' }),
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'provider', type: 'string' }),
						defineField({ name: 'number', type: 'string' }),
					],
				}),
				defineField({ name: 'helpText', type: 'text' }),
			],
		}),
		defineField({
			name: 'otherWaysSection',
			type: 'object',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),
			],
		}),
	],
	preview: { prepare: () => ({ title: 'Donate Page' }) },
})
