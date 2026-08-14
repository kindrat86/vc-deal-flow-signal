import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";
import { isExcluded } from "@/lib/excluded-emails";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";
import {
  getActiveReminders,
  getNextDropTime,
  formatMonthLabel,
} from "@/lib/stadium-pitch-schedule";
import {
  buildSaveTheDateEmail,
  buildOneHourEmail,
  buildLiveDropEmail,
  buildRsvpConfirmationEmail,
} from "@/lib/stadium-pitch-emails";

export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";

// Brunson Expert Secrets §1 Ch 20, Stadium Pitch RSVP handler.
//
// Schedules reminder emails (T-24h / T-1h / T-0) for the next first-Wednesday-
// of-the-month address drop, plus a confirmation email that lands inside ~30
// seconds.
//
// Design notes:
//   • Standalone list, RSVPs do NOT enter the SOAP_OPERA_EMAILS audience.
//     A reader who wants the weekly Sunday digest signs up separately at
//     gitdealflow.com. Mixing the two would double-mail.
//   • Resend `scheduled_at` is the source of truth for delayed sends. We do
//     not maintain our own queue. Each reminder is a separate POST to
//     /v1/emails, Resend handles cancellation if we ever need to clear.
//   • If the user RSVPs close to the drop, the past-time reminders (T-24h,
//     T-1h) are skipped via getActiveReminders().
//   • Confirmation email always sends, separate immediate POST, no
//     scheduled_at.
//   • Excluded testers (founder QA inbox lives in TESTER_EMAILS) get a 200
//     with skipped=true and no Resend calls. This mirrors the verify-route
//     pattern and keeps us from polluting open/click metrics during smoke.
//   • Rate limit per IP, 3 RSVPs per minute (one user shouldn't need more).
//   • Same-origin only, the form lives on signals.gitdealflow.com. Other
//     origins get a 403 to discourage drive-by abuse.

interface RsvpRequest {
  email?: string;
  source?: string;
  referrer?: string;
}

const ALLOWED_ORIGINS = new Set([
  "https://signals.gitdealflow.com",
  "https://gitdealflow.com",
  "https://www.gitdealflow.com",
]);

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // server-to-server / curl
  if (process.env.NODE_ENV !== "production") {
    if (origin.startsWith("http://localhost")) return true;
  }
  return ALLOWED_ORIGINS.has(origin);
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  // Rate limit (3/min per IP).
  const ip = getClientIp(request);
  const rl = checkRateLimit(`stadium-rsvp:${ip}`, 3, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in a minute." },
      { status: 429, headers: rateLimitHeaders(rl) },
    );
  }

  let body: RsvpRequest;
  try {
    body = (await request.json()) as RsvpRequest;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const email = (body.email || "").trim().toLowerCase();
  const source = (body.source || "state-of-github").slice(0, 80);

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  // Excluded, return success but skip Resend. Don't leak which addresses
  // are on the exclusion list.
  if (isExcluded(email)) {
    return NextResponse.json(
      {
        ok: true,
        skipped: true,
        scheduled: [],
        dropTimeIso: getNextDropTime().toISOString(),
      },
      { status: 200 },
    );
  }

  if (!RESEND_API_KEY) {
    console.error("[stadium-rsvp] RESEND_API_KEY not configured");
    return NextResponse.json(
      { ok: false, error: "Service not configured." },
      { status: 503 },
    );
  }

  const now = new Date();
  const nextDrop = getNextDropTime(now);
  const nextDropIso = nextDrop.toISOString();
  const monthLabel = formatMonthLabel(nextDropIso);

  const reminders = getActiveReminders(nextDrop, now);

  // Build each reminder's payload. We assemble all four emails (3 reminders +
  // 1 confirmation) before any network I/O so the dispatch loop below is a
  // simple parallel fan-out. Failure to schedule one reminder doesn't block
  // the others, partial success is logged but still returned as ok=true.
  type Dispatch = {
    label: string;
    sendAtIso?: string; // omit for immediate (confirmation)
    subject: string;
    html: string;
  };

  const dispatches: Dispatch[] = [];

  // Confirmation, immediate.
  const conf = buildRsvpConfirmationEmail({
    dropTimeIso: nextDropIso,
    scheduledLabels: reminders.map((r) => r.label),
  });
  dispatches.push({
    label: "confirmation",
    subject: conf.subject,
    html: conf.html,
  });

  for (const r of reminders) {
    if (r.kind === "save-the-date") {
      const e = buildSaveTheDateEmail({ dropTimeIso: nextDropIso });
      dispatches.push({
        label: r.label,
        sendAtIso: r.sendAtIso,
        subject: e.subject,
        html: e.html,
      });
    } else if (r.kind === "one-hour") {
      const e = buildOneHourEmail({ dropTimeIso: nextDropIso });
      dispatches.push({
        label: r.label,
        sendAtIso: r.sendAtIso,
        subject: e.subject,
        html: e.html,
      });
    } else {
      const e = buildLiveDropEmail({ dropTimeIso: nextDropIso });
      dispatches.push({
        label: r.label,
        sendAtIso: r.sendAtIso,
        subject: e.subject,
        html: e.html,
      });
    }
  }

  const results = await Promise.allSettled(
    dispatches.map(async (d) => {
      const payload: Record<string, unknown> = {
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        bcc: "sales@sipiteno.com",
        to: email,
        subject: d.subject,
        html: injectUnsubscribeLink(d.html, email),
        headers: listUnsubscribeHeaders(email),
        tags: [
          { name: "campaign", value: "stadium-pitch-rsvp" },
          { name: "source", value: source },
        ],
      };
      if (d.sendAtIso) {
        payload.scheduled_at = d.sendAtIso;
      }
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Resend ${res.status}: ${errText.slice(0, 200)}`);
      }
      return d.label;
    }),
  );

  const succeeded = results
    .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
    .map((r) => r.value);
  const failed = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => String(r.reason));

  if (failed.length) {
    console.error(
      `[stadium-rsvp] partial failure email=${email} failed=${failed.join(" | ")}`,
    );
  }

  // If literally everything failed, surface a 502, the caller's UI will
  // show the error message and the user can retry.
  if (succeeded.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Could not schedule reminders. Try again?" },
      { status: 502 },
    );
  }

  console.log(
    `[stadium-rsvp] ok email=${email} source=${source} drop=${monthLabel} scheduled=${succeeded.length} failed=${failed.length}`,
  );

  return NextResponse.json({
    ok: true,
    dropTimeIso: nextDropIso,
    monthLabel,
    scheduled: reminders.map((r) => r.label),
    confirmationSent: succeeded.includes("confirmation"),
  });
}
