/**
 * Server-side analytics for the agent-programmable surfaces (MCP, A2A, NLWeb,
 * function-calling API). Emits a dedicated `agent_request` PostHog event so
 * the north-star can track "assistant-originated traffic" as its OWN source,
 * distinct from AI-search referral (humans arriving from ChatGPT/Perplexity)
 * and from `bot_crawl` (crawlers reading content).
 *
 * Classification (`client_class`): directory crawlers and self-monitoring
 * probes hit these surfaces constantly (mcpbeat, agent-tools.cloud, our own
 * health checks). Those are distribution signal, NOT product adoption; the
 * north-star headline counts only `client_class='agent'` (real SDK/agent
 * invocation) and reports the excluded classes separately for transparency.
 */
import { detectAgentBot } from "@/lib/agent-bots";

const POSTHOG_KEY = "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX";
const POSTHOG_CAPTURE = "https://eu.i.posthog.com/capture/";

export type AgentSurface = "mcp" | "a2a" | "nlweb" | "function_api";
export type ClientClass = "agent" | "directory" | "monitor";

// Directory crawlers + liveness checkers that probe the surfaces for listing/
// liveness. Measured 2026-08-16: mcpbeat (980/90d), agent-tools.cloud (165),
// AgentIndexBot, mcp-scraper, archive.org_bot dominate /api/mcp/rpc volume.
const DIRECTORY_CRAWLER_TOKENS: readonly string[] = [
  "mcpbeat",
  "agent-tools.cloud",
  "agentindexbot",
  "mcp-scraper",
  "mcp-cloud.ai",
  "traderszone",
  "archive.org_bot",
];

// Self-monitoring: our own uptime/watchdog/probe UAs. Not adoption.
const SELF_MONITOR_TOKENS: readonly string[] = [
  "gitdealflow-",
  "gdf-",
  "uptimebot",
  "healthcheck",
  "health-check",
  "uptime-kuma",
  "watchdog",
];

export function classifyAgentClient(
  userAgent: string | null | undefined
): ClientClass {
  const ua = (userAgent || "").toLowerCase();
  if (!ua) return "agent";
  for (const t of SELF_MONITOR_TOKENS) {
    if (ua.includes(t)) return "monitor";
  }
  for (const t of DIRECTORY_CRAWLER_TOKENS) {
    if (ua.includes(t)) return "directory";
  }
  return "agent";
}

/**
 * Fire-and-forget capture of one agent-surface request. Never blocks, throws,
 * or slows the caller (mirrors proxy.ts captureBotCrawl). Called with `void`
 * from the route handlers.
 */
export async function captureAgentRequest(
  surface: AgentSurface,
  request: Request
): Promise<void> {
  const ua = (request.headers.get("user-agent") || "").slice(0, 512);
  const url = new URL(request.url);
  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const clientClass = classifyAgentClient(ua);
  const agentFamily = detectAgentBot(ua) ?? "";

  // Stable distinct_id per (surface, IP) so countDistinct(distinct_id) is a
  // reasonable "distinct agent instances per surface" proxy (API clients carry
  // no cookies, so a per-request UUID would make every call look distinct).
  const distinctId = `agent:${surface}:${ip || "unknown"}`;

  const payload = {
    api_key: POSTHOG_KEY,
    event: "agent_request",
    distinct_id: distinctId,
    properties: {
      surface,
      client_class: clientClass,
      agent_family: agentFamily,
      path: url.pathname,
      method: request.method,
      user_agent: ua,
      $ip: ip,
      source: "agent-api",
      host: url.host,
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
    // Best-effort analytics: never fail or slow the agent request.
  } finally {
    clearTimeout(timer);
  }
}
