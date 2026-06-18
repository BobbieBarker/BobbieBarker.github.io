import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
	loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		excerpt: z.string(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		authors: z.array(z.string()).optional(),
		updatedDate: z.coerce.date().optional(),
		readingTime: z.string().optional(),
		series: z.string().optional(),
		seriesOrder: z.number().int().positive().optional(),
		originalPublication: z
			.object({
				site: z.string(),
				url: z.string().url(),
				date: z.coerce.date(),
				authors: z.array(z.string()).default([]),
			})
			.optional(),
	}),
});

export const collections = { writing };
