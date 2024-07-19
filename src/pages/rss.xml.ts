import { getContainerRenderer } from '@astrojs/mdx';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import invariant from 'tiny-invariant';
import { siteDescription, siteTitle } from '../consts';
import { getBlogDescription } from '../lib/get-blog-description';
import { getBlogUrl } from '../lib/get-blog-url';

export async function GET(context: APIContext) {
  invariant(context.site);

  const container = await AstroContainer.create({
    renderers: await loadRenderers([getContainerRenderer()]),
  });

  const items = await Promise.all(
    [...(await getCollection('blog')), ...(await getCollection('external-post'))]
      .toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map(async (entry) => {
        switch (entry.collection) {
          case 'blog':
            return {
              link: getBlogUrl(entry),
              title: entry.data.title,
              pubDate: entry.data.pubDate,
              description: await getBlogDescription(entry),
              content: await (async () => {
                const { Content } = await entry.render();
                const content = await container.renderToString(Content);
                return sanitizeHtml(content, {
                  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
                });
              })(),
            };

          case 'external-post':
            return {
              link: entry.data.link,
              title: entry.data.title,
              pubDate: entry.data.pubDate,
            };

          default:
            throw new TypeError(entry satisfies never);
        }
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
