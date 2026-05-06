import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Tweet Teardown confirmed. Reply with the startup name.",
  description:
    "Founder-written onboarding for Tweet Teardown buyers. Name a startup, get the tweet-length teardown in 24 hours.",
  alternates: { canonical: "/thanks/teardown" },
  robots: { index: false, follow: false },
};

export default function ThanksTeardown() {
  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/thanks/teardown"
        languages={getHreflangLanguages("/thanks/teardown")}
      />
      <AgentMirrorLinks path="/thanks/teardown" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
            Payment confirmed · Tweet Teardown
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            €1 received. Reply with the startup name and the 24-hour clock starts.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Stripe receipt is in your inbox. The Teardown is hand-written
            from public GitHub data, so the only thing that can&rsquo;t be
            done at scale is choosing the org &mdash; that comes from you.
          </p>
        </header>

        <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-3">
          <p className="text-gray-300 text-sm font-semibold">
            What to send back
          </p>
          <ul className="space-y-2 text-gray-300 text-sm leading-relaxed list-disc list-inside marker:text-rose-300">
            <li>The startup name (and its public GitHub org URL if you have one).</li>
            <li>
              Optional: one sentence on what you already think about them.
              The kicker insight gets sharper when the founder knows whether
              you&rsquo;re bullish, sceptical, or just curious.
            </li>
          </ul>
          <p className="text-gray-500 text-xs leading-relaxed">
            If the org has no public GitHub footprint, you get an immediate
            €1 refund &mdash; no public commit data means no signal to read.
          </p>
        </section>

        <section className="bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950 border border-rose-700/40 rounded-xl p-6 space-y-3">
          <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
            What happens next
          </p>
          <ol className="space-y-2 text-gray-200 text-base leading-relaxed list-decimal list-inside">
            <li>You reply with the startup name.</li>
            <li>The founder confirms within an hour (during EU business hours).</li>
            <li>
              Within 24 hours of confirmation, you get the tweet-length
              teardown in your inbox &mdash; signal type, 14-day acceleration
              %, kicker insight.
            </li>
            <li>
              €1 credits toward the €7 First Look Pass if you upgrade within
              7 days &mdash; reply{" "}
              <code className="text-rose-200 bg-rose-900/40 px-1.5 py-0.5 rounded text-xs">
                REQUEST CREDIT
              </code>{" "}
              to your delivery email and the founder applies it manually.
            </li>
          </ol>
        </section>

        <section className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 space-y-2">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Already know you want the full sector deep dive?
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Skip the upgrade email and go straight to the €7 First Look Pass.
            The €1 credit applies if you check out within 7 days &mdash;
            effective price, €6.
          </p>
          <p className="pt-2">
            <Link
              href="/firstlook"
              className="text-amber-300 hover:text-amber-200 text-sm underline decoration-dotted"
            >
              See the First Look Pass &mdash; €7 →
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
