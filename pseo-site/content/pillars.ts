export interface Pillar {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
}

export const pillars: Record<string, Pillar> = {
  "github-signals-methodology": {
    slug: "github-signals-methodology",
    name: "GitHub Signals Methodology",
    description:
      "How engineering acceleration is measured, what each signal means, and how to read commit, contributor, and repository activity for investing.",
    keywords: [
      "GitHub signals",
      "engineering acceleration",
      "commit velocity",
      "contributor growth",
      "GitHub due diligence",
      "engineering metrics",
    ],
  },
  "deal-sourcing-workflow": {
    slug: "deal-sourcing-workflow",
    name: "Deal Sourcing Workflow",
    description:
      "Practical sourcing playbooks, pre-seed, seed, Series A, that combine GitHub signals with the rest of an investor's stack.",
    keywords: [
      "deal sourcing",
      "pre-seed sourcing",
      "Series A sourcing",
      "startup discovery",
      "founder outreach",
      "weekly sourcing workflow",
    ],
  },
  "alternative-data": {
    slug: "alternative-data",
    name: "Alternative Data for VC",
    description:
      "GitHub momentum in the broader landscape of alternative data, what it adds, what it replaces, where hiring/web/transactional data fit alongside it.",
    keywords: [
      "alternative data",
      "venture capital data",
      "open-source signals",
      "hiring data",
      "founder discovery",
      "leading indicators",
    ],
  },
  "sector-deep-dives": {
    slug: "sector-deep-dives",
    name: "Sector Deep Dives",
    description:
      "Sector-specific signal patterns, what GitHub activity looks like in fintech, AI, cybersecurity, climate-tech, and other technical verticals.",
    keywords: [
      "fintech startups",
      "AI startup signals",
      "cybersecurity startups",
      "climate-tech engineering",
      "sector engineering trends",
      "technical sector signals",
    ],
  },
  "founder-research": {
    slug: "founder-research",
    name: "Operator Notes",
    description:
      "First-hand notes from running the dataset, building a longitudinal panel of 350++ startup GitHub orgs, MCP server lessons, and other operator-side observations.",
    keywords: [
      "GitHub dataset",
      "operator notes",
      "MCP server",
      "VC dataset construction",
      "longitudinal panel",
    ],
  },
  "startup-due-diligence": {
    slug: "startup-due-diligence",
    name: "Startup Due Diligence",
    description:
      "How investors evaluate a startup before writing the check: team, market, product, and the engineering layer public GitHub data reveals before the data room opens.",
    keywords: [
      "startup due diligence",
      "VC due diligence",
      "how to evaluate a startup",
      "due diligence checklist",
      "technical due diligence",
      "investment due diligence",
    ],
  },

  "deal-flow-management": {
    slug: "deal-flow-management",
    name: "Deal Flow Management",
    description:
      "How to capture, triage, score, and prioritize inbound startup opportunities so the strongest deals surface before they raise.",
    keywords: [
      "deal flow management",
      "VC pipeline management",
      "deal flow CRM",
      "deal scoring",
      "startup pipeline",
      "deal triage",
    ],
  },

  "venture-scouting": {
    slug: "venture-scouting",
    name: "Venture Scouting",
    description:
      "How scouts and angels source, vet, and refer startups: scout programs, referral networks, and the leading-indicator data that finds deals before the databases do.",
    keywords: [
      "venture scouting",
      "startup scouting",
      "scout program",
      "angel sourcing",
      "deal referral",
      "startup discovery",
    ],
  },

  "engineering-velocity-benchmarks": {
    slug: "engineering-velocity-benchmarks",
    name: "Engineering Velocity Benchmarks",
    description:
      "Reference numbers for reading GitHub activity: what counts as fast, how sectors differ, and where the acceleration thresholds sit in the weekly panel.",
    keywords: [
      "engineering velocity benchmark",
      "commit velocity benchmark",
      "GitHub activity benchmark",
      "startup engineering benchmarks",
      "contributor growth benchmark",
    ],
  },

  "founder-evaluation": {
    slug: "founder-evaluation",
    name: "Founder Evaluation",
    description:
      "How to assess founder quality from public signals: technical capability, shipping discipline, and team-building patterns visible in GitHub and beyond.",
    keywords: [
      "founder evaluation",
      "founder due diligence",
      "technical founder assessment",
      "founder quality",
      "startup founder signals",
    ],
  },
};

export const postPillars: Record<string, string> = {
  "47-alternative-data-sources-angel-investors-2026": "alternative-data",
  "alternative-data-venture-capital": "alternative-data",
  "open-source-startups-investor-guide": "alternative-data",
  "github-signals-vs-hiring-data": "alternative-data",

  "how-vcs-track-engineering-acceleration-2026-playbook": "github-signals-methodology",
  "what-is-deal-flow-signal": "github-signals-methodology",
  "how-to-read-github-signals-for-startup-investing": "github-signals-methodology",
  "github-due-diligence-for-vcs": "github-signals-methodology",
  "5-github-patterns-that-predict-fundraises": "github-signals-methodology",
  "startup-engineering-metrics-investors-should-track": "github-signals-methodology",
  "what-is-engineering-acceleration": "github-signals-methodology",
  "commit-velocity-explained": "github-signals-methodology",
  "investor-mistakes-github-signals": "github-signals-methodology",

  "source-startup-deals-before-crunchbase": "deal-sourcing-workflow",
  "pre-seed-deal-sourcing-github": "deal-sourcing-workflow",
  "series-a-signals-github-data": "deal-sourcing-workflow",
  "deal-sourcing-workflow-weekly": "deal-sourcing-workflow",

  "fintech-startup-engineering-signals": "sector-deep-dives",
  "ai-startup-signals-2026": "sector-deep-dives",
  "cybersecurity-startup-signals": "sector-deep-dives",
  "climate-tech-engineering-signals": "sector-deep-dives",

  "i-tracked-369-startup-github-orgs-six-months": "founder-research",
  "mcp-server-tool-count-war-story": "founder-research",
  "a2a-launched": "founder-research",
  "receipts-launched": "founder-research",
  "scout-badge-launched": "founder-research",
  "series-a-race-2026-launched": "founder-research",

  "30-research-findings-now-one-page-each": "github-signals-methodology",
  "install-vc-deal-flow-signal-mcp-in-any-agent-runtime": "deal-sourcing-workflow",
  "startup-due-diligence-checklist-for-investors": "startup-due-diligence",
  "technical-due-diligence-with-github-data": "startup-due-diligence",
  "deal-flow-management-for-early-stage-investors": "deal-flow-management",
  "deal-flow-scoring-framework": "deal-flow-management",
  "venture-scouting-guide": "venture-scouting",
  "pre-seed-scouting-with-github-signals": "venture-scouting",
  "engineering-velocity-benchmarks-by-stage": "engineering-velocity-benchmarks",
  "commit-velocity-benchmark-numbers": "engineering-velocity-benchmarks",
  "how-to-evaluate-startup-founders": "founder-evaluation",
  "technical-founder-assessment-github": "founder-evaluation",

  // TOFU pillar cluster (2026-08-16)
  "venture-scout-programs-how-to-join": "venture-scouting",
  "pre-seed-vs-seed-vs-series-a": "deal-sourcing-workflow",
  "what-is-deal-flow-in-venture-capital": "deal-flow-management",
  "investing-in-open-source-startups": "alternative-data",
  "vc-signals-signal-vs-noise": "github-signals-methodology",
  "emerging-manager-deal-sourcing-playbook": "deal-sourcing-workflow",
  "free-vc-data-sources-guide": "alternative-data",
  "github-due-diligence-checklist-20-minutes": "startup-due-diligence",
  "ai-in-vc-deal-sourcing-practical-guide": "deal-sourcing-workflow",
  "how-to-track-startups-before-they-announce": "deal-sourcing-workflow",

  // ---- "How VCs source deals" cluster (2026-08-16, §51) ----
  "how-do-vcs-source-deals": "deal-sourcing-workflow",
  "how-vc-firms-find-startups-before-everyone-else": "deal-sourcing-workflow",
  "proprietary-deal-flow-what-it-actually-means": "deal-sourcing-workflow",
  "vc-deal-pipeline-stages-explained": "deal-flow-management",
  "warm-introductions-startup-fundraising": "deal-sourcing-workflow",
  "how-do-demo-days-work-for-investors": "deal-sourcing-workflow",
  "deal-sourcing-network-how-to-build-one": "deal-sourcing-workflow",
  "vc-sourcing-analyst-playbook": "deal-sourcing-workflow",
  "deal-sourcing-best-practices-vc": "deal-sourcing-workflow",
  "inbound-vs-outbound-deal-sourcing": "deal-sourcing-workflow",
};

export function getPillarForPost(slug: string): Pillar | undefined {
  const pillarSlug = postPillars[slug];
  if (!pillarSlug) return undefined;
  return pillars[pillarSlug];
}

export function getPostsInPillar(pillarSlug: string): string[] {
  return Object.entries(postPillars)
    .filter(([, p]) => p === pillarSlug)
    .map(([slug]) => slug);
}
