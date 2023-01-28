import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		publishDate: z.string(),
		ogImageURL: z.string().optional(),
		twitterCard: z.string().optional(),
	}),
});

export const collections = {
	blog: blogCollection,
};
