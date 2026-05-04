#!/usr/bin/env node
/**
 * submit-osf.mjs — submit paper to OSF Preprints / SocArXiv.
 *
 * OSF has a REST API (https://api.osf.io/v2/). Unfortunately OSF's
 * preprint-submission API requires first uploading the paper file to
 * a pre-existing OSF Node, then referencing that file in the preprint
 * record. The flow is well-documented at
 * https://developer.osf.io/.
 *
 * This script uses the API (preferred over Steel.dev) but requires:
 *   OSF_PAT        — Personal Access Token (osf.io/settings/tokens)
 *                    with scope `osf.full_write`
 *   OSF_USER_ID    — the 5-char user GUID (visible in profile URL)
 *   (optional) OSF_PREPRINT_SERVER — `socarxiv` (default) or other provider GUID
 *
 * See `02-osf-socarxiv.md` for the narrative walkthrough.
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
const PAPER_PATH = path.join(
  ROOT,
  "distribution",
  "research-paper",
  "paper.pdf"
);
const ABSTRACT_PATH = path.join(
  ROOT,
  "distribution",
  "research-paper",
  "abstract.txt"
);

const PAT = process.env.OSF_PAT;
const userId = process.env.OSF_USER_ID;
const provider = process.env.OSF_PREPRINT_SERVER ?? "socarxiv";

if (!PAT || !userId) {
  console.error(
    "ERROR: OSF_PAT and OSF_USER_ID must both be set.\n" +
      "Create a Personal Access Token at https://osf.io/settings/tokens (scope: osf.full_write)."
  );
  process.exit(2);
}

const BASE = "https://api.osf.io/v2";
const hdrs = {
  Authorization: `Bearer ${PAT}`,
  "Content-Type": "application/vnd.api+json",
};

async function api(method, p, body) {
  const res = await fetch(`${BASE}${p}`, {
    method,
    headers: hdrs,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`${method} ${p} → ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  // 1. Create a Node (container for files).
  console.log("Creating OSF Node (project container)...");
  const node = await api("POST", "/nodes/", {
    data: {
      type: "nodes",
      attributes: {
        title:
          "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups — preprint",
        category: "data",
        description: fs.readFileSync(ABSTRACT_PATH, "utf-8").slice(0, 400),
        public: true,
      },
    },
  });
  const nodeId = node.data.id;
  console.log(`Node created: https://osf.io/${nodeId}/`);

  // 2. Upload paper.pdf to the Node's osfstorage.
  console.log("Uploading paper.pdf...");
  const pdfBytes = fs.readFileSync(PAPER_PATH);
  const uploadRes = await fetch(
    `${BASE.replace("/v2", "/v1")}/wb/files/osfstorage/${nodeId}/?name=paper.pdf&kind=file`,
    {
      method: "PUT",
      headers: {
        Authorization: hdrs.Authorization,
        "Content-Type": "application/octet-stream",
      },
      body: pdfBytes,
    }
  );
  if (!uploadRes.ok) {
    throw new Error(`file upload → ${uploadRes.status} ${await uploadRes.text()}`);
  }
  const fileMeta = await uploadRes.json();
  const primaryFileId = fileMeta.data.id.split("/").pop();
  console.log(`File uploaded: ${primaryFileId}`);

  // 3. Create the preprint record linked to the Node + file.
  console.log(`Creating preprint on provider "${provider}"...`);
  const preprint = await api("POST", `/providers/preprints/${provider}/preprints/`, {
    data: {
      type: "preprints",
      attributes: {
        title:
          "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations",
        abstract: fs.readFileSync(ABSTRACT_PATH, "utf-8"),
        tags: [
          "venture capital",
          "alternative data",
          "github",
          "open source",
          "engineering velocity",
          "startup analytics",
          "panel data",
        ],
        date_published: "2026-04-20",
        original_publication_date: "2026-04-20",
        doi: "10.5281/zenodo.19650920",
      },
      relationships: {
        node: { data: { type: "nodes", id: nodeId } },
        primary_file: {
          data: { type: "primary_files", id: primaryFileId },
        },
        provider: { data: { type: "preprint_providers", id: provider } },
      },
    },
  });
  const preprintId = preprint.data.id;
  const preprintUrl = `https://osf.io/preprints/${provider}/${preprintId}`;
  console.log(`✅ Preprint: ${preprintUrl}`);

  const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
  status.osf_socarxiv = {
    submitted_at: new Date().toISOString(),
    provider,
    preprint_id: preprintId,
    url: preprintUrl,
    node_url: `https://osf.io/${nodeId}/`,
  };
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");
  console.log(`Updated ${path.relative(ROOT, STATUS_PATH)}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
