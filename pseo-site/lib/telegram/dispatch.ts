/**
 * Telegram bot command dispatch.
 *
 * Takes a parsed update payload from Telegram and decides what to send back.
 * Two entry points:
 *   - handleMessage(update.message)     , regular /command messages
 *   - handleInlineQuery(update.inline_query), typed @botname queries in any chat
 *
 * All replies are emitted as HTML (parse_mode: "HTML") so we only have to
 * escape <, >, & once at send time. Bold/italic/code come from a tiny
 * markdown-to-html converter applied to calc output strings.
 */

import {
  calcSafe,
  calcRunway,
  calcBurnMultiple,
  calcMagicNumber,
  calcCacPayback,
  calcLtv,
  calcQuickRatio,
  calcDilutionStack,
  TOOLS_INDEX,
  type CalcResult,
} from "./calcs";
import { searchGlossary, defineUrl } from "./glossary-search";
import { glossaryTerms } from "@/content/glossary";

const GLOSSARY_COUNT = glossaryTerms.length;
import {
  sendMessage,
  answerInlineQuery,
  type InlineQueryResultArticle,
} from "./api-client";

const SITE = "https://signals.gitdealflow.com";

// ── markdown → HTML (Telegram parse_mode: HTML) ────────────────────────────

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function mdToHtml(md: string): string {
  // Escape first, then re-introduce formatting tags so attacker-controlled
  // text in `md` can't inject raw HTML.
  let out = escapeHtml(md);
  out = out.replace(/\*([^*\n]+)\*/g, "<b>$1</b>");
  out = out.replace(/_([^_\n]+)_/g, "<i>$1</i>");
  out = out.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  return out;
}

function withDeepLink(result: CalcResult): string {
  if (!result.deepLink) return mdToHtml(result.body);
  // Append a "🔗 Open in browser" link below the calc body.
  return `${mdToHtml(result.body)}\n\n🔗 <a href="${escapeHtml(result.deepLink)}">Open with these values</a>`;
}

// ── command parser ─────────────────────────────────────────────────────────

interface ParsedCommand {
  cmd: string;
  args: string[];
}

function parseCommand(text: string): ParsedCommand | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith("/")) return null;
  // Strip @botname suffix that group chats append: "/safe@MyBot 50k"
  const tokens = trimmed.split(/\s+/);
  const head = tokens[0].split("@")[0]; // "/safe"
  const cmd = head.slice(1).toLowerCase();
  return { cmd, args: tokens.slice(1) };
}

// ── static replies ─────────────────────────────────────────────────────────

const START_REPLY = `
<b>VC Deal Flow Signal Bot</b>

Free VC + founder calculators and the full glossary, in any chat.

<b>Calculators</b>: type /tools to see all 8
• /safe, SAFE conversion + dilution
• /runway, cash runway
• /burn, burn multiple
• /magic, magic number
• /cac, CAC payback
• /ltv, customer LTV
• /quick, quick ratio
• /dilution, multi-SAFE + Series A stack

<b>Glossary</b>
• /define &lt;term&gt;, define a VC term
• /glossary, browse all ${GLOSSARY_COUNT} terms

<b>Inline mode</b>
Type <code>@gitdealflow_bot &lt;query&gt;</code> in any chat to search the glossary without joining the bot.

Source &amp; methodology: <a href="${SITE}">${SITE}</a>
Educational tool, not legal/tax/investment advice.
`.trim();

const HELP_REPLY = START_REPLY;

function toolsListReply(): string {
  const rows = TOOLS_INDEX.map(
    (t) => `${t.cmd}, <a href="${escapeHtml(t.url)}">${escapeHtml(t.name)}</a>`,
  ).join("\n");
  return `<b>8 free calculators</b>\n${rows}\n\nType the command (e.g. <code>/safe 50k 5m 20</code>) to compute inline.`;
}

function glossaryReply(): string {
  return `Browse all ${GLOSSARY_COUNT} VC terms with full definitions, examples, and JSON-LD:\n<a href="${SITE}/glossary">${SITE}/glossary</a>\n\nOr type <code>/define &lt;term&gt;</code> to look one up here.`;
}

// ── /define handler ────────────────────────────────────────────────────────

function defineReply(args: string[]): string {
  if (args.length === 0) {
    return `Usage: <code>/define &lt;term&gt;</code>\nExample: <code>/define safe</code>\n\nOr browse all ${GLOSSARY_COUNT} terms: <a href="${SITE}/glossary">${SITE}/glossary</a>`;
  }
  const query = args.join(" ");
  const hits = searchGlossary(query, 3);
  if (hits.length === 0) {
    // Common SaaS metrics live in /tools rather than the glossary -
    // nudge the user there instead of a flat "not found".
    const toolHint = /\b(burn|cac|ltv|magic|quick|payback|runway|safe|dilution)\b/i.test(
      query,
    )
      ? `\n\nLooks like a metric, try <code>/tools</code> for the calculators.`
      : "";
    return `No glossary match for <b>${escapeHtml(query)}</b>.${toolHint}\nBrowse all ${GLOSSARY_COUNT} terms: <a href="${SITE}/glossary">${SITE}/glossary</a>`;
  }
  const top = hits[0];
  const more =
    hits.length > 1
      ? `\n\n<i>Also matched:</i> ${hits.slice(1).map((h) => `<a href="${escapeHtml(h.url)}">${escapeHtml(h.term.term)}</a>`).join(", ")}`
      : "";
  const definition = top.term.definition.slice(0, 700);
  const truncated = top.term.definition.length > 700 ? "…" : "";
  return `<b>${escapeHtml(top.term.term)}</b>\n\n${escapeHtml(definition)}${truncated}\n\n🔗 <a href="${escapeHtml(top.url)}">Full definition</a>${more}`;
}

// ── message handler ────────────────────────────────────────────────────────

export interface TelegramMessage {
  message_id: number;
  chat: { id: number };
  from?: { id: number; username?: string };
  text?: string;
}

export interface MessageHandlerResult {
  /** Body to send. If null, we don't reply. */
  text: string | null;
  /** Chat to reply to. */
  chat_id?: number;
}

export function buildMessageReply(
  message: TelegramMessage,
): MessageHandlerResult {
  const text = message.text;
  if (!text) return { text: null };
  const parsed = parseCommand(text);
  if (!parsed) {
    // Non-command in DM → gentle hint. Skip in groups (would be noisy).
    return { text: null };
  }
  const { cmd, args } = parsed;

  let body: string;
  switch (cmd) {
    case "start":
      body = START_REPLY;
      break;
    case "help":
      body = HELP_REPLY;
      break;
    case "tools":
      body = toolsListReply();
      break;
    case "glossary":
      body = glossaryReply();
      break;
    case "define":
      body = defineReply(args);
      break;
    case "safe":
      body = withDeepLink(calcSafe(args));
      break;
    case "runway":
      body = withDeepLink(calcRunway(args));
      break;
    case "burn":
    case "burnmultiple":
    case "burn_multiple":
      body = withDeepLink(calcBurnMultiple(args));
      break;
    case "magic":
    case "magicnumber":
      body = withDeepLink(calcMagicNumber(args));
      break;
    case "cac":
    case "cacpayback":
      body = withDeepLink(calcCacPayback(args));
      break;
    case "ltv":
      body = withDeepLink(calcLtv(args));
      break;
    case "quick":
    case "quickratio":
      body = withDeepLink(calcQuickRatio(args));
      break;
    case "dilution":
    case "dilutionstack":
      body = withDeepLink(calcDilutionStack());
      break;
    default:
      // Unknown command, quietly ignore in groups to avoid noise. In DMs,
      // Telegram doesn't expose a chat type field reliably from message_id
      // alone; we conservatively no-op.
      return { text: null };
  }

  return { text: body, chat_id: message.chat.id };
}

export async function handleMessage(message: TelegramMessage): Promise<void> {
  const { text, chat_id } = buildMessageReply(message);
  if (!text || !chat_id) return;
  await sendMessage({
    chat_id,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: false,
  });
}

// ── inline-query handler (in-any-chat distribution) ────────────────────────

export interface TelegramInlineQuery {
  id: string;
  from: { id: number; username?: string };
  query: string;
}

export function buildInlineResults(
  query: string,
): InlineQueryResultArticle[] {
  const q = query.trim();
  if (!q) {
    // Empty query, show a "type to search" hint
    return [
      {
        type: "article",
        id: "hint",
        title: "Type a VC term to search",
        description: "e.g. SAFE, ARR, burn multiple, dilution",
        input_message_content: {
          message_text: `Search the VC Deal Flow Signal glossary: ${SITE}/glossary`,
          parse_mode: "HTML",
        },
      },
    ];
  }
  const hits = searchGlossary(q, 8);
  if (hits.length === 0) {
    return [
      {
        type: "article",
        id: "no-match",
        title: `No match for "${q}"`,
        description: `Browse all ${GLOSSARY_COUNT} terms`,
        url: `${SITE}/glossary`,
        input_message_content: {
          message_text: `No glossary match for <b>${escapeHtml(q)}</b>. Browse: <a href="${SITE}/glossary">${SITE}/glossary</a>`,
          parse_mode: "HTML",
        },
      },
    ];
  }
  return hits.map((h, idx) => {
    const preview = h.term.definition.slice(0, 110);
    return {
      type: "article",
      id: `t-${h.term.id}-${idx}`,
      title: h.term.term,
      description: preview + (h.term.definition.length > 110 ? "…" : ""),
      url: h.url,
      input_message_content: {
        message_text: `<b>${escapeHtml(h.term.term)}</b>\n\n${escapeHtml(h.term.definition.slice(0, 700))}${h.term.definition.length > 700 ? "…" : ""}\n\n🔗 <a href="${escapeHtml(h.url)}">Full definition</a>`,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      },
    };
  });
}

export async function handleInlineQuery(
  iq: TelegramInlineQuery,
): Promise<void> {
  const results = buildInlineResults(iq.query);
  await answerInlineQuery({
    inline_query_id: iq.id,
    results,
    // Inline glossary results are not user-specific → cache aggressively
    cache_time: 300,
    is_personal: false,
  });
}

// expose for tests
export { parseCommand, defineUrl };
