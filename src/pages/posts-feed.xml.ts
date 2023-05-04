import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { siteTitle, siteDescription } from "../consts.js";
import dayjs from "../lib/dayjs.js";

export async function get(context: APIContext) {
	const blogEntries = await getCollection("blog");
	blogEntries.sort(
		(a, b) => dayjs(b.data.publishDate).tz().valueOf() - dayjs(a.data.publishDate).tz().valueOf(),
	);
	return rss({
		title: siteTitle,
		description: siteDescription,
		site: context.site!.toString(),
		items: await Promise.all(
			blogEntries.map(async (entry) => {
				const { remarkPluginFrontmatter } = await entry.render();
				return {
					link: `/${entry.slug}`,
					title: entry.data.title,
					pubDate: dayjs(entry.data.publishDate).tz().toDate(),
					description: remarkPluginFrontmatter.description as string,
				};
			}),
		),
		trailingSlash: false,
	});
}
