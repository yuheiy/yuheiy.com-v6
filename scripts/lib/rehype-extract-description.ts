import type { Element } from 'hast';
import { toString } from 'hast-util-to-string';
import type { Pluggable } from 'unified';
import { EXIT, visit } from 'unist-util-visit';

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

export default rehypeExtractDescription;
