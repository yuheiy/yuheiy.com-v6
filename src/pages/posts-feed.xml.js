import rss from "@astrojs/rss";
import dayjs from "../lib/dayjs";

const postImportResult = import.meta.glob("./*.md", { eager: true });
const posts = Object.values(postImportResult);
posts.sort(
	(a, b) => dayjs(b.frontmatter.published).valueOf() - dayjs(a.frontmatter.published).valueOf()
);

export const get = () =>
	rss({
		title: "Yuhei Yasudaの記事",
		description: "日記やウェブ開発について",
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			link: post.url,
			title: post.frontmatter.title,
			pubDate: dayjs(post.frontmatter.published).toDate(),
		})),
	});
