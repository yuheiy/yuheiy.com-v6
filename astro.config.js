import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
	site: "https://yuheiy.com",
	trailingSlash: "never",
	markdown: {
		shikiConfig: {
			theme: "css-variables",
		},
	},
	integrations: [
		image(),
		prefetch(),
		sitemap(),
		tailwind({
			config: {
				applyBaseStyles: false,
			},
		}),
	],
});
