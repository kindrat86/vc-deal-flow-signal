import { posts } from "@/content/posts";

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const items = sortedPosts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <content:encoded><![CDATA[${post.body.split("\n\n").map((p) => `<p>${p.trim()}</p>`).join("\n")}]]></content:encoded>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>VC Deal Flow Signal — Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Insights on using GitHub engineering signals for startup investing. Practical guides for VCs and angel investors.</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
