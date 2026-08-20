import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import WalkthroughQuickRedirect from "@/components/WalkthroughQuickRedirect";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

// Brunson Expert Secrets §3 Ch 15 + §4 Ch 19, Webinar Variations + Test, Test, Test.
//
// /walkthrough/quick is the A/B router between:
//   • /walkthrough/5min (~800 words, ~5-min read)
//   • /walkthrough/90s  (~250 words, ~90-sec read)
//
// Bucket assignment is 50/50, sticky in localStorage so a returning
// visitor always lands on the same variant, anything else would
// pollute conversion data.
//
// SSR-safe pattern: the page renders a static "decision shell" with
// both human-visible options, plus the client-side <WalkthroughQuickRedirect />
// that auto-redirects on mount. If JS is off, the visitor sees the two
// links and picks. If JS is on, the bucket assignment triggers the
// redirect within ~50ms. PostHog logs `walkthrough_variant_assigned`
// once per visitor (sticky), so we can compare:
//   1. assignment-to-CTA-click rate per variant
//   2. assignment-to-Stripe-checkout rate per variant
//   3. retention vs. depth across 30 days
//
// Why not Routing Middleware? Because every visitor hitting
// /walkthrough/quick fires a Vercel Function invocation otherwise; this
// page stays static + edge-cached, and the bucket logic is ~30 LOC of
// client JS that runs after the static HTML lands. Cheaper, faster,
// no cold start.

export const metadata: Metadata = withEditorialOverride({
  title: "The Walkthrough, pick your length",
  description:
    "Two variants of the same argument: 90 seconds (~250 words) or 5 minutes (~800 words). Pick the one that fits your day. The 12-minute long-form is also linked.",
  alternates: { canonical: "/walkthrough/quick" },
  openGraph: {
    title: "The Walkthrough, 90 seconds or 5 minutes",
    description:
      "Two lengths of the same argument. 90 seconds, 5 minutes, or 12 minutes. Pick what fits your day.",
    url: "https://signals.gitdealflow.com/walkthrough/quick",
    type: "article",
  },
  // Don't index the router, both variants are the canonical surfaces.
  // We send users here from emails / quiz CTAs / Reddit ads via UTM.
  robots: {
    index: false,
    follow: true,
  },
});

export default function WalkthroughQuickPage() {
  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/walkthrough/quick"
        languages={getHreflangLanguages("/walkthrough/quick")}
      />
      <AgentMirrorLinks path="/walkthrough/quick" />

      {/* Client-side bucket assignment + redirect. Renders nothing visible -
          fires on mount within the same paint as the static fallback. */}
      <WalkthroughQuickRedirect />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-7">
        <header className="space-y-3">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            The Walkthrough, pick a length
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Routing you to the right length…
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            If JavaScript is off, or if the redirect didn&rsquo;t fire, pick
            below.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/walkthrough/90s"
            className="group rounded-xl border border-emerald-700/40 bg-emerald-950/15 hover:bg-emerald-950/30 p-5 transition-colors"
          >
            <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
              90 seconds · ~250 words
            </p>
            <h2 className="text-gray-100 font-bold text-lg leading-snug group-hover:text-emerald-200 transition-colors">
              The elevator version
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mt-2">
              One core claim, three objections collapsed to one line each, one
              stack, one close. Read it standing in line.
            </p>
          </Link>
          <Link
            href="/walkthrough/5min"
            className="group rounded-xl border border-amber-700/40 bg-amber-950/15 hover:bg-amber-950/30 p-5 transition-colors"
          >
            <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
              5 minutes · ~800 words
            </p>
            <h2 className="text-gray-100 font-bold text-lg leading-snug group-hover:text-amber-200 transition-colors">
              The condensed version
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mt-2">
              The full argument with four named closes, full stack, story -
              just compressed to five minutes flat.
            </p>
          </Link>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
            Got 12 minutes?
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            The{" "}
            <Link
              href="/walkthrough"
              className="text-violet-300 hover:text-violet-200 underline decoration-dotted"
            >
              full long-form walkthrough
            </Link>{" "}
            adds the origin story, the conversion-story script, the encore
            close, and the FAQ. Same argument, more depth.
          </p>
        </section>
      </div>
    </>
  );
}
