import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import dayjs from "../lib/dayjs";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export async function get(context) {
  const allBlogEntries = (await getCollection("blog")).sort(
    (a, b) => dayjs(b.data.publishDate).tz().valueOf() - dayjs(a.data.publishDate).tz().valueOf()
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: allBlogEntries.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.publishDate,
      description: entry.data.description,
      link: new URL(`/${entry.slug}`, import.meta.env.SITE).toString(),
    })),
  });
}
