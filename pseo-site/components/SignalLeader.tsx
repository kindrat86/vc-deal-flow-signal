import Link from "next/link";
import type { TopMover } from "@/lib/data";

interface SignalLeaderProps {
  movers: TopMover[];
  periodSlug: string;
  asOf: string;
}

function deltaTone(pct: number) {
  if (pct >= 100) return { ring: "border-[rgba(74,222,128,0.4)]", text: "text-[#4ade80]", bg: "bg-[rgba(74,222,128,0.1)]" };
  if (pct >= 25) return { ring: "border-[rgba(74,222,128,0.25)]", text: "text-[#4ade80]", bg: "bg-[rgba(74,222,128,0.05)]" };
  if (pct > 0) return { ring: "border-[rgba(14,165,233,0.25)]", text: "text-[#38bdf8]", bg: "bg-[rgba(14,165,233,0.05)]" };
  return { ring: "border-[rgba(148,163,184,0.12)]", text: "text-[#94a3b8]", bg: "bg-[rgba(148,163,184,0.03)]" };
}

export default function SignalLeader({ movers, periodSlug, asOf }: SignalLeaderProps) {
  if (movers.length === 0) return null;
  const lead = movers[0];
  const rest = movers.slice(1);

  const leadTone = deltaTone(lead.velocityChangePct);

  return (
    <section
      aria-label="This week's top movers"
      className="rounded-[14px] border border-[rgba(148,163,184,0.12)] bg-[rgba(148,163,184,0.03)] p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-[#4ade80] uppercase tracking-wider flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
          </span>
          This week's top movers
        </p>
        <p className="text-[11px] text-[#64748b]">As of {asOf}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Link
          href={`/startups-to-watch/${lead.sectorSlug}-${periodSlug}`}
          className={`lg:col-span-2 group rounded-[14px] border ${leadTone.ring} ${leadTone.bg} p-5 transition-all hover:border-[rgba(148,163,184,0.2)] hover:bg-[rgba(148,163,184,0.08)]`}
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-[11px] text-[#64748b] mb-1">{lead.sectorName}</p>
              <h2 className="text-[#f8fafc] font-bold text-2xl group-hover:text-[#38bdf8] transition-colors">
                {lead.name}
              </h2>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono font-bold text-3xl" style={{ fontFamily: "'IBM Plex Mono', monospace", color: leadTone.text.replace("text-[", "").replace("]", "") }}>
                {lead.commitVelocityChange}
              </p>
              <p className="text-[11px] text-[#64748b] mt-0.5">14d velocity</p>
            </div>
          </div>
          <p className="text-[#94a3b8] text-sm leading-relaxed line-clamp-2 mb-3">
            {lead.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748b]">
            <span>{lead.commitVelocity14d} commits / 14d</span>
            <span aria-hidden="true">·</span>
            <span>{lead.contributors} contributors</span>
            <span aria-hidden="true">·</span>
            <span>{lead.signalType}</span>
            <span className="ml-auto text-[#38bdf8] font-medium group-hover:text-[#7dd3fc]">
              See sector ranking &rarr;
            </span>
          </div>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {rest.map((m, idx) => {
            const tone = deltaTone(m.velocityChangePct);
            return (
              <Link
                key={m.name}
                href={`/startups-to-watch/${m.sectorSlug}-${periodSlug}`}
                className={`group rounded-[14px] border ${tone.ring} ${tone.bg} p-4 transition-all hover:border-[rgba(148,163,184,0.2)] hover:bg-[rgba(148,163,184,0.08)]`}
              >
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <p className="font-mono text-[11px] text-[#64748b]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    #{idx + 2}
                  </p>
                  <p className="font-mono font-semibold text-base" style={{ fontFamily: "'IBM Plex Mono', monospace", color: tone.text.replace("text-[", "").replace("]", "") }}>
                    {m.commitVelocityChange}
                  </p>
                </div>
                <h3 className="text-[#f8fafc] font-semibold text-sm group-hover:text-[#38bdf8] transition-colors mb-0.5 truncate">
                  {m.name}
                </h3>
                <p className="text-[11px] text-[#64748b] truncate">
                  {m.sectorName}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[rgba(148,163,184,0.1)] flex flex-wrap items-center gap-3 text-xs">
        <Link
          href="/trending"
          className="text-[#38bdf8] hover:text-[#7dd3fc] font-medium"
        >
          See all 60+ ranked movers &rarr;
        </Link>
        <span className="text-[#475569]">·</span>
        <a
          href="https://gitdealflow.com/#signup"
          className="text-[#4ade80] hover:text-[#86efac] font-medium"
        >
          Get next Monday's signals by email
        </a>
      </div>
    </section>
  );
}
