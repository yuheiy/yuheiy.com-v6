import type { RehypePlugin } from '@astrojs/markdown-remark';
import type { Element } from 'hast';
import { visit } from 'unist-util-visit';

function createRehypeUnwrapParagraphs(containerName: string): RehypePlugin {
  return () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (tree: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      visit(tree, 'element', (node: Element, index: number | undefined, parent: any) => {
        if (
          node.tagName !== 'p' ||
          index === undefined ||
          !parent ||
          parent.type !== 'mdxJsxFlowElement' ||
          parent.name !== containerName
        )
          return;

        parent.children.splice(index, 1, ...node.children);
        return index;
      });
    };
  };
}

export const rehypeUnwrapFigcaptionParagraphs = createRehypeUnwrapParagraphs('figcaption');
export const rehypeUnwrapCiteParagraphs = createRehypeUnwrapParagraphs('cite');
