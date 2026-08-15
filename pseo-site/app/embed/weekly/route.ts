import { getCurrentPredictionWeek } from "@/lib/predictions";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

/**
 * /embed/weekly — drop-in iframe widget showing the latest 5 picks from
 * the Engineering Acceleration Watch.
 *
 * Why a Route Handler (not a Page): an iframe widget has to escape the root
 * layout (Header/Footer/LaunchBanner/PixelManager etc.), control its own
 * Cache-Control + X-Frame-Options + CSP frame-ancestors, and ship as a
 * single self-contained HTML payload. Returning HTML directly is leaner
 * than a Page wrapped in a route group with a stripped layout.
 *
 * Default size target: 380×420 (5 rows + header + footer fits cleanly).
 *
 * Distribution surface: every newsletter author can drop
 *   <iframe src="https://signals.gitdealflow.com/embed/weekly"
 *           width="380" height="420" frameborder="0" loading="lazy"></iframe>
 * into a Substack post or blog without negotiation. CC BY 4.0; attribution
 * baked in via the visible "via gitdealflow.com" footer link.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function GET() {
  const week = getCurrentPredictionWeek();

  // Empty-state body — a graceful fallback if no week has been published yet.
  // Better than a 500: the iframe still renders.
  if (!week) {
    const empty = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Engineering Acceleration Watch</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>${INLINE_CSS}</style></head>
<body><main class="card"><div class="hd">
<span class="brand">GitDealFlow · Engineering Acceleration Watch</span>
</div><div class="empty">Next cohort lands Monday. The widget will populate then.</div>
<a class="ft" href="${BASE_URL}/predicted" target="_top" rel="noopener">via gitdealflow.com →</a>
</main></body></html>`;
    return new Response(empty, {
      headers: BUILD_HEADERS({ etag: '"empty"' }),
    });
  }

  const top5 = week.picks.slice(0, 5);
  const weekUrl = `${BASE_URL}/predicted/${week.slug}`;

  const rows = top5
    .map((p) => {
      const name = escapeHtml(p.displayName);
      const sector = escapeHtml(p.sector);
      const delta = escapeHtml(p.commitVelocityChange);
      const isPositive = !p.commitVelocityChange.startsWith("-");
      const deltaClass = isPositive ? "pos" : "neg";
      const ghHref = escapeHtml(p.githubUrl);
      return `
<li class="row">
  <span class="rank">${p.rank}</span>
  <a class="name" href="${ghHref}" target="_top" rel="noopener nofollow">${name}</a>
  <span class="meta">${sector}</span>
  <span class="delta ${deltaClass}">${delta}</span>
</li>`;
    })
    .join("");

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<title>Engineering Acceleration Watch — Week of ${fmtShortDate(week.weekStart)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${BASE_URL}/embed/weekly" />
<style>${INLINE_CSS}</style>
</head>
<body>
<main class="card" role="region" aria-label="Engineering Acceleration Watch">
  <div class="hd">
    <span class="brand">GitDealFlow · Engineering Acceleration Watch</span>
    <span class="wk">Week of ${fmtShortDate(week.weekStart)}</span>
  </div>
  <ol class="rows">${rows}</ol>
  <a class="ft" id="gdf-ft" href="${weekUrl}?utm_source=embed&utm_medium=widget" target="_top" rel="noopener">
    See the full 10 + scorecard at GitDealFlow →
  </a>
</main>
<script>
/* Publisher attribution: the route is statically cached, so the per-publisher
 * pub id travels on the iframe URL (?pub=NEWSLETTER_ID) and is appended to
 * the outbound CTA client-side. No cookies, no external requests. */
(function () {
  try {
    var pub = new URLSearchParams(location.search).get("pub");
    if (!pub || !/^[a-z0-9_-]{1,40}$/i.test(pub)) return;
    var ft = document.getElementById("gdf-ft");
    if (!ft) return;
    var u = new URL(ft.href);
    u.searchParams.set("utm_campaign", pub);
    u.searchParams.set("pub", pub);
    ft.href = u.toString();
  } catch (e) { /* keep default link */ }
})();
</script>
</body></html>`;

  return new Response(html, {
    headers: BUILD_HEADERS({ etag: `"${week.slug}"` }),
  });
}

// Inline CSS — no external requests. Mirrors the dark slate theme of the
// site without pulling globals.css. Tight enough for a 380×420 iframe.
const INLINE_CSS = `
:root { color-scheme: dark; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #0f172a; color: #e2e8f0; font: 13px/1.45 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
body { padding: 8px; }
.card { background: linear-gradient(180deg, #0f172a 0%, #0b1120 100%); border: 1px solid #1e293b; border-radius: 10px; padding: 14px 14px 12px; max-width: 100%; }
.hd { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #1e293b; }
.brand { font-size: 11px; font-weight: 600; color: #38bdf8; letter-spacing: 0.02em; text-transform: uppercase; }
.wk { font-size: 11px; color: #94a3b8; font-variant-numeric: tabular-nums; }
.rows { list-style: none; }
.row { display: grid; grid-template-columns: 18px 1fr auto; grid-template-rows: auto auto; column-gap: 8px; padding: 6px 0; border-bottom: 1px solid #111827; }
.row:last-child { border-bottom: 0; }
.rank { grid-row: 1 / span 2; align-self: center; font: 600 12px/1 ui-monospace, SFMono-Regular, Menlo, monospace; color: #64748b; text-align: right; padding-right: 2px; }
.name { grid-column: 2; font-weight: 600; color: #e2e8f0; text-decoration: none; font-size: 13px; line-height: 1.25; word-break: break-word; }
.name:hover { color: #38bdf8; text-decoration: underline; text-decoration-style: dotted; }
.meta { grid-column: 2; color: #94a3b8; font-size: 11px; line-height: 1.3; }
.delta { grid-column: 3; grid-row: 1 / span 2; align-self: center; font: 600 12px/1 ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; padding: 2px 6px; border-radius: 4px; }
.delta.pos { color: #34d399; background: rgba(16, 185, 129, 0.10); border: 1px solid rgba(16, 185, 129, 0.25); }
.delta.neg { color: #f87171; background: rgba(248, 113, 113, 0.10); border: 1px solid rgba(248, 113, 113, 0.25); }
.ft { display: block; margin-top: 10px; padding-top: 8px; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #94a3b8; text-decoration: none; }
.ft:hover { color: #38bdf8; }
.empty { padding: 32px 8px; text-align: center; color: #94a3b8; font-size: 12px; }
@media (prefers-color-scheme: light) {
  html, body { background: #ffffff; color: #0f172a; }
  .card { background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); border-color: #e2e8f0; }
  .hd { border-color: #e2e8f0; } .row { border-color: #f1f5f9; }
  .name { color: #0f172a; } .meta, .wk, .rank, .ft { color: #64748b; }
}
`.trim();

// Header block: explicitly opens the iframe up via X-Frame-Options removal +
// CSP frame-ancestors *, plus a long edge cache (week-keyed via the slug ETag
// so a new week's publish invalidates immediately when revalidated).
//
// Note: next.config.ts ships site-wide X-Frame-Options: DENY and CSP
// frame-ancestors 'none'. The path-specific header() override added in the
// same PR re-opens framing for /embed/weekly. We also set them on the
// Response itself as a belt-and-braces layer.
function BUILD_HEADERS(opts: { etag: string }): Record<string, string> {
  return {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control":
      "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400",
    "X-Frame-Options": "ALLOWALL",
    "Content-Security-Policy": "frame-ancestors *",
    "Access-Control-Allow-Origin": "*",
    "X-Robots-Tag": "index, follow",
    ETag: opts.etag,
    Link: [
      `<${BASE_URL}/embed/weekly>; rel="canonical"`,
      `<${BASE_URL}/predicted>; rel="alternate"; type="text/html"`,
      `<${BASE_URL}/predicted/feed.json>; rel="alternate"; type="application/feed+json"`,
      `<https://creativecommons.org/licenses/by/4.0/>; rel="license"`,
    ].join(", "),
  };
}
