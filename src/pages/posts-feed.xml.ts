import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import dayjs from "../lib/dayjs.js";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export async function get(context: any) {
  const allBlogEntries = await getCollection("blog");
  allBlogEntries.sort(
    (a, b) => dayjs(b.data.publishDate).tz().valueOf() - dayjs(a.data.publishDate).tz().valueOf()
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: allBlogEntries.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.publishDate as any,
      description: (entry.data as any).description,
      link: new URL(`/${entry.slug}`, import.meta.env.SITE).toString(),
    })),
  });
}
