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

// ---------------------------------------------------------------------------
// de/es fake-i18n trees must 308 to the English canonical (2026-08-15)
// ---------------------------------------------------------------------------
// The de/ and es/ directories shipped ~414 English-content pages (German
// titles only) under lang="de"/"es" + hreflang, plus thin duplicate-intent
// vs/alternatives slugs. Translation was never completed and is not viable
// without native review, so the whole de/ and es/ trees redirect to English.
// A tree missing these catch-all redirects must not deploy.
const localeCatchAlls = {
  "/de": "/",
  "/es": "/",
  "/de/:path*": "/:path*",
  "/es/:path*": "/:path*",
};
for (const [src, dst] of Object.entries(localeCatchAlls)) {
  const r = (parsed.redirects || []).find((x) => x.source === src);
  if (!r || r.destination !== dst || r.permanent !== true) {
    fail(
      `fake-i18n locale "${src}" no longer 308-redirects to "${dst}": the de/es -> English consolidation redirect is missing from vercel.json redirects[].`,
    );
  }
}

// ---------------------------------------------------------------------------
// /api/badge must rewrite to signals, not 404 (2026-08-16)
// ---------------------------------------------------------------------------
// The /stats hub's 20 stat cards embed gitdealflow.com/api/badge/stats-m<N>.svg.
// The landing is static with no API routes; without this rewrite every one of
// those badge requests 404s (broken image + layout shift on a buyer-intent
// page). A tree missing the rewrite must not deploy.
const badgeRewrite = (parsed.rewrites || []).find(
  (r) => r.source === "/api/badge/:path*",
);
if (
  !badgeRewrite ||
  badgeRewrite.destination !== "https://signals.gitdealflow.com/api/badge/:path*"
) {
  fail(
    '/api/badge/stats-m*.svg 404s again: the { "source": "/api/badge/:path*", "destination": "https://signals.gitdealflow.com/api/badge/:path*" } rewrite is missing from vercel.json rewrites[].',
  );
}

// ---------------------------------------------------------------------------
// /best/ duplicate-canonical consolidation (2026-08-16)
// ---------------------------------------------------------------------------
// best/best-crunchbase-alternatives.html and best/best-pitchbook-alternatives.html
// duplicate the alternatives-to/* intent under different URLs. They must
// canonicalize to the /alternatives-to/ counterparts so Google consolidates
// ranking signals instead of splitting them (crunchbase-alternatives was stuck
// at position 76 with the /best/ page self-canonical).
const canonPairs = [
  ["best/best-crunchbase-alternatives.html", "https://gitdealflow.com/alternatives-to/crunchbase-alternatives"],
  ["best/best-pitchbook-alternatives.html", "https://gitdealflow.com/alternatives-to/pitchbook-alternatives"],
];
for (const [file, target] of canonPairs) {
  let html;
  try {
    html = readFileSync(file, "utf8");
  } catch {
    fail(`${file} is missing: the /best/ duplicate page must exist and canonicalize to ${target}.`);
    continue;
  }
  if (!html.includes(`rel="canonical" href="${target}"`)) {
    fail(`${file} no longer canonicalizes to ${target}: duplicate-content cannibalization has returned.`);
  }
}

if (failures.length) {
  console.error(
    `\n❌ verify-vercel-config: ${failures.length} config regression(s) detected:`,
  );
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("✓ verify-vercel-config: vercel.json guards pass");
