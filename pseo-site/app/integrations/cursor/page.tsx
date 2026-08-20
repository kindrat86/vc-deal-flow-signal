import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { withEditorialOverride } from "@/lib/metadata";

const SITE = "https://signals.gitdealflow.com";
const NPM = "@gitdealflow/mcp-signal";
const HTTP_RPC = `${SITE}/api/mcp/rpc`;

// Cursor's official one-click MCP install deeplink scheme:
// cursor://anysphere.cursor-deeplink/mcp/install?name=NAME&config=BASE64_JSON
// Reference: https://docs.cursor.com/context/model-context-protocol#one-click-install
const STDIO_CONFIG_B64 =
  "eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBnaXRkZWFsZmxvdy9tY3Atc2lnbmFsIl19";
const HTTP_CONFIG_B64 =
  "eyJ1cmwiOiJodHRwczovL3NpZ25hbHMuZ2l0ZGVhbGZsb3cuY29tL2FwaS9tY3AvcnBjIn0=";
const CURSOR_DEEPLINK_STDIO = `cursor://anysphere.cursor-deeplink/mcp/install?name=vc-deal-flow-signal&config=${STDIO_CONFIG_B64}`;
const CURSOR_DEEPLINK_HTTP = `cursor://anysphere.cursor-deeplink/mcp/install?name=vc-deal-flow-signal&config=${HTTP_CONFIG_B64}`;

const TITLE =
  "Use VC Deal Flow Signal in Cursor, one-click MCP install";
const DESCRIPTION =
  "Add the VC Deal Flow Signal MCP server to Cursor in one click. Six free read-only tools, trending startups, sector signals, startup lookup, dataset summary, Scout receipts, methodology. Works in Cursor v0.45+, no auth, no setup, weekly refresh.";

export const metadata: Metadata = withEditorialOverride({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/integrations/cursor" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/integrations/cursor`,
    type: "website",
    siteName: "VC Deal Flow Signal",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sipiteno",
    title: TITLE,
    description: DESCRIPTION,
  },
});

const TOOLS = [
  {
    name: "get_trending_startups",
    summary:
      "Top 20 startups by engineering acceleration across all 15 sectors for the current week.",
  },
  {
    name: "search_startups_by_sector",
    summary:
      "Every tracked startup within a sector, ranked by velocity. Sector slug from the 15 enumerated values.",
  },
  {
    name: "get_startup_signal",
    summary:
      "Single-startup deep lookup by name or GitHub org slug. Returns velocity, contributor delta, signal type, GitHub URL.",
  },
  {
    name: "get_signals_summary",
    summary:
      "Dataset metadata: period, sector and startup counts, refresh timestamp, citation links.",
  },
  {
    name: "get_scout_receipts",
    summary:
      "Score any GitHub user 0-100 by how many validated unicorns they starred before fundraise. Returns score, rank, top early calls, shareable card URL.",
  },
  {
    name: "get_methodology",
    summary:
      "Plain-text methodology, data sources, metric computation, classification thresholds, refresh cadence, limitations. For citation footnotes.",
  },
];

const HOW_TO_STEPS = [
  {
    name: "Click the Add to Cursor button",
    text: "Cursor opens automatically and shows the install dialog with the server name and the install command. Approve the install. The MCP server appears in Settings → MCP and the six tools become available in the next chat.",
  },
  {
    name: "Pick stdio or HTTP transport",
    text: "Stdio runs the server locally via npx, fastest, no network latency on tool calls. Streamable HTTP hits signals.gitdealflow.com/api/mcp/rpc, no Node required, works on locked-down corporate machines. Either is one click.",
  },
  {
    name: "Ask a deal-flow question in chat",
    text: "Try: 'Who's accelerating in AI/ML this week?', 'Show me fintech by engineering velocity', 'Is Supabase still trending?', or 'Score my GitHub user'. Cursor calls the right tool, paginates the response, and pastes a citation block with the methodology link.",
  },
  {
    name: "Pin tools per-project",
    text: "If you want VC signals only inside a deal-memo workspace, configure the server in .cursor/mcp.json at the repo root. Cursor picks it up automatically when that workspace opens.",
  },
];

const FAQ = [
  {
    q: "Does the install button work without Cursor v0.45+?",
    a: "No, one-click MCP deeplinks shipped in Cursor v0.45 (December 2024). Update Cursor first, or paste the JSON config under Settings → MCP → +Add new MCP server.",
  },
  {
    q: "Stdio vs Streamable HTTP, which should I pick?",
    a: "Stdio if you have Node 20+ and want sub-100ms tool calls. Streamable HTTP if you don't want a local Node runtime (corporate-locked machines, Codespaces, web-only Cursor sessions). Same six tools, same data, same auth-free.",
  },
  {
    q: "Is the server free?",
    a: "Yes. Six read-only tools, no rate limits beyond the CDN's, no signup, no API key. The paid tier (Insider Circle, EUR 197/mo) adds private Telegram, watchlists, and a direct line, none of which are MCP-gated.",
  },
  {
    q: "Where does it list on cursor.directory?",
    a: "cursor.directory/plugins/vc-deal-flow-signal-mcp-1. Listing is live; the directory cross-links here for the install button and back to the npm package.",
  },
  {
    q: "Does it run inside Cursor's background agents?",
    a: "Yes. Cursor's background agents (composer, autonomous mode) inherit MCP server access. The six tools work the same in agentic loops as in interactive chat.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: TITLE,
      url: `${SITE}/integrations/cursor`,
      description: DESCRIPTION,
      isPartOf: { "@type": "WebSite", name: "VC Deal Flow Signal", url: SITE },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: "Integrations", item: `${SITE}/integrations` },
          { "@type": "ListItem", position: 3, name: "Cursor", item: `${SITE}/integrations/cursor` },
        ],
      },
    },
    // AEO 2026-07-18: removed duplicate SoftwareApplication + fabricated
    // aggregateRating(reviewCount:12) that previously sat here. The node
    // contradicted the 6-count on the rest of the site, had no third-party
    // attribution, and Google treats self-served aggregateRating as
    // structured-data spam (manual-action risk). The canonical
    // SoftwareApplication node lives in components/RootIdentitySchema.tsx
    // and is emitted site-wide. Restore here ONLY with a real review body
    // (Trustpilot/G2/Capterra) backing the rating. Tracked in AEO-action-plan.
    {
      "@type": "HowTo",
      name: "How to install VC Deal Flow Signal in Cursor",
      description:
        "Three-click workflow to add the VC Deal Flow Signal MCP server to Cursor, pick a transport, click Add to Cursor, approve the install dialog.",
      totalTime: "PT45S",
      step: HOW_TO_STEPS.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function CursorIntegrationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-slate-950 text-gray-100">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <nav className="text-xs text-gray-500 mb-8 speakable">
            <Link href="/" className="hover:text-emerald-400">All Sectors</Link>
            <span className="mx-2">/</span>
            <Link href="/integrations" className="hover:text-emerald-400">Integrations</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300">Cursor</span>
          </nav>

          <header className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/40 border border-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live · cursor.directory listed · Six free tools
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
              VC Deal Flow Signal in Cursor
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Add live GitHub engineering-acceleration signals to Cursor in one click.
              Six free MCP tools, trending startups, sector ranks, single-startup
              lookups, Scout receipts, dataset summary, methodology. Cursor v0.45+, no
              auth, no setup, weekly refresh.
            </p>
            <div data-agent-summary className="hidden">
              VC Deal Flow Signal exposes a six-tool MCP server in Cursor. One-click install
              via cursor:// deeplink (stdio or Streamable HTTP). Free, no auth. Same data
              served at signals.gitdealflow.com/api/mcp/rpc.
            </div>
          </header>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">One-click install</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <a
                href={CURSOR_DEEPLINK_STDIO}
                className="group block rounded-2xl border-2 border-emerald-700 bg-gradient-to-br from-emerald-950/60 to-slate-900 p-6 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">⚡</span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                    Recommended · Stdio
                  </span>
                </div>
                <div className="text-lg font-bold text-white mb-2">
                  Add to Cursor (local stdio)
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  Runs the server via npx on your machine. Sub-100ms tool calls. Needs Node 20+.
                </div>
                <div className="text-emerald-400 text-sm font-mono group-hover:translate-x-1 transition-transform">
                  → Click to install
                </div>
              </a>
              <a
                href={CURSOR_DEEPLINK_HTTP}
                className="group block rounded-2xl border-2 border-sky-700 bg-gradient-to-br from-sky-950/60 to-slate-900 p-6 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-950/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🌐</span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">
                    Streamable HTTP
                  </span>
                </div>
                <div className="text-lg font-bold text-white mb-2">
                  Add to Cursor (HTTP)
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  No Node required. Hits {HTTP_RPC} directly. Best for locked-down or web Cursor.
                </div>
                <div className="text-sky-400 text-sm font-mono group-hover:translate-x-1 transition-transform">
                  → Click to install
                </div>
              </a>
            </div>
            <p className="text-sm text-gray-500">
              The buttons trigger Cursor&apos;s native install dialog via the{" "}
              <code className="rounded bg-slate-900 px-1 py-0.5 text-xs">cursor://</code>{" "}
              deeplink. Cursor v0.45+ required. If nothing happens, your browser is
              blocking custom protocol handlers, fall back to the manual config below.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Manual install (Settings → MCP)</h2>
            <p className="text-gray-300 mb-4">
              Open Cursor → Settings → MCP → <strong>+Add new MCP server</strong>, then
              paste either snippet. Restart not required, the server appears in the
              MCP servers list and tools light up immediately.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
                  Stdio
                </div>
                <pre className="overflow-x-auto text-xs text-gray-300 font-mono leading-relaxed">{`{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "command": "npx",
      "args": ["-y", "${NPM}"]
    }
  }
}`}</pre>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-sky-400 mb-2">
                  Streamable HTTP
                </div>
                <pre className="overflow-x-auto text-xs text-gray-300 font-mono leading-relaxed">{`{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "url": "${HTTP_RPC}"
    }
  }
}`}</pre>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Six tools, zero auth</h2>
            <ul className="space-y-3">
              {TOOLS.map((t) => (
                <li
                  key={t.name}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 p-4"
                >
                  <code className="text-sm font-mono text-emerald-400">{t.name}</code>
                  <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{t.summary}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
            <ol className="space-y-5">
              {HOW_TO_STEPS.map((s, i) => (
                <li key={s.name} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-950 border border-emerald-900 flex items-center justify-center text-sm font-bold text-emerald-400">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">{s.name}</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">FAQ</h2>
            <dl className="space-y-5">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
                  <dt className="font-semibold text-white mb-2">{f.q}</dt>
                  <dd className="text-sm text-gray-300 leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mb-16 rounded-2xl border border-slate-800 bg-slate-900/30 p-8">
            <h2 className="text-xl font-bold text-white mb-4">Where else this server runs</h2>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              The same npm package (
              <code className="rounded bg-slate-900 px-1 py-0.5 text-xs">{NPM}</code>) and
              the same HTTP endpoint power our integrations in Claude Desktop, Claude Code,
              Cline (VS Code), Block Goose, OpenHands, Aider, AiderDesk, Raycast, Mistral Le
              Chat, and ChatGPT (via OpenAPI Action). One server, every runtime.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/integrations/agent-runtimes"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-emerald-400 hover:border-emerald-600 transition-colors"
              >
                All agent runtimes →
              </Link>
              <Link
                href="/integrations/replit"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-emerald-400 hover:border-emerald-600 transition-colors"
              >
                Run on Replit →
              </Link>
              <Link
                href="/integrations/vercel-deploy"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-emerald-400 hover:border-emerald-600 transition-colors"
              >
                Deploy to Vercel →
              </Link>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Listed on cursor.directory</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              The plugin is published in the public Cursor Directory at{" "}
              <a
                href="https://cursor.directory/plugins/vc-deal-flow-signal-mcp-1"
                rel="external"
                className="text-emerald-400 hover:underline"
              >
                cursor.directory/plugins/vc-deal-flow-signal-mcp-1
              </a>
              . Cursor users browsing the directory see the listing alongside an
              install button that lands here. Listing canonical: this page.
            </p>
          </section>

          <AgentMirrorLinks path="/integrations/cursor" />
        </div>
      </main>
    </>
  );
}
