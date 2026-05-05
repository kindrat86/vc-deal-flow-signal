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
  "/predicted/",
  "/api/share/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
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
