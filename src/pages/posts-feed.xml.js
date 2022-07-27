import rss from "@astrojs/rss";

const postImportResult = import.meta.glob("./*.md", { eager: true });
const posts = Object.values(postImportResult);
posts.sort((a, b) => Date.parse(b.frontmatter.published) - Date.parse(a.frontmatter.published));

export const get = () =>
	rss({
		title: "Yuhei Yasudaの記事",
		description: "日記やウェブ開発について",
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			link: post.url,
			title: post.frontmatter.title,
			pubDate: post.frontmatter.published,
		})),
	});
