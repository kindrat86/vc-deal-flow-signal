#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const landing = process.cwd();
const pseo = join(landing, '..', 'pseo-site');
const pixels = readFileSync(join(landing, 'pixels.js'), 'utf8');
const csp = readFileSync(join(landing, 'vercel.json'), 'utf8');
const privacy = readFileSync(join(landing, 'privacy.html'), 'utf8');
const pixelManager = readFileSync(join(pseo, 'components', 'PixelManager.tsx'), 'utf8');

assert.match(pixels, /meta:\s*""/);
assert.match(pixels, /linkedin:\s*""/);
assert.doesNotMatch(pixels, /243382336082500|10702217/);
assert.doesNotMatch(pixelManager, /NEXT_PUBLIC_META_PIXEL_ID|NEXT_PUBLIC_LINKEDIN_PARTNER_ID|243382336082500|10702217/);
assert.doesNotMatch(csp, /connect\.facebook\.net|snap\.licdn\.com/);
assert.doesNotMatch(privacy, /LinkedIn Insight Tag|advertising measurement and retargeting/);
console.log('test-pixel-policy PASS');
