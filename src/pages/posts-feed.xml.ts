import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import dayjs from '../lib/dayjs';

export async function GET(context: APIContext) {
  const blogEntries = (await getCollection('blog')).toSorted(
    (a, b) => dayjs(b.data.publishDate).tz().valueOf() - dayjs(a.data.publishDate).tz().valueOf(),
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!.toString(),
    items: await Promise.all(
      blogEntries.map(async (entry) => {
        const { remarkPluginFrontmatter } = await entry.render();
        return {
          link: `/${entry.slug}`,
          title: entry.data.title,
          pubDate: dayjs(entry.data.publishDate).tz().toDate(),
          description: remarkPluginFrontmatter.description,
        };
      }),
    ),
    trailingSlash: false,
  });
}
