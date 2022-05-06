import rss from "@astrojs/rss";

const postImportResult = import.meta.globEager("./*.md");
let posts = Object.values(postImportResult);
posts = posts.sort(
	(a, b) => Date.parse(b.frontmatter.published) - Date.parse(a.frontmatter.published)
);

export const get = () =>
	rss({
		title: "記事: Yuhei Yasuda",
		description: "日記や技術情報など",
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			link: post.url,
			title: post.frontmatter.title,
			pubDate: post.frontmatter.published,
		})),
	});
