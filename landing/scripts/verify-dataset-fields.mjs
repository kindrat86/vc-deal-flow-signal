#!/usr/bin/env node

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const landingRoot = process.argv[2]
  ? resolve(process.argv[2])
  : join(dirname(fileURLToPath(import.meta.url)), '..');
const requiredCatalogs = new Set(['data/index.html', 'de/data/index.html', 'es/data/index.html']);
function htmlFiles(dir = '') {
  return readdirSync(join(landingRoot, dir), { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') return [];
    const rel = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(rel);
    return entry.isFile() && entry.name.endsWith('.html') ? [rel] : [];
  });
}
const files = htmlFiles();
const blockPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
const errors = [];
let datasetCount = 0;
for (const rel of requiredCatalogs) {
  if (!files.includes(rel)) errors.push(`${rel}: required data catalog is missing`);
}
if (!files.length) errors.push('No HTML files found');

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
  const nodes = [];
  for (const match of html.matchAll(blockPattern)) {
    const parsed = JSON.parse(match[1]);
    walk(parsed, (node) => {
      nodes.push(node);
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (types.includes('Dataset')) datasets.push(node);
    });
  }

  if (datasets.length === 0 && requiredCatalogs.has(rel)) {
    errors.push(`${rel}: no Dataset JSON-LD node found`);
    continue;
  }
  for (const dataset of datasets) {
    datasetCount++;
    for (const field of ['name', 'description']) {
      if (typeof dataset[field] !== 'string' || !dataset[field].trim()) {
        errors.push(`${rel}: Dataset ${JSON.stringify(dataset.name)} is missing ${field}`);
      }
    }
    const creators = Array.isArray(dataset.creator) ? dataset.creator : [dataset.creator];
    const hasCreator = creators.some((creator) => {
      if (!creator || typeof creator !== 'object') return false;
      const definition = creator['@id']
        ? nodes.find((node) => node['@id'] === creator['@id'] && node.name)
        : null;
      const entity = { ...definition, ...creator };
      const types = Array.isArray(entity['@type']) ? entity['@type'] : [entity['@type']];
      return types.some((type) => ['Organization', 'Person'].includes(type))
        && typeof entity.name === 'string' && Boolean(entity.name.trim());
    });
    if (!hasCreator) errors.push(`${rel}: Dataset ${JSON.stringify(dataset.name)} is missing a named creator`);
    let hasLicense = false;
    try {
      hasLicense = typeof dataset.license === 'string'
        && ['https:', 'http:'].includes(new URL(dataset.license).protocol);
    } catch { /* Blank or malformed URLs must fail closed. */ }
    if (!hasLicense) errors.push(`${rel}: Dataset ${JSON.stringify(dataset.name)} is missing a valid license URL`);
  }
}

if (errors.length) {
  console.error(`[verify-dataset-fields] ${errors.length} error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`[verify-dataset-fields] OK: name, description, creator and license present on ${datasetCount} Dataset nodes across ${files.length} HTML files`);
