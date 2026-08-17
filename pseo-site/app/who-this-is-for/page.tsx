import type { Metadata } from "next";
import Link from "next/link";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = withEditorialOverride({
  title: "Where to Start, Pick the GitDealFlow Layer That Fits Right Now",
  description:
    "Pick the GitDealFlow layer that fits the way you source right now. Start free, test one sector, move to the full field, or go deeper when the question gets expensive.",
  alternates: { canonical: "/who-this-is-for" },
  openGraph: {
    title: "Where to start with GitDealFlow",
    description:
      "Choose the layer that fits the way you source right now, free issue, one-sector pass, weekly field, or a deeper custom cut.",
    url: "https://signals.gitdealflow.com/who-this-is-for",
    type: "website",
  },
});

const STEPS = [
  {
    label: "Start free",
    title: "If you want a calmer weekly read first",
    body: "Start with the free Sunday issue if you want to feel the signal before you spend anything. This is the right move if your real question is simple: does this help you see what changed faster than the usual noise does?",
    ctaHref: "https://gitdealflow.com/#signup",
    ctaLabel: "Get the free Sunday issue",
    accent: "sky",
  },
  {
    label: "Test one sector",
    title: "If you already have a live question",
    body: "Take First Look if one sector keeps bothering you and you want a fast answer instead of another week of tabs and notes. This is for the moment when you do not need a subscription yet, you need one sharper cut.",
    ctaHref: "/firstlook",
    ctaLabel: "See First Look",
    accent: "amber",
  },
  {
    label: "Work the full field",
    title: "If five names are no longer enough",
    body: "Move to Dashboard when you want more than a weekly shortlist and not knowing where to look is starting to cost you attention. This is where the signal becomes part of a repeatable sourcing rhythm.",
    ctaHref: "/pricing#dashboard-beta",
    ctaLabel: "See Dashboard pricing",
    accent: "emerald",
  },
  {
    label: "Go deeper",
    title: "If the question is already expensive",
    body: "Go to Insider, Sharp, or Sector Sweep when the signal is no longer just interesting, it needs to support decisions, conviction, and deeper work. At that point you are choosing how much support and depth you want, not whether the signal itself is useful.",
    ctaHref: "/pricing",
    ctaLabel: "See every paid layer",
    accent: "violet",
  },
] as const;

const ACCENT = {
  sky: {
    border: "border-sky-500/30 bg-sky-950/20",
    label: "text-sky-300",
    button: "bg-signal-500 hover:bg-signal-600 text-slate-950",
  },
  amber: {
    border: "border-amber-500/30 bg-amber-950/20",
    label: "text-amber-300",
    button: "bg-amber-500 hover:bg-amber-400 text-slate-950",
  },
  emerald: {
    border: "border-emerald-500/30 bg-emerald-950/20",
    label: "text-emerald-300",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
  },
  violet: {
    border: "border-violet-500/30 bg-violet-950/20",
    label: "text-violet-300",
    button: "bg-violet-600 hover:bg-violet-500 text-white",
  },
} as const;

export default function WhoThisIsForPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: "https://signals.gitdealflow.com/who-this-is-for",
        name: "Where to start with GitDealFlow",
        description:
          "Choose the GitDealFlow layer that fits the way you source right now.",
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
            name: "Where to Start",
            item: "https://signals.gitdealflow.com/who-this-is-for",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/who-this-is-for"
        languages={getHreflangLanguages("/who-this-is-for")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/who-this-is-for" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-[0.16em]">
            Where to start
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.08] tracking-tight">
            Pick the layer that fits the way you source right now.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            This is for the First Mover: the dealmaker who evaluates companies
            but doesn&rsquo;t read code, corp-dev, PE, angel, scout, or a seed
            fund. You move on the engineering signal before the round, without
            reading a line of code. You never read a line of code, the read is
            done for you, in plain business English.
          </p>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            So the only honest decision left is which layer fits the way you
            source right now: a free weekly signal, a fast answer on one sector,
            the full field every week, or a deeper custom cut because the
            question is already expensive?
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {STEPS.map((step) => {
            const accent = ACCENT[step.accent];
            return (
              <article
                key={step.label}
                className={`rounded-2xl border p-6 sm:p-7 space-y-4 ${accent.border}`}
              >
                <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${accent.label}`}>
                  {step.label}
                </p>
                <h2 className="text-2xl font-bold text-gray-100 leading-snug">
                  {step.title}
                </h2>
                <p className="text-gray-300 text-sm sm:text-[15px] leading-relaxed">
                  {step.body}
                </p>
                <Link
                  href={step.ctaHref}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${accent.button}`}
                >
                  {step.ctaLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-4">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.14em]">
            Quick routing rule
          </p>
          <ul className="space-y-3 text-gray-300 text-sm sm:text-[15px] leading-relaxed">
            <li>If you want to see whether the signal feels real, start free.</li>
            <li>If one sector is already on your mind, take First Look.</li>
            <li>If you want the full field every week, move to Dashboard.</li>
            <li>If you want more support, context, or a deeper custom cut, use the higher layers.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Still unsure
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            Start with the free issue and let the signal earn the next step.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
            You do not need to overthink the stack before you have felt the output.
            One short Sunday issue is enough to tell you whether this deserves more trust.
          </p>
          <Link
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition-colors hover:bg-amber-400"
          >
            Start with the free issue
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        <DataNerdSignoff variant="compact" />
      </div>
    </>
  );
}
