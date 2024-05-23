import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import invariant from 'tiny-invariant';
import { siteDescription, siteTitle } from '../consts';
import { getBlogDescription } from '../lib/get-blog-description';

export async function GET(context: APIContext) {
  invariant(context.site);

  const entries = await getCollection('blog');
  const items = await Promise.all(
    entries
      .toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map(async (entry) => {
        const description = await getBlogDescription(entry);
        return {
          link: `/${entry.slug}`,
          title: entry.data.title,
          pubDate: entry.data.pubDate,
          description,
        };
      }),
  );

  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site,
    items,
    trailingSlash: false,
  });
}
