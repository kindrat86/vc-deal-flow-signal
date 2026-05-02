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
      "Practical sourcing playbooks — pre-seed, seed, Series A — that combine GitHub signals with the rest of an investor's stack.",
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
      "GitHub momentum in the broader landscape of alternative data — what it adds, what it replaces, where hiring/web/transactional data fit alongside it.",
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
      "Sector-specific signal patterns — what GitHub activity looks like in fintech, AI, cybersecurity, climate-tech, and other technical verticals.",
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
      "First-hand notes from running the dataset — building a longitudinal panel of 4,200+ startup GitHub orgs, MCP server lessons, and other operator-side observations.",
    keywords: [
      "GitHub dataset",
      "operator notes",
      "MCP server",
      "VC dataset construction",
      "longitudinal panel",
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

  "i-tracked-4200-startup-github-orgs-six-months": "founder-research",
  "mcp-server-tool-count-war-story": "founder-research",
  "a2a-launched": "founder-research",
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
