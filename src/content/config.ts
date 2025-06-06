import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      ogImage: image().optional(),
      twitterCard: z.union([z.literal('summary'), z.literal('summary_large_image')]).optional(),
    }),
});

const external = defineCollection({
  type: 'data',
  // Type-check frontmatter using a schema
  schema: () =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      link: z.string().url(),
      channel: z.string(),
      channelDetail: z.string().optional(),
      description: z.string().optional(),
    }),
});

export const collections = {
  blog,
  external,
};
