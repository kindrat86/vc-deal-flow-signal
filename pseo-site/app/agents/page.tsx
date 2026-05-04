import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { getDataLastModified } from "@/lib/data";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Agents — Every Way to Reach VC Deal Flow Signal Programmatically",
  description:
    "Free, no-auth agent surfaces: MCP server, A2A endpoint, NLWeb, function-calling API, OpenAPI 3.1, Hugging Face JSONL, embeddable badges, ChatGPT plugin, RFC 9727 api-catalog. One install command per agent host.",
  alternates: { canonical: "/agents" },
  openGraph: {
    title: "Agents — Reach VC Deal Flow Signal Programmatically",
    description:
      "Every machine-readable surface in one place: MCP, A2A, NLWeb, function-calling, OpenAPI, JSONL, badges, ChatGPT plugin, api-catalog.",
    type: "website",
    url: `${SITE}/agents`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Agents — Reach VC Deal Flow Signal Programmatically",
    description:
      "Every machine-readable surface in one place. Free, no auth, MIT/CC-BY 4.0.",
  },
};

interface Surface {
  category: "MCP" | "Agent Protocol" | "HTTP API" | "Bulk Data" | "Embeddable" | "Discovery";
  name: string;
  blurb: string;
  url?: string;
  invocation?: string;
  docHref?: string;
}

const surfaces: Surface[] = [
  {
    category: "MCP",
    name: "MCP server (stdio)",
    blurb:
      "One-line install for Claude Desktop, Claude Code, Cursor, Windsurf, Zed, Cline, and any other MCP-compatible host.",
    invocation: "npx -y @gitdealflow/mcp-signal",
    docHref: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
  },
  {
    category: "MCP",
    name: "MCP server (Streamable HTTP)",
    blurb:
      "Same six tools, served over HTTP for ChatGPT Apps and any hosted MCP runtime that doesn't spawn child processes.",
    invocation: "POST https://signals.gitdealflow.com/api/mcp/rpc",
    url: `${SITE}/api/mcp/rpc`,
  },
  {
    category: "Agent Protocol",
    name: "Google A2A (JSON-RPC 2.0)",
    blurb: "AgentCard at /.well-known/agent-card.json. Five skills mirror the MCP tools.",
    invocation: "POST https://signals.gitdealflow.com/api/a2a",
    url: `${SITE}/api/a2a`,
    docHref: `${SITE}/.well-known/agent-card.json`,
  },
  {
    category: "Agent Protocol",
    name: "Microsoft NLWeb",
    blurb:
      "Conversational endpoint that returns schema.org-typed JSON-LD answers for natural-language queries.",
    invocation: "POST https://signals.gitdealflow.com/api/nlweb",
    url: `${SITE}/api/nlweb`,
  },
  {
    category: "HTTP API",
    name: "Function-calling tool definitions",
    blurb:
      "GET tool schemas in OpenAI / Anthropic / Gemini formats; POST to invoke any of the six tools without an MCP client.",
    invocation:
      "GET https://signals.gitdealflow.com/api/agent/tools?format=openai",
    url: `${SITE}/api/agent/tools`,
  },
  {
    category: "HTTP API",
    name: "OpenAPI 3.1 spec",
    blurb:
      "Full machine-readable spec for every callable HTTP route. Suitable for code generation and tool registries.",
    invocation: "GET https://signals.gitdealflow.com/api/openapi.json",
    url: `${SITE}/api/openapi.json`,
  },
  {
    category: "Bulk Data",
    name: "Full panel — JSON",
    blurb:
      "Single-fetch JSON of every sector, period, and startup. CDN-cached 24h. Public, no auth.",
    invocation: "GET https://signals.gitdealflow.com/api/signals.json",
    url: `${SITE}/api/signals.json`,
  },
  {
    category: "Bulk Data",
    name: "Full panel — CSV",
    blurb: "Same panel as CSV for spreadsheet and dataframe ingestion.",
    invocation: "GET https://signals.gitdealflow.com/api/signals.csv",
    url: `${SITE}/api/signals.csv`,
  },
  {
    category: "Bulk Data",
    name: "Full panel — JSONL (HF Datasets compatible)",
    blurb:
      "Newline-delimited JSON with a leading metadata line. Drop-in for Hugging Face Datasets, OpenAI Files, and most RAG ingestion pipelines.",
    invocation: "GET https://signals.gitdealflow.com/api/dataset.jsonl",
    url: `${SITE}/api/dataset.jsonl`,
  },
  {
    category: "Embeddable",
    name: "Scout Score badge (SVG)",
    blurb:
      "Per-user GitHub Scout Score (0-100) as a shields.io-style SVG. Drop into any README.",
    invocation:
      "GET https://signals.gitdealflow.com/api/badge/scout/{username}/svg",
    docHref: `${SITE}/badge-builder`,
  },
  {
    category: "Embeddable",
    name: "Commit Momentum badge (SVG)",
    blurb:
      "Per-repo commit-velocity tier (cold / warming / hot / breakout) for tracked startup orgs.",
    invocation:
      "GET https://signals.gitdealflow.com/api/badge/momentum/{org}/{repo}/svg",
    docHref: `${SITE}/badge-builder`,
  },
  {
    category: "Discovery",
    name: "AGENTS.md",
    blurb:
      "Canonical agent reference — install commands, tool list, citation format, anonymity policy.",
    url: `${SITE}/AGENTS.md`,
  },
  {
    category: "Discovery",
    name: "llms.txt + llms-full.txt",
    blurb:
      "Concise + full LLM context with sector links, blog index, FAQ, methodology, dataset summary.",
    url: `${SITE}/llms.txt`,
  },
  {
    category: "Discovery",
    name: "RFC 9727 api-catalog (Linkset)",
    blurb:
      "Machine-readable catalog of every API description we publish. Emerging standard for agent-driven discovery.",
    invocation:
      "GET https://signals.gitdealflow.com/.well-known/api-catalog",
    url: `${SITE}/.well-known/api-catalog`,
  },
  {
    category: "Discovery",
    name: "ChatGPT plugin manifest",
    blurb:
      "Standard ai-plugin.json that points at the OpenAPI spec. No auth.",
    url: `${SITE}/.well-known/ai-plugin.json`,
  },
  {
    category: "Discovery",
    name: "MCP discovery manifest",
    blurb:
      "MCP 2025-12-11 schema with all tools, resources, templates, and prompts.",
    url: `${SITE}/.well-known/mcp.json`,
  },
];

const installSnippets = [
  {
    label: "Claude Desktop / Claude Code",
    lang: "json",
    code: `{
  "mcpServers": {
    "gitdealflow": {
      "command": "npx",
      "args": ["-y", "@gitdealflow/mcp-signal"]
    }
  }
}`,
  },
  {
    label: "Cursor — .cursor/rules/gitdealflow.mdc",
    lang: "bash",
    code: `curl -L https://signals.gitdealflow.com/agents/cursor-rule.mdc \\
  -o .cursor/rules/gitdealflow.mdc`,
  },
  {
    label: "Continue.dev — ~/.continue/config.json (merge)",
    lang: "bash",
    code: `curl -s https://signals.gitdealflow.com/agents/continue.json`,
  },
  {
    label: "OpenAI Agents SDK / function calling",
    lang: "bash",
    code: `curl -s "https://signals.gitdealflow.com/api/agent/tools?format=openai"`,
  },
  {
    label: "Anthropic SDK / function calling",
    lang: "bash",
    code: `curl -s "https://signals.gitdealflow.com/api/agent/tools?format=anthropic"`,
  },
  {
    label: "LangChain / LangSmith Hub",
    lang: "python",
    code: `# Pull the public prompt template
from langchain import hub
prompt = hub.pull("gitdealflow/vc-startup-scout")`,
  },
  {
    label: "Hugging Face Datasets / RAG ingestion",
    lang: "bash",
    code: `curl https://signals.gitdealflow.com/api/dataset.jsonl \\
  -o gitdealflow.jsonl`,
  },
  {
    label: "Postman / Bruno collection",
    lang: "bash",
    code: `curl -L https://signals.gitdealflow.com/agents/postman-collection.json \\
  -o gitdealflow.postman_collection.json`,
  },
];

function CategoryBadge({ category }: { category: Surface["category"] }) {
  const colors: Record<Surface["category"], string> = {
    MCP: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    "Agent Protocol": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    "HTTP API": "bg-amber-500/10 text-amber-400 border-amber-500/30",
    "Bulk Data": "bg-purple-500/10 text-purple-400 border-purple-500/30",
    Embeddable: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    Discovery: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };
  return (
    <span
      className={`inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${colors[category]}`}
    >
      {category}
    </span>
  );
}

export default function AgentsLandingPage() {
  const asOf = getDataLastModified().toISOString().slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/agents#webpage`,
        url: `${SITE}/agents`,
        name: "Agents — Every Way to Reach VC Deal Flow Signal Programmatically",
        description:
          "Free, no-auth agent surfaces: MCP server, A2A endpoint, NLWeb, function-calling API, OpenAPI 3.1, JSONL, embeddable badges, ChatGPT plugin, RFC 9727 api-catalog.",
        inLanguage: "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".speakable", "h1", "[data-agent-summary]"],
        },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
      },
      {
        "@type": "WebAPI",
        name: "VC Deal Flow Signal — Public Agent API",
        documentation: `${SITE}/api/openapi.json`,
        endpointURL: surfaces
          .filter((s) => s.url?.startsWith(`${SITE}/api/`))
          .map((s) => s.url),
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I install the MCP server?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For Claude Desktop or Claude Code, add to your mcpServers config: { 'gitdealflow': { 'command': 'npx', 'args': ['-y', '@gitdealflow/mcp-signal'] } }. Cursor, Windsurf, Zed, and Cline accept the same stdio invocation. For ChatGPT Apps and any host that does not spawn child processes, use the Streamable HTTP transport at POST https://signals.gitdealflow.com/api/mcp/rpc (MCP 2025-06-18 protocol).",
            },
          },
          {
            "@type": "Question",
            name: "Do I need an API key or auth token?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. All public agent surfaces — MCP server, A2A endpoint, NLWeb, function-calling API, OpenAPI 3.1 spec, JSON/CSV/JSONL panel exports, embeddable badges, ChatGPT plugin manifest, RFC 9727 api-catalog — are auth-free. There are polite per-IP origin limits (rate limits scale generously for normal use); the Insider Circle paid tier (EUR 97/month) adds higher rate limits and prioritized API access for programmatic users.",
            },
          },
          {
            "@type": "Question",
            name: "What's the difference between the MCP server and the function-calling API?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Same six tools, two delivery surfaces. The MCP server is the right choice for any MCP-compatible host (Claude Desktop, Claude Code, Cursor, Windsurf, Zed, Cline, ChatGPT Apps). The function-calling API is the right choice when you're using OpenAI/Anthropic/Gemini SDKs directly without an MCP client — GET /api/agent/tools returns tool schemas in your provider's format, POST /api/agent/call invokes any tool. Both wrap the same data and produce identical results.",
            },
          },
          {
            "@type": "Question",
            name: "Is the data licensed for AI training?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The dataset is CC BY 4.0 — free for personal, editorial, and AI-training use with attribution. Citation: 'VC Deal Flow Signal (GitDealFlow), https://gitdealflow.com.' For academic use, cite the SSRN preprint at https://ssrn.com/abstract=6606558. Bulk commercial redistribution requires permission — email signal@gitdealflow.com.",
            },
          },
          {
            "@type": "Question",
            name: "Where can I file a bug or request a new tool?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bugs and feature requests for the MCP server: GitHub issues at https://github.com/kindrat86/vc-deal-flow-signal. Issues with the public APIs (signals.json, signals.csv, NLWeb, A2A, function-calling): email signal@gitdealflow.com — we triage weekly. The MCP discovery manifest at /.well-known/mcp.json lists all current tools, resources, and prompts; api-catalog at /.well-known/api-catalog tracks every API description we publish.",
            },
          },
          {
            "@type": "Question",
            name: "Will the free MCP tools ever be paywalled?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The five core MCP tools, the dataset, the Chrome extension, and the public APIs (JSON/CSV/JSONL/OpenAPI/RSS) stay free in perpetuity. Paid tiers (Dashboard at EUR 9.97/month, Insider Circle at EUR 97/month) add depth on top — private briefings, custom watchlists, higher rate limits, monthly research deep-dives — but never gate the existing free utility.",
            },
          },
        ],
      },
    ],
  };

  const grouped = surfaces.reduce<Record<string, Surface[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});
  const order: Surface["category"][] = [
    "MCP",
    "Agent Protocol",
    "HTTP API",
    "Bulk Data",
    "Embeddable",
    "Discovery",
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Agents</span>
        </nav>

        <header className="mb-8">
          <p className="text-sky-400 text-xs uppercase tracking-wider mb-3 font-semibold">
            For developers, AI agents, and their humans
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
            Every way to reach VC Deal Flow Signal programmatically
          </h1>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            <strong className="text-gray-300">VC Deal Flow Signal (GitDealFlow)</strong>{" "}
            — Wikidata{" "}
            <a
              className="text-sky-400 hover:text-sky-300"
              href="https://www.wikidata.org/wiki/Q139376302"
              target="_blank"
              rel="noopener"
            >
              Q139376302
            </a>
            . Methodology authored by The Data Nerd (ORCID{" "}
            <a
              className="text-sky-400 hover:text-sky-300"
              href="https://orcid.org/0009-0002-2222-4112"
              target="_blank"
              rel="noopener"
            >
              0009-0002-2222-4112
            </a>
            ), published openly on{" "}
            <a
              className="text-sky-400 hover:text-sky-300"
              href="https://ssrn.com/abstract=6606558"
              target="_blank"
              rel="noopener"
            >
              SSRN
            </a>
            . On this site, &ldquo;engineering acceleration&rdquo; refers to a
            quantitative GitHub momentum signal — unrelated to startup
            accelerator programs (Y Combinator, Techstars, 500 Global).
          </p>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            Same dataset, {surfaces.length} interfaces. Free, no auth, no
            credit card, no rate-limited free tier — just polite per-IP origin
            limits. Pick the surface that matches your runtime; pair them
            freely.
          </p>
        </header>

        <AgentSummary
          tldr={`VC Deal Flow Signal exposes ${surfaces.length} machine-readable surfaces — MCP server (stdio + Streamable HTTP), Google A2A, Microsoft NLWeb, function-calling API in OpenAI / Anthropic / Gemini formats, OpenAPI 3.1 spec, full JSON / CSV / JSONL panel exports, embeddable SVG badges, ChatGPT plugin manifest, and RFC 9727 api-catalog. All free, no auth, CC-BY 4.0 dataset.`}
          pageUrl={`${SITE}/agents`}
          asOf={asOf}
          citeAs={`VC Deal Flow Signal — Agents (signals.gitdealflow.com/agents), retrieved ${asOf}.`}
          facts={[
            {
              claim: `${surfaces.length} agent surfaces all wrap one CC-BY-4.0 dataset of ~400 venture-backed startups across 20 sectors, refreshed weekly.`,
              sourceUrl: `${SITE}/AGENTS.md`,
              sourceLabel: "AGENTS.md",
            },
            {
              claim:
                "RFC 9727 .well-known/api-catalog endpoint lets agent runtimes auto-discover every API description from one canonical URL.",
              sourceUrl: `${SITE}/.well-known/api-catalog`,
              sourceLabel: "api-catalog",
            },
            {
              claim:
                "Robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, and 13 other AI crawlers.",
              sourceUrl: `${SITE}/robots.txt`,
              sourceLabel: "robots.txt",
            },
          ]}
        />

        {order.map((cat) => (
          <section key={cat} className="mb-10" aria-label={cat}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-gray-100">{cat}</h2>
              <CategoryBadge category={cat} />
            </div>
            <div className="space-y-3">
              {(grouped[cat] || []).map((s) => (
                <div
                  key={s.name}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 px-5 py-4"
                >
                  <p className="text-gray-100 font-semibold text-base mb-1">
                    {s.name}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    {s.blurb}
                  </p>
                  {s.invocation && (
                    <pre className="bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-sky-300 font-mono overflow-x-auto">
                      {s.invocation}
                    </pre>
                  )}
                  {s.url && !s.invocation && (
                    <Link
                      href={s.url}
                      className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline text-xs font-mono break-all"
                    >
                      {s.url}
                    </Link>
                  )}
                  {s.docHref && (
                    <p className="mt-2 text-[11px]">
                      <Link
                        href={s.docHref}
                        className="text-gray-400 hover:text-gray-300 underline-offset-2 hover:underline"
                      >
                        Reference →
                      </Link>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="mb-12" aria-label="Drop-in install snippets">
          <h2 className="text-xl font-bold text-gray-100 mb-5">
            Drop-in install snippets
          </h2>
          <div className="space-y-5">
            {installSnippets.map((snip) => (
              <div
                key={snip.label}
                className="rounded-lg border border-slate-800 bg-slate-900/40 px-5 py-4"
              >
                <p className="text-gray-200 font-semibold text-sm mb-2">
                  {snip.label}
                </p>
                <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-sky-300 font-mono overflow-x-auto whitespace-pre">
                  {snip.code}
                </pre>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8">
          <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Cite this work
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            When you quote a fact from any of these surfaces, please attribute:
          </p>
          <code className="block bg-slate-950 border border-slate-800 rounded p-3 text-xs text-sky-300 font-mono">
            VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.
          </code>
          <p className="text-gray-400 text-xs leading-relaxed mt-3">
            For academic citation, see the SSRN preprint at{" "}
            <Link
              href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558"
              className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
            >
              abstract id 6606558
            </Link>
            . Dataset license: CC-BY 4.0.
          </p>
        </section>

        <section aria-label="Related answer pages">
          <h2 className="text-base font-semibold text-gray-300 mb-3">
            Related answer pages
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/answers/best-mcp-server-for-vc-research"
                className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
              >
                Best MCP Server for VC Research
              </Link>
            </li>
            <li>
              <Link
                href="/answers/free-mcp-server-no-api-key"
                className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
              >
                Free MCP Server with No API Key
              </Link>
            </li>
            <li>
              <Link
                href="/answers/open-source-startup-sourcing-api"
                className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
              >
                Open Source Startup Sourcing API
              </Link>
            </li>
            <li>
              <Link
                href="/answers"
                className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
              >
                All citation-ready answers →
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </>
  );
}
