#!/usr/bin/env node
/**
 * Landing-side config guards for gitdealflow.com (static, vercel.json-routed).
 *
 * Sibling of pseo-site's scripts/verify-no-regressions.ts, scoped to what this
 * deploy unit controls: vercel.json. The landing site has no build pipeline of
 * its own beyond the vercel.json buildCommand, so a config regression (a
 * dropped redirect, a deleted header block) can only be caught by asserting
 * the config file itself BEFORE `vercel deploy` ships it.
 *
 * Assert the FIXED state, keep the failure message actionable, cite the date.
 * Usage: node scripts/verify-vercel-config.mjs   (exit 1 on any failure)
 */

import { readFileSync } from "node:fs";

const cfg = readFileSync("vercel.json", "utf8");
const parsed = JSON.parse(cfg);
const failures = [];

function fail(msg) {
  failures.push(msg);
}

// ---------------------------------------------------------------------------
// /contact must redirect to /about, not 404 (2026-08-15)
// ---------------------------------------------------------------------------
// The site never had a /contact page; investors and AI crawlers probing the
// conventional contact URL hit a 404 trust leak. Contact happens via
// signals@gitdealflow.com, which /about surfaces. A tree missing this
// redirect must not deploy.
const contactRedirect = (parsed.redirects || []).find(
  (r) => r.source === "/contact",
);
if (!contactRedirect || contactRedirect.destination !== "/about") {
  fail(
    '/contact 404s again: the { "source": "/contact", "destination": "/about", "permanent": true } redirect is missing from vercel.json redirects[].',
  );
}

if (failures.length) {
  console.error(
    `\n❌ verify-vercel-config: ${failures.length} config regression(s) detected:`,
  );
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("✓ verify-vercel-config: vercel.json guards pass");
