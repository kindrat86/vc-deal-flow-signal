import type { Metadata } from "next";
import {
  BOOK,
  getChapterMarkdown,
  renderChapterHtml,
} from "@/lib/book";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = withEditorialOverride({
  title: `${BOOK.title}, printable single-page edition`,
  description:
    "Single-page printable web edition. Save as PDF from your browser, or use the pre-generated PDF/EPUB on the book page.",
  alternates: { canonical: "/book/print" },
  robots: { index: false, follow: true },
});

export default function BookPrintPage() {
  const chapters = BOOK.chapters.map((c) => ({
    chapter: c,
    html: renderChapterHtml(getChapterMarkdown(c)),
  }));

  return (
    <article className="book-print max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center space-y-3 mb-16 pb-10 border-b border-slate-800 print:break-after-page">
        <p className="text-sky-400 text-xs font-semibold uppercase tracking-[0.18em]">
          {BOOK.edition} · ISBN {BOOK.isbn} · {BOOK.publishedDate}
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-100 leading-[1.05] tracking-tight">
          {BOOK.title}
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed pt-2">
          {BOOK.subtitle}.
        </p>
        <p className="text-sm text-gray-400 pt-3">
          By {BOOK.authorName}, {BOOK.authorRole} · GitDealFlow · CC-BY-4.0
        </p>
        <p className="text-xs text-gray-400 italic pt-4 max-w-xl mx-auto">
          To save as PDF, use your browser&rsquo;s print dialog (⌘+P / Ctrl+P)
          and choose &ldquo;Save as PDF&rdquo;. Or grab the pre-generated
          downloads at{" "}
          <a
            className="text-sky-400 hover:text-sky-300"
            href="/book#download"
          >
            /book#download
          </a>
          .
        </p>
      </header>

      {chapters.map(({ chapter, html }) => (
        <section
          key={chapter.slug}
          className="mb-16 print:break-before-page"
          id={chapter.slug}
        >
          <header className="space-y-3 mb-8 pb-4 border-b border-slate-800">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-[0.18em]">
              Chapter {chapter.number}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
              {chapter.title}
            </h2>
            <p className="text-base text-gray-400 leading-relaxed italic">
              {chapter.subtitle}
            </p>
          </header>
          <div
            className="book-prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </section>
      ))}

      <footer className="mt-20 pt-10 border-t border-slate-800 text-center text-sm text-gray-400 space-y-2">
        <p>
          {BOOK.title}, {BOOK.edition}, {BOOK.publishedDate}.
        </p>
        <p>
          Read updates and corrections at{" "}
          <a
            className="text-sky-400 hover:text-sky-300"
            href="https://signals.gitdealflow.com/book"
          >
            signals.gitdealflow.com/book
          </a>
          . Methodology indexed at{" "}
          <a
            className="text-emerald-400 hover:text-emerald-300"
            href="https://ssrn.com/abstract=6606558"
          >
            SSRN abstract 6606558
          </a>
          .
        </p>
      </footer>
    </article>
  );
}
