/**
 * /press/rss.xml — dedicated RSS 2.0 feed for press releases.
 *
 * Companion to /press/atom.xml. RSS 2.0 because some legacy newsroom
 * crawlers (PR Newswire, Crunchbase News, Pitchbook ingestion) probe
 * /press/rss.xml first when discovering press surfaces. Atom is the
 * companion spec at /press/atom.xml.
 *
 * The feed mirrors PRESS_RELEASES from content/press-releases.ts.
 * Each item emits:
 *   - <title> = release headline
 *   - <link> = canonical /press/<slug> URL
 *   - <description> = subhead + first body paragraph (HTML-stripped)
 *   - <pubDate> = RFC 822 from release date
 *   - <guid isPermaLink="true"> = canonical URL
 *   - <category> = each wire category as a separate node
 *   - <dc:creator> = "The Data Nerd, founder of VC Deal Flow Signal"
 *
 * Cache: 1 hour. Press releases are not high-frequency content; an hour
 * is plenty fresh for newsroom polling.
 */

import { PRESS_RELEASES } from "@/content/press-releases";

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

function rfc822(d: string): string {
  // d is YYYY-MM-DD; anchor to 09:00 UTC to mirror news-sitemap convention.
  return new Date(`${d}T09:00:00Z`).toUTCString();
}

export async function GET() {
  const sorted = [...PRESS_RELEASES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const lastBuild = sorted.length
    ? rfc822(sorted[0].date)
    : new Date().toUTCString();

  const items = sorted
    .map((r) => {
      const url = `${SITE}/press/${r.slug}`;
      const description = `${r.subhead} ${r.body[0] ?? ""}`.trim();
      const cats = r.wireCategories
        .map((c) => `    <category>${escapeXml(c)}</category>`)
        .join("\n");
      return `  <item>
    <title>${escapeXml(r.headline)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${escapeXml(description)}</description>
    <pubDate>${rfc822(r.date)}</pubDate>
    <dc:creator>The Data Nerd, founder of VC Deal Flow Signal</dc:creator>
    <source url="${SITE}/press/rss.xml">VC Deal Flow Signal Press Releases</source>
${cats}
  </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VC Deal Flow Signal — Press Releases</title>
    <link>${SITE}/press</link>
    <atom:link href="${SITE}/press/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Wire-ready press releases from VC Deal Flow Signal (GitDealFlow). Engineering acceleration signals for venture capital. CC BY 4.0.</description>
    <language>en-US</language>
    <copyright>CC BY 4.0 — VC Deal Flow Signal</copyright>
    <managingEditor>signal@gitdealflow.com (The Data Nerd)</managingEditor>
    <webMaster>signal@gitdealflow.com (The Data Nerd)</webMaster>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <pubDate>${lastBuild}</pubDate>
    <generator>VC Deal Flow Signal press distribution</generator>
    <ttl>60</ttl>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      Link: `<${SITE}/press/rss.xml>; rel="self", <${SITE}/press/atom.xml>; rel="alternate"`,
    },
  });
}
