import { getCompany } from "@/content/companies";
import { renderSignalBadge, renderPendingBadge } from "@/lib/badge-svg";

// Dynamic SVG per curated company — resolves against content/companies.ts
// `publicSignal.momentum` (editorial), NOT the live GitHub-velocity scrape
// used by /api/badge/momentum. Every curated company therefore has a stable,
// embeddable badge. Rendered on demand and CDN-cached for 24h via the
// Cache-Control below; unknown slugs fall back to a friendly "unknown" badge
// rather than a 404.
//
// NOTE: this is intentionally `force-dynamic`, NOT `force-static` + ISR.
// Route handlers whose pathname ends in a file extension (here `/svg`, and
// the sibling `/api/**/*.json` data endpoints) get their edge cache poisoned
// to a 404 by Vercel after the first background revalidation of a
// `force-static` + `revalidate` route. Dynamic rendering + `s-maxage` gives
// the same CDN economics without the poisoning. See docs/auto-improve-log.md
// 2026-07-06.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SVG_HEADERS: Record<string, string> = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  "Cache-Control":
    "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
};

const ALLOWED_SEG = /^[A-Za-z0-9._-]{1,100}$/;

function svg(body: string): Response {
  return new Response(body, { status: 200, headers: SVG_HEADERS });
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug: rawSlug } = await ctx.params;
  const slug = String(rawSlug || "").trim();

  if (!ALLOWED_SEG.test(slug)) {
    return svg(renderPendingBadge("momentum", "invalid"));
  }

  const company = getCompany(slug);
  if (!company) {
    return svg(renderPendingBadge("momentum", "unknown"));
  }

  return svg(
    renderSignalBadge({
      name: company.name,
      momentum: company.publicSignal.momentum,
    }),
  );
}
