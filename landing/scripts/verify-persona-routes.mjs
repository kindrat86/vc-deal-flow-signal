#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PERSONAS = Object.freeze([
  { slug: 'angel-investors', label: 'Angel Investors' },
  { slug: 'venture-scouts', label: 'Venture Scouts' },
  { slug: 'micro-vcs', label: 'Micro VCs' },
  { slug: 'solo-gps', label: 'Solo GPs' },
  { slug: 'impact-investors', label: 'Impact Investors' },
  { slug: 'family-offices', label: 'Family Offices' },
  { slug: 'hedge-funds', label: 'Hedge Funds' },
  { slug: 'corporate-vcs', label: 'Corporate VCs' },
  { slug: 'corporate-ventures', label: 'Corporate Ventures' },
  { slug: 'investment-bankers', label: 'Investment Bankers' },
  { slug: 'private-equity-analysts', label: 'Private Equity Analysts' },
  { slug: 'lp-investors', label: 'LP Investors' },
  { slug: 'accelerators', label: 'Accelerators' },
  { slug: 'startup-studios', label: 'Startup Studios' },
  { slug: 'founders', label: 'Founders' },
]);

function textContent(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|#160);/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(text) {
  return text.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g)?.length ?? 0;
}

function firstMatch(html, pattern) {
  return html.match(pattern)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ?? '';
}

function findPersonaFile(root, slug) {
  const candidates = [join(root, 'for', slug, 'index.html'), join(root, 'for', `${slug}.html`)];
  return candidates.find((candidate) => existsSync(candidate));
}

export function verifyPersonaRoutes(root) {
  const errors = [];
  const hubPath = join(root, 'for', 'index.html');
  const sitemapPath = join(root, 'sitemap-pages.xml');
  const hub = existsSync(hubPath) ? readFileSync(hubPath, 'utf8') : '';
  const sitemap = existsSync(sitemapPath) ? readFileSync(sitemapPath, 'utf8') : '';

  if (!hub) errors.push('persona hub is missing: for/index.html');
  if (!sitemap) errors.push('persona sitemap surface is missing: sitemap-pages.xml');

  for (const persona of PERSONAS) {
    const url = `https://gitdealflow.com/for/${persona.slug}`;
    const file = findPersonaFile(root, persona.slug);

    if (!file) {
      errors.push(`${persona.slug}: route file is missing`);
      continue;
    }

    const html = readFileSync(file, 'utf8');
    const visible = textContent(html);
    const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const h1 = firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const canonical = firstMatch(html, /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/i);
    const words = wordCount(visible);

    if (!title.toLowerCase().includes(persona.label.toLowerCase())) {
      errors.push(`${persona.slug}: title does not name ${persona.label}`);
    }
    if (!h1.toLowerCase().includes(persona.label.toLowerCase())) {
      errors.push(`${persona.slug}: H1 does not name ${persona.label}`);
    }
    if (canonical !== url) {
      errors.push(`${persona.slug}: canonical must be ${url}, found ${canonical || 'none'}`);
    }
    if (/\b(?:404|page not found|not found)\b/i.test(`${title} ${h1}`) || words < 450) {
      errors.push(`${persona.slug}: route is not a substantive persona page (${words} visible words)`);
    }
    const hasDistributionCta = /<a\b[^>]*\bhref=["'](?:https:\/\/signals\.gitdealflow\.com(?:\/[^"']*)?|\/?#signup|https:\/\/gitdealflow\.com\/free-vc-deal-flow-tracker)["'][^>]*>/i.test(html);
    if (!hasDistributionCta) {
      errors.push(`${persona.slug}: page lost its distribution CTA`);
    }
    if (/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*\bcontent=["'][^"']*noindex/i.test(html)) {
      errors.push(`${persona.slug}: page is marked noindex`);
    }
    if (!hub.includes(url)) {
      errors.push(`persona hub is missing ${url}`);
    }
    if (!sitemap.includes(`<loc>${url}</loc>`)) {
      errors.push(`persona sitemap is missing ${url}`);
    }
  }

  return { personaCount: PERSONAS.length, errors };
}

const modulePath = fileURLToPath(import.meta.url);
if (process.argv[1] && modulePath === process.argv[1]) {
  const root = join(dirname(modulePath), '..');
  const result = verifyPersonaRoutes(root);
  if (result.errors.length) {
    console.error(`[verify-persona-routes] ${result.errors.length} failure(s):`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`[verify-persona-routes] ${result.personaCount}/${result.personaCount} persona routes are substantive, linked, canonical, and in the sitemap`);
}
