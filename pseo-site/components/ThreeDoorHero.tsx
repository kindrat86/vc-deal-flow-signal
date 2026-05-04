import Link from "next/link";

const DOORS = [
  {
    href: "https://gitdealflow.com/#signup",
    eyebrow: "Free email",
    title: "Get this week's signals",
    body: "5 breakout startups, ranked by GitHub momentum. Delivered every Monday.",
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
  { ring: string; bg: string; text: string; cta: string; ctaHover: string }
> = {
  sky: {
    ring: "border-sky-700/50 hover:border-sky-500",
    bg: "bg-sky-500/5",
    text: "text-sky-400",
    cta: "bg-sky-600 hover:bg-sky-500",
    ctaHover: "group-hover:bg-sky-500",
  },
  emerald: {
    ring: "border-emerald-700/50 hover:border-emerald-500",
    bg: "bg-emerald-500/5",
    text: "text-emerald-400",
    cta: "bg-emerald-700 hover:bg-emerald-600",
    ctaHover: "group-hover:bg-emerald-600",
  },
  indigo: {
    ring: "border-indigo-700/50 hover:border-indigo-500",
    bg: "bg-indigo-500/5",
    text: "text-indigo-400",
    cta: "bg-indigo-600 hover:bg-indigo-500",
    ctaHover: "group-hover:bg-indigo-500",
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
            <p className={`text-[11px] uppercase tracking-wider font-medium mb-2 ${a.text}`}>
              {door.eyebrow}
            </p>
            <h3 className="text-gray-100 font-semibold text-lg mb-2 leading-snug">
              {door.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
              {door.body}
            </p>
            <span
              className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${a.cta}`}
            >
              {door.cta} &rarr;
            </span>
          </>
        );
        const className = `group flex flex-col rounded-xl border ${a.ring} ${a.bg} p-5 transition-all`;
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
