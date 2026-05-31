import "server-only";

/**
 * Live-activity counters for the Funnel Hub at /funnels.
 *
 * Tracks anonymous page-view events per funnel slug, backed by Vercel Runtime
 * Cache (per-region KV with TTL). Returns rolling-window counts (last 5 min,
 * last hour, last 24h) so the Funnel Hub can render a "X looking right now /
 * Y joined this hour" social-proof multiplier next to every funnel card.
 *
 * Brunson Traffic Secrets §3 Ch 12 — Funnel Hub. The book recommends listing
 * every funnel; the missing piece on this site was real-time activity proof
 * next to each entry. This module is that piece.
 *
 * Design choices:
 *
 *   1. Single key per slug — one runtime-cache entry holds an append-only
 *      array of {ts,sid} events. Read+filter+append+write on each track.
 *      Avoids the "two writers race the counter" problem of a single integer.
 *
 *   2. Capped at 500 events — runtime-cache item limit is 2 MB; a 500-element
 *      array of {ts:number, sid:string} is ~30 KB. Headroom is huge but the
 *      cap also keeps writes fast.
 *
 *   3. TTL 25 hours — so we always have ≥24h of data even at the moment
 *      a window rolls over. Each write resets the TTL (rolling window).
 *
 *   4. Sessions deduped per 5 min — when computing "active right now", the
 *      same sid within a 5-min window counts once. Without dedup a single
 *      visitor polling the page would spike the counter.
 *
 *   5. In-memory fallback — local `next dev` and any non-Vercel runtime
 *      uses an in-process Map. Lossy across cold starts, fine for dev.
 *
 *   6. Honest numbers, not fake — we do NOT seed the counters. On day 1 the
 *      numbers are real (low). They grow with traffic. This is consistent
 *      with the project's "methodology over personality" pillar — show the
 *      real number, even if small.
 */

import { getCache } from "@vercel/functions";

const NAMESPACE = "funnel-activity";
const TTL_SECONDS = 25 * 3600; // 25h — always covers a 24h read window
const MAX_EVENTS = 500;
const ACTIVE_WINDOW_MS = 5 * 60_000; // 5 min
const HOUR_MS = 60 * 60_000;
const DAY_MS = 24 * 60 * 60_000;

export interface ActivityEvent {
  ts: number; // epoch ms
  sid?: string; // anonymous session id (cookie or random)
}

export interface ActivityCounts {
  /** Unique sessions seen in the last 5 min. */
  activeNow: number;
  /** Total events in the last hour (not deduped). */
  lastHour: number;
  /** Total events in the last 24 hours (not deduped). */
  last24h: number;
  /** Most recent event timestamp (epoch ms), or null if no events. */
  lastSeenAt: number | null;
}

interface ActivityStore {
  read: (slug: string) => Promise<ActivityEvent[]>;
  write: (slug: string, events: ActivityEvent[]) => Promise<void>;
  readAll: (slugs: string[]) => Promise<Map<string, ActivityEvent[]>>;
}

// In-memory fallback for `next dev` and tests.
class InMemoryStore implements ActivityStore {
  private map = new Map<string, ActivityEvent[]>();
  async read(slug: string): Promise<ActivityEvent[]> {
    return this.map.get(slug) ?? [];
  }
  async write(slug: string, events: ActivityEvent[]): Promise<void> {
    this.map.set(slug, events);
  }
  async readAll(slugs: string[]): Promise<Map<string, ActivityEvent[]>> {
    const out = new Map<string, ActivityEvent[]>();
    for (const slug of slugs) out.set(slug, this.map.get(slug) ?? []);
    return out;
  }
}

class RuntimeCacheStore implements ActivityStore {
  async read(slug: string): Promise<ActivityEvent[]> {
    const cache = getCache({ namespace: NAMESPACE });
    const raw = (await cache.get(slug)) as ActivityEvent[] | undefined | null;
    return Array.isArray(raw) ? raw : [];
  }
  async write(slug: string, events: ActivityEvent[]): Promise<void> {
    const cache = getCache({ namespace: NAMESPACE });
    await cache.set(slug, events, { ttl: TTL_SECONDS, tags: [NAMESPACE] });
  }
  async readAll(slugs: string[]): Promise<Map<string, ActivityEvent[]>> {
    // Runtime cache has no native multi-get; parallel single-gets are fine
    // since they share a region and the namespace is small.
    const cache = getCache({ namespace: NAMESPACE });
    const results = await Promise.all(
      slugs.map(async (slug) => {
        const raw = (await cache.get(slug)) as ActivityEvent[] | undefined | null;
        return [slug, Array.isArray(raw) ? raw : []] as const;
      }),
    );
    return new Map(results);
  }
}

let _store: ActivityStore | null = null;
function getStore(): ActivityStore {
  if (_store) return _store;
  _store = process.env.VERCEL ? new RuntimeCacheStore() : new InMemoryStore();
  return _store;
}

/** Compact an event list: filter to last 24h, sort, cap. */
function compact(events: ActivityEvent[], now: number): ActivityEvent[] {
  const cutoff = now - DAY_MS;
  const fresh = events.filter((e) => e.ts > cutoff);
  fresh.sort((a, b) => a.ts - b.ts);
  return fresh.length <= MAX_EVENTS ? fresh : fresh.slice(-MAX_EVENTS);
}

/** Compute rolling counts from an event list. */
export function summarize(events: ActivityEvent[], now: number = Date.now()): ActivityCounts {
  if (events.length === 0) {
    return { activeNow: 0, lastHour: 0, last24h: 0, lastSeenAt: null };
  }
  const cutoffActive = now - ACTIVE_WINDOW_MS;
  const cutoffHour = now - HOUR_MS;
  const cutoffDay = now - DAY_MS;
  const sids = new Set<string>();
  let lastHour = 0;
  let last24h = 0;
  let lastSeenAt = 0;
  for (const e of events) {
    if (e.ts > cutoffDay) last24h++;
    if (e.ts > cutoffHour) lastHour++;
    if (e.ts > cutoffActive && e.sid) sids.add(e.sid);
    if (e.ts > lastSeenAt) lastSeenAt = e.ts;
  }
  return {
    activeNow: sids.size,
    lastHour,
    last24h,
    lastSeenAt: lastSeenAt || null,
  };
}

/**
 * Append a view event to a funnel's activity log. Returns the post-write
 * counts, useful for the track endpoint to echo back to the client.
 */
export async function trackFunnelView(
  slug: string,
  sid?: string,
): Promise<ActivityCounts> {
  const store = getStore();
  const now = Date.now();
  const existing = await store.read(slug);
  const next = compact(existing, now);
  next.push({ ts: now, sid });
  await store.write(slug, next.length > MAX_EVENTS ? next.slice(-MAX_EVENTS) : next);
  return summarize(next, now);
}

/** Read counts for one slug without writing. */
export async function readFunnelCounts(slug: string): Promise<ActivityCounts> {
  const events = await getStore().read(slug);
  return summarize(events, Date.now());
}

/** Read counts for many slugs in one shot — used by GET /api/funnel-activity. */
export async function readManyFunnelCounts(
  slugs: string[],
): Promise<Record<string, ActivityCounts>> {
  const map = await getStore().readAll(slugs);
  const now = Date.now();
  const out: Record<string, ActivityCounts> = {};
  for (const slug of slugs) {
    out[slug] = summarize(map.get(slug) ?? [], now);
  }
  return out;
}

/** Test-only — drop the singleton. */
export function __resetForTests(): void {
  _store = null;
}
