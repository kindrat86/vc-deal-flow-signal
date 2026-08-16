// Platform-native opener variants. One product story (commit-velocity
// acceleration as a 21-47 day pre-fundraise signal), twelve different
// entry points, because the dev-tool angle that wins on Hacker News
// gets you flagged on LinkedIn, and the revenue-milestone hook that
// converts on Indie Hackers reads as bragging on r/startups.
//
// Internal note (NEVER ship to customer copy): this is the
// platform-specific resolution of the universal opener / story-arc /
// offer triad, the gap surfaced in the 2026-05-09 trilogy audit at
// Traffic Secrets §1 Ch 3 (one shared opener was reused across every
// channel). Twelve variants, each tuned to its native subreddit /
// timeline / comment culture.
//
// Customer-facing language stays neutral ("opener", "story angle",
// "offer phrasing"), no Brunson / Perfect Webinar / Dream 100 names
// on the public surface. See `feedback_brunson_internal_only.md`.

export type PlatformHook = {
  /** Stable slug for URLs and cross-references. */
  slug: string;
  /** Human-readable platform name. */
  platform: string;
  /** Single-emoji glyph for the card header. */
  glyph: string;
  /** Audience temperature label. Cold = strangers; Warm = subscribers. */
  temperature: "cold" | "warm" | "hot";
  /** What they care about, one line. Drives the opener choice. */
  audienceSignal: string;
  /**
   * The opener pattern. The shape of the first line, not the line
   * itself. ("One-line counter-intuitive observation, no preamble.")
   */
  openerPattern: string;
  /** A real example opener, copy-paste ready. */
  exampleOpener: string;
  /**
   * How the same product story gets re-framed for this platform.
   * The universal arc is: warm intros are slow → public commit data
   * is fast → here is the falsifiable proof → here is your move.
   */
  storyAngle: string;
  /** How the offer / CTA lands on this surface. */
  offerPhrasing: string;
  /** Length and tone constraint. */
  formatConstraint: string;
  /** When this surface is most receptive (UTC, weekly cadence). */
  timing: string;
  /** What never to do here, the platform-specific landmine. */
  rule: string;
  /** External handle / target for the user-side daily briefing. */
  handle: string;
};

export const PLATFORM_HOOKS: PlatformHook[] = [
  {
    slug: "twitter",
    platform: "Twitter / X",
    glyph: "𝕏",
    temperature: "cold",
    audienceSignal:
      "Developer-investors scrolling fast. Reward: one screenshot, one numeric claim, one branded URL.",
    openerPattern:
      "One-line counter-intuitive observation. No preamble, no thread tease.",
    exampleOpener: "GitHub is now a deal-flow surface.",
    storyAngle:
      "Single-frame insight, the merge graph as the new pitch deck. Optional follow-up tweet with one chart, never a 12-tweet thread.",
    offerPhrasing:
      "One branded URL on its own line. No 'click here', no 'read more'. The link is the CTA.",
    formatConstraint:
      "≤169 raw / ≤162 weighted chars. Hook-first. Hard ceiling 280 for non-Premium accounts.",
    timing: "Tue / Wed / Thu, 13:00-16:00 UTC. Avoid Friday 19:00+ UTC dead-zone.",
    rule: "Never thread without a payoff hook in tweet 1. Never link to /pricing, link to /watch or /firstlook.",
    handle: "@sipiteno",
  },
  {
    slug: "reddit",
    platform: "Reddit",
    glyph: "🔻",
    temperature: "cold",
    audienceSignal:
      "Skeptical engineers and builders. Auto-mod traps for promotional posts. Comment threads alive on data + methodology, dead on pitch.",
    openerPattern:
      "Vulnerable-builder frame. 'I built this for myself, here's what I found.' Lead with the discovery, not the product.",
    exampleOpener:
      "I spent six months reading commit logs of 400+ startups. Here's what I learned.",
    storyAngle:
      "Numbered findings, methodology disclosed inline, ask-for-help at the close. Subreddit-match the framing, r/startups gets the build-in-public version, r/AngelInvesting gets the deal-side version.",
    offerPhrasing:
      "One link at the end, never above the fold. Phrase: 'Methodology + dataset linked in my profile if anyone wants to replicate.'",
    formatConstraint:
      "300-700 words. Plain text, no formatting tricks. Self-post only, never a link-post.",
    timing: "Tue / Wed mornings 13:00-15:00 UTC. Avoid Sunday (low engagement) and Monday morning (HN steals attention).",
    rule: "Never lead with the product. Never paste the same copy across subs, auto-mod cross-flag triggers shadowban.",
    handle: "u/gitdealflow",
  },
  {
    slug: "hacker-news",
    platform: "Hacker News",
    glyph: "🟧",
    temperature: "cold",
    audienceSignal:
      "Technical, hostile to marketing language, loves data tables and replicable methodology. The 'numbers and the methodology, please' crowd.",
    openerPattern:
      "Show HN: [methodology + n=, not pitch]. Title is the entire hook, first 80 chars decide top 30 placement.",
    exampleOpener:
      "Show HN: Predicting Series A rounds with GitHub commit velocity (n=219, 68% hit rate)",
    storyAngle:
      "Methodology paper first, dataset second, product link last. The first comment from author must be the falsifiability statement: 'False-positive rate, lead-time IQR, and the specific signal that fails.'",
    offerPhrasing:
      "Link to the SSRN paper or the public dataset, NOT to /pricing. Pricing surfaces only if a commenter asks.",
    formatConstraint:
      "Title ≤80 chars. First-author-comment 200-400 words, methodology-dense. Code repo link required for credibility.",
    timing: "Tue / Wed 09:00-11:00 UTC. Sunday 14:00 UTC for Show HN, second-best window for European engineers.",
    rule: "Never use marketing language ('revolutionize', 'game-changer', 'unlock'). Never reply defensively to nitpicks, concede and ship the fix.",
    handle: "thedatanerd",
  },
  {
    slug: "dev-to",
    platform: "dev.to",
    glyph: "👨‍💻",
    temperature: "warm",
    audienceSignal:
      "Engineers reading long-form on commute or coffee break. Reward: tutorial-shaped content with copy-paste code.",
    openerPattern:
      "Tutorial framing. 'How I built X' or 'How to compute Y in N lines of Python.'",
    exampleOpener:
      "How I compute Series A predictions in twelve lines of Python",
    storyAngle:
      "Show the code, share the method, end with a working notebook. Be useful first, brand second. The dataset link is the natural payoff, not the pitch.",
    offerPhrasing:
      "Project link in the author bio + one inline 'full dataset here' mid-post. No CTA-block at the end.",
    formatConstraint:
      "1,200-2,000 words. Code blocks every 200 words. Cover image required for thumbnail performance.",
    timing: "Bi-weekly Tuesday 09:00 UTC. dev.to feed favors Tue / Thu publish times.",
    rule: "Tutorial-first, brand-second. Never gate the tutorial behind email, defeats the syndication mechanic.",
    handle: "@gitdealflow",
  },
  {
    slug: "hashnode",
    platform: "Hashnode",
    glyph: "📘",
    temperature: "warm",
    audienceSignal:
      "Engineers reading long-form on a personal-blog-feed format. Even more depth-tolerant than dev.to.",
    openerPattern:
      "Deep technical essay with a methodology-first title. Hashnode rewards depth + reproducibility.",
    exampleOpener:
      "Building a GitHub commit-velocity index: dataset, method, and the regression that ties them together",
    storyAngle:
      "Long-form methodology essay with the full code, the panel construction, the false-positive analysis. The reader leaves with a runnable notebook.",
    offerPhrasing:
      "Repository link + paper link inline. Author bio carries the product link. No mid-post CTAs.",
    formatConstraint:
      "1,500-3,000 words. Tables, charts (PNG), code blocks. Technical depth > prose.",
    timing: "Bi-weekly Wednesday 10:00 UTC. Pair with dev.to publish to multiply reach via canonical-tag mirror.",
    rule: "Code-blocks > prose. Show the work. Never repeat the dev.to essay verbatim, Hashnode crowd notices the cross-post and disengages.",
    handle: "@gitdealflow",
  },
  {
    slug: "discord",
    platform: "Discord",
    glyph: "💬",
    temperature: "warm",
    audienceSignal:
      "Peer-level community members. MCP, Cursor, Anthropic, Claude ecosystems. Promotional links auto-flagged in 70% of channels.",
    openerPattern:
      "Quiet drop, casual tone, peer-to-peer. 'Built this, sharing in case useful.'",
    exampleOpener:
      "Built an MCP server that surfaces GitHub commit-velocity for any org or repo. Six tools, free forever. Drop a 👀 if useful, link in next msg.",
    storyAngle:
      "Already-built artifact. Low pressure. The artifact does the talking, the comment is just the introduction.",
    offerPhrasing:
      "Two-message drop: message 1 is the artifact mention, message 2 is the link (only if a 👀 reaction lands).",
    formatConstraint:
      "One short paragraph in message 1. Link only after engagement signal. Read #rules first, most channels ban product links outright.",
    timing: "When relevant to live conversation. Never cold-drop into #general unless explicitly allowed.",
    rule: "Never spam DMs. Never link in first message in a strict channel. Read pinned messages before posting.",
    handle: "gitdealflow",
  },
  {
    slug: "linkedin",
    platform: "LinkedIn",
    glyph: "💼",
    temperature: "cold",
    audienceSignal:
      "Fund GPs, family-office heads, professional posture. Algorithm penalizes outbound links in body, rewards comment-link mechanic.",
    openerPattern:
      "Industry-trend observation in line 1, your data point in line 2, the contrarian payoff in line 3 (above the 'see more' fold).",
    exampleOpener:
      "85% of seed deals still source through warm intros.\nWe found a public-data signal that arrives 21-47 days earlier.\nMethodology, not magic, n=219, 68% hit rate.",
    storyAngle:
      "Authority frame. Methodology disclosed. Professional but human. Close with a question that invites debate.",
    offerPhrasing:
      "Comment-link mechanic: 'Comment \"methodology\" and I'll DM the SSRN paper.' Never a link in body, algorithm punishes it.",
    formatConstraint:
      "200-1,200 words. First three lines must hook above the 'see more' fold. Single emoji acceptable; multi-emoji reads as spam.",
    timing: "Tue / Wed / Thu 08:00-10:00 UTC. Avoid Friday afternoon and Monday morning.",
    rule: "Never link in body. Never @-tag GPs without permission. Never copy-paste from Twitter, LinkedIn audience reads slowly and resents brevity.",
    handle: "GitDealFlow Company",
  },
  {
    slug: "email",
    platform: "Email (cold outreach)",
    glyph: "📧",
    temperature: "cold",
    audienceSignal:
      "Specific named partner at a specific named fund. Inbox triage means the first six words decide whether the email gets read.",
    openerPattern:
      "Specific reference to their portfolio + your data point in line 1. No 'Hope this finds you well', first six words must be substantive.",
    exampleOpener:
      "Saw [Fund] led [Company]'s Series A, our signal flagged the run-up 33 days before the announcement.",
    storyAngle:
      "One-to-one specificity. Retro-validate one of their decisions with our dataset. The retro is the proof.",
    offerPhrasing:
      "Single ask. Either a 15-min call OR a one-page data sample for their next deal, never both. One CTA per email.",
    formatConstraint:
      "≤100 words. Plain text. One link. Signature includes SSRN DOI as the credibility anchor.",
    timing: "Tue-Thu 09:00-11:00 partner-local time (Mon and Fri have 30% lower open rates).",
    rule: "Never start with 'Hope this finds you well.' Never CC. Never attach. Pace ≤2 sends/day per Mailreach warm-up rule.",
    handle: "signals@gitdealflow.com",
  },
  {
    slug: "angellist",
    platform: "AngelList",
    glyph: "🪜",
    temperature: "warm",
    audienceSignal:
      "Syndicate leads, angels, scout programs. Feed reads as deal-side noise unless you're already a syndicate participant.",
    openerPattern:
      "Peer-level question framing. Never a pitch. 'Question for syndicate leads:' is the highest-engagement opener.",
    exampleOpener:
      "Question for syndicate leads: do you incorporate engineering-acceleration signals in pre-seed diligence?",
    storyAngle:
      "Partner-side ask. Position as a peer, not a vendor. The product mention surfaces only after someone DMs.",
    offerPhrasing:
      "DM-side, never feed-side. Reply to comments with: 'Happy to share the methodology, DM me?'",
    formatConstraint:
      "1-2 sentences. Question framing. No links in feed posts.",
    timing: "Wednesday 14:00 UTC, peak syndicate-activity window.",
    rule: "Never spam syndicate feed with product. Never tag fund accounts. Treat as a peer-to-peer Discord, not a launchpad.",
    handle: "gitdealflow",
  },
  {
    slug: "product-hunt",
    platform: "Product Hunt",
    glyph: "🚀",
    temperature: "cold",
    audienceSignal:
      "Maker community. Launch-day buzz. Comment threads decide ranking, first three hours are 70% of the upvote yield.",
    openerPattern:
      "Maker-comment thread, vulnerable framing. 'Six months heads-down. The thing I wish existed in my angel days.'",
    exampleOpener:
      "Launched today after six months heads-down. The thing I wish existed in my angel days, I read commit logs for fun, and there was no tool that let me trade on what I saw.",
    storyAngle:
      "Maker journey. Build-in-public. The story explains why the product exists; upvotes follow naturally.",
    offerPhrasing:
      "Top of listing carries the prominent CTA. First-author-comment carries the story. CTA is implicit, just being on PH is the offer.",
    formatConstraint:
      "First-comment 500-800 words. Reply to every comment within the first 60 minutes. Founder-replies show as 'M' badge.",
    timing: "Launch on Tuesday 00:01 PT, best US launch window. Pacific Time. The 24-hour cycle resets at midnight PT.",
    rule: "Never beg for upvotes off-platform. Never DM hunters. Reply to every comment within 1h on launch day or fall off the leaderboard.",
    handle: "gitdealflow",
  },
  {
    slug: "indie-hackers",
    platform: "Indie Hackers",
    glyph: "🛠️",
    temperature: "warm",
    audienceSignal:
      "Bootstrapped builders, MRR-curious, replication-minded. They want to see the dollar-figures, the funnel-math, and the screenshot.",
    openerPattern:
      "Milestone post. Lead with the number, not the product. '€1,000 MRR by selling X to Y' format.",
    exampleOpener:
      "We hit €1,000 MRR by selling commit-graph data to angels. Here's the breakdown.",
    storyAngle:
      "Transparent metrics. Funnel math. Replicable playbook. The reader leaves with a number they could hit themselves.",
    offerPhrasing:
      "Discussed but not pushed. Link in the by-line + one inline 'full breakdown on the dashboard' if relevant.",
    formatConstraint:
      "300-700 words. Screenshots welcomed. Numbers required, 'we made some MRR' reads as evasive.",
    timing: "Mon / Wed 12:00 UTC, IH-feed peaks early-week.",
    rule: "Lead with a number, never with the product. Never round to make the figure prettier, IH crowd notices.",
    handle: "@gitdealflow",
  },
  {
    slug: "telegram",
    platform: "Telegram",
    glyph: "✈️",
    temperature: "hot",
    audienceSignal:
      "Owned channel. Subscribers opted in. They want the unfiltered, member-only version, no public spin.",
    openerPattern:
      "Insider drop, no-frills. 'Sector Sweep: 5 names crossed signal threshold this week.'",
    exampleOpener:
      "Sector Sweep update: 5 names crossed signal threshold this week. Three are in AI-devtools, two in verifiable compute. Names + charts inside.",
    storyAngle:
      "Member-exclusive. Immediate signal. The Telegram channel gets the version that's two days ahead of public.",
    offerPhrasing:
      "Inline links allowed. Brief CTA: '/firstlook for the full chart pack.' Never gates the names, Telegram subscribers paid attention to be inside the loop.",
    formatConstraint:
      "≤300 words. Signal-first. One pinned message per week, no firehose.",
    timing: "Sunday 18:00 UTC, pre-Monday signal drop. Mid-week digest only when something material breaks.",
    rule: "Never repeat what's on Twitter, Telegram subscribers expect 2-day lead-time. Never gate names, subscribers earned the access.",
    handle: "t.me/gitdealflow",
  },
];

/**
 * Lookup helper. Returns undefined for unknown slugs.
 */
export function findPlatformHook(slug: string): PlatformHook | undefined {
  return PLATFORM_HOOKS.find((p) => p.slug === slug);
}

/**
 * The single universal story arc the per-platform variants resolve.
 * Customer-visible copy uses neutral language ("opener", "narrative",
 * "offer") rather than Brunson framework names.
 */
export const UNIVERSAL_STORY = {
  opener:
    "Warm-intro deal flow is slow. GitHub commit data is fast.",
  narrative:
    "Public commit-velocity acceleration crosses a falsifiable threshold 21-47 days before a Series A round closes. We track 400+ orgs, methodology peer-indexed (SSRN 6606558), n=219 paired observations, 68% hit rate at 33-day median lead.",
  offer:
    "Free Acceleration Watch, five names every Monday. Or jump the queue with a €7 First Look Pass on a sector you pick.",
} as const;
