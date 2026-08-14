/**
 * Telegram webhook entry point.
 *
 * Telegram POSTs an Update object here on every message/inline-query the
 * bot sees. We verify the X-Telegram-Bot-Api-Secret-Token header against
 * TELEGRAM_WEBHOOK_SECRET, route to the dispatcher, and always reply 200
 * (Telegram retries 4xx/5xx which causes duplicate sends).
 *
 * Setup: see pseo-site/docs/telegram-bot-setup.md
 *
 * Env:
 *   TELEGRAM_BOT_TOKEN    , bot token from @BotFather
 *   TELEGRAM_WEBHOOK_SECRET, random string set at setWebhook time
 */

import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import {
  handleMessage,
  handleInlineQuery,
  type TelegramMessage,
  type TelegramInlineQuery,
} from "@/lib/telegram/dispatch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  inline_query?: TelegramInlineQuery;
}

function verifySecret(req: Request): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) {
    // Secret not configured → reject all writes to avoid an open relay
    return false;
  }
  const got = req.headers.get("x-telegram-bot-api-secret-token");
  return typeof got === "string" && got === expected;
}

export async function POST(req: Request) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    // Webhook hit before env vars are configured. Return 200 so Telegram
    // doesn't retry forever; log to stderr so the misconfig is visible.
    console.error("[telegram] TELEGRAM_BOT_TOKEN missing, dropping update");
    return NextResponse.json({ ok: true, dropped: "no-token" });
  }
  if (!verifySecret(req)) {
    return NextResponse.json({ ok: false, error: "bad secret" }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  // Fire-and-forget the dispatch. Telegram retries on slow / non-200
  // responses, which causes duplicate sends. With waitUntil we ack in
  // ~10ms and finish the Telegram API call after the response closes.
  waitUntil(
    (async () => {
      try {
        if (update.message) {
          await handleMessage(update.message);
        } else if (update.inline_query) {
          await handleInlineQuery(update.inline_query);
        }
        // edited_message + other update types are intentionally no-op
      } catch (err) {
        console.error("[telegram] dispatch error", err);
      }
    })(),
  );

  return NextResponse.json({ ok: true });
}

// GET is handy for a quick "is the route live?" check from a browser
export async function GET() {
  const hasToken = Boolean(process.env.TELEGRAM_BOT_TOKEN);
  const hasSecret = Boolean(process.env.TELEGRAM_WEBHOOK_SECRET);
  return NextResponse.json({
    ok: true,
    route: "/api/telegram",
    env: { TELEGRAM_BOT_TOKEN: hasToken, TELEGRAM_WEBHOOK_SECRET: hasSecret },
    docs: "https://signals.gitdealflow.com/docs/telegram-bot-setup",
  });
}
