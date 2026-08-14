import "server-only";

/**
 * Recent-signup feed for honest "an investor from {city} signed up" social
 * proof on the landing page. Backed by Vercel Runtime Cache (per-region KV
 * with TTL), same store the funnel-activity counters use.
 *
 * Honesty contract (this is the whole point of the feature):
 *
 *   - We store ONLY real signup events. Nothing is seeded, faked, or
 *     time-shifted. If volume is low, the feed is short or empty, and the
 *     landing shows nothing rather than inventing a "someone from Paris."
 *   - We store city + country + timestamp. No email, no IP, no name, no
 *     session id. City-level is coarse enough to be non-identifying.
 *   - An event is recorded at /api/subscribe submit time, where the request
 *     comes straight from the visitor's browser, so Vercel's geo headers are
 *     the visitor's real location (email-link clicks get proxied/prefetched
 *     and would yield the mail provider's datacenter, not the person).
 *
 * Mirrors lib/funnel-activity.ts: single capped array under one key,
 * read+compact+append+write, in-memory fallback for `next dev` / non-Vercel.
 */

import { getCache } from "@vercel/functions";

const NAMESPACE = "recent-signups";
const KEY = "feed";
const TTL_SECONDS = 30 * 86_400; // 30 days, keeps the feed warm even when sparse
const MAX_EVENTS = 25;
const WINDOW_MS = 30 * 24 * 60 * 60_000; // 30 days

export interface SignupEvent {
  ts: number; // epoch ms
  city: string;
  country: string; // ISO alpha-2 (e.g. "DE"), or "" if unknown
}

interface SignupStore {
  read: () => Promise<SignupEvent[]>;
  write: (events: SignupEvent[]) => Promise<void>;
}

// In-memory fallback for local dev and tests. Lossy across cold starts.
class InMemoryStore implements SignupStore {
  private events: SignupEvent[] = [];
  async read(): Promise<SignupEvent[]> {
    return this.events;
  }
  async write(events: SignupEvent[]): Promise<void> {
    this.events = events;
  }
}

class RuntimeCacheStore implements SignupStore {
  async read(): Promise<SignupEvent[]> {
    const cache = getCache({ namespace: NAMESPACE });
    const raw = (await cache.get(KEY)) as SignupEvent[] | undefined | null;
    return Array.isArray(raw) ? raw : [];
  }
  async write(events: SignupEvent[]): Promise<void> {
    const cache = getCache({ namespace: NAMESPACE });
    await cache.set(KEY, events, { ttl: TTL_SECONDS, tags: [NAMESPACE] });
  }
}

let _store: SignupStore | null = null;
function getStore(): SignupStore {
  if (_store) return _store;
  _store = process.env.VERCEL ? new RuntimeCacheStore() : new InMemoryStore();
  return _store;
}

/** Filter to the last 30 days, sort ascending, cap to MAX_EVENTS. */
function compact(events: SignupEvent[], now: number): SignupEvent[] {
  const cutoff = now - WINDOW_MS;
  const fresh = events.filter((e) => e && typeof e.ts === "number" && e.ts > cutoff);
  fresh.sort((a, b) => a.ts - b.ts);
  return fresh.length <= MAX_EVENTS ? fresh : fresh.slice(-MAX_EVENTS);
}

/**
 * Record one real signup. Best-effort: callers must wrap so a cache hiccup
 * never breaks the subscribe flow. We never store an empty city, better to
 * show nothing than a vague "somewhere".
 */
export async function recordSignup(city: string, country: string): Promise<void> {
  const c = (city || "").trim().slice(0, 80);
  if (!c) return; // no city → don't record (no fabricated locations)
  const store = getStore();
  const now = Date.now();
  const next = compact(await store.read(), now);
  next.push({ ts: now, city: c, country: (country || "").trim().toUpperCase().slice(0, 8) });
  await store.write(next.length > MAX_EVENTS ? next.slice(-MAX_EVENTS) : next);
}

/** Read the most-recent real signups (newest first), capped to `limit`. */
export async function readRecentSignups(limit = 12): Promise<SignupEvent[]> {
  const now = Date.now();
  const fresh = compact(await getStore().read(), now);
  const n = Math.max(1, Math.min(limit, MAX_EVENTS));
  return fresh.slice(-n).reverse();
}

/** Test-only, drop the singleton. */
export function __resetForTests(): void {
  _store = null;
}
