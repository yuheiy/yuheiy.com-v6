import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import type { Element } from 'hast';
import { toString } from 'mdast-util-to-string';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import invariant from 'tiny-invariant';
import type { Pluggable } from 'unified';
import { select, type Node } from 'unist-util-select';
import { visit } from 'unist-util-visit';

const remarkDemoCodeBlock: Pluggable = () => {
  function parseMeta(meta: string): Record<string, string> {
    const result: Record<string, string> = {};
    for (const match of meta.matchAll(/(\w+)(?:="([^"]*)")?/g)) {
      result[match[1]] = match[2] ?? '';
    }
    return result;
  }

  function createExpressionAttribute(value: string) {
    const raw = JSON.stringify(value);
    return {
      type: 'mdxJsxAttributeValueExpression',
      value: raw,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value, raw },
            },
          ],
        },
      },
    };
  }

  function createImportNode(name: string, source: string) {
    return {
      type: 'mdxjsEsm',
      value: `import ${name} from '${source}'`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ImportDeclaration',
              specifiers: [
                {
                  type: 'ImportDefaultSpecifier',
                  local: { type: 'Identifier', name },
                },
              ],
              source: {
                type: 'Literal',
                value: source,
                raw: `'${source}'`,
              },
            },
          ],
        },
      },
    };
  }

  return (tree) => {
    let hasDemoBlock = false;

    visit(tree, 'code', (node, index, parent) => {
      if (index === undefined || !parent) return;
      if (!node.meta) return;

      const { demo, ...attributes } = parseMeta(node.meta);
      if (demo === undefined) return;

      invariant(
        typeof attributes.title === 'string',
        'Demo code block requires a title attribute (e.g. ```html demo title="...")',
      );

      hasDemoBlock = true;

      parent.children[index] = {
        type: 'mdxJsxFlowElement',
        name: 'DemoIframe',
        attributes: [
          ...Object.entries(attributes).map(([name, value]) => ({
            type: 'mdxJsxAttribute',
            name,
            value,
          })),
          {
            type: 'mdxJsxAttribute',
            name: 'set:html',
            value: createExpressionAttribute(node.value),
          },
        ],
        children: [],
      };
    });

    if (hasDemoBlock) {
      tree.children.unshift(createImportNode('DemoIframe', '#components/DemoIframe.astro'));
    }
  };
};

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
      remarkPlugins: [remarkDemoCodeBlock, remarkInjectDescription],
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
