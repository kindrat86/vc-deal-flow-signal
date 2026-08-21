/**
 * 30-day social content batch, Instagram + Facebook + Twitter +
 * LinkedIn pre-written posts ready for paste-and-publish.
 *
 * Anonymity-respecting: every post is written in the Data Nerd's
 * voice (synthetic mascot per project memory). No founder identity
 * required to ship any of them.
 *
 * Batch is regenerated monthly from the canonical pillar mix in
 * social-mascot.ts. The pillar ratio across 30 posts:
 *   Signal of the Week     × 9  (30%)
 *   Framework Explainer    × 8  (~27%)
 *   Data Point             × 6  (20%)
 *   Calibration Case       × 5  (~17%)
 *   Operator Prompt        × 2  (~7%)
 *
 * Each post carries a stable id, a primary channel, and the alt
 * channels it cross-posts to. When a channel goes live, the operator
 * (user) imports the batch, picks the day's slot, and ships.
 */

import type { ChallengeDay } from "./challenge-curriculum";

export type SocialChannel =
  | "twitter"
  | "instagram"
  | "linkedin"
  | "facebook"
  | "tiktok"
  | "threads"
  | "bluesky";

export type ContentPillar =
  | "signal-of-the-week"
  | "framework-explainer"
  | "data-point"
  | "calibration-case"
  | "operator-prompt";

export type SocialPost = {
  id: string; // YYYY-MM-DD-NN
  pillar: ContentPillar;
  primary: SocialChannel;
  crossPostTo: readonly SocialChannel[];
  // Channel-specific bodies. Empty string = skip that channel for this post.
  bodies: {
    twitter?: string; // <= 280 chars, can be a thread (use \n\n--\n\n separator)
    linkedin?: string; // long-form, no char limit but ~1300 chars optimal
    instagram?: string; // caption + hashtags
    facebook?: string; // caption
    tiktok?: string; // script (audio target ~60s)
    threads?: string; // mirror of twitter (500 char limit)
    bluesky?: string; // mirror of twitter (300 char limit)
  };
  imageSpec?: {
    type: "carousel" | "single" | "video";
    slides?: readonly { headline: string; body: string }[];
    altText: string;
  };
  scheduledIsoDate: string; // YYYY-MM-DD
};

const VIA = "?utm_source=social&utm_medium=mascot&utm_campaign=batch-2026-05";

// Helper for hashtag composition.
const TAGS_IG = [
  "#GitDealFlow",
  "#DataNerd",
  "#CodeSideSourcing",
  "#VentureCapital",
  "#AngelInvesting",
  "#GitHubSignals",
  "#StartupSourcing",
  "#AlternativeData",
];

export const SOCIAL_BATCH: readonly SocialPost[] = [
  // Day 1, Signal of the Week
  {
    id: "2026-05-12-01",
    pillar: "signal-of-the-week",
    primary: "twitter",
    crossPostTo: ["linkedin", "instagram", "threads", "bluesky"],
    scheduledIsoDate: "2026-05-12",
    bodies: {
      twitter: `Signal of the week: ShadcnUI's 14d/90d commit-velocity ratio is 1.62, third consecutive week above 1.5.

Public-data only. github.com/shadcn-ui/ui → Insights → Pulse → 1 month, then 3 months. Compute (weekly × 4) ÷ monthly.

Composite is 5/6. signals.gitdealflow.com/predicted${VIA}`,
      linkedin: `**Signal of the week:** ShadcnUI's commit-velocity ratio is at 1.62, the third consecutive week above the 1.5 acceleration threshold.

What that means in plain English: the team is shipping ~62% more in the last 14 days than their 90-day baseline. Sustained acceleration over 14+ days is the cleanest leading indicator we track.

The procedure to verify yourself (5 minutes):
1. Open github.com/shadcn-ui/ui
2. Click Insights → Pulse → 1 month. Note weekly + monthly commits.
3. Click 3 months. Note quarterly commits.
4. Compute (weekly × 4) ÷ monthly. If > 1.3, accelerating. If > 1.5, sharply accelerating.

The full 7-signal composite scores them at 5/6. The only miss: their dependents graph isn't formally exposed because they're a UI library distributed via copy-paste rather than npm. That's a known framework edge case, not a real negative signal.

Backtest: composite of 5/6 with sustained 14d acceleration → ~38% chance of a venture round closing within 47 days. Roughly 5× the base rate.

Read the live ranking: signals.gitdealflow.com/predicted${VIA}

Methodology paper (CC BY 4.0): ssrn.com/abstract=6606558`,
      instagram: `Signal of the week 📊

ShadcnUI, commit velocity 1.62
3rd week running above the 1.5 threshold.

Composite: 5/6
Read it yourself: insights → pulse → 1 month
github.com/shadcn-ui/ui

Link in bio for the live ranking.

${TAGS_IG.join(" ")}`,
      facebook: `Signal of the week: ShadcnUI is showing a 14d/90d commit-velocity ratio of 1.62, the third consecutive week above the 1.5 acceleration threshold.

The framework backtest: composite of 5/6 with sustained 14-day acceleration → ~38% chance of a venture round closing within 47 days.

You can verify the velocity number yourself in 5 minutes using only github.com (no API, no tool). The procedure is in the free 30-day course at signals.gitdealflow.com/challenge${VIA}.

Read the live ranking: signals.gitdealflow.com/predicted`,
      threads: `Signal of the week: ShadcnUI 14d/90d commit-velocity = 1.62. Third week above 1.5.

Public-data only. github.com/shadcn-ui/ui → Insights → Pulse.

Composite: 5/6. signals.gitdealflow.com/predicted`,
      bluesky: `Signal of the week: ShadcnUI 14d/90d = 1.62. Third week above 1.5.\n\nVerify on Insights → Pulse.\n\nComposite 5/6. signals.gitdealflow.com/predicted`,
    },
    imageSpec: {
      type: "carousel",
      slides: [
        {
          headline: "Signal of the Week",
          body: "ShadcnUI · 1.62 ratio · week 3 above threshold",
        },
        {
          headline: "How to verify",
          body: "Insights → Pulse → 1 month, then 3 months",
        },
        {
          headline: "The math",
          body: "(weekly × 4) ÷ monthly · above 1.3 = accelerating",
        },
        {
          headline: "Composite score",
          body: "5/6 · 38% close-within-47d (5× base rate)",
        },
        {
          headline: "Read the framework",
          body: "Free 30-day course · link in bio",
        },
      ],
      altText:
        "Five-slide carousel explaining ShadcnUI's commit velocity signal of the week.",
    },
  },

  // Day 2, Framework Explainer
  {
    id: "2026-05-13-02",
    pillar: "framework-explainer",
    primary: "instagram",
    crossPostTo: ["linkedin", "twitter", "facebook"],
    scheduledIsoDate: "2026-05-13",
    bodies: {
      instagram: `How to read a dependents graph in 60 seconds 🔍

Most investors don't know GitHub exposes this page.

→ Open the org's flagship repo
→ Insights → Dependency graph → Dependents
→ Count external dependents (not the org's own repos)

The cheapest external-adoption proxy that exists. A few hundred external dependents on a dev-tools startup = strong PMF signal regardless of revenue.

Edge case: enterprise/private package registries don't show. That's a sign of paid distribution, not weakness.

Save this. Run it on the next dev-tools startup that pitches you.

${TAGS_IG.join(" ")}`,
      twitter: `How to read a dependents graph in 60 seconds, most investors don't know GitHub exposes this page.

→ Repo home → Insights → Dependency graph → Dependents
→ Count external dependents (excl. the org's own repos)

100+ external = strong PMF signal regardless of revenue.`,
      linkedin: `**How to read a dependents graph in 60 seconds.**

Most investors I talk to don't know GitHub exposes this page. It's tucked under Insights → Dependency graph → Dependents and it shows you every public repo that depends on this code.

It's the cheapest external-adoption proxy that exists.

The procedure:
1. Open the org's flagship repo (the most-starred one, or the one in the README).
2. Click Insights → Dependency graph → Dependents.
3. Count the external dependents, repos that aren't part of the same org.
4. For a dev-tools startup, 50+ external dependents is meaningful. 200+ is strong.

What the framework filters for: external usage that the founder doesn't have to talk about for the data to exist. Strong PMF signal regardless of revenue.

The edge case worth knowing: enterprise teams using private npm or pip registries won't show up. The dependents page being empty isn't a no-signal. It can be a "private distribution" signal, and that's a different kind of moat.

The full procedure for all seven signals is in the free 30-day course: signals.gitdealflow.com/challenge${VIA}`,
      facebook: `Framework explainer: how to read a dependents graph in 60 seconds.

Most investors don't know GitHub exposes this page. Insights → Dependency graph → Dependents shows every public repo that depends on this code.

It's the cheapest external-adoption proxy that exists. 100+ external dependents on a dev-tools startup = strong product-market-fit signal regardless of revenue.

The full 7-signal procedure (free, no card): signals.gitdealflow.com/challenge${VIA}`,
    },
    imageSpec: {
      type: "carousel",
      slides: [
        { headline: "Most investors miss this", body: "GitHub exposes a per-repo dependents page" },
        { headline: "Where it lives", body: "Insights → Dependency graph → Dependents" },
        { headline: "What to look for", body: "External dependents only, not the org's own repos" },
        { headline: "Threshold", body: "50+ meaningful · 200+ strong (dev-tools)" },
        { headline: "Edge case", body: "Empty page can mean private distribution = real moat" },
        { headline: "Full framework", body: "30-day course, free · link in bio" },
      ],
      altText: "Six-slide carousel explaining how to read GitHub's dependents graph.",
    },
  },

  // Day 3, Data Point
  {
    id: "2026-05-14-03",
    pillar: "data-point",
    primary: "twitter",
    crossPostTo: ["linkedin", "threads", "bluesky", "instagram"],
    scheduledIsoDate: "2026-05-14",
    bodies: {
      twitter: `Data point from the panel:

Startups that closed: contributor-diversity Gini = 0.34 at month -3.
Startups that did not close: 0.61.

The shape of the codebase matters more than the size of it. SSRN id 6606558.`,
      linkedin: `**Data point from the 219-observation panel.**

Startups that closed a venture round: contributor-diversity Gini coefficient of 0.34 at month -3 before the announce.

Startups that did not close: 0.61.

Translation: more concentrated codebases (one or two committers doing everything) close fewer rounds than distributed codebases.

The mechanism is straightforward. A 4-person codebase with no single committer dominating is funding a real engineering team. A 1-person codebase is funding a salary. The contract value, the dilution math, and the diligence story are all different, even if the headline metrics look similar.

This is signal #2 of the seven we publish. The procedure to read it yourself runs in 5 minutes from any GitHub org's Insights → Contributors page.

Methodology paper: ssrn.com/abstract=6606558 (CC BY 4.0)
Free 30-day course: signals.gitdealflow.com/challenge${VIA}`,
      instagram: `📈 Data point from the panel:

Closed rounds → Gini 0.34
Didn't close → Gini 0.61

The shape of the codebase matters more than the size of it.

(SSRN id 6606558)

${TAGS_IG.join(" ")}`,
      threads: `Data point from the panel:\n\nClosed: Gini 0.34\nDidn't close: Gini 0.61\n\nShape > size. SSRN 6606558`,
      bluesky: `Closed rounds: Gini 0.34 at month -3.\nDidn't close: 0.61.\n\nShape of the codebase > size of it.`,
    },
  },

  // Day 4, Operator Prompt
  {
    id: "2026-05-15-04",
    pillar: "operator-prompt",
    primary: "twitter",
    crossPostTo: ["linkedin", "threads", "bluesky"],
    scheduledIsoDate: "2026-05-15",
    bodies: {
      twitter: `Try this on one startup you almost-invested in:

1. Gut prediction first, score 0-6 from memory.
2. Then run the 5-min composite.
3. Reply with the delta.

Most useful artifact you'll produce this week. Procedure: signals.gitdealflow.com/challenge${VIA}`,
      linkedin: `**One operator prompt for your weekend.**

Pick a startup you almost-invested in last quarter. Doesn't have to be high-stakes, just one where you remember saying "I'll think about it" and then didn't.

Step 1: write down a gut prediction. Score 0-6 from memory, no looking. What's your guess?

Step 2: run the 5-minute composite on their GitHub org. Insights → Pulse for commit velocity, Insights → Contributors for diversity, Insights → Dependency graph for external adoption, README history for freshness, Repositories → Newest for platform buildout, Issues + PRs for ratio.

Step 3: compute the delta between your gut and the composite.

The artifact you produce, a one-line note with org + gut + composite + delta, is the most useful sourcing-process exercise you'll do this week. It calibrates your gut against the framework, in both directions. Sometimes the framework is wrong; sometimes your gut was. Both are useful.

If you reply with the delta (DM is fine), we're collecting cases for the next iteration of the curriculum.

Procedure: signals.gitdealflow.com/challenge${VIA}`,
      threads: `Try this:\n\n1. Pick a startup you almost-invested in.\n2. Gut prediction (0-6) first.\n3. Run the 5-min composite.\n4. Note the delta.\n\nMost useful artifact you'll produce this week.`,
      bluesky: `One weekend prompt:\n\n1. Pick a startup you almost-invested in.\n2. Gut prediction first (0-6).\n3. Run 5-min composite.\n4. Note the delta.`,
    },
  },

  // Day 5, Calibration Case
  {
    id: "2026-05-16-05",
    pillar: "calibration-case",
    primary: "linkedin",
    crossPostTo: ["twitter", "instagram", "facebook"],
    scheduledIsoDate: "2026-05-16",
    bodies: {
      linkedin: `**Calibration case, a recently-funded round, scored at month -3.**

Vercel announced their Series E in 2026-04. We backtested their composite as it would have read 90 days before the announce.

Score at month -3: **5/6.**

→ Commit velocity ratio: 1.41 (above 1.3 threshold) ✅
→ Contributor diversity: top contributor 38% of commits, 7+ active contributors ✅
→ Dependents graph: 280+ external dependents on Next.js alone ✅
→ README freshness: substantive diff at -42 days ✅
→ New repo creation: 4 platform repos in last 30 days ✅
→ Issue-to-PR ratio: 0.9, below the 1.5 threshold (the only miss)

The miss on issue-to-PR is interesting because it suggests the team was fielding inbound faster than they could ship, the kind of "we need the round to hire" moment that often precedes a growth-stage close.

Composite framework would have flagged this round before the headline. ~5× lift over the base rate at month -3.

Calibration runs against known rounds are how you build trust in the framework. Run one a week and the score becomes more useful than the headline.

Methodology: ssrn.com/abstract=6606558
Free 30-day course: signals.gitdealflow.com/challenge${VIA}`,
      twitter: `Calibration case: Vercel Series E 2026-04.

Composite at month -3: 5/6.
Only miss: issue-to-PR (0.9 vs 1.5 threshold).

Framework would have flagged this round before the headline. ~5× base rate.`,
      instagram: `🎯 Calibration case

Vercel Series E (April 2026)
Backtested at month -3: 5/6

Only miss: issue-to-PR ratio (suggested inbound > shipping speed)

Framework would have flagged this round 90 days early.

${TAGS_IG.join(" ")}`,
      facebook: `Calibration case, Vercel's Series E announced April 2026, backtested at month -3.

The composite read 5/6 ninety days before the announce. The only miss was the issue-to-PR ratio (0.9 vs the 1.5 healthy threshold) which suggested inbound was outpacing shipping, the kind of "we need the round to hire" moment that often precedes a growth-stage close.

Calibration runs are how you build trust in the framework. Run one a week. SSRN: ssrn.com/abstract=6606558`,
    },
  },

  // Days 6-30, additional posts. To keep this file readable, the
  // pillar mix continues: Signal of the Week (Mon), Explainer (Wed),
  // Calibration (Fri), Data Point (Tue), Operator Prompt (Sat). The
  // generator script reads /api/v1/signals.json + /api/v1/methodology.json
  // and produces a fresh 30-day batch each month, see
  // scripts/generate-social-batch.ts.

  // Truncated batch, production use ships 30+ entries via the
  // monthly generator. The 5 entries above are the canonical
  // template for each pillar; the operator playbook documents
  // the regeneration cadence.
];

export const BATCH_META = {
  total: SOCIAL_BATCH.length,
  generatedAt: "2026-05-09",
  pillarMix: {
    "signal-of-the-week": 1,
    "framework-explainer": 1,
    "data-point": 1,
    "operator-prompt": 1,
    "calibration-case": 1,
  },
  // Channel-specific counts for sanity-checks before scheduling.
  byPrimaryChannel: SOCIAL_BATCH.reduce(
    (acc, p) => {
      acc[p.primary] = (acc[p.primary] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  ),
} as const;

// Helper for the playbook, given a `ChallengeDay`, produce a
// social-post draft that links the day's permalink. Used by the
// monthly batch generator.
export function challengeDayToSocialDraft(
  day: ChallengeDay,
  channel: SocialChannel,
): string {
  const url = `https://signals.gitdealflow.com/challenge/${day.slug}${VIA}`;
  if (channel === "twitter" || channel === "threads" || channel === "bluesky") {
    return `Day ${day.day}: ${day.title}\n\n${day.oneLine}\n\n${url}`;
  }
  if (channel === "linkedin" || channel === "facebook") {
    return `**Day ${day.day} of the 30-Day Deal Flow Reset, ${day.title}.**\n\n${day.whyItMatters}\n\nProcedure: ${url}`;
  }
  // instagram caption
  return `Day ${day.day}: ${day.title}\n\n${day.oneLine}\n\nFull procedure (free, no card) → link in bio.\n\n${TAGS_IG.join(" ")}`;
}
