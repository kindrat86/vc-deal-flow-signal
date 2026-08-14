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

/**
 * Map a prediction outcome to the controlled Schema.org / Google ClaimReview
 * rating. Resolved picks use Google's fact-check vocabulary so the rendered
 * ClaimReview blocks are rich-result eligible. Pending picks emit "Unproven"
 * (Google-accepted) with ratingValue 0, communicating "on the record, not
 * yet adjudicated".
 */
export function predictionOutcomeRating(o: PredictionOutcome): {
  ratingValue: string;
  alternateName: string;
} {
  if (o === "raised" || o === "acquired" || o === "ipo") {
    return { ratingValue: "5", alternateName: "True" };
  }
  if (o === "other_milestone") {
    return { ratingValue: "3", alternateName: "Mixture" };
  }
  if (o === "no_event" || o === "shutdown") {
    return { ratingValue: "1", alternateName: "False" };
  }
  // outcome === null (pending) OR "excluded" handled by callers
  return { ratingValue: "0", alternateName: "Unproven" };
}

export interface ClaimReviewBuildOptions {
  /** Skip entries with outcome === "excluded". Defaults to true. */
  skipExcluded?: boolean;
  /** Whether to emit entries for pending picks (outcome === null). Defaults to true. */
  includePending?: boolean;
}

/**
 * Build top-level JSON-LD @graph ClaimReview entries for a week's picks.
 *
 * IMPORTANT, Schema rule: ClaimReview MUST sit at the top level of a JSON-LD
 * @graph. It must NOT be nested under an Article's `review` property while
 * also carrying `itemReviewed`, that produces the "directional conflict"
 * warning Google Search Console raised on 2026-05-07. Spread the array
 * returned by this helper directly into your `@graph: [...]` array.
 */
export function buildClaimReviewItems(
  week: PredictionWeek,
  opts: ClaimReviewBuildOptions = {},
): Array<Record<string, unknown>> {
  const { skipExcluded = true, includePending = true } = opts;
  const items: Array<Record<string, unknown>> = [];
  for (const p of week.picks) {
    if (skipExcluded && p.outcome === "excluded") continue;
    if (!includePending && p.outcome === null) continue;
    const rating = predictionOutcomeRating(p.outcome);
    const pickAnchor = `https://signals.gitdealflow.com/predicted/${week.slug}#${p.name}`;
    const claimAt = p.outcomeAt ?? week.publishedAt;
    const claimReviewBody: Record<string, unknown> = {
      "@type": "ClaimReview",
      "@id": `${pickAnchor}-claimreview`,
      url: pickAnchor,
      datePublished: week.publishedAt,
      dateModified: claimAt,
      author: {
        "@type": "Organization",
        name: "VC Deal Flow Signal",
        url: "https://gitdealflow.com",
      },
      claimReviewed: `${p.displayName} (${p.sector}) engineering acceleration crossed our signal threshold at ${p.commitVelocityChange}; the published prediction was a fundraise, acquisition, or IPO announcement within ${week.windowDays} days of ${week.publishedAt.slice(0, 10)}.`,
      itemReviewed: {
        "@type": "Claim",
        "@id": `${pickAnchor}-claim`,
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
        },
        datePublished: week.publishedAt,
        firstAppearance: {
          "@type": "OpinionNewsArticle",
          url: `https://signals.gitdealflow.com/predicted/${week.slug}`,
          datePublished: week.publishedAt,
        },
        appearance: {
          "@type": "OpinionNewsArticle",
          url: pickAnchor,
        },
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: rating.ratingValue,
        bestRating: "5",
        worstRating: "0",
        alternateName: rating.alternateName,
      },
    };
    if (p.outcomeNotes) {
      claimReviewBody.reviewBody = p.outcomeNotes;
    }
    items.push(claimReviewBody);
  }
  return items;
}
