import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  PLATFORM_LISTS,
  PLATFORM_STATUS_META,
  assertPlatformCounts,
  getAllPlatformSlugs,
  getPlatformList,
  platformStatusCounts,
  type VoiceStatus,
} from "@/content/voices-platforms";

export const dynamic = "force-static";

// Build-time sanity check: every list must hold exactly its declared count.
// If a future edit drifts a roster off 100, the build catches it here rather
// than letting a malformed list ship.
assertPlatformCounts();

export function generateStaticParams() {
  return getAllPlatformSlugs().map((platform) => ({ platform }));
}

interface PageProps {
  params: Promise<{ platform: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { platform } = await params;
  const list = getPlatformList(platform);
  if (!list) {
    return {
      title: "Voice roster not found",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${list.label} top 100 — ${list.tagline}`,
    description: `${list.intro} Cadence: ${list.cadence}`,
    alternates: { canonical: `/voices/${list.slug}` },
    openGraph: {
      title: `${list.label} — top 100 voices`,
      description: list.tagline,
      url: `https://signals.gitdealflow.com/voices/${list.slug}`,
      type: "article",
    },
  };
}

const STATUS_BADGE_CLASS: Record<VoiceStatus, string> = {
  engage: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  watch: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  hold: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  read: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  blocked: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const ORDERED_STATUSES: VoiceStatus[] = [
  "engage",
  "watch",
  "hold",
  "read",
  "blocked",
];

export default async function PlatformVoicesPage({ params }: PageProps) {
  const { platform } = await params;
  const list = getPlatformList(platform);
  if (!list) notFound();

  const counts = platformStatusCounts(list.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://signals.gitdealflow.com/voices/${list.slug}`,
        name: `${list.label} — top 100 voices`,
        description: list.tagline,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
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
            name: "Voices",
            item: "https://signals.gitdealflow.com/voices",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${list.label} top-100`,
            item: `https://signals.gitdealflow.com/voices/${list.slug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `${list.label} — top 100 voices`,
        numberOfItems: list.items.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: list.items.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: v.name,
          item: {
            "@type": "Thing",
            name: v.name,
            description: `${v.what} [status: ${PLATFORM_STATUS_META[v.status].short}]`,
            ...(v.href && v.href.startsWith("http") ? { url: v.href } : {}),
          },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`https://signals.gitdealflow.com/voices/${list.slug}`}
        languages={getHreflangLanguages(`/voices/${list.slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/voices/${list.slug}`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/voices" className="hover:text-gray-300">
              Voices
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{list.label} top-100</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            {list.label} · 100 entries · platform-specific
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {list.label} — top{" "}
            <span className="text-sky-400">100 voices</span>.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            {list.tagline}
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            {list.intro}
          </p>
        </header>

        <section
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-3"
          aria-label="Cadence and rule"
        >
          <div>
            <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider mb-1">
              Cadence
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {list.cadence}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider mb-1">
              Platform rule
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {list.rule}
            </p>
          </div>
        </section>

        <section
          aria-label="Status summary"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-4"
        >
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">
            Engagement status · {list.items.length} entries
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
            {ORDERED_STATUSES.map((s) => (
              <li
                key={s}
                className={`rounded-lg border px-3 py-2.5 ${STATUS_BADGE_CLASS[s]}`}
              >
                <p className="text-2xl font-bold tabular-nums">{counts[s]}</p>
                <p className="text-[11px] uppercase tracking-wider font-semibold">
                  {PLATFORM_STATUS_META[s].short}
                </p>
                <p className="text-[11px] opacity-75 leading-snug pt-1">
                  {PLATFORM_STATUS_META[s].long}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label={`${list.label} top 100 voices`} className="space-y-3">
          <header className="space-y-2 border-l-4 border-sky-600 pl-5">
            <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
              The literal roster
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              100 entries — numbered, status-flagged, linked.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sorted by attention priority (top of list = most active surface).
              Engage-tagged entries are where the Tue / Fri cycle lives.
            </p>
          </header>
          <ol className="space-y-2">
            {list.items.map((v, i) => {
              const position = i + 1;
              return (
                <li
                  key={`${list.slug}-${position}`}
                  className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3.5"
                >
                  <span className="text-sky-500 font-bold tabular-nums shrink-0 w-9 text-right text-sm pt-0.5">
                    {position}.
                  </span>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <p className="text-gray-100 font-semibold text-sm break-all sm:break-normal">
                        {v.href ? (
                          <a
                            href={v.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-sky-300 underline decoration-dotted"
                          >
                            {v.name}
                          </a>
                        ) : (
                          v.name
                        )}
                      </p>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${STATUS_BADGE_CLASS[v.status]}`}
                        title={PLATFORM_STATUS_META[v.status].long}
                      >
                        {PLATFORM_STATUS_META[v.status].short}
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

        <nav
          aria-label="Other platform rosters"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
        >
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            Other platform rosters
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            {PLATFORM_LISTS.map((p) =>
              p.slug === list.slug ? (
                <li
                  key={p.slug}
                  className="px-3 py-2 rounded-md bg-slate-800 text-gray-500 text-xs cursor-default"
                  aria-current="page"
                >
                  {p.label} (current)
                </li>
              ) : (
                <li key={p.slug}>
                  <Link
                    href={`/voices/${p.slug}`}
                    className="block px-3 py-2 rounded-md bg-slate-800/60 hover:bg-slate-800 text-sky-300 hover:text-sky-200 transition-colors"
                  >
                    {p.label} — top 100 →
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            How to use this roster
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Mirror the cadence. Read three of these regularly. Comment on one
            once a week.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            We don&rsquo;t guard our infiltration plan because it doesn&rsquo;t
            scale by secrecy — it scales by repetition. If you want to mirror
            the same {list.label} attention map, that&rsquo;s
            net positive: the conversation gets denser, the dataset gets
            cleaner, and the answer to the same question on each platform
            converges. We&rsquo;ll still ship the free{" "}
            <Link
              href="https://gitdealflow.com/#signup"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
            >
              Acceleration Watch
            </Link>{" "}
            on Mondays.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the free Acceleration Watch →
            </a>
            <Link
              href="/voices"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              All three rosters →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          The {list.label} roster is regenerated quarterly. Status flags
          update weekly when engagement state changes. Companion mixed list at{" "}
          <Link
            href="/target-list"
            className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
          >
            /target-list
          </Link>
          .
        </p>
      </div>
    </>
  );
}
