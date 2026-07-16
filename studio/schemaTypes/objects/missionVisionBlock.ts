import { defineField, defineType } from 'sanity'
import { ICON_OPTIONS } from '../iconOptions'

// Shared shape for about.json's `mission` and `vision` blocks — identical
// fields, only the content differs.
export default defineType({
	name: 'missionVisionBlock',
	title: 'Mission/Vision block',
	type: 'object',
	fields: [
		defineField({ name: 'label', type: 'string' }),
		defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'description', type: 'text' }),
		defineField({ name: 'icon', type: 'string', options: { list: ICON_OPTIONS } }),
	],
})
