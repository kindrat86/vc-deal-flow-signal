/**
 * Double opt-in confirmation email for /api/subscribe, one variant per cohort.
 * Kept free of server-only imports so tests can render it.
 *
 * 2026-10-29 (Maryan, t361u): the default "soap-opera" path (every form on
 * signals.gitdealflow.com) no longer promises the missed-deal story; it states
 * what actually follows: instant Top 5 digest, the 5 welcome emails, the
 * Sunday digest. lead-magnet, challenge and launch are unchanged.
 */

export type SubscribeCohort =
  | "soap-opera"
  | "challenge"
  | "launch"
  | "lead-magnet";

export function verificationEmailHtml(
  verifyUrl: string,
  cohort: SubscribeCohort,
): string {
  const headline =
    cohort === "lead-magnet"
      ? "Confirm your email to get the Velocity Verdict"
      : cohort === "challenge"
      ? "Confirm your email, your 7-Day Reset starts immediately"
      : cohort === "launch"
        ? "Confirm your email, launch sequence starts in 30 minutes"
        : "One click and this week's five are yours.";
  const body =
    cohort === "lead-magnet"
      ? `<p>Click below to confirm your email. Your one-page Velocity Verdict cheat sheet will land immediately after confirmation.</p>
<p>It covers the three public GitHub signals worth checking together, the 14-day window, the false positives to rule out, and the one question to ask before contacting a founder.</p>
<p>You will also receive four short welcome emails over the next seven days, then the free Sunday Signal. Every message has one-click unsubscribe.</p>`
      : cohort === "challenge"
      ? `<p>Click below to confirm your email and start the 7-Day Deal Flow Reset Challenge.</p>
<p>Day 1 lands within 15 minutes of confirmation. One signal per day, one 5-minute exercise per day. By Day 7 you'll have a personal sourcing framework built from the SSRN-published methodology.</p>`
      : cohort === "launch"
        ? `<p>Click below to confirm your email and start the Agent Credits launch sequence.</p>
<p>Five emails over ten days: Stage 1 the problem, Stage 2 why current fixes fail, Stage 3 what I shipped, Stage 4 cart open, Stage 5 last call. Cart closes May 20 at 23:59 UTC.</p>`
        : `<p>Confirm your email below and <strong>This Week's Top 5 Breakout Startups</strong> land in your inbox straight away: the five teams whose public GitHub is speeding up the most right now, each with one plain sentence on why it is moving.</p>
<p>Here is exactly what comes after that, and nothing else:</p>
<ul>
<li>Five short emails over your first week (in about 30 minutes, then on day 1, 3, 5 and 7): why you get five names and not fifty, where the idea came from, how my public picks have actually scored so far (misses included), and what the paid options are if you ever want more.</li>
<li>The free Signal Digest every Sunday. Five names a week.</li>
</ul>
<p>No countdowns and no daily blasts. Every email has a one-click unsubscribe.</p>`;
  const cta =
    cohort === "lead-magnet"
      ? "Get the Cheat Sheet"
      : cohort === "challenge"
      ? "Start the Challenge"
      : cohort === "launch"
        ? "Start the Launch Sequence"
        : "Confirm and get my 5";
  // Inbox preview line (hidden preheader). Mobile clients show ~90 chars.
  const preheader =
    cohort === "lead-magnet"
      ? "Confirm to get the one-page signal card and start the five-email welcome."
      : cohort === "challenge"
      ? "Confirm to start your 7-Day Deal Flow Reset, Day 1 lands in 15 minutes."
      : cohort === "launch"
        ? "Confirm to start the Agent Credits launch sequence, first email in 30 minutes."
        : "One click. Your Top 5 lands right away, then five short emails and the Sunday digest.";
  // The line under the button: the default path states its real cadence;
  // lead-magnet, challenge and launch keep their original shared line.
  const afterConfirm =
    cohort === "soap-opera"
      ? "After you confirm, the Sunday digest keeps coming every week until you unsubscribe. No spam, unsubscribe anytime."
      : "After you confirm, you'll also start receiving weekly signal updates, the top startups showing unusual engineering acceleration. No spam, unsubscribe anytime.";
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>VC Deal Flow Signal</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body { margin:0 !important; padding:0 !important; width:100% !important; }
  * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }
  img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
  a { color:#0284c7; }
  @media only screen and (max-width:600px) {
    .container { width:100% !important; }
    .px { padding-left:22px !important; padding-right:22px !important; }
    .h1 { font-size:25px !important; line-height:1.25 !important; }
    .btn-a { font-size:18px !important; padding:17px 24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;width:100%;background:#f1f5f9;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f1f5f9;opacity:0;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08);">
<tr><td class="px" style="padding:32px 40px 8px 40px;">
<span style="display:inline-block;color:#0ea5e9;font-size:13px;font-weight:700;letter-spacing:1.5px;">VC DEAL FLOW SIGNAL</span>
</td></tr>
<tr><td class="px" style="padding:8px 40px 0 40px;">
<h1 class="h1" style="margin:0;font-size:28px;line-height:1.25;font-weight:800;color:#0f172a;letter-spacing:-0.4px;">${headline}</h1>
</td></tr>
<tr><td class="px" style="padding:16px 40px 0 40px;font-size:17px;line-height:1.65;color:#334155;">
${body}
</td></tr>
<tr><td class="px" style="padding:28px 40px 8px 40px;">
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verifyUrl}" style="height:54px;v-text-anchor:middle;width:520px;" arcsize="20%" stroke="f" fillcolor="#0284c7">
<w:anchorlock/><center style="color:#ffffff;font-family:sans-serif;font-size:18px;font-weight:bold;">${cta} &rarr;</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a class="btn-a" href="${verifyUrl}" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">${cta} &rarr;</a>
<!--<![endif]-->
</td></tr>
<tr><td class="px" style="padding:0 40px 4px 40px;font-size:13px;line-height:1.5;color:#94a3b8;text-align:center;">
Button not working? Paste this into your browser:<br>
<a href="${verifyUrl}" style="color:#0284c7;word-break:break-all;">${verifyUrl}</a>
</td></tr>
<tr><td class="px" style="padding:20px 40px 28px 40px;font-size:14px;line-height:1.6;color:#64748b;">
${afterConfirm}
</td></tr>
<tr><td class="px" style="padding:20px 40px 32px 40px;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.6;color:#94a3b8;">
You're receiving this because you entered your email at <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a>.<br>
If you didn't sign up, you can safely ignore this email.
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function verificationEmailSubject(cohort: SubscribeCohort): string {
  return cohort === "lead-magnet"
    ? "Confirm to get your Velocity Verdict cheat sheet"
    : cohort === "challenge"
      ? "Confirm your email, your 7-Day Reset starts now"
      : cohort === "launch"
        ? "Confirm your email, Agent Credits launch starts now"
        : "Confirm to get this week's 5 startups";
}
