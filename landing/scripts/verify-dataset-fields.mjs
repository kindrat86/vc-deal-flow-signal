#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const landingRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['data/index.html', 'de/data/index.html', 'es/data/index.html'];
const blockPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
const errors = [];

function walk(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit);
    return;
  }
  if (!value || typeof value !== 'object') return;
  visit(value);
  for (const child of Object.values(value)) walk(child, visit);
}

for (const rel of files) {
  const html = readFileSync(join(landingRoot, rel), 'utf8');
  const datasets = [];
  for (const match of html.matchAll(blockPattern)) {
    const parsed = JSON.parse(match[1]);
    walk(parsed, (node) => {
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (types.includes('Dataset')) datasets.push(node);
    });
  }

  if (datasets.length === 0) {
    errors.push(`${rel}: no Dataset JSON-LD node found`);
    continue;
  }
  for (const dataset of datasets) {
    if (!dataset.creator) errors.push(`${rel}: Dataset ${JSON.stringify(dataset.name)} is missing creator`);
    if (!dataset.license) errors.push(`${rel}: Dataset ${JSON.stringify(dataset.name)} is missing license`);
  }
}

if (errors.length) {
  console.error(`[verify-dataset-fields] ${errors.length} error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`[verify-dataset-fields] OK: creator and license present on Dataset nodes in ${files.length} data catalog pages`);
