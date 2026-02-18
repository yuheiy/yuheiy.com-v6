import type { Element } from 'hast';
import type { Pluggable } from 'unified';

interface AstNode {
  type: string;
  tagName?: string;
  name?: string | null;
  value?: string;
  children?: AstNode[];
}

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

const rehypeWrapFigure: Pluggable = () => {
  return (tree) => {
    processNode(tree as AstNode);
  };
};

export default rehypeWrapFigure;
