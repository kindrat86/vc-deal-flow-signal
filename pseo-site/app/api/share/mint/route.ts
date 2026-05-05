import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isAllowedOrigin } from "@/lib/validation";
import { makeShareIntents, type ShareKind } from "@/lib/share-url";

export const runtime = "nodejs";

const ALLOWED_KINDS: ShareKind[] = ["scout", "predict", "signal-card"];

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`share-mint:${ip}`, 30, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many share-link mints. Slow down." },
      { status: 429, headers: rateLimitHeaders(rl) },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const kind = String(body.kind || "signal-card") as ShareKind;
  if (!ALLOWED_KINDS.includes(kind)) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  const rawSharer = String(body.sharer || "anon");
  const sharer = rawSharer.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40) || "anon";

  const rawText = String(body.text || "");
  // Strip ASCII control chars + trim + cap length. Twitter intent caps at ~280 anyway.
  const text = rawText.replace(/[\x00-\x1F\x7F]/g, " ").trim().slice(0, 240);
  if (!text) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }

  try {
    const intents = makeShareIntents({ sharer, kind, text });
    return NextResponse.json(intents);
  } catch (err) {
    console.error("[share/mint] HMAC sign failed:", err);
    return NextResponse.json({ error: "Could not mint share link" }, { status: 500 });
  }
}
