import rss from "@astrojs/rss";

const postImportResult = import.meta.globEager("./*.md");
const posts = Object.values(postImportResult);
posts.sort((a, b) => Date.parse(b.frontmatter.published) - Date.parse(a.frontmatter.published));

export const get = () =>
	rss({
		title: "Yuhei Yasudaの記事",
		description: "日記や技術情報など",
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			link: post.url,
			title: post.frontmatter.title,
			pubDate: post.frontmatter.published,
		})),
	});
