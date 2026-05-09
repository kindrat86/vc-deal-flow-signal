import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Where to find us — every channel, mirror, and feed",
  description:
    "GitDealFlow on the open web: Substack, dev.to, RSS, MCP, npm, GitHub, Bluesky, Mastodon, Farcaster, ChatGPT GPT Store, SSRN, Zenodo, agents.json, OpenAPI, llms.txt. The full distribution map for the developer-investor.",
  alternates: { canonical: "/distribution" },
  openGraph: {
    title: "Where to find us — distribution map",
    description:
      "Every public surface where GitDealFlow's signal shows up: newsletter, RSS, MCP, agent mirrors, federated social, academic, agents.json. The map.",
    url: "https://signals.gitdealflow.com/distribution",
    type: "article",
  },
};

type Channel = {
  name: string;
  what: string;
  href: string;
  external?: boolean;
  cadence?: string;
};

type Group = {
  id: string;
  label: string;
  intro: string;
  channels: Channel[];
};

const GROUPS: Group[] = [
  {
    id: "primary",
    label: "Primary surfaces",
    intro: "The two pages most readers find us on first.",
    channels: [
      {
        name: "signals.gitdealflow.com",
        what: "The product site — pricing, dashboard, dataset, methodology, MCP install, all 1,060+ pSEO pages.",
        href: "https://signals.gitdealflow.com",
        external: true,
      },
      {
        name: "gitdealflow.com",
        what: "The apex landing — Acceleration Watch signup, First Look Pass, Sector Sweep, daily-data sweep.",
        href: "https://gitdealflow.com",
        external: true,
      },
    ],
  },
  {
    id: "newsletters",
    label: "Newsletters & long-form",
    intro:
      "Where we publish text. Substack mirrors the Top-100 list weekly; dev.to is our long-form essay home; the apex blog ships the founder-voice posts.",
    channels: [
      {
        name: "Free Acceleration Watch",
        what: "Five names every Monday. Sector-tagged, with chart + percentile + decision rule. The free tier of the value ladder.",
        href: "https://gitdealflow.com/#signup",
        cadence: "Weekly · Mon 09:00 UTC",
        external: true,
      },
      {
        name: "Substack — gitdealflow",
        what: "Mirror of the weekly Top-100 startups list and the Acceleration Watch. Free publication, canonical back to signals.gitdealflow.com.",
        href: "https://gitdealflow.substack.com",
        cadence: "Weekly · Sunday 12:00 UTC",
        external: true,
      },
      {
        name: "dev.to — @gitdealflow",
        what: "Long-form engineering-side essays. Where the methodology gets explained, not pitched.",
        href: "https://dev.to/gitdealflow",
        cadence: "Bi-weekly",
        external: true,
      },
      {
        name: "Blog (signals.gitdealflow.com/blog)",
        what: "Founder-voice posts and methodology updates. RSS-discoverable.",
        href: "/blog",
        cadence: "Bi-weekly",
      },
    ],
  },
  {
    id: "feeds",
    label: "Machine-readable feeds",
    intro:
      "Every public surface has an agent-side mirror. If you want our signal in your pipeline instead of your inbox, here is the full URL set.",
    channels: [
      { name: "RSS — feed.xml", what: "Atom 1.0 feed of every blog post + Acceleration Watch entry.", href: "/feed.xml" },
      { name: "JSON Feed — feed.json", what: "JSON Feed 1.1 mirror of the same content. Use whichever your tooling prefers.", href: "/feed.json" },
      { name: "News sitemap — news-sitemap.xml", what: "Google News–compatible sitemap of recent posts.", href: "/news-sitemap.xml" },
      { name: "OpenAPI — /api/actions/openapi.json", what: "12-endpoint OpenAPI 3.1 spec. Powers the ChatGPT GPT, agent integrations, and the agent-card.", href: "/api/actions/openapi.json" },
      { name: "llms.txt", what: "Standardised LLM-instruction surface — every page agent-readable in markdown.", href: "/llms.txt" },
      { name: "llms-full.txt", what: "Full corpus dump for embedding pipelines. ~1.4MB.", href: "/llms-full.txt" },
      { name: "agents.json", what: "Agent-card discovery. Capabilities, tools, schema versions.", href: "/agents.json" },
      { name: "agent-card (.well-known)", what: "RFC-style well-known endpoint advertising agent capabilities.", href: "/.well-known/agent-card.json" },
      { name: "Sitemap index", what: "Master sitemap. 1,060+ URLs across 12 hreflang locales.", href: "/sitemap.xml" },
      { name: "Q&A corpus — qa.jsonl", what: "Categorisable Q&A dump for embedding-pipeline answers.", href: "/qa.jsonl" },
    ],
  },
  {
    id: "mcp",
    label: "MCP & developer integrations",
    intro:
      "The agent-native surface. Eight tools. Free forever (the five core tools — see memory rule). Drop into Claude Desktop, Cursor, or any MCP-compatible client.",
    channels: [
      { name: "npm — @gitdealflow/mcp-signal", what: "The official MCP server. Install with one line: npx @gitdealflow/mcp-signal.", href: "https://www.npmjs.com/package/@gitdealflow/mcp-signal", external: true },
      { name: "GitHub — gitdealflow", what: "Source code, issue tracker, public roadmap.", href: "https://github.com/gitdealflow", external: true },
      { name: "Install instructions", what: "Step-by-step for Claude / Cursor / Mastra / LangChain / CrewAI / Letta / Vercel AI SDK.", href: "/install" },
      { name: "MCP Demo", what: "Live demonstration page. Watch the tools fire against real data.", href: "/mcp-demo" },
      { name: "OpenAPI viewer", what: "Browseable API documentation, agent-friendly.", href: "/api/actions/openapi.json" },
      { name: "ChatGPT GPT — VC Deal Flow Signal", what: "OpenAPI-mounted GPT in the GPT Store. Action calls /api/actions endpoints.", href: "https://chat.openai.com/g/g-vc-deal-flow-signal", external: true },
    ],
  },
  {
    id: "social",
    label: "Federated social (decentralised redundancy)",
    intro:
      "Three federated networks. Posts cross-mirror via WebSub + ActivityPub-side bridges. Anonymity rule: company-page identity only.",
    channels: [
      { name: "Bluesky — gitdealflow.bsky.social", what: "AT Protocol social. Custom feed-generator + label service. Posts mirror the Acceleration Watch.", href: "https://bsky.app/profile/gitdealflow.bsky.social", external: true },
      { name: "Mastodon — fosstodon.org/@gitdealflow", what: "ActivityPub. The fediverse-native distribution layer.", href: "https://fosstodon.org/@gitdealflow", external: true },
      { name: "Farcaster — gitdealflow", what: "On-chain social via Neynar. Where the crypto-native developer-investor reads.", href: "https://warpcast.com/gitdealflow", external: true },
      { name: "LinkedIn — GitDealFlow Company", what: "Company page (no founder personal account, anonymity rule). Long-form essays + top-100 engagement.", href: "https://www.linkedin.com/company/gitdealflow", external: true },
    ],
  },
  {
    id: "communities",
    label: "Community channels",
    intro:
      "Where conversation happens. We engage in comment threads — never main posts on subs that auto-remove product content (see r/venturecapital).",
    channels: [
      { name: "Reddit — u/gitdealflow", what: "Comment-side engagement on AEO-relevant threads. Never a main post on r/venturecapital.", href: "https://www.reddit.com/user/gitdealflow", external: true },
      { name: "Indie Hackers — gitdealflow", what: "Build-in-public surface. Bootstrapped-side audience.", href: "https://www.indiehackers.com/gitdealflow", external: true },
      { name: "Product Hunt — gitdealflow", what: "Launch artifact. Live with the post-launch comment ladder strategy.", href: "https://www.producthunt.com/@gitdealflow", external: true },
      { name: "AlternativeTo", what: "Top-of-funnel for the buyer comparing dev-tool ecosystems.", href: "https://alternativeto.net/software/gitdealflow", external: true },
      { name: "SaaSHub", what: "Cross-listing surface for SaaS comparison.", href: "https://www.saashub.com/gitdealflow", external: true },
    ],
  },
  {
    id: "academic",
    label: "Academic & reproducibility surfaces",
    intro:
      "What makes the signal honest. Every prediction is reproducible against the SSRN paper + Zenodo dataset.",
    channels: [
      { name: "SSRN paper — abstract=6606558", what: "Methodology paper. n=219 paired observations, lead-time 21–47 days IQR. The grounding citation for every claim on the site.", href: "https://ssrn.com/abstract=6606558", external: true },
      { name: "Zenodo dataset", what: "CC BY 4.0. Reproducible. The exact data behind the regression in the SSRN paper.", href: "https://zenodo.org/records/gitdealflow-dataset", external: true },
      { name: "Methodology page", what: "Plain-English walkthrough of the regression, the panel construction, and the false-positive controls.", href: "/methodology" },
      { name: "Citation guide", what: "BibTeX, APA, Chicago. For academic / industry-report citations.", href: "/citation-guide" },
      { name: "Reproducibility page", what: "Step-by-step: clone the dataset, run the notebook, replicate the regression.", href: "/reproducibility" },
      { name: "Dataset (live)", what: "Current panel. CSV + JSON. The buyer's edge.", href: "/dataset" },
    ],
  },
  {
    id: "agent-mirrors",
    label: "Agent-side mirrors (one per page)",
    intro:
      "Every public page has a markdown mirror at /md/<path>, plus inline AgentMirrorLinks discoverability headers. Built for retrieval pipelines.",
    channels: [
      { name: "Markdown mirror — /md/<path>", what: "Plain-text-friendly version of every public page. Drop into RAG without re-parsing HTML.", href: "/md/" },
      { name: "Knowledge graph — knowledge-graph.json", what: "Entity graph of products, sectors, predictions, dates. JSON-LD-compatible.", href: "/knowledge-graph.json" },
      { name: "AI corpus — ai.json", what: "Categorised content for AI training / retrieval. JSON Feed format.", href: "/ai.json" },
      { name: "ai.txt", what: "Standardised AI-bot policy + sitemap pointer.", href: "/ai.txt" },
      { name: "Compliance manifest — compliance.json", what: "Privacy, anonymisation, and reproducibility manifest. Public.", href: "/compliance.json" },
      { name: "Model manifest — model.json", what: "Schema versions, training-data cutoffs, methodology revision IDs.", href: "/model.json" },
    ],
  },
];

export default function DistributionPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/distribution",
        name: "Where to find us — distribution map",
        description:
          "Every public surface where GitDealFlow's signal shows up: Substack, dev.to, RSS, MCP, npm, GitHub, federated social, academic, agent-side mirrors.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Distribution", item: "https://signals.gitdealflow.com/distribution" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/distribution"
        languages={getHreflangLanguages("/distribution")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/distribution" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Distribution</span>
          </nav>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Where they&rsquo;re hiding · Applied
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Where to find us. <span className="text-emerald-400">Every channel, every mirror.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Your reader can&rsquo;t follow you on a channel they don&rsquo;t
            know exists. So here&rsquo;s the full map — every public surface
            where the GitDealFlow signal shows up, grouped by what you&rsquo;re
            trying to do.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            First — <a href="#hiding" className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted">where they&rsquo;re hiding</a>: the literal 10 forums, 10 substacks, and 10 GitHub orgs the developer-investor reads. Then: the eight surface groups we mirror to so we show up on each of them.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            If you&rsquo;re building a portfolio agent, every machine-readable
            feed lives in <a href="#feeds" className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted">Machine-readable feeds</a>. If
            you&rsquo;re reading on the federated web,{" "}
            <a href="#social" className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted">Federated social</a> covers Bluesky / Mastodon /
            Farcaster. If you want the methodology, jump to{" "}
            <a href="#academic" className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted">Academic & reproducibility</a>.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Want to see <em className="text-gray-200 not-italic">how</em> the
            same product story gets re-framed for each surface? Twelve openers,
            one signal:{" "}
            <Link
              href="/distribution/platform-hooks"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              /distribution/platform-hooks
            </Link>{" "}
            documents the per-platform variants — Twitter / Reddit / Hacker
            News / dev.to / Hashnode / Discord / LinkedIn / Email / AngelList
            / Product Hunt / Indie Hackers / Telegram.
          </p>
        </header>

        <section
          id="hiding"
          aria-label="Where the developer-investor is hiding"
          className="rounded-xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 scroll-mt-20"
        >
          <div className="space-y-3">
            <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              The secret formula · Step 2: where are they hiding
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              Where the developer-investor is hiding.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Start by naming the dream customer, then ask <em>where they
              congregate</em>. Our dream customer is the developer-investor —
              someone writing €5k–€50k checks who reads commit logs for fun.
              Below is the literal map: the 10 forums they browse, the 10
              substacks they read, and the 10 GitHub orgs they watch. Every
              surface group further down the page is a mirror we&rsquo;ve
              built to show up wherever they already are.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="space-y-2 rounded-lg border border-emerald-900/40 bg-slate-950/50 p-4">
              <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">
                10 forums
              </h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Where the comment threads are alive — engagement-side targets.
              </p>
              <ol className="text-gray-300 text-sm leading-relaxed space-y-1 list-decimal list-inside marker:text-emerald-500">
                <li>Hacker News</li>
                <li>Lobste.rs</li>
                <li>r/venturecapital</li>
                <li>r/SaaS</li>
                <li>r/startups</li>
                <li>r/AngelInvesting</li>
                <li>r/ExperiencedDevs</li>
                <li>Indie Hackers</li>
                <li>Product Hunt Discussions</li>
                <li>Tildes.net</li>
              </ol>
            </div>

            <div className="space-y-2 rounded-lg border border-emerald-900/40 bg-slate-950/50 p-4">
              <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">
                10 substacks
              </h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Where the long-form reading happens — top-100 mirror targets.
              </p>
              <ol className="text-gray-300 text-sm leading-relaxed space-y-1 list-decimal list-inside marker:text-emerald-500">
                <li>The Pragmatic Engineer — Gergely Orosz</li>
                <li>Lenny&rsquo;s Newsletter — Lenny Rachitsky</li>
                <li>Not Boring — Packy McCormick</li>
                <li>The Diff — Byrne Hobart</li>
                <li>Stratechery — Ben Thompson</li>
                <li>Newcomer — Eric Newcomer</li>
                <li>SemiAnalysis — Dylan Patel</li>
                <li>The Generalist — Mario Gabriele</li>
                <li>Refactoring — Luca Rossi</li>
                <li>Tomasz Tunguz — Theory Ventures</li>
              </ol>
            </div>

            <div className="space-y-2 rounded-lg border border-emerald-900/40 bg-slate-950/50 p-4">
              <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">
                10 GitHub orgs
              </h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Where the commit logs they read for fun ship from — bait-drop adjacency.
              </p>
              <ol className="text-gray-300 text-sm leading-relaxed space-y-1 list-decimal list-inside marker:text-emerald-500">
                <li>vercel</li>
                <li>anthropics</li>
                <li>openai</li>
                <li>supabase</li>
                <li>langchain-ai</li>
                <li>modelcontextprotocol</li>
                <li>clerk</li>
                <li>triggerdotdev</li>
                <li>resend</li>
                <li>neondatabase</li>
              </ol>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed border-t border-emerald-900/40 pt-4">
            Bait per surface differs — a Lobste.rs methodology drop, a
            Substack Acceleration Watch, an MCP install on the Cursor feed,
            a /predicted citation in a Pragmatic Engineer reply — but every
            path lands on the same SSRN paper{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              (abstract=6606558)
            </a>
            , the same{" "}
            <Link
              href="/predicted"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              /predicted dashboard
            </Link>
            , and the same 30-day Signal-or-It&rsquo;s-Free guarantee.
            That&rsquo;s the result.
          </p>
        </section>

        <nav
          aria-label="Sections"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
        >
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            8 groups · jump to:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="block px-3 py-1.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  {g.label}
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
            <header className="space-y-2 border-l-4 border-emerald-600 pl-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
                {g.label}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {g.intro}
              </p>
            </header>
            <ul className="space-y-3">
              {g.channels.map((c) => (
                <li
                  key={c.href}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 sm:p-5 space-y-1.5"
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    {c.external ? (
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-300 hover:text-emerald-200 font-semibold text-base underline decoration-dotted"
                      >
                        {c.name}
                      </a>
                    ) : (
                      <Link
                        href={c.href}
                        className="text-emerald-300 hover:text-emerald-200 font-semibold text-base underline decoration-dotted"
                      >
                        {c.name}
                      </Link>
                    )}
                    {c.cadence && (
                      <span className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">
                        {c.cadence}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {c.what}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Publishing where the buyer already is
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Why we&rsquo;re on this many surfaces.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Every reader has a different home, and you have to show up on
            theirs, not yours. We do that on principle: the dev.to reader,
            the Substack reader, the Bluesky reader, and the Claude Desktop
            reader all have the same right to the signal.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The distribution half. The honest half: every surface mirrors
            the same canonical data, with the same SSRN-grounded methodology,
            with the same 30-day Signal-or-It&rsquo;s-Free guarantee. We
            don&rsquo;t change the message per channel — we change the medium.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/target-list"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Top 100 (the other side of the map) →
            </Link>
            <Link
              href="/funnels"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Funnel Hub →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Distribution mapped from direct-response sales canon. Anonymity
          rule preserved: company-page identity only, no individual founder
          content.
        </p>
      </div>
    </>
  );
}
