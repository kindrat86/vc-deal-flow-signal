import {
  getAllTop100Slugs,
  getTop100,
  isoWeekToMonday,
  formatIsoWeekLabel,
} from "@/lib/top-100";
import { getDataLastModified } from "@/lib/data";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  const slugs = getAllTop100Slugs();
  const items = slugs
    .map((slug) => {
      const snap = getTop100(slug);
      if (!snap) return "";
      const monday = isoWeekToMonday(slug);
      const label = formatIsoWeekLabel(slug);
      const top = snap.rankings[0];
      const desc = top
        ? `Composite leaderboard of ${snap.summary.totalRanked} distinct startups for ${label}. #1 this week: ${top.name} (${top.sectorName}) at Signal Score ${top.signalScore}. Median ${snap.summary.medianSignalScore}.`
        : `Top 100 GitHub-Signal Startups for ${label}.`;
      return `    <item>
      <title><![CDATA[Top 100 GitHub-Signal Startups, ${label}]]></title>
      <link>${BASE_URL}/weekly/top-100/${slug}</link>
      <guid isPermaLink="true">${BASE_URL}/weekly/top-100/${slug}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${(monday ?? new Date()).toUTCString()}</pubDate>
    </item>`;
    })
    .filter(Boolean)
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VC Deal Flow Signal: Top 100 GitHub-Signal Startups (Weekly Index)</title>
    <link>${BASE_URL}/weekly/top-100</link>
    <description>Weekly composite leaderboard of the 100 startups with the strongest GitHub engineering signals. Refreshed every Monday. Same dataset that powers the per-sector pages, rolled up into a single ranked index.</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/weekly/top-100/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${getDataLastModified().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
