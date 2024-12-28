import type { CollectionEntry } from 'astro:content';

export function blogPath(entry: CollectionEntry<'blog'>) {
  return `/${entry.slug}`;
}
