/**
 * /sitemap.xml
 *
 * signals-merge phase 2 (2026-11-03, Maryan-approved): signals.gitdealflow.com
 * consolidates into gitdealflow.com. The 55 pages worth keeping were ported in
 * phase 1 (same paths on gitdealflow.com, verified 200 + self-canonical) and
 * now redirect there permanently; every remaining signals page serves
 * `noindex, follow` (proxy.ts X-Robots-Tag + per-page meta robots in the root
 * layout). A sitemap must only advertise canonical, indexable URLs, so the
 * old multi-shard index (core/sectors/crossings/startups/content +
 * news/images/videos/i18n) is stripped to an empty urlset. The shard routes
 * keep serving for direct hits but nothing references them any more.
 *
 * robots.txt deliberately keeps `Allow: /` + the Sitemap: line so crawlers
 * still reach every page and see its noindex directive (required for
 * de-indexing; a Disallow would freeze the old index in place).
 */
export const dynamic = "force-static";

const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n`;

export async function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
