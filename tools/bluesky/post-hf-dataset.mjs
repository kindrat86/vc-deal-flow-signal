#!/usr/bin/env node
// One-shot Bluesky post announcing the HF glossary dataset.
// Reads BSKY_HANDLE + BSKY_APP_PASSWORD from env (sourced from tools/.env).

import { AtpAgent, RichText } from '@atproto/api';

const handle = process.env.BSKY_HANDLE;
const password = process.env.BSKY_APP_PASSWORD;
if (!handle || !password) {
  console.error('Missing BSKY_HANDLE or BSKY_APP_PASSWORD');
  process.exit(1);
}

const TEXT = [
  'Open-sourced 84 VC and startup-finance definitions today.',
  '',
  'Code-side sourcing, engineering acceleration, AEO/GEO/AIO, agent infrastructure, academic citation, venture math.',
  '',
  'CC-BY-4.0 NDJSON, RAG-ready, free.',
  '',
  'huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal-glossary',
].join('\n');

console.log(`post length: ${TEXT.length} chars (300 max)`);
console.log('--- preview ---');
console.log(TEXT);
console.log('---');

const agent = new AtpAgent({ service: 'https://bsky.social' });
await agent.login({ identifier: handle, password });
console.log(`logged in as ${handle}`);

const rt = new RichText({ text: TEXT });
await rt.detectFacets(agent);

const res = await agent.post({
  text: rt.text,
  facets: rt.facets,
  createdAt: new Date().toISOString(),
});

console.log(`posted: ${res.uri}`);
const rkey = res.uri.split('/').pop();
console.log(`public URL: https://bsky.app/profile/${handle}/post/${rkey}`);
