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
      "Query VC Deal Flow Signal directly from Claude, Cursor, Windsurf, or any MCP-compatible client. Five tools expose trending startups, sector signals, individual startup lookups, methodology, and weekly summaries. Published on npm as @gitdealflow/mcp-signal and listed in the MCP Registry and Glama.",
    status: "live",
    href: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
    docsHref: "https://gitdealflow.com/#mcp",
    category: "AI",
    setup: "npx @gitdealflow/mcp-signal@latest",
  },
  {
    slug: "telegram",
    name: "Telegram Channel",
    tagline: "Weekly breakout startups, pushed to your Telegram",
    description:
      "Public @gitdealflow channel delivers the weekly Signal Report and sector alerts. The paid Insider Circle is a separate private Telegram group with 50+ ranked startups per week, filter-ready data, and a direct line to the founder.",
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
    name: "Chrome Extension",
    tagline: "Engineering signals on Crunchbase, AngelList, PitchBook",
    description:
      "Sidebar badge that appears on Crunchbase, AngelList, and PitchBook company pages with the current engineering signal status for that startup. Works passively — no extra clicks, no login required.",
    status: "live",
    href: "https://chromewebstore.google.com/",
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
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
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
          Plug VC Deal Flow Signal into your existing workflow. Eight ways to
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
                          className="text-gray-500 hover:text-gray-300 font-medium transition-colors"
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
      </div>
    </>
  );
}
