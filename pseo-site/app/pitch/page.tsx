import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "The 90-Second Pitch",
  description:
    "Five sections, 90 seconds. The case for using GitHub commit-velocity acceleration as your highest-leverage deal-flow source. Read it, then either subscribe or close the tab.",
  alternates: { canonical: "/pitch" },
  openGraph: {
    title: "The 90-Second Pitch",
    description:
      "Five sections, 90 seconds. The case for GitHub commit-velocity as your highest-leverage deal-flow source.",
    url: "https://signals.gitdealflow.com/pitch",
    type: "article",
  },
};

const STRIPE_DASHBOARD = "https://buy.stripe.com/4gMbJ07kTaJy7kqg6s0x20b";
const SIGNUP_URL = "https://gitdealflow.com/#signup";

export default function PitchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/pitch#article",
        headline: "The 90-Second Pitch — VC Deal Flow Signal",
        description:
          "Five sections, 90 seconds. The case for GitHub commit-velocity acceleration as your highest-leverage deal-flow source.",
        url: "https://signals.gitdealflow.com/pitch",
        datePublished: "2026-05-05T00:00:00.000Z",
        dateModified: "2026-05-05T00:00:00.000Z",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/pitch",
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
            name: "Pitch",
            item: "https://signals.gitdealflow.com/pitch",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/pitch"
        languages={getHreflangLanguages("/pitch")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/pitch" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            90-second read · No video · No popup
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
            data-speakable
          >
            Crunchbase tells you the day they raised.{" "}
            <span className="text-sky-400">We tell you 47 days before.</span>
          </h1>
        </header>

        {/* SECTION 1 — PROBLEM */}
        <section className="space-y-2">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            01 · Problem
          </p>
          <p className="text-gray-200 text-base sm:text-lg leading-relaxed" data-speakable>
            Every investor sees the same warm intros, the same AngelList
            syndicates, the same TechCrunch posts. By the time a deck reaches
            you, three other investors are already in the room. You compete on
            reputation and speed — never on information.
          </p>
        </section>

        {/* SECTION 2 — SHIFT */}
        <section className="space-y-2">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            02 · The shift
          </p>
          <p className="text-gray-200 text-base sm:text-lg leading-relaxed" data-speakable>
            Engineering accelerates before fundraises start. Three weeks
            before. Sometimes seven. New contributors join. Commit velocity
            doubles. Infrastructure repos appear. The signal is public, free,
            updating live, and{" "}
            <em className="text-sky-300 not-italic font-semibold">
              nobody else is reading it as deal flow
            </em>
            .
          </p>
        </section>

        {/* SECTION 3 — PROOF */}
        <section className="space-y-2">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            03 · Proof
          </p>
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5 space-y-2 text-gray-200 text-base leading-relaxed">
            <p>
              <strong className="text-gray-100">219 startup-period
              observations.</strong> Five quarters. Our hypothesis: companies
              showing a 2× contributor spike inside a 14-day window precede
              their fundraise announcement by{" "}
              <strong className="text-sky-300">a few weeks</strong> — validated
              openly on /scorecard, not yet established.
            </p>
            <p className="text-gray-400 text-sm">
              SSRN-published preprint, full panel + regression code at{" "}
              <Link
                href="/research"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                /research
              </Link>
              . CC BY 4.0 — replicate it yourself.
            </p>
          </div>
        </section>

        {/* SECTION 4 — OFFER */}
        <section className="space-y-2">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            04 · Offer
          </p>
          <ul className="space-y-2 text-gray-200 text-base leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">→</span>
              <span>
                <strong className="text-gray-100">Free.</strong> Top 5
                breakouts in your inbox every Monday. Plus a free MCP server
                inside Claude/Cursor.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold shrink-0">→</span>
              <span>
                <strong className="text-gray-100">€7 First Look.</strong> One
                sector deep-dive in 24 hours. Credited toward the Dashboard if
                you upgrade in 14 days.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-400 font-bold shrink-0">→</span>
              <span>
                <strong className="text-gray-100">€9.97/mo Dashboard.</strong>{" "}
                140 startups, 20 sectors, full filters, 219-startup backtest
                CSV, monthly Sector Deep Dive PDF. Founding-member price
                locked forever.
              </span>
            </li>
          </ul>
        </section>

        {/* SECTION 5 — CLOSE */}
        <section className="space-y-3 bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/40 rounded-xl p-6">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            05 · Close
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            30-day guarantee. Reply REFUND to any email.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            If the signal doesn&rsquo;t surface a startup you find genuinely
            interesting in 30 days, full refund inside two business days. No
            forms, no call, no &ldquo;wait, let me show you one more
            feature.&rdquo;
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={STRIPE_DASHBOARD}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 font-semibold text-sm shadow-lg shadow-signal-500/30 transition-colors"
            >
              Lock €49/mo founder price <span aria-hidden="true">→</span>
            </a>
            <a
              href={SIGNUP_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Free digest first
            </a>
          </div>
        </section>

        {/* DEEP DIVE LINK */}
        <p className="text-center text-gray-400 text-sm pt-4">
          Want the long version? Read the{" "}
          <Link
            href="/walkthrough"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            12-minute walkthrough
          </Link>{" "}
          — same case, three objections broken, full stack reveal.
        </p>

        <div className="flex justify-center pt-2">
          <DataNerdSignoff variant="compact" />
        </div>
      </div>
    </>
  );
}
