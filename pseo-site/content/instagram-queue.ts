/**
 * Instagram content queue — @thedatanerd
 *
 * Russell Brunson Traffic Secrets §2 Ch 7. Anonymity-rule compatible:
 * data-viz cards only, no founder face, no founder voice. Cards are rendered
 * 1080×1080 PNG via Next.js ImageResponse and downloaded for upload via
 * Meta Creator Studio bulk uploader (or single-tap on phone).
 *
 * Each entry pairs:
 *   - a card route under /instagram/cards/<type>/<slug>  → renders the PNG
 *   - a caption + hashtags, copy-paste ready for the IG composer
 *   - a destination URL the link-in-bio rotator should point at on that day
 *
 * Daily cadence (one post/day, 30-day rolling queue):
 *   Mon · weekly-top-5         (movers list, square carousel-cover)
 *   Tue · sector-spotlight     (one sector, percentile rank)
 *   Wed · methodology          (signal definition + decision rule)
 *   Thu · signal-of-the-week   (single-name sharpest pick)
 *   Fri · falsifiable-claim    (we predict X by date Y, audit at /receipts)
 *   Sat · quote                (line from the SSRN paper, with chart)
 *   Sun · data-nerd-rhythm     (what shipped this week, what ships next)
 */

export type InstagramCardType =
  | "weekly-top-5"
  | "sector-spotlight"
  | "methodology"
  | "signal-of-the-week"
  | "falsifiable-claim"
  | "quote"
  | "data-nerd-rhythm";

export interface InstagramPost {
  /** ISO date (YYYY-MM-DD) the post should publish on */
  date: string;
  /** Card type — selects which template renders the image */
  type: InstagramCardType;
  /** Slug for the dynamic card route param */
  slug: string;
  /** IG caption — first line is the hook, rest is body. Includes line breaks. */
  caption: string;
  /** Hashtags appended to the caption — keep ≤15 to avoid IG spam flag */
  hashtags: string[];
  /** Link-in-bio destination for the day */
  ctaUrl: string;
  /** One-line CTA text for the bio rotator */
  ctaLabel: string;
  /** Internal note — never sent to Instagram */
  internalNote?: string;
}

const HASHTAGS_DEFAULT = [
  "#venturecapital",
  "#startupsignals",
  "#datadriveninvesting",
  "#alternativedata",
  "#github",
  "#opensource",
  "#engineering",
  "#startups",
  "#angelinvestor",
  "#vcsignals",
  "#commitvelocity",
  "#codesidesourcing",
];

/**
 * 30-day rolling content queue. Dates are placeholders — the GitHub Actions
 * cron rolls them forward weekly, and the render script fetches each card by
 * type+slug regardless of date. The ordering here is what the @thedatanerd
 * grid will look like once posted in sequence.
 */
export const INSTAGRAM_QUEUE: InstagramPost[] = [
  // ── Week 1 ─────────────────────────────────────────────────────────
  {
    date: "2026-05-11",
    type: "weekly-top-5",
    slug: "2026-w20",
    caption:
      "Top 5 engineering-acceleration movers, week of May 11.\n\nThese are the GitHub orgs whose commit velocity, contributor influx, and dependent fan-out crossed the regime-change threshold this week.\n\nNone of them have raised this quarter. That's the point. We don't watch the press release — we watch the merge graph that comes 21–47 days earlier.\n\nLink in bio for the full 47-name list (free) or the methodology paper on SSRN.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/predicted",
    ctaLabel: "Free Acceleration Watch · 5 names every Monday",
  },
  {
    date: "2026-05-12",
    type: "sector-spotlight",
    slug: "ai-native-devtools",
    caption:
      "Sector spotlight: AI-Native Devtools.\n\nMedian commit velocity acceleration this month: 2.3×. That's the loudest sector on the panel — louder than verifiable compute, louder than on-device inference, louder than dev-infra.\n\nWhy it matters: every fund saying 'we're pre-cooled on AI' is sitting on a leaderboard where the top 8 names haven't had their Series A press release yet.\n\nFull sector PDF (free, no email gate) at the link in bio.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/startups-to-watch",
    ctaLabel: "Sector deep-dives — free, no email gate",
  },
  {
    date: "2026-05-13",
    type: "methodology",
    slug: "commit-velocity-acceleration",
    caption:
      "Signal #1 — Commit-Velocity Acceleration.\n\nFormula: 14-day rolling commits ÷ 60-day rolling commits, normalized by org size.\n\nDecision rule: ≥1.3× crossing for 3+ consecutive days = regime change.\n\nLead time: 21–47 days median ahead of public fundraise (n=219, peer-reviewed, SSRN abstract 6606558).\n\nFalsifiable. Auditable. CC BY 4.0. Replicate it yourself in the appendix — link in bio.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/methodology",
    ctaLabel: "Open methodology — replicate it yourself",
  },
  {
    date: "2026-05-14",
    type: "signal-of-the-week",
    slug: "2026-w20",
    caption:
      "Signal of the week.\n\nOne org. Sharpest crossing on the panel. 14-day chart, percentile rank, decision rule we're applying.\n\nWe grade these post-hoc at 60 and 90 days against public fundraise news. 62% hit rate over the last 18 months. Two refunds in three years.\n\nFull ungated chart + decision rule at the link.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/signal-of-the-week",
    ctaLabel: "Sharpest weekly pick — ungated chart",
  },
  {
    date: "2026-05-15",
    type: "falsifiable-claim",
    slug: "series-a-ai-devtools-q2",
    caption:
      "Falsifiable claim, on the record:\n\nAt least 3 of the 8 names on this week's AI-Native Devtools leaderboard will announce a priced Series A within the next 90 days.\n\nWe'll grade it publicly at /receipts. If we're wrong, we're wrong in writing — that's the deal.\n\nThe whole reason this account exists is that VC commentary is mostly post-hoc. We post the prediction first, the chart later.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/receipts",
    ctaLabel: "Live audit — every claim graded in public",
  },
  {
    date: "2026-05-16",
    type: "quote",
    slug: "lead-time-21-47",
    caption:
      "From the methodology paper:\n\n\"The median lead time between commit-velocity regime change and the next priced round is 33 days, with a 90% confidence interval of 21–47 days. Of the n=219 panel, 68% of orgs that crossed the threshold raised within 90 days.\"\n\nSSRN abstract 6606558. Peer-reviewed. CC BY 4.0. Replication appendix included.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/research",
    ctaLabel: "Peer-reviewed panel · n=219",
  },
  {
    date: "2026-05-17",
    type: "data-nerd-rhythm",
    slug: "2026-w20",
    caption:
      "What shipped this week:\n\n— 47 new names through the regime-change filter\n— 1 sector spotlight: AI-Native Devtools\n— 1 falsifiable claim filed at /receipts\n— 1 methodology card on Commit-Velocity Acceleration\n\nWhat ships next week: monthly Stadium Pitch (first Wednesday) on engineering-velocity panel data.\n\nNo founder voice. No podcast. The cadence is the character.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/now",
    ctaLabel: "Weekly /now status — what's shipping",
  },

  // ── Week 2 ─────────────────────────────────────────────────────────
  {
    date: "2026-05-18",
    type: "weekly-top-5",
    slug: "2026-w21",
    caption:
      "Top 5 movers, week of May 18.\n\nFive orgs whose engineering velocity crossed the regime-change threshold this week. Three of them you've never heard of. That's the design — by the time you've heard of them, the warm-intro window is closed.\n\nFull 47-name list at the link.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/predicted",
    ctaLabel: "Free Acceleration Watch · 5 names every Monday",
  },
  {
    date: "2026-05-19",
    type: "sector-spotlight",
    slug: "verifiable-compute",
    caption:
      "Sector spotlight: Verifiable Compute.\n\nNot the loudest sector. The most consequential. Median commit velocity 1.8× this month, but the contributor influx is 4.2×.\n\nThat's the asymmetric one — capacity is being built faster than the market is yet pricing in.\n\nFull sector PDF at the link.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/startups-to-watch",
    ctaLabel: "Sector deep-dives — free, no email gate",
  },
  {
    date: "2026-05-20",
    type: "methodology",
    slug: "contributor-influx",
    caption:
      "Signal #2 — Contributor Influx.\n\nFormula: net-new external contributors in trailing 30 days, weighted by org size.\n\nDecision rule: ≥4 net-new in 30d = team-shape regime change.\n\nWhy it matters: contributor influx leads commit velocity by ~7 days. It's the leading indicator's leading indicator.\n\nReplicate in 12 lines of Python. Appendix at the link.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/methodology",
    ctaLabel: "Open methodology · 12-line Python recipe",
  },
  {
    date: "2026-05-21",
    type: "signal-of-the-week",
    slug: "2026-w21",
    caption:
      "Signal of the week.\n\nOne name. Sharpest 14-day commit-velocity crossing on the panel. We've held this chart for 6 days while it confirmed.\n\nGraded post-hoc at 60 and 90 days. Live audit at /receipts.\n\nUngated chart at the link.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/signal-of-the-week",
    ctaLabel: "Sharpest weekly pick — ungated chart",
  },
  {
    date: "2026-05-22",
    type: "falsifiable-claim",
    slug: "verifiable-compute-h1",
    caption:
      "Filed at /receipts:\n\nVerifiable Compute will produce its first $100M+ priced round within H2 2026. The org will appear in our top-decile contributor-influx list a minimum of 6 weeks before the announcement.\n\nIf we're wrong, the audit page will say so.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/receipts",
    ctaLabel: "Every claim graded in public",
  },
  {
    date: "2026-05-23",
    type: "quote",
    slug: "false-positive-rate",
    caption:
      "From the methodology paper:\n\n\"22% false-positive rate at the 1.3× threshold. We accept this. The cost of a false positive is one ignored conversation; the cost of a false negative is one missed deal at a 30-day discount to consensus pricing.\"\n\nFalsifiability over polish. Always.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/research",
    ctaLabel: "Peer-reviewed panel · n=219",
  },
  {
    date: "2026-05-24",
    type: "data-nerd-rhythm",
    slug: "2026-w21",
    caption:
      "Week 21 ship log:\n\n— Stadium Pitch monthly drop on Wednesday\n— 1 new sector PDF (Verifiable Compute)\n— 2 falsifiable claims filed\n— Methodology Card Signal #2 (Contributor Influx)\n\nThe rhythm is the character. /now updated.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/now",
    ctaLabel: "Weekly /now status — what's shipping",
  },

  // ── Week 3 ─────────────────────────────────────────────────────────
  {
    date: "2026-05-25",
    type: "weekly-top-5",
    slug: "2026-w22",
    caption:
      "Top 5 movers, week of May 25.\n\nThe leaderboard rebuilds Monday at 09:00 UTC. Five names. Sector-tagged. Each with chart + percentile + decision rule.\n\nFull list at the link.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/predicted",
    ctaLabel: "Free Acceleration Watch · 5 names every Monday",
  },
  {
    date: "2026-05-26",
    type: "sector-spotlight",
    slug: "on-device-inference",
    caption:
      "Sector spotlight: On-Device Inference.\n\nFlat commit velocity, but contributor influx is the highest-percentile on the entire panel. That's the early-formation pattern: small repos, lots of new hands.\n\nThis is what 'pre-Series-A team coalescing' looks like in commit logs.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/startups-to-watch",
    ctaLabel: "Sector deep-dives — free, no email gate",
  },
  {
    date: "2026-05-27",
    type: "methodology",
    slug: "dependent-fan-out",
    caption:
      "Signal #3 — Dependent Fan-Out.\n\nFormula: count of distinct downstream repositories pinning your version, trailing 30 days, log-normalized.\n\nDecision rule: 3-week-over-3-week growth ≥40% = ecosystem traction inflection.\n\nWhy: fan-out is the ground truth of 'is this getting used?' — it's harder to fake than stars and harder to gate than commits.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/methodology",
    ctaLabel: "Open methodology · all 6 signals",
  },
  {
    date: "2026-05-28",
    type: "signal-of-the-week",
    slug: "2026-w22",
    caption:
      "Signal of the week.\n\nThe sharpest dependent-fan-out crossing on the panel this week. 14-day chart at the link.\n\nUngated. Graded post-hoc.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/signal-of-the-week",
    ctaLabel: "Sharpest weekly pick — ungated chart",
  },
  {
    date: "2026-05-29",
    type: "falsifiable-claim",
    slug: "on-device-h2",
    caption:
      "Filed at /receipts:\n\nOn-Device Inference will produce its first sub-$50M priced seed round within Q3 2026. The org will appear in this account's signal-of-the-week feed at least 30 days before the announcement.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/receipts",
    ctaLabel: "Every claim graded in public",
  },
  {
    date: "2026-05-30",
    type: "quote",
    slug: "two-refunds",
    caption:
      "Three years live. 1,400+ paying customers across the ladder. Two refunds total.\n\nThat's the proof line. We post it on every page. We mean it. The signal-or-it's-free guarantee covers any tier — Dashboard, Insider, Sharp.\n\nIf we're not the sharpest read on engineering velocity in your stack, walk away.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/pricing",
    ctaLabel: "Pricing · 30-day signal-or-it's-free guarantee",
  },
  {
    date: "2026-05-31",
    type: "data-nerd-rhythm",
    slug: "2026-w22",
    caption:
      "Week 22 ship log:\n\n— Methodology Card Signal #3 (Dependent Fan-Out)\n— On-Device Inference sector PDF\n— Receipts page audited (2 claims past 90-day grading window)\n— Insider Q2 quarterly digest mailed\n\n/now is updated. Always Monday.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/now",
    ctaLabel: "Weekly /now status",
  },

  // ── Week 4 ─────────────────────────────────────────────────────────
  {
    date: "2026-06-01",
    type: "weekly-top-5",
    slug: "2026-w23",
    caption:
      "Top 5 movers, week of June 1.\n\nFirst Monday of June. Stadium Pitch monthly address Wednesday at /state-of-github. Five movers below.\n\nLink for full list.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/predicted",
    ctaLabel: "Free Acceleration Watch",
  },
  {
    date: "2026-06-02",
    type: "sector-spotlight",
    slug: "dev-infra-q2",
    caption:
      "Sector spotlight: Dev-Infra (Q2 read).\n\nThe quietest sector this quarter. Median commit velocity 0.92×. Below regime-change threshold.\n\nWhen a sector is quiet, that's data too. The narrative says 'dev-infra is hot' — the merge graph says 'not yet, not in commits.'\n\nWe publish what the data says, not what the narrative wants.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/startups-to-watch",
    ctaLabel: "Quarterly sector reads — every quarter",
  },
  {
    date: "2026-06-03",
    type: "methodology",
    slug: "issue-cadence",
    caption:
      "Signal #4 — Issue Cadence.\n\nFormula: trailing 30-day issues opened ÷ 30-day issues closed.\n\nDecision rule: ratio crossing 1.4 sustained for 14d = under-staffed regime (often a precursor to hiring sprint and capital raise).\n\nIssue cadence is the only signal we publish that's bidirectional — it warns of fragility as well as momentum.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/methodology",
    ctaLabel: "Open methodology",
  },
  {
    date: "2026-06-04",
    type: "signal-of-the-week",
    slug: "2026-w23",
    caption:
      "Signal of the week.\n\nIssue cadence regime crossing — the rarer of our 6 signals. When you see this in the feed, the ground is shifting under that org.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/signal-of-the-week",
    ctaLabel: "Weekly chart",
  },
  {
    date: "2026-06-05",
    type: "falsifiable-claim",
    slug: "stadium-pitch-june",
    caption:
      "Stadium Pitch — June 2026.\n\nMonthly written address at /state-of-github. One thesis. One sector callout. One methodology change. One watch list.\n\nThis month: the most consequential shift in engineering hiring patterns since the LLM API consolidation of 2025. Filed at /receipts as a falsifiable claim.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/state-of-github",
    ctaLabel: "Monthly Stadium Pitch · first Wed",
  },
  {
    date: "2026-06-06",
    type: "quote",
    slug: "warm-intro-roulette",
    caption:
      "From the manifesto:\n\n\"Warm-intro roulette is not a sourcing strategy. It's a sampling bias dressed up as a network. The fund that wins the next decade is the fund that reads the merge graph before the deck arrives.\"\n\n/manifesto for the full read.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/manifesto",
    ctaLabel: "Six pillars · the full manifesto",
  },
  {
    date: "2026-06-07",
    type: "data-nerd-rhythm",
    slug: "2026-w23",
    caption:
      "Week 23 ship log:\n\n— Stadium Pitch June drop\n— Methodology Card Signal #4 (Issue Cadence)\n— Dev-Infra Q2 sector read\n— /receipts: 1 claim resolved (correct), 1 claim filed (90-day window opens)\n\nNext week: Signal #5 (Star Detachment) drops Wednesday.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/now",
    ctaLabel: "Weekly /now status",
  },

  // ── Week 5 (overflow buffer) ───────────────────────────────────────
  {
    date: "2026-06-08",
    type: "weekly-top-5",
    slug: "2026-w24",
    caption:
      "Top 5 movers, week of June 8.\n\nThe leaderboard is the simplest output of the panel — five orgs, sorted by composite-of-six, sector-tagged. Full list of 47 at the link.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/predicted",
    ctaLabel: "Free Acceleration Watch",
  },
  {
    date: "2026-06-09",
    type: "sector-spotlight",
    slug: "fintech-rails",
    caption:
      "Sector spotlight: Fintech Rails.\n\nThe slow-burning sector. Median commit velocity has been creeping for 8 quarters straight. No fireworks. No regime crossings. Just compounding.\n\nThis is what 'capital infrastructure' actually looks like — patient code, not hype.",
    hashtags: HASHTAGS_DEFAULT,
    ctaUrl: "https://signals.gitdealflow.com/startups-to-watch",
    ctaLabel: "Sector deep-dives",
  },
];

/** Fetch the next post in the queue based on today's UTC date */
export function getTodaysPost(today: Date = new Date()): InstagramPost | null {
  const iso = today.toISOString().slice(0, 10);
  return INSTAGRAM_QUEUE.find((p) => p.date === iso) ?? null;
}

/** All distinct (type, slug) pairs — used by the render-batch script */
export function getAllCardKeys(): Array<{ type: InstagramCardType; slug: string }> {
  const seen = new Set<string>();
  const out: Array<{ type: InstagramCardType; slug: string }> = [];
  for (const post of INSTAGRAM_QUEUE) {
    const key = `${post.type}:${post.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ type: post.type, slug: post.slug });
  }
  return out;
}

/** Look up a post by (type, slug) */
export function findCard(
  type: InstagramCardType,
  slug: string
): InstagramPost | null {
  return INSTAGRAM_QUEUE.find((p) => p.type === type && p.slug === slug) ?? null;
}
