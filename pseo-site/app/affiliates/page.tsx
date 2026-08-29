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

      <section className="space-y-5 text-gray-400 text-sm leading-relaxed mb-8">
        <h2 className="text-xl font-semibold text-gray-100">What the 20% offer means</h2>
        <p>
          Commission is calculated from an eligible purchase attributed to
          your affiliate account under the rules shown in Refgrow. For a simple
          current-price illustration, 20% of the €49 monthly Dashboard price is
          €9.80 for each eligible paid month. That is arithmetic, not an earnings
          result, forecast, or promise that a visitor will convert.
        </p>
        <p>
          GitDealFlow does not restate a cookie window, payout threshold,
          holdback period, payment schedule, or eligible-product list on this
          page. Those details can change as the program develops. Check the
          portal before publishing a promotion and rely on the terms displayed
          there for the referral you are making.
        </p>
      </section>

      <section className="space-y-5 text-gray-400 text-sm leading-relaxed mb-8">
        <h2 className="text-xl font-semibold text-gray-100">A useful recommendation to make</h2>
        <p>
          Explain the concrete job GitDealFlow helps with: inspecting public
          engineering momentum across 350+ startup organizations in 15 sectors.
          The documented research release contains 219 startup-period
          observations across 55 startups and no linked funding-event labels.
          That makes the product useful for research, sourcing, and diligence,
          but it does not make it a financing forecast.
        </p>
        <p>
          A responsible recommendation can show how an investor checks commit
          velocity, contributor growth, or repository expansion and then uses
          that observation to ask better diligence questions. It should not say
          that the research proves funding accuracy, precision, recall, a median
          funding lead time, or lift over a financing base rate. It should also
          avoid invented customer stories, partner relationships, conversion
          rates, and payout examples presented as actual results.
        </p>
      </section>

      <section className="space-y-5 text-gray-400 text-sm leading-relaxed mb-8">
        <h2 className="text-xl font-semibold text-gray-100">Before you publish</h2>
        <p>
          Open the portal, create or retrieve your own attributed link, and test
          that it resolves to the intended GitDealFlow page. Add a plain-language
          disclosure near the link so readers know you may earn a commission.
          Keep the surrounding explanation in your own voice and make it useful
          even for someone who never buys.
        </p>
        <p>
          If you need a larger co-marketing or joint-venture arrangement, discuss
          it separately. Larger arrangements are considered case by case; there
          is no automatic upgrade and no public 50% revenue-share promise. The
          standard public affiliate offer remains the 20% recurring program
          displayed in Refgrow.
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
