import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getScoutByHandle,
  listScoutPredictions,
  type Prediction,
} from "@/lib/pocketbase";
import { withEditorialOverride } from "@/lib/metadata";

interface Params {
  handle: string;
}

const RANK_COLOR: Record<string, string> = {
  curious: "text-emerald-400",
  scout: "text-sky-400",
  sharp: "text-purple-400",
  elite: "text-amber-400",
  oracle: "text-rose-400",
};

const RANK_LABEL: Record<string, string> = {
  curious: "Curious",
  scout: "Scout",
  sharp: "Sharp",
  elite: "Elite",
  oracle: "Oracle",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;
  const scout = await getScoutByHandle(handle).catch(() => null);
  if (!scout) {
    return withEditorialOverride({
      title: `Scout not found`,
      robots: { index: false, follow: false },
    });
  }
  const accuracy =
    scout.correct_count + scout.wrong_count > 0
      ? Math.round(
          (100 * scout.correct_count) /
            (scout.correct_count + scout.wrong_count),
        )
      : null;
  const title = `@${scout.handle}, ${RANK_LABEL[scout.rank]} Scout · ${Math.round(scout.points)} pts`;
  const description =
    accuracy !== null
      ? `${scout.correct_count} correct calls · ${accuracy}% accuracy · ${Math.round(scout.points)} points. Can you beat this scout?`
      : `${scout.pending_count} predictions pending. New scout, still building the track record.`;
  return withEditorialOverride({
    title,
    description,
    alternates: { canonical: `/s/${scout.handle}` },
    openGraph: {
      title,
      description,
      url: `https://signals.gitdealflow.com/s/${scout.handle}`,
      type: "profile",
      images: [
        {
          url: `https://signals.gitdealflow.com/api/og/scout/${scout.handle}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://signals.gitdealflow.com/api/og/scout/${scout.handle}`],
    },
  });
}

export default async function ScoutProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { handle } = await params;
  const scout = await getScoutByHandle(handle).catch(() => null);
  if (!scout) notFound();

  const predictions = await listScoutPredictions(scout.id, 50).catch(
    () => [] as Prediction[],
  );
  const accuracy =
    scout.correct_count + scout.wrong_count > 0
      ? Math.round(
          (1000 * scout.correct_count) /
            (scout.correct_count + scout.wrong_count),
        ) / 10
      : null;

  const shareText = `@${scout.handle} is a ${RANK_LABEL[scout.rank]} scout on gitdealflow, ${Math.round(scout.points)} pts${accuracy !== null ? ` · ${accuracy}% accuracy` : ""}. See if you can beat this call:`;
  const shareUrl = `https://signals.gitdealflow.com/s/${scout.handle}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const totalResolved = scout.correct_count + scout.wrong_count;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${shareUrl}#page`,
        url: shareUrl,
        name: `@${scout.handle}, Scout profile`,
        description: `${RANK_LABEL[scout.rank]} scout. ${Math.round(scout.points)} points${accuracy !== null ? ` · ${accuracy}% accuracy across ${totalResolved} resolved calls` : ` · ${scout.pending_count} predictions pending`}.`,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `https://signals.gitdealflow.com/api/og/scout/${scout.handle}`,
          width: 1200,
          height: 630,
        copyrightNotice: "\u00a9 VC Deal Flow Signal (GitDealFlow). Licensed under CC BY 4.0.",
        creator: { "@id": "https://signals.gitdealflow.com/about#person" },
        acquireLicensePage: "https://signals.gitdealflow.com/terms",
        },
        mainEntity: { "@id": `${shareUrl}#person` },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": `${shareUrl}#person`,
        name: `@${scout.handle}`,
        alternateName: scout.handle,
        identifier: scout.handle,
        url: shareUrl,
        knowsAbout: [
          "Startup prediction",
          "GitHub momentum",
          "Engineering acceleration",
          "Venture capital",
        ],
        award: scout.founder_scout ? "Founder Scout badge" : undefined,
      },
      {
        "@type": "Rating",
        "@id": `${shareUrl}#rating`,
        ratingValue: Math.round(scout.points),
        bestRating: 1000,
        worstRating: 0,
        ratingExplanation: `Scout points, forward-looking prediction track record. ${RANK_LABEL[scout.rank]} rank${accuracy !== null ? `, ${accuracy}% accuracy` : ""}.`,
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
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
            name: "Leaderboard",
            item: "https://signals.gitdealflow.com/leaderboard",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `@${scout.handle}`,
            item: shareUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">
              Scout profile
            </p>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
              @{scout.handle}
            </h1>
            <p className="text-lg">
              <span
                className={`font-semibold uppercase tracking-wider ${RANK_COLOR[scout.rank]}`}
              >
                {RANK_LABEL[scout.rank]}
              </span>
              {scout.founder_scout ? (
                <span className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  🏆 Founder Scout
                </span>
              ) : null}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={twitterShare}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-gray-300 transition"
            >
              Share on X
            </a>
            <a
              href={linkedinShare}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-gray-300 transition"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Points" value={Math.round(scout.points).toString()} tone="sky" />
        <StatCard
          label="Accuracy"
          value={accuracy !== null ? `${accuracy}%` : "-"}
          tone="emerald"
        />
        <StatCard
          label="Resolved"
          value={`${scout.correct_count + scout.wrong_count}`}
          tone="neutral"
        />
        <StatCard
          label="Pending"
          value={`${scout.pending_count}`}
          tone="amber"
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-100 mb-4">
          Recent predictions
        </h2>
        {predictions.length === 0 ? (
          <p className="text-gray-400 italic text-sm">
            No predictions visible yet.
          </p>
        ) : (
          <div className="rounded-xl border border-slate-800 divide-y divide-slate-800 bg-slate-900/40">
            {predictions.map((p) => (
              <PredictionRow key={p.id} prediction={p} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-sky-500/5 to-emerald-500/5 p-6 text-center">
        <h2 className="text-xl font-bold text-gray-100 mb-2">
          Think you can beat this scout?
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Free: 3 predictions per month. Paid: 10 per month. Top 1% earn an
          Oracle badge.
        </p>
        <Link
          href="/predict"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
        >
          Make your own call →
        </Link>
      </section>

      <p className="mt-6 text-center text-xs text-gray-400">
        <Link
          href={`/badge-builder?handle=${encodeURIComponent(scout.handle)}`}
          className="underline hover:text-gray-400 transition"
        >
          Embed this scout in your README →
        </Link>
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "sky" | "emerald" | "amber" | "neutral";
}) {
  const color: Record<typeof tone, string> = {
    sky: "text-sky-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    neutral: "text-gray-300",
  };
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold ${color[tone]}`}>{value}</p>
    </div>
  );
}

function PredictionRow({ prediction }: { prediction: Prediction }) {
  const statusStyle: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-slate-700 text-gray-300" },
    correct: { label: "Correct", color: "bg-emerald-500/20 text-emerald-300" },
    wrong: { label: "Wrong", color: "bg-rose-500/20 text-rose-300" },
    expired: { label: "Expired", color: "bg-slate-600 text-gray-400" },
  };
  const s = statusStyle[prediction.status] || statusStyle.pending;
  const predDate = new Date(prediction.created).toISOString().slice(0, 10);
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-3 text-sm">
      <div className="flex-1 min-w-0">
        <p className="font-mono text-gray-100 truncate">
          {prediction.github_org}
        </p>
        <p className="text-xs text-gray-400">
          {predDate} · Called{" "}
          <span
            className={`font-semibold uppercase ${prediction.prediction === "yes" ? "text-emerald-400" : "text-rose-400"}`}
          >
            {prediction.prediction}
          </span>{" "}
          @ {prediction.confidence}%
          {typeof prediction.points_awarded === "number"
            ? ` · ${prediction.points_awarded >= 0 ? "+" : ""}${prediction.points_awarded} pts`
            : ""}
        </p>
      </div>
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${s.color}`}
      >
        {s.label}
      </span>
    </div>
  );
}
