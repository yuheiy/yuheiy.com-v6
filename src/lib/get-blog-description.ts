import type { CollectionEntry } from 'astro:content';
import { invariant } from 'outvariant';

export async function getBlogDescription(entry: CollectionEntry<'blog'>) {
  const {
    remarkPluginFrontmatter: { description },
  } = await entry.render();

  invariant(
    typeof description === 'string' || typeof description === 'undefined',
    'Invariant failed',
  );

  return description;
}
