import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
// eslint-disable-next-line n/file-extension-in-import
import { defineConfig } from 'astro/config';
import { toString } from 'mdast-util-to-string';
import { select } from 'unist-util-select';
import { visit } from 'unist-util-visit';

export default defineConfig({
	experimental: {
		assets: true,
	},
	site: 'https://yuheiy.com/',
	trailingSlash: 'never',
	build: {
		format: 'file',
	},
	markdown: {
		shikiConfig: {
			theme: 'css-variables',
		},
	},
	integrations: [
		mdx({
			remarkPlugins: [remarkInjectDescription],
			rehypePlugins: [rehypeImageAttributesOverride],
		}),
		sitemap(),
		tailwind({
			applyBaseStyles: false,
		}),
	],
});

function remarkInjectDescription() {
	return (tree, { data }) => {
		if (!data.astro.frontmatter.description) {
			const firstParagraph = select('paragraph', tree);
			data.astro.frontmatter.description = toString(firstParagraph);
		}
	};
}

function rehypeImageAttributesOverride() {
	return (tree) => {
		visit(
			tree,
			{
				type: 'mdxJsxFlowElement',
				name: 'Image',
			},
			(node) => {
				const isLoadingAttributeSet = node.attributes.some(
					({ name }) => name === 'loading',
				);

				if (!isLoadingAttributeSet) {
					node.attributes.push({
						type: 'mdxJsxAttribute',
						name: 'loading',
						value: 'eager',
					});
				}
			},
		);
	};
}
