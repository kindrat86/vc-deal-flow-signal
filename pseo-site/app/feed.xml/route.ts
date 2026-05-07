import { posts } from "@/content/posts";
import { getDataLastModified } from "@/lib/data";
import {
  isNotModified,
  makeETag,
  notModifiedResponse,
  withConditionalHeaders,
} from "@/lib/http-conditional";

// Dynamic at the function level so we can negotiate If-Modified-Since /
// If-None-Match and short-circuit with 304s. CDN caching is preserved via
// Cache-Control. The /rss.xml alias forwards the upstream status verbatim,
// including 304 Not Modified.
export const runtime = "nodejs";

const BASE_URL = "https://signals.gitdealflow.com";
const CACHE_CONTROL =
  "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";

export async function GET(request: Request) {
  const lastModified = getDataLastModified();
  const etag = makeETag("feed-rss", posts.length, lastModified.getTime());

  if (isNotModified(request, lastModified, etag)) {
    return notModifiedResponse(lastModified, etag, CACHE_CONTROL);
  }

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const items = sortedPosts
    .map(
      (post) =>
        "    <item>\n" +
        "      <title><![CDATA[" + post.title + "]]></title>\n" +
        "      <link>" + BASE_URL + "/blog/" + post.slug + "</link>\n" +
        "      <guid isPermaLink=\"true\">" + BASE_URL + "/blog/" + post.slug + "</guid>\n" +
        "      <description><![CDATA[" + post.description + "]]></description>\n" +
        "      <pubDate>" + new Date(post.date).toUTCString() + "</pubDate>\n" +
        "    </item>",
    )
    .join("\n");

  const feed =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    "  <channel>\n" +
    "    <title>VC Deal Flow Signal — Blog</title>\n" +
    "    <link>" + BASE_URL + "/blog</link>\n" +
    "    <description>Insights on using GitHub engineering signals for startup investing. Practical guides for VCs and angel investors.</description>\n" +
    "    <language>en</language>\n" +
    "    <atom:link href=\"" + BASE_URL + "/feed.xml\" rel=\"self\" type=\"application/rss+xml\"/>\n" +
    "    <lastBuildDate>" + lastModified.toUTCString() + "</lastBuildDate>\n" +
    items +
    "\n  </channel>\n" +
    "</rss>";

  return withConditionalHeaders(feed, {
    contentType: "application/xml; charset=utf-8",
    lastModified,
    etag,
    cacheControl: CACHE_CONTROL,
  });
}
