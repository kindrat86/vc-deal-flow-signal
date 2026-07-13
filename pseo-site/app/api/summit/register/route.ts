import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";
import { isExcluded } from "@/lib/excluded-emails";
import { getClientIp } from "@/lib/rate-limit";

/**
 * Summit Free Pass registration endpoint — Brunson DotCom Ch 16 (Summit Funnel).
 *
 * Handles two body shapes:
 *  - application/x-www-form-urlencoded (HTML form POST from /summit#register)
 *  - application/json (programmatic registration from agent integrations)
 *
 * Registration is routed through the standard double-opt-in pipeline: an
 * internal POST to /api/subscribe with source:"summit-register" sends the
 * verification email, and the /api/verify click performs the Resend
 * audience-add AND schedules the Soap Opera Sequence (29-day split +
 * deferred drip_plan). Previously this endpoint did a single-opt-in
 * audience-add with NO sequence — the comment claiming /api/verify "catches
 * the cohort" was false, because nothing ever sent the verify email.
 *
 * On success, redirects to /summit/thanks (registrant must click the
 * confirmation email to finish). On invalid email, redirects back to
 * /summit#register with an error query param.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
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

async function startDoubleOptIn(
  payload: RegisterPayload,
  clientIp: string,
): Promise<{ ok: boolean; reason?: string }> {
  if (!RESEND_API_KEY) {
    // Hard-fail when env not wired: without Resend there is no verification
    // email, no audience-add, and no sequence — pretending success would
    // silently drop the registrant.
    return { ok: false, reason: "no-resend-config" };
  }

  // Internal POST to /api/subscribe — the canonical capture pipeline. It
  // sends the double-opt-in verification email; the /api/verify click then
  // does the audience-add (with gdf-attr-v1 attribution) and schedules the
  // Soap Opera Sequence with the 29-day immediate/deferred split.
  try {
    const res = await fetch(`${SITE_URL}/api/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward the real client IP so /api/subscribe rate-limits the
        // registrant, not this server-side hop.
        ...(clientIp && clientIp !== "unknown"
          ? { "x-forwarded-for": clientIp }
          : {}),
      },
      body: JSON.stringify({
        email: payload.email,
        source: "summit-register",
        utm_source: payload.utm_source || "summit",
        utm_medium: payload.utm_medium || "organic",
        utm_campaign: payload.utm_campaign || "summit-2026-05",
        referrer: payload.referrer || "",
        landing_path: "/summit",
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return {
        ok: false,
        reason: `subscribe-${res.status}: ${txt.slice(0, 200)}`,
      };
    }
    return { ok: true, reason: "verification-email-sent" };
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
  const result = await startDoubleOptIn(payload, getClientIp(req));

  if (ct.includes("application/json")) {
    return NextResponse.json(
      { ok: result.ok, reason: result.reason },
      { status: result.ok ? 200 : 500 }
    );
  }

  // HTML form POST → redirect to thanks page on success, back to form on failure.
  if (!result.ok) {
    console.error("[summit/register] double-opt-in dispatch failed", {
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
      success:
        "303 redirect to /summit/thanks (form), or 200 JSON {ok:true}. Sends a double-opt-in verification email; confirmation finishes registration.",
    },
    { status: 200 }
  );
}
