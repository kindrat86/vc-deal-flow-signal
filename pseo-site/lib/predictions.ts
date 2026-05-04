import "server-only";
import predictionsData from "@/data/predictions.json";

export type PredictionOutcome =
  | "raised"
  | "acquired"
  | "ipo"
  | "other_milestone"
  | "no_event"
  | "shutdown"
  | "excluded"
  | null;

export interface PredictionPick {
  rank: number;
  name: string;
  displayName: string;
  githubUrl: string;
  websiteUrl?: string | null;
  stage: string;
  geography: string;
  sector: string;
  sectorSlug: string;
  signalType: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth?: string | null;
  thesis: string;
  outcome: PredictionOutcome;
  outcomeNotes?: string | null;
  outcomeAt?: string | null;
}

export interface PredictionWeek {
  slug: string;
  weekStart: string;
  weekEnd: string;
  publishedAt: string;
  windowDays: number;
  gradingDueAt: string;
  picks: PredictionPick[];
}

interface PredictionsFile {
  weeks: PredictionWeek[];
}

const data = predictionsData as unknown as PredictionsFile;

export function getAllPredictionWeeks(): PredictionWeek[] {
  return [...data.weeks].sort((a, b) =>
    a.weekStart < b.weekStart ? 1 : a.weekStart > b.weekStart ? -1 : 0,
  );
}

export function getCurrentPredictionWeek(): PredictionWeek | null {
  const sorted = getAllPredictionWeeks();
  return sorted[0] ?? null;
}

export function getPredictionWeek(slug: string): PredictionWeek | undefined {
  return data.weeks.find((w) => w.slug === slug);
}

export function getAllPredictionWeekSlugs(): string[] {
  return data.weeks.map((w) => w.slug);
}

export interface Scorecard {
  weeksGraded: number;
  picksTotal: number;
  picksPending: number;
  picksGraded: number;
  raised: number;
  acquired: number;
  ipo: number;
  otherMilestone: number;
  noEvent: number;
  shutdown: number;
  excluded: number;
  hitRatePct: number | null;
  firstGradingDueAt: string | null;
}

const HIT_OUTCOMES = new Set<NonNullable<PredictionOutcome>>([
  "raised",
  "acquired",
  "ipo",
]);

const GRADED_OUTCOMES = new Set<NonNullable<PredictionOutcome>>([
  "raised",
  "acquired",
  "ipo",
  "other_milestone",
  "no_event",
  "shutdown",
]);

export function computeScorecard(): Scorecard {
  const weeks = getAllPredictionWeeks();
  let picksTotal = 0;
  let picksPending = 0;
  let picksGraded = 0;
  let raised = 0;
  let acquired = 0;
  let ipo = 0;
  let otherMilestone = 0;
  let noEvent = 0;
  let shutdown = 0;
  let excluded = 0;
  let weeksGraded = 0;
  let firstGradingDueAt: string | null = null;

  for (const week of weeks) {
    if (!firstGradingDueAt || week.gradingDueAt < firstGradingDueAt) {
      firstGradingDueAt = week.gradingDueAt;
    }
    let weekHasGrade = false;
    for (const p of week.picks) {
      picksTotal++;
      if (p.outcome === null) {
        picksPending++;
        continue;
      }
      if (p.outcome === "excluded") {
        excluded++;
        continue;
      }
      if (GRADED_OUTCOMES.has(p.outcome)) {
        picksGraded++;
        weekHasGrade = true;
        if (p.outcome === "raised") raised++;
        if (p.outcome === "acquired") acquired++;
        if (p.outcome === "ipo") ipo++;
        if (p.outcome === "other_milestone") otherMilestone++;
        if (p.outcome === "no_event") noEvent++;
        if (p.outcome === "shutdown") shutdown++;
      }
    }
    if (weekHasGrade) weeksGraded++;
  }

  const hits = raised + acquired + ipo;
  const hitRatePct =
    picksGraded > 0 ? Math.round((hits / picksGraded) * 1000) / 10 : null;

  return {
    weeksGraded,
    picksTotal,
    picksPending,
    picksGraded,
    raised,
    acquired,
    ipo,
    otherMilestone,
    noEvent,
    shutdown,
    excluded,
    hitRatePct,
    firstGradingDueAt,
  };
}

/** Pretty-print an ISO date as "May 4, 2026". Server-side only. */
export function fmtLongDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function isPredictionOutcomeHit(o: PredictionOutcome): boolean {
  return o !== null && HIT_OUTCOMES.has(o);
}
