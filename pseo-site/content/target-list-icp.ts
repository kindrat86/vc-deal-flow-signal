/**
 * Dream-100 ICP scoring (audit 2026-05-06, Russell Brunson Dream-100 rubric).
 *
 *   Match  (1-10)  How concentrated this voice's audience is with our ICP
 *                  (Marcus, a corp-dev / PE-operating-partner / non-engineer
 *                  tech-VP buyer who does NOT read code, also reads as a solo
 *                  angel / scout / seed buyer, and needs engineering signal
 *                  translated into business language: who's accelerating,
 *                  stalling, or worth a meeting).
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
 *   T1 (>=85), lean in this quarter (single Tuesday/Friday cycle)
 *   T2 (70-84), sustaining cadence (monthly contact)
 *   T3 (<70) , read-only / mental-model only
 *
 * Keys must match `name` exactly in @/content/target-list. Verified at runtime
 * by `assertCoverage()` (called from the page render path). Keep this file
 * in lockstep with @/content/target-list, when names change there, change them
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
  "Stratechery": { match: 10, reach: 9, engage: 7 },
  "Not Boring": { match: 9, reach: 8, engage: 7 },
  "The Diff": { match: 9, reach: 7, engage: 6 },
  "The Generalist": { match: 8, reach: 7, engage: 6 },
  "Growth Unhinged": { match: 10, reach: 7, engage: 7 },
  "Clouded Judgement": { match: 10, reach: 7, engage: 7 },
  "Bits about Money": { match: 7, reach: 7, engage: 6 },
  "Net Interest": { match: 8, reach: 6, engage: 6 },
  "Every": { match: 7, reach: 7, engage: 6 },
  "Platformer": { match: 6, reach: 7, engage: 6 },

  // ---- podcasts (10), Engage caps low: anonymity rule blocks guesting ----
  "Acquired": { match: 8, reach: 10, engage: 4 },
  "Invest Like the Best": { match: 9, reach: 10, engage: 4 },
  "Business Breakdowns": { match: 8, reach: 8, engage: 4 },
  "20VC": { match: 8, reach: 9, engage: 4 },
  "The Logan Bartlett Show": { match: 9, reach: 7, engage: 5 },
  "BG2 Pod": { match: 8, reach: 8, engage: 3 },
  "All-In": { match: 7, reach: 10, engage: 3 },
  "Capital Allocators": { match: 8, reach: 7, engage: 4 },
  "Lenny's Podcast": { match: 7, reach: 9, engage: 5 },
  "The Twenty Minute VC": { match: 8, reach: 9, engage: 4 },

  // ---- newsletters (10) ----
  "Axios Pro Rata": { match: 10, reach: 8, engage: 5 },
  "Newcomer": { match: 9, reach: 7, engage: 5 },
  "StrictlyVC": { match: 9, reach: 8, engage: 5 },
  "Fortune Term Sheet": { match: 9, reach: 8, engage: 4 },
  "The Information": { match: 9, reach: 9, engage: 4 },
  "Puck": { match: 8, reach: 7, engage: 4 },
  "Exit Five": { match: 7, reach: 7, engage: 6 },
  "CB Insights newsletter": { match: 10, reach: 8, engage: 6 },
  "Crunchbase Daily": { match: 8, reach: 9, engage: 5 },
  "PitchBook News": { match: 9, reach: 8, engage: 5 },

  // ---- market-map & research desks (10), Engage hot on data desks ----
  "CB Insights": { match: 10, reach: 9, engage: 7 },
  "PitchBook": { match: 10, reach: 9, engage: 7 },
  "Sacra": { match: 10, reach: 6, engage: 8 },
  "Public Comps": { match: 9, reach: 6, engage: 7 },
  "Meritech": { match: 9, reach: 6, engage: 6 },
  "Dealroom": { match: 8, reach: 7, engage: 6 },
  "Contrary Research": { match: 9, reach: 6, engage: 7 },
  "Gartner": { match: 8, reach: 9, engage: 4 },
  "Forrester": { match: 7, reach: 8, engage: 4 },
  "Tracxn": { match: 8, reach: 6, engage: 6 },

  // ---- conferences (10), Engage caps: anonymity, no speaking ----
  "SaaStr Annual": { match: 9, reach: 9, engage: 4 },
  "Slush": { match: 8, reach: 8, engage: 4 },
  "Web Summit": { match: 7, reach: 9, engage: 3 },
  "Money20/20": { match: 8, reach: 8, engage: 4 },
  "Upfront Summit": { match: 9, reach: 6, engage: 4 },
  "ACG (Association for Corporate Growth)": { match: 10, reach: 6, engage: 4 },
  "Bessemer Cloud events": { match: 9, reach: 6, engage: 4 },
  "Gartner Symposium": { match: 8, reach: 8, engage: 3 },
  "Forrester events": { match: 7, reach: 7, engage: 3 },
  "NACD": { match: 7, reach: 6, engage: 3 },

  // ---- books (10), Engage caps: we cite, we don't co-author ----
  "The Outsiders, William Thorndike": { match: 9, reach: 8, engage: 2 },
  "7 Powers, Hamilton Helmer": { match: 9, reach: 7, engage: 2 },
  "Competition Demystified, Bruce Greenwald": { match: 8, reach: 7, engage: 2 },
  "Expectations Investing, Michael Mauboussin": { match: 9, reach: 6, engage: 2 },
  "Zero to One, Peter Thiel": { match: 8, reach: 10, engage: 2 },
  "The Cold Start Problem, Andrew Chen": { match: 7, reach: 8, engage: 2 },
  "Working Backwards, Colin Bryar & Bill Carr": { match: 8, reach: 8, engage: 2 },
  "High Growth Handbook, Elad Gil": { match: 8, reach: 8, engage: 2 },
  "Venture Deals, Brad Feld & Jason Mendelson": { match: 9, reach: 8, engage: 2 },
  "Super Founders, Ali Tamaseb": { match: 9, reach: 7, engage: 3 },

  // ---- PE / M&A / holdco operators (10), Engage caps: we read, not co-invest ----
  "Tiny (Andrew Wilkinson)": { match: 9, reach: 7, engage: 4 },
  "FJ Labs (Fabrice Grinda)": { match: 8, reach: 6, engage: 4 },
  "Altimeter (Brad Gerstner)": { match: 8, reach: 7, engage: 3 },
  "Colossus (Patrick O'Shaughnessy)": { match: 8, reach: 7, engage: 4 },
  "8VC (Joe Lonsdale)": { match: 8, reach: 6, engage: 3 },
  "The Sweaty Startup (Nick Huber)": { match: 7, reach: 8, engage: 4 },
  "Constellation Software": { match: 9, reach: 6, engage: 2 },
  "Thoma Bravo": { match: 9, reach: 7, engage: 2 },
  "Vista Equity Partners": { match: 9, reach: 7, engage: 2 },
  "Permira": { match: 8, reach: 6, engage: 2 },

  // ---- communities (10) ----
  "SaaStr community": { match: 9, reach: 8, engage: 6 },
  "Pavilion": { match: 9, reach: 6, engage: 6 },
  "Chief": { match: 7, reach: 6, engage: 5 },
  "On Deck": { match: 8, reach: 6, engage: 6 },
  "Reforge": { match: 7, reach: 7, engage: 5 },
  "r/PrivateEquity": { match: 9, reach: 7, engage: 4 },
  "Exit Five community": { match: 7, reach: 6, engage: 6 },
  "ACG chapters": { match: 10, reach: 5, engage: 5 },
  "GP / LP Slack groups": { match: 9, reach: 4, engage: 4 },
  "Carta Equity community": { match: 7, reach: 6, engage: 5 },

  // ---- linkedin-pages (10), Engage = page-only commenting (4/wk ceiling) ----
  "Insight Partners": { match: 7, reach: 8, engage: 4 },
  "Index Ventures": { match: 6, reach: 7, engage: 4 },
  "Carta": { match: 9, reach: 9, engage: 6 },
  "First Round Capital": { match: 7, reach: 7, engage: 3 },
  "Bessemer Venture Partners": { match: 8, reach: 8, engage: 5 },
  "Andreessen Horowitz (a16z)": { match: 8, reach: 10, engage: 5 },
  "Battery Ventures": { match: 8, reach: 7, engage: 5 },
  "ICONIQ Growth": { match: 9, reach: 7, engage: 6 },
  "SaaStr": { match: 9, reach: 9, engage: 6 },
  "Crunchbase": { match: 8, reach: 9, engage: 6 },

  // ---- datasets (10) ----
  "Crunchbase data": { match: 9, reach: 8, engage: 5 },
  "PitchBook data": { match: 9, reach: 8, engage: 4 },
  "SEC EDGAR": { match: 8, reach: 8, engage: 5 },
  "Carta benchmarks": { match: 9, reach: 7, engage: 5 },
  "Bessemer State of the Cloud": { match: 9, reach: 7, engage: 5 },
  "Meritech comps": { match: 9, reach: 6, engage: 5 },
  "Public Comps dataset": { match: 9, reach: 6, engage: 5 },
  "Dealroom data": { match: 8, reach: 6, engage: 5 },
  "CB Insights data": { match: 9, reach: 7, engage: 5 },
  "Our VC Deal Flow Signal dataset": { match: 10, reach: 6, engage: 10 },
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
 * Archetype affinity overlay (audit 2026-05-09, Brunson Traffic Secrets Ch 1
 * split). For each Dream-100 voice, which of the three reader-archetypes
 * (Solo Angel / Fund GP / Family Office) skews toward consuming this voice.
 * Used by distribution playbooks to target by archetype, not just by score.
 *
 * Values are 0-10; higher = stronger affinity. A voice can score high for
 * multiple archetypes (e.g. Stratechery is read by Fund GPs AND Family
 * Offices). The total can exceed 10, these are independent affinity
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
  "Stratechery": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Not Boring": { soloAngel: 7, fundGp: 8, familyOffice: 6 },
  "The Diff": { soloAngel: 5, fundGp: 8, familyOffice: 8 },
  "The Generalist": { soloAngel: 6, fundGp: 8, familyOffice: 7 },
  "Growth Unhinged": { soloAngel: 7, fundGp: 7, familyOffice: 4 },
  "Clouded Judgement": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Bits about Money": { soloAngel: 4, fundGp: 6, familyOffice: 8 },
  "Net Interest": { soloAngel: 3, fundGp: 6, familyOffice: 9 },
  "Every": { soloAngel: 7, fundGp: 6, familyOffice: 5 },
  "Platformer": { soloAngel: 5, fundGp: 6, familyOffice: 5 },
  // ---- podcasts ----
  "Acquired": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Invest Like the Best": { soloAngel: 6, fundGp: 9, familyOffice: 9 },
  "Business Breakdowns": { soloAngel: 5, fundGp: 8, familyOffice: 8 },
  "20VC": { soloAngel: 7, fundGp: 9, familyOffice: 7 },
  "The Logan Bartlett Show": { soloAngel: 8, fundGp: 8, familyOffice: 4 },
  "BG2 Pod": { soloAngel: 6, fundGp: 8, familyOffice: 5 },
  "All-In": { soloAngel: 7, fundGp: 8, familyOffice: 7 },
  "Capital Allocators": { soloAngel: 4, fundGp: 8, familyOffice: 10 },
  "Lenny's Podcast": { soloAngel: 7, fundGp: 6, familyOffice: 3 },
  "The Twenty Minute VC": { soloAngel: 7, fundGp: 9, familyOffice: 6 },
  // ---- newsletters ----
  "Axios Pro Rata": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Newcomer": { soloAngel: 6, fundGp: 9, familyOffice: 7 },
  "StrictlyVC": { soloAngel: 7, fundGp: 9, familyOffice: 6 },
  "Fortune Term Sheet": { soloAngel: 5, fundGp: 8, familyOffice: 8 },
  "The Information": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Puck": { soloAngel: 5, fundGp: 7, familyOffice: 8 },
  "Exit Five": { soloAngel: 6, fundGp: 5, familyOffice: 3 },
  "CB Insights newsletter": { soloAngel: 6, fundGp: 8, familyOffice: 8 },
  "Crunchbase Daily": { soloAngel: 7, fundGp: 8, familyOffice: 6 },
  "PitchBook News": { soloAngel: 5, fundGp: 9, familyOffice: 9 },
  // ---- market-map & research desks ----
  "CB Insights": { soloAngel: 5, fundGp: 9, familyOffice: 8 },
  "PitchBook": { soloAngel: 5, fundGp: 9, familyOffice: 9 },
  "Sacra": { soloAngel: 6, fundGp: 8, familyOffice: 7 },
  "Public Comps": { soloAngel: 5, fundGp: 8, familyOffice: 8 },
  "Meritech": { soloAngel: 4, fundGp: 8, familyOffice: 9 },
  "Dealroom": { soloAngel: 6, fundGp: 8, familyOffice: 7 },
  "Contrary Research": { soloAngel: 6, fundGp: 7, familyOffice: 6 },
  "Gartner": { soloAngel: 4, fundGp: 7, familyOffice: 8 },
  "Forrester": { soloAngel: 3, fundGp: 6, familyOffice: 8 },
  "Tracxn": { soloAngel: 6, fundGp: 8, familyOffice: 6 },
  // ---- conferences ----
  "SaaStr Annual": { soloAngel: 7, fundGp: 7, familyOffice: 4 },
  "Slush": { soloAngel: 7, fundGp: 8, familyOffice: 5 },
  "Web Summit": { soloAngel: 6, fundGp: 7, familyOffice: 5 },
  "Money20/20": { soloAngel: 5, fundGp: 8, familyOffice: 7 },
  "Upfront Summit": { soloAngel: 6, fundGp: 9, familyOffice: 7 },
  "ACG (Association for Corporate Growth)": { soloAngel: 4, fundGp: 8, familyOffice: 9 },
  "Bessemer Cloud events": { soloAngel: 5, fundGp: 8, familyOffice: 7 },
  "Gartner Symposium": { soloAngel: 3, fundGp: 6, familyOffice: 8 },
  "Forrester events": { soloAngel: 3, fundGp: 6, familyOffice: 8 },
  "NACD": { soloAngel: 3, fundGp: 6, familyOffice: 9 },
  // ---- books ----
  "The Outsiders, William Thorndike": { soloAngel: 6, fundGp: 8, familyOffice: 10 },
  "7 Powers, Hamilton Helmer": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Competition Demystified, Bruce Greenwald": { soloAngel: 5, fundGp: 8, familyOffice: 9 },
  "Expectations Investing, Michael Mauboussin": { soloAngel: 4, fundGp: 8, familyOffice: 9 },
  "Zero to One, Peter Thiel": { soloAngel: 8, fundGp: 9, familyOffice: 8 },
  "The Cold Start Problem, Andrew Chen": { soloAngel: 8, fundGp: 8, familyOffice: 5 },
  "Working Backwards, Colin Bryar & Bill Carr": { soloAngel: 6, fundGp: 7, familyOffice: 7 },
  "High Growth Handbook, Elad Gil": { soloAngel: 7, fundGp: 9, familyOffice: 7 },
  "Venture Deals, Brad Feld & Jason Mendelson": { soloAngel: 9, fundGp: 8, familyOffice: 6 },
  "Super Founders, Ali Tamaseb": { soloAngel: 8, fundGp: 8, familyOffice: 6 },
  // ---- PE / M&A / holdco operators ----
  "Tiny (Andrew Wilkinson)": { soloAngel: 7, fundGp: 7, familyOffice: 8 },
  "FJ Labs (Fabrice Grinda)": { soloAngel: 7, fundGp: 8, familyOffice: 7 },
  "Altimeter (Brad Gerstner)": { soloAngel: 5, fundGp: 9, familyOffice: 8 },
  "Colossus (Patrick O'Shaughnessy)": { soloAngel: 5, fundGp: 8, familyOffice: 9 },
  "8VC (Joe Lonsdale)": { soloAngel: 5, fundGp: 9, familyOffice: 7 },
  "The Sweaty Startup (Nick Huber)": { soloAngel: 8, fundGp: 4, familyOffice: 6 },
  "Constellation Software": { soloAngel: 4, fundGp: 8, familyOffice: 10 },
  "Thoma Bravo": { soloAngel: 3, fundGp: 9, familyOffice: 9 },
  "Vista Equity Partners": { soloAngel: 3, fundGp: 9, familyOffice: 9 },
  "Permira": { soloAngel: 3, fundGp: 9, familyOffice: 9 },
  // ---- communities ----
  "SaaStr community": { soloAngel: 7, fundGp: 7, familyOffice: 4 },
  "Pavilion": { soloAngel: 6, fundGp: 6, familyOffice: 4 },
  "Chief": { soloAngel: 5, fundGp: 6, familyOffice: 6 },
  "On Deck": { soloAngel: 8, fundGp: 7, familyOffice: 5 },
  "Reforge": { soloAngel: 7, fundGp: 6, familyOffice: 4 },
  "r/PrivateEquity": { soloAngel: 5, fundGp: 8, familyOffice: 8 },
  "Exit Five community": { soloAngel: 6, fundGp: 5, familyOffice: 3 },
  "ACG chapters": { soloAngel: 4, fundGp: 8, familyOffice: 9 },
  "GP / LP Slack groups": { soloAngel: 5, fundGp: 9, familyOffice: 9 },
  "Carta Equity community": { soloAngel: 7, fundGp: 8, familyOffice: 6 },
  // ---- linkedin-pages ----
  "Insight Partners": { soloAngel: 4, fundGp: 9, familyOffice: 8 },
  "Index Ventures": { soloAngel: 5, fundGp: 9, familyOffice: 7 },
  "Carta": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "First Round Capital": { soloAngel: 6, fundGp: 9, familyOffice: 6 },
  "Bessemer Venture Partners": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Andreessen Horowitz (a16z)": { soloAngel: 6, fundGp: 9, familyOffice: 8 },
  "Battery Ventures": { soloAngel: 5, fundGp: 9, familyOffice: 8 },
  "ICONIQ Growth": { soloAngel: 4, fundGp: 9, familyOffice: 9 },
  "SaaStr": { soloAngel: 7, fundGp: 7, familyOffice: 4 },
  "Crunchbase": { soloAngel: 7, fundGp: 8, familyOffice: 6 },
  // ---- datasets ----
  "Crunchbase data": { soloAngel: 7, fundGp: 8, familyOffice: 7 },
  "PitchBook data": { soloAngel: 5, fundGp: 9, familyOffice: 9 },
  "SEC EDGAR": { soloAngel: 4, fundGp: 7, familyOffice: 9 },
  "Carta benchmarks": { soloAngel: 7, fundGp: 8, familyOffice: 7 },
  "Bessemer State of the Cloud": { soloAngel: 6, fundGp: 8, familyOffice: 7 },
  "Meritech comps": { soloAngel: 4, fundGp: 8, familyOffice: 9 },
  "Public Comps dataset": { soloAngel: 5, fundGp: 8, familyOffice: 8 },
  "Dealroom data": { soloAngel: 6, fundGp: 8, familyOffice: 7 },
  "CB Insights data": { soloAngel: 5, fundGp: 9, familyOffice: 8 },
  "Our VC Deal Flow Signal dataset": { soloAngel: 7, fundGp: 8, familyOffice: 10 },
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
