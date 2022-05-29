import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import sizeOf from "image-size";
import { visit } from "unist-util-visit";

export default defineConfig({
	site: "https://yuheiy.com",
	trailingSlash: "never",
	markdown: {
		shikiConfig: {
			theme: "css-variables",
		},
		rehypePlugins: [processImage],
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

function processImage() {
	return (tree) => {
		visit(tree, "mdxJsxFlowElement", ({ name, attributes }) => {
			if (name !== "img") return;

			const src = attributes.find(({ name }) => name === "src")?.value;
			if (!src) return;

			const { width, height } = sizeOf(`public${src}`);

			attributes.push(
				{
					type: "mdxJsxAttribute",
					name: "width",
					value: width,
				},
				{
					type: "mdxJsxAttribute",
					name: "height",
					value: height,
				},
				{
					type: "mdxJsxAttribute",
					name: "decoding",
					value: "async",
				}
			);
		});
	};
}
