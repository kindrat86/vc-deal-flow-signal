import { parsePageSlug, getDataLastModified } from "@/lib/data";

const BASE_URL = "https://signals.gitdealflow.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, ctx: RouteContext) {
  const { slug } = await ctx.params;
  const parsed = parsePageSlug(slug);
  if (!parsed) return new Response("Not Found", { status: 404 });

  const { sector, period, snapshot } = parsed;
  const pubDate = getDataLastModified().toUTCString();
  const feedUrl = `${BASE_URL}/startups-to-watch/${slug}/feed.xml`;
  const pageUrl = `${BASE_URL}/startups-to-watch/${slug}`;

  const items = snapshot.startups
    .slice(0, 20)
    .map((s) => {
      const startupUrl = `${BASE_URL}/startup/${encodeURIComponent(
        s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      )}`;
      const desc = `${s.commitVelocity14d} commits over 14 days (${s.commitVelocityChange} change). ${s.contributors} contributors (${s.contributorGrowth} growth). Signal: ${s.signalType}. Stage: ${s.stage}. Geography: ${s.geography}.`;
      const title = `${s.name}, ${s.signalType} (${s.commitVelocityChange})`;
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${startupUrl}</link>
      <guid isPermaLink="true">${startupUrl}</guid>
      <description>${escapeXml(desc)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(sector.name)}</category>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(sector.name)} Startups to Watch: ${escapeXml(period.name)}</title>
    <link>${pageUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(
      `${sector.name} startups ranked by GitHub engineering acceleration in ${period.name}. ${sector.description}`
    )}</description>
    <language>en</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <pubDate>${pubDate}</pubDate>
    <generator>VC Deal Flow Signal</generator>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
