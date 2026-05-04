#!/usr/bin/env node
/**
 * submit-mpra.mjs — Steel.dev-backed submission to MPRA
 * (Munich Personal RePEc Archive).
 *
 * MPRA is an EPrints-based archive with no public write API; the
 * submission form is at https://mpra.ub.uni-muenchen.de/cgi/users/home.
 *
 * Bootstrap:
 *   1) Register at https://mpra.ub.uni-muenchen.de/cgi/users/register.
 *   2) Start a Steel session + log in once:
 *        node tools/steel/session.mjs --url=https://mpra.ub.uni-muenchen.de/cgi/users/home
 *   3) Run:
 *        node submit-mpra.mjs --session=<STEEL_SESSION_ID>
 *
 * Review typically takes 3-5 business days.
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
const ABSTRACT_PATH = path.join(
  ROOT,
  "distribution",
  "research-paper",
  "abstract.txt"
);

const envPath = path.join(ROOT, "tools", ".env");
try {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || t.indexOf("=") === -1) continue;
    const [k, ...v] = t.split("=");
    if (!process.env[k.trim()]) process.env[k.trim()] = v.join("=").trim().replace(/^["']|["']$/g, "");
  }
} catch {
  console.error(`Cannot read ${envPath}`);
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith("--")).map((a) => {
    const [k, ...r] = a.slice(2).split("=");
    return [k, r.length ? r.join("=") : true];
  })
);
if (!args.session) {
  console.error("Usage: node submit-mpra.mjs --session=<STEEL_SESSION_ID>");
  process.exit(2);
}

const steel = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });
const session = await steel.sessions.retrieve(args.session);
const browser = await chromium.connectOverCDP(session.wsUrl);
const page = browser.contexts()[0].pages()[0] ?? (await browser.contexts()[0].newPage());

try {
  // Open the "Manage deposits" page, create new eprint.
  await page.goto(
    "https://mpra.ub.uni-muenchen.de/cgi/users/home?screen=EPrint%3A%3AEdit"
  );

  // Type = Working Paper
  await page.getByLabel("Working Paper").check();
  await page.getByRole("button", { name: /next/i }).click();

  // File upload
  await page.locator('input[type="file"]').setInputFiles(PAPER_PATH);
  await page.getByRole("button", { name: /next/i }).click();

  // Details
  await page.fill(
    'input[name="eprint_title"]',
    "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations"
  );
  const abstractText = fs.readFileSync(ABSTRACT_PATH, "utf-8");
  await page.fill('textarea[name="eprint_abstract"]', abstractText);
  await page.fill(
    'input[name*="creators_family_0"]',
    "Nerd"
  );
  await page.fill(
    'input[name*="creators_given_0"]',
    "The Data"
  );

  // Keywords
  await page.fill(
    'input[name="eprint_keywords"]',
    "venture capital; alternative data; GitHub; open source; engineering velocity; startup analytics; panel data"
  );

  // JEL codes
  for (const code of ["G24", "L26", "O32", "C81"]) {
    await page.getByRole("checkbox", { name: new RegExp(`^${code}`, "i") }).check();
  }

  // Original URL
  await page.fill('input[name="eprint_official_url"]', "https://ssrn.com/abstract=6606558");

  // Next → deposit
  await page.getByRole("button", { name: /deposit/i }).click();
  await page.getByRole("button", { name: /yes/i }).click();

  await page.waitForURL(/mpra\.ub\.uni-muenchen\.de\/\d+\//, { timeout: 60_000 });
  const mpraUrl = page.url();
  console.log(`✅ Deposited: ${mpraUrl}`);

  const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
  status.mpra = { submitted_at: new Date().toISOString(), url: mpraUrl };
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");
} catch (err) {
  console.error("MPRA submission failed:", err);
  process.exit(1);
} finally {
  await browser.close();
}
