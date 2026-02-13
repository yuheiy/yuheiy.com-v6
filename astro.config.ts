import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import type { Element } from 'hast';
import { toString } from 'mdast-util-to-string';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import type { Pluggable } from 'unified';
import { select, type Node } from 'unist-util-select';
import { visit } from 'unist-util-visit';

const remarkInjectDescription: Pluggable = () => {
  return (tree, { data }) => {
    const firstParagraph = select('paragraph', tree as Node);
    if (firstParagraph) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.astro as any).frontmatter.description = toString(firstParagraph);
    }
  };
};

const rehypeUnwrapFigcaptionParagraphs: Pluggable = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (
        node.tagName !== 'p' ||
        index === undefined ||
        !parent ||
        parent.type !== 'mdxJsxFlowElement' ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parent as any).name !== 'figcaption'
      )
        return;

      parent.children.splice(index, 1, ...node.children);
      return index;
    });
  };
};

// https://astro.build/config
export default defineConfig({
  site: 'https://yuheiy.com',
  trailingSlash: 'never',
  integrations: [
    mdx({
      remarkPlugins: [remarkInjectDescription],
      rehypePlugins: [rehypeUnwrapImages, rehypeUnwrapFigcaptionParagraphs],
    }),
    sitemap(),
  ],
  compressHTML: false,
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: 'preserve',
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
    },
  },
  experimental: {
    preserveScriptOrder: true,
    headingIdCompat: true,
  },
});
