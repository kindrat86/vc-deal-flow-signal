import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";
const NPM = "@gitdealflow/mcp-signal";
const HTTP_RPC = `${SITE}/api/mcp/rpc`;
const GITHUB_REPO = "kindrat86/vc-deal-flow-signal";
// Replit's official "Run on Replit" badge + import-from-github URL.
// Reference: https://docs.replit.com/programming-ide/configuring-repl
const REPLIT_RUN_URL = `https://replit.com/github/${GITHUB_REPO}`;
const REPLIT_TEMPLATE_URL = `https://replit.com/new/github/${GITHUB_REPO}`;
const REPLIT_BADGE = `https://replit.com/badge/github/${GITHUB_REPO}`;

const TITLE =
  "Run VC Deal Flow Signal on Replit — one-click MCP server + dashboard template";
const DESCRIPTION =
  "Spin up the VC Deal Flow Signal MCP server inside Replit in under 60 seconds. Run-on-Replit button, .replit + replit.nix preconfigured, Replit Agent compatible, free Replit Core tier supported. Ideal for forking, modifying, or wiring custom Replit Agents to live engineering-acceleration data.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/integrations/replit" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/integrations/replit`,
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

const HOW_TO_STEPS = [
  {
    name: "Click Run on Replit",
    text: "Replit imports the GitHub repo into a new Repl, installs Node 20 via the bundled replit.nix, and runs the MCP server's stdio entry point. The first import takes ~30s; subsequent forks are instant.",
  },
  {
    name: "Wire the MCP server to Replit Agent",
    text: "Open the AI panel in your Repl, point Replit Agent at .replit's mcp section. The six tools — trending startups, sector ranks, single-startup lookup, dataset summary, Scout receipts, methodology — appear in the agent's tool palette and become callable in the next prompt.",
  },
  {
    name: "Or use the public HTTP endpoint",
    text: `If you don't want to run the server inside the Repl, hit ${HTTP_RPC} directly from any Repl using fetch() or any MCP HTTP client. Same six tools, no install, no Node startup latency.`,
  },
  {
    name: "Fork and modify",
    text: "The Repl is open-source under MIT. Fork it, add your own enrichment layer (eg. CRM auto-push, Slack alerts, custom scoring), and re-publish your Repl as a public template. The upstream MCP server stays current via npm dist-tag.",
  },
];

const FAQ = [
  {
    q: "Does this run on Replit's free tier?",
    a: "Yes. The MCP server is a single-process Node 20 stdio server with ~40 MB resident memory. Fits comfortably inside Replit's free Repl quota. The Streamable-HTTP variant doesn't need a Repl at all — it's hosted at signals.gitdealflow.com.",
  },
  {
    q: "Replit Agent vs custom Replit Agent — which can call the MCP tools?",
    a: "Both. Replit Agent (Replit's first-party agent) supports MCP servers declared in .replit's [mcp] block. Custom Replit Agents built on top of the Replit Agent SDK can mount MCP servers programmatically too. The six tools are read-only and idempotent, so they're safe to expose to autonomous agents.",
  },
  {
    q: "Can I post a Replit Bounty asking the community to build something with this MCP?",
    a: "Yes. Replit Bounties accepts task posts where the deliverable is a working Repl. We pin community bounties (eg. 'Build a Replit Agent that drafts a deal memo from get_startup_signal') in the GitDealFlow community thread. Reach out at signals@gitdealflow.com to co-fund a bounty — we match up to USD 100 per accepted bounty.",
  },
  {
    q: "Do I need a GitHub account to use the Run on Replit button?",
    a: "No. Replit imports public GitHub repos without requiring you to have a GitHub account. You only need a Replit account (free tier works).",
  },
  {
    q: "Is the same Repl listed in Replit Templates?",
    a: "Yes — under the AI Tools / MCP Servers category. The template is auto-synced from the GitHub repo on every release tag.",
  },
];

const RUN_BUTTON_SCRIPT = `<a href="${REPLIT_RUN_URL}" rel="external">
  <img src="${REPLIT_BADGE}" alt="Run on Replit" />
</a>`;

const REPLIT_CONFIG = `# .replit
run = "npx -y ${NPM}"
modules = ["nodejs-20"]

[deployment]
run = ["sh", "-c", "npx -y ${NPM}"]

[mcp]
name = "vc-deal-flow-signal"
description = "Live GitHub engineering-acceleration signals across 20 startup sectors. Six free read-only tools."
transport = "stdio"
command = "npx"
args = ["-y", "${NPM}"]

[nix]
channel = "stable-24_05"`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: TITLE,
      url: `${SITE}/integrations/replit`,
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
          { "@type": "ListItem", position: 3, name: "Replit", item: `${SITE}/integrations/replit` },
        ],
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "VC Deal Flow Signal Replit Template",
      operatingSystem: "Replit (Nix-based, Node 20)",
      applicationCategory: "DeveloperApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "HowTo",
      name: "How to run VC Deal Flow Signal on Replit",
      totalTime: "PT60S",
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

export default function ReplitIntegrationPage() {
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
            <span className="text-gray-300">Replit</span>
          </nav>

          <header className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-950/40 border border-orange-900/40 px-3 py-1 text-xs font-medium text-orange-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              Live · Replit Templates listed · MIT licensed
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
              Run VC Deal Flow Signal on Replit
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Spin up the MCP server in a Replit Repl in under 60 seconds. One-click import,
              .replit + replit.nix preconfigured, Replit Agent–compatible. Ideal for
              forking the server, building a custom Replit Agent on top of the six tools,
              or wiring deal-flow signals into your existing Replit dashboard.
            </p>
            <div data-agent-summary className="hidden">
              VC Deal Flow Signal can be run inside a Replit Repl via the Run-on-Replit
              button. Imports the kindrat86/vc-deal-flow-signal GitHub repo, installs
              Node 20 via Nix, and exposes six MCP tools to Replit Agent. Free tier
              compatible.
            </div>
          </header>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">One-click import</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <a
                href={REPLIT_RUN_URL}
                rel="external"
                className="group block rounded-2xl border-2 border-orange-700 bg-gradient-to-br from-orange-950/60 to-slate-900 p-6 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-950/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">▶️</span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-orange-400">
                    Recommended · Replit Templates
                  </span>
                </div>
                <div className="text-lg font-bold text-white mb-2">Run on Replit</div>
                <div className="text-sm text-gray-400 mb-4">
                  Imports the GitHub repo into a new Repl, runs the MCP server stdio
                  entry point, makes tools available to Replit Agent.
                </div>
                <div className="text-orange-400 text-sm font-mono group-hover:translate-x-1 transition-transform">
                  → replit.com/github/{GITHUB_REPO}
                </div>
              </a>
              <a
                href={REPLIT_TEMPLATE_URL}
                rel="external"
                className="group block rounded-2xl border-2 border-amber-700 bg-gradient-to-br from-amber-950/60 to-slate-900 p-6 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-950/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🍴</span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                    Fork into a new Repl
                  </span>
                </div>
                <div className="text-lg font-bold text-white mb-2">
                  Fork the template
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  Same import, but creates a fresh Repl in your workspace. Best when
                  you want to modify and ship your own variant.
                </div>
                <div className="text-amber-400 text-sm font-mono group-hover:translate-x-1 transition-transform">
                  → replit.com/new/github/{GITHUB_REPO}
                </div>
              </a>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-orange-400 mb-2">
                Embed the badge
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Drop this badge in any README, dev.to post, or HTML page to give your
                readers a one-click way to spin up the server:
              </p>
              <pre className="overflow-x-auto text-xs text-gray-300 font-mono leading-relaxed">{RUN_BUTTON_SCRIPT}</pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">.replit + replit.nix</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              The repo ships with a preconfigured Replit manifest. Replit Agent reads
              the <code className="rounded bg-slate-900 px-1 py-0.5 text-xs">[mcp]</code>{" "}
              section and auto-mounts the six tools — no SDK calls needed.
            </p>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <pre className="overflow-x-auto text-xs text-gray-300 font-mono leading-relaxed">{REPLIT_CONFIG}</pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
            <ol className="space-y-5">
              {HOW_TO_STEPS.map((s, i) => (
                <li key={s.name} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-950 border border-orange-900 flex items-center justify-center text-sm font-bold text-orange-400">
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

          <section className="mb-16 rounded-2xl border border-orange-900/40 bg-gradient-to-br from-orange-950/30 to-slate-900 p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Replit Bounties — co-funded community quests
            </h2>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              We sponsor and match-fund Replit Bounties for community projects built on
              the MCP server. Pinned quests this quarter:
            </p>
            <ul className="space-y-2 text-sm text-gray-300 mb-5">
              <li className="flex gap-2">
                <span className="text-orange-400">→</span>
                <span>
                  <strong className="text-white">Deal-memo generator</strong> — a
                  Replit Agent that drafts a one-page memo from{" "}
                  <code className="rounded bg-slate-900 px-1 py-0.5 text-[11px]">get_startup_signal</code>.
                  Match up to USD 100.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400">→</span>
                <span>
                  <strong className="text-white">CRM auto-enrichment Repl</strong> — a
                  cron Repl that pushes weekly trending startups into Affinity or
                  HubSpot via webhook. Match up to USD 100.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400">→</span>
                <span>
                  <strong className="text-white">Scout-Score leaderboard widget</strong> — a
                  Repl-hosted React widget that renders any GitHub user&apos;s Scout
                  Score from{" "}
                  <code className="rounded bg-slate-900 px-1 py-0.5 text-[11px]">get_scout_receipts</code>.
                  Match up to USD 75.
                </span>
              </li>
            </ul>
            <p className="text-xs text-gray-500">
              To propose a bounty or co-fund an existing one, email{" "}
              <a href="mailto:signals@gitdealflow.com" className="text-orange-400 hover:underline">
                signals@gitdealflow.com
              </a>{" "}
              with the deliverable + your wallet/Stripe handle. We post the bounty on
              Replit Bounties under our handle and credit accepted Repls in the next
              weekly Signal Report.
            </p>
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
              Same npm package powers our integrations across Cursor, Claude Desktop,
              Cline, Block Goose, OpenHands, Aider, Raycast, Mistral Le Chat, and ChatGPT.
              One server, every runtime.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/integrations/cursor"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-orange-400 hover:border-orange-600 transition-colors"
              >
                Add to Cursor →
              </Link>
              <Link
                href="/integrations/agent-runtimes"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-orange-400 hover:border-orange-600 transition-colors"
              >
                All agent runtimes →
              </Link>
              <Link
                href="/integrations/vercel-deploy"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-orange-400 hover:border-orange-600 transition-colors"
              >
                Deploy to Vercel →
              </Link>
            </div>
          </section>

          <AgentMirrorLinks path="/integrations/replit" />
        </div>
      </main>
    </>
  );
}
