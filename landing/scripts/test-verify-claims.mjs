#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { auditPublicClaims } from './verify-claims.mjs';

const root = mkdtempSync(join(tmpdir(), 'gdf-claims-'));
try {
  mkdirSync(join(root, 'research'), { recursive: true });
  writeFileSync(
    join(root, 'sitemap-pages.xml'),
    `<?xml version="1.0"?><urlset><url><loc>https://gitdealflow.com/</loc></url><url><loc>https://gitdealflow.com/research/example</loc></url></urlset>`,
  );
  writeFileSync(
    join(root, 'index.html'),
    '219 startup-period observations across 55 startups It is evidence to investigate, not proof of a future round. Three public signals to examine before a fundraise announcement:',
  );
  writeFileSync(join(root, 'brand.html'), 'VC Deal Flow Signal by GitDealFlow The Data Nerd not a fund and not investment advice');
  writeFileSync(
    join(root, 'research', 'example.html'),
    'A peer-reviewed study that identified 219 fundraises 6-12 weeks early.',
  );

  const failures = auditPublicClaims(root);
  assert.equal(failures.length, 3, `expected three claim violations, got: ${failures.join(' | ')}`);
  assert.ok(failures.some((failure) => failure.includes('peer-reviewed')));
  assert.ok(failures.some((failure) => failure.includes('219 fundraises')));
  assert.ok(failures.some((failure) => failure.includes('6-12 weeks')));

  writeFileSync(
    join(root, 'research', 'example.html'),
    'This is an SSRN preprint, not formally peer-reviewed in a journal.',
  );
  const disclaimerFailures = auditPublicClaims(root);
  assert.equal(disclaimerFailures.length, 0, `negative research-status disclaimer was incorrectly blocked: ${disclaimerFailures.join(' | ')}`);
  console.log('test-verify-claims PASS');
} finally {
  rmSync(root, { recursive: true, force: true });
}
