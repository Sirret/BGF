// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	site: 'https://sirret.github.io',
	base: '/BGF',
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
