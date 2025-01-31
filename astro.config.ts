import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { toString } from 'mdast-util-to-string';
import type { Pluggable } from 'unified';
import { select, type Node } from 'unist-util-select';

const remarkInjectDescription: Pluggable = () => {
  return (tree, { data }) => {
    const firstParagraph = select('paragraph', tree as Node);
    if (firstParagraph) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.astro as any).frontmatter.description = toString(firstParagraph);
    }
  };
};

// https://astro.build/config
export default defineConfig({
  site: 'https://yuheiy.com',
  trailingSlash: 'never',
  integrations: [mdx({ remarkPlugins: [remarkInjectDescription] }), sitemap()],
  compressHTML: false,
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: 'preserve',
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
    },
  },
});
