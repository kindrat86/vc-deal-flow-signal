import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSectors,
  getCurrentPeriod,
  type Startup,
} from "@/lib/data";
import { tierFromVelocityChange, type MomentumTier } from "@/lib/badge-svg";
import { slugify } from "@/lib/slugify";
import { withEditorialOverride } from "@/lib/metadata";

interface Params {
  org: string;
  repo: string;
}

const SITE = "https://signals.gitdealflow.com";

const TIER_COPY: Record<MomentumTier, { label: string; color: string; blurb: string }> = {
  cold: {
    label: "Cold",
    color: "text-slate-400",
    blurb: "Commit cadence has cooled. Either consolidating, between releases, or losing momentum.",
  },
  warming: {
    label: "Warming",
    color: "text-sky-400",
    blurb: "Steady commit volume with a slight uptick. Watch for an inflection.",
  },
  hot: {
    label: "Hot",
    color: "text-amber-400",
    blurb: "Commit velocity is materially up. Engineering is leaning in, often before press or rounds.",
  },
  breakout: {
    label: "Breakout",
    color: "text-rose-400",
    blurb: "Outlier acceleration. Sustained spike in commit cadence relative to baseline.",
  },
};

// Signal-type meaning, paraphrased from the published glossary definitions so
// each page explains its own signal in readable prose (no invented facts).
const SIGNAL_TYPE_MEANING: Record<string, string> = {
  "Infrastructure buildout":
    "The team created three or more new public repositories in a 30-day window, a pattern that is classic Series A platform expansion: the core product works and now the team is building the platform around it.",
  "Framework migration":
    "General engineering acceleration that does not fit the hiring, buildout, or deploy-spike buckets. It often marks a stack transition, moving from a prototype stack to a production one, the shift from exploration to exploitation.",
  "Engineering hiring burst":
    "Contributor growth rose above 50% in a short window, which usually means the company recently closed a round and is rapidly scaling the team.",
  "Deploy frequency spike":
    "Commit velocity is up 150% or more versus baseline, so the team is shipping at an unusually high rate, often a launch, a pivot, iteration on early customer feedback, or a response to sudden demand.",
};

// Stage context, mirroring the stage-axis descriptions in lib/data.ts.
const STAGE_CONTEXT: Record<string, string> = {
  "Pre-Seed":
    "Earliest-stage technical startups, typically before any institutional round. Engineering activity here is the clearest leading indicator because there is little press and few public breadcrumbs other than the code itself.",
  "Seed":
    "Post-angel or accelerator, pre-Series A. Engineering signals at this stage usually correlate with the first production build-out and the earliest customer-facing launches.",
  "Series A/B":
    "Growth-stage technical startups that have closed institutional rounds. Engineering signals here are less about discovery and more about validating trajectory before the next round.",
  "Growth":
    "Series C and beyond. Engineering signals at this scale indicate platform expansion, a new product line, or preparation for an IPO or a major strategic milestone.",
};

const GEO_LABEL: Record<string, string> = {
  EU: "Europe",
  US: "the United States",
  UK: "the United Kingdom",
  APAC: "Asia-Pacific",
  LATAM: "Latin America",
  Canada: "Canada",
};

function findStartupByGithubPath(orgSlash: string): Startup | null {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const target = `github.com/${orgSlash.toLowerCase()}`;
  const orgOnly = `github.com/${orgSlash.split("/")[0].toLowerCase()}`;
  for (const sector of sectors) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    for (const startup of snap.startups) {
      const url = (startup.githubUrl || "").toLowerCase();
      if (!url) continue;
      const stripped = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      if (stripped === target) return startup;
      if (stripped === orgOnly) return startup;
    }
  }
  return null;
}

const ALLOWED_SEG = /^[A-Za-z0-9._-]{1,100}$/;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { org, repo } = await params;
  if (!ALLOWED_SEG.test(org) || !ALLOWED_SEG.test(repo)) {
    return withEditorialOverride({
      title: "Repo signal, GitDealFlow",
      robots: { index: false, follow: false },
    });
  }
  const startup = findStartupByGithubPath(`${org}/${repo}`);
  const path = `${org}/${repo}`;
  if (!startup) {
    return withEditorialOverride({
      title: `${path} momentum signal, Untracked · GitDealFlow`,
      description: `${path} is not in our tracked-startup index yet. See live engineering acceleration signals on the next-best-tracked repo and predict its next round.`,
      alternates: { canonical: `/momentum/${org}/${repo}` },
      openGraph: {
        title: `${path}, engineering momentum signal`,
        description: `Live commit velocity on ${path} via GitDealFlow.`,
        url: `${SITE}/momentum/${org}/${repo}`,
        type: "website",
      },
      twitter: { card: "summary_large_image", site: "@sipiteno" },
    });
  }
  const tier = tierFromVelocityChange(startup.commitVelocityChange);
  const title = `${path}, ${TIER_COPY[tier].label} momentum (${startup.commitVelocityChange})`;
  const description = `${startup.name}: commit velocity ${startup.commitVelocity14d}/14d (${startup.commitVelocityChange}). ${startup.contributors} contributors (${startup.contributorGrowth}). Stage: ${startup.stage}.`;
  return withEditorialOverride({
    title,
    description,
    alternates: { canonical: `/momentum/${org}/${repo}` },
    openGraph: {
      title,
      description,
      url: `${SITE}/momentum/${org}/${repo}`,
      type: "website",
      images: [
        { url: `${SITE}/api/badge/momentum/${org}/${repo}/svg`, width: 240, height: 32 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@sipiteno",
      title,
      description,
    },
  });
}

export default async function MomentumPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { org, repo } = await params;
  const isValid = ALLOWED_SEG.test(org) && ALLOWED_SEG.test(repo);
  const startup = isValid ? findStartupByGithubPath(`${org}/${repo}`) : null;
  const path = `${org}/${repo}`;
  const githubUrl = `https://github.com/${org}/${repo}`;
  const tier = startup ? tierFromVelocityChange(startup.commitVelocityChange) : null;
  const tierData = tier ? TIER_COPY[tier] : null;
  const geoLabel = startup ? (GEO_LABEL[startup.geography] ?? startup.geography) : null;
  const signalMeaning = startup ? (SIGNAL_TYPE_MEANING[startup.signalType] ?? null) : null;
  const stageContext = startup ? (STAGE_CONTEXT[startup.stage] ?? null) : null;

  // 40-60 word direct answer, interpolated from the page's own data so every
  // repo reads differently while staying extractable by answer engines.
  const directAnswer = startup
    ? `${startup.name} is a ${startup.stage} startup in ${geoLabel} showing ${tierData?.label.toLowerCase()} engineering momentum: ${startup.commitVelocity14d} commits in the last 14 days (${startup.commitVelocityChange}), across ${startup.contributors} contributors, with ${startup.newRepos} new repositories. Signal type: ${startup.signalType}.`
    : `${path} is not yet in the tracked-startup index. An untracked repo has no GitDealFlow momentum tier because it does not map to a monitored startup org in the current period. Use the panel to find the closest tracked repo and predict its next round instead.`;

  const faqs = startup
    ? [
        {
          q: `What does ${tierData?.label.toLowerCase()} momentum mean for ${startup.name}?`,
          a: `${tierData?.blurb} In ${startup.name}'s case the 14-day commit velocity is ${startup.commitVelocity14d} commits, a ${startup.commitVelocityChange} change from the prior window, with ${startup.contributors} contributors and ${startup.newRepos} new repositories.`,
        },
        {
          q: `How does GitDealFlow calculate this signal?`,
          a: `GitDealFlow pulls 14-day commit volume per organization from the public GitHub REST API with the bot filter applied, computes the percentage change against the prior window, and classifies the result into one of four signal types. The full formula is published at /methodology.`,
        },
        {
          q: `Does ${startup.name} engineering acceleration predict a round?`,
          a: `Sustained engineering acceleration has historically preceded fundraise announcements by three to six weeks, but it is a leading indicator, not a guarantee. Combine this signal with the stage context (${startup.stage}) and your own sourcing thesis.`,
        },
      ]
    : [
        {
          q: `Why is ${path} untracked?`,
          a: `GitDealFlow tracks a panel of venture-backed startup orgs. ${path} does not map to a monitored org in the current period, so no momentum tier is computed.`,
        },
        {
          q: `How do I see momentum for a tracked repo?`,
          a: `Use the GitDealFlow bookmarklet on any github.com page, or browse the sector pages at / to find tracked startups and open their momentum cards.`,
        },
      ];

  const jsonLd = startup
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Dataset",
            name: `Engineering momentum signal, ${path}`,
            description: `Public GitHub commit velocity, contributor growth, and momentum tier for ${path}.`,
            url: `${SITE}/momentum/${org}/${repo}`,
            isBasedOn: { "@id": "https://signals.gitdealflow.com/dataset#dataset" },
            creator: { "@type": "Organization", name: "VC Deal Flow Signal", url: SITE },
            license: "https://creativecommons.org/licenses/by/4.0/",
            isAccessibleForFree: true,
            variableMeasured: [
              { "@type": "PropertyValue", name: "commit velocity (14d)", value: startup.commitVelocity14d },
              { "@type": "PropertyValue", name: "commit velocity change", value: startup.commitVelocityChange },
              { "@type": "PropertyValue", name: "contributors", value: startup.contributors },
              { "@type": "PropertyValue", name: "momentum tier", value: tier },
            ],
          },
          {
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ],
      }
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <header className="mb-8">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Engineering momentum signal
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-2 break-words">
          {path}
        </h1>
        <p className="text-sm text-gray-400">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-300 transition-colors"
          >
            github.com/{path} ↗
          </a>
        </p>
      </header>

      <div
        data-direct-answer
        data-speakable="definition"
        data-agent-summary
        className="mb-8 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-4 sm:px-6 sm:py-5"
      >
        <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
          Direct answer
        </p>
        <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
          {directAnswer}
        </p>
      </div>

      {startup && tierData ? (
        <>
          <section className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950 p-7 sm:p-9">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">
              Momentum tier
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 mb-4">
              <div>
                <p className={`text-5xl sm:text-6xl font-bold leading-none ${tierData.color}`}>
                  {tierData.label}
                </p>
              </div>
              <div className="pb-1 sm:pb-2">
                <p className="text-2xl sm:text-3xl font-semibold text-gray-100">
                  {startup.commitVelocityChange}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">
                  Commit velocity change
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {tierData.blurb}
            </p>
          </section>

          <section className="mb-8" aria-label="Signal metrics">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">Signal metrics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Stat label="Velocity (14d)" value={String(startup.commitVelocity14d)} />
              <Stat label="Contributors" value={String(startup.contributors)} />
              <Stat label="Contributor growth" value={startup.contributorGrowth} />
              <Stat label="New repos" value={String(startup.newRepos)} />
            </div>
          </section>

          <section className="mb-8 prose prose-invert prose-slate max-w-none text-gray-300 leading-relaxed">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">
              What this signal means
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {signalMeaning ?? tierData.blurb} {startup.name} is tracked at the{" "}
              {startup.stage} stage, which means: {stageContext ?? "no stage context available."}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Read the numbers together. {startup.commitVelocity14d} commits over 14 days is the
              raw volume; the {startup.commitVelocityChange} change tells you whether that volume
              is accelerating or cooling. {startup.contributors} contributors with{" "}
              {startup.contributorGrowth} growth shows whether the team is scaling, and{" "}
              {startup.newRepos} new repositories signals whether it is expanding its technical
              surface area. For an investor, the combination of these four metrics, not any single
              one, is what separates a real acceleration from noise.
            </p>
          </section>

          <section className="mb-8 prose prose-invert prose-slate max-w-none text-gray-300 leading-relaxed">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">
              How to act on this signal
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Three moves, in order. First, qualify: a {tierData?.label.toLowerCase()} tier
              combined with a {startup.signalType.toLowerCase()} is strongest when the 14-day
              volume is meaningful ({startup.commitVelocity14d} commits here) rather than a
              percent spike on a near-zero base. Second, time it: for a {startup.stage} startup,
              {stageContext ?? "read the stage context"} Third, record it: scout {org} on the
              prediction board so the call is dated, public, and attributable, then revisit in a
              month to see whether the acceleration held or faded.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              One caution: momentum tiers describe engineering cadence, not company quality.
              A hot repo can belong to a bad business, and a cold repo can belong to a
              profitable one. Treat this card as a source filter and a timing hint, never as
              the diligence itself.
            </p>
          </section>

          <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">Tracked as</h2>
            <p className="text-lg font-semibold text-gray-100 mb-1">{startup.name}</p>
            <p className="text-sm text-gray-400 mb-3">{startup.description}</p>
            <p className="text-xs text-gray-400">
              {startup.stage} · {startup.geography} · signal: {startup.signalType}
            </p>
            <Link
              href={`/startup/${slugify(startup.name)}`}
              className="mt-4 inline-flex items-center text-sm text-sky-300 hover:text-sky-200"
            >
              Full profile →
            </Link>
          </section>

          <section className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6">
            <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2 font-semibold">
              Make a call
            </p>
            <h2 className="text-xl font-bold text-gray-100 mb-2">
              Predict their next round
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Lock in your prediction now. Top scouts land in the weekly Top 10 email.
            </p>
            <Link
              href={`/predict?org=${encodeURIComponent(org)}&from=momentum`}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium transition"
            >
              Scout {org} →
            </Link>
          </section>

          <section className="mb-10" aria-label="Frequently asked questions">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 px-5 py-3"
                >
                  <summary className="cursor-pointer font-semibold text-gray-100 text-sm">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-gray-300 text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-7 sm:p-9">
            <h2 className="text-xl font-semibold text-gray-100 mb-1">Not yet tracked</h2>
            <p className="text-3xl font-bold text-slate-300 mb-3">Untracked</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We don&rsquo;t have a tracked-startup record matching{" "}
              <code className="text-sky-300">{path}</code> in our current period.
              Either the org isn&rsquo;t in our universe yet, or the repo path
              doesn&rsquo;t map to one we monitor.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              An untracked repo simply has no momentum tier computed against our panel. That does
              not mean the project is inactive: it means it is outside the tracked-startup universe
              for this period. Browse the sector pages or the live panel to find a comparable
              tracked org and read its signal instead.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              How the panel is built: each quarter GitDealFlow selects venture-backed startup orgs
              across 15 sectors, pulls 14-day commit volume from the public GitHub REST API with the
              bot filter applied, and publishes the acceleration deltas. If {path} later enters the
              tracked universe, this same URL will show its live momentum card automatically, no
              action needed.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              Meanwhile, three things you can still do: run the bookmarklet on any github.com page
              to read momentum wherever you browse, embed a badge in a README to watch a repo over
              time, or predict the next round from this page so your call is dated before the panel
              picks the org up.
            </p>
          </section>

          <section className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6">
            <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2 font-semibold">
              Be first to call it
            </p>
            <h2 className="text-xl font-bold text-gray-100 mb-2">
              Predict {org}&rsquo;s next round
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              No tracked momentum signal yet doesn&rsquo;t mean no opportunity.
              Lock in your prediction, first scout to call it gets credit.
            </p>
            <Link
              href={`/predict?org=${encodeURIComponent(org)}&from=momentum-untracked`}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium transition"
            >
              Make the call →
            </Link>
          </section>

          <section className="mb-10" aria-label="Frequently asked questions">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 px-5 py-3"
                >
                  <summary className="cursor-pointer font-semibold text-gray-100 text-sm">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-gray-300 text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="mb-8 rounded-xl border border-sky-500/30 bg-sky-500/5 p-5 sm:p-6">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Try it on every repo
        </p>
        <h2 className="text-xl font-bold text-gray-100 mb-2">
          Get the GitDealFlow bookmarklet
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          One drag and you can pop this card on any github.com page in one
          click. Free, zero-install, works in any browser.
        </p>
        <Link
          href="/install"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
        >
          Install the bookmarklet →
        </Link>
      </section>

      <section className="text-center">
        <p className="text-xs text-gray-400 mb-2">
          Embed this momentum tier in your own README:
        </p>
        <Link
          href={`/badge-builder?org=${encodeURIComponent(org)}&repo=${encodeURIComponent(repo)}`}
          className="text-sm text-sky-400 hover:text-sky-300"
        >
          Open badge builder →
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
        {label}
      </p>
      <p className="text-lg font-semibold text-gray-100 leading-tight break-words">
        {value}
      </p>
    </div>
  );
}
