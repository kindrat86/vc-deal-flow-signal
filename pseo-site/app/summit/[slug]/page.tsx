import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import {
  getTalkBySlug,
  getAllTalkSlugs,
  isTalkLive,
  isTalkLocked,
  isTalkScheduled,
  SUMMIT,
  TALKS,
} from "@/content/summit";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllTalkSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = getTalkBySlug(slug);
  if (!t) return {};
  return {
    title: `${t.title} — VC Engineering Acceleration Summit`,
    description: t.abstract,
    alternates: { canonical: `/summit/${slug}` },
    openGraph: {
      title: t.title,
      description: t.abstract,
      type: "article",
      url: `${SITE}/summit/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.abstract,
    },
  };
}

export default async function SummitTalkPage({ params }: PageProps) {
  const { slug } = await params;
  const t = getTalkBySlug(slug);
  if (!t) notFound();

  const now = new Date();
  const live = isTalkLive(t, now);
  const locked = isTalkLocked(t, now);
  const scheduled = isTalkScheduled(t, now);

  // Find next & previous talks (by airAt order)
  const sorted = [...TALKS].sort(
    (a, b) => new Date(a.airAt).getTime() - new Date(b.airAt).getTime()
  );
  const idx = sorted.findIndex((x) => x.slug === t.slug);
  const prev = idx > 0 ? sorted[idx - 1] : undefined;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : undefined;

  const closesAt = new Date(
    new Date(t.airAt).getTime() + t.freeWindowHours * 3600 * 1000
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "@id": `${SITE}/summit/${slug}#event`,
        name: t.title,
        description: t.abstract,
        startDate: t.airAt,
        endDate: closesAt.toISOString(),
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "VirtualLocation",
          url: `${SITE}/summit/${slug}`,
        },
        superEvent: { "@id": `${SITE}/summit#event` },
        organizer: { "@id": "https://gitdealflow.com/#organization" },
        performer: {
          "@type": "Person",
          name: t.speaker,
          jobTitle: t.speakerRole,
        },
        offers: [
          {
            "@type": "Offer",
            name: "Free during 24-hour live window",
            price: "0",
            priceCurrency: "EUR",
            availability: live
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
            url: `${SITE}/summit/${slug}`,
            validFrom: t.airAt,
            validThrough: closesAt.toISOString(),
          },
          {
            "@type": "Offer",
            name: "All-Access Pass",
            price: String(SUMMIT.allAccessPrice),
            priceCurrency: SUMMIT.allAccessCurrency,
            availability: "https://schema.org/InStock",
            url: `${SITE}/summit/all-access`,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${SITE}/summit/${slug}#article`,
        headline: t.title,
        alternativeHeadline: t.subtitle,
        description: t.abstract,
        articleBody: t.notes.join("\n\n"),
        articleSection: "Summit talk",
        datePublished: t.airAt,
        dateModified: t.airAt,
        inLanguage: "en-US",
        isAccessibleForFree: live,
        isFamilyFriendly: true,
        author: {
          "@type": "Person",
          name: t.speaker,
          jobTitle: t.speakerRole,
        },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        mainEntityOfPage: `${SITE}/summit/${slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Summit", item: `${SITE}/summit` },
          {
            "@type": "ListItem",
            position: 3,
            name: t.title,
            item: `${SITE}/summit/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/summit/${slug}`}
        languages={getHreflangLanguages(`/summit/${slug}`)}
      />
      <AgentMirrorLinks path={`/summit/${slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-xs text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/summit" className="hover:text-gray-300">Summit</Link>
          <span className="mx-2">/</span>
          <span>{t.slug}</span>
        </nav>

        <header className="space-y-4 border-b border-slate-800 pb-6">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            {t.dayCaption}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {t.title}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed italic">
            {t.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                live
                  ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40"
                  : locked
                    ? "bg-slate-800 text-gray-400 border border-slate-700"
                    : "bg-amber-900/30 text-amber-200 border border-amber-700/40"
              }`}
            >
              {live ? "Live now — free for 24h" : locked ? "Locked — All-Access Pass" : "Scheduled"}
            </span>
            <span className="text-xs text-gray-400 font-mono">{t.duration}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">{t.speaker} — {t.speakerRole}</span>
          </div>
          <p className="text-xs text-gray-400 font-mono">
            {scheduled
              ? `Airs ${new Date(t.airAt).toUTCString()}`
              : live
                ? `Free window closes ${closesAt.toUTCString()}`
                : `Aired ${new Date(t.airAt).toUTCString()}`}
          </p>
        </header>

        {/* Player slot — synthetic-narrated Remotion render */}
        <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
          {scheduled && (
            <>
              <p className="text-amber-200 text-sm font-semibold">
                Talk airs {new Date(t.airAt).toUTCString()}.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Reserve your free pass and we'll email you when this talk
                unlocks.
              </p>
              <Link
                href="/summit#register"
                className="inline-block rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2.5 transition-colors"
              >
                Reserve Free Pass →
              </Link>
            </>
          )}
          {live && (
            <>
              <p className="text-emerald-300 text-sm font-semibold">
                Live now — free for the next {t.freeWindowHours} hours.
              </p>
              <div className="aspect-video rounded-lg border border-slate-700 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center px-6 py-10 space-y-2">
                  <p className="text-gray-300 text-sm font-medium">
                    Synthetic narration · Remotion-rendered slides
                  </p>
                  <p className="text-gray-400 text-xs">
                    Player loads from /state-of-github pipeline at air-time.
                    Until then, the full transcript below is the authoritative
                    record.
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Window closes {closesAt.toUTCString()}.
              </p>
            </>
          )}
          {locked && (
            <>
              <p className="text-gray-300 text-sm font-semibold">
                The free window for this talk has closed.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Get the All-Access Pass for lifetime replays of every talk,
                full transcripts (PDF + markdown), slide decks, and the
                219-startup backtest CSV.
              </p>
              <Link
                href="/summit/all-access"
                className="inline-block rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-5 py-2.5 transition-colors"
              >
                Get All-Access Pass — €{SUMMIT.allAccessPrice} →
              </Link>
            </>
          )}
        </section>

        {/* Abstract + takeaways */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-100">Abstract</h2>
          <p className="text-gray-200 leading-relaxed">{t.abstract}</p>
          <h3 className="text-sm text-gray-400 font-semibold uppercase tracking-wider mt-6">
            Takeaways
          </h3>
          <ul className="space-y-2">
            {t.takeaways.map((k) => (
              <li key={k} className="flex items-start gap-3">
                <span className="text-emerald-400 shrink-0 mt-1">✓</span>
                <span className="text-sm text-gray-200 leading-relaxed">{k}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Notes / transcript */}
        <article className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-100">Talk notes</h2>
          {t.notes.map((p, i) => (
            <p key={i} className="text-gray-300 leading-relaxed">{p}</p>
          ))}
        </article>

        {/* Related */}
        {t.relatedRoutes.length > 0 && (
          <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
              Cited in this talk
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm">
              {t.relatedRoutes.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="block rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900/60 hover:border-slate-700 px-4 py-3 text-sky-300 hover:text-sky-200 transition-colors"
                  >
                    {r.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Prev / Next */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-800 pt-6">
          {prev ? (
            <Link
              href={`/summit/${prev.slug}`}
              className="rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700 p-4 transition-colors"
            >
              <p className="text-xs text-gray-400 mb-1">← Previous talk</p>
              <p className="text-sky-300 font-medium leading-snug text-sm">{prev.title}</p>
            </Link>
          ) : <div />}
          {next ? (
            <Link
              href={`/summit/${next.slug}`}
              className="rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700 p-4 transition-colors text-right"
            >
              <p className="text-xs text-gray-400 mb-1">Next talk →</p>
              <p className="text-sky-300 font-medium leading-snug text-sm">{next.title}</p>
            </Link>
          ) : <div />}
        </nav>

        {/* Trail */}
        <p className="text-xs text-gray-400 text-center pt-2">
          Back to{" "}
          <Link href="/summit" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
            the summit schedule
          </Link>{" "}or get the{" "}
          <Link href="/summit/all-access" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
            All-Access Pass
          </Link>
          .
        </p>

        <DataNerdSignoff variant="compact" className="mt-8" />
      </div>
    </>
  );
}
