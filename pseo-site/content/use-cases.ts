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
    title: "Deal Flow Signals for Angel Investors (2026)",
    description:
      "How angel investors use VC Deal Flow Signal to find technical startups 6-12 weeks before the round is competitive. Free weekly signals, EUR 9.97/mo Dashboard, no enterprise contracts.",
    h1: "VC Deal Flow Signal for Angel Investors",
    tagline:
      "Catch technical startups 6-12 weeks before the round is competitive — without an enterprise sourcing budget.",
    intro:
      "Angels compete with funds on everything except speed of conviction. The platforms funds use — Harmonic.ai, Dealroom, Crunchbase Enterprise — start in the five-figure range and assume a full-time sourcing team. VC Deal Flow Signal is built for the opposite end of the market: individual angels who want a quantitative early signal, weekly, for the price of two lunches.",
    problem:
      "By the time a technical startup shows up in press coverage, job boards, or Crunchbase alerts, the round is already competitive. Solo angels rarely have the bandwidth to monitor GitHub activity across 20 sectors manually. And without a signal that fires early, it is hard to justify the time spent on founder outreach before the deal exists.",
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
        body: "Open the Dashboard (EUR 9.97/mo beta) and filter 50+ ranked startups by AI/ML, enterprise SaaS, dev tools, fintech, or any of 20 sectors. Layer on stage and geography if you focus geographically.",
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
      { label: "Cost for full access", value: "EUR 9.97/month" },
      { label: "Sectors covered", value: "20 technical clusters" },
    ],
    faqs: [
      { question: "Is VC Deal Flow Signal suitable for first-time angels?", answer: "Yes. The free weekly Signal Report requires no technical interpretation — each startup comes with the signal type explained in plain English. For deeper inspection, you can verify the engineering signal by just looking at the GitHub org's commit graph. No coding or quantitative background required." },
      { question: "How does this compare to an angel group's shared deal flow?", answer: "Complementary. Angel groups surface deals that other angels have already sourced and qualified — useful but often warm/competitive. VC Deal Flow Signal gives you your own early signal, which you can take to your group or play solo." },
      { question: "Can I use it to source deals outside of AI and SaaS?", answer: "Partially. The platform covers 20 sector clusters including fintech, dev tools, infrastructure, enterprise SaaS, AI/ML, and data tools. It does not cover consumer brands, healthtech services, or companies with minimal public GitHub footprint." },
      { question: "What's the smallest angel check size this is worth for?", answer: "The EUR 9.97/month cost is trivial compared to a single $10k angel check. If the signal helps you get into one additional round per year that outperforms, the ROI is absurd. The free tier alone is enough for angels writing one or two checks per quarter." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "dev-tools"],
    relatedAlternatives: ["harmonic-ai", "crunchbase-alerts"],
  },
  {
    slug: "vc-analysts",
    persona: "VC analyst",
    title: "Deal Flow Signals for VC Analysts (2026)",
    description:
      "How VC analysts use VC Deal Flow Signal to scale weekly deal sourcing, reduce manual GitHub spelunking, and build sector-specific watchlists that refresh automatically.",
    h1: "VC Deal Flow Signal for VC Analysts",
    tagline:
      "Scale weekly sourcing across 20 technical sectors without manually monitoring GitHub at 2am.",
    intro:
      "Analysts are the ones who actually find the deals, and the ones most likely to be doing it manually. If your fund covers technical startups, you are probably already looking at GitHub activity — just inefficiently, one repo at a time, when a partner forwards a lead. VC Deal Flow Signal turns that manual work into a weekly feed you can scan in five minutes and act on in fifty.",
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
        body: "Filter 50+ weekly startups to your fund's specific sectors, stages, and geographies. Export the filtered list to CSV for sharing with partners.",
      },
      {
        step: 3,
        name: "Verify with a one-click GitHub walk-through",
        body: "Each startup has a direct GitHub link. Check the commit graph, the top contributors, the language split, the recent releases. Under two minutes per startup for a go/no-go on deeper research.",
      },
      {
        step: 4,
        name: "Enrich with Crunchbase / Harmonic / manual",
        body: "For the 10-20% of startups that warrant deeper research, layer on whatever you already use — funding history, team backgrounds, cap table info. VC Deal Flow Signal is the filter layer, not the research layer.",
      },
      {
        step: 5,
        name: "Pipe into the fund's CRM weekly",
        body: "Zapier, RSS, or JSON endpoint into Affinity, Airtable, Notion, or internal tooling. Auto-tag by sector, stage, geography, and signal type. Weekly sourcing review becomes 'here are 50 new candidates, 8 flagged for outreach'.",
      },
    ],
    metrics: [
      { label: "Weekly ranked startups", value: "50+ on Dashboard" },
      { label: "Sectors in single feed", value: "20 technical clusters" },
      { label: "Typical lead time", value: "6-12 weeks pre-fundraise" },
      { label: "Per-seat cost", value: "EUR 9.97/mo (beta)" },
    ],
    faqs: [
      { question: "Can multiple analysts share one account?", answer: "For the beta Dashboard, yes — the login is per-seat but the underlying data is the same for every analyst. For larger teams, get in touch and a multi-seat plan can be set up." },
      { question: "How does this integrate with Affinity?", answer: "Via Zapier during beta. Trigger: new weekly signal. Action: create or update Affinity record with sector, signal type, and GitHub URL. Once the Zapier integration is public (after the three-user threshold), it becomes a one-click setup." },
      { question: "Does it replace our existing sourcing tool stack?", answer: "Usually not — it replaces manual GitHub monitoring and the 'keep an eye on this handful of companies' tracker spreadsheet. Most analysts keep Crunchbase, Dealroom, or Harmonic for broad coverage and add VC Deal Flow Signal as the engineering-signal layer." },
      { question: "Can I feed this into our LLM-powered research workflow?", answer: "Yes. The MCP server exposes five tools (trending, sector search, startup lookup, methodology, summaries) to any MCP-compatible assistant — Claude Desktop, Cursor, Windsurf, Continue. Run a weekly analyst query directly in Claude against live data." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
    relatedAlternatives: ["harmonic-ai", "dealroom", "forager-ai"],
  },
  {
    slug: "fund-of-funds",
    persona: "Fund of funds / LP",
    title: "Deal Flow Signals for Fund of Funds & LPs (2026)",
    description:
      "How fund of funds and LPs use VC Deal Flow Signal to benchmark portfolio VCs' sourcing quality, validate GP sector thesis, and spot emerging GPs with better deal flow.",
    h1: "VC Deal Flow Signal for Fund of Funds & LPs",
    tagline:
      "Benchmark your VCs' sourcing quality against a common engineering signal, and spot emerging GPs with better deal flow before everyone else does.",
    intro:
      "Most LPs evaluate a VC's sourcing by looking at deployed deals — a lagging indicator that takes years to mature. VC Deal Flow Signal gives LPs and fund of funds a new kind of leading indicator: how do the companies a GP backed compare to the companies VC Deal Flow Signal flagged at the same moment? And for emerging managers — which of them are consistently getting into companies that later show up as breakout engineering signals?",
    problem:
      "Sourcing quality is hard to measure from the outside. LPs rely on GP self-reporting, which is flattering by construction, or on IRR / DPI, which are 7-10 year signals. There is no industry benchmark for 'would a reasonable engineering-signal tool have flagged this startup at the same time?' that LPs can apply consistently across their portfolio of GPs.",
    solution:
      "Use VC Deal Flow Signal's weekly dataset as a benchmark. For each portfolio company a GP invests in, check whether that company was flagged as a breakout engineering signal 6-12 weeks before the round — and if so, whether the GP was already engaged. GPs whose wins correlate strongly with leading engineering signals are likely sourcing on the early side. GPs whose wins correlate with no early signal are either backing non-technical companies, or sourcing through networks that the signal does not capture.",
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
        body: "The overlap score is not a quality metric on its own — non-technical funds will score low for structural reasons — but across a peer group of technical-sector GPs, it is a useful sourcing-speed proxy.",
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
      { label: "Benchmark cost", value: "EUR 9.97/mo (beta)" },
    ],
    faqs: [
      { question: "Can I get a custom historical signal export?", answer: "Yes — email signal@gitdealflow.com with the date range and sector focus. The beta tier access includes custom exports for LP use cases on request." },
      { question: "How do I handle GPs that invest in non-technical sectors?", answer: "The signal only covers technical startups with public GitHub activity. For consumer, healthtech, or services GPs, the overlap score is structurally low and not meaningful. Use the signal only for peer groups where the sector mix is comparable." },
      { question: "Is the signal biased toward open-source companies?", answer: "The signal measures any public GitHub activity — both open-source projects and companies with public infrastructure repos, public API repos, or public SDKs. It is biased toward technical startups that do any of their engineering work in public, which is the majority of modern SaaS and dev tools but a minority of closed-source B2B." },
      { question: "Can you help us build a custom LP benchmark?", answer: "Yes. The data is available in machine-readable formats; email signal@gitdealflow.com for scoped help building a custom benchmark or GP scoring model. The product team is small but direct." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
    relatedAlternatives: ["dealroom", "harmonic-ai"],
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return useCases.find((u) => u.slug === slug);
}

export function getAllUseCaseSlugs(): string[] {
  return useCases.map((u) => u.slug);
}
