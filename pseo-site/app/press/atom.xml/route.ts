/**
 * /press/atom.xml, dedicated Atom 1.0 feed for press releases.
 *
 * Companion to /press/rss.xml. Atom 1.0 (RFC 4287) because Feedly,
 * Reeder, NetNewsWire, and most modern AI/agent feed pipelines resolve
 * Atom before RSS when both are advertised.
 *
 * Cache: 1 hour.
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

function isoFromDate(d: string): string {
  return new Date(`${d}T09:00:00Z`).toISOString();
}

export async function GET() {
  const sorted = [...PRESS_RELEASES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const updated = sorted.length
    ? isoFromDate(sorted[0].date)
    : new Date().toISOString();

  const entries = sorted
    .map((r) => {
      const url = `${SITE}/press/${r.slug}`;
      const iso = isoFromDate(r.date);
      const summary = r.subhead;
      const content = [r.lead, ...r.body, r.quote].join("\n\n");
      const categories = r.wireCategories
        .map(
          (c) =>
            `    <category term="${escapeXml(c)}" label="${escapeXml(c)}"/>`,
        )
        .join("\n");
      return `  <entry>
    <title>${escapeXml(r.headline)}</title>
    <link href="${url}" rel="alternate" type="text/html"/>
    <id>${url}</id>
    <updated>${iso}</updated>
    <published>${iso}</published>
    <summary type="text">${escapeXml(summary)}</summary>
    <content type="text">${escapeXml(content)}</content>
    <author>
      <name>The Data Nerd</name>
      <uri>${SITE}/about</uri>
    </author>
    <rights>CC BY 4.0, VC Deal Flow Signal</rights>
${categories}
  </entry>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>VC Deal Flow Signal: Press Releases</title>
  <subtitle>Wire-ready press releases. Engineering acceleration signals for venture capital. CC BY 4.0.</subtitle>
  <link href="${SITE}/press/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE}/press" rel="alternate" type="text/html"/>
  <id>${SITE}/press/atom.xml</id>
  <updated>${updated}</updated>
  <rights>CC BY 4.0, VC Deal Flow Signal</rights>
  <generator uri="${SITE}">VC Deal Flow Signal press distribution</generator>
${entries}
</feed>`;

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      Link: `<${SITE}/press/atom.xml>; rel="self", <${SITE}/press/rss.xml>; rel="alternate"`,
    },
  });
}
