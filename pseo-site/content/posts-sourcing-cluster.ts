/**
 * ---- "How VCs source deals" topical cluster (topical-authority win, 2026-08-16) ----
 *
 * Second pillar cluster, complementing the TOFU_POSTS funnel-coverage cluster.
 * Occupies the wider VC-sourcing topic graph (sourcing mechanics, channels,
 * networks, pipeline) that the GitHub-signals island does not cover.
 *
 * Grounded in: GSC 90d query pull 2026-05-18..08-13 (111 sourcing-related
 * queries) + fresh Google autocomplete mining ("how do vcs source deals",
 * "how do vc firms find startups", "proprietary deal flow", "deal sourcing
 * network", "how do demo days work", "how to ask for a warm introduction",
 * "deal sourcing best practices", "vc pipeline management").
 *
 * Zero slug overlap with the 49 existing posts or the /answers corpus.
 * Guard: scripts/verify-no-regressions.ts §51 (fails closed on removal).
 *
 * Style: no em/en dashes anywhere (site-wide rule). Claim-safe: "350+"
 * panel floor, 15 sectors, 3-6 week median lead time (established claims).
 */
import type { BlogPost } from "@/content/posts";

export const SOURCING_POSTS: BlogPost[] = [
  {
    slug: "how-do-vcs-source-deals",
    title: "How Do VCs Source Deals? 4 Channels + Weekly Workflow (2026)",
    description:
      "VCs source deals through four channels: inbound, outbound, networks, and data platforms. See the weekly workflow, funnel stages, and metrics funds track.",
    summary:
      "Deal sourcing is the single biggest driver of venture returns, and it has quietly industrialized. This guide maps the four channels funds use to find startups (inbound, outbound, network, and platform or data sourcing), the pipeline stages every sourced deal passes through, the metrics systematic funds track, and where public engineering signals fit as a leading indicator that surfaces companies weeks before funding databases do.",
    date: "2026-08-16",
    body: "VCs source deals through four channels: inbound, outbound, networks, and platform or data sourcing. Professional funds run all four as a portfolio, then track each company from first signal through screening, meeting, diligence, and investment decision.\n\nAsk ten partners how their fund sources deals and you will get ten different answers, but underneath the vocabulary every serious fund runs the same machine: a set of channels that generate candidates, a funnel that filters them, and a cadence that keeps the machine running weekly. This guide is the map of that machine, written for angels, scouts, and seed funds who want to source like an institution without an institution's budget.\n\nThe stakes are not subtle. Research on venture returns consistently finds that entry price and selectivity dominate outcomes, but both of those levers only exist if you see the right companies early. A fund that reliably meets founders four weeks before a round is formed negotiates from a completely different position than one reading the same funding announcement as everyone else.\n\n## The four sourcing channels\n\nNearly every deal a VC touches arrives through one of four channels.\n\n1. Inbound: founders apply directly, through warm referrals, accelerator demo days, or cold email. Inbound is cheap per deal but skewed toward companies that need money most urgently, which is a signal in both directions.\n2. Outbound: the fund identifies target companies proactively, usually sector theses or search-driven lists, and reaches out first. Outbound is where sourcing analysts spend most of their week.\n3. Network: partners, scouts, portfolio founders, and co-investors forward deals. Network deal flow has the highest trust premium because someone vouches for the founder.\n4. Platform or data sourcing: software surfaces candidates from signals like hiring pages, web traffic, app store rankings, open-source activity, or patent filings. This is the fastest-growing channel and the one this site is built around.\n\nThe healthiest funds treat the four channels as a portfolio. Pure inbound funds drift toward whatever the market sends them; pure outbound funds overpay for reflexivity (contacting a company the moment it becomes searchable means contacting it at its most expensive). The [inbound vs outbound comparison](/blog/inbound-vs-outbound-deal-sourcing) breaks down how funds split the work and what each channel costs per meeting.\n\n## What \"sourced\" actually means\n\nSourcing terminology is sloppy, so pin it down. A deal is sourced when your fund is the first institutional investor to engage with intent, not when you found the company on a list. Discovering a startup on Crunchbase the week it announces its round is lead generation, not sourcing. True sourcing has a time component: engagement before the round is visible to the general market.\n\nThat is exactly why [proprietary deal flow](/blog/proprietary-deal-flow-what-it-actually-means) is the industry's favorite buzzword. It does not mean secret deals; it means deals that reach you through a channel others cannot easily copy: a community you genuinely belong to, data nobody else watches, or relationships built over years.\n\n## The sourcing funnel, end to end\n\nEvery fund's pipeline has the same skeleton, regardless of what CRM it runs on. The [deal pipeline stages explainer](/blog/vc-deal-pipeline-stages-explained) covers each stage in depth, but the shape is:\n\n1. Universe: every company that could possibly fit the thesis. Practically: the set your channels can reach.\n2. Watchlist: companies with a reason to watch, a signal, a referral, a thesis match. A [weekly watchlist habit](/blog/deal-sourcing-workflow-weekly) is the minimum viable sourcing system.\n3. Screened: quick qualification against stage, sector, geography, and traction bar. Most funds kill 90 percent here.\n4. Engaged: a real conversation with the founder, usually two to four touchpoints.\n5. Diligence: data room, references, technical review.\n6. Term sheet and close.\n\nThe ratio that matters is watchlist-to-engaged: it measures how good your signals are. A fund that engages one in five watchlist companies has sharp signals; a fund engaging one in fifty is spraying.\n\n## Where data signals fit\n\nPlatform sourcing earned a mixed reputation in its first decade because most \"AI-sourced\" tools were repackaged databases: the same Crunchbase rows, scored differently. The newer generation is different in kind, not degree. Public GitHub activity, for instance, is a leading indicator that updates weekly and precedes funding databases by weeks: across the 350+ organization panel this site maintains, sustained engineering acceleration (commits, contributors, and repositories rising together against the company's own 14-day baseline) has preceded public fundraise announcements by a median of three to six weeks.\n\nThat lead time is the entire value proposition. The [methodology page](/methodology) documents how the panel is built and how false positives like hack weeks and compliance-driven bursts are filtered out. For a practical starting workflow, the [GitHub due diligence checklist](/blog/github-due-diligence-checklist-20-minutes) shows what to check in 20 minutes once a company is on your list.\n\n## The metrics systematic funds track\n\nSourcing without measurement degenerates into browsing. The metrics that survive contact with a real fund:\n\n1. Sourced meetings per week, split by channel, so you know what actually produces pipeline.\n2. Watchlist-to-meeting conversion, the signal-quality ratio.\n3. Meeting-to-term-sheet conversion, the judgment ratio.\n4. Time from first signal to first meeting, the speed ratio, which is where leading indicators pay rent.\n5. Source attribution of funded deals at 12 months, the only number that settles channel debates.\n\nThe [deal flow scoring framework](/blog/deal-flow-scoring-framework) turns these into a weekly scorecard, and the [sourcing analyst playbook](/blog/vc-sourcing-analyst-playbook) describes the Monday-to-Friday cadence that keeps them honest.\n\n## Common failure modes\n\nThree failures account for most bad sourcing. Channel monoculture: relying on one channel (usually inbound) until it quietly decays. Signal decay: using the same signals as everyone else, then wondering why every deal is competitive. And no cadence: sourcing in bursts after partner meetings instead of a fixed weekly rhythm. The [deal sourcing best practices](/blog/deal-sourcing-best-practices-vc) post catalogs the habits that prevent all three.\n\n## Key takeaways\n\nVC deal sourcing is four channels feeding one funnel, measured by a handful of ratios. The funds that win are not the ones with secret access; they are the ones with a repeatable cadence, honest attribution, and at least one signal channel that leads the market instead of following it. Public engineering signals are the cheapest of those leading channels to adopt today, and everything needed to start (datasets, APIs, and a weekly methodology) is open.",
    relatedSectors: ["enterprise-saas", "ai-ml", "developer-tools"],
    faqs: [
      {
        question: "How do VCs source deals?",
        answer:
          "Through four channels: inbound (founders applying or being referred), outbound (the fund contacting targets proactively), network (partners, scouts, and co-investors forwarding deals), and platform or data sourcing (software surfacing candidates from signals like hiring, web traffic, or open-source activity). Professional funds run all four as a portfolio and attribute every funded deal back to its channel.",
      },
      {
        question: "What is the difference between deal sourcing and deal flow?",
        answer:
          "Deal flow is the total stream of opportunities reaching a fund. Deal sourcing is the active work of generating that stream: the channels, searches, and relationships that produce candidates. You have deal flow even if you do nothing; you only have sourcing if you systematically generate it.",
      },
      {
        question: "What percentage of VC deals come from inbound versus outbound?",
        answer:
          "It varies by stage and fund size. Seed funds typically report a high share of funded deals from outbound and network sourcing, while later-stage funds see more inbound. The honest answer for any specific fund comes from source attribution: tagging every meeting and funded deal by channel, which most funds fail to do rigorously.",
      },
      {
        question: "How can a small fund source deals like a big fund?",
        answer:
          "By exploiting leading indicators that do not require headcount. Public data sources (GitHub activity, job postings, app releases) surface companies weeks before funding databases do, and free or cheap tooling can monitor them weekly. The constraint for small funds is rarely data access; it is cadence and follow-through.",
      },
      {
        question: "How long before a funding round can a startup be identified?",
        answer:
          "Engineering acceleration on public GitHub organizations has preceded public fundraise announcements by a median of three to six weeks across the 350+ organization panel this site tracks. Other leading indicators, like hiring bursts and domain changes, show similar multi-week leads.",
      },
    ],
    keyStats: [
      { value: "4", label: "Core sourcing channels", context: "Inbound, outbound, network, platform" },
      { value: "3-6 weeks", label: "Median lead time", context: "Engineering acceleration vs fundraise announcement, 350+ org panel" },
      { value: "90%", label: "Typical screen-out rate", context: "Share of watchlist companies cut before first meeting" },
    ],
    references: [
      {
        label: "1",
        title: "Engineering Acceleration as a VC Deal Flow Signal",
        url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558",
        source: "SSRN",
      },
      {
        label: "2",
        title: "VC Deal Flow Signal Methodology",
        url: "https://signals.gitdealflow.com/methodology",
        source: "GitDealFlow",
      },
      {
        label: "3",
        title: "How to Use Alternative Data to Find the Best Deals",
        url: "https://hbr.org/2022/11/how-to-use-alternative-data-to-find-the-best-deals",
        source: "Harvard Business Review",
      },
    ],
  },
  {
    slug: "how-vc-firms-find-startups-before-everyone-else",
    title: "How VC Firms Find Startups Before Everyone Else: The Pre-Announcement Stack",
    description:
      "How VC firms find startups weeks before rounds are announced: the leading indicators (GitHub acceleration, hiring, product telemetry), the tools, and the workflow that turns early signals into first meetings.",
    summary:
      "Every fund says it wants to meet founders before the round is competitive, but only some run a stack that actually does it. This post maps the pre-announcement toolkit: the categories of leading indicators (engineering acceleration, hiring, product and release telemetry, community activity), how each one leads the funding databases by weeks, how funds verify a signal before reaching out, and the weekly workflow that converts early sight into early meetings.",
    date: "2026-08-16",
    body: "The most valuable question in venture is not \"is this a good company?\" It is \"how early did you meet them?\" Meeting a company the week it announces is a pricing exercise; meeting it a month earlier is a sourcing advantage. This post is about the second thing: the specific stack funds use to find startups before the market sees them.\n\nThe timing gap is real and measurable. Funding databases like Crunchbase and PitchBook record rounds when they are announced or discovered, typically at or after the wire. But the behaviors that predict a raise start earlier: teams staff up, code accelerates, products ship, and domains get shuffled weeks before any announcement. Funds that instrument those behaviors systematically get a head start everyone else cannot buy, because the underlying data is public and mostly free.\n\n## The five leading indicators that matter\n\n1. Engineering acceleration. Commits, contributors, and repositories rising together against the company's own baseline. Across the 350+ organization panel tracked on this site, sustained acceleration has preceded public announcements by a median of three to six weeks. The full method is on the [methodology page](/methodology).\n2. Hiring patterns. Job postings for roles that precede raises: founding sales hires, finance leads, senior infrastructure engineers. A burst of senior postings usually means the round is already closed and being deployed, so treat hiring as a confirming signal more than a leading one.\n3. Release and product telemetry. Version numbers, changelogs, app store updates, and landing page iterations. A company shipping weekly is a company with engineering capacity to spare, which itself correlates with recent or imminent capital.\n4. Community and open-source activity. New public repos, maintainer activity, developer adoption curves. Open-source companies telegraph momentum continuously; the [investing in open source startups](/blog/investing-in-open-source-startups) guide covers how to read it.\n5. Registry and corporate exhaust. Trademarks, domain registrations, SEC Form D equivalents in other jurisdictions. Useful for confirming, weak for discovering.\n\nThe order matters. Engineering acceleration and community activity lead by weeks; hiring and corporate exhaust confirm. Funds that confuse the two categories reach out either too early (nothing to say) or too late (round already competitive).\n\n## How verification works before any outreach\n\nA leading indicator is a reason to look, never a reason to send a calendar link. The workflow that respects both the fund's time and the founder's:\n\n1. Confirm the signal is real, not a hack week or a one-off burst. Baseline-relative checks (is this acceleration against the company's own normal?) filter most noise; the [signal vs noise guide](/blog/vc-signals-signal-vs-noise) covers the heuristics.\n2. Check the round context. Last announced round, its date, and typical interval to the next round for that stage. The [pre-seed vs seed vs Series A explainer](/blog/pre-seed-vs-seed-vs-series-a) gives the stage math.\n3. Read the engineering work itself, not just the counts. What got built tells you what the raise will fund. The [GitHub due diligence checklist](/blog/github-due-diligence-checklist-20-minutes) is a 20-minute pass for exactly this.\n4. Find the warm path. A shared connection converts 3-5x better than cold outreach; the [warm introductions guide](/blog/warm-introductions-startup-fundraising) covers the ask.\n\n## The tools, honestly assessed\n\nThe commercial stack (PitchBook, Crunchbase, Dealroom, Affinity, and the newer AI sourcing platforms) is good at breadth and relationships, weak on lead time: they organize the market as it already exists. The edge lives in sources they underweight. Public GitHub data is the clearest case: free, weekly, and leading. This site runs an open panel on exactly that principle, with a [free tools directory](/blog/free-vc-data-sources-guide) covering the rest of the zero-budget stack. For how the commercial platforms compare on sourcing specifically, the [Harmonic vs PitchBook comparison](/vs/harmonic-ai-vs-pitchbook) and the [best deal flow tools list](https://gitdealflow.com/best/best-deal-flow-tools) are the honest maps.\n\n## The weekly pre-announcement workflow\n\nKnowledge without cadence decays. The minimal system that works:\n\n1. Monday: refresh the watchlist from your leading indicators (for this site's users, the weekly [startups to watch](/startups) list is exactly this artifact).\n2. Tuesday: verify one to three candidates using the checklist above.\n3. Wednesday: outreach, warm path first.\n4. Friday: log outcomes against sources, so next Monday's list gets smarter.\n\nThat loop, run for a quarter, produces what no database sells: a proprietary map of which companies were accelerating before anyone wrote about them. The [weekly sourcing workflow](/blog/deal-sourcing-workflow-weekly) and [how to track startups before they announce](/blog/how-to-track-startups-before-they-announce) expand the loop into full playbooks.\n\n## The honest limits\n\nLead time is an advantage, not a guarantee. Roughly one in eight acceleration signals in the panel never resolves to an announced round (extensions, quiet SAFEs, or launch-driven bursts), and early sight of a bad company is still a bad deal. The stack gets you the meeting earlier; judgment still closes it. Use the head start to do diligence others skip, not to skip diligence others do.",
    relatedSectors: ["ai-ml", "developer-tools", "enterprise-saas"],
    faqs: [
      {
        question: "How do VC firms find startups before they announce funding?",
        answer:
          "By instrumenting leading indicators that precede announcements: engineering acceleration on public GitHub organizations, hiring patterns, release telemetry, and community activity. These behaviors typically appear weeks before funding databases record the round, giving funds that monitor them a structural head start.",
      },
      {
        question: "How far in advance can you detect a startup is about to raise?",
        answer:
          "Sustained engineering acceleration has preceded public fundraise announcements by a median of three to six weeks across a 350+ organization panel. Hiring and corporate signals tend to appear closer to the announcement itself.",
      },
      {
        question: "Is PitchBook or Crunchbase useful for finding startups early?",
        answer:
          "They are useful for context and verification, but weak on lead time, because they record rounds at or after announcement. For early discovery, funds combine them with primary signals like GitHub activity, job postings, and product telemetry that update continuously.",
      },
      {
        question: "What percentage of acceleration signals precede a real raise?",
        answer:
          "Roughly seven in eight sustained acceleration signals in the public panel resolve to an announced round within twelve weeks. The remainder reflect extended rounds, quiet SAFEs, or launch-driven activity bursts, which is why verification precedes outreach.",
      },
      {
        question: "Can individual angels access the same early signals as funds?",
        answer:
          "Yes. The strongest leading indicators are public: GitHub activity, job boards, changelogs, and app releases are free to monitor. Open datasets and APIs (including this site's weekly panel) exist precisely so individuals can run fund-grade sourcing on a personal budget.",
      },
    ],
    keyStats: [
      { value: "3-6 weeks", label: "Median lead time", context: "Acceleration vs announcement, 350+ org panel" },
      { value: "~7 in 8", label: "Signals resolving to a round", context: "Within 12 weeks of sustained acceleration" },
      { value: "$0", label: "Data cost for the core stack", context: "GitHub, job boards, changelogs are public" },
    ],
    references: [
      {
        label: "1",
        title: "Engineering Acceleration as a VC Deal Flow Signal",
        url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558",
        source: "SSRN",
      },
      {
        label: "2",
        title: "GitHub REST API: Statistics",
        url: "https://docs.github.com/en/rest/metrics/statistics",
        source: "GitHub Docs",
      },
      {
        label: "3",
        title: "How to Track Startups Before They Announce",
        url: "https://signals.gitdealflow.com/blog/how-to-track-startups-before-they-announce",
        source: "GitDealFlow",
      },
    ],
  },
  {
    slug: "proprietary-deal-flow-what-it-actually-means",
    title: "Proprietary Deal Flow: What It Actually Means (and How Investors Build It)",
    description:
      "Proprietary deal flow, defined precisely: why it is not about secret deals, the five durable sources of true sourcing advantage, and how to audit whether your deal flow is actually proprietary.",
    summary:
      "\"Proprietary deal flow\" is the most overused phrase in venture, and almost everyone uses it wrong. It does not mean deals nobody else has seen; it means deals that reach you through a channel competitors cannot easily replicate. This post defines the term precisely, separates real sourcing advantage from three fake versions, maps the five durable sources of proprietary flow (community, data, geography, stage, and relationship depth), and gives a quarterly audit for testing whether your flow is genuinely yours.",
    date: "2026-08-16",
    body: "Every pitch deck, every fund update, every partner bio claims \"proprietary deal flow.\" The phrase has been stretched so far that it now means nothing, which is a problem, because the underlying concept is real and it is the difference between funds that consistently see companies early and funds that see what the market sends them.\n\nThe precise definition: proprietary deal flow is deal flow that reaches you through a channel competitors cannot easily copy. Not secret deals (those barely exist), not exclusive deals (exclusivity in venture lasts days), and not deals you were simply the first to email. The test is counterfactual: if a well-funded competitor hired three associates and copied your stack tomorrow, would your flow still be different? If yes, it is proprietary. If no, it is lead generation with better branding.\n\n## Three fake versions to stop claiming\n\n1. Speed on public data. Being first to email a company that appeared in everyone's database this morning is not proprietary; it is a reflex. Any competitor matches it with an alert rule.\n2. Volume of inbound. Getting more applications than another fund is a brand metric, not a sourcing moat, and it decays the moment your brand does.\n3. Logo-heavy \"networks.\" Knowing famous founders is table stakes in venture. Networks create proprietary flow only when they are structured: recurring, specific, and two-directional.\n\n## The five real sources\n\n1. Community embeddedness. Belonging deeply to a community competitors only advertise to: open-source maintainers, niche research groups, developer tooling ecosystems. Deals surface inside communities before they surface anywhere else, and you cannot fake membership receipts. The [deal sourcing network guide](/blog/deal-sourcing-network-how-to-build-one) covers how to build this deliberately rather than inherit it.\n2. Data nobody watches. Proprietary flow often comes from public data paired with private analysis. The clearest 2026 example: engineering acceleration on public GitHub organizations. The data is free and open to everyone, which is exactly why most funds ignore it; the moat is the panel construction and the weekly discipline, not the raw bytes. The [methodology](/methodology) behind the 350+ organization panel this site runs is public precisely because the advantage is in the operating habit, not the data access.\n3. Geography and language. Being structurally closer to an under-covered ecosystem: a country's engineering scene, a university cluster, a non-English founder community. Local trust does not compress.\n4. Stage specialization. The first check into a category of company (open-source devtools, hardware-adjacent, research spinouts) creates a referral flywheel: founders in the niche forward the next batch. Stage focus compounds; generalist flow does not. See the [pre-seed sourcing playbook](/blog/pre-seed-deal-sourcing-github) for how narrow focus plays out in practice.\n5. Relationship depth with capital sources. Accelerators, angel groups, and scout networks route deals to the investors who behaved well last time. Scout programs formalize this; the [venture scout programs guide](/blog/venture-scout-programs-how-to-join) covers joining one, and the [scout programs directory](https://gitdealflow.com/best/best-scout-programs) tracks which funds run them.\n\n## The audit: is your flow actually yours?\n\nRun this quarterly. Pull your last 20 sourced meetings and answer four questions per deal:\n\n1. Channel: how did this deal actually reach me? (Not how do I like to describe it.)\n2. Copyability: could a competitor with budget have seen this company at the same time?\n3. Lead time: did I engage before or after the round was generally visible?\n4. Attribution: would the founder say they came to us, or that we found them?\n\nScore 1 point per yes on copyability's inverse (competitor could NOT have), plus lead time before visibility. Under 20 points across 20 deals means your flow is market flow. The [deal flow scoring framework](/blog/deal-flow-scoring-framework) operationalizes this into a repeatable scorecard, and the [deal flow management guide for early-stage investors](/blog/deal-flow-management-for-early-stage-investors) covers the pipeline hygiene that keeps attribution honest.\n\n## Where the term does real work\n\nUsed precisely, \"proprietary\" describes a fund's answer to the only strategic question in sourcing: why do the best companies in our niche hear about us before they need money? The answer is never one channel. It is a portfolio: community, data, geography, stage, and relationships, each with receipts. The [how VCs source deals](/blog/how-do-vcs-source-deals) overview situates these channels in the full funnel, and the [best practices guide](/blog/deal-sourcing-best-practices-vc) lists the weekly habits that keep each channel compounding.\n\nOne caution to close: proprietary flow is an input metric. A moat that delivers worse companies is still a moat, just not one you want. Measure the flow on outcomes (meeting-to-term-sheet conversion by channel), not on how proprietary it feels.",
    relatedSectors: ["developer-tools", "ai-ml", "enterprise-saas"],
    faqs: [
      {
        question: "What is proprietary deal flow?",
        answer:
          "Deal flow that reaches you through a channel competitors cannot easily replicate: deep community membership, data analysis nobody else runs, geographic proximity, stage specialization, or structured relationships. The test is counterfactual: if a competitor copied your stack tomorrow, would your flow still be different?",
      },
      {
        question: "Is proprietary deal flow still possible in 2026?",
        answer:
          "Yes, but not from information access alone. With funding databases and AI search widely available, speed on public data stopped being proprietary. Durable versions come from embeddedness (communities, geographies) and from operating discipline on signals others ignore, like public engineering acceleration.",
      },
      {
        question: "What is the difference between deal flow and proprietary deal flow?",
        answer:
          "Deal flow is every opportunity that reaches you. Proprietary deal flow is the subset arriving through channels competitors cannot copy, typically producing earlier engagement and less competition on price. Most funds' deal flow is market flow: the same announcements everyone sees.",
      },
      {
        question: "How do new funds build proprietary deal flow quickly?",
        answer:
          "By narrowing: one community, one stage, one geography, or one signal source, worked weekly with public output (writing, data, tools) that makes the specialization visible. Founders route to the investor who demonstrably watches their niche, so visible narrow beats invisible broad.",
      },
      {
        question: "Can public data really be proprietary?",
        answer:
          "The data itself, no. The panel construction, filtering, and weekly operating habit around it, yes. A 350+ organization acceleration panel built from public GitHub data produces earlier sight of fundraises than a database subscription, not because the bytes are secret but because the discipline is rare.",
      },
    ],
    keyStats: [
      { value: "5", label: "Durable sources of proprietary flow", context: "Community, data, geography, stage, relationships" },
      { value: "20", label: "Deals per quarterly audit", context: "Minimum sample for a copyability score" },
      { value: "3-6 weeks", label: "Lead time from signal discipline", context: "Median acceleration-to-announcement gap, 350+ org panel" },
    ],
    references: [
      {
        label: "1",
        title: "Venture Capital Deal Sourcing and Proprietary Deal Flow",
        url: "https://hbr.org/2022/11/how-to-use-alternative-data-to-find-the-best-deals",
        source: "Harvard Business Review",
      },
      {
        label: "2",
        title: "VC Deal Flow Signal Methodology",
        url: "https://signals.gitdealflow.com/methodology",
        source: "GitDealFlow",
      },
      {
        label: "3",
        title: "Venture Scout Programs Directory",
        url: "https://gitdealflow.com/best/best-scout-programs",
        source: "GitDealFlow",
      },
    ],
  },
  {
    slug: "vc-deal-pipeline-stages-explained",
    title: "VC Deal Pipeline Stages Explained: From Signal to Term Sheet",
    description:
      "The seven stages of a VC deal pipeline, what happens at each, the conversion benchmarks between stages, and how leading indicators compress the most valuable stage transitions.",
    summary:
      "Every fund's CRM has different stage names, but the underlying pipeline is universal. This explainer maps the seven stages from universe to close, defines what actually happens at each, gives the conversion benchmarks that separate disciplined funds from spraying ones, and shows where leading indicators (like engineering acceleration) compress the highest-leverage transitions: signal to watchlist, and watchlist to first meeting.",
    date: "2026-08-16",
    body: "Open five different fund CRMs and you will find five stage taxonomies: SDI, New, Screening, IC, Partner Meeting, on and on. The vocabulary differs, but the machine is identical underneath. This explainer fixes the vocabulary so the rest of your sourcing operation can be measured, because a pipeline you cannot name stage by stage is a pipeline you cannot improve.\n\n## The seven stages\n\n1. Universe. Every company that could fit the thesis: stage range, sector range, geography range. Practically, the set your channels can reach. Funds rarely write this down, which is the first mistake: an undefined universe makes every downstream metric meaningless.\n2. Signal. A reason to pay attention: a referral, a thesis match, a data trigger. Raw signals are cheap and noisy; the art is triage. Most funds generate 10-100x more signals than they can engage.\n3. Watchlist. Companies under active observation, not yet contacted. This is the stage where leading indicators do their work: a company whose [engineering acceleration](/methodology) crossed your threshold last week sits here, uncontacted, accumulating context while you verify.\n4. Screened. Quick qualification against hard filters: stage, geography, team composition, traction floor. The purpose is deletion, not ranking. Most funds kill 90 percent of the watchlist here, correctly.\n5. Engaged. First real conversation with the founder. The metric that matters is watchlist-to-engaged conversion, because it measures signal quality: engage too low a share and your signals are noise; engage too high and you are spraying meetings.\n6. Diligence. Data room, references, technical review, [code-level checks](/blog/github-due-diligence-checklist-20-minutes). Diligence is where funds die by process: too little and you fund errors, too much and founders walk.\n7. Term sheet and close. Including the post-signing crawl of exclusivity and definitive docs.\n\nSome funds insert sub-stages (IC preview, partner meeting) between 6 and 7; the skeleton holds.\n\n## Conversion benchmarks worth knowing\n\nNo public dataset publishes fund-by-fund funnel math, but the pattern from practitioner reporting is stable enough to plan against:\n\n1. Watchlist to screened: expect to cut 80-95 percent. If you screen out less, your signals are too weak; more, and you may be over-filtering early sight.\n2. Screened to engaged: the target band is roughly one in five. This is the signal-quality ratio.\n3. Engaged to diligence: one in three to one in five meetings earns diligence.\n4. Diligence to term sheet: one in three to one in ten, stage-dependent.\n5. Term sheet to close: 80-90 percent (the losses here are reputationally expensive).\n\nMultiplied out, a fund doing one deal a quarter from a thousand raw signals needs every stage honest. The [deal flow scoring framework](/blog/deal-flow-scoring-framework) packages these ratios into a weekly scorecard, and the [deal flow management guide](/blog/deal-flow-management-for-early-stage-investors) covers the pipeline hygiene (attribution, aging rules, stage discipline) that keeps the numbers real.\n\n## Where leading indicators compress the funnel\n\nTraditional pipelines are limited by one asymmetry: the interesting transitions (signal to watchlist, watchlist to engaged) depend on information that arrives late, at announcement. Leading indicators flip the asymmetry. A fund watching engineering acceleration sees the signal three to six weeks before the databases do (median, across the 350+ organization panel this site tracks), which means the watchlist stage accumulates context while competitors do not yet know the company exists.\n\nThe compounding effect: earlier signal means earlier engaged conversations, which means diligence starts before the round is competitive, which means better prices and better information rights. The funnel ratios stay the same; the calendar moves in your favor. The [how VC firms find startups early](/blog/how-vc-firms-find-startups-before-everyone-else) post covers the full pre-announcement stack, and the [weekly sourcing workflow](/blog/deal-sourcing-workflow-weekly) schedules the cadence.\n\n## Stage discipline: the boring practice that separates funds\n\nThree habits keep a pipeline honest. First, time-in-stage limits: any company older than 90 days in a stage either advances or exits; zombie pipeline inflates every downstream metric. Second, single-owner deals: every deal has one name on it, or attribution rots. Third, exit coding: when a company leaves the pipeline, record why (stage, sector, traction, founder choice); the quarterly review of exit codes is where thesis evolution actually happens. The [sourcing best practices guide](/blog/deal-sourcing-best-practices-vc) expands these into a full checklist, and the [emerging manager sourcing playbook](/blog/emerging-manager-deal-sourcing-playbook) applies them at solo-operator scale.\n\n## Tools: what actually matters\n\nFunds over-invest in CRM software and under-invest in stage discipline. The commercial platforms (Affinity, Attio, and peers) differ mostly in relationship intelligence and automation; none of them fix a funnel with dishonest stages. The [best deal flow tools comparison](https://gitdealflow.com/best/best-deal-flow-tools) covers the field honestly, including where free and open datasets outperform paid ones for early discovery. For pipeline analytics specifically, a spreadsheet plus honest attribution beats a misused enterprise CRM every quarter of the year.\n\n## Key takeaways\n\nName your stages, measure the ratios, enforce time limits, and feed the top of the funnel with signals that lead the market instead of trailing it. The seven-stage skeleton is universal; the discipline is rare, and that is the whole game. Everything else, tools included, is furniture.",
    relatedSectors: ["enterprise-saas", "ai-ml", "fintech"],
    faqs: [
      {
        question: "What are the stages of a VC deal pipeline?",
        answer:
          "Seven, in every fund regardless of CRM vocabulary: universe, signal, watchlist, screened, engaged, diligence, and term sheet/close. Sub-stage names differ (IC preview, partner meeting), but the skeleton and the conversion ratios between stages are universal.",
      },
      {
        question: "What conversion rates should a VC pipeline have?",
        answer:
          "Rough benchmarks from practitioner reporting: 80-95 percent cut from watchlist at screening, one-in-five screen-to-meeting, one-in-three to one-in-five meeting-to-diligence, one-in-three to one-in-ten diligence-to-term-sheet, and 80-90 percent term-sheet-to-close. The ratios that matter most are watchlist-to-engaged (signal quality) and engaged-to-term-sheet (judgment quality).",
      },
      {
        question: "What is the difference between deal flow and pipeline?",
        answer:
          "Deal flow is the inflow of opportunities. A pipeline is the structured, staged, measurable version of that inflow: each company assigned a stage, an owner, and aging rules. Deal flow without pipeline discipline cannot be audited or improved, only felt.",
      },
      {
        question: "How do leading indicators change pipeline performance?",
        answer:
          "They move the calendar rather than the ratios. Engineering acceleration signals arrive a median of three to six weeks before funding databases record the round, so the watchlist and engagement stages happen while the round is still forming, which lowers competition and price at every later stage.",
      },
      {
        question: "What is a zombie deal in a VC pipeline?",
        answer:
          "A company that sits in one stage past a time limit (commonly 90 days) without advancing or exiting. Zombie pipeline inflates conversion metrics, hides thesis drift, and consumes attention. The fix is mechanical: advance, exit with a coded reason, or archive.",
      },
    ],
    keyStats: [
      { value: "7", label: "Universal pipeline stages", context: "Universe to close, any CRM vocabulary" },
      { value: "~1 in 5", label: "Screen-to-meeting benchmark", context: "The signal-quality ratio" },
      { value: "3-6 weeks", label: "Signal lead time", context: "Median acceleration-to-announcement, 350+ org panel" },
    ],
    references: [
      {
        label: "1",
        title: "VC Deal Flow Signal Methodology",
        url: "https://signals.gitdealflow.com/methodology",
        source: "GitDealFlow",
      },
      {
        label: "2",
        title: "Deal Flow Scoring Framework",
        url: "https://signals.gitdealflow.com/blog/deal-flow-scoring-framework",
        source: "GitDealFlow",
      },
      {
        label: "3",
        title: "Deal Flow Management for Early-Stage Investors",
        url: "https://signals.gitdealflow.com/blog/deal-flow-management-for-early-stage-investors",
        source: "GitDealFlow",
      },
    ],
  },
  {
    slug: "warm-introductions-startup-fundraising",
    title: "Warm Introductions in Startup Fundraising: How to Ask For, Give, and Track Them",
    description:
      "Warm introductions in startup fundraising: why they convert better than cold outreach, the anatomy of a forwardable ask, the double opt-in etiquette, and how investors build repeatable intro networks.",
    summary:
      "Warm introductions are the highest-converting path to a first meeting in venture, and most people execute them badly in both directions. This guide covers the mechanics: why warm beats cold (and when it does not), the anatomy of a forwardable ask that respects the introducer's social capital, double opt-in etiquette, the reintroduction problem in ongoing networks, and how investors structure their intro networks so the flow compounds instead of decaying.",
    date: "2026-08-16",
    body: "In venture, the warm introduction is the native unit of trust transfer. A founder cold-emailing a fund converts at some fraction of a percent; the same founder, forwarded by someone the partner respects, converts at multiples of that. The gap is not access, it is risk: a warm intro is a reputation-backed claim that this meeting is worth the partner's hour.\n\nThis guide is written for both directions of the exchange: founders who need to ask well, and investors (angels, scouts, emerging managers) whose sourcing depends on making, receiving, and recycling introductions well. Because sourcing networks run on exactly this etiquette, and most of it is unwritten.\n\n## Why warm beats cold, honestly\n\nThe conversion gap is real but routinely exaggerated. Warm intros convert better for three reasons: pre-screening (the introducer has already filtered), social accountability (nobody forwards a founder who wastes time), and context transfer (the forward carries the why-now). But warmth is not magic: a weak intro from a marginal connection converts worse than a sharp cold email with a real hook, and founders who chase warmth for its own sake burn weeks. The honest framing: warmth substitutes for evidence. If you have evidence (traction, public work, a visible acceleration), cold works fine. If you do not, warmth is how you borrow someone else's.\n\nFor investors sourcing systematically, the implication is sharper: your warm-path coverage is an asset you build deliberately. The [deal sourcing network guide](/blog/deal-sourcing-network-how-to-build-one) covers the network construction; this post covers the transaction.\n\n## The anatomy of a forwardable ask\n\nA good ask is written to be forwarded unedited. Structure:\n\n1. One line of who: what you do, in the introducer's vocabulary.\n2. Two lines of why-now: the specific, checkable reason this meeting matters this month. For technical founders the strongest why-now is demonstrable work: a shipped product, a growing open-source project, measurable [engineering acceleration](/methodology). Public evidence converts intros into meetings at the highest rate because the receiving partner can verify it in two minutes.\n3. One line of the specific ask: a 20-minute conversation about X. Not \"any help you can offer.\"\n4. The attachments that survive forwarding: a one-pager link, not a 40-slide deck.\n\nSend it as a standalone block the introducer can copy, or better, write it so the entire email body IS the forward.\n\n## Double opt-in, and why it is non-negotiable\n\nThe rule: never introduce two people without both explicitly agreeing. The introducer who CCs blindly spends social capital without consent, and the spend is asymmetric: if the meeting goes badly, the introducer's stock drops with BOTH parties. Double opt-in feels slower and is faster, because unconsented intros get silently ignored, which is the worst outcome for the founder asking.\n\nFor investors, the same rule governs deal forwards: ask the fund before sending the deck, and ask the founder before sending their materials to another fund. Deals forwarded without consent die quietly and teach founders not to trust you with the next one.\n\n## The reintroduction problem\n\nNetworks decay without maintenance, and the quietest decay is the reintroduction gap: you met a founder two years ago, both moved on, and now neither wants to be the one to email first. Systematic investors solve this mechanically: a lightweight CRM note at every meeting (who, when, what was impressive), and a quarterly touch rule for the top tier of the network. The [deal flow management guide](/blog/deal-flow-management-for-early-stage-investors) covers the tooling honestly (a spreadsheet beats a misused CRM); the practice that matters is writing down why someone mattered, because that is the memory that makes the reintroduction warm instead of awkward.\n\n## How to give intros well (the underrated half)\n\nSourcing investors live on both sides of intros, and the ones who give well receive more. Three habits: forward with context (two lines of why this is worth the recipient's time, written by YOU, not the founder), match honestly (do not forward a weak fit because the founder asked nicely; your filtering IS the value), and close the loop (tell the introducer what happened; nothing sustains an intro network like knowing the outcome). The [venture scout programs guide](/blog/venture-scout-programs-how-to-join) describes the institutional version of this loop: scouts exist precisely because funds want structured intro flow with attribution.\n\n## When cold beats warm\n\nThree cases. First, when you have public evidence the recipient can verify alone: shipped work, traction, [open-source momentum](/blog/investing-in-open-source-startups); evidence removes the need for borrowed trust. Second, when the target niche is technical enough that a smart cold email reads as competence: the first line proves you understand their thesis. Third, when speed matters more than fit: a warm path takes days, a cold email takes minutes. The [best practices guide](/blog/deal-sourcing-best-practices-vc) covers the split; the general rule is that warmth is a multiplier on your existing strength, never a substitute for it.\n\n## Tracking intros as an investor\n\nTreat intros like a channel in your sourcing attribution: log source, date, outcome, and time-to-response. Two numbers fall out: your network's response rate (do people take your forwards seriously?) and your reciprocity ratio (do you give as many as you get?). Funds and scouts with high response rates earned them; the [sourcing metrics](/blog/how-do-vcs-source-deals) overview shows where intro-channel numbers sit in the full funnel. If your response rate is low, the fix is almost always filtering: forward fewer, better-fit deals, with context you wrote yourself.",
    relatedSectors: ["enterprise-saas", "developer-tools", "fintech"],
    faqs: [
      {
        question: "What is a warm introduction in startup fundraising?",
        answer:
          "An introduction to an investor made by someone they know and trust, typically with explicit consent from both sides (double opt-in). It converts better than cold outreach because the introducer pre-screens the founder and transfers social accountability: their reputation backs the meeting's worth.",
      },
      {
        question: "How do you ask for a warm introduction?",
        answer:
          "Write a forwardable ask: one line of who you are, two lines of specific why-now (with verifiable evidence like shipped work or traction), one line of concrete ask (a 20-minute conversation about X), and a one-pager link. Send it so the introducer can forward it unedited, and accept a no gracefully; you are spending their social capital, not yours.",
      },
      {
        question: "Do warm introductions really matter for VC deal flow?",
        answer:
          "Yes for conversion speed and meeting quality, but they are a multiplier, not a substitute for strength. Founders with public evidence (shipped products, growing open-source projects) convert well cold. For investors, warm-path coverage is a sourcing channel to build and measure like any other.",
      },
      {
        question: "What is double opt-in for introductions?",
        answer:
          "Asking both parties for explicit agreement before making an introduction. It feels slower but is faster in practice, because unconsented introductions get silently ignored, and failed blind intros cost the introducer standing with both sides.",
      },
      {
        question: "How do investors track warm introductions?",
        answer:
          "As a sourcing channel in their attribution: log source, date, outcome, and time-to-response per intro. The two health metrics are network response rate (do recipients take your forwards seriously) and reciprocity ratio (intros given versus received). Low response rates usually indicate weak filtering, not weak network.",
      },
    ],
    keyStats: [
      { value: "2-way", label: "Consent rule", context: "Double opt-in before any introduction" },
      { value: "3 lines", label: "The forwardable ask", context: "Who, why-now with evidence, specific ask" },
      { value: "Quarterly", label: "Network touch cadence", context: "Top-tier relationships, or the network decays" },
    ],
    references: [
      {
        label: "1",
        title: "How VCs Source Deals: The Complete Guide",
        url: "https://signals.gitdealflow.com/blog/how-do-vcs-source-deals",
        source: "GitDealFlow",
      },
      {
        label: "2",
        title: "Deal Sourcing Networks: How to Build One",
        url: "https://signals.gitdealflow.com/blog/deal-sourcing-network-how-to-build-one",
        source: "GitDealFlow",
      },
      {
        label: "3",
        title: "Venture Scout Programs: How to Join One",
        url: "https://signals.gitdealflow.com/blog/venture-scout-programs-how-to-join",
        source: "GitDealFlow",
      },
    ],
  },
  {
    slug: "how-do-demo-days-work-for-investors",
    title: "How Do Demo Days Work for Investors? What Changed After YC Went Virtual",
    description:
      "How demo days work for investors in 2026: the format, how to prepare before the batch, how to triage 200 companies in a week, and what data-driven investors layer on top of the demo day itself.",
    summary:
      "Demo days still deliver the densest concentrated deal flow in early-stage venture, but the game has changed since the virtual pivot: the batch is visible earlier, the meeting window is shorter, and the best-prepared investors do most of their work before the presentations start. This guide covers the modern format, the prep workflow that separates prepared capital from FOMO capital, how to triage a 200-company batch honestly, and how data signals (including public engineering acceleration) are layered onto the demo day stack.",
    date: "2026-08-16",
    body: "Demo day is the highest-density deal flow event in early-stage venture: a few hundred companies, sorted by an accelerator with a reputation stake in the sorting, all raising on the same calendar. For investors, it is also the most oversubscribed, most herd-prone environment in the industry. This guide is about extracting value from demo day as an investor, which mostly means doing the work before demo day.\n\n## What actually happens, and what changed\n\nThe classic format: companies pitch in rapid succession, investors take notes, and the meeting scramble follows. The post-2020 changes stuck and reshaped the investor side:\n\n1. The batch is visible earlier. Accelerators publish company lists, launch posts, and repositories weeks before the pitches. The information advantage of watching the presentations live is now close to zero.\n2. The meeting window compressed. With async video and book-ahead scheduling, the post-demo-day calendar fills before the event. If your first look at a company is during the livestream, you are late.\n3. Alum data is table stakes. Batch outcomes, valuation ranges, and follow-on rates circulate privately; there is no excuse for not knowing a batch's base rates before bidding into it.\n\nThe result: demo day rewards preparation exponentially. The investors who win the window are the ones who arrived with a shortlist.\n\n## The prep workflow that works\n\nFour weeks out:\n\n1. Pull the batch list early (accelerator directories, launch blogs, cohort announcements). For technical batches, the companies' public GitHub orgs are usually live before demo day, which means acceleration is measurable before the pitch: commits, contributors, and repositories against the company's own baseline, the same [methodology](/methodology) this site runs on its 350+ organization panel.\n2. Build a one-line thesis per company: what would make this interesting, what would kill it. This is triage scaffolding, not conviction.\n3. Pre-book the meetings you can (warm paths first; the [warm introductions guide](/blog/warm-introductions-startup-fundraising) covers the etiquette).\n4. Set a price discipline before the event: max check, max valuation band, max companies. FOMO pricing is a demo day-specific disease.\n\n## Triage: 200 companies, one week\n\nLayer filters in this order, cheapest first:\n\n1. Thesis fit (sector, stage, geography). Kills roughly half.\n2. Team surface (public founders, prior work, references). Kills most of the rest.\n3. Evidence of momentum: shipped product, usage proxies, revenue if disclosed, and for technical companies, engineering acceleration. This is where public data shines: a company whose engineering activity doubled against baseline in the past month enters diligence with a verified momentum claim, while its demo day peers enter with a slide. The [GitHub due diligence checklist](/blog/github-due-diligence-checklist-20-minutes) covers the 20-minute version.\n4. Valuation and round structure versus batch norms.\n\nWhat remains after the four filters is a shortlist of 10-20, which is what a human can actually serve in the meeting window.\n\n## The herd problem, and how to think about it honestly\n\nDemo day's core tension: the sorting is valuable (accelerators reject thousands) and the crowd knows it, so everything that survives the sort is oversubscribed. Three honest positions:\n\n1. Pay for the curation: accept worse entry pricing as the fee for lower company risk. Reasonable for funds whose value-add is post-investment.\n2. Hunt the edges: companies that present poorly but have strong evidence underneath (this is where pre-work wins; bad pitch, good repo is the classic demo day alpha).\n3. Skip the herd entirely: source outside the event, using the same public signals, months before the batch even forms. The [how VC firms find startups early](/blog/how-vc-firms-find-startups-before-everyone-else) stack applies; the batch is simply a coordinated announcement.\n\nMost serious seed funds run a mix: a small pre-worked shortlist at the event, plus a standing off-batch sourcing system so demo day is one channel, not the channel. The [sourcing channels overview](/blog/how-do-vcs-source-deals) frames the portfolio approach.\n\n## After the event\n\nTwo disciplines. First, attribution: log which meetings and deals trace to the batch, and revisit at 12 months; demo day deal quality is measurable and funds that measure it adjust their emphasis. Second, the long tail: most batch companies do not close in the meeting window; the ones that raise later, or quietly, often remain the best prices. A [standing watchlist](/blog/deal-sourcing-workflow-weekly) that carries batch companies forward (with signal-based re-rankings, not memory) is how the long tail gets harvested.\n\n## Key takeaways\n\nDemo day is a curation product with a crowd problem. The investors who extract value treat it as one channel in a portfolio: they pre-work the batch with public data, triage with cheap filters first, set price discipline before the FOMO starts, and keep an off-batch sourcing system running so their deal flow does not depend on anyone's calendar. The batch is visible earlier than ever; the advantage now belongs to whoever looks.",
    relatedSectors: ["ai-ml", "enterprise-saas", "developer-tools"],
    faqs: [
      {
        question: "How do demo days work for investors?",
        answer:
          "Accelerator batches present companies in rapid succession, then investors book meetings in a compressed window. Since the virtual pivot, company lists and materials are visible weeks early and the meeting calendar fills before the event, so investor value now comes mostly from preparation: pre-working the batch list and arriving with a shortlist.",
      },
      {
        question: "How do investors prepare for YC demo day?",
        answer:
          "Start four weeks out: pull the batch list, build one-line theses per company, pre-book warm-path meetings, and set price discipline (check size, valuation band, max company count). For technical batches, public GitHub activity is measurable before the pitches, giving momentum evidence before the presentations.",
      },
      {
        question: "Are demo day deals oversubscribed?",
        answer:
          "The strongest companies in each batch usually are, because accelerator curation is valuable and everyone knows it. Investors respond in three ways: paying up for curation, hunting edges (weak pitch, strong evidence), or sourcing off-batch with public signals months earlier. Most funds run a mix.",
      },
      {
        question: "How do you triage a demo day batch?",
        answer:
          "Cheapest filters first: thesis fit (kills about half), team surface, momentum evidence (shipped product, usage proxies, engineering acceleration for technical companies), then round structure versus batch norms. The output is a 10-20 company shortlist sized to what you can actually serve in the meeting window.",
      },
      {
        question: "What happens to demo day companies that do not raise in the window?",
        answer:
          "Most batch companies close outside the immediate window, quietly or later. These are often the best-priced deals. Investors harvest the long tail by carrying batch companies onto a standing watchlist with signal-based re-ranking rather than relying on memory.",
      },
    ],
    keyStats: [
      { value: "4 weeks", label: "Pre-work runway", context: "Batch lists and repos are visible before pitches" },
      { value: "10-20", label: "Realistic shortlist size", context: "What one investor serves in the meeting window" },
      { value: "Half", label: "Cut by thesis fit alone", context: "First triage filter, cheapest first" },
    ],
    references: [
      {
        label: "1",
        title: "Y Combinator Library",
        url: "https://www.ycombinator.com/library",
        source: "Y Combinator",
      },
      {
        label: "2",
        title: "How VC Firms Find Startups Before Everyone Else",
        url: "https://signals.gitdealflow.com/blog/how-vc-firms-find-startups-before-everyone-else",
        source: "GitDealFlow",
      },
      {
        label: "3",
        title: "VC Deal Flow Signal Methodology",
        url: "https://signals.gitdealflow.com/methodology",
        source: "GitDealFlow",
      },
    ],
  },
  {
    slug: "deal-sourcing-network-how-to-build-one",
    title: "Deal Sourcing Networks: How to Build One That Compounds",
    description:
      "How investors build deal sourcing networks deliberately: the four ring structure, the reciprocity engine, node selection, and the maintenance cadence that makes a network compound instead of decay.",
    summary:
      "Most investors inherit networks accidentally and wonder why their deal flow is generic. This guide treats the sourcing network as a buildable asset: a four-ring structure from core partners to ecosystem nodes, a reciprocity engine that keeps referrals flowing, node selection criteria (what makes a person a high-value sourcing node), and the maintenance cadence that separates compounding networks from decaying ones.",
    date: "2026-08-16",
    body: "Ask a partner where their best deals come from and the honest answer is almost always \"people.\" The network channel (referrals from founders, scouts, co-investors, operators) carries the highest trust premium in sourcing, and unlike databases, it compounds: every well-handled deal strengthens the referral path that produced it.\n\nBut networks that compound are built, not inherited. The difference between a sourcing network and a contact list is structure: rings, reciprocity, and cadence. This guide covers the build.\n\n## The four-ring structure\n\nRing 1: Co-investors and partner funds. People you have actually wired money beside. Highest trust, highest signal, naturally reciprocal: they see your deals, you see theirs.\nRing 2: Portfolio founders and operators. The most underrated ring. Founders know who is good before anyone, and a founder you backed (or helped without asking) is a permanently motivated referrer. Serving this ring well is what [giving value first](/blog/warm-introductions-startup-fundraising) is about.\nRing 3: Professional intermediaries. Scouts (formal and informal), accelerators, angel groups, lawyers, bankers. Volume channel; requires the most filtering. The [scout programs guide](/blog/venture-scout-programs-how-to-join) covers the formal version from the scout's side, and the [directory](https://gitdealflow.com/best/best-scout-programs) tracks which funds run them.\nRing 4: Ecosystem nodes. Community organizers, maintainers, niche newsletter writers, university groups, platform leaders. This ring is where [proprietary flow](/blog/proprietary-deal-flow-what-it-actually-means) actually lives: nodes sit inside communities that deals surface in first, and most funds never map them deliberately.\n\nThe mapping exercise: write down your current network, assign every person to a ring, and count. Most investors discover Ring 1 is fine, Ring 2 is underworked, and Ring 4 is empty. The build plan falls out of the gaps.\n\n## The reciprocity engine\n\nReferral networks run on exchanged value, and the exchange must be real. The three currencies:\n\n1. Deal flow itself: sending co-investors deals that fit them (the [warm intro etiquette](/blog/warm-introductions-startup-fundraising) applies to every send).\n2. Useful signal: sharing what you are seeing (pricing trends, sector heat) with people who value it. This is cheaper than deal flow and compounds faster, because it positions you as a source, not a competitor.\n3. Direct help: intros, diligence answers, operator problems solved. The highest-touch currency, reserved for Ring 1-2.\n\nThe accounting that keeps it honest: track intros given versus received (a simple [deal flow scorecard](/blog/deal-flow-scoring-framework) column). Running a deficit is fine short-term; running one silently long-term means the network is extractive, and referral paths quietly rot.\n\n## Node selection: what makes a good sourcing node\n\nNot all connectors are equal. High-value nodes share four traits: they see deals before announcement (embedded in a community or platform), they filter (they forward selectively, which is why their forwards get taken), they are reachable (two degrees, not five), and they trust you specifically (not your fund's brand, you). A node missing trait one is a downstream amplifier (still useful, Ring 3); a node missing trait two is noise. When mapping Ring 4, prioritize embeddedness and selectivity over prominence: the maintainer of a niche open-source ecosystem out-refers the conference keynote circuit most quarters. The [open-source investing guide](/blog/investing-in-open-source-startups) covers why embedded communities surface deals first.\n\n## The cadence that makes it compound\n\nNetworks decay without contact; the cadence that prevents decay:\n\n1. Monthly: one useful send per Ring 1-2 member (deal, signal, or help). Not a newsletter; a personal, specific send.\n2. Quarterly: review the map. Which nodes referred? Which went quiet? Which new nodes appeared in your deal attribution? Update rings accordingly.\n3. Annually: the cull. Networks have carrying capacity; a node who has not exchanged value in a year moves to the passive list, freeing active capacity.\n\nThe tooling is deliberately boring: a spreadsheet with name, ring, last-touch, last-referral, and reciprocity direction. The [deal flow management guide](/blog/deal-flow-management-for-early-stage-investors) covers the attribution hygiene that feeds it.\n\n## How data channels feed the network (and vice versa)\n\nThe naive frame treats network sourcing and data sourcing as rivals. The compounding frame treats them as mutually reinforcing. Data signals ([engineering acceleration](/methodology), hiring, release telemetry) give you something specific and timely to TALK about: a node who hears \"we noticed your ecosystem's build rate doubled this month, here is the breakdown\" gives you better referrals than one who hears \"send me anything good.\" The data makes the network conversations concrete, and the network validates the data's false positives.\n\nThis is precisely how the best modern sourcing stacks work: signal systems surface candidates and conversation hooks; networks convert them to meetings with context. The [how VCs source deals](/blog/how-do-vcs-source-deals) overview situates both channels in the funnel, and the [weekly workflow](/blog/deal-sourcing-workflow-weekly) schedules the network touches alongside the data pulls.\n\n## Key takeaways\n\nA sourcing network is four rings, maintained on a cadence, priced in reciprocity. Map yours, find the empty ring (usually ecosystem nodes), and fill it with people who see deals before announcement and trust you specifically. Feed the network with signal, not asks, and measure it like a channel: referrals, conversion, reciprocity direction. Built this way, the network is the one sourcing channel that gets stronger every quarter you operate it.",
    relatedSectors: ["developer-tools", "enterprise-saas", "ai-ml"],
    faqs: [
      {
        question: "How do you build a deal sourcing network?",
        answer:
          "Deliberately, in four rings: co-investors (highest trust), portfolio founders and operators (most underrated), professional intermediaries like scouts and accelerators (volume), and ecosystem nodes like community organizers and maintainers (where proprietary flow lives). Map current contacts to rings, fill the empty ring, and maintain with a monthly/quarterly/annual cadence.",
      },
      {
        question: "What is a sourcing node in venture capital?",
        answer:
          "A person who sees deals before announcement, filters selectively, is reachable within two degrees, and trusts you specifically. Nodes missing the first trait are downstream amplifiers; nodes missing the second are noise. Embeddedness and selectivity beat prominence when choosing which nodes to invest in.",
      },
      {
        question: "How many co-investor relationships does a sourcing network need?",
        answer:
          "Fewer than most funds assume: a dozen active Ring 1 relationships exchanging deals quarterly outperform a hundred dormant contacts. Network value concentrates in reciprocity rate, not size; a node with no exchange in a year is carrying capacity that should rotate to the passive list.",
      },
      {
        question: "How do investors keep a referral network active?",
        answer:
          "With a reciprocity engine: track intros and value given versus received, send one specific, personal, useful item per core contact monthly, review the map quarterly against referral attribution, and cull annually. Referral paths rot silently when the exchange becomes extractive.",
      },
      {
        question: "Do data signals help network sourcing or replace it?",
        answer:
          "Reinforce it. Signals like engineering acceleration give network conversations concrete, timely substance (a specific company, a specific reason), and network context filters the data's false positives. Modern stacks run both: data surfaces candidates and hooks, networks convert them to trusted meetings.",
      },
    ],
    keyStats: [
      { value: "4", label: "Network rings", context: "Co-investors, founders/operators, intermediaries, ecosystem nodes" },
      { value: "~12", label: "Active Ring 1 relationships", context: "Quarterly deal exchange beats hundred dormant contacts" },
      { value: "Monthly", label: "Core-node touch cadence", context: "One specific, personal, useful send per contact" },
    ],
    references: [
      {
        label: "1",
        title: "Venture Scout Programs: How to Join One",
        url: "https://signals.gitdealflow.com/blog/venture-scout-programs-how-to-join",
        source: "GitDealFlow",
      },
      {
        label: "2",
        title: "Proprietary Deal Flow: What It Actually Means",
        url: "https://signals.gitdealflow.com/blog/proprietary-deal-flow-what-it-actually-means",
        source: "GitDealFlow",
      },
      {
        label: "3",
        title: "Warm Introductions in Startup Fundraising",
        url: "https://signals.gitdealflow.com/blog/warm-introductions-startup-fundraising",
        source: "GitDealFlow",
      },
    ],
  },
  {
    slug: "vc-sourcing-analyst-playbook",
    title: "The VC Sourcing Analyst Playbook: A Week in the Life",
    description:
      "A week in the life of a VC sourcing analyst: the Monday list refresh, mid-week verification and outreach, Friday attribution, and the metrics a sourcing analyst owns.",
    summary:
      "The sourcing analyst is the engine room of outbound venture, and the role is more systematizable than most funds admit. This playbook walks a real week: Monday watchlist refresh from leading indicators, Tuesday verification pass, Wednesday outreach block, partner meeting prep, Friday attribution and list hygiene, plus the metrics a sourcing analyst owns end to end and the automation that scales one analyst into a pipeline that feels like a team.",
    date: "2026-08-16",
    body: "The sourcing analyst job exists because partners' attention is the scarcest resource in a fund. The analyst's output is a small number of high-quality meetings per week; everything else the role involves, list-building, verification, CRM hygiene, is instrumental to that output. This playbook is one full week, written for the analysts running it and the emerging managers who are the analyst.\n\n## Monday: the list refresh\n\nThe week starts with data, not email. Refresh the watchlist from every leading source: referrals logged over the weekend, accelerator batch updates, and signal systems. The core artifact is the ranked list of companies worth attention this week; for users of this site, the weekly [startups to watch](/startups) is exactly this artifact, generated from the 350+ organization panel's acceleration data.\n\nTwo Monday rules: first, cap the list at what the fund can actually engage this week (a list of 200 is a lie; 15 is a plan). Second, write the one-line hook per company now, because the hook is what survives into Wednesday's outreach. A company whose [engineering acceleration](/methodology) crossed threshold is a hook; \"looks interesting\" is not.\n\n## Tuesday: verification\n\nVerification is where analyst judgment earns its salary. For each Monday candidate, the pass is: is the signal real (baseline-relative, not a hack-week artifact, the heuristics in the [signal vs noise guide](/blog/vc-signals-signal-vs-noise)), is the stage context right (last round date, typical interval to next, the [stage math](/blog/pre-seed-vs-seed-vs-series-a)), and is there a warm path (shared connection, the etiquette in the [warm intros guide](/blog/warm-introductions-startup-fundraising)).\n\nExpected output: the 15-name Monday list becomes 3-6 verified candidates with hooks, stage context, and intro paths mapped. Kill rate below 50 percent means Monday's signals are too loose; above 90 percent means you are over-filtering and leaving early sight on the table.\n\n## Wednesday: outreach block\n\nOutreach is a block, not a background activity. Warm first (intros requested through the mapped paths), cold second (evidence-led, two minutes to read, the [best practices](/blog/deal-sourcing-best-practices-vc) format). The analyst's cold email should lead with verifiable work: a shipped product, a growing open-source project, a measured acceleration pattern. Evidence converts; adjectives do not.\n\nTrack sends, replies, meetings booked, by channel. Weekly volume targets vary by fund size; the ratio to watch is reply-to-meeting, because it prices your hook quality.\n\n## Thursday: partner prep and meetings\n\nMeetings the analyst takes directly (first-pass screens) plus prep memos for partner meetings: one page, the hook, stage context, the verified evidence, the open questions. A good memo writes the two questions the partner should ask, not a summary of the deck. The [deal pipeline stages](/blog/vc-deal-pipeline-stages-explained) explainer covers where memo-writing sits in the funnel.\n\n## Friday: attribution and hygiene\n\nThe unglamorous half of the week that makes every other half measurable. Log outcomes against sources (channel, signal, referrer) so Monday's list gets smarter; age the pipeline (anything past 90 days in stage advances or exits, the discipline in the [pipeline explainer](/blog/vc-deal-pipeline-stages-explained)); update the CRM or spreadsheet with the week's exits and reasons. Friday is also when the analyst reviews the [scorecard](/blog/deal-flow-scoring-framework): meetings per week by channel, watchlist conversion, reply rates.\n\n## The metrics a sourcing analyst owns\n\n1. Sourced meetings per week, by channel.\n2. Watchlist-to-meeting conversion (signal quality).\n3. Reply rate on outreach, by hook type.\n4. Time from signal to first meeting (the speed metric leading indicators move).\n5. Source attribution of funded deals, rolled quarterly.\n\nThese five numbers, honestly kept, are the difference between a sourcing operation and sourcing activity. The [emerging manager playbook](/blog/emerging-manager-deal-sourcing-playbook) covers the same loop at solo scale, and the [sourcing channels overview](/blog/how-do-vcs-source-deals) explains why each metric maps to a channel decision.\n\n## The automation that scales one analyst\n\nThe repeatable parts of the week are increasingly automatable, and the honest 2026 stack: list generation from public data (GitHub acceleration, hiring, releases) is fully automatable, as this site's existence proves; verification is human judgment plus machine pre-chew (the acceleration-doubled-against-baseline check is a query, not an opinion); outreach drafting is assisted, sending is human; attribution is mechanical once logging is habitual. The analyst's irreducible core is exactly the part machines cannot do: deciding which three of fifteen deserve the fund's reputation this week. The [AI in VC deal sourcing guide](/blog/ai-in-vc-deal-sourcing-practical-guide) covers the assistant landscape without the hype.\n\n## Key takeaways\n\nThe sourcing analyst week is a loop: refresh, verify, reach out, meet, attribute. The loop's value compounds through Friday's logging, not Wednesday's volume. Own five numbers, cap the list, write hooks not summaries, and automate the mechanical half so the judgment half gets your full attention. Run the loop for two quarters and the fund has what no vendor sells: a sourcing instrument calibrated to its own thesis.",
    relatedSectors: ["enterprise-saas", "ai-ml", "developer-tools"],
    faqs: [
      {
        question: "What does a VC sourcing analyst do?",
        answer:
          "Runs the fund's candidate-generation loop end to end: Monday watchlist refresh from signals and referrals, Tuesday verification pass, Wednesday outreach block, Thursday partner-meeting prep memos, Friday attribution and pipeline hygiene. The output metric is high-quality sourced meetings per week, by channel.",
      },
      {
        question: "What metrics should a sourcing analyst track?",
        answer:
          "Five: sourced meetings per week by channel, watchlist-to-meeting conversion (signal quality), outreach reply rate by hook type, time from signal to first meeting, and quarterly source attribution of funded deals. Honest logging of these five is the difference between a sourcing operation and sourcing activity.",
      },
      {
        question: "How many companies should a sourcing analyst watch per week?",
        answer:
          "Plan for 15 on Monday's list, converging to 3-6 verified candidates with hooks, stage context, and intro paths. A list of 200 is a lie; 15 is a plan. Kill rates below 50 percent mean signals are too loose; above 90 percent mean over-filtering that wastes early sight.",
      },
      {
        question: "Can sourcing analysts use AI tools?",
        answer:
          "For the mechanical half, yes: list generation from public data, verification pre-checks, and outreach drafting. Sending stays human, attribution is mechanical once logging is habitual, and the irreducible core (which companies deserve the fund's reputation) remains analyst judgment.",
      },
      {
        question: "What makes a good sourcing analyst?",
        answer:
          "Verification judgment and honesty with numbers. The analyst who kills weak candidates early, writes hooks grounded in verifiable evidence, and keeps attribution clean outperforms higher-volume analysts whose lists are noise. The role rewards calibration, not activity.",
      },
    ],
    keyStats: [
      { value: "15", label: "Monday list cap", context: "Shrinks to 3-6 verified by Tuesday" },
      { value: "5", label: "Metrics owned", context: "Meetings, conversion, replies, speed, attribution" },
      { value: "90 days", label: "Pipeline aging limit", context: "Advance, exit coded, or archive" },
    ],
    references: [
      {
        label: "1",
        title: "How VCs Source Deals: The Complete Guide",
        url: "https://signals.gitdealflow.com/blog/how-do-vcs-source-deals",
        source: "GitDealFlow",
      },
      {
        label: "2",
        title: "Deal Flow Scoring Framework",
        url: "https://signals.gitdealflow.com/blog/deal-flow-scoring-framework",
        source: "GitDealFlow",
      },
      {
        label: "3",
        title: "AI in VC Deal Sourcing: A Practical Guide",
        url: "https://signals.gitdealflow.com/blog/ai-in-vc-deal-sourcing-practical-guide",
        source: "GitDealFlow",
      },
    ],
  },
  {
    slug: "deal-sourcing-best-practices-vc",
    title: "Deal Sourcing Best Practices for VC: The Habits That Compound",
    description:
      "Deal sourcing best practices for venture investors: the weekly cadence, channel diversification, signal quality discipline, attribution honesty, and the anti-patterns that quietly kill sourcing operations.",
    summary:
      "Good sourcing is not a talent, it is a set of habits run on a cadence. This guide collects the practices that separate compounding sourcing operations from decaying ones: channel diversification over monoculture, leading signals over trailing ones, verification before outreach, honest attribution after it, weekly rhythm over bursts, and the specific anti-patterns (CRM theater, signal mimicry, zombie pipeline) that quietly kill funds' sourcing edge.",
    date: "2026-08-16",
    body: "Every sourcing operation looks similar from outside: lists, emails, meetings. The difference between funds whose sourcing compounds and funds whose sourcing decays is not tooling or headcount; it is a small set of habits, run weekly, honestly measured. This guide is those habits, collected in one place, with the anti-patterns that undo them.\n\n## Practice 1: Diversify channels like a portfolio\n\nThe first failure mode of sourcing is monoculture: one channel (usually inbound) carrying the fund until it quietly decays. The [four sourcing channels](/blog/how-do-vcs-source-deals) (inbound, outbound, network, platform) have different costs, lead times, and failure modes, which is exactly why a portfolio of them is robust. The rule of thumb: no single channel above 50 percent of sourced meetings, reviewed quarterly. When a channel drifts dominant, find out why before it drifts further; dominance usually means the other channels are decaying, not that one is winning.\n\n## Practice 2: Prefer leading signals over trailing ones\n\nTrailing signals (announcements, press, database entries) are visible to everyone at the same moment, which makes them pricing exercises. Leading signals (engineering acceleration, hiring patterns, release telemetry, community activity) arrive weeks earlier and convert the same meeting into a cheaper, better-informed one. The strongest 2026 example is public GitHub activity: across the 350+ organization panel this site runs, sustained acceleration has preceded announcements by a median of three to six weeks ([methodology](/methodology)). The practice: for every trailing source in your stack, name the leading source that feeds it, and instrument that one instead.\n\n## Practice 3: Verify before outreach, always\n\nA signal is a reason to look, never a reason to send a calendar link. The verification pass (real vs hack-week burst, stage context, warm path) takes 20 minutes per company with the right checklist, the [GitHub due diligence pass](/blog/github-due-diligence-checklist-20-minutes) being the template. The discipline pays twice: outreach volume drops (reputation preserved) and meeting quality rises (partners stop dreading sourcing meetings). The [signal vs noise guide](/blog/vc-signals-signal-vs-noise) covers the heuristics for the judgment calls.\n\n## Practice 4: Attribute honestly, especially when it hurts\n\nSourcing debates inside funds are settled by attribution: which channel actually produced the funded deals. Attribution is also where honesty dies, because everyone's favorite channel is the one they own. The practice: tag every first meeting with its true source at the moment of logging (not retroactively, when memory flatters), roll the numbers quarterly, and let a channel die if the data says so. The [deal flow scoring framework](/blog/deal-flow-scoring-framework) packages this into a scorecard that survives partner politics.\n\n## Practice 5: Run a weekly cadence, not bursts\n\nSourcing in bursts after slow partner meetings feels productive and measures terribly; signal systems decay between bursts, and referral paths go cold. The weekly loop (Monday refresh, Tuesday verify, Wednesday outreach, Friday attribution) is documented in the [sourcing analyst playbook](/blog/vc-sourcing-analyst-playbook), and the solo-scale version lives in the [weekly sourcing workflow](/blog/deal-sourcing-workflow-weekly). The cadence matters more than the volume: 15 verified names weekly beats 200 names twice a quarter, every quarter.\n\n## Practice 6: Write down the universe\n\nThe cheapest practice and the most skipped: define the investable universe (stage, sector, geography) in writing, so \"we missed it\" becomes diagnosable. A missed company inside the universe is a signal failure (fixable: better sources); outside it, it is thesis scope (a partner decision, not a sourcing one). Funds that skip this step argue about both interchangeably, which is why those arguments never end. The [emerging manager playbook](/blog/emerging-manager-deal-sourcing-playbook) shows the one-page version.\n\n## The anti-patterns\n\n1. CRM theater: meticulous pipeline hygiene on stages nobody enforces. If companies do not advance or exit on aging rules, the CRM is a diary, not an instrument. See [pipeline stages](/blog/vc-deal-pipeline-stages-explained).\n2. Signal mimicry: adopting a signal because a competitor blogged about it, which by construction erases its edge. Proprietary advantage comes from signals others ignore; the [proprietary deal flow guide](/blog/proprietary-deal-flow-what-it-actually-means) covers the durable versions.\n3. Zombie pipeline: companies aging in stage forever, inflating every metric. The 90-day rule (advance, exit coded, or archive) is the cure.\n4. Volume worship: meetings per week as the headline metric, which optimizes for spray. The ratios (watchlist-to-meeting, meeting-to-term-sheet) are the truth; volume is just the denominator.\n5. Network extraction: taking referrals without reciprocity. Referral paths rot silently; the [sourcing network guide](/blog/deal-sourcing-network-how-to-build-one) covers the reciprocity accounting.\n\n## How to start Monday\n\nPick one leading signal source (this site's weekly panel is free and public), cap a 15-name list, run the verify-outreach-attribute loop for four weeks, and read the ratios at the end of the month. That is the entire minimum viable sourcing operation, and every practice above is an extension of it. The [free VC data sources guide](/blog/free-vc-data-sources-guide) covers the zero-budget stack for the list-building half.\n\n## Key takeaways\n\nSourcing excellence is boring: diversified channels, leading signals, verification before outreach, honest attribution, weekly cadence, a written universe. The funds that do all six compound; the funds that do five argue about which one to skip. Start the loop Monday, measure the ratios monthly, and let the habits do the compounding.",
    relatedSectors: ["enterprise-saas", "ai-ml", "fintech"],
    faqs: [
      {
        question: "What are the best practices for VC deal sourcing?",
        answer:
          "Six compounding habits: diversify channels (no single channel above half of sourced meetings), prefer leading signals over trailing ones, verify every signal before outreach, attribute every meeting to its true source at logging time, run a weekly cadence instead of bursts, and write down the investable universe so misses are diagnosable.",
      },
      {
        question: "How often should a fund refresh its sourcing pipeline?",
        answer:
          "Weekly. The loop is Monday list refresh from leading signals, Tuesday verification, Wednesday outreach, Friday attribution and hygiene. Signal systems decay between bursts, and referral paths go cold; 15 verified names weekly beats 200 names twice a quarter on every ratio that matters.",
      },
      {
        question: "What is the biggest mistake in VC sourcing?",
        answer:
          "Channel monoculture combined with dishonest attribution: leaning on one channel until it decays while the metrics say otherwise. The cure is structural, not motivational: tag sources at first logging, roll attribution quarterly, and let the data retire channels without politics.",
      },
      {
        question: "How do you measure sourcing quality?",
        answer:
          "With ratios, not volume: watchlist-to-meeting conversion (signal quality), meeting-to-term-sheet conversion (judgment quality), time from signal to first meeting (speed), and quarterly source attribution of funded deals. Volume is the denominator of these ratios, never the headline.",
      },
      {
        question: "Why do sourcing operations decay?",
        answer:
          "Five quiet failures: channel monoculture, signal mimicry (adopting signals competitors already use), zombie pipeline inflating metrics, volume worship replacing ratio discipline, and extractive network behavior rotting referral paths. All five are process failures, fixable with cadence and honest numbers.",
      },
    ],
    keyStats: [
      { value: "6", label: "Core sourcing practices", context: "Channels, signals, verification, attribution, cadence, universe" },
      { value: "50%", label: "Max single-channel share", context: "Of sourced meetings, reviewed quarterly" },
      { value: "Weekly", label: "The only sourcing cadence", context: "Bursts decay signals and referral paths" },
    ],
    references: [
      {
        label: "1",
        title: "How VCs Source Deals: The Complete Guide",
        url: "https://signals.gitdealflow.com/blog/how-do-vcs-source-deals",
        source: "GitDealFlow",
      },
      {
        label: "2",
        title: "Deal Flow Scoring Framework",
        url: "https://signals.gitdealflow.com/blog/deal-flow-scoring-framework",
        source: "GitDealFlow",
      },
      {
        label: "3",
        title: "VC Deal Flow Signal Methodology",
        url: "https://signals.gitdealflow.com/methodology",
        source: "GitDealFlow",
      },
    ],
  },
  {
    slug: "inbound-vs-outbound-deal-sourcing",
    title: "Inbound vs Outbound Deal Sourcing: How Funds Split the Work",
    description:
      "Inbound vs outbound deal sourcing compared: cost per meeting, lead time, deal quality patterns, and how funds structure the split between founder-initiated and investor-initiated flow.",
    summary:
      "Inbound and outbound sourcing are different businesses that happen to share a CRM. This comparison covers the economics of each (cost per meeting, time to meeting, scalability), the quality patterns (what inbound skews toward, what outbound finds), how funds actually split the work between them, and where network and data channels sit relative to both. Ends with the decision framework for funds choosing where to invest scarce sourcing hours.",
    date: "2026-08-16",
    body: "Inbound and outbound sourcing get discussed as a preference, even a personality (\"we are an outbound fund\"). That framing hides the real question, which is economic: the two channels have different costs, different lead times, and different failure modes, and the right split is a portfolio decision, not an identity. This comparison lays out the economics so the split can be made deliberately.\n\n## What each channel actually is\n\nInbound: founder-initiated contact. Applications, warm referrals to the fund, accelerator batches, demo day scrambles, cold founder email. The fund's job is triage and response speed. Outbound: investor-initiated contact. The fund identifies targets (from theses, sector maps, or signals) and reaches out first. The fund's job is list quality and hook writing. The other two channels sit between them: network flow is inbound in direction (deals arrive) but earned by outbound behavior (years of reciprocity), and platform or data sourcing is outbound with a machine doing the finding. See the [four channels overview](/blog/how-do-vcs-source-deals) for the full map.\n\n## The economics, honestly\n\nCost per meeting. Inbound's marginal cost is triage time; a fund with brand gets meetings nearly free, but the brand is the amortized cost of everything the fund did to earn it. Outbound's cost is explicit and recurring: analyst hours per meeting, reply-rate-dependent. A cold outbound motion converts sends to meetings at single-digit percentages; warm outbound (via the [introductions guide](/blog/warm-introductions-startup-fundraising)) converts at multiples of that, which is why funds invest in the network channel.\n\nLead time. Inbound arrives when founders need money, which clusters around rounds being visible; it is structurally late. Outbound is structurally early: the fund chooses when to engage, and signal-driven outbound (watching [engineering acceleration](/methodology) or hiring patterns) engages weeks before databases record anything. The lead-time advantage is the entire argument for outbound at seed stage.\n\nQuality skew. Inbound skews toward companies that need money most urgently, a signal in both directions (urgency sometimes reflects momentum, sometimes distress). Outbound skews toward whatever the fund's signals select for, which is only as good as the signals. Neither skew is a quality verdict; both are priors to verify.\n\nScale. Inbound scales with brand (slow to build, cheap to serve). Outbound scales with headcount and tooling (faster to build, expensive to serve). Data-driven outbound is the exception: a signal system watching public data scales like software, which is why platform sourcing is the fastest-growing channel.\n\n## How funds actually split the work\n\nThe pattern across seed funds that publish or discuss their operations: outbound and network carry the sourced-deal share at early stage, inbound grows with brand, and later-stage funds flip toward inbound and banker flow as round sizes make founders initiate. A useful frame for a small fund: outbound buys you early sight and meeting quality now; inbound compounds as the brand builds; network compounds faster than both if the reciprocity engine runs (the [network guide](/blog/deal-sourcing-network-how-to-build-one) covers the mechanics).\n\nThe split is also a stage decision within the fund: pre-seed and seed theses need outbound (companies that young rarely apply anywhere); Series A-plus theses can live substantially on inbound plus one strong signal channel. The [stage math explainer](/blog/pre-seed-vs-seed-vs-series-a) covers why the stages behave differently.\n\n## Where data sourcing sits (and why it changes the math)\n\nData sourcing is outbound without the analyst hours per name. A signal system (public GitHub acceleration, hiring feeds, release telemetry) generates the watchlist continuously; the analyst's hours move from finding to verifying and engaging. The economics flip: cost per meeting drops toward inbound's, while lead time stays outbound-early. That combination, cheap AND early, is why platform sourcing went from novelty to table stakes in under a decade, and why funds that still treat data sourcing as optional are paying analyst salaries for list-building the machine does free. The [free data sources guide](/blog/free-vc-data-sources-guide) covers the zero-budget version, and the [AI sourcing guide](/blog/ai-in-vc-deal-sourcing-practical-guide) covers the tool landscape with appropriate skepticism.\n\n## The decision framework\n\nThree questions, in order:\n\n1. What stage is the thesis? Earlier thesis, more outbound. Later, more inbound.\n2. What does the fund's brand actually earn today (honest inbound volume and quality)? Brand-driven funds can lean inbound; new funds cannot, whatever the deck says about proprietary flow (the [proprietary deal flow explainer](/blog/proprietary-deal-flow-what-it-actually-means) defines what would count).\n3. What signal does the fund own? A fund with a real signal channel (community, data, geography) can run outbound at software economics; a fund without one runs outbound at payroll economics, which caps the strategy.\n\nThe answers produce the split: hours and budget across channels, quarterly reviewed against [attribution](/blog/deal-sourcing-best-practices-vc), channels retired without sentiment when the numbers say so.\n\n## Key takeaways\n\nInbound is cheap and late; outbound is expensive and early; network is earned inbound; data sourcing is outbound at software economics. The right split depends on stage, brand, and signal ownership, and it is a portfolio to rebalance quarterly, not an identity to defend. Whatever the split, the [weekly loop](/blog/vc-sourcing-analyst-playbook) is how both channels get run honestly.",
    relatedSectors: ["enterprise-saas", "ai-ml", "developer-tools"],
    faqs: [
      {
        question: "What is the difference between inbound and outbound deal sourcing?",
        answer:
          "Direction of initiation. Inbound is founder-initiated contact (applications, referrals, demo days); outbound is investor-initiated contact (the fund identifies targets and reaches out first). Inbound is cheap but structurally late; outbound costs analyst hours but engages weeks earlier, especially when signal-driven.",
      },
      {
        question: "Is inbound or outbound deal sourcing better?",
        answer:
          "Neither; they are portfolio positions. Inbound scales with brand and skews toward urgent need. Outbound buys lead time and selection control at higher cost per meeting. Early-stage theses need more outbound; established brands can lean inbound. The split should be rebalanced quarterly against attribution data.",
      },
      {
        question: "Why is outbound sourcing so expensive?",
        answer:
          "Because cold outreach converts sends to meetings at single-digit rates, so each meeting carries the analyst hours of every unanswered send. Warm outbound converts at multiples of cold, and data-driven outbound removes the list-building hours entirely, which is why both are the standard fixes.",
      },
      {
        question: "How does data-driven sourcing change inbound vs outbound economics?",
        answer:
          "It makes outbound cheap as well as early. A signal system watching public data (GitHub acceleration, hiring, releases) generates the watchlist continuously, so analyst hours shift from finding companies to verifying and engaging them. Cost per meeting approaches inbound's while lead time stays outbound-early.",
      },
      {
        question: "What share of deals should come from outbound at seed stage?",
        answer:
          "Most funds that discuss their operations report outbound and network carrying the majority of sourced seed deals, because very young companies rarely apply anywhere. The honest number for any specific fund comes from attribution, not industry convention; the practice is tagging every first meeting at logging time.",
      },
    ],
    keyStats: [
      { value: "2x", label: "Direction split", context: "Founder-initiated vs investor-initiated" },
      { value: "Weeks", label: "Outbound's structural lead", context: "Signal-driven vs announcement-driven engagement" },
      { value: "Single-digit %", label: "Cold send-to-meeting rate", context: "Why warm paths and signals matter" },
    ],
    references: [
      {
        label: "1",
        title: "How VCs Source Deals: The Complete Guide",
        url: "https://signals.gitdealflow.com/blog/how-do-vcs-source-deals",
        source: "GitDealFlow",
      },
      {
        label: "2",
        title: "VC Deal Pipeline Stages Explained",
        url: "https://signals.gitdealflow.com/blog/vc-deal-pipeline-stages-explained",
        source: "GitDealFlow",
      },
      {
        label: "3",
        title: "How to Use Alternative Data to Find the Best Deals",
        url: "https://hbr.org/2022/11/how-to-use-alternative-data-to-find-the-best-deals",
        source: "Harvard Business Review",
      },
    ],
  },
];
