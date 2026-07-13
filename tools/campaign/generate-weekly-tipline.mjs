#!/usr/bin/env node
/**
 * generate-weekly-tipline.mjs — recurring weekly tip-line drop generator.
 *
 * Reads pseo-site/data/predictions.json, picks the most recent week, and
 * writes 5 newsletter-tailored email drafts to tools/campaign/drafts/.
 *
 * Outlets (deal-flow news desks; anonymity-clean — byline "GitDealFlow
 * Research" / "The Data Nerd"):
 *   1. StrictlyVC          — tips@strictlyvc.com         (Connie Loizos)
 *   2. Term Sheet (Fortune)— termsheet@fortune.com       (Dan Primack)
 *   3. Axios Pro Rata      — proratatips@axios.com       (Dan Primack)
 *   4. Newcomer            — tips@newcomer.co            (Eric Newcomer)
 *   5. The Information     — tips@theinformation.com     (data desk)
 *
 * SAFETY
 * ──────
 * - Drafts only. Never auto-sends. Caller (you) must `cat`/edit/forward
 *   from the drafts folder.
 * - Honors tools/campaign/HOLD — if present, prints a warning before
 *   writing (writes still proceed since drafts ≠ sends, but the warning
 *   reminds you not to forward without lifting HOLD).
 * - Idempotent — same week generates same draft filenames so re-running
 *   overwrites cleanly. One-tip-per-outlet-per-week is enforced by the
 *   filename ISO-week stamp.
 *
 * USAGE
 * ─────
 *   node tools/campaign/generate-weekly-tipline.mjs
 *
 * Set TIPLINE_VERBOSE=1 for the full body print.
 *
 * Cron wiring (when you want it on autopilot):
 *   Recurring scheduled task on Monday 09:00 UTC, prompt body in
 *   tools/campaign/RECURRING-TASK-PROMPT.md.
 */

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Repo root = two levels up from tools/campaign/
const REPO_ROOT = resolve(__dirname, "..", "..");
const PREDICTIONS_PATH = resolve(REPO_ROOT, "pseo-site/data/predictions.json");
const DRAFTS_DIR = resolve(REPO_ROOT, "tools/campaign/drafts");
const HOLD_PATH = resolve(REPO_ROOT, "tools/campaign/HOLD");

const SITE = "https://signals.gitdealflow.com";
const FROM = "signals@gitdealflow.com";
const SSRN = "ssrn.com/abstract=6606558";

/** Outlets we tip. Each gets a tailored intro that fits the desk's beat. */
const OUTLETS = [
  {
    slug: "strictlyvc",
    label: "StrictlyVC",
    to: "tips@strictlyvc.com",
    addressee: "StrictlyVC team",
    angle:
      "Five startups whose engineering acceleration crossed our signal threshold the week of {weekDate} — the kind of pre-deck activity that usually shows up in your inbox 30+ days later.",
    closing: "Happy to walk through any of the five, or share the underlying repo-level data on request.",
  },
  {
    slug: "term-sheet",
    label: "Term Sheet (Fortune)",
    to: "termsheet@fortune.com",
    addressee: "Dan / Term Sheet team",
    angle:
      "Every Monday we publish 10 startups whose GitHub engineering acceleration crossed our signal threshold the prior week, graded post-hoc against fundraise news at 60 days. Top 5 from the {weekDate} cohort below — figured Term Sheet might want to know which seed/Series-A names are showing the cleanest pre-announce signature.",
    closing: "Fact pack with regression coefficients on request. Public methodology at /methodology.",
  },
  {
    slug: "axios-pro-rata",
    label: "Axios Pro Rata",
    to: "proratatips@axios.com",
    addressee: "Pro Rata team",
    angle:
      "Quick-hit data drop for the {weekDate} cycle — top 5 GitHub-momentum movers from this week's Engineering Acceleration Watch. Each is a venture-stage company whose 14-day commit velocity crossed the 95th percentile of our 4,200-org panel.",
    closing: "Bullet-format-friendly. Raw JSON feed at /predicted/feed.json if useful for an embedded chart.",
  },
  {
    slug: "newcomer",
    label: "Newcomer",
    to: "tips@newcomer.co",
    addressee: "Eric / Newcomer team",
    angle:
      "Pre-announce signal drop for the {weekDate} cycle. Five companies showing the cleanest GitHub-engineering acceleration this week — by our methodology, the lead-time IQR on signals like these is 21–47 days before public fundraise. If any of these names are already on your radar, you're seeing the same thing the data is.",
    closing: "Happy to share the contributor-level diff or the Stripe-graph correlate on a specific name.",
  },
  {
    slug: "the-information",
    label: "The Information",
    to: "tips@theinformation.com",
    addressee: "The Information data desk",
    angle:
      "Data exclusive for the week of {weekDate}: five startups whose GitHub engineering signature crossed our acceleration threshold this week. SSRN-published methodology (n=219, 21–47 day pre-announce lead-time IQR). The full panel covers 4,200 venture-backed orgs.",
    closing: "All numbers reproducible against the public Zenodo dataset linked from /methodology. Custom cuts (sector / geography / stage) on request.",
  },
];

function isoWeekStamp(weekStartIso) {
  // Use the week's slug-style stamp from the source data when possible.
  // Falls back to ISO week-of-year computation.
  const d = new Date(weekStartIso + "T00:00:00Z");
  const target = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }
  const week = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return `${d.getUTCFullYear()}-w${String(week).padStart(2, "0")}`;
}

function fmtLongDate(iso) {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function buildPickLine(p, idx) {
  // One short line per pick. Anchor on (a) what makes it interesting,
  // (b) the engineering signature, (c) the GitHub URL.
  const stage = p.stage ? `${p.stage} ` : "";
  const geo = p.geography && p.geography !== "Unknown" ? `${p.geography} ` : "";
  return [
    `${idx + 1}. ${p.displayName} — ${geo}${stage}${p.sector}.`,
    `   Signal: ${p.signalType}. ${p.commitVelocityChange} velocity over 14 days, ${p.contributors} contributors.`,
    `   Why it crossed: ${p.thesis}`,
    `   Repo: ${p.githubUrl}`,
  ].join("\n");
}

function buildBody(outlet, week, top5) {
  const weekDate = fmtLongDate(week.weekStart);
  const weekUrl = `${SITE}/predicted/${week.slug}`;
  const angle = outlet.angle.replace("{weekDate}", weekDate);

  const picks = top5.map(buildPickLine).join("\n\n");

  return [
    `TO: ${outlet.to}`,
    `FROM: ${FROM}`,
    `SUBJECT: GitHub Momentum Index — week of ${weekDate} — 5 movers`,
    ``,
    `Hi ${outlet.addressee},`,
    ``,
    angle,
    ``,
    picks,
    ``,
    `Full week (10 picks + grading window) — ${weekUrl}`,
    `Methodology — ${SITE}/methodology`,
    `Paper — ${SSRN}`,
    `Embed widget (top 5, auto-updating, CC BY 4.0) — ${SITE}/embed/weekly`,
    `JSON feed — ${SITE}/predicted/feed.json`,
    ``,
    outlet.closing,
    ``,
    `— GitDealFlow Research`,
    `   The Data Nerd · ${SITE}/about`,
    ``,
    `(One-line provenance: signal threshold = 95th-percentile commit-velocity Δ over a rolling 14-day window across a 4,200-org venture-backed panel. Outcomes are graded post-hoc from public news; the 60-day window for this cohort closes ${fmtLongDate(week.gradingDueAt)}.)`,
  ].join("\n");
}

async function main() {
  // 1. Read predictions
  const raw = await readFile(PREDICTIONS_PATH, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data.weeks) || data.weeks.length === 0) {
    console.error("No weeks found in predictions.json — aborting.");
    process.exit(1);
  }

  // 2. Pick most recent (sort by weekStart descending)
  const sorted = [...data.weeks].sort((a, b) =>
    a.weekStart < b.weekStart ? 1 : a.weekStart > b.weekStart ? -1 : 0,
  );
  const week = sorted[0];
  const top5 = (week.picks ?? []).slice(0, 5);
  if (top5.length < 1) {
    console.error(`Week ${week.slug} has no picks — aborting.`);
    process.exit(1);
  }

  // 3. HOLD warning (drafts still write — HOLD only blocks sends)
  if (existsSync(HOLD_PATH)) {
    console.warn(
      "⚠ tools/campaign/HOLD is present. Drafts will still be generated, but DO NOT forward them until HOLD is lifted (rm tools/campaign/HOLD).",
    );
  }

  // 4. Ensure drafts dir
  await mkdir(DRAFTS_DIR, { recursive: true });

  // 5. Generate + write
  const stamp = isoWeekStamp(week.weekStart);
  const written = [];
  for (const outlet of OUTLETS) {
    const body = buildBody(outlet, week, top5);
    const filename = `tipline-${stamp}-${outlet.slug}.txt`;
    const path = resolve(DRAFTS_DIR, filename);
    await writeFile(path, body, "utf8");
    written.push({ outlet: outlet.label, path, bytes: body.length });
  }

  // 6. Manifest — list what landed
  const manifestPath = resolve(DRAFTS_DIR, `tipline-${stamp}-MANIFEST.txt`);
  const manifestBody = [
    `Weekly tip-line drop — ${stamp}`,
    `Week: ${week.slug} (${week.weekStart} → ${week.weekEnd})`,
    `Picks shown: top ${top5.length} of ${week.picks.length}`,
    `Generated: ${new Date().toISOString()}`,
    ``,
    `Drafts:`,
    ...written.map((w) => `  - ${w.outlet}: ${w.path.replace(REPO_ROOT + "/", "")} (${w.bytes} bytes)`),
    ``,
    `Status: drafts only — review and forward manually.`,
    `HOLD active: ${existsSync(HOLD_PATH) ? "YES — do not forward" : "no"}`,
  ].join("\n");
  await writeFile(manifestPath, manifestBody, "utf8");

  // 7. Summary
  console.log(manifestBody);
  if (process.env.TIPLINE_VERBOSE === "1") {
    for (const w of written) {
      const buf = await readFile(w.path, "utf8");
      console.log(`\n────────  ${w.outlet}  ────────\n${buf}`);
    }
  }
}

main().catch((err) => {
  console.error("generate-weekly-tipline failed:", err);
  process.exit(1);
});
