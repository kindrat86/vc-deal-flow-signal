import Link from "next/link";

/**
 * ThreeCoreStoriesNav — Brunson Expert Secrets Ch 9 (The Three Core Stories).
 *
 * Russell teaches that every persuasive funnel rests on three stories that
 * have to cross-link narratively (not as generic footer chrome):
 *   • Origin — where the founder came from
 *   • Vehicle — how the mechanism actually closes a deal (long form on
 *     /walkthrough, formula form on /mechanism)
 *   • Identity — who the buyer becomes if the vehicle works
 *
 * Audit 2026-05-09 (Expert Ch 9 push 94→100): the four story pages
 * already exist (/origin, /walkthrough, /mechanism, /identity) but the
 * transitions between them were generic "more reading" footers. The
 * Brunson rule: a reader on /origin should hit a CTA "now read the
 * vehicle that came out of this story" — story-aware, not chrome.
 *
 * This component replaces the generic footers with narrative transition
 * cards. Pass `current` to identify which story page is rendering it; the
 * component returns the OTHER two stories with copy that bridges them.
 *
 * Server Component. No state, no effects, no client bundle cost.
 */

type Story = "origin" | "vehicle-walkthrough" | "vehicle-mechanism" | "identity";

interface Props {
  /** Which of the four story surfaces is rendering this nav. */
  current: Story;
  /** Extra classes for the section wrapper. */
  className?: string;
}

interface StoryCard {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  tone: "amber" | "sky" | "violet" | "emerald";
}

const ORIGIN: StoryCard = {
  href: "/origin",
  eyebrow: "The Origin",
  title: "Where the story started.",
  body: "Ten years writing warm-intro angel cheques, the wall moment in late 2024, the three false beliefs that collapsed in a single weekend.",
  tone: "amber",
};

const VEHICLE_WALKTHROUGH: StoryCard = {
  href: "/walkthrough",
  eyebrow: "The Vehicle · long form",
  title: "How the mechanism actually closes a deal.",
  body: "Hook → core claim → three objections → stack → four closes. The full 12-minute walkthrough every other page condenses.",
  tone: "sky",
};

const VEHICLE_MECHANISM: StoryCard = {
  href: "/mechanism",
  eyebrow: "The Vehicle · engine",
  title: "The named mechanism in formula form.",
  body: "Commit-Velocity Acceleration Engine: formula, falsifiability, sophistication ladder. Why we publish the regression instead of gating it.",
  tone: "emerald",
};

const IDENTITY: StoryCard = {
  href: "/identity",
  eyebrow: "The Identity",
  title: "Who you become if the vehicle works.",
  body: "Seven before/after shifts. From warm-intro-reliant analyst to the First Mover who gets the engineering signal — translated into plain English, 21–47 days before the deck circulates. No code-reading required.",
  tone: "violet",
};

const TONE_CLASSES: Record<
  StoryCard["tone"],
  { border: string; gradient: string; eyebrow: string; cta: string }
> = {
  amber: {
    border: "border-amber-700/40 hover:border-amber-500",
    gradient:
      "from-amber-950/30 via-slate-900 to-slate-950 hover:shadow-amber-500/15",
    eyebrow: "text-amber-300",
    cta: "text-amber-300",
  },
  sky: {
    border: "border-sky-700/40 hover:border-sky-500",
    gradient:
      "from-sky-950/30 via-slate-900 to-slate-950 hover:shadow-sky-500/15",
    eyebrow: "text-sky-300",
    cta: "text-sky-300",
  },
  violet: {
    border: "border-violet-700/40 hover:border-violet-500",
    gradient:
      "from-violet-950/30 via-slate-900 to-slate-950 hover:shadow-violet-500/15",
    eyebrow: "text-violet-300",
    cta: "text-violet-300",
  },
  emerald: {
    border: "border-emerald-700/40 hover:border-emerald-500",
    gradient:
      "from-emerald-950/30 via-slate-900 to-slate-950 hover:shadow-emerald-500/15",
    eyebrow: "text-emerald-300",
    cta: "text-emerald-300",
  },
};

interface Transition {
  eyebrow: string;
  headline: string;
  lede: string;
  cards: readonly StoryCard[];
  /** Optional "or also read" pointer — surfaces the third story when the
   * primary two cards already cover Origin + one Vehicle facet. */
  also?: { label: string; href: string };
}

function getTransition(current: Story): Transition {
  switch (current) {
    case "origin":
      return {
        eyebrow: "Read the next Core Story",
        headline:
          "You read where the story started. Now read what it produced — and who it makes you become.",
        lede:
          "Three Core Stories rule: the origin only matters if it leads to a vehicle and an identity. The other two stories live one click away.",
        cards: [VEHICLE_WALKTHROUGH, IDENTITY],
        also: {
          label:
            "Or read the same engine in formula form on /mechanism",
          href: "/mechanism",
        },
      };
    case "vehicle-walkthrough":
      return {
        eyebrow: "Read the next Core Story",
        headline:
          "You read how the vehicle closes. Now read where it came from — and who it makes you become.",
        lede:
          "The vehicle is the middle story. The origin is why it exists. The identity is what changes if it works for you.",
        cards: [ORIGIN, IDENTITY],
        also: {
          label:
            "Or read the engine in formula form on /mechanism",
          href: "/mechanism",
        },
      };
    case "vehicle-mechanism":
      return {
        eyebrow: "Read the next Core Story",
        headline:
          "You read the mechanism. Now read the story it came out of — and who it makes you become.",
        lede:
          "The mechanism is the engine. The origin is why we built it. The identity is what shifts the day you let it work for you.",
        cards: [ORIGIN, IDENTITY],
        also: {
          label:
            "Or read the same engine as a 12-minute walkthrough on /walkthrough",
          href: "/walkthrough",
        },
      };
    case "identity":
      return {
        eyebrow: "Read the next Core Story",
        headline:
          "You read who you'd become. Now read where the story started — and how the vehicle actually works.",
        lede:
          "Identity without a vehicle is a poster. The origin is why this exists. The vehicle is the proof it works.",
        cards: [ORIGIN, VEHICLE_WALKTHROUGH],
        also: {
          label:
            "Or read the engine in formula form on /mechanism",
          href: "/mechanism",
        },
      };
  }
}

export default function ThreeCoreStoriesNav({
  current,
  className = "",
}: Props) {
  const t = getTransition(current);

  return (
    <section
      aria-label="The Three Core Stories — read the next one"
      className={`my-12 border-t border-slate-800 pt-10 space-y-6 ${className}`}
    >
      <header className="space-y-2">
        <p className="text-slate-400 text-[11px] uppercase tracking-[0.18em] font-semibold">
          {t.eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug tracking-tight">
          {t.headline}
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
          {t.lede}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {t.cards.map((c) => {
          const tone = TONE_CLASSES[c.tone];
          return (
            <Link
              key={c.href}
              href={c.href}
              className={`group flex flex-col rounded-xl border ${tone.border} bg-gradient-to-br ${tone.gradient} hover:shadow-lg p-6 transition-all hover:-translate-y-0.5`}
            >
              <p
                className={`${tone.eyebrow} text-[11px] uppercase tracking-wider font-semibold mb-2`}
              >
                {c.eyebrow}
              </p>
              <h3 className="text-gray-100 font-bold text-xl mb-2 leading-snug">
                {c.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">
                {c.body}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 ${tone.cta} text-sm font-semibold`}
              >
                Read it now{" "}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {t.also && (
        <p className="text-gray-500 text-xs leading-relaxed pt-1">
          →{" "}
          <Link
            href={t.also.href}
            className="text-gray-300 hover:text-gray-100 underline decoration-dotted"
          >
            {t.also.label}
          </Link>
        </p>
      )}
    </section>
  );
}
