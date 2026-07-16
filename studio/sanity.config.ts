import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes, SINGLETON_TYPES } from './schemaTypes'

const SINGLETON_TITLES: Record<string, string> = {
	siteSettings: 'Site Settings',
	homePage: 'Home Page',
	aboutPage: 'About Page',
	contactPage: 'Contact Page',
	donatePage: 'Donate Page',
	getInvolvedPage: 'Get Involved Page',
	impactPage: 'Impact Page',
	privacyPolicyPage: 'Privacy Policy Page',
}

export default defineConfig({
	name: 'default',
	title: 'BethGold Foundation Studio',

	// Not embedded into site/ and no studioBasePath is set — this Studio is
	// deployed on its own via `npx sanity deploy`, independent of the Astro app.
	projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'your-project-id',
	dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

	plugins: [
		structureTool({
			structure: (S) =>
				S.list()
					.title('Content')
					.items([
						...SINGLETON_TYPES.map((type) =>
							S.listItem()
								.title(SINGLETON_TITLES[type])
								.id(type)
								.child(S.document().schemaType(type).documentId(type)),
						),
						S.divider(),
						...S.documentTypeListItems().filter(
							(item) => !(SINGLETON_TYPES as readonly string[]).includes(item.getId() ?? ''),
						),
					]),
		}),
		visionTool(),
	],

	schema: {
		types: schemaTypes,
	},

	document: {
		// Singletons are only reachable via the fixed structure items above —
		// keep them out of the global "+ New document" menu so editors can't
		// create a second siteSettings/homePage/etc. document by accident.
		newDocumentOptions: (prev, { creationContext }) => {
			if (creationContext.type === 'global') {
				return prev.filter((template) => !(SINGLETON_TYPES as readonly string[]).includes(template.templateId))
			}
			return prev
		},
	},
})
