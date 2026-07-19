import { getDataLastModified } from "@/lib/data";

export const dynamic = "force-dynamic";

const BASE_URL = "https://signals.gitdealflow.com";
const SITEMAPS = ["core", "high-intent", "sectors", "crossings", "startups", "content"];

export async function GET() {
  const lastModified = getDataLastModified().toISOString();
  const entries = [
    ...SITEMAPS.map(
      (id) =>
        `  <sitemap>\n    <loc>${BASE_URL}/sitemap/${id}.xml</loc>\n    <lastmod>${lastModified}</lastmod>\n  </sitemap>`
    ),
    `  <sitemap>\n    <loc>${BASE_URL}/news-sitemap.xml</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </sitemap>`,
    `  <sitemap>\n    <loc>${BASE_URL}/sitemap-images.xml</loc>\n    <lastmod>${lastModified}</lastmod>\n  </sitemap>`,
    `  <sitemap>\n    <loc>${BASE_URL}/sitemap-videos.xml</loc>\n    <lastmod>${lastModified}</lastmod>\n  </sitemap>`,
    `  <sitemap>\n    <loc>${BASE_URL}/sitemap-i18n.xml</loc>\n    <lastmod>${lastModified}</lastmod>\n  </sitemap>`,
  ].join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
