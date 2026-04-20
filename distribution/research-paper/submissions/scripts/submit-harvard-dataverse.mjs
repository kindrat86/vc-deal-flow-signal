#!/usr/bin/env node
/**
 * submit-harvard-dataverse.mjs — upload the dataset to Harvard Dataverse.
 *
 * Uses the Dataverse Native API:
 *   https://guides.dataverse.org/en/latest/api/native-api.html
 *
 * Requires env vars:
 *   HARVARD_DATAVERSE_TOKEN  — API token from dataverse.harvard.edu profile
 *   HARVARD_DATAVERSE_ALIAS  — dataverse alias to upload into
 *                              (defaults to `vc-deal-flow-signal`)
 *
 * Two-phase flow:
 *   1) POST /api/dataverses/{alias}/datasets  — create dataset with JSON metadata
 *   2) For each file: POST /api/datasets/:persistentId/add  — upload file
 *   3) POST /api/datasets/:persistentId/actions/:publish — publish v1.0 (major)
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

const token = process.env.HARVARD_DATAVERSE_TOKEN;
const alias = process.env.HARVARD_DATAVERSE_ALIAS ?? "vc-deal-flow-signal";

if (!token) {
  console.error(
    "ERROR: HARVARD_DATAVERSE_TOKEN not set. Generate at https://dataverse.harvard.edu → Profile → API Token."
  );
  process.exit(2);
}

const BASE = "https://dataverse.harvard.edu/api";
const hdrs = { "X-Dataverse-key": token };

const metadata = {
  datasetVersion: {
    metadataBlocks: {
      citation: {
        fields: [
          {
            value:
              "Startup GitHub Engineering Velocity Panel — companion dataset to SSRN paper 6606558",
            typeClass: "primitive",
            multiple: false,
            typeName: "title",
          },
          {
            value: [
              {
                authorName: {
                  value: "The Data Nerd",
                  typeClass: "primitive",
                  multiple: false,
                  typeName: "authorName",
                },
                authorAffiliation: {
                  value: "VC Deal Flow Signal (independent)",
                  typeClass: "primitive",
                  multiple: false,
                  typeName: "authorAffiliation",
                },
              },
            ],
            typeClass: "compound",
            multiple: true,
            typeName: "author",
          },
          {
            value: [
              {
                datasetContactEmail: {
                  value: "signal@gitdealflow.com",
                  typeClass: "primitive",
                  multiple: false,
                  typeName: "datasetContactEmail",
                },
                datasetContactName: {
                  value: "The Data Nerd",
                  typeClass: "primitive",
                  multiple: false,
                  typeName: "datasetContactName",
                },
              },
            ],
            typeClass: "compound",
            multiple: true,
            typeName: "datasetContact",
          },
          {
            value: [
              {
                dsDescriptionValue: {
                  value:
                    "Longitudinal panel of GitHub engineering-velocity signals for 55 venture-backed startups across 20 sectors, Q2 2025–Q2 2026 (219 startup-period observations). Mirror of the primary Zenodo deposit at https://doi.org/10.5281/zenodo.19650920. Paper: https://ssrn.com/abstract=6606558. License: CC BY 4.0.",
                  typeClass: "primitive",
                  multiple: false,
                  typeName: "dsDescriptionValue",
                },
              },
            ],
            typeClass: "compound",
            multiple: true,
            typeName: "dsDescription",
          },
          {
            value: ["Business and Management", "Computer and Information Science", "Social Sciences"],
            typeClass: "controlledVocabulary",
            multiple: true,
            typeName: "subject",
          },
          {
            value: [
              "venture capital",
              "alternative data",
              "GitHub",
              "open source",
              "engineering velocity",
              "startup analytics",
              "panel data",
            ].map((v) => ({
              keywordValue: {
                value: v,
                typeClass: "primitive",
                multiple: false,
                typeName: "keywordValue",
              },
            })),
            typeClass: "compound",
            multiple: true,
            typeName: "keyword",
          },
          {
            value: "English",
            typeClass: "controlledVocabulary",
            multiple: false,
            typeName: "language",
          },
        ],
        displayName: "Citation Metadata",
      },
    },
  },
};

async function main() {
  // Phase 1 — create dataset
  console.log(`Creating dataset in dataverse "${alias}"...`);
  const createRes = await fetch(`${BASE}/dataverses/${alias}/datasets`, {
    method: "POST",
    headers: { ...hdrs, "Content-Type": "application/json" },
    body: JSON.stringify(metadata),
  });
  if (!createRes.ok) {
    console.error(
      `Dataset create failed: ${createRes.status} ${await createRes.text()}`
    );
    process.exit(3);
  }
  const created = await createRes.json();
  const pid = created.data?.persistentId ?? created.data?.pid;
  console.log(`Dataset persistent ID: ${pid}`);

  // Phase 2 — upload files
  const FILES = [
    "distribution/dataset/startup_signals.csv",
    "distribution/dataset/sector_aggregates.csv",
    "distribution/dataset/signal_type_timeseries.csv",
    "distribution/dataset/datapackage.json",
    "distribution/dataset/README.md",
    "distribution/dataset/LICENSE",
    "distribution/dataset/CITATION.cff",
  ];

  for (const rel of FILES) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      console.warn(`[skip] ${rel} not found on disk`);
      continue;
    }
    const form = new FormData();
    const blob = new Blob([fs.readFileSync(abs)]);
    form.append("file", blob, path.basename(abs));
    const up = await fetch(
      `${BASE}/datasets/:persistentId/add?persistentId=${pid}`,
      { method: "POST", headers: hdrs, body: form }
    );
    if (up.ok) console.log(`  ✅ ${rel}`);
    else console.warn(`  ⚠️ ${rel}: ${up.status} ${await up.text()}`);
  }

  // Phase 3 — publish v1.0
  console.log("Publishing v1.0...");
  const pub = await fetch(
    `${BASE}/datasets/:persistentId/actions/:publish?persistentId=${pid}&type=major`,
    { method: "POST", headers: hdrs }
  );
  if (!pub.ok) {
    console.error(`Publish failed: ${pub.status} ${await pub.text()}`);
    process.exit(4);
  }
  const published = await pub.json();
  const doi = `doi:${pid.replace("doi:", "")}`;
  const url = `https://dataverse.harvard.edu/dataset.xhtml?persistentId=${pid}`;
  console.log(`✅ Published: ${url}`);

  const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
  status.harvard_dataverse = {
    published_at: new Date().toISOString(),
    doi,
    url,
  };
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");
  console.log(`Updated ${path.relative(ROOT, STATUS_PATH)}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
