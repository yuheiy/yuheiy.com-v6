import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { toString } from 'mdast-util-to-string';
import type { Pluggable } from 'unified';
import { select } from 'unist-util-select';
import { visit } from 'unist-util-visit';

const remarkInjectDescription = (() => {
  return (tree, { data }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(data.astro as any).frontmatter.description) {
      const firstParagraph = select('paragraph', tree);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.astro as any).frontmatter.description = toString(firstParagraph);
    }
  };
}) satisfies Pluggable;

const rehypeImageAttributesOverride = (() => {
  return (tree) => {
    visit(
      tree,
      {
        type: 'mdxJsxFlowElement',
        name: 'Image',
      },
      (node) => {
        const isLoadingAttributeSet = node.attributes.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (attribute: any) => attribute.name === 'loading',
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
}) satisfies Pluggable;

// https://astro.build/config
export default defineConfig({
  site: 'https://yuheiy.com',
  compressHTML: false,
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
    tailwind(),
  ],
});
