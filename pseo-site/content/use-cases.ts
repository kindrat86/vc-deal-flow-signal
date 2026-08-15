import { FRESH_YEAR_STR } from "@/lib/freshness-year";
export interface UseCaseFAQ {
  question: string;
  answer: string;
}

export interface UseCaseWorkflow {
  step: number;
  name: string;
  body: string;
}

export interface UseCase {
  slug: string;
  persona: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  intro: string;
  problem: string;
  solution: string;
  workflow: UseCaseWorkflow[];
  metrics: { label: string; value: string }[];
  faqs: UseCaseFAQ[];
  relatedSectors: string[];
  relatedAlternatives: string[];
}

export const useCases: UseCase[] = [
  {
    slug: "angel-investors",
    persona: "Angel investor",
    title: `Deal Flow Signals for Angel Investors ${FRESH_YEAR_STR}`,
    description:
      "How angel investors use VC Deal Flow Signal to find technical startups 6-12 weeks before the round is competitive. Free weekly signals, EUR 49/mo Dashboard, no enterprise contracts.",
    h1: "VC Deal Flow Signal for Angel Investors",
    tagline:
      "Catch technical startups 6-12 weeks before the round is competitive, without an enterprise sourcing budget.",
    intro:
      "Angels compete with funds on everything except speed of conviction. The platforms funds use, Harmonic.ai, Dealroom, Crunchbase Enterprise, start in the five-figure range and assume a full-time sourcing team. VC Deal Flow Signal is built for the opposite end of the market: individual angels who want a quantitative early signal, weekly, for the price of two lunches.",
    problem:
      "By the time a technical startup shows up in press coverage, job boards, or Crunchbase alerts, the round is already competitive. Solo angels rarely have the bandwidth to monitor GitHub activity across 15 sectors manually. And without a signal that fires early, it is hard to justify the time spent on founder outreach before the deal exists.",
    solution:
      "VC Deal Flow Signal watches the GitHub activity you would watch yourself if you had time: commit velocity, contributor growth, infrastructure buildouts, and repo creation across 20 technical sector clusters. Each week the Signal Report surfaces five breakout startups with direct links to each GitHub organisation. Roughly 6-12 weeks later, those same companies show up on Crunchbase alerts. You are already warm.",
    workflow: [
      {
        step: 1,
        name: "Subscribe to the free weekly Signal Report",
        body: "One email per Monday, five startups, signal type explained, direct GitHub links. No login, no credit card, no onboarding call.",
      },
      {
        step: 2,
        name: "Filter by your sector focus",
        body: "Open the Dashboard (EUR 49/mo beta) and filter 140 ranked startups by AI/ML, enterprise SaaS, dev tools, fintech, or any of 15 sectors. Layer on stage and geography if you focus geographically.",
      },
      {
        step: 3,
        name: "Verify the engineering signal",
        body: "For any startup you consider interesting, click through to the GitHub org. Look at the commit graph, the contributor list, the recent releases. The signal is explainable in under two minutes of inspection.",
      },
      {
        step: 4,
        name: "Reach out before the round",
        body: "Founders are generally happy to take a short call from an angel who noticed their engineering work before their press cycle. This is the single strongest cold-outreach opener in technical sectors.",
      },
      {
        step: 5,
        name: "Track in your own CRM or spreadsheet",
        body: "Pipe signals into Airtable, Notion, or Google Sheets via Zapier, RSS, or the JSON endpoint. Many angels keep a personal watchlist that refreshes weekly.",
      },
    ],
    metrics: [
      { label: "Typical lead time", value: "6-12 weeks pre-fundraise" },
      { label: "Weekly startups surfaced", value: "5 (free) / 50+ (paid)" },
      { label: "Cost for full access", value: "EUR 49/month" },
      { label: "Sectors covered", value: "20 technical clusters" },
    ],
    faqs: [
      { question: "Is VC Deal Flow Signal suitable for first-time angels?", answer: "Yes. The free weekly Signal Report requires no technical interpretation, each startup comes with the signal type explained in plain English. For deeper inspection, you can verify the engineering signal by just looking at the GitHub org's commit graph. No coding or quantitative background required." },
      { question: "How does this compare to an angel group's shared deal flow?", answer: "Complementary. Angel groups surface deals that other angels have already sourced and qualified, useful but often warm/competitive. VC Deal Flow Signal gives you your own early signal, which you can take to your group or play solo." },
      { question: "Can I use it to source deals outside of AI and SaaS?", answer: "Partially. The platform covers 15 sector clusters including fintech, dev tools, infrastructure, enterprise SaaS, AI/ML, and data tools. It does not cover consumer brands, healthtech services, or companies with minimal public GitHub footprint." },
      { question: "What's the smallest angel check size this is worth for?", answer: "The EUR 49/month cost is trivial compared to a single $10k angel check. If the signal helps you get into one additional round per year that outperforms, the ROI is absurd. The free tier alone is enough for angels writing one or two checks per quarter." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "developer-tools"],
    relatedAlternatives: ["harmonic-ai", "crunchbase-alerts"],
  },
  {
    slug: "vc-analysts",
    persona: "VC analyst",
    title: `Deal Flow Signals for VC Analysts ${FRESH_YEAR_STR}`,
    description:
      "How VC analysts use VC Deal Flow Signal to scale weekly deal sourcing, reduce manual GitHub spelunking, and build sector-specific watchlists that refresh automatically.",
    h1: "VC Deal Flow Signal for VC Analysts",
    tagline:
      "Scale weekly sourcing across 20 technical sectors without manually monitoring GitHub at 2am.",
    intro:
      "Analysts are the ones who actually find the deals, and the ones most likely to be doing it manually. If your fund covers technical startups, you are probably already looking at GitHub activity, just inefficiently, one repo at a time, when a partner forwards a lead. VC Deal Flow Signal turns that manual work into a weekly feed you can scan in five minutes and act on in fifty.",
    problem:
      "Manual GitHub monitoring does not scale. You can pick a dozen companies to track, but you will miss the acceleration happening in the hundreds of companies you are not watching. Sector databases like Crunchbase tell you what already raised; Harmonic and similar platforms require an enterprise budget that smaller funds do not have.",
    solution:
      "A weekly ranked feed across 20 technical sector clusters, generated from the same GitHub signals an analyst would look at manually: commit velocity, contributor growth, infrastructure buildouts, new repo creation. Filter by sector, stage, and geography. Export to CSV for the partner meeting. Set up a Zapier or RSS pipe into your fund's Notion or Airtable.",
    workflow: [
      {
        step: 1,
        name: "Scan the Monday Signal Report",
        body: "Five-minute Monday morning read: top five breakout startups across all sectors, plus the signal type driving each one. Enough for a pre-standup scan.",
      },
      {
        step: 2,
        name: "Filter Dashboard by fund thesis",
        body: "Filter 140 weekly startups to your fund's specific sectors, stages, and geographies. Export the filtered list to CSV for sharing with partners.",
      },
      {
        step: 3,
        name: "Verify with a one-click GitHub walk-through",
        body: "Each startup has a direct GitHub link. Check the commit graph, the top contributors, the language split, the recent releases. Under two minutes per startup for a go/no-go on deeper research.",
      },
      {
        step: 4,
        name: "Enrich with Crunchbase / Harmonic / manual",
        body: "For the 10-20% of startups that warrant deeper research, layer on whatever you already use, funding history, team backgrounds, cap table info. VC Deal Flow Signal is the filter layer, not the research layer.",
      },
      {
        step: 5,
        name: "Pipe into the fund's CRM weekly",
        body: "Zapier, RSS, or JSON endpoint into Affinity, Airtable, Notion, or internal tooling. Auto-tag by sector, stage, geography, and signal type. Weekly sourcing review becomes 'here are 50 new candidates, 8 flagged for outreach'.",
      },
    ],
    metrics: [
      { label: "Weekly ranked startups", value: "140 on Dashboard" },
      { label: "Sectors in single feed", value: "20 technical clusters" },
      { label: "Typical lead time", value: "6-12 weeks pre-fundraise" },
      { label: "Per-seat cost", value: "EUR 49/mo (beta)" },
    ],
    faqs: [
      { question: "Can multiple analysts share one account?", answer: "For the beta Dashboard, yes, the login is per-seat but the underlying data is the same for every analyst. For larger teams, get in touch and a multi-seat plan can be set up." },
      { question: "How does this integrate with Affinity?", answer: "Via Zapier during beta. Trigger: new weekly signal. Action: create or update Affinity record with sector, signal type, and GitHub URL. Once the Zapier integration is public (after the three-user threshold), it becomes a one-click setup." },
      { question: "Does it replace our existing sourcing tool stack?", answer: "Usually not, it replaces manual GitHub monitoring and the 'keep an eye on this handful of companies' tracker spreadsheet. Most analysts keep Crunchbase, Dealroom, or Harmonic for broad coverage and add VC Deal Flow Signal as the engineering-signal layer." },
      { question: "Can I feed this into our LLM-powered research workflow?", answer: "Yes. The MCP server exposes six tools (trending, sector search, startup lookup, summary, scout receipts, methodology) to any MCP-compatible assistant, Claude Desktop, Cursor, Windsurf, Continue. Run a weekly analyst query directly in Claude against live data." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
    relatedAlternatives: ["harmonic-ai", "dealroom", "forager-ai"],
  },
  {
    slug: "fund-of-funds",
    persona: "Fund of funds / LP",
    title: `Deal Flow Signals for Fund of Funds & LPs ${FRESH_YEAR_STR}`,
    description:
      "How fund of funds and LPs use VC Deal Flow Signal to benchmark portfolio VCs' sourcing quality, validate GP sector thesis, and spot emerging GPs with better deal flow.",
    h1: "VC Deal Flow Signal for Fund of Funds & LPs",
    tagline:
      "Benchmark your VCs' sourcing quality against a common engineering signal, and spot emerging GPs with better deal flow before everyone else does.",
    intro:
      "Most LPs evaluate a VC's sourcing by looking at deployed deals, a lagging indicator that takes years to mature. VC Deal Flow Signal gives LPs and fund of funds a new kind of leading indicator: how do the companies a GP backed compare to the companies VC Deal Flow Signal flagged at the same moment? And for emerging managers, which of them are consistently getting into companies that later show up as breakout engineering signals?",
    problem:
      "Sourcing quality is hard to measure from the outside. LPs rely on GP self-reporting, which is flattering by construction, or on IRR / DPI, which are 7-10 year signals. There is no industry benchmark for 'would a reasonable engineering-signal tool have flagged this startup at the same time?' that LPs can apply consistently across their portfolio of GPs.",
    solution:
      "Use VC Deal Flow Signal's weekly dataset as a benchmark. For each portfolio company a GP invests in, check whether that company was flagged as a breakout engineering signal 6-12 weeks before the round, and if so, whether the GP was already engaged. GPs whose wins correlate strongly with leading engineering signals are likely sourcing on the early side. GPs whose wins correlate with no early signal are either backing non-technical companies, or sourcing through networks that the signal does not capture.",
    workflow: [
      {
        step: 1,
        name: "Access the historical signal archive",
        body: "Past periods are accessible via the data API and archived sector pages. For any date range, you can pull the full list of startups that were flagged as breakout engineering signals.",
      },
      {
        step: 2,
        name: "Overlay your GP portfolio",
        body: "For each GP-backed company, check whether VC Deal Flow Signal flagged it in the 6-12 week window before the round. Build a score: how often does this GP's pipeline overlap with the leading signal?",
      },
      {
        step: 3,
        name: "Compare across portfolio GPs",
        body: "The overlap score is not a quality metric on its own, non-technical funds will score low for structural reasons, but across a peer group of technical-sector GPs, it is a useful sourcing-speed proxy.",
      },
      {
        step: 4,
        name: "Scout emerging managers",
        body: "For emerging GPs you are considering, ask for their recent pipeline and run the same overlap score retroactively. A new GP whose sourcing tracks an independent engineering signal is validating their thesis with an external benchmark.",
      },
      {
        step: 5,
        name: "Use for sector thesis validation",
        body: "When a GP pitches a sector thesis, check how many companies VC Deal Flow Signal flagged in that sector over the past year. If the thesis is 'AI infrastructure is hot', the signal archive tells you whether that was true 6 months earlier in engineering activity.",
      },
    ],
    metrics: [
      { label: "Historical archive depth", value: "Growing weekly since Q1 2026" },
      { label: "Sectors covered", value: "20 technical clusters" },
      { label: "Data accessibility", value: "JSON / CSV / MCP / RSS" },
      { label: "Benchmark cost", value: "EUR 49/mo (beta)" },
    ],
    faqs: [
      { question: "Can I get a custom historical signal export?", answer: "Yes, email signals@gitdealflow.com with the date range and sector focus. The beta tier access includes custom exports for LP use cases on request." },
      { question: "How do I handle GPs that invest in non-technical sectors?", answer: "The signal only covers technical startups with public GitHub activity. For consumer, healthtech, or services GPs, the overlap score is structurally low and not meaningful. Use the signal only for peer groups where the sector mix is comparable." },
      { question: "Is the signal biased toward open-source companies?", answer: "The signal measures any public GitHub activity, both open-source projects and companies with public infrastructure repos, public API repos, or public SDKs. It is biased toward technical startups that do any of their engineering work in public, which is the majority of modern SaaS and dev tools but a minority of closed-source B2B." },
      { question: "Can you help us build a custom LP benchmark?", answer: "Yes. The data is available in machine-readable formats; email signals@gitdealflow.com for scoped help building a custom benchmark or GP scoring model. The product team is small but direct." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
    relatedAlternatives: ["dealroom", "harmonic-ai"],
  },
  {
    slug: "scout-investors",
    persona: "Scout investor",
    title: `Deal Flow Signals for Scout Investors ${FRESH_YEAR_STR}`,
    description:
      "How scouts at Sequoia, Lightspeed, a16z, and similar programs use VC Deal Flow Signal to surface technical startups in their networks before the round consolidates.",
    h1: "VC Deal Flow Signal for Scout Investors",
    tagline: "Source one defensible signal per week your fund's GP did not already see.",
    intro:
      "Scout programs reward early conviction and original sourcing. The fastest way for a scout to lose credibility is to forward a deal the GP already saw on Twitter. The fastest way to gain credibility is to forward a quantitative engineering signal three to six weeks before the round becomes public. VC Deal Flow Signal is built for that exact moment in the scout workflow.",
    problem:
      "Scouts have small budgets, limited time, and no fund-level data infrastructure. Most scouts source from their personal network plus whatever they read on Twitter, which means most scouts are seeing the same deals at the same time. The competitive edge for a scout is finding a startup the fund's analysts have not flagged yet, with a non-anecdotal reason to flag it.",
    solution:
      "VC Deal Flow Signal gives scouts a weekly external feed of breakout engineering signals across 15 sectors. Each signal is a pre-fundraise event tagged with type and magnitude, and each comes with a direct GitHub link the scout can use to verify the activity in under two minutes. The signal is exactly the kind of evidence a partner respects when deciding whether to take a meeting.",
    workflow: [
      {
        step: 1,
        name: "Scan the Monday Signal Report",
        body: "Five startups, signal types explained, direct GitHub links. Quick read in the morning.",
      },
      {
        step: 2,
        name: "Filter Dashboard for your scout focus areas",
        body: "Most scouts have a couple of named sectors or geographies. Filter to those, typically narrows weekly results to under 10 high-relevance signals.",
      },
      {
        step: 3,
        name: "Cross-reference your warm network",
        body: "For each signal, check whether you have a path in (LinkedIn second-degree, college alum, prior conversation). Warm intros convert; cold outreach during a competitive round does not.",
      },
      {
        step: 4,
        name: "Forward one signal per week with context",
        body: "Pick the strongest signal you have a credible angle on. Write a two-paragraph note: signal magnitude, your read, and the warm intro path. Forward it to the partner overseeing the scout program.",
      },
      {
        step: 5,
        name: "Track which signals converted",
        body: "Maintain a private spreadsheet of forwarded signals and outcomes. After two quarters, you have a portfolio-level view of your scout sourcing precision, useful at scout review time.",
      },
    ],
    metrics: [
      { label: "Lead time", value: "3-6 weeks pre-fundraise" },
      { label: "Forwarded signals per quarter", value: "10-15 typical" },
      { label: "Cost", value: "EUR 49/month" },
    ],
    faqs: [
      { question: "Do scout programs allow third-party data tools?", answer: "Almost universally yes, the data is public GitHub activity, not non-public information. Scout programs care about the strength of conviction, not the source of the signal. Document your data sources in any scout report and you are within bounds." },
      { question: "How do I avoid duplicating signals the fund analysts already see?", answer: "Filter to sectors and stages your fund's analysts under-cover, focus on early stages where fund analysts have less bandwidth, and lead with the engineering signal as evidence rather than as the deal itself. Scouts add value at the discovery layer; engineering acceleration is one of the strongest discovery layers available." },
      { question: "Is the EUR 49/month worth it as a scout?", answer: "If even one signal per year converts to a deal the fund invests in, the ROI is hundreds of times the cost. Most scouts forward five to fifteen signals per quarter. Even at a modest conversion rate, the math is trivial." },
    ],
    relatedSectors: ["ai-ml", "developer-tools", "enterprise-saas"],
    relatedAlternatives: ["harmonic-ai", "specter"],
  },
  {
    slug: "solo-gps",
    persona: "Solo GP",
    title: `Deal Flow Signals for Solo GPs ${FRESH_YEAR_STR}`,
    description:
      "How solo GPs running rolling funds, syndicates, or first-time funds use VC Deal Flow Signal to compete with institutional sourcing teams without an institutional budget.",
    h1: "VC Deal Flow Signal for Solo GPs",
    tagline: "Source like a 10-person institutional fund, without hiring 10 people.",
    intro:
      "Solo GPs have one structural disadvantage and one structural advantage. The disadvantage is sourcing scale: you cannot match the breadth of a fund with five analysts on it. The advantage is decision speed: you can move from signal to wire in days, not weeks. VC Deal Flow Signal is built to neutralize the disadvantage so the advantage compounds.",
    problem:
      "Solo GPs operate against the same competitive landscape as institutional funds: same companies, same rounds, same allocation pressure. But the labor model is fundamentally different, one person cannot manually monitor GitHub activity across thousands of companies. Without an external screening layer, the solo GP either narrows their fund's surface area or ends up sourcing from the same Twitter feed as everyone else.",
    solution:
      "An automated weekly feed of breakout engineering signals across 15 sectors. The Dashboard ranks 50+ startups every Monday by acceleration magnitude, filterable by stage and geography. Pipe the signal into your existing CRM (Affinity, HubSpot, Notion) via API or RSS. The screening pipeline runs while you are reviewing decks; you arrive at meetings with a longer warm list than peers.",
    workflow: [
      {
        step: 1,
        name: "Auto-pipe weekly signals into your CRM",
        body: "Zapier, n8n, or direct API into Affinity. New signals land tagged by sector, stage, and signal type. Your weekly sourcing review takes 20 minutes instead of two hours.",
      },
      {
        step: 2,
        name: "Dedupe against existing pipeline",
        body: "Most CRMs auto-dedupe by domain. Companies you already have warm contact with surface as enrichment events; new companies surface as fresh leads.",
      },
      {
        step: 3,
        name: "Send 5-10 warm intros per week",
        body: "For top-ranked signals you do not already know, write a short personalized note acknowledging the engineering pace. Founder response rates are high for this framing.",
      },
      {
        step: 4,
        name: "Move fast on conviction",
        body: "Solo GPs win on speed of conviction. Once you have engineering acceleration plus founder context plus your own market thesis, you can commit faster than any committee-driven fund.",
      },
      {
        step: 5,
        name: "Report sourcing source to LPs quarterly",
        body: "LPs increasingly ask about sourcing methodology. Engineering acceleration as a structured input is a defensible, repeatable answer that distinguishes you from referral-only sourcing.",
      },
    ],
    metrics: [
      { label: "Sourcing time per week", value: "20-30 min vs 2-4 hr manual" },
      { label: "Signals reviewed per quarter", value: "200-400" },
      { label: "Cost vs equivalent labor", value: "1/100th of a junior analyst" },
    ],
    faqs: [
      { question: "Does this work if I am pre-fund?", answer: "Yes, many syndicate leads and angel-roll-up operators use the signal at the syndicate stage. The data and methodology are identical; the only difference is the structure of how the deals get done downstream." },
      { question: "Can I report this signal source to LPs?", answer: "Yes. Engineering acceleration as a sourcing input is a methodologically defensible answer to LP sourcing questions. The methodology is published openly on SSRN, and the data is public GitHub activity." },
      { question: "How does this compare to building it in-house?", answer: "Building a comparable pipeline takes four to six weeks of engineering time plus ongoing maintenance. The labor cost dwarfs the EUR 49/month subscription unless you are running a fund large enough to justify a dedicated data engineer." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "developer-tools"],
    relatedAlternatives: ["harmonic-ai", "affinity"],
  },
  {
    slug: "corporate-vc",
    persona: "Corporate VC",
    title: `Deal Flow Signals for Corporate Venture ${FRESH_YEAR_STR}`,
    description:
      "How corporate venture teams use VC Deal Flow Signal to identify acquisition targets and strategic investment candidates before institutional VCs allocate the round.",
    h1: "VC Deal Flow Signal for Corporate Venture",
    tagline: "Source strategic opportunities upstream of institutional VC pricing pressure.",
    intro:
      "Corporate venture teams operate with a different economic model than financial VCs: strategic value matters as much as financial return, and acquisition is often the destination, not the exit. The signal you want is therefore not just \"who is going to raise\" but \"who is going to be a strategic fit for our roadmap in 18 months.\" Engineering acceleration as a leading indicator gives both reads.",
    problem:
      "Corporate venture teams sit between two pressures: speed of decision-making (slower than financial VCs because of internal review) and fit with strategic theses (faster than financial VCs because the corporate parent has clear adjacency targets). The result is that corporate venture often arrives at deals after the institutional VC pricing has been set, paying premiums without sourcing edge.",
    solution:
      "VC Deal Flow Signal surfaces engineering acceleration across 15 sectors weekly, filterable by sector and stage. Corporate venture teams filter to their parent's adjacency areas (cloud infrastructure for hyperscalers, security for security companies, fintech infrastructure for banks) and use the signal as a leading indicator of which startups are about to break out. The 3 to 6 week lead time over Crunchbase Alerts is enough to start a strategic conversation before the round's pricing dynamic locks in.",
    workflow: [
      {
        step: 1,
        name: "Define adjacency sectors with the corporate strategy team",
        body: "Map your parent's strategic priorities to the 15 sector clusters covered. Most corporate venture teams find 2 to 4 sectors directly aligned with their thesis.",
      },
      {
        step: 2,
        name: "Filter Dashboard to those sectors",
        body: "Weekly review of breakouts in your strategic adjacency. Typical volume: 10 to 20 signals per week relevant to a focused corporate venture mandate.",
      },
      {
        step: 3,
        name: "Cross-reference internal product teams",
        body: "For each interesting signal, get a 15-minute read from the relevant internal product team. This is the corporate venture superpower, strategic context is faster than market research.",
      },
      {
        step: 4,
        name: "Initiate strategic conversations early",
        body: "Reach out to founders during the acceleration window with a strategic-context framing: a partnership, a customer relationship, an MOU. Investment can follow if the partnership conversation surfaces fit.",
      },
      {
        step: 5,
        name: "Maintain a strategic watchlist",
        body: "Companies that show acceleration but fail strategic fit at this moment may fit in 12 to 18 months. Track them automatically through the API.",
      },
    ],
    metrics: [
      { label: "Lead time vs financial VC", value: "3-6 weeks" },
      { label: "Strategic conversations per quarter", value: "10-25 typical" },
      { label: "Conversion to investment or partnership", value: "5-15%" },
    ],
    faqs: [
      { question: "How does this fit alongside our internal corporate intelligence?", answer: "Engineering acceleration is upstream of most corporate intelligence sources, press, conferences, partner networks, so it complements internal work rather than duplicating it. Most corporate venture teams use it as the discovery layer feeding into the strategic-fit evaluation done internally." },
      { question: "Can the API support our internal data warehouse?", answer: "Yes. The API returns ranked signals as JSON, and many corporate venture teams pipe weekly snapshots into Snowflake or BigQuery for cross-referencing with internal CRM, product analytics, and partnership data." },
      { question: "Is this useful for M&A targeting, not just venture investing?", answer: "Yes. Several corporate development teams use the signal specifically for M&A pipeline construction, engineering acceleration is a strong leading indicator for which startups will reach the size that triggers acquisition conversations." },
    ],
    relatedSectors: ["enterprise-saas", "cybersecurity", "data-infrastructure"],
    relatedAlternatives: ["pitchbook", "cb-insights"],
  },
  {
    slug: "accelerator-scouts",
    persona: "Accelerator program scout",
    title: `Deal Flow Signals for Accelerator and Incubator Scouts ${FRESH_YEAR_STR}`,
    description:
      "How scouts at YC, Techstars, Antler, Entrepreneur First, and other accelerator programs use VC Deal Flow Signal to identify program-fit founders before applications open.",
    h1: "VC Deal Flow Signal for Accelerator Program Scouts",
    tagline: "Identify program-fit founders three months before they apply.",
    intro:
      "Accelerator and incubator programs compete for the same pool of high-potential founders, and the best programs proactively recruit founders rather than waiting for applications. Engineering acceleration is one of the strongest leading indicators that a founder is approaching the moment when accelerator participation becomes attractive, they have shipped something credible but not yet raised an institutional round.",
    problem:
      "Most accelerator scouting is reactive: review applications, reach out to obvious-fit founders in networks, hope for the best. Proactive scouting at scale requires a signal that fires at the right moment in the founder's arc, early enough to influence the application decision, but late enough that the founder has demonstrable traction.",
    solution:
      "VC Deal Flow Signal surfaces pre-seed and seed-stage engineering acceleration across 15 sectors. Scouts filter to the stage and sectors their program targets, identify breakout teams that have not yet raised institutional capital, and reach out with program fit. The three to six week lead time vs Crunchbase means scouts can engage founders during the decision window, not after.",
    workflow: [
      {
        step: 1,
        name: "Filter Dashboard to pre-seed and seed",
        body: "Most accelerator programs target the pre-seed to seed transition. Filter to that stage and your program's sectors of focus.",
      },
      {
        step: 2,
        name: "Identify breakouts not yet on Crunchbase",
        body: "Cross-reference filtered signals against Crunchbase to identify teams that show engineering acceleration but have not announced a round. These are the program-fit candidates.",
      },
      {
        step: 3,
        name: "Reach out with program-specific framing",
        body: "Acknowledge their engineering pace, share what your program offers, and invite them to apply. Conversion rates from this kind of warm proactive outreach run materially higher than passive application funnels.",
      },
      {
        step: 4,
        name: "Track program-cohort outcomes",
        body: "After cohorts complete, check engineering acceleration trajectories of program participants vs counterfactual non-participants. Useful for program-level outcome reporting and program iteration.",
      },
      {
        step: 5,
        name: "Share data with portfolio post-program",
        body: "Once a startup graduates the program, the same engineering acceleration signal becomes a portfolio monitoring tool, useful for the program's network of mentor investors.",
      },
    ],
    metrics: [
      { label: "Pre-application identification window", value: "3-6 weeks" },
      { label: "Filtered weekly signals at pre-seed/seed", value: "5-15" },
      { label: "Cost vs alternative scouting tools", value: "Fraction of enterprise scouting" },
    ],
    faqs: [
      { question: "Does this replace application-based intake?", answer: "No, it complements it. Most programs combine inbound applications with proactive scouting. Engineering acceleration strengthens the proactive layer, applications still capture founders without significant public engineering activity." },
      { question: "How early-stage does the signal work?", answer: "Down to teams of 1 to 3 contributors with sustained activity. Pre-seed signals require human review and the +200% threshold rather than +100% because base rates are noisier." },
      { question: "Can this be used for international cohort scouting?", answer: "Yes, the geographic filter supports country-level and city-level filtering, useful for programs with regional cohorts (Antler in specific cities, Techstars regional programs)." },
    ],
    relatedSectors: ["ai-ml", "developer-tools", "fintech"],
    relatedAlternatives: ["specter", "harmonic-ai"],
  },
  {
    slug: "portfolio-monitoring",
    persona: "Portfolio operator",
    title: `Deal Flow Signals for Portfolio Monitoring ${FRESH_YEAR_STR}`,
    description:
      "How fund operators and platform teams use VC Deal Flow Signal to monitor portfolio company engineering momentum and flag follow-on opportunities or stress signals.",
    h1: "VC Deal Flow Signal for Portfolio Monitoring",
    tagline: "Track every portfolio company's engineering pace without scheduling check-in calls.",
    intro:
      "Funds increasingly need to know how their portfolio companies are pacing without relying on quarterly board updates. Engineering acceleration is a frequency-rich, founder-independent signal that supplements board reporting with weekly read on shipping velocity, hiring trends, and architectural shifts. Platform and operations teams use it to time follow-on conversations, surface stress signals, and report cohort-level metrics to LPs.",
    problem:
      "Quarterly board updates are too infrequent for active portfolio management, and asking founders for monthly metric reports introduces relational friction. Most funds end up with stale visibility into which portfolio companies are shipping faster, hiring, or migrating platforms, until something goes wrong and the founder finally surfaces it.",
    solution:
      "VC Deal Flow Signal monitors GitHub engineering activity across the panel that includes most venture-backed technical companies. Funds wire portfolio company GitHub orgs into a custom watchlist (via API), and receive weekly engineering acceleration snapshots without any founder involvement. Portfolio monitoring becomes passive instead of relational.",
    workflow: [
      {
        step: 1,
        name: "Build a portfolio watchlist via API",
        body: "Pipe portfolio company GitHub organization handles into the API. The watchlist refreshes weekly automatically.",
      },
      {
        step: 2,
        name: "Receive weekly portfolio digest",
        body: "Email or Slack digest with engineering acceleration deltas across the portfolio. Highlights companies showing notable acceleration or unusual decline.",
      },
      {
        step: 3,
        name: "Time follow-on conversations strategically",
        body: "When a portfolio company shows sustained acceleration, that is the moment to start the follow-on conversation. Founders are receptive when they can point to the underlying engineering momentum.",
      },
      {
        step: 4,
        name: "Surface stress signals proactively",
        body: "A portfolio company showing sustained engineering deceleration may be experiencing team turnover, technical debt crisis, or strategic pivots. The signal flags it weeks before the next board meeting.",
      },
      {
        step: 5,
        name: "Aggregate cohort metrics for LP reporting",
        body: "Roll up engineering acceleration metrics across the portfolio cohort for LP letters. Quantitative engineering health is a defensible cohort-level metric.",
      },
    ],
    metrics: [
      { label: "Reporting frequency", value: "Weekly" },
      { label: "Portfolio companies trackable", value: "Unlimited" },
      { label: "Founder time required", value: "Zero" },
    ],
    faqs: [
      { question: "Does this require founder consent?", answer: "No, the data is public GitHub activity. Many funds disclose to portfolio founders that they monitor public engineering signals, which most founders appreciate as a low-friction way for the fund to stay current without weekly check-ins." },
      { question: "Can the signal predict portfolio company struggles?", answer: "Sometimes. Sustained engineering deceleration combined with declining contributor count is a strong leading indicator of team turnover or strategic stall. The signal does not catch every problem but flags meaningful changes weeks before they appear in formal updates." },
      { question: "How does this fit with our existing portfolio data tools?", answer: "Most funds use Affinity, HubSpot, or custom tools for portfolio data. The API integrates as an enrichment layer, attaching engineering acceleration metrics to existing portfolio records. Engineering acceleration is one input among many; it does not replace board reporting." },
    ],
    relatedSectors: ["enterprise-saas", "developer-tools", "fintech"],
    relatedAlternatives: ["affinity", "pitchbook"],
  },
  {
    slug: "due-diligence",
    persona: "Due diligence analyst",
    title: `Deal Flow Signals for Technical Due Diligence ${FRESH_YEAR_STR}`,
    description:
      "How investment teams use VC Deal Flow Signal during diligence to validate engineering claims, benchmark against sector peers, and verify shipping pace before term sheet.",
    h1: "VC Deal Flow Signal for Technical Due Diligence",
    tagline: "Verify engineering claims with public data instead of taking the founder's word.",
    intro:
      "Technical due diligence in venture historically depended on founder self-reporting plus a partner's intuition about the team. Public engineering data has changed that, diligence teams can now verify shipping pace, contributor growth, language stack, and architectural choices independently, in hours rather than weeks. VC Deal Flow Signal is the structured layer most diligence teams use as the first pass.",
    problem:
      "Founder pitch decks describe shipping velocity and team composition; diligence teams rarely have time to independently verify these claims. Bringing in a technical advisor to spend a week reviewing a startup's GitHub org costs four-figure consulting fees and weeks of latency. For most checks the diligence team accepts the founder's framing, which can produce expensive surprises post-investment.",
    solution:
      "VC Deal Flow Signal provides instant access to historical engineering metrics for any startup with a public GitHub footprint. Verify the founder's velocity claims, benchmark against sector peers at the same stage, identify any concerning patterns (declining contributor counts, fork-and-rename artifacts, single-contributor dependencies). The diligence pass that previously took a week takes 30 minutes.",
    workflow: [
      {
        step: 1,
        name: "Look up the startup in the Dashboard",
        body: "Most venture-backed technical companies are already in the panel. Pull the company's full historical chart with one search.",
      },
      {
        step: 2,
        name: "Verify velocity claims against the chart",
        body: "Compare the founder's described shipping pace to the actual commit velocity over the same period. Material discrepancies merit follow-up questions.",
      },
      {
        step: 3,
        name: "Check contributor patterns",
        body: "Look for healthy contributor distribution (multiple contributors, sustained over time) versus concentration risks (single contributor responsible for 80%+ of recent commits).",
      },
      {
        step: 4,
        name: "Benchmark against sector peers",
        body: "Use the sector pages to compare the target's metrics against companies at the same stage in the same sector. Top quartile, bottom quartile, or middle of the pack.",
      },
      {
        step: 5,
        name: "Document findings in the diligence memo",
        body: "Reference the source data in the diligence memo. The methodology is published openly, so partners and IC members can verify the diligence work themselves.",
      },
    ],
    metrics: [
      { label: "Diligence time", value: "30 min vs week+ manual" },
      { label: "Cost vs technical consultant", value: "EUR 49/mo vs $5-15K" },
      { label: "Verification depth", value: "Full historical metrics" },
    ],
    faqs: [
      { question: "Does this replace a technical advisor?", answer: "No, it complements one. Engineering acceleration provides quantitative metrics; a technical advisor provides architectural and code-quality judgment. For checks above $1M most diligence teams use both." },
      { question: "What if the startup is private-repo only?", answer: "The signal works for any startup with at least some public engineering footprint, public SDK, infra repos, OSS components. For purely closed-source companies, the diligence layer requires alternative sources. Many SaaS companies have at least some public artifacts." },
      { question: "Can findings be shared with the founder?", answer: "Yes. The data is public, so sharing diligence findings with the founder during follow-up conversations is appropriate. Many founders welcome the structured metrics, it gives them a defensible answer to investor velocity questions." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "developer-tools"],
    relatedAlternatives: ["pitchbook", "harmonic-ai"],
  },
  {
    slug: "lp-research",
    persona: "LP research analyst",
    title: `Deal Flow Signals for LP Research ${FRESH_YEAR_STR}`,
    description:
      "How LPs at endowments, family offices, and fund-of-funds use VC Deal Flow Signal to evaluate GP sourcing methodology, portfolio construction, and sector allocation.",
    h1: "VC Deal Flow Signal for LP Research",
    tagline: "Evaluate GP sourcing claims with portfolio-level engineering metrics.",
    intro:
      "LPs increasingly want to evaluate GP sourcing as a structured discipline rather than a black box. Engineering acceleration as a measurable, repeatable input gives LPs a way to differentiate GPs whose sourcing methodology is rigorous from those who are over-relying on existing networks. The metric is not just for sourcing; it is for evaluating sourcing.",
    problem:
      "Most LP due diligence on GPs focuses on track record, team, and stated methodology. There is no good external way to evaluate whether a GP's sourcing actually produces an edge versus picking up deals everyone else also saw. Aggregate engineering metrics across a GP's portfolio give a quantitative view of whether the GP backed teams during the acceleration window or after consensus formed.",
    solution:
      "VC Deal Flow Signal lets LPs analyze GPs' portfolio companies retrospectively. Look at when each portfolio company first showed engineering acceleration, when the GP invested, and how that timing compares to peer GPs. The pattern of investing during acceleration windows versus after public events distinguishes GPs sourcing on quantitative leading indicators from GPs sourcing on press cycles.",
    workflow: [
      {
        step: 1,
        name: "Pull each portfolio company's acceleration history",
        body: "For each portfolio company in the GP's record, look up the engineering acceleration time series. Note the first sustained acceleration date.",
      },
      {
        step: 2,
        name: "Compare investment date to acceleration date",
        body: "GPs investing during the acceleration window (3 to 6 weeks before public fundraise) demonstrate proactive sourcing. GPs investing after public events demonstrate reactive sourcing.",
      },
      {
        step: 3,
        name: "Build a GP sourcing-edge metric",
        body: "Aggregate the lead-time-to-investment across the GP's portfolio. The distribution itself, median, top quartile, tail, is a defensible quantitative read on sourcing methodology.",
      },
      {
        step: 4,
        name: "Compare against peer GPs",
        body: "The same metric can be computed for peer GPs in the same vintage. Cross-fund comparison provides relative ranking that is independent of self-reported methodology.",
      },
      {
        step: 5,
        name: "Inform allocation decisions",
        body: "The structured metric is one input alongside track record, team, and references. It is not the only input but it adds quantitative rigor to a historically qualitative evaluation.",
      },
    ],
    metrics: [
      { label: "Portfolio retrospective coverage", value: "Most public-GitHub portfolios" },
      { label: "GP comparisons", value: "Cross-fund analysis supported" },
      { label: "Time per GP analysis", value: "2-4 hours" },
    ],
    faqs: [
      { question: "Is engineering acceleration a complete measure of sourcing edge?", answer: "No, sourcing edge has many components, including network strength, founder relationships, and contrarian conviction. Engineering acceleration measures one specific dimension: the timing of investment relative to publicly observable engineering signals. It is one input, not a full evaluation." },
      { question: "Does this work for non-technical sectors?", answer: "Less well. The framework is most informative for technical sectors where startups have meaningful public engineering footprints. For consumer, services, or hardware-heavy companies, alternative metrics are more relevant." },
      { question: "Can GPs see this analysis?", answer: "The underlying data is public, so the analysis is independently reproducible by the GP. Most GPs welcome quantitative discussion of their sourcing methodology, it differentiates them from peers when the methodology is genuinely rigorous." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
    relatedAlternatives: ["pitchbook", "cb-insights"],
  },
  {
    slug: "seed-funds",
    persona: "Seed-stage fund partner",
    title: `Deal Flow Signals for Seed-Stage Funds ${FRESH_YEAR_STR}`,
    description:
      "How seed-stage fund partners use VC Deal Flow Signal to source breakout startups during the seed-to-Series-A transition window when leverage is highest.",
    h1: "VC Deal Flow Signal for Seed-Stage Funds",
    tagline: "Catch the seed-to-Series-A acceleration window when terms are most favorable.",
    intro:
      "Seed-stage funds operate in the highest-leverage window of venture investing: the price is set, the team is small, the product is real, and the next round will be at meaningful step-up. The constraint is sourcing: getting into competitive seed rounds requires being early and having a defensible reason for conviction. Engineering acceleration is exactly that.",
    problem:
      "Seed-stage sourcing is dominated by founder networks and accelerator demos. Funds without strong founder networks compete for the same set of demo-day startups, where pricing is least favorable. Funds that source early, before the demo, before the press, before the announcement, get into rounds at better terms with stronger conviction.",
    solution:
      "VC Deal Flow Signal surfaces seed-stage breakouts weekly via the Dashboard. Filter to seed-stage companies showing the hiring-burst signal type, the strongest predictor of imminent fundraise, across the fund's sector mandate. Reach out during the acceleration window with a structured engineering-context outreach, not generic demo-day pitching.",
    workflow: [
      {
        step: 1,
        name: "Configure Dashboard for seed stage and fund sectors",
        body: "Filter to seed-stage estimated companies in your fund's mandate. Typical weekly volume: 8 to 20 signals across an active mandate.",
      },
      {
        step: 2,
        name: "Prioritize the hiring-burst pattern",
        body: "Among signal types, hiring burst is the strongest fundraise predictor at seed stage. Sort weekly results by signal strength within this pattern.",
      },
      {
        step: 3,
        name: "Cross-reference founder networks",
        body: "For each candidate, identify whether you have a warm introduction path. Warm intros at seed convert at materially higher rates than cold ones.",
      },
      {
        step: 4,
        name: "Outreach during the acceleration window",
        body: "Lead with engineering context, not transaction. Founders often have not committed to raising yet; the conversation works best as exploratory.",
      },
      {
        step: 5,
        name: "Move quickly on conviction",
        body: "At seed, decision speed wins. Acceleration plus founder conversation plus existing fund thesis should produce term-sheet readiness within two to three weeks.",
      },
    ],
    metrics: [
      { label: "Weekly seed-stage signals", value: "8-20 (filtered)" },
      { label: "Lead time vs demo days", value: "4-8 weeks" },
      { label: "Sourcing time per week", value: "30-60 min" },
    ],
    faqs: [
      { question: "Is the seed-stage signal noisy?", answer: "Pre-seed signals are noisy because of low absolute volumes; seed-stage signals (3 to 8 contributors, 80 to 200 commits per period) are much cleaner. Most seed funds find the signal-to-noise ratio at seed acceptable for weekly review without additional filtering." },
      { question: "How does this compare to YC demo day sourcing?", answer: "Complementary. Demo days are concentrated bursts; engineering acceleration is continuous. Funds running both source from a broader population than funds limited to demo cycles." },
      { question: "Can the metric distinguish strong teams from weak ones?", answer: "It distinguishes acceleration from non-acceleration; it does not distinguish team quality. Use it as a top-of-funnel filter and apply normal partner judgment for team quality afterward." },
    ],
    relatedSectors: ["ai-ml", "developer-tools", "enterprise-saas"],
    relatedAlternatives: ["harmonic-ai", "openvc"],
  },
  {
    slug: "series-a-funds",
    persona: "Series A fund partner",
    title: `Deal Flow Signals for Series A Funds ${FRESH_YEAR_STR}`,
    description:
      "How Series A fund partners use VC Deal Flow Signal to source breakout startups in the seed-to-Series-A handoff and benchmark candidates against sector peers.",
    h1: "VC Deal Flow Signal for Series A Funds",
    tagline: "Identify Series A-ready startups before the deck arrives in your inbox.",
    intro:
      "Series A is where engineering acceleration as a sourcing input is most actionable. Companies are large enough to produce robust signals, small enough that decision-making is still fast, and visible enough that the right warm intro can land a term sheet. The Series A funds extracting the most value from engineering acceleration use it to identify candidates four to eight weeks before the first investor email.",
    problem:
      "Series A funds compete intensely on a small pool of qualified candidates. Most Series A sourcing flows from seed-stage investors making warm intros, plus inbound founder pitches. Funds without dense seed-stage networks or with thesis-specific mandates find the inbound flow too undifferentiated. A leading-indicator signal supplements the network with a quantitative top-of-funnel feed.",
    solution:
      "VC Deal Flow Signal surfaces Series A-stage breakouts (8 to 20 contributors, 200 to 500 commits per 14-day window, infrastructure-buildout signal) across 15 sectors. Series A funds filter to their thesis sectors and review the top breakouts weekly, often catching candidates four to eight weeks before founders begin formal fundraising conversations.",
    workflow: [
      {
        step: 1,
        name: "Filter to Series A stage and fund sectors",
        body: "The Dashboard supports stage estimation; filter to Series A candidates in your fund's mandate. Typical weekly volume: 5 to 15 high-quality candidates.",
      },
      {
        step: 2,
        name: "Look for infrastructure buildout and platform migration patterns",
        body: "These patterns are most informative at Series A, they indicate strategic technical investment that often precedes follow-on fundraises.",
      },
      {
        step: 3,
        name: "Cross-reference seed-stage investor networks",
        body: "Most Series A candidates are already backed by named seed-stage funds. Identify the seed lead and request a warm intro through your existing network.",
      },
      {
        step: 4,
        name: "Verify with technical diligence",
        body: "At Series A check sizes, technical diligence is non-trivial. Use the signal data plus sector benchmarks plus a technical advisor for full diligence.",
      },
      {
        step: 5,
        name: "Move on conviction, not consensus",
        body: "Series A pricing is set by competition. Funds that move on conviction during the acceleration window get better terms than funds chasing consensus after the round is announced.",
      },
    ],
    metrics: [
      { label: "Weekly Series A signals", value: "5-15 (filtered)" },
      { label: "Lead time vs first founder pitch", value: "4-8 weeks" },
      { label: "Cross-validation with seed-stage network", value: "High" },
    ],
    faqs: [
      { question: "How does this fit with proactive Series A sourcing teams?", answer: "Most Series A funds have analysts running proactive sourcing. Engineering acceleration is one input to that pipeline, typically the highest-frequency, most quantitative input. It complements rather than replaces the analysts' qualitative work." },
      { question: "Does the signal work for non-software Series A companies?", answer: "Less well, the framework's coverage is best for technical companies with public engineering footprints. Vertical SaaS, consumer marketplaces, services-driven businesses, and hardware companies are partially or not covered." },
      { question: "Can this surface breakout international Series A candidates?", answer: "Yes. The data is global; geographic filters support country and city-level filtering. Many funds use it specifically to expand sourcing beyond the US-centric demo-day flow." },
    ],
    relatedSectors: ["enterprise-saas", "data-infrastructure", "cybersecurity"],
    relatedAlternatives: ["affinity", "harmonic-ai"],
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return useCases.find((u) => u.slug === slug);
}

export function getAllUseCaseSlugs(): string[] {
  return useCases.map((u) => u.slug);
}
