#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const index = readFileSync(resolve(root, 'index.html'), 'utf8');
const privacy = readFileSync(resolve(root, 'privacy.html'), 'utf8');
const errors = [];

const companyId = '6aa57121be55299b218315fc';
const widgetUrl = 'https://api.knock-knockapp.com/widget/widget.js';

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

if (count(index, companyId) !== 1) errors.push('homepage must contain the exact Knock Knock company id once');
if (count(index, widgetUrl) !== 1) errors.push('homepage must contain the official widget URL once');
if (!index.includes("const CONSENT_KEY = 'gdf_knockknock_consent'")) errors.push('widget needs a dedicated persisted consent choice');
if (!index.includes('function loadKnockKnock()')) errors.push('widget must load through the consent-gated loader');
if (!index.includes("navigator.globalPrivacyControl === true")) errors.push('widget must respect Global Privacy Control');
if (!index.includes("navigator.doNotTrack === '1'")) errors.push('widget must respect Do Not Track');
if (!index.includes('Allow visitor assistant')) errors.push('notice must offer an explicit opt-in action');
if (!index.includes('Continue without')) errors.push('notice must offer an equally clear rejection action');
if (/\<script[^>]+src=["']https:\/\/api\.knock-knockapp\.com\/widget\/widget\.js/i.test(index)) {
  errors.push('widget must not load unconditionally from a static script tag');
}

for (const required of [
  'Knock Knock App',
  'IP address',
  'pages visited',
  'company or individual-level identification',
  'https://knockknockapp.ai/privacy-policy/'
]) {
  if (!privacy.includes(required)) errors.push(`privacy policy is missing: ${required}`);
}
if (!privacy.includes('Last updated: September 16, 2026')) errors.push('privacy policy date must reflect this change');

if (errors.length) {
  console.error('Knock Knock widget policy check failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log('Knock Knock widget policy check passed');
