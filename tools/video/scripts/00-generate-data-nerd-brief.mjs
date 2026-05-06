#!/usr/bin/env node
/**
 * 00-generate-data-nerd-brief.mjs — fresh content for the weekly Data Nerd
 * Brief Short. Brunson Expert Secrets Ch 3 (Charismatic Leader): the
 * recurring character moment, on a different beat from the Monday data
 * show. Wednesday 14:07 UTC.
 *
 * Picks one of seven weekday "frames" by ISO week index, anchors it to a
 * real org from the live signals API, and writes a fully-populated
 * `content/data-nerd-brief.json` that the existing TTS + Remotion + upload
 * pipeline can run against with no changes.
 *
 * The seven frames mirror the Daily Seinfeld rotation in
 * pseo-site/lib/daily-seinfeld.ts so the channel and the email list speak
 * the same persona shape on the same week.
 *
 * Idempotent for a given ISO week.
 *
 * Usage:
 *   node tools/video/scripts/00-generate-data-nerd-brief.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "content/data-nerd-brief.json");
const ARCHIVE_DIR = path.join(ROOT, "content/archive");
if (!existsSync(ARCHIVE_DIR)) mkdirSync(ARCHIVE_DIR, { recursive: true });

const SIGNALS_API = "https://signals.gitdealflow.com/api/v1/signals.json";

// ISO week YYYY-Www (mirrors 00-generate-weekly-watch.mjs).
function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dn = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - dn + 3);
  const yr = t.getUTCFullYear();
  const w1 = new Date(Date.UTC(yr, 0, 4));
  const w = 1 + Math.round(((t.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getUTCDay() + 6) % 7)) / 7);
  return { iso: `${yr}-w${String(w).padStart(2, "0")}`, weekNum: w, year: yr };
}

const FRAMES = [
  // Each frame is a (persona-shaped) brief: hook stamp, three timeline
  // beats with placeholders that get filled from the live signal, and a
  // closing voice-over. The Charismatic Leader is the same voice across
  // all seven frames; only the parable changes.
  {
    key: "mover",
    needs: "topMover",
    title: "The biggest mover this week",
    hookMid: "ONE NAME",
    hookBottom: "led the panel.",
    beats: (top) => [
      { day: "ORG",   label: top.nameUpper,             detail: top.stage },
      { day: "Δ14d",  label: `${top.delta} velocity`,    detail: top.signalLabel },
      { day: "WHY",   label: "Pre-deck signal",         detail: "21–47d lead", win: true },
    ],
    voObservation: (top) => `One name led the panel this week. ${top.nameSpoken}. Velocity ${top.deltaSpoken}. The kind of acceleration that sits twenty one to forty seven days ahead of the deck.`,
  },
  {
    key: "shape",
    needs: "none",
    title: "Shape over size",
    hookMid: "SHAPE",
    hookBottom: "beats size.",
    beats: (top) => [
      { day: "ONE",   label: "Velocity up",             detail: top.delta },
      { day: "TWO",   label: "Gini under 0.30",         detail: "load shared" },
      { day: "THREE", label: "3.4× round odds",         detail: "shape wins", win: true },
    ],
    voObservation: () => `Velocity matters. The shape of the velocity matters more. Spread Gini under zero point three, round odds three point four times higher than spike alone.`,
  },
  {
    key: "newcomer",
    needs: "topMover",
    title: "A name that wasn't here last quarter",
    hookMid: "NEW",
    hookBottom: "on the panel.",
    beats: (top) => [
      { day: "ORG",   label: top.nameUpper,             detail: top.stage },
      { day: "FIRST", label: "First spike",             detail: top.signalLabel },
      { day: "READ",  label: "Open the README",         detail: "before the deck", win: true },
    ],
    voObservation: (top) => `${top.nameSpoken} was not on this panel ninety days ago. First acceleration spike on the books. Open the readme before the deck arrives.`,
  },
  {
    key: "diversity",
    needs: "none",
    title: "Bus factor is back in fashion",
    hookMid: "BUS FACTOR",
    hookBottom: "back in fashion.",
    beats: () => [
      { day: "READ",  label: "Top 1 < 50%",             detail: "share the load" },
      { day: "COUNT", label: "≥ 4 contributors",        detail: "10+ commits" },
      { day: "WHY",   label: "Round-ready team",         detail: "not one person", win: true },
    ],
    voObservation: () => `Top contributor under fifty percent. Four or more committers above ten commits in ninety days. That is a team a check can fund. Anything else is a salary line item.`,
  },
  {
    key: "platform",
    needs: "topMover",
    title: "Three new repos in 30 days",
    hookMid: "3 REPOS",
    hookBottom: "in thirty days.",
    beats: (top) => [
      { day: "ORG",   label: top.nameUpper,             detail: top.stage },
      { day: "BUILD", label: "SDK · CLI · infra",        detail: "platform shape" },
      { day: "READ",  label: "Capital deploying",       detail: "not announced", win: true },
    ],
    voObservation: (top) => `${top.nameSpoken} pushed three new repos in thirty days. SDK, CLI, internal infra. That is what capital deploying looks like before the announcement.`,
  },
  {
    key: "ratio",
    needs: "none",
    title: "Ship faster than the inbox",
    hookMid: "PR > ISSUE",
    hookBottom: "ship the inbox.",
    beats: () => [
      { day: "READ",  label: "PRs ÷ Issues > 1.5",      detail: "30-day window" },
      { day: "FAIL",  label: "Ratio under 0.7",         detail: "queue piles up" },
      { day: "WHY",   label: "Round absorbs hires",     detail: "not firefighting", win: true },
    ],
    voObservation: () => `Pull requests closed divided by issues opened, over thirty days. Above one point five and the team is shipping faster than its inbox. Below zero point seven and the next round is firefighting.`,
  },
  {
    key: "false-positive",
    needs: "none",
    title: "What false positives actually look like",
    hookMid: "62%",
    hookBottom: "precision at 90d.",
    beats: () => [
      { day: "RAW",   label: "62% precision",           detail: "raise in 90d" },
      { day: "FILE",  label: "70% silent rounds",       detail: "extension · M&A" },
      { day: "TRUE",  label: "96% material event",      detail: "round OR launch", win: true },
    ],
    voObservation: () => `Raw signal precision is sixty two percent at ninety days. Of the misses, seventy percent are silent rounds, fifteen percent are product launches, four percent are nothing. Reframe as material event and you are at ninety six.`,
  },
];

function normaliseTopMover(o) {
  const nameRaw = (o?.name ?? "Unknown").toString();
  const safeName = nameRaw.replace(/[^\w./-]/g, "").slice(0, 32) || "Unknown";
  // Spoken name: split slashes, drop common org/repo separators.
  const nameSpoken = safeName.replace(/[/_-]/g, " ").replace(/\s+/g, " ").trim();
  const delta = (o?.commitVelocityChange ?? "+?").toString();
  // Spoken delta: "+2.3x" → "two point three times". Keep simple & robust.
  const deltaSpoken = delta
    .replace(/^\+/, "up ")
    .replace(/x$/i, " times")
    .replace(/\.(\d)/g, " point $1")
    .replace(/(\d)/g, "$1");
  const signalLabel = (o?.signalType ?? "deploy/contributor").toString().toLowerCase();
  return {
    nameRaw: safeName,
    nameUpper: safeName.toUpperCase(),
    nameSpoken,
    delta,
    deltaSpoken,
    signalLabel,
    stage: (o?.stage ?? "venture").toString(),
  };
}

async function main() {
  const { iso, weekNum } = isoWeek();
  const frame = FRAMES[weekNum % FRAMES.length];

  let topMover = null;
  if (frame.needs === "topMover") {
    const apiRes = await fetch(SIGNALS_API);
    if (!apiRes.ok) throw new Error(`signals API ${apiRes.status}`);
    const data = await apiRes.json();
    const trending = Array.isArray(data?.trending) ? data.trending : [];
    // Same presentability filter as the Monday generator.
    const isPresentable = (o) => {
      const desc = (o?.description ?? "").toString();
      const ascii = desc.replace(/[^\x00-\x7F]/g, "").length;
      if (desc.length > 0 && ascii / desc.length < 0.6) return false;
      if ((o?.commitVelocity14d ?? 0) < 5) return false;
      return true;
    };
    const picked = trending.find(isPresentable) ?? trending[0];
    if (!picked) throw new Error("signals API returned no trending entries");
    topMover = normaliseTopMover(picked);
  }

  const titleHuman = new Date().toISOString().slice(0, 10);
  const title = `Data Nerd Brief — Week of ${titleHuman} — ${frame.title}`;
  const description = [
    `One observation from this week's panel: ${frame.title.toLowerCase()}.`,
    ``,
    topMover
      ? `Anchor: ${topMover.nameRaw} (${topMover.stage}). 14-day Δ: ${topMover.delta}. Signal: ${topMover.signalLabel}.`
      : `Frame: ${frame.key} — methodology talk, not a single org.`,
    ``,
    `Why it matters: across the SSRN-indexed panel of 219 confirmed Series A and Series B fundraises, the patterns we read on this channel have historically preceded the announcement by 21 to 47 days. The Brief runs every Wednesday; the full Acceleration Watch every Monday.`,
    ``,
    `🔗 Free Sunday digest:          https://gitdealflow.com/#signup`,
    `🔗 Full Acceleration Watch:    https://signals.gitdealflow.com/predicted`,
    `🔗 SSRN methodology paper:     https://ssrn.com/abstract=6606558`,
    `🔗 Live ranked dashboard:      https://signals.gitdealflow.com/trending`,
    ``,
    `#shorts #vc #dealflow #github #startups`,
  ].join("\n");

  const content = {
    id: "data-nerd-brief",
    title: title.slice(0, 100),
    description,
    fps: 30,
    width: 1080,
    height: 1920,
    scenes: [
      {
        id: "hook",
        kind: "short-hook",
        vo: `I am the Data Nerd. Quick observation from the panel this week.`,
        durationHint: 5.0,
        data: {
          topLine: "Quick observation",
          midLine: frame.hookMid,
          bottomLine: frame.hookBottom,
          stamp: "The Data Nerd",
        },
      },
      {
        id: "observation",
        kind: "short-timeline",
        vo: frame.voObservation(topMover ?? {}),
        durationHint: 18.0,
        data: {
          title: frame.title,
          beats: frame.beats(topMover ?? {}),
        },
      },
      {
        id: "cta",
        kind: "short-cta",
        vo: `Free Sunday digest at gitdealflow dot com slash predicted. Five names every week.`,
        durationHint: 6.5,
        data: {
          headline: "Free Sunday digest",
          url: "gitdealflow.com/predicted",
          tag: "5 names · every Monday",
        },
      },
    ],
  };

  writeFileSync(OUT, JSON.stringify(content, null, 2) + "\n");
  // Archive a copy keyed to the ISO week so the channel ledger is forensic.
  writeFileSync(
    path.join(ARCHIVE_DIR, `data-nerd-brief-${iso}.json`),
    JSON.stringify(content, null, 2) + "\n",
  );

  console.log(`✓ data-nerd-brief generated for ${iso} (frame: ${frame.key})`);
  if (topMover) console.log(`  anchor: ${topMover.nameRaw} (${topMover.delta})`);
}

main().catch((err) => {
  console.error("✗ data-nerd-brief generator failed:", err);
  process.exit(1);
});
