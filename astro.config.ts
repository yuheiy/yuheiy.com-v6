import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import rehypeExtractDescription from './src/utils/rehype-extract-description';
import {
  rehypeUnwrapCiteParagraphs,
  rehypeUnwrapFigcaptionParagraphs,
} from './src/utils/rehype-unwrap-paragraphs';
import rehypeWrapFigure from './src/utils/rehype-wrap-figure';
import remarkDemoCodeBlock from './src/utils/remark-demo-code-block';

// https://astro.build/config
export default defineConfig({
  site: 'https://yuheiy.com',
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
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
    processor: unified({
      remarkPlugins: [remarkDemoCodeBlock],
      rehypePlugins: [
        rehypeUnwrapFigcaptionParagraphs,
        rehypeUnwrapCiteParagraphs,
        rehypeUnwrapImages,
        rehypeWrapFigure,
        rehypeExtractDescription,
      ],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
    },
  },
});
