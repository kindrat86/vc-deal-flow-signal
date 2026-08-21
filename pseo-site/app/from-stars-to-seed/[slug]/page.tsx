import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  starsCases,
  getStarsCaseBySlug,
  type StarsCase,
} from "@/content/from-stars-to-seed";
import { getDataLastModified } from "@/lib/data";
import { AgentSummary } from "@/components/AgentSummary";
import RelatedLinks from "@/components/RelatedLinks";
import { getRelatedGroups } from "@/lib/related-links";
import { HreflangLinks } from "@/components/HreflangLinks";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE = "https://signals.gitdealflow.com";

export async function generateStaticParams() {
  return starsCases.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

function clampDescription(text: string, max = 155) {
  return text.length > max ? `${text.slice(0, max - 3).trimEnd()}...` : text;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getStarsCaseBySlug(slug);
  if (!c) return {};

  const url = `${SITE}/from-stars-to-seed/${slug}`;
  const description = clampDescription(c.tagline);
  return {
    // absolute: headlines already carry the funding-figure hook ("$3.25B
    // Series E") and run 43-70ch; the 22ch template suffix truncated them.
    title: { absolute: c.headline },
    description,
    keywords: c.keywords.join(", "),
    alternates: { canonical: `/from-stars-to-seed/${slug}` },
    openGraph: {
      title: c.headline,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: c.headline,
      description,
    },
  };
}

function buildJsonLd(c: StarsCase): object {
  const url = `${SITE}/from-stars-to-seed/${c.slug}`;
  const lastModifiedIso = getDataLastModified().toISOString();
  return {
    "@context": "https://schema.org",
    "@graph": [
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
            item: `${SITE}/from-stars-to-seed`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: c.company,
            item: url,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        url,
        headline: c.headline,
        description: c.tagline,
        inLanguage: "en-US",
        datePublished: lastModifiedIso,
        dateModified: lastModifiedIso,
        license: "https://creativecommons.org/licenses/by/4.0/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [
            "h1",
            "[data-speakable]",
            "[data-agent-summary]",
            ".speakable",
          ],
        },
        about: {
          "@type": "Organization",
          name: c.company,
          sameAs: [`https://github.com/${c.primaryRepo.split("/")[0]}`],
        },
        mentions: c.repos.map((r) => ({
          "@type": "SoftwareSourceCode",
          name: r,
          codeRepository: `https://github.com/${r}`,
          programmingLanguage: "TypeScript / Python / Rust / Go (multi-language repo)",
        })),
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: c.headline,
        description: c.tagline,
        inLanguage: "en-US",
        datePublished: lastModifiedIso,
        dateModified: lastModifiedIso,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE}/opengraph-image`,
        },
      },
    ],
  };
}

export default async function FromStarsToSeedPage({ params }: PageProps) {
  const { slug } = await params;
  const c = getStarsCaseBySlug(slug);
  if (!c) notFound();

  const lastModified = getDataLastModified();
  const asOf = lastModified.toISOString().slice(0, 10);
  const url = `${SITE}/from-stars-to-seed/${c.slug}`;
  const jsonLd = buildJsonLd(c);

  return (
    <>
      <HreflangLinks
        canonical={url}
        languages={{
          en: url,
          "en-US": url,
          "x-default": url,
        }}
      />
      <AgentMirrorLinks path={`/from-stars-to-seed/${c.slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/from-stars-to-seed"
            className="hover:text-gray-300 transition-colors"
          >
            From Stars to Seed
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{c.company}</span>
        </nav>

        <header className="mb-8">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
            Case study · GitHub signal → priced round
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight"
            data-speakable
          >
            {c.headline}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">{c.tagline}</p>
        </header>

        <AgentSummary
          tldr={c.tldr}
          pageUrl={url}
          asOf={asOf}
          citeAs={`VC Deal Flow Signal, From Stars to Seed (${url}), retrieved ${asOf}.`}
          facts={c.citations}
        />

        <section
          className="mb-10 rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6"
          aria-label="At a glance"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">
            At a glance
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide">
                Company
              </dt>
              <dd className="text-gray-100">{c.company}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide">
                Sector
              </dt>
              <dd className="text-gray-100">{c.sector}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide">
                Primary repo
              </dt>
              <dd>
                <Link
                  href={`https://github.com/${c.primaryRepo}`}
                  className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
                >
                  github.com/{c.primaryRepo}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide">
                Trigger window
              </dt>
              <dd className="text-gray-100">{c.triggerWindow}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide">
                Stars at trigger
              </dt>
              <dd className="text-gray-100">{c.starsAtTrigger}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide">
                Announced raise
              </dt>
              <dd className="text-gray-100">
                {c.raise} <span className="text-gray-500">({c.raiseDate})</span>
              </dd>
            </div>
            {c.leadInvestor && (
              <div>
                <dt className="text-gray-400 text-xs uppercase tracking-wide">
                  Lead investor
                </dt>
                <dd className="text-gray-100">{c.leadInvestor}</dd>
              </div>
            )}
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wide">
                Time-to-money read
              </dt>
              <dd className="text-gray-100">{c.timeToMoney}</dd>
            </div>
          </dl>
        </section>

        <section
          className="mb-10 prose prose-invert prose-slate max-w-none text-gray-300 leading-relaxed"
          aria-label="Narrative"
        >
          {c.narrative.map((p, i) => (
            <p key={i} className="mb-4 text-base">
              {p}
            </p>
          ))}
        </section>

        <section
          className="mb-10 rounded-xl border border-slate-800 bg-slate-950 p-5 sm:p-6"
          aria-label="Signals"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">
            Signals that would have flagged this pre-raise
          </h2>
          <ul className="space-y-2 text-sm">
            {c.signals.map((s, i) => (
              <li
                key={i}
                className="flex flex-col sm:flex-row sm:items-baseline gap-x-2"
              >
                <span className="text-gray-100 font-semibold">{s.label}:</span>
                <span className="text-gray-300">{s.value}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="mb-10 rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6"
          aria-label="How the timeline read"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">
            How the timeline read
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            The engineering acceleration was observable during{" "}
            <strong className="text-gray-100">
              {c.triggerWindow.toLowerCase()}
            </strong>
            , while any fundraising paperwork was still private. The announced
            event,{" "}
            <strong className="text-gray-100">
              {c.raise} on {c.raiseDate}
            </strong>
            , landed after the signal window: {c.timeToMoney}. That ordering is
            the entire thesis of this series: by the time a round appears in a
            funding digest, the repositories were already telling the story at{" "}
            {c.starsAtTrigger.toLowerCase()}.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            In practice, that is what a weekly monitoring cadence buys you. VC
            Deal Flow Signal re-scores this sector ({c.sector}) every week
            across{" "}
            {c.repos.length > 1
              ? `${c.repos.length} tracked repositories, so a window like this one surfaces as a compounding composite rather than a single spike you had to be lucky to catch`
              : "its tracked repository, so a window like this one surfaces as a rising trend rather than a single spike you had to be lucky to catch"}
            . The pre-raise signals listed above are the rows that moved while
            the press stayed quiet.
          </p>
        </section>

        <section
          className="mb-10 rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6"
          aria-label="Repositories"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">
            Repositories
          </h2>
          <ul className="space-y-1 text-sm">
            {c.repos.map((r) => (
              <li key={r}>
                <Link
                  href={`https://github.com/${r}`}
                  className="text-sky-400 hover:text-sky-300 underline underline-offset-2 font-mono text-xs"
                >
                  github.com/{r}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10" aria-label="Frequently asked questions">
          <h2 className="text-xl font-bold text-gray-100 mb-5">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {c.faqs.map((f, i) => (
              <details
                key={i}
                className="rounded-lg border border-slate-800 bg-slate-900/50 px-5 py-3"
              >
                <summary className="cursor-pointer font-semibold text-gray-100 text-sm">
                  {f.q}
                </summary>
                <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8 text-center">
          <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Find the next one
          </p>
          <p className="text-gray-200 text-sm mb-4">
            VC Deal Flow Signal tracks engineering acceleration weekly across
            15 sectors, the same signal shapes that preceded the raise
            above.
          </p>
          <Link
            href="/firstlook"
            className="inline-flex items-center px-6 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-medium transition-colors"
          >
            Get the weekly signal report →
          </Link>
        </section>

        {c.related.length > 0 && (
          <section className="mb-10" aria-label="Related case studies">
            <h2 className="text-base font-semibold text-gray-300 mb-4">
              Related case studies
            </h2>
            <ul className="space-y-2">
              {c.related
                .map((relSlug) => getStarsCaseBySlug(relSlug))
                .filter((r): r is StarsCase => Boolean(r))
                .map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/from-stars-to-seed/${r.slug}`}
                      className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm"
                    >
                      {r.headline}
                    </Link>
                  </li>
                ))}
            </ul>
            {(() => {
              const rels = c.related
                .map((relSlug) => getStarsCaseBySlug(relSlug))
                .filter((r): r is StarsCase => Boolean(r));
              if (rels.length === 0) return null;
              const sectors = Array.from(
                new Set(rels.map((r) => r.sector).filter(Boolean)),
              );
              return (
                <p className="text-gray-400 text-sm leading-relaxed mt-3">
                  Read them side by side: these related cases span{" "}
                  {sectors.join(", ")}, each with its own trigger window and
                  raise event, and the same pre-raise signal shape held in every
                  one. A pattern that repeats across different sectors and
                  different windows is what separates a repeatable signal from
                  an after-the-fact story.
                </p>
              );
            })()}
          </section>
        )}

        <RelatedLinks groups={getRelatedGroups(`/from-stars-to-seed/${slug}`)} heading="Related proof stories" />
      </article>
    </>
  );
}
