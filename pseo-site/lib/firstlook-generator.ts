import "server-only";

/**
 * First Look Pass — sector deep dive generator (server-side runtime).
 *
 * Mirrors `tools/firstlook/generate.mjs` (CLI) but inlined into the webhook
 * handler so a clean sector match auto-fulfills within seconds of payment
 * instead of waiting for a human to run the CLI.
 *
 * Confidence model:
 * - "auto-sent" — canonical sector resolved AND ≥3 records found. Webhook
 *   sends the buyer the full deep dive with both attachments immediately.
 * - "needs-admin" — sector unresolved OR too few records. Webhook falls
 *   back to manual admin-alert flow (so a human can clarify with the buyer).
 */

const SIGNALS_CSV_URL = "https://signals.gitdealflow.com/api/signals.csv";
const FIRSTLOOK_STRIPE_URL =
  "/api/checkout/session?tier=firstlook";

// Canonical sector → alias list. Buyer's free-text custom-field answer is
// fuzzy-matched against this. Mirrors tools/firstlook/generate.mjs.
const SECTOR_ALIASES: Record<string, string[]> = {
  "ai & machine learning": ["ai", "ai/ml", "ai-ml", "machine learning", "ml", "artificial intelligence", "ai & ml"],
  "fintech": ["fintech", "finance", "financial"],
  "cybersecurity": ["cybersecurity", "security", "cyber", "infosec"],
  "developer tools": ["devtools", "dev tools", "developer tools"],
  "climate tech": ["climate", "climate tech", "climatetech"],
  "healthcare": ["health", "healthcare", "healthtech", "medical"],
  "web3": ["web3", "crypto", "blockchain"],
  "data infrastructure": ["data", "data infra", "data infrastructure"],
  "robotics": ["robotics", "robots"],
  "proptech": ["proptech", "property", "real estate"],
  "enterprise saas": ["enterprise saas", "saas", "b2b saas"],
  "hr tech": ["hr", "hr tech", "people"],
  "logistics": ["logistics", "supply chain"],
  "edtech": ["edtech", "education", "learning"],
  "gaming": ["gaming", "games"],
  "space tech": ["space", "space tech", "aerospace"],
  "biotech": ["biotech", "bio"],
  "marketing tech": ["martech", "marketing", "marketing tech"],
  "creator economy": ["creator", "creator economy"],
  "consumer apps": ["consumer", "consumer apps", "b2c"],
};

export function resolveSector(input: string): string | null {
  const norm = input.trim().toLowerCase();
  if (!norm) return null;
  for (const [canonical, aliases] of Object.entries(SECTOR_ALIASES)) {
    if (canonical === norm || aliases.includes(norm)) return canonical;
    if (aliases.some((a) => norm.includes(a) || a.includes(norm))) return canonical;
  }
  for (const canonical of Object.keys(SECTOR_ALIASES)) {
    if (canonical.includes(norm) || norm.includes(canonical)) return canonical;
  }
  return null;
}

type SignalRecord = Record<string, string>;

interface ParsedCSV {
  headers: string[];
  records: SignalRecord[];
}

function parseCSV(text: string): ParsedCSV {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
      else if (c === "\r") {
        // skip
      } else cell += c;
    }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  if (!rows.length) return { headers: [], records: [] };
  const headers = rows[0];
  const records = rows.slice(1)
    .filter((r) => r.some((c) => c.trim().length))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
  return { headers, records };
}

function parseVelocity(s: string | undefined): number {
  if (!s) return -Infinity;
  const m = String(s).replace(/[%\s]/g, "").match(/^(-?[+]?-?\d+\.?\d*)$/);
  if (!m) return -Infinity;
  return parseFloat(m[1].replace(/^\+/, ""));
}

function buildMarkdown(opts: {
  displaySector: string;
  records: SignalRecord[];
  email: string;
  generatedAt: string;
}): string {
  const { displaySector, records, email, generatedAt } = opts;
  const top10 = records.slice(0, 10);
  const top3UnderRadar = [...records]
    .filter((r) => parseInt(r.Contributors || "0", 10) <= 30 && parseVelocity(r.Velocity_Change) >= 0)
    .sort((a, b) => parseVelocity(b.Velocity_Change) - parseVelocity(a.Velocity_Change))
    .slice(0, 3);

  const headerRow = `| Rank | Startup | Stage | Geo | 14d commits | Velocity Δ | Contributors | Δ Contributors | Signal | GitHub |`;
  const sepRow = `|---:|---|---|---|---:|---:|---:|---:|---|---|`;
  const dataRows = records
    .map((r, i) => {
      const gh = r.GitHub_URL ? `[link](${r.GitHub_URL})` : "—";
      return `| ${i + 1} | **${r.Startup}** | ${r.Stage || "—"} | ${r.Geography || "—"} | ${r.Commits_14d || "—"} | ${r.Velocity_Change || "—"} | ${r.Contributors || "—"} | ${r.Contributor_Growth || "—"} | ${r.Signal_Type || "—"} | ${gh} |`;
    })
    .join("\n");

  const tldr = top3UnderRadar.length === 0
    ? "_No early-stage movers in this sector right now — see the full table below for later-stage acceleration._"
    : top3UnderRadar
        .map((r, i) => `${i + 1}. **${r.Startup}** (${r.Stage || "stage unknown"}, ${r.Geography || "geo unknown"}) — ${r.Velocity_Change || "—"} velocity, ${r.Contributors || "—"} contributors${r.Description ? ` — ${r.Description}` : ""}${r.GitHub_URL ? ` — ${r.GitHub_URL}` : ""}`)
        .join("\n");

  return `# Sector Deep Dive — ${displaySector}

**Buyer:** ${email}
**Generated:** ${generatedAt}
**Methodology:** https://signals.gitdealflow.com/methodology
**Source:** Public GitHub data via signals.gitdealflow.com/api/signals.csv

---

## TL;DR — top 3 under-the-radar movers

These are accelerating with smaller contributor bases (≤30) — i.e. early enough that consensus probably hasn't formed yet:

${tldr}

---

## Full ranked table — top ${records.length}

Ranked by 14-day commit-velocity change, descending. Higher = more recent acceleration relative to the company's own baseline.

${headerRow}
${sepRow}
${dataRows}

---

## How to read this

- **Velocity Δ** = percent change in commits during the trailing 14 days vs the prior 14-day window for the *same* org. This is a regime-change signal, not an absolute-volume signal.
- **Δ Contributors** = percent change in unique committers over the same window. A jump usually means hiring or the team going full-time.
- **Signal Type** = our classifier — Framework migration, Deploy frequency spike, Contributor surge, etc. Detail in the methodology page.

## Top movers — quick narrative

${top10
  .map((r, i) => {
    const v = r.Velocity_Change || "—";
    const c = r.Contributors || "—";
    const cg = r.Contributor_Growth || "—";
    const desc = r.Description ? ` ${r.Description}` : "";
    return `**${i + 1}. ${r.Startup}** — ${v} velocity, ${c} contributors (${cg} growth), ${r.Signal_Type || "signal type unclassified"}.${desc}`;
  })
  .join("\n\n")}

---

## What's next

If you're allocating real capital into one sector and need this depth across the whole field:
- **Custom Sector Sweep** (€1,997 one-time) — every venture-backed startup in one sector you pick, engineering acceleration ranked over four quarters, diligence prompts on each top-10 name, three early-stage targets not yet on Crunchbase or PitchBook. Written report in 7 business days, 30-minute clarifications call after delivery. Detail: https://gitdealflow.com/sector-sweep?utm_source=email&utm_medium=firstlook-delivery&utm_campaign=sector-sweep · Commission: /api/checkout/session?tier=sector_sweep

If you want this every week, across all 20 sectors, with filters and the live dashboard:
- **Dashboard** (€9.97/mo founding-member, locked forever) — https://gitdealflow.com/dashboard?utm_source=email&utm_medium=firstlook-delivery&utm_campaign=dashboard
- Reply to your confirmation email with **"credit me"** and your €7 First Look Pass is credited toward your first month.

If you want a different sector or a follow-up on a specific name, just reply.

— The Data Nerd
`;
}

function buildCSV(opts: { records: SignalRecord[]; headers: string[] }): string {
  const escape = (v: string | undefined) => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [opts.headers.join(",")];
  for (const r of opts.records) lines.push(opts.headers.map((h) => escape(r[h])).join(","));
  return lines.join("\n");
}

export interface FirstLookGenerationResult {
  status: "auto-sent" | "needs-admin";
  reason?: "sector-no-match" | "too-few-records" | "fetch-failed";
  matchedSector?: string;
  displaySector?: string;
  recordCount?: number;
  markdownContent?: string;
  csvContent?: string;
  sectorSlug?: string;
}

const MIN_RECORDS_FOR_AUTOSEND = 3;

export async function generateFirstLookReport(opts: {
  sector: string;
  email: string;
}): Promise<FirstLookGenerationResult> {
  const canonical = resolveSector(opts.sector);
  if (!canonical) return { status: "needs-admin", reason: "sector-no-match" };

  let csvText: string;
  try {
    const res = await fetch(SIGNALS_CSV_URL, {
      headers: { "User-Agent": "gitdealflow-firstlook-webhook/1.0" },
      // Vercel Functions: short timeout for the upstream fetch
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return { status: "needs-admin", reason: "fetch-failed" };
    csvText = await res.text();
  } catch {
    return { status: "needs-admin", reason: "fetch-failed" };
  }

  const { headers, records: all } = parseCSV(csvText);
  const norm = canonical.toLowerCase();
  const filtered = all
    .filter((r) => {
      const s = String(r.Sector || "").toLowerCase();
      return s === norm || s.includes(norm) || norm.includes(s);
    })
    .sort((a, b) => parseVelocity(b.Velocity_Change) - parseVelocity(a.Velocity_Change));

  if (filtered.length < MIN_RECORDS_FOR_AUTOSEND) {
    return { status: "needs-admin", reason: "too-few-records", matchedSector: canonical, recordCount: filtered.length };
  }

  const displaySector = filtered[0].Sector || canonical;
  const generatedAt = new Date().toISOString();
  const md = buildMarkdown({ displaySector, records: filtered, email: opts.email, generatedAt });
  const csvSubset = buildCSV({ records: filtered, headers });
  const sectorSlug = displaySector.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

  return {
    status: "auto-sent",
    matchedSector: canonical,
    displaySector,
    recordCount: filtered.length,
    markdownContent: md,
    csvContent: csvSubset,
    sectorSlug,
  };
}

export function buildAutoFulfillmentEmailHtml(opts: {
  displaySector: string;
  recordCount: number;
}): { subject: string; html: string } {
  const { displaySector, recordCount } = opts;
  return {
    subject: `Your ${displaySector} Sector Deep Dive — First Look Pass`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#FF6B1A;font-size:14px;letter-spacing:1px;">FIRST LOOK PASS &middot; ${displaySector}</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Your sector deep dive is attached. Two files:</p>
<ul>
<li><strong>${displaySector}-deep-dive.md</strong> — ranked Markdown report (renders nicely in any text/markdown viewer; if it's plain text in your client, download and open in VS Code or GitHub for proper formatting)</li>
<li><strong>${displaySector}-deep-dive.csv</strong> — raw filtered CSV (open in Excel/Numbers/Sheets for your own analysis)</li>
</ul>
<p>The report ranks <strong>${recordCount} startups in the ${displaySector} sector</strong> by 14-day commit-velocity change. The TL;DR at the top calls out the top 3 with the smallest contributor base — early-stage proxy for "not yet on Crunchbase."</p>
<div style="margin-top:32px;padding:20px 22px;background:#fff7ed;border-left:4px solid #FF6B1A;border-radius:6px;font-size:15px;line-height:1.65;">
<strong style="color:#9a3412;font-size:16px;display:block;margin-bottom:8px;">Allocating real capital into a sector — not just researching one?</strong>
The <a href="https://gitdealflow.com/sector-sweep?utm_source=email&amp;utm_medium=firstlook-delivery&amp;utm_campaign=sector-sweep" style="color:#FF6B1A;font-weight:600;">Custom Sector Sweep</a> takes the same lens you just got for ${displaySector} and runs it across <em>every</em> venture-backed startup in one sector you pick &mdash; engineering acceleration ranked over four quarters, diligence prompts on each top-10 name, three early-stage targets not yet on Crunchbase or PitchBook. Written report in 7 business days, plus a 30-minute clarifications call after delivery. <strong>€1,997 one-time.</strong>
<div style="margin-top:14px;"><a href="/api/checkout/session?tier=sector_sweep" style="display:block;width:100%;box-sizing:border-box;background:#FF6B1A;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(255,107,26,0.35);">Commission a Sector Sweep &rarr;</a></div>
</div>
<p style="margin-top:28px;"><strong>Want this every week, across all 20 sectors?</strong> Reply with <code>credit me</code> to apply your €7 toward the full Dashboard (€9.97/mo founding price, locked forever).</p>
<p>Questions about any specific name? Reply &mdash; same email thread.</p>
<p>— The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>Methodology: <a href="https://signals.gitdealflow.com/methodology" style="color:#0ea5e9;">signals.gitdealflow.com/methodology</a></p>
<p>You're receiving this because you purchased the First Look Pass at <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

export { FIRSTLOOK_STRIPE_URL };
