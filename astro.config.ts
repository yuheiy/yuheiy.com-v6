import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { toString } from 'mdast-util-to-string';
import type { Pluggable } from 'unified';
import { select } from 'unist-util-select';

const remarkInjectDescription: Pluggable = () => {
  return (tree, { data }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(data.astro as any).frontmatter.description) {
      const firstParagraph = select('paragraph', tree);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.astro as any).frontmatter.description = toString(firstParagraph);
    }
  };
};

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
    }),
    sitemap(),
    tailwind(),
  ],
});
