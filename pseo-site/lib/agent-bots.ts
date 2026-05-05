/**
 * Known AI / agent crawler User-Agent tokens.
 *
 * Keep in sync with `app/robots.ts` AI_CRAWLERS — that file declares which bots
 * we explicitly allow; this file gives runtime code (proxy, route handlers,
 * analytics) a single source of truth for UA detection.
 */

export const AGENT_BOT_TOKENS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Applebot-Extended",
  "Amazonbot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "DuckAssistBot",
  "YouBot",
  "MistralAI-User",
  "Diffbot",
] as const;

export type AgentBotToken = (typeof AGENT_BOT_TOKENS)[number];

// Build a single case-insensitive regex that matches any token on a word boundary.
// Tokens with `-` are escaped explicitly (regex metachars are otherwise fine here).
const BOT_UA_PATTERN = new RegExp(
  `\\b(${AGENT_BOT_TOKENS.map((t) => t.replace(/[-]/g, "[-]")).join("|")})\\b`,
  "i",
);

/**
 * Returns the canonical bot token if the UA matches a known agent crawler,
 * otherwise null. Case-insensitive, anchored on word boundaries.
 */
export function detectAgentBot(userAgent: string | null | undefined): AgentBotToken | null {
  if (!userAgent) return null;
  const m = userAgent.match(BOT_UA_PATTERN);
  if (!m) return null;
  const matched = m[1].toLowerCase();
  const canonical = AGENT_BOT_TOKENS.find((t) => t.toLowerCase() === matched);
  return canonical ?? null;
}
