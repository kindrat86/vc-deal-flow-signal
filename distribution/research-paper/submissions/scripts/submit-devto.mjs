#!/usr/bin/env node
/**
 * submit-devto.mjs — publish the SSRN paper announcement article on dev.to.
 *
 * Reads the article body from
 *   distribution/research-paper/submissions/12-devto-article.md
 * and POSTs it to https://dev.to/api/articles with canonical_url set to
 * https://ssrn.com/abstract=6606558.
 *
 * Requires env var: DEV_TO_API_KEY
 *   (dev.to → Settings → Extensions → DEV Community API Keys)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const BODY_PATH = path.join(
  ROOT,
  "distribution",
  "research-paper",
  "submissions",
  "12-devto-article.md"
);
const STATUS_PATH = path.join(
  ROOT,
  "distribution",
  "research-paper",
  "amplification-status.json"
);

const API_URL = "https://dev.to/api/articles";
const apiKey = process.env.DEV_TO_API_KEY;

if (!apiKey) {
  console.error(
    "ERROR: DEV_TO_API_KEY not set. Get one at dev.to → Settings → Extensions → DEV Community API Keys."
  );
  process.exit(2);
}

// Extract the Markdown body between the ```markdown fence in the draft file.
const source = fs.readFileSync(BODY_PATH, "utf-8");
const match = source.match(/```markdown\n([\s\S]*?)\n```/);
if (!match) {
  console.error("Could not find a ```markdown body fence in the draft.");
  process.exit(3);
}
const body = match[1].trim();

const payload = {
  article: {
    title:
      "I released a public dataset on startup engineering velocity (219 obs across 55 VC-backed startups)",
    published: true,
    body_markdown: body,
    tags: ["opensource", "datascience", "github", "startup"],
    canonical_url: "https://ssrn.com/abstract=6606558",
    main_image: "https://gitdealflow.com/og-banner.png",
  },
};

const res = await fetch(API_URL, {
  method: "POST",
  headers: {
    "api-key": apiKey,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  console.error(`dev.to POST failed: ${res.status} ${await res.text()}`);
  process.exit(4);
}

const article = await res.json();
console.log(`✅ Published: ${article.url}`);

const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
status.devto_article = {
  published_at: new Date().toISOString(),
  url: article.url,
  id: article.id,
};
fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");
console.log(`Updated ${path.relative(ROOT, STATUS_PATH)}.`);
