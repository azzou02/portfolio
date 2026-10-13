import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One markdown file per case study. The work page is generated from this
// frontmatter, so adding a project means adding a file here.
const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // case-study page heading
      cardTitle: z.string(), // title shown on the work card
      cardTags: z.array(z.string()), // joined with " - " on the card
      year: z.string(),
      order: z.number(),
      cover: image(),
      coverPosition: z.string().default('50% 50%'),
    }),
});

export const collections = { work };
