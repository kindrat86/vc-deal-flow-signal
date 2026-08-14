/**
 * Playbooks — operator how-tos for VC deal flow via GitHub signals.
 *
 * Each entry is a self-contained "how to do X with the product" guide. Pages
 * are tuned for citation (Speakable + HowTo + FAQPage schema) AND conversion
 * (each step has a tool CTA into /firstlook, /book, the MCP server, or
 * /api/v1/*). Greg-Isenberg-shaped: community-led / micro-SaaS / indie-builder
 * framing, but the mechanics underneath are the same scoring rubric the rest
 * of the site uses.
 *
 * Routes are rendered by `app/playbooks/[slug]/page.tsx`. Slugs are stable —
 * they go into IndexNow on `postbuild`, so renames break inbound citations.
 */

export type PlaybookDifficulty = "beginner" | "intermediate" | "advanced";

export interface PlaybookStep {
  /** Step heading, ~5–10 words. */
  name: string;
  /** Step body, 2–4 sentences. */
  text: string;
  /** ISO 8601 duration (e.g. "PT15M") emitted into HowToStep schema. */
  timeRequired?: string;
  /** Optional URL the reader clicks at this step (CTA into product). */
  toolUrl?: string;
  /** Label shown on the CTA link. */
  toolLabel?: string;
}

export interface PlaybookFAQ {
  q: string;
  a: string;
}

export interface PlaybookFact {
  claim: string;
  sourceUrl: string;
  sourceLabel: string;
}

export interface Playbook {
  /** URL slug at /playbooks/[slug]. */
  slug: string;
  /** Page H1 + <title>. */
  h1: string;
  /** Meta description (<= 160 chars). */
  description: string;
  /** TL;DR — 1–2 sentences, lifted into Speakable + HowTo.description. */
  tldr: string;
  /** Long-form intro paragraphs (separated by blank lines). */
  body: string;
  /** Total time, ISO 8601 (e.g. "PT45M"). Shown to readers + HowTo schema. */
  totalTime: string;
  difficulty: PlaybookDifficulty;
  /** What you need before you start. */
  prerequisites: string[];
  /** Tools used in the playbook. */
  tools: string[];
  /** Ordered steps. */
  steps: PlaybookStep[];
  /** Citable supporting facts. */
  facts: PlaybookFact[];
  /** FAQs — render as accordion + FAQPage JSON-LD. */
  faqs: PlaybookFAQ[];
  /** Primary CTA URL (relative or absolute). */
  ctaUrl: string;
  ctaLabel: string;
  /**
   * Optional "if you build agents" aside — demoted developer/agent path
   * (e.g. a raw JSON endpoint) that should NOT be the primary Marcus CTA but
   * is worth keeping for the builder audience. Rendered as a small note, never
   * the headline button.
   */
  builderAside?: {
    text: string;
    url: string;
    label: string;
  };
  /** Related playbook slugs. */
  related: string[];
  /** SEO keywords for meta tag. */
  keywords: string[];
}

export const playbooks: Playbook[] = [
  {
    slug: "how-to-source-10-dev-tool-deals-in-a-week",
    h1: "How to source 10 dev-tool deals in a week (from GitHub trendlines)",
    description:
      "A Tuesday-to-Friday playbook for sourcing ten qualified dev-tool deals using GitHub commit-velocity, contributor-influx, and star-detachment signals — no scraping required.",
    tldr:
      "Pull the trending dev-tool sector slice from the public signals feed on Tuesday, qualify against a four-test rubric Wednesday, draft warm-intro emails Thursday, and ship ten outbound touches by Friday — total time under three hours.",
    body: `Sourcing ten dev-tool deals in five working days only feels hard because most pipelines start with cold scraping. The shortcut is to start from a pre-filtered signal feed, then spend your hours on qualification and outreach instead of data plumbing.

The playbook below is the exact cadence we run weekly on the GitDealFlow operating side. Tuesday is the data pull. Wednesday is qualification. Thursday is outreach drafting. Friday is the send. Total deep-work time across the week is roughly two and a half to three hours, with one hour of that being the Friday send window.

You can substitute any sector slug — \`ai-ml\`, \`fintech\`, \`security\`, \`data-infra\` — for \`devtools\` and the same cadence applies. The four-test qualification rubric (velocity-percentile, contributor-influx, star-detachment, infra-buildout) doesn't change.`,
    totalTime: "PT3H",
    difficulty: "intermediate",
    prerequisites: [
      "An empty calendar block of 30–60 min on Tue, Wed, Thu, Fri",
      "Read access to the public signals feed at /api/v1/signals.json (no auth required)",
      "A simple outbound spreadsheet or CRM",
    ],
    tools: [
      "GitDealFlow signals feed (free, no auth)",
      "GitHub web UI (commit/contributor inspection)",
      "Your CRM or a flat Google Sheet",
    ],
    steps: [
      {
        name: "Tuesday — pull the dev-tool sector slice",
        text: "Fetch `https://signals.gitdealflow.com/api/v1/signals.json?sector=devtools` (no auth). You'll get the current week's top dev-tool repos ranked by composite signal score. Save the top 30 to a spreadsheet — slug, repo URL, current score, current commit-velocity percentile.",
        timeRequired: "PT15M",
        toolUrl: "https://signals.gitdealflow.com/api/v1/signals.json?sector=devtools",
        toolLabel: "Open the live dev-tool feed",
      },
      {
        name: "Wednesday — apply the four-test rubric",
        text: "For each of the 30, check four signals: (1) commit-velocity 28-day percentile ≥ 80, (2) contributor-influx week-over-week ≥ +25%, (3) star-detachment (commits accelerating without star spike — the pre-attention zone) score ≥ 60, (4) infra-buildout (CI / containerization / dependency-graph density) score ≥ 50. Keep only repos passing 3 of 4. You should land in the 8–14 range.",
        timeRequired: "PT45M",
        toolUrl: "/methodology",
        toolLabel: "Read the four-signal methodology",
      },
      {
        name: "Wednesday afternoon — strip out anything stage-mismatched",
        text: "Open each qualified repo's GitHub page. Cut anything where the README clearly says \"hobby project\", anything that's an obvious enterprise fork (microsoft/, google/, aws/), and anything where the top contributor has a corp email already (you can see this in the contributor list). Aim to land at ten.",
        timeRequired: "PT20M",
      },
      {
        name: "Thursday — pull the warm-intro vectors",
        text: "For each of the ten, open the repo's contributor graph and the maintainer's profile. You're looking for (a) a Twitter / X handle in their bio, (b) a personal website, (c) a Discord/Slack community linked from the repo. The Twitter handle is your warm-intro vector — comment thoughtfully on one of their tweets first, send the DM second.",
        timeRequired: "PT30M",
      },
      {
        name: "Thursday afternoon — draft the ten emails",
        text: "Use a single template: line 1 references the specific commit-velocity signal (\"saw your commit-velocity 28-day percentile jumped from 64 → 91 last week\"), line 2 references one thing from the maintainer's bio or recent post, line 3 is one question about their thesis on the problem space. Keep each draft under 80 words.",
        timeRequired: "PT40M",
        toolUrl: "/firstlook",
        toolLabel: "See an example outbound (firstlook preview)",
      },
      {
        name: "Friday — send + log",
        text: "Send all ten in one block. Log each into your CRM with the specific signal score that triggered the touch. Set a 14-day follow-up reminder. Don't expect more than 2–3 replies in the first 48 hours; the back-end conversion comes from the follow-up at day 14.",
        timeRequired: "PT30M",
      },
    ],
    facts: [
      {
        claim:
          "The four-signal composite (commit-velocity, contributor-influx, star-detachment, infra-buildout) precedes seed-round announcements by an average of 11–14 weeks in the validation set.",
        sourceUrl: "https://signals.gitdealflow.com/methodology",
        sourceLabel: "GitDealFlow methodology",
      },
      {
        claim:
          "The signals feed refreshes Monday mornings UTC, so a Tuesday pull catches the fresh weekly delta.",
        sourceUrl: "https://signals.gitdealflow.com/api/v1/signals.json",
        sourceLabel: "Live signals feed",
      },
      {
        claim:
          "The /firstlook preview shows a real worked example of a Series-A repo flagged 11 weeks before the round was public.",
        sourceUrl: "https://signals.gitdealflow.com/firstlook",
        sourceLabel: "/firstlook preview",
      },
    ],
    faqs: [
      {
        q: "Do I need a GitDealFlow account to follow this playbook?",
        a: "No. The /api/v1/signals.json feed is free and unauthenticated. The paid tier (Sector Sweep / Insider) speeds up the qualification step with pre-computed scoring exports, but the data is the same.",
      },
      {
        q: "Can I substitute a different sector?",
        a: "Yes. Replace `?sector=devtools` with any sector slug — `ai-ml`, `fintech`, `security`, `data-infra`, `dev-platforms`, `analytics`. The four-test rubric is sector-agnostic.",
      },
      {
        q: "Why Tuesday and not Monday?",
        a: "The signals feed refreshes Monday morning UTC. Tuesday gives the CDN cache time to warm globally and gives you 24 hours of post-refresh stability — fewer score deltas to chase.",
      },
      {
        q: "What if I only have one hour per week, not three?",
        a: "Skip Wednesday afternoon (the stage-mismatch sweep) and Thursday morning (the warm-intro vectors). You'll send eight cold-but-specific emails instead of ten warm ones. Reply rate drops ~40%, but you keep the cadence alive.",
      },
    ],
    ctaUrl: "/firstlook",
    ctaLabel: "See a worked example on /firstlook",
    related: [
      "how-to-read-a-github-trendline-like-a-partner",
      "how-to-qualify-a-200-star-repo",
      "how-to-build-a-weekly-deal-flow-newsletter-from-github",
    ],
    keywords: [
      "vc deal sourcing playbook",
      "dev tool deal flow",
      "github deal sourcing",
      "how to source 10 deals a week",
      "dev tool vc sourcing",
      "github commit velocity",
      "contributor influx signal",
      "weekly deal flow cadence",
      "vc outbound playbook",
      "indie founder deal sourcing",
    ],
  },

  {
    slug: "how-to-read-a-github-trendline-like-a-partner",
    h1: "How to read a GitHub trendline like a partner (not a star-counter)",
    description:
      "A 30-minute playbook for interpreting GitHub momentum charts the way a seed-stage partner does — separating durable commit-velocity from one-week star spikes.",
    tldr:
      "Stars are noise; commit velocity, contributor influx, and infra build-out are the three durable signals. Read them on the 28-day rolling, ignore the 24-hour spike, and you'll skip 80% of the false positives that catch first-time investors.",
    body: `Most people read a GitHub trendline by looking at the star count. That's the worst signal in the file. Stars are a function of attention — a single Hacker News front-page placement can add 2,000 stars in 18 hours and tell you nothing about whether the repo will still be alive in six months.

The signals that survive contact with the rest of the year are commit velocity, contributor influx, and infrastructure build-out. They're the ones venture partners use because they're noisy on a 7-day window but very predictive on a 28-day rolling average.

This playbook walks you through reading those three signals on any repo's GitHub page in 30 minutes, plus the two cross-checks (issue cadence and dependency-graph density) that catch the most common false positives.`,
    totalTime: "PT30M",
    difficulty: "beginner",
    prerequisites: [
      "A specific GitHub repo URL you want to evaluate",
      "Browser access to github.com (no auth required for public repos)",
    ],
    tools: [
      "GitHub web UI (Insights tab)",
      "GitDealFlow lookup at /signals/[org]/[repo] (free)",
    ],
    steps: [
      {
        name: "Open Insights → Contributors first, not Stars",
        text: "Go to github.com/[org]/[repo]/graphs/contributors. Set the window to last 4 weeks. You want to see at least three distinct contributors with non-trivial commit counts. One-person commit graphs almost never become companies; they become hobbies or pivot-to-employment stories.",
        timeRequired: "PT5M",
      },
      {
        name: "Check Code frequency on a 28-day window",
        text: "Switch to Insights → Code frequency. The Y-axis is lines added per week. You're looking for a sustained right-leaning trendline — three or four consecutive weeks at higher-than-baseline volume. A single huge week followed by silence is usually a one-time documentation drop or a code-import event, not real momentum.",
        timeRequired: "PT5M",
      },
      {
        name: "Read commits over the last 90 days",
        text: "Open the commits tab and scroll to 90 days back. Count the number of distinct days with at least one commit. Above 50 of 90 = high cadence. Below 20 of 90 = abandoned or weekend-warrior. The cadence number is more predictive than the total commit count.",
        timeRequired: "PT5M",
      },
      {
        name: "Cross-check with issue cadence",
        text: "Open the issues tab. Sort by recently updated. If the top 20 are all from the maintainer themselves answering their own questions, it's a solo project. If the top 20 are from external users reporting bugs and the maintainer is responding within 48 hours, it's a real product.",
        timeRequired: "PT5M",
      },
      {
        name: "Cross-check with infra build-out",
        text: "Look for CI workflows in .github/workflows/, a Dockerfile or docker-compose, and a populated dependencies graph. A repo with no CI and no container config at month 6 is signalling \"hobby\"; a repo that builds CI in month 2 is signalling \"company\".",
        timeRequired: "PT5M",
        toolUrl: "/methodology",
        toolLabel: "See the full infra build-out rubric",
      },
      {
        name: "Pull the GitDealFlow lookup as a sanity check",
        text: "Open `https://signals.gitdealflow.com/signals/[org]/[repo]`. The page renders the four-signal composite score we computed last Monday. If your read disagrees with the score by more than 20 points, re-read the contributor graph — usually the disagreement is a contributor-influx event you missed.",
        timeRequired: "PT5M",
        toolUrl: "/signals",
        toolLabel: "Look up any repo's score",
      },
    ],
    facts: [
      {
        claim:
          "Stars correlate with hype, not retention — 60% of repos with a 1000+ star spike show no commit-velocity follow-through after 90 days.",
        sourceUrl: "https://signals.gitdealflow.com/methodology",
        sourceLabel: "GitDealFlow methodology",
      },
      {
        claim:
          "Contributor count >= 3 on a 28-day window is the single highest-precision predictor of survival-to-seed in the validation set.",
        sourceUrl: "https://signals.gitdealflow.com/research",
        sourceLabel: "Research index",
      },
    ],
    faqs: [
      {
        q: "What about repos under one main maintainer that look great?",
        a: "Solo-maintainer repos can become companies, but the conversion rate is roughly 1 in 30 vs roughly 1 in 5 for 3+-contributor repos in our validation set. We don't filter them out — we just weight them lower.",
      },
      {
        q: "Doesn't the dependency graph favor older repos?",
        a: "Yes, that's why we use a 'density' metric — declared dependencies per file, normalized by repo age. A 6-month-old repo with 40 dependencies declared is signalling infra build-out; a 4-year-old repo with the same 40 might just be cruft.",
      },
      {
        q: "Where does the issue cadence number live?",
        a: "It's signal #5 in the public methodology document. The threshold we use internally is: weekly external-issue rate > 2 AND median-time-to-first-maintainer-response < 72 hours.",
      },
    ],
    ctaUrl: "/signals",
    ctaLabel: "Look up any repo's composite score",
    related: [
      "how-to-qualify-a-200-star-repo",
      "how-to-spot-a-pre-seed-round-from-commit-velocity",
      "how-to-source-10-dev-tool-deals-in-a-week",
    ],
    keywords: [
      "read github trendline",
      "github momentum vc",
      "commit velocity signal",
      "contributor influx",
      "github stars vs commits",
      "github partner perspective",
      "github repo evaluation",
      "github qualification rubric",
      "infra buildout signal",
      "issue cadence signal",
    ],
  },

  {
    slug: "how-to-qualify-a-200-star-repo",
    h1: "How to qualify a 200-star repo in under 15 minutes",
    description:
      "A repeatable 15-minute qualification rubric for the awkward middle — repos with 100–500 stars where you can't tell if it's a real company in the making or a side project.",
    tldr:
      "Use the eight-checkbox rubric below — three on the README, three on the contributor graph, two on the issue tracker — and you'll qualify or kill a 200-star repo in 15 minutes. The 200–500 star band is where most of the seed-stage alpha hides.",
    body: `The hardest repos to qualify are not the 50-star ones (clearly too early) or the 5000-star ones (well-known, fully-priced). It's the 200–500 star band — repos that have just enough heat to look interesting but not enough public information for you to commit to a meeting.

This playbook gives you eight checkboxes that you can run through in 15 minutes. Three or fewer = pass on it. Four to five = put on the watchlist. Six or more = book a 20-min intro call.

The checkboxes are intentionally observable from the public repo — no scraping, no API key, no email warm-up. The point is to get to a yes/no/watch decision without burning operator time.`,
    totalTime: "PT15M",
    difficulty: "beginner",
    prerequisites: [
      "A repo URL in the 100–500 star band",
      "5 min of focus per checkbox",
    ],
    tools: [
      "GitHub web UI",
      "GitDealFlow Scout Receipts (optional, free)",
    ],
    steps: [
      {
        name: "README check 1 — does it open with a problem statement?",
        text: "Open the README. The first 200 words should describe a real problem. If the first 200 words are a feature list or installation instructions, that's a 'tool for itself' signal, not a company. Check or unchecked.",
        timeRequired: "PT2M",
      },
      {
        name: "README check 2 — is there a named target user?",
        text: "Scan for phrases like 'for engineers who...', 'for teams that...', 'for solo founders...'. A repo with no named user is selling to no one. Check if present.",
        timeRequired: "PT2M",
      },
      {
        name: "README check 3 — is there a paid offering or self-host distinction?",
        text: "Look for a 'pricing' link, a 'cloud version' section, or a self-host vs hosted distinction. Either signals business intent. Check if present.",
        timeRequired: "PT2M",
      },
      {
        name: "Contributor check 1 — three or more committers in last 30 days",
        text: "Open Insights → Contributors, 4-week window. Count distinct names with non-trivial commits. Check if ≥ 3.",
        timeRequired: "PT2M",
      },
      {
        name: "Contributor check 2 — top contributor has a public profile beyond GitHub",
        text: "Click the top contributor's profile. They should have a non-empty website / Twitter / LinkedIn. Anonymous top contributor on a 200-star repo is a yellow flag (sometimes intentional, often not). Check if linked.",
        timeRequired: "PT2M",
      },
      {
        name: "Contributor check 3 — contributor list is geographically dispersed",
        text: "Quick scan of contributor avatars and profile locations — more than one country represented is a small but meaningful network-effect signal. Check if yes.",
        timeRequired: "PT1M",
      },
      {
        name: "Issue check 1 — external issues outnumber maintainer self-issues",
        text: "Issues tab → sort by recently updated → scan the top 20. If the maintainer is opening more than half of them themselves, the project is still inward-facing. Check if external > internal.",
        timeRequired: "PT2M",
      },
      {
        name: "Issue check 2 — median-time-to-first-response under 72 hours",
        text: "Pick 5 recent external issues. Look at the time between opening and the first maintainer reply. If the median is under 72 hours, the maintainer is treating it like a product. Check if median < 72h.",
        timeRequired: "PT2M",
        toolUrl: "/scorecard",
        toolLabel: "Run the same checks at /scorecard",
      },
    ],
    facts: [
      {
        claim:
          "The 200–500 star band contains 4× the median seed-stage outcome rate of the 1000+ star band in our validation set — the named effect is 'pre-attention alpha'.",
        sourceUrl: "https://signals.gitdealflow.com/methodology",
        sourceLabel: "GitDealFlow methodology",
      },
      {
        claim:
          "An automated version of this rubric (Scout Receipts) grades your starring history against the same eight checkboxes.",
        sourceUrl: "https://signals.gitdealflow.com/scorecard",
        sourceLabel: "/scorecard",
      },
    ],
    faqs: [
      {
        q: "Can I run this rubric on a 1000-star repo too?",
        a: "Yes — and you should — but the value-add over a basic 'this is popular' read is much smaller. The rubric pays for itself the most in the 100–500 band where popularity hasn't done your job for you.",
      },
      {
        q: "What if the README is in a non-English language?",
        a: "Translate it (Google Translate or your browser). The three README checks are content checks, not language checks. The contributor and issue checks don't depend on language at all.",
      },
      {
        q: "Is six checkboxes really enough to book a call?",
        a: "It's enough to spend 20 minutes on a discovery call. It's not enough to write a check. Treat this as a pipeline-building rubric, not a diligence rubric.",
      },
    ],
    ctaUrl: "/scorecard",
    ctaLabel: "Run the auto-graded version",
    related: [
      "how-to-read-a-github-trendline-like-a-partner",
      "how-to-source-10-dev-tool-deals-in-a-week",
      "how-to-spot-a-pre-seed-round-from-commit-velocity",
    ],
    keywords: [
      "qualify github repo for vc",
      "200 star repo qualification",
      "small repo vc qualification",
      "pre seed qualification rubric",
      "github repo checklist vc",
      "early stage github diligence",
      "indie repo investment qualification",
      "fast github qualification",
      "github repo scorecard",
      "scout receipts",
    ],
  },

  {
    slug: "how-to-find-your-first-investable-saas-on-github",
    h1: "How to find your first investable SaaS hiding on GitHub (solo-founder lens)",
    description:
      "A weekend playbook for solo founders and angels — find one investable SaaS hiding on GitHub, qualify it, and decide whether you'd build the same thing or back the team building it.",
    tldr:
      "Pick one niche you actually understand, pull the top 25 repos by composite signal score in that niche, apply the three-question solo-founder filter (Can I build it? Should I build it? Would I rather back this team?), and ship a decision by Sunday night.",
    body: `The frame that makes GitHub useful for solo founders and individual angels is not "find the next unicorn" — it's "find one thing this weekend you'd either build yourself or write a small check into". That decision-framing is a much more honest filter than typical VC sourcing because it forces you to engage with the actual problem space.

This playbook is shaped for an opinionated three-hour Saturday block. The output by Sunday night is a single sheet with one repo, one decision, and one action — usually either "I'm going to build a competing thing in the next 30 days" or "I'm going to email the maintainer and offer to write a $5–25k check or a useful intro".

It works because you're starting from a niche you already understand, which means the qualification work is dramatically faster than for a generalist scout.`,
    totalTime: "PT3H",
    difficulty: "intermediate",
    prerequisites: [
      "A niche you genuinely understand (1–2 hours of curiosity, not 'a hot space I read about')",
      "A weekend block",
      "Honesty about whether you'd build it yourself",
    ],
    tools: [
      "GitDealFlow signals feed",
      "Your own niche-specific knowledge",
      "30 minutes with the maintainer's prior writing/talks",
    ],
    steps: [
      {
        name: "Saturday 10am — name the niche in one sentence",
        text: "Write your niche in one sentence: 'Tools that help [user] do [job] when [constraint].' If you can't say it cleanly, you don't understand it well enough yet — pick a different one. Examples: 'Tools that help solo SaaS founders ship marketing email when they don't want to learn Mailchimp.' 'Tools that help indie game devs ship Steam analytics when they don't want to build a dashboard.'",
        timeRequired: "PT15M",
      },
      {
        name: "Saturday 10:15 — pull the top 25 in that niche",
        text: "Open `https://signals.gitdealflow.com/api/v1/signals.json?sector=[closest-sector]&limit=25`. If your niche doesn't map cleanly to a sector slug, pick the closest one and scan manually. You're looking for the 5–8 repos whose READMEs are clearly your niche, not just nearby.",
        timeRequired: "PT30M",
        toolUrl: "https://signals.gitdealflow.com/api/v1/signals.json",
        toolLabel: "Open the live feed",
      },
      {
        name: "Saturday 11am — answer 'Can I build it?' for each",
        text: "For each of the 5–8, can you build a competing v1 in a weekend? If yes, mark 'buildable'. If no, mark 'too-much-tech'. The buildable column is where most solo-founder leverage lives — competing on shipping speed, not technical complexity.",
        timeRequired: "PT30M",
      },
      {
        name: "Saturday 12pm — answer 'Should I build it?' for each buildable repo",
        text: "Even if you can build it, should you? For each buildable repo, write one sentence on what would change if a slightly better version existed. If the answer is 'nothing material', cross it off. If the answer involves a specific person you know who'd pay, keep it.",
        timeRequired: "PT45M",
      },
      {
        name: "Saturday 1pm — find the maintainer's writing on the problem",
        text: "For each surviving repo, find one piece of prior writing by the maintainer — a blog post, a talk, a Twitter thread, a podcast appearance. Read it. If they sound like they're going to build the thing whether or not you join, that's a back-them signal. If they sound like they're solving a one-off itch, that's a build-yourself signal.",
        timeRequired: "PT45M",
      },
      {
        name: "Sunday 10am — write the one-page decision",
        text: "One repo. One decision. One action. Decision = build / back / skip. Action = (build → first commit message you'd write tomorrow morning) / (back → the exact email you'd send the maintainer including the check size or intro you're offering) / (skip → the next niche you'll try next weekend).",
        timeRequired: "PT45M",
        toolUrl: "/book",
        toolLabel: "See worked examples in the free book",
      },
    ],
    facts: [
      {
        claim:
          "The solo-founder / individual-angel band (checks of $5–25k) is the fastest-growing segment of the GitDealFlow user base — about 38% of paid Insider seats in Q1 2026.",
        sourceUrl: "https://signals.gitdealflow.com/transparency",
        sourceLabel: "Transparency report",
      },
      {
        claim:
          "Worked build-vs-back examples are included in the free book at /book/read.",
        sourceUrl: "https://signals.gitdealflow.com/book/read",
        sourceLabel: "Free book",
      },
    ],
    faqs: [
      {
        q: "What if my niche isn't represented in the sector slugs?",
        a: "Pick the closest sector and scan the README of each repo manually. The signal scores are still computed for every public repo we track — the sector slugs are just a fast pre-filter.",
      },
      {
        q: "Is 'build it yourself' really a valid VC sourcing playbook?",
        a: "It's not a VC playbook — it's a solo-founder / angel playbook. The point is that the same GitHub signal that says 'this team has momentum' also says 'this problem space has demand', and as a solo founder you can act on either side of that.",
      },
      {
        q: "What's the average check size that comes out of this playbook?",
        a: "Anecdotally, $5–25k angel checks in the build-or-back-this-weekend lane. The 'back' decisions go directly into a warm-intro email; the 'build' decisions tend to produce a first commit by Monday morning.",
      },
    ],
    ctaUrl: "/book",
    ctaLabel: "Grab the free book (build-vs-back examples)",
    related: [
      "how-to-source-10-dev-tool-deals-in-a-week",
      "how-to-turn-a-trending-repo-into-a-warm-intro",
      "how-to-build-a-dream-100-of-github-orgs",
    ],
    keywords: [
      "solo founder deal sourcing",
      "indie angel investing",
      "build vs back saas",
      "find saas on github",
      "weekend saas sourcing",
      "investable saas",
      "first angel check",
      "solo founder vc",
      "indie hacker investor",
      "weekend vc sourcing",
    ],
  },

  {
    slug: "how-to-spot-a-pre-seed-round-from-commit-velocity",
    h1: "How to spot a pre-seed round from commit-velocity (11 weeks early)",
    description:
      "A signal-reading playbook that catches pre-seed rounds 8–14 weeks before they're announced — using only public GitHub commit-velocity, contributor influx, and infrastructure build-out signals.",
    tldr:
      "Pre-seed rounds are almost always preceded by 4–6 weeks of accelerating commit velocity plus a sudden contributor-influx of 2+ new committers — usually the new hires the round was raised to make. Watch for both signals together; either alone is noisier.",
    body: `Pre-seed rounds are public information ~8–14 weeks after the wire actually clears. The signal that they're about to be announced is in the GitHub repo, usually starting 4–6 weeks before the announcement.

The two co-occurring signals are: (1) commit velocity accelerating on a 28-day rolling — usually by 40–80% over the prior 28-day baseline — and (2) contributor influx, where two or more new committers appear within a 14-day window. The first signal alone is just shipping momentum; the second alone is just open-source contribution. Together, they're almost always "the founders just hired their first two engineers with the cheque they raised".

This playbook gives you the exact watchlist mechanic — how to set it up, what threshold to alert on, and how to read the resulting signal without front-running false positives.`,
    totalTime: "PT45M",
    difficulty: "intermediate",
    prerequisites: [
      "A starting list of 50–200 repos to watch (any niche)",
      "A way to fetch the signals feed on a weekly cadence (cron + curl is fine)",
    ],
    tools: [
      "GitDealFlow signals feed",
      "Spreadsheet or simple database",
      "Email or Slack for the alert",
    ],
    steps: [
      {
        name: "Build the watchlist",
        text: "Start with 50–200 repos. Any source works — your starring history, the top-25-by-sector pull from the public feed, or a hand-curated list of orgs you respect. The key is that the list is stable across weeks so you can compute deltas.",
        timeRequired: "PT15M",
      },
      {
        name: "Pull commit velocity weekly",
        text: "Once a week (Monday afternoon, after the feed refresh), fetch the commit-velocity 28-day percentile for each repo from `/api/v1/signals.json`. Store the value. Compute the week-over-week delta.",
        timeRequired: "PT10M",
        toolUrl: "https://signals.gitdealflow.com/api/v1/signals.json",
        toolLabel: "Live signals feed",
      },
      {
        name: "Pull contributor count weekly",
        text: "Same cadence. Fetch the unique-contributor count for the trailing 14 days for each repo. Store it. Compute the week-over-week delta.",
        timeRequired: "PT10M",
      },
      {
        name: "Set the co-occurrence alert",
        text: "Alert when ALL three are true in the same week: (a) commit-velocity 28-day percentile increased by ≥ 15 points week-over-week, (b) two or more new contributors appeared in the trailing 14 days, (c) the repo has CI workflows configured. The CI gate cuts out the most common false positive — a sudden burst of cosmetic README contributions from drive-by contributors.",
        timeRequired: "PT5M",
        toolUrl: "/methodology",
        toolLabel: "Read the full co-occurrence rubric",
      },
      {
        name: "Confirm with a 15-minute manual read",
        text: "When the alert fires, open the repo manually. Look at the commit messages from the new contributors — if they're substantive feature commits (not docs or typo fixes), the signal is strong. If they're surface-level, downgrade to watchlist.",
        timeRequired: "PT15M",
      },
      {
        name: "Schedule the outreach for week 4",
        text: "Don't email the day the signal fires. Wait three to four weeks. By then the founders are usually post-honeymoon-period with the new hires and have headroom for a coffee. Outbound at week 4 has a much higher reply rate than at week 1, in our experience.",
        timeRequired: "PT5M",
      },
    ],
    facts: [
      {
        claim:
          "Pre-seed rounds are preceded by the commit-velocity + contributor-influx co-occurrence by an average of 9.7 weeks in the validation set (n=84, 2024–2025).",
        sourceUrl: "https://signals.gitdealflow.com/research",
        sourceLabel: "Research index",
      },
      {
        claim:
          "The CI gate (signal #3 in the methodology) cuts false-positive rate from ~31% to ~9% in the same set.",
        sourceUrl: "https://signals.gitdealflow.com/methodology",
        sourceLabel: "Methodology",
      },
    ],
    faqs: [
      {
        q: "Why wait three weeks before outreach?",
        a: "Reply rates roughly double at week 4 vs week 1 in our internal tests. Founders in the immediate post-close window are absorbed with onboarding new hires and announcing the round. By week 4, they have headroom and are actively looking for design-partners / next-round intros.",
      },
      {
        q: "Does this work for seed and Series A too?",
        a: "Less reliably. Seed and Series A rounds tend to be preceded by hiring announcements, blog-post drafts, and trademark filings — the signal mix moves off-platform. Commit-velocity still rises but the lead time compresses to 4–6 weeks instead of 9–14.",
      },
      {
        q: "What's the false-positive rate at the threshold above?",
        a: "Roughly 9% in our validation set with the CI gate, 31% without it. False positives are usually open-source spikes — Hacktoberfest, a viral GitHub Action, or a popular import from a much larger project.",
      },
    ],
    ctaUrl: "/methodology",
    ctaLabel: "Read the full methodology",
    related: [
      "how-to-read-a-github-trendline-like-a-partner",
      "how-to-source-10-dev-tool-deals-in-a-week",
      "how-to-turn-a-trending-repo-into-a-warm-intro",
    ],
    keywords: [
      "spot pre seed round early",
      "commit velocity pre seed",
      "contributor influx signal",
      "pre seed deal sourcing",
      "github pre seed signal",
      "co occurrence signal vc",
      "pre announcement vc signal",
      "github vc watchlist",
      "early stage vc signal",
      "11 weeks early vc",
    ],
  },

  {
    slug: "how-to-build-a-weekly-deal-flow-newsletter-from-github",
    h1: "How to build a weekly deal-flow newsletter from GitHub signals (no scraping)",
    description:
      "A reproducible Friday-morning playbook for shipping a weekly deal-flow newsletter to your investor or founder audience — sourced entirely from the public signals feed.",
    tldr:
      "Pull the top-10 movers from the signals feed each Friday, write a 2-paragraph note per repo (what changed, why it matters), publish by noon — and your newsletter becomes the highest-leverage relationship-building artifact you ship all year.",
    body: `A weekly deal-flow newsletter is the single highest-leverage piece of content you can ship if you're in venture, scout, or operator-investor mode. It compounds inbound (founders DM you because they recognize their repo in last week's issue), it compounds outbound (your cold emails reference a piece they've already read), and it forces you to keep your own pattern-matching sharp.

The reason most people don't ship one is that the data layer feels heavy — scraping GitHub, normalizing scores, dealing with rate limits. This playbook removes that work entirely. You pull from a single public endpoint Friday morning, write ten short paragraphs by Friday lunch, and you're shipping by 1pm with no infrastructure beyond your existing newsletter tool.

The 10-movers-per-week shape is intentional: small enough that you actually ship it, large enough that the cumulative monthly-archive is searchable and citable.`,
    totalTime: "PT2H",
    difficulty: "beginner",
    prerequisites: [
      "An email newsletter tool (Beehiiv, Substack, ConvertKit, Buttondown — all work)",
      "100+ subscribers (or willingness to build there)",
      "Friday-morning consistency, ideally 6 weeks straight",
    ],
    tools: [
      "GitDealFlow signals feed",
      "Your newsletter tool",
      "A simple email-to-RSS bridge if you want syndication (optional)",
    ],
    steps: [
      {
        name: "Friday 9am — get this week's top-10 movers",
        text: "The free Sunday digest already lands the ten teams whose engineering momentum moved the most this week — a mix of brand-new entrants and accelerators, ranked and written up. That's your raw material; no spreadsheet, no setup. (If you build agents: the same list is one unauthenticated JSON pull — see the small aside under the steps.)",
        timeRequired: "PT10M",
        toolUrl: "https://gitdealflow.com/#signup",
        toolLabel: "Get the free weekly movers digest",
      },
      {
        name: "Friday 9:15 — open all 10 in tabs",
        text: "Open each repo's GitHub page + their /signals lookup page in side-by-side tabs. You're priming yourself to write the 'what changed' beat for each.",
        timeRequired: "PT15M",
      },
      {
        name: "Friday 9:30 — write the 'what changed' line for each",
        text: "One sentence per repo. Examples: 'Commit velocity 28-day percentile jumped from 61 → 88; two new committers joined this week.' 'Stars +2,100 but commit velocity flat — likely a Hacker News spike, watch for follow-through.'",
        timeRequired: "PT30M",
      },
      {
        name: "Friday 10am — write the 'why it matters' line for each",
        text: "One more sentence per repo. The job here is to give the reader your interpretation, not just the data. Example: 'The contributor-influx pattern matches the pre-seed signal — expect a round announcement late June or July.'",
        timeRequired: "PT30M",
      },
      {
        name: "Friday 11am — top-and-tail the issue",
        text: "Write a 3-paragraph opener (a theme you noticed this week across the 10) and a 1-paragraph closer (one ask of readers — a reply, a forward, a subscribe). Keep the issue under 800 words total — the constraint is what makes it readable.",
        timeRequired: "PT20M",
        toolUrl: "/book",
        toolLabel: "See three sample issues at /book/read",
      },
      {
        name: "Friday 12pm — schedule + cross-post",
        text: "Schedule the newsletter for noon. Cross-post the opener as a single thread on Twitter / LinkedIn (3 tweets / 1 LinkedIn post). Include a 'full issue + the 10 repos' link back to your newsletter archive.",
        timeRequired: "PT15M",
      },
    ],
    facts: [
      {
        claim:
          "The Sunday-digest format — a fixed-day, fixed-shape newsletter that subscribers can plan around — has 2.3× the open rate of a variable-cadence newsletter in our internal tests (n=18 weeks).",
        sourceUrl: "https://signals.gitdealflow.com/transparency",
        sourceLabel: "Transparency report",
      },
      {
        claim:
          "The `/api/v1/signals.json?sort=delta` endpoint is free, no auth, and refreshes every Monday — so a Friday pull gives you four-day-old-data, the freshest weekly cadence stable across the week.",
        sourceUrl: "https://signals.gitdealflow.com/api/v1/signals.json",
        sourceLabel: "Live signals feed",
      },
    ],
    faqs: [
      {
        q: "What if I don't have a newsletter yet?",
        a: "Start with Beehiiv free tier. Five-minute setup. The newsletter compounds slowly — assume 6 weeks of weekly ship before you see growth. The mechanic is consistency, not virality.",
      },
      {
        q: "Can I commercialize this?",
        a: "Yes — we'd just ask that you credit the signals feed (a single line at the bottom: 'Data: GitDealFlow public signals feed'). Many of the most-loved finance newsletters started this way.",
      },
      {
        q: "What about competitive risk — won't I cannibalize my own deal flow?",
        a: "The opposite happens in practice. Publishing your pattern-matching publicly attracts founders to send you their own deals (so they show up in your newsletter), which is exactly the inbound flywheel you want.",
      },
    ],
    ctaUrl: "https://gitdealflow.com/#signup",
    ctaLabel: "Get this week's top-10 movers — free Sunday digest",
    builderAside: {
      text: "Prefer to wire it into your own stack? The same top-10 movers are one unauthenticated JSON pull (sort=delta, limit=10), free and refreshed every Monday.",
      url: "https://signals.gitdealflow.com/api/v1/signals.json?sort=delta&limit=10",
      label: "Raw signals feed (JSON)",
    },
    related: [
      "how-to-source-10-dev-tool-deals-in-a-week",
      "how-to-read-a-github-trendline-like-a-partner",
      "how-to-build-a-dream-100-of-github-orgs",
    ],
    keywords: [
      "deal flow newsletter",
      "vc newsletter playbook",
      "weekly github newsletter",
      "vc newsletter from github",
      "deal sourcing newsletter",
      "vc content marketing",
      "vc audience building",
      "vc dream 100 newsletter",
      "vc weekly cadence",
      "indie scout newsletter",
    ],
  },

  {
    slug: "how-to-turn-a-trending-repo-into-a-warm-intro",
    h1: "How to turn a trending repo into a warm intro (no cold-email)",
    description:
      "A four-touch sequence that turns a trending GitHub repo into a warm intro to the maintainer — Twitter, GitHub issue, public reply, then DM — over 10 days.",
    tldr:
      "Cold-email reply rates from GitHub maintainers are 3–6%. A four-touch sequence — substantive Twitter reply, helpful GitHub issue, public reply on their blog/talk, then a soft DM — runs at 28–35% over the same 10-day window.",
    body: `The mistake most people make with GitHub-sourced outreach is treating it as cold email. Maintainers of trending repos are getting 5–20 cold emails a week from VCs, scouts, recruiters, and platforms. The reply rate is single-digit and the conversion is barely measurable.

The fix is a four-touch warmup sequence over 10 days. Each touch is public (so the maintainer can see the consistency), specific to their work (so it can't be confused with a template), and not asking for anything (so the eventual DM is the first ask, not the third).

It works because by the time you DM, you're a familiar name with a track record of useful engagement. The DM is just the natural next step, not an interruption.`,
    totalTime: "PT2H",
    difficulty: "intermediate",
    prerequisites: [
      "A specific maintainer of a trending repo you want to talk to",
      "Public engagement appetite (this whole playbook is performed in public)",
      "10 days of patience",
    ],
    tools: [
      "Twitter / X account",
      "GitHub account",
      "Your blog or LinkedIn for the public-reply step (optional)",
    ],
    steps: [
      {
        name: "Day 1 — substantive Twitter reply",
        text: "Find one of the maintainer's recent tweets. Reply with one specific observation — not a compliment, not 'great work', but a substantive engagement with the idea. Example: 'Curious about your choice of [X] over [Y] in your latest commit — I'd expect [Z] tradeoff but it sounds like you've worked around it.'",
        timeRequired: "PT20M",
      },
      {
        name: "Day 3 — helpful GitHub issue or PR",
        text: "Open a small, useful issue or PR on their repo. Useful means: a typo in the README is fine, but a small documentation improvement or an edge-case test is better. The bar is 'their merge button feels good to press'. Tag yourself as someone interested in the project, not someone selling.",
        timeRequired: "PT30M",
      },
      {
        name: "Day 5 — public reply to their writing or talk",
        text: "Find a recent talk, podcast appearance, or blog post by the maintainer. Reply publicly — on Twitter, in LinkedIn, on Hacker News, wherever the original is hosted. One paragraph engaging with one specific idea they put forward. Not a thread, not a hot take.",
        timeRequired: "PT30M",
      },
      {
        name: "Day 7 — quote-tweet one of their recent threads",
        text: "Quote-tweet (or LinkedIn-repost-with-comment) one of their threads from the last 2 weeks. Add one new piece of context they didn't have — a counter-example from a different domain, a related paper, a relevant historical anecdote.",
        timeRequired: "PT15M",
      },
      {
        name: "Day 10 — the soft DM",
        text: "Now DM. Keep it under 60 words. Don't reference the four prior touches — they're either remembered or they're not. The DM is: one sentence on why you're interested, one sentence on what specifically you'd want to talk about, one sentence offering value (a useful intro, an honest piece of feedback, a small check). Done.",
        timeRequired: "PT15M",
        toolUrl: "/firstlook",
        toolLabel: "See a real DM example on /firstlook",
      },
      {
        name: "Day 14 — single follow-up if no reply",
        text: "If no reply by day 14, one follow-up — and then stop. Repeated follow-ups on a DM convert worse than zero follow-ups; the maintainer either has bandwidth or doesn't, and your follow-up doesn't change that.",
        timeRequired: "PT10M",
      },
    ],
    facts: [
      {
        claim:
          "Cold-email reply rate from open-source maintainers averages 3–6% across our outreach experiments; the four-touch warmup sequence above runs at 28–35% in the same set.",
        sourceUrl: "https://signals.gitdealflow.com/transparency",
        sourceLabel: "Transparency report",
      },
      {
        claim:
          "Maintainers receive between 5–20 cold outreach messages per week once a repo crosses 500 stars, per maintainer interviews we ran 2025–2026.",
        sourceUrl: "https://signals.gitdealflow.com/research",
        sourceLabel: "Research index",
      },
    ],
    faqs: [
      {
        q: "Isn't four touches kind of stalker-ish?",
        a: "All four are public engagements that anyone could make for any reason. The maintainer is welcome to ignore them entirely — there's no demand on their time until day 10. The warmup is to your familiarity, not to their attention budget.",
      },
      {
        q: "What if I don't have a Twitter following?",
        a: "Doesn't matter for this playbook. The touches are 1:1 engagements, not broadcasts. A reply from a 30-follower account that engages substantively is more memorable than a like from a 30k-follower account that doesn't.",
      },
      {
        q: "Does this work for non-Twitter maintainers?",
        a: "Yes — substitute the platform. Mastodon, Bluesky, LinkedIn, dev.to, Lobsters — wherever the maintainer is actually active. The mechanic is 'engage where they engage', not 'use Twitter'.",
      },
    ],
    ctaUrl: "/firstlook",
    ctaLabel: "See a worked outreach example",
    related: [
      "how-to-source-10-dev-tool-deals-in-a-week",
      "how-to-build-a-dream-100-of-github-orgs",
      "how-to-find-your-first-investable-saas-on-github",
    ],
    keywords: [
      "warm intro github maintainer",
      "vc outreach playbook",
      "github maintainer outreach",
      "vc cold email alternative",
      "warm dm vc",
      "github founder outreach",
      "four touch outreach",
      "no cold email vc",
      "vc relationship building",
      "open source outreach",
    ],
  },

  {
    slug: "how-to-build-a-dream-100-of-github-orgs",
    h1: "How to build a Dream-100 of GitHub orgs (community-led VC sourcing)",
    description:
      "A community-led playbook for building a 100-org watchlist that produces compounding deal flow — modeled on the Dream-100 distribution discipline but applied to GitHub.",
    tldr:
      "Pick 100 GitHub orgs you'd be proud to have in your portfolio in five years. Track their repos weekly, engage publicly with their work monthly, send one personal note quarterly. After 18 months, ~40 of them will know your name; 8–12 will have introduced you to a founder.",
    body: `The Dream-100 discipline — pick a hundred high-leverage relationships and compound them quarterly — is one of the most underrated sales mechanics in software. It maps cleanly to GitHub because GitHub orgs are public, persistent, and have built-in surface area for engagement (issues, PRs, discussions, contributors).

This playbook gives you the exact mechanic for building, tracking, and compounding a GitHub-flavored Dream-100. The output is not a marketing list — it's a relationship watchlist where every entry is one you'd want a deeper relationship with regardless of whether they ever take a meeting.

It works in 18-month chunks. The first six months feel like nothing. The second six months produce occasional warm intros. By month 18, the list is producing 8–12 active deal-flow conversations a quarter, almost entirely inbound.`,
    totalTime: "PT4H",
    difficulty: "advanced",
    prerequisites: [
      "Long-term mindset — this is an 18-month commitment, not a quarter",
      "A spreadsheet or simple CRM",
      "Willingness to publish in public consistently",
    ],
    tools: [
      "GitHub web UI",
      "GitDealFlow signals feed",
      "Spreadsheet / CRM / Notion",
      "Twitter / LinkedIn / your newsletter",
    ],
    steps: [
      {
        name: "Pick 100 orgs you'd be proud to have in your portfolio in 5 years",
        text: "Not 100 hot orgs. Not 100 funded orgs. 100 orgs where, if you were sitting on a cap table with them in 2031, you'd be quietly proud. Mix of well-known (PostHog-style) and lesser-known (single-maintainer indie projects you respect). Bias toward orgs whose values you understand, not orgs whose valuations you envy.",
        timeRequired: "PT60M",
      },
      {
        name: "Set up the watchlist spreadsheet",
        text: "One row per org. Columns: org URL, primary contact (maintainer name + handle), what they do in one line, current relationship state (cold / aware / acquainted / warm / friend), last meaningful interaction date, next planned touch.",
        timeRequired: "PT30M",
      },
      {
        name: "Tier the list by relationship state",
        text: "Tier 1 (warm/friend) = 5–15 orgs. Tier 2 (acquainted/aware) = 25–40 orgs. Tier 3 (cold) = 50–70 orgs. Each tier has a different cadence — Tier 1 = monthly touch, Tier 2 = quarterly touch, Tier 3 = semi-annual touch. Yes, this is intentionally slow.",
        timeRequired: "PT30M",
      },
      {
        name: "Set the weekly tracking pass",
        text: "Once a week (Tuesday afternoon, 30 min) — open the signals feed for the orgs on your list and note anything new. New repo, new committer, accelerating velocity, major release. Save the notes to your watchlist row — you'll mine them for touches later.",
        timeRequired: "PT30M",
        toolUrl: "https://signals.gitdealflow.com/api/v1/signals.json",
        toolLabel: "Live feed",
      },
      {
        name: "Run the monthly touch pass on Tier 1",
        text: "First Monday of every month, send 5–15 personal notes — one per Tier 1 org. The note references something you noticed in the weekly tracking. Examples: 'Saw you shipped v0.4 last week — the breaking change on [X] looks like it solves what we talked about at [conf]. How's adoption looking?' Never asking for anything. Never selling.",
        timeRequired: "PT60M",
      },
      {
        name: "Run the quarterly public engagement pass on Tier 2",
        text: "Once a quarter, write one piece of public content that elevates 5–10 Tier 2 orgs. A newsletter issue, a Twitter thread, a podcast episode if you have one. The point is that each Tier 2 org gets a tag or mention, not a DM. Public elevation builds Tier 2 → Tier 1 over time more reliably than 1:1 DM does.",
        timeRequired: "PT60M",
        toolUrl: "/book",
        toolLabel: "See a Dream-100 case study in the book",
      },
      {
        name: "Resort the list every 6 months",
        text: "Twice a year, move orgs between tiers based on relationship state. Orgs that have moved cold → warm graduate to Tier 1. Orgs that have moved warm → cold get demoted to Tier 2 or 3. The list itself can grow — but only by removing one org for each one you add. The 100 constraint is what makes it work.",
        timeRequired: "PT30M",
      },
    ],
    facts: [
      {
        claim:
          "Dream-100 lists that survive 18 months produce 8–12 active deal-flow conversations per quarter, almost entirely inbound, per our cohort tracking 2024–2025.",
        sourceUrl: "https://signals.gitdealflow.com/transparency",
        sourceLabel: "Transparency report",
      },
      {
        claim:
          "The 100-entry size is empirical, not magic — lists below 50 don't generate enough compounding, lists above 150 break the personal-touch cadence.",
        sourceUrl: "https://signals.gitdealflow.com/methodology",
        sourceLabel: "Methodology",
      },
    ],
    faqs: [
      {
        q: "Can I start smaller than 100?",
        a: "Yes — start with 20, get the cadence working, then grow. The fail mode is starting with 100 and dropping the cadence in month 3; better to start at 20, hold the cadence for a year, then expand.",
      },
      {
        q: "What if an org I picked turns out to be a bad culture fit?",
        a: "Drop them and add a new one in the semi-annual resort. The list is a working roster, not a museum. The bar is 'still proud to be associated' — if that breaks, the relationship doesn't compound, no matter how hot the org gets.",
      },
      {
        q: "How public should this be?",
        a: "The list itself stays private (it's your working board). The engagement is fully public — your monthly touches, your quarterly public-elevation pieces, your weekly tracking are all visible. Privacy of the list, publicness of the engagement.",
      },
    ],
    ctaUrl: "/book",
    ctaLabel: "Read the Dream-100 chapter in the free book",
    related: [
      "how-to-build-a-weekly-deal-flow-newsletter-from-github",
      "how-to-turn-a-trending-repo-into-a-warm-intro",
      "how-to-source-10-dev-tool-deals-in-a-week",
    ],
    keywords: [
      "dream 100 vc",
      "github dream 100",
      "vc relationship building",
      "community led vc sourcing",
      "vc watchlist",
      "long term vc sourcing",
      "compounding deal flow",
      "vc dream 100 list",
      "indie vc sourcing",
      "warm relationship vc",
    ],
  },
  {
    slug: "how-to-find-startups-to-invest-in",
    h1: "How to Find Startups to Invest In (Before They Raise)",
    description:
      "A step-by-step process to find startups to invest in before they raise, using GitHub commit-velocity and contributor-influx signals on top of your usual sourcing.",
    tldr:
      "Find startups to invest in before the round is announced by layering public GitHub signals (commit-velocity change, contributor influx, repo expansion) on top of your usual sourcing, then qualifying with a four-test rubric before you spend a founder minute.",
    body: `Most guidance on how to find startups to invest in stops at the obvious: network harder, read Crunchbase every morning, show up to demo days. Those channels work, but they put you in the same line as every other investor, bidding on the same 40 companies the week the round is announced.

The edge is in the six to eight weeks before that announcement. In that window a startup's public GitHub activity changes in measurable ways: commit velocity spikes, new contributors arrive, new repositories appear. Those changes show up in the commit graph before they show up in a press release, and they are free to read.

This playbook is the process we run on the operating side of GitDealFlow. It is designed for angels, scouts, and pre-seed through Series A investors who want a systematic source of candidates that is not yet crowded. Total time per week is roughly 40 minutes of focused work, plus whatever you spend on the calls you decide to take.

You do not need to be an engineer to use it. You need to know which numbers move when a team gets busy, and which ones mean nothing. That is what the four-test rubric below is for.`,
    totalTime: "PT40M",
    difficulty: "beginner",
    prerequisites: [
      "A target list of 3 to 5 sectors you actually understand (not a thesis you borrowed)",
      "A simple spreadsheet or CRM to hold your candidate shortlist",
      "Read access to the free signals feed at /api/v1/signals.json (no auth)",
    ],
    tools: [
      "GitDealFlow signals feed (free, no auth)",
      "GitHub web UI (commit and contributor inspection)",
      "A watchlist spreadsheet",
    ],
    steps: [
      {
        name: "Pick your sector slice",
        text: "Choose the 3 to 5 sectors where you have an actual information edge. Fetch the signal slice for each, for example https://signals.gitdealflow.com/api/v1/signals.json?sector=ai-ml. You are looking for the current top repos ranked by composite signal score.",
        timeRequired: "PT5M",
        toolUrl: "https://signals.gitdealflow.com/api/v1/signals.json?sector=ai-ml",
        toolLabel: "Open the live AI/ML feed",
      },
      {
        name: "Screen for acceleration, not size",
        text: "Ignore total commits and total stars. You want change: a repo whose 28-day commit velocity jumped relative to its own 90-day baseline. A steady 200 commits a week tells you nothing. Going from 80 to 240 in two weeks tells you something is happening. Filter for velocity-percentile and velocity-change, not raw volume.",
        timeRequired: "PT10M",
        toolUrl: "/methodology",
        toolLabel: "Read how velocity-change is computed",
      },
      {
        name: "Apply the four-test rubric",
        text: "For each shortlisted repo, check four things: (1) commit-velocity change over 14 to 28 days, (2) contributor growth (new people shipping, not one founder grinding), (3) new repository creation (platform building, not just polishing one repo), (4) a stack that matches the stated stage. Keep only candidates passing 3 of 4.",
        timeRequired: "PT10M",
        toolUrl: "/methodology",
        toolLabel: "Review the four-signal methodology",
      },
      {
        name: "Cross-check the team, not just the code",
        text: "Open the org's GitHub page and the founders' profiles. You are checking whether the signal has a face: is the acceleration driven by a real team, or by one prolific developer plus bots? Look for a named founder, a coherent org, and contributor diversity. Cut anything that is clearly a hobby project or an enterprise fork.",
        timeRequired: "PT8M",
      },
      {
        name: "Time-box your diligence before you reach out",
        text: "Run the five-checks-in-five-minutes pass: commit consistency, contributor growth, technology choices, new repo creation, and the ratio of product code to maintenance activity. This is a screen to decide whether a company deserves a real meeting, not a replacement for that meeting.",
        timeRequired: "PT5M",
        toolUrl: "/blog/github-due-diligence-for-vcs",
        toolLabel: "Read the five-checks diligence guide",
      },
      {
        name: "Reach out with a specific, non-generic note",
        text: "When you find a candidate, your first message should reference something only someone who actually looked would know: the spike in a specific repo, the new contributor pattern, the infrastructure you saw them building. That specificity is what gets a founder to reply to a cold note, and it is the thing a public GitHub signal gives you for free.",
        timeRequired: "PT2M",
        toolUrl: "/playbooks/how-to-turn-a-trending-repo-into-a-warm-intro",
        toolLabel: "See the warm-intro playbook",
      },
    ],
    facts: [
      {
        claim:
          "Commit-velocity change precedes public fundraise announcements by roughly 3 to 6 weeks in the startups GitDealFlow tracks.",
        sourceUrl: "https://signals.gitdealflow.com/methodology",
        sourceLabel: "Methodology",
      },
      {
        claim:
          "The single most predictive indicator is not commit volume but commit-velocity change: a steady 200 commits per week is neutral, while 80 to 240 inside 14 days is the pre-announcement pattern.",
        sourceUrl: "https://signals.gitdealflow.com/blog/commit-velocity-explained",
        sourceLabel: "Commit velocity explained",
      },
      {
        claim:
          "Half of the venture startups tracked show positive velocity growth in a given quarter, which means raw positive growth is not a signal; the size of the change relative to baseline is.",
        sourceUrl:
          "https://signals.gitdealflow.com/research/half-of-vc-startups-show-positive-velocity-growth",
        sourceLabel: "Research finding",
      },
    ],
    faqs: [
      {
        q: "How do I find startups to invest in without a network?",
        a: "Start from public signal feeds instead of warm intros. GitHub activity is public, timestamped, and free to read. A systematic weekly screen of 3 to 5 sectors will surface candidates weeks before they appear in your inbox. The network compounds later; the signal gives you a first source today.",
      },
      {
        q: "Do I need to know how to code to use GitHub signals?",
        a: "No. You need to know which numbers move when a team gets busy (commit-velocity change, contributor influx, new repos), not how to write the queries. The GitDealFlow feed pre-computes those numbers so you read ranked lists, not raw git logs.",
      },
      {
        q: "Is GitHub data enough to make an investment decision?",
        a: "No, and it should not be. Public GitHub data is a sourcing and screening layer. It tells you which companies deserve a technical deep dive and a founder call, not whether to wire the check. Use it to decide who gets a meeting, then do normal diligence.",
      },
      {
        q: "How is this different from just reading Crunchbase?",
        a: "Crunchbase tells you what already happened (a round closed, a hire announced). GitHub signals show you what is happening now, in the weeks before it becomes a Crunchbase entry. They answer the same question at different points in the timeline; use both.",
      },
      {
        q: "How many candidates should I expect per week?",
        a: "A focused 40-minute screen across 3 to 5 sectors typically yields 5 to 10 candidates worth a second look, of which 1 or 2 clear the four-test rubric and justify a founder call. That is a healthy weekly cadence for a solo angel or scout.",
      },
    ],
    ctaUrl: "https://gitdealflow.com/#signup",
    ctaLabel: "Get the weekly breakout-startup report",
    related: [
      "how-to-find-your-first-investable-saas-on-github",
      "how-to-spot-a-pre-seed-round-from-commit-velocity",
      "how-to-read-a-github-trendline-like-a-partner",
      "how-to-turn-a-trending-repo-into-a-warm-intro",
    ],
    keywords: [
      "how to find startups to invest in",
      "find startups to invest in",
      "how to find startups before they raise",
      "startup sourcing for angels",
      "startup discovery",
      "pre seed deal sourcing",
      "github deal sourcing",
      "angel investing sourcing",
      "startup scouting",
      "find breakout startups",
    ],
  },
];

export function getPlaybookBySlug(slug: string): Playbook | undefined {
  return playbooks.find((p) => p.slug === slug);
}

export function getAllPlaybookSlugs(): string[] {
  return playbooks.map((p) => p.slug);
}
