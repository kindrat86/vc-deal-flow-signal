import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { detectAgentBot } from "@/lib/agent-bots";

const BASE_URL = "https://signals.gitdealflow.com";

/**
 * Add SEO + AI-crawler HTTP headers to every page response, and forward an
 * `x-agent-bot` request header so server components can render citation-tuned
 * additions (Speakable schema, AgentSummary blocks) when a known agent crawler
 * fetches the page.
 *
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

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/md/") ||
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

  const ua = request.headers.get("user-agent");
  const detectedBot = detectAgentBot(ua);
  // `?format=agent` query param manually forces the agent variant — handy for
  // QA and for human reviewers checking the citation block.
  const queryOverride = request.nextUrl.searchParams.get("format") === "agent";
  const agentBotToken = detectedBot ?? (queryOverride ? "manual" : null);

  let response: NextResponse;
  if (agentBotToken) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-agent-bot", agentBotToken);
    response = NextResponse.next({ request: { headers: requestHeaders } });
    // Surface the same token on the response so log analysis can split on it
    // without re-parsing UA strings, and so any downstream proxy (Vercel CDN)
    // can vary cache behavior if we ever opt in.
    response.headers.set("X-Agent-Bot", agentBotToken);
    response.headers.set("Vary", "User-Agent");
  } else {
    response = NextResponse.next();
  }

  const canonical = `${BASE_URL}${pathname}`;
  response.headers.set("Link", `<${canonical}>; rel="canonical"`);
  response.headers.set("X-Robots-Tag", "index, follow");
  return response;
}

export const config = {
  matcher: [
    // Match everything except _next internals, api, and static asset-like paths
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
