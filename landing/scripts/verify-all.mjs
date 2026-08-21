#!/usr/bin/env node

// Single entry point for all landing prebuild verify checks.
// Keeps vercel.json buildCommand under Vercel's 256-char limit.
// Runs each check in order; fails the build (non-zero) on the first failure.
import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const landingRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

// Static Vercel deploy inputs that used to exist only in the dirty primary
// checkout. Without them a clean commit deploy either fails the function glob
// or drops the AI discovery and markdown routes.
for (const rel of ['api/crawl-proxy.js', 'api/markdown.js', 'ai.src.txt', 'agents.src.txt']) {
  try {
    readFileSync(join(landingRoot, rel), 'utf8');
  } catch {
    console.error(`[verify-all] required deploy input is missing: ${rel}`);
    process.exit(1);
  }
}

// Activation funnel guard (2026-08-21). The confirmation page gives a verified
// subscriber immediate sample value and keeps raw email out of browser analytics.
const activationChecks = [
  ['index.html', [
    'in your inbox the moment you confirm',
    'posthog.identify(email)',
    "sessionStorage.setItem('gdf_email', email)",
    'https://discord.gg/Fdd9mH3M6q?utm_source=gitdealflow.com&utm_medium=owned&utm_campaign=scout_network_launch&utm_content=hero',
    "posthog.capture('discord_scout_network_cta_clicked',{placement:'hero',destination:'wins-and-finds'})",
  ]],
  ['subscribe-thanks.html', [
    "o='init capture identify register",
    'posthog.identify(e)',
    "posthog.capture('subscribe_thanks_viewed')",
  ]],
  ['confirmed.html', [
    'id="sample-issue-link" href="/report"',
    "posthog.capture('sample_issue_opened'",
    "u.searchParams.delete('email')",
    'history.replaceState',
    "posthog.capture('signup_confirmed_viewed'",
  ]],
];
for (const [rel, needles] of activationChecks) {
  const src = readFileSync(join(landingRoot, rel), 'utf8');
  const missing = needles.filter((needle) => !src.includes(needle));
  if (missing.length) {
    console.error(`[verify-all] activation regression in ${rel}: missing ${missing.join(', ')}`);
    process.exit(1);
  }
}
const confirmedPage = readFileSync(join(landingRoot, 'confirmed.html'), 'utf8');
if (confirmedPage.includes('posthog.identify(identEmail)')) {
  console.error('[verify-all] confirmation analytics must not identify visitors from a URL email parameter');
  process.exit(1);
}

// Velocity Verdict lead-magnet guard (2026-08-20). The static apex owns the
// capture form, the honest research wording, the post-confirmation download,
// and the PDF. A stale static deploy must not silently drop any of them.
const leadMagnetChecks = [
  ['index.html', [
    'id="velocity-verdict"',
    'data-source="velocity-verdict" data-cohort="lead-magnet"',
    "posthog.capture(isLeadMagnet ? 'lead_magnet_verify_sent'",
    "window.location.href = isLeadMagnet ? '/lead-magnet-thanks'",
  ]],
  ['cheatsheet.html', [
    "cohort: 'lead-magnet'",
    "posthog.capture('lead_magnet_verify_sent'",
    "window.location.href = '/lead-magnet-thanks'",
    '219 startup-period observations across 55 startups',
  ]],
  ['lead-magnet-thanks.html', [
    '/downloads/velocity-verdict-cheat-sheet.pdf',
    'posthog.init(',
    "'lead_magnet_confirmed'",
    "'lead_magnet_downloaded'",
  ]],
];
for (const [rel, needles] of leadMagnetChecks) {
  const src = readFileSync(join(landingRoot, rel), 'utf8');
  const missing = needles.filter((needle) => !src.includes(needle));
  if (missing.length) {
    console.error(`[verify-all] lead-magnet regression in ${rel}: missing ${missing.join(', ')}`);
    process.exit(1);
  }
}
const cheatSheet = readFileSync(join(landingRoot, 'cheatsheet.html'), 'utf8');
if (/219(?: documented)?(?: startup)? fundraises/i.test(cheatSheet)) {
  console.error('[verify-all] lead-magnet claim regression: 219 is observations, not fundraises');
  process.exit(1);
}
const homepage = readFileSync(join(landingRoot, 'index.html'), 'utf8');
const exitPopup = homepage.slice(homepage.indexOf('id="exit-popup"'));
if (/preceded 219 fundraises/i.test(exitPopup)) {
  console.error('[verify-all] exit-popup claim regression: 219 is observations, not fundraises');
  process.exit(1);
}
const leadMagnetPdf = readFileSync(
  join(landingRoot, 'downloads/velocity-verdict-cheat-sheet.pdf'),
);
if (leadMagnetPdf.length < 100_000 || leadMagnetPdf.subarray(0, 4).toString() !== '%PDF') {
  console.error('[verify-all] lead-magnet PDF is missing or invalid');
  process.exit(1);
}

const steps = [
  ['node', 'scripts/verify-vercel-config.mjs'],
  ['node', 'scripts/verify-jsonld.mjs', '.'],
  ['node', 'scripts/verify-word-floor.mjs'],
  ['node', 'scripts/verify-direct-answers.mjs'],
  ['node', 'scripts/verify-no-dashes.mjs'],
  ['node', 'scripts/verify-css-preloads.mjs'],
  ['node', 'scripts/verify-pricing-offers.mjs'],
  ['node', 'scripts/verify-author-identity.mjs'],
  ['node', 'scripts/verify-social-card.mjs'],
  ['node', 'scripts/verify-crawl-proxy.mjs'],
  ['node', 'scripts/verify-persona-routes.mjs'],
];

for (const args of steps) {
  const r = spawnSync(args[0], args.slice(1), { cwd: landingRoot, stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`[verify-all] FAILED at: ${args.join(' ')} (exit ${r.status})`);
    process.exit(r.status ?? 1);
  }
}
console.log('[verify-all] all checks passed (activation guard + 10 scripts)');

// IndexNow ping: non-fatal. It is a crawl hint, not a correctness gate, and a
// failed/skipped submission must never block an otherwise-good deploy. The
// script itself always exits 0; the ignored status is belt-and-suspenders.
const ping = spawnSync('node', ['scripts/indexnow-ping.mjs'], { cwd: landingRoot, stdio: 'inherit' });
if (ping.status !== 0) {
  console.warn(`[verify-all] indexnow-ping exited ${ping.status} (non-fatal, continuing)`);
}
