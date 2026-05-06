import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "First Look Pass confirmed. Reply with your sector.",
  description:
    "Founder-written onboarding for First Look Pass buyers. Pick your sector, get the deep dive in 24 hours.",
  alternates: { canonical: "/thanks/firstlook" },
  robots: { index: false, follow: false },
};

export default function ThanksFirstLook() {
  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/thanks/firstlook"
        languages={getHreflangLanguages("/thanks/firstlook")}
      />
      <AgentMirrorLinks path="/thanks/firstlook" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Payment confirmed · First Look Pass
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            €7 received. The 24-hour clock starts when you pick the sector.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Stripe receipt is in your inbox. To start the deep dive, reply
            with the one sector you want the report written against.
          </p>
        </header>

        <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-3">
          <p className="text-gray-300 text-sm font-semibold">
            We track 19 sectors:
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            AI/ML · AI infra · AI safety · climate tech · crypto/web3 ·
            cybersecurity · data infra · dev tools · edtech · fintech rails ·
            future of work · gaming · healthtech · identity · observability ·
            open source tooling · robotics · SaaS infra · vertical AI
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            If your thesis cuts across (e.g. &ldquo;AI infra meets fintech
            rails&rdquo;), name the cross — the Sweep will pull from both
            sectors.
          </p>
        </section>

        <section className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-700/40 rounded-xl p-6 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            What happens next
          </p>
          <ol className="space-y-2 text-gray-200 text-base leading-relaxed list-decimal list-inside">
            <li>You reply with the sector.</li>
            <li>The founder confirms within an hour (during EU business hours).</li>
            <li>
              Within 24 hours of confirmation, you get the PDF + the raw CSV
              + a written walkthrough.
            </li>
            <li>
              €7 credits toward the Dashboard if you upgrade within 14 days
              — reply{" "}
              <code className="text-amber-200 bg-amber-900/40 px-1.5 py-0.5 rounded text-xs">
                REQUEST CREDIT
              </code>{" "}
              to your delivery email and the founder applies it manually.
            </li>
          </ol>
        </section>

        {/* Brunson DCS #14 Funnel Stacking + Secret 3 Ladder-to-Funnel
            ascension — the thanks page must force exactly one logical
            next move. Promote the Dashboard upgrade from a footnote link
            to a button-grade CTA, with the €7 credit framed as already
            applied so the math reads "€2.97 for the first month." */}
        <section className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/40 rounded-xl p-6 space-y-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Skip the wait — lock the Dashboard while you&rsquo;re here
          </p>
          <p className="text-gray-200 text-base leading-relaxed">
            If you already know the deep dive is going to make you a
            Dashboard subscriber, lock the founding rate now. Your €7
            credit applies — the first month bills{" "}
            <strong className="text-sky-200">€2.97</strong> instead of
            €9.97. Founding rate is locked forever; public price steps
            to €49/mo at launch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 hover:bg-sky-500 px-5 py-3 text-white text-base font-semibold transition-colors shadow-sm shadow-sky-500/30"
            >
              Lock founding rate (€2.97 first month) →
            </Link>
            <Link
              href="/perfect-webinar"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-600 px-5 py-3 text-gray-200 text-sm font-medium transition-colors"
            >
              Read the 12-min walkthrough first
            </Link>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed pt-1">
            30-day Signal-or-It&rsquo;s-Free guarantee. Reply{" "}
            <code className="text-gray-400 bg-slate-900/60 px-1.5 py-0.5 rounded text-xs">
              REFUND
            </code>{" "}
            if the data didn&rsquo;t earn its keep — full refund, no
            questions, you keep the deep dive.
          </p>
        </section>
      </div>
    </>
  );
}
