import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'donatePage',
	title: 'Donate Page',
	type: 'document',
	fields: [
		defineField({ name: 'hero', type: 'heroSection' }),
		defineField({
			name: 'onlineGiving',
			title: 'Online Giving (Modem Pay)',
			type: 'object',
			description:
				'The card/mobile-money checkout on the donate page. Amounts are in Gambian Dalasi (GMD) — Modem Pay settles in GMD only.',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),
				defineField({
					name: 'presetAmounts',
					title: 'Preset amounts (GMD)',
					type: 'array',
					of: [{ type: 'number' }],
					description:
						'Suggested buttons, low to high. Keep the top of the ladder high enough to be meaningful to diaspora donors — 7,500 GMD is only about 100 USD.',
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
					name: 'usdRate',
					title: 'Approx. GMD per 1 USD',
					type: 'number',
					description:
						'Used only to show donors a rough "≈ $X" next to each preset, so international givers can tell what an amount is worth. Leave empty to hide those hints entirely. Re-check it occasionally — the dalasi drifts.',
					validation: (r) => r.min(1),
				}),
				defineField({
					name: 'rateCheckedOn',
					title: 'Rate last checked',
					type: 'date',
					description: 'Shown to donors so a stale estimate is visibly an estimate.',
				}),
				defineField({
					name: 'currencyNote',
					type: 'text',
					description:
						'Small print under the form. Good place to say charges are in GMD and that a foreign bank may add its own conversion fee.',
				}),
				defineField({
					name: 'shareLink',
					title: 'Modem Pay payment link',
					type: 'url',
					description:
						'A reusable Modem Pay link. Used for WhatsApp/Instagram/QR codes, and as the fallback if a visitor has JavaScript disabled. Swap the test link for a live one before launch.',
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
