import type { Metadata } from "next";
import Link from "next/link";
import { BOOK } from "@/lib/book";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

const PAGE_URL = "https://signals.gitdealflow.com/book/upgrade";

const STRIPE_BOOK_LINK =
  process.env.NEXT_PUBLIC_STRIPE_BOOK_LINK ||
  "https://buy.stripe.com/dRm14m0WvbNCa6q4O00x208";
const STRIPE_BOOK_BUMP_LINK =
  process.env.NEXT_PUBLIC_STRIPE_BOOK_BUMP_LINK ||
  STRIPE_BOOK_LINK; // fallback: same link, env-overridable to a €5.96 bundle

export const metadata: Metadata = {
  title: `${BOOK.title} — upgrade to Kindle + workflow pack`,
  description:
    "Choose between the €0.99 Kindle copy or the €5.96 Reader's Pack — Kindle + raw CSV + replication notebook + audio chapter pre-release. Order-bump checkout for book buyers only.",
  alternates: { canonical: "/book/upgrade" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${BOOK.title} — Reader's Pack upgrade`,
    description:
      "Kindle + workflow CSV + replication notebook + audio chapter pre-release.",
    url: PAGE_URL,
    type: "article",
  },
};

const STACK = [
  { label: "Kindle copy of the book (clean edition)", value: 0.99 },
  { label: "Three bonus emails (worked walkthrough + interview transcripts + 30-day Q&A)", value: 0 },
  { label: "Raw CSV — every signal × every tracked org for the most recent quarter", value: 1.99 },
  { label: "Replication notebook (Jupyter, ready to run)", value: 1.99 },
  { label: "Audio chapter pre-release (RSS-syndicated, before public)", value: 0.99 },
] as const;

const TOTAL_VALUE = STACK.reduce((s, x) => s + x.value, 0);

export default function BookUpgradePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${PAGE_URL}#bundle`,
        name: `${BOOK.title} — Reader's Pack`,
        description:
          "Kindle book + raw signal CSV + Jupyter replication notebook + early-access audio chapter. Brunson-style order-bump bundle for buyers who want the workflow, not just the read.",
        category: "Book bundle",
        url: PAGE_URL,
        offers: [
          {
            "@type": "Offer",
            name: "Kindle copy only",
            price: "0.99",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: STRIPE_BOOK_LINK,
          },
          {
            "@type": "Offer",
            name: "Reader's Pack (Kindle + CSV + notebook + audio pre-release)",
            price: "5.96",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: STRIPE_BOOK_BUMP_LINK,
          },
        ],
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
            name: "Book",
            item: "https://signals.gitdealflow.com/book",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Upgrade",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={getHreflangLanguages("/book/upgrade")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/book/upgrade" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.18em]">
            Book buyer · pick your rung
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            Two ways to leave with the book.
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            One is the clean Kindle copy. The other is the working investor&rsquo;s
            edition — Kindle plus the raw CSV plus the replication notebook plus
            the audio chapter ahead of the public RSS drop. Either one is yours
            for under six euros.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Lite */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col space-y-5">
            <div className="space-y-1">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Lite
              </p>
              <h2 className="text-2xl font-bold text-gray-100">Kindle copy</h2>
            </div>
            <p className="text-3xl font-bold text-gray-100">
              €0.99 <span className="text-base font-normal text-gray-400">one-time</span>
            </p>
            <ul className="space-y-2 text-gray-200 text-sm leading-relaxed flex-1">
              <li className="flex gap-2">
                <span className="text-sky-300 flex-shrink-0">✓</span>
                <span>Native Kindle format — syncs across every Kindle device + app</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sky-300 flex-shrink-0">✓</span>
                <span>Three bonus emails (walkthrough, interview transcripts, 30-day Q&amp;A)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sky-300 flex-shrink-0">✓</span>
                <span>Free PDF + EPUB + audiobook RSS still available separately</span>
              </li>
            </ul>
            <a
              href={STRIPE_BOOK_LINK}
              className="inline-flex items-center justify-center w-full rounded-lg border border-sky-700 hover:border-sky-500 text-sky-200 hover:text-sky-100 font-semibold px-5 py-3 transition-colors"
            >
              Get the Kindle copy — €0.99
            </a>
          </section>

          {/* Pack — order bump */}
          <section className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-xl p-6 sm:p-7 flex flex-col space-y-5 relative">
            <span className="absolute -top-3 right-5 inline-flex items-center justify-center bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Best value
            </span>
            <div className="space-y-1">
              <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
                Reader&rsquo;s Pack — order-bump
              </p>
              <h2 className="text-2xl font-bold text-gray-100">
                Kindle + workflow pack
              </h2>
            </div>
            <p className="text-3xl font-bold text-gray-100">
              €5.96 <span className="text-base font-normal text-gray-400">one-time</span>
            </p>
            <ul className="space-y-2 text-gray-200 text-sm leading-relaxed flex-1">
              {STACK.map((item) => (
                <li key={item.label} className="flex gap-2">
                  <span className="text-amber-300 flex-shrink-0">✓</span>
                  <span>
                    {item.label}
                    {item.value > 0 ? (
                      <span className="text-gray-400 text-xs ml-1">
                        (sold separately: €{item.value.toFixed(2)})
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-200 font-semibold">
              Total separately: €{TOTAL_VALUE.toFixed(2)} → bundle €5.96
            </p>
            <a
              href={STRIPE_BOOK_BUMP_LINK}
              className="inline-flex items-center justify-center w-full rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-3 transition-colors"
            >
              Get the Reader&rsquo;s Pack — €5.96
            </a>
            <p className="text-xs text-gray-400 text-center">
              Order-bump configured via{" "}
              <code className="text-amber-200">NEXT_PUBLIC_STRIPE_BOOK_BUMP_LINK</code>{" "}
              (falls back to the €0.99 link until set).
            </p>
          </section>
        </div>

        {/* What's included in the pack — Brunson stack frame */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 sm:p-7 space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Why the pack exists
          </p>
          <p className="text-gray-300 leading-relaxed">
            Most book buyers stop at the read. The pack is for the third of
            buyers who want to <em>run</em> the methodology the same Sunday
            they finish chapter ten — they need the raw CSV, a Jupyter
            notebook with every formula already coded, and the audio chapter
            ahead of the RSS drop because they listen on commute. €4.97 of
            the bump is pre-priced labour, not a margin grab.
          </p>
        </section>

        {/* Cross-sell back to other rungs */}
        <section className="text-center space-y-3 py-4">
          <p className="text-sm text-gray-400">
            Already bought?{" "}
            <Link
              href="/book/listen"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
            >
              Audiobook
            </Link>{" "}
            ·{" "}
            <Link
              href="/book/read/introduction"
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
            >
              Read online
            </Link>{" "}
            · The Dashboard rung is{" "}
            <Link
              href="/pricing#dashboard-beta"
              className="text-amber-300 hover:text-amber-200 underline underline-offset-2"
            >
              €9.97/mo
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
