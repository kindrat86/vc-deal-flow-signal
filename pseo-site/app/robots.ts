import type { MetadataRoute } from "next";

const BASE_URL = "https://signals.gitdealflow.com";

// Explicit allowlist for AI / answer-engine crawlers. Listed by name so an
// auditor reading /robots.txt sees clear, named permission rather than
// inheritance from the wildcard rule. New 2026 entries: Mistral, Cohere
// training, Meta-ExternalFetcher, ai2bot, Apple-AI, Diffbot, Kagibot.
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleOther",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  "MistralAI-User",
  "DuckAssistBot",
  "YouBot",
  "Diffbot",
  "ImagesiftBot",
  "PetalBot",
  "Webzio-Extended",
  "ai2bot",
  "AI2Bot-Dolma",
  "TimpiBot",
  "Kagibot",
  "Brightbot",
];

// Routes that should never appear in agent or search indices.
// Auth callbacks, admin surfaces, ephemeral share/preview tokens, webhooks.
//
// /predicted/ is intentionally NOT listed here — /predicted/[week] is a
// public weekly Acceleration Watch page enumerated in sitemap.xml. A blanket
// disallow on the prefix would conflict with the sitemap and waste crawl
// signals.
const DISALLOW = [
  "/api/auth/",
  "/api/oauth/",
  "/api/webhook/",
  "/api/cron/",
  "/api/verify/",
  "/dashboard/",
  "/login/",
  "/welcome/",
  "/share/",
  "/api/share/",
  // Per-account dashboard — gated by API key; nothing public to index.
  // Mirrors the proxy's NOINDEX_PREFIXES + the page's defineMetadata
  // noindex flag so all three layers agree.
  "/account/",
];

// Aggressive bots that benefit from a crawl-delay directive — protects
// origin from request storms while still permitting indexing. Bytespider
// (ByteDance) and Amazonbot are the most common offenders in production
// access logs; PetalBot has been increasingly aggressive since 2025;
// ImagesiftBot fans out across image OG routes generating high RPS.
//
// Audit 2026-05-08 added crawl-delay to dimension 17 Crawl/Bot governance.
const AGGRESSIVE_BOTS_DELAY_S: Record<string, number> = {
  Bytespider: 10,
  Amazonbot: 10,
  PetalBot: 10,
  ImagesiftBot: 10,
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => {
        const delay = AGGRESSIVE_BOTS_DELAY_S[userAgent];
        return {
          userAgent,
          allow: "/",
          disallow: DISALLOW,
          ...(delay !== undefined ? { crawlDelay: delay } : {}),
        };
      }),
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/news-sitemap.xml`,
      `${BASE_URL}/sitemap-images.xml`,
      `${BASE_URL}/sitemap-videos.xml`,
      `${BASE_URL}/sitemap-i18n.xml`,
    ],
    host: BASE_URL,
  };
}
