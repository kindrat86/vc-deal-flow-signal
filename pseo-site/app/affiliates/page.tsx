import type { Metadata } from "next";

const PORTAL_URL = "https://gitdealflow.refgrow.com";

export const metadata: Metadata = {
  title: "GitDealFlow Affiliate Program, 20% Recurring Commission",
  description:
    "GitDealFlow's affiliate program pays 20% recurring commission. Sign up and see the current attribution and payout terms in the affiliate portal.",
  alternates: { canonical: "/affiliates" },
  openGraph: {
    title: "GitDealFlow Affiliate Program, 20% Recurring Commission",
    description:
      "Promote GitDealFlow with a verified 20% recurring commission. Current terms are in the affiliate portal.",
    url: "https://signals.gitdealflow.com/affiliates",
  },
};

export default function AffiliatesPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-3">
        Affiliate program
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-5 leading-tight">
        Earn 20% recurring commission promoting GitDealFlow
      </h1>
      <p className="text-gray-400 text-base leading-relaxed mb-8">
        The verified public offer is 20% recurring commission. The affiliate
        portal is the source of truth for attribution, eligible products, and
        payout terms.
      </p>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-100 mb-3">Who it is for</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Newsletter writers, community operators, and product reviewers whose
          audiences care about venture research, startup signals, or developer
          tools. Share only where a recommendation and any affiliate disclosure
          are welcome.
        </p>
      </section>

      <a
        href={PORTAL_URL}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center rounded-lg bg-signal-500 hover:bg-signal-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors"
      >
        Open the affiliate portal →
      </a>
    </main>
  );
}
