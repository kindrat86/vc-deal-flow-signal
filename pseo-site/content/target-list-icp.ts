/**
 * Dream-100 ICP scoring (audit 2026-05-06, Russell Brunson Dream-100 rubric).
 *
 *   Match  (1-10)  How concentrated this voice's audience is with our ICP
 *                  (the developer-investor — engineer who reads commit logs
 *                  for fun, writes EUR 5k-50k angel checks on AI infra /
 *                  devtools / SaaS, between deal #5 and deal #40).
 *   Reach  (1-10)  Audience scale, log-ish: 1 = <1k, 5 = ~50k, 8 = 500k,
 *                  10 = >5M.
 *   Engage (1-10)  How realistic it is for us to be present inside this
 *                  voice's audience given (a) the anonymity rule (no founder
 *                  face/voice/name), (b) our agent-native footprint (MCP,
 *                  agent cards, awesome-* PRs), and (c) channel-level bans
 *                  or auto-mod limits we've documented in MEMORY.md.
 *
 *   Score  =  Match * 4  +  Reach * 3  +  Engage * 3   (max 100)
 *   Brunson rule: Match before Reach. Match weight is 4, Reach is 3.
 *
 * Tiers (matching the @/components Tier convention used elsewhere):
 *   T1 (>=85) — lean in this quarter (single Tuesday/Friday cycle)
 *   T2 (70-84) — sustaining cadence (monthly contact)
 *   T3 (<70)  — read-only / mental-model only
 *
 * Keys must match `name` exactly in @/content/target-list. Verified at runtime
 * by `assertCoverage()` (called from the page render path). Keep this file
 * in lockstep with @/content/target-list — when names change there, change them
 * here, or coverage will fail and the build will surface the gap.
 */

export interface IcpScoreInputs {
  match: number;
  reach: number;
  engage: number;
}

export type IcpTier = "T1" | "T2" | "T3";

export const ICP_SCORES: Record<string, IcpScoreInputs> = {
  // ---- substacks (10) ----
  "Lenny's Newsletter": { match: 7, reach: 10, engage: 8 },
  "The Pragmatic Engineer": { match: 10, reach: 9, engage: 8 },
  "Stratechery": { match: 8, reach: 9, engage: 7 },
  "Not Boring": { match: 8, reach: 8, engage: 7 },
  "Software Lead Weekly": { match: 10, reach: 7, engage: 8 },
  "Last Week in AWS": { match: 9, reach: 8, engage: 8 },
  "Construction Physics": { match: 5, reach: 7, engage: 5 },
  "The Generalist": { match: 7, reach: 7, engage: 6 },
  "Bits about Money": { match: 6, reach: 7, engage: 6 },
  "One Useful Thing — Ethan Mollick": { match: 9, reach: 8, engage: 7 },

  // ---- podcasts (10) — Engage caps low: anonymity rule blocks guesting ----
  "Acquired": { match: 7, reach: 10, engage: 4 },
  "Invest Like the Best": { match: 8, reach: 10, engage: 4 },
  "20VC": { match: 8, reach: 9, engage: 4 },
  "Founders": { match: 5, reach: 8, engage: 3 },
  "Lenny's Podcast": { match: 7, reach: 9, engage: 4 },
  "The Logan Bartlett Show": { match: 9, reach: 7, engage: 4 },
  "BG2 Pod": { match: 7, reach: 8, engage: 3 },
  "Stratechery Daily": { match: 8, reach: 9, engage: 4 },
  "Practical AI": { match: 9, reach: 7, engage: 5 },
  "The Rest is History": { match: 3, reach: 9, engage: 3 },

  // ---- newsletters (10) ----
  "TLDR Tech": { match: 9, reach: 10, engage: 7 },
  "ByteByteGo": { match: 9, reach: 9, engage: 7 },
  "Console.dev": { match: 10, reach: 7, engage: 8 },
  "Devtools.fyi": { match: 10, reach: 6, engage: 8 },
  "Hacker Newsletter": { match: 9, reach: 8, engage: 8 },
  "DBOS / This Week in PostgreSQL": { match: 8, reach: 6, engage: 7 },
  "Refind": { match: 6, reach: 6, engage: 5 },
  "Devops'ish": { match: 9, reach: 6, engage: 7 },
  "Frontend Focus": { match: 7, reach: 7, engage: 7 },
  "Mind the Product": { match: 6, reach: 7, engage: 6 },

  // ---- github-orgs (10) — Engage runs hot: agent-native footprint ----
  "vercel": { match: 10, reach: 10, engage: 9 },
  "supabase": { match: 10, reach: 9, engage: 9 },
  "huggingface": { match: 10, reach: 10, engage: 8 },
  "anthropic": { match: 10, reach: 10, engage: 9 },
  "openai": { match: 9, reach: 10, engage: 7 },
  "modelcontextprotocol": { match: 10, reach: 8, engage: 10 },
  "cloudflare": { match: 10, reach: 10, engage: 8 },
  "neondatabase": { match: 10, reach: 7, engage: 8 },
  "ollama": { match: 10, reach: 8, engage: 7 },
  "exo-explore": { match: 9, reach: 5, engage: 7 },

  // ---- conferences (10) — Engage caps: anonymity, no speaking ----
  "Strange Loop": { match: 9, reach: 5, engage: 3 },
  "Hot Chips": { match: 7, reach: 6, engage: 3 },
  "QCon": { match: 9, reach: 7, engage: 4 },
  "PyCon": { match: 9, reach: 8, engage: 4 },
  "OSCON / All Things Open": { match: 8, reach: 6, engage: 4 },
  "RustConf": { match: 8, reach: 6, engage: 4 },
  "DockerCon / KubeCon": { match: 9, reach: 8, engage: 4 },
  "AWS re:Invent": { match: 8, reach: 10, engage: 3 },
  "GitHub Universe": { match: 10, reach: 9, engage: 5 },
  "Y Combinator Demo Day": { match: 9, reach: 9, engage: 3 },

  // ---- books (10) — Engage caps: we cite, we don't co-author ----
  "Zero to One — Peter Thiel": { match: 9, reach: 10, engage: 2 },
  "The Innovator's Dilemma — Clayton Christensen": { match: 8, reach: 10, engage: 2 },
  "The Hard Thing About Hard Things — Ben Horowitz": { match: 8, reach: 9, engage: 2 },
  "Crossing the Chasm — Geoffrey Moore": { match: 9, reach: 9, engage: 2 },
  "Direct-response sales canon": { match: 6, reach: 9, engage: 3 },
  "Antifragile — Nassim Taleb": { match: 7, reach: 10, engage: 2 },
  "The Lean Startup — Eric Ries": { match: 8, reach: 10, engage: 2 },
  "Working in Public — Nadia Eghbal": { match: 10, reach: 7, engage: 3 },

  // ---- frameworks (10) — Engage maxes: we ship adapters ----
  "Claude Desktop / Claude Code": { match: 10, reach: 9, engage: 10 },
  "Cursor": { match: 10, reach: 9, engage: 9 },
  "OpenAI ChatGPT GPT": { match: 9, reach: 10, engage: 9 },
  "Mastra": { match: 10, reach: 6, engage: 10 },
  "LangChain / LangGraph": { match: 10, reach: 9, engage: 10 },
  "CrewAI": { match: 10, reach: 7, engage: 10 },
  "Letta (MemGPT)": { match: 9, reach: 5, engage: 10 },
  "Vercel AI SDK": { match: 10, reach: 9, engage: 10 },
  "MCP Registry": { match: 10, reach: 7, engage: 10 },
  "Smithery": { match: 10, reach: 6, engage: 10 },

  // ---- communities (10) ----
  "r/venturecapital": { match: 10, reach: 8, engage: 6 },
  "r/AngelInvesting": { match: 10, reach: 6, engage: 7 },
  "r/MachineLearning": { match: 8, reach: 9, engage: 6 },
  "r/ExperiencedDevs": { match: 9, reach: 8, engage: 6 },
  "Hacker News": { match: 9, reach: 10, engage: 4 },
  "Indie Hackers": { match: 6, reach: 7, engage: 7 },
  "dev.to": { match: 9, reach: 8, engage: 9 },
  "X / Tech Twitter": { match: 9, reach: 10, engage: 3 },
  "Bluesky / Mastodon / Farcaster": { match: 8, reach: 6, engage: 9 },
  "Substack Notes": { match: 7, reach: 7, engage: 8 },

  // ---- linkedin-pages (10) — Engage = page-only commenting (4/wk ceiling) ----
  "Carta": { match: 9, reach: 9, engage: 8 },
  "Y Combinator": { match: 9, reach: 10, engage: 7 },
  "Crunchbase": { match: 9, reach: 9, engage: 8 },
  "AngelList": { match: 10, reach: 9, engage: 8 },
  "Andreessen Horowitz (a16z)": { match: 9, reach: 10, engage: 7 },
  "Sequoia Capital": { match: 8, reach: 10, engage: 6 },
  "Index Ventures": { match: 9, reach: 8, engage: 8 },
  "Insight Partners": { match: 10, reach: 8, engage: 9 },
  "Bessemer Venture Partners": { match: 9, reach: 8, engage: 7 },
  "First Round Capital": { match: 9, reach: 8, engage: 7 },

  // ---- datasets (10) ----
  "GitHub REST + GraphQL": { match: 10, reach: 10, engage: 5 },
  "GH Archive": { match: 10, reach: 6, engage: 5 },
  "Crunchbase open data": { match: 8, reach: 8, engage: 5 },
  "PitchBook (selected free)": { match: 7, reach: 7, engage: 4 },
  "Common Crawl": { match: 7, reach: 7, engage: 4 },
  "Stack Overflow Trends": { match: 8, reach: 9, engage: 5 },
  "Hacker News Algolia": { match: 9, reach: 8, engage: 5 },
  "PyPI / npm download stats": { match: 9, reach: 9, engage: 5 },
  "Zenodo": { match: 7, reach: 6, engage: 10 },
  "Our SSRN paper (n=219)": { match: 10, reach: 6, engage: 10 },
};

export function score(s: IcpScoreInputs): number {
  return s.match * 4 + s.reach * 3 + s.engage * 3;
}

export function tier(s: number): IcpTier {
  if (s >= 85) return "T1";
  if (s >= 70) return "T2";
  return "T3";
}

export const TIER_LABEL: Record<IcpTier, string> = {
  T1: "Tier 1",
  T2: "Tier 2",
  T3: "Tier 3",
};

export const TIER_RING_CLASS: Record<IcpTier, string> = {
  T1: "ring-1 ring-amber-500/40",
  T2: "ring-1 ring-sky-700/30",
  T3: "ring-1 ring-slate-700/40",
};

export const TIER_CHIP_CLASS: Record<IcpTier, string> = {
  T1: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  T2: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  T3: "bg-slate-700/40 text-slate-300 border-slate-600/50",
};

/**
 * Archetype affinity overlay (audit 2026-05-09 — Brunson Traffic Secrets Ch 1
 * split). For each Dream-100 voice, which of the three reader-archetypes
 * (Solo Angel / Fund GP / Family Office) skews toward consuming this voice.
 * Used by distribution playbooks to target by archetype, not just by score.
 *
 * Values are 0–10; higher = stronger affinity. A voice can score high for
 * multiple archetypes (e.g. Pragmatic Engineer is read by Solo Angels AND
 * Fund GPs). The total can exceed 10 — these are independent affinity
 * dimensions, not a budget.
 *
 * Internal use only (no customer-facing surface reads from this map yet).
 * Source workbook: brunson/08-dream-customer.md §8.7.
 */
export type ArchetypeAffinity = {
  soloAngel: number;
  fundGp: number;
  familyOffice: number;
};

export const ARCHETYPE_AFFINITY: Record<string, ArchetypeAffinity> = {
  // ---- substacks ----
  "Lenny's Newsletter": { soloAngel: 7, fundGp: 6, familyOffice: 3 },
  "The Pragmatic Engineer": { soloAngel: 9, fundGp: 7, familyOffice: 4 },
  "Stratechery": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Not Boring": { soloAngel: 7, fundGp: 8, familyOffice: 6 },
  "Software Lead Weekly": { soloAngel: 9, fundGp: 6, familyOffice: 3 },
  "Last Week in AWS": { soloAngel: 8, fundGp: 5, familyOffice: 3 },
  "Construction Physics": { soloAngel: 4, fundGp: 5, familyOffice: 6 },
  "The Generalist": { soloAngel: 5, fundGp: 7, familyOffice: 7 },
  "Bits about Money": { soloAngel: 4, fundGp: 6, familyOffice: 8 },
  "One Useful Thing — Ethan Mollick": { soloAngel: 8, fundGp: 6, familyOffice: 5 },
  // ---- podcasts ----
  "Acquired": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Invest Like the Best": { soloAngel: 6, fundGp: 9, familyOffice: 9 },
  "20VC": { soloAngel: 7, fundGp: 9, familyOffice: 7 },
  "Founders": { soloAngel: 5, fundGp: 6, familyOffice: 6 },
  "Lenny's Podcast": { soloAngel: 7, fundGp: 6, familyOffice: 3 },
  "The Logan Bartlett Show": { soloAngel: 8, fundGp: 8, familyOffice: 4 },
  "BG2 Pod": { soloAngel: 6, fundGp: 8, familyOffice: 5 },
  "Stratechery Daily": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Practical AI": { soloAngel: 9, fundGp: 6, familyOffice: 4 },
  "The Rest is History": { soloAngel: 3, fundGp: 4, familyOffice: 4 },
  // ---- newsletters ----
  "TLDR Tech": { soloAngel: 9, fundGp: 6, familyOffice: 4 },
  "ByteByteGo": { soloAngel: 9, fundGp: 5, familyOffice: 3 },
  "Console.dev": { soloAngel: 10, fundGp: 5, familyOffice: 2 },
  "Devtools.fyi": { soloAngel: 10, fundGp: 5, familyOffice: 2 },
  "Hacker Newsletter": { soloAngel: 9, fundGp: 6, familyOffice: 3 },
  "DBOS / This Week in PostgreSQL": { soloAngel: 8, fundGp: 5, familyOffice: 3 },
  "Refind": { soloAngel: 6, fundGp: 5, familyOffice: 4 },
  "Devops'ish": { soloAngel: 9, fundGp: 5, familyOffice: 3 },
  "Frontend Focus": { soloAngel: 7, fundGp: 4, familyOffice: 2 },
  "Mind the Product": { soloAngel: 5, fundGp: 6, familyOffice: 4 },
  // ---- github-orgs ----
  "vercel": { soloAngel: 10, fundGp: 7, familyOffice: 4 },
  "supabase": { soloAngel: 10, fundGp: 7, familyOffice: 4 },
  "huggingface": { soloAngel: 9, fundGp: 8, familyOffice: 6 },
  "anthropic": { soloAngel: 9, fundGp: 8, familyOffice: 7 },
  "openai": { soloAngel: 8, fundGp: 9, familyOffice: 8 },
  "modelcontextprotocol": { soloAngel: 10, fundGp: 6, familyOffice: 4 },
  "cloudflare": { soloAngel: 9, fundGp: 7, familyOffice: 6 },
  "neondatabase": { soloAngel: 10, fundGp: 6, familyOffice: 3 },
  "ollama": { soloAngel: 10, fundGp: 5, familyOffice: 3 },
  "exo-explore": { soloAngel: 9, fundGp: 5, familyOffice: 3 },
  // ---- conferences ----
  "Strange Loop": { soloAngel: 9, fundGp: 4, familyOffice: 2 },
  "Hot Chips": { soloAngel: 7, fundGp: 5, familyOffice: 4 },
  "QCon": { soloAngel: 9, fundGp: 5, familyOffice: 4 },
  "PyCon": { soloAngel: 9, fundGp: 4, familyOffice: 3 },
  "OSCON / All Things Open": { soloAngel: 8, fundGp: 4, familyOffice: 3 },
  "RustConf": { soloAngel: 8, fundGp: 4, familyOffice: 2 },
  "DockerCon / KubeCon": { soloAngel: 9, fundGp: 5, familyOffice: 3 },
  "AWS re:Invent": { soloAngel: 7, fundGp: 6, familyOffice: 5 },
  "GitHub Universe": { soloAngel: 9, fundGp: 6, familyOffice: 4 },
  "Y Combinator Demo Day": { soloAngel: 8, fundGp: 9, familyOffice: 6 },
  // ---- books ----
  "Zero to One — Peter Thiel": { soloAngel: 8, fundGp: 9, familyOffice: 8 },
  "The Innovator's Dilemma — Clayton Christensen": { soloAngel: 6, fundGp: 8, familyOffice: 9 },
  "The Hard Thing About Hard Things — Ben Horowitz": { soloAngel: 7, fundGp: 9, familyOffice: 7 },
  "Crossing the Chasm — Geoffrey Moore": { soloAngel: 7, fundGp: 8, familyOffice: 8 },
  "Direct-response sales canon": { soloAngel: 5, fundGp: 6, familyOffice: 5 },
  "Antifragile — Nassim Taleb": { soloAngel: 6, fundGp: 7, familyOffice: 9 },
  "The Lean Startup — Eric Ries": { soloAngel: 8, fundGp: 7, familyOffice: 5 },
  "Working in Public — Nadia Eghbal": { soloAngel: 9, fundGp: 6, familyOffice: 5 },
  // ---- frameworks ----
  "Claude Desktop / Claude Code": { soloAngel: 10, fundGp: 6, familyOffice: 4 },
  "Cursor": { soloAngel: 10, fundGp: 6, familyOffice: 3 },
  "OpenAI ChatGPT GPT": { soloAngel: 9, fundGp: 6, familyOffice: 5 },
  "Mastra": { soloAngel: 10, fundGp: 5, familyOffice: 3 },
  "LangChain / LangGraph": { soloAngel: 10, fundGp: 6, familyOffice: 4 },
  "CrewAI": { soloAngel: 10, fundGp: 5, familyOffice: 3 },
  "Letta (MemGPT)": { soloAngel: 9, fundGp: 5, familyOffice: 3 },
  "Vercel AI SDK": { soloAngel: 10, fundGp: 6, familyOffice: 3 },
  "MCP Registry": { soloAngel: 10, fundGp: 5, familyOffice: 3 },
  "Smithery": { soloAngel: 10, fundGp: 5, familyOffice: 3 },
  // ---- communities ----
  "r/venturecapital": { soloAngel: 8, fundGp: 9, familyOffice: 7 },
  "r/AngelInvesting": { soloAngel: 10, fundGp: 7, familyOffice: 5 },
  "r/MachineLearning": { soloAngel: 9, fundGp: 6, familyOffice: 5 },
  "r/ExperiencedDevs": { soloAngel: 10, fundGp: 5, familyOffice: 3 },
  "Hacker News": { soloAngel: 10, fundGp: 7, familyOffice: 5 },
  "Indie Hackers": { soloAngel: 9, fundGp: 4, familyOffice: 2 },
  "dev.to": { soloAngel: 10, fundGp: 5, familyOffice: 3 },
  "X / Tech Twitter": { soloAngel: 9, fundGp: 7, familyOffice: 5 },
  "Bluesky / Mastodon / Farcaster": { soloAngel: 9, fundGp: 5, familyOffice: 3 },
  "Substack Notes": { soloAngel: 7, fundGp: 6, familyOffice: 4 },
  // ---- linkedin-pages ----
  "Carta": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Y Combinator": { soloAngel: 7, fundGp: 9, familyOffice: 7 },
  "Crunchbase": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "AngelList": { soloAngel: 9, fundGp: 8, familyOffice: 6 },
  "Andreessen Horowitz (a16z)": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Sequoia Capital": { soloAngel: 5, fundGp: 9, familyOffice: 9 },
  "Index Ventures": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Insight Partners": { soloAngel: 5, fundGp: 9, familyOffice: 9 },
  "Bessemer Venture Partners": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "First Round Capital": { soloAngel: 7, fundGp: 9, familyOffice: 7 },
  // ---- datasets ----
  "GitHub REST + GraphQL": { soloAngel: 10, fundGp: 7, familyOffice: 6 },
  "GH Archive": { soloAngel: 9, fundGp: 7, familyOffice: 6 },
  "Crunchbase open data": { soloAngel: 7, fundGp: 8, familyOffice: 8 },
  "PitchBook (selected free)": { soloAngel: 5, fundGp: 8, familyOffice: 9 },
  "Common Crawl": { soloAngel: 8, fundGp: 6, familyOffice: 6 },
  "Stack Overflow Trends": { soloAngel: 9, fundGp: 5, familyOffice: 4 },
  "Hacker News Algolia": { soloAngel: 9, fundGp: 6, familyOffice: 4 },
  "PyPI / npm download stats": { soloAngel: 10, fundGp: 6, familyOffice: 5 },
  "Zenodo": { soloAngel: 6, fundGp: 6, familyOffice: 9 },
  "Our SSRN paper (n=219)": { soloAngel: 7, fundGp: 8, familyOffice: 10 },
};

export type DominantArchetype = "soloAngel" | "fundGp" | "familyOffice";

/**
 * Returns the archetype with the highest affinity for a given Dream-100 voice.
 * Falls back to "soloAngel" if the voice is missing from the affinity map
 * (avoids hard-failing distribution playbooks during data drift).
 */
export function dominantArchetype(name: string): DominantArchetype {
  const aff = ARCHETYPE_AFFINITY[name];
  if (!aff) return "soloAngel";
  const max = Math.max(aff.soloAngel, aff.fundGp, aff.familyOffice);
  if (aff.familyOffice === max) return "familyOffice";
  if (aff.fundGp === max) return "fundGp";
  return "soloAngel";
}

/**
 * Throws a build-time error if any name in DREAM_100_GROUPS is missing
 * a score, or if ICP_SCORES has an orphan key. Called from the page render
 * path so misalignment surfaces during `next build`.
 */
export function assertCoverage(names: string[]): void {
  const missing = names.filter((n) => !(n in ICP_SCORES));
  const expected = new Set(names);
  const orphans = Object.keys(ICP_SCORES).filter((k) => !expected.has(k));
  if (missing.length > 0 || orphans.length > 0) {
    throw new Error(
      `[dream-100-icp] coverage drift detected:\n` +
        (missing.length ? `  missing scores: ${missing.join(", ")}\n` : "") +
        (orphans.length ? `  orphan scores:  ${orphans.join(", ")}\n` : "") +
        `  Sync ICP_SCORES with @/content/target-list names.`
    );
  }
}
