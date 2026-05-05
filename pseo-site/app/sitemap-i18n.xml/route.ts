/**
 * /sitemap-i18n.xml — separate i18n-annotated sitemap with
 * xhtml:link rel="alternate" hreflang="..." per URL.
 *
 * Google's official format for international targeting:
 * https://developers.google.com/search/docs/specialized/international/localized-versions#sitemap
 *
 * Each URL entry advertises every translated variant + x-default. Bidirectional
 * with the per-page metadata.alternates.languages declarations. Listed in the
 * sitemap-index at /sitemap.xml.
 */

import { getI18nSitemapEntries } from "@/lib/hreflang";
import { getDataLastModified } from "@/lib/data";

export const dynamic = "force-static";

export async function GET() {
  const lastmod = getDataLastModified().toISOString();
  const entries = getI18nSitemapEntries();

  const urlBlocks = entries
    .flatMap(({ enUrl, alternates }) => {
      // Emit one <url> per (en + each locale variant). Each emits the FULL
      // alternates list — Google requires bidirectional declarations.
      const allUrls = Array.from(new Set([enUrl, ...alternates.map((a) => a.href)]));
      return allUrls.map((url) => {
        const altLinks = alternates
          .map(
            (a) =>
              `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeXml(a.href)}" />`,
          )
          .join("\n");
        return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
${altLinks}
  </url>`;
      });
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
