import type { CollectionEntry } from 'astro:content';
import { render } from 'astro:content';
import invariant from 'tiny-invariant';

export async function getBlogDescription(entry: CollectionEntry<'blog'>) {
  const {
    remarkPluginFrontmatter: { description },
  } = await render(entry);

  invariant(typeof description === 'string' || typeof description === 'undefined');

  return description;
}
