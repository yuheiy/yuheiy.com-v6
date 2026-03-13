import invariant from 'tiny-invariant';
import type { Pluggable } from 'unified';
import { visit } from 'unist-util-visit';

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

const remarkDemoCodeBlock: Pluggable = () => {
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

export default remarkDemoCodeBlock;
