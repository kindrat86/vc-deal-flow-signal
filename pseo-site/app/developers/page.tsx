import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developers — Deal Flow API, MCP Server, JSON & CSV Endpoints",
  description:
    "Developer documentation for VC Deal Flow Signal: MCP server tools, JSON/CSV API, OpenAPI schema, RSS feed, llms.txt, and webhook endpoints. Build deal flow automation on top of engineering signals.",
  alternates: {
    canonical: "/developers",
  },
};

export default function DevelopersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
          "Public JSON and CSV endpoints plus an MCP server exposing five tools for querying startup engineering acceleration signals.",
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
          "MCP server for VC Deal Flow Signal. Five tools for trending startups, sector signals, startup lookup, methodology, and weekly summaries.",
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
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
          OpenAPI schema for generating typed clients.
        </p>

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
                <code className="text-emerald-400 font-mono">get_methodology</code>
                <p className="text-gray-400 mt-1">Full methodology: data sources, metric definitions, and signal classification rules.</p>
              </div>
            </div>
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
              className="text-gray-500 hover:text-gray-300 font-medium transition-colors"
            >
              Glama listing
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
            CRM, or research workflow, the fastest way to get help is email.
          </p>
          <Link
            href="mailto:signal@gitdealflow.com"
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Email signal@gitdealflow.com
          </Link>
        </div>
      </div>
    </>
  );
}
