/**
 * Route Canary cron — invoked by Vercel Cron at 06:00 UTC daily.
 *
 * Curls every entry in CANONICAL_PROD_ROUTES against the live prod
 * alias (https://signals.gitdealflow.com) and verifies each returns
 * 2xx. Any non-2xx triggers a Resend email to signal@gitdealflow.com
 * with the regression list.
 *
 * Why this exists — `feedback_unmerged_branch_overwrites_prod.md`.
 * Twice in 24h on 2026-05-06 a `vercel deploy --prod` fired from a
 * source tree missing recently-merged commits, silently 404'd entire
 * batches of routes (Book Funnel + V7 launch the first time, V8/V9
 * cart funnel the second), and aliased over the good deploy. With
 * no automated probe, both incidents were caught only by the next
 * autonomous-session audit hours later. This cron closes that loop:
 * the next 404 batch lands within 24 h instead of "whenever someone
 * notices."
 *
 * Auth:
 *   - Production: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`.
 *     Without it (or with the wrong secret), the route 401s.
 *   - Local + manual: `?dry=1` skips both auth and Resend, returning
 *     the per-route status table as JSON.
 *
 * Test surfaces:
 *   - GET /api/cron/route-canary?dry=1   → JSON, no send, no auth
 *   - GET /api/cron/route-canary         → cron mode (auth required)
 *
 * Status codes returned by THIS endpoint:
 *   - 200 → all canonical routes 2xx (clean)
 *   - 207 → at least one regression (200-family but flagged so external
 *           uptime monitors can alarm via 4xx rule). 503 reserved for
 *           hard infra failure.
 *   - 401 → missing/invalid CRON_SECRET on a non-dry request
 *   - 503 → fetch infrastructure itself failed (DNS, fetch crash)
 */

import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { CANONICAL_PROD_ROUTES } from "@/lib/canonical-routes";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PROD_ORIGIN = "https://signals.gitdealflow.com";
const ALERT_TO = "signal@gitdealflow.com";
const ALERT_FROM = "Route Canary <canary@gitdealflow.com>";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

interface ProbeResult {
  path: string;
  status: number;
  ok: boolean;
  ms: number;
  error?: string;
}

async function probeOne(path: string): Promise<ProbeResult> {
  const url = `${PROD_ORIGIN}${path}`;
  const t0 = Date.now();
  try {
    // HEAD is cheaper than GET and Vercel/Next renders identical status
    // codes for HEAD vs GET on Route Handlers and prerendered pages.
    // Some routes (rare) only allow GET — we'd see those as 405 and
    // automatically retry with GET.
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      headers: { "user-agent": "GitDealFlow-Canary/1.0 (+route-canary cron)" },
    });
    if (res.status === 405) {
      res = await fetch(url, {
        method: "GET",
        redirect: "manual",
        headers: { "user-agent": "GitDealFlow-Canary/1.0 (+route-canary cron)" },
      });
    }
    const ms = Date.now() - t0;
    // Treat 2xx and 3xx (308 redirect to canonical alias) as healthy.
    // Anything else is a regression.
    const ok = res.status >= 200 && res.status < 400;
    return { path, status: res.status, ok, ms };
  } catch (err) {
    return {
      path,
      status: 0,
      ok: false,
      ms: Date.now() - t0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function sendAlert(failures: ProbeResult[]): Promise<void> {
  if (!RESEND_API_KEY) {
    console.error(
      JSON.stringify({
        event: "canary_alert_skipped",
        reason: "no_resend_api_key",
        failureCount: failures.length,
        failures: failures.map((f) => ({ path: f.path, status: f.status })),
      }),
    );
    return;
  }
  const rows = failures
    .map(
      (f) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-family:ui-monospace,monospace;color:#dc2626;"><strong>${f.path}</strong></td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-family:ui-monospace,monospace;text-align:right;">${f.status || "ERR"}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;">${f.error ?? ""}</td></tr>`,
    )
    .join("");
  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,sans-serif;padding:24px;color:#1e293b;">
<h2 style="margin:0 0 8px;color:#dc2626;">Route Canary — ${failures.length} regression${failures.length === 1 ? "" : "s"}</h2>
<p style="margin:0 0 16px;color:#475569;">Canonical production routes that returned non-2xx/3xx. Probed at ${new Date().toISOString()}.</p>
<table style="border-collapse:collapse;width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:8px;">
  <thead><tr style="background:#f8fafc;"><th style="text-align:left;padding:8px 12px;border-bottom:2px solid #e2e8f0;">Route</th><th style="text-align:right;padding:8px 12px;border-bottom:2px solid #e2e8f0;">Status</th><th style="text-align:left;padding:8px 12px;border-bottom:2px solid #e2e8f0;">Note</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<p style="margin:24px 0 0;color:#64748b;font-size:13px;">Likely cause: a recent <code>vercel deploy --prod</code> fired from a source tree missing the routes' commits and aliased over the good deploy. Recovery: <code>cd pseo-site && rm -rf .next .vercel/output && vercel pull --yes --environment=production && vercel build --prod && vercel deploy --prebuilt --prod --archive=tgz</code>.</p>
</body></html>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: ALERT_FROM,
        to: ALERT_TO,
        subject: `[Canary] ${failures.length} prod route regression${failures.length === 1 ? "" : "s"}`,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(
        JSON.stringify({
          event: "canary_alert_send_failed",
          status: res.status,
          body: body.slice(0, 500),
        }),
      );
    }
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "canary_alert_send_threw",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
  }
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";

  // Auth — Vercel Cron sends Bearer CRON_SECRET. Dry runs (manual
  // probes) bypass auth so this endpoint is curlable from a laptop
  // without leaking the secret to a shell history.
  if (!dry) {
    const auth = req.headers.get("authorization");
    if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
      console.warn(
        JSON.stringify({
          route: "/api/cron/route-canary",
          event: "unauthorized",
          reason: "missing or invalid CRON_SECRET",
        }),
      );
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  const t0 = Date.now();
  const results = await Promise.all(
    CANONICAL_PROD_ROUTES.map((path) => probeOne(path)),
  );
  const failures = results.filter((r) => !r.ok);
  const duration = Date.now() - t0;

  // Structured log line for Vercel Logs grep (level=info or warning).
  console.log(
    JSON.stringify({
      route: "/api/cron/route-canary",
      event: failures.length === 0 ? "canary_clean" : "canary_regression",
      probedCount: results.length,
      failureCount: failures.length,
      durationMs: duration,
      failures: failures.map((f) => ({ path: f.path, status: f.status })),
    }),
  );

  // Fire alert in background — don't block the cron response.
  if (failures.length > 0 && !dry) {
    waitUntil(sendAlert(failures));
  }

  // 207 Multi-Status when there's a regression — keeps external uptime
  // monitors happy (they alarm on 4xx/5xx) while signaling "partial
  // success" to anyone reading the response. Pure 200 means clean.
  const status = failures.length === 0 ? 200 : 207;
  return NextResponse.json(
    {
      ok: failures.length === 0,
      probedCount: results.length,
      failureCount: failures.length,
      durationMs: duration,
      results,
    },
    { status },
  );
}
