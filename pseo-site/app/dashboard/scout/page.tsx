import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  pb,
  listScoutPredictions,
  monthlyLimitForTier,
  countPredictionsThisMonth,
  type Scout,
  type Prediction,
} from "@/lib/pocketbase";
import { getScoutSession } from "@/lib/scout-session";
import { makeShareIntents } from "@/lib/share-url";

interface SearchParams {
  email?: string;
  token?: string;
  gate?: string;
}

const RANK_LABEL: Record<string, string> = {
  curious: "Curious",
  scout: "Scout",
  sharp: "Sharp",
  elite: "Elite",
  oracle: "Oracle",
};

const RANK_COLOR: Record<string, string> = {
  curious: "text-emerald-400",
  scout: "text-sky-400",
  sharp: "text-purple-400",
  elite: "text-amber-400",
  oracle: "text-rose-400",
};

export const metadata: Metadata = {
  title: "Scout Dashboard — Your Predictions",
  robots: { index: false, follow: false },
  // The page receives an auth token in the URL on first visit. no-referrer
  // prevents the token from leaking to twitter.com / external links via the
  // Referer header. After first visit, an httpOnly cookie replaces URL auth.
  referrer: "no-referrer",
};

interface PbList<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
}

async function findScoutByEmail(email: string): Promise<Scout | null> {
  const list = await pb<PbList<Scout>>(`/api/collections/scouts/records`, {
    query: {
      filter: `email = ${JSON.stringify(email.toLowerCase())}`,
      perPage: 1,
    },
  });
  return list.items[0] || null;
}

export default async function ScoutDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { email: urlEmail, token, gate } = await searchParams;

  // Auth precedence:
  //   1. Existing httpOnly scout-session cookie (set on prior URL-token hit).
  //   2. URL token present → bounce to /api/dashboard/scout/auth which sets
  //      the cookie and redirects back here. This keeps the URL token out of
  //      browser history / referer / proxy logs after the first hop.
  //   3. Otherwise: gate with login message.

  const session = await getScoutSession();
  if (!session?.email) {
    if (urlEmail && token) {
      const params = new URLSearchParams({ email: urlEmail, token });
      redirect(`/api/dashboard/scout/auth?${params.toString()}`);
    }
    if (gate === "invalid") {
      return (
        <GateLogin message="That link is invalid or expired. Make a new prediction to get a fresh link." />
      );
    }
    return (
      <GateLogin message="This dashboard requires a magic link from your confirmation email. Make a prediction to get one." />
    );
  }

  const email = session.email;
  const scout = await findScoutByEmail(email).catch(() => null);
  if (!scout) {
    redirect("/predict");
  }

  const predictions = await listScoutPredictions(scout.id, 100).catch(
    () => [] as Prediction[],
  );
  const used = await countPredictionsThisMonth(scout.id).catch(() => 0);
  const limit = monthlyLimitForTier(scout.tier);
  const remaining = Math.max(0, limit - used);
  const accuracy =
    scout.correct_count + scout.wrong_count > 0
      ? Math.round(
          (1000 * scout.correct_count) /
            (scout.correct_count + scout.wrong_count),
        ) / 10
      : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">
          Private scout dashboard
        </p>
        <h1 className="text-3xl font-bold text-gray-100 mb-1">
          Welcome, @{scout.handle}
        </h1>
        <p className="text-gray-400 text-sm">
          Rank:{" "}
          <span
            className={`font-semibold uppercase tracking-wider ${RANK_COLOR[scout.rank]}`}
          >
            {RANK_LABEL[scout.rank]}
          </span>{" "}
          · Tier: <span className="font-mono">{scout.tier}</span>
          {scout.founder_scout ? (
            <span className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              🏆 Founder Scout
            </span>
          ) : null}
        </p>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Points" value={Math.round(scout.points).toString()} tone="sky" />
        <StatCard
          label="Accuracy"
          value={accuracy !== null ? `${accuracy}%` : "—"}
          tone="emerald"
        />
        <StatCard
          label="Streak"
          value={String(scout.streak)}
          tone={scout.streak >= 3 ? "amber" : "neutral"}
        />
        <StatCard
          label="This month"
          value={`${used}/${limit}`}
          tone={remaining === 0 ? "rose" : "neutral"}
        />
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        <CountCard label="Correct" value={scout.correct_count} color="text-emerald-400" />
        <CountCard label="Wrong" value={scout.wrong_count} color="text-rose-400" />
        <CountCard label="Pending" value={scout.pending_count} color="text-amber-400" />
      </section>

      {remaining === 0 && scout.tier === "free" ? (
        <section className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-center">
          <p className="text-amber-300 text-sm font-semibold mb-2">
            You&rsquo;ve used all 3 predictions this month.
          </p>
          <p className="text-gray-300 text-sm mb-4">
            Upgrade to the Dashboard plan (EUR 49/mo) for 10 predictions per
            month and access to Sharp + Elite ranks.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
          >
            Upgrade →
          </Link>
        </section>
      ) : null}

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-100">
            Your predictions ({predictions.length})
          </h2>
          {remaining > 0 ? (
            <Link
              href="/predict"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
            >
              New prediction ({remaining} left)
            </Link>
          ) : null}
        </div>
        {predictions.length === 0 ? (
          <p className="text-gray-400 italic text-sm">
            No predictions yet. Make your first call.
          </p>
        ) : (
          <div className="rounded-xl border border-slate-800 divide-y divide-slate-800 bg-slate-900/40 overflow-hidden">
            {predictions.map((p) => (
              <DashboardPredictionRow key={p.id} prediction={p} />
            ))}
          </div>
        )}
      </section>

      <ShareSection scoutHandle={scout.handle} rankLabel={RANK_LABEL[scout.rank]} />
    </div>
  );
}

function ShareSection({ scoutHandle, rankLabel }: { scoutHandle: string; rankLabel: string }) {
  const shareText = `I'm scouting pre-seed breakouts on @sipiteno's GitDealFlow. Rank: ${rankLabel}. The recipient gets a 7-day preview of the live signal index:`;
  const { shareUrl, twitterIntent } = makeShareIntents({
    sharer: scoutHandle,
    kind: "scout",
    text: shareText,
  });
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-sm font-semibold text-gray-200 mb-3 uppercase tracking-wider">
        Share your profile
      </h2>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-gray-100 font-mono text-xs"
        />
        <a
          href={twitterIntent}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition whitespace-nowrap"
        >
          Share on X
        </a>
      </div>
      <p className="text-gray-400 text-xs mt-3 leading-relaxed">
        This link unlocks a 7-day extended preview for whoever opens it. Single-use viral loop — they get a thing, you get distribution. Token expires in 7 days.
      </p>
    </section>
  );
}

function GateLogin({ message }: { message: string }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-100 mb-3">
        Scout dashboard
      </h1>
      <p className="text-gray-400 mb-6">{message}</p>
      <Link
        href="/predict"
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
      >
        Make a prediction →
      </Link>
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
  tone: "sky" | "emerald" | "amber" | "rose" | "neutral";
}) {
  const color: Record<typeof tone, string> = {
    sky: "text-sky-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
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

function CountCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 flex items-center justify-between">
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function DashboardPredictionRow({ prediction }: { prediction: Prediction }) {
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
          {predDate} ·{" "}
          <span
            className={`font-semibold uppercase ${prediction.prediction === "yes" ? "text-emerald-400" : "text-rose-400"}`}
          >
            {prediction.prediction}
          </span>{" "}
          @ {prediction.confidence}%
          {typeof prediction.points_awarded === "number"
            ? ` · ${prediction.points_awarded >= 0 ? "+" : ""}${prediction.points_awarded} pts`
            : ""}
          {prediction.rationale ? (
            <span className="block mt-1 italic text-gray-400 not-italic">
              &ldquo;{prediction.rationale}&rdquo;
            </span>
          ) : null}
        </p>
      </div>
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${s.color}`}
      >
        {s.label}
      </span>
    </div>
  );
}
