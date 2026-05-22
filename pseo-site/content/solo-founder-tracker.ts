/**
 * Solo-Founder Tracker — per-sector "one-person unicorn" thesis pages.
 *
 * Route: /solo-founder-tracker/[sector]
 * Distinct from /predicted (all-stage, all-org-shape) and
 * /startups-to-watch/[slug] (sector ranking). This surface answers a
 * narrower question: which sectors are throwing off solo-founder
 * engineering acceleration right now, and what shape does that
 * acceleration take?
 *
 * Anonymity rule preserved: no founder names, no individuals. We describe
 * the *pattern* — commit/star/contributor thresholds, observable shapes,
 * common false positives — and link to the live data feeds at /predicted
 * and /startups-to-watch/[sector] for the actual orgs.
 *
 * Each entry maps 1:1 to the canonical sector slug in
 * data/startups.json. Adding a new entry requires the parent sector to
 * exist in the dataset.
 */

export interface SoloFounderThresholds {
  /** Floor for total repo stars on the main breakout repo. */
  stars: number;
  /** Floor for default-branch commits in the rolling 90-day window. */
  commits90d: number;
  /** Maximum distinct human committers — solo-founder by definition. */
  maxContributors: number;
  /** Fraction of commits attributable to the top contributor (decimal). */
  topContributorShare: number;
  /** Window over which contributor concentration must hold. */
  concentrationWindow: string;
}

export interface SoloFounderSectorEntry {
  /** Sector slug — must match a sector in data/startups.json. */
  slug: string;
  /** Display name (matches dataset). */
  name: string;
  /** One-sentence editorial hook for OG cards and hero tagline. */
  tagline: string;
  /** ~120-word opening — why solo-founder breakouts show up in this sector. */
  whyOneFounder: string;
  /** Threshold definition — per-sector overrides of the defaults. */
  thresholds: SoloFounderThresholds;
  /** Tooling/dependency footprint that signals a solo-builder in this sector. */
  toolingFootprint: string;
  /** Observable acceleration shape — the curve a sourcer should learn to see. */
  patternToWatch: string;
  /** Most common false-positive pattern that masquerades as solo-founder signal. */
  pitfall: string;
  /** Archetype description — anonymous, never a real founder. */
  archetype: string;
  /** Related sector slugs for cross-axis nav. */
  relatedSectors: string[];
  /** Slug of a related /answers page (optional). */
  relatedAnswerSlug?: string;
  /** ISO date of last editorial review. */
  updatedAt: string;
}

const DEFAULT_THRESHOLDS: SoloFounderThresholds = {
  stars: 500,
  commits90d: 60,
  maxContributors: 3,
  topContributorShare: 0.85,
  concentrationWindow: "rolling 90 days",
};

export const SOLO_FOUNDER_SECTORS: SoloFounderSectorEntry[] = [
  {
    slug: "ai-ml",
    name: "AI & Machine Learning",
    tagline:
      "Where the one-person research repo turns into a one-person inference company before anyone notices.",
    whyOneFounder:
      "AI/ML is the densest solo-founder sector on the panel by an order of magnitude. A single technical founder with a fine-tuned model and a thin inference wrapper can ship a paying product before the first contributor PR lands. The shape we see most often: an evening-and-weekend research repo accumulates stars from a single Hacker News thread, the founder ships an OpenAI-compatible endpoint in week six, and revenue precedes hiring by 8–14 weeks. The hiring lag is the signal — strong commit velocity with no contributor growth means the founder is still alone and still in control of the technical direction.",
    thresholds: {
      stars: 800,
      commits90d: 90,
      maxContributors: 2,
      topContributorShare: 0.92,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Single-developer signatures: vLLM or llama.cpp in deps, a /api/openai-compatible route, Modal or Replicate in workflow files, a Stripe-checkout-only Next.js front-end, no team-issue templates, README written in first-person singular.",
    patternToWatch:
      "Three consecutive 14-day windows with ≥40% commit-velocity growth while distinct authors stay at 1. Stars climb in step-functions tied to single Twitter/X threads, not gradual organic growth. The repo flips from research-licensed to commercial-licensed mid-quarter.",
    pitfall:
      "Cursor-augmented solo developers commit AI-suggested code at velocities indistinguishable from a 3-person team. Verify by inspecting commit message style and the ratio of single-line to multi-line commits — co-pilot output skews short and surgical.",
    archetype:
      "Ex-FAANG ML engineer ships an inference proxy over a weekend, gets 4k stars in 72 hours, takes the GitHub Sponsors button down once Stripe is live, and is still the only contributor 90 days later.",
    relatedSectors: ["developer-tools", "data-infrastructure", "enterprise-saas"],
    relatedAnswerSlug: "how-to-find-ai-startups-before-they-raise",
    updatedAt: "2026-05-22",
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    tagline:
      "The classic solo-builder sector — your customers are the only audience that can read the diff.",
    whyOneFounder:
      "Developer tools is the most over-represented solo-founder sector after AI/ML. The customer is the founder, the distribution channel is GitHub itself, and the entire go-to-market is a well-shaped README plus one viral comparison post. We watch for repos where the founder is shipping CLI tools, language servers, build-tool plugins, or framework adapters with a tight commit cadence and zero external PRs accepted — the latter is often deliberate: the founder is holding the line on scope until paid tier ships.",
    thresholds: {
      stars: 600,
      commits90d: 75,
      maxContributors: 2,
      topContributorShare: 0.90,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "TypeScript + esbuild/Rollup/Vite, a single `bin/` entry in package.json, GoReleaser or cargo-release in CI, Homebrew/Scoop install instructions ahead of `npm install`, sponsor button in the README, no CONTRIBUTING.md.",
    patternToWatch:
      "Star spike tied to a specific framework or tooling release (e.g., Bun 1.5 ships → a dozen Bun-adjacent solo-builder repos spike inside 14 days). Commit velocity stays high through the spike — the founder is shipping into the attention window, not waiting for it.",
    pitfall:
      "Internal company tools open-sourced as side projects look identical to solo-founder commits but resolve to an employer's payroll. Cross-check the commit email domain against the README author footer; mismatch means it's a corporate side-project, not a founder bet.",
    archetype:
      "Senior platform engineer ships an alternative to a popular CLI tool with ~30% better DX, sells $19/mo cloud tier from week eight, and never accepts a code contribution to keep the surface area defensible.",
    relatedSectors: ["ai-ml", "data-infrastructure", "cybersecurity"],
    relatedAnswerSlug: "best-github-signals-for-developer-tools",
    updatedAt: "2026-05-22",
  },
  {
    slug: "data-infrastructure",
    name: "Data Infrastructure",
    tagline:
      "The lone-engineer database — distinct architecture, distinct philosophy, distinct revenue curve.",
    whyOneFounder:
      "Data infrastructure has a high solo-founder density because the architectural decisions that differentiate the product cluster in a single brain. A new database, a new query engine, a new pipeline tool — these are projects where you cannot ship by committee in the first 18 months. Once a second engineer joins, the architecture freezes. We watch for the window between viable demo and first hire: that's where the engineering signal is loudest and the valuation cleanest.",
    thresholds: {
      stars: 700,
      commits90d: 80,
      maxContributors: 2,
      topContributorShare: 0.90,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Rust or Zig in the main repo, a benchmark suite that ships in the same PR as the README, a public `docs.<project>.dev` with a single-author 'team' page, no Slack/Discord links — usually GitHub Discussions only, a `BENCHMARKS.md` updated more often than the changelog.",
    patternToWatch:
      "Commit velocity ramps inversely to issue-close rate — founder is rewriting faster than the community can catch up. Star growth follows a single technical post on HN or LobsteRs. Watch for the moment the founder enables GitHub Sponsors AND deletes the contributing guide.",
    pitfall:
      "Apache-foundation-style projects with one dominant maintainer look like solo-founder signal but are governance-locked. Check for an ASF or CNCF affiliation in the README header — those projects cannot be productized by the maintainer.",
    archetype:
      "Database engineer ships a Postgres-extension-as-a-product, gets profiled in a database-newsletter Substack, ships a managed cloud tier from the same repo's main branch, and is still the sole committer at $500k ARR.",
    relatedSectors: ["developer-tools", "ai-ml", "enterprise-saas"],
    relatedAnswerSlug: "how-to-spot-breakout-database-startups",
    updatedAt: "2026-05-22",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    tagline:
      "The single-researcher security tool — fast iteration, hard moat, narrow surface.",
    whyOneFounder:
      "Security tooling rewards a single technical author for the first 18 months because the customer trust signal is the author's name on the byline. Solo-founder security companies usually emerge from a researcher's CVE backlog: one engineer ships a tool that automates their own disclosure workflow, then quietly turns it into a paid scanner. The hiring lag is intentional — adding contributors dilutes the technical-authority signal that buyers are paying for.",
    thresholds: {
      stars: 400,
      commits90d: 60,
      maxContributors: 2,
      topContributorShare: 0.88,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Go or Rust, a `SECURITY.md` that lists a single PGP key fingerprint, scanner-style CLI with `-target` and `-format` flags, GitHub-Sponsors-only funding (no VC mention in README), Trivy/Snyk/OWASP-style naming convention.",
    patternToWatch:
      "Commit clusters tied to a CVE disclosure cycle — vulnerability announced Tuesday, scanner shipped Thursday, paid tier announced the following Monday. Star growth tracks news-cycle attention, not organic developer adoption.",
    pitfall:
      "Penetration-tester individual brands look like solo-founder companies but resolve to consulting revenue rather than product revenue. Look for a `/pricing` page that isn't gated behind 'contact for quote' — that's the difference between a product company and a consulting brand.",
    archetype:
      "Application-security researcher ships a CI scanner that catches a specific OWASP class better than the incumbents, sells it to three Fortune-500 security teams in month four, and is still the sole engineer at Series A.",
    relatedSectors: ["developer-tools", "data-infrastructure", "enterprise-saas"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "fintech",
    name: "Fintech",
    tagline:
      "Solo founders inside fintech are rarer — but the ones who ship cross the revenue line faster than any other sector.",
    whyOneFounder:
      "Fintech is a hostile sector for solo-founder breakouts because regulation eats engineering velocity, but the ones that do break through tend to have outsized revenue per engineer. These are typically API-wrapper companies, infrastructure middleware (e.g., a Stripe-to-Ramp routing layer), or compliance automation. The shape: a single engineer ships a thin SaaS over an existing financial primitive, hits product-market fit before the legal entity is incorporated, and stays solo through the first capital raise.",
    thresholds: {
      stars: 300,
      commits90d: 50,
      maxContributors: 2,
      topContributorShare: 0.85,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Plaid/Stripe/Modern Treasury in deps, a `compliance/` directory next to `src/`, SOC2-style audit-log scaffolding in the codebase, Postgres + Drizzle/Prisma, no `/team` page on the marketing site.",
    patternToWatch:
      "Commit velocity is lower than other sectors but more consistent — the founder is shipping into a regulatory clock, not a marketing clock. Watch for a sudden spike of `compliance/` directory commits 6-10 weeks before a public funding announcement.",
    pitfall:
      "Many 'solo-founder fintech' repos are actually side projects of bank or PE-firm engineers and never incorporate. Check for a registered LLC or Ltd on Companies House / state registry before treating the signal as live.",
    archetype:
      "Banking engineer wraps a Plaid endpoint with a CFO-friendly dashboard, sells it to nine RIAs in four months, and is still the only person with database access at €1.5M ARR.",
    relatedSectors: ["enterprise-saas", "data-infrastructure", "legal-tech"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "enterprise-saas",
    name: "Enterprise SaaS",
    tagline:
      "The one-engineer B2B tool with three logos and no marketing site.",
    whyOneFounder:
      "Enterprise SaaS solo founders are usually vertical-niche operators — payroll for tattoo studios, scheduling for veterinary clinics, inventory for ghost kitchens. The technical surface is small, the customer pain is acute, and the founder ships every feature themselves until contract value justifies the second hire. We watch for repos where the customer-facing app is a thin Next.js wrapper around a small Postgres schema, and the founder is shipping nights-and-weekends commits while holding a day job for the first 9-12 months.",
    thresholds: {
      stars: 150,
      commits90d: 60,
      maxContributors: 2,
      topContributorShare: 0.88,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Next.js + Drizzle/Prisma + Clerk/Auth.js + Stripe Billing, Tailwind + shadcn/ui, a 'customers' page listing 3-7 logos, founder-narrated Loom embeds instead of a product demo video, no roadmap page.",
    patternToWatch:
      "Commits cluster on evenings UTC-5 through UTC-8 — solo founder still has a day job. Star count stays low (under 200) because the audience is buyers, not developers. Watch for a sudden weekday-morning commit shift — that's the day the founder quit their job.",
    pitfall:
      "Many vertical-SaaS repos are private; the public signal is sparse. Compensate by watching commit-velocity on the founder's personal account across all their public repos — a quiet personal account paired with a chatty Twitter/X feed is the strongest version of this signal.",
    archetype:
      "Senior engineer at a Big SaaS quietly ships scheduling software for medical-spa chains, hits €30k MRR in seven months, posts a 'I quit' tweet, and is still the only committer 18 months later.",
    relatedSectors: ["developer-tools", "data-infrastructure", "hr-tech"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "climate-tech",
    name: "Climate Tech",
    tagline:
      "Solo founders in climate are usually software-on-top — instrument-grade data services shipped by one engineer.",
    whyOneFounder:
      "Pure climate-tech solo founders are rare — the hardware capex shape doesn't fit a single-engineer company. But the software layer on top of climate data (carbon accounting, energy-trading analytics, ESG reporting, grid-flexibility APIs) does. These are wrapper companies: one engineer pulls public satellite/weather/grid data, structures it for a specific buyer (corporate ESG team, utility ops desk, carbon-credit auditor), and sells the resulting API.",
    thresholds: {
      stars: 200,
      commits90d: 45,
      maxContributors: 2,
      topContributorShare: 0.85,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Python (xarray, GeoPandas, rasterio), a `data/sources.md` documenting NOAA/ESA/Copernicus pulls, Parquet output formats, a `methodology.md` heavier than the README, no marketing site.",
    patternToWatch:
      "Commit cadence ramps after each new public dataset release (ERA5, Sentinel-2, EIA). The founder is data-pipeline-driven, not feature-driven. Watch for the shift from open-data scripts to a paid `/api` route — that's the moment the company exists.",
    pitfall:
      "Academic research repos look identical to solo-founder climate-tech companies for the first 12 months. Check for a `LICENSE` other than GPL and a `pricing` page; academia almost never has either.",
    archetype:
      "PhD candidate operationalises their thesis pipeline, gets a single corporate ESG team to pay €2k/month for the JSON output, and is still alone at the point a Climate Fund LP signs the term sheet.",
    relatedSectors: ["data-infrastructure", "ai-ml", "agtech"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    tagline:
      "The one-clinician engineer — the rarest solo-founder shape, and the most predictable revenue curve when it shows.",
    whyOneFounder:
      "Healthcare solo founders are almost always domain-expert engineers — practising clinicians who ship a tool for their own workflow. The regulatory clock is brutal, but the founder is also the only person who can credibly sell the product, so the company stays small by design. We watch for repos that pair a clinical-vocabulary README with FHIR/HL7 imports — that combination usually resolves to a single-clinician founder shipping into their own specialty.",
    thresholds: {
      stars: 120,
      commits90d: 35,
      maxContributors: 2,
      topContributorShare: 0.90,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Python/TypeScript with FHIR libraries (fhir.resources, fhir-kit-client), HIPAA/GDPR-friendly hosting tags (HetznerCloud-eu, Render-eu, AWS HIPAA), a `clinical-validation.md` doc, no `/about` page with photos.",
    patternToWatch:
      "Commits cluster on weekends and after 19:00 local — the founder is practising medicine during the week. Watch for a sudden shift to weekday-morning commits, which usually coincides with the founder going part-time at their clinic.",
    pitfall:
      "Hospital IT side-projects look like solo-founder companies but resolve to a hospital's IP-assignment clause. Check the commit-email domain — anything ending in a hospital-system TLD (.health, .hospital, mayoclinic.org) is institutional, not founder-owned.",
    archetype:
      "Practising radiologist ships a DICOM-annotation tool for their own reads, sells it to four imaging groups by month nine, and is still the only engineer at the first institutional cheque.",
    relatedSectors: ["enterprise-saas", "ai-ml", "data-infrastructure"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "edtech",
    name: "EdTech",
    tagline:
      "Solo-founder edtech is the indie-builder sector — paid B2C, no contract sales, founder-as-instructor.",
    whyOneFounder:
      "Edtech is one of the highest solo-founder densities outside developer tools because the founder is also the content creator. Single-engineer edtech companies are usually paid B2C: a course platform, a flashcard SaaS, an interview-prep tool, a niche certification. The audience comes from the founder's own teaching content (YouTube, Substack, Twitter), not from sales outreach.",
    thresholds: {
      stars: 200,
      commits90d: 50,
      maxContributors: 2,
      topContributorShare: 0.87,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Next.js + Stripe + a course-content directory in the repo (markdown or MDX), `mdx-bundler` or contentlayer in deps, a `/blog` route serving the founder's teaching content, no `/team` page.",
    patternToWatch:
      "Star count grows in lockstep with the founder's YouTube subscriber count — content velocity drives engineering velocity. Watch for the founder's commit log going quiet for 2-3 weeks while a course launch ships, then resuming aggressively.",
    pitfall:
      "Course-creator side projects look like edtech companies but resolve to creator revenue, not SaaS revenue. The tell is the `/pricing` page: course-creator pricing is one-time or pay-what-you-want; SaaS pricing is recurring with tiers.",
    archetype:
      "Senior engineer ships a paid interview-prep platform off the back of a YouTube channel with 40k subscribers, hits €15k MRR in six months, never hires.",
    relatedSectors: ["social-community", "enterprise-saas", "developer-tools"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "ecommerce-infrastructure",
    name: "E-commerce Infrastructure",
    tagline:
      "Single-engineer Shopify/Stripe extensions — small TAM, fast revenue, sticky LTV.",
    whyOneFounder:
      "E-commerce infrastructure attracts solo founders because the platforms (Shopify, Stripe, Lemon Squeezy, Crossmint) provide the heavy lifting; the founder ships a thin extension that solves a specific merchant pain. Customer acquisition is the App Store inside each platform, not outbound sales. We watch for repos that name a specific platform in the title plus a specific merchant problem.",
    thresholds: {
      stars: 200,
      commits90d: 50,
      maxContributors: 2,
      topContributorShare: 0.88,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "TypeScript/Remix/Next.js, `@shopify/shopify-api` or `@stripe/stripe-node`, a `/install` route with platform-OAuth boilerplate, App-Store-listing screenshots in the README, no enterprise pricing tier.",
    patternToWatch:
      "Commits cluster around platform-API releases (Shopify edition launches, Stripe billing-API updates). The founder is shipping into platform-event windows, not market events.",
    pitfall:
      "Agency-developed Shopify apps look identical to solo-founder apps but resolve to client-services revenue. Check the founder's recent commits across other repos — agency developers leave a trail of one-shot client projects; solo founders have a small set of focused repos.",
    archetype:
      "Backend engineer ships a Shopify subscription-management app that does one thing better than the incumbent, hits €25k MRR via App Store rankings alone, never builds a marketing site.",
    relatedSectors: ["enterprise-saas", "fintech", "developer-tools"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "supply-chain",
    name: "Supply Chain",
    tagline:
      "Solo-founder supply-chain repos are rare — but when they ship, the contract velocity is brutal.",
    whyOneFounder:
      "Supply chain has a low solo-founder density because the buyers are conservative and the integrations are legacy-heavy. But the few solo founders that emerge are usually ex-operators (logistics ops manager, procurement lead, warehouse operator) shipping the workflow they used to live inside. The audience is small but the contract sizes are large, so a single engineer can hit €1M ARR before the first hire is necessary.",
    thresholds: {
      stars: 100,
      commits90d: 40,
      maxContributors: 2,
      topContributorShare: 0.88,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Python with pandas + SQLAlchemy, EDI-format parsers (EDIFACT, ANSI X12), `customs/` or `freight/` directory, a docs site heavier than the marketing site, no `/about` page with photos.",
    patternToWatch:
      "Commit velocity is moderate but issue-close cadence is very fast — the founder is iterating with 2-3 design-partner customers, not a public community. Watch for a `case-studies/` directory appearing in the repo about 6-9 months in.",
    pitfall:
      "Internal logistics tooling open-sourced by carrier engineers looks identical to founder repos for the first year. Check for a registered business entity and a `/pricing` page.",
    archetype:
      "Ex-DSV operations manager ships a customs-clearance tracker, sells it to seven freight forwarders in eleven months, hires their first engineer at Series A.",
    relatedSectors: ["enterprise-saas", "data-infrastructure", "fintech"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "web3",
    name: "Web3",
    tagline:
      "The single-engineer protocol — sparse repos, dense token economics, one-author whitepaper.",
    whyOneFounder:
      "Web3 protocol-level projects often start with a single technical author because the token-design surface and the contract code cluster in the same brain. We see two solo-founder patterns: (1) a protocol founder shipping the canonical client and reference contracts, and (2) a builder shipping a developer tool for an existing chain (an indexer, a wallet, a multisig helper). The first is rare; the second is common.",
    thresholds: {
      stars: 250,
      commits90d: 55,
      maxContributors: 2,
      topContributorShare: 0.86,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Solidity/Vyper/Move/Rust, Foundry or Hardhat with a full fuzz-test suite, an `audits/` directory linking to public audit firms, no marketing site — only a docs subdomain.",
    patternToWatch:
      "Star count is largely irrelevant in web3 — watch contributor counts and audit timing instead. A solo founder typically ships a Code4rena/Sherlock contest right before mainnet; the days surrounding the contest are the densest commit window.",
    pitfall:
      "Many 'solo-founder' web3 repos are actually parent-foundation-funded projects with a single visible maintainer. Check the deployer wallet history and the funding wallets — VC-backed protocols leak through the on-chain trail even when the GitHub looks solo.",
    archetype:
      "Senior protocol engineer ships a reference client for a new appchain, ships canonical contracts to mainnet in month seven, raises a strategic round, and is still the only GitHub committer at the point of public mainnet launch.",
    relatedSectors: ["developer-tools", "data-infrastructure", "ai-ml"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "robotics",
    name: "Robotics",
    tagline:
      "Software-side robotics solo founders are rare. The ones that exist are simulation, perception, or fleet management.",
    whyOneFounder:
      "Robotics is hardware-dominated, so the solo-founder shape only emerges in the software layer: simulation environments, perception-model wrappers, fleet-orchestration dashboards. We watch for repos that pair ROS or Isaac with a Next.js front-end — that combination usually resolves to a single engineer building a thin SaaS over an existing robotics stack.",
    thresholds: {
      stars: 150,
      commits90d: 40,
      maxContributors: 2,
      topContributorShare: 0.88,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Python + ROS2 or Isaac, Gazebo/Webots config files, a `sim/` directory next to `src/`, gRPC streaming, no consumer-friendly demo video — usually just simulator GIFs.",
    patternToWatch:
      "Commit clusters tied to ROS release cycles (Iron, Jazzy, Kilted) — founder is shipping into the upstream cadence. Watch for the moment a `cloud/` directory appears alongside the simulator code — that's the SaaS turn.",
    pitfall:
      "Many robotics-adjacent repos are academic lab projects with one dominant grad-student committer. Check for non-`.edu` email addresses on the commits before treating the signal as commercial.",
    archetype:
      "Robotics engineer ships a fleet-monitoring dashboard for warehouse AMRs, sells it to two 3PL operators in eight months, is still alone at the point of a strategic-investor LOI.",
    relatedSectors: ["ai-ml", "data-infrastructure", "supply-chain"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "legal-tech",
    name: "Legal Tech",
    tagline:
      "The one-lawyer engineer — a tiny solo-founder cluster with disproportionate contract revenue per repo.",
    whyOneFounder:
      "Legal tech solo founders are almost always practising lawyers who learned to ship code. They build the workflow they were doing manually — contract redlining, due diligence summarisation, clause libraries — and sell back into their own network. The hiring lag is intentional: the founder's name on the bar register IS the trust signal.",
    thresholds: {
      stars: 100,
      commits90d: 35,
      maxContributors: 2,
      topContributorShare: 0.90,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "TypeScript + LangChain or a thin LLM wrapper, a `prompts/` directory with notarised clause templates, a `legal-disclaimers.md` heavier than the README, no `/team` page.",
    patternToWatch:
      "Commit pattern is bursty — the founder ships during weeks when they're not in a major closing. Star count stays low because lawyers don't browse GitHub. Watch the founder's LinkedIn for 'Now also building X' updates — those usually precede a commit-velocity ramp.",
    pitfall:
      "Many legal-tech repos are BigLaw innovation-lab projects with a single visible maintainer. Check for an `INTERNAL.md` or a stamp from an innovation lab in the README before treating the signal as founder-owned.",
    archetype:
      "Mid-career corporate lawyer ships a contract-redline tool for a single law-firm partner, sells the same tool to twelve other partners across three firms, and is still the only engineer at €600k ARR.",
    relatedSectors: ["enterprise-saas", "ai-ml", "fintech"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "hr-tech",
    name: "HR Tech",
    tagline:
      "Solo-founder HR-tech is recruiting-tools-on-top — single engineer, narrow ICP, high ACV per logo.",
    whyOneFounder:
      "HR-tech solo founders cluster on the recruiting side: ATS extensions, sourcing tools, scheduling layers, interview-feedback aggregators. These are workflow companies — the founder usually comes out of in-house recruiting or talent ops. Payroll, benefits, and HRIS are all too compliance-heavy for solo founders to break through.",
    thresholds: {
      stars: 120,
      commits90d: 40,
      maxContributors: 2,
      topContributorShare: 0.88,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Next.js + Stripe + Resend, a `/integrations/` directory mentioning Greenhouse/Ashby/Lever, Calendly-style booking UX, a `/customers` page listing 5-10 logos, no enterprise tier on `/pricing`.",
    patternToWatch:
      "Commit velocity tracks the recruiting calendar — Q1 and Q3 ramps, summer slumps. Watch for sudden `compliance/` or `gdpr/` commits around month nine, which usually coincides with the first 200-seat customer signing.",
    pitfall:
      "Many HR-tech repos are talent-ops-team side projects that never incorporate. Check for a registered business entity and a public pricing page.",
    archetype:
      "Ex-recruiting-ops lead ships a Greenhouse Chrome extension for interview scheduling, sells it to eleven Series B startups in six months, never builds a marketing site.",
    relatedSectors: ["enterprise-saas", "developer-tools", "social-community"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "proptech",
    name: "PropTech",
    tagline:
      "Solo-founder proptech is small-landlord tooling — niche TAM, fast payback, founder-as-landlord.",
    whyOneFounder:
      "PropTech solo founders cluster on the small-landlord and short-term-rental side. The founder usually owns or manages a small portfolio and ships software for their own operation, then sells it to other small landlords. Real-estate brokerage and large-property tech are too operationally heavy for solo founders.",
    thresholds: {
      stars: 80,
      commits90d: 35,
      maxContributors: 2,
      topContributorShare: 0.90,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Next.js + Stripe, an Airbnb/VRBO/Hostaway API integration, a `/calendar` route, photo-management with Cloudinary or Mux, no team page.",
    patternToWatch:
      "Commits cluster on weekends and evenings — the founder has either a day job or a property to manage. Star count stays under 100 because landlords don't browse GitHub. Watch Twitter/X 'building in public' threads for the public surface.",
    pitfall:
      "Many proptech repos are real-estate-agent side projects that never incorporate. Check for a registered business entity.",
    archetype:
      "Software engineer who owns 4-6 short-term rentals ships a unified calendar + pricing tool, sells it to thirty other small operators in nine months, never quits the day job.",
    relatedSectors: ["enterprise-saas", "fintech", "ecommerce-infrastructure"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "agtech",
    name: "AgTech",
    tagline:
      "The single-grower engineer — rare, geographically specific, surprisingly profitable.",
    whyOneFounder:
      "AgTech solo founders are usually domain operators — a vineyard manager, an orchard owner, a precision-row-crop farmer — who learned to ship code. They build the data tool they wished existed for their own operation and sell to other operators in the same geography. The TAM is tiny but the revenue per logo is high.",
    thresholds: {
      stars: 60,
      commits90d: 30,
      maxContributors: 2,
      topContributorShare: 0.90,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Python + PostGIS + Mapbox, drone/sensor data parsers (DJI, John Deere, Climate FieldView), a `field-data/` directory next to `src/`, no `/team` page.",
    patternToWatch:
      "Commits cluster around the growing season (March-October in the northern hemisphere). Star count is irrelevant — watch the LinkedIn posts inside vertical communities (Western Growers, Bayer Climate FieldView).",
    pitfall:
      "Many agtech repos are university-extension-program projects that look like founder repos. Check for `.edu` commit-email domains.",
    archetype:
      "Vineyard manager ships a leaf-disease-spotting computer-vision app for their own twelve vineyards, sells it to forty other Sonoma operators in eighteen months, never raises venture.",
    relatedSectors: ["climate-tech", "ai-ml", "supply-chain"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "gaming",
    name: "Gaming",
    tagline:
      "Solo-founder game studios are common — solo-founder gaming infrastructure is rare and undervalued.",
    whyOneFounder:
      "Gaming has two solo-founder shapes: (1) the single-developer studio shipping a game, and (2) the single-developer infrastructure builder (matchmaking, anti-cheat, multiplayer netcode, asset pipelines). Type 1 is over-saturated and hard to source venture-wise. Type 2 is rare, undervalued, and the focus of this tracker.",
    thresholds: {
      stars: 400,
      commits90d: 55,
      maxContributors: 2,
      topContributorShare: 0.87,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Rust/C++/Go for the server-side, Unity/Unreal/Godot plugin packaging, a `benchmarks/` directory comparing against PlayFab/Photon/Nakama, a `licensing.md` heavier than the README, no consumer marketing site.",
    patternToWatch:
      "Commit clusters tied to GDC and Develop:Brighton — founder is shipping into the conference attention cycle. Watch for a docs site appearing in month four — that's the developer-onboarding turn.",
    pitfall:
      "Game-studio internal tools open-sourced as side projects look like founder repos. Check the contributor email domains against known studio domains (Epic, Ubisoft, Riot).",
    archetype:
      "Senior backend engineer ships a Rust netcode library for indie multiplayer studios, sells the managed-service tier to seventeen studios in twelve months, hires their first engineer at €1.2M ARR.",
    relatedSectors: ["developer-tools", "data-infrastructure", "social-community"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "space-tech",
    name: "Space Tech",
    tagline:
      "Software-only space-tech solo founders — earth-observation pipelines, mission planners, ground-segment software.",
    whyOneFounder:
      "Space-tech is hardware-dominated, but the software layer (earth-observation pipelines, mission planners, ground-segment automation, satellite-data resellers) hosts a small but high-quality cluster of solo founders. The founder is usually ex-NASA/ESA/SpaceX or a remote-sensing PhD.",
    thresholds: {
      stars: 120,
      commits90d: 35,
      maxContributors: 2,
      topContributorShare: 0.90,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Python (sgp4, skyfield, rasterio, xarray), a `tle/` directory for orbital data, Sentinel/Landsat/MODIS pulls in workflows, a `methodology.md` with peer-reviewed citations.",
    patternToWatch:
      "Commit cadence is steady but moderate — founder is shipping into long-cycle buyer conversations (insurance, defence, agri-finance). Watch for a `customers/` directory appearing in month nine.",
    pitfall:
      "Many space-tech repos are agency-contracted projects (ESA, NOAA) with a single visible maintainer. Check the funding-acknowledgement section of the README.",
    archetype:
      "Ex-ESA remote-sensing engineer ships a wildfire-spread predictor using Sentinel-3 thermal data, sells it to two reinsurers and one provincial agency, hires their first engineer at Series A.",
    relatedSectors: ["climate-tech", "data-infrastructure", "ai-ml"],
    updatedAt: "2026-05-22",
  },
  {
    slug: "social-community",
    name: "Social & Community",
    tagline:
      "The one-engineer community platform — niche audience, indie-builder economics, founder-as-mod.",
    whyOneFounder:
      "Social & community is a high-solo-founder-density sector because the audience is the moat. Single-engineer community platforms succeed when the founder is also the community leader — a Substack writer, a YouTube creator, a podcast host. The software is the second product; the audience is the first.",
    thresholds: {
      stars: 200,
      commits90d: 45,
      maxContributors: 2,
      topContributorShare: 0.87,
      concentrationWindow: "rolling 90 days",
    },
    toolingFootprint:
      "Next.js + Stripe Subscriptions + Resend + Mux/Bunny.net, a `/forum` or `/feed` route, Discord/Slack-bot integrations, no enterprise tier on `/pricing`.",
    patternToWatch:
      "Commit cadence tracks the founder's content cadence — when they ship a viral post, they also ship a feature. Watch for the founder's audience metric (Substack subs, YouTube subs) crossing 10k, which usually triggers a SaaS turn within 60 days.",
    pitfall:
      "Many community-platform repos are creator-tool side projects that never incorporate. Check for a registered business entity and a `/pricing` page with recurring tiers.",
    archetype:
      "Substack writer with 14k paid subscribers ships a private community platform for their audience, sells the same platform to six other creators in eight months, is still the only engineer at €40k MRR.",
    relatedSectors: ["edtech", "developer-tools", "enterprise-saas"],
    updatedAt: "2026-05-22",
  },
];

export function getSoloFounderSectorBySlug(
  slug: string,
): SoloFounderSectorEntry | undefined {
  return SOLO_FOUNDER_SECTORS.find((s) => s.slug === slug);
}

export function getAllSoloFounderSectorSlugs(): string[] {
  return SOLO_FOUNDER_SECTORS.map((s) => s.slug);
}

export function getDefaultSoloFounderThresholds(): SoloFounderThresholds {
  return { ...DEFAULT_THRESHOLDS };
}
