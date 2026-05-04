import Link from "next/link";
import type { TopMover } from "@/lib/data";

interface SignalLeaderProps {
  movers: TopMover[];
  periodSlug: string;
  asOf: string;
}

function deltaTone(pct: number) {
  if (pct >= 100) return { ring: "border-emerald-500/40", text: "text-emerald-400", bg: "bg-emerald-500/10" };
  if (pct >= 25) return { ring: "border-emerald-700/40", text: "text-emerald-400", bg: "bg-emerald-500/5" };
  if (pct > 0) return { ring: "border-sky-700/40", text: "text-sky-400", bg: "bg-sky-500/5" };
  return { ring: "border-slate-700", text: "text-gray-400", bg: "bg-slate-800/40" };
}

export default function SignalLeader({ movers, periodSlug, asOf }: SignalLeaderProps) {
  if (movers.length === 0) return null;
  const lead = movers[0];
  const rest = movers.slice(1);

  const leadTone = deltaTone(lead.velocityChangePct);

  return (
    <section
      aria-label="This week's top movers"
      className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          This week's top movers
        </p>
        <p className="text-[11px] text-gray-500">As of {asOf}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lead card — 2 columns wide on desktop */}
        <Link
          href={`/startups-to-watch/${lead.sectorSlug}-${periodSlug}`}
          className={`lg:col-span-2 group rounded-lg border ${leadTone.ring} ${leadTone.bg} p-5 hover:bg-slate-800/40 transition-all`}
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-[11px] text-gray-500 mb-1">{lead.sectorName}</p>
              <h2 className="text-gray-100 font-bold text-2xl group-hover:text-sky-400 transition-colors">
                {lead.name}
              </h2>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-mono font-bold text-3xl ${leadTone.text}`}>
                {lead.commitVelocityChange}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">14d velocity</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
            {lead.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>{lead.commitVelocity14d} commits / 14d</span>
            <span aria-hidden="true">·</span>
            <span>{lead.contributors} contributors</span>
            <span aria-hidden="true">·</span>
            <span>{lead.signalType}</span>
            <span className="ml-auto text-sky-500 font-medium group-hover:text-sky-400">
              See sector ranking &rarr;
            </span>
          </div>
        </Link>

        {/* Runner-up cards stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {rest.map((m, idx) => {
            const tone = deltaTone(m.velocityChangePct);
            return (
              <Link
                key={m.name}
                href={`/startups-to-watch/${m.sectorSlug}-${periodSlug}`}
                className={`group rounded-lg border ${tone.ring} ${tone.bg} p-4 hover:bg-slate-800/40 transition-all`}
              >
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <p className="font-mono text-[11px] text-gray-500">
                    #{idx + 2}
                  </p>
                  <p className={`font-mono font-semibold text-base ${tone.text}`}>
                    {m.commitVelocityChange}
                  </p>
                </div>
                <h3 className="text-gray-100 font-semibold text-sm group-hover:text-sky-400 transition-colors mb-0.5 truncate">
                  {m.name}
                </h3>
                <p className="text-[11px] text-gray-500 truncate">
                  {m.sectorName}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <Link
          href="/trending"
          className="text-sky-400 hover:text-sky-300 font-medium"
        >
          See all 60+ ranked movers &rarr;
        </Link>
        <span className="text-gray-600">·</span>
        <a
          href="https://gitdealflow.com/#signup"
          className="text-emerald-400 hover:text-emerald-300 font-medium"
        >
          Get next Monday's signals by email
        </a>
      </div>
    </section>
  );
}
