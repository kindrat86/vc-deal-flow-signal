/**
 * Minimal Telegram Bot API client.
 *
 * No external deps — raw fetch against api.telegram.org. We only use the
 * handful of methods the bot actually calls: sendMessage, answerInlineQuery,
 * setWebhook, setMyCommands.
 */

const API_BASE = "https://api.telegram.org";

export interface SendMessageOptions {
  chat_id: number | string;
  text: string;
  parse_mode?: "Markdown" | "MarkdownV2" | "HTML";
  disable_web_page_preview?: boolean;
  reply_markup?: unknown;
}

export interface InlineQueryResultArticle {
  type: "article";
  id: string;
  title: string;
  description?: string;
  url?: string;
  hide_url?: boolean;
  input_message_content: {
    message_text: string;
    parse_mode?: "Markdown" | "MarkdownV2" | "HTML";
    disable_web_page_preview?: boolean;
  };
  reply_markup?: unknown;
}

export interface AnswerInlineQueryOptions {
  inline_query_id: string;
  results: InlineQueryResultArticle[];
  cache_time?: number;
  is_personal?: boolean;
}

function botToken(): string {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error("TELEGRAM_BOT_TOKEN not set");
  return t;
}

async function call<T = unknown>(
  method: string,
  body: object,
): Promise<T> {
  const res = await fetch(`${API_BASE}/bot${botToken()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Telegram ${method} failed (${res.status}): ${text.slice(0, 200)}`,
    );
  }
  return (await res.json()) as T;
}

export async function sendMessage(opts: SendMessageOptions) {
  return call("sendMessage", opts);
}

export async function answerInlineQuery(opts: AnswerInlineQueryOptions) {
  return call("answerInlineQuery", opts);
}

export async function setWebhook(opts: {
  url: string;
  secret_token?: string;
  allowed_updates?: string[];
  drop_pending_updates?: boolean;
}) {
  return call("setWebhook", opts);
}

export async function setMyCommands(
  commands: Array<{ command: string; description: string }>,
) {
  return call("setMyCommands", { commands });
}

export async function getWebhookInfo() {
  return call<{ result: { url: string; pending_update_count: number } }>(
    "getWebhookInfo",
    {},
  );
}
