import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sizeOf from "image-size";
import { JSDOM } from "jsdom";
import { visit } from "unist-util-visit";

export default defineConfig({
	site: "https://yuheiy.com",
	markdown: {
		shikiConfig: {
			theme: "css-variables",
		},
		rehypePlugins: [processImage],
	},
	integrations: [
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
			const frag = JSDOM.fragment(node.value);
			const imgEls = Array.from(frag.querySelectorAll("img"));

			if (!imgEls.length) {
				return;
			}

			if (frag.childNodes.length > 1) {
				throw new Error("multiple nodes are not supported");
			}

			for (const imgEl of imgEls) {
				const dimensions = sizeOf(`public${imgEl.src}`);
				imgEl.setAttribute("width", dimensions.width);
				imgEl.setAttribute("height", dimensions.height);
				imgEl.setAttribute("decoding", "async");
			}

			node.value = frag.firstChild.outerHTML;
		});
	};
}
