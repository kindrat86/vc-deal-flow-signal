#!/usr/bin/env node
// Copies only the public site into dist/, which is vercel.json's outputDirectory.
//
// Why (2026-10-29, Maryan t364u): this site deploys with `vercel build --prod`
// plus `vercel deploy --prebuilt --prod`. A local `vercel build` does not apply
// .vercelignore, so with outputDirectory "." every repo file was served:
// CLAUDE.md, spec.md, the HERMES/REPORT/OWNER docs, the generators, scripts/,
// tests, package files and __pycache__. Building into dist/ keeps those files in
// the repo and out of every deploy, local or remote.
//
// Rule of thumb: a new public page needs no change here. A new kind of internal
// file (a new extension or folder) should be added to the exclusions below.
import { cpSync, rmSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('..', import.meta.url)));
const OUT = join(ROOT, 'dist');

// Folders that are never public, at any depth.
const NEVER_DIRS = new Set(['.git', '.vercel', '.claude', 'node_modules', '__pycache__', 'dist']);
// Top-level folders that are tooling, not site. api/ is deployed as serverless
// functions from the project root, so its source is not copied as static files.
const TOP_DIRS = new Set(['scripts', 'api', 'tests', 'test']);
// Exact file names that are config or packaging.
const NEVER_FILES = new Set([
  'package.json', 'package-lock.json', 'vercel.json', 'tailwind.config.js',
  'input.css', 'spec.md', 'CLAUDE.md',
]);
const NEVER_EXT = new Set(['.py', '.pyc', '.mjs', '.sh', '.ts', '.log', '.env']);
// Markdown that is public on purpose: the md/ mirrors and the AI discovery file.
const PUBLIC_MD = (rel) => rel.startsWith(`md${sep}`) || rel === 'agents.md';

export function isPublic(rel, isDir) {
  const parts = rel.split(sep);
  const name = basename(rel);
  if (parts.some((p) => NEVER_DIRS.has(p))) return false;
  if (TOP_DIRS.has(parts[0])) return false;
  if (parts.some((p) => p.startsWith('.') && p !== '.well-known')) return false;
  if (isDir) return true;
  if (name.startsWith('_')) return false;
  if (NEVER_FILES.has(name)) return false;
  if (NEVER_EXT.has(extname(name))) return false;
  if (name.includes('.bak')) return false;
  if (extname(name) === '.md' && !PUBLIC_MD(rel)) return false;
  return true;
}

rmSync(OUT, { recursive: true, force: true });
// `--clean` only removes dist/, so the verify-* gates that walk the repo root run
// before dist/ exists and never see a second copy of the site.
if (process.argv.includes('--clean')) process.exit(0);
mkdirSync(OUT, { recursive: true });
let copied = 0;
let skipped = 0;
for (const name of readdirSync(ROOT)) {
  const src = join(ROOT, name);
  cpSync(src, join(OUT, name), {
    recursive: true,
    filter: (p) => {
      const rel = relative(ROOT, p);
      if (!rel) return true;
      const dir = statSync(p).isDirectory();
      const ok = isPublic(rel, dir);
      if (!dir) ok ? copied++ : skipped++;
      return ok;
    },
  });
}
// Drop folders that ended up empty.
(function prune(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) {
      prune(p);
      if (readdirSync(p).length === 0) rmSync(p, { recursive: true });
    }
  }
})(OUT);
// Self-check: the served tree must hold the site and none of the internal files.
const shipped = [];
(function walk(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p); else shipped.push(relative(OUT, p));
  }
})(OUT);
const leaked = shipped.filter((rel) => !isPublic(rel, false));
const missing = ['index.html', 'pricing.html', 'insider.html', 'dashboard.html', '404.html', 'robots.txt', 'sitemap.xml']
  .filter((rel) => !shipped.includes(rel));
if (leaked.length || missing.length) {
  console.error(`[build-public] FAILED: leaked ${leaked.join(', ') || 'none'}; missing ${missing.join(', ') || 'none'}`);
  process.exit(1);
}
console.log(`[build-public] dist/: ${copied} public files copied, ${skipped} internal entries left out`);
