import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";
const MCP_URL = `${SITE}/api/mcp/rpc`;
const TITLE =
  "Use VC Deal Flow Signal in Mistral Le Chat, Custom MCP Connector";
const DESCRIPTION =
  "Add the VC Deal Flow Signal MCP server to Mistral Le Chat as a Custom MCP Connector in under two minutes. Public Streamable HTTP endpoint, no auth required, six read-only tools for venture-backed startup engineering signals across 15 sectors.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/integrations/mistral" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/integrations/mistral`,
    type: "website",
    siteName: "VC Deal Flow Signal",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sipiteno",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const TOOLS: { name: string; summary: string }[] = [
  {
    name: "get_trending_startups",
    summary:
      "Top 20 startups across all 15 sectors ranked by GitHub engineering acceleration.",
  },
  {
    name: "search_startups_by_sector",
    summary:
      "Every tracked startup in one of 15 sectors, ranked by acceleration. Sectors enumerated.",
  },
  {
    name: "get_startup_signal",
    summary:
      "Full signal profile for a single startup: velocity, contributor delta, repo expansion, classification.",
  },
  {
    name: "get_signals_summary",
    summary:
      "Dataset snapshot, current period, counts, refresh date, format URLs, citation.",
  },
  {
    name: "get_scout_receipts",
    summary:
      "GitHub Scout Score for any user, backwards-looking proof-of-taste from validated unicorns.",
  },
  {
    name: "get_methodology",
    summary:
      "How signals are sourced, computed, and classified, with documented limitations.",
  },
];

const HOW_TO_STEPS = [
  {
    name: "Open Connectors in Mistral Le Chat",
    text: "In Le Chat, open the side panel, expand the Intelligence menu, and click Connectors.",
  },
  {
    name: "Click + Add Connector",
    text: "Top-right of the Connectors page, click + Add Connector. In the dialog, choose the Custom MCP Connector tab.",
  },
  {
    name: "Paste the server URL",
    text: `Connector name: vc-deal-flow-signal (no spaces). Connection server: ${MCP_URL}. Description (optional): VC Deal Flow Signal, engineering acceleration signals across 15 sectors. Authentication: No Authentication (the server is public, read-only).`,
  },
  {
    name: "Click Connect",
    text: "Le Chat auto-detects the auth mode, validates the handshake, and lists six tools. Approve the connector and it appears in your organisation's connector list, ready for any teammate to use.",
  },
  {
    name: "Ask Le Chat about a startup",
    text: "Try: 'Use vc-deal-flow-signal to show the top 10 trending AI/ML startups by engineering acceleration this week.' Le Chat picks the right tool, fetches live data, and renders the result inline.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need a paid Mistral plan to use this?",
    a: "Custom MCP Connectors are available on Le Chat plans that surface the Connectors panel. Adding a custom connector is admin-gated inside an organisation, so you need workspace admin rights to install it for your team, but once installed, every teammate can use it.",
  },
  {
    q: "What protocol does the server speak?",
    a: "Streamable HTTP, the current MCP standard. Endpoint: https://signals.gitdealflow.com/api/mcp/rpc. Protocol version 2025-06-18. Both JSON and Server-Sent Events response modes are supported via the Accept header negotiation. The server also publishes serverInfo with icons, websiteUrl, and capabilities so Le Chat can render the connector card correctly.",
  },
  {
    q: "Is authentication required?",
    a: "No. The MCP server is fully public and read-only. All six tools query a pre-computed weekly dataset of GitHub commit-velocity signals, no PII, no rate-limited downstream APIs, no credentials needed. Mistral's auto-detection picks up No Authentication and skips the OAuth flow.",
  },
  {
    q: "What data does it return?",
    a: "Six tools backed by a 350+-row dataset refreshed weekly: trending startups across 15 sectors, sector-filtered rankings, single-startup deep lookups, dataset metadata, GitHub Scout Score for any user, and the full methodology. Every record includes commit velocity (14-day window), contributor delta, repo expansion, sector, and signal classification (Engineering Acceleration / Contributor Growth / Infrastructure Buildout).",
  },
  {
    q: "Does Le Chat support dynamic tool discovery?",
    a: "Mistral's Custom MCP Connectors statically capture the tool list at install time rather than re-discovering on every call. The VC Deal Flow Signal server publishes a stable tool surface (the same six tools shipped via npm and Glama A-Tier). When new tools land in a major server version, reconnect the connector to refresh the static list.",
  },
  {
    q: "How is this different from installing the npm package locally?",
    a: "Three differences. (1) The Custom Connector route uses the live HTTP endpoint, so you always get the latest server version without re-running npx. (2) It works for every teammate in your Mistral workspace once an admin installs it once, not per-machine. (3) It doesn't need Node.js installed locally. The npm package (@gitdealflow/mcp-signal) is still the right choice for Claude Desktop, Cursor, Cline, and Continue, clients that prefer stdio over remote HTTP.",
  },
  {
    q: "Can I use the same MCP server in Claude Desktop and Cursor?",
    a: "Yes. The same server is published two ways: (a) npm @gitdealflow/mcp-signal for stdio clients (Claude Desktop, Cursor, Cline, Continue), also catalogued at Glama A-Tier (4.9/5.0 across 6 tools), and (b) the Streamable HTTP endpoint at signals.gitdealflow.com/api/mcp/rpc for Mistral Le Chat and any other Streamable HTTP-compatible client. Pick whichever transport your client supports.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: TITLE,
      url: `${SITE}/integrations/mistral`,
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
          {
            "@type": "ListItem",
            position: 2,
            name: "Integrations",
            item: `${SITE}/integrations`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Mistral Le Chat",
            item: `${SITE}/integrations/mistral`,
          },
        ],
      },
    },
    {
      "@type": "HowTo",
      name: "How to add VC Deal Flow Signal as a Mistral Le Chat Custom MCP Connector",
      description:
        "Five-step admin workflow to install the public VC Deal Flow Signal MCP server in a Mistral Le Chat workspace.",
      totalTime: "PT2M",
      step: HOW_TO_STEPS.map((s, idx) => ({
        "@type": "HowToStep",
        position: idx + 1,
        name: s.name,
        text: s.text,
      })),
      tool: [
        { "@type": "HowToTool", name: "Mistral Le Chat (workspace admin)" },
        { "@type": "HowToTool", name: "VC Deal Flow Signal MCP server URL" },
      ],
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
      "@type": "SoftwareApplication",
      name: "VC Deal Flow Signal MCP Server",
      url: `${SITE}/integrations/mistral`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web (Streamable HTTP)",
      description:
        "MCP server exposing six read-only tools over engineering-acceleration signals for 350+ venture-backed startups across 15 sectors. Streamable HTTP, no auth, public dataset.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: {
        "@type": "Organization",
        name: "VC Deal Flow Signal",
        url: "https://gitdealflow.com",
      },
    },
  ],
};

export default function MistralIntegrationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/integrations/mistral" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/integrations"
            className="hover:text-gray-300 transition-colors"
          >
            Integrations
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Mistral Le Chat</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Use VC Deal Flow Signal in Mistral Le Chat
        </h1>
        <p
          className="text-gray-400 text-base leading-relaxed mb-6 max-w-2xl speakable"
          data-agent-summary
        >
          Add the VC Deal Flow Signal MCP server to your Mistral Le Chat
          workspace as a Custom MCP Connector in under two minutes. Public
          Streamable HTTP endpoint, no authentication, six read-only tools for
          venture-backed startup engineering signals across 15 sectors. Once an
          admin installs the connector, every teammate can ask Le Chat about
          breakout startups directly in chat.
        </p>

        <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-4 mb-10 text-sm">
          <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live Streamable HTTP endpoint
          </div>
          <code className="text-emerald-300 font-mono text-xs break-all">
            {MCP_URL}
          </code>
        </div>

        <section className="mb-12" aria-labelledby="install-steps">
          <h2
            id="install-steps"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            Install in 5 steps
          </h2>
          <ol className="space-y-4">
            {HOW_TO_STEPS.map((s, idx) => (
              <li
                key={s.name}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-950 border border-sky-900 text-sky-400 text-xs font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-gray-100 font-semibold mb-1">
                      {s.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {s.text}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12" aria-labelledby="tools-list">
          <h2
            id="tools-list"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            Six tools you get
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 divide-y divide-slate-800">
            {TOOLS.map((t) => (
              <div key={t.name} className="p-4 sm:p-5">
                <code className="text-emerald-400 font-mono text-sm">
                  {t.name}
                </code>
                <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                  {t.summary}
                </p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-3">
            All tools are read-only, idempotent, and closed-world (no external
            crawl on demand). Annotations exposed via the MCP{" "}
            <code className="font-mono text-gray-400">tools/list</code>{" "}
            response.
          </p>
        </section>

        <section className="mb-12" aria-labelledby="faq">
          <h2
            id="faq"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            FAQ
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5 group"
              >
                <summary className="text-gray-100 font-semibold cursor-pointer list-none flex items-start justify-between gap-4">
                  <span>{f.q}</span>
                  <span className="text-sky-500 text-xl leading-none flex-shrink-0 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-gray-400 text-sm leading-relaxed mt-3">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-12" aria-labelledby="other-clients">
          <h2
            id="other-clients"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            Not on Mistral?
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 text-sm text-gray-400 leading-relaxed">
            <p className="mb-3">
              The same server ships three ways:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <Link
                  href="https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal"
                  className="text-sky-500 hover:text-sky-400 font-medium"
                >
                  Glama
                </Link>{" "}
A-Tier MCP catalog (4.9/5.0 across 6 tools). One-line install
                via{" "}
                <code className="font-mono text-gray-300 text-xs">npx -y @gitdealflow/mcp-signal</code>{" "}
                for Claude Desktop, Cursor, Cline, Continue.
              </li>
              <li>
                <Link
                  href="https://www.npmjs.com/package/@gitdealflow/mcp-signal"
                  className="text-sky-500 hover:text-sky-400 font-medium"
                >
                  npm @gitdealflow/mcp-signal
                </Link>{" "}
stdio install for any MCP-compatible client. Run{" "}
                <code className="font-mono text-gray-300">
                  npx -y @gitdealflow/mcp-signal
                </code>
                .
              </li>
              <li>
                <code className="font-mono text-gray-300 break-all">
                  {MCP_URL}
                </code>{" "}
public Streamable HTTP endpoint for Mistral Le Chat and any
                other Streamable HTTP-compatible client.
              </li>
            </ul>
          </div>
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Stuck on the install?
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Email signals@gitdealflow.com, replies within 24 hours, EU business
            time. Common gotchas (workspace admin rights, server URL trailing
            slash, Mistral region) are documented in the FAQ above.
          </p>
          <Link
            href="mailto:signals@gitdealflow.com?subject=Mistral%20Le%20Chat%20MCP%20install%20help"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-medium transition-colors"
          >
            Email support
          </Link>
        </div>
      </div>
    </>
  );
}
