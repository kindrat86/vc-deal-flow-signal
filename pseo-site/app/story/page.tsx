import type { Metadata } from "next";
import Link from "next/link";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const metadata: Metadata = {
  title: "The Story — Why GitDealFlow Was Built",
  description:
    "The short story behind GitDealFlow: why hearing about the company late became the problem, and why public engineering movement became the signal worth watching earlier.",
  alternates: { canonical: "/story" },
  openGraph: {
    title: "The Story — Why GitDealFlow Was Built",
    description:
      "Why hearing about the company late became the problem, and why public engineering movement became the signal worth watching earlier.",
    url: "https://signals.gitdealflow.com/story",
    type: "article",
  },
};

const LESSONS = [
  {
    title: "The problem was never a lack of startup data",
    body: "The problem was always timing. By the time the company looked obvious on the familiar surfaces, the calm window was already gone.",
  },
  {
    title: "Public engineering movement was the earlier clue",
    body: "The useful change showed up before the polished story did: shipping pace, contributor expansion, and visible technical momentum that moved before the deck started circulating.",
  },
  {
    title: "The right output had to feel lighter, not heavier",
    body: "The point was never to build another dashboard you had to manage. The point was to create a signal you could trust quickly enough to use.",
  },
] as const;

export default function StoryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "The Story — Why GitDealFlow Was Built",
        description:
          "Why hearing about the company late became the problem, and why public engineering movement became the signal worth watching earlier.",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/story",
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/story"
        languages={getHreflangLanguages("/story")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/story" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Story</span>
        </nav>

        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-[0.16em]">
            Story
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.08] tracking-tight">
            The story starts with hearing about the company too late.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            The problem was not that the companies were invisible. The problem was that the useful public change was showing up before the usual story surfaces, and nobody was turning that earlier movement into something calm enough to use.
          </p>
        </header>

        <section className="rounded-xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Use the story when you want the context. But if your real question is proof, timing, or buyer-side fit, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 text-slate-950 text-sm font-semibold hover:bg-signal-600 transition-colors">
              Read the research panel →
            </Link>
            <Link href="/how-to-spot-startup-momentum-before-the-round-gets-crowded" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the timing guide →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the buyer's guide →
            </Link>
          </div>
        </section>

        <section className="rounded-xl border-l-4 border-sky-500 bg-slate-900/60 p-6 space-y-4">
          <p className="text-gray-300 text-base leading-relaxed">
            One weekend made the whole problem obvious. A small startup looked unusually alive in public engineering behavior — faster shipping, more contributors, more movement than the outside story suggested. Then the round was announced a few weeks later. The signal had been there. The workflow around it had not.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            That is why GitDealFlow exists. Not to replace every other tool. Not to become another loud platform. Just to make that earlier signal legible enough that you can use it before the round starts feeling obvious.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-100">What changed after that</h2>
          <div className="space-y-4">
            {LESSONS.map((lesson) => (
              <article
                key={lesson.title}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-2"
              >
                <h3 className="text-gray-100 text-lg font-semibold leading-snug">
                  {lesson.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-[15px] leading-relaxed">
                  {lesson.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Best next step
          </p>
          <h2 className="text-2xl font-bold text-gray-100 leading-snug">
            If this story feels familiar, start with the signal — not the biography.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The useful question now is simple: does the weekly signal give you a clearer read than the usual noise does? Start there.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            This is the move of a First Mover: we move on the engineering signal before the round — without reading a line of code.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="https://gitdealflow.com/#signup" className="inline-flex items-center justify-center rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-semibold px-5 py-3 transition-colors">
              Get the free issue
            </Link>
            <Link href="/how-to-spot-startup-momentum-before-the-round-gets-crowded" className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 text-gray-200 hover:border-slate-600 text-sm font-semibold px-5 py-3 transition-colors">
              Read the timing guide
            </Link>
          </div>
        </section>

        <DataNerdSignoff variant="default" />
      </div>
    </>
  );
}
