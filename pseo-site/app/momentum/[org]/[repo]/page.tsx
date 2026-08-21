import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSectors,
  getCurrentPeriod,
  type Startup,
} from "@/lib/data";
import { tierFromVelocityChange, type MomentumTier } from "@/lib/badge-svg";
import { slugify } from "@/lib/slugify";

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
    return {
      title: "Repo signal, GitDealFlow",
      robots: { index: false, follow: false },
    };
  }
  const startup = findStartupByGithubPath(`${org}/${repo}`);
  const path = `${org}/${repo}`;
  if (!startup) {
    return {
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
    };
  }
  const tier = tierFromVelocityChange(startup.commitVelocityChange);
  const title = `${path}, ${TIER_COPY[tier].label} momentum (${startup.commitVelocityChange})`;
  const description = `${startup.name}: commit velocity ${startup.commitVelocity14d}/14d (${startup.commitVelocityChange}). ${startup.contributors} contributors (${startup.contributorGrowth}). Stage: ${startup.stage}.`;
  return {
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
  };
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

  const jsonLd = startup
    ? {
        "@context": "https://schema.org",
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
