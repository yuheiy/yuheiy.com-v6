import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { Window } from "happy-dom";
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
	adapter: vercel(),
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
		const { document } = new Window();

		visit(tree, "raw", (node) => {
			document.body.innerHTML = node.value;
			const imgEls = Array.from(document.querySelectorAll("img"));

			if (!imgEls.length) {
				return;
			}

			for (const imgEl of imgEls) {
				const dimensions = sizeOf(`public${imgEl.src}`);
				imgEl.setAttribute("width", dimensions.width);
				imgEl.setAttribute("height", dimensions.height);
				imgEl.setAttribute("decoding", "async");
			}

			node.value = document.body.innerHTML;
		});
	};
}
