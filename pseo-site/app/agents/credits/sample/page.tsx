import type { Metadata } from "next";
import Link from "next/link";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Free 5-Call Sample — Agent Credits",
  description:
    "Try get_deep_signal before buying credits: drop your email, get an API key with 5 free deep-signal calls within 24 hours. No card, no subscription.",
  alternates: { canonical: "/agents/credits/sample" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Free 5-Call Sample — Agent Credits",
    description:
      "5 free get_deep_signal calls to test the paid endpoint. Key arrives by email within 24 hours.",
    type: "website",
    url: `${SITE}/agents/credits/sample`,
  },
};

export default async function AgentCreditsSamplePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const sent = status === "sent";
  const invalid = status === "invalid";
  const errored = status === "error";

  return (
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
        <Link
          href="/agents/credits"
          className="hover:text-gray-300 transition-colors"
        >
          Credits
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Sample</span>
      </nav>

      <header className="mb-10">
        <p className="text-emerald-400 text-xs uppercase tracking-wider mb-3 font-semibold">
          Free sample · No card required
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight tracking-tight">
          Try 5 deep-signal calls free
        </h1>
        <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
          Before you buy the{" "}
          <Link
            href="/agents/credits"
            className="text-amber-400 hover:text-amber-300 underline"
          >
            €19 credit pack
          </Link>
          , test the exact same endpoint on the house. Drop your email below
          and you&rsquo;ll get an API key loaded with{" "}
          <strong className="text-gray-100">
            5 free <code className="text-emerald-300 font-mono">get_deep_signal</code>{" "}
            calls
          </strong>{" "}
          — same payload, same data, same misses-are-free rule as the paid
          pack.
        </p>
      </header>

      {sent ? (
        <aside
          role="status"
          aria-live="polite"
          className="mb-10 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 sm:p-8"
        >
          <h2 className="text-emerald-300 font-semibold text-lg mb-2">
            Request received — your key arrives by email within 24 hours
          </h2>
          <p className="text-emerald-100/80 text-sm leading-relaxed mb-2">
            Sample keys are issued by a human (that&rsquo;s the honest part:
            there&rsquo;s no self-serve minting for the free tier yet). You&rsquo;ll
            get the key plus a copy-paste curl and MCP config at the address
            you entered.
          </p>
          <p className="text-emerald-100/60 text-xs leading-relaxed">
            Nothing after 24 hours? Check spam, then email{" "}
            <a
              href="mailto:signals@gitdealflow.com"
              className="text-emerald-200 hover:text-emerald-100 underline"
            >
              signals@gitdealflow.com
            </a>
            .
          </p>
        </aside>
      ) : (
        <section
          className="mb-10 rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8"
          aria-label="Request your free sample key"
        >
          {invalid && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300 text-sm"
            >
              That email didn&rsquo;t look valid — try again.
            </p>
          )}
          {errored && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300 text-sm"
            >
              Something went wrong on our side. Try again in a minute, or email{" "}
              <a
                href="mailto:signals@gitdealflow.com"
                className="underline hover:text-red-200"
              >
                signals@gitdealflow.com
              </a>
              .
            </p>
          )}
          <h2 className="text-xl font-bold text-gray-100 mb-4">
            Get your 5-call key
          </h2>
          <form method="POST" action="/api/agents/sample" className="space-y-4">
            <div>
              <label
                htmlFor="sample-email"
                className="block text-sm font-semibold text-gray-200 mb-1.5"
              >
                Email
              </label>
              <input
                id="sample-email"
                name="email"
                type="email"
                required
                placeholder="you@fund.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="sample-use-case"
                className="block text-sm font-semibold text-gray-200 mb-1.5"
              >
                What will you point it at?{" "}
                <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                id="sample-use-case"
                name="use_case"
                type="text"
                maxLength={500}
                placeholder="e.g. dealflow triage agent, IC memo enrichment, Clay table"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
              />
            </div>
            {/* Honeypot — hidden from humans, bots fill it and get ignored */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="sample-website">Website</label>
              <input
                id="sample-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
            >
              Send me the 5-call key →
            </button>
            <p className="text-gray-500 text-xs leading-relaxed">
              Your key arrives by email within 24 hours — sample keys are
              issued by a human, not a bot. You&rsquo;ll also join the weekly
              Signal Digest (unsubscribe any time, one click).
            </p>
          </form>
        </section>
      )}

      <section className="mb-10" aria-label="What the sample includes">
        <h2 className="text-xl font-bold text-gray-100 mb-4">
          What 5 free calls get you
        </h2>
        <ul className="text-gray-300 text-sm leading-relaxed space-y-2 mb-4">
          <li>
            <strong className="text-gray-100">The full paid payload</strong> —
            composite score (0–100), in-sector rank + percentile,
            plain-English thesis, top 3 comparables, multi-period history,
            citation string. Nothing is trimmed for the sample.
          </li>
          <li>
            <strong className="text-gray-100">Misses are free</strong> — a
            startup outside the tracked universe returns{" "}
            <code className="text-emerald-400 font-mono">{`{ found: false }`}</code>{" "}
            and costs 0 of your 5 calls.
          </li>
          <li>
            <strong className="text-gray-100">Works everywhere the paid key works</strong>{" "}
            — the <code className="text-emerald-400 font-mono">get_deep_signal</code>{" "}
            MCP tool and{" "}
            <code className="text-emerald-400 font-mono">
              POST /api/agent/deep-signal
            </code>
            .
          </li>
        </ul>
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
            Once your key lands
          </p>
          <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre">
{`curl -X POST https://signals.gitdealflow.com/api/agent/deep-signal \\
  -H "Authorization: Bearer <your_sample_key>" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"supabase"}'`}
          </pre>
        </div>
      </section>

      <section className="mb-10" aria-label="FAQ">
        <h2 className="text-xl font-bold text-gray-100 mb-4">FAQ</h2>
        <dl className="space-y-5 text-sm">
          <div>
            <dt className="text-gray-100 font-semibold mb-1">
              Why does the key take up to 24 hours?
            </dt>
            <dd className="text-gray-400 leading-relaxed">
              Sample keys are issued manually — a human reads every request.
              That keeps the free tier abuse-free without a signup wall. Paid
              credit-pack keys are automated and arrive in ~30 seconds.
            </dd>
          </div>
          <div>
            <dt className="text-gray-100 font-semibold mb-1">
              Card required? Auto-upgrade? Catch?
            </dt>
            <dd className="text-gray-400 leading-relaxed">
              No card, no auto-anything. When the 5 calls run out the endpoint
              returns a payment-required error and you decide whether the{" "}
              <Link
                href="/agents/credits"
                className="text-sky-400 hover:text-sky-300 underline"
              >
                €19 pack
              </Link>{" "}
              is worth it. The six free MCP tools stay free regardless.
            </dd>
          </div>
          <div>
            <dt className="text-gray-100 font-semibold mb-1">
              Fully autonomous agent, no inbox?
            </dt>
            <dd className="text-gray-400 leading-relaxed">
              Use the{" "}
              <Link
                href="/agents/credits#x402-detail"
                className="text-sky-400 hover:text-sky-300 underline"
              >
                x402 pay-per-call endpoint
              </Link>{" "}
              instead — $0.19 USDC per call on Base, no key, no email, the
              wallet signs each request.
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <h2 className="text-gray-100 font-semibold text-lg mb-2">
          Already know you need more than 5?
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Skip the sample: €19 buys 100 calls (€0.19 each), keys arrive in ~30
          seconds, credits never expire.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/agents/credits"
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
          >
            See the €19 credit pack
          </Link>
          <Link
            href="/agents"
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 hover:text-gray-100 text-sm font-medium transition-colors"
          >
            See all free agent surfaces
          </Link>
        </div>
      </section>
    </article>
  );
}
