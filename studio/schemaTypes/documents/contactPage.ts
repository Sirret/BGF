import { defineField, defineType } from 'sanity'
import { formSectionBaseFields } from '../formFields'

export default defineType({
	name: 'contactPage',
	title: 'Contact Page',
	type: 'document',
	fields: [
		defineField({ name: 'hero', type: 'heroSection' }),
		defineField({
			name: 'infoSection',
			type: 'object',
			fields: [
				defineField({ name: 'label', type: 'string' }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'subtitle', type: 'text' }),
			],
		}),
		defineField({ name: 'formSection', type: 'object', fields: formSectionBaseFields }),
	],
	preview: { prepare: () => ({ title: 'Contact Page' }) },
})
