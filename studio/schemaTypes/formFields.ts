import { defineField } from 'sanity'

// Shared base fields for the site's three form-intro sections (contact,
// volunteer, partnership) — each spreads this array and adds its own extra
// fields (interestOptions, paragraphs, etc.) rather than duplicating these six.
export const formSectionBaseFields = [
	defineField({ name: 'label', type: 'string' }),
	defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
	defineField({ name: 'subtitle', type: 'text' }),
	defineField({ name: 'submitLabel', type: 'string' }),
	defineField({ name: 'successMessage', type: 'string' }),
	defineField({ name: 'errorMessage', type: 'string' }),
]
