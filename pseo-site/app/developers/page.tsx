import type { Metadata } from "next";
import Link from "next/link";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const metadata: Metadata = {
  title: "Developers — Deal Flow API, MCP Server, JSON & CSV Endpoints",
  description:
    "Developer docs for GitDealFlow: MCP server, JSON/CSV API, OpenAPI, agent-ready startup-signal workflows, and routing into proof and buyer-side evaluation.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: {
    canonical: "/developers",
  },
};

export default function DevelopersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/developers#webpage",
        url: "https://signals.gitdealflow.com/developers",
        name: "Developers — VC Deal Flow Signal API & MCP",
        description:
          "MCP server, JSON/CSV API, and OpenAPI schema for building deal flow automation on top of engineering acceleration signals.",
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "TechArticle",
        headline: "VC Deal Flow Signal Developer Documentation",
        description:
          "MCP server, JSON/CSV API, and OpenAPI schema for building deal flow automation on top of engineering acceleration signals.",
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "APIReference",
        name: "VC Deal Flow Signal API",
        description:
          "Public JSON and CSV endpoints plus an MCP server exposing six tools for querying startup engineering acceleration signals.",
        documentation: "https://signals.gitdealflow.com/developers",
        url: "https://signals.gitdealflow.com/api/signals.json",
      },
      {
        "@type": "SoftwareSourceCode",
        name: "@gitdealflow/mcp-signal",
        programmingLanguage: "TypeScript",
        runtimePlatform: "Node.js 20+",
        codeRepository: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
        description:
          "MCP server for VC Deal Flow Signal. Six free read tools: get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_scout_receipts, and get_methodology.",
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
            name: "Developers",
            item: "https://signals.gitdealflow.com/developers",
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/developers#webpage",
        url: "https://signals.gitdealflow.com/developers",
        name: "VC Deal Flow Signal Developer Documentation",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I access the VC Deal Flow Signal API?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The basic JSON endpoints are publicly accessible at signals.gitdealflow.com — for example signals.json returns the current weekly ranked signals, weekly returns a summary, and methodology returns the data dictionary. No authentication is required for the basic tier. For higher-volume commercial access, the Insider Circle tier (EUR 97/month) provides elevated rate limits and webhook delivery.",
            },
          },
          {
            "@type": "Question",
            name: "What rate limits apply?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The free tier supports approximately 60 requests per minute per IP, sufficient for individual investors and small fund automation. The Insider Circle tier supports several thousand requests per minute and is appropriate for commercial pipelines feeding into data warehouses or AI agent systems. Rate limit headers are returned on every response so client code can self-throttle correctly.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a Model Context Protocol (MCP) server?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The MCP server is published on npm as @gitdealflow/mcp-signal and provides six tools: get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_scout_receipts, and get_methodology. It works in Claude Desktop, Claude Code, Cursor, and any other MCP-compatible client. Installation takes one command: npx -y @gitdealflow/mcp-signal. The server is open source.",
            },
          },
          {
            "@type": "Question",
            name: "What data formats does the API return?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The API returns JSON for programmatic consumption, CSV for spreadsheet workflows and Data.world auto-sync, and a structured Markdown variant via the /md endpoint specifically optimized for AI agent ingestion. RSS and Atom feeds are available for the blog and Signal Report. The dataset mirrors on Zenodo and Kaggle provide bulk-download Parquet and CSV files for offline analysis.",
            },
          },
          {
            "@type": "Question",
            name: "Is the MCP server open source?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The MCP server source code is available on GitHub under an MIT license. Contributions are welcome. The server has been verified A-tier by Glama and is listed in the official MCP Registry plus the awesome-mcp-servers community list. The npm package has had over 690 downloads in the first 10 days post-launch.",
            },
          },
          {
            "@type": "Question",
            name: "Does the API support webhooks?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Webhook delivery is available on the Insider Circle tier. Subscribers configure webhook URLs and acceleration thresholds, and the webhook fires whenever a watched startup crosses the threshold, a new breakout enters a watched sector, or the weekly Signal Report publishes. Webhook payloads are signed with HMAC-SHA256 for verification. Most subscribers route webhooks into Slack, Discord, or internal alerting infrastructure.",
            },
          },
          {
            "@type": "Question",
            name: "Can I use the data in commercial products?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The published dataset is released under CC-BY-4.0, which permits commercial use with attribution. The API is intended for both individual investors and commercial pipelines feeding into fund infrastructure. Larger commercial customers should contact signal@gitdealflow.com to discuss volume pricing and SLA terms beyond the standard Insider Circle tier.",
            },
          },
          {
            "@type": "Question",
            name: "Is there an A2A endpoint for agent-to-agent communication?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. An Agent Card is published at /.well-known/agent-card.json and the JSON-RPC stub endpoint is /api/a2a. Worked examples are provided for Claude Code, Cursor, OpenAI Agents SDK, LangChain, and Vercel AI SDK at /a2a/<framework>. The A2A surface is intentionally thin and stable — see /a2a for the full specification.",
            },
          },
          {
            "@type": "Question",
            name: "Is there per-request pricing for agents?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The new get_deep_signal MCP tool and the POST /api/agent/deep-signal HTTP endpoint are priced per-request: €0.19 per call, sold in 100-credit packs at €19. One credit is consumed per match; misses (startup not in our universe) are free. Credits never expire. The six free MCP tools stay free forever — credits only apply to get_deep_signal. Buy at signals.gitdealflow.com/agents/credits.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/developers"
        languages={getHreflangLanguages("/developers")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Developers</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Developers
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-2xl">
          Three ways to build on top of VC Deal Flow Signal: an MCP server for
          AI assistants, raw JSON and CSV endpoints for automation, and an
          OpenAPI schema for generating typed clients. If you are here from an
          AI or agent workflow, this page should take you from machine-readable
          access into the proof and buyer pages that explain what the signal is worth.
        </p>

        <section className="mb-10 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">
            Use this page if you want the full developer surface. But if your real question is builder fit, install path, or per-request pricing, start with the sharper entry points first.
          </p>
          <div className="flex flex-wrap gap-3 mb-5">
            <Link href="/for-builders" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400 transition-colors">
              Read the builder offer →
            </Link>
            <Link href="/install" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Install the bookmarklet →
            </Link>
            <Link href="/agents/credits" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              See agent credits →
            </Link>
          </div>
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Quote-ready takeaway
          </p>
          <blockquote className="text-gray-100 text-lg leading-relaxed border-l-2 border-amber-400/60 pl-4">
            GitDealFlow is useful to developers because it exposes startup-signal data in machine-readable formats an agent can query directly without private API friction.
          </blockquote>
          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
            If you cite this page externally, use the takeaway above with the page URL and then route technical readers into the MCP or OpenAPI sections below.
          </p>
        </section>

        <section className="mb-12" aria-label="MCP server">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            MCP Server
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            The Model Context Protocol server for VC Deal Flow Signal. Works
            with Claude Desktop, Cursor, Windsurf, Continue, and any
            MCP-compatible client.
          </p>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
              Install
            </p>
            <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm text-emerald-400 overflow-x-auto">
              npx @gitdealflow/mcp-signal@latest
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
              Claude Desktop config
            </p>
            <pre className="rounded border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-gray-300 overflow-x-auto">
{`{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "command": "npx",
      "args": ["-y", "@gitdealflow/mcp-signal@latest"]
    }
  }
}`}
            </pre>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
              Available tools
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <code className="text-emerald-400 font-mono">get_trending_startups</code>
                <p className="text-gray-400 mt-1">Top breakout startups this week across all sectors, ranked by signal strength.</p>
              </div>
              <div>
                <code className="text-emerald-400 font-mono">get_signals_summary</code>
                <p className="text-gray-400 mt-1">Aggregate signal distribution by sector and signal type for the current period.</p>
              </div>
              <div>
                <code className="text-emerald-400 font-mono">get_startup_signal</code>
                <p className="text-gray-400 mt-1">Detailed engineering signal for a specific startup by name or GitHub org.</p>
              </div>
              <div>
                <code className="text-emerald-400 font-mono">search_startups_by_sector</code>
                <p className="text-gray-400 mt-1">Filter startups by sector (AI/ML, enterprise SaaS, fintech, dev tools, etc.).</p>
              </div>
              <div>
                <code className="text-emerald-400 font-mono">get_scout_receipts</code>
                <p className="text-gray-400 mt-1">Score a developer&rsquo;s public taste: which now-validated companies they backed early, before everyone else noticed.</p>
              </div>
              <div>
                <code className="text-emerald-400 font-mono">get_methodology</code>
                <p className="text-gray-400 mt-1">Full methodology: data sources, metric definitions, and signal classification rules.</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-4">
              Six read tools, free forever. The paid{" "}
              <code className="text-emerald-400 font-mono">get_deep_signal</code>{" "}
              tool (scored, memo-grade output) is separate — see{" "}
              <Link href="/agents/credits" className="text-sky-400 hover:text-sky-300">
                agent credits
              </Link>{" "}
              below.
            </p>
          </div>

          <div className="flex gap-3 text-sm">
            <Link
              href="https://www.npmjs.com/package/@gitdealflow/mcp-signal"
              className="text-sky-500 hover:text-sky-400 font-medium transition-colors"
            >
              npm package &rarr;
            </Link>
            <Link
              href="https://glama.ai/mcp/servers"
              className="text-gray-400 hover:text-gray-300 font-medium transition-colors"
            >
              Glama listing
            </Link>
            <Link
              href="/research"
              className="text-gray-400 hover:text-gray-300 font-medium transition-colors"
            >
              Research panel
            </Link>
          </div>
        </section>

        <section className="mb-12" aria-label="REST endpoints">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            REST Endpoints
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Public, no-auth endpoints for the current-period signal set. Cached
            for one hour, CORS enabled.
          </p>

          <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Endpoint</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Format</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800/60">
                  <td className="px-4 py-3">
                    <code className="text-emerald-400 font-mono text-xs">/api/signals.json</code>
                  </td>
                  <td className="px-4 py-3 text-gray-400">JSON</td>
                  <td className="px-4 py-3 text-gray-400">Full current-period signal set with enrichment fields.</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="px-4 py-3">
                    <code className="text-emerald-400 font-mono text-xs">/api/signals.csv</code>
                  </td>
                  <td className="px-4 py-3 text-gray-400">CSV</td>
                  <td className="px-4 py-3 text-gray-400">Flat CSV for spreadsheets, CRM import, or BI tools.</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="px-4 py-3">
                    <code className="text-emerald-400 font-mono text-xs">/api/openapi.json</code>
                  </td>
                  <td className="px-4 py-3 text-gray-400">OpenAPI 3.1</td>
                  <td className="px-4 py-3 text-gray-400">OpenAPI schema — generate typed clients in any language.</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="px-4 py-3">
                    <code className="text-emerald-400 font-mono text-xs">/api/changelog.json</code>
                  </td>
                  <td className="px-4 py-3 text-gray-400">JSON</td>
                  <td className="px-4 py-3 text-gray-400">Data changelog: periods, refresh dates, sector counts.</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="px-4 py-3">
                    <code className="text-emerald-400 font-mono text-xs">/feed.xml</code>
                  </td>
                  <td className="px-4 py-3 text-gray-400">RSS 2.0</td>
                  <td className="px-4 py-3 text-gray-400">Weekly signal feed with enriched content:encoded.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-emerald-400 font-mono text-xs">/llms.txt</code>
                  </td>
                  <td className="px-4 py-3 text-gray-400">Text</td>
                  <td className="px-4 py-3 text-gray-400">LLM-friendly site map for AI assistants.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
              Example: fetch current signals
            </p>
            <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm text-emerald-400 overflow-x-auto">
              curl https://signals.gitdealflow.com/api/signals.json
            </div>
          </div>
        </section>

        <section className="mb-12" aria-label="Per-request pricing">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Per-Request Pricing (Agents)
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            The free MCP tools and REST endpoints listed above stay free
            forever. For agents that need scored, ranked, comparable-aware
            output — memo-grade signal — the new{" "}
            <code className="text-emerald-400 font-mono">get_deep_signal</code>{" "}
            tool is priced per-request.
          </p>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 mb-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
              <p className="text-gray-100 font-semibold">
                Starter pack: 100 credits
              </p>
              <p className="text-amber-400 font-mono text-sm">
                €19 · €0.19/call
              </p>
            </div>
            <ul className="text-gray-300 text-sm leading-relaxed space-y-1 mb-4">
              <li>• 1 credit per deep signal returned. Misses are free.</li>
              <li>• Credits never expire.</li>
              <li>• API key delivered instantly via email.</li>
              <li>
                • Works in MCP (set <code className="text-emerald-400 font-mono">GITDEALFLOW_API_KEY</code>) or
                straight HTTP (<code className="text-emerald-400 font-mono">Authorization: Bearer …</code>).
              </li>
            </ul>
            <Link
              href="/agents/credits"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors"
            >
              Pricing &amp; checkout →
            </Link>
          </div>
        </section>

        <section className="mb-12" aria-label="Rate limits and licensing">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Rate Limits & Licensing
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div>
              <p className="text-gray-200 font-medium text-sm mb-1">Rate limits</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Public endpoints are cached with <code className="text-emerald-400 font-mono text-xs">s-maxage=3600</code> and
                served from the edge. There is no hard per-IP limit, but
                sustained high-frequency scraping should use the RSS feed or a
                cached local copy instead.
              </p>
            </div>
            <div>
              <p className="text-gray-200 font-medium text-sm mb-1">Licensing</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Data is provided free for personal, research, and commercial
                use with attribution: link to{" "}
                <Link href="/" className="text-sky-400 hover:text-sky-300">
                  signals.gitdealflow.com
                </Link>
                . Redistribution as a competing product or reselling the raw
                dataset requires written permission — contact
                signal@gitdealflow.com.
              </p>
            </div>
            <div>
              <p className="text-gray-200 font-medium text-sm mb-1">Attribution example</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                &ldquo;Engineering signals from{" "}
                <Link href="/" className="text-sky-400 hover:text-sky-300">
                  VC Deal Flow Signal
                </Link>
                &rdquo;
              </p>
            </div>
          </div>
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Building something?
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            If you are integrating VC Deal Flow Signal into an investor tool,
            CRM, or research workflow, the fastest way to get help is email. If
            you still need human-facing proof before integrating, read the
            research panel or the buyer's guide first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="mailto:signal@gitdealflow.com"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Email signal@gitdealflow.com
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition-colors"
            >
              Read the research panel
            </Link>
            <Link
              href="/buyers-guide"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition-colors"
            >
              Read the buyer's guide
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <DataNerdSignoff variant="compact" catchphraseIndex={4} />
        </div>
      </div>
    </>
  );
}
