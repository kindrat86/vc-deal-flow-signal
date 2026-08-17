#!/usr/bin/env node
// Guard: every apex data page footer must carry the author identity
// (The Data Nerd -> ORCID 0009-0002-2222-4112 -> SSRN 6606558).
// Fix shipped 2026-08-16 (commit defddbc2), audit item E-E-A-T 72 -> 82.
// Fails the build if any data page loses the anchor (hand-edit OR template regression).
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ORCID = '0009-0002-2222-4112';
const SSRN = '6606558';

const roots = ['data', 'free', 'research', 'stats'];
const singles = ['dataset.html', 'datasets.html', 'report.html'];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = [];
for (const r of roots) {
  const st = statSync(r, { throwIfNoEntry: false });
  if (st && st.isDirectory()) walk(r, files);
}
files.push(...singles.filter((f) => statSync(f, { throwIfNoEntry: false })));

const missing = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  if (!html.includes(ORCID) || !html.includes(SSRN)) missing.push(f);
}

if (missing.length > 0) {
  console.error(`[verify-author-identity] ${missing.length} data page(s) lost the author-identity footer:`);
  for (const m of missing) console.error('  - ' + m);
  console.error('Restore: By The Data Nerd (rel="author") -> ORCID 0009-0002-2222-4112 -> SSRN 6606558 in the footer.');
  process.exit(1);
}
console.log(`[verify-author-identity] OK, ${files.length} data page(s) carry author identity (ORCID + SSRN)`);
