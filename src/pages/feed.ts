import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import invariant from 'tiny-invariant';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getBlogDescription } from '../lib/get-blog-description';

export async function GET(context: APIContext) {
  invariant(context.site);

  const items = await getCollection('blog')
    .then((entries) =>
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
    )
    .then((promises) => Promise.all(promises));

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
    trailingSlash: false,
  });
}
