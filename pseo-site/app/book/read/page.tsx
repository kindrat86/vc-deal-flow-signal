import type { Metadata } from "next";
import Link from "next/link";
import { BOOK } from "@/lib/book";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

const PAGE_URL = "https://signals.gitdealflow.com/book/read";

export const metadata: Metadata = {
  title: `Read online — ${BOOK.title}`,
  description: `Free, full-text web edition of ${BOOK.title}. ${BOOK.pages}-page book on reading public GitHub data to predict Series A rounds.`,
  alternates: { canonical: "/book/read" },
  openGraph: {
    title: `Read online — ${BOOK.title}`,
    description: BOOK.description,
    url: PAGE_URL,
    type: "article",
  },
};

export default function BookReadIndex() {
  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={getHreflangLanguages("/book/read")}
      />
      <AgentMirrorLinks path="/book/read" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-[0.18em]">
            Web edition · Free · Permanent
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {BOOK.title}
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            {BOOK.subtitle}.
          </p>
          <p className="text-sm text-gray-400">
            By {BOOK.authorName}, {BOOK.authorRole} · {BOOK.edition} ·{" "}
            {BOOK.publishedDate} · ISBN {BOOK.isbn}
          </p>
        </header>

        <section className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 space-y-4">
          <p className="text-gray-300 text-base leading-relaxed">
            The full book is here, free, on the open web, indexable by every
            search engine and every AI assistant. If you prefer to read offline
            or on a Kindle, grab a free PDF, EPUB, or markdown copy on the{" "}
            <Link href="/book" className="text-sky-400 hover:text-sky-300">
              book page
            </Link>{" "}
            — or buy the €0.99 Kindle copy to support the work and unlock the
            three bonus emails.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-100">Table of contents</h2>
          <ol className="border border-slate-800 rounded-lg divide-y divide-slate-800">
            {BOOK.chapters.map((c) => (
              <li
                key={c.slug}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 p-4 hover:bg-slate-900/60 transition-colors"
              >
                <span className="text-sky-400 font-mono text-sm font-bold w-12 flex-shrink-0">
                  {c.number === 0
                    ? "Intro"
                    : c.number === 8
                      ? "App."
                      : c.number === 9
                        ? "Walk."
                        : c.number === 10
                          ? "Conc."
                          : `0${c.number}`}
                </span>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/book/read/${c.slug}`}
                    className="text-gray-100 hover:text-sky-300 font-semibold text-base"
                  >
                    {c.title}
                  </Link>
                  <p className="text-gray-400 text-sm mt-0.5">{c.subtitle}</p>
                </div>
                <span className="text-gray-400 text-xs flex-shrink-0">
                  {c.estimatedReadMinutes} min
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="text-center pt-4">
          <Link
            href="/book/read/introduction"
            className="inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-6 py-3 transition-colors"
          >
            Start with the introduction →
          </Link>
        </section>
      </div>
    </>
  );
}
