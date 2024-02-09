import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { invariant } from 'outvariant';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context: APIContext) {
  const blogEntries = (await getCollection('blog'))
    .toSorted((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf())
    .toReversed();

  invariant(context.site, 'Invariant failed');

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: await Promise.all(
      blogEntries.map(async (entry) => {
        const { remarkPluginFrontmatter } = await entry.render();

        invariant(
          typeof remarkPluginFrontmatter.description === 'string' ||
            typeof remarkPluginFrontmatter.description === 'undefined',
          'Invariant failed',
        );

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
