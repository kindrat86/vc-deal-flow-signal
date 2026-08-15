import { renderPendingBadge, renderSectorBadge } from "@/lib/badge-svg";
import { aggregateSector, resolveSector } from "@/lib/sector-svg";

// Compact per-sector badge (shields-style). Label = sector name, value =
// "{N} startups", color = aggregate momentum tier. Served from the live signal
// corpus so every tracked sector has a stable, embeddable badge. Unknown slugs
// and sectors with no current data fall back to a friendly "no data" badge
// rather than a 404 (broken <img> embeds show a missing badge everywhere).
//
// force-dynamic (NOT force-static + ISR): dotted-path route handlers get their
// edge cache poisoned to a 404 by Vercel after the first background
// revalidation; dynamic + s-maxage gives the same CDN economics without the
// poisoning (see docs/auto-improve-log.md 2026-07-06).
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
    renderSectorBadge({
      name: resolved.sector.name,
      startupCount: aggregate.count,
      momentum: aggregate.momentum,
    }),
    SVG_HEADERS_OK,
  );
}
