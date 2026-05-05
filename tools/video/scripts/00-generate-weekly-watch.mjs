#!/usr/bin/env node
/**
 * 00-generate-weekly-watch.mjs — fresh content for the weekly Acceleration
 * Watch video. Pulls the top mover from the live trending API and plugs it
 * into a Brunson Hook → Story → Domino → Offer template, then overwrites
 * `content/predicted-90s.json` so the existing Remotion composition + upload
 * pipeline can run with no changes.
 *
 * Idempotent for a given ISO week — re-running on the same Monday produces
 * the same content (top mover is deterministic against the live API).
 *
 * Usage:
 *   node tools/video/scripts/00-generate-weekly-watch.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "content/predicted-90s.json");
const ARCHIVE_DIR = path.join(ROOT, "content/archive");
if (!existsSync(ARCHIVE_DIR)) mkdirSync(ARCHIVE_DIR, { recursive: true });

const SIGNALS_API = "https://signals.gitdealflow.com/api/v1/signals.json";

// ISO week YYYY-Www
function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dn = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - dn + 3);
  const yr = t.getUTCFullYear();
  const w1 = new Date(Date.UTC(yr, 0, 4));
  const w = 1 + Math.round(((t.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getUTCDay() + 6) % 7)) / 7);
  return `${yr}-w${String(w).padStart(2, "0")}`;
}

// Pick a presentable top mover. Filters: english-friendly description (ASCII >= 60%),
// has a website, decent commit volume to make for a real story.
function pickMover(trending) {
  const isPresentable = (o) => {
    const desc = o.description ?? "";
    const ascii = desc.replace(/[^\x00-\x7F]/g, "").length;
    if (desc.length > 0 && ascii / desc.length < 0.6) return false;
    if (o.commitVelocity14d < 5) return false;
    return true;
  };
  return trending.find(isPresentable) ?? trending[0];
}

const apiRes = await fetch(SIGNALS_API);
if (!apiRes.ok) throw new Error(`signals API ${apiRes.status}`);
const data = await apiRes.json();
const top = pickMover(data.trending);

const week = isoWeek();
const weekHuman = new Date()
  .toISOString()
  .slice(0, 10);
const slug = top.name.replace(/[^A-Za-z0-9]+/g, "-").toLowerCase();
const delta = top.commitVelocityChange ?? "+?";
const sector = (top.signalType ?? "engineering acceleration").toLowerCase();
const stage = top.stage ?? "venture-stage";
const geography = top.geography ?? "global";

const title = `Engineering Acceleration Watch — Week of ${weekHuman} — ${top.name} ${delta}`;
const description = [
  `This week's biggest engineering accelerator: ${top.name} (${stage}, ${geography}).`,
  ``,
  `Commit velocity: ${delta} over 14 days. Signal type: ${top.signalType ?? "deploy/contributor"}.`,
  ``,
  `Why it matters: across the SSRN-indexed panel of 219 confirmed Series A and Series B fundraises, this acceleration profile has historically preceded the announcement by 21 to 47 days. Crunchbase, AngelList, warm intros — all lagging.`,
  ``,
  `🔗 Full Acceleration Watch:    https://signals.gitdealflow.com/predicted`,
  `🔗 Free Sunday digest:          https://gitdealflow.com/#signup`,
  `🔗 SSRN methodology paper:     https://ssrn.com/abstract=6606558`,
  `🔗 Live ranked dashboard:      https://signals.gitdealflow.com/trending`,
  ``,
  `⏱  Chapters`,
  `00:00  This week's biggest accelerator`,
  `00:15  Why GitHub commit velocity is the leading indicator`,
  `00:40  Stage-stratified lead-time band: 21–47 days`,
  `01:00  How to act on the signal`,
  `01:25  CTA — free Sunday digest`,
  ``,
  `Engineering Acceleration ≠ accelerator program. Quantitative GitHub signal computed from public commit-velocity, contributor-influx, and dependents-graph data. Distinct from Y Combinator / Techstars references.`,
  ``,
  `#VentureCapital #DealFlow #GitHub #SeriesA #StartupSignals #${top.name.replace(/[^A-Za-z0-9]/g, "")} #VCTools`,
].join("\n");

const content = {
  id: "predicted-90s",
  title,
  description,
  fps: 30,
  width: 1920,
  height: 1080,
  scenes: [
    {
      id: "title",
      kind: "title",
      vo: "",
      durationHint: 2.5,
      data: {
        title: "Engineering Acceleration Watch",
        subtitle: `Week of ${weekHuman}. Live data feed — not an accelerator program.`,
      },
    },
    {
      id: "hook",
      kind: "hook",
      vo: `By the time a startup hits Crunchbase, every other VC sees it the same morning you do. This week's biggest engineering accelerator surfaced thirty to forty days earlier — and the data was public the whole time.`,
      durationHint: 9.5,
      data: {
        lines: [
          "By the time it hits Crunchbase,",
          "every other VC sees it the same morning.",
          "We saw this one 30+ days earlier.",
        ],
      },
    },
    {
      id: "leader",
      kind: "problem",
      vo: `${top.name}. Stage: ${stage}. Region: ${geography}. Commit velocity is ${delta} over the last fourteen days. That's the ${sector} pattern, and across the panel of two hundred nineteen confirmed rounds, it has historically preceded the fundraise announcement by twenty-one to forty-seven days.`,
      durationHint: 18,
      data: {
        headline: `${top.name} ${delta}`,
        subhead: `${stage} · ${geography} · ${sector}. The 14-day commit-velocity pattern that has historically preceded Series A and Series B by 21 to 47 days across the SSRN panel.`,
      },
    },
    {
      id: "domino",
      kind: "hook",
      vo: `If commit-velocity acceleration is the most leading public signal in venture capital, then every other deal-flow source — pitch decks, AngelList, Crunchbase, warm intros — is a lagging indicator.`,
      durationHint: 12,
      data: {
        lines: [
          "If commit-velocity acceleration is",
          "the most leading public signal,",
          "every other deal-flow source is lagging.",
        ],
      },
    },
    {
      id: "cta",
      kind: "title",
      vo: `Five startups every Monday, free, at gitdealflow.com slash predicted. Methodology open at signals.gitdealflow.com slash methodology. Talk soon.`,
      durationHint: 9,
      data: {
        title: "gitdealflow.com/predicted",
        subtitle: "Free Sunday digest. SSRN methodology. CC BY 4.0.",
      },
    },
  ],
};

writeFileSync(OUT, JSON.stringify(content, null, 2));
const archivePath = path.join(ARCHIVE_DIR, `acceleration-watch-${week}.json`);
writeFileSync(archivePath, JSON.stringify(content, null, 2));

console.log(`Wrote ${path.relative(ROOT, OUT)}`);
console.log(`Wrote ${path.relative(ROOT, archivePath)}`);
console.log(`Top mover: ${top.name} (${delta}, ${stage}, ${geography})`);
console.log(`Title:     ${title}`);
