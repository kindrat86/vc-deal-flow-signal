import { posts } from "@/content/posts";
import { PRESS_RELEASES } from "@/content/press-releases";
import { getAllPredictionWeeks } from "@/lib/predictions";
import { getAllIdeas } from "@/lib/ideas-of-the-day";

export const dynamic = "force-dynamic";

const BASE_URL = "https://signals.gitdealflow.com";
const PUBLICATION_NAME = "VC Deal Flow Signal";
const LANG = "en";
// Google News spec: a sitemap may include URLs published within the last
// 48 hours. Anything older is silently dropped from the news index, so we
// pre-filter aggressively rather than letting Google trim it for us.
const WINDOW_MS_48H = 48 * 60 * 60 * 1000;
// Quiet-week fallback (audit 2026-07-23 tightened). Only extend to 7 d
// when the 48-h window is completely empty — stale items are dropped by
// Google anyway and pollute the sitemap's freshness signal. A non-empty
// sitemap (even with 1 item) is re-fetched more aggressively.
const MIN_FRESH_ITEMS = 3; // kept for reference; strict 48h mode skips the <3 fallback
const WINDOW_MS_7D = 7 * 24 * 60 * 60 * 1000;
// Last-ditch fallback when even the 7-day window is empty. Cap at 5 most
// recent items regardless of age — guarantees the file is never an empty
// `<urlset/>` (which Google treats as a soft error and re-attempts less
// frequently). Items past 48 h are filtered by Google anyway.
const ABSOLUTE_FALLBACK_LIMIT = 5;

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

// Idea of the Day — daily ideation pages. Each entry's publishedAt anchors
// the news-index window; Google News drops anything past 48 h on its side
// so the daily cron keeps a fresh item rotating through the index without
// any extra plumbing here.
function ideaOfTheDayItems(): NewsItem[] {
  return getAllIdeas().map((idea) => ({
    loc: `${BASE_URL}/idea-of-the-day/${idea.slug}`,
    publishedAt: new Date(idea.publishedAt).toISOString(),
    title: `Idea of the day: ${idea.headline} — VC Deal Flow Signal`,
    keywords: [
      "startup ideas",
      idea.repo.sector,
      idea.repo.signalType,
      "GitHub momentum",
    ].join(", "),
  }));
}

function filterAndSort(items: NewsItem[], now: number, windowMs: number): NewsItem[] {
  const cutoff = now - windowMs;
  return items
    .filter((item) => {
      const t = Date.parse(item.publishedAt);
      // Window check + never-future guard: embargoed press releases must not
      // leak into the index ahead of their wire date.
      return Number.isFinite(t) && t >= cutoff && t <= now;
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export async function GET() {
  const now = Date.now();

  let all: NewsItem[];
  try {
    all = [
      ...blogItems(),
      ...pressItems(),
      ...predictionItems(),
      ...ideaOfTheDayItems(),
    ];
  } catch (err) {
    // Module-level data imports are sync, but if any helper throws during
    // ISR revalidate we want a visible signal in Vercel runtime logs rather
    // than a silently-empty news sitemap.
    console.error("[news-sitemap] failed to assemble news items", err);
    all = [];
  }

  // Tiered fallback (audit 2026-07-23): strict 48 h filter for Google News
  // compliance. Google drops anything past 48 h from its News index, so
  // including stale items wastes crawl budget and creates a misleading
  // freshness signal. If 48 h yields zero, fall back to 7 d — Google will
  // ignore the stale items but the non-empty sitemap is re-fetched more
  // aggressively. Absolute fallback (5 most recent) as last resort.
  // Newest first. Capped at 1,000 URLs per sitemap.
  let recent = filterAndSort(all, now, WINDOW_MS_48H);
  let windowUsed: "48h" | "7d" | "absolute" = "48h";
  if (recent.length === 0 && all.length > 0) {
    recent = filterAndSort(all, now, WINDOW_MS_7D);
    windowUsed = "7d";
  }
  if (recent.length === 0) {
    recent = all
      .filter((item) => {
        const t = Date.parse(item.publishedAt);
        return Number.isFinite(t) && t <= now;
      })
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .slice(0, ABSOLUTE_FALLBACK_LIMIT);
    windowUsed = "absolute";
  }
  recent = recent.slice(0, 1000);

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
      // Surface which fallback tier supplied the items so production logs
      // and any observability tap can detect a sustained quiet-week state.
      "X-News-Window": windowUsed,
      "X-News-Item-Count": String(recent.length),
    },
  });
}
