#!/usr/bin/env node
/**
 * submit-orcid.mjs — add the SSRN paper + Zenodo dataset as works to
 * an ORCID profile via the Member API.
 *
 * The ORCID Public API is read-only; writes require the Member API
 * (institutional) OR a 3-legged OAuth flow with the `/activities/update`
 * scope on the public API. The simpler path for independent researchers
 * is the Public API with a user-scoped access token.
 *
 * Requires env vars:
 *   ORCID_ID            — 0000-0000-0000-0000
 *   ORCID_ACCESS_TOKEN  — 3-legged token with scope
 *                          `/activities/update /read-limited`
 *
 * See https://info.orcid.org/documentation/api-tutorials/api-tutorial-read-and-update-orcid-records/
 * for obtaining the token via https://orcid.org/oauth/authorize.
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

const orcidId = process.env.ORCID_ID;
const token = process.env.ORCID_ACCESS_TOKEN;

if (!orcidId || !token) {
  console.error(
    "ERROR: ORCID_ID and ORCID_ACCESS_TOKEN must both be set.\n" +
      "Obtain a 3-legged token via: https://orcid.org/oauth/authorize?client_id=<id>&response_type=code&scope=/activities/update /read-limited&redirect_uri=<uri>"
  );
  process.exit(2);
}

const BASE = `https://api.orcid.org/v3.0/${orcidId}`;
const hdrs = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/vnd.orcid+json",
  Accept: "application/vnd.orcid+json",
};

const works = [
  {
    title: {
      title: {
        value:
          "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations",
      },
    },
    type: "WORKING_PAPER",
    "publication-date": { year: { value: "2026" }, month: { value: "04" } },
    url: { value: "https://ssrn.com/abstract=6606558" },
    "external-ids": {
      "external-id": [
        {
          "external-id-type": "uri",
          "external-id-value": "https://ssrn.com/abstract=6606558",
          "external-id-relationship": "SELF",
        },
      ],
    },
    "short-description":
      "Longitudinal panel of GitHub engineering-velocity signals for 55 venture-backed startups across 20 sectors (Q2 2025–Q2 2026, 219 observations).",
  },
  {
    title: {
      title: {
        value:
          "VC Deal Flow Signal — Startup Engineering Acceleration Panel",
      },
    },
    type: "DATA_SET",
    "publication-date": { year: { value: "2026" }, month: { value: "04" } },
    url: { value: "https://zenodo.org/records/19650920" },
    "external-ids": {
      "external-id": [
        {
          "external-id-type": "doi",
          "external-id-value": "10.5281/zenodo.19650920",
          "external-id-relationship": "SELF",
        },
      ],
    },
    "short-description":
      "219 observations across 55 startups, 5 quarters, 20 sectors. Licensed CC BY 4.0.",
  },
];

async function addWork(work) {
  const res = await fetch(`${BASE}/work`, {
    method: "POST",
    headers: hdrs,
    body: JSON.stringify(work),
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${await res.text()}`);
  }
  const location = res.headers.get("location");
  return location;
}

async function main() {
  console.log(`Adding ${works.length} works to ORCID iD ${orcidId}...`);
  const added = [];
  for (const work of works) {
    try {
      const location = await addWork(work);
      console.log(`  ✅ ${work.title.title.value.slice(0, 60)}... → ${location}`);
      added.push({
        title: work.title.title.value,
        location,
      });
    } catch (err) {
      console.error(`  ❌ ${err.message}`);
    }
  }

  const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
  status.orcid = {
    updated_at: new Date().toISOString(),
    orcid_id: orcidId,
    works_added: added,
    public_url: `https://orcid.org/${orcidId}`,
  };
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");
  console.log(`Updated ${path.relative(ROOT, STATUS_PATH)}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
