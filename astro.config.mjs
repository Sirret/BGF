// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://sirret.github.io',
	base: '/BGF',
	vite: {
		plugins: [tailwindcss()],
	},
});
