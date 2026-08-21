/**
 * gitdealflow.com (apex): AI-discovery bot-crawl logger.
 *
 * The apex is a pure static Vercel project (vanilla HTML/CSS, framework null,
 * outputDirectory "."). Vercel Routing Middleware does NOT run on this preset
 * (verified 2026-08-16: a middleware.ts at the root is served as a static file,
 * never executed), so the apex cannot log crawler traffic the way
 * signals.gitdealflow.com does via its Next.js proxy.ts.
 *
 * This function closes the highest-value slice of that "apex blind spot": the
 * AI/agent discovery files that GPTBot, ClaudeBot, PerplexityBot and friends
 * fetch first: llms.txt, llms-full.txt, ai.txt, agents.txt. Each is rewritten
 * here (vercel.json "rewrites"); the function detects the crawler from the
 * User-Agent, emits a best-effort bot_crawl event to PostHog (EU project 143861,
 * same key + schema as pseo-site/proxy.ts), then serves the file.
 *
 * Why the files live at .src names: in Vercel's "Other" preset an existing
 * static file takes precedence over vercel.json rewrites. The public /llms.txt
 * therefore has no static twin (the source is llms.src.txt), so the rewrite can
 * fire and route here. The .src files themselves stay static and harmless.
 *
 * robots.txt and sitemap.xml are deliberately NOT routed here: their Googlebot
 * fetch is already visible in GSC, and keeping them static avoids any
 * crawlability risk. Residual gap (flagged): AI-crawler fetches of the 815
 * static money pages stay unlogged until a framework migration or an explicit
 * catch-all proxy is approved.
 *
 * Keep the bot-token lists in sync with pseo-site/lib/agent-bots.ts and
 * pseo-site/proxy.ts.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const POSTHOG_CAPTURE = "https://eu.i.posthog.com/capture/"; // reference only: direct egress from this function is dropped (see below)
// Relay endpoint: the signals.gitdealflow.com edge middleware (the proven
// bot_crawl capture path, 13k+/day). Direct egress from this function is
// ACKed 200 by PostHog but silently dropped by ingestion (proven 2026-08-16:
// key/payload/endpoint all verified identical to the edge emitter; only
// edge-runtime-origin captures land). Shared secret in both projects' env.
const RELAY_URL =
  "https://signals.gitdealflow.com/__relay/bot-crawl";
const RELAY_SECRET = process.env.APEX_RELAY_SECRET || "";

// Public path -> source file (the .src twin, so the public path has no static file).
const SRC_MAP = {
  "llms.txt": "llms.src.txt",
  "llms-full.txt": "llms-full.src.txt",
  "ai.txt": "ai.src.txt",
  "agents.txt": "agents.src.txt",
};

const AGENT_BOT_TOKENS = [
  "GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "Claude-Web",
  "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended",
  "CCBot", "Bytespider", "Applebot-Extended", "Amazonbot", "cohere-ai",
  "Meta-ExternalAgent", "DuckAssistBot", "YouBot", "MistralAI-User", "Diffbot",
];

const BOT_UA_PATTERN = new RegExp(
  `\\b(${AGENT_BOT_TOKENS.map((t) => t.replace(/[-]/g, "[-]")).join("|")})\\b`,
  "i",
);

const SEARCH_AND_GENERIC_BOTS = [
  ["googlebot", "Googlebot"],
  ["googleother", "GoogleOther"],
  ["bingbot", "Bingbot"],
  ["duckduckbot", "DuckDuckBot"],
  ["yandex", "YandexBot"],
  ["baiduspider", "BaiduSpider"],
  ["sogou", "SogouBot"],
  ["petalbot", "PetalBot"],
  ["ahrefsbot", "AhrefsBot"],
  ["semrushbot", "SemrushBot"],
  ["mj12bot", "MJ12bot"],
  ["dotbot", "DotBot"],
  ["dataforseo", "DataForSEO"],
  ["screaming frog", "ScreamingFrog"],
  ["timpibot", "Timpibot"],
  ["omgili", "OmgiliBot"],
  ["facebookexternalhit", "FacebookExternalHit"],
  ["linkedinbot", "LinkedInBot"],
  ["twitterbot", "TwitterBot"],
  ["redditbot", "RedditBot"],
  ["telegrambot", "TelegramBot"],
  ["slackbot", "SlackBot"],
  ["discordbot", "DiscordBot"],
];

const GENERIC_BOT_MARKERS = [
  "bot/", "bot;", "bot)", "-bot", "_bot", "bot ",
  "crawler", "spider", "scraper", "slurp", "archiver", "indexer",
  "headless", "phantomjs", "selenium", "puppeteer", "playwright", "cypress",
  "webdriver", "curl/", "wget/", "python-requests", "python-httpx", "aiohttp",
  "axios/", "go-http-client", "java/", "okhttp", "libwww-perl", "guzzlehttp",
  "postmanruntime", "node-fetch", "undici",
];

function resolveBotLabel(userAgent) {
  if (!userAgent) return null;
  const agentMatch = userAgent.match(BOT_UA_PATTERN);
  if (agentMatch) {
    const matched = agentMatch[1].toLowerCase();
    const canonical = AGENT_BOT_TOKENS.find((t) => t.toLowerCase() === matched);
    if (canonical) return canonical;
  }
  const ua = userAgent.toLowerCase();
  for (const [marker, name] of SEARCH_AND_GENERIC_BOTS) {
    if (ua.includes(marker)) return name;
  }
  for (const marker of GENERIC_BOT_MARKERS) {
    if (ua.includes(marker)) return "GenericBot";
  }
  return null;
}

async function captureBotCrawl(host, path, method, userAgent, ip, bot) {
  // Relay through the signals edge middleware (proven capture path) instead
  // of direct PostHog egress (silently dropped from non-edge sources,
  // proven 2026-08-16). Same payload fields travel as signed query params.
  const params = new URLSearchParams({
    bot,
    host,
    path,
    method,
    ua: (userAgent || "").slice(0, 512),
    ip: ip || "",
    ts: new Date().toISOString(),
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    const r = await fetch(`${RELAY_URL}?${params.toString()}`, {
      method: "GET",
      headers: { "x-relay-secret": RELAY_SECRET },
      signal: controller.signal,
    });
    if (r.status !== 200 && r.status !== 204) {
      console.error(`[crawl-proxy] relay HTTP ${r.status}`);
    }
  } catch (e) {
    console.error(`[crawl-proxy] relay ERROR: ${e && e.message ? e.message : String(e)}`);
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  // f = the public discovery filename, via the rewrite's query string
  // (destination /api/crawl-proxy?f=<name>); fall back to the pathname if the
  // runtime preserves the original request path instead.
  const raw = req.url || "";
  const url = new URL(raw, "https://gitdealflow.com");
  let f = url.searchParams.get("f") || (req.query && req.query.f) || "";
  if (!f) {
    const p = url.pathname.replace(/^\/+/, "");
    if (SRC_MAP[p]) f = p;
  }

  // Only the four AI-discovery files are routed here; anything else is a miss.
  const srcFile = SRC_MAP[f];
  if (!srcFile) {
    res.status(404).send("Not found");
    return;
  }

  const bot = resolveBotLabel(req.headers["user-agent"] || "");
  if (bot) {
    await captureBotCrawl(
      req.headers.host || "gitdealflow.com",
      "/" + f,
      req.method || "GET",
      req.headers["user-agent"] || "",
      req.headers["x-forwarded-for"] || "",
      bot,
    );
  }

  try {
    const content = readFileSync(join(process.cwd(), srcFile), "utf8");
    res.status(200);
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader(
      "cache-control",
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    );
    res.setHeader("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
    res.send(content);
  } catch {
    res.status(404).send("Not found");
  }
}
