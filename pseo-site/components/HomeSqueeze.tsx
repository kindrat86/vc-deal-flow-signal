import Link from "next/link";
import HomeSqueezeForm from "./HomeSqueezeForm";

// Brunson DotCom Secrets Ch 14 — Lead "Squeeze" Funnels.
// Russell-Brunson HSO audit 2026-05-08 scored Ch 14 at 87/100 with
// the note: "the home one isn't the most prominent — three-door hero
// gives equal weight to multiple paths, which dilutes a single
// squeeze."
//
// This component fixes that. It replaces ThreeDoorHero with a true
// Brunson lead-squeeze: one dominant CTA (the inline email form,
// border-2 + shadow + brighter accent), and two small tertiary
// "exit" links below in muted styling. The Receipts game and the
// Predict game are still discoverable, but the visual hierarchy
// makes the email capture the obvious primary action.
//
// Why a server component shell: the headline + tertiary doors are
// pure markup, no interactivity. Only HomeSqueezeForm is hydrated.
// Keeps the bundle small and the LCP fast.

const EXIT_DOORS = [
  {
    href: "/receipts",
    eyebrow: "Free game · 30 seconds",
    title: "Score your taste",
    body: "Paste your GitHub username. We'll show every unicorn you starred before the news broke.",
  },
  {
    href: "/predict",
    eyebrow: "Free game",
    title: "Predict the next breakout",
    body: "Pick any GitHub org. Get a 1–99% breakout score. Compete on the public leaderboard.",
  },
] as const;

export default function HomeSqueeze() {
  return (
    <section
      aria-label="Get the free Sunday digest"
      className="space-y-6"
    >
      {/* Single-CTA squeeze — the dominant action. Headline above
          the form to anchor the value before the user reads inputs. */}
      <div className="space-y-3">
        <p className="text-sky-300 text-[11px] uppercase tracking-[0.18em] font-semibold">
          Acceleration Watch · Free forever · One email a week
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight tracking-tight">
          5 breakout startups, every Sunday —{" "}
          <span className="text-sky-400">47 days</span> before the deck
          arrives.
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
          You reach out while the round is still 47 days away — not after
          the deck is circulating. It&rsquo;s the same engineering signal
          that preceded 219 startup-period observations in our SSRN-published
          panel. Two boxes, twenty seconds, free forever.
        </p>
      </div>

      <HomeSqueezeForm />

      {/* Tertiary exits — visibly subordinate. Smaller type, no color
          accents, single-line cards. The visitor who's not ready for
          email still has somewhere to go, but the gravity is the form. */}
      <div className="pt-2">
        <p className="text-gray-500 text-[11px] uppercase tracking-[0.14em] font-semibold mb-3">
          Or peek first — no email required
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXIT_DOORS.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className="group flex flex-col rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/40 px-4 py-3 transition-colors"
            >
              <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                {door.eyebrow}
              </p>
              <p className="text-gray-300 group-hover:text-gray-100 text-sm font-medium leading-snug mb-1 transition-colors">
                {door.title}{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                {door.body}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
