#!/usr/bin/env node
/**
 * submit-steel-template.mjs — reusable Steel.dev-backed submitter.
 *
 * Copy this file for each login-walled platform (OSF, ResearchGate,
 * Papers With Code, MPRA, Mendeley Data, Humanities Commons, Academia.edu,
 * Medium, Substack, HackerNoon). Fill in the `actions` block.
 *
 * Usage:
 *   node submit-<platform>.mjs --session=<STEEL_SESSION_ID>
 *
 * Bootstrap a Steel session first with:
 *   node tools/steel/session.mjs --url=https://<platform>/login
 * Log in manually in the Live Browser View, then copy the session ID
 * from the console output.
 */

import Steel from "steel-sdk";
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..", "..");

// Load .env from tools/.env
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

const sessionId = args.session;
if (!sessionId) {
  console.error(
    "Usage: node submit-<platform>.mjs --session=<STEEL_SESSION_ID>"
  );
  console.error(
    "First bootstrap a session: node tools/steel/session.mjs --url=https://<platform>/login"
  );
  process.exit(2);
}

const steel = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });
const session = await steel.sessions.retrieve(sessionId);
console.log(`Using Steel session ${session.id} (CDP: ${session.wsUrl})`);

const browser = await chromium.connectOverCDP(session.wsUrl);
const context = browser.contexts()[0];
const page = context.pages()[0] ?? (await context.newPage());

try {
  // ─── Fill in per-platform actions below ──────────────────────────
  //
  // Example:
  //   await page.goto("https://osf.io/preprints/socarxiv/submit");
  //   await page.fill("input[name=title]", "…");
  //   await page.setInputFiles("input[type=file]", "distribution/research-paper/paper.pdf");
  //   await page.click("button[type=submit]");
  //   await page.waitForURL(/\/preprints\/socarxiv\/[a-z0-9]+$/);
  //   console.log(`Submitted: ${page.url()}`);
  //
  // ──────────────────────────────────────────────────────────────────
  console.log("Fill in the platform-specific actions above.");
} finally {
  await browser.close();
}
