import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import sizeOf from "image-size";
import { JSDOM } from "jsdom";
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
		visit(tree, "raw", (node) => {
			const frag = JSDOM.fragment(`<div>${node.value}</div>`);
			const imgEls = Array.from(frag.querySelectorAll("img"));

			if (!imgEls.length) {
				return;
			}

			for (const imgEl of imgEls) {
				const { width, height } = sizeOf(`public${imgEl.src}`);

				if (!imgEl.hasAttribute("width")) {
					imgEl.setAttribute("width", width);
				}

				if (!imgEl.hasAttribute("height")) {
					imgEl.setAttribute("height", height);
				}

				if (!imgEl.hasAttribute("decoding")) {
					imgEl.setAttribute("decoding", "async");
				}
			}

			node.value = frag.firstChild.innerHTML;
		});
	};
}
