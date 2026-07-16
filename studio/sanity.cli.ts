import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
	api: {
		projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'your-project-id',
		dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
	},
	// Deployed to https://bethgold-foundation.sanity.studio/ — pins the app ID
	// so `npx sanity deploy` doesn't re-prompt for it on every future deploy.
	deployment: {
		appId: 'q9okd5qpce1zrqw2lrvg1769',
	},
})
