/**
 * Stadium Pitch — RSVP reminder email templates.
 *
 * Three reminders per RSVP:
 *   - save-the-date (T-24h)
 *   - one-hour     (T-1h)
 *   - live         (T-0, the drop email itself)
 *
 * Same header chrome and footer pattern as lib/emails.ts so the brand
 * surface is consistent. Each builder takes a `dropTimeUtc` label so the
 * subject line + body name the exact moment the reader RSVP'd for.
 */

import { formatDropTimeUtc, formatMonthLabel } from "./stadium-pitch-schedule";

const SITE_SIGNALS = "https://signals.gitdealflow.com";
const SITE_APEX = "https://gitdealflow.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";

interface BuildArgs {
  dropTimeIso: string;
}

function shell(body: string, campaign: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL · STATE OF GITHUB</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
${body}
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You RSVP'd at <a href="${SITE_SIGNALS}/state-of-github?utm_source=email&utm_medium=stadium-rsvp&utm_campaign=${campaign}" style="color:#0ea5e9;">/state-of-github</a> for the monthly Stadium Pitch reminder.</p>
<p>Reply <strong>UNSUBSCRIBE</strong> to stop these reminders. The free Sunday digest is a separate list at <a href="${SITE_APEX}/#signup" style="color:#0ea5e9;">${SITE_APEX}</a>.</p>
</div>
</div>
</body>
</html>`;
}

/**
 * Save-the-date — T-24h before drop. The "moment is coming" reminder.
 */
export function buildSaveTheDateEmail({ dropTimeIso }: BuildArgs): {
  subject: string;
  html: string;
} {
  const drop = new Date(dropTimeIso);
  const monthLabel = formatMonthLabel(dropTimeIso);
  const dropLabel = formatDropTimeUtc(drop);

  const subject = `${monthLabel} Stadium Pitch — drops in 24 hours`;
  const html = shell(
    `<p><strong>${dropLabel}</strong>.</p>

<p>That's when the ${monthLabel} State of GitHub address drops — twelve weeks of which startups have been quietly heating up, the three sector-level shifts to plan around, what changed in how we read the signal since last month, and the one structural call anyone sourcing early should have on their calendar.</p>

<p style="color:#475569;font-size:14px;">Quick reminder on what this is: GitDealFlow is a tool, not a fund — we're not investing, not competing with you. It reads startups' public GitHub engineering activity and flags the ones heating up in your sectors before they raise or hit the press. You don't crunch anything; it surfaces them, you make the calls.</p>

<p>You'll get the address in your inbox at the moment it goes live. The page at <a href="${SITE_SIGNALS}/state-of-github?utm_source=email&amp;utm_medium=stadium-rsvp&amp;utm_campaign=stadium-save-date">/state-of-github</a> stays public for 48 hours afterward — but the email subscribers get the link first.</p>

<p style="margin-top:28px;color:#475569;font-size:14px;">Tomorrow at the same time, you'll get a one-hour reminder. Then the address itself when it ships.</p>

<p>Talk soon — The Data Nerd</p>

<p style="margin-top:24px;color:#475569;font-size:14px;">P.S. If you also want the free weekly Sunday digest — a handful of startups heating up early each Monday — the signup lives at <a href="${SITE_APEX}/#signup">${SITE_APEX}</a>. Different list, same engine, no overlap.</p>`,
    "stadium-save-date",
  );

  return { subject, html };
}

/**
 * One-hour reminder — T-1h. Final pre-drop nudge.
 */
export function buildOneHourEmail({ dropTimeIso }: BuildArgs): {
  subject: string;
  html: string;
} {
  const monthLabel = formatMonthLabel(dropTimeIso);

  const subject = `${monthLabel} Stadium Pitch — one hour to drop`;
  const html = shell(
    `<p>One hour from now the ${monthLabel} State of GitHub address goes live.</p>

<p>The whole point of the monthly cadence is the moment: twelve weeks of watching which startups are quietly heating up in your sectors, one written address, one drop time. Sixty minutes from now, the panel speaks. (Reminder — we're a tool, not a fund; we surface the signal, you make the calls.)</p>

<p>You'll get the address in this inbox the second it ships. Nothing for you to do — just be reachable.</p>

<p style="margin-top:28px;color:#475569;font-size:14px;">If something comes up and you miss the live window, the page stays public for 48 hours at <a href="${SITE_SIGNALS}/state-of-github?utm_source=email&amp;utm_medium=stadium-rsvp&amp;utm_campaign=stadium-one-hour">/state-of-github</a> — but the RSVP list always reads it first.</p>

<p>The Data Nerd</p>`,
    "stadium-one-hour",
  );

  return { subject, html };
}

/**
 * Live drop — T-0. The address email itself.
 *
 * This is the moment. The email lands in the recipient's inbox the second
 * the page goes live. Body intentionally short — the reader's job is to
 * click through to /state-of-github and read the long form there. The email
 * carries the headline + the link, not the full address.
 */
export function buildLiveDropEmail({ dropTimeIso }: BuildArgs): {
  subject: string;
  html: string;
} {
  const monthLabel = formatMonthLabel(dropTimeIso);

  const subject = `${monthLabel} Stadium Pitch — live now`;
  const html = shell(
    `<p><strong>The ${monthLabel} address is live.</strong></p>

<p>Read it now while it's fresh — the public page stays open for 48 hours, but the RSVP list gets the link first, every month.</p>

<p style="text-align:center;margin:32px 0;">
<a href="${SITE_SIGNALS}/state-of-github?utm_source=email&amp;utm_medium=stadium-rsvp&amp;utm_campaign=stadium-live" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">Read the ${monthLabel} address →</a>
</p>

<p>Three sector-level shifts to plan around. What changed in how we read the signal this month. The one structural call I think every investor sourcing early should have on their calendar. (As always — this is a tool, not a fund; it surfaces the startups heating up, you make the calls.)</p>

<p style="margin-top:28px;color:#475569;font-size:14px;">RSVP'd already counts you in for next month. The address ships first Wednesday of every month, 09:00 UTC, in this exact inbox.</p>

<p>Talk soon — The Data Nerd</p>`,
    "stadium-live",
  );

  return { subject, html };
}

/**
 * RSVP confirmation — sent immediately on signup, not on schedule.
 * Confirms the RSVP and hints at the next reminders that will arrive.
 */
export function buildRsvpConfirmationEmail({
  dropTimeIso,
  scheduledLabels,
}: BuildArgs & { scheduledLabels: string[] }): {
  subject: string;
  html: string;
} {
  const drop = new Date(dropTimeIso);
  const monthLabel = formatMonthLabel(dropTimeIso);
  const dropLabel = formatDropTimeUtc(drop);

  const reminderList = scheduledLabels.length
    ? `<ul style="padding-left:20px;margin:8px 0;">
${scheduledLabels.map((s) => `  <li style="margin-bottom:4px;">${s}</li>`).join("\n")}
</ul>`
    : `<p style="color:#475569;font-size:14px;">You signed up close to the drop time — the address itself will land in this inbox at <strong>${dropLabel}</strong>.</p>`;

  const subject = `RSVP confirmed — ${monthLabel} Stadium Pitch`;
  const html = shell(
    `<p>You're on the list for the ${monthLabel} State of GitHub address — twelve weeks of which startups have been heating up early in your sectors, before they raise or hit the press. (GitDealFlow is a tool, not a fund; we surface them, you make the calls.)</p>

<p><strong>Drop time:</strong> ${dropLabel}.</p>

<p>Reminders we'll send you for this drop:</p>

${reminderList}

<p>You can add the moment to your calendar via this <a href="${SITE_SIGNALS}/api/stadium-pitch/calendar.ics?utm_source=email&amp;utm_medium=stadium-rsvp&amp;utm_campaign=stadium-confirm">.ics calendar invite</a> — it sets up a recurring monthly entry on the first Wednesday so future drops are pre-scheduled.</p>

<p style="margin-top:28px;color:#475569;font-size:14px;">If you also want the free weekly Sunday digest — a handful of startups heating up early, every Monday at 09:00 UTC — separate signup at <a href="${SITE_APEX}/#signup">${SITE_APEX}</a>.</p>

<p>Talk soon — The Data Nerd</p>`,
    "stadium-confirm",
  );

  return { subject, html };
}
