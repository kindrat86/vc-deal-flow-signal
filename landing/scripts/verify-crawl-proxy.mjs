#!/usr/bin/env node
// Guard the apex AI-discovery crawl proxy. Static twins would bypass its rewrites.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const names = ['llms.txt', 'llms-full.txt', 'ai.txt', 'agents.txt'];
const source = readFileSync(join(root, 'api/crawl-proxy.js'), 'utf8');
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const rewrites = vercel.rewrites || [];
const failures = [];

for (const name of names) {
  const src = `${name.replace('.txt', '')}.src.txt`;
  if (!existsSync(join(root, src))) failures.push(`missing source file: ${src}`);
  if (existsSync(join(root, name))) failures.push(`static twin shadows rewrite: ${name}`);
  if (!source.includes(`"${name}": "${src}"`)) failures.push(`crawl-proxy map missing: ${name}`);
  const route = rewrites.find((r) => r.source === `/${name}`);
  if (!route || route.destination !== `/api/crawl-proxy?f=${name}`) {
    failures.push(`rewrite missing or wrong: /${name}`);
  }
}

for (const needle of ['resolveBotLabel', 'captureBotCrawl', 'x-relay-secret', 'text/plain; charset=utf-8']) {
  if (!source.includes(needle)) failures.push(`crawl-proxy behavior missing: ${needle}`);
}

if (failures.length) {
  console.error('verify-crawl-proxy FAILED:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('verify-crawl-proxy PASS: 4 discovery routes reach the bot-crawl proxy without static shadows');
