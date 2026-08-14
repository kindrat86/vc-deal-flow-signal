import type { Metadata } from "next";
import Link from "next/link";
import { starsCases } from "@/content/from-stars-to-seed";
import { HreflangLinks } from "@/components/HreflangLinks";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { DEFAULT_HREFLANG_LANGUAGES } from "@/lib/hreflang";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/from-stars-to-seed`;

export const metadata: Metadata = {
  title:
    "From Stars to Seed, case studies of GitHub repos that became funded companies",
  description:
    "Case studies where GitHub engineering acceleration showed up before the public round, from Vercel and LangChain to Cursor, Groq, and Modal.",
  alternates: { canonical: "/from-stars-to-seed" },
  openGraph: {
    title:
      "From Stars to Seed, GitHub momentum case studies that led to priced rounds",
    description:
      "Repo-level engineering acceleration preceded the priced rounds at Vercel, LangChain, Hugging Face, Cursor, Groq, and more. The case studies are public; the signal is reproducible.",
    url: PAGE_URL,
    type: "article",
  },
};

export default function FromStarsToSeedIndexPage() {
  const totalCases = starsCases.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}#collection`,
        name: "From Stars to Seed, case studies",
        description:
          "Case studies of GitHub repositories whose engineering acceleration signal preceded a publicly announced fundraise.",
        url: PAGE_URL,
        inLanguage: "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
        hasPart: starsCases.map((c) => ({
          "@type": "Article",
          name: c.headline,
          url: `${SITE}/from-stars-to-seed/${c.slug}`,
          description: c.tagline,
          about: {
            "@type": "Organization",
            name: c.company,
          },
        })),
      },
      {
        "@type": "ItemList",
        name: "From Stars to Seed, case studies",
        description:
          "List of repos whose engineering acceleration preceded a priced round.",
        numberOfItems: totalCases,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: starsCases.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.company,
          url: `${SITE}/from-stars-to-seed/${c.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "From Stars to Seed",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  // Sort cases by raiseDate desc for the most-recent-first reading order.
  const sortedCases = [...starsCases].sort((a, b) =>
    a.raiseDate < b.raiseDate ? 1 : -1,
  );

  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={DEFAULT_HREFLANG_LANGUAGES}
      />
      <AgentMirrorLinks path="/from-stars-to-seed" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">From Stars to Seed</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Case studies · {totalCases} repos → priced rounds
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
            data-speakable
          >
            From <span className="text-sky-400">stars</span> to{" "}
            <span className="text-sky-400">seed</span>. The signal that
            preceded the round.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            Every entry on this page is a public GitHub repository whose
            engineering acceleration, star slope, release cadence, SDK
            install velocity, contributor growth, integration density, was
            visible <em>weeks or months before</em> the company behind it
            announced a priced round. Vercel, LangChain, Hugging Face,
            Cursor, Groq, Modal, Replicate, ComfyUI, and {totalCases - 8} more.
            The signal precedes the round. If your question is whether GitHub
            activity can be real proof instead of a story, this is the proof page.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            Sources: each case cites at least one canonical GitHub repository
            URL and the company&rsquo;s own fundraise announcement page.
            Where the round was unannounced or the company is community-funded,
            the entry is flagged as adoption-only and the signal is still
            useful for calibrating adjacent sourcing decisions.
          </p>
        </header>

        <section className="grid gap-3 sm:gap-4" aria-label="Case studies">
          {sortedCases.map((c) => (
            <Link
              key={c.slug}
              href={`/from-stars-to-seed/${c.slug}`}
              className="block rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-sky-700/50 transition-colors p-5 sm:p-6 group"
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                  /from-stars-to-seed/{c.slug}
                </p>
                <span className="text-[10px] text-slate-500 tabular-nums">
                  {c.raiseDate}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug group-hover:text-sky-200 transition-colors mb-2">
                {c.company}, {" "}
                <span className="text-gray-300 font-medium">{c.raise}</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                {c.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-700 bg-slate-800/60 text-slate-300 font-mono">
                  {c.primaryRepo}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{c.sector}</span>
              </div>
            </Link>
          ))}
        </section>

        <section
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="How this list compounds"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            How this list compounds
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            {totalCases} repos. Same signal shape. Different shoes.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The signal isn&rsquo;t the same metric every time. For Vercel
            it&rsquo;s star slope across three repos. For Cursor it&rsquo;s
            newsletter mention density. For Mistral it&rsquo;s the
            open-weights release itself. For PlanetScale it&rsquo;s
            partnership-announcement density. What every case shares is
            that the signal preceded the priced round, sometimes by
            weeks, sometimes by quarters.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            VC Deal Flow Signal tracks engineering acceleration in real
            time across twenty sectors. The same signal shapes that flagged
            the repos on this page run every Monday on every public repo
            in our dataset, the next case study is being authored right
            now in someone&rsquo;s commit log.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The right next step after proof is not another abstract claim.
            It is deciding whether this kind of timing signal belongs in your
            sourcing stack, how to compare it with verification tools, and what
            the lightest real workflow should be.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2 flex-wrap">
            <Link
              href="/firstlook"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the weekly signal report →
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Compare sourcing tools →
            </Link>
            <Link
              href="/compare/crunchbase-alternative-for-angel-investors"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Compare timing vs verification →
            </Link>
            <Link
              href="/buyers-guide"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Read the buyers guide →
            </Link>
            <Link
              href="/receipts"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Check your Scout Score →
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              How the signals are computed →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Refreshed weekly. Case studies cite public GitHub repos +
          fundraise announcements. Errata via{" "}
          <Link
            href="/corrections"
            className="text-sky-400 underline underline-offset-2 hover:text-sky-300"
          >
            /corrections
          </Link>
          .
        </p>

        <DataNerdSignoff variant="default" className="mt-12" />
      </div>
    </>
  );
}
