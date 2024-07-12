import type { CollectionEntry } from "astro:content";

export function getBlogUrl(entry: CollectionEntry<'blog'>) {
  return `/${entry.slug}`
}
