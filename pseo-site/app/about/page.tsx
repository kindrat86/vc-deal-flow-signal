import type { Metadata } from "next";
import Link from "next/link";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { DATA_NERD_PERSON_SCHEMA, DATA_NERD_AUTHOR_ID } from "@/lib/data-nerd";

export const metadata: Metadata = {
  title: "About VC Deal Flow Signal — Why It Exists and Why You Might Trust It",
  description:
    "Why VC Deal Flow Signal exists, what it tracks, and why its public methodology and data surfaces are built to help you trust the signal faster.",
  alternates: { canonical: "/about" },
  openGraph: {
    url: "https://signals.gitdealflow.com/about",
    type: "website",
    title: "About VC Deal Flow Signal",
    description:
      "Why this exists, what it tracks, and why the signal is built to be checked in public.",
  },
};

const PRINCIPLES = [
  {
    title: "You should be able to verify the claim",
    body: "If a signal asks for trust without proof, it is not good enough. The methodology is public. The proof surface is public. The data is inspectable. You should be able to get a cleaner read, not just a prettier promise.",
  },
  {
    title: "You should get timing, not just records",
    body: "Most startup databases are strongest after the story already exists. This product exists because the useful question is earlier: what changed before the round starts feeling obvious?",
  },
  {
    title: "You should not need another heavy workflow",
    body: "The goal is not to trap you in another dashboard. The goal is to help you notice what matters, decide faster, and move on with less noise.",
  },
] as const;

const WHAT_WE_TRACK = [
  "Engineering momentum across public GitHub activity",
  "Shipping cadence and contributor expansion",
  "Public signals that tend to move before the outside narrative catches up",
  "Sector-by-sector rankings built for earlier sourcing, not post-hoc explanation",
] as const;

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        url: "https://signals.gitdealflow.com/about",
        name: "About VC Deal Flow Signal",
        description:
          "Why VC Deal Flow Signal exists and what it tracks.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
        // Resolve the canonical author entity on its own URL. The site-wide
        // `${SITE}/about#person` references (author / accountablePerson /
        // spokenByCharacter across ~30 pages) all reconcile to this node.
        mainEntity: { "@id": DATA_NERD_AUTHOR_ID },
        about: { "@id": DATA_NERD_AUTHOR_ID },
      },
      // Authoritative, fully-anchored author node. Emitted here so every
      // `#person` pointer elsewhere resolves to a credentialed Person
      // (ORCID + SSRN/Semantic Scholar author pages + verified handles)
      // rather than a dangling reference. Pseudonymous by design; the handle
      // resolves to persistent external identity, never a real name.
      DATA_NERD_PERSON_SCHEMA,
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Why does VC Deal Flow Signal exist?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It exists because most startup data tools are better at verification than timing. VC Deal Flow Signal focuses on earlier public signals so you can notice what changed before the round starts feeling obvious.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to read code to use it?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The goal is not to make you read raw code. The goal is to turn public engineering behavior into a clearer signal you can actually use.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/about"
        languages={getHreflangLanguages("/about")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">About</span>
        </nav>

        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-[0.16em]">
            About
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.08] tracking-tight">
            You do not need another startup database. You need a signal you can trust earlier.
          </h1>
          <p data-speakable className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            VC Deal Flow Signal exists because most tools get stronger after the
            story is already public. This product was built around a different
            question: what changed before the round starts feeling obvious, and
            how can you check that without taking a vendor’s word for it?
          </p>
        </header>

        <section className="rounded-2xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Use this page when you want the why. But if your real question is proof, timing, or buyer-side fit, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3">
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

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.14em]">
            What you are looking at
          </p>
          <ul className="space-y-3 text-gray-300 text-sm sm:text-[15px] leading-relaxed">
            {WHAT_WE_TRACK.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-[0.55rem] h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-5">
          {PRINCIPLES.map((p) => (
            <article
              key={p.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
            >
              <h2 className="text-gray-100 text-lg font-semibold mb-2 leading-snug">
                {p.title}
              </h2>
              <p className="text-gray-400 text-sm sm:text-[15px] leading-relaxed">
                {p.body}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Best next step
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            Start with the proof, then decide whether you want the weekly signal.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
            If you want to verify the claim, go to the methodology or compare the stack.
            If you want to feel the output, start with the free Sunday issue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-semibold transition-colors"
            >
              Read the methodology
            </Link>
            <Link
              href="/compare/best-alternative-data-tools-for-angel-investors"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-700 bg-slate-950/60 text-gray-200 hover:border-slate-600 transition-colors text-sm font-semibold"
            >
              Compare the stack
            </Link>
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-amber-600/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 transition-colors text-sm font-semibold"
            >
              Get the free issue
            </Link>
          </div>
        </section>

        <PSEOFooterNav />
      </div>
    </>
  );
}
