// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import { loadEnv } from 'vite';

// astro.config.mjs runs in Node, outside Vite's own env-loading step, so
// PUBLIC_* vars aren't on import.meta.env here yet — load them manually.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
	process.env.NODE_ENV ?? 'development',
	process.cwd(),
	'PUBLIC_',
);

export default defineConfig({
	site: 'https://sirret.github.io',
	base: '/BGF',
	integrations: [
		sanity({
			projectId: PUBLIC_SANITY_PROJECT_ID,
			dataset: PUBLIC_SANITY_DATASET,
			apiVersion: '2026-07-09',
			useCdn: false,
		}),
	],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@': '/src',
				'@components': '/src/components',
				'@layouts': '/src/layouts',
				'@pages': '/src/pages',
				'@data': '/src/data',
				'@styles': '/src/styles',
			},
		},
	},
});
