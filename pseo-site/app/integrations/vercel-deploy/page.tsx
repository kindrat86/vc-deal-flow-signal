import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";
const NPM = "@gitdealflow/mcp-signal";
const HTTP_RPC = `${SITE}/api/mcp/rpc`;
const GITHUB_REPO = "https://github.com/kindrat86/vc-deal-flow-signal";

// Vercel's "Deploy" button URL contract:
// https://vercel.com/docs/deploy-button
// Pre-fills the project clone form with repo URL, env-var prompts, project name.
const DEPLOY_URL = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(
  GITHUB_REPO
)}&project-name=vc-deal-flow-signal&repository-name=vc-deal-flow-signal&demo-title=VC%20Deal%20Flow%20Signal&demo-description=GitHub%20engineering-acceleration%20signals%20across%2020%20startup%20sectors.%20Deploy%20your%20own%20MCP%20endpoint%20and%20Next.js%20dashboard.&demo-url=${encodeURIComponent(
  SITE
)}`;

const TITLE =
  "Deploy VC Deal Flow Signal to Vercel — one-click MCP endpoint + Next.js dashboard";
const DESCRIPTION =
  "Deploy your own VC Deal Flow Signal — MCP server (Streamable HTTP) plus the full Next.js dashboard — to Vercel in one click. Self-host the same six tools we serve at signals.gitdealflow.com, on your own domain, with full control over rate limits, custom enrichment, and private analytics. Free Hobby tier compatible. MIT licensed.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/integrations/vercel-deploy" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/integrations/vercel-deploy`,
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
    name: "Click Deploy to Vercel",
    text: "Vercel's clone form opens prefilled with the repo URL, project name, and template metadata. Sign in (GitHub / GitLab / Bitbucket / email — Vercel's free Hobby tier works), pick your scope, and Vercel forks the repo into your account.",
  },
  {
    name: "Configure environment variables",
    text: "The clone form prompts for optional env vars — RESEND_API_KEY (for the welcome email path), STRIPE_SECRET_KEY (for the optional paid tiers), DATABASE_URL (for your own analytics). Skip them all to deploy a read-only MCP endpoint and dashboard with no DB. Add them later from Vercel → Settings → Environment Variables.",
  },
  {
    name: "Hit Deploy",
    text: "Vercel runs npm install + next build + outputs the production bundle. First deploy takes ~90s on the Hobby tier. You get a *.vercel.app URL plus an automatic HTTPS cert. The MCP endpoint is live at /api/mcp/rpc and the dashboard at /.",
  },
  {
    name: "Add your own custom domain",
    text: "Vercel → Domains → Add. Vercel issues the cert and routes traffic. The MCP endpoint inherits the new domain — point Cursor / Claude / agents at https://your-domain.com/api/mcp/rpc.",
  },
];

const FAQ = [
  {
    q: "Why self-host instead of using signals.gitdealflow.com?",
    a: "Three reasons. (1) Custom rate limits — the public endpoint is CDN-fronted but unauth'd; if you're embedding the tools in a customer-facing agent, self-hosting lets you authenticate on your terms. (2) Custom enrichment — fork, add your own scoring layer, ship it as your team's own MCP. (3) Private analytics — the public endpoint logs nothing user-identifying; if you want telemetry on which tools your team uses most, self-host gets you the logs.",
  },
  {
    q: "Does the deploy include the dashboard, or just the MCP server?",
    a: "Both. The repo is the full Next.js app — pSEO pages, the dashboard, the MCP server (HTTP at /api/mcp/rpc, plus the agent-card and OpenAPI surfaces), the email API, the Stripe webhook handler. Strip what you don't need from the app/ directory before deploying if you only want the MCP endpoint.",
  },
  {
    q: "How does this differ from the npm package?",
    a: "The npm package (@gitdealflow/mcp-signal) is just the stdio MCP server — local-first. Deploying to Vercel gives you the HTTP endpoint, the Next.js UI, and every other service surface (OpenAPI, agents.json, llms.txt, etc.) running on your domain.",
  },
  {
    q: "Is it on vercel.com/templates?",
    a: "Submitted. Listing live at vercel.com/templates — search for VC Deal Flow Signal under the AI / MCP category. The Deploy button on this page is the same one served from the Vercel Templates listing.",
  },
  {
    q: "What does it cost on Vercel?",
    a: "Free on Hobby for personal use (10k function invocations/month, plenty for a private deal-flow dashboard). Pro tier (USD 20/user/month) recommended for team usage, custom domain, password protection on preview deploys, and unlimited bandwidth. The MCP server itself runs as a Vercel Function — no compute beyond invocations.",
  },
];

const ENV_VARS = [
  {
    name: "RESEND_API_KEY",
    optional: true,
    purpose: "Drives the welcome email + drip sequences. Skip if you don't want email capture.",
  },
  {
    name: "STRIPE_SECRET_KEY",
    optional: true,
    purpose: "Powers the paid tier checkouts. Skip for read-only deployments.",
  },
  {
    name: "DATABASE_URL",
    optional: true,
    purpose: "Postgres URL (Neon, Supabase, or any). Used for caching computed signals; falls back to in-memory if absent.",
  },
  {
    name: "GITHUB_TOKEN",
    optional: true,
    purpose: "Bumps GitHub API rate limits from 60 to 5,000/hr. Required if you want to recompute signals; skip if you're proxying to the upstream public API.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: TITLE,
      url: `${SITE}/integrations/vercel-deploy`,
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
          { "@type": "ListItem", position: 3, name: "Deploy to Vercel", item: `${SITE}/integrations/vercel-deploy` },
        ],
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "VC Deal Flow Signal Vercel Template",
      operatingSystem: "Vercel (Node 20)",
      applicationCategory: "DeveloperApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "HowTo",
      name: "How to deploy VC Deal Flow Signal to Vercel",
      totalTime: "PT3M",
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

export default function VercelDeployPage() {
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
            <span className="text-gray-300">Deploy to Vercel</span>
          </nav>

          <header className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/60 border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Live · vercel.com/templates · MIT licensed
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
              Deploy VC Deal Flow Signal to Vercel
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Spin up your own MCP endpoint and Next.js dashboard on Vercel in one
              click. Same six tools we serve at signals.gitdealflow.com — running on
              your own domain, your own rate limits, your own enrichment. Free Hobby
              tier compatible. MIT licensed.
            </p>
            <div data-agent-summary className="hidden">
              VC Deal Flow Signal can be self-hosted on Vercel via a Deploy-to-Vercel
              button. Forks the kindrat86/vc-deal-flow-signal GitHub repo, builds the
              Next.js app, exposes /api/mcp/rpc as Streamable HTTP MCP endpoint plus
              the full pSEO dashboard. Hobby tier compatible.
            </div>
          </header>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">One-click deploy</h2>
            <a
              href={DEPLOY_URL}
              rel="external"
              className="group block rounded-2xl border-2 border-white/30 bg-gradient-to-br from-slate-900 to-black p-8 hover:border-white hover:shadow-lg hover:shadow-white/10 transition-all mb-6"
            >
              <div className="flex items-center gap-4 mb-3">
                <svg
                  viewBox="0 0 76 65"
                  className="h-10 w-10"
                  fill="white"
                  aria-hidden
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
                    Vercel Templates
                  </div>
                  <div className="text-2xl font-bold text-white">Deploy to Vercel</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Forks the GitHub repo into your scope, prompts for optional env
                vars, builds with <code className="rounded bg-slate-900 px-1 py-0.5 text-xs">next build</code>,
                deploys to <code className="rounded bg-slate-900 px-1 py-0.5 text-xs">*.vercel.app</code>{" "}
                in ~90s.
              </p>
              <div className="text-white text-sm font-mono group-hover:translate-x-1 transition-transform">
                → vercel.com/new/clone
              </div>
            </a>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-300 mb-2">
                Embed the button in your README
              </div>
              <pre className="overflow-x-auto text-xs text-gray-300 font-mono leading-relaxed">{`[![Deploy with Vercel](https://vercel.com/button)](${DEPLOY_URL})`}</pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">What you get</h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "MCP Streamable HTTP endpoint",
                  body: `Live at /api/mcp/rpc on your domain. Six free read-only tools. Cursor, Claude, Mistral, Cline, Goose all point at it.`,
                },
                {
                  title: "Next.js dashboard + pSEO",
                  body: "Full app — homepage, sector pages, glossary, FAQ, blog, /predicted weekly, /state-of-github monthly. Yours to keep, brand, modify.",
                },
                {
                  title: "OpenAPI 3.1 + agents.json + llms.txt",
                  body: "Every agent-discovery surface ships with the deploy. Your own llms.txt, your own agent card, your own OpenAPI spec.",
                },
                {
                  title: "Email + Stripe + Webhook plumbing",
                  body: "Resend integration, Stripe checkout + webhook handler, runtime-cache idempotency. Optional — disable via env vars if you don't need it.",
                },
              ].map((card) => (
                <li
                  key={card.title}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-5"
                >
                  <div className="font-semibold text-white mb-2">{card.title}</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{card.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Environment variables</h2>
            <p className="text-gray-300 mb-5 leading-relaxed">
              All env vars are optional. The repo is built to run with zero config —
              the MCP endpoint and the static dashboard work without a database, email
              provider, or payment processor.
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold text-slate-400">
                      Variable
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold text-slate-400">
                      Optional
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold text-slate-400">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ENV_VARS.map((v) => (
                    <tr key={v.name} className="bg-slate-900/30">
                      <td className="px-4 py-3 font-mono text-xs text-emerald-400">
                        {v.name}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {v.optional ? "Yes" : "Required"}
                      </td>
                      <td className="px-4 py-3 text-gray-300 leading-relaxed">
                        {v.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
            <ol className="space-y-5">
              {HOW_TO_STEPS.map((s, i) => (
                <li key={s.name} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-white">
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
              the same HTTP endpoint power our integrations across Cursor, Claude
              Desktop, Cline, Block Goose, OpenHands, Aider, Raycast, Mistral Le Chat,
              and ChatGPT.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/integrations/cursor"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-emerald-400 hover:border-emerald-600 transition-colors"
              >
                Add to Cursor →
              </Link>
              <Link
                href="/integrations/replit"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-emerald-400 hover:border-emerald-600 transition-colors"
              >
                Run on Replit →
              </Link>
              <Link
                href="/integrations/agent-runtimes"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-emerald-400 hover:border-emerald-600 transition-colors"
              >
                All agent runtimes →
              </Link>
            </div>
          </section>

          <p className="text-xs text-gray-500 mb-4">
            <strong>Public endpoint URL (do not change):</strong>{" "}
            <code className="rounded bg-slate-900 px-1 py-0.5 text-xs">{HTTP_RPC}</code>{" "}
            — point integrations here when you want to consume our hosted data instead
            of self-hosting.
          </p>

          <AgentMirrorLinks path="/integrations/vercel-deploy" />
        </div>
      </main>
    </>
  );
}
