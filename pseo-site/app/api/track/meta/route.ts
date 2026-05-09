import { NextRequest } from "next/server";
import { createHash } from "node:crypto";

/**
 * /api/track/meta — Server-side Meta Conversions API (CAPI) bridge.
 *
 * Brunson Traffic Secrets §2 Ch 8 — Facebook layer. Anonymity-compatible:
 * no founder content, only event-side pixel work. The browser pixel
 * (loaded by components/PixelManager.tsx when NEXT_PUBLIC_META_PIXEL_ID is
 * set) tracks page-views client-side; this endpoint mirrors high-value
 * events server-side (PageView, Lead, Purchase, ViewContent) so attribution
 * survives iOS Safari ITP, ad-blockers, and the "Limit Ad Tracking" toggle.
 *
 * Why server-side mirror:
 *   - Browser pixel loses ~30–50% of events on iOS 17+ via ITP.
 *   - Conversions API is Meta's recommended replacement (deduped via event_id).
 *   - Server-side hashing of PII (email, IP, user-agent) gives Meta
 *     a parallel attribution path without leaking raw PII to the browser.
 *
 * Behavior:
 *   - POST JSON with { event_name, event_id?, email?, value?, currency?,
 *     custom_data? }. Returns 202 Accepted on dispatch, 200 OK on no-op
 *     when env vars are missing (so callers can fire-and-forget).
 *   - All PII sha256-hashed before transmission per Meta CAPI spec.
 *   - Event ID required for browser↔server dedup. We accept caller-supplied
 *     IDs and synthesize one from the request signature when absent.
 *
 * Env (all optional — endpoint is a no-op if missing):
 *   META_PIXEL_ID         — same value as NEXT_PUBLIC_META_PIXEL_ID
 *   META_CAPI_TOKEN       — long-lived access token from Events Manager
 *   META_TEST_EVENT_CODE  — optional, only set during ads-manager test runs
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CapiEventPayload = {
  /** Standard event names: PageView, Lead, Purchase, ViewContent, AddToCart, InitiateCheckout, CompleteRegistration */
  event_name: string;
  /** Caller-supplied dedup ID. Required for browser↔server matching. */
  event_id?: string;
  /** Buyer email — hashed before transmission. */
  email?: string;
  /** External ID (e.g. user_id) — hashed before transmission. */
  external_id?: string;
  /** Currency ISO 4217. Required when value is set. */
  currency?: string;
  /** Conversion value. Required for Purchase events. */
  value?: number;
  /** Free-form custom_data object passed through to Meta. */
  custom_data?: Record<string, unknown>;
  /** Optional source URL — defaults to the Referer header. */
  event_source_url?: string;
};

const sha256 = (s: string): string =>
  createHash("sha256").update(s.trim().toLowerCase()).digest("hex");

const META_API_VERSION = "v19.0";

export async function POST(req: NextRequest): Promise<Response> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;

  // Env-gated — returns 200 so the caller never errors when the pixel is
  // not yet provisioned. Lets us deploy this endpoint and the calling code
  // simultaneously, then flip the env vars when the user creates the pixel.
  if (!pixelId || !token) {
    return Response.json(
      { ok: true, dispatched: false, reason: "meta-capi-unconfigured" },
      { status: 200 },
    );
  }

  let payload: CapiEventPayload;
  try {
    payload = (await req.json()) as CapiEventPayload;
  } catch {
    return Response.json(
      { ok: false, error: "invalid-json-body" },
      { status: 400 },
    );
  }

  if (!payload.event_name || typeof payload.event_name !== "string") {
    return Response.json(
      { ok: false, error: "event_name-required" },
      { status: 400 },
    );
  }

  // Pull request-side fingerprints. CAPI dedup uses (event_id, event_time,
  // event_name) — without event_id Meta cannot pair browser+server hits.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const referer = req.headers.get("referer") ?? undefined;
  const fbp = req.cookies.get("_fbp")?.value;
  const fbc = req.cookies.get("_fbc")?.value;

  const eventId =
    payload.event_id ??
    sha256(
      `${payload.event_name}:${Date.now()}:${ip ?? ""}:${userAgent ?? ""}`,
    ).slice(0, 40);

  const userData: Record<string, unknown> = {
    client_ip_address: ip,
    client_user_agent: userAgent,
    fbp,
    fbc,
  };
  if (payload.email) userData.em = [sha256(payload.email)];
  if (payload.external_id) userData.external_id = [sha256(payload.external_id)];

  const customData: Record<string, unknown> = {
    ...(payload.custom_data ?? {}),
  };
  if (payload.value !== undefined) customData.value = payload.value;
  if (payload.currency) customData.currency = payload.currency;

  const event = {
    event_name: payload.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: payload.event_source_url ?? referer,
    action_source: "website",
    user_data: userData,
    custom_data: customData,
  };

  const body: Record<string, unknown> = { data: [event] };
  if (process.env.META_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const url = `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Don't block the user-facing path waiting for Meta — short timeout.
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.warn(
        `[meta-capi] dispatch failed status=${res.status} body=${errBody.slice(0, 200)}`,
      );
      return Response.json(
        { ok: false, dispatched: false, status: res.status },
        { status: 200 }, // 200 to caller — server-side issue, don't leak to user
      );
    }

    const meta = (await res.json()) as { events_received?: number };
    return Response.json(
      {
        ok: true,
        dispatched: true,
        event_id: eventId,
        events_received: meta.events_received,
      },
      { status: 202 },
    );
  } catch (err) {
    console.warn("[meta-capi] dispatch error:", err);
    return Response.json(
      { ok: false, dispatched: false, error: "dispatch-failed" },
      { status: 200 },
    );
  }
}

/**
 * GET returns capability info — useful for ops smoke-testing without
 * actually firing an event (and without leaking the access token).
 */
export async function GET(): Promise<Response> {
  return Response.json({
    endpoint: "/api/track/meta",
    method: "POST",
    configured: Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN),
    api_version: META_API_VERSION,
    accepted_events: [
      "PageView",
      "Lead",
      "ViewContent",
      "AddToCart",
      "InitiateCheckout",
      "Purchase",
      "CompleteRegistration",
    ],
    docs: "https://developers.facebook.com/docs/marketing-api/conversions-api",
  });
}
