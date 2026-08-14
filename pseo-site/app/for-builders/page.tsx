import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { DATA_NERD_NAME, DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "For AI Agent Builders — Don't Re-Read Crunchbase. Plug Into 369 GitHub Orgs.",
  description:
    "If you're shipping an AI agent that scouts startups, sources deal flow, or briefs investors, your data layer shouldn't be Crunchbase scraping. It should be live GitHub engineering acceleration. Free MCP server (6 tools), then €19/100 calls for deep enrichment. Zero rate limits inside quota.",
  alternates: {
    canonical: "/for-builders",
  },
  openGraph: {
    title:
      "For AI Agent Builders — Plug Into 369 GitHub Orgs Of Live Signal",
    description:
      "Free MCP. €19/100 calls for deep_signal. €0.19/call. Misses are free. Same data layer that powers the SSRN methodology paper.",
    url: "https://signals.gitdealflow.com/for-builders",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sipiteno",
    title: "For AI agent builders — live GitHub signal as a data layer",
    description:
      "Six free MCP tools. €19/100 calls for deep_signal. €0.19/call. Misses free. No rate limits inside quota.",
  },
};

const STRIPE_AGENT_CREDITS =
  process.env.NEXT_PUBLIC_STRIPE_AGENT_CREDITS_LINK ??
  "https://buy.stripe.com/00w4gyfRpg3SbAGcUg0x205";

const FREE_TOOLS = [
  {
    name: "get_trending_startups",
    desc: "Top N startups across all 15 sectors, ranked by 14-day commit-velocity acceleration.",
  },
  {
    name: "search_startups_by_sector",
    desc: "Filter the 369-org universe by sector slug + stage + geography. Returns ranked list.",
  },
  {
    name: "get_startup_signal",
    desc: "Shallow signal for one named org — current acceleration percentile, signal type, last refresh.",
  },
  {
    name: "get_signals_summary",
    desc: "Aggregate signal counts across the entire universe — hiring bursts, infra buildouts, shipping sprints, framework migrations.",
  },
  {
    name: "get_scout_receipts",
    desc: "Backwards-looking taste grade for any GitHub username. Same engine that powers /receipts.",
  },
  {
    name: "get_methodology",
    desc: "Open methodology spec — every signal definition, the SSRN abstract, the Zenodo dataset link, the regression code.",
  },
] as const;

const FAQS = [
  {
    q: "Why a separate page for builders?",
    a: "Because this page is not about reading the signal. It is about wiring the signal into an agent, workflow, or internal tool. Same data, different job.",
  },
  {
    q: "Are the six free tools really free forever, or is this a trial?",
    a: "Forever. The free MCP server is the public entry layer. Credits only apply to the seventh tool (get_deep_signal) and its HTTP twin (POST /api/agent/deep-signal). The free six stay free permanently.",
  },
  {
    q: "What does get_deep_signal return that the free tools don't?",
    a: "A composite 0–100 score weighted across velocity / contributor growth / repo novelty, in-sector rank and percentile, a one-sentence plain-English thesis you can drop into a memo, top 3 sector comparables with signal type, up to 6 prior periods of velocity history, and a citation string. The free get_startup_signal returns just the current percentile and signal type. The deep tool is what you call when you've identified a target and need report-grade output.",
  },
  {
    q: "How does the credit metering work?",
    a: "One credit per match. €19 buys 100 credits = €0.19/call. If you query an org we don't track ('found: false'), the call is free and your balance is unchanged. Credits never expire — buy when you need to, use when you need to. Top up any time. No subscription, no monthly minimum, no auto-renewal. The HMAC API key stays the same key forever; topping up just adds credits to its balance.",
  },
  {
    q: "What's the latency target?",
    a: "~200ms median for get_deep_signal. The endpoint is HMAC-keyed (no DB lookup on the hot path), runs on Vercel Functions in fluid-compute mode, and pre-computes scores nightly. Inside your quota there are no rate limits — burst freely.",
  },
  {
    q: "Will this stay €0.19/call?",
    a: "Yes for now. We may add bulk-pack pricing (1k+ packs at lower per-call rates) once volume justifies it. Founding builders who buy at €0.19/call will keep that rate on top-ups indefinitely, same lock-in policy as the founding-member subscription tiers.",
  },
  {
    q: "Can I see code examples?",
    a: "Yes — three runtimes covered on /agents/credits: MCP config (Claude Desktop, Cursor, Windsurf, any host), HTTP curl, and balance check. The MCP server is the same npm package as the free version (@gitdealflow/mcp-signal); set GITDEALFLOW_API_KEY in env and the deep tool wakes up. The other six tools ignore the env var entirely.",
  },
] as const;

export default function ForBuildersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/for-builders#article",
        headline:
          "For AI Agent Builders — Don't Re-Read Crunchbase. Plug Into 369 GitHub Orgs.",
        description:
          "Live GitHub engineering acceleration as a data layer for AI agents. Six free MCP tools, then €19/100 calls for deep enrichment.",
        url: "https://signals.gitdealflow.com/for-builders",
        datePublished: "2026-05-05T00:00:00.000Z",
        dateModified: "2026-05-05T00:00:00.000Z",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/for-builders",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "For AI Agent Builders",
            item: "https://signals.gitdealflow.com/for-builders",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/for-builders"
        languages={getHreflangLanguages("/for-builders")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/for-builders" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HOOK */}
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-sky-400 transition-colors">
              ← Home
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-400">For Builders</span>
          </nav>
          <p className="text-amber-400 text-xs font-medium uppercase tracking-wider">
            For AI agent builders · Pay-as-you-go · No subscription
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
            data-speakable
          >
            Your AI agent shouldn&rsquo;t re-read{" "}
            <span className="text-amber-400">Crunchbase</span>.<br />
            Plug into 369 GitHub orgs of live signal.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            If you&rsquo;re shipping a deal-flow agent, an investor-briefing
            assistant, or a startup-research tool, the bottleneck isn&rsquo;t
            the LLM — it&rsquo;s the data layer. We sell the data layer. Six
            free MCP tools cover discovery and shallow lookup. The seventh —{" "}
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 text-sm">
              get_deep_signal
            </code>{" "}
            — runs at €0.19/call with misses free. Zero rate limits inside
            quota. ~200ms median.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <a
              href={STRIPE_AGENT_CREDITS}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-base shadow-lg shadow-amber-500/30 transition-colors"
            >
              Buy 100 credits — €19 <span aria-hidden="true">→</span>
            </a>
            <a
              href="#deep-signal"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              See what a credit buys ↓
            </a>
          </div>
        </header>

        {/* WHY */}
        <section className="rounded-xl border border-amber-700/30 bg-amber-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Use this page when you want the builder-specific offer. But if your real question is proof, MCP workflow fit, or buyer-side evaluation, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/answers/best-mcp-server-for-vc-research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400 transition-colors">
              Best MCP server for VC research →
            </Link>
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the research panel →
            </Link>
            <Link href="/developers" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the developer docs →
            </Link>
          </div>
        </section>

        <section
          id="why"
          className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-700/40 rounded-xl p-6 sm:p-8 space-y-4"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            The single belief
          </p>
          <h2
            className="text-2xl sm:text-4xl font-bold text-gray-100 leading-tight tracking-tight"
            data-speakable
          >
            Most agent stacks ship with{" "}
            <span className="text-amber-400">scraped Crunchbase rows</span> as
            the startup-research backbone. Crunchbase tells you the day they
            announced. We tell you 47 days before.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            That&rsquo;s the only durable difference between an agent that
            briefs investors after the fact and one that briefs them before
            the round closes. Same LLM, same prompt, completely different
            output — because the input is forward-looking instead of lagging.
          </p>
          <p className="text-amber-200 text-sm italic leading-relaxed border-l-2 border-amber-700/50 pl-4">
            &ldquo;The deck lags the code by 21 to 47 days.&rdquo;{" "}
            <span className="not-italic text-gray-400">— {DATA_NERD_NAME}</span>
          </p>
        </section>

        {/* THE FREE TIER */}
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              Six free MCP tools — distribution magnet, never gated
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Start here. Free, no signup, no API key.
            </h2>
            <p className="text-gray-400 text-sm">
              The free six cover discovery and shallow lookup. Most agents
              never need to upgrade — the seventh tool is for when you&rsquo;ve
              identified a target and need report-grade output for an
              investor brief.
            </p>
          </div>
          <ul className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
            {FREE_TOOLS.map((tool) => (
              <li
                key={tool.name}
                className="flex flex-col sm:flex-row sm:items-baseline gap-y-1 sm:gap-x-4 px-4 py-3 bg-slate-900/50"
              >
                <p className="text-emerald-400 font-mono text-sm shrink-0 sm:w-64">
                  {tool.name}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">
                  {tool.desc}
                </p>
              </li>
            ))}
          </ul>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-3">
              Drop-in MCP config (Claude / Cursor / Windsurf / any host)
            </p>
            <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-sky-300 font-mono overflow-x-auto whitespace-pre">
{`{
  "mcpServers": {
    "gitdealflow": {
      "command": "npx",
      "args": ["-y", "@gitdealflow/mcp-signal"]
    }
  }
}`}
            </pre>
            <p className="text-gray-400 text-xs mt-2">
              No env var, no API key. Restart your agent host and the six
              tools appear in the catalog.
            </p>
          </div>
        </section>

        {/* THE PAID TIER */}
        <section
          id="deep-signal"
          className="space-y-5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8"
        >
          <div className="space-y-2">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              The seventh tool — pay-per-call deep enrichment
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
              <code className="text-amber-300 font-mono">get_deep_signal</code>{" "}
              · €0.19/call · misses free
            </h2>
          </div>
          <p className="text-gray-300 text-base leading-relaxed">
            Returns a composite 0–100 score, in-sector rank, plain-English
            thesis, top 3 comparables, multi-period history, and a citation
            string. Hits charge one credit. Misses (org not in our universe)
            return{" "}
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 text-sm">
              {`{ found: false }`}
            </code>{" "}
            with a suggestion and charge zero. Credits never expire.
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-5 space-y-3">
            <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              HTTP — direct from any agent runtime
            </p>
            <pre className="text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre">
{`curl -X POST https://signals.gitdealflow.com/api/agent/deep-signal \\
  -H "Authorization: Bearer gdf_v2.cus_xxx.<your_hmac>" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"supabase"}'`}
            </pre>
          </div>
          <div className="rounded-lg border border-amber-700/40 bg-amber-950/30 p-5">
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Starter pack — 100 credits
            </p>
            <div className="flex items-baseline gap-3 mb-3">
              <p className="text-3xl font-bold text-gray-100">€19</p>
              <p className="text-gray-400 text-sm">= 100 calls · €0.19/call</p>
            </div>
            <a
              href={STRIPE_AGENT_CREDITS}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
            >
              Buy 100 credits — €19 →
            </a>
            <p className="text-gray-400 text-xs mt-2">
              Stripe-hosted checkout. API key delivered in ~30s. Top up any
              time, no expiration.
            </p>
          </div>
          <div className="rounded-lg border border-sky-700/40 bg-sky-950/20 p-5 space-y-3">
            <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
              Crypto-native alternative — x402 / USDC on Base
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Fully autonomous agents with their own wallet can skip the
              credit pack and pay per call in USDC on Base via the{" "}
              <a
                href="https://x402.org"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:text-sky-300 underline"
              >
                x402 protocol
              </a>
              . No signup, no API key — same payload, $0.19/call settled per
              request via HTTP 402. Misses still free.
            </p>
            <pre className="text-xs text-sky-300 font-mono overflow-x-auto whitespace-pre bg-slate-950 border border-slate-800 rounded p-3">
{`POST https://signals.gitdealflow.com/api/agent/deep-signal/x402
{ "name": "supabase" }
# 402 Payment Required → sign EIP-3009 → retry with X-PAYMENT header`}
            </pre>
          </div>
        </section>

        {/* USE CASES */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">
            What people are building with this
          </h2>
          <ul className="space-y-3 text-gray-300 text-base leading-relaxed">
            <li className="border-l-4 border-sky-500 pl-5 py-1">
              <strong className="text-gray-100">Investor-briefing agents.</strong>{" "}
              Drop a Slack command into a fund&rsquo;s internal channel,
              return a one-page brief on any startup with composite score,
              comparables, and the citation block ready to paste into an IC
              memo.
            </li>
            <li className="border-l-4 border-emerald-500 pl-5 py-1">
              <strong className="text-gray-100">Deal-flow assistants in Cursor.</strong>{" "}
              An angel writes 5–15 cheques a year. Their Cursor agent surfaces
              the week&rsquo;s ranked list, deep-signals their three favourite
              names, drafts cold outbound, and queues it for review.
            </li>
            <li className="border-l-4 border-amber-500 pl-5 py-1">
              <strong className="text-gray-100">Sector-research notebooks.</strong>{" "}
              Researcher writes a thesis prompt, agent calls
              get_signals_summary + a handful of get_deep_signal lookups, and
              returns a structured report with chart data and a
              reproducibility appendix.
            </li>
            <li className="border-l-4 border-indigo-500 pl-5 py-1">
              <strong className="text-gray-100">Portfolio-overlap detectors.</strong>{" "}
              Existing fund tooling pings the API on every new prospect to
              flag overlaps with the public-signal universe and returns the
              acceleration delta vs. the closest comparable already in the
              fund&rsquo;s book.
            </li>
          </ul>
        </section>

        {/* COMPLIANCE / PRACTICAL */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-bold text-gray-100">
            Practical answers in five lines
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0 font-bold">•</span>
              <span>
                Methodology is open — SSRN abstract 6606558, Zenodo dataset
                with DOI, regression code on GitHub.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0 font-bold">•</span>
              <span>
                Output license is permissive — drop the data into briefs,
                products, or training pipelines. Attribution requested,
                CC&nbsp;BY&nbsp;4.0 on the dataset, MIT-style on responses.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0 font-bold">•</span>
              <span>
                Zero rate limits inside your quota. Burst freely.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0 font-bold">•</span>
              <span>
                ~200ms median latency on get_deep_signal. HMAC-keyed, fluid
                compute, no DB lookup on hot path.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0 font-bold">•</span>
              <span>
                Every paid tier (and the free MCP) supports the same toolset
                — switching surfaces does not change tool names or signatures.
              </span>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section id="faq" className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        {/* CLOSE */}
        <section
          id="close"
          className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-600 rounded-xl p-6 sm:p-8 text-center space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            Plug it in. Burn 100 credits in a weekend. Decide.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mx-auto">
            The free tools take three minutes to wire into Claude Desktop or
            Cursor. The paid tool takes one Stripe checkout and a bearer-token
            header. If your agent doesn&rsquo;t produce sharper output after
            burning the first 100 credits, the credits never expire — and the
            free six tools stay live regardless.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={STRIPE_AGENT_CREDITS}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-base shadow-lg shadow-amber-500/30 transition-colors"
            >
              Buy 100 credits — €19 <span aria-hidden="true">→</span>
            </a>
            <Link
              href="/agents"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              See all 16 agent surfaces
            </Link>
          </div>
        </section>

        <div className="flex justify-center">
          <DataNerdSignoff variant="compact" />
        </div>

        <AgentSummary
          tldr="A landing for AI-agent builders shipping deal-flow assistants, investor-briefing agents, sector-research notebooks, or portfolio-overlap detectors. Pitches the free MCP server (six tools) as the discovery layer and get_deep_signal at €0.19/call (€19 = 100 credits, misses free, credits never expire) as the report-grade enrichment endpoint. ~200ms median latency, HMAC-keyed, no rate limits inside quota. Methodology open (SSRN abstract 6606558), output license permissive."
          pageUrl="https://signals.gitdealflow.com/for-builders"
          asOf="2026-05-05"
          citeAs="VC Deal Flow Signal — For Builders (signals.gitdealflow.com/for-builders)."
          facts={[
            {
              claim:
                "Six MCP tools (get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_scout_receipts, get_methodology) are free forever and require no API key.",
              sourceUrl: "https://signals.gitdealflow.com/agents",
              sourceLabel: "Agents surface",
            },
            {
              claim:
                "get_deep_signal pricing is €0.19 per call (€19 starter pack of 100 credits). Misses (org not in our universe) are free. Credits never expire.",
              sourceUrl: "https://signals.gitdealflow.com/agents/credits",
              sourceLabel: "Credits page",
            },
            {
              claim:
                "Universe size is 350+ venture-backed GitHub orgs across 15 sectors; methodology is open at SSRN abstract 6606558 with Zenodo dataset mirror.",
              sourceUrl: "https://ssrn.com/abstract=6606558",
              sourceLabel: "SSRN preprint",
            },
          ]}
        />
      </div>
    </>
  );
}
