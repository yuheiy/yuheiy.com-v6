import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import type { Element } from 'hast';
import { toString } from 'hast-util-to-string';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import invariant from 'tiny-invariant';
import type { Pluggable } from 'unified';
import { EXIT, visit } from 'unist-util-visit';

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

const rehypeUnwrapCiteParagraphs: Pluggable = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (
        node.tagName !== 'p' ||
        index === undefined ||
        !parent ||
        parent.type !== 'mdxJsxFlowElement' ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parent as any).name !== 'cite'
      )
        return;

      parent.children.splice(index, 1, ...node.children);
      return index;
    });
  };
};

interface AstNode {
  type: string;
  tagName?: string;
  name?: string | null;
  value?: string;
  children?: AstNode[];
}

const rehypeWrapFigure: Pluggable = () => {
  const targetNames = new Set([
    'pre',
    'iframe',
    'blockquote',
    'img',
    'video',
    'DemoIframe',
    'SmartIframe',
    'Image',
    'Tweet',
    'YouTube',
    'BaselineStatus',
  ]);

  function isTarget(node: AstNode): boolean {
    const name =
      node.type === 'element' ? node.tagName : node.type === 'mdxJsxFlowElement' ? node.name : null;
    return name != null && targetNames.has(name);
  }

  function isFigcaption(node: AstNode): boolean {
    return node.type === 'mdxJsxFlowElement' && node.name === 'figcaption';
  }

  function isNonSemantic(node: AstNode): boolean {
    return (node.type === 'text' && node.value?.trim() === '') || node.type === 'mdxFlowExpression';
  }

  function findNextFigcaption(children: AstNode[], startIndex: number): number {
    for (let j = startIndex; j < children.length; j++) {
      if (isFigcaption(children[j])) return j;
      if (!isNonSemantic(children[j])) return -1;
    }
    return -1;
  }

  function processNode(node: AstNode): void {
    if (!node.children) return;
    if (node.type === 'element' && node.tagName === 'p') return;

    for (const child of node.children) {
      processNode(child);
    }

    const children = node.children;
    for (let i = 0; i < children.length; i++) {
      if (!isTarget(children[i])) continue;

      const figcaptionIndex = findNextFigcaption(children, i + 1);
      const removeCount = figcaptionIndex !== -1 ? figcaptionIndex - i + 1 : 1;
      const nodesToWrap = children.splice(i, removeCount);
      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: nodesToWrap as Element['children'],
      };
      children.splice(i, 0, figure);
    }
  }

  return (tree) => {
    processNode(tree as AstNode);
  };
};

const rehypeExtractDescription: Pluggable = () => {
  return (tree, { data }) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'p') return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.astro as any).frontmatter.description = toString(node);
      return EXIT;
    });
  };
};

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
  experimental: {
    preserveScriptOrder: true,
    headingIdCompat: true,
  },
});
