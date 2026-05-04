#!/usr/bin/env node
/**
 * submit-papers-with-code.mjs — Steel.dev-backed submission to Papers With Code.
 *
 * PwC has NO public write API. Submission requires GitHub OAuth login, then
 * filling the form at https://paperswithcode.com/submit.
 *
 * IMPORTANT: As of early 2026 the landscape is shifting — part of the PwC
 * dataset index was merged into Hugging Face Papers. Confirm the submission
 * surface still exists at https://paperswithcode.com/submit before running.
 *
 * Bootstrap:
 *   1) Start a Steel session and log in manually via GitHub OAuth:
 *        node tools/steel/session.mjs --url=https://paperswithcode.com/accounts/github/login/
 *   2) After login, note the Steel session ID.
 *   3) Upload paper.pdf to Zenodo as v1.0.2 first (PwC needs an OA PDF URL
 *      and SSRN's PDF is login-walled). See `01-papers-with-code.md`.
 *   4) Run:
 *        node submit-papers-with-code.mjs --session=<STEEL_SESSION_ID>
 */

import Steel from "steel-sdk";
import { chromium } from "playwright-core";
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

// Load .env for STEEL_API_KEY
const envPath = path.join(ROOT, "tools", ".env");
try {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || t.indexOf("=") === -1) continue;
    const [k, ...v] = t.split("=");
    if (!process.env[k.trim()])
      process.env[k.trim()] = v
        .join("=")
        .trim()
        .replace(/^["']|["']$/g, "");
  }
} catch {
  console.error(`Cannot read ${envPath}`);
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, ...r] = a.slice(2).split("=");
      return [k, r.length ? r.join("=") : true];
    })
);
if (!args.session) {
  console.error(
    "Usage: node submit-papers-with-code.mjs --session=<STEEL_SESSION_ID>"
  );
  process.exit(2);
}

const steel = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });
const session = await steel.sessions.retrieve(args.session);
const browser = await chromium.connectOverCDP(session.wsUrl);
const page =
  browser.contexts()[0].pages()[0] ??
  (await browser.contexts()[0].newPage());

try {
  await page.goto("https://paperswithcode.com/submit", {
    waitUntil: "networkidle",
  });

  await page.fill(
    'input[name="url_pdf"]',
    "https://zenodo.org/records/19650920/files/paper.pdf"
  );
  await page.fill(
    'input[name="url_abs"]',
    "https://ssrn.com/abstract=6606558"
  );
  await page.fill(
    'input[name="title"]',
    "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations"
  );
  await page.fill('input[name="authors"]', "The Data Nerd");

  const abstractText = fs.readFileSync(
    path.join(ROOT, "distribution", "research-paper", "abstract.txt"),
    "utf-8"
  );
  await page.fill('textarea[name="abstract"]', abstractText);

  await page.fill(
    'input[name="code_url"]',
    "https://github.com/kindrat86/gitdealflow-signal-classifier"
  );
  await page.fill(
    'input[name="dataset_url"]',
    "https://zenodo.org/records/19650920"
  );

  // Tick Dataset checkbox.
  const ds = page.locator('input[type="checkbox"][name*="dataset"]').first();
  if (await ds.count()) await ds.check();

  // Submit.
  await page.getByRole("button", { name: /submit|save/i }).click();

  // Wait for redirect to the paper page.
  await page.waitForURL(/paperswithcode\.com\/paper\/[\w-]+/, {
    timeout: 60_000,
  });
  const pwcUrl = page.url();
  console.log(`✅ Submitted: ${pwcUrl}`);

  const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
  status.papers_with_code = {
    submitted_at: new Date().toISOString(),
    url: pwcUrl,
  };
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");
} catch (err) {
  console.error("PwC submission failed:", err);
  process.exit(1);
} finally {
  await browser.close();
}
