/**
 * /xrpc/app.bsky.feed.getFeedSkeleton
 *
 * Returns a list of post URIs comprising the "GitHub VC Signals" custom feed.
 * Bluesky AppViews call this with `?feed=at://...&limit=...&cursor=...`,
 * receive a list of post URIs, then hydrate each post against their own
 * indexer before serving the timeline back to the client.
 *
 * Strategy: query Bluesky's public searchPosts XRPC in parallel with a small
 * set of curated queries that flag GitHub-momentum-meets-VC conversations,
 * then merge, dedupe, and rank by recency. Strictly serverless, no firehose
 * subscriber, no DB. Cached for 60s at the edge so repeat requests within a
 * minute don't re-query the AppView.
 *
 * Spec: https://docs.bsky.app/docs/category/feed-generator
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APPVIEW = "https://api.bsky.app";

// Curated queries. Bluesky search uses simple full-text matching with an
// implicit AND between terms. Quoted phrases match verbatim. We cast a wide
// net then filter client-side so a few off-topic results in any single query
// don't poison the feed.
const QUERIES: string[] = [
  '"github stars" vc',
  '"open source" funded',
  '"dev tools" seed',
  'oss startup raised',
  '"developer tools" series a',
  'gitdealflow',
  '"github signals"',
  'oss funding',
  '"open-source" investors',
  '"contributor velocity"',
];

// Hard relevance filter. A post must contain at least one term from the
// VC-signal cluster AND at least one term from the dev/OSS cluster to count.
// Keeps off-topic noise (politicians named "GitHub", random funding posts in
// non-software industries) out of the feed.
const VC_TERMS = [
  "vc", "venture", "investor", "funded", "funding", "raised", "series",
  "seed", "pre-seed", "angel", "term sheet", "valuation", "yc", "y combinator",
  "deal flow", "portfolio", "lp", "gp",
];
const DEV_TERMS = [
  "github", "git", "open source", "open-source", "oss", "developer",
  "dev tool", "devtool", "repo", "repository", "stars", "contributor",
  "commit", "release", "npm", "pypi", "cargo", "fork", "issue", "pull request",
  "gitdealflow", "self-hosted", "hugging face", "hf",
];

interface BskyPost {
  uri: string;
  cid: string;
  indexedAt?: string;
  record?: { text?: string; createdAt?: string; langs?: string[] };
  author?: { did: string; handle: string };
  likeCount?: number;
  repostCount?: number;
  replyCount?: number;
}

interface SearchResponse {
  posts?: BskyPost[];
  cursor?: string;
}

async function searchOne(q: string, signal: AbortSignal): Promise<BskyPost[]> {
  const url = `${APPVIEW}/xrpc/app.bsky.feed.searchPosts?q=${encodeURIComponent(q)}&limit=40&sort=latest`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal,
      // Hint to Vercel CDN that this fetch can be cached briefly
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as SearchResponse;
    return Array.isArray(json.posts) ? json.posts : [];
  } catch {
    return [];
  }
}

function isRelevant(post: BskyPost): boolean {
  const text = (post.record?.text || "").toLowerCase();
  if (!text) return false;
  // English-only, Bluesky search is global so we get JP/PT/ES posts too
  const langs = post.record?.langs;
  if (Array.isArray(langs) && langs.length > 0 && !langs.includes("en")) return false;
  const hasVc = VC_TERMS.some((t) => text.includes(t));
  const hasDev = DEV_TERMS.some((t) => text.includes(t));
  return hasVc && hasDev;
}

function score(post: BskyPost): number {
  // Recency-dominant ranking. Bluesky reach is small enough that sorting
  // purely by engagement starves new posts; surface fresh content and let
  // engagement be a tiebreaker.
  const created = post.record?.createdAt || post.indexedAt;
  const ts = created ? Date.parse(created) : Date.now();
  const ageHours = Math.max(0, (Date.now() - ts) / 36e5);
  const engagement =
    (post.likeCount || 0) + 2 * (post.repostCount || 0) + (post.replyCount || 0);
  // Half-life ~24h, with engagement adding a small boost
  return -ageHours + Math.log1p(engagement);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 30)));
  const cursor = url.searchParams.get("cursor");

  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 8000);

  try {
    const batches = await Promise.all(QUERIES.map((q) => searchOne(q, ac.signal)));
    clearTimeout(timeout);

    // Dedupe by URI
    const byUri = new Map<string, BskyPost>();
    for (const batch of batches) {
      for (const post of batch) {
        if (!post?.uri || byUri.has(post.uri)) continue;
        if (!isRelevant(post)) continue;
        byUri.set(post.uri, post);
      }
    }

    const sorted = Array.from(byUri.values()).sort((a, b) => score(b) - score(a));

    // Cursor is the index into the sorted list, opaque to clients but lets
    // them paginate through the snapshot. New requests get a fresh snapshot.
    const start = cursor ? Math.max(0, parseInt(cursor, 10) || 0) : 0;
    const slice = sorted.slice(start, start + limit);
    const nextCursor =
      start + limit < sorted.length ? String(start + limit) : undefined;

    const body = {
      ...(nextCursor ? { cursor: nextCursor } : {}),
      feed: slice.map((p) => ({ post: p.uri })),
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    clearTimeout(timeout);
    return new Response(
      JSON.stringify({ feed: [], error: "AppView unavailable" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "s-maxage=10",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}
