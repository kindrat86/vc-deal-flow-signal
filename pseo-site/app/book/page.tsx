import type { Metadata } from "next";
import Link from "next/link";
import { BOOK } from "@/lib/book";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import TrialClose from "@/components/TrialClose";

export const dynamic = "force-static";

const STRIPE_BOOK_LINK =
  process.env.NEXT_PUBLIC_STRIPE_BOOK_LINK ||
  "https://buy.stripe.com/cNi5kCax52d29sy1by0x208";

const PAGE_URL = "https://signals.gitdealflow.com/book";

export const metadata: Metadata = {
  title: `${BOOK.title} — Free book by ${BOOK.authorRole}`,
  description: BOOK.description,
  alternates: { canonical: "/book" },
  openGraph: {
    title: BOOK.title,
    description:
      "A working investor's field manual — read free online, download free PDF + EPUB, or grab the €0.99 Kindle copy.",
    url: PAGE_URL,
    type: "book",
  },
};

const PROMISES = [
  {
    n: "01",
    h: "Compute the highest-yield Series A predictor in twelve lines of Python",
    p: "The fourteen-day commit-velocity acceleration with two-period confirmation. Sixty-eight per cent hit rate at thirty-three days median lead time, on the SSRN-indexed panel of 219 Series-A-bound startups.",
  },
  {
    n: "02",
    h: "Read a contributor influx the same week it fires",
    p: "Four new humans shipping in fourteen days, bot-filtered, with a one-hundred-and-twenty-day look-back. The Series A's first hires show up here weeks before LinkedIn updates.",
  },
  {
    n: "03",
    h: "Decode the operational scaffolding a startup builds before it builds it",
    p: "Terraform modules, Helm charts, runbooks. Six diagnostic repository archetypes. The earliest-firing of the seven signals, sometimes ten weeks before the round.",
  },
  {
    n: "04",
    h: "Catch the off-platform attention spike that the founders orchestrated",
    p: "Star-velocity detachment — when stars accelerate three times faster than commits. The signature of a Show HN, a Product Hunt launch, a viral demo, or a coordinated trade-publication feature.",
  },
  {
    n: "05",
    h: "Use the metric founders cannot fake as your tie-breaker",
    p: "Median issue-close-time, sharply tightening, on a stable issue-creation rate. A leadership-quality signal that is impossible to fake without breaking the product.",
  },
  {
    n: "06",
    h: "Trace adoption through other people's package.json",
    p: "Libraries.io aggregation across npm, PyPI, Maven, crates.io, Go modules. The second-most-honest signal in the book — seventy-three per cent hit rate for developer-tools companies.",
  },
  {
    n: "07",
    h: "Read the founders' public visibility burst before the cap table closes",
    p: "Engineering blog posts. Conference talks. Podcast appearances. The asymmetry across founder roles is the diagnostic.",
  },
];

const STAKES = [
  "You stop asking for warm intros to companies your peers have already met.",
  "You walk into the founder conversation having read every line of public code they have shipped in the past sixty days.",
  "You compute one signal yourself in the appendix, against the live leaderboard, in ninety minutes — and from then on the methodology is yours, replicable on a $0 budget, indefinitely.",
  "Your watchlist of thirty companies turns into a Monday-morning workflow that takes ninety minutes and produces three or four high-conviction conversations per quarter.",
];

const REVIEWS = [
  {
    by: "L.V., partner at a London seed fund",
    text: "I read it on a Friday evening, ran the appendix on Saturday morning, and emailed two founders by Saturday afternoon. One of those conversations is now an active diligence process.",
  },
  {
    by: "M.K., principal at a US developer-tools fund",
    text: "The methodology chapter is what I've been trying to get our analysts to write for two years. It's the cleanest articulation of the public-data thesis I've seen.",
  },
  {
    by: "T.S., angel investor and former VP Eng",
    text: "I've been doing this informally for years. The book gives the workflow a name, a cadence, and a falsifiable threshold for every signal. That last part is the value.",
  },
];

const FAQS = [
  {
    q: "Why is the book free? What's the catch?",
    a: "Three reasons. First, the methodology is already public — the SSRN preprint at abstract id 6606558 contains the formal version. The book is the operational version of the same work. Second, free distribution is the point: the more readers run the workflow, the better the methodology gets, because every reader who finds a false-positive pattern reports it back and we fold it into the next edition. Third, this is a marketing motion — readers who get value from the book are the ones who eventually subscribe to the €9.97/mo Dashboard, and a book that closes that loop pays for itself in three subscribers.",
  },
  {
    q: "What do I get with the €0.99 Kindle copy?",
    a: "Identical content to the free downloads, but in the Amazon Kindle format with native syncing across Kindle apps and devices. The €0.99 also unlocks a sequence of three additional emails: a worked walkthrough of the latest Series A announcement that the methodology would have caught, a private link to the bonus interview with two early readers who use the workflow daily, and a direct line to me by email for any methodology questions.",
  },
  {
    q: "How long does it take to read?",
    a: "About four hours straight through. The introduction and conclusion are short. The seven signal chapters are roughly thirty minutes each. The methodology chapter and the replication appendix are best read with a terminal open and take an additional ninety minutes if you do the exercises.",
  },
  {
    q: "Do I need to know how to code?",
    a: "Reading: no. Comprehension: very useful but not strictly required. Replication appendix: yes — the appendix is intentionally written for readers comfortable with a Python script and a curl command. If you do not code, you will get value from the seven signal chapters and the conclusion, and you can either skip the methodology and appendix or pair with a colleague who can run the scripts.",
  },
  {
    q: "Is the data really that good?",
    a: "Read the SSRN preprint at ssrn.com/abstract=6606558. The numbers in the book are the same as the numbers in the preprint, with one or two threshold updates that reflect the larger panel size in the 2026 follow-on. The single biggest source of scepticism — that the seven-signal stack would not generalise outside the 2023 cohort — is addressed in the appendix's historical-replication exercises.",
  },
  {
    q: "Can I republish or quote from the book?",
    a: "Yes. The book is licensed CC-BY-4.0 — quote freely with attribution to The Data Nerd / GitDealFlow. If you want to republish a full chapter on your own newsletter or blog, drop me a note at signals@gitdealflow.com first; I am almost always happy to say yes and will sometimes have a mildly improved version that has not yet been folded into the public PDF.",
  },
];

export default function BookPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        "@id": `${PAGE_URL}#book`,
        name: BOOK.title,
        alternateName: "The Seven Signals",
        bookFormat: "https://schema.org/EBook",
        author: {
          "@type": "Person",
          name: BOOK.authorName,
          jobTitle: BOOK.authorRole,
          url: "https://signals.gitdealflow.com/about/founder",
        },
        publisher: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://gitdealflow.com",
        },
        inLanguage: BOOK.language,
        bookEdition: BOOK.edition,
        datePublished: BOOK.publishedDate,
        numberOfPages: BOOK.pages,
        wordCount: BOOK.wordCount,
        isbn: BOOK.isbn,
        description: BOOK.description,
        url: PAGE_URL,
        offers: [
          {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            price: "0.00",
            priceCurrency: "EUR",
            url: `${PAGE_URL}#download`,
            name: "Free PDF + EPUB download",
          },
          {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            price: "0.99",
            priceCurrency: "EUR",
            priceValidUntil: "2026-12-31",
            url: STRIPE_BOOK_LINK,
            name: "Premium Kindle edition",
          },
        ],
        hasPart: BOOK.chapters.map((c) => ({
          "@type": "Chapter",
          name: c.title,
          alternativeHeadline: c.subtitle,
          position: c.number + 1,
          url: `${PAGE_URL}/read/${c.slug}`,
        })),
        review: REVIEWS.map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.by },
          reviewBody: r.text,
          reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
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
        languages={getHreflangLanguages("/book")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/book" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero */}
        <header className="space-y-6 text-center">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-[0.18em]">
            New book · 104 pages · Free PDF + EPUB · €0.99 Kindle
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            {BOOK.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {BOOK.subtitle}.
          </p>
          <div className="flex flex-col items-center gap-3 pt-4">
            <Link
              href="#download"
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-lg px-8 py-4 shadow-lg shadow-sky-500/20 transition-colors"
            >
              Get the free PDF + EPUB →
            </Link>
            <p className="text-sm text-gray-400">
              or{" "}
              <Link
                href="/book/read/introduction"
                className="text-gray-300 hover:text-sky-300 underline underline-offset-2"
              >
                read it free online
              </Link>{" "}
              ·{" "}
              <a
                href={STRIPE_BOOK_LINK}
                className="text-amber-300 hover:text-amber-200 underline underline-offset-2"
              >
                €0.99 Kindle copy
              </a>
            </p>
          </div>
          <p className="text-xs text-gray-400 pt-2">
            ISBN {BOOK.isbn} · {BOOK.edition} · CC-BY-4.0 · Methodology indexed at{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
            >
              SSRN abstract 6606558
            </a>
          </p>
        </header>

        <section className="rounded-2xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Use the book when you want the full argument and the seven-signal framework. But if your real question is proof, timing, or what to buy first, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 transition-colors">
              Read the research panel →
            </Link>
            <Link href="/compare/crunchbase-alternative-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Compare timing vs verification →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the buyer's guide →
            </Link>
          </div>
        </section>

        {/* The Big Domino — Brunson Perfect Webinar single-belief frame */}
        <section className="bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950 border border-sky-900/40 rounded-xl p-6 sm:p-8 space-y-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            The core claim
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            If reading public GitHub data can predict Series A rounds three to
            six weeks before the press release, with a sixty-eight per cent hit
            rate, on a $0 budget — then warm-intro deal flow is no longer the
            only path into early-stage venture.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The book is the working investor's field manual for that single
            belief. Seven signals. One methodology. A ninety-minute replication
            walkthrough that takes you from a fresh laptop to a verified rank
            against the live leaderboard. Every claim falsifiable, every
            threshold a number, every example a public URL.
          </p>
          <TrialClose tone="sky">
            One claim, falsifiable, free to download. If the methodology
            holds when you replicate it on a fresh laptop in 90 minutes —
            does the rest of the deal-flow market reduce to a stack of
            lagging indicators?
          </TrialClose>
        </section>

        {/* What you'll learn */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
            The seven signals you will learn to read
          </h2>
          <ol className="space-y-5">
            {PROMISES.map((p) => (
              <li
                key={p.n}
                className="flex gap-4 sm:gap-5 bg-slate-900/40 border border-slate-800 rounded-lg p-5"
              >
                <span className="text-sky-400 font-mono text-2xl font-bold leading-none flex-shrink-0">
                  {p.n}
                </span>
                <div className="space-y-1.5">
                  <p className="text-gray-100 font-semibold text-base sm:text-lg">
                    {p.h}
                  </p>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    {p.p}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Stakes */}
        <section className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-900/40 rounded-xl p-6 sm:p-8 space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            What changes after you read it
          </p>
          <ul className="space-y-3">
            {STAKES.map((s, idx) => (
              <li key={idx} className="flex gap-3 text-gray-200 text-base leading-relaxed">
                <span aria-hidden="true" className="text-amber-300 font-bold flex-shrink-0">
                  →
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <TrialClose tone="amber">
            104 pages, free PDF, €0.99 Kindle. If the price isn&rsquo;t the
            question and the time-to-read is — would you rather start at
            chapter one or skim the table of contents below first?
          </TrialClose>
        </section>

        {/* Table of contents */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
            Table of contents
          </h2>
          <ol className="border border-slate-800 rounded-lg divide-y divide-slate-800">
            {BOOK.chapters.map((c) => (
              <li key={c.slug} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 p-4 hover:bg-slate-900/60 transition-colors">
                <span className="text-sky-400 font-mono text-sm font-bold w-12 flex-shrink-0">
                  {c.number === 0 ? "Intro" : c.number === 8 ? "App." : c.number === 9 ? "Walk." : c.number === 10 ? "Conc." : `0${c.number}`}
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
          <p className="text-center text-sm text-gray-400 pt-2">
            <Link href="/book/read/introduction" className="text-sky-400 hover:text-sky-300">
              Start reading from the introduction →
            </Link>
          </p>
        </section>

        {/* Download / capture form */}
        <section
          id="download"
          className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/40 rounded-xl p-6 sm:p-8 space-y-5"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Free download
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
            Get the PDF and EPUB. No credit card. Instant.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            One email — the PDF and EPUB downloads land in your inbox in about
            ninety seconds. You also get the free Monday-morning Signal Digest
            with the top five firings across the universe of tracked
            organizations. Unsubscribe in one click; your email is never sold.
          </p>
          <form
            action="/api/book/download"
            method="POST"
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@yourfund.vc"
              className="flex-1 rounded-lg bg-slate-950 border border-slate-700 text-gray-100 placeholder:text-gray-400 px-4 py-3 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
            />
            <input type="hidden" name="utm_source" value="book-page" />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-6 py-3 transition-colors"
            >
              Email me the book
            </button>
          </form>
          <p className="text-xs text-gray-400">
            Direct download (no email):{" "}
            <a className="text-sky-400 hover:text-sky-300 underline underline-offset-2" href="/downloads/seven-signals.pdf">
              PDF
            </a>{" "}·{" "}
            <a className="text-sky-400 hover:text-sky-300 underline underline-offset-2" href="/downloads/seven-signals.epub">
              EPUB
            </a>{" "}·{" "}
            <a className="text-sky-400 hover:text-sky-300 underline underline-offset-2" href="/downloads/seven-signals.md">
              Markdown
            </a>{" "}·{" "}
            <a className="text-sky-400 hover:text-sky-300 underline underline-offset-2" href="/downloads/seven-signals.txt">
              Plain text
            </a>
          </p>
        </section>

        {/* €0.99 Kindle CTA */}
        <section className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-700/50 rounded-xl p-6 sm:p-8 space-y-5">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Premium · €0.99 Kindle copy
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
            The €0.99 Kindle copy: cleaner edition + three bonus emails
          </h2>
          <ul className="space-y-2.5 text-gray-200 text-base leading-relaxed">
            <li className="flex gap-3">
              <span className="text-amber-300 flex-shrink-0">✓</span>
              <span>Native Kindle format — syncs across every Kindle device and app</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-300 flex-shrink-0">✓</span>
              <span>Bonus email 1: a fully worked walkthrough of the most recent Series A announcement that the methodology would have caught — week-by-week, signal-by-signal</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-300 flex-shrink-0">✓</span>
              <span>Bonus email 2: a private link to the unedited interview transcripts with two early readers who use the workflow daily</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-300 flex-shrink-0">✓</span>
              <span>Bonus email 3: a direct line to me by email for any methodology questions for thirty days</span>
            </li>
          </ul>
          <a
            href={STRIPE_BOOK_LINK}
            className="inline-flex items-center justify-center w-full sm:w-auto rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 transition-colors"
          >
            Get the Kindle copy — €0.99 one-time
          </a>
          <p className="text-xs text-gray-400">
            Stripe checkout · receipt in your inbox · the bonus emails arrive
            over the following week.
          </p>
        </section>

        {/* Reviews */}
        <section className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
            Early reads
          </h2>
          <p className="text-xs text-gray-400 italic">
            Quoted with permission, names initialised at request.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {REVIEWS.map((r, i) => (
              <blockquote
                key={i}
                className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-2.5"
              >
                <p className="text-gray-200 text-sm leading-relaxed italic">
                  &ldquo;{r.text}&rdquo;
                </p>
                <p className="text-gray-400 text-xs">— {r.by}</p>
              </blockquote>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
            Common questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="group bg-slate-900/40 border border-slate-800 rounded-lg p-5 open:bg-slate-900/70"
              >
                <summary className="cursor-pointer list-none flex items-baseline gap-3">
                  <span className="text-sky-400 transition-transform group-open:rotate-90">
                    ›
                  </span>
                  <span className="text-gray-100 font-semibold flex-1">
                    {f.q}
                  </span>
                </summary>
                <p className="text-gray-300 text-sm leading-relaxed mt-3 ml-6">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="text-center space-y-5 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
            Ready to read?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="#download"
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-6 py-3 transition-colors"
            >
              Free PDF + EPUB
            </Link>
            <a
              href={STRIPE_BOOK_LINK}
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 transition-colors"
            >
              €0.99 Kindle
            </a>
            <Link
              href="/book/read/introduction"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 hover:text-gray-100 font-semibold px-6 py-3 transition-colors"
            >
              Read online
            </Link>
          </div>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Or skip the book and start with the free Monday-morning{" "}
            <Link href="/" className="text-sky-400 hover:text-sky-300 underline underline-offset-2">
              Signal Digest
            </Link>{" "}
            · the €9.97/mo{" "}
            <Link href="/pricing" className="text-sky-400 hover:text-sky-300 underline underline-offset-2">
              Dashboard
            </Link>{" "}
            · or the SSRN-indexed{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
            >
              methodology paper
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}
