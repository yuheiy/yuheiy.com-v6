import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import rehypeExtractDescription from './scripts/lib/rehype-extract-description';
import {
  rehypeUnwrapCiteParagraphs,
  rehypeUnwrapFigcaptionParagraphs,
} from './scripts/lib/rehype-unwrap-paragraphs';
import rehypeWrapFigure from './scripts/lib/rehype-wrap-figure';
import remarkDemoCodeBlock from './scripts/lib/remark-demo-code-block';

// https://astro.build/config
export default defineConfig({
  site: 'https://yuheiy.com',
  trailingSlash: 'never',
  integrations: [
    mdx({
      remarkPlugins: [remarkDemoCodeBlock],
      rehypePlugins: [
        rehypeUnwrapFigcaptionParagraphs,
        rehypeUnwrapCiteParagraphs,
        rehypeUnwrapImages,
        rehypeWrapFigure,
        rehypeExtractDescription,
      ],
    }),
    sitemap(),
  ],
  compressHTML: false,
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: false,
      cssMinify: false,
    },
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
});
