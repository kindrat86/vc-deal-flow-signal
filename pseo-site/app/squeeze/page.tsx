import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SqueezeForm from "./SqueezeForm";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "5 breakout startups, every Sunday — 47 days before the deck arrives",
  description:
    "One email a week. Five startups ranked by 14-day GitHub commit-velocity acceleration. Free forever. The same engineering signal that preceded 219 startup-period observations in our SSRN-published panel.",
  alternates: { canonical: "/squeeze" },
  openGraph: {
    title: "5 breakout startups, every Sunday — 47 days before the deck arrives",
    description:
      "One email a week. Five startups ranked by GitHub commit-velocity acceleration. Free forever.",
    type: "website",
    url: "https://signals.gitdealflow.com/squeeze",
  },
  twitter: {
    card: "summary_large_image",
    title: "5 breakout startups, every Sunday",
    description:
      "47 days before the deck arrives. Free forever, one email a week.",
  },
};

export default function SqueezePage() {
  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/squeeze"
        languages={getHreflangLanguages("/squeeze")}
      />
      <AgentMirrorLinks path="/squeeze" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        {/* Brunson Lead-Squeeze Funnel — DotCom Secrets Ch 15. Single-purpose
            page with one hook, one form, one CTA, no in-page links above the
            form except the (forced-static) hreflang scaffolding. The home page
            is the multi-door entry; this is the one-door dedicated capture
            for paid traffic, partner co-promo, and the apex /#signup mirror. */}
        <header className="space-y-5">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.18em]">
            Free forever · One email a week · No spam
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            5 breakout startups, every Sunday —{" "}
            <span className="text-sky-400">47 days</span> before the
            deck arrives.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            One email. Five startups. Ranked by 14-day GitHub
            commit-velocity acceleration. The same engineering signal
            that preceded <strong className="text-gray-100">219
            confirmed Series A rounds</strong> in our{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted underline-offset-2"
            >
              SSRN-published panel
            </a>
            .
          </p>
        </header>

        {/* Form first — Brunson rule: above the fold, before the body
            copy. The "why" stack lives below the fold for the visitors
            who scroll past the form. */}
        <SqueezeForm />

        {/* The "why" — three short reasons, one per row. Each is a
            specific, falsifiable claim. No filler. */}
        <section
          aria-label="Why investors subscribe"
          className="space-y-5 pt-2"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em]">
            What the digest does for you
          </p>
          <ul className="space-y-4 text-gray-100 text-base sm:text-[17px] leading-relaxed">
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-[0.6rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
              />
              <span>
                <strong className="text-amber-300">Reaches your
                inbox 21–47 days before</strong> the founder&rsquo;s
                deck reaches it. The window where a short, specific
                note actually gets read — before forty other inboxes
                light up with the same deck.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-[0.6rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
              />
              <span>
                <strong className="text-amber-300">Built on public
                data you could verify yourself.</strong> Methodology
                published, source code on Sharp Tier is CC BY 4.0,
                every claim recoverable from{" "}
                <Link
                  href="/methodology"
                  className="text-sky-400 hover:text-sky-300 underline decoration-dotted underline-offset-2"
                >
                  /methodology
                </Link>
                .
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-[0.6rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
              />
              <span>
                <strong className="text-amber-300">Costs you
                nothing.</strong> The free Sunday digest stays free —
                forever, even after we hit 1,000 paying subscribers.
                If the rhythm fits, the paid Dashboard sits next to
                it; if it doesn&rsquo;t, the digest still lands every
                Monday.
              </span>
            </li>
          </ul>
        </section>

        {/* Tertiary entry points — minimal, no upsell pressure. Brunson
            "exit": one alternative for the visitor who doesn't want to
            sign up but still wants to look around. Single link, soft
            voice. */}
        <footer className="pt-6 border-t border-slate-800 space-y-2">
          <p className="text-gray-400 text-sm leading-relaxed">
            Already subscribed?{" "}
            <Link
              href="/predicted"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted underline-offset-2"
            >
              See this week&rsquo;s public Acceleration Watch →
            </Link>
          </p>
          <p className="text-gray-600 text-xs leading-relaxed">
            Want to know which rung fits your check-size?{" "}
            <Link
              href="/quiz"
              className="text-gray-400 underline decoration-dotted underline-offset-2 hover:text-gray-300"
            >
              Take the 30-second quiz
            </Link>
            .
          </p>
        </footer>
      </div>
    </>
  );
}
