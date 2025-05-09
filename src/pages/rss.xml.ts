import { getContainerRenderer } from '@astrojs/mdx';
import rss, { type RSSFeedItem } from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import invariant from 'tiny-invariant';
import { siteTitle } from '../consts';
import { getBlogDescription } from '../lib/blog';
import { blogPath } from '../paths';

export async function GET(context: APIContext) {
  invariant(context.site);

  const container = await AstroContainer.create({
    renderers: await loadRenderers([getContainerRenderer()]),
  });

  const items: RSSFeedItem[] = (
    await Promise.all([
      ...(await getCollection('blog')).map(async (entry) => ({
        link: blogPath(entry),
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
      })),
      ...(await getCollection('contributions')).map((entry) => ({
        link: entry.data.link,
        title: entry.data.title,
        pubDate: entry.data.pubDate,
      })),
    ])
  ).toSorted((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: siteTitle,
    description:
      'ウェブデザインやフロントエンドなどについての雑記、外部サイトに寄稿した記事、登壇したイベントやその資料、出版物など。',
    site: context.site,
    items,
    trailingSlash: false,
  });
}
