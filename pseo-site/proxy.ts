import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { detectAgentBot } from "@/lib/agent-bots";
import { researchPaperLeafNoindexByPath } from "@/content/research-paper-policy";
import { isPagePruned } from "@/content/pruned-pages";

const BASE_URL = "https://signals.gitdealflow.com";
const CANONICAL_HOST = "signals.gitdealflow.com";

// --- Bot-crawl monitoring (PostHog bot_crawl) -------------------------------
// detectAgentBot() covers AI/agent crawlers only (it drives agent-aware
// rendering). Search engines and other non-human clients are matched here so
// crawl patterns (which bot, which file, how often) are visible in analytics.
const POSTHOG_KEY = "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX";
const POSTHOG_CAPTURE = "https://eu.i.posthog.com/capture/";

const SEARCH_AND_GENERIC_BOTS: ReadonlyArray<readonly [string, string]> = [
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

const GENERIC_BOT_MARKERS: readonly string[] = [
  "bot/", "bot;", "bot)", "-bot", "_bot", "bot ",
  "crawler", "spider", "scraper", "slurp", "archiver", "indexer",
  "headless", "phantomjs", "selenium", "puppeteer", "playwright", "cypress",
  "webdriver", "curl/", "wget/", "python-requests", "python-httpx", "aiohttp",
  "axios/", "go-http-client", "java/", "okhttp", "libwww-perl", "guzzlehttp",
  "postmanruntime", "node-fetch", "undici",
];

const ASSET_EXT =
  /\.(png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|css|js|mjs|map|webmanifest)$/i;

function resolveBotLabel(userAgent: string): string | null {
  const agentBot = detectAgentBot(userAgent);
  if (agentBot) return agentBot;
  const ua = userAgent.toLowerCase();
  for (const [marker, name] of SEARCH_AND_GENERIC_BOTS) {
    if (ua.includes(marker)) return name;
  }
  for (const marker of GENERIC_BOT_MARKERS) {
    if (ua.includes(marker)) return "GenericBot";
  }
  return null;
}

async function captureBotCrawl(request: NextRequest, bot: string): Promise<void> {
  const ua = (request.headers.get("user-agent") || "").slice(0, 512);
  const url = request.nextUrl;
  const payload = {
    api_key: POSTHOG_KEY,
    event: "bot_crawl",
    distinct_id: bot,
    properties: {
      bot,
      host: url.host,
      path: url.pathname,
      method: request.method,
      user_agent: ua,
      $ip: request.headers.get("x-forwarded-for") || "",
      source: "server-proxy",
    },
    timestamp: new Date().toISOString(),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    await fetch(POSTHOG_CAPTURE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    // Best-effort monitoring: never fail or slow the request.
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Path prefixes whose pages opt out of indexing via Next metadata
 * (`metadata.robots.index = false`). The proxy normally sets
 * `X-Robots-Tag: index, follow` as belt-and-suspenders, but for these paths
 * the header would override the per-page noindex meta, so we emit
 * `X-Robots-Tag: noindex, follow` instead. Keep this list aligned with
 * `defineMetadata({ noindex: true })` callers.
 */
const NOINDEX_PREFIXES = [
  "/account",
  "/receipts/",
  "/share-approve",
  "/momentum/",
  "/welcome",
  "/dashboard",
  "/login",
  "/search",
];

/**
 * §54: research-paper leaf noindex is slug-driven, not prefix-driven (the
 * keepIndexable leaves + the /research-paper index hub must keep serving
 * `index, follow`). Registered here so robotsDirectiveFor stays the single
 * X-Robots-Tag decision point. Inert while policy decision = "retain".
 * Imported lazily inside the matcher to keep the middleware edge bundle lean.
 */
function researchPaperNoindex(pathname: string): boolean {
  // Inline the policy read: proxy runs in the edge runtime, content modules
  // with large data imports are tree-shaken away if referenced lazily. The
  // policy module is tiny (no data imports) so a static import is safe, but
  // keep the indirection explicit for the §54 guard.
  return researchPaperLeafNoindexByPath(pathname);
}

function shouldNoindex(pathname: string): boolean {
  if (NOINDEX_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  if (researchPaperNoindex(pathname)) {
    return true;
  }
  // §55b: zero-impression pruned pages (content/pruned-pages.ts) are noindex
  // too, so the sitemap cut also actually removes them from the index. Pages
  // stay live (200, follow) for direct/referral/agent traffic.
  return isPagePruned(pathname);
}

/**
 * Full robots directive for a path. Middleware is the deterministic LAST
 * writer of X-Robots-Tag, so vercel.json's global directive
 * (index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1)
 * was silently flattened to bare "index, follow" on every signals page —
 * apex gitdealflow.com (no middleware) served the full directive while
 * signals.gitdealflow.com did not (live-verified 2026-08-18). max-snippet:-1
 * matters for AI Overviews / answer-engine extraction length,
 * max-image-preview:large for Discover-style surfaces. All THREE set-sites
 * (markdown rewrite, agent-bot branch, default branch) must use this helper.
 */
const INDEX_ROBOTS_DIRECTIVE =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

function robotsDirectiveFor(pathname: string): string {
  return shouldNoindex(pathname) ? "noindex, follow" : INDEX_ROBOTS_DIRECTIVE;
}

/**
 * Genuinely private / user-specific surfaces. These must NEVER be edge-cached
 * (their HTML varies per viewer), so they get `private, no-store` below.
 * This is deliberately a NARROWER set than shouldNoindex(): noindex is an
 * *indexing* decision (pruned zero-impression pSEO pages, research-paper
 * leaves) that has nothing to do with cacheability. §55b (2026-08-16) folded
 * pruned pages into shouldNoindex() but publicHtmlCacheControl() then keyed
 * no-store off shouldNoindex(), silently turning 477 public pSEO pages into
 * `private, no-store` origin-thrash (TTFB regression, watchdog 2026-08-17).
 * Fix: cache privacy keys off THIS list, indexing off shouldNoindex().
 */
function isPrivateNoStorePath(pathname: string): boolean {
  return NOINDEX_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function publicHtmlCacheControl(pathname: string): string {
  // Public marketing / pSEO pages are effectively static between deploys or
  // weekly data refreshes, so edge-cache them aggressively for crawlers and
  // humans. Only genuinely private/user-specific surfaces (account, receipts,
  // dashboard, login, ...) are no-store. Pruned noindex pages are still public
  // and MUST keep s-maxage so they don't thrash the origin.
  if (isPrivateNoStorePath(pathname)) {
    return "private, no-cache, no-store, max-age=0, must-revalidate";
  }
  // Versioned public asset (?v=YYYYMMDD-N): content changes ship a new URL,
  // so copies can be cached forever. Immutable caching removes the
  // revalidation RTT from every repeat visit and stops /ux.css blocking
  // first paint on cache re-checks (FCP fix 2026-08-16).
  if (pathname === "/ux.css") {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
}

/**
 * Hosts that should NOT redirect to the canonical apex even when host !==
 * CANONICAL_HOST. Vercel preview deployments (`*.vercel.app` and
 * `*-vercel.app`) are reached directly during PR review and must serve
 * content; localhost is the dev loop. Anything else (e.g. `www.<domain>`,
 * misconfigured `xn--…` IDN aliases, unrelated cnamed hosts) gets 308'd to
 * the canonical apex.
 */
function isCanonicalOrAllowedHost(host: string | null): boolean {
  if (!host) return true; // No Host header → don't risk a redirect loop.
  // Strip a port if present (host: "localhost:3000" → "localhost").
  const bareHost = host.split(":")[0].toLowerCase();
  if (bareHost === CANONICAL_HOST) return true;
  if (bareHost === "localhost" || bareHost === "127.0.0.1") return true;
  if (bareHost.endsWith(".vercel.app")) return true;
  return false;
}

/**
 * Add SEO + AI-crawler HTTP headers to every page response, and forward an
 * `x-agent-bot` request header so server components can render citation-tuned
 * additions (Speakable schema, AgentSummary blocks) when a known agent crawler
 * fetches the page.
 *
 * - **Canonical-host redirect**, non-apex hosts (e.g. `www.gitdealflow.com`,
 *   IDN aliases) are 308'd to the apex before any other logic. Defense-in-
 *   depth on top of Vercel's domain-level redirect (see memory entry
 *   `feedback_vercel_json_host_redirect_unreliable.md`, the platform-level
 *   rule has historically silently failed; this is the layer that survives).
 * - `x-pathname: <pathname>`, forwarded request header available to server
 *   components that need the resolved path. NOTE: `<BreadcrumbsSchema/>` no
 *   longer reads it, awaiting `headers()` in the root layout forced every
 *   page into per-request dynamic rendering (audit 2026-07-18); breadcrumbs
 *   now derive the path client-side via `usePathname()`. Do NOT reintroduce
 *   a `headers()` read in the layout tree.
 * - `Link: <canonical>; rel="canonical"`, explicit canonical for crawlers
 *   that skip HTML parsing (Google, Bing do read this).
 * - `X-Robots-Tag: index, follow`, belt-and-suspenders indexing directive.
 * - `x-agent-bot: <canonical-token>`, forwarded request header for downstream
 *   pages that opt into agent-aware rendering. Empty for normal browser UAs.
 *
 * Skipped for API routes and asset paths (they set their own headers).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Apex bot-crawl relay (2026-08-17) -----------------------------------
  // gitdealflow.com (the apex, a static Vercel project) cannot land bot_crawl
  // events in PostHog directly: its Node function egress to eu.i.posthog.com
  // is ACKed ("200 Ok") but the events are silently dropped by ingestion
  // (proven 2026-08-16: identical key/payload/endpoint from THIS edge
  // middleware lands 13k+/day; from Vercel Node functions and residential
  // IPs, zero events land across /capture/ and /batch/ with every client
  // tested). The apex api/crawl-proxy.js therefore RELAYS its bot detections
  // here, and this middleware, the proven capture path, emits them with
  // host = the apex host (from the signed query param, not the relay's own
  // host) and source = "apex-relay". Secret-gated so third parties cannot
  // forge crawl analytics. Must stay FIRST in proxy(): it returns before the
  // host-redirect and never falls through to the page pipeline.
  if (pathname === "/__relay/bot-crawl") {
    const relaySecret = process.env.APEX_RELAY_SECRET;
    const auth = request.headers.get("x-relay-secret") || "";
    if (!relaySecret || auth !== relaySecret) {
      return new NextResponse("forbidden", { status: 403 });
    }
    const q = request.nextUrl.searchParams;
    const bot = (q.get("bot") || "").slice(0, 64);
    const host = (q.get("host") || "gitdealflow.com").slice(0, 128);
    const botPath = (q.get("path") || "").slice(0, 512);
    const method = (q.get("method") || "GET").slice(0, 8);
    const ua = (q.get("ua") || "").slice(0, 512);
    // The crawler's original x-forwarded-for, forwarded by the apex function:
    // lets PostHog GeoIP the CRAWLER (same enrichment the direct path gets),
    // not the relay egress.
    const ip = (q.get("ip") || "").slice(0, 64);
    const ts = q.get("ts") || new Date().toISOString();
    let relayed = 0;
    if (bot) {
      relayed = 1;
      // Exact shape of the proven captureBotCrawl payload below; only the
      // source marker and forwarded fields differ. Same 1500ms abort guard
      // so a hanging capture never hangs the middleware.
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1500);
      try {
        await fetch(POSTHOG_CAPTURE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: POSTHOG_KEY,
            event: "bot_crawl",
            distinct_id: bot,
            properties: {
              bot,
              host,
              path: botPath,
              method,
              user_agent: ua,
              $ip: ip,
              source: "apex-relay",
            },
            timestamp: ts,
          }),
          signal: controller.signal,
        });
      } catch {
        // Best-effort monitoring: never fail the relay response.
      } finally {
        clearTimeout(timer);
      }
    }
    return new NextResponse(JSON.stringify({ ok: true, relayed }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    });
  }

  // Canonical-host enforcement runs FIRST so all non-canonical hosts redirect
  // before we waste compute building the markdown rewrite, agent-bot headers,
  // or canonical Link header. 308 preserves method + body (and search params)
  // and signals "permanent" to crawlers and Google's deduper.
  const requestHost = request.headers.get("host");
  if (!isCanonicalOrAllowedHost(requestHost)) {
    const target = new URL(request.url);
    target.protocol = "https:";
    target.host = CANONICAL_HOST;
    return NextResponse.redirect(target, 308);
  }

  // Bot-crawl monitoring (PostHog bot_crawl). Runs before the early-skip so
  // AI discovery files (llms.txt, qa.jsonl, sitemaps, agents.txt) are logged,
  // not just HTML pages. Human traffic is untouched: no bot label means no
  // capture and no added latency.
  const userAgent = request.headers.get("user-agent") || "";
  if (!ASSET_EXT.test(pathname)) {
    const botLabel = resolveBotLabel(userAgent);
    if (botLabel) {
      await captureBotCrawl(request, botLabel);
    }
  }

  // Public data feeds (signals.json / signals.csv). The route handlers set
  // s-maxage=3600 on their Responses, but Next 16 dynamic route handlers get
  // Cache-Control overridden to max-age=0, must-revalidate in production, so
  // every bot fetch was a full function invocation (measured p95 1.35s TTFB,
  // 100% MISS across the probe set). The middleware is the deterministic
  // last-writer of response headers, so the 1h edge cache policy lives here.
  // Authorization split is REQUIRED: the handlers enrich payloads for
  // Bearer-authenticated (paid) callers, so authenticated responses must
  // never share a cache entry with anonymous ones.
  if (
    pathname === "/api/signals.json" ||
    pathname === "/api/signals.csv"
  ) {
    const hasAuth = Boolean(request.headers.get("authorization"));
    const feedResponse = NextResponse.next();
    if (!hasAuth) {
      feedResponse.headers.set(
        "Cache-Control",
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=600",
      );
    } else {
      feedResponse.headers.set(
        "Cache-Control",
        "private, no-store, max-age=0, must-revalidate",
      );
    }
    feedResponse.headers.set("Vary", "Authorization");
    return feedResponse;
  }

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/md/") ||
    pathname === "/md" ||
    pathname.startsWith("/jsonld/") ||
    pathname.endsWith(".xml") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".jsonl") ||
    pathname.endsWith(".txt") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp")
  ) {
    return NextResponse.next();
  }

  // Content negotiation: when an LLM/agent client sends `Accept: text/markdown`,
  // rewrite the request to the corresponding `/md/<path>` mirror (handled by
  // app/md/[...path]/route.ts and app/md/route.ts). Eliminates the need for
  // clients to know the mirror URL convention, they can hit the canonical URL
  // with the right Accept header instead.
  //
  // Only triggers for HTML page paths (the early skip above filters out
  // /api, /md, asset extensions, etc.). The mirror returns 404 markdown for
  // paths it doesn't have an alternate for, which is the correct answer for
  // an explicit text/markdown request.
  const acceptHeader = request.headers.get("accept") ?? "";
  if (/\btext\/markdown\b/i.test(acceptHeader)) {
    const trimmed = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    const targetPath = trimmed === "/" ? "/md" : `/md${trimmed}`;
    const rewriteUrl = new URL(targetPath, request.url);
    rewriteUrl.search = request.nextUrl.search;
    const mdResponse = NextResponse.rewrite(rewriteUrl);
    // CDN must keep separate cache entries per Accept variant so an HTML
    // client doesn't get the markdown payload (or vice-versa) from a shared
    // edge cache.
    mdResponse.headers.set("Vary", "Accept");
    // NOTE: Next.js overwrites this middleware-set Vary on the final response,
    // so it is belt-and-suspenders only. The authoritative "Vary": "Accept"
    // lives on the /md route handler Responses (app/md/route.ts and
    // app/md/[...path]/route.ts), which Next.js preserves.
    // Canonical still points to the HTML URL, markdown is an alternate
    // representation, not a competing page.
    const canonical = `${BASE_URL}${pathname}`;
    mdResponse.headers.set("Link", `<${canonical}>; rel="canonical"`);
    mdResponse.headers.set("X-Robots-Tag", robotsDirectiveFor(pathname));
    mdResponse.headers.set("Cache-Control", publicHtmlCacheControl(pathname));
    return mdResponse;
  }

  const ua = request.headers.get("user-agent");
  const detectedBot = detectAgentBot(ua);
  // `?format=agent` query param manually forces the agent variant, handy for
  // QA and for human reviewers checking the citation block.
  const queryOverride = request.nextUrl.searchParams.get("format") === "agent";
  const agentBotToken = detectedBot ?? (queryOverride ? "manual" : null);

  // Always forward the resolved pathname so route-level server components
  // can read it without their own access to NextRequest. Layout-level
  // components must NOT consume it via headers(), that forces site-wide
  // dynamic rendering (see BreadcrumbsSchema, now usePathname-based).
  // Combined with the agent-bot header when present.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  let response: NextResponse;
  if (agentBotToken) {
    requestHeaders.set("x-agent-bot", agentBotToken);
    response = NextResponse.next({ request: { headers: requestHeaders } });
    // Surface the same token on the response so log analysis can split on it
    // without re-parsing UA strings, and so any downstream proxy (Vercel CDN)
    // can vary cache behavior if we ever opt in.
    response.headers.set("X-Agent-Bot", agentBotToken);
    response.headers.set("Vary", "User-Agent");
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }

  const canonical = `${BASE_URL}${pathname}`;
  response.headers.set("Link", `<${canonical}>; rel="canonical"`);
  // Header-level robots directive must mirror per-page meta robots so a
  // crawler reading only headers (e.g. some image/preview fetchers) gets the
  // same indexing decision as one parsing the HTML.
  response.headers.set("X-Robots-Tag", robotsDirectiveFor(pathname));
  response.headers.set("Cache-Control", publicHtmlCacheControl(pathname));
  return response;
}

export const config = {
  matcher: [
    // Match everything except _next internals, api, and static asset-like paths
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
