import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { toString } from "mdast-util-to-string";
import { select } from "unist-util-select";

export default defineConfig({
	site: "https://yuheiy.com",
	trailingSlash: "never",
	markdown: {
		shikiConfig: {
			theme: "css-variables",
		},
		remarkPlugins: [remarkInjectDescription],
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

function remarkInjectDescription() {
	return (tree, { data }) => {
		const firstParagraph = select("paragraph", tree);
		data.astro.frontmatter.description = toString(firstParagraph);
	};
}
