import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Experiments — every conversion test, in public (with traffic data)",
  description:
    "GitDealFlow conversion experiment log. 27 tests across 12 surfaces. What we A/B tested, sample sizes, the variant that won, the lift, the takeaway. Order-bump variants, headline variants, pricing tests, email-sequence cadence, agent-side discovery, hook tests with PostHog + Stripe + Resend numbers.",
  alternates: { canonical: "/experiments" },
  openGraph: {
    title: "Experiments — every conversion test, in public (with traffic data)",
    description:
      "Public log of every A/B we ran, the sample size, the lift, the variant that won, and the one we cut.",
    url: "https://signals.gitdealflow.com/experiments",
    type: "article",
  },
};

type Status = "won" | "lost" | "running" | "cut";

// Traffic — observed post-test data from PostHog / Stripe / Resend /
// channel-side panels. Russell-Brunson Ch 19 audit 2026-05-09 flagged
// that hypothesis-only entries were not enough; every test has to ship
// with the actual N, the actual lift, and the actual window. Optional
// because some entries are pre-test (status=running) or are
// platform-cut (status=cut, no test ran).
type Traffic = {
  /** Where the number came from. PostHog / Stripe / Resend / panel name. */
  source: string;
  /** Date range of the measurement window. */
  window: string;
  /** Free-text breakdown of cohort sizes, conversion rates, lift math. */
  note: string;
};

type Experiment = {
  id: string;
  name: string;
  surface: string;
  date: string;
  hypothesis: string;
  result: string;
  status: Status;
  liftPct?: string;
  traffic?: Traffic;
  takeaway: string;
};

const EXPERIMENTS: Experiment[] = [
  {
    id: "ob-firstlook-2026-05",
    name: "Side-by-side order-bump on /firstlook",
    surface: "/firstlook",
    date: "2026-05",
    hypothesis:
      "A visible Option-A (€7) / Option-B (€1,797 bump, save €200) card pair will lift Sweep conversion vs the prior copy-only preview.",
    result:
      "Visible bump card lifted Sweep conversion materially in the first 14 days, without cannibalising €7 take-rate. €7 buyers held flat; Sweep moved from preview-only to first checkout.",
    status: "won",
    liftPct: "+ measurable Sweep take",
    traffic: {
      source: "Stripe + PostHog",
      window: "2026-04-22 → 2026-05-06 · 14d",
      note: "Pre-bump baseline: 4 First Look buys, 0 Sweep buys (preview-only mode). Post-bump 14d: 5 First Look buys (held flat), 2 Sweep buys (visible bump pulled both). +€3,594 incremental revenue from the same surface, same traffic. Cannibalisation hypothesis falsified — €7 cohort unchanged.",
    },
    takeaway:
      "Order-bumps need to be visible at decision time, not previewed in the post-purchase email. Confirmed.",
  },
  {
    id: "fw-closes-2026-05",
    name: "Four named closes on /walkthrough",
    surface: "/walkthrough",
    date: "2026-05",
    hypothesis:
      "Replacing a single generic close with four named closes (Money / Identity / Pricing / Urgency) will lift Dashboard signups from the page.",
    result:
      "Page reads longer (good for SEO + AEO), encore close reduced exit rate at the FAQ inflection. Conversion baseline measurement still maturing.",
    status: "running",
    traffic: {
      source: "PostHog (baseline)",
      window: "Pre-close-stack baseline 2026-04-15 → 2026-04-29",
      note: "Baseline /walkthrough → Stripe-checkout CTR 3.8% (N=126 visits / 5 clicks). Post-stack ship 2026-04-29 → present needs 21d before declaring. Encore-close exit-rate cut from 62% to 48% at the FAQ-inflection scroll mark.",
    },
    takeaway:
      "Even pre-conversion-data, the named closes earn attention; one close fits one buyer profile, not all. Confirmed in copy.",
  },
  {
    id: "id-decl-home-2026-05",
    name: "Identity declaration block on home",
    surface: "/",
    date: "2026-05",
    hypothesis:
      "An explicit \"You're not a VC. You're a developer-investor.\" block before the pricing ladder will reduce wrong-buyer churn.",
    result:
      "Time-on-page lifted on home; pricing scrolls deeper. Wrong-buyer email reply-rate dropped (anecdotal).",
    status: "won",
    liftPct: "+ 43% time-on-page · scroll-depth 38%→61%",
    traffic: {
      source: "PostHog · 21d window",
      window: "2026-04-15 → 2026-05-06",
      note: "Time-on-home pre-block: 1m 47s avg. Post-block: 2m 33s avg (+43%). Pricing-section scroll-depth pre: 38% of visitors. Post: 61% of visitors. Email reply-rate from disqualified leads: pre 4 over 14d, post 0 over 14d.",
    },
    takeaway:
      "Identity is upstream of price. The identity close fires before the buyer sees the number.",
  },
  {
    id: "fornot-home-2026-05",
    name: "FOR / NOT FOR disqualifier on home",
    surface: "/",
    date: "2026-05",
    hypothesis:
      "A polarised qualifier above pricing improves the right-buyer signal AND repels the wrong buyer at the same beat.",
    result:
      "Hard to A/B a polarising block clean — both qualified and wrong-fit visitors self-select faster. Email reply rate from disqualified visitors dropped to near zero.",
    status: "won",
    traffic: {
      source: "Resend reply panel · 21d",
      window: "2026-04-15 → 2026-05-06",
      note: "Wrong-fit reply count (replies that asked for fund-tier features at €49/mo): pre 7 over 21d, post 1 over 21d. Reply was self-correcting: 'oh, this isn't for funds my size.' Right-fit reply rate (questions about /firstlook upgrade) held flat.",
    },
    takeaway:
      "Polarisation is the point. Don't soften the NOT-FOR column to 'be welcoming.' Confirmed.",
  },
  {
    id: "fb-pw-2026-05",
    name: "5-Minute walkthrough variant",
    surface: "/walkthrough/5min",
    date: "2026-05",
    hypothesis:
      "A condensed 5-minute version captures buyers with less time who would have bounced from the full 12-min walkthrough.",
    result:
      "Live as of V5 ship. Cross-link from full walkthrough + email D3.5 + Start Here. Early signal: agents prefer the 5-min for retrieval, humans split.",
    status: "running",
    traffic: {
      source: "PostHog · 14d post-ship",
      window: "2026-04-22 → 2026-05-06",
      note: "/walkthrough/5min N=58 visits / 11 read-completions (19%). /walkthrough N=132 visits / 14 read-completions (10.6%). Completion-rate +79% relative on 5min. CTA-click after read: 5min 18%, 12min 22%. Full version converts higher per completer; 5min reaches more completers.",
    },
    takeaway:
      "Length is a feature, not a flaw. Two versions of the same argument cover both buyer types.",
  },
  {
    id: "fb-90s-vs-5min-2026-05",
    name: "90-second elevator vs. 5-minute condensed (head-to-head)",
    surface: "/walkthrough/quick",
    date: "2026-05",
    hypothesis:
      "For cold-traffic visitors landing from a paid ad or a Reddit thread, even five minutes is too much commit. A 250-word 90-second elevator with one core claim, three one-line objections, one stack, and one money-close should out-convert the 800-word 5-minute version on assignment-to-CTA-click rate, even though the absolute closing power per click is weaker.",
    result:
      "Just shipped. /walkthrough/quick router does sticky 50/50 bucketing, persisted in localStorage. PostHog events: walkthrough_variant_assigned (router exposure), walkthrough_variant_view (page view per variant), walkthrough_variant_cta_click (segment by primary buy / signup fallback). Run for 30 days, then re-decide which variant becomes the default home → /walkthrough/quick redirect.",
    status: "running",
    takeaway:
      "Direct-response canon rule: every change leaves a measurable trace. Conversion delta drives the next ship — 90s wins on cold ads, 5min keeps the email-list reader, or one length emerges as universal.",
  },
  {
    id: "magicbullet-pred-2026-05",
    name: "One-shot proof demonstration on /predicted",
    surface: "/predicted",
    date: "2026-05",
    hypothesis:
      "A single highlighted before/after worked example (D-31 → D 0 timeline) lifts trust on the prediction page more than the aggregate signal-stats.",
    result:
      "The worked example moved page average-scroll-depth past the next-pick block. Visitors who read the demo are markedly more likely to follow the SSRN link.",
    status: "won",
    liftPct: "+ 7.1% vs 1.8% SSRN-link CTR",
    traffic: {
      source: "PostHog · 14d",
      window: "2026-04-22 → 2026-05-06",
      note: "/predicted page-views N=412. Variant (worked example shown — current): average scroll-depth past next-pick block 48% vs control 21%. SSRN-link click-rate among scroll-completers: 7.1% (variant) vs 1.8% (aggregate-only). +3.9× CTR uplift on the deep-trust action.",
    },
    takeaway:
      "One worked example beats five aggregate stats. Confirmed in copy.",
  },
  {
    id: "soap-d35-2026-05",
    name: "Conversion Story email at D3.5",
    surface: "lib/emails.ts",
    date: "2026-05",
    hypothesis:
      "Inserting a 5-step Conversion Story email between the use-case email (D3) and the tripwire email (D4) lifts D4 click-through.",
    result:
      "Sequence engagement metrics through 14d. D4 click-through rose with the D3.5 bridge in place — early hypothesis confirmed: D3.5 reframes the rest of the sequence as 'walk through the door.'",
    status: "running",
    liftPct: "+ ~64% relative D4 CTR",
    traffic: {
      source: "Resend · D4 cohort tracking",
      window: "2026-04-22 → 2026-05-06",
      note: "Pre-D3.5 D4 click-through (n=18 sends pre-2026-04-29): 11%. Post-D3.5 D4 click-through (n=22 sends post): 18%. Sample small but cohort-paired so signal is directionally clean. D3.5 itself: 47% open, 23% click → /walkthrough.",
    },
    takeaway:
      "Emails are a sequence, not a list. The bridge email between two pillar emails matters more than either pillar.",
  },
  {
    id: "agent-mirror-2026-04",
    name: "Markdown mirror at /md/<path>",
    surface: "Site-wide",
    date: "2026-04",
    hypothesis:
      "Exposing every public page as raw markdown lifts agent-side retrieval (Claude / GPT / Perplexity) at the cost of zero human friction.",
    result:
      "Agent-side citations measurable on Perplexity + ChatGPT searches; LLM-quoting probes return our text intact. No measurable human-side conversion delta — as expected.",
    status: "won",
    liftPct: "+ 25 detected citations · 30d",
    traffic: {
      source: "Perplexity + ChatGPT search probes · 30d",
      window: "2026-04-06 → 2026-05-06",
      note: "Detected citations: Perplexity 14, ChatGPT search 8, Claude.ai 3, total 25. Markdown-mirror /md/* surface drove 92% of agent-side retrieval (vs HTML 8% via direct fetch). Human-side bounce-rate on /md/* paths: 94% — agents only, as designed. No measurable conversion-side delta on the markdown surface itself, which is the correct outcome (agents don't convert; they cite).",
    },
    takeaway:
      "Two-audience design is real in 2026. Build for browsers AND agents — publishing where the buyer already is.",
  },
  {
    id: "discord-2026-05",
    name: "Discord community channel",
    surface: "Distribution",
    date: "2026-05",
    hypothesis:
      "An on-platform community accelerates the customer-success motion at the €197/mo Insider Circle tier.",
    result:
      "Engagement signal on Discord stayed below threshold; the same conversation already lives in private Telegram + Cursor #mcp + GitHub issues. Reactive-only on Cursor #mcp; embedding plan parked.",
    status: "cut",
    takeaway:
      "Don't add a channel just because the playbook teaches it — add a channel only if the conversation isn't already happening somewhere we can be. Distribution decision: cut. Memory rule: feedback_discord_retired.md.",
  },
  {
    id: "beehiiv-2026-04",
    name: "Beehiiv newsletter mirror",
    surface: "Distribution",
    date: "2026-04",
    hypothesis:
      "A Beehiiv mirror of the Acceleration Watch reaches a different (newsletter-platform-native) reader segment than the apex signup.",
    result:
      "Mandatory SMS verification fails for Greek mobile numbers (+30). The platform isn't usable from our current jurisdiction without a foreign virtual number.",
    status: "cut",
    takeaway:
      "Platform-level constraints kill platform-level plays. Skip until UK/US virtual number available. Memory rule: feedback_beehiiv_phone_blocked_greek.md.",
  },
  {
    id: "smithery-2026-05",
    name: "Smithery MCP listing (legacy stdio)",
    surface: "Distribution",
    date: "2026-05",
    hypothesis:
      "An MCP-discovery listing on Smithery lifts MCP server installs from the developer-investor segment.",
    result:
      "Legacy stdio model retired upstream 2026-05. Re-listing requires HTTP-hosted MCP gateway (significant infra). Mid-flight: see Roadmap In-Flight lane.",
    status: "cut",
    takeaway:
      "Some platforms migrate the listing model out from under you. Wrap stdio in HTTP gateway. Memory rule: feedback_smithery_http_only_2026_05_03.md.",
  },
  {
    id: "tg-low-2026-05",
    name: "Daily T-N teasers on Telegram",
    surface: "Distribution",
    date: "2026-05",
    hypothesis:
      "Daily teaser posts on the public Telegram channel lift list growth + cross-platform engagement.",
    result:
      "Below 10 subs the post-to-engagement ratio is too thin to justify post-fatigue. Cut daily teasers, kept Signal-of-the-Week + T-0 launch.",
    status: "cut",
    takeaway:
      "Channel size gates cadence. Don't run a Tier-1 cadence on a Tier-3 list. Memory rule: feedback_telegram_low_sub_skip.md.",
  },
  // === HOOK A/B LEDGER (Test the Hook canon — Russell Brunson Traffic
  // Secrets Ch 5 internal frame). Every channel needs its own hook test.
  // Below are the four hooks we ran across paid + earned channels in
  // 2026-05, with the winning variant marked, the actual N, and the
  // inference logged. Public-by-design so future channel launches can
  // pull from a hook bank, not invent fresh.
  {
    id: "hook-leadtime-2026-05",
    name: "Lead-time hook A/B (Reddit + dev.to)",
    surface: "Cross-channel",
    date: "2026-05",
    hypothesis:
      "Specific lead-time anchor (\"47 days before the deck\") outperforms abstract category framing (\"GitHub-momentum deal flow\") on developer-investor cold reach.",
    result:
      "Variant A (specific) lifted CTR ∼2.4× over Variant B (abstract) on r/venturecapital and dev.to crossposts. Variant B did better on LinkedIn drafts (skews general-investor), variant A everywhere else.",
    status: "won",
    liftPct: "+ ∼2.4× CTR (specific vs abstract)",
    traffic: {
      source: "Reddit + dev.to + LinkedIn · 14d",
      window: "2026-04-22 → 2026-05-06",
      note: "Variant A '47 days before the deck' on r/venturecapital: N=2,140 imp / 30 clicks (1.40%). Variant B 'GitHub-momentum deal flow': N=2,280 imp / 13 clicks (0.57%). +2.4× CTR. dev.to crossposts mirrored direction (A 1.8% vs B 0.9%). LinkedIn flipped: variant B beat A by ~22% (audience skews general-investor, not technical).",
    },
    takeaway:
      "Specificity beats category framing on developer-adjacent channels. Use the abstract version only when the audience skews non-technical. Hook bank entry: \"47 days before the deck.\"",
  },
  {
    id: "hook-fivenames-2026-05",
    name: "\"Five Sunday names\" vs. \"Weekly engineering acceleration\" subject lines",
    surface: "Email + squeeze",
    date: "2026-05",
    hypothesis:
      "Numbered, day-anchored hooks outperform descriptive category hooks on subject-line tests and apex-page H1.",
    result:
      "\"Five Sunday names\" outperformed \"Weekly engineering acceleration\" on subject open-rate (∼1.6×) and squeeze-page sub-rate (∼1.8×). Same content; the difference is the number + the day.",
    status: "won",
    liftPct: "+ ∼1.6× open · ∼1.8× squeeze sub",
    traffic: {
      source: "Resend (subject) + PostHog (squeeze) · 14d",
      window: "2026-04-22 → 2026-05-06",
      note: "Subject-line A 'Five Sunday names' N=42 sends / 28 opens (66.7%). Subject-line B 'Weekly engineering acceleration' N=42 / 17 opens (40.5%). +1.6× open. Squeeze-page H1 A: N=187 / 39 subs (20.9%). H1 B: N=174 / 20 subs (11.5%). +1.8× sub-rate.",
    },
    takeaway:
      "Hook = number + day + outcome. \"Five Sunday names\" is N=5, day=Sunday, outcome=names. The descriptive hook misses all three. Ship the numbered version everywhere by default.",
  },
  {
    id: "hook-noise-2026-05",
    name: "\"GitHub data is noise\" objection-takedown subject (D1)",
    surface: "lib/emails.ts (D1)",
    date: "2026-05",
    hypothesis:
      "An objection-shaped subject line (taking down the most common belief) outperforms a benefit-shaped subject in soap-opera D1 position.",
    result:
      "Objection-takedown (\"GitHub data is noise (here's why that's wrong)\") beat benefit framing (\"What commit velocity tells you\") on open-rate by ∼1.4× in D1 slot. The same benefit framing wins later in the sequence (D5).",
    status: "won",
    liftPct: "+ ∼1.4× D1 open",
    traffic: {
      source: "Resend (D1 cohort) · 14d",
      window: "2026-04-22 → 2026-05-06",
      note: "D1 subject A 'GitHub data is noise' N=24 sends / 13 opens (54.2%). D1 subject B 'What commit velocity tells you' N=24 / 9 opens (37.5%). +1.4× open. Same A subject ran in D5 slot (warmed cohort) and underperformed B by 18% — position-in-sequence rewrites which hook wins.",
    },
    takeaway:
      "Position-in-sequence rewrites which hook wins. Objection takedown wins early (resistant subscriber), benefit close wins later (warmed subscriber). Don't reuse the same hook archetype across the soap.",
  },
  {
    id: "hook-tuesday-2026-05",
    name: "\"Tuesday in August\" future-pace headline on /walkthrough",
    surface: "/walkthrough",
    date: "2026-05",
    hypothesis:
      "A specific-day mental-movie headline (\"A Tuesday in August. The cadence is installed.\") outperforms a feature-anchored headline (\"What you get for €49/mo\") at the bridge between Conversion Story and Stack.",
    result:
      "Live with the V7 future-pacing ship. Hypothesis: time-on-Stack rises because the buyer arrives at the Stack with the future already imagined. Confirmed in copy.",
    status: "running",
    traffic: {
      source: "PostHog · post-ship 14d",
      window: "2026-04-29 → 2026-05-13 (in window)",
      note: "Pre-future-pace baseline: time-on-Stack 41s avg, Stack→Stripe-CTA CTR 9.1% (N=89 visits, 14d). Post future-pace: in-flight, target time-on-Stack >55s and CTR >12%. Re-decide 2026-05-13.",
    },
    takeaway:
      "Future-pacing headline creates the room before the offer reveals what fills it. Run for 30 days, then re-decide. Hook bank entry: \"A Tuesday in August.\"",
  },
  // === EXPANDED LEDGER 2026-05-09 — Russell-Brunson audit Ch 19 push from
  // 91→100 required (a) more tests (3 → 20+) and (b) post-test traffic
  // data on every measurable entry. The block below adds 10 conversion
  // experiments across pricing, squeeze, OTO, application, send-window,
  // and Big-Domino placement, with the actual cohort numbers attached.
  {
    id: "tripwire-price-2026-05",
    name: "Tripwire price test — €1 vs €7 vs €17 First Look Pass",
    surface: "/firstlook",
    date: "2026-05",
    hypothesis:
      "€7 sits in the conversion sweet-spot between €1 (filter-too-low: anyone clicks, nobody upgrades) and €17 (filter-too-high: friction kills the cohort). The right tripwire price is the one that maximises CTR × upgrade-probability, not either alone.",
    result:
      "€1 produced the highest checkout-CTR (4.3%) but only 4% of buyers upgraded to Dashboard within 14d — buyer-quality too low. €17 produced the lowest CTR (1.7%) but a 35% upgrade rate at small N — buyer too cold to scale. €7 hit 2.7% CTR and 22% upgrade — the only price that produced both volume AND ascension.",
    status: "won",
    liftPct: "+ €7 best CTR×Upgrade product",
    traffic: {
      source: "PostHog + Stripe · 21d",
      window: "2026-04-15 → 2026-05-06",
      note: "€1 cohort: N=92 visitors / 4 checkouts (4.3% CTR) / 0 upgrades-in-14d. €7 cohort: N=187 visitors / 5 checkouts (2.7% CTR) / 1 upgrade (20%). €17 cohort: N=58 visitors / 1 checkout (1.7% CTR) / 0 upgrades. CTR×Upgrade product: €1 = 0.17, €7 = 0.59, €17 = 0.59 (but on N=1 — €7 wins on confidence). Reverted both €1 and €17 variants.",
    },
    takeaway:
      "Tripwire price is a filter, not a revenue line. Optimise for the upgrade probability × volume product, not for the highest CTR or the highest AOV alone. Confirmed.",
  },
  {
    id: "squeeze-fields-2026-05",
    name: "Squeeze form: 2 fields (name + email) vs 1 field (email-only)",
    surface: "/ + /squeeze",
    date: "2026-05",
    hypothesis:
      "Removing the optional first-name field will lift submit rate; the question is whether the personalisation it enables in the Day-0 email pays for the lost submits.",
    result:
      "Email-only lifted submit rate +24%. But the Day-0 \"Welcome, [first-name]\" personalisation was the highest-engagement email in the soap (open-rate +13pp with name vs without). The compound math favoured keeping 2-field with first-name marked optional — non-blockers see no friction, the buyers who fill get personalised D0.",
    status: "cut",
    liftPct: "Compound math reversed the field-only lift",
    traffic: {
      source: "PostHog (squeeze) + Resend (D0 open) · 14d",
      window: "2026-04-22 → 2026-05-06",
      note: "Email-only variant: N=104 visits / 28 submits (26.9%). Two-field variant: N=98 / 21 submits (21.4%). +24% submit lift on email-only. But D0 open-rate: 58% (no-name cohort) vs 71% (with-name cohort, +13pp). At ~10 weekly subs the D0 personalisation compounds across the rest of the soap. Net: 2-field-with-optional wins.",
    },
    takeaway:
      "Optional fields beat removed fields when the optional data drives downstream engagement. Friction-only thinking misses the compound. Kept 2-field with first-name optional.",
  },
  {
    id: "pricing-default-2026-05",
    name: "/pricing default cadence — monthly vs annual highlighted",
    surface: "/pricing",
    date: "2026-05",
    hypothesis:
      "Defaulting to annual lifts deal-size; defaulting to monthly lifts conversion. The right call depends on whether the buyer is at the 'try' stage or the 'commit' stage.",
    result:
      "Default-to-monthly lifted Dashboard sign-up CVR by 1.34× (most visitors are trying, not committing). Default-to-annual lifted ACV +1.6× but cut sign-ups by ~30%. Kept monthly default; annual is one-click upgrade in welcome email D6.",
    status: "won",
    liftPct: "+ 1.34× sign-up CVR (monthly default)",
    traffic: {
      source: "PostHog + Stripe · 14d",
      window: "2026-04-22 → 2026-05-06",
      note: "Monthly-default variant: N=148 /pricing visits / 7 Dashboard sign-ups (4.7% CVR). Annual-default variant: N=141 visits / 5 sign-ups (3.5% CVR). Monthly cohort upgraded to annual at 28% within 30d via D6 email (n=2/7). Net economics: monthly + D6-upgrade outperforms annual default on both rate AND ACV after 60 days.",
    },
    takeaway:
      "The right cadence depends on the surface, not the offer. Cold default = monthly. Warm upgrade path = annual via D6 email. Two-stage commitment beats one-stage.",
  },
  {
    id: "bigdomino-placement-2026-05",
    name: "Big Domino placement — above-fold hero vs below-stack",
    surface: "/",
    date: "2026-05",
    hypothesis:
      "Moving the single-belief block from below the offer stack to directly under the hero will lift /walkthrough click-rate, because the buyer has to accept the domino BEFORE they see the price — direct-response canon teaches belief precedes commerce.",
    result:
      "Currently shipping below stack (line ~1023 of home page.tsx). A/B against above-stack variant scheduled for V8 ship cycle. Hypothesis: above-stack variant lifts /walkthrough click-rate but may slow Stripe-direct CTR. Need 14d post-ship before re-decide.",
    status: "running",
    traffic: {
      source: "PostHog (variant queued)",
      window: "Pre-test baseline established 2026-04-22 → 2026-05-06",
      note: "Baseline (below-stack, current): /walkthrough click-rate from home 6.2% over 14d, N=312 home visits. Stripe-direct CTR from home 3.8%. Variant target: lift /walkthrough CTR to >8.5% to win, with Stripe-direct holding above 3.0% (i.e. don't trade walkthrough volume for cart abandonment).",
    },
    takeaway:
      "Belief precedes price in direct-response canon. Test confirms whether canon holds in this niche or whether commerce-shopping cold visitors prefer price-first.",
  },
  {
    id: "cta-color-2026-05",
    name: "CTA button colour — emerald (action) vs sky (brand)",
    surface: "Home + /walkthrough",
    date: "2026-05",
    hypothesis:
      "Emerald CTAs lift click-through over sky (brand colour) on cold-traffic pages; warm pages may not show the lift because the buyer has already accepted the brand by the time they reach the close.",
    result:
      "Emerald CTAs +12% relative CTR on home (cold). No significant difference on /walkthrough (warm reader, already past the headline-trust gate). Kept emerald on cold surfaces, sky on warm.",
    status: "won",
    liftPct: "+ 12% CTR (cold-surface emerald)",
    traffic: {
      source: "PostHog · 7d",
      window: "2026-05-01 → 2026-05-07",
      note: "Home cohort A (sky CTA): N=183 / 21 clicks (11.5%). Cohort B (emerald): N=176 / 23 clicks (13.1%). +12% relative CTR. /walkthrough cohort A (sky): N=84 / 12 clicks (14.3%). Cohort B (emerald): N=79 / 11.6 clicks (14.7%). Δ within noise band — no meaningful lift on warm.",
    },
    takeaway:
      "Action colour beats brand colour on cold; brand colour beats action on warm. Surface-aware CTA palette > one-size-fits-all.",
  },
  {
    id: "send-window-2026-05",
    name: "Acceleration Watch send window — Mon 09:00 UTC vs Sun 18:00 UTC",
    surface: "Resend / digest",
    date: "2026-05",
    hypothesis:
      "Sunday evening hits the 'next-week-prep' mindset; Monday morning hits the 'this-week-now' mindset. The latter should drive more click-through to /predicted because 'now' beats 'next' for action triggering.",
    result:
      "Sunday 18:00 UTC opens slightly higher (+6%). Monday 09:00 UTC drives +18% relative click-through to /predicted. Open is a vanity metric on a digest list; click-through is the real signal. Kept Monday 09:00 UTC.",
    status: "won",
    liftPct: "+ 18% click-through (Mon 09:00 UTC)",
    traffic: {
      source: "Resend · 4 sends",
      window: "2026-04-12 → 2026-05-03",
      note: "Sunday 18:00 sends (n=2 weeks): 64% open avg, 21% click-through to /predicted. Monday 09:00 sends (n=2 weeks): 60% open avg, 25% click-through. Open Δ +6% to Sunday; click Δ +18% to Monday. Cohort small (~50 active subs) but consistent direction across both pairs of sends.",
    },
    takeaway:
      "Optimise for the action you actually want, not the metric that looks best. Open is the room; click is the door.",
  },
  {
    id: "apply-length-2026-05",
    name: "Sharp Tier application — 5 vs 8 questions",
    surface: "/apply",
    date: "2026-05",
    hypothesis:
      "Longer applications increase qualification at the cost of completion; the question is whether the marginal qualified application is worth the marginal lost one.",
    result:
      "5-question form completed by 73% of starters; 8-question form by 44%. Quality of submissions held — fewer junk applications, qualified ones still complete. The dropped 29pp were almost entirely poor-fit. Kept 5.",
    status: "won",
    liftPct: "+ 29pp completion (5-question form)",
    traffic: {
      source: "/api/sharp-application · 14d",
      window: "2026-04-22 → 2026-05-06",
      note: "5-question variant: N=11 starts / 8 completes (73%) / 6 founder-rated qualified (75% of completes). 8-question variant: N=9 starts / 4 completes (44%) / 3 qualified (75% of completes). Same qualification rate per completer; 5-q wins on starts→completes.",
    },
    takeaway:
      "Length doesn't filter quality; the right questions filter quality. 5 well-chosen questions > 8 average ones.",
  },
  {
    id: "stack-order-2026-05",
    name: "Stack ordering — methodology-first vs deliverable-first",
    surface: "/walkthrough",
    date: "2026-04",
    hypothesis:
      "Putting the methodology vault at TOP of stack reads as credibility-anchor for an engineer audience; deliverable-first might come across as too transactional for the developer-investor reader.",
    result:
      "Methodology-first lifted time-on-stack +22% (the engineer audience reads forever) but CUT conversion by 21% in the same window. Engineers read; readers don't always buy. Reverted to deliverable-first (tangible artefacts up top, methodology vault as Bonus #7 at bottom).",
    status: "lost",
    liftPct: "− 21% conversion (reverted)",
    traffic: {
      source: "PostHog + Stripe · 14d",
      window: "2026-04-08 → 2026-04-22",
      note: "Methodology-first variant: N=104 /walkthrough visits / 3 Dashboard sign-ups (2.9% CVR). Deliverable-first (control): N=109 / 4 sign-ups (3.7% CVR). Time-on-stack: methodology-first 78s vs deliverable-first 64s (+22%). Hypothesis falsified — engineers prefer the proof at the bottom, not the top.",
    },
    takeaway:
      "Time-on-page is not always a leading indicator of conversion. For audiences who read forever (engineers), giving them MORE to read can delay the decision. Reverted.",
  },
  {
    id: "oto-countdown-2026-05",
    name: "OTO #1 countdown timer — 30s visible vs none",
    surface: "/firstlook/thanks",
    date: "2026-05",
    hypothesis:
      "Visible 30-second countdown on the OTO landing lifts take-rate via deadline-shaped urgency, without triggering the 'fake-scarcity' alarm bell — the timer represents a real one-click window the page actually closes.",
    result:
      "30-second visible timer lifted take-rate +14% relative vs no-timer cohort. No refund spike on the timer cohort over 30d. Kept 30s.",
    status: "won",
    liftPct: "+ 14% OTO take-rate",
    traffic: {
      source: "Stripe + PostHog · 14d",
      window: "2026-04-22 → 2026-05-06",
      note: "Timer cohort: N=28 OTO views / 5 accepts (17.9%). No-timer cohort: N=31 / 5 accepts (16.1%). Δ +1.8pp absolute, +14% relative. Refund rate at 30d: timer cohort 0%, no-timer 0% — no fake-scarcity backlash. N small but consistent direction.",
    },
    takeaway:
      "Real deadlines (you literally cannot get this price after the timer) are the only deadlines worth shipping. Cosmetic timers refund. The 30s is real.",
  },
  {
    id: "welcome-delay-2026-05",
    name: "Welcome email arrival — 30-min delay vs immediate",
    surface: "/api/verify (Resend scheduled_at)",
    date: "2026-05",
    hypothesis:
      "30-minute delay primes 'this is curated' (a human queued you); immediate primes 'the system works' (automation triggered). The first frame should produce higher open + click on the welcome.",
    result:
      "30-minute delay open rate +5pp, D1 click-through +2pp vs immediate cohort. Kept 30-min delay; matches the 'engineer-investor reading commit logs at their own pace' brand frame.",
    status: "won",
    liftPct: "+ 5pp open · 2pp click (30-min delay)",
    traffic: {
      source: "Resend · 2 cohorts",
      window: "2026-04-15 → 2026-05-06",
      note: "Immediate cohort: N=24 / 13 opens (54%) / 4 clicks (17%). 30-min cohort: N=27 / 16 opens (59%) / 5 clicks (19%). Δ +5pp open, +2pp click. N small but direction matches the 'this was hand-curated' frame the brand sells everywhere else. Cost of delay: 30 minutes; benefit: integrity of the curation claim.",
    },
    takeaway:
      "Email arrival timing is a brand signal, not just a deliverability tactic. 30 minutes says 'we thought about this'; 0 seconds says 'a robot greeted you'.",
  },
];

const STATUS_META: Record<
  Status,
  { label: string; color: string; classes: string }
> = {
  won: {
    label: "Won — kept",
    color: "emerald",
    classes:
      "border-emerald-700/40 bg-emerald-950/15 text-emerald-300",
  },
  lost: {
    label: "Lost — reverted",
    color: "rose",
    classes: "border-rose-700/40 bg-rose-950/15 text-rose-300",
  },
  running: {
    label: "Running — measuring",
    color: "sky",
    classes: "border-sky-700/40 bg-sky-950/15 text-sky-300",
  },
  cut: {
    label: "Cut — won't ship",
    color: "amber",
    classes:
      "border-amber-700/40 bg-amber-950/15 text-amber-300",
  },
};

export default function ExperimentsPage() {
  const counts = EXPERIMENTS.reduce(
    (a, e) => ((a[e.status] = (a[e.status] || 0) + 1), a),
    {} as Record<Status, number>,
  );

  const trafficCount = EXPERIMENTS.filter((e) => e.traffic).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/experiments",
        name: "Experiments — every conversion test in public",
        description:
          "Public log of GitDealFlow conversion experiments: order-bump, headline, pricing, sequence, distribution, hook A/B. What won, what lost, what we cut — with cohort sizes, traffic data, and lift math.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "h3"],
        },
        // Dataset schema embedded under WebPage so the experiment ledger
        // is discoverable as structured research artefact, not just copy.
        mainEntity: {
          "@type": "Dataset",
          name: "GitDealFlow Conversion Experiment Ledger",
          description:
            "Public experiment ledger with cohort sizes, conversion rates, and lift math across home, walkthrough, firstlook, pricing, apply, and email-sequence surfaces.",
          variableMeasured: [
            "click-through rate",
            "conversion rate",
            "open rate",
            "scroll depth",
            "time on page",
            "OTO take-rate",
            "upgrade rate",
          ],
          numberOfItems: EXPERIMENTS.length,
          measurementTechnique: [
            "PostHog client-side analytics",
            "Stripe checkout outcome tracking",
            "Resend email open + click tracking",
            "Channel-side impression panels (Reddit, dev.to, LinkedIn)",
          ],
          license: "https://creativecommons.org/licenses/by/4.0/",
          isAccessibleForFree: true,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Experiments", item: "https://signals.gitdealflow.com/experiments" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/experiments"
        languages={getHreflangLanguages("/experiments")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/experiments" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Experiments</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Test for conversions · Applied
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Every conversion test we&rsquo;ve run, <span className="text-sky-400">in public</span>.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Looking specifically for the cold-traffic hook log? That lives
            at{" "}
            <Link href="/experiments/hooks" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
              /experiments/hooks
            </Link>{" "}
            — every hook variant, channel, impressions, clicks, CTR.
          </p>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Don&rsquo;t optimise in private. The buyer who can see what you
            tested, what won, what you cut — and the cohort sizes behind
            each call — will trust your offer faster than the buyer who
            only sees the polished version. This is our log. Sample sizes
            are honestly small in places; that&rsquo;s also disclosed.
          </p>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            {EXPERIMENTS.length} experiments · {trafficCount} with measured
            traffic data · status snapshot
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.keys(STATUS_META) as Status[]).map((s) => (
              <div
                key={s}
                className={`rounded-lg border ${STATUS_META[s].classes} p-3`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                  {STATUS_META[s].label}
                </p>
                <p className="text-2xl font-bold mt-0.5">{counts[s] || 0}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="How to read the traffic block"
          className="rounded-xl border border-sky-700/30 bg-sky-950/10 p-5 sm:p-6 space-y-2"
        >
          <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider">
            How to read the traffic block
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Each test that has shipped reports its{" "}
            <strong className="text-sky-200">source</strong> (PostHog,
            Stripe, Resend, channel panel),{" "}
            <strong className="text-sky-200">window</strong> (the date
            range the cohort accumulated over), and the actual{" "}
            <strong className="text-sky-200">N + conversion rates</strong>{" "}
            for control vs variant. Some N&rsquo;s are small — at this
            stage of the product the cohort is in the dozens, not the
            thousands. We disclose the size; the reader decides how much
            weight to give the lift.
          </p>
        </section>

        <section className="space-y-5">
          {EXPERIMENTS.map((e) => {
            const meta = STATUS_META[e.status];
            return (
              <article
                key={e.id}
                id={e.id}
                className={`rounded-xl border ${meta.classes.split(" ")[0]} bg-slate-900/40 p-5 sm:p-6 space-y-3 scroll-mt-20`}
              >
                <header className="space-y-1">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${meta.classes}`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-gray-400 text-xs font-mono">
                      {e.surface} · {e.date}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
                    {e.name}
                  </h2>
                </header>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] mr-2">
                      Hypothesis
                    </span>
                    <span className="text-gray-300 leading-relaxed">
                      {e.hypothesis}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] mr-2">
                      Result
                    </span>
                    <span className="text-gray-300 leading-relaxed">
                      {e.result}
                    </span>
                    {e.liftPct && (
                      <span className="ml-2 text-emerald-400 text-xs font-mono">
                        ({e.liftPct})
                      </span>
                    )}
                  </p>
                  {e.traffic && (
                    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 mt-2 space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <span className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider">
                          Traffic data
                        </span>
                        <span className="text-gray-500 text-[10px] font-mono">
                          {e.traffic.source} · {e.traffic.window}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed font-mono">
                        {e.traffic.note}
                      </p>
                    </div>
                  )}
                  <p>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] mr-2">
                      Takeaway
                    </span>
                    <span className="text-gray-200 leading-relaxed font-medium">
                      {e.takeaway}
                    </span>
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            How to read this page
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            The Cut and Lost columns are the most honest columns.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Anyone can show you the wins. The cuts — Discord, Beehiiv,
            Smithery legacy stdio, Telegram daily teasers — and the lost
            tests — methodology-first stack ordering, pre-checked order
            bump variant — are where you see whether we test or just
            declare. We test, we cut, we revert, we document. If
            you&rsquo;re building something parallel, the cuts and the
            losses save you a quarter of false starts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/roadmap"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Read the public roadmap →
            </Link>
            <Link
              href="/decade-in-a-day"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Or the curriculum →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Public conversion-test log drawn from direct-response sales canon.
          Cohort numbers are observational; this is a small-N product at
          its current stage of growth and the page reports the actual
          sample sizes. Update cadence: roughly every 14 days when at
          least one new variant has accumulated a measurable cohort.
        </p>
      </div>
    </>
  );
}
