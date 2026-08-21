#!/usr/bin/env node
// Claim regression guard for the public GitDealFlow homepage and canonical brand page.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const pages = {
  homepage: readFileSync(join(root, 'index.html'), 'utf8'),
  brand: readFileSync(join(root, 'brand.html'), 'utf8'),
};
const failures = [];

const homepageRequired = [
  '219 startup-period observations across 55 startups',
  'It is evidence to investigate, not proof of a future round.',
  'Three public signals to examine before a fundraise announcement:',
];
for (const needle of homepageRequired) {
  if (!pages.homepage.includes(needle)) failures.push(`homepage missing corrected claim: ${needle}`);
}

const homepageBanned = [
  'Three signals that together predict a fundraise',
  '219 documented fundraises',
  'For ten years I wrote those cheques',
  '3 to 7 weeks before the crowd even knows',
];
for (const needle of homepageBanned) {
  if (pages.homepage.includes(needle)) failures.push(`homepage contains stale claim: ${needle}`);
}

const brandRequired = [
  'VC Deal Flow Signal by GitDealFlow',
  'The Data Nerd',
  'not a fund and not investment advice',
];
for (const needle of brandRequired) {
  if (!pages.brand.includes(needle)) failures.push(`brand page missing canonical identity: ${needle}`);
}

if (failures.length) {
  console.error('verify-claims FAILED:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('verify-claims PASS: homepage research wording and public identity are locked');
