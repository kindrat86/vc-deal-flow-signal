#!/usr/bin/env node
/**
 * submit-wayback-machine.mjs — archive every SSRN paper + dataset URL
 * at web.archive.org. Fully autonomous; no auth required.
 *
 * The Wayback Machine's Save Page Now endpoint is:
 *   POST https://web.archive.org/save/<url>
 *
 * A successful save returns 200 with the archived URL in the
 * `Content-Location` header: `/web/<timestamp>/<url>`.
 *
 * Usage:
 *   node distribution/research-paper/submissions/scripts/submit-wayback-machine.mjs
 *   node distribution/research-paper/submissions/scripts/submit-wayback-machine.mjs --quiet
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const STATUS_PATH = path.join(
  ROOT,
  "distribution",
  "research-paper",
  "amplification-status.json"
);

const URLS = [
  "https://ssrn.com/abstract=6606558",
  "https://ssrn.com/author=11219548",
  "https://zenodo.org/records/19650920",
  "https://doi.org/10.5281/zenodo.19650920",
  "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
  "https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration",
  "https://github.com/kindrat86/gitdealflow-signal-classifier",
  "https://signals.gitdealflow.com/api/signals.csv",
  "https://gitdealflow.com/",
  "https://www.wikidata.org/wiki/Q139493250",
  "https://www.wikidata.org/wiki/Q139376302",
];

const quiet = process.argv.includes("--quiet");
const log = (...a) => quiet || console.log(...a);

function iso() {
  return new Date().toISOString().slice(0, 19) + "Z";
}

async function archive(url) {
  // Send a HEAD to check liveness first; if the target is down, skip.
  try {
    const liveRes = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });
    if (!liveRes.ok && liveRes.status !== 403) {
      return { url, ok: false, status: liveRes.status, reason: "source_unreachable" };
    }
  } catch {
    // Some servers block HEAD but allow GET. Proceed anyway.
  }

  // Wayback Machine's Save Page Now endpoint returns 302 → follow it
  // to get the final archived URL (`https://web.archive.org/web/<ts>/<url>`).
  const saveUrl = `https://web.archive.org/save/${url}`;
  const res = await fetch(saveUrl, {
    method: "GET",
    redirect: "follow",
    headers: {
      "User-Agent":
        "GitDealFlow-Archiver/1.0 (contact: signal@gitdealflow.com)",
      Accept: "*/*",
    },
  });

  // After redirect, res.url is the final URL. If it's a /web/ archive URL,
  // consider it archived. Otherwise the save failed (e.g., origin 520).
  const archivedUrl = res.url.includes("web.archive.org/web/") ? res.url : null;

  return {
    url,
    ok: !!archivedUrl || res.status === 200 || res.status === 429,
    status: res.status,
    finalUrl: res.url,
    archivedUrl,
    throttled: res.status === 429,
  };
}

async function main() {
  log(`Archiving ${URLS.length} URLs at web.archive.org...\n`);
  const archives = [];

  for (const url of URLS) {
    try {
      const result = await archive(url);
      archives.push(result);
      if (result.throttled) {
        log(`[${url}] ⏸ throttled — waiting 15s before next URL`);
        await new Promise((r) => setTimeout(r, 15_000));
      } else if (result.archivedUrl) {
        log(`[${url}] ✅ ${result.archivedUrl}`);
      } else {
        log(`[${url}] ⚠️ status=${result.status} (no Location header)`);
      }
      // Rate-limit: Wayback allows up to ~15 req/min for anonymous.
      await new Promise((r) => setTimeout(r, 4_000));
    } catch (err) {
      archives.push({ url, ok: false, error: err.message });
      log(`[${url}] ❌ ${err.message}`);
    }
  }

  // Merge into amplification-status.json.
  const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
  status.wayback_machine = {
    last_run: iso(),
    total: URLS.length,
    succeeded: archives.filter((a) => a.archivedUrl).length,
    archives,
  };
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");

  log(
    `\n${archives.filter((a) => a.archivedUrl).length}/${URLS.length} archived. Updated ${path.relative(ROOT, STATUS_PATH)}.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
