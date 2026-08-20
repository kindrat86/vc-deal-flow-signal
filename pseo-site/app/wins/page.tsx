import type { Metadata } from "next";
import Link from "next/link";
import validatedWins from "@/lib/validated-wins.json";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = withEditorialOverride({
  title:
    "Underwriting Receipts, Public Ledger of Validated GitHub Signals · €0",
  description:
    "Public ledger of every venture-backed startup whose GitHub engineering acceleration matched our signal pattern before the funding round, acquisition, or valuation announcement. Anonymous-founder, evidence-first track record. No testimonials, just receipts.",
  alternates: {
    canonical: "/wins",
  },
  openGraph: {
    title: "Underwriting Receipts, Public Ledger of Validated GitHub Signals",
    description:
      "Every venture-backed startup our signal pattern surfaced before the round announcement. Public ledger, post-hoc validated against funding news.",
    url: "https://signals.gitdealflow.com/wins",
    type: "website",
  },
});

interface Win {
  org: string;
  repo: string;
  name: string;
  event: string;
  event_date: string;
  weight: number;
}

const TIER_ORDER: { min: number; label: string; tone: string }[] = [
  { min: 90, label: "Tier 1, €1B+ valuation / breakout", tone: "emerald" },
  { min: 70, label: "Tier 2, Series A / B / C", tone: "sky" },
  { min: 50, label: "Tier 3, Seed / breakout adoption", tone: "indigo" },
  { min: 0, label: "Tier 4, OSS standard / mass adoption", tone: "amber" },
];

const TONE_CLASSES: Record<string, { border: string; bg: string; text: string }> = {
  emerald: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
  },
  sky: {
    border: "border-sky-500/40",
    bg: "bg-sky-500/10",
    text: "text-sky-300",
  },
  indigo: {
    border: "border-indigo-500/40",
    bg: "bg-indigo-500/10",
    text: "text-indigo-300",
  },
  amber: {
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
  },
};

function tierFor(weight: number): { label: string; tone: string } {
  for (const tier of TIER_ORDER) {
    if (weight >= tier.min) return { label: tier.label, tone: tier.tone };
  }
  return TIER_ORDER[TIER_ORDER.length - 1];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function WinsPage() {
  const wins = (validatedWins as Win[])
    .slice()
    .sort((a, b) => {
      const w = b.weight - a.weight;
      if (w !== 0) return w;
      return b.event_date.localeCompare(a.event_date);
    });

  const totalWins = wins.length;
  const tier1 = wins.filter((w) => w.weight >= 90).length;
  const tier2 = wins.filter((w) => w.weight >= 70 && w.weight < 90).length;
  const uniqueOrgs = new Set(wins.map((w) => w.org)).size;

  // Group by tier for the rendered ledger
  const grouped = TIER_ORDER.map((tier) => {
    const next = TIER_ORDER.find((t) => t.min > tier.min);
    const upperBound = next ? next.min : Infinity;
    return {
      ...tier,
      items: wins.filter((w) => w.weight >= tier.min && w.weight < upperBound),
    };
  }).filter((g) => g.items.length > 0);

  // Date range covered by the ledger (used in Dataset.temporalCoverage).
  const sortedDates = wins
    .map((w) => w.event_date)
    .filter(Boolean)
    .sort();
  const earliest = sortedDates[0] || "2020-01-01";
  const latest = sortedDates[sortedDates.length - 1] || "2026-05-05";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        "@id": "https://signals.gitdealflow.com/wins#dataset",
        name: "VC Deal Flow Signal, Validated Underwriting Receipts",
        description: `Public ledger of ${totalWins} venture-backed startups whose GitHub engineering acceleration matched the SSRN-published signal pattern (abstract id 6606558) before a documented funding event, acquisition, or breakout-adoption milestone. Sourced from public GitHub data and public funding news; CC BY 4.0.`,
        url: "https://signals.gitdealflow.com/wins",
        creator: { "@id": "https://gitdealflow.com/#organization" },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        license: "https://creativecommons.org/licenses/by/4.0/",
        isAccessibleForFree: true,
        keywords: [
          "venture capital",
          "deal flow",
          "github signals",
          "engineering acceleration",
          "fundraise prediction",
          "underwriting receipts",
        ],
        datePublished: "2026-05-05",
        dateModified: latest,
        temporalCoverage: `${earliest}/${latest}`,
        variableMeasured: [
          {
            "@type": "PropertyValue",
            name: "GitHub engineering acceleration",
            description:
              "14-day commit velocity acceleration with two-period confirmation, derived from public GitHub Archive data.",
          },
          {
            "@type": "PropertyValue",
            name: "Outcome event",
            description:
              "Public funding event, acquisition, or $1B-valuation milestone, sourced from Crunchbase, PitchBook, and public press releases.",
          },
          {
            "@type": "PropertyValue",
            name: "Outcome date",
            description: "ISO 8601 date of the public outcome announcement.",
          },
          {
            "@type": "PropertyValue",
            name: "Tier weight",
            description:
              "Outcome-magnitude weight (50/70/90/100) used to rank entries; not signal-strength.",
          },
        ],
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: "https://signals.gitdealflow.com/api/v1/dataset.jsonl",
            name: "Full dataset (NDJSON)",
          },
          {
            "@type": "DataDownload",
            encodingFormat: "text/html",
            contentUrl: "https://signals.gitdealflow.com/wins",
            name: "Public ledger (this page)",
          },
        ],
        citation: [
          "https://ssrn.com/abstract=6606558",
          "https://openalex.org/W7154916891",
        ],
        sameAs: ["https://ssrn.com/abstract=6606558"],
        recordedIn: {
          "@type": "CreativeWork",
          "@id": "https://ssrn.com/abstract=6606558",
          name: "SSRN preprint on GitHub engineering-acceleration signals as a leading indicator of venture-stage outcomes",
        },
      },
      {
        "@type": "ItemList",
        "@id": "https://signals.gitdealflow.com/wins#itemlist",
        name: "Validated underwriting receipts (sorted by event weight)",
        description: `Full validated panel, ${totalWins} entries, ${uniqueOrgs} unique orgs.`,
        numberOfItems: totalWins,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        isPartOf: { "@id": "https://signals.gitdealflow.com/wins#dataset" },
        itemListElement: wins.map((w, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${w.name}, ${w.event}`,
          url: `https://github.com/${w.repo}`,
          description: `${w.event} on ${w.event_date}. Tracked via ${w.repo}.`,
        })),
      },
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/wins#webpage",
        url: "https://signals.gitdealflow.com/wins",
        name: "Underwriting Receipts, Public Ledger of Validated GitHub Signals",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://signals.gitdealflow.com/api/og/signal-card",
        },
        mainEntity: { "@id": "https://signals.gitdealflow.com/wins#dataset" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]", "[data-agent-summary]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Underwriting Receipts",
            item: "https://signals.gitdealflow.com/wins",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/wins"
        languages={getHreflangLanguages("/wins")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/wins" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-sky-400 transition-colors">
              ← Home
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-400">Underwriting Receipts</span>
          </nav>
          <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
            Public ledger · Anonymous-founder, evidence-first
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
            data-speakable
          >
            We don&rsquo;t do testimonials. We keep{" "}
            <span className="text-emerald-400">receipts</span>.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl" data-speakable>
            Every entry below is a venture-backed startup whose public GitHub
            engineering acceleration matched the signal pattern documented in
            the SSRN-published methodology{" "}
            <em>before</em> the funding round, acquisition, or breakout
            milestone shown. No quotes. No headshots. No anonymous
            &ldquo;Investor at top fund.&rdquo; Just the org, the repo, the
            event, and the date.
          </p>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-3xl border-l-2 border-amber-700/40 pl-4">
            I don&rsquo;t run testimonials. A quote from a happy customer proves
            someone liked me; a dated, named, public event proves the signal
            fired. Trust the math, not me.
          </p>
        </header>

        {/* Stat strip */}
        <section
          aria-label="Ledger summary"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-3xl sm:text-4xl font-bold text-emerald-300 tabular-nums">
              {totalWins}
            </p>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">
              Validated receipts
            </p>
          </div>
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="text-3xl sm:text-4xl font-bold text-sky-300 tabular-nums">
              {uniqueOrgs}
            </p>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">
              Unique orgs
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-3xl sm:text-4xl font-bold text-amber-300 tabular-nums">
              {tier1}
            </p>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">
              €1B+ valuations
            </p>
          </div>
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
            <p className="text-3xl sm:text-4xl font-bold text-indigo-300 tabular-nums">
              {tier2}
            </p>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">
              Series A-C raises
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-bold text-gray-100">
            How to read this ledger
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Each row is one venture-backed startup, the GitHub repo we tracked
            it by, the public outcome event (Series A, $1B valuation,
            acquisition, etc.), and the event date. Outcomes are sourced from
            public funding news, public press releases, and Crunchbase /
            PitchBook records. No outcome is recorded without a public
            announcement that anyone can independently verify.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Tiers reflect outcome magnitude, not signal-fire date proximity.
            They are the same tiers used to score{" "}
            <Link
              href="/receipts"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              the free Scout Score tool
            </Link>{" "}
            so the validation panel here is the validation panel everyone is
            graded against.
          </p>
          <p className="text-gray-400 text-xs leading-relaxed pt-1 border-t border-slate-800">
            What this ledger is not: a claim that we predicted these
            outcomes for any specific investor at any specific time. The
            forward-looking artefact is the{" "}
            <Link
              href="/predicted"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              public Acceleration Watch
            </Link>{" "}
            which scores ten new picks every Monday and grades them post-hoc
            at 60 and 90 days.
          </p>
        </section>

        {/* Ledger groups */}
        {grouped.map((group) => {
          const tone = TONE_CLASSES[group.tone];
          return (
            <section
              key={group.label}
              aria-label={group.label}
              className="space-y-3"
            >
              <div
                className={`rounded-md px-4 py-2 inline-block border ${tone.border} ${tone.bg}`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wider ${tone.text}`}>
                  {group.label} · {group.items.length} receipt
                  {group.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <ul className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                {group.items.map((w) => {
                  const t = tierFor(w.weight);
                  const tn = TONE_CLASSES[t.tone];
                  return (
                    <li
                      key={`${w.repo}-${w.event_date}`}
                      className="flex flex-col sm:flex-row sm:items-baseline gap-y-1 sm:gap-x-4 px-4 py-3 bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-100 text-base font-medium">
                          {w.name}
                        </p>
                        <p className="text-gray-400 text-xs leading-relaxed mt-0.5 font-mono">
                          <a
                            href={`https://github.com/${w.repo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-sky-400 transition-colors"
                          >
                            github.com/{w.repo}
                          </a>
                        </p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1 shrink-0">
                        <p className={`text-sm font-medium ${tn.text}`}>
                          {w.event}
                        </p>
                        <p className="text-gray-400 text-xs tabular-nums">
                          {formatDate(w.event_date)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <DataNerdSignoff variant="long" />

        {/* CTA */}
        <section className="border-t border-slate-800 pt-10 space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">
            See the next ones before the round closes.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
            The receipts above are{" "}
            <em>backwards-looking</em>: every event is already public.
            Forward-looking signals fire every Sunday in the Insider Circle
            briefing, and Monday in the public Acceleration Watch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/predicted"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 font-semibold text-sm transition-colors"
            >
              See this week&rsquo;s public picks <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/insider"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors"
            >
              Get them 24h earlier · €197/mo
            </Link>
            <a
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Free Sunday digest
            </a>
          </div>
        </section>

        {/* Member-side companion ledger, Brunson Expert Secrets §1 Ch 4
            (Mass Movement Vehicle). The receipts on this page are
            *startup-side*; /members is *member-side*. Cross-link makes the
            pairing explicit. */}
        <section
          aria-label="Member-side ledger"
          className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            The other ledger
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            Receipts above. <span className="text-amber-400">Members below.</span>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
            The Charter Cohort is the member-side companion to this page -
            the investors reading the signals that surface the wins above.
            Public thesis. Public picks. Public scorecard. Pseudonymous
            handles welcome under the same anonymity rules as the founder.
          </p>
          <div className="pt-1">
            <Link
              href="/members"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-500/20 transition-colors"
            >
              See the Charter Cohort <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        <AgentSummary
          tldr={`Underwriting Receipts is the public ledger of ${totalWins} venture-backed startups (across ${uniqueOrgs} unique orgs) whose public GitHub engineering acceleration matched the SSRN-published signal pattern before a documented funding event, acquisition, or breakout milestone. Tier 1 (€1B+ valuations / breakouts): ${tier1} entries. Tier 2 (Series A-C): ${tier2}. The ledger is backwards-looking, every event is publicly verifiable. The forward-looking artefacts are /predicted (free, public, weekly) and /insider (€197/mo, Sunday briefings 24h before public).`}
          pageUrl="https://signals.gitdealflow.com/wins"
          asOf="2026-05-05"
          citeAs="VC Deal Flow Signal, Underwriting Receipts (signals.gitdealflow.com/wins)."
          facts={[
            {
              claim: `Validated panel size as of 2026-05-05: ${totalWins} entries across ${uniqueOrgs} unique venture-backed orgs.`,
              sourceUrl: "https://signals.gitdealflow.com/wins",
              sourceLabel: "Receipt ledger",
            },
            {
              claim:
                "All outcomes are sourced from public funding news / press releases / Crunchbase records; nothing is recorded without an independently verifiable public announcement.",
              sourceUrl: "https://signals.gitdealflow.com/methodology",
              sourceLabel: "Methodology",
            },
            {
              claim:
                "The same panel powers the free GitHub Scout Score at /receipts, taste-grading from public GitHub starring history.",
              sourceUrl: "https://signals.gitdealflow.com/receipts",
              sourceLabel: "Scout Score",
            },
          ]}
        />
      </div>
    </>
  );
}
