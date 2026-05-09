import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";
import { isExcluded } from "@/lib/excluded-emails";

/**
 * /api/launch/raise-hand — Brunson DotCom Secrets Ch 22 audit fix
 * 2026-05-09 (push 94→100): pre-launch raise-your-hand list. Captures
 * email + segment(s) + buyer-archetype before any cart opens; when a
 * specific track's cart opens, only the buyers who raised their hand
 * for that track receive the launch email.
 *
 * Same shape as /api/summit/register — Resend audience-add tagged with
 * track + archetype attribution, no double-opt-in here (the user already
 * landed on /launch by intent, not by accident). The hourly Resend →
 * PocketBase sync decodes the gdf-attr-v1 marker and routes per-track
 * cart-open emails accordingly.
 *
 * Mirrors the existing summit-register pattern exactly: Node.js runtime,
 * formData OR JSON body, 303 redirect on success, soft-success on
 * already-exists (Resend 422), excluded-email list bypasses Resend.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const SITE_URL = process.env.SITE_URL || "https://signals.gitdealflow.com";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RaiseHandPayload {
  email: string;
  tracks: string[];
  archetype: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const VALID_TRACKS = new Set([
  "agent-credits",
  "sector-sweep",
  "charter-cohort",
]);

const VALID_ARCHETYPES = new Set([
  "solo-angel",
  "fund-partner",
  "operator",
  "builder",
  "other",
]);

async function parsePayload(req: Request): Promise<RaiseHandPayload> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = (await req.json()) as Partial<RaiseHandPayload>;
    return {
      email: (body.email || "").trim().toLowerCase(),
      tracks: Array.isArray(body.tracks)
        ? body.tracks.filter((t) => VALID_TRACKS.has(t))
        : [],
      archetype: VALID_ARCHETYPES.has(body.archetype || "")
        ? (body.archetype as string)
        : "other",
      utm_source: body.utm_source || "launch-index",
      utm_medium: body.utm_medium || "organic",
      utm_campaign: body.utm_campaign || "raise-hand-2026",
    };
  }
  const form = await req.formData();
  const tracks = form
    .getAll("tracks")
    .map((v) => String(v))
    .filter((t) => VALID_TRACKS.has(t));
  const arch = String(form.get("archetype") || "other");
  return {
    email: String(form.get("email") || "").trim().toLowerCase(),
    tracks,
    archetype: VALID_ARCHETYPES.has(arch) ? arch : "other",
    utm_source: String(form.get("utm_source") || "launch-index"),
    utm_medium: String(form.get("utm_medium") || "organic"),
    utm_campaign: String(form.get("utm_campaign") || "raise-hand-2026"),
  };
}

async function addToAudience(payload: RaiseHandPayload): Promise<{ ok: boolean; reason?: string }> {
  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    return { ok: true, reason: "no-resend-config" };
  }

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: payload.email,
          // Attribution packed into first_name — same gdf-attr-v1 marker
          // the existing /api/verify and /api/summit/register endpoints
          // use. The hourly Resend → PocketBase sync decodes it.
          first_name:
            "gdf-attr-v1:" +
            JSON.stringify({
              source: "launch-raise-hand",
              tracks: payload.tracks,
              archetype: payload.archetype,
              utm_source: payload.utm_source,
              utm_medium: payload.utm_medium,
              utm_campaign: payload.utm_campaign,
            }),
          unsubscribed: false,
        }),
      }
    );
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      // 422 typically means contact already exists — count as success.
      if (res.status === 422) return { ok: true, reason: "already-exists" };
      return { ok: false, reason: `resend-${res.status}: ${txt.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "fetch-failed",
    };
  }
}

export async function POST(req: Request) {
  const payload = await parsePayload(req);

  if (!payload.email || !isValidEmail(payload.email)) {
    console.warn("[launch/raise-hand] invalid email", {
      utm_campaign: payload.utm_campaign,
    });
    const url = new URL(`${SITE_URL}/launch`);
    url.searchParams.set("error", "invalid-email");
    return NextResponse.redirect(url, { status: 303 });
  }

  // Excluded-email skip-list (testers, sales QA, known bots).
  if (isExcluded(payload.email)) {
    const url = new URL(`${SITE_URL}/launch`);
    url.searchParams.set("status", "raised");
    return NextResponse.redirect(url, { status: 303 });
  }

  const ct = req.headers.get("content-type") || "";
  const result = await addToAudience(payload);

  if (ct.includes("application/json")) {
    return NextResponse.json(
      { ok: result.ok, reason: result.reason, tracks: payload.tracks },
      { status: result.ok ? 200 : 500 }
    );
  }

  if (!result.ok) {
    console.error("[launch/raise-hand] audience-add failed", {
      reason: result.reason,
      tracks: payload.tracks,
    });
    const url = new URL(`${SITE_URL}/launch`);
    url.searchParams.set("error", "raise-hand-failed");
    return NextResponse.redirect(url, { status: 303 });
  }

  console.info("[launch/raise-hand] hand raised", {
    tracks: payload.tracks,
    archetype: payload.archetype,
    utm_campaign: payload.utm_campaign,
    reason: result.reason || "ok",
  });
  const url = new URL(`${SITE_URL}/launch`);
  url.searchParams.set("status", "raised");
  return NextResponse.redirect(url, { status: 303 });
}

export async function GET() {
  return NextResponse.json(
    {
      endpoint: "/api/launch/raise-hand",
      method: "POST",
      body: "email (required), tracks[] (one or more of: agent-credits | sector-sweep | charter-cohort), archetype (solo-angel | fund-partner | operator | builder | other), utm_source, utm_medium, utm_campaign",
      contentType:
        "application/x-www-form-urlencoded (multi-checkbox 'tracks') or application/json",
      success:
        "303 redirect to /launch?status=raised (form), or 200 JSON {ok:true}",
      tracks: ["agent-credits", "sector-sweep", "charter-cohort"],
      archetypes: [
        "solo-angel",
        "fund-partner",
        "operator",
        "builder",
        "other",
      ],
    },
    { status: 200 }
  );
}
