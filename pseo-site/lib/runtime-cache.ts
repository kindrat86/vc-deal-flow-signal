import "server-only";

/**
 * Replay-prevention store backed by Vercel Runtime Cache (per-region KV with
 * TTL). Survives cold starts and is shared across function instances within a
 * region — both improvements over the in-memory Map+setInterval pattern that
 * preceded this module.
 *
 * Falls back to an in-memory Map for local dev or any environment where
 * `getCache()` from `@vercel/functions` is unavailable. The fallback matches
 * the prior semantics exactly (per-process, lossy across cold starts).
 *
 * Why a thin wrapper instead of inlining the API:
 *   1. Two routes need the same shape (activate + verify) — DRY.
 *   2. Tests can stub the in-memory fallback without mocking @vercel/functions.
 *   3. The async-everywhere shape forces every call site to await, which
 *      catches the foot-gun where cache lookups silently bypass on `false`-y
 *      `.has()` returns.
 *
 * Per Vercel Runtime Cache docs:
 *   - Item size limit: 2 MB (we store small marker values, no concern)
 *   - Tags per item: 64 (we use 1 tag per namespace)
 *   - TTL is in seconds (not milliseconds — convert at the call site)
 *   - get() returns undefined for missing keys
 *   - The cache is per-region; cross-region replay is theoretically possible
 *     but Vercel's invocation routing keeps a given session pinned for
 *     practical purposes. For the threat model here (link-prefetcher + double-
 *     click), single-region defense is sufficient.
 */

import { getCache } from "@vercel/functions";

interface NoncesStore {
  has: (namespace: string, key: string) => Promise<boolean>;
  mark: (namespace: string, key: string, ttlSeconds: number) => Promise<void>;
}

// In-memory fallback: matches the prior Map+setInterval semantics exactly.
// One Map per namespace so namespaces don't collide on key.
class InMemoryNoncesStore implements NoncesStore {
  private stores = new Map<string, Map<string, number>>();

  private getNamespace(namespace: string): Map<string, number> {
    let store = this.stores.get(namespace);
    if (!store) {
      store = new Map();
      this.stores.set(namespace, store);
    }
    return store;
  }

  async has(namespace: string, key: string): Promise<boolean> {
    const store = this.getNamespace(namespace);
    const entry = store.get(key);
    if (entry === undefined) return false;
    if (Date.now() > entry) {
      store.delete(key);
      return false;
    }
    return true;
  }

  async mark(
    namespace: string,
    key: string,
    ttlSeconds: number,
  ): Promise<void> {
    this.getNamespace(namespace).set(key, Date.now() + ttlSeconds * 1000);
  }
}

class RuntimeCacheNoncesStore implements NoncesStore {
  async has(namespace: string, key: string): Promise<boolean> {
    const cache = getCache({ namespace });
    const entry = await cache.get(key);
    return entry !== undefined && entry !== null;
  }

  async mark(
    namespace: string,
    key: string,
    ttlSeconds: number,
  ): Promise<void> {
    const cache = getCache({ namespace });
    await cache.set(key, "1", { ttl: ttlSeconds, tags: [namespace] });
  }
}

let _store: NoncesStore | null = null;

function getStore(): NoncesStore {
  if (_store) return _store;
  // VERCEL is set at build + runtime on Vercel; absent in `next dev` locally.
  // The Runtime Cache API requires the Vercel runtime — fall back to in-memory
  // off-platform.
  if (process.env.VERCEL) {
    _store = new RuntimeCacheNoncesStore();
  } else {
    _store = new InMemoryNoncesStore();
  }
  return _store;
}

/**
 * Returns true if `key` has been marked as used inside `namespace` and the TTL
 * has not yet elapsed.
 */
export async function isNonceUsed(
  namespace: string,
  key: string,
): Promise<boolean> {
  return getStore().has(namespace, key);
}

/**
 * Marks `key` as used inside `namespace` for `ttlSeconds`. Idempotent — safe to
 * call multiple times. The Vercel Runtime Cache resets the TTL on each set.
 */
export async function markNonceUsed(
  namespace: string,
  key: string,
  ttlSeconds: number,
): Promise<void> {
  return getStore().mark(namespace, key, ttlSeconds);
}

/**
 * Test-only: reset the singleton store. Not exported through the package
 * barrel; consumers in tests can import this path directly if needed.
 */
export function __resetForTests(): void {
  _store = null;
}
