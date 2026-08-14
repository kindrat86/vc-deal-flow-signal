import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { getDataLastModified } from "@/lib/data";
import {
  SOLO_FOUNDER_SECTORS,
  getDefaultSoloFounderThresholds,
} from "@/content/solo-founder-tracker";

export const dynamic = "force-static";
export const revalidate = 604800;

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title:
    "Solo-Founder Tracker — one-person companies hitting commit / star / contributor thresholds, by sector",
  description:
    "15 sector pages indexing the 'one-person unicorn' pattern on GitHub. Commit-velocity, star-growth, and contributor-concentration thresholds that solo-founder companies share. Distinct from /predicted: this surface answers 'where are the one-engineer companies emerging right now?', not 'who's the next round'.",
  alternates: { canonical: "/solo-founder-tracker" },
  openGraph: {
    title:
      "Solo-Founder Tracker — one-person companies hitting commit / star / contributor thresholds",
    description:
      "15 sectors. Threshold-driven framework for spotting one-engineer companies on GitHub before they hire. Distinct from the all-stage /predicted feed — this is the solo-founder lens.",
    url: `${SITE}/solo-founder-tracker`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Solo-Founder Tracker — the 'one-person unicorn' lens, indexed by sector",
    description:
      "15 sector pages. Commit/star/contributor thresholds for spotting one-engineer companies on GitHub before they hire.",
  },
};

export default function SoloFounderTrackerIndexPage() {
  const lastModifiedIso = getDataLastModified().toISOString();
  const url = `${SITE}/solo-founder-tracker`;
  const defaultThresholds = getDefaultSoloFounderThresholds();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Solo-Founder Tracker",
            item: url,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: "Solo-Founder Tracker — by sector",
        description:
          "15 sector pages indexing the 'one-person unicorn' pattern on GitHub. Threshold-driven framework for spotting one-engineer companies before they hire.",
        inLanguage: "en-US",
        datePublished: lastModifiedIso,
        dateModified: lastModifiedIso,
        license: "https://creativecommons.org/licenses/by/4.0/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]", "[data-agent-summary]"],
        },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE}/opengraph-image`,
        },
        hasPart: SOLO_FOUNDER_SECTORS.map((s) => ({
          "@type": "WebPage",
          url: `${SITE}/solo-founder-tracker/${s.slug}`,
          name: `Solo-Founder Tracker — ${s.name}`,
          description: s.tagline,
        })),
      },
      {
        "@type": "ItemList",
        name: "Solo-Founder Tracker — per-sector pages",
        numberOfItems: SOLO_FOUNDER_SECTORS.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: SOLO_FOUNDER_SECTORS.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${s.name} — Solo-Founder Tracker`,
          url: `${SITE}/solo-founder-tracker/${s.slug}`,
        })),
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${url}#thresholds`,
        name: "Solo-Founder Default Thresholds",
        description:
          "Default thresholds used to identify one-engineer companies on GitHub. Per-sector pages override these where the underlying revenue or distribution shape differs.",
        hasDefinedTerm: [
          {
            "@type": "DefinedTerm",
            name: "Stars (floor)",
            description: `${defaultThresholds.stars} stars on the breakout repo.`,
          },
          {
            "@type": "DefinedTerm",
            name: "Commits (rolling 90 days)",
            description: `${defaultThresholds.commits90d} default-branch commits in the rolling 90-day window.`,
          },
          {
            "@type": "DefinedTerm",
            name: "Maximum distinct contributors",
            description: `≤${defaultThresholds.maxContributors} distinct human committers (bots and Dependabot-class accounts excluded).`,
          },
          {
            "@type": "DefinedTerm",
            name: "Top-contributor share",
            description: `≥${Math.round(defaultThresholds.topContributorShare * 100)}% of commits attributable to the top contributor over the ${defaultThresholds.concentrationWindow}.`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={url}
        languages={getHreflangLanguages("/solo-founder-tracker")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/solo-founder-tracker" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Solo-Founder Tracker</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            15 sectors · One-engineer companies · Threshold-driven
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            The{" "}
            <span className="text-sky-400">one-person unicorn</span> lens,
            indexed by sector.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            One engineer. One repo. One revenue curve. The Solo-Founder Tracker
            indexes the GitHub shape of one-person companies — the commit
            cadence, the star trajectory, the contributor-concentration
            window — across 15 sectors. Distinct from{" "}
            <Link
              href="/predicted"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /predicted
            </Link>{" "}
            (all-stage, all-org-shape) and{" "}
            <Link
              href="/startups-to-watch"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /startups-to-watch
            </Link>{" "}
            (sector ranking): this surface answers a narrower question —{" "}
            <em>where are the one-engineer companies emerging right now, and
            what shape does that acceleration take?</em>
          </p>
        </header>

        <section
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-3"
          aria-label="Default thresholds"
          data-agent-summary
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            Default thresholds (per-sector overrides on each page)
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            What makes a repo &ldquo;solo-founder&rdquo; on this site
          </h2>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <dt className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Stars (floor)
              </dt>
              <dd className="text-gray-100 text-base font-bold tabular-nums">
                ≥ {defaultThresholds.stars}
              </dd>
              <dd className="text-gray-400 text-xs leading-snug">
                On the breakout repo.
              </dd>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <dt className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Commits (rolling 90d)
              </dt>
              <dd className="text-gray-100 text-base font-bold tabular-nums">
                ≥ {defaultThresholds.commits90d}
              </dd>
              <dd className="text-gray-400 text-xs leading-snug">
                Default branch, post-squash normalisation.
              </dd>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <dt className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Distinct contributors
              </dt>
              <dd className="text-gray-100 text-base font-bold tabular-nums">
                ≤ {defaultThresholds.maxContributors}
              </dd>
              <dd className="text-gray-400 text-xs leading-snug">
                Humans only — bots excluded.
              </dd>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <dt className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Top-contributor share
              </dt>
              <dd className="text-gray-100 text-base font-bold tabular-nums">
                ≥ {Math.round(defaultThresholds.topContributorShare * 100)}%
              </dd>
              <dd className="text-gray-400 text-xs leading-snug">
                Of commits, {defaultThresholds.concentrationWindow}.
              </dd>
            </div>
          </dl>
          <p className="text-gray-400 text-sm leading-relaxed">
            Per-sector pages override these — fintech and healthcare run lower
            star floors because their distribution is private; AI/ML and
            developer tools run higher floors because the customer is also the
            GitHub audience.
          </p>
        </section>

        <section
          className="grid gap-4 sm:grid-cols-2"
          aria-label="Solo-founder tracker sectors"
        >
          {SOLO_FOUNDER_SECTORS.map((s) => (
            <Link
              key={s.slug}
              href={`/solo-founder-tracker/${s.slug}`}
              className="block rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-sky-700/50 transition-colors p-5 space-y-2 group"
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                  /solo-founder-tracker/{s.slug}
                </p>
                <span className="text-[10px] text-slate-500 tabular-nums">
                  ≥{s.thresholds.stars}★ · ≥{s.thresholds.commits90d} commits
                  · ≤{s.thresholds.maxContributors} contrib
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-100 leading-snug group-hover:text-sky-200 transition-colors">
                {s.name}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {s.tagline}
              </p>
              <p className="text-sky-400 text-xs font-semibold pt-1 group-hover:text-sky-300">
                Open the sector tracker →
              </p>
            </Link>
          ))}
        </section>

        <section
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="How this differs from the other surfaces"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            How this differs from /predicted and /startups-to-watch
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Three surfaces, three questions.
          </h2>
          <ul className="text-gray-300 text-base leading-relaxed space-y-2 list-disc pl-5">
            <li>
              <strong className="text-gray-100">/predicted</strong> — the
              all-stage weekly bet. Ten orgs every Monday across every
              org-shape, graded against fundraise news at 60 and 90 days.
            </li>
            <li>
              <strong className="text-gray-100">/startups-to-watch</strong> —
              the ranked sector list. Filters the panel by sector + period and
              ranks by acceleration; agnostic to team size.
            </li>
            <li>
              <strong className="text-gray-100">
                /solo-founder-tracker (this page)
              </strong>{" "}
              — the one-engineer lens. Per-sector editorial on the shape of
              one-person companies + threshold definitions a sourcer can
              memorise.
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/predicted"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Live weekly bets →
            </Link>
            <Link
              href="/startups-to-watch"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Ranked by sector →
            </Link>
            <Link
              href="/firstlook"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Dashboard access →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Refreshed 2026-05-22. Sector entries reviewed monthly. Anonymity rule
          preserved: we describe the pattern, not the founders. Live data lives
          at{" "}
          <Link
            href="/predicted"
            className="text-sky-300 underline decoration-dotted"
          >
            /predicted
          </Link>{" "}
          and{" "}
          <Link
            href="/startups-to-watch"
            className="text-sky-300 underline decoration-dotted"
          >
            /startups-to-watch
          </Link>
          .
        </p>
      </div>
    </>
  );
}
