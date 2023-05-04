import { z, defineCollection } from "astro:content";

export const collections = {
	blog: defineCollection({
		schema: z.object({
			title: z.string(),
			publishDate: z.string(),
			// eslint-disable-next-line @typescript-eslint/naming-convention
			ogImageURL: z.string().optional(),
			twitterCard: z.string().optional(),
		}),
	}),
};
