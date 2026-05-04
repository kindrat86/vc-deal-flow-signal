import type { Metadata } from "next";
import Link from "next/link";

const SITE = "https://signals.gitdealflow.com";

const STRIPE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_AGENT_CREDITS_LINK ??
  "https://buy.stripe.com/PLACEHOLDER_AGENT_CREDITS_100";

export const metadata: Metadata = {
  title: "Agent Credits — Pay Per Deep Signal",
  description:
    "Per-request pricing for AI agents and programmatic callers. €19 = 100 deep-signal calls (€0.19 each). One credit per deep signal returned. The 6 free MCP tools stay free.",
  alternates: { canonical: "/agents/credits" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Agent Credits — Pay Per Deep Signal",
    description:
      "100 deep-signal calls for €19. €0.19 per call. The 6 free MCP tools are unaffected.",
    type: "website",
    url: `${SITE}/agents/credits`,
  },
};

export default function AgentCreditsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/agents/credits#webpage`,
        url: `${SITE}/agents/credits`,
        name: "Agent Credits — Pay Per Deep Signal",
        description:
          "Per-request pricing for AI agents. €19 = 100 deep-signal calls. The 6 free tools stay free.",
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
      },
      {
        "@type": "Offer",
        name: "Agent Credits — 100 deep-signal calls",
        description:
          "100 per-request credits for the get_deep_signal MCP tool and POST /api/agent/deep-signal HTTP endpoint. One credit consumed per match. Misses are free. Credits never expire.",
        price: "19",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${SITE}/agents/credits`,
        category: "API Credits",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          value: 100,
          unitText: "API calls",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "0.19",
          priceCurrency: "EUR",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: 1,
            unitText: "deep-signal call",
          },
        },
        seller: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href="/agents" className="hover:text-gray-300 transition-colors">
            Agents
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Credits</span>
        </nav>

        <header className="mb-10">
          <p className="text-amber-400 text-xs uppercase tracking-wider mb-3 font-semibold">
            Pay-as-you-go · For agents
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
            Agent credits — pay per deep signal
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            One credit = one deep signal returned. €0.19 per call. No
            subscription, no monthly minimum, credits never expire. The six free
            MCP tools stay free forever — credits only apply to the new
            <code className="text-emerald-400 font-mono"> get_deep_signal </code>
            tool and the
            <code className="text-emerald-400 font-mono">
              {" "}
              POST /api/agent/deep-signal{" "}
            </code>
            HTTP endpoint.
          </p>
        </header>

        <section className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-amber-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Starter pack
          </p>
          <div className="flex items-baseline gap-3 mb-2">
            <p className="text-4xl font-bold text-gray-100">€19</p>
            <p className="text-gray-400 text-sm">= 100 calls · €0.19 / call</p>
          </div>
          <ul className="text-gray-300 text-sm leading-relaxed mb-6 space-y-1">
            <li>• 100 <code className="text-emerald-400 font-mono">get_deep_signal</code> calls</li>
            <li>• Misses (startup not in our universe) are FREE — only matches charge</li>
            <li>• Credits never expire</li>
            <li>• API key delivered instantly via email</li>
            <li>• Top up any time, no expiration on stacked credits</li>
          </ul>
          <Link
            href={STRIPE_LINK}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-base font-semibold transition-colors"
          >
            Buy 100 credits — €19 →
          </Link>
          <p className="text-gray-500 text-xs mt-3">
            Stripe-hosted checkout. EU VAT applied where required. One-time
            payment, no recurring billing.
          </p>
        </section>

        <section className="mb-10" aria-label="What you get">
          <h2 className="text-xl font-bold text-gray-100 mb-4">
            What 1 credit returns
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            A deeply enriched signal profile beyond the free{" "}
            <code className="text-emerald-400 font-mono">get_startup_signal</code>:
          </p>
          <ul className="text-gray-300 text-sm leading-relaxed space-y-2 mb-4">
            <li>
              <strong className="text-gray-100">Composite score (0–100)</strong>{" "}
              — weighted average of velocity, contributor growth, and repo
              novelty.
            </li>
            <li>
              <strong className="text-gray-100">In-sector rank + percentile</strong>{" "}
              — where this startup sits among its tracked peers.
            </li>
            <li>
              <strong className="text-gray-100">Plain-English thesis</strong> —
              one sentence ready to drop into a memo or Slack.
            </li>
            <li>
              <strong className="text-gray-100">Top 3 sector comparables</strong>{" "}
              — names + signal type.
            </li>
            <li>
              <strong className="text-gray-100">Multi-period history</strong> —
              up to 6 prior periods of velocity and contributor counts.
            </li>
            <li>
              <strong className="text-gray-100">Citation string</strong> —
              ready to paste into investor reports.
            </li>
          </ul>
        </section>

        <section className="mb-10" aria-label="How to use">
          <h2 className="text-xl font-bold text-gray-100 mb-4">How to use</h2>

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 mb-4">
            <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
              MCP (Claude Desktop, Cursor, Windsurf, ...)
            </p>
            <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-sky-300 font-mono overflow-x-auto whitespace-pre">
{`{
  "mcpServers": {
    "gitdealflow": {
      "command": "npx",
      "args": ["-y", "@gitdealflow/mcp-signal"],
      "env": {
        "GITDEALFLOW_API_KEY": "gdf_v2.cus_xxx.<your_hmac>"
      }
    }
  }
}`}
            </pre>
            <p className="text-gray-400 text-xs mt-2">
              The <code className="text-emerald-400 font-mono">get_deep_signal</code>{" "}
              tool reads this env var on each call. Other 6 tools ignore it.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 mb-4">
            <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
              HTTP — direct from any agent runtime
            </p>
            <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre">
{`curl -X POST https://signals.gitdealflow.com/api/agent/deep-signal \\
  -H "Authorization: Bearer gdf_v2.cus_xxx.<your_hmac>" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"supabase"}'`}
            </pre>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
              Check balance
            </p>
            <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre">
{`curl https://signals.gitdealflow.com/api/account/credits \\
  -H "Authorization: Bearer gdf_v2.cus_xxx.<your_hmac>"`}
            </pre>
          </div>
        </section>

        <section className="mb-10" aria-label="FAQ">
          <h2 className="text-xl font-bold text-gray-100 mb-4">FAQ</h2>
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-gray-100 font-semibold mb-1">
                Are the existing free tools changing?
              </dt>
              <dd className="text-gray-400 leading-relaxed">
                No. The six free MCP tools (
                <code className="text-emerald-400 font-mono">get_trending_startups</code>,{" "}
                <code className="text-emerald-400 font-mono">search_startups_by_sector</code>,{" "}
                <code className="text-emerald-400 font-mono">get_startup_signal</code>,{" "}
                <code className="text-emerald-400 font-mono">get_signals_summary</code>,{" "}
                <code className="text-emerald-400 font-mono">get_scout_receipts</code>,{" "}
                <code className="text-emerald-400 font-mono">get_methodology</code>) stay free
                forever. Credits only apply to the new{" "}
                <code className="text-emerald-400 font-mono">get_deep_signal</code>.
              </dd>
            </div>
            <div>
              <dt className="text-gray-100 font-semibold mb-1">
                What if the startup isn&rsquo;t in your universe?
              </dt>
              <dd className="text-gray-400 leading-relaxed">
                Misses are free. The endpoint returns{" "}
                <code className="text-emerald-400 font-mono">{`{ found: false }`}</code>{" "}
                with a suggestion, charges 0 credits, and your balance is
                unchanged.
              </dd>
            </div>
            <div>
              <dt className="text-gray-100 font-semibold mb-1">
                Do credits expire?
              </dt>
              <dd className="text-gray-400 leading-relaxed">
                No. Credits sit on your Stripe customer record indefinitely.
                Buy when you need to, use when you need to.
              </dd>
            </div>
            <div>
              <dt className="text-gray-100 font-semibold mb-1">
                Is this related to the €9.97 Dashboard?
              </dt>
              <dd className="text-gray-400 leading-relaxed">
                No. The Dashboard is a human-facing weekly subscription. Agent
                credits are a separate, additive product for programmatic
                callers. Buy either, both, or neither — they don&rsquo;t
                interact.
              </dd>
            </div>
            <div>
              <dt className="text-gray-100 font-semibold mb-1">
                Bigger pack? Volume pricing?
              </dt>
              <dd className="text-gray-400 leading-relaxed">
                Email{" "}
                <a
                  href="mailto:signal@gitdealflow.com"
                  className="text-sky-400 hover:text-sky-300"
                >
                  signal@gitdealflow.com
                </a>{" "}
                for 1k+ packs or volume rates.
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Still on the fence?
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            The six free tools cover discovery (
            <code className="text-emerald-400 font-mono">get_trending_startups</code>,{" "}
            <code className="text-emerald-400 font-mono">search_startups_by_sector</code>) and
            shallow lookup (
            <code className="text-emerald-400 font-mono">get_startup_signal</code>). Credits
            are for when you&rsquo;ve identified a target and need scored,
            ranked, comparable-aware output for a memo or automated pipeline.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={STRIPE_LINK}
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
            >
              Buy 100 credits — €19
            </Link>
            <Link
              href="/agents"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 hover:text-gray-100 text-sm font-medium transition-colors"
            >
              See all 16 free surfaces
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
