import { renderPendingBadge } from "@/lib/badge-svg";
import { aggregateSector, renderSectorChart, resolveSector } from "@/lib/sector-svg";

// Rich per-sector momentum chart (760px-wide SVG bar chart, top 8 startups by
// 14-day commit velocity). This is the screenshot-worthy embed: a newsletter
// author covering a sector drops one <img> and gets a live, self-updating
// leaderboard with a "Powered by GitDealFlow" watermark and attribution link.
//
// Same force-dynamic rationale as the sector badge route: dotted-path route
// handlers get their edge cache poisoned under force-static + ISR.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SVG_HEADERS_OK: Record<string, string> = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  "Cache-Control":
    "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
};

const SVG_HEADERS_PENDING: Record<string, string> = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
};

const ALLOWED_SEG = /^[A-Za-z0-9._-]{1,100}$/;

function svg(body: string, headers: Record<string, string>): Response {
  return new Response(body, { status: 200, headers });
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug: rawSlug } = await ctx.params;
  const slug = String(rawSlug || "").trim();

  if (!ALLOWED_SEG.test(slug)) {
    return svg(renderPendingBadge("sector", "invalid"), SVG_HEADERS_PENDING);
  }

  const resolved = resolveSector(slug);
  if (!resolved || resolved.startups.length === 0) {
    return svg(renderPendingBadge("sector", "no data"), SVG_HEADERS_PENDING);
  }

  const aggregate = aggregateSector(resolved.startups);
  return svg(
    renderSectorChart({
      sectorName: resolved.sector.name,
      periodName: resolved.periodName,
      aggregate,
      startups: resolved.startups,
    }),
    SVG_HEADERS_OK,
  );
}
