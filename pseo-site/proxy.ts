import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { detectAgentBot } from "@/lib/agent-bots";

const BASE_URL = "https://signals.gitdealflow.com";
const CANONICAL_HOST = "signals.gitdealflow.com";

/**
 * Path prefixes whose pages opt out of indexing via Next metadata
 * (`metadata.robots.index = false`). The proxy normally sets
 * `X-Robots-Tag: index, follow` as belt-and-suspenders, but for these paths
 * the header would override the per-page noindex meta — so we emit
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
];

function shouldNoindex(pathname: string): boolean {
  return NOINDEX_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function publicHtmlCacheControl(pathname: string): string {
  // Public marketing / pSEO pages are effectively static between deploys or
  // weekly data refreshes, so edge-cache them aggressively for crawlers and
  // humans. Keep noindex/account-like pages private below.
  if (shouldNoindex(pathname)) {
    return "private, no-cache, no-store, max-age=0, must-revalidate";
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
 * - **Canonical-host redirect** — non-apex hosts (e.g. `www.gitdealflow.com`,
 *   IDN aliases) are 308'd to the apex before any other logic. Defense-in-
 *   depth on top of Vercel's domain-level redirect (see memory entry
 *   `feedback_vercel_json_host_redirect_unreliable.md` — the platform-level
 *   rule has historically silently failed; this is the layer that survives).
 * - `x-pathname: <pathname>` — forwarded request header consumed by the
 *   site-wide `<BreadcrumbsSchema/>` server component to emit BreadcrumbList
 *   JSON-LD from the layout (closes audit gap "No site-wide BreadcrumbList").
 * - `Link: <canonical>; rel="canonical"` — explicit canonical for crawlers
 *   that skip HTML parsing (Google, Bing do read this).
 * - `X-Robots-Tag: index, follow` — belt-and-suspenders indexing directive.
 * - `x-agent-bot: <canonical-token>` — forwarded request header for downstream
 *   pages that opt into agent-aware rendering. Empty for normal browser UAs.
 *
 * Skipped for API routes and asset paths (they set their own headers).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  // clients to know the mirror URL convention — they can hit the canonical URL
  // with the right Accept header instead.
  //
  // Only triggers for HTML page paths (the early skip above filters out
  // /api, /md, asset extensions, etc.). The mirror returns 404 markdown for
  // paths it doesn't have an alternate for — which is the correct answer for
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
    // Canonical still points to the HTML URL — markdown is an alternate
    // representation, not a competing page.
    const canonical = `${BASE_URL}${pathname}`;
    mdResponse.headers.set("Link", `<${canonical}>; rel="canonical"`);
    mdResponse.headers.set(
      "X-Robots-Tag",
      shouldNoindex(pathname) ? "noindex, follow" : "index, follow",
    );
    mdResponse.headers.set("Cache-Control", publicHtmlCacheControl(pathname));
    return mdResponse;
  }

  const ua = request.headers.get("user-agent");
  const detectedBot = detectAgentBot(ua);
  // `?format=agent` query param manually forces the agent variant — handy for
  // QA and for human reviewers checking the citation block.
  const queryOverride = request.nextUrl.searchParams.get("format") === "agent";
  const agentBotToken = detectedBot ?? (queryOverride ? "manual" : null);

  // Always forward the resolved pathname so layout-level server components
  // (notably <BreadcrumbsSchema/>) can build URL-derived JSON-LD without
  // their own access to NextRequest. Combined with the agent-bot header when
  // present.
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
  response.headers.set(
    "X-Robots-Tag",
    shouldNoindex(pathname) ? "noindex, follow" : "index, follow",
  );
  response.headers.set("Cache-Control", publicHtmlCacheControl(pathname));
  return response;
}

export const config = {
  matcher: [
    // Match everything except _next internals, api, and static asset-like paths
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
