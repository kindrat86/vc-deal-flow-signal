import { posts } from "@/content/posts";
import { getDataLastModified } from "@/lib/data";
import { renderPostBodyHtml } from "@/lib/feed-content";
import { isMergeRedirectedUrl, mergeRedirectDestination } from "@/lib/sitemap-redirect-filter";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  // feed.xml is registered as a sitemap in GSC: list only final-200 URLs.
  // Posts whose URL 308s off-host via the signals-merge map are skipped; the
  // redirects themselves are unchanged (next.config.ts).
  const sortedPosts = [...posts]
    .filter((post) => !isMergeRedirectedUrl(`${BASE_URL}/blog/${post.slug}`))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const channelLink = mergeRedirectDestination(`${BASE_URL}/blog`) ?? `${BASE_URL}/blog`;

  const items = sortedPosts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <content:encoded><![CDATA[${renderPostBodyHtml(post)}]]></content:encoded>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>VC Deal Flow Signal: Blog</title>
    <link>${channelLink}</link>
    <description>Insights on using GitHub engineering signals for startup investing. Practical guides for VCs and angel investors.</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub"/>
    <atom:link href="https://pubsubhubbub.superfeedr.com/" rel="hub"/>
    <atom:link href="${BASE_URL}/atom.xml" rel="alternate" type="application/atom+xml"/>
    <atom:link href="${BASE_URL}/feed.json" rel="alternate" type="application/json"/>
    <lastBuildDate>${getDataLastModified().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
