#!/usr/bin/env node
// Fail a release if any indexable apex page loses its social-card metadata.
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const card = resolve(root, 'assets/gitdealflow-social-card-1200x630.png');
const sitemap = readFileSync(resolve(root, 'sitemap-pages.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>https:\/\/gitdealflow\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
const failures = [];

if (!existsSync(card)) failures.push('missing assets/gitdealflow-social-card-1200x630.png');

function metaContent(html, key, value) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const attrs = Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map((m) => [m[1].toLowerCase(), m[3]]));
    if (attrs[key] === value) return attrs.content || '';
  }
  return '';
}

for (const url of urls) {
  const rel = url === '/' ? 'index.html' : `${url.replace(/^\//, '')}${url.endsWith('/') ? 'index.html' : '.html'}`;
  const indexRel = url === '/' ? 'index.html' : `${url.replace(/^\//, '')}/index.html`;
  const path = existsSync(resolve(root, rel)) ? rel : indexRel;
  const html = readFileSync(resolve(root, path), 'utf8');
  const required = [
    ['property', 'og:image'], ['property', 'og:image:width'], ['property', 'og:image:height'],
    ['name', 'twitter:card'], ['name', 'twitter:image'],
  ];
  const missing = required.filter(([key, value]) => !metaContent(html, key, value)).map(([, value]) => value);
  if (metaContent(html, 'property', 'og:image:width') !== '1200') missing.push('og:image:width=1200');
  if (metaContent(html, 'property', 'og:image:height') !== '630') missing.push('og:image:height=630');
  if (metaContent(html, 'name', 'twitter:card') !== 'summary_large_image') missing.push('twitter:card=summary_large_image');
  if (missing.length) failures.push(`${url}: ${[...new Set(missing)].join(', ')}`);
}

if (failures.length) {
  console.error(`[verify-social-card] FAILED: ${failures.length} problems\n${failures.slice(0, 30).join('\n')}`);
  process.exit(1);
}
console.log(`[verify-social-card] ${urls.length} sitemap pages have 1200x630 OG and X card metadata`);
