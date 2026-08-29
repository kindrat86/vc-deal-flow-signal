import type { Metadata } from "next";
import { withEditorialOverride } from "@/lib/metadata";

const PORTAL_URL = "https://gitdealflow.refgrow.com";

export const metadata: Metadata = withEditorialOverride({
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
});

export default function AffiliatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "GitDealFlow Affiliate Program",
    url: "https://signals.gitdealflow.com/affiliates",
    description:
      "GitDealFlow's affiliate program pays 20% recurring commission. The Refgrow portal is the source of truth for current terms.",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Static JSON-LD only; no user-controlled content enters this object. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          Newsletter writers, community operators, product reviewers, and
          existing customers whose audiences care about venture research,
          startup signals, or developer tools. Share only where a recommendation
          and any affiliate disclosure are welcome.
        </p>
      </section>

      <section className="space-y-5 text-gray-400 text-sm leading-relaxed mb-8">
        <h2 className="text-xl font-semibold text-gray-100">How to share responsibly</h2>
        <p>
          Start with useful context for the audience you already serve.
          GitDealFlow provides public engineering-activity data, including commit
          velocity, contributor growth, and repository expansion. It is a
          research and diligence aid, not a financing forecast.
        </p>
        <p>
          Use a clear affiliate disclosure wherever you share a referral link.
          Do not use unsolicited messages, scraped contact lists, funding
          guarantees, fake endorsements, or claims of private company access.
        </p>
        <p>
          No affiliate earnings, conversion rates, partner counts, or rankings
          are published yet. The program is young. When real partner results
          exist and can be read back from the portal, they can be reported.
        </p>
      </section>

      <a
        href={PORTAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-lg bg-signal-500 hover:bg-signal-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors"
      >
        Open the affiliate portal →
      </a>
    </main>
  );
}
