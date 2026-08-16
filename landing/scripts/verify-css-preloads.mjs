#!/usr/bin/env node
/**
 * verify-css-preloads.mjs — regression guard (2026-08-16 FCP fix)
 * Every external stylesheet <link> in any shipped HTML must have a matching
 * <link rel="preload" ... as="style"> for the same href (query string included).
 * Reason: 661 stylesheet refs shipped without preload on 2026-08-16; apex human
 * FCP p75 was 2,334ms (PostHog $web_vitals, 30d). Preload completes the pattern
 * already used by index.html. Also fails on any fonts.googleapis.com reference
 * (CSP blocks it: style-src 'self'; it was dead weight + console errors).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const errors = [];
let checked = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === '.vercel' || name === 'node_modules') continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) { walk(p); continue; }
    if (!name.endsWith('.html')) continue;
    checked++;
    const html = readFileSync(p, 'utf8');
    if (html.includes('fonts.googleapis.com') || html.includes('fonts.gstatic.com')) {
      errors.push(`${relative(ROOT, p)}: references Google Fonts CSS (CSP-blocked, remove it)`);
    }
    const head = html.split('</head>')[0];
    for (const tag of head.match(/<link\b[^>]*>/g) || []) {
      if (!tag.includes('rel="stylesheet"')) continue;
      const href = (tag.match(/href="([^"]+\.css[^"]*)"/) || [])[1];
      if (!href) continue;
      if (!head.includes(`rel="preload" href="${href}"`)) {
        errors.push(`${relative(ROOT, p)}: ${href} has no preload`);
      }
    }
  }
}
walk(ROOT);
if (errors.length) {
  console.error('✗ verify-css-preloads: ' + errors.length + ' issue(s)');
  for (const e of errors.slice(0, 20)) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ verify-css-preloads: ${checked} HTML files, all stylesheets preloaded, no remote font CSS`);
