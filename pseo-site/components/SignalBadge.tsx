const SIGNAL_COLORS: Record<string, string> = {
  "Engineering hiring burst":
    "bg-sky-500/15 text-sky-300 border border-sky-500/30",
  "Infrastructure buildout":
    "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  "Framework migration":
    "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  "Deploy frequency spike":
    "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  "Deceleration":
    "bg-rose-500/15 text-rose-300 border border-rose-500/30",
};

export default function SignalBadge({ type }: { type: string }) {
  const cls =
    SIGNAL_COLORS[type] ??
    "bg-slate-700/50 text-gray-300 border border-slate-600";
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}
    >
      {type}
    </span>
  );
}
