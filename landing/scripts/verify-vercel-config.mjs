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


// ---------------------------------------------------------------------------
// Topical-authority hubs must exist and be wired (2026-08-15)
// ---------------------------------------------------------------------------
// /faq, /for, /integrations had spokes in the sitemap but no hub (404), and
// /learn was a dead end. Any tree missing the hubs or the mesh must not deploy.
import { existsSync, readFileSync as _rf } from "node:fs";
const hubChecks = [
  ["faq/index.html", "https://gitdealflow.com/faq"],
  ["for/index.html", "https://gitdealflow.com/for"],
  ["integrations/index.html", "https://gitdealflow.com/integrations"],
];
for (const [file, url] of hubChecks) {
  if (!existsSync(file)) {
    fail(`${file} missing: the ${url} topical hub 404s again (2026-08-15 hub-and-spoke build).`);
  }
}
const learnIdx = readFileSync("learn/index.html", "utf8");
if (!learnIdx.includes("ItemList")) {
  fail("learn/index.html lost its ItemList guide index (2026-08-15 pillar rebuild).");
}
for (const spoke of ["learn/deal-flow/index.html", "faq/what-is-seed-funding.html", "for/angel-investors/index.html"]) {
  if (existsSync(spoke) && !readFileSync(spoke, "utf8").includes("topical-mesh")) {
    fail(`${spoke} lost its topical-mesh cross-links (2026-08-15).`);
  }
}

// ---------------------------------------------------------------------------
// Grounded precision claims: no invented 82% raise-rate (2026-08-16)
// ---------------------------------------------------------------------------
// cheatsheet.html and perfect-webinar.html (plus the de/es tree copies) claimed
// the three-signal pattern "preceded a raise 82% of the time" in the research
// panel. The SSRN-published finding is a median lead time of 5.4 weeks with
// ~65% top-decile precision; 82% appears nowhere in the methodology. A tree
// that reintroduces the invented number must not deploy.
const claimFiles = [
  "cheatsheet.html",
  "perfect-webinar.html",
  "de/cheatsheet.html",
  "de/perfect-webinar.html",
  "es/cheatsheet.html",
  "es/perfect-webinar.html",
];
for (const f of claimFiles) {
  let html;
  try {
    html = readFileSync(f, "utf8");
  } catch {
    fail(`${f} is missing: the grounded-stats funnel page must exist (2026-08-16).`);
    continue;
  }
  if (html.includes("82%")) {
    fail(`${f} reintroduced the ungrounded 82% raise-rate claim (2026-08-16 grounding: 5.4 weeks median lead, ~65% top-decile precision).`);
  }
  if (!html.includes("top-decile precision of ~65%")) {
    fail(`${f} lost the grounded lead-time wording (median 5.4 weeks, ~65% top-decile precision).`);
  }
}
{
  let txt;
  try {
    txt = readFileSync("llms-full.txt", "utf8");
  } catch {
    fail("llms-full.txt is missing (2026-08-16).");
    txt = "";
  }
  if (txt.includes("82%")) {
    fail("llms-full.txt reintroduced the ungrounded 82% raise-rate claim (2026-08-16).");
  }
}

// ---------------------------------------------------------------------------
// /teardown must redirect to signals, not 404 (2026-08-17)
// ---------------------------------------------------------------------------
// Outreach emails and preflight-health-check.py link gitdealflow.com/teardown,
// but the teardown offer page only exists on signals.gitdealflow.com (Next.js).
// Every human click from those emails (RUM: /teardown?utm_source=outreach,
// 5 clicks/30d) landed on a 404. A tree missing this redirect must not deploy.
const teardownRedirect = (parsed.redirects || []).find(
  (r) => r.source === "/teardown",
);
if (
  !teardownRedirect ||
  teardownRedirect.destination !==
    "https://signals.gitdealflow.com/teardown" ||
  teardownRedirect.permanent !== true
) {
  fail(
    '/teardown 404s again: the { "source": "/teardown", "destination": "https://signals.gitdealflow.com/teardown", "permanent": true } redirect is missing from vercel.json redirects[] (outreach emails link this URL; 2026-08-17 fix).',
  );
}

// ---------------------------------------------------------------------------
// Mobile tap-target floor in ux.css (2026-08-17)
// ---------------------------------------------------------------------------
// The 375px/360px rendered audit found structural anchors (breadcrumbs, footer
// rows, related-lists, network tiles) at 15-18px tall on this static site,
// under the WCAG 2.5.8 / Google 24px minimum. The fix lives in ux.css (the
// only stylesheet every page family loads). A tree that drops the block
// re-ships undersized tap targets on ~360 pages.
{
  const css = (() => {
    try {
      return readFileSync("ux.css", "utf8");
    } catch {
      return "";
    }
  })();
  if (!css.includes("@media (max-width: 767px)") ||
      !css.includes("min-height: 24px") ||
      !css.includes(":where(footer a") ||
      !css.includes("body > ul a,") ||
      !css.includes(".network-grid a)")) {
    fail("ux.css lost the mobile tap-target floor block (:where(footer a, header nav a, ... .network-grid a) min-height 24px, 2026-08-17); footer/breadcrumb/related anchors drop back to 15-18px on phones.");
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
