import { defineField, defineType } from 'sanity'

const sectionHeading = {
	type: 'object' as const,
	fields: [
		defineField({ name: 'label', type: 'string' }),
		defineField({ name: 'title', type: 'string', validation: (r: any) => r.required() }),
		defineField({ name: 'subtitle', type: 'text' }),
	],
}

export default defineType({
	name: 'partnerPage',
	title: 'Partner Page',
	type: 'document',
	fields: [
		defineField({ name: 'hero', type: 'heroSection' }),
		defineField({ name: 'programmesSection', ...sectionHeading }),
		defineField({
			name: 'programmes',
			title: 'Flagship programmes',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'programme',
					fields: [
						defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
						defineField({ name: 'description', type: 'text' }),
					],
				},
			],
		}),
		defineField({ name: 'servicesSection', ...sectionHeading }),
		defineField({
			name: 'services',
			title: 'Consultancy services',
			type: 'array',
			of: [{ type: 'string' }],
		}),
		defineField({
			name: 'partnersBlurb',
			title: 'Who we partner with (closing paragraph)',
			type: 'text',
		}),
		defineField({
			name: 'cta',
			type: 'object',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),
				defineField({ name: 'ctaLabel', type: 'string' }),
				defineField({ name: 'ctaHref', type: 'string' }),
			],
		}),
	],
	preview: { prepare: () => ({ title: 'Partner Page' }) },
})
