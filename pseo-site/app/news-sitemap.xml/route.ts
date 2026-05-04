import { posts } from "@/content/posts";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";
const PUBLICATION_NAME = "VC Deal Flow Signal";
const LANG = "en";
// Google News expects "recent" articles. 7 days matches our weekly
// publication cadence; 48h was too narrow and produced empty sitemaps.
const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const cutoff = Date.now() - WINDOW_MS;

  const recent = posts
    .filter((p) => {
      const t = Date.parse(p.date);
      return Number.isFinite(t) && t >= cutoff;
    })
    .slice(0, 1000);

  const urls = recent
    .map((p) => {
      const pubDate = new Date(p.date).toISOString();
      return `  <url>
    <loc>${BASE_URL}/blog/${p.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${LANG}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(p.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate=300",
      "X-Robots-Tag": "index, follow",
    },
  });
}
