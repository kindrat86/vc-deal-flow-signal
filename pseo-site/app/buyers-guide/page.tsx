import type { Metadata } from "next";
import Link from "next/link";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

export const metadata: Metadata = {
  title:
    "How to Evaluate a Deal-Flow Tool Without Wasting a Demo",
  description:
    "A direct buyer-side guide to evaluating deal-flow tools: what to check first, what usually matters, and how to tell whether a tool helps with timing or just verification.",
  alternates: {
    canonical: "/buyers-guide",
  },
};

const CHECKS = [
  {
    title: "Can you verify the claim in public?",
    body: "If the tool cannot show you where the signal comes from, how often it refreshes, and what the methodology actually is, you are being asked to trust too much too early.",
  },
  {
    title: "Does it help with timing or just confirmation?",
    body: "A lot of tools are useful after the company is already on your radar. Fewer help you notice what changed before the round starts feeling obvious. Know which job you are really paying for.",
  },
  {
    title: "Does the free layer show something real?",
    body: "A good free layer should let you feel the output, not just watch a demo. If you cannot tell whether the signal is useful without a sales process, the test is too expensive.",
  },
  {
    title: "Will this reduce noise or create more of it?",
    body: "More records, more tabs, and more alerts are not automatically better. The right tool should make your next decision clearer, not give you more reasons to postpone it.",
  },
  {
    title: "Can you start light and go deeper later?",
    body: "The right stack usually starts with one light entry point, one verification layer, and then adds depth only if your process justifies it. If the first step is already heavy, that is usually the wrong first step.",
  },
] as const;

const QUESTIONS = [
  "What changed here, and can I inspect it myself?",
  "How early does this signal usually appear before the round gets crowded?",
  "If I stop paying, what understanding do I keep?",
  "Will this help me decide faster next week, or just make me feel informed?",
] as const;

const FAQS = [
  {
    q: "How should you evaluate a deal-flow tool quickly?",
    a: "Start with four things: whether you can verify the claim in public, whether the tool helps with timing instead of just confirmation, whether the free layer feels real, and whether the workflow reduces noise instead of adding more. Those four checks usually tell you enough before any long demo call.",
  },
  {
    q: "What matters more: coverage or timing?",
    a: "If your problem is early discovery, timing matters more. Broad coverage is useful for mapping and verification, but it does not help much if the signal arrives after the round is already becoming obvious.",
  },
  {
    q: "What is the best low-risk way to test a deal-flow tool?",
    a: "Use the lightest real entry point first: a free weekly issue, a sample report, or a one-time small paid test on a sector you already care about. You want to feel the signal quality before you buy a heavier workflow.",
  },
] as const;

export default function BuyersGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Evaluate a Deal-Flow Tool Without Wasting a Demo",
        description:
          "A direct buyer-side guide to evaluating startup discovery tools.",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/buyers-guide",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/buyers-guide"
        languages={getHreflangLanguages("/buyers-guide")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Buyers Guide</span>
        </nav>

        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-[0.16em]">
            Buyers guide
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.08] tracking-tight">
            How to evaluate a deal-flow tool without wasting a demo
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            You do not need a procurement memo to know whether a tool is helping.
            You need to know whether it gives you earlier signal, clearer timing,
            and less noise — or whether it simply helps you verify what already happened.
            If you are comparing GitDealFlow, Crunchbase, PitchBook, or any
            other deal-flow tool, this is the buyer-side page that tells you
            what to check first.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-4">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.14em]">
            Ask these first
          </p>
          <ul className="space-y-3 text-gray-300 text-sm sm:text-[15px] leading-relaxed">
            {QUESTIONS.map((q) => (
              <li key={q} className="flex gap-3">
                <span className="mt-[0.55rem] h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-5">
          {CHECKS.map((check, idx) => (
            <article
              key={check.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-300 font-semibold text-sm">
                  {idx + 1}
                </div>
                <div className="space-y-2">
                  <h2 className="text-gray-100 text-lg font-semibold leading-snug">
                    {check.title}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-[15px] leading-relaxed">
                    {check.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.14em]">
            What to read next
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            Validate the method, compare the stack, then test the lightest real next step.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
            If this guide matches how you think, the next step is not another abstract checklist.
            It is seeing the evidence, comparing the timing layer directly, and testing a low-friction action page before you commit to a demo or a subscription. Once the signal makes sense, the next choice becomes which paid step actually fits your workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <Link
              href="/research"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
            >
              Read the research panel
            </Link>
            <Link
              href="/compare/crunchbase-alternative-for-angel-investors"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-700 bg-slate-950/60 text-gray-200 hover:border-slate-600 transition-colors text-sm font-semibold"
            >
              Compare timing vs verification
            </Link>
            <Link
              href="/answers/when-should-i-use-first-look-vs-dashboard"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-700 bg-slate-950/60 text-gray-200 hover:border-slate-600 transition-colors text-sm font-semibold"
            >
              Choose the right paid step
            </Link>
            <Link
              href="/receipts"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-700 bg-slate-950/60 text-gray-200 hover:border-slate-600 transition-colors text-sm font-semibold"
            >
              Check your Scout Score
            </Link>
            <Link
              href="https://gitdealflow.com/report"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-amber-600/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 transition-colors text-sm font-semibold"
            >
              Read a sample issue
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Fastest next step
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            Compare timing first. Then decide how much depth you actually need.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
            Start with the pages that make the timing tradeoff obvious. Then test the signal
            with the lightest real entry point you can. If the signal already feels real,
            move next into the answer that helps you choose between First Look, Dashboard,
            and the higher-touch lane.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/compare/github-signals-vs-crunchbase-alerts"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-semibold transition-colors"
            >
              See timing vs verification
            </Link>
            <Link
              href="/compare/best-alternative-data-tools-for-angel-investors"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-700 bg-slate-950/60 text-gray-200 hover:border-slate-600 transition-colors text-sm font-semibold"
            >
              Compare the stack
            </Link>
            <Link
              href="/answers/when-should-i-use-first-look-vs-dashboard"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-700 bg-slate-950/60 text-gray-200 hover:border-slate-600 transition-colors text-sm font-semibold"
            >
              Choose the right paid step
            </Link>
            <Link
              href="https://gitdealflow.com/report"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-amber-600/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 transition-colors text-sm font-semibold"
            >
              Read a sample issue
            </Link>
          </div>
        </section>

        <section className="space-y-4" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-lg border border-slate-800 bg-slate-900"
              >
                <summary className="cursor-pointer p-5 text-gray-100 font-medium flex items-center justify-between gap-3">
                  <span>{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    &#9662;
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <PSEOFooterNav />
      </div>
    </>
  );
}
