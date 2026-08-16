#!/usr/bin/env node
// Single entry point for all landing prebuild verify checks.
// Keeps vercel.json buildCommand under Vercel's 256-char limit.
// Runs each check in order; fails the build (non-zero) on the first failure.
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const landingRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const steps = [
  ['node', 'scripts/verify-vercel-config.mjs'],
  ['node', 'scripts/verify-jsonld.mjs', '.'],
  ['node', 'scripts/verify-word-floor.mjs'],
  ['node', 'scripts/verify-direct-answers.mjs'],
  ['node', 'scripts/verify-no-dashes.mjs'],
  ['node', 'scripts/verify-css-preloads.mjs'],
  ['node', 'scripts/verify-pricing-offers.mjs'],
  ['node', 'scripts/verify-author-identity.mjs'],
];

for (const args of steps) {
  const r = spawnSync(args[0], args.slice(1), { cwd: landingRoot, stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`[verify-all] FAILED at: ${args.join(' ')} (exit ${r.status})`);
    process.exit(r.status ?? 1);
  }
}
console.log('[verify-all] all 8 checks passed');
