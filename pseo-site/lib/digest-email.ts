/**
 * Weekly Signal Digest email renderer.
 *
 * Pure function — takes structured weekly signal data and returns an HTML
 * string suitable for sending via Resend, Postmark, Mailgun, or SES. Uses
 * inline styles + table layout for broad email-client compatibility.
 *
 * Brand tokens mirror landing/tailwind.config.js and pseo-site/app/globals.css.
 */

export type DigestStartup = {
  rank: number;
  name: string;
  sectorName: string;
  sectorSlug: string;
  description: string;
  commitVelocityChange: string;
  commitVelocity14d: number;
  contributors: number;
  signalType: string;
  slug: string;
};

export type DigestSector = {
  name: string;
  topStartup: string;
  topChange: string;
  count: number;
  avgVelocity: number;
};

export type DigestData = {
  issueNumber: number;
  weekOf: string;
  heroHeadline: string;
  heroIntro: string;
  statStartups: number;
  statSectors: number;
  statTopMover: string;
  topStartups: DigestStartup[];
  hottestSectors: DigestSector[];
};

export type DigestOptions = {
  /** How to interpolate unsubscribe/preferences URLs. */
  esp?: "generic" | "resend";
  /** Override subject line. Defaults to auto-generated from hero headline. */
  subject?: string;
};

const BRAND = {
  shell: "#0f172a",
  card: "#1e293b",
  border: "#334155",
  textPri: "#f1f5f9",
  textSec: "#cbd5e1",
  textMut: "#94a3b8",
  textFade: "#64748b",
  accent: "#0ea5e9",
  accentLight: "#7dd3fc",
  positive: "#22c55e",
  onAccent: "#0f172a",
};

const FONT_STACK = `'Inter','Helvetica Neue',Helvetica,Arial,'Segoe UI',sans-serif`;

function escape(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function unsubToken(_esp: DigestOptions["esp"]): { unsub: string; prefs: string } {
  // We send the digest via Resend's /emails endpoint (per-recipient), not
  // /broadcasts — so neither {{{RESEND_UNSUBSCRIBE_URL}}} nor
  // %unsubscribe_url% would be substituted at send time and the literal
  // template text would land in the inbox. Use a real mailto: link that
  // works in any client. The List-Unsubscribe header set by the sender
  // (email-api/send-weekly-digest.mjs) covers Gmail/Yahoo one-click.
  const mailto = "mailto:signals@gitdealflow.com?subject=Unsubscribe";
  return { unsub: mailto, prefs: mailto };
}

function startupCard(s: DigestStartup): string {
  return `
          <tr>
            <td style="padding:0 8px 12px 8px;">
              <a href="https://signals.gitdealflow.com/startup/${escape(s.slug)}" style="display:block;text-decoration:none;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-card brd" style="background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:12px;">
                  <tr>
                    <td style="padding:20px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="vertical-align:top;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="background:${BRAND.accent};color:${BRAND.onAccent};font-size:12px;font-weight:700;padding:3px 8px;border-radius:999px;letter-spacing:0.02em;">#${s.rank}</td>
                                <td style="width:8px;">&nbsp;</td>
                                <td class="tx-mut" style="color:${BRAND.textMut};font-size:12px;font-weight:500;letter-spacing:0.04em;text-transform:uppercase;">${escape(s.sectorName)}</td>
                              </tr>
                            </table>
                            <div class="tx-pri" style="color:${BRAND.textPri};font-size:18px;font-weight:700;letter-spacing:-0.01em;margin-top:10px;">${escape(s.name)}</div>${
                              s.description
                                ? `\n                            <p class="tx-sec" style="margin:4px 0 0 0;color:${BRAND.textSec};font-size:14px;line-height:20px;">${escape(s.description)}</p>`
                                : ""
                            }
                          </td>
                          <td align="right" width="110" class="hide-sm" style="vertical-align:top;padding-left:16px;">
                            <div style="color:${BRAND.positive};font-size:22px;font-weight:800;letter-spacing:-0.01em;text-align:right;">${escape(s.commitVelocityChange)}</div>
                            <div class="tx-mut" style="color:${BRAND.textMut};font-size:11px;font-weight:500;letter-spacing:0.04em;text-transform:uppercase;text-align:right;margin-top:2px;">vs. usual pace</div>
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
                        <tr>
                          <td>
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="background:rgba(14,165,233,0.12);color:${BRAND.accentLight};font-size:12px;font-weight:600;padding:4px 10px;border-radius:6px;border:1px solid rgba(14,165,233,0.3);">${escape(s.signalType)}</td>
                                <td style="width:6px;">&nbsp;</td>
                                <td class="tx-mut" style="color:${BRAND.textMut};font-size:12px;">${s.commitVelocity14d} code updates · ${s.contributors} engineers · last 14 days</td>
                              </tr>
                            </table>
                          </td>
                          <td align="right" class="hide-sm">
                            <span style="color:${BRAND.accent};font-size:13px;font-weight:600;">See the details &rarr;</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>`;
}

function sectorCard(s: DigestSector): string {
  return `<td class="stack bg-card brd" width="32%" style="background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:12px;padding:16px;vertical-align:top;">
                    <div class="tx-mut" style="color:${BRAND.textMut};font-size:11px;font-weight:500;letter-spacing:0.04em;text-transform:uppercase;">${escape(s.name)}</div>
                    <div class="tx-pri" style="color:${BRAND.textPri};font-size:20px;font-weight:700;margin-top:6px;">${escape(s.topStartup)}</div>
                    <div style="color:${BRAND.positive};font-size:13px;font-weight:600;margin-top:2px;">${escape(s.topChange)} top mover</div>
                    <div class="tx-mut" style="color:${BRAND.textMut};font-size:12px;margin-top:8px;">${s.count} startups &middot; ~${s.avgVelocity} code updates in 14 days</div>
                  </td>`;
}

export function renderDigestEmail(data: DigestData, opts: DigestOptions = {}): string {
  const { unsub, prefs } = unsubToken(opts.esp);
  const subject =
    opts.subject ?? `Signal Digest — Week of ${data.weekOf}: ${data.topStartups[0]?.name ?? ""} leads with ${data.topStartups[0]?.commitVelocityChange ?? ""}`;
  const preheader = `${data.statStartups} startups tracked across ${data.statSectors} sectors. ${data.topStartups
    .slice(0, 3)
    .map((s) => `${s.name} ${s.commitVelocityChange}`)
    .join(", ")}. Three weeks before your inbox gets the TechCrunch headline.`;

  const [sector1, sector2, sector3] = data.hottestSectors;

  return `<!doctype html>
<html lang="en" dir="ltr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${escape(subject)}</title>
  <!--[if mso]>
  <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  <![endif]-->
  <style>
    :root { color-scheme: dark; supported-color-schemes: dark; }
    body, table, td, p, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
    a { text-decoration:none; }
    @media (prefers-color-scheme: light) {
      .bg-shell { background:${BRAND.shell} !important; }
      .bg-card  { background:${BRAND.card} !important; }
      .tx-pri   { color:${BRAND.textPri} !important; }
      .tx-sec   { color:${BRAND.textSec} !important; }
      .tx-mut   { color:${BRAND.textMut} !important; }
      .brd      { border-color:${BRAND.border} !important; }
    }
    @media only screen and (max-width: 620px) {
      .container { width:100% !important; }
      .px-outer { padding-left:20px !important; padding-right:20px !important; }
      .hero-h1  { font-size:28px !important; line-height:34px !important; }
      .stat-num { font-size:22px !important; }
      .hide-sm  { display:none !important; }
      .stack    { display:block !important; width:100% !important; }
      .stack + .stack { padding-top:12px !important; }
    }
  </style>
</head>
<body class="bg-shell" style="margin:0;padding:0;background:${BRAND.shell};font-family:${FONT_STACK};color:${BRAND.textPri};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${escape(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-shell" style="background:${BRAND.shell};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="width:600px;max-width:600px;">

          <!-- HEADER -->
          <tr>
            <td class="px-outer" style="padding:0 8px 24px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <a href="https://gitdealflow.com" style="color:${BRAND.textPri};font-size:16px;font-weight:700;letter-spacing:-0.01em;">
                      <span style="color:${BRAND.textPri};">VC Deal Flow</span><span style="color:${BRAND.accent};"> Signal</span>
                    </a>
                  </td>
                  <td align="right" class="tx-mut" style="vertical-align:middle;color:${BRAND.textMut};font-size:12px;font-weight:500;letter-spacing:0.04em;text-transform:uppercase;">
                    Week of ${escape(data.weekOf)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td class="bg-card brd px-outer" style="background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:16px;padding:32px;">
              <p class="tx-mut" style="margin:0 0 12px 0;color:${BRAND.accent};font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">
                Signal Digest &middot; Issue #${data.issueNumber}
              </p>
              <h1 class="hero-h1 tx-pri" style="margin:0 0 16px 0;color:${BRAND.textPri};font-size:32px;line-height:40px;font-weight:800;letter-spacing:-0.02em;">${escape(data.heroHeadline)}</h1>
              <p class="tx-sec" style="margin:0 0 24px 0;color:${BRAND.textSec};font-size:16px;line-height:24px;">${escape(data.heroIntro)}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
                <tr>
                  <td class="stack" width="33%" style="vertical-align:top;padding-right:8px;">
                    <div style="border-top:1px solid ${BRAND.border};padding-top:12px;">
                      <div class="stat-num tx-pri" style="color:${BRAND.textPri};font-size:24px;font-weight:700;letter-spacing:-0.01em;">${data.statStartups}</div>
                      <div class="tx-mut" style="color:${BRAND.textMut};font-size:11px;font-weight:500;letter-spacing:0.04em;text-transform:uppercase;margin-top:2px;">Startups tracked</div>
                    </div>
                  </td>
                  <td class="stack" width="33%" style="vertical-align:top;padding:0 4px;">
                    <div style="border-top:1px solid ${BRAND.border};padding-top:12px;">
                      <div class="stat-num tx-pri" style="color:${BRAND.textPri};font-size:24px;font-weight:700;letter-spacing:-0.01em;">${data.statSectors}</div>
                      <div class="tx-mut" style="color:${BRAND.textMut};font-size:11px;font-weight:500;letter-spacing:0.04em;text-transform:uppercase;margin-top:2px;">Sectors covered</div>
                    </div>
                  </td>
                  <td class="stack" width="33%" style="vertical-align:top;padding-left:8px;">
                    <div style="border-top:1px solid ${BRAND.border};padding-top:12px;">
                      <div class="stat-num" style="color:${BRAND.accent};font-size:24px;font-weight:700;letter-spacing:-0.01em;">${escape(data.statTopMover)}</div>
                      <div class="tx-mut" style="color:${BRAND.textMut};font-size:11px;font-weight:500;letter-spacing:0.04em;text-transform:uppercase;margin-top:2px;">Top mover</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TOP 5 HEADER -->
          <tr><td style="height:32px;line-height:32px;font-size:0;">&nbsp;</td></tr>
          <tr>
            <td class="px-outer" style="padding:0 8px 16px 8px;">
              <h2 class="tx-pri" style="margin:0 0 4px 0;color:${BRAND.textPri};font-size:20px;font-weight:700;letter-spacing:-0.01em;">Top 5 Breakouts This Week</h2>
              <p class="tx-mut" style="margin:0;color:${BRAND.textMut};font-size:13px;">Ranked by how much faster they're shipping than their normal pace.</p>
            </td>
          </tr>${data.topStartups.slice(0, 5).map(startupCard).join("")}

          <!-- HOTTEST SECTORS -->
          <tr><td style="height:32px;line-height:32px;font-size:0;">&nbsp;</td></tr>
          <tr>
            <td class="px-outer" style="padding:0 8px 16px 8px;">
              <h2 class="tx-pri" style="margin:0 0 4px 0;color:${BRAND.textPri};font-size:20px;font-weight:700;letter-spacing:-0.01em;">Hottest Sectors</h2>
              <p class="tx-mut" style="margin:0;color:${BRAND.textMut};font-size:13px;">Where teams are building fastest right now.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${sector1 ? sectorCard(sector1) : ""}
                  <td class="hide-sm" width="2%">&nbsp;</td>
                  ${sector2 ? sectorCard(sector2) : ""}
                  <td class="hide-sm" width="2%">&nbsp;</td>
                  ${sector3 ? sectorCard(sector3) : ""}
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr><td style="height:32px;line-height:32px;font-size:0;">&nbsp;</td></tr>
          <tr>
            <td align="center" class="px-outer" style="padding:0 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
                <tr>
                  <td align="center">
                    <a href="https://signals.gitdealflow.com/trending" style="display:block;width:100%;box-sizing:border-box;background:${BRAND.accent};color:${BRAND.onAccent};font-weight:700;font-size:19px;line-height:1.2;letter-spacing:-0.01em;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">Browse the full 60+ ranking &rarr;</a>
                  </td>
                </tr>
              </table>
              <p class="tx-mut" style="margin:12px 0 0 0;color:${BRAND.textMut};font-size:13px;">
                Want the deep dive? <a href="https://gitdealflow.com/insider" style="color:${BRAND.accentLight};font-weight:600;">Join the Insider Circle</a> for the full numbers, real-time alerts, and the complete research tools.
              </p>
            </td>
          </tr>

          <!-- METHOD NOTE -->
          <tr><td style="height:32px;line-height:32px;font-size:0;">&nbsp;</td></tr>
          <tr>
            <td class="bg-card brd px-outer" style="background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:12px;padding:20px;">
              <div class="tx-mut" style="color:${BRAND.textMut};font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">How we measure</div>
              <p class="tx-sec" style="margin:8px 0 0 0;color:${BRAND.textSec};font-size:14px;line-height:22px;">
                Each week we look at how fast a team is shipping code, how many engineers are pitching in, and how often they push out updates &mdash; over the last 14 days, against that startup's own normal pace. The names at the top of this list have historically started moving 3&ndash;6 weeks before a funding announcement.
                <a href="https://signals.gitdealflow.com/methodology" style="color:${BRAND.accentLight};font-weight:600;">See exactly how &rarr;</a>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr><td style="height:32px;line-height:32px;font-size:0;">&nbsp;</td></tr>
          <tr>
            <td class="px-outer" style="padding:0 8px 24px 8px;" align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 8px;"><a href="https://twitter.com/data_nerd" style="color:${BRAND.textMut};font-size:13px;font-weight:500;">Twitter</a></td>
                  <td class="tx-mut" style="color:${BRAND.border};">&middot;</td>
                  <td style="padding:0 8px;"><a href="https://t.me/gitdealflow" style="color:${BRAND.textMut};font-size:13px;font-weight:500;">Telegram</a></td>
                  <td class="tx-mut" style="color:${BRAND.border};">&middot;</td>
                  <td style="padding:0 8px;"><a href="https://www.linkedin.com/company/gitdealflow" style="color:${BRAND.textMut};font-size:13px;font-weight:500;">LinkedIn</a></td>
                  <td class="tx-mut" style="color:${BRAND.border};">&middot;</td>
                  <td style="padding:0 8px;"><a href="https://signals.gitdealflow.com" style="color:${BRAND.textMut};font-size:13px;font-weight:500;">Signals</a></td>
                </tr>
              </table>
              <p class="tx-mut" style="margin:20px 0 0 0;color:${BRAND.textFade};font-size:12px;line-height:18px;text-align:center;">
                You're reading the Signal Digest from <a href="https://gitdealflow.com" style="color:${BRAND.textMut};font-weight:500;">GitDealFlow</a>.<br>
                No investment advice. Based on public GitHub data.<br>
                <a href="${unsub}" style="color:${BRAND.textFade};text-decoration:underline;">Unsubscribe</a> &middot; <a href="${prefs}" style="color:${BRAND.textFade};text-decoration:underline;">Update preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
