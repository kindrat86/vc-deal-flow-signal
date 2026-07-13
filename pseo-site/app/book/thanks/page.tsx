import type { Metadata } from "next";
import Link from "next/link";
import { BOOK } from "@/lib/book";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Thanks — your book is on the way",
  description:
    "Confirmation page for book download / Kindle purchase. Your downloads + bonus content next steps are listed here.",
  alternates: { canonical: "/book/thanks" },
  robots: { index: false, follow: false },
};

export default function BookThanksPage() {
  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/book/thanks"
        languages={getHreflangLanguages("/book/thanks")}
      />
      <AgentMirrorLinks path="/book/thanks" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.18em]">
            Confirmed · Check your inbox
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Your copy of <span className="text-sky-300">{BOOK.title}</span> is
            on its way.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            The download links arrive in about ninety seconds. If you do not
            see them in five minutes, check spam, or grab the files directly
            below.
          </p>
        </header>

        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Direct downloads
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <a
              href="/downloads/seven-signals.pdf"
              className="block bg-slate-950/60 border border-slate-800 rounded-lg p-4 hover:border-sky-500 transition-colors"
            >
              <p className="text-gray-100 font-semibold">PDF</p>
              <p className="text-gray-400 text-xs mt-1">
                Print-ready · ~700 KB
              </p>
            </a>
            <a
              href="/downloads/seven-signals.epub"
              className="block bg-slate-950/60 border border-slate-800 rounded-lg p-4 hover:border-sky-500 transition-colors"
            >
              <p className="text-gray-100 font-semibold">EPUB</p>
              <p className="text-gray-400 text-xs mt-1">
                Kindle / iBooks / Calibre
              </p>
            </a>
            <a
              href="/downloads/seven-signals.md"
              className="block bg-slate-950/60 border border-slate-800 rounded-lg p-4 hover:border-sky-500 transition-colors"
            >
              <p className="text-gray-100 font-semibold">Markdown</p>
              <p className="text-gray-400 text-xs mt-1">
                Source · pipe through pandoc
              </p>
            </a>
            <a
              href="/downloads/seven-signals.txt"
              className="block bg-slate-950/60 border border-slate-800 rounded-lg p-4 hover:border-sky-500 transition-colors"
            >
              <p className="text-gray-100 font-semibold">Plain text</p>
              <p className="text-gray-400 text-xs mt-1">
                Email-safe · grep-friendly
              </p>
            </a>
          </div>
        </section>

        {/* OTO upsell — exactly one logical next move (Brunson Ladder-to-Funnel) */}
        <section className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/50 rounded-xl p-6 space-y-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            One-time offer · for book readers only
          </p>
          <h2 className="text-2xl font-bold text-gray-100 leading-tight">
            Skip the workflow. Get the ranked list every Monday.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            You have the methodology. The Dashboard is the methodology, run
            for you, every Monday morning, on a universe of two hundred and
            fifty plus tracked organizations. Eighty-five startups ranked by
            Scout Score, filterable by sector, stage, and signal type, with
            commit-velocity, contributor-influx, and infra-buildout signals
            broken out per startup.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Founding-member rate of <strong className="text-sky-200">€9.97/mo locked in
            forever</strong> — set when the Dashboard launched, never raised for
            existing subscribers.
          </p>
          <Link
            href="/pricing#dashboard-beta"
            className="inline-flex items-center justify-center w-full sm:w-auto rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-6 py-3 transition-colors"
          >
            Lock in €9.97/mo Dashboard →
          </Link>
        </section>

        <section className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 space-y-3 text-sm">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            What happens next
          </p>
          <ol className="space-y-2 text-gray-200 text-sm leading-relaxed list-decimal list-inside">
            <li>
              The download email lands in your inbox within ninety seconds.
            </li>
            <li>
              Tomorrow morning at nine: a short note with the most recent
              Series A announcement that the methodology would have caught,
              walked through signal-by-signal.
            </li>
            <li>
              Day five: the introduction-and-Signal-1 chapter excerpt, sized
              for a coffee-break read.
            </li>
            <li>
              Day fourteen: an invitation to the free Monday-morning Signal
              Digest with the top five firings of that week.
            </li>
          </ol>
        </section>

        <p className="text-center text-xs text-gray-400">
          Questions? Reply to any email or write to{" "}
          <a
            className="text-sky-400 hover:text-sky-300"
            href="mailto:signals@gitdealflow.com"
          >
            signals@gitdealflow.com
          </a>
          .
        </p>

        <DataNerdSignoff variant="compact" className="mt-8" />
      </div>
    </>
  );
}
