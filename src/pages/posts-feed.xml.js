import rss from "@astrojs/rss";
import dayjs from "../lib/dayjs";

const postImportResult = import.meta.glob("./*.mdx", { eager: true });
const posts = Object.values(postImportResult);
posts.sort(
	(a, b) =>
		dayjs(b.frontmatter.publishDate).tz().valueOf() -
		dayjs(a.frontmatter.publishDate).tz().valueOf()
);

export const get = () =>
	rss({
		title: "Yuhei Yasudaの記事",
		description: "日記やウェブ開発について",
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			link: new URL(post.url, import.meta.env.SITE),
			title: post.frontmatter.title,
			pubDate: dayjs(post.frontmatter.publishDate).tz().toDate(),
		})),
	});
