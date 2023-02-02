import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { toString } from "mdast-util-to-string";
import { select } from "unist-util-select";
import { visit } from "unist-util-visit";

export default defineConfig({
  site: "https://yuheiy.com/",
  trailingSlash: "never",
  build: {
    format: "file",
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
  integrations: [
    image(),
    mdx({
      remarkPlugins: [remarkInjectDescription],
      rehypePlugins: [rehypeImageAttributesOverride],
    }),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
  ],
});

function remarkInjectDescription() {
  return (tree, { data }) => {
    const firstParagraph = select("paragraph", tree);
    data.astro.frontmatter.description = toString(firstParagraph);
  };
}

function rehypeImageAttributesOverride() {
  return (tree) => {
    visit(
      tree,
      {
        type: "mdxJsxFlowElement",
        name: "Image",
      },
      (node) => {
        const isLoadingAttributeSet = Boolean(
          node.attributes.find(({ name }) => name === "loading")
        );

        if (!isLoadingAttributeSet) {
          node.attributes.push({
            type: "mdxJsxAttribute",
            name: "loading",
            value: "eager",
          });
        }
      }
    );
  };
}
