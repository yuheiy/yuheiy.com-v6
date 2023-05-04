import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import dayjs from "../lib/dayjs.js";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export async function get(context: any) {
	const blogEntries = await getCollection("blog");
	blogEntries.sort(
		(a, b) => dayjs(b.data.publishDate).tz().valueOf() - dayjs(a.data.publishDate).tz().valueOf()
	);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,

		items: await Promise.all(
			blogEntries.map(async (entry) => {
				const { remarkPluginFrontmatter } = await entry.render();
				return {
					link: `/${entry.slug}`,
					title: entry.data.title,
					pubDate: dayjs(entry.data.publishDate).tz().toDate(),
					description: remarkPluginFrontmatter.description,
				};
			})
		),
		trailingSlash: false,
	});
}
