#!/usr/bin/env node
// Shorten meta descriptions over 160 chars across the static landing surface.
// Regenerated 2026-10-12 after the original 2026-10-02 patch artifacts were lost.
//
// Rules:
// - Skips de/, es/ (locale architecture is owner-gated) and .vercel/ build output.
// - Never touches body copy: operates only inside the matched <meta name="description"
//   content="..."> span (double- and single-quoted, either attribute order).
// - Prefers a sentence boundary inside the first 158 chars; falls back to a hard
//   word-boundary cut at 157 chars + "..." (total <= 160).
// - Idempotent: a second run is a no-op.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, sep, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['de', 'es', '.vercel', 'node_modules']);
const LIMIT = 160;

const DOUBLE_NAME_FIRST = /(<meta\b[^>]*?\bname="description"[^>]*?\bcontent=")([^"]*)(")/i;
const DOUBLE_CONTENT_FIRST = /(<meta\b[^>]*?\bcontent=")([^"]*)("[^>]*?\bname="description")/i;
const SINGLE_NAME_FIRST = /(<meta\b[^>]*?\bname='description'[^>]*?\bcontent=')([^']*)(')/i;
const SINGLE_CONTENT_FIRST = /(<meta\b[^>]*?\bcontent=')([^']*)('[^>]*?\bname='description')/i;

function listHtml(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...listHtml(p));
    else if (entry.endsWith('.html')) out.push(p);
  }
  return out;
}

function shorten(desc) {
  const head = desc.slice(0, LIMIT);
  let cut = -1;
  for (let i = head.length - 1; i >= 80; i -= 1) {
    const ch = head[i];
    if (ch === '.' || ch === '!' || ch === '?') {
      const next = head[i + 1];
      if (next === undefined || next === ' ' || next === '"') { cut = i + 1; break; }
    }
  }
  if (cut >= 40) return head.slice(0, cut).trim();
  let hard = head.slice(0, 157);
  const lastSpace = hard.lastIndexOf(' ');
  if (lastSpace > 60) hard = hard.slice(0, lastSpace);
  return `${hard.trimEnd()}...`;
}

const files = listHtml(root);
let changed = 0;
let checked = 0;
const report = [];
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  checked += 1;
  const m =
    DOUBLE_NAME_FIRST.exec(src) ||
    SINGLE_NAME_FIRST.exec(src) ||
    (DOUBLE_CONTENT_FIRST.test(src) ? DOUBLE_CONTENT_FIRST.exec(src) : null) ||
    (SINGLE_CONTENT_FIRST.test(src) ? SINGLE_CONTENT_FIRST.exec(src) : null);
  if (!m) continue;
  // Match object shape differs between name-first and content-first patterns.
  const prefix = m[1];
  const desc = m[2];
  const suffix = m[3];
  if (prefix === undefined || suffix === undefined || desc === undefined) continue;
  if (desc.length <= LIMIT) continue;
  const next = shorten(desc);
  const updated = src.slice(0, m.index) + prefix + next + suffix + src.slice(m.index + m[0].length);
  writeFileSync(file, updated);
  changed += 1;
  report.push(`${relative(root, file).split(sep).join('/')}: ${desc.length} -> ${next.length}`);
}

console.log(`[shorten-meta] checked ${checked} html files, shortened ${changed}`);
for (const line of report) console.log(`  ${line}`);
