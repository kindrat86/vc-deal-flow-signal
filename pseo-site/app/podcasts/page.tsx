import type { Metadata } from "next";
import { GUEST_TOPICS } from "@/content/guest-topics";
import {
  getReadyTargets,
  getTargetsCountByStatus,
  type PodcastTarget,
} from "@/content/podcast-targets";
import { withEditorialOverride } from "@/lib/metadata";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = withEditorialOverride({
  title:
    "Podcasts, synthetic-voice guest segments",
  description:
    "Pre-recorded podcast segments for show hosts: 5, 7, and 10-minute methodology walkthroughs delivered by The Data Nerd via synthetic voice. Seven topics ready, thirteen shows in active outreach.",
  alternates: { canonical: "/podcasts" },
  openGraph: {
    title: "Podcasts",
    description:
      "Synthetic-voice podcast segments. Seven topics, thirteen shows in active outreach.",
    type: "article",
    url: `${SITE}/podcasts`,
  },
});

export const dynamic = "force-static";

const FOCUS_LABELS: Record<PodcastTarget["focus"], string> = {
  "ai-eng": "AI engineering",
  "ai-research": "AI research",
  vc: "Venture capital",
  devtools: "Developer tools",
  data: "Data engineering",
  founder: "Founder",
  "general-tech": "General tech",
};

export default function PodcastsPage() {
  const ready = getReadyTargets();
  const counts = getTargetsCountByStatus();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}/podcasts#service`,
        name: "Synthetic-voice podcast guest program",
        provider: { "@id": `${SITE}/#org` },
        serviceType: "Pre-recorded podcast guest segments",
        description:
          "Pre-recorded 5, 7, and 10-minute podcast segments narrated by The Data Nerd via synthetic voice. Show hosts receive a verbatim 60-second opening, five host-Q&A questions, and links to receipts (SSRN paper, dataset, methodology).",
        areaServed: { "@type": "Place", name: "Worldwide" },
        url: `${SITE}/podcasts`,
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/podcasts#topics`,
        name: "Prepared podcast topics",
        numberOfItems: GUEST_TOPICS.length,
        itemListElement: GUEST_TOPICS.map((t, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "CreativeWork",
            name: t.title,
            description: t.subheadline,
            url: `${SITE}/podcasts#${t.slug}`,
            timeRequired: `PT${t.length}M`,
          },
        })),
      },
    ],
  };

  const statusSummary = [
    counts.live ? `${counts.live} live` : null,
    counts.scheduled ? `${counts.scheduled} scheduled` : null,
    counts["in-talks"] ? `${counts["in-talks"]} in talks` : null,
    counts.pitched ? `${counts.pitched} pitched` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-10 text-gray-200">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-sky-400 font-semibold">
            Podcast guest program
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Synthetic-voice podcast segments
          </h1>
          <p className="text-gray-400 leading-relaxed text-base">
            The Data Nerd records 5, 7, and 10-minute podcast segments via
            synthetic voice, the same voice that powers our methodology
            walkthrough. Hosts receive a verbatim 60-second opening, five Q&amp;A
            prompts, and links to receipts (SSRN paper, methodology, dataset).
            The format is methodology-first; the founder identity is incidental.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Prepared topics</h2>
          <p className="text-gray-400 text-sm">
            Seven segments, ready to ship. Each comes with a verbatim opening
            transcript, host-Q&amp;A questions, and a receipts pack for show
            notes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GUEST_TOPICS.map((t) => (
              <article
                key={t.slug}
                id={t.slug}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-2"
              >
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  {t.length}-min segment
                </p>
                <h3 className="text-gray-100 font-semibold text-base leading-snug">
                  {t.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t.subheadline}
                </p>
                <ul className="text-gray-500 text-xs leading-relaxed space-y-1 pt-1">
                  {t.audienceFit.map((a) => (
                    <li key={a}>· {a}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Active outreach</h2>
          <p className="text-gray-400 text-sm">
            {ready.length} shows in our ready queue
            {statusSummary ? `, ${statusSummary}` : ""}. Updated as shows
            respond.
          </p>
          <div className="space-y-2">
            {ready.map((t) => (
              <a
                key={t.slug}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md border border-slate-800 bg-slate-900/30 px-4 py-3 hover:border-slate-600 transition-colors"
              >
                <span className="text-gray-100 font-medium">{t.name}</span>
                <span className="text-gray-500 text-sm">{t.host}</span>
                <span className="text-[10px] uppercase tracking-wider text-sky-400 ml-auto">
                  {FOCUS_LABELS[t.focus]}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="text-gray-400 text-sm border-t border-slate-800 pt-5 leading-relaxed">
          <p>
            Hosting a show that fits? Email{" "}
            <a
              href="mailto:press@gitdealflow.com"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              press@gitdealflow.com
            </a>{" "}
            with the show URL and audience demographic. We&rsquo;ll send the
            verbatim 60-second preview and a synthetic-voice sample within 48
            hours.
          </p>
        </section>
      </div>
    </>
  );
}
