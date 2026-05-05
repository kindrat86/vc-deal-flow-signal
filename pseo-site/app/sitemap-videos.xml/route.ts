/**
 * /sitemap-videos.xml — Google Video sitemap.
 *
 * Surfaces every <VideoObject> we already declare in JSON-LD as a
 * machine-readable video index for Google Video search, Bing video,
 * and any AI engine that follows the standard.
 *
 * Schema reference:
 *   https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
 */

export const dynamic = "force-static";
export const revalidate = 86400;

const APEX = "https://gitdealflow.com";
const SIGNALS = "https://signals.gitdealflow.com";
const WATCH_PAGE = `${SIGNALS}/mcp-demo`;

interface VideoEntry {
  pageUrl: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  playerUrl?: string;
  duration: number;
  publicationDate: string;
  familyFriendly: "yes" | "no";
  liveStream: "yes" | "no";
  tags: string[];
  category?: string;
  uploader: { name: string; url: string };
  license: string;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const VIDEOS: VideoEntry[] = [
  {
    pageUrl: WATCH_PAGE,
    title: "VC Deal Flow Signal MCP Server — Claude Desktop Demo",
    description:
      "Live demo of the VC Deal Flow Signal MCP server running inside Claude Desktop. Shows trending startups, sector search, and individual startup signal lookups via natural-language prompts. Free, no API key required.",
    thumbnailUrl: `${APEX}/mcp-demo.gif`,
    contentUrl: `${APEX}/mcp-demo.mp4`,
    duration: 72,
    publicationDate: "2026-04-17T00:00:00+00:00",
    familyFriendly: "yes",
    liveStream: "no",
    tags: [
      "MCP",
      "Model Context Protocol",
      "Claude Desktop",
      "GitHub momentum",
      "VC tools",
      "alternative data",
      "deal flow",
      "GitHub commit velocity",
    ],
    category: "Technology",
    uploader: {
      name: "VC Deal Flow Signal",
      url: APEX,
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
];

export async function GET() {
  const urlBlocks = VIDEOS.map((v) => {
    const tags = v.tags
      .map((t) => `      <video:tag>${escapeXml(t)}</video:tag>`)
      .join("\n");
    const playerLine = v.playerUrl
      ? `\n      <video:player_loc>${escapeXml(v.playerUrl)}</video:player_loc>`
      : "";
    const categoryLine = v.category
      ? `\n      <video:category>${escapeXml(v.category)}</video:category>`
      : "";
    return `  <url>
    <loc>${escapeXml(v.pageUrl)}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(v.thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(v.title)}</video:title>
      <video:description>${escapeXml(v.description)}</video:description>
      <video:content_loc>${escapeXml(v.contentUrl)}</video:content_loc>${playerLine}
      <video:duration>${v.duration}</video:duration>
      <video:publication_date>${v.publicationDate}</video:publication_date>
      <video:family_friendly>${v.familyFriendly}</video:family_friendly>
      <video:live>${v.liveStream}</video:live>${categoryLine}
${tags}
      <video:uploader info="${escapeXml(v.uploader.url)}">${escapeXml(v.uploader.name)}</video:uploader>
      <video:requires_subscription>no</video:requires_subscription>
      <video:platform relationship="allow">web mobile tv</video:platform>
    </video:video>
  </url>`;
  }).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlBlocks}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "index, follow",
    },
  });
}
