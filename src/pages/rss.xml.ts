import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer } from 'astro/container';
import astroJSXRenderer from 'astro/jsx/renderer.js';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import invariant from 'tiny-invariant';
import { siteDescription, siteTitle } from '../consts';
import { getBlogDescription } from '../lib/get-blog-description';

export async function GET(context: APIContext) {
  invariant(context.site);

  const entries = await getCollection('blog');
  const container = await experimental_AstroContainer.create({
    renderers: [astroJSXRenderer],
  });
  const items = await Promise.all(
    entries
      .toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map(async (entry) => {
        const description = await getBlogDescription(entry);
        const { Content } = await entry.render();
        const content = await container.renderToString(Content);
        return {
          link: `/${entry.slug}`,
          title: entry.data.title,
          pubDate: entry.data.pubDate,
          description,
          content: sanitizeHtml(content, {
            allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
          }),
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