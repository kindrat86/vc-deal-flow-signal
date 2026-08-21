#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLAIM_PATTERNS = [
  ['20 sectors', /\b20\s+sectors\b/i],
  ['19 sectors', /\b19\s+sectors\b/i],
  ['6-12 weeks', /\b6\s*(?:-|\u2013|to)\s*12\s+weeks?\b/i],
  ['3-6 weeks', /\b3\s*(?:-|\u2013|to)\s*6\s+weeks?\b/i],
  ['peer-reviewed', /\bpeer-reviewed\b/i],
  ['219 fundraises', /\b219\s+(?:documented\s+)?fundraises\b/i],
  ['unsupported panel count', /\b(?:400\+|4,200\+|4,800|369|411)\s+(?:startups|organizations|orgs)\b/i],
];

export function extractClaimTokens(text) {
  return CLAIM_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([token]) => token);
}

function assertWellFormedXml(xml, url) {
  const stripped = xml.replace(/<\?.*?\?>/gs, '').replace(/<!--.*?-->/gs, '');
  const tokens = [...stripped.matchAll(/<\/?([A-Za-z_:][\w:.-]*)(?:\s[^<>]*?)?\s*(\/?)>/g)];
  if (!tokens.length || !/^\s*</.test(stripped)) throw new Error(`malformed sitemap XML: ${url}`);
  const stack = [];
  for (const match of tokens) {
    const raw = match[0];
    const name = match[1];
    const selfClosing = match[2] === '/';
    if (raw.startsWith('</')) {
      if (stack.pop() !== name) throw new Error(`malformed sitemap XML: ${url}`);
    } else if (!selfClosing) {
      stack.push(name);
    }
  }
  if (stack.length) throw new Error(`malformed sitemap XML: ${url}`);
  const root = tokens[0][1];
  if (root !== 'sitemapindex' && root !== 'urlset') throw new Error(`malformed sitemap XML: ${url}`);
  return root;
}

function locsInside(xml, element) {
  const expression = new RegExp(`<${element}\\b[^>]*>[\\s\\S]*?<loc\\b[^>]*>\\s*([^<]+?)\\s*<\\/loc>[\\s\\S]*?<\\/${element}>`, 'gi');
  return [...xml.matchAll(expression)].map((match) => match[1].trim());
}

export async function inspectSitemap(url, fetchText, seen = new Set()) {
  if (seen.has(url)) return { urls: [], files: [], invalidSitemaps: [] };
  seen.add(url);
  const xml = await fetchText(url);
  const root = assertWellFormedXml(xml, url);
  if (root === 'urlset') return { urls: locsInside(xml, 'url'), files: [url], invalidSitemaps: [] };

  const childSitemaps = locsInside(xml, 'sitemap');
  const combined = { urls: [], files: [url], invalidSitemaps: [] };
  for (const child of childSitemaps) {
    const result = await inspectSitemap(child, fetchText, seen);
    combined.urls.push(...result.urls);
    combined.files.push(...result.files);
    combined.invalidSitemaps.push(...result.invalidSitemaps);
  }
  return combined;
}

export async function countSitemapUrls(url, fetchText) {
  return (await inspectSitemap(url, fetchText)).urls.length;
}

function stripVisibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|amp|quot|lt|gt);/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMatch(text, expression) {
  return text.match(expression)?.[1]?.trim() ?? null;
}

function pageMetadata(html) {
  const jsonLd = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const schemaErrors = [];
  const schemaTypes = [];
  for (const block of jsonLd) {
    try {
      const value = JSON.parse(block[1]);
      const entries = Array.isArray(value) ? value : [value];
      for (const entry of entries) {
        const type = entry?.['@type'];
        if (Array.isArray(type)) schemaTypes.push(...type);
        else if (type) schemaTypes.push(type);
      }
    } catch {
      schemaErrors.push('invalid JSON-LD');
    }
  }
  const visibleText = stripVisibleText(html);
  return {
    title: firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description: firstMatch(html, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i),
    canonical: firstMatch(html, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i),
    h1Count: (html.match(/<h1\b/gi) ?? []).length,
    schemaTypes: [...new Set(schemaTypes)],
    schemaErrors,
    visibleWords: visibleText ? visibleText.split(' ').length : 0,
    claimTokens: extractClaimTokens(visibleText),
  };
}

async function fetchResponse(url) {
  const started = performance.now();
  const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'GitDealFlowTrafficAudit/1.0' } });
  const text = await response.text();
  return {
    url,
    status: response.status,
    finalUrl: response.url,
    contentType: response.headers.get('content-type') ?? '',
    hsts: response.headers.get('strict-transport-security') ?? '',
    text,
    responseMs: Math.round(performance.now() - started),
  };
}

function robotsAllows(robots, agent) {
  const lower = robots.toLowerCase();
  const relevant = lower.split(/\n\s*\n/).filter((block) => block.includes('user-agent: *') || block.includes(`user-agent: ${agent.toLowerCase()}`));
  return !relevant.some((block) => /disallow:\s*\/$/.test(block));
}

async function auditDomain(name, config) {
  const failures = [];
  const fetchText = async (url) => {
    const response = await fetchResponse(url);
    if (!response.status || response.status >= 400) throw new Error(`sitemap fetch ${url} returned ${response.status}`);
    return response.text;
  };
  let sitemap = { urls: [], files: [], invalidSitemaps: [] };
  try {
    sitemap = await inspectSitemap(config.sitemap, fetchText);
  } catch (error) {
    failures.push(String(error.message ?? error));
  }

  const robotsResponse = await fetchResponse(config.robots);
  const robots = robotsResponse.status < 400 ? robotsResponse.text : '';
  const sampledPages = [];
  const claimDrift = [];
  for (const url of config.samples) {
    try {
      const response = await fetchResponse(url);
      const metadata = pageMetadata(response.text);
      const page = { url, status: response.status, finalUrl: response.finalUrl, responseMs: response.responseMs, ...metadata };
      sampledPages.push(page);
      for (const token of metadata.claimTokens) claimDrift.push({ url, token, context: metadata.title ?? '' });
      if (response.status >= 400) failures.push(`${url} returned ${response.status}`);
    } catch (error) {
      failures.push(`${url}: ${String(error.message ?? error)}`);
    }
  }
  const homepage = await fetchResponse(config.homepage);
  const www = await fetchResponse(config.www);
  return {
    name,
    data: {
      sitemapUrls: [...new Set(sitemap.urls)].length,
      sitemapFiles: sitemap.files.length,
      invalidSitemaps: sitemap.invalidSitemaps,
      robotsAllows: {
        googlebot: robotsAllows(robots, 'googlebot'),
        gptbot: robotsAllows(robots, 'gptbot'),
        claudeBot: robotsAllows(robots, 'claudebot'),
        perplexityBot: robotsAllows(robots, 'perplexitybot'),
      },
      headers: {
        httpsRedirect: homepage.finalUrl.startsWith('https://'),
        wwwRedirect: www.finalUrl === homepage.finalUrl || www.finalUrl.startsWith('https://gitdealflow.com'),
        hsts: Boolean(homepage.hsts),
      },
      sampledPages,
    },
    claimDrift,
    failures,
  };
}

const DOMAINS = {
  'gitdealflow.com': {
    homepage: 'https://gitdealflow.com/',
    www: 'https://www.gitdealflow.com/',
    sitemap: 'https://gitdealflow.com/sitemap.xml',
    robots: 'https://gitdealflow.com/robots.txt',
    samples: [
      'https://gitdealflow.com/',
      'https://gitdealflow.com/research/github-velocity-correlation-study',
      'https://gitdealflow.com/dataset',
      'https://gitdealflow.com/llms.txt',
    ],
  },
  'signals.gitdealflow.com': {
    homepage: 'https://signals.gitdealflow.com/',
    www: 'https://signals.gitdealflow.com/',
    sitemap: 'https://signals.gitdealflow.com/sitemap.xml',
    robots: 'https://signals.gitdealflow.com/robots.txt',
    samples: [
      'https://signals.gitdealflow.com/',
      'https://signals.gitdealflow.com/methodology',
      'https://signals.gitdealflow.com/dataset',
      'https://signals.gitdealflow.com/llms.txt',
    ],
  },
};

const ENDPOINTS = [
  'https://gitdealflow.com/llms.txt',
  'https://gitdealflow.com/llms-full.txt',
  'https://signals.gitdealflow.com/.well-known/mcp.json',
  'https://signals.gitdealflow.com/.well-known/agent-card.json',
  'https://signals.gitdealflow.com/api/openapi.json',
  'https://signals.gitdealflow.com/api/agent/tools',
  'https://signals.gitdealflow.com/api/signals.json',
  'https://signals.gitdealflow.com/api/signals.csv',
  'https://signals.gitdealflow.com/api/nlweb',
];

export async function collectTrafficDiscoveryAudit() {
  const domains = {};
  const claimDrift = [];
  const failures = [];
  for (const [name, config] of Object.entries(DOMAINS)) {
    const result = await auditDomain(name, config);
    domains[name] = result.data;
    claimDrift.push(...result.claimDrift);
    failures.push(...result.failures);
  }
  const endpointChecks = [];
  for (const url of ENDPOINTS) {
    try {
      const response = await fetchResponse(url);
      endpointChecks.push({ url, status: response.status, contentType: response.contentType });
      if (response.status >= 400) failures.push(`${url} returned ${response.status}`);
    } catch (error) {
      endpointChecks.push({ url, status: 0, contentType: '', error: String(error.message ?? error) });
      failures.push(`${url}: ${String(error.message ?? error)}`);
    }
  }
  return { generatedAt: new Date().toISOString(), domains, claimDrift, endpointChecks, failures };
}

function markdown(snapshot) {
  const lines = ['# GitDealFlow traffic and discovery snapshot', '', `Generated: ${snapshot.generatedAt}`, ''];
  for (const [domain, data] of Object.entries(snapshot.domains)) {
    lines.push(`## ${domain}`, '', `- Sitemap URLs: ${data.sitemapUrls}`, `- Sitemap files: ${data.sitemapFiles}`, `- Sampled pages: ${data.sampledPages.length}`, `- HSTS: ${data.headers.hsts}`, '');
  }
  lines.push('## Claim drift', '');
  if (snapshot.claimDrift.length) lines.push(...snapshot.claimDrift.map((hit) => `- ${hit.token}: ${hit.url}`));
  else lines.push('- None found in sampled pages.');
  lines.push('', '## Failures', '');
  if (snapshot.failures.length) lines.push(...snapshot.failures.map((failure) => `- ${failure}`));
  else lines.push('- None.');
  return lines.join('\n') + '\n';
}

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

async function main() {
  const out = argument('--out') ?? 'data/audit/traffic-discovery-snapshot.json';
  const markdownOut = argument('--markdown') ?? 'data/audit/traffic-discovery-snapshot.md';
  const snapshot = await collectTrafficDiscoveryAudit();
  mkdirSync(dirname(resolve(out)), { recursive: true });
  mkdirSync(dirname(resolve(markdownOut)), { recursive: true });
  writeFileSync(out, JSON.stringify(snapshot, null, 2) + '\n');
  writeFileSync(markdownOut, markdown(snapshot));
  console.log(JSON.stringify({ out, markdown: markdownOut, failures: snapshot.failures.length, claimDrift: snapshot.claimDrift.length }));
  process.exitCode = snapshot.failures.length ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
