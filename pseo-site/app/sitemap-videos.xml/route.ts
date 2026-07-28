/**
 * /sitemap-videos.xml — Google Video sitemap.
 *
 * Surfaces every <VideoObject> we declare in JSON-LD as a machine-readable
 * video index for Google Video search, Bing video, and any AI engine that
 * follows the standard. Driven by the single source of truth in
 * `content/videos.ts` so the sitemap, /api/v1/videos.json, /watch/[slug]
 * pages, and per-page VideoObject embeds stay byte-identical.
 *
 * Schema reference:
 *   https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
 */

import { videos, watchPageUrl } from "@/content/videos";

export const dynamic = "force-dynamic";

const APEX = "https://gitdealflow.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const urlBlocks = videos
    .map((v) => {
      // Each video gets a /watch/[slug] page on this site as its <loc>.
      // For the self-hosted MCP demo we keep the legacy /mcp-demo page as
      // canonical since that's what's been indexed for ~3 weeks.
      const pageUrl =
        v.slug === "mcp-claude-desktop-demo"
          ? "https://signals.gitdealflow.com/mcp-demo"
          : watchPageUrl(v.slug);

      const tags = v.tags
        .slice(0, 32) // Google caps at 32
        .map((t) => `      <video:tag>${escapeXml(t)}</video:tag>`)
        .join("\n");

      // Self-hosted videos get content_loc; YouTube videos get player_loc
      // pointing at the embed URL (Google Video sitemap spec).
      const contentLine = v.contentUrl
        ? `\n      <video:content_loc>${escapeXml(v.contentUrl)}</video:content_loc>`
        : "";
      const playerLine = v.youtubeId
        ? `\n      <video:player_loc allow_embed="yes" autoplay="ap=1">${escapeXml(`https://www.youtube-nocookie.com/embed/${v.youtubeId}`)}</video:player_loc>`
        : "";

      return `  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(v.thumbnailMaxUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(v.title.slice(0, 100))}</video:title>
      <video:description>${escapeXml(v.description.slice(0, 2048))}</video:description>${contentLine}${playerLine}
      <video:duration>${v.durationSeconds}</video:duration>
      <video:publication_date>${v.uploadDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
      <video:category>${escapeXml(v.category)}</video:category>
${tags}
      <video:uploader info="${escapeXml(APEX)}">VC Deal Flow Signal</video:uploader>
      <video:requires_subscription>no</video:requires_subscription>
      <video:platform relationship="allow">web mobile tv</video:platform>
      <video:price currency="USD">0.00</video:price>
      <video:expiration_date>2099-12-31T23:59:59+00:00</video:expiration_date>
    </video:video>
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlBlocks}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "index, follow",
    },
  });
}
