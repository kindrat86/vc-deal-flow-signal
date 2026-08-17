import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  CONTINUITY_DROPS,
  FORMAT_LABELS,
  getDropBySlug,
  type ContinuityDrop,
  type DropFormat,
} from "@/content/continuity-drops";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import RelatedLinks from "@/components/RelatedLinks";
import { getRelatedGroups } from "@/lib/related-links";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";
const STRIPE_INSIDER = "https://buy.stripe.com/bJeaEWfRpcRG6gm2fC0x20d";

/**
 * /continuity/[slug], individual Insider Drop page.
 *
 * Brunson DotCom Secrets Ch 22 (Decade in a Day / Continuity). Each drop
 * is a separately-routable page with its own JSON-LD CreativeWork schema,
 * its own metadata, its own slug, and its own member-artefact CTA. Live
 * drops render the full essay + member CTA. Scheduled drops render the
 * abstract + topic + format + a "drops" calendar link.
 *
 * generateStaticParams pre-renders one route per drop in
 * /content/continuity-drops.ts so every drop is a 200 from the day it
 * lands in the registry, including scheduled drops, so the cadence
 * forward-calendar is auditable.
 *
 * Async-params signature is required for Next.js 15+, params is a
 * Promise that must be awaited.
 */

const FORMAT_BADGE_CLASSES: Record<DropFormat, string> = {
  "sector-deep-dive":
    "text-emerald-300 border-emerald-700/40 bg-emerald-950/30",
  methodology: "text-sky-300 border-sky-700/40 bg-sky-950/30",
  "founder-essay":
    "text-violet-300 border-violet-700/40 bg-violet-950/30",
  "tool-release": "text-amber-300 border-amber-700/40 bg-amber-950/30",
};

/** What each drop format actually delivers, from the continuity registry. */
const FORMAT_MEANING: Record<DropFormat, string> = {
  "sector-deep-dive":
    "a 25-page ranked sector read: top 25 orgs by composite signal, raw CSV behind it, and the pattern read for the month",
  methodology:
    "a formal methodology release: the regression or scoring change, the code that implements it, and the paper update that documents it",
  "founder-essay":
    "a 4-6K word analytical post-mortem: what the longitudinal panel taught us since the last essay, argued from the data",
  "tool-release":
    "a new tool or artefact: an MCP tool, an API endpoint, or a chart pack members can run the same day",
};

/** Rotation order, matches the cadence documented in continuity-drops.ts. */
const ROTATION: DropFormat[] = [
  "sector-deep-dive",
  "methodology",
  "founder-essay",
  "tool-release",
];

/** Display label of the format that follows this drop in the rotation. */
function nextFormatLabel(format: DropFormat): string {
  const next = ROTATION[(ROTATION.indexOf(format) + 1) % ROTATION.length];
  return FORMAT_LABELS[next];
}

type Params = Promise<{ slug: string }>;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return CONTINUITY_DROPS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const drop = getDropBySlug(slug);
  if (!drop) {
    return withEditorialOverride({ title: "Insider Drop not found" });
  }
  const url = `${SITE}/continuity/${drop.slug}`;
  return withEditorialOverride({
    title: `${drop.title}, Insider Drop #${String(drop.n).padStart(3, "0")}`,
    description: drop.abstract,
    alternates: { canonical: `/continuity/${drop.slug}` },
    openGraph: {
      title: drop.title,
      description: drop.subtitle,
      url,
      type: "article",
      publishedTime: drop.publishDate,
    },
    twitter: {
      card: "summary_large_image",
      title: drop.title,
      description: drop.subtitle,
    },
  });
}

function buildJsonLd(drop: ContinuityDrop) {
  const url = `${SITE}/continuity/${drop.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: drop.title,
        description: drop.abstract,
        url,
        datePublished: drop.publishDate,
        dateModified: drop.publishDate,
        articleSection: FORMAT_LABELS[drop.format],
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
        },
        isPartOf: {
          "@type": "Periodical",
          "@id": `${SITE}/continuity#periodical`,
          name: "Monthly Insider Drop",
        },
        isAccessibleForFree: drop.tier === "public",
        mainEntityOfPage: url,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Continuity",
            item: `${SITE}/continuity`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: drop.title,
            item: url,
          },
        ],
      },
    ],
  };
}

export default async function ContinuityDropPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const pathname = `/continuity/${slug}`;
  const drop = getDropBySlug(slug);
  if (!drop) notFound();

  const isLive = drop.status === "live";
  const dateLabel = new Date(drop.publishDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const jsonLd = buildJsonLd(drop);

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/continuity/${drop.slug}`}
        languages={getHreflangLanguages(`/continuity/${drop.slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/continuity/${drop.slug}`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/continuity" className="hover:text-gray-300">
              Continuity
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">
              Drop #{String(drop.n).padStart(3, "0")}
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-500 text-xs font-mono tabular-nums">
              Drop #{String(drop.n).padStart(3, "0")}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${FORMAT_BADGE_CLASSES[drop.format]}`}
            >
              {FORMAT_LABELS[drop.format]}
            </span>
            {isLive ? (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border text-emerald-300 border-emerald-600/50 bg-emerald-950/40">
                Live
              </span>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border text-gray-400 border-slate-700 bg-slate-900/50">
                Scheduled
              </span>
            )}
            <span className="text-gray-500 text-xs">{dateLabel}</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
            data-speakable
          >
            {drop.title}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {drop.subtitle}
          </p>
        </header>

        {drop.pullQuote && (
          <blockquote className="border-l-4 border-amber-500 pl-5 py-2 italic text-amber-200 text-base sm:text-lg leading-relaxed">
            {drop.pullQuote}
          </blockquote>
        )}

        <section
          aria-label="What this format ships"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
        >
          <h2 className="text-lg font-bold text-gray-100">
            What this drop format ships
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            This is drop #{String(drop.n).padStart(3, "0")} in the series,
            delivered as a{" "}
            <strong className="text-gray-100">
              {FORMAT_LABELS[drop.format]}
            </strong>
            : {FORMAT_MEANING[drop.format]}. The format is fixed by the
            four-month rotation, so the shape of this artefact was committed
            to before the topic was chosen; what changes month to month is
            the sector, the method, or the tool, never the delivery
            guarantee.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Access follows the tier rules: the public abstract and (after 90
            days) the full essay are free; the member artefact, the CSV, the
            code, the PDF, stays gated to Insider and above, pulled via the
            per-drop API endpoint.
          </p>
          {(() => {
            const prev = CONTINUITY_DROPS.find((d) => d.n === drop.n - 1);
            const sameFormatCount = CONTINUITY_DROPS.filter(
              (d) => d.format === drop.format,
            ).length;
            return (
              <p className="text-gray-400 text-sm leading-relaxed">
                Series context:{" "}
                {prev
                  ? `it follows drop #${String(prev.n).padStart(3, "0")} (${FORMAT_LABELS[prev.format]}, ${prev.publishDate})`
                  : "it is the inaugural drop of the series"}
                , and it is one of {sameFormatCount}{" "}
                {FORMAT_LABELS[drop.format]} drops on the published calendar.
                The essay opens to the public 90 days after the drop date;
                the artefact never does. If a drop ever slips more than 48
                hours past its announced Tuesday, every Insider member gets a
                one-month credit automatically, that promise is part of the
                cadence, not a support policy.
              </p>
            );
          })()}
        </section>

        {!isLive && (
          <section
            aria-label="Scheduled drop"
            className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 sm:p-8 space-y-3"
          >
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Scheduled, drops {dateLabel}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
              Abstract
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              {drop.abstract}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed pt-2">
              This drop is on the published forward calendar and will land on
              the first Tuesday of the month above. If it slips by more than
              48 hours, every Insider gets a one-month credit automatically -
              that&rsquo;s how serious the cadence is taken.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <Link
                href="/continuity"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
              >
                Back to the calendar
              </Link>
              <a
                href={STRIPE_INSIDER}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
              >
                Lock €197/mo Insider, get this drop the day it lands
              </a>
            </div>
          </section>
        )}

        {isLive && drop.sections && (
          <section
            aria-label="Essay"
            className="space-y-8 border-t border-slate-800 pt-8"
          >
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              The essay, public · the artefact below, members only
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              {drop.abstract}
            </p>
            {drop.sections.map((s, i) => (
              <article key={i} className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
                  {s.heading}
                </h2>
                {s.body.map((p, j) => (
                  <p
                    key={j}
                    className="text-gray-300 text-base leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </article>
            ))}
          </section>
        )}

        {isLive && drop.artefact && (
          <section
            aria-label="Member artefact"
            className="rounded-xl border border-amber-700/50 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4"
          >
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              Member-only artefact · Insider Circle (€197/mo) and above
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
              {drop.artefact.label}
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {drop.artefact.detail}
            </p>
            <p className="text-gray-400 text-xs">
              Format: {drop.artefact.size}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={STRIPE_INSIDER}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
              >
                Lock €197/mo to download <span aria-hidden="true">→</span>
              </a>
              <Link
                href="/insider"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
              >
                What else Insider includes
              </Link>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed pt-2">
              Existing members: pull via{" "}
              <code className="text-gray-300">
                GET /api/v1/insider/drops/{drop.slug}
              </code>{" "}
              with your Insider API key. Endpoint returns a signed
              download URL valid for 24 hours. Same auth model as every
              other /api/v1/insider/* route.
            </p>
          </section>
        )}

        {/* SISTER DROPS, calendar context */}
        <section
          aria-label="Sister drops"
          className="border-t border-slate-800 pt-8 space-y-3"
        >
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider">
            The cadence
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            One drop every month, first Tuesday, 09:00 UTC, on a four-format
            rotation:{" "}
            <span className="text-emerald-300">Sector Deep-Dive</span> →{" "}
            <span className="text-sky-300">Methodology</span> →{" "}
            <span className="text-violet-300">Founder Essay</span> →{" "}
            <span className="text-amber-300">Tool Release</span>.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Drop #{String(drop.n).padStart(3, "0")} of {CONTINUITY_DROPS.length}{" "}
            on the published forward calendar, landing{" "}
            {new Date(drop.publishDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
            . The format that follows this one in the rotation:{" "}
            {nextFormatLabel(drop.format)}.
          </p>
          <Link
            href="/continuity"
            className="inline-block text-sky-400 hover:text-sky-300 underline decoration-dotted text-sm pt-2"
          >
            See the full twelve-month calendar →
          </Link>
        </section>

        <footer className="border-t border-slate-800 pt-6 text-xs text-gray-500 leading-relaxed">
          <p>
            Authored by The Data Nerd. Synthetic narration only. The
            methodology is the protagonist. See{" "}
            <Link
              href="/about/founder"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              the Attractive Character canon
            </Link>{" "}
            for the rules of voice.
          </p>
        </footer>
        <RelatedLinks groups={getRelatedGroups(pathname)} heading="Related views" />
      </div>
    </>
  );
}
