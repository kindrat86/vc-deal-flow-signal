import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";
const ACTIONS_URL = `${SITE}/api/actions/openapi.json`;
// GPT live as of 2026-05-03.
const GPT_URL =
  "https://chatgpt.com/g/g-69f76b9b3b308191b6948bff20c0fbf8-github-vc-signal";
const GPT_URL_IS_LIVE = true;

const TITLE =
  "Use VC Deal Flow Signal in ChatGPT — GitHub VC Signal GPT";
const DESCRIPTION =
  "Add the GitHub VC Signal GPT to ChatGPT in one click. Public OpenAPI Action calling signals.gitdealflow.com — find startups whose engineering is accelerating before they raise. Five tools across 15 sectors, weekly refresh, no auth, no setup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/integrations/chatgpt" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/integrations/chatgpt`,
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
    name: "getAllSignals",
    summary:
      "Top 20 trending startups across all 15 sectors plus every sector's full ranked roster. The GPT slices the response for trending or sector queries.",
  },
  {
    name: "getStartupSignal",
    summary:
      "Single-startup deep lookup by name or GitHub org slug. Returns velocity, contributor delta, signal classification, GitHub URL.",
  },
  {
    name: "getSignalsSummary",
    summary:
      "Tiny dataset metadata snapshot — current period, sector and startup counts, last refresh timestamp. Cheap; the GPT calls it once per session to orient.",
  },
  {
    name: "getMethodology",
    summary:
      "Plain-text methodology covering data sources, metric computation, classification thresholds, refresh cadence, and limitations. For citation footnotes.",
  },
];

const HOW_TO_STEPS = [
  {
    name: "Open the GPT",
    text: "Go to chatgpt.com (Plus, Team, Enterprise, or Edu) and click the GitHub VC Signal GPT card. The Action is already configured against signals.gitdealflow.com — no setup, no auth, no install.",
  },
  {
    name: "Ask a deal-flow question",
    text: "Try a conversation starter: 'Who's trending in AI/ML this week?', 'Show me fintech startups by engineering velocity', 'Is Supabase accelerating?', or 'How do you compute the breakout signal?'",
  },
  {
    name: "Read the answer",
    text: "The GPT returns a ranked list with commit-velocity changes, contributor counts, signal classification (breakout / acceleration / steady / cooling), GitHub URLs, and a citation block linking signals.gitdealflow.com and the SSRN preprint.",
  },
  {
    name: "Drill into a single startup",
    text: "Pick a name from any list and ask 'Tell me more about <name>'. The GPT calls getStartupSignal and returns the full profile — stage, geography, velocity, signal type, GitHub URL, optional website and LinkedIn.",
  },
  {
    name: "Cite in your memo",
    text: "Ask the GPT to format the data as a deal memo. It will paste the citation block automatically — VC Deal Flow Signal (signals.gitdealflow.com), period name, methodology link, SSRN preprint 6606558.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need a paid ChatGPT plan?",
    a: "Yes. GPTs are gated to ChatGPT Plus, Team, Enterprise, and Edu. Free-tier users can still browse the GPT page but can't run it. If you don't have a paid plan, the same data is available via the public MCP server at signals.gitdealflow.com/api/mcp/rpc, the Claude.ai connector, the Cursor / Claude Desktop install via npm (Glama A-Tier), or the raw JSON/CSV at signals.gitdealflow.com/api/signals.json.",
  },
  {
    q: "What's the underlying API?",
    a: "A public OpenAPI 3.1 Action at signals.gitdealflow.com/api/actions/openapi.json. Four GET endpoints — /api/signals.json, /api/signal, /api/changelog.json, /llms-full.txt. No authentication. Cached at the edge with s-maxage=3600. The same backend powers the MCP server (npm @gitdealflow/mcp-signal) and every other surface, so signal classifications are identical across ChatGPT, Claude.ai, Cursor, and Mistral Le Chat.",
  },
  {
    q: "How fresh is the data?",
    a: "Refreshed every Monday around 09:00 UTC. The GPT can return the exact lastDataRefresh timestamp via getSignalsSummary. If the data is more than 8 days old, the GPT will flag a possible upstream issue.",
  },
  {
    q: "What does it actually rank?",
    a: "Engineering momentum, derived from public GitHub activity. Three input metrics: commit velocity over a rolling 14-day window, contributor growth over a rolling 30-day window, and new repos over a rolling 30-day window. Output classification: breakout (sudden surge), acceleration (sustained growth), steady (healthy baseline), or cooling (declining). Approximately 400 venture-backed startups across 15 sectors are tracked.",
  },
  {
    q: "Why GitHub specifically?",
    a: "For venture-stage software companies, the engineering org IS the company. Hiring → commits. Customer demand → infrastructure buildout → new repos. Pivot → framework migration. Fundraising → engineering hiring burst. The signal is upstream of the announcement. This is engineering signal only — pair with Crunchbase / Harmonic / your CRM for funding, revenue, headcount.",
  },
  {
    q: "Will the GPT hallucinate startups?",
    a: "The system prompt explicitly forbids inventing startups. When you ask about a company not in the tracked universe of ~369, the Action returns status: 'no_data' and the GPT surfaces a CTA pointing to signals.gitdealflow.com. If you spot any hallucinations, email signals@gitdealflow.com — we'll tighten the instructions.",
  },
  {
    q: "Can I use the same data without ChatGPT?",
    a: "Yes — five surfaces. (1) Claude.ai connector: native MCP at signals.gitdealflow.com/api/mcp/rpc. (2) Claude Desktop / Cursor / Cline / Continue: one-line install via npx -y @gitdealflow/mcp-signal (Glama A-Tier 4.9/5.0). (3) Any stdio MCP client: npx -y @gitdealflow/mcp-signal. (4) Mistral Le Chat: Custom MCP Connector at signals.gitdealflow.com/api/mcp/rpc. (5) Raw API: signals.gitdealflow.com/api/signals.json (JSON), /api/signals.csv (CSV), /feed.xml (RSS).",
  },
  {
    q: "How do I cite this in a memo?",
    a: "Suggested citation: 'VC Deal Flow Signal (signals.gitdealflow.com), <period name> data. Methodology: SSRN preprint 6606558. Refreshed weekly from public GitHub activity.' The GPT will paste this block automatically when you ask for memo-formatted output.",
  },
  {
    q: "Is there a privacy policy?",
    a: "Yes — gitdealflow.com/privacy. The Action is read-only, queries no PII, and stores nothing server-side beyond Vercel access logs. ChatGPT's Action sandbox enforces the auth-type-None setting (no headers, no cookies, no token leakage to our backend).",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: TITLE,
      url: `${SITE}/integrations/chatgpt`,
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
            name: "ChatGPT",
            item: `${SITE}/integrations/chatgpt`,
          },
        ],
      },
    },
    {
      "@type": "HowTo",
      name: "How to use the GitHub VC Signal GPT in ChatGPT",
      description:
        "Five-step workflow to query the public VC Deal Flow Signal dataset from inside ChatGPT via the GitHub VC Signal GPT.",
      totalTime: "PT2M",
      step: HOW_TO_STEPS.map((s, idx) => ({
        "@type": "HowToStep",
        position: idx + 1,
        name: s.name,
        text: s.text,
      })),
      tool: [
        { "@type": "HowToTool", name: "ChatGPT Plus / Team / Enterprise / Edu" },
        { "@type": "HowToTool", name: "GitHub VC Signal GPT" },
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
      name: "GitHub VC Signal (ChatGPT GPT)",
      url: `${SITE}/integrations/chatgpt`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web (ChatGPT)",
      description:
        "ChatGPT GPT exposing the VC Deal Flow Signal dataset as a public OpenAPI Action. Find startups whose engineering is accelerating before they raise — six tools, 15 sectors, weekly refresh, no auth.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: {
        "@type": "Organization",
        name: "VC Deal Flow Signal",
        url: "https://gitdealflow.com",
      },
    },
  ],
};

export default function ChatGPTIntegrationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/integrations/chatgpt" />

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
          <span className="text-gray-400">ChatGPT</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Use VC Deal Flow Signal in ChatGPT
        </h1>
        <p
          className="text-gray-400 text-base leading-relaxed mb-6 max-w-2xl speakable"
          data-agent-summary
        >
          The GitHub VC Signal GPT brings the VC Deal Flow Signal dataset
          directly into ChatGPT. Ask &quot;who&apos;s trending in AI/ML this
          week?&quot; or &quot;is Supabase accelerating?&quot; and get a ranked
          answer with commit-velocity changes, contributor deltas, signal
          classification, and a citation block — all powered by a public
          OpenAPI Action against signals.gitdealflow.com. No install. No auth.
          Five tools across 15 sectors, refreshed every Monday.
        </p>

        <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-4 mb-10 text-sm">
          <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Public OpenAPI Action
          </div>
          <code className="text-emerald-300 font-mono text-xs break-all">
            {ACTIONS_URL}
          </code>
        </div>

        {GPT_URL_IS_LIVE ? (
          <Link
            href={GPT_URL}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-semibold transition-colors mb-12"
          >
            Open the GitHub VC Signal GPT →
          </Link>
        ) : (
          <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-4 mb-12 text-sm text-amber-200">
            GPT submission in flight. Check back in 1-3 days for the public
            ChatGPT URL, or grab the same data via the{" "}
            <Link
              href="/integrations/mistral"
              className="text-amber-100 underline"
            >
              MCP server
            </Link>{" "}
            in the meantime.
          </div>
        )}

        <section className="mb-12" aria-labelledby="how-to">
          <h2
            id="how-to"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            How to use it
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
            Four Actions you get
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
            All Actions are read-only GETs. Defined in OpenAPI 3.1 at{" "}
            <code className="font-mono text-gray-400">{ACTIONS_URL}</code>.
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
            Not on ChatGPT?
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 text-sm text-gray-400 leading-relaxed">
            <p className="mb-3">
              The same dataset ships across five surfaces:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <Link
                  href="/integrations/mistral"
                  className="text-sky-500 hover:text-sky-400 font-medium"
                >
                  Mistral Le Chat
                </Link>{" "}
                — Custom MCP Connector at{" "}
                <code className="font-mono text-gray-300 break-all">
                  {SITE}/api/mcp/rpc
                </code>
              </li>
              <li>
                <Link
                  href="https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal"
                  className="text-sky-500 hover:text-sky-400 font-medium"
                >
                  Glama
                </Link>{" "}
                — A-Tier MCP catalog listing (4.9/5.0 across 6 tools). One-line
                install via{" "}
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
                — stdio install for any MCP-compatible client. Run{" "}
                <code className="font-mono text-gray-300">
                  npx -y @gitdealflow/mcp-signal
                </code>
                .
              </li>
              <li>
                Claude.ai connector — coming soon via Anthropic&apos;s
                Connectors Directory. Same MCP server.
              </li>
              <li>
                Raw API —{" "}
                <Link
                  href={`${SITE}/api/signals.json`}
                  className="text-sky-500 hover:text-sky-400 font-medium"
                >
                  JSON
                </Link>
                ,{" "}
                <Link
                  href={`${SITE}/api/signals.csv`}
                  className="text-sky-500 hover:text-sky-400 font-medium"
                >
                  CSV
                </Link>
                ,{" "}
                <Link
                  href={`${SITE}/feed.xml`}
                  className="text-sky-500 hover:text-sky-400 font-medium"
                >
                  RSS
                </Link>
                ,{" "}
                <Link
                  href={`${SITE}/api/openapi.json`}
                  className="text-sky-500 hover:text-sky-400 font-medium"
                >
                  OpenAPI
                </Link>
                . No auth, free with attribution.
              </li>
            </ul>
          </div>
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Stuck or hit a hallucination?
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Email signals@gitdealflow.com with the prompt that broke it — replies
            within 24 hours, EU business time. The system prompt is tightened
            iteratively from real failures.
          </p>
          <Link
            href="mailto:signals@gitdealflow.com?subject=ChatGPT%20GPT%20feedback"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-medium transition-colors"
          >
            Email feedback
          </Link>
        </div>
      </div>
    </>
  );
}
