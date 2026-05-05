#!/usr/bin/env node
/**
 * submit-researchgate.mjs — Steel.dev-backed submission to ResearchGate.
 *
 * ResearchGate has NO public write API. This script drives a cloud
 * Chrome session via Steel.dev + Playwright.
 *
 * Bootstrap:
 *   1) Create a ResearchGate account (`signal@gitdealflow.com`, pick
 *      "Independent researcher" when prompted).
 *   2) Start a Steel session and log in manually:
 *        node tools/steel/session.mjs --url=https://www.researchgate.net/login
 *      Note the session ID printed in the Live Browser View console.
 *   3) Run this script with that session ID:
 *        node submit-researchgate.mjs --session=<STEEL_SESSION_ID>
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
const PAPER_PATH = path.join(
  ROOT,
  "distribution",
  "research-paper",
  "paper.pdf"
);

// Load tools/.env for STEEL_API_KEY.
const envPath = path.join(ROOT, "tools", ".env");
try {
  const envFile = fs.readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (k && !process.env[k]) process.env[k] = v;
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
      const [k, ...rest] = a.slice(2).split("=");
      return [k, rest.length ? rest.join("=") : true];
    })
);

if (!args.session) {
  console.error(
    "Usage: node submit-researchgate.mjs --session=<STEEL_SESSION_ID>"
  );
  process.exit(2);
}

const steel = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });
const session = await steel.sessions.retrieve(args.session);
console.log(`Using Steel session ${session.id}`);

const browser = await chromium.connectOverCDP(session.wsUrl);
const context = browser.contexts()[0];
const page = context.pages()[0] ?? (await context.newPage());

try {
  console.log("Navigating to ResearchGate add-publication flow...");
  await page.goto("https://www.researchgate.net/add-publication", {
    waitUntil: "networkidle",
  });

  // Pick "Preprint / Working paper"
  await page.getByText("Preprint").first().click();

  // Fill title
  await page.fill(
    'input[aria-label*="Title"]',
    "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations"
  );

  // Upload PDF via the hidden <input type="file">
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(PAPER_PATH);

  // Publication date
  await page.fill('input[aria-label*="Month"]', "April");
  await page.fill('input[aria-label*="Year"]', "2026");

  // Preprint server
  await page.fill('input[aria-label*="Preprint server"]', "SSRN");

  // Abstract
  const abstractText = fs.readFileSync(
    path.join(ROOT, "distribution", "research-paper", "abstract.txt"),
    "utf-8"
  );
  await page.fill('textarea[aria-label*="Abstract"]', abstractText);

  // Research interests / tags
  for (const tag of [
    "Venture Capital",
    "Alternative Data",
    "Panel Data",
    "Open Source Software",
    "Startup Finance",
  ]) {
    await page.fill('input[aria-label*="research interest"]', tag);
    await page.keyboard.press("Enter");
  }

  // Submit
  await page.getByRole("button", { name: /publish|add|upload/i }).click();

  // Wait for publication page redirect
  await page.waitForURL(/researchgate\.net\/publication\/\d+/, {
    timeout: 60_000,
  });
  const rgUrl = page.url();
  console.log(`✅ Published: ${rgUrl}`);

  const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
  status.researchgate = {
    submitted_at: new Date().toISOString(),
    url: rgUrl,
  };
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");
  console.log(`Updated ${path.relative(ROOT, STATUS_PATH)}.`);
} catch (err) {
  console.error("submission failed:", err);
  console.error("Inspect the Live Browser View at the Steel session URL.");
  process.exit(1);
} finally {
  await browser.close();
}
