#!/usr/bin/env node
/**
 * submit-figshare.mjs — upload the dataset to Figshare.
 *
 * Uses the Figshare REST API: https://docs.figshare.com/
 *
 * Requires env var: FIGSHARE_TOKEN
 *   (Figshare → Applications → Personal Token)
 *
 * Flow:
 *   1) POST /v2/account/articles       — create article
 *   2) For each file:
 *        POST /v2/account/articles/{id}/files    — initiate upload
 *        PUT/POST   the parts                    — stream bytes
 *        POST /v2/account/articles/{id}/files/{file_id} — finalize
 *   3) POST /v2/account/articles/{id}/publish  — go public
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const STATUS_PATH = path.join(
  ROOT,
  "distribution",
  "research-paper",
  "amplification-status.json"
);

const token = process.env.FIGSHARE_TOKEN;
if (!token) {
  console.error(
    "ERROR: FIGSHARE_TOKEN not set. Generate at https://figshare.com/account/applications → Create Personal Token."
  );
  process.exit(2);
}

const BASE = "https://api.figshare.com/v2";
const hdrs = {
  Authorization: `token ${token}`,
  "Content-Type": "application/json",
};

const article = {
  title:
    "Startup GitHub Engineering Velocity Panel — 219 observations, 55 startups, 5 quarters (companion to SSRN paper 6606558)",
  description:
    "Longitudinal panel of GitHub engineering-velocity signals for 55 venture-backed startups across 20 sectors (Q2 2025 – Q2 2026, 219 observations). Companion dataset to the SSRN preprint https://ssrn.com/abstract=6606558 and mirror of the Zenodo deposit at https://doi.org/10.5281/zenodo.19650920.",
  tags: [
    "venture capital",
    "alternative data",
    "github",
    "open source",
    "engineering velocity",
    "startup analytics",
    "panel data",
  ],
  categories_by_source_id: [
    "400299", // Applied economics not elsewhere classified (ANZSRC FoR)
    "460999", // Information systems not elsewhere classified
    "460399", // Data management and data science
  ],
  defined_type: "dataset",
  license: 29, // Figshare's CC BY 4.0 license ID
  references: [
    "https://ssrn.com/abstract=6606558",
    "https://doi.org/10.5281/zenodo.19650920",
    "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
    "https://github.com/kindrat86/gitdealflow-signal-classifier",
  ],
};

const FILES = [
  "distribution/dataset/startup_signals.csv",
  "distribution/dataset/sector_aggregates.csv",
  "distribution/dataset/signal_type_timeseries.csv",
  "distribution/dataset/datapackage.json",
  "distribution/dataset/README.md",
  "distribution/dataset/LICENSE",
  "distribution/dataset/CITATION.cff",
];

function md5(buf) {
  return crypto.createHash("md5").update(buf).digest("hex");
}

async function jsonReq(url, opts = {}) {
  const res = await fetch(url, { headers: hdrs, ...opts });
  if (!res.ok) throw new Error(`${url} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function uploadFile(articleId, abs) {
  const bytes = fs.readFileSync(abs);
  const fileMeta = {
    md5: md5(bytes),
    name: path.basename(abs),
    size: bytes.length,
  };
  const { location } = await jsonReq(
    `${BASE}/account/articles/${articleId}/files`,
    { method: "POST", body: JSON.stringify(fileMeta) }
  );
  const fileId = location.split("/").pop();
  // Get upload URL parts.
  const file = await jsonReq(
    `${BASE}/account/articles/${articleId}/files/${fileId}`
  );
  const parts = await jsonReq(file.upload_url);
  for (const part of parts.parts) {
    const slice = bytes.slice(part.startOffset, part.endOffset + 1);
    const put = await fetch(`${file.upload_url}/${part.partNo}`, {
      method: "PUT",
      headers: { Authorization: hdrs.Authorization },
      body: slice,
    });
    if (!put.ok)
      throw new Error(`part ${part.partNo} → ${put.status}`);
  }
  // Finalize.
  await jsonReq(`${BASE}/account/articles/${articleId}/files/${fileId}`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return fileId;
}

async function main() {
  console.log("Creating Figshare article...");
  const { location } = await jsonReq(`${BASE}/account/articles`, {
    method: "POST",
    body: JSON.stringify(article),
  });
  const articleId = location.split("/").pop();
  console.log(`Article ID: ${articleId}`);

  for (const rel of FILES) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      console.warn(`[skip] ${rel} not found on disk`);
      continue;
    }
    const id = await uploadFile(articleId, abs);
    console.log(`  ✅ ${rel} (file ${id})`);
  }

  console.log("Publishing article...");
  await jsonReq(`${BASE}/account/articles/${articleId}/publish`, {
    method: "POST",
  });

  const finalArticle = await jsonReq(`${BASE}/articles/${articleId}`);
  console.log(`✅ Published: ${finalArticle.url_public_html}`);

  const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
  status.figshare = {
    published_at: new Date().toISOString(),
    article_id: articleId,
    doi: finalArticle.doi,
    url: finalArticle.url_public_html,
  };
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");
  console.log(`Updated ${path.relative(ROOT, STATUS_PATH)}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
