/**
 * Pure scoring function for the Receipts feature.
 *
 * Given a user's starred repos (with timestamps) and the validated-wins
 * database, computes a 0-100 Scout Score and ranks the user's top "calls" —
 * unicorns / big-fundings / acquisitions they starred *before* the event.
 *
 * Deterministic. No I/O. Easy to unit-test or swap.
 */

import "server-only";
import validatedWinsData from "./validated-wins.json";
import type { StarredRepo } from "./github-stars";

export interface ValidatedWin {
  org: string;
  repo: string;
  name: string;
  event: string;
  event_date: string; // ISO
  weight: number;     // 25-100
}

const WINS: ValidatedWin[] = validatedWinsData as ValidatedWin[];

// Index by lowercased full_name for O(1) lookup
const WINS_BY_FULLNAME = new Map<string, ValidatedWin>();
for (const w of WINS) {
  WINS_BY_FULLNAME.set(w.repo.toLowerCase(), w);
}

export interface ScoredWin {
  org: string;
  repo: string;          // the specific starred repo we matched
  name: string;          // display name
  event: string;
  event_date: string;
  starred_at: string;
  months_early: number;  // can be negative if user starred AFTER the event
  weight: number;
  points: number;        // contribution to the total
}

export interface ScoutScoreResult {
  score: number;          // 0-100
  rank: "curious" | "scout" | "sharp" | "elite" | "oracle";
  total_stars: number;    // count of starred repos analyzed
  matched_count: number;  // number of validated wins user starred (any time)
  early_count: number;    // number of wins user starred *before* the event
  top_wins: ScoredWin[];  // up to 8 wins, ranked by points desc
}

const MONTHS_PER_DAY = 1 / 30.4375;

function monthsBetween(earlierIso: string, laterIso: string): number {
  const earlier = Date.parse(earlierIso);
  const later = Date.parse(laterIso);
  if (!Number.isFinite(earlier) || !Number.isFinite(later)) return 0;
  return ((later - earlier) / 86_400_000) * MONTHS_PER_DAY;
}

function rankFor(score: number): ScoutScoreResult["rank"] {
  if (score >= 80) return "oracle";
  if (score >= 60) return "elite";
  if (score >= 40) return "sharp";
  if (score >= 20) return "scout";
  return "curious";
}

/**
 * Score a user's starring history against the validated wins.
 *
 * Algorithm:
 *   1. For each starred repo, check if it appears in validated-wins.
 *   2. If yes, compute months between star_date and event_date.
 *      - If star_date < event_date  → "early call", points awarded.
 *      - If star_date >= event_date → "late star", 0 points (still counted as matched).
 *   3. Dedupe by org — keep the earliest star per org (one win per company).
 *   4. Points = weight × min(months_early / 24, 1.0). Cap at weight.
 *   5. Total = sum of top 5 wins by points, normalized so 5 perfect wins = 100.
 */
export function computeScoutScore(stars: StarredRepo[]): ScoutScoreResult {
  const winsByOrg = new Map<string, ScoredWin>();
  let matched = 0;
  let early = 0;

  for (const star of stars) {
    const win = WINS_BY_FULLNAME.get(star.full_name.toLowerCase());
    if (!win) continue;
    matched++;

    const monthsEarly = monthsBetween(star.starred_at, win.event_date);
    const isEarly = monthsEarly > 0;
    if (isEarly) early++;

    const pointsRaw = isEarly
      ? win.weight * Math.min(monthsEarly / 24, 1.0)
      : 0;
    const points = Math.round(pointsRaw * 10) / 10;

    const existing = winsByOrg.get(win.org);
    // Keep the earliest star per org (highest points)
    if (!existing || points > existing.points) {
      winsByOrg.set(win.org, {
        org: win.org,
        repo: star.full_name,
        name: win.name,
        event: win.event,
        event_date: win.event_date,
        starred_at: star.starred_at,
        months_early: Math.round(monthsEarly * 10) / 10,
        weight: win.weight,
        points,
      });
    }
  }

  const ranked = Array.from(winsByOrg.values()).sort(
    (a, b) => b.points - a.points,
  );

  // Normalize: 5 perfect wins (5 × 100) = score 100
  const top5Sum = ranked.slice(0, 5).reduce((s, w) => s + w.points, 0);
  const score = Math.min(100, Math.round((top5Sum / 500) * 100));

  return {
    score,
    rank: rankFor(score),
    total_stars: stars.length,
    matched_count: matched,
    early_count: early,
    top_wins: ranked.slice(0, 8),
  };
}

/**
 * Generate a templated taste-personality commentary based on the user's wins.
 * Deterministic, no AI call. Tone: playful, observational, second-person.
 */
export function generateTastePersonality(result: ScoutScoreResult): string {
  const { score, early_count, top_wins } = result;

  if (top_wins.length === 0) {
    return "No early calls in our database — yet. Either you're a fresh GitHub account, your stars predate the modern OSS-VC wave, or the next unicorn you starred just isn't validated yet. Make a forward-looking call below and we'll grade you in 6 months.";
  }

  // Categorize wins
  const aiOrgs = new Set(["anthropics", "openai", "huggingface", "langchain-ai", "mistralai", "stability-ai", "togethercomputer", "groq", "modal-labs", "replicate", "ollama", "comfyanonymous", "BerriAI", "lobehub", "open-webui", "All-Hands-AI", "tinygrad", "ggml-org", "stitionai", "microsoft"]);
  const dbOrgs = new Set(["supabase", "planetscale", "neondatabase", "turso", "pinecone-io", "weaviate", "qdrant", "prisma", "drizzle-team", "mage-ai", "dagsterio", "dbt-labs", "airbytehq", "apache"]);
  const devToolsOrgs = new Set(["vercel", "withastro", "oven-sh", "trpc", "linear", "getcursor", "shadcn-ui", "colinhacks", "remotion-dev", "BuilderIO", "denoland", "tauri-apps", "trigger-dev", "inngest", "resend", "clerk", "get-convex", "calcom", "appsmithorg"]);
  const opsOrgs = new Set(["getsentry", "grafana", "PostHog", "n8n-io", "windmill-labs", "ToolJet", "coollabsio", "AppFlowy-IO", "hasura", "strapi", "sanity-io", "encode", "vapor", "replit", "stripe"]);

  const counts = { ai: 0, db: 0, devtools: 0, ops: 0, other: 0 };
  for (const w of top_wins.slice(0, 5)) {
    if (aiOrgs.has(w.org)) counts.ai++;
    else if (dbOrgs.has(w.org)) counts.db++;
    else if (devToolsOrgs.has(w.org)) counts.devtools++;
    else if (opsOrgs.has(w.org)) counts.ops++;
    else counts.other++;
  }

  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const rankWord =
    score >= 80 ? "Oracle-tier" :
    score >= 60 ? "Elite-tier" :
    score >= 40 ? "Sharp-tier" :
    score >= 20 ? "Scout-tier" : "early-stage";

  const taste = (() => {
    if (dominant[0] === "ai" && dominant[1] >= 2) {
      return "you have a clear bias for AI/ML infrastructure. You were watching this lane before the LLM wave broke in 2023";
    }
    if (dominant[0] === "db" && dominant[1] >= 2) {
      return "you have a serious bias for the data + infra layer. Most devs star UIs; you star storage engines";
    }
    if (dominant[0] === "devtools" && dominant[1] >= 2) {
      return "you have a sharp eye for developer-tools companies. You were starring DX-first products before they had a Series A";
    }
    if (dominant[0] === "ops" && dominant[1] >= 2) {
      return "you have an operator's instinct — you star observability and workflow tools, the unsexy stuff that VCs underprice";
    }
    return `you have a clear bias for ${top_wins[0].name}-style companies and the OSS-monetization playbook generally`;
  })();

  const earlyClaim =
    early_count >= 5
      ? `You called ${early_count} winners early`
      : early_count >= 2
        ? `You called ${early_count} winners before they hit their event`
        : `You called ${early_count} winner${early_count === 1 ? "" : "s"} early`;

  return `${rankWord} taste. ${earlyClaim}, and ${taste}. The top one alone (${top_wins[0].name}, ${Math.abs(top_wins[0].months_early).toFixed(0)} months before ${top_wins[0].event}) would have been worth a phone call from any seed VC.`;
}
