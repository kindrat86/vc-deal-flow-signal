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

// Activation funnel guard (2026-08-19). The free product is delivered as soon
// as verification succeeds. Keep that promise visible and keep the anonymous
// landing events joined to the email-keyed Resend events.
const activationChecks = [
  ['index.html', [
    'in your inbox the moment you confirm',
    'posthog.identify(email)',
    "sessionStorage.setItem('gdf_email', email)",
  ]],
  ['subscribe-thanks.html', [
    "o='init capture identify register",
    'posthog.identify(e)',
    "posthog.capture('subscribe_thanks_viewed')",
  ]],
  ['confirmed.html', [
    'The five names are already there.',
    'Check spam or promotions',
    "u.searchParams.delete('email')",
    'history.replaceState',
    'posthog.identify(identEmail)',
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

const steps = [
  ['node', '../distribution/scripts/verify-research-claim.mjs'],
  ['node', 'scripts/verify-vercel-config.mjs'],
  ['node', 'scripts/verify-momentum-widget.mjs'],
  ['node', 'scripts/verify-jsonld.mjs', '.'],
  ['node', 'scripts/verify-word-floor.mjs'],
  ['node', 'scripts/verify-direct-answers.mjs'],
  ['node', 'scripts/verify-no-dashes.mjs'],
  ['node', 'scripts/verify-css-preloads.mjs'],
  ['node', 'scripts/verify-channel-attribution.mjs'],
  ['node', 'scripts/verify-pricing-offers.mjs'],
  ['node', 'scripts/verify-author-identity.mjs'],
  ['node', 'scripts/verify-crawl-proxy.mjs'],
  ['node', 'scripts/verify-claims.mjs'],
  ['node', 'scripts/verify-social-card.mjs'],
];

for (const args of steps) {
  const r = spawnSync(args[0], args.slice(1), { cwd: landingRoot, stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`[verify-all] FAILED at: ${args.join(' ')} (exit ${r.status})`);
    process.exit(r.status ?? 1);
  }
}
console.log('[verify-all] all checks passed (activation guard + 11 scripts)');

// IndexNow ping: non-fatal. It is a crawl hint, not a correctness gate, and a
// failed/skipped submission must never block an otherwise-good deploy. The
// script itself always exits 0; the ignored status is belt-and-suspenders.
const ping = spawnSync('node', ['scripts/indexnow-ping.mjs'], { cwd: landingRoot, stdio: 'inherit' });
if (ping.status !== 0) {
  console.warn(`[verify-all] indexnow-ping exited ${ping.status} (non-fatal, continuing)`);
}
