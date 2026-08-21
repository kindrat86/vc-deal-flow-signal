import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import TrialClose from "@/components/TrialClose";
import BuyerRoadmap from "@/components/BuyerRoadmap";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Insider Circle, See Every Signal 24 Hours Before The Public · €197/mo",
  description:
    "The Insider Circle walkthrough. Same public engineering signal, delivered 24 hours earlier with the documented private briefing, API, and watchlist support. €197/mo.",
  alternates: {
    canonical: "/insider",
  },
  openGraph: {
    title: "Insider Circle, 24-Hour Lead Over The Free Tier",
    description:
      "Same signal, 24h earlier. €197/mo. Telegram, JSON/CSV API, custom watchlists, and the documented briefing rhythm.",
    url: "https://signals.gitdealflow.com/insider",
    type: "article",
  },
};

const STRIPE_INSIDER = "https://buy.stripe.com/bJeaEWfRpcRG6gm2fC0x20d";
const STRIPE_DASHBOARD = "https://buy.stripe.com/4gMbJ07kTaJy7kqg6s0x20b";
const SIGNUP_URL = "https://gitdealflow.com/#signup";

const STACK_ITEMS = [
  {
    label: "24-Hour Lead On The Acceleration Watch",
    description:
      "The Insider briefing is sent 24 hours before the public Acceleration Watch.",
  },
  {
    label: "Dashboard",
    description:
      "Full ranked field across 15 sectors, refreshed weekly.",
  },
  {
    label: "Private Telegram Group And Briefing",
    description:
      "A private Insider space with the documented briefing artifact.",
  },
  {
    label: "Insider API, JSON Endpoints + Bulk CSV Pulls",
    description:
      "Authenticated API access and bulk CSV pulls.",
  },
  {
    label: "Custom Thesis Watchlist",
    description:
      "A watchlist built around your written investment thesis.",
  },
  {
    label: "Webhook Delivery On Threshold Triggers",
    description:
      "Webhook delivery when a tracked organization crosses a defined threshold.",
  },
  {
    label: "Insider Delivery Calendar",
    description:
      "The documented Insider delivery calendar and briefing artifact.",
  },
  {
    label: "Direct Founder Line For Diligence Questions",
    description:
      "A direct research line for diligence questions.",
  },
  {
    label: "30-Day Signal-or-It's-Free Guarantee",
    description:
      "The documented 30-day Signal-or-It's-Free guarantee.",
  },
] as const;

const FAQS = [
  {
    q: "What does Insider get me that Dashboard doesn't?",
    a: "Insider adds a 24-hour lead, the documented briefing layer, private Telegram space, authenticated API access, bulk CSV pulls, custom watchlist support, and a direct research line.",
  },
  {
    q: "Is the 24-hour lead actually meaningful?",
    a: "The research panel observed a 21 to 47 day lead time before public fundraise announcements. Insider is for people who want the briefing 24 hours before the public watch.",
  },
  {
    q: "Why €197/mo when Dashboard is €49 ",
    a: "Dashboard is the weekly ranked field. Insider adds the 24-hour lead, documented briefing layer, API access, and research support. Both are month to month.",
  },
  {
    q: "What does the API actually return?",
    a: "Authenticated Insider API access includes JSON endpoints and bulk CSV pulls. Check the API documentation for the current endpoint and access details.",
  },
  {
    q: "Is the Telegram group active or just a broadcast channel?",
    a: "It is a private Insider space for the documented briefing and follow-up research questions.",
  },
  {
    q: "Can I downgrade to Dashboard if Insider is too much?",
    a: "Yes. The subscription is month to month. Use the Stripe customer portal or reply to a GitDealFlow email for account help.",
  },
  {
    q: "What's the Monthly Insider Drop and what do I actually get?",
    a: "It is the documented Insider delivery calendar and briefing artifact. Check the current calendar before subscribing.",
  },
] as const;

export default function InsiderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/insider#article",
        headline:
          "Insider Circle, See Every Signal 24 Hours Before The Public",
        description:
          "If venture-investing edge is time rather than research, Insider adds a 24-hour lead, the documented briefing rhythm, and research support at €197/mo.",
        url: "https://signals.gitdealflow.com/insider",
        datePublished: "2026-05-05T00:00:00.000Z",
        dateModified: "2026-05-05T00:00:00.000Z",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/insider",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "Offer",
        "@id": "https://signals.gitdealflow.com/insider#offer",
        name: "Insider Circle, €197/mo",
        description:
          "Monthly subscription at €197/mo, month to month. Includes 24-hour lead on Acceleration Watch, private Telegram group, JSON/CSV API, custom watchlist, webhooks, founder line, and Dashboard Beta.",
        price: 197,
        priceCurrency: "EUR",
        priceValidUntil: "2026-12-31",
        url: STRIPE_INSIDER,
        availability: "https://schema.org/InStock",
        category: "subscription",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 197,
          priceCurrency: "EUR",
          billingDuration: "P1M",
          unitCode: "MON",
        },
        seller: { "@id": "https://gitdealflow.com/#organization" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Insider Circle",
            item: "https://signals.gitdealflow.com/insider",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/insider"
        languages={getHreflangLanguages("/insider")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/insider" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HOOK */}
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-sky-400 transition-colors">
              ← Home
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-400">Insider Circle</span>
          </nav>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
              Free 10-minute read · Updated 2026-05-05
            </p>
            <a
              href="#close"
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 underline decoration-dotted underline-offset-4"
            >
              Skip to offer →
            </a>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
            data-speakable
          >
            Same signal, sent{" "}
            <span className="text-emerald-400">24 hours earlier</span>.<br />
            That&rsquo;s the entire Insider Circle.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            Insider adds a 24-hour head-start to the public watch, alongside
            the documented briefing, API access, and research support. This
            page explains the current delivery before you subscribe.
          </p>
        </header>

        <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Verify the claim before you buy
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            If you still need proof, compare logic, or buyer-side clarity before paying €197/mo, use the shortest page for that question first. Then come back when recurring visibility already feels useful and you want the tighter layer around the judgment.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/research" className="text-emerald-200 hover:text-emerald-100 underline underline-offset-2">
              Read the research panel
            </Link>
            <Link href="/answers/when-should-i-use-dashboard-vs-insider" className="text-emerald-200 hover:text-emerald-100 underline underline-offset-2">
              Choose Dashboard vs Insider
            </Link>
            <Link href="/buyers-guide" className="text-emerald-200 hover:text-emerald-100 underline underline-offset-2">
              Read the buyer's guide
            </Link>
          </div>
        </section>

        {/* STORY */}
        <section
          id="story"
          className="space-y-4 border-l-2 border-emerald-500/40 pl-5 text-gray-300 leading-relaxed scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold text-gray-100">
            The Tuesday I learned that Mondays are too late
          </h2>
          <p>
            A founder I had been watching went into fundraise in February
            2025. Their commit velocity had crossed the 95th percentile two
            Sundays earlier. The Acceleration Watch list, the public version
published the following Monday at 09:00 UTC.
          </p>
          <p>
            By the time I sent my outreach email Tuesday morning, the founder
            replied that they had four investors on calls already.
          </p>
          <p>
            Four investors. Inside thirty hours. From a list that had been
            public for one work-day.
          </p>
          <p>
            The signal had worked. The list had worked. The lead-time numbers
            were correct. The thing that had failed was the calendar, Monday
            morning is when every other investor opens their laptop. By
            Tuesday the round is already shaping.
          </p>
          <p className="italic text-gray-400 pt-3 border-t border-slate-800">
            That&rsquo;s the only reason the Insider Circle exists. To send
            the same list one work-day earlier.
          </p>
          <TrialClose tone="emerald">
            One Tuesday too late closes a round. If a single Sunday-instead-
            of-Monday cycle lands you the meeting before the four-other-
            investors line forms, has €197/mo already justified itself?
          </TrialClose>
        </section>

        {/* BIG DOMINO */}
        <section
          id="domino"
          className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-700/40 rounded-xl p-6 sm:p-8 space-y-4 scroll-mt-20"
        >
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            The core claim
          </p>
          <h2
            className="text-2xl sm:text-4xl font-bold text-gray-100 leading-tight tracking-tight"
            data-speakable
          >
            In venture, the edge is{" "}
            <span className="text-emerald-400">time</span>, not research.
            Anyone with a laptop can rank GitHub orgs by acceleration. Almost
            nobody can read the list before the rest of the market does.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            That belief, if true, makes Insider the most leveraged price in
            deal-flow tooling. The data is the same. The Telegram group is a
            convenience. The API is a convenience. The 24-hour lead is the
            product. Three secrets follow, each is one objection to that
            belief, and each gets broken.
          </p>
          <TrialClose tone="emerald">
            Edge is time, not research. If that single sentence reads as
            true, does the rest of the page reduce to whether €197/mo is
            cheaper than the time you&rsquo;re currently spending on
            sourcing?
          </TrialClose>
        </section>

        {/* THREE SECRETS */}
        <section id="secrets" className="space-y-8 scroll-mt-20">
          <div className="space-y-2">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              The three secrets
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Three objections. Three breakdowns.
            </h2>
          </div>

          {/* SECRET 1, VEHICLE */}
          <div className="border-l-4 border-emerald-500 pl-5 space-y-3">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              Secret #1 · Vehicle objection
            </p>
            <h3 className="text-xl font-bold text-gray-100">
              &ldquo;Twenty-four hours doesn&rsquo;t actually matter.&rdquo;
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              <strong className="text-gray-100">The research panel quantifies the wider timing window.</strong>{" "}
              The observed lead time before a public fundraise announcement
              was 21 to 47 days. Insider gives members the documented briefing
              24 hours before the public watch.
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              Use that additional day as one input in your own research and
              outreach process.
            </p>
          </div>

          {/* SECRET 2, INTERNAL */}
          <div className="border-l-4 border-sky-500 pl-5 space-y-3">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
              Secret #2 · Internal objection
            </p>
            <h3 className="text-xl font-bold text-gray-100">
              &ldquo;I already get the dashboard. The Telegram is overkill.&rdquo;
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              <strong className="text-gray-100">The dashboard tells you the rank. The Telegram tells you whether to act.</strong>{" "}
              The dashboard is a sortable table, useful for browsing, weak
              for triage. The Telegram briefing arrives with a one-line
              thesis, the chart, the percentile, and (when relevant) the
              specific reason this week&rsquo;s acceleration looks more like a
              fundraise precursor than a launch.
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              The briefing is designed to help members review the ranked field
              and decide what to investigate next.
            </p>
          </div>

          {/* SECRET 3, EXTERNAL */}
          <div className="border-l-4 border-indigo-500 pl-5 space-y-3">
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Secret #3 · External objection
            </p>
            <h3 className="text-xl font-bold text-gray-100">
              &ldquo;The data is public. Anyone can replicate it.&rdquo;
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              <strong className="text-gray-100">The methodology is public, and the service packages the recurring work.</strong>{" "}
              The methodology is open at{" "}
              <a
                href="https://ssrn.com/abstract=6606558"
                className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
                target="_blank"
                rel="noopener"
              >
                SSRN abstract 6606558
              </a>
              {" "}because the method is open to review. GitDealFlow packages
              the recurring public-GitHub research, ranking, and briefing work.
            </p>
          </div>

          <TrialClose tone="indigo">
            Three objections, three breakdowns, methodology open at SSRN. If
            none of those three was the real objection, what is? (That
            answer is the one to keep handy as the stack lands.)
          </TrialClose>
        </section>

        {/* THE SHIFT */}
        <section
          id="shift"
          className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 sm:p-8 space-y-4 scroll-mt-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            If all three are false, what does Sunday look like?
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Sunday 09:15 UTC, you open the Telegram briefing in bed. Ten
            ranked names, one-line theses, the chart, the percentile. You pick
            two whose theses match what you&rsquo;re writing checks for this
            quarter. You draft two cold emails, three lines each, and
            schedule them for Monday 07:30 in the founder&rsquo;s timezone.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Monday morning, your two emails are in the founder&rsquo;s inbox
            before the rest of the market sees the public list. Tuesday, you
            have either a meeting or a polite no. Either way, you closed a
            week of deal-flow work into thirty minutes on a Sunday.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            That rhythm is the entire product. Everything else, the API, the
            custom watchlist, the founder line, is a tool that makes the
            Sunday-evening rhythm easier.
          </p>
          <TrialClose tone="amber">
            Sunday 09:15 in bed, two cold emails scheduled for Monday 07:30,
            Tuesday a meeting or a polite no. If that rhythm replaced the
            Sunday-night sourcing block you do anyway, would you swap?
          </TrialClose>
        </section>

        {/* THE STACK */}
        <section id="stack" className="space-y-6 scroll-mt-20">
          <div className="space-y-2">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              The stack
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Here is everything you get for{" "}
              <span className="text-emerald-400">€197/mo</span>.
            </h2>
            <p className="text-gray-400 text-sm">
              Nine documented deliverables. Month to month, cancel anytime.
            </p>
          </div>

          <ol className="space-y-3">
            {STACK_ITEMS.map((item, i) => {
              const isFeatured = i === 0;
              return (
                <li
                  key={item.label}
                  className={`flex items-start gap-4 rounded-lg p-4 ${
                    isFeatured
                      ? "bg-emerald-950/30 border border-emerald-600/50 ring-1 ring-emerald-500/20"
                      : "bg-slate-900/60 border border-slate-800"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`shrink-0 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center ${
                      isFeatured
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <p className="text-gray-100 font-semibold text-base flex items-center gap-2">
                        {item.label}
                        {isFeatured && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded px-1.5 py-0.5">
                            Core
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="border-t border-slate-700 pt-6 space-y-3">
            <div className="flex items-baseline justify-between text-2xl font-bold text-gray-100">
              <span>Monthly price</span>
              <span className="text-emerald-400">€197/mo</span>
            </div>
            <p className="text-gray-400 text-xs">
              Month to month, cancel anytime. The 30-day Signal-or-It&apos;s-Free guarantee applies.
            </p>
          </div>
          <TrialClose tone="violet">
            Read the delivery calendar and a sample before deciding whether the 24-hour lead fits your sourcing rhythm.
          </TrialClose>
        </section>

        {/* GUARANTEE */}
        <section
          id="guarantee"
          className="bg-emerald-950/30 border border-emerald-700/40 rounded-xl p-6 sm:p-8 space-y-3 scroll-mt-20"
        >
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Risk reversal
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            30 days. Signal or it&rsquo;s free. No forms. No call.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            If, in your first 30 days, the 24-hour lead and the Telegram
            briefings do not surface a single name you find genuinely useful,
            reply <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 text-sm">REFUND</code> to
            any briefing. The full €197 is refunded inside two business days.
            Your Telegram seat is removed at next month boundary. No exit
            interview, no &ldquo;wait, let me show you one more thing.&rdquo;
          </p>
          <TrialClose tone="rose">
            Worst case: 30 days, you keep what you read, the €197 lands back
            on your card. Where else does the &ldquo;keep the asset, get the
            money back&rdquo; downside profile exist for an investor tool?
          </TrialClose>
        </section>

        {/* TRIAL CLOSES */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-100">
            Three trial closes, pick the one that sounds like you.
          </h2>
          <ul className="space-y-3 text-gray-300 text-base leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">1.</span>
              <span>
                Use the Insider briefing when an earlier weekly review fits
                the way you source and investigate opportunities.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">2.</span>
              <span>
                If you run a fund or syndicate, use the authenticated API and
                bulk CSV pulls in your own research workflow.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">3.</span>
              <span>
                If you are still deciding whether the weekly shortlist is enough,
                start on Dashboard at €49/mo. Move up when you want more context,
                more signal support, and less second-guessing around the call.
              </span>
            </li>
          </ul>
        </section>

        {/* IF ALL THIS DID */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">
            And if you&rsquo;re still not sure, ask yourself this.
          </h2>
          <ul className="space-y-3 text-gray-300 text-base leading-relaxed">
            <li className="border-l-4 border-amber-500 pl-5 py-1">
              Consider whether a 24-hour head-start on the public watch is
              useful in your existing research process.
            </li>
            <li className="border-l-4 border-amber-500 pl-5 py-1">
              Consider whether the private briefing and research support fit
              how you review the weekly field.
            </li>
            <li className="border-l-4 border-amber-500 pl-5 py-1">
              Review a sample and the methodology before deciding whether the
              monthly or annual plan is appropriate.
            </li>
          </ul>
        </section>

        {/* FOUR CLOSES */}
        <section
          aria-label="Closes"
          className="space-y-5 border-t border-slate-800 pt-8"
        >
          <h2 className="text-2xl font-bold text-gray-100">
            The four closes, one of these is yours.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MONEY */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                Money close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                €197/mo, month to month.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The monthly plan includes the documented Insider delivery
                calendar, briefing artifact, API access, and research support.
              </p>
            </div>

            {/* IDENTITY */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Identity close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                Start with Dashboard when the shortlist feels useful. Move here when you want more than the shortlist.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Dashboard is the weekly field. Insider is the layer you add when you want more context, more access, and a steadier signal rhythm around the decisions that matter.
              </p>
            </div>

            {/* PRICING */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
                Pricing close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                Annual billing is €1,970/yr.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The active annual Stripe Checkout route is shown alongside the
                monthly plan. Review the current delivery before choosing one.
              </p>
            </div>

            {/* URGENCY */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-rose-400 text-[10px] font-semibold uppercase tracking-wider">
                Urgency close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                The Insider space is private.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                It is used for the documented briefing and follow-up research
                questions. There is no public capacity claim.
              </p>
            </div>
          </div>
        </section>

        {/* CLOSE */}
        <section
          id="close"
          className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-600 rounded-xl p-6 sm:p-8 text-center space-y-4 scroll-mt-20"
        >
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Close
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            Join Insider Circle for €197/mo.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mx-auto">
            Review the current delivery calendar and briefing details, then
            choose the monthly or annual Stripe Checkout route.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={STRIPE_INSIDER}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-base shadow-lg shadow-emerald-500/30 transition-colors"
            >
              Lock €197/mo <span aria-hidden="true">→</span>
            </a>
            <a
              href={STRIPE_DASHBOARD}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Or start with Dashboard at €49/mo
            </a>
          </div>
          <p className="text-gray-400 text-xs pt-2">
            Or read the full case in the{" "}
            <Link
              href="/walkthrough"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              Dashboard walkthrough
            </Link>{" "}
            first, Insider includes everything in Dashboard.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="space-y-5 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        {/* ENCORE */}
        <section
          aria-label="Encore, last-chance summary"
          className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            One more time, in one block
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            Here&rsquo;s the entire offer in nine lines.
          </h2>
          <ul className="space-y-2 text-gray-200 text-base leading-relaxed">
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Sunday-09:00-UTC briefing, same ten ranked names the public
                list publishes Monday at 09:00 UTC. 24 hours of head-start on
                every other investor.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Closed Insider Telegram, founder posts the briefing as the
                anchor message; threads run all week with sector follow-ups
                and signal-quality questions.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Authenticated Insider API access and bulk CSV pulls.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Custom watchlist support built around your written thesis.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Webhooks on threshold triggers. Wire any acceleration
                percentile or signal type into Slack, Discord, or your own
                pipeline.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Direct founder line by reply-to-email or Telegram message.
                Same-day response on signal-quality questions or
                methodology clarifications.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Everything in Dashboard Beta, 140 startups, 15 sectors,
                weekly refresh, both Chrome extensions, free MCP forever.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                The documented Insider delivery calendar and briefing artifact at{" "}
                <Link
                  href="/continuity"
                  className="text-amber-300 underline decoration-dotted hover:text-amber-200"
                >
                  /continuity
                </Link>
                .
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                30-day Signal-or-It&rsquo;s-Free guarantee. €197/mo, month to month.
              </span>
            </li>
          </ul>
          <div className="border-t border-amber-700/30 pt-4 mt-4 flex items-baseline justify-between text-base">
            <span className="text-gray-300">Monthly price</span>
            <span className="text-amber-300 font-bold">€197/mo</span>
          </div>
        </section>

        {/* BUYER ROADMAP, Brunson Expert Secrets Ch 18. Four-beat
            calendar (Today → Sunday+6 → first Tuesday → Day 90→1yr) so
            the €197/mo reads as a vehicle on a calendar, not a recurring
            charge. Sits between the Encore and the Final CTA so the
            arc is the last thing the buyer reads before clicking. */}
        <BuyerRoadmap tier="insider" />

        {/* FINAL CTA */}
        <aside
          className="border-l-2 border-slate-700/60 pl-4 py-1 space-y-2"
          aria-label="If this feels too early"
        >
          <p className="text-slate-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            If this feels too early
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Start with the free digest if you still need more repetitions before paying.
            Use Dashboard if the signal already feels real but you only need the recurring
            weekly surface, not the tighter support layer.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href={SIGNUP_URL}
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted underline-offset-2"
            >
              Get the free digest first
            </a>
            <Link
              href="/answers/what-do-i-actually-get-from-dashboard-each-week"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted underline-offset-2"
            >
              See what Dashboard gives you
            </Link>
            <Link
              href="/buyers-guide"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted underline-offset-2"
            >
              Read the buyer's guide
            </Link>
          </div>
        </aside>

        <section className="border-t border-slate-800 pt-10 text-center space-y-4">
          <p className="text-gray-300 text-base leading-relaxed">
            Read this far? You already believe the 24-hour lead is real.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={STRIPE_INSIDER}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-base shadow-lg shadow-emerald-500/30 transition-colors"
            >
              Lock €197/mo · Founder price <span aria-hidden="true">→</span>
            </a>
            <a
              href={SIGNUP_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Free digest first
            </a>
          </div>
          <p className="text-gray-400 text-xs">
            30-day Signal-or-It&rsquo;s-Free guarantee · Reply REFUND for full refund
          </p>
        </section>

        <AgentSummary
          tldr="Insider Circle is the €197/mo month-to-month GitDealFlow tier. It adds a 24-hour lead on the public Acceleration Watch, documented briefing layer, private Insider space, authenticated API access with bulk CSV, custom thesis watchlist support, threshold webhooks, and a direct research line. 30-day Signal-or-It's-Free guarantee."
          pageUrl="https://signals.gitdealflow.com/insider"
          asOf="2026-05-05"
          citeAs="VC Deal Flow Signal, Insider Circle (signals.gitdealflow.com/insider)."
          facts={[
            {
              claim:
                "Insider Circle is €197/mo, month to month. The annual option is €1,970/yr.",
              sourceUrl: "https://signals.gitdealflow.com/pricing#insider-circle",
              sourceLabel: "Pricing page",
            },
            {
              claim:
                "The Insider briefing arrives 24 hours before the public Acceleration Watch.",
              sourceUrl: "https://signals.gitdealflow.com/predicted",
              sourceLabel: "Acceleration Watch",
            },
            {
              claim:
                "Authenticated Insider API access and bulk CSV pulls are included.",
              sourceUrl: "https://signals.gitdealflow.com/agents",
              sourceLabel: "Agents surface",
            },
          ]}
        />

        <div aria-hidden="true" className="md:hidden h-20" />
      </div>

      <div
        aria-label="Sticky insider bar (mobile)"
        className="fixed bottom-0 inset-x-0 md:hidden z-40 border-t border-emerald-500/40 bg-slate-950/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(16,185,129,0.15)]"
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
              Insider · founder rate
            </p>
            <p className="text-gray-100 font-bold text-lg tabular-nums leading-none">
              €197
              <span className="text-gray-400 text-[10px] font-medium ml-1.5 uppercase tracking-wider">
                /mo
              </span>
            </p>
          </div>
          <a
            href={STRIPE_INSIDER}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-4 py-2.5 shadow-md"
          >
            Join →
          </a>
        </div>
      </div>
    </>
  );
}
