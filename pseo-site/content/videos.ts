/**
 * content/videos.ts, single source-of-truth for every video this site
 * exposes to crawlers, AI engines, and humans.
 *
 * Mirrors `tools/video/scripts/06-channel-optimize.mjs` (the YouTube
 * metadata canonical) and `tools/video/content/*.json` (the scene/chapter
 * canonical). Driving everything off one TS file lets `/sitemap-videos.xml`,
 * `/api/v1/videos.json`, `/watch/[slug]`, the `/.well-known/discover.json`
 * manifest, and per-page VideoObject JSON-LD embeds stay byte-identical.
 *
 * Anonymity rule preserved (memory: feedback_anonymity_no_podcasts.md):
 * narration is the Cartesia "Theo" synthetic voice, no founder face,
 * voice, or name. Every video on this list is anonymity-safe.
 */

export interface VideoChapter {
  /** Start offset in seconds. */
  start: number;
  /** End offset in seconds. */
  end: number;
  /** Display title for the chapter. */
  name: string;
  /** Optional human-readable description. */
  description?: string;
}

export interface SiteVideo {
  /** Stable kebab-slug, used as /watch/[slug]. */
  slug: string;
  /** YouTube video ID, null for self-hosted MP4. */
  youtubeId: string | null;
  /** Self-hosted content URL, null when youtubeId is set. */
  contentUrl: string | null;
  /** Stable thumbnail URL (16:9 for landscape, 9:16 for shorts). */
  thumbnailUrl: string;
  /** Larger thumbnail variant for sitemaps (Google prefers >=1200px wide). */
  thumbnailMaxUrl: string;
  /** Display title, drives <title>, OG, and VideoObject.name. */
  title: string;
  /** One-paragraph description, drives meta description + VideoObject.description. */
  description: string;
  /** ISO-8601 upload date. */
  uploadDate: string;
  /** Duration in seconds, used for VideoObject.duration ISO-8601 and sitemap <video:duration>. */
  durationSeconds: number;
  /** Aspect ratio family, affects embed sizing. */
  format: "landscape" | "short";
  /** Tag set, first 8 are emitted into the sitemap, all are used for keywords. */
  tags: string[];
  /** YouTube category. */
  category: string;
  /** Chapter timeline, emitted as Schema.org Clip[] and into the on-page transcript. */
  chapters: VideoChapter[];
  /** Plain-text narration / transcript paragraphs, emitted in /watch/[slug] and /api/v1/videos.json. */
  transcriptParagraphs: string[];
  /** Anchor pages that should embed this video as their primary VideoObject. */
  embeddedOn: string[];
}

const APEX = "https://gitdealflow.com";

function ytThumb(id: string): string {
  // YouTube guarantees hqdefault.jpg for every public video; maxresdefault
  // exists for HD uploads (all 3 channel uploads are 1080p). We list both -
  // the larger one in sitemap, the smaller one as a fallback.
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

function ytThumbHQ(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export const videos: SiteVideo[] = [
  // ─────────── 1. Engineering Acceleration Watch, explainer (90s landscape)
  {
    slug: "engineering-acceleration-watch",
    youtubeId: "sXFZHCKkROA",
    contentUrl: null,
    thumbnailUrl: ytThumbHQ("sXFZHCKkROA"),
    thumbnailMaxUrl: ytThumb("sXFZHCKkROA"),
    title:
      "GitHub Commit Velocity Predicts Series A 30 Days Early, Engineering Acceleration Watch",
    description:
      "By the time a startup hits Crunchbase, every other VC sees it the same morning. Engineering Acceleration Watch ships every Monday with the venture-backed startups whose GitHub commit velocity is accelerating sharpest, typically 21 to 47 days before the Series A announcement, based on a longitudinal panel of 219 startup-period observations (SSRN-indexed methodology, CC BY 4.0).",
    uploadDate: "2026-05-05T00:00:00+00:00",
    durationSeconds: 90,
    format: "landscape",
    category: "Science & Technology",
    tags: [
      "venture capital",
      "vc deal flow",
      "github commit velocity",
      "engineering acceleration",
      "alternative data vc",
      "series a prediction",
      "startup signals",
      "vc tools",
      "github momentum",
      "ssrn venture capital",
      "the data nerd",
      "gitdealflow",
    ],
    chapters: [
      { start: 0, end: 13, name: "Hook, Crunchbase tells you the day they raised" },
      { start: 13, end: 30, name: "The leading-indicator gap" },
      { start: 30, end: 55, name: "How engineering acceleration is computed" },
      { start: 55, end: 75, name: "219-observation panel: 21-47 day median lead time" },
      { start: 75, end: 90, name: "Free vs paid tiers, what to do next" },
    ],
    transcriptParagraphs: [
      "By the time it hits Crunchbase, every other VC sees it the same morning. We saw this one 30+ days earlier.",
      "By the time a startup hits Crunchbase, every other VC sees it the same morning you do. This week's biggest engineering accelerator surfaced thirty to forty days earlier, and the data was public the whole time.",
      "Stage Growth, region unknown. Commit velocity up 999 percent over the last fourteen days. That's the deploy frequency spike pattern, and across the panel of two hundred nineteen confirmed rounds, it has historically preceded the fundraise announcement by twenty-one to forty-seven days.",
      "If commit-velocity acceleration is the most leading public signal in venture capital, then every other deal-flow source, pitch decks, AngelList, Crunchbase, warm intros, is a lagging indicator.",
      "Five startups every Monday, free, at gitdealflow.com slash predicted. Methodology open at signals.gitdealflow.com slash methodology. Talk soon.",
    ],
    embeddedOn: ["/predicted", "/watch/engineering-acceleration-watch"],
  },

  // ─────────── 2. Walkthrough VSL, 3-minute long-form (landscape)
  {
    slug: "walkthrough-vsl",
    youtubeId: "6wgrWtR6eZg",
    contentUrl: null,
    thumbnailUrl: ytThumbHQ("6wgrWtR6eZg"),
    thumbnailMaxUrl: ytThumb("6wgrWtR6eZg"),
    title:
      "How To Spot a Series A 47 Days Before the Deck, 3-Minute VSL (GitDealFlow)",
    description:
      "The 3-minute version of the walkthrough, the long version takes 12 minutes, this one cuts to the single belief. If commit-velocity acceleration is the most leading public signal in venture capital, then every other deal-flow source, pitch decks, AngelList, Crunchbase, warm intros, is a lagging indicator. SSRN-indexed panel of 219 startup-period observations is the empirical basis.",
    uploadDate: "2026-05-06T00:00:00+00:00",
    durationSeconds: 180,
    format: "landscape",
    category: "Science & Technology",
    tags: [
      "vsl walkthrough",
      "venture capital",
      "vc deal flow",
      "series a 47 days",
      "github commit velocity",
      "engineering acceleration",
      "vsl",
      "video sales letter",
      "vc tools",
      "deal flow software",
      "alternative data vc",
      "ssrn venture capital",
      "core claim",
      "the data nerd",
    ],
    chapters: [
      { start: 0, end: 25, name: "Hook, the 47-day window" },
      { start: 25, end: 60, name: "The core-claim belief" },
      { start: 60, end: 120, name: "Three objections, vehicle, internal, external" },
      { start: 120, end: 155, name: "The stack, what's inside the Dashboard tier" },
      { start: 155, end: 180, name: "Close + 30-day Signal-or-It's-Free guarantee" },
    ],
    transcriptParagraphs: [
      "If you write angel checks but you find your deals on Crunchbase, you are already thirty days behind every other V-C. Three minutes. One uncomfortable conclusion.",
      "Here is the one belief everything hangs on. If GitHub commit-velocity acceleration is the most leading public signal in venture capital, then every other deal-flow source, pitch decks, AngelList, Crunchbase, warm intros, is a lagging indicator. Not because they're bad. Because they're slow. The whole thesis stands or falls on this one belief.",
      "Here is the proof on one real cohort. Day minus thirty-one, a quiet fintech repo, three contributors. Day minus twenty-one, contributor count jumps to seven, new repos auth-service and billing-engine appear. Day minus fourteen, velocity is two-point-six times baseline. Day minus seven, the marketing site swaps to a production stack. Day zero, Series A, four million dollars. We had it on day minus thirty-one.",
      "Here is what forty-nine euros a month gets you. The live dashboard refreshed every Monday, three hundred forty-eight a year. The two-hundred-nineteen startup panel dataset, two ninety-seven. Monthly sector deep-dive PDFs, five eighty-eight. Two free Chrome extensions, one ninety-eight. The free MCP server, never gated, zero. One async watchlist build, two ninety-seven. Methodology vault published, zero. Thirty-day refund guarantee, bonus. Total real value: one thousand seven hundred twenty-eight a year. Your price: forty-nine euros a month.",
      "Thirty-day Signal-or-It's-Free guarantee. Founding members who joined before June 30, 2026 keep their rate for life. Free Sunday digest at gitdealflow.com if the dashboard isn't your speed.",
    ],
    embeddedOn: ["/walkthrough", "/watch/walkthrough-vsl"],
  },

  // ─────────── 3. Magic Bullet, Short (vertical 9:16)
  {
    slug: "magic-bullet-short",
    youtubeId: "mBEMytrYZ1I",
    contentUrl: null,
    thumbnailUrl: ytThumbHQ("mBEMytrYZ1I"),
    thumbnailMaxUrl: ytThumb("mBEMytrYZ1I"),
    title:
      "We named this startup 31 days before their $4M Series A, VC Deal Flow Signal #Shorts",
    description:
      "Day -31: quiet fintech repo, 3 contributors. Day 0: $4M Series A. The full Acceleration Watch ships every Monday at gitdealflow.com/predicted. SSRN-indexed methodology. CC BY 4.0.",
    uploadDate: "2026-05-06T00:00:00+00:00",
    durationSeconds: 30,
    format: "short",
    category: "Science & Technology",
    tags: [
      "shorts",
      "venture capital",
      "github",
      "series a",
      "deal flow",
      "fintech series a",
      "engineering acceleration",
      "github momentum",
      "vc shorts",
      "startup signals",
      "alternative data",
      "one-shot proof",
      "the data nerd",
    ],
    chapters: [
      { start: 0, end: 5, name: "Hook, 31 days before the Series A" },
      { start: 5, end: 23, name: "The signal in action, D-31 to D-0" },
      { start: 23, end: 30, name: "CTA, Free Sunday digest" },
    ],
    transcriptParagraphs: [
      "We named this startup thirty-one days before they announced their Series A.",
      "Day minus thirty-one, quiet fintech repo, three contributors. Day minus twenty-one, new repos appear. Day minus fourteen, velocity is two-point-six times baseline. Day zero, Series A, four million dollars.",
      "Free Sunday digest at gitdealflow dot com slash predicted. Five names every week.",
    ],
    embeddedOn: ["/watch/magic-bullet-short"],
  },

  // ─────────── 4. Acceleration Watch, Week 19 of 2026 (sonic-pi-net) (landscape)
  // Shipped by the autonomous Monday cron 2026-05-05 23:36 UTC. The 90s explainer
  // explains the methodology in general; this entry is the live data drop for
  // that specific week, the brand's first weekly cron product on YouTube.
  {
    slug: "acceleration-watch-2026-w19-sonic-pi-net",
    youtubeId: "gDjBh37cDDM",
    contentUrl: null,
    thumbnailUrl: ytThumbHQ("gDjBh37cDDM"),
    thumbnailMaxUrl: ytThumb("gDjBh37cDDM"),
    title:
      "Engineering Acceleration Watch, Week of 2026-05-05, sonic-pi-net +999%",
    description:
      "This week's biggest engineering accelerator: sonic-pi-net (Growth). Commit velocity +999% over 14 days, deploy-frequency spike pattern. Across the SSRN-indexed panel of 219 startup-period observations, this profile has historically preceded the announcement by 21-47 days. Crunchbase, AngelList, warm intros, all lagging.",
    uploadDate: "2026-05-05T23:36:31+00:00",
    durationSeconds: 60,
    format: "landscape",
    category: "Science & Technology",
    tags: [
      "engineering acceleration watch",
      "weekly drop",
      "sonic-pi-net",
      "venture capital",
      "vc deal flow",
      "github commit velocity",
      "series a prediction",
      "alternative data vc",
      "ssrn venture capital",
      "deploy frequency spike",
      "the data nerd",
      "gitdealflow",
    ],
    chapters: [
      { start: 0, end: 3, name: "Title, Acceleration Watch, week of 2026-05-05" },
      { start: 3, end: 13, name: "Hook, Crunchbase tells you the day they raised" },
      { start: 13, end: 32, name: "Magic Bullet, sonic-pi-net, +999% commit velocity" },
      { start: 32, end: 48, name: "Big Domino, every other deal-flow source is lagging" },
      { start: 48, end: 60, name: "CTA, free Sunday digest, methodology open" },
    ],
    transcriptParagraphs: [
      "By the time a startup hits Crunchbase, every other VC sees it the same morning you do. This week's biggest engineering accelerator surfaced thirty to forty days earlier, and the data was public the whole time.",
      "sonic-pi-net. Stage: Growth. Region: Unknown. Commit velocity is +999% over the last fourteen days. That's the deploy frequency spike pattern, and across the panel of two hundred nineteen confirmed rounds, it has historically preceded the fundraise announcement by twenty-one to forty-seven days.",
      "If commit-velocity acceleration is the most leading public signal in venture capital, then every other deal-flow source, pitch decks, AngelList, Crunchbase, warm intros, is a lagging indicator.",
      "Five startups every Monday, free, at gitdealflow.com slash predicted. Methodology open at signals.gitdealflow.com slash methodology. Talk soon.",
    ],
    embeddedOn: ["/predicted", "/watch/acceleration-watch-2026-w19-sonic-pi-net"],
  },

  // ─────────── 5. MCP Server demo, silent screencast (self-hosted MP4)
  {
    slug: "mcp-claude-desktop-demo",
    youtubeId: null,
    contentUrl: `${APEX}/mcp-demo.mp4`,
    thumbnailUrl: `${APEX}/mcp-demo.gif`,
    thumbnailMaxUrl: `${APEX}/mcp-demo.gif`,
    title: "VC Deal Flow Signal MCP Server, Claude Desktop Demo",
    description:
      "Live demo of the VC Deal Flow Signal MCP server running inside Claude Desktop. Shows trending startups, sector search, and individual startup signal lookups via natural-language prompts. Free, no API key required.",
    uploadDate: "2026-04-17T00:00:00+00:00",
    durationSeconds: 72,
    format: "landscape",
    category: "Technology",
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
    chapters: [
      { start: 0, end: 25, name: "Trending startups across 20+ sectors" },
      { start: 25, end: 50, name: "Sector-by-sector signal search" },
      { start: 50, end: 72, name: "Individual startup deep-signal lookup" },
    ],
    transcriptParagraphs: [
      "Silent screencast, no narration. Demonstrates the six MCP tools running inside Claude Desktop: trending startups query, sector search, individual startup deep-signal lookup, and the cross-tool composition the MCP server is designed for.",
      "Six MCP tools, free forever. No API key required to install. Inspect the server card at /.well-known/mcp.json or grab it from npm at @gitdealflow/mcp-signal.",
    ],
    embeddedOn: ["/mcp-demo", "/watch/mcp-claude-desktop-demo"],
  },

  // ─────────── 6. How GitDealFlow Works, 60s self-hosted explainer (landscape)
  // Self-hosted MP4 (edge-tts synthetic narration, anonymity-safe). The
  // evergreen top-of-funnel "what is this product" video, distinct from the
  // YouTube-hosted methodology explainer (entry 1) and the 3-min sales VSL.
  {
    slug: "how-gitdealflow-works",
    youtubeId: null,
    contentUrl: `${APEX}/how-gitdealflow-works.mp4`,
    thumbnailUrl: `${APEX}/how-gitdealflow-works.jpg`,
    thumbnailMaxUrl: `${APEX}/how-gitdealflow-works.jpg`,
    title: "How GitDealFlow Works in 60 Seconds, VC Deal Flow Signal",
    description:
      "What GitDealFlow does in under a minute: it reads commit velocity, contributor growth, and repository expansion across hundreds of venture-backed startups in 15 sectors, then surfaces the five accelerating fastest every Monday for further research. Based on a descriptive panel of 219 startup-period observations with no linked funding-event labels (SSRN-indexed methodology, CC BY 4.0).",
    uploadDate: "2026-08-15T00:00:00+00:00",
    durationSeconds: 57,
    format: "landscape",
    category: "Science & Technology",
    tags: [
      "how it works",
      "explainer",
      "venture capital",
      "vc deal flow",
      "github commit velocity",
      "engineering acceleration",
      "alternative data vc",
      "startup signals",
      "deal flow software",
      "vc tools",
      "series a prediction",
      "ssrn venture capital",
      "the data nerd",
      "gitdealflow",
    ],
    chapters: [
      { start: 0, end: 9, name: "Hook, every VC finds the same Crunchbase deal" },
      { start: 9, end: 15, name: "The signal fires weeks earlier, in public GitHub data" },
      { start: 15, end: 27, name: "What GitDealFlow tracks, 15 sectors" },
      { start: 27, end: 38, name: "219-observation panel, 21 to 47 day lead" },
      { start: 38, end: 51, name: "Five breakouts every Monday, dashboard, extensions, MCP" },
      { start: 51, end: 57, name: "Spot the breakout before the deck" },
    ],
    transcriptParagraphs: [
      "Every VC finds the same deal on Crunchbase, on the same morning. By then, the round has already closed.",
      "The signal that mattered fired three to six weeks earlier, hiding in public GitHub data. Commit velocity, contributor growth, repository expansion.",
      "GitDealFlow reads that signal. It tracks commit velocity, contributor growth, and repository expansion across hundreds of venture-backed startups, across fifteen sectors.",
      "A longitudinal panel of two hundred nineteen startup-period observations shows engineering acceleration precedes the fundraise announcement by twenty-one to forty-seven days.",
      "Every Monday we publish five breakout startups, free, before they hit the press. There is a live dashboard, two Chrome extensions, and a free MCP server your AI agents can call.",
      "Spot the breakout before the deck. GitDealFlow dot com.",
    ],
    embeddedOn: ["/watch/how-gitdealflow-works"],
  },
];

/** ISO-8601 duration helper, `90` → `"PT1M30S"`. */
export function isoDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `PT${s}S`;
  if (s === 0) return `PT${m}M`;
  return `PT${m}M${s}S`;
}

/** Page URL on this site that anchors a given video. */
export function watchPageUrl(slug: string): string {
  return `https://signals.gitdealflow.com/watch/${slug}`;
}

/** YouTube embed URL (privacy-enhanced) for a given video. */
export function embedUrl(v: SiteVideo): string {
  if (v.youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0&modestbranding=1`;
  }
  return v.contentUrl ?? "";
}

/** Public watch URL on YouTube, or content URL for self-hosted video. */
export function publicUrl(v: SiteVideo): string {
  if (v.youtubeId) {
    return `https://www.youtube.com/watch?v=${v.youtubeId}`;
  }
  return v.contentUrl ?? "";
}

/** Look up a video by slug. */
export function getVideoBySlug(slug: string): SiteVideo | undefined {
  return videos.find((v) => v.slug === slug);
}

/** All slugs, drives /watch/[slug] generateStaticParams. */
export function getAllVideoSlugs(): string[] {
  return videos.map((v) => v.slug);
}
