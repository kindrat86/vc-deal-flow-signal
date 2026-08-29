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

      <section className="space-y-4 text-gray-400 text-sm leading-relaxed mb-8">
        <h2 className="text-xl font-semibold text-gray-100">What is verified today</h2>
        <p>
          The public commission is 20% recurring. Enrollment, referral-link
          creation, attribution status, and the current operating terms are
          handled in the Refgrow portal. Read those terms before publishing a
          promotion because the portal, not a screenshot or an old draft,
          controls which products qualify and when a commission becomes payable.
        </p>
        <p>
          A referral link identifies the affiliate and lets the portal record
          attributed purchases. It does not guarantee that every visit, signup,
          or purchase will qualify. Refunds, duplicate accounts, self-referrals,
          abuse, and transactions outside the published attribution rules may
          be excluded under the portal terms.
        </p>
      </section>

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
      </section>

      <section className="space-y-4 text-gray-400 text-sm leading-relaxed mb-8">
        <h2 className="text-xl font-semibold text-gray-100">What affiliates can say</h2>
        <p>
          GitDealFlow reads public GitHub engineering activity across 350+
          startup organizations across 15 sectors and translates weekly movement
          into plain-English research signals. The product helps investors and
          operators decide which teams deserve a closer look. Affiliates may
          describe those public capabilities and link readers to the methodology,
          sample output, pricing, or free Sunday issue.
        </p>
        <p>
          Keep the boundary explicit: engineering acceleration is a diligence
          input, not proof that a company is raising, a promise of investment
          returns, or private access to founders. Affiliates must not invent
          customer outcomes, imply endorsement by named funds, or present the
          public signal as investment advice.
        </p>
      </section>

      <section className="space-y-4 text-gray-400 text-sm leading-relaxed mb-8">
        <h2 className="text-xl font-semibold text-gray-100">What is not published yet</h2>
        <p>
          No affiliate earnings, conversion rates, partner counts, or rankings are published yet.
          The program does not have enough verified partner history to support a
          public earnings example or leaderboard. The previous leaderboard route
          is retired and redirects here. If real results accumulate and can be
          read back from the portal, future reporting will show the measurement
          window, sample size, and source rather than anonymous success claims.
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
