import Link from "next/link";

const DOORS = [
  {
    href: "https://gitdealflow.com/#signup",
    eyebrow: "Acceleration Watch · Free",
    title: "The Monday email investors set their calendar to",
    body: "5 breakout startups, ranked by 14-day GitHub commit-velocity acceleration. Delivered every Monday at 09:00 UTC.",
    cta: "Subscribe free",
    accent: "sky",
    external: true,
  },
  {
    href: "/receipts",
    eyebrow: "Free, 30 seconds",
    title: "Score your taste",
    body: "Paste your GitHub username. We'll show every unicorn you starred before the news broke.",
    cta: "Get my receipts",
    accent: "emerald",
    external: false,
  },
  {
    href: "/predict",
    eyebrow: "Free game",
    title: "Predict the next breakout",
    body: "Pick any GitHub org. Get a 1–99% breakout score. Compete on the public leaderboard.",
    cta: "Play Scout",
    accent: "indigo",
    external: false,
  },
] as const;

const ACCENTS: Record<
  string,
  {
    ring: string;
    bg: string;
    text: string;
    cta: string;
    hoverShadow: string;
  }
> = {
  sky: {
    ring: "border-sky-700/50 hover:border-sky-500",
    bg: "bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950",
    text: "text-sky-300",
    cta: "bg-signal-500 hover:bg-signal-600 shadow-sm shadow-signal-500/30",
    hoverShadow: "hover:shadow-lg hover:shadow-sky-500/15",
  },
  emerald: {
    ring: "border-emerald-700/50 hover:border-emerald-500",
    bg: "bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950",
    text: "text-emerald-300",
    cta: "bg-emerald-600 hover:bg-emerald-500 shadow-sm shadow-emerald-500/30",
    hoverShadow: "hover:shadow-lg hover:shadow-emerald-500/15",
  },
  indigo: {
    ring: "border-indigo-700/50 hover:border-indigo-500",
    bg: "bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950",
    text: "text-indigo-300",
    cta: "bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-500/30",
    hoverShadow: "hover:shadow-lg hover:shadow-indigo-500/15",
  },
};

export default function ThreeDoorHero() {
  return (
    <section
      aria-label="Get started"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {DOORS.map((door) => {
        const a = ACCENTS[door.accent];
        const Inner = (
          <>
            <p
              className={`text-[11px] uppercase tracking-wider font-semibold mb-2 ${a.text}`}
            >
              {door.eyebrow}
            </p>
            <h3 className="text-gray-100 font-semibold text-lg mb-2 leading-snug tracking-tight">
              {door.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">
              {door.body}
            </p>
            <span
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-all ${a.cta}`}
            >
              {door.cta}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </>
        );
        const className = `group flex flex-col rounded-xl border ${a.ring} ${a.bg} ${a.hoverShadow} p-5 transition-all hover:-translate-y-0.5`;
        return door.external ? (
          <a key={door.href} href={door.href} className={className}>
            {Inner}
          </a>
        ) : (
          <Link key={door.href} href={door.href} className={className}>
            {Inner}
          </Link>
        );
      })}
    </section>
  );
}
