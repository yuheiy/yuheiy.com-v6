import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import invariant from 'tiny-invariant';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getBlogDescription } from '../lib/get-blog-description';

export async function GET(context: APIContext) {
  const blogEntries = (await getCollection('blog'))
    .toSorted((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf())
    .toReversed();

  invariant(context.site);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: await Promise.all(
      blogEntries.map(async (entry) => {
        const description = await getBlogDescription(entry);
        return {
          link: `/${entry.slug}`,
          title: entry.data.title,
          pubDate: entry.data.pubDate,
          description,
        };
      }),
    ),
    trailingSlash: false,
  });
}
