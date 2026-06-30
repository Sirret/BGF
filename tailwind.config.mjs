// tailwind.config.mjs
// NOTE: This project uses Tailwind CSS v4 with @tailwindcss/vite.
// In Tailwind v4, most configuration moves to CSS (@theme in global.css).
// This file handles only what still belongs here: DaisyUI plugin + theme.

import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				bethgold: {
					primary: '#2f3192',
					secondary: '#b1308e',
					accent: '#b1308e',
					neutral: '#1a1a2e',
					'base-100': '#f8f7fc',
					'base-content': '#1a1a2e',
				},
			},
		],
		defaultTheme: 'bethgold',
		logs: false,
	},
};
