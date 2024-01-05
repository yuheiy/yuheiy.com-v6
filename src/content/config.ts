import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      ogImage: image().optional(),
      twitterCard: z.union([z.literal('summary'), z.literal('summary_large_image')]).optional(),
    }),
});

export const collections = { blog };
