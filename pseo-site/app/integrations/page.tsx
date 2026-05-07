import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integrations — MCP, Telegram, Email, RSS, API",
  description:
    "Plug VC Deal Flow Signal into your existing workflow. MCP server for Claude and Cursor, Telegram channel, weekly email, JSON/CSV API, RSS feed, and Zapier.",
  alternates: {
    canonical: "/integrations",
  },
};

interface Integration {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "live" | "beta" | "soon";
  href: string;
  docsHref?: string;
  category: "AI" | "Messaging" | "Email" | "Data" | "Automation";
  setup: string;
}

const integrations: Integration[] = [
  {
    slug: "mcp",
    name: "MCP Server",
    tagline: "Claude, Cursor, Windsurf, and any MCP-compatible assistant",
    description:
      "Query VC Deal Flow Signal directly from Claude, Cursor, Windsurf, or any MCP-compatible client. Six tools expose trending startups, sector signals, individual startup lookups, dataset summary, Scout receipts, and methodology. Published on npm as @gitdealflow/mcp-signal, catalogued at Glama A-Tier (4.9/5.0 across 6 tools), and live as a Streamable HTTP endpoint at signals.gitdealflow.com/api/mcp/rpc.",
    status: "live",
    href: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
    docsHref: "https://gitdealflow.com/#mcp",
    category: "AI",
    setup: "npx @gitdealflow/mcp-signal@latest",
  },
  {
    slug: "mistral",
    name: "Mistral Le Chat",
    tagline: "Add as Custom MCP Connector — six read-only tools, no auth",
    description:
      "Workspace admins can plug VC Deal Flow Signal into Mistral Le Chat as a Custom MCP Connector in under two minutes. The public Streamable HTTP endpoint exposes the same six tools (trending startups, sector signals, startup lookup, Scout receipts, methodology, dataset snapshot) to every teammate once installed once.",
    status: "live",
    href: "/integrations/mistral",
    docsHref: "https://docs.mistral.ai/le-chat/knowledge-integrations/connectors/mcp-connectors",
    category: "AI",
    setup: "Settings → Connectors → + Add Connector → Custom MCP",
  },
  {
    slug: "chatgpt",
    name: "ChatGPT GPT",
    tagline: "GitHub VC Signal — public OpenAPI Action, four tools, no setup",
    description:
      "Use the GitHub VC Signal GPT directly inside ChatGPT (Plus, Team, Enterprise, Edu). The Action calls signals.gitdealflow.com under the hood — same dataset, same classifications, same weekly refresh as the MCP server. Four read-only Actions: getAllSignals, getStartupSignal, getSignalsSummary, getMethodology. No install, no auth, no setup. OpenAPI 3.1 spec at signals.gitdealflow.com/api/actions/openapi.json for anyone building their own GPT or agent.",
    status: "live",
    href: "https://chatgpt.com/g/g-69f76b9b3b308191b6948bff20c0fbf8-github-vc-signal",
    docsHref: "/integrations/chatgpt",
    category: "AI",
    setup: "Open chatgpt.com/g/g-69f76b9b... — no install required",
  },
  {
    slug: "telegram",
    name: "Telegram Channel",
    tagline: "Weekly breakout startups, pushed to your Telegram",
    description:
      "Public @gitdealflow channel delivers the weekly Signal Report and sector alerts. The paid Insider Circle is a separate private Telegram group with 85+ ranked startups per week, filter-ready data, and a direct line to the founder.",
    status: "live",
    href: "https://t.me/gitdealflow",
    category: "Messaging",
    setup: "Join t.me/gitdealflow — no signup required",
  },
  {
    slug: "email",
    name: "Weekly Email",
    tagline: "Five breakout startups in your inbox every Monday",
    description:
      "The free Signal Report: one email per week, five startups ranked by GitHub engineering acceleration, with the signal type (commit spike, contributor growth, infrastructure buildout) and a direct link to each organisation. No ads, no tracker pixels beyond basic open rates.",
    status: "live",
    href: "https://gitdealflow.com/#signup",
    category: "Email",
    setup: "Enter your email on the landing page",
  },
  {
    slug: "rss",
    name: "RSS Feed",
    tagline: "Machine-readable weekly signals for your feed reader or automation",
    description:
      "Full RSS 2.0 feed with weekly signal entries, sector tags, and enriched content:encoded blocks. Works with Feedly, Inoreader, NetNewsWire, or any RSS-consuming automation (n8n, Zapier, Make, IFTTT). Good choice if you want signals without another inbox.",
    status: "live",
    href: "https://signals.gitdealflow.com/feed.xml",
    category: "Data",
    setup: "Add https://signals.gitdealflow.com/feed.xml to your RSS reader",
  },
  {
    slug: "json-api",
    name: "JSON / CSV API",
    tagline: "Raw signal data for downstream analysis and automation",
    description:
      "Public JSON and CSV endpoints expose the full current-period signal set: startup name, sector, signal type, GitHub org, commit velocity change, contributor delta. Use for internal dashboards, CRM enrichment, or feeding an LLM agent.",
    status: "live",
    href: "https://signals.gitdealflow.com/api/signals.json",
    docsHref: "https://signals.gitdealflow.com/api/openapi.json",
    category: "Data",
    setup: "curl https://signals.gitdealflow.com/api/signals.json",
  },
  {
    slug: "zapier",
    name: "Zapier Integration",
    tagline: "Connect signals to 7,000+ Zapier apps",
    description:
      "Private Zapier integration (v1.0.3) with triggers for new weekly signals and new startups by sector. Pipe signals into Notion, Airtable, Slack, Google Sheets, HubSpot, or any Zapier-supported destination. Moving to public release once the three-user threshold is cleared.",
    status: "beta",
    href: "https://zapier.com/",
    category: "Automation",
    setup: "Private invite during beta — email signal@gitdealflow.com",
  },
  {
    slug: "chrome-extension",
    name: "Chrome Extension — Crunchbase + Wellfound badge",
    tagline: "Engineering signal badge on Crunchbase and Wellfound profiles",
    description:
      "Inline badge that appears on Crunchbase and Wellfound company profile pages with the current engineering signal status for that startup. Works passively — no extra clicks, no login required, no telemetry.",
    status: "live",
    href: "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
    category: "AI",
    setup: "Install from Chrome Web Store",
  },
  {
    slug: "chrome-extension-github-lookup",
    name: "Chrome Extension — VC GitHub Lookup",
    tagline: "Hover any GitHub repo or org for live startup signals",
    description:
      "Hover any link to github.com/<owner> or github.com/<owner>/<repo> and instantly see commit velocity (14d), velocity change, contributor count and growth, signal type (hiring burst, reorg, breakout, …), and a stage estimate. A chip is also injected on direct repo or org page loads, and the toolbar opens a manual lookup form for any GitHub URL. Manifest V3, ~16 KB, no telemetry.",
    status: "live",
    href: "https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm",
    category: "AI",
    setup: "Install from Chrome Web Store",
  },
  {
    slug: "llms-txt",
    name: "llms.txt & llms-full.txt",
    tagline: "LLM-friendly site map for AI assistants and AEO",
    description:
      "Standard llms.txt and llms-full.txt files describing the site structure, endpoints, and key data for AI search engines (Perplexity, ChatGPT, Claude, Copilot). Used by AEO-aware crawlers to build accurate answers about the product.",
    status: "live",
    href: "https://signals.gitdealflow.com/llms.txt",
    docsHref: "https://signals.gitdealflow.com/llms-full.txt",
    category: "AI",
    setup: "Automatic — AI assistants discover and use these files",
  },
  {
    slug: "agent-runtimes",
    name: "Agent runtimes (Cursor, Cline, Goose, OpenHands, Aider, Raycast)",
    tagline: "One npm package, seven runtimes — cross-listed in every agent-runtime marketplace",
    description:
      "Single hub page with copy-paste install snippets for Cursor, Cline (VS Code), Block Goose, OpenHands, Aider (via mcpm-aider), AiderDesk, and Raycast. Marketplace submissions live at cursor.directory, cline/mcp-marketplace#1491, aaif-goose/goose#8974, raycast/extensions#27618. OpenHands / Aider / AiderDesk have no marketplace surface — config-only via per-user JSON.",
    status: "live",
    href: "/integrations/agent-runtimes",
    docsHref: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
    category: "AI",
    setup: "npx -y @gitdealflow/mcp-signal — same command, every runtime",
  },
  {
    slug: "for-langchain",
    name: "GitDealFlow for LangChain",
    tagline: "Drop into ReAct loops, LangGraph state machines, langchain-mcp-adapters",
    description:
      "Programmatic landing for LangChain builders. Includes a 20-line @tool starter, a LangGraph two-node deal-memo pipeline, FAQ, and gotchas. Works with any LangChain chat model — OpenAI, Anthropic, Mistral, Bedrock, Vertex, Cohere.",
    status: "live",
    href: "/for-langchain",
    docsHref: "https://signals.gitdealflow.com/api/a2a",
    category: "AI",
    setup: "@tool gitdealflow(skill, args) → POST /api/a2a",
  },
  {
    slug: "for-crewai",
    name: "GitDealFlow for CrewAI",
    tagline: "Three-agent scout / analyst / skeptic crew template",
    description:
      "Multi-agent orchestration shipped as one BaseTool that every Agent on the crew can call. Includes a Pydantic args_schema variant for typed args and a Monday-cron weekly digest pattern. Works on CrewAI Studio (no-code) too.",
    status: "live",
    href: "/for-crewai",
    docsHref: "https://docs.crewai.com/concepts/tools",
    category: "AI",
    setup: "class GitDealFlowTool(BaseTool) → tools=[tool] on every Agent",
  },
  {
    slug: "for-letta",
    name: "GitDealFlow for Letta",
    tagline: "Stateful VC analyst agents with persistent archival memory",
    description:
      "Letta agents (formerly MemGPT) keep a watchlist memory of every startup they've scouted. Includes a tool upsert + agent create + cross-session recall pattern. Best fit for personal scouting assistants that compound knowledge.",
    status: "live",
    href: "/for-letta",
    docsHref: "https://docs.letta.com",
    category: "AI",
    setup: "client.tools.upsert_from_function(func=gitdealflow_query)",
  },
  {
    slug: "for-mastra",
    name: "GitDealFlow for Mastra",
    tagline: "Type-safe TypeScript agents inside Next.js or Hono",
    description:
      "Mastra ships first-class MCP via @gitdealflow/mcp-signal plus an edge-safe A2A fallback. Best fit when your portfolio dashboard and your deal-flow agent live in the same codebase. AI Gateway routing via plain string model IDs.",
    status: "live",
    href: "/for-mastra",
    docsHref: "https://mastra.ai/docs",
    category: "AI",
    setup: 'new MCPClient({ servers: { gitdealflow: { command: "npx", args: ["@gitdealflow/mcp-signal@latest"] }}})',
  },
  {
    slug: "for-vercel-ai-sdk",
    name: "GitDealFlow for the Vercel AI SDK",
    tagline: "tool() + Zod + AI Gateway for Server Components and chat routes",
    description:
      "The cleanest path inside a Next.js app: tool() with a Zod schema, plain string model IDs that route through the AI Gateway, toUIMessageStreamResponse() for streaming chat, unstable_cache for Server Component fetches.",
    status: "live",
    href: "/for-vercel-ai-sdk",
    docsHref: "https://ai-sdk.dev",
    category: "AI",
    setup: "tool({ inputSchema: z.object({ skill, args }), execute })",
  },
];

function statusBadge(status: Integration["status"]) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Live
      </span>
    );
  }
  if (status === "beta") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-950/50 border border-sky-900/50 px-2.5 py-0.5 text-xs font-medium text-sky-400">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
        Beta
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-0.5 text-xs font-medium text-gray-400">
      Coming soon
    </span>
  );
}

export default function IntegrationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "VC Deal Flow Signal Integrations",
        description:
          "MCP server, Telegram, email, RSS, JSON/CSV API, Zapier, and Chrome extension integrations for VC Deal Flow Signal.",
        url: "https://signals.gitdealflow.com/integrations",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListElement: integrations.map((i, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: i.name,
          url: i.href,
          description: i.tagline,
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
            name: "Integrations",
            item: "https://signals.gitdealflow.com/integrations",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What integrations does VC Deal Flow Signal support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The product integrates with Claude Desktop, Claude Code, and Cursor via the Model Context Protocol (MCP) server, with Slack via webhooks for alert routing, with Zapier and n8n for automation pipelines, with email via the weekly Signal Report and the API, and with Data.world for direct dataset auto-sync. The JSON API allows direct integration with any internal CRM (Affinity, HubSpot, Salesforce) or data warehouse (Snowflake, BigQuery, PostgreSQL).",
            },
          },
          {
            "@type": "Question",
            name: "How do I install the MCP server?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Run npx -y @gitdealflow/mcp-signal in your terminal, or add the configuration to your Claude Desktop or Claude Code mcpServers config: command npx, args [-y, @gitdealflow/mcp-signal]. The server provides six tools: trending startups, sector signals, startup lookup, dataset summary, scout receipts, and methodology. Installation typically takes under two minutes.",
            },
          },
          {
            "@type": "Question",
            name: "Is the API free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The basic JSON endpoints (signals.json, weekly summary, methodology) are free with reasonable rate limits suitable for individual investors and small funds. Higher-volume API access for commercial pipelines is available with the Insider Circle tier (EUR 97/month) which includes elevated rate limits and webhook delivery. No enterprise contract is required.",
            },
          },
          {
            "@type": "Question",
            name: "Can I pipe signals into Affinity, HubSpot, or Salesforce?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The JSON API is designed to be wired into any CRM through Zapier, n8n, or direct API calls. Most funds use a weekly cron that pulls the latest signals, dedupes against existing CRM records, and creates new opportunities or enrichment events for matched companies. Email signal@gitdealflow.com if you want a worked example for your specific CRM.",
            },
          },
          {
            "@type": "Question",
            name: "Does the product support webhooks?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Webhook delivery is available on the Insider Circle tier. Subscribed webhooks fire when a watched startup crosses a configurable acceleration threshold, when a new breakout enters a watched sector, or when the weekly Signal Report publishes. Most subscribers route webhooks into Slack, Discord, or internal Slack-bot infrastructure for real-time alerting.",
            },
          },
          {
            "@type": "Question",
            name: "How do I integrate with Slack?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Two integration patterns work well. The simpler pattern uses Zapier or n8n to consume the weekly RSS or JSON endpoint and post a digest to a Slack channel every Monday morning. The more advanced pattern uses the Insider Circle webhook delivery, configured to POST to a Slack incoming webhook URL whenever a watched signal fires. Many funds run both — the digest for top-of-funnel review and the webhook for real-time alerts on portfolio companies.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a Chrome extension?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The free Chrome/Brave/Edge extension adds a GitHub momentum badge to Crunchbase and Wellfound startup profile pages. When you visit a startup's Crunchbase page, the extension surfaces the engineering acceleration data inline so you can see the signal without leaving the source you were already using. The extension is approximately 30 KB and requires no account or login.",
            },
          },
        ],
      },
    ],
  };

  const categories: Integration["category"][] = ["AI", "Messaging", "Email", "Data", "Automation"];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Integrations</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Integrations
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-2xl">
          Plug VC Deal Flow Signal into your existing workflow. Nine ways to
          get engineering acceleration signals where you already work — AI
          assistants, messaging, email, raw data, and automation.
        </p>

        {categories.map((cat) => {
          const items = integrations.filter((i) => i.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat} className="mb-12" aria-label={`${cat} integrations`}>
              <h2 className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4">
                {cat}
              </h2>
              <div className="grid gap-4">
                {items.map((i) => (
                  <div
                    key={i.slug}
                    className="rounded-lg border border-slate-800 bg-slate-900 p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-gray-100 font-semibold text-lg">
                        {i.name}
                      </h3>
                      {statusBadge(i.status)}
                    </div>
                    <p className="text-sky-400 text-sm font-medium mb-3">
                      {i.tagline}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {i.description}
                    </p>
                    <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2 mb-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                      {i.setup}
                    </div>
                    <div className="flex gap-3 text-xs">
                      <Link
                        href={i.href}
                        className="text-sky-500 hover:text-sky-400 font-medium transition-colors"
                      >
                        Open &rarr;
                      </Link>
                      {i.docsHref && (
                        <Link
                          href={i.docsHref}
                          className="text-gray-400 hover:text-gray-300 font-medium transition-colors"
                        >
                          Docs
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center mt-8">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Want an integration that isn&apos;t here?
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Slack, Microsoft Teams, Discord webhook, n8n node, or something custom — email signal@gitdealflow.com and it will get prioritised.
          </p>
          <Link
            href="mailto:signal@gitdealflow.com"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Request an integration
          </Link>
        </div>

        {/* Pricing CTA — most integrations evaluators are tool-shopping */}
        <div className="rounded-xl border border-sky-800 bg-sky-950/20 p-6 sm:p-8 text-center mt-6">
          <h2 className="text-sky-200 font-semibold text-lg mb-2">
            What does it cost?
          </h2>
          <p className="text-gray-300 text-sm mb-5 max-w-lg mx-auto">
            Free weekly digest plus a free MCP server (five read-only tools, never gated). Paid tiers from &euro;7 one-time to &euro;1,997 one-time, with founding-member rates on the recurring plans.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            See full pricing &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
