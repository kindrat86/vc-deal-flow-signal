import "server-only";

/**
 * Central human-facing site directory — the single source of truth for the
 * HTML sitemap hub rendered at /sitemap (app/sitemap/page.tsx).
 *
 * This is the human sibling of the machine-readable XML shards generated in
 * app/sitemap/[id]/route.ts. It imports the SAME data helpers so the two stay
 * conceptually aligned, and organizes every navigable page into labelled
 * sections a person (or an AI answer engine following internal links) can scan.
 *
 * Enumeration policy:
 *   - Every static / hub / evergreen page and every human-meaningful content
 *     family is listed in full.
 *   - Large programmatic leaf-families (per-startup profiles, stage/signal
 *     crossings, sector×city cells, dated archives) collapse to their browse
 *     hub + a page count via `familyGroup()` once they exceed COLLAPSE_ABOVE.
 *     Their leaves remain reachable through the hub they point to.
 *
 * When a new marketing surface ships, add it here so the human hub surfaces it
 * alongside the CANONICAL_PROD_ROUTES canary (lib/canonical-routes.ts).
 */

import {
  getAllPageSlugs,
  getAllGeoPageSlugs,
  getAllRegionPageSlugs,
  getAllStartupSlugs,
  getAllStartupPeriodPairs,
  getAllBestSectorSlugs,
  getAllTrendSlugs,
  getAllStageSlugs,
  getAllStageSectorPairs,
  getAllSignalSectorPairs,
  getAllStageSignalPairs,
  SIGNAL_TYPES,
} from "@/lib/data";
import { getAllPostSlugs } from "@/content/posts";
import { getAllComparisonSlugs } from "@/content/comparisons";
import { getAllAlternativeSlugs } from "@/content/alternatives";
import { getAllUseCaseSlugs } from "@/content/use-cases";
import { getAllCompetitorVsSlugs } from "@/content/competitor-vs";
import { getAllBuildVsInvestSlugs } from "@/content/build-vs-invest";
import { getAllCompanySlugs } from "@/content/companies";
import { getAllFundSlugs } from "@/content/funds";
import { getAllFounderHandles } from "@/content/founders";
import { getAllSectorSlugs } from "@/content/sectors";
import { ALL_CITY_SLUGS } from "@/content/cities";
import { getAllAcquirerSlugs } from "@/content/acquirers";
import { getIndexableSectorCityPairs } from "@/content/sector-city";
import { getAllFundsWithPortfolio } from "@/content/fund-portfolio";
import { getAllTrendLeaderboardSlugs } from "@/content/trend-leaderboards";
import { getAllWorksWithSlugs } from "@/content/works-with";
import { getAllYearInReviewSlugs } from "@/content/year-in-review";
import { getAllPersonaSlugs } from "@/content/personas";
import { getAllCaseStudySlugs } from "@/content/case-studies";
import { getAllResearchPaperSlugs } from "@/content/research-papers";
import { pillars } from "@/content/pillars";
import { agentQueries } from "@/content/agent-queries";
import { glossaryTerms } from "@/content/glossary";
import { nicheSectors, getAllNichePairs } from "@/content/niches";
import { startupIdeas } from "@/content/startup-ideas";
import { playbooks } from "@/content/playbooks";
import { getAllIdeaSlugs } from "@/lib/ideas-of-the-day";
import { starsCases } from "@/content/from-stars-to-seed";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";
import { PRIMITIVES } from "@/content/signal-primitives";
import { SOLO_FOUNDER_SECTORS } from "@/content/solo-founder-tracker";
import { LOCALES } from "@/content/locales";
import { COMMUNITY_GROUPS } from "@/content/community-signal";
import { getMarketSlugs } from "@/lib/markets";
import { getAllTop100Slugs } from "@/lib/top-100";
import { getAllPredictionWeekSlugs } from "@/lib/predictions";
import { DATA_NERD_PARABLES } from "@/lib/data-nerd";

export interface DirLink {
  href: string;
  label: string;
}

export interface DirGroup {
  heading: string;
  /** Optional one-line note shown under the heading (e.g. collapse count). */
  note?: string;
  links: DirLink[];
}

export interface DirSection {
  id: string;
  title: string;
  blurb: string;
  groups: DirGroup[];
}

// Families larger than this collapse to a single hub link + count instead of
// dumping hundreds/thousands of near-programmatic leaves onto one page.
const COLLAPSE_ABOVE = 250;

const ACRONYMS = new Set([
  "vc", "mcp", "ai", "api", "sdk", "cac", "ltv", "safe", "icp", "eu", "us",
  "uk", "b2b", "saas", "crm", "pe", "a2a", "faq", "seo", "aeo", "og", "id",
  "hq", "yc", "gdp", "ml", "llm", "kpi",
]);

/** Turn a kebab / snake slug into a readable Title Case label. */
export function humanize(slug: string): string {
  return slug
    .replace(/[-_/]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) =>
      ACRONYMS.has(w.toLowerCase())
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}

const fmt = (n: number) => n.toLocaleString("en-US");

/**
 * Build a group from a slug family. Enumerates in full below COLLAPSE_ABOVE,
 * otherwise renders just the browse hub with a count note.
 */
function familyGroup(
  heading: string,
  hub: { href: string; label: string },
  items: DirLink[],
  opts: { includeHub?: boolean } = {},
): DirGroup {
  const includeHub = opts.includeHub ?? true;
  if (items.length > COLLAPSE_ABOVE) {
    return {
      heading,
      note: `${fmt(items.length)} pages — browse them all from the hub.`,
      links: [hub],
    };
  }
  return {
    heading: `${heading} (${fmt(items.length + (includeHub ? 1 : 0))})`,
    links: includeHub ? [hub, ...items] : items,
  };
}

let cache: DirSection[] | null = null;

export function getSiteDirectory(): DirSection[] {
  if (cache) return cache;

  const link = (href: string, label: string): DirLink => ({ href, label });
  const slugLinks = (base: string, slugs: string[]): DirLink[] =>
    slugs.map((s) => link(`${base}/${s}`, humanize(s)));

  const sections: DirSection[] = [];

  // ── 1. Start here — product, funnels, pricing ──────────────────────────
  sections.push({
    id: "start-here",
    title: "Start here",
    blurb: "The core product, how it works, and the fastest way in.",
    groups: [
      {
        heading: "Product & overview",
        links: [
          link("/", "Home"),
          link("/start-here", "Start here"),
          link("/how-to-spot-startup-momentum-before-the-round-gets-crowded", "How to spot startup momentum"),
          link("/methodology", "Methodology"),
          link("/scout-score", "Scout Score"),
          link("/code-side-sourcing", "Code-Side Sourcing"),
          link("/trending", "Trending now"),
          link("/leaderboard", "Live leaderboard"),
          link("/dataset", "Open dataset"),
          link("/faq", "FAQ"),
          link("/about", "About"),
          link("/about/founder", "About the founder"),
        ],
      },
      {
        heading: "Pricing & offers",
        links: [
          link("/pricing", "Pricing"),
          link("/firstlook", "First Look"),
          link("/squeeze", "Free weekly signal"),
          link("/teardown", "Tweet Teardown (€1)"),
          link("/insider", "Insider"),
          link("/enterprise", "Enterprise"),
          link("/buyers-guide", "Buyer's guide"),
          link("/agents/credits", "Agent credits"),
        ],
      },
      {
        heading: "Funnels & conversion",
        links: [
          link("/funnels", "Funnels index"),
          link("/walkthrough", "Walkthrough"),
          link("/walkthrough/5min", "Walkthrough — 5 min"),
          link("/walkthrough/90s", "Walkthrough — 90 sec"),
          link("/quiz", "Quiz"),
          link("/apply", "Apply"),
          link("/challenge", "Challenge"),
          link("/launch", "Launch"),
          link("/launch/agent-credits", "Launch — Agent credits"),
          link("/watch", "Watch"),
          link("/summit", "Summit"),
          link("/summit/all-access", "Summit — All-Access"),
        ],
      },
    ],
  });

  // ── 2. The book ────────────────────────────────────────────────────────
  sections.push({
    id: "book",
    title: "The book",
    blurb: "The seven-signal field guide — free to read online.",
    groups: [
      {
        heading: "Read online",
        links: [
          link("/book", "Book — landing"),
          link("/book/read", "Read online"),
          link("/book/read/introduction", "Introduction"),
          link("/book/read/signal-1-commit-velocity", "Signal 1 — Commit Velocity"),
          link("/book/read/signal-2-contributor-influx", "Signal 2 — Contributor Influx"),
          link("/book/read/signal-3-infra-buildout", "Signal 3 — Infra Buildout"),
          link("/book/read/signal-4-star-detachment", "Signal 4 — Star Detachment"),
          link("/book/read/signal-5-issue-cadence", "Signal 5 — Issue Cadence"),
          link("/book/read/signal-6-dependency-adoption", "Signal 6 — Dependency Adoption"),
          link("/book/read/signal-7-founding-team-visibility", "Signal 7 — Founding-Team Visibility"),
          link("/book/read/methodology", "Book — Methodology"),
          link("/book/read/replication-appendix", "Replication Appendix"),
          link("/book/read/conclusion", "Conclusion"),
        ],
      },
    ],
  });

  // ── 3. Answers & comparisons (high-intent) ─────────────────────────────
  sections.push({
    id: "answers",
    title: "Answers & comparisons",
    blurb: "Direct answers to buyer questions, tool comparisons, and alternatives.",
    groups: [
      familyGroup("Answers", link("/answers", "Answers hub"),
        agentQueries.map((q) => link(`/answers/${q.slug}`, humanize(q.slug)))),
      familyGroup("Compare", link("/compare", "Compare hub"),
        slugLinks("/compare", getAllComparisonSlugs())),
      familyGroup("Alternatives", link("/alternatives", "Alternatives hub"),
        slugLinks("/alternatives", getAllAlternativeSlugs())),
      familyGroup("Head-to-head (vs)", link("/vs", "Versus hub"),
        slugLinks("/vs", getAllCompetitorVsSlugs())),
      familyGroup("Use cases", link("/use-cases", "Use cases hub"),
        slugLinks("/use-cases", getAllUseCaseSlugs())),
      familyGroup("Build vs invest", link("/build-vs-invest", "Build vs invest hub"),
        slugLinks("/build-vs-invest", getAllBuildVsInvestSlugs())),
      {
        heading: "Diligence & guides",
        links: [
          link("/diligence", "Diligence"),
          link("/buyers-guide", "Buyer's guide"),
          link("/learn/scout-score-guide", "Guide — Scout Score"),
          link("/learn/tracking-github-trends", "Guide — Tracking GitHub trends"),
          link("/learn/startup-momentum-scoring", "Guide — Momentum scoring"),
          link("/learn/how-to-find-acquisition-targets-on-github", "Guide — Acquisition targets"),
          link("/learn/how-to-evaluate-engineering-velocity", "Guide — Engineering velocity"),
          link("/learn/how-to-build-a-startup-watchlist", "Guide — Build a watchlist"),
          link("/learn/how-to-use-startup-signals-api", "Guide — Signals API"),
          link("/vs/crunchbase", "vs Crunchbase"),
          link("/vs/tracxn", "vs Tracxn"),
        ],
      },
    ],
  });

  // ── 4. Sectors, geographies & markets ──────────────────────────────────
  sections.push({
    id: "sectors-geo",
    title: "Sectors, cities & markets",
    blurb: "Browse the signal panel by industry, geography, acquirer, and market.",
    groups: [
      familyGroup("Sectors", link("/sector", "Sectors hub"),
        slugLinks("/sector", getAllSectorSlugs())),
      familyGroup("Best-of by sector", link("/best", "Best-of hub"),
        slugLinks("/best", getAllBestSectorSlugs()), { includeHub: false }),
      familyGroup("Cities", link("/city", "Cities hub"),
        slugLinks("/city", ALL_CITY_SLUGS)),
      familyGroup("Sector × city", link("/sector", "Sectors hub"),
        getIndexableSectorCityPairs().map(({ sector, city }) =>
          link(`/sector/${sector}/in/${city}`, `${humanize(sector)} in ${humanize(city)}`))),
      familyGroup("Acquirers", link("/acquirer", "Acquirers hub"),
        slugLinks("/acquirer", getAllAcquirerSlugs())),
      familyGroup("Startups to watch — sectors", link("/startups-to-watch", "Startups to watch"),
        slugLinks("/startups-to-watch", getAllPageSlugs()), { includeHub: false }),
      familyGroup("Startups to watch — by region", link("/startups-to-watch", "Startups to watch"),
        [...getAllRegionPageSlugs().map((s) => link(`/startups-to-watch/region/${s}`, humanize(s))),
         ...getAllGeoPageSlugs().map((s) => link(`/startups-to-watch/geo/${s}`, humanize(s)))],
        { includeHub: false }),
      familyGroup("Markets", link("/markets", "Markets hub"),
        [link("/markets/methodology", "Markets — methodology"),
         ...slugLinks("/markets", getMarketSlugs())]),
      familyGroup("Trends", link("/trend", "Trends hub"),
        [...slugLinks("/trend", getAllTrendLeaderboardSlugs()),
         ...slugLinks("/trends", getAllTrendSlugs())]),
    ],
  });

  // ── 5. Signals & stages (the crossings) ────────────────────────────────
  sections.push({
    id: "signals-stages",
    title: "Signals & stages",
    blurb: "The six atomic signals, funding stages, and their sector crossings.",
    groups: [
      {
        heading: "Signal types",
        links: [
          link("/signals", "Signals hub"),
          ...SIGNAL_TYPES.map((s) => link(`/signals/${s.slug}`, s.name)),
        ],
      },
      {
        heading: "Signal primitives (defined)",
        links: [
          link("/signals", "Signals hub"),
          ...PRIMITIVES.map((p) => link(`/signals/define/${p.slug}`, humanize(p.slug))),
        ],
      },
      familyGroup("Funding stages", link("/stage/seed", "Stages"),
        slugLinks("/stage", getAllStageSlugs())),
      familyGroup("Stage × sector", link("/stage/seed", "Stages"),
        getAllStageSectorPairs().map(({ stage, sector }) =>
          link(`/stage/${stage}/${sector}`, `${humanize(stage)} · ${humanize(sector)}`))),
      familyGroup("Signal × sector", link("/signals", "Signals hub"),
        getAllSignalSectorPairs().map(({ signal, sector }) =>
          link(`/signals/${signal}/${sector}`, `${humanize(signal)} · ${humanize(sector)}`))),
      familyGroup("Stage × signal", link("/stage/seed", "Stages"),
        getAllStageSignalPairs().map(({ stage, signal }) =>
          link(`/stage/${stage}/signal/${signal}`, `${humanize(stage)} · ${humanize(signal)}`))),
    ],
  });

  // ── 6. Entities — companies, funds, founders ───────────────────────────
  sections.push({
    id: "entities",
    title: "Companies, funds & founders",
    blurb: "Per-entity GitHub-signal reports, fund deal-flow context, and founder profiles.",
    groups: [
      familyGroup("Company signal reports", link("/signal", "Companies hub"),
        slugLinks("/signal", getAllCompanySlugs())),
      familyGroup("Funds", link("/fund", "Funds hub"),
        slugLinks("/fund", getAllFundSlugs())),
      familyGroup("Fund portfolios", link("/fund", "Funds hub"),
        getAllFundsWithPortfolio().map((s) => link(`/fund/${s}/portfolio`, `${humanize(s)} — portfolio`)),
        { includeHub: false }),
      familyGroup("Founders", link("/founder", "Founders hub"),
        getAllFounderHandles().map((h) => link(`/founder/${h}`, `@${h}`))),
      familyGroup("Startup profiles", link("/startups-to-watch", "Startups to watch"),
        getAllStartupSlugs().map((s) => link(`/startup/${s}`, humanize(s)))),
      familyGroup("Startup profiles — by period", link("/startups-to-watch", "Startups to watch"),
        getAllStartupPeriodPairs().map(({ slug, period }) =>
          link(`/startup/${slug}/${period}`, `${humanize(slug)} — ${period}`))),
    ],
  });

  // ── 7. Programmatic clusters (Greg-Isenberg-shaped) ────────────────────
  sections.push({
    id: "clusters",
    title: "Opportunity clusters",
    blurb: "Niche-down maps, startup ideas, playbooks, and case studies.",
    groups: [
      familyGroup("Niche-down — sectors", link("/niche-down", "Niche-down hub"),
        slugLinks("/niche-down", nicheSectors.map((s) => s.slug))),
      familyGroup("Niche-down — sub-niches", link("/niche-down", "Niche-down hub"),
        getAllNichePairs().map(({ sector, subniche }) =>
          link(`/niche-down/${sector}/${subniche}`, `${humanize(sector)} · ${humanize(subniche)}`)),
        { includeHub: false }),
      familyGroup("Startup ideas", link("/startup-ideas", "Startup ideas hub"),
        startupIdeas.map((i) => link(`/startup-ideas/${i.slug}`, humanize(i.slug)))),
      familyGroup("Playbooks", link("/playbooks", "Playbooks hub"),
        playbooks.map((p) => link(`/playbooks/${p.slug}`, humanize(p.slug)))),
      familyGroup("From stars to seed", link("/from-stars-to-seed", "From stars to seed"),
        starsCases.map((c) => link(`/from-stars-to-seed/${c.slug}`, humanize(c.slug))), { includeHub: false }),
      familyGroup("Solo-founder tracker", link("/solo-founder-tracker", "Solo-founder tracker"),
        SOLO_FOUNDER_SECTORS.map((s) => link(`/solo-founder-tracker/${s.slug}`, humanize(s.slug)))),
      familyGroup("Community signal", link("/community-signal", "Community signal"),
        COMMUNITY_GROUPS.map((g) => link(`/community-signal/${g.slug}`, humanize(g.slug)))),
      familyGroup("Case studies", link("/case-study", "Case studies hub"),
        slugLinks("/case-study", getAllCaseStudySlugs())),
      familyGroup("Works with", link("/works-with", "Works-with hub"),
        slugLinks("/works-with", getAllWorksWithSlugs())),
      familyGroup("Personas (for…)", link("/for", "Personas hub"),
        slugLinks("/for", getAllPersonaSlugs())),
    ],
  });

  // ── 8. Knowledge — glossary, research, blog ────────────────────────────
  sections.push({
    id: "knowledge",
    title: "Knowledge & research",
    blurb: "Definitions, research findings, papers, and the blog.",
    groups: [
      {
        heading: "Hubs",
        links: [
          link("/knowledge", "Knowledge hub"),
          link("/glossary", "Glossary (A–Z)"),
          link("/define", "Define (by category)"),
          link("/research", "Research hub"),
          link("/blog", "Blog"),
          link("/topics", "Topics"),
          link("/data-sources", "Data sources"),
          link("/citations", "Citations"),
          link("/citation-guide", "Citation guide"),
        ],
      },
      familyGroup("Glossary terms", link("/define", "Define hub"),
        glossaryTerms.map((t) => link(`/define/${t.id}`, humanize(t.id)))),
      familyGroup("Blog posts", link("/blog", "Blog"),
        slugLinks("/blog", getAllPostSlugs())),
      familyGroup("Topic pillars", link("/topics", "Topics"),
        slugLinks("/topics", Object.keys(pillars)), { includeHub: false }),
      familyGroup("Research findings", link("/research", "Research hub"),
        RESEARCH_FINDINGS.map((f) => link(`/research/${f.slug}`, humanize(f.slug))), { includeHub: false }),
      familyGroup("Research papers", link("/research-paper", "Research papers hub"),
        slugLinks("/research-paper", getAllResearchPaperSlugs())),
    ],
  });

  // ── 9. Free tools ──────────────────────────────────────────────────────
  sections.push({
    id: "tools",
    title: "Free tools",
    blurb: "Founder & investor calculators — no login required.",
    groups: [
      {
        heading: "Calculators",
        links: [
          link("/tools", "Tools hub"),
          link("/tools/safe-calculator", "SAFE calculator"),
          link("/tools/runway-calculator", "Runway calculator"),
          link("/tools/burn-multiple-calculator", "Burn multiple calculator"),
          link("/tools/magic-number-calculator", "Magic number calculator"),
          link("/tools/cac-payback-calculator", "CAC payback calculator"),
          link("/tools/ltv-calculator", "LTV calculator"),
          link("/tools/dilution-stack", "Dilution stack"),
          link("/tools/quick-ratio-calculator", "Quick ratio calculator"),
          link("/badge-builder", "Badge builder"),
        ],
      },
    ],
  });

  // ── 10. Developers, agents & integrations ──────────────────────────────
  sections.push({
    id: "developers",
    title: "Developers, agents & integrations",
    blurb: "The API, MCP server, agent-to-agent surfaces, and framework integrations.",
    groups: [
      {
        heading: "Developers & API",
        links: [
          link("/developers", "Developers"),
          link("/changelog", "Changelog"),
          link("/install", "Install"),
          link("/mcp-demo", "MCP demo"),
          link("/embed", "Embed"),
          link("/built-with", "Built with"),
        ],
      },
      {
        heading: "Agents & A2A",
        links: [
          link("/agents", "Agents"),
          link("/a2a", "Agent-to-agent"),
          link("/a2a-demo", "A2A demo"),
          link("/a2a/claude-code", "A2A — Claude Code"),
          link("/a2a/cursor", "A2A — Cursor"),
          link("/a2a/openai-agents-sdk", "A2A — OpenAI Agents SDK"),
          link("/a2a/langchain", "A2A — LangChain"),
          link("/a2a/vercel-ai-sdk", "A2A — Vercel AI SDK"),
        ],
      },
      {
        heading: "Integrations",
        links: [
          link("/integrations", "Integrations hub"),
          link("/integrations/chatgpt", "ChatGPT"),
          link("/integrations/mistral", "Mistral"),
          link("/integrations/agent-runtimes", "Agent runtimes"),
          link("/for-langchain", "For LangChain"),
          link("/for-crewai", "For CrewAI"),
          link("/for-letta", "For Letta"),
          link("/for-mastra", "For Mastra"),
          link("/for-vercel-ai-sdk", "For Vercel AI SDK"),
        ],
      },
    ],
  });

  // ── 11. Data products & benchmarks ─────────────────────────────────────
  sections.push({
    id: "data",
    title: "Data & benchmarks",
    blurb: "The weekly panel, benchmarks, predictions, and receipts.",
    groups: [
      {
        heading: "Weekly & rankings",
        links: [
          link("/weekly", "Weekly"),
          link("/weekly/top-100", "Weekly Top 100"),
          link("/signal-of-the-week", "Signal of the week"),
          link("/idea-of-the-day", "Idea of the day"),
          link("/state-of-github", "State of GitHub"),
          link("/friday-preview", "Friday preview"),
        ],
      },
      {
        heading: "Benchmarks",
        links: [
          link("/benchmarks/commit-velocity", "Benchmark — Commit velocity"),
          link("/benchmarks/contributor-growth", "Benchmark — Contributor growth"),
          link("/benchmarks/signal-distribution", "Benchmark — Signal distribution"),
        ],
      },
      {
        heading: "Predictions & receipts",
        links: [
          link("/predict", "Predict"),
          link("/predicted", "Predicted"),
          link("/receipts", "Receipts"),
          link("/crystal-ball", "Crystal ball"),
        ],
      },
      familyGroup("Top-100 archive", link("/weekly/top-100", "Weekly Top 100"),
        slugLinks("/weekly/top-100", getAllTop100Slugs()), { includeHub: false }),
      familyGroup("Prediction weeks", link("/predicted", "Predicted"),
        slugLinks("/predicted", getAllPredictionWeekSlugs()), { includeHub: false }),
      familyGroup("Idea-of-the-day archive", link("/idea-of-the-day", "Idea of the day"),
        slugLinks("/idea-of-the-day", getAllIdeaSlugs()), { includeHub: false }),
      familyGroup("Year in review", link("/year-in-review", "Year in review"),
        slugLinks("/year-in-review", getAllYearInReviewSlugs())),
    ],
  });

  // ── 12. Story, brand & movement ────────────────────────────────────────
  sections.push({
    id: "story",
    title: "Story, brand & movement",
    blurb: "The founder character, the manifesto, and the community around the data.",
    groups: [
      {
        heading: "Narrative",
        links: [
          link("/story", "Story"),
          link("/origin", "Origin"),
          link("/origin/your-journey", "Origin — your journey"),
          link("/manifesto", "Manifesto"),
          link("/identity", "Identity"),
          link("/data-nerd", "The Data Nerd"),
          link("/now", "Now"),
          link("/parables", "Parables"),
          link("/decade-in-a-day", "Decade in a day"),
        ],
      },
      familyGroup("Parables", link("/parables", "Parables"),
        DATA_NERD_PARABLES.map((p) => link(`/parables/${p.slug}`, humanize(p.slug))), { includeHub: false }),
      {
        heading: "Members & movement",
        links: [
          link("/members", "Members"),
          link("/members/leaderboard", "Members — leaderboard"),
          link("/members/join", "Members — join"),
          link("/challenge", "Challenge"),
          link("/wins", "Wins"),
          link("/scorecard", "Scorecard"),
          link("/earned-plays", "Earned plays"),
          link("/target-list", "Target list"),
          link("/distribution", "Distribution"),
          link("/experiments", "Experiments"),
        ],
      },
      familyGroup("Authors", link("/authors", "Authors"),
        [link("/authors/the-data-nerd", "The Data Nerd"),
         link("/authors/engineering-research", "Engineering Research"),
         link("/authors/founder-perspective", "Founder Perspective")],
        { includeHub: true }),
    ],
  });

  // ── 13. Trust, standards & press ───────────────────────────────────────
  sections.push({
    id: "trust",
    title: "Trust, standards & press",
    blurb: "E-E-A-T surfaces: standards, corrections, reproducibility, and press.",
    groups: [
      {
        heading: "Trust & standards",
        links: [
          link("/standards", "Standards"),
          link("/corrections", "Corrections"),
          link("/reproducibility", "Reproducibility"),
          link("/attestations", "Attestations"),
          link("/citations", "Citations"),
          link("/citation-guide", "Citation guide"),
          link("/wikipedia", "Wikipedia"),
          link("/wikidata", "Wikidata"),
        ],
      },
      {
        heading: "Press & podcasts",
        links: [
          link("/press", "Press"),
          link("/press/ssrn-panel-q2-2026", "Press — SSRN panel"),
          link("/press/agent-credits-launch-q2-2026", "Press — Agent credits launch"),
          link("/press/annual-state-of-engineering-velocity-q4-2026", "Press — State of Engineering Velocity"),
          link("/podcasts", "Podcasts"),
          link("/mirrors", "Mirrors"),
        ],
      },
      {
        heading: "Company & program",
        links: [
          link("/affiliates", "Affiliates"),
          link("/affiliates/top-partners", "Top partners"),
          link("/roadmap", "Roadmap"),
          link("/continuity", "Continuity"),
          link("/translations", "Translations"),
        ],
      },
    ],
  });

  // ── 14. Localized editions ─────────────────────────────────────────────
  sections.push({
    id: "locales",
    title: "Localized editions",
    blurb: "Translated entry points for each supported language.",
    groups: [
      {
        heading: `Languages (${fmt(LOCALES.length)})`,
        links: LOCALES.map((l) => link(`/${l.code}`, l.code.toUpperCase())),
      },
    ],
  });

  // Dedupe links within each group by href — a family's browse hub can coincide
  // with one of its enumerated leaves (e.g. /stage/seed is both the stages hub
  // and the "seed" stage), which would otherwise collide as a React key.
  for (const section of sections) {
    for (const group of section.groups) {
      const seen = new Set<string>();
      group.links = group.links.filter((l) =>
        seen.has(l.href) ? false : (seen.add(l.href), true),
      );
    }
  }

  cache = sections;
  return sections;
}

/** Total distinct links rendered in the human directory (for headline copy). */
export function getSiteDirectoryLinkCount(): number {
  return getSiteDirectory().reduce(
    (sum, s) => sum + s.groups.reduce((g, grp) => g + grp.links.length, 0),
    0,
  );
}
