#!/usr/bin/env node
// Claim regression guard for every public GitDealFlow URL in sitemap-pages.xml.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC_CLAIM_BANS = [
  ['peer-reviewed', /\bpeer-reviewed\b/i],
  ['219 fundraises', /\b219\s+(?:documented\s+)?fundraises\b/i],
  ['6-12 weeks', /\b6\s*(?:-|\u2013|to)\s*12\s+weeks?\b/i],
  ['19 or 20 sectors', /\b(?:19|20)\s+sectors\b/i],
  ['unsupported panel count', /\b(?:400\+|4,200\+|4,800|369|411)\s+(?:startups|organizations|orgs)\b/i],
];

function sitemapPaths(root) {
  const sitemap = readFileSync(join(root, 'sitemap-pages.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(https:\/\/gitdealflow\.com[^<]*)<\/loc>/g)].map((match) => match[1]);
  return [...new Set(urls)].map((url) => new URL(url).pathname);
}

function fileForPath(root, pathname) {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  const candidates = clean
    ? [join(root, `${clean}.html`), join(root, clean, 'index.html')]
    : [join(root, 'index.html')];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function sourceFiles(root) {
  const generators = [
    '_gen_cornerstone_articles.py',
    '_pseo_expand_to_200.py',
    '_expand_thin_pages.py',
    '_deepen_cornerstone_articles.py',
    'llms-full.src.txt',
    'llms.src.txt',
  ].map((rel) => join(root, rel)).filter((file) => existsSync(file));

  const locales = ['de', 'es'].flatMap((locale) => {
    const dir = join(root, locale);
    if (!existsSync(dir)) return [];
    return readdirSync(dir, { recursive: true })
      .filter((entry) => String(entry).endsWith('.html'))
      .map((entry) => join(dir, String(entry)));
  });
  return [...generators, ...locales];
}

export function auditPublicClaims(root = process.cwd()) {
  const failures = [];
  const pages = new Map();

  for (const pathname of sitemapPaths(root)) {
    const file = fileForPath(root, pathname);
    if (!file) {
      failures.push(`sitemap URL has no local static page: ${pathname || '/'}`);
      continue;
    }
    pages.set(file, readFileSync(file, 'utf8'));
  }
  for (const file of sourceFiles(root)) {
    pages.set(file, readFileSync(file, 'utf8'));
  }

  const homepage = readFileSync(join(root, 'index.html'), 'utf8');
  const homepageText = homepage.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const homepageRequired = [
    '219 startup-period observations across 55 startups',
    'It is evidence to investigate, not proof of a future round.',
    'Three public signals to examine before a fundraise announcement:',
  ];
  for (const needle of homepageRequired) {
    if (!homepageText.includes(needle)) failures.push(`homepage missing corrected claim: ${needle}`);
  }

  const brand = readFileSync(join(root, 'brand.html'), 'utf8');
  const brandRequired = [
    'VC Deal Flow Signal by GitDealFlow',
    'The Data Nerd',
    'not a fund and not investment advice',
  ];
  for (const needle of brandRequired) {
    if (!brand.includes(needle)) failures.push(`brand page missing canonical identity: ${needle}`);
  }

  for (const [file, html] of pages) {
    for (const [label, pattern] of PUBLIC_CLAIM_BANS) {
      const inspectable = label === 'peer-reviewed'
        ? html.replace(/not (?:a )?formally peer-reviewed(?: in a journal)?/gi, '')
        : html;
      if (pattern.test(inspectable)) failures.push(`${file.slice(root.length + 1)} contains banned public claim: ${label}`);
    }
  }

  return failures;
}

function main() {
  const failures = auditPublicClaims();
  if (failures.length) {
    console.error('verify-claims FAILED:');
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log('verify-claims PASS: sitemap-visible claim wording and public identity are locked');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
