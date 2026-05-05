import {
  getAllSectors,
  getCurrentPeriod,
  getDataLastModified,
} from "@/lib/data";
import { posts } from "@/content/posts";
import { agentQueries } from "@/content/agent-queries";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface ImageEntry {
  pageUrl: string;
  imageUrl: string;
  caption: string;
  title: string;
}

export async function GET() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const active = sectors.filter((s) => s.periods[period.slug]);

  const lastmod = getDataLastModified().toISOString();

  const entries: ImageEntry[] = [];

  // Site root OG image
  entries.push({
    pageUrl: BASE_URL,
    imageUrl: `${BASE_URL}/opengraph-image`,
    caption:
      "VC Deal Flow Signal — startup engineering acceleration tracker (GitHub commit-velocity rankings).",
    title: "VC Deal Flow Signal — Homepage OG card",
  });

  // Agents page (separate OG image)
  entries.push({
    pageUrl: `${BASE_URL}/agents`,
    imageUrl: `${BASE_URL}/agents/opengraph-image`,
    caption:
      "Agent Reference — MCP, A2A, NLWeb, function-calling, JSON / CSV / RSS surfaces for VC Deal Flow Signal.",
    title: "Agent Reference",
  });

  // Per-sector OG images
  for (const sector of active) {
    const slug = `${sector.slug}-${period.slug}`;
    entries.push({
      pageUrl: `${BASE_URL}/startups-to-watch/${slug}`,
      imageUrl: `${BASE_URL}/startups-to-watch/${slug}/opengraph-image`,
      caption: `${sector.name} startups ranked by GitHub engineering acceleration, ${period.name}.`,
      title: `${sector.name} — top startups by commit velocity (${period.name})`,
    });
  }

  // Per-blog post OG images
  for (const p of posts) {
    entries.push({
      pageUrl: `${BASE_URL}/blog/${p.slug}`,
      imageUrl: `${BASE_URL}/blog/${p.slug}/opengraph-image`,
      caption: p.description,
      title: p.title,
    });
  }

  // Per-answer OG images
  for (const q of agentQueries) {
    entries.push({
      pageUrl: `${BASE_URL}/answers/${q.slug}`,
      imageUrl: `${BASE_URL}/answers/${q.slug}/opengraph-image`,
      caption: q.description,
      title: q.h1,
    });
  }

  // Group by pageUrl so each <url> gets all its <image:image> children
  const byPage = new Map<string, ImageEntry[]>();
  for (const e of entries) {
    const arr = byPage.get(e.pageUrl) ?? [];
    arr.push(e);
    byPage.set(e.pageUrl, arr);
  }

  const urlBlocks = Array.from(byPage.entries())
    .map(([pageUrl, list]) => {
      const imgs = list
        .map(
          (i) => `    <image:image>
      <image:loc>${escapeXml(i.imageUrl)}</image:loc>
      <image:caption>${escapeXml(i.caption)}</image:caption>
      <image:title>${escapeXml(i.title)}</image:title>
      <image:license>https://creativecommons.org/licenses/by/4.0/</image:license>
    </image:image>`
        )
        .join("\n");
      return `  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
${imgs}
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlBlocks}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
