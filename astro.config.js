import path from "node:path";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { Window } from "happy-dom";
import sizeOf from "image-size";
import { toString } from "mdast-util-to-string";
import { select } from "unist-util-select";
import { visit } from "unist-util-visit";

export default defineConfig({
	site: "https://yuheiy.com",
	trailingSlash: "never",
	markdown: {
		shikiConfig: {
			theme: "css-variables",
		},
		remarkPlugins: [remarkInjectDescription],
		rehypePlugins: [rehypeAutoImageAttributes],
	},
	integrations: [
		mdx(),
		prefetch({
			selector: "a:any-link:not([type='application/rss+xml'])",
		}),
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

function rehypeAutoImageAttributes() {
	const { document } = new Window();

	return (tree) => {
		visit(tree, "raw", (node) => {
			document.body.innerHTML = node.value;

			for (const imgEl of Array.from(document.querySelectorAll("img"))) {
				if (!(imgEl.hasAttribute("width") && imgEl.hasAttribute("height"))) {
					const { width, height } = sizeOf(path.join("public", imgEl.src));
					imgEl.width = width;
					imgEl.height = height;
				}

				if (!imgEl.hasAttribute("decoding")) {
					imgEl.setAttribute("decoding", "async");
				}
			}

			node.value = document.body.innerHTML;
		});
	};
}
