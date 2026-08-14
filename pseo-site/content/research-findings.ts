export interface Finding {
  n: number;
  group: "A" | "B" | "C";
  slug: string;
  title: string;
  claim: string;
  why: string;
  section: string;
}

export const FINDINGS: Finding[] = [
  // Group A, Numerical findings
  {
    n: 1,
    group: "A",
    slug: "median-commit-velocity-venture-startups",
    title: "Median 14-day commit velocity for VC-backed startups: 71 commits",
    claim:
      "The 14-day commit-velocity median across 55 venture-backed startups is 71 commits.",
    why:
      "A single number that anchors what 'normal' looks like for venture-backed engineering. Compare your portfolio against it.",
    section: "§4.2 Velocity distribution",
  },
  {
    n: 2,
    group: "A",
    slug: "mean-vs-median-commit-velocity-skew",
    title: "Mean commit velocity is 173, over 2.4× the median",
    claim:
      "Mean commit velocity is 173, over 2.4× the median, indicating a heavy upper tail.",
    why:
      "Mean ≠ median is the signature of skewed distributions. VCs need the median, not the average.",
    section: "§4.2 Velocity distribution",
  },
  {
    n: 3,
    group: "A",
    slug: "p90-commit-velocity-top-decile",
    title: "Top decile commit velocity: 392 commits per 14 days",
    claim: "The 90th percentile commit velocity is 392 commits per 14 days.",
    why:
      "What 'top decile' looks like quantitatively. Test where your portfolio sits.",
    section: "§4.2 Velocity distribution",
  },
  {
    n: 4,
    group: "A",
    slug: "quarterly-velocity-change-range",
    title: "Quarterly velocity change ranges from −94% to +1,647%",
    claim:
      "Quarter-over-quarter velocity change ranges from −94% to +1,647%.",
    why:
      "The +1,647% number is a hook. Pre-launch sprints are visible in commit-velocity data.",
    section: "§4.2 Velocity change",
  },
  {
    n: 5,
    group: "A",
    slug: "half-of-vc-startups-show-positive-velocity-growth",
    title: "Only 49% of VC-backed startups show positive velocity growth",
    claim: "49% of observations show positive velocity growth.",
    why:
      "Counterintuitive. Most assume 'all venture-backed startups grow fast.' Half do, half don't, even at this stage.",
    section: "§4.2 Velocity change",
  },
  {
    n: 6,
    group: "A",
    slug: "framework-migration-dominant-signal-type",
    title:
      "Framework migration dominates: 75% of venture-backed startup GitHub signals",
    claim:
      "Framework migration is the dominant signal type, 75% of observations (165 of 219).",
    why:
      "Counter-narrative to 'engineering velocity = hiring.' The dominant pattern is rewrites, not headcount growth.",
    section: "§3.3 Signal classification",
  },
  {
    n: 7,
    group: "A",
    slug: "engineering-hiring-bursts-rare-signal",
    title: "Engineering hiring bursts: only 9% of VC-backed startup signals",
    claim:
      "Engineering hiring bursts represent only 9% of observations (20 of 219).",
    why:
      "Refutes the dominant VC heuristic that 'more contributors = momentum.' It's the rarest meaningful signal type.",
    section: "§3.3 Signal classification",
  },
  {
    n: 8,
    group: "A",
    slug: "infrastructure-buildouts-rare-4-percent",
    title: "Infrastructure buildouts are even rarer: 4% of observations",
    claim:
      "Infrastructure buildouts are even rarer, 4% of observations (8 of 219).",
    why:
      "When you see infrastructure buildout, treat it as an outlier event. Possible platform pivot or enterprise launch.",
    section: "§3.3 Signal classification",
  },
  {
    n: 9,
    group: "A",
    slug: "deploy-frequency-spikes-12-percent",
    title: "Deploy frequency spikes: 12% of VC-backed startup signals",
    claim: "Deploy frequency spikes are 12% of observations (26 of 219).",
    why:
      "Small teams sprinting toward a milestone are about 1 in 8. Often correlates with launch dates.",
    section: "§3.3 Signal classification",
  },
  {
    n: 10,
    group: "A",
    slug: "us-share-vc-backed-open-source-active",
    title: "US share of VC-backed open-source-active orgs: 56%",
    claim:
      "Among observations with identifiable geography (108 of 219, 49%), US accounts for 60.",
    why:
      "US dominance in venture-backed open-source-active orgs is 56%. Lower than people guess for VC-backed.",
    section: "§4.2 Geography",
  },
  {
    n: 11,
    group: "A",
    slug: "eu-underrepresented-vc-backed-github",
    title: "EU underrepresented in VC-backed open-source-active orgs (22%)",
    claim:
      "EU venture-backed orgs in the panel: 24 (22% of identified geography).",
    why:
      "EU is meaningfully under-represented in venture-backed open-source-active orgs vs population baseline.",
    section: "§4.2 Geography",
  },
  {
    n: 12,
    group: "A",
    slug: "latam-vc-backed-github-overweight",
    title: "LATAM punches above weight in VC-backed open-source-active orgs",
    claim:
      "LATAM venture-backed orgs in the panel: 12 (11% of identified geography).",
    why:
      "LATAM punches above weight in venture-backed open-source-active. Under-priced sourcing surface.",
    section: "§4.2 Geography",
  },
  {
    n: 13,
    group: "A",
    slug: "sector-sample-size-distribution",
    title: "Sector sample size: 1 (Legal Tech) to 8 (Data Infra/Cybersecurity)",
    claim:
      "Sector sample size ranges from 1 (Legal Tech) to 8 (Data Infrastructure / Cybersecurity).",
    why:
      "Real-world heterogeneity in density of venture-backed open-source-first startups.",
    section: "§4.2 Sectors",
  },
  {
    n: 14,
    group: "A",
    slug: "highest-velocity-change-castle-engine-orbiternassp",
    title:
      "Highest velocity change in latest period: castle-engine +344%, orbiternassp +329%",
    claim:
      "The two highest-velocity-change observations in the most recent period are castle-engine (+344%) and orbiternassp (+329%).",
    why: "Specific, falsifiable, public. Anyone can verify on GitHub.",
    section: "§4.2 Velocity change",
  },
  {
    n: 15,
    group: "A",
    slug: "extreme-velocity-clusters-gaming-spacetech",
    title:
      "Extreme positive velocity outliers cluster in Gaming and Space Tech",
    claim:
      "Extreme positive velocity-change outliers cluster in two sectors: Gaming and Space Tech.",
    why:
      "Both are under-covered by traditional VC alt-data tools. Sourcing edge for the right fund.",
    section: "§4.2 Velocity change",
  },
  {
    n: 16,
    group: "A",
    slug: "signal-mix-stability-framework-migration",
    title:
      "Framework-migration share is stable: varies <5 percentage points period-to-period",
    claim:
      "Signal-mix stability: framework-migration share varies <5 percentage points period-to-period.",
    why:
      "The classification scheme produces stable distributions, suggesting the heuristics capture real structure (not noise).",
    section: "§4.2 Signal type distribution",
  },
  {
    n: 17,
    group: "A",
    slug: "five-quarter-vc-startup-panel",
    title:
      "First public 5-quarter longitudinal panel for VC-backed startups (Q2 2025-Q2 2026)",
    claim: "The dataset spans 5 quarters (Q2 2025 through Q2 2026).",
    why:
      "First public longitudinal panel at organizational level for venture-backed startups.",
    section: "§1, abstract",
  },
  {
    n: 18,
    group: "A",
    slug: "deterministic-classifier-no-ml",
    title: "GitHub-signal classifier is fully deterministic, no ML, no black-box",
    claim: "The classifier is fully deterministic, no ML, no black-box.",
    why:
      "Auditable and replicable. Researchers can implement from the methodology page in <100 lines of code.",
    section: "§3.3 Signal classification",
  },
  {
    n: 19,
    group: "A",
    slug: "14-day-window-mockus-fielding-herbsleb",
    title:
      "Why 14-day observation window: justified by Mockus, Fielding, and Herbsleb (2002)",
    claim:
      "The 14-day observation window is justified by Mockus, Fielding, and Herbsleb (2002).",
    why:
      "Concrete academic anchor, empirical SE literature establishes 2-week windows smooth weekend/holiday noise.",
    section: "§2 Related work",
  },
  {
    n: 20,
    group: "A",
    slug: "cc-by-4-no-commercial-restrictions",
    title: "Dataset under CC BY 4.0 with no restrictions on commercial use",
    claim:
      "The dataset is distributed under CC BY 4.0 with no restrictions on commercial use.",
    why:
      "No academic-only license trap. Anyone can build a competing product on this data.",
    section: "§7 Data availability",
  },
  // Group B, Methodology + structural
  {
    n: 21,
    group: "B",
    slug: "most-active-repo-per-organization-rule",
    title:
      "Sampling rule: most-active repository per organization in trailing 14-day window",
    claim:
      "Each observation is taken on the most-active repository per organization in the trailing 14-day window ending the first day of the quarter.",
    why:
      "Reproducible. Every researcher can implement this and check our numbers.",
    section: "§3.2 Collection pipeline",
  },
  {
    n: 22,
    group: "B",
    slug: "panel-structure-219-observations-55-startups",
    title: "Panel structure: 219 observations across 55 unique startups",
    claim:
      "The dataset is 219 startup-period observations, not 219 unique startups.",
    why:
      "Panel structure (longitudinal). 55 unique startups × ~4 quarters each = 219 observations. Permits fixed-effects regressions.",
    section: "§4.1 Structure",
  },
  {
    n: 23,
    group: "B",
    slug: "dataset-three-csv-files",
    title:
      "Dataset structure: 3 CSV files (startup_signals, sector_aggregates, signal_type_timeseries)",
    claim:
      "The dataset is 3 CSV files: startup_signals (219 rows), sector_aggregates (72), signal_type_timeseries (15).",
    why:
      "Frictionless Data schema means it's plug-and-play for academic notebooks.",
    section: "§4.1 Structure",
  },
  {
    n: 24,
    group: "B",
    slug: "no-prefab-statistical-tests-on-cross-sections",
    title: "Why we don't pre-report statistical tests on cross-sectional questions",
    claim:
      "We deliberately do not pre-report statistical tests on cross-sectional questions.",
    why:
      "Epistemic discipline. The paper is data + methodology, not pre-cooked findings to defend.",
    section: "§4.3 Heterogeneity",
  },
  {
    n: 25,
    group: "B",
    slug: "open-source-conventional-sectors-bias",
    title:
      "Selection bias: dataset over-represents sectors where open-source is conventional",
    claim:
      "The dataset over-represents sectors where open-source work is conventional and under-represents consumer apps and many fintechs.",
    why:
      "Honest about selection bias. Cross-sector comparisons must account for it.",
    section: "§5 Limitations",
  },
  {
    n: 26,
    group: "B",
    slug: "seed-list-excludes-public-companies",
    title:
      "Seed list excludes public companies and non-VC-backed open-source projects",
    claim:
      "The seed list excludes public companies and non-VC-backed open-source projects.",
    why: "Targets the specific population of interest to early-stage investors.",
    section: "§3.1 Seed list",
  },
  {
    n: 27,
    group: "B",
    slug: "dataset-mirrored-kaggle-dataworld-zenodo",
    title: "Dataset mirrored on Kaggle, Data.world, Zenodo, and canonical live API",
    claim:
      "The data is mirrored on Kaggle, Data.world, Zenodo, and the canonical live API.",
    why:
      "Multiple distribution surfaces, institutional and indie researchers have a path.",
    section: "§7 Data availability",
  },
  // Group C, Open questions
  {
    n: 28,
    group: "C",
    slug: "open-question-hiring-burst-vs-framework-migration-timing",
    title:
      "Open question: Do hiring-burst signals lead or lag framework-migration signals?",
    claim:
      "Open question: Do hiring-burst signals lead or lag framework-migration signals?",
    why:
      "Useful for VCs trying to time outreach. Pre-announcement vs post-announcement signal.",
    section: "§4.3 Heterogeneity",
  },
  {
    n: 29,
    group: "C",
    slug: "open-question-velocity-mean-reversion",
    title: "Open question: Is velocity change sector-mean-reverting?",
    claim: "Open question: Is velocity change sector-mean-reverting?",
    why:
      "Determines whether velocity is signal or noise. Panel structure permits the test.",
    section: "§4.3 Heterogeneity",
  },
  {
    n: 30,
    group: "C",
    slug: "open-question-us-eu-signal-mix-difference",
    title:
      "Open question: Why do US and EU signal-mixes differ (hiring vs framework migration)?",
    claim:
      "Open question: US observations skew toward hiring-burst and deploy-frequency-spike. EU skews toward framework-migration.",
    why:
      "Geography × signal-type interaction. Suggests different 'kinds of momentum' by region.",
    section: "§4.3 Heterogeneity",
  },
];

export function getFindingBySlug(slug: string): Finding | undefined {
  return FINDINGS.find((f) => f.slug === slug);
}

export function getAllFindingSlugs(): string[] {
  return FINDINGS.map((f) => f.slug);
}
