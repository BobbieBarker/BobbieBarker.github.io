// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://bobbiebarker.github.io',
	integrations: [mdx(), sitemap()],
	redirects: {
		'/blog': '/',
		'/blog/[...slug]': '/writing/[...slug]',
	},
	markdown: {
		shikiConfig: {
			theme: 'github-dark',
			wrap: true,
		},
	},
});
