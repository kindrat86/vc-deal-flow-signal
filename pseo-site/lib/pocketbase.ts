/**
 * Minimal PocketBase REST client for server-side use.
 *
 * Auths with an admin account and caches the token in-memory for the process
 * lifetime (Vercel Functions instance reuse via Fluid Compute means we keep
 * the token warm across requests on the same instance).
 *
 * Do NOT import from client components, this uses admin credentials.
 */

import "server-only";

const PB_URL = process.env.POCKETBASE_URL;
const PB_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PB_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

let cachedToken: { token: string; expiresAt: number } | null = null;

function requireConfig(): {
  url: string;
  email: string;
  password: string;
} {
  if (!PB_URL || !PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
    throw new Error(
      "PocketBase not configured: set POCKETBASE_URL / POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD",
    );
  }
  return { url: PB_URL, email: PB_ADMIN_EMAIL, password: PB_ADMIN_PASSWORD };
}

async function authToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const { url, email, password } = requireConfig();
  const res = await fetch(`${url}/api/admins/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: email, password }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`PB auth failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { token: string };
  cachedToken = { token: data.token, expiresAt: Date.now() + 14 * 24 * 3600 * 1000 };
  return data.token;
}

interface PbOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

export async function pb<T = unknown>(path: string, opts: PbOptions = {}): Promise<T> {
  const { url } = requireConfig();
  const token = await authToken();
  const qs = opts.query
    ? "?" +
      Object.entries(opts.query)
        .filter(([, v]) => v !== undefined)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
        )
        .join("&")
    : "";
  const res = await fetch(`${url}${path}${qs}`, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(
      `PB ${opts.method || "GET"} ${path} failed: ${res.status} ${
        typeof body === "string" ? body : JSON.stringify(body)
      }`,
    );
  }
  return body as T;
}

// ---- Types ----

export interface Scout {
  id: string;
  email: string;
  handle: string;
  tier: "free" | "paid";
  rank: "curious" | "scout" | "sharp" | "elite" | "oracle";
  points: number;
  streak: number;
  correct_count: number;
  wrong_count: number;
  pending_count: number;
  founder_scout: boolean;
  last_prediction_at?: string;
  created: string;
  updated: string;
}

export interface Prediction {
  id: string;
  scout: string;
  github_org: string;
  prediction: "yes" | "no";
  confidence: number;
  rationale?: string;
  ip_address?: string;
  status: "pending" | "correct" | "wrong" | "expired";
  resolution_note?: string;
  resolution_source?: string;
  points_awarded?: number;
  resolves_at: string;
  resolved_at?: string;
  created: string;
  updated: string;
}

// ---- High-level helpers ----

interface PbList<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

function slugifyEmailToHandle(email: string): string {
  const local = email.split("@")[0].toLowerCase();
  const cleaned = local.replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "scout";
}

async function findScoutByEmail(email: string): Promise<Scout | null> {
  const filter = `email = ${JSON.stringify(email.toLowerCase())}`;
  const list = await pb<PbList<Scout>>("/api/collections/scouts/records", {
    query: { filter, perPage: 1 },
  });
  return list.items[0] || null;
}

async function pickAvailableHandle(base: string): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const list = await pb<PbList<Scout>>("/api/collections/scouts/records", {
      query: {
        filter: `handle = ${JSON.stringify(candidate)}`,
        perPage: 1,
      },
    });
    if (list.totalItems === 0) return candidate;
  }
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function getOrCreateScout(email: string): Promise<{
  scout: Scout;
  created: boolean;
}> {
  const existing = await findScoutByEmail(email);
  if (existing) return { scout: existing, created: false };

  const baseHandle = slugifyEmailToHandle(email);
  const handle = await pickAvailableHandle(baseHandle);

  const totalList = await pb<PbList<Scout>>(
    "/api/collections/scouts/records",
    { query: { perPage: 1 } },
  );
  const isFounder = totalList.totalItems < 100;

  const scout = await pb<Scout>("/api/collections/scouts/records", {
    method: "POST",
    body: {
      email: email.toLowerCase(),
      handle,
      tier: "free",
      rank: "curious",
      points: 0,
      streak: 0,
      correct_count: 0,
      wrong_count: 0,
      pending_count: 0,
      founder_scout: isFounder,
    },
  });
  return { scout, created: true };
}

export async function countPredictionsThisMonth(scoutId: string): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);
  const filter = `scout = "${scoutId}" && created >= "${startOfMonth}"`;
  const list = await pb<PbList<Prediction>>(
    "/api/collections/predictions/records",
    { query: { filter, perPage: 1 } },
  );
  return list.totalItems;
}

export async function createPrediction(input: {
  scoutId: string;
  githubOrg: string;
  prediction: "yes" | "no";
  confidence: number;
  rationale?: string;
  ipAddress?: string;
}): Promise<Prediction> {
  const now = Date.now();
  const resolvesAt = new Date(now + 182 * 24 * 3600 * 1000).toISOString();
  const prediction = await pb<Prediction>(
    "/api/collections/predictions/records",
    {
      method: "POST",
      body: {
        scout: input.scoutId,
        github_org: input.githubOrg,
        prediction: input.prediction,
        confidence: input.confidence,
        rationale: input.rationale || "",
        ip_address: input.ipAddress || "",
        status: "pending",
        resolves_at: resolvesAt,
      },
    },
  );

  await pb(
    `/api/collections/scouts/records/${input.scoutId}`,
    {
      method: "PATCH",
      body: {
        "pending_count+": 1,
        last_prediction_at: new Date().toISOString(),
      },
    },
  );

  return prediction;
}

export async function getScoutByHandle(handle: string): Promise<Scout | null> {
  try {
    return await pb<Scout>(
      `/api/collections/scouts/records`,
      {
        query: {
          filter: `handle = ${JSON.stringify(handle.toLowerCase())}`,
          perPage: 1,
        },
      },
    ).then((list: unknown) => {
      const l = list as PbList<Scout>;
      return l.items[0] || null;
    });
  } catch {
    return null;
  }
}

export async function listScoutPredictions(
  scoutId: string,
  perPage = 50,
): Promise<Prediction[]> {
  const list = await pb<PbList<Prediction>>(
    "/api/collections/predictions/records",
    {
      query: {
        filter: `scout = "${scoutId}"`,
        sort: "-created",
        perPage,
      },
    },
  );
  return list.items;
}

export async function listLeaderboard(limit = 100): Promise<Scout[]> {
  const list = await pb<PbList<Scout>>(
    "/api/collections/scouts/records",
    {
      query: {
        sort: "-points,-correct_count",
        perPage: limit,
      },
    },
  );
  return list.items;
}

export function monthlyLimitForTier(tier: "free" | "paid"): number {
  return tier === "paid" ? 10 : 3;
}

export function predictionPoints(confidence: number, outcome: "correct" | "wrong" | "expired"): number {
  if (outcome === "correct") return Math.floor(confidence / 10);
  if (outcome === "wrong") return -Math.floor(confidence / 20);
  return 0;
}
