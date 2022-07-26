import { defineConfig } from "astro/config";
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
		sitemap(),
		tailwind({
			config: {
				applyBaseStyles: false,
			},
		}),
	],
});
