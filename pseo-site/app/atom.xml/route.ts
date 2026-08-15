/**
 * /atom.xml, Atom 1.0 feed (companion to /rss.xml + /feed.xml + /feed.json).
 *
 * Pass VII (2026-05-05). Some feed readers (Feedly, Reeder, NetNewsWire)
 * resolve /atom.xml before /rss.xml when both are advertised, and many
 * AI agents probing for newsroom freshness default to the Atom path.
 * Format follows RFC 4287; entries mirror the blog corpus.
 */

import { posts } from "@/content/posts";
import { getDataLastModified } from "@/lib/data";
import { renderPostBodyHtml } from "@/lib/feed-content";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const revalidate = 3600;

const SITE = "https://signals.gitdealflow.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const updated = getDataLastModified().toISOString();

  const entries = sorted
    .map((p) => {
      const url = `${SITE}/blog/${p.slug}`;
      const isoDate = new Date(p.date).toISOString();
      return `  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${url}" rel="alternate" type="text/html"/>
    <id>${url}</id>
    <updated>${isoDate}</updated>
    <published>${isoDate}</published>
    <summary>${escapeXml(p.description)}</summary>
    <content type="html">${escapeXml(renderPostBodyHtml(p))}</content>
    <author><name>VC Deal Flow Signal</name></author>
  </entry>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>VC Deal Flow Signal: Blog</title>
  <subtitle>Engineering acceleration signals for startup investors.</subtitle>
  <link href="${SITE}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE}/blog" rel="alternate" type="text/html"/>
  <link href="https://pubsubhubbub.appspot.com/" rel="hub"/>
  <link href="https://pubsubhubbub.superfeedr.com/" rel="hub"/>
  <id>${SITE}/atom.xml</id>
  <updated>${updated}</updated>
  <rights>CC BY 4.0, VC Deal Flow Signal</rights>
  <generator uri="${SITE}">VC Deal Flow Signal</generator>
${entries}
</feed>`;

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      Link: `<${SITE}/atom.xml>; rel="self", <${SITE}/feed.xml>; rel="alternate"`,
    },
  });
}
