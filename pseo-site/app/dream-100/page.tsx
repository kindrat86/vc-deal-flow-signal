import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Dream 100 — voices we read on the engineering-signal frontier",
  description:
    "100 public voices, publications, and communities we follow to keep the GitHub-momentum signal honest: 10 substacks, 10 podcasts, 10 newsletters, 10 GitHub orgs, 10 conferences, 10 books, 10 frameworks, 10 communities, 10 tools, 10 datasets. The Brunson Dream 100, applied to the developer-investor.",
  alternates: { canonical: "/dream-100" },
  openGraph: {
    title: "Dream 100 — voices we read",
    description:
      "The 100 public voices we read to keep the GitHub-momentum signal honest. The Brunson Dream 100 for the developer-investor.",
    url: "https://signals.gitdealflow.com/dream-100",
    type: "article",
  },
};

type Voice = { name: string; what: string; href?: string };
type Group = { id: string; label: string; intro: string; items: Voice[] };

const GROUPS: Group[] = [
  {
    id: "substacks",
    label: "10 substacks we read",
    intro:
      "Long-form weekly that taught us to think about software, scale, and product the way the developer-investor reads code.",
    items: [
      { name: "Lenny's Newsletter", what: "Product, growth, hiring — the discipline of going from PMF to ARR.", href: "https://www.lennysnewsletter.com" },
      { name: "The Pragmatic Engineer", what: "Engineering-org reality at scale. Rare honest reporting from inside Big Tech.", href: "https://blog.pragmaticengineer.com" },
      { name: "Stratechery", what: "Strategy, aggregation theory, platform dynamics. Required reading on every software business.", href: "https://stratechery.com" },
      { name: "Not Boring", what: "Capital narratives. The why-now of category creation, told as story.", href: "https://www.notboring.co" },
      { name: "Software Lead Weekly", what: "What engineering leaders read each week. Hiring, comp, architecture.", href: "https://softwareleadweekly.com" },
      { name: "Last Week in AWS", what: "Cloud economics with a sharp tongue. The gold standard for vendor scepticism.", href: "https://www.lastweekinaws.com" },
      { name: "Construction Physics", what: "Why software is eating slower-moving industries — and what doesn't translate.", href: "https://www.construction-physics.com" },
      { name: "The Generalist", what: "Deep dives on the funds, founders, and frameworks shaping the next cycle.", href: "https://www.generalist.com" },
      { name: "Bits about Money", what: "How financial systems actually work — read it before you build a fintech thesis.", href: "https://www.bitsaboutmoney.com" },
      { name: "ben thompson's morning brief", what: "Daily aggregation theory delivered before the market opens.", href: "https://stratechery.com" },
    ],
  },
  {
    id: "podcasts",
    label: "10 podcasts we listen to",
    intro:
      "We don't run a podcast (anonymity rule), but we listen. These are the conversations that move our priors quarterly.",
    items: [
      { name: "Acquired", what: "Three-hour deep dives on the companies that built the modern stack." },
      { name: "Invest Like the Best", what: "Patrick O'Shaughnessy's investor roster. Where mental models compound." },
      { name: "20VC", what: "Harry Stebbings on the operators behind the cap tables." },
      { name: "Founders", what: "David Senra's biographical series — the stories that shaped great founders." },
      { name: "Lenny's Podcast", what: "PMF, growth, leadership — the audio companion to the newsletter." },
      { name: "The Logan Bartlett Show", what: "Sharp questions, candid answers from operators and allocators." },
      { name: "BG2 Pod", what: "Brad Gerstner + Bill Gurley on the macro narrative behind the next decade." },
      { name: "Stratechery Daily", what: "Ben Thompson's audio deep-dive on the day's strategic story." },
      { name: "Practical AI", what: "Engineering-side AI: tools, frameworks, real implementations." },
      { name: "The Rest is History", what: "Long horizons. The pattern memory that prevents quarterly recency bias." },
    ],
  },
  {
    id: "newsletters",
    label: "10 newsletters we filter through",
    intro:
      "High-density daily / weekly aggregators. Where new GitHub orgs, hiring waves, and infrastructure shifts surface before the press cycle.",
    items: [
      { name: "TLDR Tech", what: "Daily 5-minute summary of the technical web.", href: "https://tldr.tech" },
      { name: "ByteByteGo", what: "Architecture diagrams of the systems behind the products.", href: "https://blog.bytebytego.com" },
      { name: "Console.dev", what: "Curated developer tools. Where the dev-tool ecosystem first shows itself.", href: "https://console.dev" },
      { name: "Devtools.fyi", what: "Independent reviews of the next-gen dev-tool layer." },
      { name: "Hacker Newsletter", what: "Weekly digest of the best HN threads. Catches what the daily firehose misses." },
      { name: "DBOS / This Week in PostgreSQL", what: "Database-layer momentum, where infrastructure investments compound." },
      { name: "Refind", what: "AI-curated reading list trained on our category." },
      { name: "Devops'ish", what: "Observability, platform engineering, infrastructure-as-code patterns." },
      { name: "Frontend Focus", what: "Where the React / Vue / Svelte ecosystems actually land." },
      { name: "Mind the Product", what: "The PM frame on the products we're tracking from the engineering side." },
    ],
  },
  {
    id: "github-orgs",
    label: "10 GitHub orgs we watch the most",
    intro:
      "The orgs whose merge cadence, contributor graph, and release notes set the meta for the developer-investor's attention surface. Public profiles only.",
    items: [
      { name: "vercel", what: "Frontend-deployment platform — the meta-layer behind half our dataset's React orgs.", href: "https://github.com/vercel" },
      { name: "supabase", what: "Open-source Firebase. Pattern-defining for the BaaS ascension category.", href: "https://github.com/supabase" },
      { name: "huggingface", what: "Open-source AI infrastructure. Their merge graph is an industry leading indicator.", href: "https://github.com/huggingface" },
      { name: "anthropic", what: "Where Claude / MCP land. Public-side of frontier-model tooling.", href: "https://github.com/anthropics" },
      { name: "openai", what: "API-side public repos. The shape of the assistants ecosystem moves through here.", href: "https://github.com/openai" },
      { name: "modelcontextprotocol", what: "MCP — the integration substrate underneath agent tooling.", href: "https://github.com/modelcontextprotocol" },
      { name: "cloudflare", what: "Edge / workers / D1 — the platform layer behind the next-gen serverless wave.", href: "https://github.com/cloudflare" },
      { name: "neondatabase", what: "Serverless Postgres. Watch the contributor expansion before the funding announcement.", href: "https://github.com/neondatabase" },
      { name: "ollama", what: "Local-LLM infrastructure. The merge graph is our best leading indicator for on-device AI.", href: "https://github.com/ollama" },
      { name: "exo-explore", what: "Distributed inference. New, growing, and reading like a 2026 thesis bet.", href: "https://github.com/exo-explore" },
    ],
  },
  {
    id: "conferences",
    label: "10 conferences whose attendee lists we read",
    intro:
      "Where the orgs we watch on GitHub show up offline. Useful as a secondary confirmation when commit velocity spikes.",
    items: [
      { name: "Strange Loop", what: "Programming-language and infrastructure researchers. (RIP — but its alumni map is gold.)" },
      { name: "Hot Chips", what: "Where the silicon-side of AI infrastructure shows itself first." },
      { name: "QCon", what: "Practitioner conference. Engineering directors of the orgs we track speak here." },
      { name: "PyCon", what: "Where the Python data ecosystem's contributor expansion converts to in-person social proof." },
      { name: "OSCON / All Things Open", what: "Open-source business models — where commercialisation patterns surface." },
      { name: "RustConf", what: "The Rust ecosystem's annual social graph reveal." },
      { name: "DockerCon / KubeCon", what: "Containers / orchestration — platform-engineering momentum." },
      { name: "AWS re:Invent", what: "AWS-customer announcements — secondary confirmation for cloud-native bets." },
      { name: "GitHub Universe", what: "Where the merge-velocity narrative our product is built on gets official." },
      { name: "Y Combinator Demo Day", what: "Public alumni list — back-checks against orgs we surfaced from GitHub side." },
    ],
  },
  {
    id: "books",
    label: "10 books that shaped how we read code",
    intro:
      "The mental models behind the methodology. None are about VC — all are about how engineering, capital, and signal interact.",
    items: [
      { name: "Zero to One — Peter Thiel", what: "Why the next generation of investments is found in monopoly, not competition." },
      { name: "The Innovator's Dilemma — Clayton Christensen", what: "Disruption from below — same shape as a 2× contributor spike from a quiet org." },
      { name: "The Hard Thing About Hard Things — Ben Horowitz", what: "Operating reality. The reason engineering signal beats deck signal." },
      { name: "Crossing the Chasm — Geoffrey Moore", what: "Where dev-tool early adopters become developer-investor dream customers." },
      { name: "DotCom Secrets — Russell Brunson", what: "The funnel architecture this entire site is built around. Reverse-engineered." },
      { name: "Expert Secrets — Russell Brunson", what: "The Big Domino, the stack, the closes. Frame for `/perfect-webinar`." },
      { name: "Traffic Secrets — Russell Brunson", what: "Dream 100, where they hide, conversation domination. The frame for this page." },
      { name: "Antifragile — Nassim Taleb", what: "Why public, reproducible signal beats private, fragile rolodex." },
      { name: "The Lean Startup — Eric Ries", what: "Build-measure-learn — the pattern behind every velocity spike we surface." },
      { name: "Working in Public — Nadia Eghbal", what: "How open-source maintainership actually works. The substrate of our entire signal." },
    ],
  },
  {
    id: "frameworks",
    label: "10 frameworks / agents we integrate with",
    intro:
      "Where the developer-investor already lives. Our MCP server, agent cards, and integration pages live in their tooling, not ours.",
    items: [
      { name: "Claude Desktop / Claude Code", what: "The MCP-native client our integration was built for first.", href: "/install" },
      { name: "Cursor", what: "The IDE where the developer-investor reads code daily.", href: "/install" },
      { name: "OpenAI ChatGPT GPT", what: "VC Deal Flow Signal GPT — Action-mounted to /api/actions.", href: "/integrations" },
      { name: "Mastra", what: "The TypeScript agent framework for production agents.", href: "/for-mastra" },
      { name: "LangChain / LangGraph", what: "Python orchestration; we expose tools cleanly into both.", href: "/for-langchain" },
      { name: "CrewAI", what: "Multi-agent crews; we ship a Crew tool template.", href: "/for-crewai" },
      { name: "Letta (MemGPT)", what: "Persistent-memory agents. Long-context investor research.", href: "/for-letta" },
      { name: "Vercel AI SDK", what: "Streaming-first agent framework. Native integration.", href: "/for-vercel-ai-sdk" },
      { name: "MCP Registry", what: "Where the MCP ecosystem discovers servers.", href: "https://github.com/modelcontextprotocol/servers" },
      { name: "npm @gitdealflow/mcp-signal", what: "The package itself.", href: "https://www.npmjs.com/package/@gitdealflow/mcp-signal" },
    ],
  },
  {
    id: "communities",
    label: "10 communities where the conversation lives",
    intro:
      "Where investors and developers actually talk. We listen, we contribute, we don't dominate. Brunson rule: target conversations, not people.",
    items: [
      { name: "r/venturecapital", what: "Investor forum. We engage in comment threads, never main posts (auto-mod)." },
      { name: "r/AngelInvesting", what: "Angel-side reality. Developer-investor avatar lives here." },
      { name: "r/MachineLearning", what: "Where ML papers and infrastructure orgs first surface." },
      { name: "r/ExperiencedDevs", what: "Senior-engineer take on the orgs we track from outside." },
      { name: "Hacker News", what: "Where new orgs first get pattern-matched. Slow-burn thread-building." },
      { name: "Indie Hackers", what: "Bootstrapper economics — different ladder than VC, same dataset." },
      { name: "dev.to", what: "Long-form developer publishing. Our cross-publication footprint lives here." },
      { name: "X / Tech Twitter", what: "Real-time signal. Read; don't broadcast (anonymity rule)." },
      { name: "Bluesky / Mastodon / Farcaster", what: "Federated-side conversation. Three-platform redundancy." },
      { name: "Substack Notes", what: "Cross-newsletter conversation layer. Quoting + counter-quoting." },
    ],
  },
  {
    id: "tools",
    label: "10 tools that sit on our desk",
    intro:
      "What we use to build, ship, and read the signal. The same tools the developer-investor already pays for.",
    items: [
      { name: "GitHub", what: "The substrate. Our entire signal is read against the public REST + GraphQL APIs." },
      { name: "Vercel", what: "Where this site, the dashboard, and the API ship from." },
      { name: "Cloudflare", what: "Edge, R2, Workers. The runtime layer for the public-data pipeline." },
      { name: "Stripe", what: "Payments, the source of truth for the value-ladder ascension data." },
      { name: "Resend / Zoho", what: "Transactional + warmed cold outreach. Two senders, two reputations." },
      { name: "PostHog (EU)", what: "Privacy-respecting product analytics. Where we measure the funnel." },
      { name: "Substack", what: "Mirror publication. Newsletter-side audience capture." },
      { name: "PocketBase", what: "Local source of truth. Subscriber DB lives here, not in a vendor." },
      { name: "Linear", what: "Engineering-side roadmap. The signal of our own velocity." },
      { name: "Claude / Cursor", what: "The two AI clients we use to read the signal back to ourselves daily." },
    ],
  },
  {
    id: "datasets",
    label: "10 public datasets we cross-reference",
    intro:
      "Where we triangulate the signal. Every public dataset is a reproducibility check on the next prediction.",
    items: [
      { name: "GitHub REST + GraphQL", what: "The primary substrate. Commit velocity, contributor count, repo events." },
      { name: "GH Archive", what: "Historical event log. Where we backfill the panel beyond the live API window." },
      { name: "Crunchbase open data", what: "Funding-event ground truth. The labels on our predictions." },
      { name: "PitchBook (selected free)", what: "Funding cadence by stage. Used as a sanity check, never the source." },
      { name: "Common Crawl", what: "Public web. Used to detect marketing-site shifts (Notion → Next.js)." },
      { name: "Stack Overflow Trends", what: "Language adoption curves. Confirmation lens on tooling theses." },
      { name: "Hacker News Algolia", what: "Pattern-match against historical Show HN threads." },
      { name: "PyPI / npm download stats", what: "Package adoption. Usage-side confirmation of GitHub-side velocity." },
      { name: "Zenodo", what: "Where our SSRN dataset is mirrored. CC BY 4.0. Reproducible by anyone." },
      { name: "Our own SSRN paper (n=219)", what: "ssrn.com/abstract=6606558. The methodology that grounds every prediction." },
    ],
  },
];

export default function Dream100Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/dream-100",
        name: "Dream 100 — voices we read",
        description:
          "100 public voices, publications, and communities the GitDealFlow team reads to keep the GitHub-momentum signal honest. The Brunson Dream 100, applied to the developer-investor.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Dream 100", item: "https://signals.gitdealflow.com/dream-100" },
        ],
      },
      {
        "@type": "ItemList",
        name: "Dream 100 — voices we read",
        numberOfItems: 100,
        itemListElement: GROUPS.flatMap((g, gi) =>
          g.items.map((v, vi) => ({
            "@type": "ListItem",
            position: gi * 10 + vi + 1,
            name: v.name,
          }))
        ),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/dream-100"
        languages={getHreflangLanguages("/dream-100")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/dream-100" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Dream 100</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Traffic Secrets, Section 1, Chapter 5 · Applied
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            The Dream 100 — voices we read on the{" "}
            <span className="text-sky-400">engineering-signal frontier</span>.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Brunson&rsquo;s rule: pick the 100 people whose audience already
            contains your dream customer. Don&rsquo;t pitch them — show up
            where they are, contribute, and let the signal compound.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            For us the dream customer is the{" "}
            <Link href="/about/founder" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
              developer-investor
            </Link>{" "}
            — the engineer who reads commit logs for fun and writes
            €5k–€50k checks on the side. These are the 100 public voices that
            shape the way we read engineering signal, the way we build product,
            and the way we make Monday-morning calls.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            Anonymity rule: every voice on this list is a public publication,
            org, or community. We don&rsquo;t name the individual founders we
            track inside our paid product — that&rsquo;s the buyer&rsquo;s
            edge, not ours to publish.
          </p>
        </header>

        <nav
          aria-label="Sections"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
        >
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-3">
            10 categories · 100 voices · jump to:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="block px-3 py-1.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-sky-300 hover:text-sky-200 transition-colors"
                >
                  {g.label.split(" ").slice(2).join(" ") || g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {GROUPS.map((g) => (
          <section
            key={g.id}
            id={g.id}
            className="space-y-4 scroll-mt-20"
            aria-label={g.label}
          >
            <header className="space-y-2 border-l-4 border-sky-600 pl-5">
              <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                {g.label.split(" ").slice(0, 2).join(" ")}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
                {g.label}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {g.intro}
              </p>
            </header>
            <ol className="space-y-3" start={1}>
              {g.items.map((v, i) => (
                <li
                  key={`${g.id}-${i}`}
                  className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4"
                >
                  <span className="text-sky-500 font-bold tabular-nums shrink-0 w-6 text-right">
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-gray-100 font-semibold text-sm">
                      {v.href ? (
                        v.href.startsWith("/") ? (
                          <Link
                            href={v.href}
                            className="hover:text-sky-300 underline decoration-dotted"
                          >
                            {v.name}
                          </Link>
                        ) : (
                          <a
                            href={v.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-sky-300 underline decoration-dotted"
                          >
                            {v.name}
                          </a>
                        )
                      ) : (
                        v.name
                      )}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {v.what}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            How to use this list
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            If three of these voices pattern-match to you, you&rsquo;re our
            dream customer.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            We didn&rsquo;t make this page for SEO. We made it because every
            week one developer-investor emails us asking which substacks we
            read, which podcasts we listen to, which datasets we trust. This
            is the answer in one place. If you read three of these regularly,
            the{" "}
            <Link
              href="https://gitdealflow.com/#signup"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
            >
              free Acceleration Watch
            </Link>{" "}
            is built around your reading habits — same density, same priors,
            same Monday rhythm.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the free Acceleration Watch →
            </a>
            <Link
              href="/distribution"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Where we publish (the other side of the map) →
            </Link>
          </div>
        </section>

        <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-6">
          The Dream 100 is a teaching from{" "}
          <em>Traffic Secrets</em> by Russell Brunson (2020). Used here under
          fair-use commentary. Not affiliated with ClickFunnels or Russell.
          The full audit of how this site reverse-engineers the trilogy is on{" "}
          <Link
            href="/funnels"
            className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
          >
            /funnels
          </Link>
          .
        </p>
      </div>
    </>
  );
}
