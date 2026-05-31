import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";
import { isExcluded } from "@/lib/excluded-emails";

/**
 * Summit Free Pass registration endpoint — Brunson DotCom Ch 16 (Summit Funnel).
 *
 * Handles two body shapes:
 *  - application/x-www-form-urlencoded (HTML form POST from /summit#register)
 *  - application/json (programmatic registration from agent integrations)
 *
 * The summit registration is a Resend audience-add tagged with utm_campaign=
 * summit-2026-05. The existing /api/verify drip catches the cohort, and the
 * standard SOAP_OPERA + CHALLENGE sequences resume on Day 0 — we don't need
 * a separate summit-specific drip because the summit landing copy + the
 * per-day talk-unlock cron (separate cron) carries the cohort-specific
 * communication.
 *
 * On success, redirects to /summit/thanks. On invalid email, redirects back
 * to /summit#register with an error query param so the form can re-render
 * with a message (the page itself only renders the static squeeze; the
 * error UI is acceptable as a soft fallback).
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const SITE_URL = process.env.SITE_URL || "https://signals.gitdealflow.com";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RegisterPayload {
  email: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
}

async function parsePayload(req: Request): Promise<RegisterPayload> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = (await req.json()) as Partial<RegisterPayload>;
    return {
      email: (body.email || "").trim().toLowerCase(),
      utm_source: body.utm_source || "summit",
      utm_medium: body.utm_medium || "organic",
      utm_campaign: body.utm_campaign || "summit-2026-05",
      referrer: body.referrer,
    };
  }
  const form = await req.formData();
  return {
    email: String(form.get("email") || "").trim().toLowerCase(),
    utm_source: String(form.get("utm_source") || "summit"),
    utm_medium: String(form.get("utm_medium") || "organic"),
    utm_campaign: String(form.get("utm_campaign") || "summit-2026-05"),
    referrer: String(form.get("referrer") || ""),
  };
}

async function addToAudience(payload: RegisterPayload): Promise<{ ok: boolean; reason?: string }> {
  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    // Soft-fail when env not wired — the form still redirects to /thanks.
    // Real audience-add happens in /api/verify which has the full token
    // + nonce + double-opt-in flow. This endpoint is the lighter "register"
    // surface for the summit; the full DOI happens via the verify email.
    return { ok: true, reason: "no-resend-config" };
  }

  // Resend audiences API — POST /audiences/{id}/contacts
  // https://resend.com/docs/api-reference/audiences/add-contact
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
          // Pack attribution into first_name (consistent with /api/verify
          // pattern). The hourly Resend → PocketBase sync recognises the
          // "gdf-attr-v1:" marker and decodes it.
          first_name:
            "gdf-attr-v1:" +
            JSON.stringify({
              source: "summit-register",
              utm_source: payload.utm_source,
              utm_medium: payload.utm_medium,
              utm_campaign: payload.utm_campaign,
              referrer: payload.referrer || "",
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
    console.warn("[summit/register] invalid email submitted", {
      utm_campaign: payload.utm_campaign,
    });
    const url = new URL(`${SITE_URL}/summit`);
    url.searchParams.set("error", "invalid-email");
    url.hash = "register";
    return NextResponse.redirect(url, { status: 303 });
  }

  // Skip-list (testers, sales QA, bots) — registration succeeds visually
  // but no audience-add. Same pattern as elsewhere in the codebase.
  if (isExcluded(payload.email)) {
    return NextResponse.redirect(`${SITE_URL}/summit/thanks`, { status: 303 });
  }

  const ct = req.headers.get("content-type") || "";
  const result = await addToAudience(payload);

  if (ct.includes("application/json")) {
    return NextResponse.json(
      { ok: result.ok, reason: result.reason },
      { status: result.ok ? 200 : 500 }
    );
  }

  // HTML form POST → redirect to thanks page on success, back to form on failure.
  if (!result.ok) {
    console.error("[summit/register] audience-add failed", {
      reason: result.reason,
      utm_campaign: payload.utm_campaign,
    });
    const url = new URL(`${SITE_URL}/summit`);
    url.searchParams.set("error", "register-failed");
    url.hash = "register";
    return NextResponse.redirect(url, { status: 303 });
  }
  console.info("[summit/register] registered", {
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
    utm_campaign: payload.utm_campaign,
    reason: result.reason || "ok",
  });
  return NextResponse.redirect(`${SITE_URL}/summit/thanks`, { status: 303 });
}

export async function GET() {
  return NextResponse.json(
    {
      endpoint: "/api/summit/register",
      method: "POST",
      body: "email (required), utm_source, utm_medium, utm_campaign, referrer",
      contentType: "application/x-www-form-urlencoded or application/json",
      success: "303 redirect to /summit/thanks (form), or 200 JSON {ok:true}",
    },
    { status: 200 }
  );
}
