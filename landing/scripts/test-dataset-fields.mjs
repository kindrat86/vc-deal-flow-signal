#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const verifier = fileURLToPath(new URL('./verify-dataset-fields.mjs', import.meta.url));
const dataset = () => ({
  '@type': 'Dataset', name: 'Test dataset',
  description: 'A documented set of public observations for a repeatable dataset metadata test.',
  creator: { '@type': 'Organization', name: 'Test publisher' },
  license: 'https://creativecommons.org/licenses/by/4.0/',
});
function fixture(t, extra) {
  const root = mkdtempSync(join(tmpdir(), 'gdf-dataset-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const pages = {
    'data/index.html': dataset(),
    'de/data/index.html': dataset(),
    'es/data/index.html': dataset(),
    ...extra,
  };
  for (const [rel, node] of Object.entries(pages)) {
    const path = join(root, rel);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `<script type="application/ld+json">${JSON.stringify(node)}</script>`);
  }
  return spawnSync(process.execPath, [verifier, root], { encoding: 'utf8' });
}

test('rejects missing description in a nested Dataset outside the old three-page allowlist', (t) => {
  const broken = dataset();
  delete broken.description;
  const result = fixture(t, {
    'research/index.html': { '@type': 'CollectionPage', hasPart: [broken] },
  });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /research\/index\.html.*description/);
});


test('rejects empty creator and license values in catalog Dataset arrays', (t) => {
  const broken = { ...dataset(), creator: {}, license: '  ' };
  const result = fixture(t, { 'datasets.html': { '@type': 'CollectionPage', hasPart: [broken] } });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /datasets\.html.*creator/);
  assert.match(result.stderr, /datasets\.html.*license/);
});
