import type { CollectionEntry } from 'astro:content';
import invariant from 'tiny-invariant';

export function getBlogUrl(entry: CollectionEntry<'blog'>) {
  return `/${entry.slug}`;
}

export async function getBlogDescription(entry: CollectionEntry<'blog'>) {
  const {
    remarkPluginFrontmatter: { description },
  } = await entry.render();

  invariant(typeof description === 'string' || typeof description === 'undefined');

  return description;
}
