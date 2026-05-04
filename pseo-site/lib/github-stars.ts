/**
 * Fetch a GitHub user's starred repositories with timestamps.
 *
 * Uses the public GitHub API. Sets `Accept: application/vnd.github.v3.star+json`
 * to receive `starred_at` timestamps alongside repo metadata.
 *
 * Rate limits:
 *   - Unauthenticated: 60 requests/hour per IP.
 *   - With GITHUB_PERSONAL_ACCESS_TOKEN env: 5,000 requests/hour.
 *
 * In-memory cache (per Vercel Function instance, ~24h TTL). Cheap repeat visits
 * for popular usernames during a viral spike.
 */

import "server-only";

const GH_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || "";
const PER_PAGE = 100;
const MAX_PAGES = 5; // 500 stars max — covers 99% of devs, caps worst-case latency
const CACHE_TTL_MS = 24 * 3600 * 1000;

export interface StarredRepo {
  full_name: string;       // "vercel/next.js"
  owner_login: string;     // "vercel"
  starred_at: string;      // ISO timestamp
  stars: number;           // current star count (for tiebreak)
  description?: string;
  language?: string;
}

interface CacheEntry {
  data: StarredRepo[];
  fetchedAt: number;
  totalSeen: number; // pages walked
}

const cache = new Map<string, CacheEntry>();

export interface FetchStarsResult {
  username: string;
  stars: StarredRepo[];
  truncated: boolean; // true if user has more than MAX_PAGES * PER_PAGE stars
  fromCache: boolean;
}

/**
 * Validate a GitHub username matches the public format.
 * Letters/numbers/hyphens only, no leading/trailing/consecutive hyphens, max 39 chars.
 */
export function isValidGithubUsername(name: string): boolean {
  if (!name || name.length > 39) return false;
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(name);
}

/**
 * Fetch all (or up to MAX_PAGES * PER_PAGE) starred repos for a username.
 * Returns repos sorted newest-star-first (GitHub default).
 *
 * Throws on 404 (user not found) or persistent network errors. Returns empty
 * array if user has no public stars.
 */
export async function fetchUserStars(username: string): Promise<FetchStarsResult> {
  const key = username.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return {
      username,
      stars: cached.data,
      truncated: cached.totalSeen >= MAX_PAGES,
      fromCache: true,
    };
  }

  const stars: StarredRepo[] = [];
  let page = 1;
  let truncated = false;

  while (page <= MAX_PAGES) {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/starred?per_page=${PER_PAGE}&page=${page}`;
    const headers: Record<string, string> = {
      "Accept": "application/vnd.github.v3.star+json",
      "User-Agent": "gitdealflow-receipts/1.0",
    };
    if (GH_TOKEN) headers["Authorization"] = `Bearer ${GH_TOKEN}`;

    const res = await fetch(url, { headers, cache: "no-store" });

    if (res.status === 404) {
      throw new Error(`GitHub user not found: ${username}`);
    }
    if (res.status === 403 || res.status === 429) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      const reset = res.headers.get("x-ratelimit-reset");
      throw new Error(
        `GitHub rate limit exceeded (remaining=${remaining}, reset=${reset}). Try again later.`,
      );
    }
    if (!res.ok) {
      throw new Error(`GitHub API failed: ${res.status} ${await res.text()}`);
    }

    const items = (await res.json()) as Array<{
      starred_at: string;
      repo: {
        full_name: string;
        owner: { login: string };
        stargazers_count: number;
        description: string | null;
        language: string | null;
      };
    }>;

    if (!Array.isArray(items) || items.length === 0) break;

    for (const item of items) {
      stars.push({
        full_name: item.repo.full_name,
        owner_login: item.repo.owner.login,
        starred_at: item.starred_at,
        stars: item.repo.stargazers_count,
        description: item.repo.description ?? undefined,
        language: item.repo.language ?? undefined,
      });
    }

    if (items.length < PER_PAGE) break; // last page
    if (page === MAX_PAGES) truncated = true;
    page++;
  }

  cache.set(key, { data: stars, fetchedAt: Date.now(), totalSeen: page });

  return { username, stars, truncated, fromCache: false };
}
