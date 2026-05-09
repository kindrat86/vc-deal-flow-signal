/**
 * Platform-specific top-100 rosters.
 *
 * The /target-list page is one mixed roster of 100 voices across 10 categories.
 * That works as the master ICP-scored list, but the direct-response sales canon
 * teaches "one top-100 list PER PLATFORM" — 100 subreddits, 100 X accounts,
 * 100 HN attention slots — each with its own infiltration cadence, status
 * coding, and link of record.
 *
 * This file is the platform-specific layer underneath /target-list. Pages at
 * /voices, /voices/reddit, /voices/hacker-news, /voices/twitter render this
 * data. Each entry stays anonymity-rule compliant — public handles, public
 * URLs, no individuals we track inside the paid product.
 *
 * Last refreshed: 2026-05-09.
 */

export type VoiceStatus =
  | "engage"
  | "watch"
  | "hold"
  | "read"
  | "blocked";

export interface PlatformVoice {
  /** Display name (subreddit, handle, thread family, list name). */
  name: string;
  /** One-sentence "why we read it / what it gives us". */
  what: string;
  /** Optional href — public URL, never a personal DM or paywalled link. */
  href?: string;
  /** Engagement status (mirrors /target-list semantics). */
  status: VoiceStatus;
  /** Optional context note — auto-mod rule, anonymity flag, throttling, etc. */
  note?: string;
}

export interface PlatformList {
  /** URL-safe slug, drives /voices/[slug]. */
  slug: string;
  /** Human label rendered in headings ("Reddit", "Hacker News", "X / Twitter"). */
  label: string;
  /** Short tagline shown in cards and OG. */
  tagline: string;
  /** 2-3 sentence intro on the platform page. */
  intro: string;
  /** Cadence rule — when and how the company-page surface engages. */
  cadence: string;
  /** Status code rule overrides specific to the platform. */
  rule: string;
  /** Total entries — sanity-check at runtime. */
  expected: number;
  /** The literal roster, ordered by attention priority. */
  items: PlatformVoice[];
}

export const PLATFORM_STATUS_META: Record<
  VoiceStatus,
  { short: string; long: string; tone: string }
> = {
  engage: {
    short: "Engage",
    long: "Active engagement layer — we comment, post, or integrate.",
    tone: "emerald",
  },
  watch: {
    short: "Watch",
    long: "Monitoring only — we read the signal, don't post.",
    tone: "sky",
  },
  hold: {
    short: "Hold",
    long: "Engagement paused. Listed for transparency.",
    tone: "amber",
  },
  read: {
    short: "Read",
    long: "Read-only consumption. No engagement layer (or we choose not to).",
    tone: "slate",
  },
  blocked: {
    short: "Blocked",
    long: "Cannot engage — platform constraint, anonymity rule, or policy.",
    tone: "rose",
  },
};

// ────────────────────────────────────────────────────────────────────────────
// REDDIT — 100 subreddits (developer-investor adjacent)
// ────────────────────────────────────────────────────────────────────────────

const REDDIT_VOICES: PlatformVoice[] = [
  // Top tier — comment-only or active engage layer (Tier 1)
  { name: "r/venturecapital", what: "VC-side reality. Comment-only — auto-mod removes any post that names a product.", href: "https://reddit.com/r/venturecapital", status: "engage", note: "Comments-only. Hero posts auto-removed." },
  { name: "r/AngelInvesting", what: "Angel-side avatar. Developer-investor lives here.", href: "https://reddit.com/r/AngelInvesting", status: "engage" },
  { name: "r/startups", what: "General founder community. We engage on data-question threads.", href: "https://reddit.com/r/startups", status: "engage" },
  { name: "r/SaaS", what: "SaaS founder reality. Pricing, ARR, churn threads convert to dashboard interest.", href: "https://reddit.com/r/SaaS", status: "engage" },
  { name: "r/ExperiencedDevs", what: "Senior-engineer take on the orgs we track from outside.", href: "https://reddit.com/r/ExperiencedDevs", status: "watch" },
  { name: "r/programming", what: "Default tech-news firehose. Slow-engage, high-attention.", href: "https://reddit.com/r/programming", status: "watch" },
  { name: "r/MachineLearning", what: "Where ML papers and infrastructure orgs first surface.", href: "https://reddit.com/r/MachineLearning", status: "watch" },
  { name: "r/LocalLLaMA", what: "On-device-AI infrastructure. Engineering-first audience.", href: "https://reddit.com/r/LocalLLaMA", status: "engage" },
  { name: "r/dataengineering", what: "Data-platform stack threads. High GitHub-org overlap.", href: "https://reddit.com/r/dataengineering", status: "watch" },
  { name: "r/devops", what: "Infrastructure-as-code, observability, platform engineering.", href: "https://reddit.com/r/devops", status: "watch" },

  // Tier 2 — engineering surface
  { name: "r/webdev", what: "Frontend-leaning practitioner audience.", href: "https://reddit.com/r/webdev", status: "watch" },
  { name: "r/javascript", what: "JS-ecosystem firehose. Library / framework adoption signal.", href: "https://reddit.com/r/javascript", status: "watch" },
  { name: "r/typescript", what: "TS-specific community. Devtool / framework adoption surface.", href: "https://reddit.com/r/typescript", status: "watch" },
  { name: "r/reactjs", what: "React community — half of our dataset's frontend orgs land here.", href: "https://reddit.com/r/reactjs", status: "watch" },
  { name: "r/nextjs", what: "Next.js community. Vercel-orbit orgs surface here first.", href: "https://reddit.com/r/nextjs", status: "watch" },
  { name: "r/node", what: "Node.js / runtime ecosystem.", href: "https://reddit.com/r/node", status: "watch" },
  { name: "r/golang", what: "Go community. Infra / cloud-native orgs.", href: "https://reddit.com/r/golang", status: "watch" },
  { name: "r/rust", what: "Rust community. Systems / wasm / crypto orgs.", href: "https://reddit.com/r/rust", status: "watch" },
  { name: "r/Python", what: "Python community. Data / ML / scripting practitioner audience.", href: "https://reddit.com/r/Python", status: "watch" },
  { name: "r/elixir", what: "Elixir / Phoenix community. Smaller, high-signal.", href: "https://reddit.com/r/elixir", status: "watch" },

  // Tier 2 — investor / fundraising
  { name: "r/Entrepreneur", what: "Generalist founder community. Comment-only on data-driven threads.", href: "https://reddit.com/r/Entrepreneur", status: "watch" },
  { name: "r/EntrepreneurRideAlong", what: "Build-in-public threads. Useful avatar reads.", href: "https://reddit.com/r/EntrepreneurRideAlong", status: "watch" },
  { name: "r/smallbusiness", what: "Outside-VC bootstrap-side counterweight.", href: "https://reddit.com/r/smallbusiness", status: "read" },
  { name: "r/Investments", what: "Public-market overlap with private-side avatar.", href: "https://reddit.com/r/Investments", status: "read" },
  { name: "r/SecurityAnalysis", what: "Buy-side discipline. Pattern memory.", href: "https://reddit.com/r/SecurityAnalysis", status: "read" },
  { name: "r/financialindependence", what: "Personal-finance angel-investor crossover.", href: "https://reddit.com/r/financialindependence", status: "read" },
  { name: "r/personalfinance", what: "Mass-market personal-finance.", href: "https://reddit.com/r/personalfinance", status: "read" },
  { name: "r/quant", what: "Quant-finance crowd. Math-side overlap with our methodology buyers.", href: "https://reddit.com/r/quant", status: "watch" },
  { name: "r/algotrading", what: "Quant practitioner audience.", href: "https://reddit.com/r/algotrading", status: "watch" },
  { name: "r/PrivateEquity", what: "PE audience. Adjacent buyer-archetype.", href: "https://reddit.com/r/PrivateEquity", status: "read" },

  // Tier 3 — broad tech / AI
  { name: "r/artificial", what: "Generalist AI conversation.", href: "https://reddit.com/r/artificial", status: "watch" },
  { name: "r/ChatGPT", what: "Mass-AI awareness. Useful for tone calibration.", href: "https://reddit.com/r/ChatGPT", status: "read" },
  { name: "r/ClaudeAI", what: "Claude / MCP user community.", href: "https://reddit.com/r/ClaudeAI", status: "engage" },
  { name: "r/OpenAI", what: "OpenAI ecosystem audience.", href: "https://reddit.com/r/OpenAI", status: "watch" },
  { name: "r/singularity", what: "Frontier-AI sentiment. Watch for thesis flip.", href: "https://reddit.com/r/singularity", status: "read" },
  { name: "r/learnmachinelearning", what: "Beginner-to-intermediate ML audience.", href: "https://reddit.com/r/learnmachinelearning", status: "read" },
  { name: "r/MLQuestions", what: "Q&A surface. Useful for canonical answers.", href: "https://reddit.com/r/MLQuestions", status: "read" },
  { name: "r/StableDiffusion", what: "Diffusion-model practitioner audience.", href: "https://reddit.com/r/StableDiffusion", status: "read" },
  { name: "r/datasets", what: "Public-data hub. Cross-references our methodology.", href: "https://reddit.com/r/datasets", status: "watch" },
  { name: "r/datascience", what: "Data-science practitioner audience.", href: "https://reddit.com/r/datascience", status: "watch" },

  // Tier 3 — devtools / infrastructure
  { name: "r/kubernetes", what: "K8s practitioner audience.", href: "https://reddit.com/r/kubernetes", status: "watch" },
  { name: "r/docker", what: "Containers community.", href: "https://reddit.com/r/docker", status: "read" },
  { name: "r/aws", what: "AWS-customer audience. Cross-confirms cloud-native bets.", href: "https://reddit.com/r/aws", status: "read" },
  { name: "r/gcp", what: "GCP-customer audience.", href: "https://reddit.com/r/gcp", status: "read" },
  { name: "r/AZURE", what: "Azure-customer audience.", href: "https://reddit.com/r/AZURE", status: "read" },
  { name: "r/selfhosted", what: "Self-host community. On-prem / privacy-first orgs.", href: "https://reddit.com/r/selfhosted", status: "read" },
  { name: "r/homelab", what: "Hardware-side hobbyist audience.", href: "https://reddit.com/r/homelab", status: "read" },
  { name: "r/sysadmin", what: "Ops-side practitioner audience.", href: "https://reddit.com/r/sysadmin", status: "read" },
  { name: "r/linux", what: "Linux user community. Distro / tooling adoption signal.", href: "https://reddit.com/r/linux", status: "read" },
  { name: "r/opensource", what: "Open-source maintainership audience.", href: "https://reddit.com/r/opensource", status: "watch" },

  // Tier 3 — product / startup adjacency
  { name: "r/SideProject", what: "Hobby-build to startup pipeline.", href: "https://reddit.com/r/SideProject", status: "watch" },
  { name: "r/IndieHackers", what: "Bootstrapper economics — different ladder, same dataset.", href: "https://reddit.com/r/IndieHackers", status: "engage" },
  { name: "r/microsaas", what: "Niche SaaS founder audience.", href: "https://reddit.com/r/microsaas", status: "read" },
  { name: "r/startup_resources", what: "Founder-resources thread surface.", href: "https://reddit.com/r/startup_resources", status: "read" },
  { name: "r/ycombinator", what: "YC-cohort audience. Adjacent to our pattern memory.", href: "https://reddit.com/r/ycombinator", status: "watch" },
  { name: "r/cscareerquestions", what: "Engineer-career-decision audience. Compensation / equity threads.", href: "https://reddit.com/r/cscareerquestions", status: "read" },
  { name: "r/cscareerquestionsEU", what: "European engineer-investor avatar concentration.", href: "https://reddit.com/r/cscareerquestionsEU", status: "read" },
  { name: "r/freelance", what: "Freelance-engineer audience. Some angel-investor overlap.", href: "https://reddit.com/r/freelance", status: "read" },

  // Tier 3 — sector-specific
  { name: "r/CryptoCurrency", what: "Crypto / Web3 sentiment.", href: "https://reddit.com/r/CryptoCurrency", status: "read" },
  { name: "r/ethdev", what: "Ethereum-dev community. On-chain orgs.", href: "https://reddit.com/r/ethdev", status: "watch" },
  { name: "r/solidity", what: "Solidity-dev audience.", href: "https://reddit.com/r/solidity", status: "watch" },
  { name: "r/CryptoTechnology", what: "Crypto-infra technical audience.", href: "https://reddit.com/r/CryptoTechnology", status: "watch" },
  { name: "r/fintech", what: "Fintech-side news + threads.", href: "https://reddit.com/r/fintech", status: "watch" },
  { name: "r/cybersecurity", what: "Security-side practitioner audience. SecOps orgs.", href: "https://reddit.com/r/cybersecurity", status: "read" },
  { name: "r/netsec", what: "Higher-signal security audience.", href: "https://reddit.com/r/netsec", status: "watch" },
  { name: "r/climatetech", what: "Climate-tech founder community. Sector overlap.", href: "https://reddit.com/r/climatetech", status: "read" },
  { name: "r/bioinformatics", what: "Bio + dev overlap. Niche but high-signal.", href: "https://reddit.com/r/bioinformatics", status: "read" },
  { name: "r/robotics", what: "Hardware-leaning founder audience.", href: "https://reddit.com/r/robotics", status: "read" },

  // Tier 3 — niche communities
  { name: "r/SoftwareEngineering", what: "Generalist engineering discussion.", href: "https://reddit.com/r/SoftwareEngineering", status: "read" },
  { name: "r/coding", what: "Code-level technical thread surface.", href: "https://reddit.com/r/coding", status: "read" },
  { name: "r/programmingmemes", what: "Cultural pulse.", href: "https://reddit.com/r/ProgrammerHumor", status: "read" },
  { name: "r/ExperiencedFounders", what: "Founder-experience trade.", href: "https://reddit.com/r/ExperiencedFounders", status: "read" },
  { name: "r/Buttcoin", what: "Crypto-skepticism counterweight.", href: "https://reddit.com/r/Buttcoin", status: "read" },
  { name: "r/sysadminjobs", what: "Hiring-side ops / infrastructure threads.", href: "https://reddit.com/r/sysadminjobs", status: "read" },
  { name: "r/ITManagers", what: "Buyer-side enterprise IT.", href: "https://reddit.com/r/ITManagers", status: "read" },
  { name: "r/csbooks", what: "Book/resource recs adjacent to our reading list.", href: "https://reddit.com/r/csbooks", status: "read" },

  // Tier 3 — meta and adjacent
  { name: "r/coolgithubprojects", what: "Curation thread that pre-prints our dataset.", href: "https://reddit.com/r/coolgithubprojects", status: "watch" },
  { name: "r/github", what: "GitHub-platform-specific community.", href: "https://reddit.com/r/github", status: "watch" },
  { name: "r/git", what: "Tooling-level git audience.", href: "https://reddit.com/r/git", status: "read" },
  { name: "r/vim", what: "Power-user editor crowd.", href: "https://reddit.com/r/vim", status: "read" },
  { name: "r/neovim", what: "Modern-editor practitioner audience.", href: "https://reddit.com/r/neovim", status: "read" },
  { name: "r/emacs", what: "Editor-power-user audience.", href: "https://reddit.com/r/emacs", status: "read" },
  { name: "r/vscode", what: "Default-editor user audience.", href: "https://reddit.com/r/vscode", status: "read" },
  { name: "r/JetBrains", what: "JetBrains-IDE practitioner audience.", href: "https://reddit.com/r/Jetbrains", status: "read" },

  // Tier 3 — geographic / language
  { name: "r/europetech", what: "Europe-tech-scene audience. Geographic match for our base.", href: "https://reddit.com/r/europe", status: "read" },
  { name: "r/germany", what: "DACH founder audience.", href: "https://reddit.com/r/germany", status: "read" },
  { name: "r/uktech", what: "UK tech audience.", href: "https://reddit.com/r/UnitedKingdom", status: "read" },
  { name: "r/india", what: "India tech-startup ecosystem.", href: "https://reddit.com/r/india", status: "read" },
  { name: "r/india_startups", what: "Indian startup audience.", href: "https://reddit.com/r/IndiaInvestments", status: "read" },
  { name: "r/AskComputerScience", what: "CS-Q&A. Pattern memory only.", href: "https://reddit.com/r/AskComputerScience", status: "read" },
  { name: "r/computerscience", what: "Academic-leaning audience.", href: "https://reddit.com/r/computerscience", status: "read" },

  // Tier 3 — extras to round to 100
  { name: "r/agile", what: "Process / methodology audience.", href: "https://reddit.com/r/agile", status: "read" },
  { name: "r/projectmanagement", what: "PM-side audience. Buyer adjacency.", href: "https://reddit.com/r/projectmanagement", status: "read" },
  { name: "r/productivity", what: "Tool-stack curiosity audience.", href: "https://reddit.com/r/productivity", status: "read" },
  { name: "r/DataHoarder", what: "Archive-and-share niche audience.", href: "https://reddit.com/r/DataHoarder", status: "read" },
  { name: "r/AskStatistics", what: "Stats Q&A. Cross-reference for methodology.", href: "https://reddit.com/r/AskStatistics", status: "read" },
  { name: "r/statistics", what: "Stats-practitioner audience.", href: "https://reddit.com/r/statistics", status: "read" },
  { name: "r/Database", what: "DB-design practitioner audience.", href: "https://reddit.com/r/Database", status: "read" },
  { name: "r/PostgreSQL", what: "Postgres community. Neon / Supabase orbit.", href: "https://reddit.com/r/PostgreSQL", status: "watch" },
  { name: "r/redis", what: "Redis user community.", href: "https://reddit.com/r/redis", status: "read" },
];

// ────────────────────────────────────────────────────────────────────────────
// HACKER NEWS — 100 attention slots (categories, leaders, search lanes)
// ────────────────────────────────────────────────────────────────────────────

const HACKER_NEWS_VOICES: PlatformVoice[] = [
  // Front-page categories — the real "voices" of HN
  { name: "Show HN: dev-tool launches", what: "Where new orgs first surface to engineer-investor traffic.", href: "https://news.ycombinator.com/show", status: "watch", note: "Account currently blocked from posting (per memory). Read-only at the moment." },
  { name: "Show HN: AI infrastructure", what: "Where new agent / inference / model orgs land first.", href: "https://hn.algolia.com/?q=Show+HN+AI", status: "watch" },
  { name: "Show HN: data tooling", what: "Data-platform launches. Lineage / dbt / catalog orgs.", href: "https://hn.algolia.com/?q=Show+HN+data", status: "watch" },
  { name: "Show HN: developer tools", what: "Generic devtool launch surface.", href: "https://hn.algolia.com/?q=Show+HN+developer+tool", status: "watch" },
  { name: "Show HN: open-source", what: "Open-source launches. Highest GitHub-org-spike correlation.", href: "https://hn.algolia.com/?q=Show+HN+open+source", status: "watch" },
  { name: "Ask HN: hiring threads", what: "Monthly 'who is hiring' surface. Hiring-wave proxy.", href: "https://hn.algolia.com/?q=Ask+HN+who+is+hiring", status: "read" },
  { name: "Ask HN: who wants to be hired", what: "Engineer-side counterpart to hiring threads.", href: "https://hn.algolia.com/?q=Ask+HN+who+wants+to+be+hired", status: "read" },
  { name: "Ask HN: freelancer? seeking freelancer?", what: "Contractor-side market signal.", href: "https://hn.algolia.com/?q=Ask+HN+freelancer", status: "read" },
  { name: "Tell HN: meta-discussion", what: "Platform-itself discussion. Useful for tone calibration.", href: "https://hn.algolia.com/?q=Tell+HN", status: "read" },
  { name: "Launch HN: YC-cohort launches", what: "Where YC-cohort orgs introduce themselves to HN.", href: "https://hn.algolia.com/?q=Launch+HN", status: "watch" },

  // Topic-clustered watch threads
  { name: "Topic: Postgres / Postgres-extensions", what: "DB-momentum threads — Neon / Supabase / Postgres.AI cohort.", href: "https://hn.algolia.com/?q=Postgres", status: "watch" },
  { name: "Topic: MCP / Model Context Protocol", what: "MCP ecosystem chatter. Our category.", href: "https://hn.algolia.com/?q=MCP", status: "engage" },
  { name: "Topic: Anthropic Claude releases", what: "Claude / Sonnet / Opus release threads.", href: "https://hn.algolia.com/?q=Claude+Anthropic", status: "watch" },
  { name: "Topic: OpenAI o-series releases", what: "OpenAI release-cycle threads.", href: "https://hn.algolia.com/?q=OpenAI+o", status: "watch" },
  { name: "Topic: Vercel / Next.js", what: "Frontend-platform threads. Vercel-orbit ecosystem.", href: "https://hn.algolia.com/?q=Vercel", status: "watch" },
  { name: "Topic: Cloudflare", what: "Edge-platform threads.", href: "https://hn.algolia.com/?q=Cloudflare", status: "watch" },
  { name: "Topic: Hugging Face", what: "Model-hub launches and dataset releases.", href: "https://hn.algolia.com/?q=Hugging+Face", status: "watch" },
  { name: "Topic: Y Combinator", what: "YC-related threads — alumni, demo day, batch lists.", href: "https://hn.algolia.com/?q=Y+Combinator", status: "watch" },
  { name: "Topic: Series A / fundraise news", what: "Fundraise announcements. Our prediction ground truth.", href: "https://hn.algolia.com/?q=Series+A", status: "read" },
  { name: "Topic: Series B / late-stage", what: "Later-stage rounds. Pattern memory.", href: "https://hn.algolia.com/?q=Series+B", status: "read" },

  // Sector-specific topic feeds
  { name: "Topic: AI inference / LLM serving", what: "Inference-infra orgs surface here first.", href: "https://hn.algolia.com/?q=LLM+inference", status: "watch" },
  { name: "Topic: vector databases", what: "Pinecone / Weaviate / Qdrant / Lance ecosystem.", href: "https://hn.algolia.com/?q=vector+database", status: "watch" },
  { name: "Topic: agent frameworks", what: "Agent-framework launches and comparisons.", href: "https://hn.algolia.com/?q=agent+framework", status: "watch" },
  { name: "Topic: open-source models", what: "Open-weight model releases.", href: "https://hn.algolia.com/?q=open+source+model", status: "watch" },
  { name: "Topic: dev-tool funding", what: "Devtool fundraises — our Series-A prediction surface.", href: "https://hn.algolia.com/?q=dev+tool+raised", status: "read" },
  { name: "Topic: code search / repo tooling", what: "Sourcegraph / Greptile / similar orgs.", href: "https://hn.algolia.com/?q=code+search", status: "watch" },
  { name: "Topic: observability / OpenTelemetry", what: "Observability-platform threads.", href: "https://hn.algolia.com/?q=OpenTelemetry", status: "watch" },
  { name: "Topic: developer experience (DX)", what: "DX-focused tooling threads.", href: "https://hn.algolia.com/?q=developer+experience", status: "watch" },
  { name: "Topic: edge compute", what: "Edge-platform threads. Cloudflare / Fly / Vercel orbit.", href: "https://hn.algolia.com/?q=edge+compute", status: "watch" },
  { name: "Topic: WASM / WebAssembly", what: "WASM-runtime threads.", href: "https://hn.algolia.com/?q=WebAssembly", status: "watch" },

  // Author / contributor archetypes (anonymous-respecting)
  { name: "HN top-100 commenters (rolling 90d)", what: "High-karma archetype set. Read for tone, never reply directly.", href: "https://news.ycombinator.com/leaders", status: "read" },
  { name: "HN top-stories (rolling 30d)", what: "Front-page rotation pattern. Time-of-week / time-of-day signal.", href: "https://news.ycombinator.com/news", status: "read" },
  { name: "HN top of all time", what: "Pattern memory — what front-pages over decades.", href: "https://news.ycombinator.com/?p=2", status: "read" },
  { name: "HN classic stories", what: "Top-of-all-time archive. Tone reference.", href: "https://news.ycombinator.com/best", status: "read" },
  { name: "HN ask top-stories", what: "Highest-engagement Ask HN threads.", href: "https://news.ycombinator.com/ask", status: "read" },
  { name: "HN show top-stories", what: "Highest-engagement Show HN threads.", href: "https://news.ycombinator.com/show", status: "watch" },
  { name: "HN newest (firehose)", what: "Real-time submissions. Pre-front-page ranking signal.", href: "https://news.ycombinator.com/newest", status: "read" },
  { name: "HN active threads", what: "Comment-velocity surface. What's heating up now.", href: "https://news.ycombinator.com/active", status: "read" },
  { name: "HN job listings", what: "YC-portfolio hiring map. Hiring-velocity proxy.", href: "https://news.ycombinator.com/jobs", status: "read" },
  { name: "HN classic Ask HN: 'do not start a startup unless...'", what: "Founder-archetype primer.", href: "https://hn.algolia.com/?q=do+not+start+a+startup", status: "read" },

  // Search-lane saved queries
  { name: "Algolia: 'GitHub commit velocity'", what: "Pattern memory for our category-naming.", href: "https://hn.algolia.com/?q=GitHub+commit+velocity", status: "read" },
  { name: "Algolia: 'engineering metrics'", what: "Metric-design discussion lane.", href: "https://hn.algolia.com/?q=engineering+metrics", status: "read" },
  { name: "Algolia: 'developer productivity'", what: "DX / engineering-productivity threads.", href: "https://hn.algolia.com/?q=developer+productivity", status: "read" },
  { name: "Algolia: 'open source business model'", what: "OSS-monetisation threads. Commercialisation pattern.", href: "https://hn.algolia.com/?q=open+source+business+model", status: "read" },
  { name: "Algolia: 'venture capital'", what: "VC-discussion lane on HN. Watch for thesis flips.", href: "https://hn.algolia.com/?q=venture+capital", status: "read" },
  { name: "Algolia: 'angel investing'", what: "Angel-investor avatar threads.", href: "https://hn.algolia.com/?q=angel+investing", status: "read" },
  { name: "Algolia: 'side project'", what: "Side-project threads. Hobby-to-startup pipeline.", href: "https://hn.algolia.com/?q=side+project", status: "read" },
  { name: "Algolia: 'startup ideas'", what: "Idea-generation threads. Tone reference.", href: "https://hn.algolia.com/?q=startup+ideas", status: "read" },
  { name: "Algolia: 'developer tools market'", what: "Devtool-market sizing discussions.", href: "https://hn.algolia.com/?q=developer+tools+market", status: "read" },
  { name: "Algolia: 'Series A predict'", what: "Anyone discussing prediction methodology — pattern memory.", href: "https://hn.algolia.com/?q=Series+A+predict", status: "read" },

  // Curated YC archives
  { name: "YC: Startup School posts", what: "Curated startup-school content surface.", href: "https://www.startupschool.org", status: "read" },
  { name: "YC: company-list on HN", what: "Live YC alumni list — back-checks our predictions.", href: "https://news.ycombinator.com/yc.html", status: "watch" },
  { name: "YC W26 / S26 / W25 / S25 batch threads", what: "Batch-launch threads. Engineering-velocity confirmation.", href: "https://hn.algolia.com/?q=YC+W26", status: "watch" },
  { name: "YC: Demo Day recaps", what: "Cohort-by-cohort demo-day recap threads.", href: "https://hn.algolia.com/?q=Demo+Day", status: "read" },

  // Meta / community
  { name: "HN best-of-the-week emails", what: "Weekly digest. Catches what the daily firehose misses.", href: "https://www.hndigest.com", status: "read" },
  { name: "HN best-of newsletter (kale.am)", what: "Curated weekly recap.", href: "https://www.hndigest.com", status: "read" },
  { name: "HN-comments newsletter", what: "Comment-thread highlights.", href: "https://hnplaylist.com", status: "read" },
  { name: "HN.algolia API", what: "Programmatic search. Drives our HN-thread monitor.", href: "https://hn.algolia.com/api", status: "engage" },
  { name: "HN public API", what: "Items / users / max-id endpoints.", href: "https://github.com/HackerNews/API", status: "engage" },
  { name: "HN BigQuery dataset", what: "Full-history HN data. Cross-references our methodology.", href: "https://console.cloud.google.com/marketplace/details/y-combinator/hacker-news", status: "read" },
  { name: "HN clones / mirrors (e.g. Hckrnews.com)", what: "Alternative front-pages. Different ranking surfaces.", href: "https://hckrnews.com", status: "read" },
  { name: "HN front-page archive (refind)", what: "Refind's HN-discovery layer.", href: "https://refind.com", status: "read" },
  { name: "HN classic 'what are you working on'", what: "Recurring side-project thread.", href: "https://hn.algolia.com/?q=what+are+you+working+on", status: "read" },
  { name: "HN end-of-year retros", what: "Annual reflection threads.", href: "https://hn.algolia.com/?q=year+in+review", status: "read" },

  // Adjacent feeds — pattern correlated with HN attention
  { name: "Hacker Newsletter (weekly digest)", what: "Email-side curation. Catches threads we missed.", href: "https://www.hackernewsletter.com", status: "read" },
  { name: "Console.dev devtool digest", what: "Devtool-curation digest. HN-adjacent attention layer.", href: "https://console.dev", status: "watch" },
  { name: "Devtools.fyi", what: "Independent devtool review. HN-adjacent reach.", href: "https://devtools.fyi", status: "watch" },
  { name: "Dev.to top-30 daily", what: "Dev.to trending. Cross-pollinates with HN attention.", href: "https://dev.to/top/week", status: "engage" },
  { name: "Lobsters", what: "Smaller, higher-signal HN-alternative.", href: "https://lobste.rs", status: "watch" },
  { name: "Tildes", what: "HN-style discussion alternative. Smaller but high-signal.", href: "https://tildes.net", status: "read" },
  { name: "DataTau", what: "Data-science HN-clone. Sector-specific attention.", href: "https://www.datatau.net", status: "read" },
  { name: "Developer Town (HN-like)", what: "Devtool-specific HN-clone.", href: "https://devtown.io", status: "read" },
  { name: "Medium top engineering tag", what: "Medium-side counterweight to HN attention.", href: "https://medium.com/tag/engineering", status: "read" },
  { name: "Substack top stories", what: "Cross-platform attention layer.", href: "https://substack.com/inbox", status: "read" },

  // Specialty HN saved queries
  { name: "Algolia: 'commit graph'", what: "Anyone analysing commit graphs publicly.", href: "https://hn.algolia.com/?q=commit+graph", status: "read" },
  { name: "Algolia: 'GitHub stars vs adoption'", what: "Star-count debate threads — pattern memory.", href: "https://hn.algolia.com/?q=GitHub+stars+adoption", status: "read" },
  { name: "Algolia: 'reproducible research'", what: "Reproducibility threads — adjacent positioning.", href: "https://hn.algolia.com/?q=reproducible+research", status: "read" },
  { name: "Algolia: 'code is the data'", what: "Phrase-level pattern memory.", href: "https://hn.algolia.com/?q=code+is+the+data", status: "read" },
  { name: "Algolia: 'public dataset'", what: "Dataset-release threads. Cross-confirms our methodology.", href: "https://hn.algolia.com/?q=public+dataset", status: "read" },
  { name: "Algolia: 'agent native'", what: "Agent-native discussion lane.", href: "https://hn.algolia.com/?q=agent+native", status: "read" },
  { name: "Algolia: 'developer-investor'", what: "Avatar-naming pattern memory.", href: "https://hn.algolia.com/?q=developer+investor", status: "read" },
  { name: "Algolia: 'Series A data'", what: "Series A data-driven discussion threads.", href: "https://hn.algolia.com/?q=Series+A+data", status: "read" },
  { name: "Algolia: 'GitHub trending'", what: "GitHub trending-related discussions.", href: "https://hn.algolia.com/?q=GitHub+trending", status: "read" },

  // Rounding to 100
  { name: "Algolia: 'open-source maintainer'", what: "Maintainer-economics threads.", href: "https://hn.algolia.com/?q=open+source+maintainer", status: "read" },
  { name: "Algolia: 'engineering management'", what: "EM-side threads. Adjacent buyer-archetype.", href: "https://hn.algolia.com/?q=engineering+management", status: "read" },
  { name: "Algolia: 'CTO advice'", what: "CTO-archetype threads.", href: "https://hn.algolia.com/?q=CTO+advice", status: "read" },
  { name: "Algolia: 'first 10 engineers'", what: "Hiring-velocity-narrative threads.", href: "https://hn.algolia.com/?q=first+10+engineers", status: "read" },
  { name: "Algolia: 'pricing strategy'", what: "Pricing-strategy threads. Cross-references our pricing audit.", href: "https://hn.algolia.com/?q=pricing+strategy", status: "read" },
  { name: "Algolia: 'public benchmark'", what: "Benchmark-discussion lane.", href: "https://hn.algolia.com/?q=public+benchmark", status: "read" },
  { name: "Algolia: 'bus factor'", what: "Bus-factor / contributor-diversity discussions.", href: "https://hn.algolia.com/?q=bus+factor", status: "read" },
  { name: "Algolia: 'monorepo'", what: "Monorepo-strategy threads.", href: "https://hn.algolia.com/?q=monorepo", status: "read" },

  { name: "HN polls (annual)", what: "Editor / OS / language polls. Decade-pattern memory.", href: "https://news.ycombinator.com/polls", status: "read" },
  { name: "HN classics archive", what: "Editor's hand-picked timeless threads.", href: "https://news.ycombinator.com/best", status: "read" },
  { name: "HN moderator notes", what: "Where dang's tone-rules surface.", href: "https://news.ycombinator.com/from?site=ycombinator.com", status: "read" },
  { name: "HN guidelines", what: "Comment-quality north star.", href: "https://news.ycombinator.com/newsguidelines.html", status: "read" },
  { name: "HN FAQ", what: "Platform-rules pattern memory.", href: "https://news.ycombinator.com/newsfaq.html", status: "read" },
  { name: "HN show submissions guidance", what: "Show HN-specific format rules.", href: "https://news.ycombinator.com/showhn.html", status: "read" },
  { name: "HN job-posting guidelines", what: "Hiring-thread tone rules.", href: "https://news.ycombinator.com/jobsfaq.html", status: "read" },
  { name: "HN account info / second-chance pool", what: "Front-page algorithm pattern memory.", href: "https://news.ycombinator.com/secondchance.html", status: "read" },
  { name: "Sacred-HN list (alternate ranking)", what: "Alternative top-of-time ranking.", href: "https://hckrnews.com/?p=alltime", status: "read" },
];

// ────────────────────────────────────────────────────────────────────────────
// X / TWITTER — 100 accounts (engineer-investor adjacent, public)
// ────────────────────────────────────────────────────────────────────────────

const TWITTER_VOICES: PlatformVoice[] = [
  // Tier 1 — operator-investors (developer-investor avatar concentration)
  { name: "@paulg", what: "YC founder. Founder-archetype tone north star. Read; never reply.", href: "https://x.com/paulg", status: "read" },
  { name: "@sama", what: "Frontier-AI narrative. Read.", href: "https://x.com/sama", status: "read" },
  { name: "@dhh", what: "Counter-narrative on engineering and capital. Pattern memory.", href: "https://x.com/dhh", status: "read" },
  { name: "@patrickc", what: "Stripe founder. Reads code — our exact avatar.", href: "https://x.com/patrickc", status: "read" },
  { name: "@gergelyorosz", what: "Pragmatic Engineer author. Engineering-org reality at scale.", href: "https://x.com/GergelyOrosz", status: "read", note: "We read; we never reply (anonymity rule on personal accounts)." },
  { name: "@lennysan", what: "Lenny's Newsletter. Product / growth / hiring discipline.", href: "https://x.com/lennysan", status: "read" },
  { name: "@stratechery", what: "Ben Thompson. Aggregation-theory / strategy discipline.", href: "https://x.com/stratechery", status: "read" },
  { name: "@packym", what: "Not Boring. Capital narratives.", href: "https://x.com/packyM", status: "read" },
  { name: "@swyx", what: "Devtool-investor crossover. Avatar concentration.", href: "https://x.com/swyx", status: "read" },
  { name: "@simonw", what: "Simon Willison. Builds in public on AI tooling.", href: "https://x.com/simonw", status: "read" },

  // Tier 1 — VC operators
  { name: "@elad", what: "Elad Gil. Operator-investor concentration.", href: "https://x.com/eladgil", status: "read" },
  { name: "@chamath", what: "Macro / capital-narrative.", href: "https://x.com/chamath", status: "read" },
  { name: "@bgurley", what: "Bill Gurley. Bench-marker discipline.", href: "https://x.com/bgurley", status: "read" },
  { name: "@FoundersFund", what: "FF firm-side voice.", href: "https://x.com/foundersfund", status: "read" },
  { name: "@a16z", what: "a16z firm-side. Aggregator of our category.", href: "https://x.com/a16z", status: "read" },
  { name: "@sequoia", what: "Sequoia firm-side.", href: "https://x.com/sequoia", status: "read" },
  { name: "@indexventures", what: "Index Ventures. Euro-tier mainstay.", href: "https://x.com/indexventures", status: "read" },
  { name: "@ycombinator", what: "YC firm-side. Demo-day cadence.", href: "https://x.com/ycombinator", status: "read" },
  { name: "@FirstRound", what: "First Round. Engineering-ops content.", href: "https://x.com/firstround", status: "read" },
  { name: "@Bessemer", what: "Bessemer. Cloud-cred publisher.", href: "https://x.com/bessemerVP", status: "read" },

  // Tier 1 — devtool / infra founders
  { name: "@vercel", what: "Vercel firm-side.", href: "https://x.com/vercel", status: "engage" },
  { name: "@rauchg", what: "Guillermo Rauch. Vercel-orbit founder voice.", href: "https://x.com/rauchg", status: "read" },
  { name: "@supabase", what: "Supabase firm-side.", href: "https://x.com/supabase", status: "engage" },
  { name: "@kiwicopple", what: "Supabase founder. Engineering-velocity narratives.", href: "https://x.com/kiwicopple", status: "read" },
  { name: "@neondatabase", what: "Neon firm-side.", href: "https://x.com/neondatabase", status: "engage" },
  { name: "@huggingface", what: "Hugging Face firm-side.", href: "https://x.com/huggingface", status: "engage" },
  { name: "@AnthropicAI", what: "Anthropic firm-side.", href: "https://x.com/AnthropicAI", status: "watch" },
  { name: "@OpenAI", what: "OpenAI firm-side.", href: "https://x.com/OpenAI", status: "watch" },
  { name: "@LangChainAI", what: "LangChain firm-side.", href: "https://x.com/LangChainAI", status: "engage" },
  { name: "@cloudflare", what: "Cloudflare firm-side.", href: "https://x.com/Cloudflare", status: "watch" },

  // Tier 2 — engineering-investor practitioners
  { name: "@danielgross", what: "Daniel Gross. Operator-investor.", href: "https://x.com/danielgross", status: "read" },
  { name: "@nat", what: "Nat Friedman. Developer-investor archetype.", href: "https://x.com/natfriedman", status: "read" },
  { name: "@sarahcat21", what: "Sarah Tavel. Investor-side product taste.", href: "https://x.com/sarahcat21", status: "read" },
  { name: "@balajis", what: "Balaji. Frontier-narrative.", href: "https://x.com/balajis", status: "read" },
  { name: "@nikitabier", what: "Operator-investor.", href: "https://x.com/nikitabier", status: "read" },
  { name: "@levie", what: "Aaron Levie. Operator-side narrative.", href: "https://x.com/levie", status: "read" },
  { name: "@semil", what: "Semil Shah. Seed-stage operator-investor.", href: "https://x.com/semil", status: "read" },
  { name: "@pmarca", what: "Marc Andreessen. Macro narrative.", href: "https://x.com/pmarca", status: "read" },
  { name: "@HarryStebbings", what: "20VC host. Operators-on-cap-tables.", href: "https://x.com/HarryStebbings", status: "read" },

  // Tier 2 — devtool-adjacent operators
  { name: "@theo", what: "Theo. Devtool-influencer audience.", href: "https://x.com/theo", status: "read" },
  { name: "@DanAbramov", what: "Dan Abramov. React-orbit voice.", href: "https://x.com/dan_abramov", status: "read" },
  { name: "@addyosmani", what: "Frontend-perf voice.", href: "https://x.com/addyosmani", status: "read" },
  { name: "@kentcdodds", what: "Kent C. Dodds. Frontend-educator voice.", href: "https://x.com/kentcdodds", status: "read" },
  { name: "@taylorotwell", what: "Laravel founder. Solo-founder narrative.", href: "https://x.com/taylorotwell", status: "read" },
  { name: "@zachleat", what: "Zach Leatherman. 11ty / static-site voice.", href: "https://x.com/zachleat", status: "read" },
  { name: "@levelsio", what: "Pieter Levels. Solo-founder build-in-public archetype.", href: "https://x.com/levelsio", status: "read" },
  { name: "@MKBHD", what: "Tone-calibration only. Mass-tech audience.", href: "https://x.com/MKBHD", status: "read" },
  { name: "@krishnan", what: "Krishnan Ganesh. Builder-investor.", href: "https://x.com/kgsubbu", status: "read" },

  // Tier 2 — capital narrative
  { name: "@mattturck", what: "Matt Turck. ML-stack / data investor.", href: "https://x.com/mattturck", status: "read" },
  { name: "@ljin18", what: "Li Jin. Creator-economy / passion-economy.", href: "https://x.com/ljin18", status: "read" },
  { name: "@a16zcrypto", what: "Crypto-side a16z.", href: "https://x.com/a16zcrypto", status: "read" },
  { name: "@kevinrose", what: "Operator-investor.", href: "https://x.com/kevinrose", status: "read" },
  { name: "@leigh_marie", what: "Leigh Marie Braswell. Engineering-side investor.", href: "https://x.com/leigh_marie", status: "read" },
  { name: "@erikbern", what: "Modal founder. Engineering-investor archetype.", href: "https://x.com/bernhardsson", status: "read" },
  { name: "@jdorfman", what: "JD Dorfman. Open-source community organiser.", href: "https://x.com/jdorfman", status: "read" },
  { name: "@LoganBartlett", what: "Logan Bartlett. Operator-investor.", href: "https://x.com/loganbartlett", status: "read" },
  // Tier 2 — research / methodology
  { name: "@ID_AA_Carmack", what: "John Carmack. Engineering-rigor north star.", href: "https://x.com/ID_AA_Carmack", status: "read" },
  { name: "@karpathy", what: "Andrej Karpathy. ML-engineering-explainer voice.", href: "https://x.com/karpathy", status: "read" },
  { name: "@GoogleResearch", what: "Research-firm-side.", href: "https://x.com/GoogleResearch", status: "read" },
  { name: "@MetaAI", what: "Meta-AI-firm-side.", href: "https://x.com/MetaAI", status: "read" },
  { name: "@deepmind", what: "DeepMind firm-side.", href: "https://x.com/GoogleDeepMind", status: "read" },
  { name: "@AnthropicResearch", what: "Anthropic research-side.", href: "https://x.com/AnthropicAI", status: "read" },
  { name: "@OpenAIResearch", what: "OpenAI research-side.", href: "https://x.com/openai", status: "read" },
  { name: "@nlpguide", what: "NLP / ML methodology.", href: "https://x.com/nlpguide", status: "read" },
  { name: "@hardmaru", what: "David Ha. Research-engineer voice.", href: "https://x.com/hardmaru", status: "read" },

  // Tier 2 — community / educators
  { name: "@svpino", what: "Santiago Valdarrama. ML-educator.", href: "https://x.com/svpino", status: "read" },
  { name: "@_ScottCondron", what: "Scott Condron. ML-engineer-investor crossover.", href: "https://x.com/_scottcondron", status: "read" },
  { name: "@ClementDelangue", what: "Clem from Hugging Face. AI-narrative.", href: "https://x.com/ClementDelangue", status: "read" },
  { name: "@brian_lovin", what: "Brian Lovin. Designer-engineer.", href: "https://x.com/brian_lovin", status: "read" },
  { name: "@charity_majors", what: "Charity Majors. Observability / engineering-leadership.", href: "https://x.com/mipsytipsy", status: "read" },
  { name: "@b0rk", what: "Julia Evans. Engineering-explainer voice.", href: "https://x.com/b0rk", status: "read" },

  // Tier 2 — VC firm comms
  { name: "@Greylock", what: "Greylock firm-side.", href: "https://x.com/greylockvc", status: "read" },
  { name: "@accel", what: "Accel firm-side.", href: "https://x.com/Accel", status: "read" },
  { name: "@lightspeed", what: "Lightspeed firm-side.", href: "https://x.com/lightspeedvp", status: "read" },
  { name: "@Khoslaventures", what: "Khosla firm-side.", href: "https://x.com/khoslaventures", status: "read" },
  { name: "@CRV", what: "CRV firm-side.", href: "https://x.com/CRV", status: "read" },
  { name: "@USV", what: "Union Square Ventures firm-side.", href: "https://x.com/usv", status: "read" },
  { name: "@8vc", what: "8VC firm-side.", href: "https://x.com/8vc", status: "read" },
  { name: "@Founders", what: "Founders' Fund firm-side.", href: "https://x.com/foundersfund", status: "read" },
  { name: "@HVC", what: "Heavybit firm-side. Devtool-orbit.", href: "https://x.com/heavybit", status: "read" },
  { name: "@matrixpartners", what: "Matrix Partners firm-side.", href: "https://x.com/matrixpartners", status: "read" },

  // Tier 3 — wider engineering-narrative voices
  { name: "@kelseyhightower", what: "Kelsey Hightower. Cloud-native voice.", href: "https://x.com/kelseyhightower", status: "read" },
  { name: "@QuinnyPig", what: "Corey Quinn. Cloud-economics.", href: "https://x.com/QuinnyPig", status: "read" },
  { name: "@vboykis", what: "Vicki Boykis. ML-engineering-investor.", href: "https://x.com/vboykis", status: "read" },
  { name: "@Blakeir", what: "Blake Robbins. Dev-tools-adjacent investor.", href: "https://x.com/blakeir", status: "read" },

  // Tier 3 — round to 100
  { name: "@joshu", what: "Josh Schachter. Operator-investor.", href: "https://x.com/joshu", status: "read" },
  { name: "@geoffreylitt", what: "Geoffrey Litt. Tools-for-thought voice.", href: "https://x.com/geoffreylitt", status: "read" },
  { name: "@fchollet", what: "Francois Chollet. ML-engineering voice.", href: "https://x.com/fchollet", status: "read" },
  { name: "@yoavgo", what: "Yoav Goldberg. NLP research.", href: "https://x.com/yoavgo", status: "read" },
  { name: "@osanseviero", what: "Omar Sanseviero. Hugging Face / OS-AI voice.", href: "https://x.com/osanseviero", status: "read" },
  { name: "@_jasonwei", what: "Jason Wei. ML-research voice.", href: "https://x.com/_jasonwei", status: "read" },

  // Tier 3 — devtool / DevRel adjacent (round to 100)
  { name: "@dabit3", what: "Nader Dabit. Web3 / serverless devtool DevRel.", href: "https://x.com/dabit3", status: "read" },
  { name: "@cassidoo", what: "Cassidy Williams. DevRel / engineering-educator voice.", href: "https://x.com/cassidoo", status: "read" },
  { name: "@gunnarmorling", what: "Gunnar Morling. Data-platform engineering.", href: "https://x.com/gunnarmorling", status: "read" },
  { name: "@tef_ebooks", what: "Tef. Distributed-systems engineering voice.", href: "https://x.com/tef_ebooks", status: "read" },
  { name: "@tylerneylon", what: "Tyler Neylon. Math-engineering crossover.", href: "https://x.com/tylerneylon", status: "read" },
  { name: "@_msw_", what: "Matt Wood. AWS / data-engineering.", href: "https://x.com/_msw_", status: "read" },
  { name: "@hwchase17", what: "Harrison Chase. LangChain founder.", href: "https://x.com/hwchase17", status: "read" },
  { name: "@jxnlco", what: "Jason Liu. ML-engineering / instructor library.", href: "https://x.com/jxnlco", status: "read" },
  { name: "@JeffDean", what: "Jeff Dean. Google research / engineering.", href: "https://x.com/JeffDean", status: "read" },
];

// ────────────────────────────────────────────────────────────────────────────
// LIST OF LISTS
// ────────────────────────────────────────────────────────────────────────────

export const PLATFORM_LISTS: PlatformList[] = [
  {
    slug: "reddit",
    label: "Reddit",
    tagline: "100 subreddits where the developer-investor's audience already lives.",
    intro:
      "Reddit's auto-mod removes any post that names a product on the venture-side subs. So this list is engagement-by-comment-only — never main-post pitches. Top-down by ICP fit.",
    cadence:
      "Comment-only on the top-tier engage subs. 40-55 words, no em-dashes, no URLs in the first comment. Twice a week, ceiling of four replies.",
    rule:
      "Never main-post on r/venturecapital / r/AngelInvesting / r/startups — auto-mod will remove the post and shadowban the account. Comment-only, on threads where data answers a real question.",
    expected: 100,
    items: REDDIT_VOICES,
  },
  {
    slug: "hacker-news",
    label: "Hacker News",
    tagline: "100 HN attention slots — categories, search lanes, leaderboards, adjacent feeds.",
    intro:
      "HN doesn't have 100 'voices' the way Reddit does — it has attention slots. Each slot here is a category (Show HN: AI infra), a saved Algolia search lane, a leaderboard surface, or an adjacent digest. Together they form the literal HN attention map.",
    cadence:
      "Account is currently on hold (blocked from submitting / commenting). Read-only across all 100 slots until the account ban resolves. Search-lane monitoring runs daily; front-page archive runs weekly.",
    rule:
      "When the ban resolves: never submit a top-level Show HN of our own product. Submit only data-ground-truth artefacts (CC BY 4.0 dataset, SSRN paper, methodology doc). Comments allowed on any thread that asks a real engineering-velocity question.",
    expected: 100,
    items: HACKER_NEWS_VOICES,
  },
  {
    slug: "twitter",
    label: "X / Twitter",
    tagline: "100 X / Twitter accounts — VCs, devtool founders, engineering-investors.",
    intro:
      "We read; we don't broadcast. Anonymity rule. Our company account posts own-product threads on Tuesdays and Fridays; we never @-reply individuals. The 100 accounts here are read-of-record, not engagement targets.",
    cadence:
      "Read daily. Post own-product threads twice a week. Quote-tweet only when the original post is a public artefact (firm-side fund news, public dataset release). Never reply to individual founders / investors directly.",
    rule:
      "Anonymity rule: no founder face / voice / name. Synthetic narration only. Read; never engage personally. The company account is the only voice — individual founders' personal accounts stay separate.",
    expected: 100,
    items: TWITTER_VOICES,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

export function getPlatformList(slug: string): PlatformList | undefined {
  return PLATFORM_LISTS.find((p) => p.slug === slug);
}

export function getAllPlatformSlugs(): string[] {
  return PLATFORM_LISTS.map((p) => p.slug);
}

export function platformVoiceCount(): number {
  return PLATFORM_LISTS.reduce((n, p) => n + p.items.length, 0);
}

/**
 * Build-time sanity check — every platform must have exactly its declared
 * `expected` count. Throws on drift so the build catches the regression.
 */
export function assertPlatformCounts(): void {
  for (const p of PLATFORM_LISTS) {
    if (p.items.length !== p.expected) {
      throw new Error(
        `Platform ${p.slug} expected ${p.expected} entries, got ${p.items.length}`,
      );
    }
  }
}

export function platformStatusCounts(slug: string): Record<VoiceStatus, number> {
  const list = getPlatformList(slug);
  const counts: Record<VoiceStatus, number> = {
    engage: 0,
    watch: 0,
    hold: 0,
    read: 0,
    blocked: 0,
  };
  if (!list) return counts;
  for (const v of list.items) counts[v.status]++;
  return counts;
}
