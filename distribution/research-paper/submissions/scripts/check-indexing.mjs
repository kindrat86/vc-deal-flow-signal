#!/usr/bin/env node
/**
 * check-indexing.mjs — poll every auto-indexing surface for the SSRN paper
 * and the companion Zenodo dataset. No auth required.
 *
 * Updates `distribution/research-paper/amplification-status.json` under
 * `indexing_status` with one key per surface and a recent_check timestamp.
 *
 * Cadence: run daily (schedule via `scripts/run-all.mjs` or a cron).
 *
 * Usage:
 *   node distribution/research-paper/submissions/scripts/check-indexing.mjs
 *   node distribution/research-paper/submissions/scripts/check-indexing.mjs --quiet
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

const SSRN_URL = "https://ssrn.com/abstract=6606558";
const ZENODO_DOI = "10.5281/zenodo.19650920";
const ZENODO_CONCEPT_DOI = "10.5281/zenodo.19650919";
const PAPER_TITLE =
  "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups";

const quiet = process.argv.includes("--quiet");
const log = (...a) => quiet || console.log(...a);

function iso() {
  return new Date().toISOString().slice(0, 19) + "Z";
}

async function getJson(url, opts = {}) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...(opts.headers ?? {}) },
    ...opts,
  });
  const ct = res.headers.get("content-type") ?? "";
  const body = ct.includes("json") ? await res.json().catch(() => null) : null;
  return { status: res.status, ok: res.ok, body };
}

async function checkSemanticScholar() {
  const url = `https://api.semanticscholar.org/graph/v1/paper/URL:${encodeURIComponent(
    SSRN_URL
  )}?fields=title,authors,externalIds,openAccessPdf`;
  const { status, body } = await getJson(url);
  return {
    indexed: status === 200 && body?.paperId,
    status,
    paperId: body?.paperId ?? null,
    url: body?.paperId
      ? `https://www.semanticscholar.org/paper/${body.paperId}`
      : null,
  };
}

async function checkOpenAlex() {
  const url = `https://api.openalex.org/works/doi:${ZENODO_DOI}`;
  const { status, body } = await getJson(url);
  return {
    indexed: status === 200 && body?.id,
    status,
    oaId: body?.id ?? null,
    url: body?.id ?? null,
  };
}

async function checkCrossref() {
  const url = `https://api.crossref.org/works/${ZENODO_DOI}`;
  const { status } = await getJson(url);
  // Zenodo DOIs are DataCite, not Crossref — expected 404.
  return { indexed: status === 200, status };
}

async function checkDataCite() {
  const url = `https://api.datacite.org/dois/${ZENODO_DOI}`;
  const { status, body } = await getJson(url);
  return {
    indexed: status === 200,
    status,
    attrs: body?.data?.attributes ? {
      registered: body.data.attributes.registered,
      state: body.data.attributes.state,
      views: body.data.attributes.viewCount,
      downloads: body.data.attributes.downloadCount,
      citations: body.data.attributes.citationCount,
    } : null,
  };
}

async function checkUnpaywall() {
  const url = `https://api.unpaywall.org/v2/${ZENODO_DOI}?email=signal@gitdealflow.com`;
  const { status, body } = await getJson(url);
  return {
    indexed: status === 200 && body?.is_oa,
    status,
    isOA: body?.is_oa ?? false,
    bestUrl: body?.best_oa_location?.url ?? null,
  };
}

async function checkOpenAIRE() {
  const url = `https://api.openaire.eu/search/publications?doi=${ZENODO_DOI}&format=json`;
  const { status, body } = await getJson(url);
  const total =
    body?.response?.header?.total?.$ ??
    body?.response?.header?.total ??
    0;
  return { indexed: Number(total) > 0, status, total };
}

async function checkZenodo() {
  const id = ZENODO_DOI.split(".").pop();
  const url = `https://zenodo.org/api/records/${id}`;
  const { status, body } = await getJson(url);
  return {
    indexed: status === 200,
    status,
    views: body?.stats?.views ?? null,
    downloads: body?.stats?.downloads ?? null,
    unique_views: body?.stats?.unique_views ?? null,
  };
}

async function checkGoogleScholar() {
  // Google Scholar blocks bots aggressively — a robust check would use
  // serpapi or scholarly. Here we do a best-effort HTML scrape.
  const url = `https://scholar.google.com/scholar?q=%22${encodeURIComponent(
    PAPER_TITLE
  )}%22`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15",
    },
  });
  const html = res.ok ? await res.text() : "";
  // Google Scholar search page echoes the query in the HTML. To avoid a
  // false positive we require the SSRN abstract ID to appear inside a
  // result link (`<a href="...ssrn.com/abstract=6606558">`) and NOT just
  // as part of the search query.
  const hit =
    /<a[^>]+href="[^"]*ssrn\.com\/abstract=6606558/i.test(html) ||
    /<a[^>]+href="[^"]*zenodo\.org\/records?\/19650920/i.test(html);
  const zeroResults =
    /did not match any articles|δεν αντιστοιχεί σε κανένα άρθρο/i.test(html);
  return {
    indexed: hit,
    status: res.status,
    blocked: res.status === 429,
    zeroResults,
  };
}

async function main() {
  const results = {};
  const t0 = Date.now();

  const checks = {
    semantic_scholar: checkSemanticScholar,
    openalex: checkOpenAlex,
    crossref: checkCrossref,
    datacite: checkDataCite,
    unpaywall: checkUnpaywall,
    openaire: checkOpenAIRE,
    zenodo: checkZenodo,
    google_scholar: checkGoogleScholar,
  };

  for (const [key, fn] of Object.entries(checks)) {
    try {
      results[key] = await fn();
      log(
        `[${key}] ${results[key].indexed ? "✅" : "⏳"} status=${
          results[key].status
        }${results[key].url ? ` url=${results[key].url}` : ""}`
      );
    } catch (err) {
      results[key] = { error: err.message };
      log(`[${key}] ❌ error: ${err.message}`);
    }
  }

  const elapsed_ms = Date.now() - t0;

  // Merge into amplification-status.json.
  const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
  status.indexing_status = {
    last_checked: iso(),
    elapsed_ms,
    ...results,
  };
  status.last_checked = iso().slice(0, 10);
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");

  const indexed_count = Object.values(results).filter((r) => r.indexed).length;
  log(
    `\nIndexed on ${indexed_count}/${
      Object.keys(checks).length
    } surfaces. Wrote ${path.relative(ROOT, STATUS_PATH)}.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
