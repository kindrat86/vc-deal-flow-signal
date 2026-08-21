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

      <section className="space-y-5 text-gray-400 text-sm leading-relaxed mb-8">
        <h2 className="text-xl font-semibold text-gray-100">How to share responsibly</h2>
        <p>
          Start with useful context for the audience you already serve. GitDealFlow provides public engineering-activity data, including commit velocity, contributor growth, and repository expansion. It is best introduced as a research and diligence aid for people who want a repeatable way to inspect public technical activity.
        </p>
        <p>
          Do not present a signal as a guarantee of funding, a recommendation to invest, or evidence that a company will reach a specific outcome. The associated SSRN release is descriptive: 219 startup-period observations of public engineering activity with no linked funding-event labels. Readers should verify investment-relevant facts independently.
        </p>
        <p>
          Use a clear affiliate disclosure wherever you share a referral link. Tell readers that you may receive a commission if they purchase through it, and link to the destination that matches the material you discussed. The affiliate portal shows current attribution, eligible-product, and payout terms. Those terms control if any other page or older asset differs.
        </p>
        <h2 className="text-xl font-semibold text-gray-100">A practical starting point</h2>
        <p>
          Share a short explanation of one public engineering pattern, how you would verify it, and why it can be useful in a diligence workflow. That gives readers enough information to decide whether the tool fits their process without overstating what the data can prove.
        </p>
        <p>
          Do not use unsolicited messages, scraped contact lists, or claims of access to private company information. A useful referral should be relevant, transparent about compensation, and easy for the reader to ignore if it does not fit their work.
        </p>
        <p>
          Before publishing, read the destination page yourself and confirm that the link, offer, and disclosure still match the current portal terms. If you cannot describe the tool plainly, do not promote it yet. Clear context is more useful than a broad promise.
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
