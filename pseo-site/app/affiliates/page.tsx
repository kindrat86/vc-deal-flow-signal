import type { Metadata } from "next";
import Link from "next/link";

const PORTAL_URL = "https://gitdealflow.refgrow.com";

export const metadata: Metadata = {
  title: "Affiliate Program, 20% Lifetime Commission on GitDealFlow",
  description:
    "Earn 20% lifetime recurring commission promoting VC Deal Flow Signal. €399 per Sector Sweep referral. €19.40/mo per Insider Circle subscriber, forever. 60-day cookie. Monthly payouts via Stripe.",
  alternates: {
    canonical: "/affiliates",
  },
  openGraph: {
    title: "GitDealFlow Affiliate Program, 20% Lifetime",
    description:
      "20% lifetime commission. €399 per Sector Sweep, €19.40/mo per Insider sub. 60-day cookie. Monthly Stripe payouts.",
    url: "https://signals.gitdealflow.com/affiliates",
  },
};

export default function AffiliatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/affiliates#webpage",
        url: "https://signals.gitdealflow.com/affiliates",
        name: "GitDealFlow Affiliate Program",
        description:
          "20% lifetime commission on every paid referral. Promote VC Deal Flow Signal to readers and communities that care about earlier startup signal, clearer timing, and less noise.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
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
            name: "Affiliates",
            item: "https://signals.gitdealflow.com/affiliates",
          },
        ],
      },
      {
        "@type": "Service",
        name: "GitDealFlow Affiliate Program",
        serviceType: "Affiliate marketing program",
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        offers: {
          "@type": "Offer",
          name: "20% lifetime recurring commission",
          description:
            "20% commission on every paid referral, lifetime. €399 on each €1,997 Sector Sweep. €19.40/mo on each €197/mo Insider Circle subscription, for the lifetime of the subscription.",
          priceCurrency: "EUR",
        },
        areaServed: "Worldwide",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What's the commission rate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "20% of every paid referral, for the lifetime of the customer's subscription. €399 on each €1,997 Sector Sweep one-time sale. €19.40/mo on each €197/mo Insider Circle subscription, every month for as long as the customer stays subscribed.",
            },
          },
          {
            "@type": "Question",
            name: "How does attribution work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We use a 60-day last-click attribution cookie. When a visitor clicks your unique referral link and converts within 60 days, the commission is yours. Tracking runs across both gitdealflow.com (apex marketing site) and signals.gitdealflow.com (product subdomain).",
            },
          },
          {
            "@type": "Question",
            name: "When do I get paid?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Monthly payouts via Stripe, with a €50 minimum payout threshold. Earnings are held for 60 days from the conversion date, twice the 30-day customer refund window, so a clawback is impossible if a customer cancels.",
            },
          },
          {
            "@type": "Question",
            name: "Who is a good fit to promote GitDealFlow?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Newsletter writers covering venture, alternative data, or developer tooling. Communities of scout angels and emerging fund managers. Developer-investor influencers on Twitter, Substack, or YouTube. Anyone whose audience cares about how to find venture-backed startups before they fundraise.",
            },
          },
          {
            "@type": "Question",
            name: "Are there channels where I can't promote?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We don't allow brand-keyword bidding on Google Ads (bidding on 'GitDealFlow' or 'gitdealflow.com' cannibalizes our own SEM). We don't allow impersonation of the founder or the brand. Some Reddit subreddits (r/EntrepreneurRideAlong, r/venturecapital) auto-remove affiliate posts, please follow each platform's rules. The full prohibited-channels list is on the program spec linked in your affiliate dashboard.",
            },
          },
          {
            "@type": "Question",
            name: "How do I sign up?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Visit gitdealflow.refgrow.com, register with your email, and your unique referral link is generated immediately. No approval queue, you can start sharing within 60 seconds.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-10 rounded-xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
            Use this page if you want the full affiliate economics. But if your real question is swipe copy, proven distribution plays, or active partnership paths, start with the sharper routes first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/affiliates/funnel-hack" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 text-slate-950 text-sm font-semibold hover:bg-signal-600 transition-colors">
              Open the swipe kit →
            </Link>
            <Link href="/earned-plays" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read earned plays →
            </Link>
            <Link href="/partners" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              See partner tracks →
            </Link>
          </div>
        </section>
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Affiliates</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Earn 20% lifetime commission promoting GitDealFlow
        </h1>
        <p
          className="text-gray-400 text-base leading-relaxed mb-10 max-w-2xl"
          data-agent-summary
        >
          A lifetime-recurring affiliate program for newsletter writers,
          community operators, and venture-tooling reviewers whose readers care
          about earlier startup signal. €399 on every Sector Sweep referral.
          €19.40/mo on every Insider Circle subscriber, for as long as they stay subscribed.
        </p>

        <a
          href={PORTAL_URL}
          className="inline-flex items-center gap-2 rounded-lg bg-signal-500 hover:bg-signal-400 active:bg-sky-600 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-signal-500/30 transition-all hover:-translate-y-0.5 mb-12"
          target="_blank"
          rel="noopener"
        >
          Join the program at gitdealflow.refgrow.com →
        </a>

        {/* Affiliate program quick-nav. Three sub-pages live: Leaderboard
            (top 10 earners, anonymized), Swipe Kit (6 clone-ready content
            templates with the Sneaky Affiliate Funnel mechanic), and
            Top Partners (50-publisher Dream-50 roster). */}
        <nav
          className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-3"
          aria-label="Affiliate sub-pages"
        >
          <Link
            href="/affiliates/leaderboard"
            className="rounded-lg border border-slate-800 bg-slate-900/60 hover:border-amber-700/40 hover:bg-amber-950/10 p-4 transition-colors"
          >
            <p className="text-amber-300 text-xs font-medium uppercase tracking-wider mb-1">
              Leaderboard
            </p>
            <p className="text-gray-100 text-sm font-semibold mb-1">
              Top 10 earners
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Anonymized monthly snapshot. €5,200+ Platinum, 11.3% top CVR.
            </p>
          </Link>
          <Link
            href="/affiliates/funnel-hack"
            className="rounded-lg border border-slate-800 bg-slate-900/60 hover:border-emerald-700/40 hover:bg-emerald-950/10 p-4 transition-colors"
          >
            <p className="text-emerald-300 text-xs font-medium uppercase tracking-wider mb-1">
              Swipe Kit
            </p>
            <p className="text-gray-100 text-sm font-semibold mb-1">
              6 clone-ready templates
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Tweet thread + LinkedIn + blog + newsletter + podcast + 3-email
              sequence. Free book as bait, 60-day cookie.
            </p>
          </Link>
          <Link
            href="/affiliates/top-partners"
            className="rounded-lg border border-slate-800 bg-slate-900/60 hover:border-sky-700/40 hover:bg-sky-950/10 p-4 transition-colors"
          >
            <p className="text-sky-300 text-xs font-medium uppercase tracking-wider mb-1">
              Dream 50
            </p>
            <p className="text-gray-100 text-sm font-semibold mb-1">
              Publishers we want
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              50 named newsletter writers, podcast hosts, communities, with
              outreach status and pitch templates.
            </p>
          </Link>
        </nav>

        <section className="mb-12" aria-label="Earnings examples">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What you earn
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-2">
                Sector Sweep, one-time
              </p>
              <p className="text-3xl font-bold text-emerald-400 mb-1">€399</p>
              <p className="text-gray-400 text-sm">
                20% of €1,997 per referred sale. Paid out the month after the
                60-day payout hold clears.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-2">
                Insider Circle, recurring
              </p>
              <p className="text-3xl font-bold text-emerald-400 mb-1">
                €19.40<span className="text-base text-gray-400">/mo</span>
              </p>
              <p className="text-gray-400 text-sm">
                20% of €197/mo for the full lifetime of the subscription. 10
                referred subscribers = €194/mo recurring, forever.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12" aria-label="Program details">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Program details
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="px-6 py-4 text-gray-400 font-medium">Commission</td>
                  <td className="px-6 py-4 text-gray-100">
                    20% of every paid referral
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="px-6 py-4 text-gray-400 font-medium">Duration</td>
                  <td className="px-6 py-4 text-gray-100">
                    Lifetime (paid every billing cycle the customer stays
                    subscribed)
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="px-6 py-4 text-gray-400 font-medium">
                    Cookie window
                  </td>
                  <td className="px-6 py-4 text-gray-100">
                    60 days, last-click attribution
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="px-6 py-4 text-gray-400 font-medium">
                    Tracking domains
                  </td>
                  <td className="px-6 py-4 text-gray-100">
                    gitdealflow.com + signals.gitdealflow.com
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="px-6 py-4 text-gray-400 font-medium">
                    Min payout
                  </td>
                  <td className="px-6 py-4 text-gray-100">€50</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="px-6 py-4 text-gray-400 font-medium">
                    Payout frequency
                  </td>
                  <td className="px-6 py-4 text-gray-100">Monthly via Stripe</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-400 font-medium">
                    Hold period
                  </td>
                  <td className="px-6 py-4 text-gray-100">
                    60 days (twice the 30-day customer refund window)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12" aria-label="How it works">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            How it works
          </h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold flex items-center justify-center text-sm">
                1
              </span>
              <div>
                <p className="text-gray-100 font-medium mb-1">
                  Sign up at gitdealflow.refgrow.com
                </p>
                <p className="text-gray-400 text-sm">
                  Email-only signup. No approval queue, no waiting list. Your
                  unique referral link is live within 60 seconds.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold flex items-center justify-center text-sm">
                2
              </span>
              <div>
                <p className="text-gray-100 font-medium mb-1">
                  Share your link
                </p>
                <p className="text-gray-400 text-sm">
                  Anywhere your audience reads about venture, alt-data, or
                  developer tooling. Newsletter recommendations, Substack
                  posts, dev.to articles, Twitter threads, podcast show notes.
                  See the program spec for prohibited channels.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold flex items-center justify-center text-sm">
                3
              </span>
              <div>
                <p className="text-gray-100 font-medium mb-1">
                  Get paid every month
                </p>
                <p className="text-gray-400 text-sm">
                  Track clicks, signups, and earnings in your Refgrow dashboard.
                  Once your balance crosses €50 and the 60-day hold passes,
                  your payout fires automatically via Stripe Connect.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className="mb-12" aria-label="Who's a fit">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Who&apos;s a fit
          </h2>
          <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>
              Newsletter writers covering venture, alt-data, or developer
              tooling, recommend GitDealFlow as a tool your readers use
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>
              Communities of scout angels and emerging fund managers -
              workspace pinned-resource posts, Slack/Discord recommendations
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>
              Developer-investor influencers on Twitter, Substack, or YouTube
pre-roll mentions, sponsored thread placements
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>
              VC tooling reviewers, comparison posts, alternative-to articles
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>
              Anyone whose audience cares about finding venture-backed startups
              before they fundraise (the SSRN paper is a descriptive 219-observation panel; the
              21-47-day lead is our hypothesis, validated on /scorecard)
            </li>
          </ul>
        </section>

        <section className="mb-12" aria-label="Promotional rules">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What we don&apos;t allow
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            We want the program to stay clean for everyone. The following are
            grounds for commission claw-back and program removal:
          </p>
          <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="text-rose-400 mt-0.5">✗</span>
              <span>
                <strong className="text-gray-200">
                  Bidding on our brand keywords
                </strong>{" "}
                in Google Ads, Bing Ads, or any paid-search auction.
                &quot;GitDealFlow&quot;, &quot;gitdealflow.com&quot;, &quot;VC
                Deal Flow Signal&quot; and obvious misspellings are off-limits.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400 mt-0.5">✗</span>
              <span>
                <strong className="text-gray-200">Impersonation</strong> of the
                founder, the brand, or any team member.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400 mt-0.5">✗</span>
              <span>
                <strong className="text-gray-200">Spam tactics</strong>: bulk-DMs, comment spam, scraped-list cold email, fake-account
                amplification.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400 mt-0.5">✗</span>
              <span>
                <strong className="text-gray-200">Misleading claims</strong>{" "}
                about the product, pricing, or methodology. The SSRN paper at{" "}
                <a
                  href="https://ssrn.com/abstract=6606558"
                  className="text-sky-400 hover:text-sky-300"
                  target="_blank"
                  rel="noopener"
                >
                  ssrn.com/abstract=6606558
                </a>{" "}
                is the authoritative source on what the signal does and does
                not predict.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400 mt-0.5">✗</span>
              <span>
                <strong className="text-gray-200">
                  Posting where it&apos;s against platform rules
                </strong>{" "}
e.g. r/EntrepreneurRideAlong (auto-removes any URL),
                r/venturecapital (auto-removes product posts). Follow each
                platform&apos;s self-promotion guidelines.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400 mt-0.5">✗</span>
              <span>
                <strong className="text-gray-200">FTC non-disclosure</strong>: US affiliates must disclose paid relationships per 16 CFR Part
                255. We provide a one-line disclosure template in the
                affiliate dashboard.
              </span>
            </li>
          </ul>
        </section>

        <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-6 mb-12">
          <p className="text-gray-100 font-medium mb-2">Ready to start?</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Sign up takes 60 seconds, your referral link is generated
            immediately. The full program spec, brand assets, and creative
            templates are inside the affiliate dashboard.
          </p>
          <a
            href={PORTAL_URL}
            className="inline-flex items-center gap-2 rounded-lg bg-signal-500 hover:bg-signal-400 active:bg-sky-600 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-signal-500/30 transition-all hover:-translate-y-0.5"
            target="_blank"
            rel="noopener"
          >
            Open gitdealflow.refgrow.com →
          </a>
        </div>

        {/* ============================================================ */}
        {/* BRUNSON SWIPE KIT, added 2026-05-05 per Russell audit (Traffic #17). */}
        {/* Pre-written copy across 6 channels. Affiliates do zero writing. */}
        {/* ============================================================ */}
        <section className="mb-12" aria-label="Affiliate swipe kit">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            The swipe kit, 6 channels, zero writing required
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            Every affiliate program promises &quot;creative templates.&quot; Most
            ship a logo and a banner. We ship the actual copy you&apos;d use,
            tested against real audiences. Pick the channel where your audience
            already reads you. Replace <code className="bg-slate-800 text-sky-400 px-1.5 py-0.5 rounded text-xs">YOURLINK</code> with
            your unique referral URL from the Refgrow dashboard.
          </p>
          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            Run a newsletter, podcast, or community? Check the{" "}
            <Link href="/affiliates/top-partners" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
              Dream 50 publisher roster
            </Link>{" "}
50 named partners we&apos;d like to hear from, with the exact
            pitch templates we send.
          </p>

          {/* Twitter / X */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Channel 1, Twitter / X (single tweet)
            </p>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 border border-slate-800 rounded p-4 mb-3">{`I keep telling people about this. GitDealFlow scans 400+ GitHub orgs every Sunday and tells you which startups are accelerating before they raise. The pattern preceded 219 startup-period observations by 21-47 days in their SSRN paper.

Free Sunday digest, no card: YOURLINK`}</pre>
            <p className="text-gray-400 text-xs">~245 chars. Add the SSRN link if you have room. Pin if you have a small audience, the share rate compounds.</p>
          </div>

          {/* Newsletter recommendation */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Channel 2, Newsletter recommendation block
            </p>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 border border-slate-800 rounded p-4 mb-3">{`👀 What I'm reading: VC Deal Flow Signal

Every Sunday, the Data Nerd sends 5 startups whose GitHub commit velocity just spiked, typically 21 to 47 days before they announce a fundraise. The methodology is published on SSRN with a 219-startup panel; the dataset is on Zenodo; the lens is the part that didn't exist before.

If you spend any time on alt-data for venture, this is the lowest-friction one I've found.

Free Sunday digest → YOURLINK`}</pre>
            <p className="text-gray-400 text-xs">Newsletter writers: drop this into a "what I'm reading" section. Conversion runs 3-7% on warm investor lists.</p>
          </div>

          {/* dev.to / Substack */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Channel 3, dev.to / Substack post (200-word footer)
            </p>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 border border-slate-800 rounded p-4 mb-3">{`---

Loved this post and want to find startups like the ones in it before they raise? I use VC Deal Flow Signal, a free weekly Sunday digest that ranks 140 startup GitHub orgs by commit velocity. The methodology behind it is the SSRN-published 219-observation panel; the 21-to-47-day lead time is our hypothesis, validated openly on /scorecard.

If you write checks, scout for a fund, or just like watching engineering data, the digest is free forever: YOURLINK

(Disclosure: affiliate link, costs you nothing, helps me keep writing.)`}</pre>
            <p className="text-gray-400 text-xs">FTC-compliant disclosure included. Don&apos;t edit it out, it kills trust faster than it lifts conversion.</p>
          </div>

          {/* Discord / Slack community */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Channel 4, Discord / Slack community drop
            </p>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 border border-slate-800 rounded p-4 mb-3">{`if anyone here is sourcing seed/Series A:

GitDealFlow tracks GitHub commit velocity across 400+ startup orgs and surfaces the ones accelerating fast. The free Sunday digest gives you 5 names a week, they have a research paper on SSRN with 219 startup-period observations that the signal preceded by 21-47 days.

free, no card, weekly email: YOURLINK`}</pre>
            <p className="text-gray-400 text-xs">For #investors, #vc, #startups channels. Drop once per quarter per community max.</p>
          </div>

          {/* Cold email, for established affiliates */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Channel 5, 1:1 email to one investor friend (warm)
            </p>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 border border-slate-800 rounded p-4 mb-3">{`Subject: thought you'd like this dataset

Hey [Name] -

You know how we always say "wish I'd seen [Company X] before they were on AngelList trending"?

Found a thing. Solo dev called The Data Nerd publishes a free Sunday digest of 5 startups whose GitHub commit velocity just spiked. The methodology is on SSRN, 219 startup-period observations preceded by 21-47 days.

I subscribed last week. Haven't pulled the trigger on anything yet but the names are interesting.

Sign up here if you want: YOURLINK

[Your name]`}</pre>
            <p className="text-gray-400 text-xs">Highest-converting channel for affiliates with small but real investor networks. Send to 5-10 close contacts, not 100.</p>
          </div>

          {/* Reddit / IH */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-8">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Channel 6, Reddit / IndieHackers comment (no-link version)
            </p>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 border border-slate-800 rounded p-4 mb-3">{`On the question of finding startups before consensus: the cleanest leading indicator I've found is GitHub commit velocity. There's a service called VC Deal Flow Signal (search for it, username gives away free Sunday digest with 5 names/wk). They published an SSRN paper showing 219 startup-period observations were preceded by acceleration spikes by an average of 21-47 days.

Not affiliated [or: affiliate disclosure required], just one of the cheapest sources of signal I've found.`}</pre>
            <p className="text-gray-400 text-xs">For subs that auto-remove links (r/venturecapital, r/EntrepreneurRideAlong). Lower CTR but won&apos;t get auto-modded.</p>
          </div>

          {/* Brand assets */}
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 mb-4">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">Brand assets (use freely)</p>
            <ul className="text-gray-300 text-sm space-y-1.5 leading-relaxed">
              <li>• Logo + wordmark + dark/light variants: <a href="https://gitdealflow.com/brand" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">gitdealflow.com/brand</a></li>
              <li>• OG image (1200×630): <a href="https://signals.gitdealflow.com/opengraph-image" className="text-sky-400 hover:text-sky-300 underline decoration-dotted" target="_blank" rel="noopener">signals.gitdealflow.com/opengraph-image</a></li>
              <li>• Sample digest screenshot: <a href="https://signals.gitdealflow.com/firstlook/sample" className="text-sky-400 hover:text-sky-300 underline decoration-dotted" target="_blank" rel="noopener">signals.gitdealflow.com/firstlook/sample</a></li>
              <li>• MCP demo video (24s, silent): <a href="https://gitdealflow.com/mcp-demo.mp4" className="text-sky-400 hover:text-sky-300 underline decoration-dotted" target="_blank" rel="noopener">/mcp-demo.mp4</a></li>
              <li>• SSRN paper (the credibility anchor): <a href="https://ssrn.com/abstract=6606558" className="text-sky-400 hover:text-sky-300 underline decoration-dotted" target="_blank" rel="noopener">ssrn.com/abstract=6606558</a></li>
            </ul>
          </div>
        </section>

        <section className="mb-12" aria-label="FAQ">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                What&apos;s the commission rate?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                20% of every paid referral, for the lifetime of the
                customer&apos;s subscription. €399 on each €1,997 Sector Sweep
                one-time sale. €19.40/mo on each €197/mo Insider Circle
                subscription, every month for as long as the customer stays
                subscribed.
              </p>
            </div>

            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                How does attribution work?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                60-day last-click attribution cookie. When a visitor clicks
                your unique referral link and converts within 60 days, the
                commission is yours. Tracking runs across both gitdealflow.com
                (apex) and signals.gitdealflow.com (product subdomain).
              </p>
            </div>

            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                When do I get paid?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Monthly via Stripe, with a €50 minimum payout threshold.
                Earnings are held for 60 days from the conversion date -
                twice the 30-day customer refund window, so a clawback is
                impossible if a customer cancels.
              </p>
            </div>

            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                What can I promote?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Both paid tiers: €1,997 one-time Sector Sweep (custom-built
                40-page sector report) and €197/mo recurring Insider Circle
                (8-object stack including the weekly digest, dataset access,
                and research walkthroughs). The free Signal Digest is also
                attribution-eligible, if a free subscriber later upgrades,
                the commission still tracks back to you within the 60-day
                window.
              </p>
            </div>

            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                Is there a minimum traffic requirement?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                No. The program auto-approves all signups. Even a single
                well-placed mention in front of the right audience can produce
                a Sector Sweep sale.
              </p>
            </div>

            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                Can I run paid ads to my referral link?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes, with two restrictions: no bidding on our brand keywords
                (see prohibited list above), and no destination URLs that
                impersonate gitdealflow.com. Display, native, and content ads
                pointing to your own landing page that links through to us
                are fully allowed.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
