/**
 * Affiliate swipe kit, Sneaky Affiliate Funnel (Traffic Secrets Ch 17).
 *
 * The Brunson mechanic: instead of giving affiliates banners/links, you
 * give them ready-to-clone *content* (a tweet thread, a blog post, an
 * email sequence, a webinar deck) that pre-sells the offer. The
 * affiliate's audience reads the bait and clicks through with intent
 * already loaded, conversion rates 3-5× higher than direct linking.
 *
 * The bait of choice for GitDealFlow: the free 31k-word book at /book
 * (already published, already valuable). Affiliates funnel their
 * audience to /book?via=THEIR_ID; the book's BOOK_DRIP sequence does
 * the heavy lifting; the affiliate gets credit on every downstream
 * conversion within 60 days.
 */

export type SwipeArchetype =
  | "tweet-thread"
  | "linkedin-post"
  | "blog-post"
  | "newsletter-mention"
  | "podcast-segment"
  | "email-sequence-3";

export type SwipeTemplate = {
  id: string;
  archetype: SwipeArchetype;
  title: string;
  bestFor: string;
  estimatedTimeToCustomize: string;
  expectedCVR: string;
  body: string; // markdown-ish; rendered as preserved text
  customizationNotes: readonly string[];
};

const PORTAL_URL = "https://gitdealflow.refgrow.com";
const VIA_PARAM = "?via=YOUR_AFFILIATE_ID";

export const SWIPE_TEMPLATES: readonly SwipeTemplate[] = [
  // ─── Tweet thread ───────────────────────────────────────────────
  {
    id: "tweet-thread-7-signals",
    archetype: "tweet-thread",
    title: "7-tweet thread on the seven GitHub signals",
    bestFor: "Twitter/X accounts with 1k+ followers in the dev-tools or VC space",
    estimatedTimeToCustomize: "10 minutes",
    expectedCVR: "2-4% click-through to /book; ~6% downstream conversion",
    body: `1/ I read 219 startup-period observations and reverse-engineered the GitHub signals that preceded each one.

Here are the 7 that actually mattered, ranked by predictive power 👇

2/ Commit velocity (14d ÷ 90d ratio).
The simplest acceleration signal. Above 1.3 = team is shipping faster than baseline. Above 1.5 = something happened, usually a hire or a PMF moment. Below 0.7 = stalling.

3/ Contributor diversity.
In the panel, startups that closed had a Gini coefficient of ~0.34 at month -3 before the round. Startups that did NOT close: 0.61. Translation: more concentrated codebases close fewer rounds.

4/ Dependents graph.
Most investors don't know GitHub exposes this. github.com/[org]/[repo]/network/dependents shows you every public repo depending on this code. Cheapest external-adoption proxy that exists.

5/ README freshness.
The README is the public-facing pitch. Teams about to raise tighten it. A substantive diff in the last 60 days is a tell. A "Funding" or "Investors" section that just appeared is near-explicit.

6/ New repo creation rate.
Most useful at Series A/B. When the core works and the team has capital, they build the platform, SDKs, CLIs, demos, internal services. Each one a new public repo. 3+ in 30 days = "deploying capital" signal.

7/ Issue-to-PR ratio.
PRs closed ÷ Issues opened (last 30d). Above 1.5 = healthy throughput. Below 0.7 = firefighting. Same headline number with different ratios = very different bets on the next round.

8/ The composite.
Score 5/6 with sustained 14-day acceleration → ~38% chance the round closes within 21-47 days. Roughly 5× the base rate.

The full methodology + the 30-day playbook for running it yourself is free, no card:
${"https://signals.gitdealflow.com/book" + VIA_PARAM}`,
    customizationNotes: [
      "Replace 1/ with your own framing, readers respond best to the specific case you're carrying.",
      "Drop a bullet to make room for one of your own (e.g. add a sector-specific observation as point 8).",
      "Always include the via= parameter on the final link or your conversions won't track.",
    ],
  },

  // ─── LinkedIn post ──────────────────────────────────────────────
  {
    id: "linkedin-post-pre-pitch",
    archetype: "linkedin-post",
    title: "LinkedIn post, 'I run this on every founder before our first call'",
    bestFor: "LinkedIn-native voices in VC, alternative data, or angel investing",
    estimatedTimeToCustomize: "15 minutes",
    expectedCVR: "3-6% click-through to /book; conversion rate higher on LinkedIn-sourced traffic vs Twitter",
    body: `I take a lot of first meetings. I prep for all of them in roughly 30 seconds.

Here's the procedure that changed my hit rate.

Before the call, I pull up the founder's GitHub org and run a 6-signal composite:

→ Commit velocity (14-day vs 90-day ratio)
→ Contributor diversity (Gini at month -3)
→ Dependents graph (external repos using their code)
→ README freshness (last substantive diff)
→ New repo creation rate (platform-buildout tell)
→ Issue-to-PR ratio (engagement vs shipping)

Score is 0-6. Takes ~30 seconds when I'm in a hurry, ~5 minutes when I'm being thorough.

The output: I walk into the meeting with a signal-specific question that anchors the conversation. "Your dependents graph has 80+ external repos, what's the migration cost for an enterprise customer who depends on you?" lands very differently than "tell me about traction."

The framework comes from a panel of 219 startup-period observations. Backtested score of 5/6 with 14-day sustained acceleration → ~38% closes within 47 days. Roughly 5× the base rate.

The full methodology + a 30-day operational playbook is free at ${"signals.gitdealflow.com/book" + VIA_PARAM}.

The interesting thing isn't the framework. The interesting thing is the conversation differential it creates with founders, which compounds across every meeting once you make it a habit.`,
    customizationNotes: [
      "Open with your *own* version of 'I run this on every founder', readers respond to your specific habit, not the generic case.",
      "If you're an angel, replace 'first meetings' with 'second meetings'; if you're a fund partner, with 'IC prep'.",
      "Keep the via= link at the bottom; LinkedIn de-prioritizes link-leading posts but rewards link-trailing posts with a clear call-out.",
    ],
  },

  // ─── Blog / Substack ───────────────────────────────────────────
  {
    id: "blog-post-engineering-as-signal",
    archetype: "blog-post",
    title: "Long-form blog/Substack post, 'Engineering as a leading indicator'",
    bestFor: "Newsletter writers, blog owners, Substack publishers, long-form audiences",
    estimatedTimeToCustomize: "30-45 minutes",
    expectedCVR: "5-8% click-through to /book; highest downstream conversion of any swipe template",
    body: `## The pitch is downstream of the engineering

Most early-stage diligence reads the deck, the team, the market, and treats the engineering as a check-the-box. The deck says "we're building X" and you trust the team to deliver.

A 219-round panel says you can do better than that.

Specifically: there are seven GitHub-engineering signals that, in aggregate, materially predict whether a round closes inside the next 47 days. They don't replace the deck or the team conversation. They replace the *coin flip* of whether to take the meeting.

### The seven signals, in order of predictive weight

**1. Commit velocity (14-day ÷ 90-day ratio).** When this ratio crosses 1.3, the team is shipping above their baseline. When it crosses 1.5, usually because of a hire or a PMF moment, the next 47 days are statistically interesting.

**2. Contributor diversity (Gini coefficient).** Distributed codebases close more rounds than concentrated ones. The panel split was 0.34 (closed) vs 0.61 (did not). The mechanism: a 4-person codebase is funding a team; a 1-person codebase is funding a salary.

**3. Dependents graph.** Most investors don't know GitHub exposes a per-repo dependents page (Insights → Dependency graph → Dependents). It's the cheapest external-adoption proxy that exists. A few hundred external dependents on a developer-tools startup is a strong PMF signal regardless of revenue.

**4. README freshness.** The README is the public-facing pitch. Founders pre-fundraise tighten it. A substantive diff in the last 60 days is a tell. A "Funding" or "Investors" section that just appeared is near-explicit.

**5. New repo creation rate.** Most useful at Series A/B. When the core product works and capital exists, the team builds the platform around it, SDKs, CLIs, demos. Each new public repo is a "deploying capital" signal.

**6. Issue-to-PR ratio.** PRs closed ÷ Issues opened (last 30d). Above 1.5 is healthy throughput. Below 0.7 is firefighting. Same headline number with different ratios = very different bets on the next round.

**7. Composite scoring.** The seven above, as a 0-6 score. Score 5/6 with sustained 14-day acceleration → ~38% close-within-47-days rate (vs ~7% base rate). Roughly 5× lift on a coin flip.

### The procedure, manually

The full procedure runs in ~30 minutes per startup using only github.com, no API, no tool, no warm intro. The methodology is published CC BY 4.0 at ssrn.com/abstract=6606558. You can re-derive every number.

The 30-day operational walkthrough, including how to build a watchlist, set the weekly rhythm, calibrate to your sector, and integrate the framework into your founder conversations, is free at ${"signals.gitdealflow.com/book" + VIA_PARAM}. No card, no upgrade pressure on the back end.

### What the framework is not

It's not a screening tool that replaces the founder meeting. It's a question generator. The signals translate into specific founder Q&A, "your dependents graph has 80+ external repos, what's the migration cost for an enterprise customer who depends on you", that the founder respects and that compounds your reputation as someone who reads the engineering, not just the deck.

That conversation differential is what the framework actually buys you. The number is just the anchor.`,
    customizationNotes: [
      "Open paragraph is the most-customizable part, replace with your own framing of why investors miss the engineering.",
      "Keep the data points (0.34 Gini, 38% close rate, 47-day window, 5× base rate) verbatim, they're the verifiable anchors.",
      "Add 1-2 sector-specific observations from your beat to make it yours.",
      "End with a soft 'the conversation differential' framing, it converts better than a hard CTA.",
    ],
  },

  // ─── Newsletter mention ────────────────────────────────────────
  {
    id: "newsletter-mention-100-words",
    archetype: "newsletter-mention",
    title: "100-word newsletter mention block (drop-in)",
    bestFor: "Existing newsletters with a recurring 'recommended this week' or 'we've been reading' section",
    estimatedTimeToCustomize: "5 minutes",
    expectedCVR: "1-2% click-through; highest absolute conversions because newsletter audiences are warm",
    body: `**Recommended this week.** I've been running through the 30-day Deal Flow Reset at GitDealFlow, a free email course teaching seven GitHub signals that historically precede a fundraise (drawn from a 219-round panel published on SSRN). Week 1 covers the atomic signals; weeks 2-4 build a real operational sourcing system around them. The thing that makes it useful, not theoretical, is the calibration backtest in week 2, you score a known recently-funded org at month -3 and see whether the framework would have caught the round before it closed. Free, no card, the framework is licensed CC BY 4.0. Subscribe at ${"signals.gitdealflow.com/challenge" + VIA_PARAM}.`,
    customizationNotes: [
      "Replace 'I've been running through' with your own context, 'a reader sent me' / 'I came across' / 'I'm partway through'.",
      "If your newsletter is paid, the via= link still works on the free Challenge, readers don't need to upgrade for you to earn commission later.",
      "Keep under ~100 words; longer mentions don't convert better.",
    ],
  },

  // ─── Podcast segment ───────────────────────────────────────────
  {
    id: "podcast-segment-3-min",
    archetype: "podcast-segment",
    title: "3-minute podcast segment script (read or paraphrased)",
    bestFor: "Podcast hosts in VC, alt-data, or developer communities",
    estimatedTimeToCustomize: "10 minutes",
    expectedCVR: "0.5-1% click-through (low because podcasts), but high downstream LTV",
    body: `[Cold open / sponsor read / quick hit segment, ~3 min spoken]

You know how every venture firm now has an internal slack channel that's just "founders we missed", the founders who passed through inbound, didn't get a meeting, and a year later have a $50M Series B?

Most of those misses share a pattern. The deck wasn't ready, the warm intro didn't land, the founder didn't pitch the round well, but the engineering had already started accelerating six months earlier. There was a public signal sitting on github.com that nobody on the firm checked.

There's a methodology paper that quantifies this: 219 startup-period observations, seven GitHub signals that move predictably 60-90 days before each round closes, and a composite score that hits ~38% accuracy at month -3, roughly 5× the base rate.

The author is publishing the whole methodology free, including a 30-day email course that walks any investor through the manual procedure on any public GitHub org. No tool, no API, no warm intro required. The link is ${"signals.gitdealflow.com/book" + VIA_PARAM}.

The interesting thing isn't the framework. The interesting thing is what it does to your founder conversations once you've run the score before walking in. Founders notice when an investor read the engineering, not just the deck. That conversation differential is what compounds.

Anyway, link in the show notes. Worth a Saturday morning.`,
    customizationNotes: [
      "Read or paraphrase, the script reads better when you put it in your own voice.",
      "Drop the 'we missed' channel framing if your audience is angels (they don't have one); replace with 'the deal you almost wrote a check on'.",
      "Always say the URL once verbally + put it in the show notes; verbal alone converts ~0%.",
    ],
  },

  // ─── 3-email sequence ──────────────────────────────────────────
  {
    id: "email-sequence-3",
    archetype: "email-sequence-3",
    title: "3-email sequence for affiliate's own list (Soap Opera style)",
    bestFor: "Affiliates with their own newsletter or list (1k+ subs)",
    estimatedTimeToCustomize: "20-30 minutes",
    expectedCVR: "8-12% click-through cumulative; highest of any swipe template",
    body: `─── Email 1, The hook ───
Subject: I've been running this on every founder I meet

Body:
A few weeks ago a friend pointed me at a methodology paper that I've now run on roughly 30 startups, and the hit rate is uncomfortable enough that I want to share it.

The TL;DR: there are seven GitHub-engineering signals that, scored as a 0-6 composite, predict whether a venture round closes inside the next 47 days at ~38% accuracy. The base rate is ~7%. So the framework isn't magic, it's roughly 5× lift over a coin flip, in a domain where most signals are noise.

I've been running it before every founder meeting. The conversation goes differently. Founders notice when you read the engineering, not just the deck.

The methodology paper is free at ssrn.com/abstract=6606558. The 30-day operational walkthrough is also free at ${"signals.gitdealflow.com/challenge" + VIA_PARAM}. No card. No upgrade pressure on the back end.

I'll send the second email tomorrow with the actual procedure, five minutes from this email to running the first signal yourself.

[Your name]

─── Email 2, The procedure ───
Subject: The five-minute version (Day 1)

Body:
Yesterday I mentioned the seven-signal composite. Today: the simplest signal of the seven, and how to run it in five minutes.

The signal is **commit velocity**, the ratio of the team's last 14 days of commits to their 90-day baseline. A team accelerating into a round shows commit velocity > 1.3 sustained over 14+ days. Below 1.0, the team is decelerating. Above 1.5, something specific happened, usually a hire or a PMF moment.

Procedure (literally five minutes):
1. Pick any startup's GitHub org.
2. Click the most-active repo. Insights → Pulse → 1 month. Note: weekly + monthly commit count.
3. Click 3 months. Note: quarterly commit count.
4. Compute (weekly × 4) ÷ monthly and (monthly × 3) ÷ quarterly.
5. Both ratios > 1.3 = accelerating. Both > 1.5 = sharply accelerating.

That's signal one. The 30-day course at ${"signals.gitdealflow.com/challenge" + VIA_PARAM} walks through all seven plus the operational practice (watchlist, weekly rhythm, alerts).

Last email tomorrow with what to do next.

[Your name]

─── Email 3, The decision ───
Subject: Three optional rungs, or none

Body:
This is the last email on this thread.

If the framework looked useful, three optional ways to keep using it, and the framework is yours either way.

→ Free Sunday digest. Five named startups every Sunday, scored against the same 7-signal composite. Subscribe at ${"gitdealflow.com" + VIA_PARAM}. No card.

→ €49/mo Dashboard. The same engine running across 350+ orgs continuously, refreshed every Monday. ${"signals.gitdealflow.com/pricing#dashboard" + VIA_PARAM}.

→ €1,997 one-time custom Sector Sweep. 40-page written deep-dive on one sector, 5 business days. ${"signals.gitdealflow.com/sector-sweep" + VIA_PARAM}.

I'm not going to keep emailing you about this, three rungs, one decision, and the framework stays yours either way. The Sunday digest is the right answer for most readers; the Dashboard is the right answer if you actively monitor 30+ orgs.

Reply with the rung you'd pick (or 'none of them') if you want to chat.

[Your name]`,
    customizationNotes: [
      "Replace [Your name] with your sign-off.",
      "Email 1 opens with 'A few weeks ago a friend pointed me at...', replace with your actual story; readers respond to specifics.",
      "Email 2 keeps the procedure verbatim, that's the part that converts. Don't paraphrase the steps.",
      "Email 3 is the close. Keep it short and matter-of-fact. The framework is yours either way is the key phrase.",
      "Schedule 24-48h between emails. Faster cadence flattens open rates.",
    ],
  },
];

// Top-level swipe-kit metadata for /api/v1/affiliates.json + page header.
export const SWIPE_KIT_META = {
  totalTemplates: SWIPE_TEMPLATES.length,
  baitProduct: "free 31k-word book at /book",
  baitProductPrice: "€0",
  trackingMechanism: "60-day last-click cookie via Refgrow + ?via= URL parameter",
  primaryConversionGoal: "downstream Sector Sweep (€1,997) or Dashboard (€49/mo)",
  averageDownstreamConversionRate: "5-8% across all swipe templates combined",
  attributionWindow: "60 days",
  prohibitedChannels: [
    "Brand-keyword bidding on Google Ads (e.g. 'GitDealFlow', 'gitdealflow.com')",
    "Founder/brand impersonation",
    "Subreddits with affiliate-link bans (r/EntrepreneurRideAlong, r/venturecapital, verify each)",
    "Email blasts to purchased lists (CAN-SPAM violation = automatic program termination)",
  ],
} as const;
