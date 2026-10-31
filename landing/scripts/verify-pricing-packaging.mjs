#!/usr/bin/env node
/** Pricing/package consistency guard for gitdealflow.com. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ROOT = join(fileURLToPath(new URL('..', import.meta.url)));
const ROOT = process.argv[2] || DEFAULT_ROOT;
const errors = [];
// Same checkout links as signals.gitdealflow.com (aligned 2026-10-29, Maryan t364u).
const dashboardMonthly = 'https://buy.stripe.com/4gMbJ07kTaJy7kqg6s0x20b';
const insiderMonthly = 'https://buy.stripe.com/bJeaEWfRpcRG6gm2fC0x20d';
const bannedTokens = [
  'fZu28q34DdVKawC6vS0x20g', // apex-only Dashboard monthly, replaced by the signals link 2026-10-29 (t364u)
  '8x29AS5cLdVK206g6s0x20h', // closed Insider monthly product
  '5kQ8wO48H3h6cEKdYk0x20I', // stale Dashboard EUR 441/year
  'bJe3cu48H3h6awC3jG0x20J', // stale Insider EUR 1,773/year
  'cNieVc34DbNCcEK2fC0x20e', // closed Insider annual product
  'aFa5kC34DeZOawC6vS0x20c', // Dashboard annual, removed 2026-10-29 (Maryan, t363u)
];
const scannedExt = new Set(['.html', '.md', '.txt', '.xml', '.json', '.py', '.mjs']);
const skip = new Set([
  'REPORT_HERMES_CONVERSION_GITDEALFLOW.md',
  'HERMES_REPORT_CONVERSION_REPAIR.md',
  'OWNER_ACTIONS_GITDEALFLOW.md',
  'scripts/verify-pricing-packaging.mjs',
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === '.vercel' || name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
function read(rel) { return readFileSync(join(ROOT, rel), 'utf8'); }

for (const p of walk(ROOT)) {
  const rel = relative(ROOT, p);
  if (!scannedExt.has(extname(p)) || skip.has(rel)) continue;
  const text = readFileSync(p, 'utf8');
  for (const token of bannedTokens) {
    if (text.includes(token)) errors.push(`${rel}: banned Stripe token ${token}`);
  }
  if (rel !== 'scripts/test-indexability-policy.mjs' && /Insider enrol+ment (is )?(closed|not open)|Insider Circle, enrol+ment closed/i.test(text)) {
    errors.push(`${rel}: Insider is open at EUR 197/mo but the page still says enrollment is closed`);
  }
}

const pricing = read('pricing.html');
const dashboard = read('dashboard.html');
const insider = read('insider.html');
const pricingMd = read('md/pricing.md');
const insiderMd = read('md/insider.md');
const llms = read('llms.src.txt');
for (const [rel, text] of [['dashboard.html', dashboard], ['md/pricing.md', pricingMd]]) {
  if (!text.includes(dashboardMonthly)) errors.push(`${rel}: canonical EUR 49/month checkout missing`);
}
for (const [rel, text] of [['pricing.html', pricing], ['insider.html', insider], ['md/insider.md', insiderMd], ['md/pricing.md', pricingMd]]) {
  if (!text.includes(insiderMonthly)) errors.push(`${rel}: Insider EUR 197/month checkout missing`);
}
if (!llms.includes('- Dashboard: EUR 49/month (') || !llms.includes('- Insider Circle: EUR 197/month.')) {
  errors.push('llms.src.txt: canonical pricing/package lines missing');
}

const blocks = [...pricing.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
let product = null;
for (const b of blocks) {
  try {
    const parsed = JSON.parse(b[1]);
    for (const n of (parsed['@graph'] || [parsed])) if (n?.['@type'] === 'Product') product = n;
  } catch (e) { errors.push(`pricing.html: invalid JSON-LD: ${e.message}`); }
}
const offers = product?.offers?.offers || [];
if (offers.length !== 5) errors.push(`pricing.html: expected 5 open schema offers, found ${offers.length}`);
if (!offers.some((o) => o?.name === 'Insider Circle' && Number(o.price) === 197)) errors.push('pricing.html: Insider Circle EUR 197 schema offer missing');
if (!offers.some((o) => o?.name === 'Dashboard' && Number(o.price) === 49)) errors.push('pricing.html: Dashboard schema offer missing');

if (errors.length) {
  console.error(`FAIL verify-pricing-packaging: ${errors.length} violation(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('PASS verify-pricing-packaging: Dashboard EUR 49/mo and Insider EUR 197/mo open on the signals links, no annual; stale links absent');
