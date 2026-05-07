import { posts } from "@/content/posts";
import { PRESS_RELEASES } from "@/content/press-releases";
import { getAllPredictionWeeks } from "@/lib/predictions";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";
const PUBLICATION_NAME = "VC Deal Flow Signal";
const LANG = "en";
// Google News spec: a sitemap may include URLs published within the last
// 48 hours. Anything older is silently dropped from the news index, so we
// pre-filter aggressively rather than letting Google trim it for us.
const WINDOW_MS = 48 * 60 * 60 * 1000;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface NewsItem {
  /** Absolute URL that Google News should index. */
  loc: string;
  /** ISO 8601 publication timestamp (must be timezone-aware). */
  publishedAt: string;
  /** Article title (Google News rejects entries without a title). */
  title: string;
  /** Optional comma-separated keyword list (`<news:keywords>`). */
  keywords?: string;
}

function pressItems(): NewsItem[] {
  return PRESS_RELEASES.map((r) => ({
    loc: `${BASE_URL}/press/${r.slug}`,
    // Press release dates are date-only (YYYY-MM-DD); anchor to 09:00 UTC
    // so a Google fetch on the release morning sees a stable timestamp.
    publishedAt: new Date(`${r.date}T09:00:00Z`).toISOString(),
    title: r.headline,
    keywords: r.wireCategories.join(", "),
  }));
}

function predictionItems(): NewsItem[] {
  return getAllPredictionWeeks().map((w) => ({
    loc: `${BASE_URL}/predicted/${w.slug}`,
    publishedAt: new Date(w.publishedAt).toISOString(),
    // Headline mirrors the on-page H1 / OG title for crawler consistency.
    title: `Engineering Acceleration Watch — week of ${w.weekStart} — VC Deal Flow Signal`,
    keywords: "venture capital, GitHub, engineering signals, weekly index",
  }));
}

function blogItems(): NewsItem[] {
  return posts.map((p) => ({
    loc: `${BASE_URL}/blog/${p.slug}`,
    publishedAt: new Date(p.date).toISOString(),
    title: p.title,
  }));
}

export async function GET() {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  let all: NewsItem[];
  try {
    all = [...blogItems(), ...pressItems(), ...predictionItems()];
  } catch (err) {
    // Module-level data imports are sync, but if any helper throws during
    // ISR revalidate we want a visible signal in Vercel runtime logs rather
    // than a silently-empty news sitemap.
    console.error("[news-sitemap] failed to assemble news items", err);
    all = [];
  }

  const recent = all
    .filter((item) => {
      const t = Date.parse(item.publishedAt);
      // 48h rolling window, and never include future-dated entries — embargoed
      // press releases would otherwise leak into the index ahead of the
      // wire date.
      return Number.isFinite(t) && t >= cutoff && t <= now;
    })
    // Newest first — Google News uses publication_date for ranking but
    // sorted output is friendlier to manual auditors.
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    // Google News spec caps a single news sitemap at 1,000 URLs.
    .slice(0, 1000);

  const urls = recent
    .map((item) => {
      const keywordsTag = item.keywords
        ? `\n      <news:keywords>${escapeXml(item.keywords)}</news:keywords>`
        : "";
      return `  <url>
    <loc>${item.loc}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${LANG}</news:language>
      </news:publication>
      <news:publication_date>${item.publishedAt}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>${keywordsTag}
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
