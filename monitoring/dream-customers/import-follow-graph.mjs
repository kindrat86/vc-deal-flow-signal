#!/usr/bin/env node
// Import X follow-graph snapshot into PocketBase `contacts`.
//
// Reads follow-graph-snapshot.json (produced by Chrome MCP scrape) and:
//   - For each handle present in following OR followers:
//       * If contact already exists by x_handle → PATCH follows_me/i_follow/last_follow_check_at
//                                                  (also fills display_name if currently empty)
//       * Else → CREATE with stage=sourced, follows_me/i_follow set, discovered_via='x_followgraph'
//
// PB token comes from monitoring/dream-customers/dashboard.config.js.
//
// Idempotent — safe to run repeatedly.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = join(__dirname, 'follow-graph-snapshot.json');
const CONFIG  = join(__dirname, 'dashboard.config.js');

const PB_URL = 'http://127.0.0.1:8090';

function loadToken() {
  const txt = readFileSync(CONFIG, 'utf8');
  const m = txt.match(/token:\s*"([^"]+)"/);
  if (!m) throw new Error('No token in ' + CONFIG);
  return m[1];
}

async function pb(path, opts = {}) {
  const res = await fetch(PB_URL + path, {
    method: opts.method || 'GET',
    headers: {
      Authorization: 'Bearer ' + TOKEN,
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${res.status} ${path}: ${txt.slice(0, 200)}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('json') ? res.json() : null;
}

const TOKEN = loadToken();
const snap = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));

// Build per-handle direction map
const direction = new Map();
for (const e of snap.following) {
  direction.set(e.h.toLowerCase(), { handle: e.h, name: e.n, i_follow: true, follows_me: false });
}
for (const e of snap.followers) {
  const key = e.h.toLowerCase();
  const cur = direction.get(key) || { handle: e.h, name: e.n, i_follow: false, follows_me: false };
  cur.follows_me = true;
  if (!cur.name && e.n) cur.name = e.n;
  direction.set(key, cur);
}

console.log(`Snapshot: ${snap.following.length} following, ${snap.followers.length} followers, ${direction.size} unique handles`);
const mutual = [...direction.values()].filter(d => d.i_follow && d.follows_me);
console.log(`Mutuals: ${mutual.length} (${mutual.map(m => '@' + m.handle).join(', ')})`);

// Fetch existing contacts (case-insensitive match on x_handle)
const existing = await pb('/api/collections/contacts/records?perPage=500');
const byHandle = new Map();
for (const c of existing.items) byHandle.set(c.x_handle.toLowerCase(), c);
console.log(`Existing PB contacts: ${existing.items.length}`);

const nowIso = new Date().toISOString();
let created = 0, patched = 0, unchanged = 0;

for (const d of direction.values()) {
  const existingContact = byHandle.get(d.handle.toLowerCase());
  if (existingContact) {
    const patch = {};
    if (existingContact.follows_me !== d.follows_me) patch.follows_me = d.follows_me;
    if (existingContact.i_follow !== d.i_follow)     patch.i_follow = d.i_follow;
    patch.last_follow_check_at = nowIso;
    if (!existingContact.display_name && d.name) patch.display_name = d.name;
    // Only PATCH if there's a real change (last_follow_check_at always updates, so always patch)
    await pb(`/api/collections/contacts/records/${existingContact.id}`, { method: 'PATCH', body: patch });
    patched++;
  } else {
    // Auto-stage on create per user rule 2026-05-28:
    // - follows_me=true → 'followers' (includes mutuals)
    // - i_follow=true only → 'following'
    // - neither → 'sourced' (shouldn't happen since we only scrape one of these states)
    let initialStage = 'sourced';
    if (d.follows_me) initialStage = 'followers';
    else if (d.i_follow) initialStage = 'following';

    await pb('/api/collections/contacts/records', {
      method: 'POST',
      body: {
        x_handle: d.handle,
        display_name: d.name || '',
        stage: initialStage,
        dream_customer: false,
        follows_me: d.follows_me,
        i_follow: d.i_follow,
        discovered_via: 'x_followgraph',
        last_follow_check_at: nowIso,
      },
    });
    created++;
  }
}

console.log(`Done: ${created} created, ${patched} patched, ${unchanged} unchanged`);
console.log('New contacts auto-staged: follows_me→followers, i_follow-only→following (mutuals=followers).');
