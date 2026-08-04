import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { SUMMIT, TALKS } from "@/content/summit";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: `All-Access Pass — VC Engineering Acceleration Summit · €${SUMMIT.allAccessPrice} one-time`,
  description: `Lifetime replays of all 20 talks, full transcripts (PDF + markdown), slide decks, and the 219-startup backtest CSV. €${SUMMIT.allAccessPrice} one-time. 30-day refund.`,
  alternates: { canonical: "/summit/all-access" },
  openGraph: {
    title: `All-Access Pass — €${SUMMIT.allAccessPrice} one-time`,
    description: `Lifetime replays of all 20 talks + full transcripts + slide decks + 219-startup backtest CSV.`,
    url: `${SITE}/summit/all-access`,
    type: "article",
  },
};

const STACK = [
  { label: "Lifetime replays of all 20 talks", standalone: "€297 if bought separately" },
  { label: "Full PDF + markdown transcripts of every talk", standalone: "€197 standalone" },
  { label: "Slide decks and chart packs from every talk", standalone: "€69 standalone" },
  { label: "219-startup backtest CSV — the dataset behind the panel", standalone: "€297 standalone" },
  { label: "Methodology vault — every signal definition + decision rule + pitfall", standalone: "€0, always free" },
  { label: "Anonymous-by-design narration files (audio, MP3 + WAV)", standalone: "€49 standalone" },
  { label: "30-day refund — reply REFUND, no forms, no questions", standalone: "Bonus" },
] as const;

const TOTAL_VALUE = 297 + 97 + 69 + 297 + 49;

export default function AllAccessPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/summit/all-access#product`,
        name: "VC Engineering Acceleration Summit — All-Access Pass",
        description:
          "Lifetime replays of all 20 anonymous-by-design summit talks, full transcripts, slide decks, and the 219-startup backtest CSV.",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: String(SUMMIT.allAccessPrice),
          priceCurrency: SUMMIT.allAccessCurrency,
          availability: "https://schema.org/InStock",
          url: `${SITE}/summit/all-access`,
          seller: { "@id": "https://gitdealflow.com/#organization" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Summit", item: `${SITE}/summit` },
          {
            "@type": "ListItem",
            position: 3,
            name: "All-Access Pass",
            item: `${SITE}/summit/all-access`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/summit/all-access`}
        languages={getHreflangLanguages("/summit/all-access")}
      />
      <AgentMirrorLinks path="/summit/all-access" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <nav className="text-xs text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/summit" className="hover:text-gray-300">Summit</Link>
          <span className="mx-2">/</span>
          <span>All-Access Pass</span>
        </nav>

        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            All-Access Pass · Lifetime · No subscription
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            Every talk, every transcript, every slide — €{SUMMIT.allAccessPrice} once. Yours forever.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            All 20 talks of the VC Engineering Acceleration Summit, locked
            after their 24-hour free window — yours for life with the
            All-Access Pass. Plus full transcripts, slide decks, the
            219-startup backtest CSV, and the anonymous-by-design narration
            audio. One payment, lifetime access, 30-day refund if it isn't
            useful.
          </p>
        </header>

        {/* The stack */}
        <section className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5">
          <h2 className="text-2xl font-bold text-gray-100">What's included</h2>
          <ul className="space-y-3">
            {STACK.map((s) => (
              <li
                key={s.label}
                className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-4"
              >
                <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-100 leading-snug font-medium">
                    {s.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{s.standalone}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="pt-3 space-y-1 text-sm">
            <p className="text-gray-400">
              Total standalone value:{" "}
              <span className="text-gray-200 font-semibold">€{TOTAL_VALUE}</span>
            </p>
            <p className="text-gray-100 text-lg font-bold">
              Your price: €{SUMMIT.allAccessPrice} one-time.
            </p>
          </div>
          <form method="POST" action="/api/checkout/session" className="space-y-4">
            <input type="hidden" name="tier" value={SUMMIT.allAccessCheckoutTier} />
            {/* Brunson in-cart order bump — checkbox adds the Sector Sweep
                as a second line item in the same Stripe checkout. */}
            <label className="flex items-start gap-3 rounded-lg border-2 border-dashed border-amber-500/60 bg-amber-950/20 p-4 cursor-pointer">
              <input
                type="checkbox"
                name="bump"
                value={SUMMIT.orderBumpKey}
                className="mt-1 h-5 w-5 shrink-0 accent-amber-500"
              />
              <span className="text-sm text-gray-200 leading-snug">
                <span className="font-bold text-amber-300">
                  Yes — add the {SUMMIT.orderBumpLabel}.
                </span>{" "}
                One full sector deep-dive of your choice: top 25 ranked GitHub
                orgs, contributor maps, three pre-Crunchbase breakouts, raw
                CSV, and a 14-page written walkthrough. Summit attendees only.
              </span>
            </label>
            <button
              type="submit"
              className="block w-full rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-4 transition-colors text-center text-lg min-h-[56px]"
            >
              Get the All-Access Pass — €{SUMMIT.allAccessPrice}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Stripe checkout · Card or Apple/Google Pay · 30-day refund · No subscription
            </p>
          </form>
        </section>

        {/* Talks list */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">All 20 talks</h2>
          <ol className="space-y-2 text-sm">
            {TALKS.map((t, i) => (
              <li key={t.slug} className="flex items-start gap-3">
                <span className="text-gray-400 font-mono w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link
                  href={`/summit/${t.slug}`}
                  className="text-sky-300 hover:text-sky-200 underline decoration-dotted leading-snug"
                >
                  {t.title}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Risk reversal */}
        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-gray-100">
            30-day refund, no questions asked.
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Reply REFUND to any email. We process inside two business days.
            The signal is reproducible from public data — we'd rather refund a
            buyer who didn't get value than retain one who didn't.
          </p>
        </section>

        <p className="text-xs text-gray-400 text-center">
          Back to{" "}
          <Link href="/summit" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
            the summit schedule
          </Link>
          .
        </p>

        <DataNerdSignoff variant="compact" className="mt-8" />
      </div>
    </>
  );
}
