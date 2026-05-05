/**
 * Atomic signal primitives — one canonical definition per signal type. These
 * power /signals/[type] pillar pages and feed the DefinedTermSet on
 * /knowledge. Every primitive has:
 *   - A formal definition that maps to a column in the public dataset
 *   - The unit and rolling window
 *   - The decision rule used by the dashboard ranking
 *   - The interpretation an investor should attach to the signal
 *   - The pitfall most likely to mislead someone who skips the methodology
 *
 * Adding a new primitive: append to PRIMITIVES, then add the slug to
 * sitemap pagination + llms.txt sector list. The /signals/[type] route
 * statically generates pages from this array.
 */

export interface SignalPrimitive {
  slug: string;
  name: string;
  shortName: string;
  unit: string;
  window: string;
  formula: string;
  decisionRule: string;
  interpretation: string;
  pitfall: string;
  glossaryAnchor: string;
  relatedFindings: string[]; // research-finding slugs
  relatedPrimitives: string[]; // sibling slugs
}

export const PRIMITIVES: SignalPrimitive[] = [
  {
    slug: "commit-velocity",
    name: "Commit Velocity",
    shortName: "Commits / 14d",
    unit: "commits per 14-day window",
    window: "14 days, rolling",
    formula:
      "count(commits to default branch where committed_at within [t − 14d, t])",
    decisionRule:
      "Signal fires when commit velocity in the current window exceeds the prior window by ≥40% AND absolute count ≥10 commits.",
    interpretation:
      "A raw measure of engineering output. Useful as a baseline; not directly predictive on its own. The signal investors should watch is the rate-of-change (commit velocity change), not the absolute number.",
    pitfall:
      "Repos using squash-merging report dramatically lower commit counts than rebase/merge-commit repos for the same amount of work. We normalize by repo merge style; raw GitHub counts do not.",
    glossaryAnchor: "/glossary#commit-velocity",
    relatedFindings: [
      "median-commit-velocity-venture-startups",
      "mean-vs-median-commit-velocity-skew",
      "p90-commit-velocity-top-decile",
    ],
    relatedPrimitives: ["commit-velocity-change", "framework-migration"],
  },
  {
    slug: "commit-velocity-change",
    name: "Commit Velocity Change",
    shortName: "Δ Velocity (% QoQ)",
    unit: "percent change between adjacent 14-day windows",
    window: "Two adjacent 14-day windows",
    formula:
      "(velocity[t] − velocity[t − 14d]) / velocity[t − 14d]",
    decisionRule:
      "Sustained acceleration is defined as positive Δ velocity for ≥3 consecutive 14-day windows.",
    interpretation:
      "The primary ranking signal at VC Deal Flow Signal. Sustained acceleration historically precedes fundraise announcements by 3–6 weeks. Captures rate-of-change, so it works equally well across small and large repos.",
    pitfall:
      "A single big number (e.g. +1,647%) usually means the prior window was anomalously low. Always inspect the absolute baseline before acting on a percentage.",
    glossaryAnchor: "/glossary#commit-velocity-change",
    relatedFindings: [
      "quarterly-velocity-change-range",
      "half-of-vc-startups-show-positive-velocity-growth",
    ],
    relatedPrimitives: ["commit-velocity", "engineering-acceleration"],
  },
  {
    slug: "contributor-growth",
    name: "Contributor Growth",
    shortName: "Δ Unique Contributors",
    unit: "percent change in unique committers over a 6-week window",
    window: "Two adjacent 6-week windows",
    formula:
      "(distinct_authors[t − 6w, t] − distinct_authors[t − 12w, t − 6w]) / distinct_authors[t − 12w, t − 6w]",
    decisionRule:
      "Engineering hiring burst fires when contributor growth ≥50% AND absolute distinct authors ≥3.",
    interpretation:
      "A proxy for headcount growth. Rising contributor count typically means new hires, contractors, or community contributors — usually the first observable signal that a recent fundraise is being deployed.",
    pitfall:
      "Bot accounts (Renovate, Dependabot, snyk-bot, github-actions[bot]) inflate raw contributor counts. We exclude bots by handle suffix and verified-bot annotation.",
    glossaryAnchor: "/glossary#contributor-growth",
    relatedFindings: [],
    relatedPrimitives: ["engineering-hiring-burst", "commit-velocity"],
  },
  {
    slug: "engineering-hiring-burst",
    name: "Engineering Hiring Burst",
    shortName: "Hiring Burst",
    unit: "binary signal (fires / does not fire)",
    window: "6-week window",
    formula:
      "fires if contributor-growth ≥50% AND distinct_authors ≥3 AND no commits-from-new-author in prior 60 days",
    decisionRule:
      "Single firing per org per quarter; debounced so a continuous hiring ramp does not fire repeatedly.",
    interpretation:
      "Strong indicator that a startup recently closed a round and is deploying capital into engineering. For investors: probably too late for the current round, well-positioned for the next one.",
    pitfall:
      "An open-source project that suddenly gets popular can fire this without a fundraise. We attempt to filter by org-vs-project signals (private repo presence, .vercel.json, deploy automation), but the heuristic is imperfect.",
    glossaryAnchor: "/glossary#engineering-hiring-burst",
    relatedFindings: [],
    relatedPrimitives: ["contributor-growth", "infrastructure-buildout"],
  },
  {
    slug: "framework-migration",
    name: "Framework Migration",
    shortName: "Framework Swap",
    unit: "binary signal (fires / does not fire)",
    window: "Per commit",
    formula:
      "fires if a single PR removes >15% of source files in old-framework directory AND adds >15% in new-framework directory within the same diff",
    decisionRule:
      "Classified as high-confidence framework migration when paired with package.json / pyproject.toml dependency rotation in the same PR.",
    interpretation:
      "The dominant signal type observed: 75% of VC-backed startup GitHub signals are framework migrations, not new features. Counter-narrative to 'engineering velocity = hiring' — the dominant pattern is rewrites.",
    pitfall:
      "Some monorepo cleanups look like framework migrations to a heuristic (mass file moves between directories). We require the dependency-rotation co-occurrence to suppress false positives.",
    glossaryAnchor: "/glossary#framework-migration",
    relatedFindings: ["framework-migration-dominant-signal-type"],
    relatedPrimitives: ["infrastructure-buildout", "commit-velocity"],
  },
  {
    slug: "infrastructure-buildout",
    name: "Infrastructure Buildout",
    shortName: "Infra Buildout",
    unit: "binary signal (fires / does not fire)",
    window: "30-day window",
    formula:
      "fires when ≥3 of {Dockerfile, k8s manifest, terraform/, .github/workflows/, deployment config} are added/modified within a 30-day window",
    decisionRule:
      "Strongest weight when paired with the first appearance of a billing/auth dependency in package.json (e.g. stripe, clerk, auth0) — indicates production readiness.",
    interpretation:
      "Indicates a startup is moving from prototype to production. Often appears 4–8 weeks before a public launch announcement.",
    pitfall:
      "Open-source libraries publish infra (Dockerfiles, GitHub Actions, k8s charts) for distribution, not for their own use. We score down repos with library-shape signals (semver tags, npm/pypi presence).",
    glossaryAnchor: "/glossary#infrastructure-buildout",
    relatedFindings: [],
    relatedPrimitives: ["framework-migration", "commit-velocity-change"],
  },
];

export function getPrimitiveBySlug(slug: string): SignalPrimitive | undefined {
  return PRIMITIVES.find((p) => p.slug === slug);
}

export function getAllPrimitiveSlugs(): string[] {
  return PRIMITIVES.map((p) => p.slug);
}
