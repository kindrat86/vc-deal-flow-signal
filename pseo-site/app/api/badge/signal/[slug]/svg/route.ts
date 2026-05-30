import { getCompany, getAllCompanySlugs } from "@/content/companies";
import { renderSignalBadge, renderPendingBadge } from "@/lib/badge-svg";

// Static SVG per curated company — resolves against content/companies.ts
// `publicSignal.momentum` (editorial), NOT the live GitHub-velocity scrape
// used by /api/badge/momentum. Every curated company therefore has a stable,
// embeddable badge. Pre-rendered at build for all known slugs; unknown slugs
// fall back to a friendly "unknown" badge rather than a 404.
export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

const SVG_HEADERS: Record<string, string> = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  "Cache-Control":
    "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
};

const ALLOWED_SEG = /^[A-Za-z0-9._-]{1,100}$/;

export function generateStaticParams() {
  return getAllCompanySlugs().map((slug) => ({ slug }));
}

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
