import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { LiveReplayBar } from "@/components/LiveReplayBar";
import { DoorsClosingBanner } from "@/components/DoorsClosingBanner";
import { getHreflangLanguages } from "@/lib/hreflang";
import { getReplayWindowSnapshot } from "@/lib/replay-window";
import WalkthroughVariantTracker from "@/components/WalkthroughVariantTracker";
import WalkthroughCtaLink from "@/components/WalkthroughCtaLink";

export const dynamic = "force-static";

// Brunson Expert Secrets §3 Ch 15 — Webinar Variations.
// /walkthrough     → 12-minute long-form (full Perfect Webinar).
// /walkthrough/5min → 800-word condensed.
// /walkthrough/90s  → ~250-word "elevator" — this page.
//
// The /90s variant exists to A/B against /5min via /walkthrough/quick. The
// hypothesis (logged in /experiments): for cold-traffic visitors landing
// from a paid ad or a Reddit thread, even five minutes is too much commit;
// a 90-second elevator with one core claim, three bullets, and one CTA
// converts at higher rate, even though the absolute closing power is
// weaker. Run for 30 days, then re-decide.
//
// Word count target: 240–280 words excluding nav/breadcrumbs/CTAs.
// Reading speed assumption: 200 wpm = ~75 seconds at 250 words.

const STRIPE_DASHBOARD = "https://buy.stripe.com/28E7sK48H04U8ou07u0x200";
const SIGNUP_URL = "https://gitdealflow.com/#signup";
const WORD_COUNT = 250;
const READ_SECONDS = 90;

export const metadata: Metadata = {
  title:
    "The 90-Second Walkthrough — GitDealFlow in 250 words",
  description:
    "The whole pitch in ninety seconds. One core claim, three objections collapsed to one line each, one stack, one close. For the buyer who has 90 seconds, not 12 minutes.",
  alternates: { canonical: "/walkthrough/90s" },
  openGraph: {
    title: "The 90-Second Walkthrough — GitDealFlow",
    description:
      "Ninety seconds. Single core claim, three objections, one close. Read it standing in line.",
    url: "https://signals.gitdealflow.com/walkthrough/90s",
    type: "article",
  },
};

export default function NinetySecondWalkthroughPage() {
  const replaySnapshot = getReplayWindowSnapshot();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/walkthrough/90s#article",
        headline:
          "The 90-Second Walkthrough — GitDealFlow in 250 words",
        description:
          "GitDealFlow's full sales argument condensed to 90 seconds. Core claim, three objections collapsed, stack, close.",
        url: "https://signals.gitdealflow.com/walkthrough/90s",
        datePublished: "2026-05-09T00:00:00.000Z",
        dateModified: "2026-05-09T00:00:00.000Z",
        author: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://signals.gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://signals.gitdealflow.com",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/walkthrough/90s",
        wordCount: WORD_COUNT,
        timeRequired: "PT90S",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Walkthrough",
            item: "https://signals.gitdealflow.com/walkthrough",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "90-Second Edition",
            item: "https://signals.gitdealflow.com/walkthrough/90s",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/walkthrough/90s"
        languages={getHreflangLanguages("/walkthrough/90s")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/walkthrough/90s" />
      <WalkthroughVariantTracker
        variant="90s"
        wordCount={WORD_COUNT}
        readSeconds={READ_SECONDS}
      />

      <LiveReplayBar initialWindow={replaySnapshot} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-7">
        <header className="space-y-3">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/walkthrough" className="hover:text-gray-300">
              Walkthrough
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">90-Second Edition</span>
          </nav>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            The 90-Second Walkthrough
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            The whole argument —{" "}
            <span className="text-emerald-400">in 250 words.</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Reading time: 90 seconds. If you have five,{" "}
            <Link
              href="/walkthrough/5min"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              the 5-minute version is here
            </Link>
            . Twelve minutes,{" "}
            <Link
              href="/walkthrough"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              the long-form is here
            </Link>
            .
          </p>
        </header>

        {/* CORE CLAIM — Big Domino, line one. */}
        <section
          className="border-l-4 border-emerald-500 pl-5 py-2 space-y-2"
          data-speakable
        >
          <p className="text-gray-100 text-lg sm:text-xl font-semibold leading-snug">
            Crunchbase tells you the day a startup raised. We tell you the day
            they started preparing —{" "}
            <span className="text-emerald-300">21 to 47 days earlier</span> —
            by reading their public GitHub.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Single SSRN-published panel, n=219, five quarters. Median 31-day
            lead time. Methodology open, dataset CC-BY-4.0.
          </p>
        </section>

        {/* THREE OBJECTIONS — one line each, no expansion. */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-100">
            Three objections, three sentences:
          </h2>
          <ul className="space-y-2 text-gray-200 text-base leading-relaxed">
            <li className="border-l-2 border-rose-700 pl-4">
              <strong className="text-gray-100">&ldquo;GitHub data is noise.&rdquo;</strong>{" "}
              Two-period confirmation + contributor-quality filter — 8%
              false-positive rate, published.
            </li>
            <li className="border-l-2 border-rose-700 pl-4">
              <strong className="text-gray-100">&ldquo;The good orgs are private.&rdquo;</strong>{" "}
              The 219-startup panel is venture-backed and 100% public-GitHub.
              Private repos aren&rsquo;t needed for the signal to fire.
            </li>
            <li className="border-l-2 border-rose-700 pl-4">
              <strong className="text-gray-100">&ldquo;€9.97/mo is too cheap to be real.&rdquo;</strong>{" "}
              We don&rsquo;t have a sales team. The buyer is a
              developer-investor writing €5k–€50k checks. Pricing matches the
              buyer.
            </li>
          </ul>
        </section>

        {/* THE STACK — four lines, not eight. */}
        <section className="rounded-xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/15 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-3">
          <h2 className="text-lg font-bold text-gray-100">
            What €9.97/mo unlocks:
          </h2>
          <ul className="space-y-1.5 text-gray-200 text-sm leading-relaxed">
            <li>
              → Live dashboard, refreshed every Monday at 06:00 UTC.
            </li>
            <li>
              → 219-startup backtest CSV — replicate the regression yourself.
            </li>
            <li>
              → Monthly sector deep-dive PDF, your sector.
            </li>
            <li>
              → 30-day Signal-or-It&rsquo;s-Free guarantee. Reply REFUND.
            </li>
          </ul>
        </section>

        {/* ONE CLOSE — Money. */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-100">The math:</h2>
          <p className="text-gray-200 text-base leading-relaxed">
            €119.64 a year. The expected value of one missed seed name that
            8×&rsquo;s — at a €5k cheque — is €40,000. The price isn&rsquo;t
            the cost. The deal you miss is.
          </p>
        </section>

        {/* DOORS-CLOSING + CTA */}
        <DoorsClosingBanner initialWindow={replaySnapshot} />

        <section className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 p-6 text-center space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Trial close
          </p>
          <p className="text-gray-100 text-base leading-relaxed">
            If all this did was surface{" "}
            <strong className="text-emerald-300">one name</strong> you would
            have missed in the next 12 months — would €119.64 be worth it?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <WalkthroughCtaLink
              href={`${STRIPE_DASHBOARD}?variant=walkthrough_90s`}
              kind="primary"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/30 transition-colors"
            >
              Lock €9.97/mo founder price →
            </WalkthroughCtaLink>
            <WalkthroughCtaLink
              href={SIGNUP_URL}
              kind="signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Or start with the free digest
            </WalkthroughCtaLink>
          </div>
          <p className="text-gray-400 text-xs pt-1">
            30-day Signal-or-It&rsquo;s-Free · No call · Reply REFUND
          </p>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-5">
          Want more depth? The{" "}
          <Link
            href="/walkthrough/5min"
            className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
          >
            5-minute walkthrough
          </Link>{" "}
          adds the four named closes and a richer story. The{" "}
          <Link
            href="/walkthrough"
            className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
          >
            12-minute long-form
          </Link>{" "}
          adds the origin, the conversion-story, the encore, the FAQ.
        </p>
      </div>
    </>
  );
}
