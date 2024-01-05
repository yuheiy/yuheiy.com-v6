import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context: APIContext) {
  const blogEntries = (await getCollection('blog')).toSorted(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
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
          pubDate: entry.data.pubDate,
          description: remarkPluginFrontmatter.description,
        };
      }),
    ),
    trailingSlash: false,
  });
}
