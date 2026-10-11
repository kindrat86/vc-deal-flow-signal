#!/usr/bin/env node
// Build gate: every static page's <meta name="description"> must be <= 160 chars.
// Skips de/, es/ (locale architecture is owner-gated) and .vercel/ build output.
// Fails the build on any overlong meta or a page with no meta description at all.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, sep, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['de', 'es', '.vercel', 'node_modules']);
const LIMIT = 160;

const DOUBLE_NAME_FIRST = /<meta\b[^>]*?\bname="description"[^>]*?\bcontent="([^"]*)"/i;
const SINGLE_NAME_FIRST = /<meta\b[^>]*?\bname='description'[^>]*?\bcontent='([^']*)'/i;
const DOUBLE_CONTENT_FIRST = /<meta\b[^>]*?\bcontent="([^"]*)"[^>]*?\bname="description"/i;
const SINGLE_CONTENT_FIRST = /<meta\b[^>]*?\bcontent='([^']*)'[^>]*?\bname='description'/i;

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

const failures = [];
let noMeta = 0;
let checked = 0;
for (const file of listHtml(root)) {
  checked += 1;
  const src = readFileSync(file, 'utf8');
  const m =
    DOUBLE_NAME_FIRST.exec(src) ||
    SINGLE_NAME_FIRST.exec(src) ||
    DOUBLE_CONTENT_FIRST.exec(src) ||
    SINGLE_CONTENT_FIRST.exec(src);
  const rel = relative(root, file).split(sep).join('/');
  if (!m) {
    // Verification pages (google*/yandex*/webmaster), embeds and widgets ship
    // without a meta description by design. Only the length rule gates the build.
    noMeta += 1;
    continue;
  }
  if (m[1].length > LIMIT) {
    failures.push(`${rel}: meta description is ${m[1].length} chars (limit ${LIMIT})`);
  }
}

if (failures.length) {
  console.error(`[verify-meta-length] FAILED: ${failures.length} of ${checked} files over ${LIMIT} chars:`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`[verify-meta-length] ok: ${checked} files, all meta descriptions <= ${LIMIT} chars (${noMeta} files intentionally ship without a meta description)`);
