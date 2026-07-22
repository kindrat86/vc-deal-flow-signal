import type { Metadata } from "next";
import Link from "next/link";

const SITE = "https://signals.gitdealflow.com";

const STRIPE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_AGENT_CREDITS_LINK ??
  "https://buy.stripe.com/00w4gyfRpg3SbAGcUg0x205";

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

export default async function AgentCreditsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const justPaid = status === "paid";

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
        priceValidUntil: "2026-12-31",
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
        {justPaid && (
          <aside
            role="status"
            aria-live="polite"
            className="mb-8 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <svg
                className="h-6 w-6 mt-0.5 shrink-0 text-emerald-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="min-w-0">
                <h2 className="text-emerald-300 font-semibold text-base mb-1">
                  Payment received — your API key is on the way
                </h2>
                <p className="text-emerald-100/80 text-sm leading-relaxed mb-2">
                  Check the inbox for the email you used at checkout. The
                  welcome email arrives in ~30 seconds with your API key
                  (<code className="text-emerald-200 font-mono">gdf_v2.cus_xxx.&lt;hmac&gt;</code>)
                  and a 100-credit balance.
                </p>
                <p className="text-emerald-100/60 text-xs leading-relaxed">
                  Didn&rsquo;t get it within 2 minutes? Check spam, then email{" "}
                  <a
                    href="mailto:signals@gitdealflow.com"
                    className="text-emerald-200 hover:text-emerald-100 underline"
                  >
                    signals@gitdealflow.com
                  </a>{" "}
                  with your Stripe receipt — keys are deterministic, we can
                  resend without re-charging.
                </p>
              </div>
            </div>
          </aside>
        )}

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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight tracking-tight">
            Agent credits — pay per deep signal
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            One credit = one deep signal returned. €0.19 per call. No
            subscription, no monthly minimum, credits never expire. The six
            free MCP tools stay free forever — credits only apply to the new{" "}
            <code className="text-emerald-300 font-mono">get_deep_signal</code>{" "}
            tool and the{" "}
            <code className="text-emerald-300 font-mono">
              POST /api/agent/deep-signal
            </code>{" "}
            HTTP endpoint.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 max-w-2xl">
            {[
              "Hit rate > 80% on tracked orgs — misses are free",
              "HMAC-keyed, no DB lookup, ~200ms median latency",
              "Credits never expire, top up any time",
              "Zero rate limits inside your quota",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-gray-300 text-sm">
                <svg
                  className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.6a1 1 0 0 1-1.42.006l-3.5-3.5a1 1 0 1 1 1.414-1.414l2.79 2.79 6.793-6.89a1 1 0 0 1 1.417-.006Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </header>

        <section className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">
            Use this page when you already want paid deep-signal calls. But if your real question is builder fit, developer setup, or the full builder offer, start with the sharper routes first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/for-builders" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400 transition-colors">
              Read the builder offer →
            </Link>
            <Link href="/developers" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read developer docs →
            </Link>
            <Link href="/answers/best-mcp-server-for-vc-research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the MCP comparison →
            </Link>
          </div>
        </section>

        <section className="mb-10" aria-label="Choose your payment path">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 mb-1">
            Two paths · same data · same €0.19 / $0.19 per call
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            Pick the one that matches your runtime. Both hit the same{" "}
            <code className="text-emerald-300 font-mono">get_deep_signal</code>{" "}
            payload, both treat 404 misses as free.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-6 flex flex-col">
              <p className="text-amber-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                For humans &amp; teams
              </p>
              <h3 className="text-lg font-bold text-gray-100 mb-1">
                Credit pack · Stripe
              </h3>
              <p className="text-3xl font-bold text-gray-100">
                €19{" "}
                <span className="text-base font-normal text-gray-400">
                  = 100 calls
                </span>
              </p>
              <p className="text-gray-400 text-xs mb-4">
                €0.19 / call · credits never expire
              </p>
              <ul className="text-gray-300 text-sm space-y-1.5 mb-5 flex-1">
                <li>✓ Card or SEPA via Stripe checkout</li>
                <li>✓ API key emailed in ~30s</li>
                <li>✓ Promo codes accepted, top up any time</li>
                <li>✓ Best for human-supervised agents</li>
              </ul>
              <Link
                href={STRIPE_LINK}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors"
              >
                Buy 100 credits — €19 →
              </Link>
            </div>

            <div className="rounded-xl border border-sky-500/40 bg-sky-500/5 p-6 flex flex-col">
              <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                For autonomous agents
              </p>
              <h3 className="text-lg font-bold text-gray-100 mb-1">
                Pay-per-call · x402 / USDC
              </h3>
              <p className="text-3xl font-bold text-gray-100">
                $0.19{" "}
                <span className="text-base font-normal text-gray-400">
                  USDC / call
                </span>
              </p>
              <p className="text-gray-400 text-xs mb-4">
                No signup · wallet signs each request
              </p>
              <ul className="text-gray-300 text-sm space-y-1.5 mb-5 flex-1">
                <li>✓ USDC on Base mainnet</li>
                <li>✓ HTTP 402 + EIP-3009 (gasless to buyer)</li>
                <li>✓ ~2s settlement · 404 misses free</li>
                <li>✓ Works with x402-fetch, Coinbase CDP, MetaMask</li>
              </ul>
              <a
                href="#x402-detail"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors"
              >
                See x402 endpoint ↓
              </a>
            </div>
          </div>
        </section>

        <section
          id="x402-detail"
          className="mb-10 rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8 scroll-mt-20"
          aria-label="x402 — pay-per-call in USDC"
        >
          <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Crypto-native alternative · for fully autonomous agents
          </p>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Pay per call in USDC on Base — no signup, no API key
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            If your agent has its own wallet (Coinbase CDP, MetaMask, any
            EIP-3009-capable signer) and there&rsquo;s no human in the loop to
            top up credits, use the{" "}
            <a
              href="https://x402.org"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              x402 protocol
            </a>{" "}
            endpoint instead. The agent calls the endpoint, gets a{" "}
            <code className="text-sky-300 font-mono">402 Payment Required</code>{" "}
            with USDC payment requirements, signs an EIP-3009{" "}
            <code className="text-sky-300 font-mono">transferWithAuthorization</code>
            , and retries with the <code className="text-sky-300 font-mono">X-PAYMENT</code>{" "}
            header. ~$0.001 in gas, ~2-second settlement, $0.19/call. Misses
            (404) are free. Settled by the Coinbase x402 facilitator.
          </p>
          <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-sky-300 font-mono overflow-x-auto whitespace-pre mb-4">
{`POST https://signals.gitdealflow.com/api/agent/deep-signal/x402
Content-Type: application/json

{ "name": "supabase" }`}
          </pre>
          <ul className="text-gray-300 text-sm leading-relaxed space-y-1 mb-2">
            <li>• No account, no email, no password — pure HTTP 402</li>
            <li>• Same payload as the credit-pack endpoint</li>
            <li>• Misses (404) are not charged</li>
            <li>• Use{" "}
              <code className="text-sky-300 font-mono">x402-fetch</code> on the
              client side, or any compliant client at{" "}
              <a
                href="https://x402.org"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:text-sky-300 underline"
              >
                x402.org
              </a>
            </li>
          </ul>
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

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 mb-4">
            <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
              x402 — USDC on Base, no key
            </p>
            <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-sky-300 font-mono overflow-x-auto whitespace-pre">
{`# 1. First call returns 402 with payment requirements
curl -i -X POST https://signals.gitdealflow.com/api/agent/deep-signal/x402 \\
  -H "Content-Type: application/json" \\
  -d '{"name":"supabase"}'

# 2. Wallet-equipped agents can use x402-fetch instead:
import { wrapFetchWithPayment } from "x402-fetch";
const fetchWithPayment = wrapFetchWithPayment(fetch, account);
const r = await fetchWithPayment(
  "https://signals.gitdealflow.com/api/agent/deep-signal/x402",
  { method: "POST", body: JSON.stringify({ name: "supabase" }) }
);`}
            </pre>
            <p className="text-gray-400 text-xs mt-2">
              Spec + clients (TS, Python, Rust, Go):{" "}
              <a
                href="https://x402.org"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:text-sky-300 underline"
              >
                x402.org
              </a>
              .
            </p>
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
                Is this related to the €49 Dashboard?
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
                What&rsquo;s the difference between credits and x402?
              </dt>
              <dd className="text-gray-400 leading-relaxed">
                Credits are pre-paid in EUR via Stripe (€19 for 100 calls); the
                agent identifies itself with an HMAC API key on every call.
                x402 is pay-per-call in USDC on Base — no signup, no key, the
                agent&rsquo;s wallet signs each request via the HTTP 402
                protocol. Credits suit teams with a human topping up the
                balance; x402 suits fully autonomous agents that hold their
                own wallet. Same payload, same data, same misses-are-free
                rule.
              </dd>
            </div>
            <div>
              <dt className="text-gray-100 font-semibold mb-1">
                Bigger pack? Volume pricing?
              </dt>
              <dd className="text-gray-400 leading-relaxed">
                Email{" "}
                <a
                  href="mailto:signals@gitdealflow.com"
                  className="text-sky-400 hover:text-sky-300"
                >
                  signals@gitdealflow.com
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
