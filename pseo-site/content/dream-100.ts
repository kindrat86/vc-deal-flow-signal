export type Dream100Status =
  | "engage"
  | "watch"
  | "hold"
  | "read"
  | "blocked";

export interface Dream100Voice {
  name: string;
  what: string;
  href?: string;
  status: Dream100Status;
  note?: string;
}

export interface Dream100Group {
  id: string;
  label: string;
  intro: string;
  items: Dream100Voice[];
}

export const STATUS_META: Record<
  Dream100Status,
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

export const DREAM_100_GROUPS: Dream100Group[] = [
  {
    id: "substacks",
    label: "10 substacks we read",
    intro:
      "Long-form weekly that taught us to think about software, scale, and product the way the developer-investor reads code. Most are paywalled or comment-light — we consume, we don't dominate.",
    items: [
      {
        name: "Lenny's Newsletter",
        what: "Product, growth, hiring — the discipline of going from PMF to ARR.",
        href: "https://www.lennysnewsletter.com",
        status: "read",
      },
      {
        name: "The Pragmatic Engineer",
        what: "Engineering-org reality at scale. Rare honest reporting from inside Big Tech.",
        href: "https://blog.pragmaticengineer.com",
        status: "read",
        note:
          "Author Gergely Orosz active on LinkedIn personal — we read, never reply (company-page-only rule).",
      },
      {
        name: "Stratechery",
        what: "Strategy, aggregation theory, platform dynamics. Required reading on every software business.",
        href: "https://stratechery.com",
        status: "read",
      },
      {
        name: "Not Boring",
        what: "Capital narratives. The why-now of category creation, told as story.",
        href: "https://www.notboring.co",
        status: "read",
      },
      {
        name: "Software Lead Weekly",
        what: "What engineering leaders read each week. Hiring, comp, architecture.",
        href: "https://softwareleadweekly.com",
        status: "read",
      },
      {
        name: "Last Week in AWS",
        what: "Cloud economics with a sharp tongue. The gold standard for vendor scepticism.",
        href: "https://www.lastweekinaws.com",
        status: "read",
      },
      {
        name: "Construction Physics",
        what: "Why software is eating slower-moving industries — and what doesn't translate.",
        href: "https://www.construction-physics.com",
        status: "read",
      },
      {
        name: "The Generalist",
        what: "Deep dives on the funds, founders, and frameworks shaping the next cycle.",
        href: "https://www.generalist.com",
        status: "read",
      },
      {
        name: "Bits about Money",
        what: "How financial systems actually work — read it before you build a fintech thesis.",
        href: "https://www.bitsaboutmoney.com",
        status: "read",
      },
      {
        name: "One Useful Thing — Ethan Mollick",
        what: "The applied-AI substack the developer-investor reads on the train.",
        href: "https://www.oneusefulthing.org",
        status: "read",
      },
    ],
  },
  {
    id: "podcasts",
    label: "10 podcasts we listen to",
    intro:
      "We don't run a podcast (anonymity rule). These are the conversations that move our priors quarterly. Listen-only — no audio guesting, no founder voice on tape.",
    items: [
      {
        name: "Acquired",
        what: "Three-hour deep dives on the companies that built the modern stack.",
        status: "read",
      },
      {
        name: "Invest Like the Best",
        what: "Patrick O'Shaughnessy's investor roster. Where mental models compound.",
        status: "read",
      },
      {
        name: "20VC",
        what: "Harry Stebbings on the operators behind the cap tables.",
        status: "read",
      },
      {
        name: "Founders",
        what: "David Senra's biographical series — the stories that shaped great founders.",
        status: "read",
      },
      {
        name: "Lenny's Podcast",
        what: "PMF, growth, leadership — the audio companion to the newsletter.",
        status: "read",
      },
      {
        name: "The Logan Bartlett Show",
        what: "Sharp questions, candid answers from operators and allocators.",
        status: "read",
      },
      {
        name: "BG2 Pod",
        what: "Brad Gerstner + Bill Gurley on the macro narrative behind the next decade.",
        status: "read",
      },
      {
        name: "Stratechery Daily",
        what: "Ben Thompson's audio deep-dive on the day's strategic story.",
        status: "read",
      },
      {
        name: "Practical AI",
        what: "Engineering-side AI: tools, frameworks, real implementations.",
        status: "read",
      },
      {
        name: "The Rest is History",
        what: "Long horizons. The pattern memory that prevents quarterly recency bias.",
        status: "read",
      },
    ],
  },
  {
    id: "newsletters",
    label: "10 newsletters we filter through",
    intro:
      "High-density daily / weekly aggregators. Where new GitHub orgs, hiring waves, and infrastructure shifts surface before the press cycle.",
    items: [
      {
        name: "TLDR Tech",
        what: "Daily 5-minute summary of the technical web.",
        href: "https://tldr.tech",
        status: "read",
      },
      {
        name: "ByteByteGo",
        what: "Architecture diagrams of the systems behind the products.",
        href: "https://blog.bytebytego.com",
        status: "read",
      },
      {
        name: "Console.dev",
        what: "Curated developer tools. Where the dev-tool ecosystem first shows itself.",
        href: "https://console.dev",
        status: "watch",
        note:
          "Submission target — we monitor for openings to feature MCP server.",
      },
      {
        name: "Devtools.fyi",
        what: "Independent reviews of the next-gen dev-tool layer.",
        status: "watch",
      },
      {
        name: "Hacker Newsletter",
        what: "Weekly digest of the best HN threads. Catches what the daily firehose misses.",
        status: "read",
      },
      {
        name: "DBOS / This Week in PostgreSQL",
        what: "Database-layer momentum, where infrastructure investments compound.",
        status: "read",
      },
      {
        name: "Refind",
        what: "AI-curated reading list trained on our category.",
        status: "read",
      },
      {
        name: "Devops'ish",
        what: "Observability, platform engineering, infrastructure-as-code patterns.",
        status: "read",
      },
      {
        name: "Frontend Focus",
        what: "Where the React / Vue / Svelte ecosystems actually land.",
        status: "read",
      },
      {
        name: "Mind the Product",
        what: "The PM frame on the products we're tracking from the engineering side.",
        status: "read",
      },
    ],
  },
  {
    id: "github-orgs",
    label: "10 GitHub orgs we watch the most",
    intro:
      "The orgs whose merge cadence, contributor graph, and release notes set the meta for the developer-investor's attention surface. Public profiles only.",
    items: [
      {
        name: "vercel",
        what: "Frontend-deployment platform — the meta-layer behind half our dataset's React orgs.",
        href: "https://github.com/vercel",
        status: "watch",
      },
      {
        name: "supabase",
        what: "Open-source Firebase. Pattern-defining for the BaaS ascension category.",
        href: "https://github.com/supabase",
        status: "watch",
      },
      {
        name: "huggingface",
        what: "Open-source AI infrastructure. Their merge graph is an industry leading indicator.",
        href: "https://github.com/huggingface",
        status: "watch",
      },
      {
        name: "anthropic",
        what: "Where Claude / MCP land. Public-side of frontier-model tooling.",
        href: "https://github.com/anthropics",
        status: "watch",
      },
      {
        name: "openai",
        what: "API-side public repos. The shape of the assistants ecosystem moves through here.",
        href: "https://github.com/openai",
        status: "watch",
      },
      {
        name: "modelcontextprotocol",
        what: "MCP — the integration substrate underneath agent tooling.",
        href: "https://github.com/modelcontextprotocol",
        status: "engage",
        note:
          "We ship a registered MCP server (@gitdealflow/mcp-signal) and contribute issues/PRs.",
      },
      {
        name: "cloudflare",
        what: "Edge / workers / D1 — the platform layer behind the next-gen serverless wave.",
        href: "https://github.com/cloudflare",
        status: "watch",
      },
      {
        name: "neondatabase",
        what: "Serverless Postgres. Watch the contributor expansion before the funding announcement.",
        href: "https://github.com/neondatabase",
        status: "watch",
      },
      {
        name: "ollama",
        what: "Local-LLM infrastructure. The merge graph is our best leading indicator for on-device AI.",
        href: "https://github.com/ollama",
        status: "watch",
      },
      {
        name: "exo-explore",
        what: "Distributed inference. New, growing, and reading like a 2026 thesis bet.",
        href: "https://github.com/exo-explore",
        status: "watch",
      },
    ],
  },
  {
    id: "conferences",
    label: "10 conferences whose attendee lists we read",
    intro:
      "Where the orgs we watch on GitHub show up offline. We don't speak (anonymity), we read attendee lists and confirm contributor-graph spikes against in-person social proof.",
    items: [
      {
        name: "Strange Loop",
        what: "Programming-language and infrastructure researchers. (RIP — but its alumni map is gold.)",
        status: "read",
      },
      {
        name: "Hot Chips",
        what: "Where the silicon-side of AI infrastructure shows itself first.",
        status: "read",
      },
      {
        name: "QCon",
        what: "Practitioner conference. Engineering directors of the orgs we track speak here.",
        status: "read",
      },
      {
        name: "PyCon",
        what: "Where the Python data ecosystem's contributor expansion converts to in-person social proof.",
        status: "read",
      },
      {
        name: "OSCON / All Things Open",
        what: "Open-source business models — where commercialisation patterns surface.",
        status: "read",
      },
      {
        name: "RustConf",
        what: "The Rust ecosystem's annual social graph reveal.",
        status: "read",
      },
      {
        name: "DockerCon / KubeCon",
        what: "Containers / orchestration — platform-engineering momentum.",
        status: "read",
      },
      {
        name: "AWS re:Invent",
        what: "AWS-customer announcements — secondary confirmation for cloud-native bets.",
        status: "read",
      },
      {
        name: "GitHub Universe",
        what: "Where the merge-velocity narrative our product is built on gets official.",
        status: "read",
      },
      {
        name: "Y Combinator Demo Day",
        what: "Public alumni list — back-checks against orgs we surfaced from GitHub side.",
        status: "read",
      },
    ],
  },
  {
    id: "books",
    label: "10 books that shaped how we read code",
    intro:
      "The mental models behind the methodology. None are about VC — all are about how engineering, capital, and signal interact.",
    items: [
      {
        name: "Zero to One — Peter Thiel",
        what: "Why the next generation of investments is found in monopoly, not competition.",
        status: "read",
      },
      {
        name: "The Innovator's Dilemma — Clayton Christensen",
        what: "Disruption from below — same shape as a 2× contributor spike from a quiet org.",
        status: "read",
      },
      {
        name: "The Hard Thing About Hard Things — Ben Horowitz",
        what: "Operating reality. The reason engineering signal beats deck signal.",
        status: "read",
      },
      {
        name: "Crossing the Chasm — Geoffrey Moore",
        what: "Where dev-tool early adopters become developer-investor dream customers.",
        status: "read",
      },
      {
        name: "DotCom Secrets — Russell Brunson",
        what: "The funnel architecture this entire site is built around. Reverse-engineered.",
        status: "read",
      },
      {
        name: "Expert Secrets — Russell Brunson",
        what: "The Big Domino, the stack, the closes. Frame for /perfect-webinar.",
        status: "read",
      },
      {
        name: "Traffic Secrets — Russell Brunson",
        what: "Dream 100, where they hide, conversation domination. The frame for this page.",
        status: "read",
      },
      {
        name: "Antifragile — Nassim Taleb",
        what: "Why public, reproducible signal beats private, fragile rolodex.",
        status: "read",
      },
      {
        name: "The Lean Startup — Eric Ries",
        what: "Build-measure-learn — the pattern behind every velocity spike we surface.",
        status: "read",
      },
      {
        name: "Working in Public — Nadia Eghbal",
        what: "How open-source maintainership actually works. The substrate of our entire signal.",
        status: "read",
      },
    ],
  },
  {
    id: "frameworks",
    label: "10 frameworks / agents we integrate with",
    intro:
      "Where the developer-investor already lives. Our MCP server, agent cards, and integration pages live in their tooling, not ours.",
    items: [
      {
        name: "Claude Desktop / Claude Code",
        what: "The MCP-native client our integration was built for first.",
        href: "/install",
        status: "engage",
      },
      {
        name: "Cursor",
        what: "The IDE where the developer-investor reads code daily.",
        href: "/install",
        status: "engage",
      },
      {
        name: "OpenAI ChatGPT GPT",
        what: "VC Deal Flow Signal GPT — Action-mounted to /api/actions.",
        href: "/integrations",
        status: "engage",
      },
      {
        name: "Mastra",
        what: "The TypeScript agent framework for production agents.",
        href: "/for-mastra",
        status: "engage",
      },
      {
        name: "LangChain / LangGraph",
        what: "Python orchestration; we expose tools cleanly into both.",
        href: "/for-langchain",
        status: "engage",
      },
      {
        name: "CrewAI",
        what: "Multi-agent crews; we ship a Crew tool template.",
        href: "/for-crewai",
        status: "engage",
      },
      {
        name: "Letta (MemGPT)",
        what: "Persistent-memory agents. Long-context investor research.",
        href: "/for-letta",
        status: "engage",
      },
      {
        name: "Vercel AI SDK",
        what: "Streaming-first agent framework. Native integration.",
        href: "/for-vercel-ai-sdk",
        status: "engage",
      },
      {
        name: "MCP Registry",
        what: "Where the MCP ecosystem discovers servers.",
        href: "https://github.com/modelcontextprotocol/servers",
        status: "engage",
      },
      {
        name: "Smithery",
        what: "MCP server marketplace. Live listing at smithery.ai/servers/kindrat86/mcp-deal-flow-signal.",
        href: "https://smithery.ai/servers/kindrat86/mcp-deal-flow-signal",
        status: "engage",
      },
    ],
  },
  {
    id: "communities",
    label: "10 communities where the conversation lives",
    intro:
      "Where investors and developers actually talk. We listen, we contribute, we don't dominate. Brunson rule: target conversations, not people.",
    items: [
      {
        name: "r/venturecapital",
        what: "Investor forum. We engage in comment threads, never main posts (auto-mod filters product posts).",
        status: "engage",
        note:
          "Comments-only — automod removes any main post that names a product.",
      },
      {
        name: "r/AngelInvesting",
        what: "Angel-side reality. Developer-investor avatar lives here.",
        status: "engage",
      },
      {
        name: "r/MachineLearning",
        what: "Where ML papers and infrastructure orgs first surface.",
        status: "watch",
      },
      {
        name: "r/ExperiencedDevs",
        what: "Senior-engineer take on the orgs we track from outside.",
        status: "watch",
      },
      {
        name: "Hacker News",
        what: "Where new orgs first get pattern-matched. Slow-burn thread-building.",
        status: "hold",
        note:
          "Account currently blocked from submitting/commenting (2026-05-04). Resolution pending.",
      },
      {
        name: "Indie Hackers",
        what: "Bootstrapper economics — different ladder than VC, same dataset.",
        status: "engage",
      },
      {
        name: "dev.to",
        what: "Long-form developer publishing. Our cross-publication footprint lives here.",
        status: "engage",
      },
      {
        name: "X / Tech Twitter",
        what: "Real-time signal. Read; don't broadcast (anonymity rule).",
        status: "watch",
        note:
          "We post own-product threads only; we never engage personalities directly.",
      },
      {
        name: "Bluesky / Mastodon / Farcaster",
        what: "Federated-side conversation. Three-platform redundancy.",
        status: "engage",
      },
      {
        name: "Substack Notes",
        what: "Cross-newsletter conversation layer. Quoting + counter-quoting.",
        status: "engage",
      },
    ],
  },
  {
    id: "linkedin-pages",
    label: "10 LinkedIn Company Pages on our weekly cadence",
    intro:
      "LinkedIn rule: a Company Page can only reply on other Company Pages' posts. So our Dream-100 layer here is the firms — not the operators. Cadence: 2× / week, 4-comment ceiling, manual posting only.",
    items: [
      {
        name: "Carta",
        what: "Cap-table data — Peter Walker's team posts the strongest startup-data threads on LinkedIn.",
        href: "https://www.linkedin.com/company/carta--inc-/",
        status: "engage",
      },
      {
        name: "Y Combinator",
        what: "Where the alumni list lives. Demo-day cycle drives a content wave we replicate every cohort.",
        href: "https://www.linkedin.com/company/y-combinator/",
        status: "engage",
      },
      {
        name: "Crunchbase",
        what: "Funding-data publishing arm. Pages here post the same trends we'd cite from raw data.",
        href: "https://www.linkedin.com/company/crunchbase/",
        status: "engage",
      },
      {
        name: "AngelList",
        what: "Syndicate / venture cap-table. Their fund-formation posts get developer-investor traffic.",
        href: "https://www.linkedin.com/company/angellist/",
        status: "engage",
      },
      {
        name: "Andreessen Horowitz (a16z)",
        what: "American capital narrative. Page-level posts pull operator attention.",
        href: "https://www.linkedin.com/company/a16z/",
        status: "engage",
      },
      {
        name: "Sequoia Capital",
        what: "Top-tier capital. Long-form essays get cross-posted by the developer-investor.",
        href: "https://www.linkedin.com/company/sequoia-capital/",
        status: "engage",
      },
      {
        name: "Index Ventures",
        what: "Euro-tier mainstay. Engineering-leader fits.",
        href: "https://www.linkedin.com/company/index-ventures/",
        status: "engage",
      },
      {
        name: "Insight Partners",
        what: "Developer-tools concentration. Highest topic-fit for our positioning.",
        href: "https://www.linkedin.com/company/insight-partners/",
        status: "engage",
        note:
          "Insight Partners email engagement (jbash@) on our broadcast list since 2026-05-04.",
      },
      {
        name: "Bessemer Venture Partners",
        what: "Cloud-cred publisher. State of the Cloud reports drive cross-platform threads.",
        href: "https://www.linkedin.com/company/bessemer-venture-partners/",
        status: "engage",
      },
      {
        name: "First Round Capital",
        what: "First Round Review feeds the LI page; engineering-ops content reads our way.",
        href: "https://www.linkedin.com/company/first-round-capital/",
        status: "engage",
      },
    ],
  },
  {
    id: "datasets",
    label: "10 public datasets we cross-reference",
    intro:
      "Where we triangulate the signal. Every public dataset is a reproducibility check on the next prediction.",
    items: [
      {
        name: "GitHub REST + GraphQL",
        what: "The primary substrate. Commit velocity, contributor count, repo events.",
        status: "read",
      },
      {
        name: "GH Archive",
        what: "Historical event log. Where we backfill the panel beyond the live API window.",
        status: "read",
      },
      {
        name: "Crunchbase open data",
        what: "Funding-event ground truth. The labels on our predictions.",
        status: "read",
      },
      {
        name: "PitchBook (selected free)",
        what: "Funding cadence by stage. Used as a sanity check, never the source.",
        status: "read",
      },
      {
        name: "Common Crawl",
        what: "Public web. Used to detect marketing-site shifts (Notion → Next.js).",
        status: "read",
      },
      {
        name: "Stack Overflow Trends",
        what: "Language adoption curves. Confirmation lens on tooling theses.",
        status: "read",
      },
      {
        name: "Hacker News Algolia",
        what: "Pattern-match against historical Show HN threads.",
        status: "read",
      },
      {
        name: "PyPI / npm download stats",
        what: "Package adoption. Usage-side confirmation of GitHub-side velocity.",
        status: "read",
      },
      {
        name: "Zenodo",
        what: "Where our SSRN dataset is mirrored. CC BY 4.0. Reproducible by anyone.",
        href: "https://zenodo.org",
        status: "engage",
        note: "We publish our dataset here — not just consumers.",
      },
      {
        name: "Our SSRN paper (n=219)",
        what: "ssrn.com/abstract=6606558. The methodology that grounds every prediction.",
        href: "https://ssrn.com/abstract=6606558",
        status: "engage",
      },
    ],
  },
];

export const DREAM_100_TOTAL = DREAM_100_GROUPS.reduce(
  (n, g) => n + g.items.length,
  0,
);

export function dream100StatusCounts(): Record<Dream100Status, number> {
  const counts: Record<Dream100Status, number> = {
    engage: 0,
    watch: 0,
    hold: 0,
    read: 0,
    blocked: 0,
  };
  for (const g of DREAM_100_GROUPS) {
    for (const v of g.items) counts[v.status]++;
  }
  return counts;
}
