import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'donatePage',
	title: 'Donate Page',
	type: 'document',
	fields: [
		defineField({ name: 'hero', type: 'heroSection' }),
		defineField({
			name: 'onlineGiving',
			title: 'Give Online',
			type: 'object',
			description:
				'The main giving section. It asks one question, "where are you giving from?", because the answer decides the rail: Gambian donors pay through Modem Pay in dalasi, donors abroad go to the GoFundMe campaign, which handles their own currency.',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),

				defineField({
					name: 'local',
					title: 'Giving from The Gambia (Modem Pay)',
					type: 'object',
					fields: [
						defineField({ name: 'label', type: 'string' }),
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'description', type: 'text' }),
						defineField({
							name: 'presetAmounts',
							title: 'Preset amounts (GMD)',
							type: 'array',
							of: [{ type: 'number' }],
							description:
								'Suggested buttons, low to high. These are for donors inside The Gambia, so pitch them in dalasi terms rather than converting from dollars.',
							validation: (r) => r.unique(),
						}),
						defineField({
							name: 'minAmount',
							title: 'Minimum amount (GMD)',
							type: 'number',
							description: "Modem Pay rejects anything under 10 GMD, so don't go below that.",
							initialValue: 10,
							validation: (r) => r.min(10),
						}),
						defineField({
							name: 'currencyNote',
							type: 'text',
							description: 'Small print under the amount picker.',
						}),
						defineField({
							name: 'shareLink',
							title: 'Modem Pay payment link',
							type: 'url',
							description:
								'A reusable Modem Pay link, for WhatsApp, Instagram and QR codes. Also the fallback shown if a visitor has JavaScript disabled. Swap the test link for a live one before launch.',
						}),
					],
				}),

				defineField({
					name: 'international',
					title: 'Giving from outside The Gambia (GoFundMe)',
					type: 'object',
					description:
						'The button and link come from Site Settings > Active Campaign, so the GoFundMe URL is only ever maintained in one place. If no campaign is active, this whole card is hidden.',
					fields: [
						defineField({ name: 'label', type: 'string' }),
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'description', type: 'text' }),
					],
				}),

				defineField({
					name: 'successTitle',
					type: 'string',
					initialValue: 'Thank you for your gift',
				}),
				defineField({ name: 'successBody', type: 'text' }),
				defineField({
					name: 'cancelledTitle',
					type: 'string',
					initialValue: 'Your donation was cancelled',
				}),
				defineField({ name: 'cancelledBody', type: 'text' }),
			],
		}),
		defineField({
			name: 'bankTransferSection',
			title: 'Bank Transfer',
			type: 'object',
			description:
				'A plain reference block, last on the page. Not a call to action: it exists for institutional donors and large gifts that will not go through a checkout.',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),
				defineField({ name: 'bankName', type: 'string' }),
				defineField({ name: 'accountNumber', type: 'string' }),
				defineField({ name: 'swiftCode', type: 'string' }),
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
