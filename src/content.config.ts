import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      legacyUrl: z.boolean().optional(),
      title: z.string(),
      pubDate: z.date(),
      ogImage: image().optional(),
      twitterCard: z.union([z.literal('summary'), z.literal('summary_large_image')]).optional(),
    }),
});

const linksElsewhere = defineCollection({
  loader: glob({ base: './src/content/links-elsewhere', pattern: '**/*.yml' }),
  schema: () =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      link: z.url(),
      channel: z.string(),
      channelDetail: z.string().optional(),
      description: z.string().optional(),
    }),
});

export const collections = {
  blog,
  'links-elsewhere': linksElsewhere,
};
