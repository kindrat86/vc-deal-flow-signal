#!/usr/bin/env node
/**
 * One-shot data repair for the two P0 integrity defects (backlog order 2).
 *
 *   (a) re-fetch `contributors` for every org currently capped at exactly 100
 *       (the old single-page fetch truncates any repo with >100 contributors);
 *       follow the Link: rel="next" pagination to the true count.
 *   (b) re-label every record whose commit-velocity change is NEGATIVE from its
 *       acceleration signal type to "Deceleration" (honest labelling — the
 *       primary velocity metric is falling, not accelerating).
 *
 * Idempotent and rerunnable. `--dry-run` prints what would change without
 * writing. Run `node scripts/verify-data-integrity.mjs` afterwards to confirm.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = join(ROOT, "data", "startups.json");

const ACCELERATION_TYPES = new Set([
  "Engineering hiring burst",
  "Infrastructure buildout",
  "Deploy frequency spike",
  "Framework migration",
]);

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const t = execSync("gh auth token", { encoding: "utf8" }).trim();
    if (t) return t;
  } catch {}
  throw new Error("No GitHub token. Set GITHUB_TOKEN or run `gh auth login`.");
}
const TOKEN = getToken();
const HEADERS = {
  Authorization: `token ${TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "vc-deal-flow-signal",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ghFetch(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (res.status === 202) {
    await sleep(2500);
    return ghFetch(url);
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res;
}

async function fetchAllPages(url, maxPages = 10) {
  const out = [];
  let current = url;
  for (let p = 0; p < maxPages; p++) {
    const res = await ghFetch(current);
    const body = await res.json();
    if (!Array.isArray(body)) break;
    out.push(...body);
    const link = res.headers.get("link");
    const m = link ? /<([^>]+)>\s*;\s*rel="next"/.exec(link) : null;
    const nextUrl = m?.[1];
    if (!nextUrl) break;
    current = nextUrl;
    await sleep(250);
  }
  return out;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));

  const records = [];
  const cappedOrgs = new Set();
  for (const sector of data.sectors ?? []) {
    for (const snap of Object.values(sector.periods ?? {})) {
      for (const s of snap.startups ?? []) {
        records.push(s);
        if (s.contributors === 100) cappedOrgs.add(s.name);
      }
    }
  }
  console.log(`Records: ${records.length}, orgs with contributors===100: ${cappedOrgs.size}`);

  // (b) re-label negative velocity as Deceleration (pure, instantaneous)
  let relabeled = 0;
  for (const r of records) {
    if (String(r.commitVelocityChange ?? "").startsWith("-") && ACCELERATION_TYPES.has(r.signalType)) {
      r.signalType = "Deceleration";
      relabeled++;
    }
  }
  console.log(`Re-labelled negative-velocity → Deceleration: ${relabeled}`);

  // (a) re-fetch contributors for capped orgs (network)
  const orgs = [...cappedOrgs];
  let fixed = 0;
  let failed = 0;
  for (let i = 0; i < orgs.length; i++) {
    const login = orgs[i];
    try {
      await sleep(250);
      const reposRes = await ghFetch(
        `https://api.github.com/orgs/${login}/repos?sort=pushed&direction=desc&per_page=100&type=public`,
      );
      const repos = await reposRes.json();
      // Primary repo = most-starred NON-FORK among the org's recently-pushed
      // repos. The org listing endpoint has no sort=stars, so picking repos[0]
      // (most-recently-pushed) lands on docs sites, .github meta repos,
      // homebrew taps and testdata for ~25% of orgs; the highest-starred repo
      // is the actual product repo whose contributor count is meaningful.
      let primary;
      if (Array.isArray(repos)) {
        let bestStars = -1;
        for (const r of repos) {
          if (r.fork) continue;
          const stars = r.stargazers_count ?? 0;
          if (stars > bestStars) {
            bestStars = stars;
            primary = r;
          }
        }
      }
      if (!primary) {
        console.log(`  [${i + 1}/${orgs.length}] ${login}: no non-fork public repo, skip`);
        failed++;
        continue;
      }
      await sleep(250);
      const contribs = await fetchAllPages(
        `https://api.github.com/repos/${login}/${primary.name}/contributors?per_page=100`,
      );
      const count = Math.max(1, contribs.length);
      let updated = 0;
      for (const r of records) {
        if (r.name === login) {
          r.contributors = count;
          updated++;
        }
      }
      console.log(`  [${i + 1}/${orgs.length}] ${login}: ${primary.name} → ${count} contributors (${updated} records)`);
      if (updated > 0) fixed++;
    } catch (e) {
      console.log(`  [${i + 1}/${orgs.length}] ${login}: ERROR ${e.message}`);
      failed++;
    }
  }

  console.log(`\nSummary — orgs fixed: ${fixed}, failed/skipped: ${failed}, re-labelled: ${relabeled}`);
  if (dryRun) {
    console.log("DRY RUN — nothing written.");
  } else {
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`Wrote ${DATA_PATH}`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
