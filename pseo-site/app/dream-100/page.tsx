import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  DREAM_100_GROUPS,
  DREAM_100_TOTAL,
  STATUS_META,
  dream100StatusCounts,
  type Dream100Status,
} from "@/content/dream-100";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Dream 100 — the literal roster of 100 voices, with engagement status",
  description:
    "100 named publications, communities, GitHub orgs, podcasts, datasets, and LinkedIn Company Pages where the developer-investor's audience already lives. Each entry carries an engagement status flag (engage / watch / hold / read / blocked) so the roster reads as a working board, not a wishlist.",
  alternates: { canonical: "/dream-100" },
  openGraph: {
    title: "Dream 100 — voices we read, with engagement status",
    description:
      "Numbered roster of 100 named entities + status flags. The Brunson Dream 100 applied to the developer-investor.",
    url: "https://signals.gitdealflow.com/dream-100",
    type: "article",
  },
};

const STATUS_BADGE_CLASS: Record<Dream100Status, string> = {
  engage:
    "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  watch: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  hold: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  read: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  blocked: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function Dream100Page() {
  const counts = dream100StatusCounts();
  const orderedStatuses: Dream100Status[] = [
    "engage",
    "watch",
    "hold",
    "read",
    "blocked",
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/dream-100",
        name: "Dream 100 — literal roster, with engagement status",
        description:
          "100 named publications, communities, GitHub orgs, podcasts, datasets, and LinkedIn Company Pages where the developer-investor's audience already lives. Each entry carries an engagement status flag.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Dream 100", item: "https://signals.gitdealflow.com/dream-100" },
        ],
      },
      {
        "@type": "ItemList",
        name: "Dream 100 — voices we read",
        numberOfItems: DREAM_100_TOTAL,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: DREAM_100_GROUPS.flatMap((g, gi) =>
          g.items.map((v, vi) => ({
            "@type": "ListItem",
            position: gi * 10 + vi + 1,
            name: v.name,
            item: {
              "@type": "Thing",
              name: v.name,
              description: `${v.what} [status: ${STATUS_META[v.status].short}]`,
              ...(v.href && v.href.startsWith("http") ? { url: v.href } : {}),
            },
          })),
        ),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/dream-100"
        languages={getHreflangLanguages("/dream-100")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/dream-100" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Dream 100</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Traffic Secrets, Section 1, Chapter 5 · Applied (Secret 4)
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            The Dream 100 — the{" "}
            <span className="text-sky-400">literal roster</span> of 100 voices,
            with engagement status.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            Brunson&rsquo;s rule: pick the 100 publications, communities, and
            orgs whose audience already contains your dream customer.
            Don&rsquo;t pitch — show up where they are, contribute, let the
            signal compound.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Most pages that quote the Dream 100 stop at the framework. We list
            the actual 100 names, numbered 1 to 100, with a per-entry{" "}
            <strong className="text-gray-100">engagement status</strong>:{" "}
            <em>engage</em> means we post / comment there;{" "}
            <em>watch</em> means we monitor only;{" "}
            <em>hold</em> means engagement is paused;{" "}
            <em>read</em> means consume-only by design (or paywall);{" "}
            <em>blocked</em> means a platform constraint or anonymity rule
            keeps us out.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            Anonymity rule: every voice on this list is a public publication,
            org, or community. We don&rsquo;t name the individual founders we
            track inside our paid product — that&rsquo;s the buyer&rsquo;s
            edge, not ours to publish.
          </p>
        </header>

        <section
          aria-label="Status summary"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4"
        >
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">
            Status summary · {DREAM_100_TOTAL} entries
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
            {orderedStatuses.map((s) => (
              <li
                key={s}
                className={`rounded-lg border px-3 py-2.5 ${STATUS_BADGE_CLASS[s]}`}
              >
                <p className="text-2xl font-bold tabular-nums">{counts[s]}</p>
                <p className="text-[11px] uppercase tracking-wider font-semibold">
                  {STATUS_META[s].short}
                </p>
                <p className="text-[11px] opacity-75 leading-snug pt-1">
                  {STATUS_META[s].long}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <nav
          aria-label="Sections"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
        >
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-3">
            10 categories · 100 voices · jump to:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
            {DREAM_100_GROUPS.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="block px-3 py-1.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-sky-300 hover:text-sky-200 transition-colors"
                >
                  {g.label.split(" ").slice(2).join(" ") || g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {DREAM_100_GROUPS.map((g, gi) => (
          <section
            key={g.id}
            id={g.id}
            className="space-y-4 scroll-mt-20"
            aria-label={g.label}
          >
            <header className="space-y-2 border-l-4 border-sky-600 pl-5">
              <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                {g.label.split(" ").slice(0, 2).join(" ")}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
                {g.label}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {g.intro}
              </p>
            </header>
            <ol className="space-y-3" start={1}>
              {g.items.map((v, i) => {
                const globalPos = gi * 10 + i + 1;
                return (
                  <li
                    key={`${g.id}-${i}`}
                    className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4"
                  >
                    <span className="text-sky-500 font-bold tabular-nums shrink-0 w-8 text-right text-sm">
                      {globalPos}.
                    </span>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <p className="text-gray-100 font-semibold text-sm">
                          {v.href ? (
                            v.href.startsWith("/") ? (
                              <Link
                                href={v.href}
                                className="hover:text-sky-300 underline decoration-dotted"
                              >
                                {v.name}
                              </Link>
                            ) : (
                              <a
                                href={v.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-sky-300 underline decoration-dotted"
                              >
                                {v.name}
                              </a>
                            )
                          ) : (
                            v.name
                          )}
                        </p>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${STATUS_BADGE_CLASS[v.status]}`}
                          title={STATUS_META[v.status].long}
                        >
                          {STATUS_META[v.status].short}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {v.what}
                      </p>
                      {v.note && (
                        <p className="text-gray-500 text-xs leading-relaxed italic border-l border-slate-700 pl-3">
                          {v.note}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}

        <section
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="How we engage"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            How we engage — the cadence behind the roster
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            One contact per surface, twice a week, ceiling of four.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The Dream 100 is not a contact-list to email. It&rsquo;s a board
            we work in public. Every Tuesday and Friday at 14:00 EEST, the
            company page replies on one or two posts inside the{" "}
            <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded text-xs">
              engage
            </code>
            -tagged Company Pages. Hard ceiling of 4 replies/week — LinkedIn
            throttles company pages above that.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            On the Reddit side: comment-only on{" "}
            <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded text-xs">
              r/venturecapital
            </code>{" "}
            (auto-mod removes main posts that name a product), 40-55 words,
            Twitter-tight, no em-dashes. Hacker News is currently on{" "}
            <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded text-xs">
              hold
            </code>{" "}
            — the account is blocked from submitting / commenting; we publish
            here transparently rather than hide the gap.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Federated triple-mirror — Bluesky / Mastodon / Farcaster — runs
            on the same Tue / Fri pulse. Each post lives at its native URL,
            cross-quoted on Substack Notes, never astroturfed.
          </p>
        </section>

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            How to use this list
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            If three of these voices pattern-match to you, you&rsquo;re our
            dream customer.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            We didn&rsquo;t make this page for SEO. We made it because every
            week one developer-investor emails us asking which substacks we
            read, which podcasts we listen to, which datasets we trust. This
            is the answer in one place. If you read three of these regularly,
            the{" "}
            <Link
              href="https://gitdealflow.com/#signup"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
            >
              free Acceleration Watch
            </Link>{" "}
            is built around your reading habits — same density, same priors,
            same Monday rhythm.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the free Acceleration Watch →
            </a>
            <Link
              href="/distribution"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Where we publish (the other side of the map) →
            </Link>
          </div>
        </section>

        <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-6">
          The Dream 100 is a teaching from{" "}
          <em>Traffic Secrets</em> by Russell Brunson (2020). Used here under
          fair-use commentary. Not affiliated with ClickFunnels or Russell.
          The full audit of how this site reverse-engineers the trilogy is on{" "}
          <Link
            href="/funnels"
            className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
          >
            /funnels
          </Link>
          .
        </p>
      </div>
    </>
  );
}
