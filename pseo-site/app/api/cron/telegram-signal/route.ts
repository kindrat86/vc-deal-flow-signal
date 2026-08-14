/**
 * Signal of the Week, Telegram channel broadcast cron.
 *
 * Invoked by Vercel Cron every Sunday (see vercel.json). Builds the weekly
 * "Signal of the Week" post from the current #1 mover
 * (getTopMoversThisWeek(1)) and posts it to the free Telegram channel via the
 * bot. Automates the manual cadence documented in
 * marketing/telegram-community.md.
 *
 * Auth:
 *   - Production: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`.
 *     Without that header (or with the wrong secret), the route 401s.
 *   - Local + manual: `?dry=1` skips both auth and the Telegram send,
 *     returning the rendered post as JSON.
 *
 * Test surfaces:
 *   - GET /api/cron/telegram-signal?dry=1           → JSON, no send, no auth
 *   - GET /api/cron/telegram-signal?chat=<id|@name> → post to a test chat
 *                                                     (auth) instead of the
 *                                                     channel
 *   - GET /api/cron/telegram-signal                 → post to the channel
 *                                                     (auth)
 *
 * Env:
 *   TELEGRAM_BOT_TOKEN , bot token from @BotFather (shared with the webhook).
 *   TELEGRAM_CHANNEL_ID, target channel: numeric id (e.g. -1001234567890) or
 *                         @publicusername. The bot must be a channel admin
 *                         with "Post messages". See docs/telegram-bot-setup.md.
 *   CRON_SECRET        , shared Vercel Cron bearer secret.
 */

import { NextResponse } from "next/server";
import { getTopMoversThisWeek, getAllSectors } from "@/lib/data";
import { buildSignalOfTheWeek } from "@/lib/telegram/signal-of-the-week";
import { sendMessage } from "@/lib/telegram/api-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";
  const chatOverride = url.searchParams.get("chat");

  // Build the post regardless of mode so schedule misfires are debuggable
  // from logs even when auth fails.
  const movers = getTopMoversThisWeek(1);
  const topMover = movers.length > 0 ? movers[0] : null;
  const totalSectors = getAllSectors().length;
  const post = topMover ? buildSignalOfTheWeek(topMover, totalSectors) : null;

  // Dry run: no auth, no send.
  if (dry) {
    return NextResponse.json({
      ok: true,
      mode: "dry",
      hasMover: Boolean(topMover),
      ...(post ?? {}),
    });
  }

  // Cron + manual paths require Vercel cron auth.
  if (!CRON_SECRET) {
    console.error("[telegram-signal] CRON_SECRET not configured");
    return new Response("Cron secret not configured", { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("[telegram-signal] TELEGRAM_BOT_TOKEN not configured");
    return new Response("Telegram bot token not configured", { status: 500 });
  }

  // chat override (manual test) wins over the configured channel.
  const target = chatOverride ?? process.env.TELEGRAM_CHANNEL_ID;
  if (!target) {
    console.error("[telegram-signal] TELEGRAM_CHANNEL_ID not configured");
    return new Response("Telegram channel id not configured", { status: 500 });
  }

  // No qualifying mover this week → skip rather than post an empty signal.
  if (!post) {
    console.warn("[telegram-signal] no qualifying mover, skipping post");
    return NextResponse.json({ ok: true, mode: "skipped", reason: "no-mover" });
  }

  try {
    await sendMessage({
      chat_id: target,
      text: post.text,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    });
  } catch (err) {
    console.error("[telegram-signal] send failed:", err);
    return NextResponse.json(
      { ok: false, mode: "broadcast", target, error: String(err) },
      { status: 502 },
    );
  }

  console.info(
    `[telegram-signal] posted Signal of the Week (org=${post.org}, sector=${post.sectorName}) → ${target}`,
  );
  return NextResponse.json({
    ok: true,
    mode: chatOverride ? "test" : "broadcast",
    target,
    org: post.org,
    sectorName: post.sectorName,
  });
}
