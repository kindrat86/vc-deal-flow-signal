import Link from "next/link";

/**
 * BuyerRoadmap — Brunson Expert Secrets Ch 18 (Roadmap).
 *
 * The chapter teaches: at the point of decision, give the buyer a
 * "where you are now → where this takes you" arc so the offer reads as
 * a vehicle, not a feature. The standalone /roadmap page exists but
 * lives outside the cart/apply flow — the 2026-05-09 audit scored Ch 18
 * at 88/100 with the gap "haven't seen the roadmap integrated into the
 * buyer flow."
 *
 * This component is the integration. One surface, one prop, four
 * timeline beats per tier:
 *
 *   Today (you click) → 30 days → 90 days → 1 year
 *
 * Each beat names a concrete state-change so the buyer sees the arc as
 * a calendar, not a feature list. The CTA at the bottom links back to
 * /roadmap for the full public bet.
 *
 * Usage: <BuyerRoadmap tier="dashboard" /> on any close section.
 *
 * Anonymity rule preserved: copy is voice-of-The-Data-Nerd, no
 * founder face/voice/name. Each beat is concrete and falsifiable.
 */

export type RoadmapTier =
  | "firstlook" // €7 tripwire
  | "dashboard" // €49/mo
  | "insider" // €197/mo
  | "sharp" // €497/mo, application
  | "sector-sweep"; // €1,997 one-time

export interface RoadmapBeat {
  /** Time horizon — short, calendar-readable. */
  when: string;
  /** Concrete state-change at that horizon. One sentence. */
  what: string;
  /** Optional supporting detail. One sentence. */
  why?: string;
}

const BEATS_BY_TIER: Record<RoadmapTier, readonly RoadmapBeat[]> = {
  firstlook: [
    {
      when: "Today",
      what: "Pick one sector at checkout. €7 once, no subscription.",
      why: "Your first cheque inside the system — the smallest possible test of whether the signal fits your thesis.",
    },
    {
      when: "Inside 24 hours",
      what: "The deep-dive PDF + raw CSV + three pre-Crunchbase breakouts land in your inbox.",
      why: "You read the artefact during a single working session. Cold-email math says you have 21–47 days before the deck circulates on those three names.",
    },
    {
      when: "Day 14",
      what: "If you upgrade to Dashboard, the €7 is credited 1:1 against month one.",
      why: "Two-week window so you can verify the signal on your own thesis before committing to a recurring tier.",
    },
    {
      when: "Day 90",
      what: "You either own the rhythm (Sunday digest, Wednesday filter, end-of-quarter sweep) or you have a written reason to walk.",
      why: "By 90 days you have your own scorecard. The methodology is the only durable moat — your judgement against it is the second.",
    },
  ],
  dashboard: [
    {
      when: "Today",
      what: "Lock €9.97/mo founding price. Stripe checkout, one click, founding rate locked for the lifetime of the subscription.",
      why: "Public list-price launches at €49/mo the day a regulated investor tool reviews us. The lock is a hedge against that day.",
    },
    {
      when: "Day 7",
      what: "First Sunday Acceleration Watch lands. Five names, sector-tagged, with the chart and decision rule.",
      why: "By the second Sunday you'll catch yourself opening it before opening Crunchbase. That's the rhythm forming.",
    },
    {
      when: "Day 30",
      what: "Three to five orgs from your first month's lists are in your CRM. One has booked a meeting.",
      why: "Lead-time IQR is 21–47 days. By Day 30 the first window has closed and the first conversation has opened. Your scorecard begins.",
    },
    {
      when: "Day 90 → 1 year",
      what: "Three to five sourcing wins traced back to the engine. €119.64 a year vs the expected value of one missed name at a €5K cheque (€40K).",
      why: "The math of the Money Close is calendar-able. By twelve months you either renewed once at the same locked rate or churned with an honest reason — both are signal we use.",
    },
  ],
  insider: [
    {
      when: "Today",
      what: "Lock €97/mo founding rate (going to €197/mo). Telegram invite + API key sent within the hour.",
      why: "The 24-hour lead starts the next Sunday. Until then you have Dashboard access + the Telegram thread for the most recent briefing.",
    },
    {
      when: "Sunday + 6 days",
      what: "First Insider briefing lands in Telegram + email at 09:00 UTC — same ten ranked names the public sees Monday at 09:00 UTC.",
      why: "One full sourcing day before any public-list reader. You're the first cold email of the week, not the fifth.",
    },
    {
      when: "First Tuesday after",
      what: "First Monthly Insider Drop lands — sector deep-dive, methodology release, founder essay, or tool, on rotation.",
      why: "The continuity programme. Net-new artefact every month, on a four-format rotation. Twelve-month forward calendar at /continuity.",
    },
    {
      when: "Day 90 → 1 year",
      what: "Twelve drops shipped, twelve weekly Insider lists, the API integrated into your stack. One renewal at locked rate.",
      why: "By twelve months you've crossed the lead-time × cadence × volume threshold where one extra outbound conversation per quarter compounds the cheque math.",
    },
  ],
  sharp: [
    {
      when: "Today",
      what: "Apply via /apply — five-question diligence form. Reviewed in 48 business hours.",
      why: "Application-gated because the quarterly review call is real founder time. Hard cap at 8 funds in 2026.",
    },
    {
      when: "Day 3",
      what: "Written response with fit assessment + Stripe Sharp Tier invoice + Insider Circle invitation.",
      why: "If declined, you get a written reason and (if applicable) a refund commitment. The application is free.",
    },
    {
      when: "Day 30",
      what: "First custom watchlist delivered against your written thesis + white-labeled API endpoint live at signal.yourfund.com.",
      why: "The Sharp Tier deliverables that don't fit the public Dashboard — your fund's thesis, your fund's subdomain, your fund's CRM integration.",
    },
    {
      when: "Quarterly",
      what: "60-minute review call (async prep + written agenda). Covers what the data showed, what your fund missed, what to add to the methodology.",
      why: "The quarterly call is the relationship rung. Methodology source code (CC BY 4.0) ships with it so your team can fork the panel internally.",
    },
  ],
  "sector-sweep": [
    {
      when: "Today (or 24h after brief)",
      what: "Pay €1,997 once. Either go direct via Stripe or submit the 5-question brief and get a written fit assessment + personal buy link in 24h.",
      why: "The Sweep is async-only by design. You name the sector + thesis; we deliver a 40-page custom PDF + CSV + three pre-Crunchbase breakouts in 14 days.",
    },
    {
      when: "Day 14",
      what: "The Sweep delivery email lands with the PDF, the raw CSV, the contributor maps for the top 5, and the three breakout briefs with diligence questions.",
      why: "By Day 14 you have the artefact you'd otherwise spend €15K on at McKinsey or six weeks on internally. It sits in your Dropbox until a partner asks the sector question.",
    },
    {
      when: "Days 14 to 28",
      what: "14-day async Q&A window opens. Reply to the delivery email with sector-specific follow-up questions; we respond in writing inside 48 business hours.",
      why: "The Q&A window is what makes this different from a one-off PDF. You get a written conversation against the same dataset, on your specific thesis.",
    },
    {
      when: "Day 60",
      what: "If you upgrade to Insider Circle, the full €1,997 credits 1:1 against your Insider monthly fee — roughly your first 20 months paid in full.",
      why: "The Sweep becomes the on-ramp, not a one-off. Most Sharp-tier funds enter via this path: Sweep → Insider → Sharp.",
    },
  ],
};

const TIER_LABELS: Record<RoadmapTier, string> = {
  firstlook: "First Look Pass · €7",
  dashboard: "Dashboard · €49/mo",
  insider: "Insider Circle · €197/mo",
  sharp: "Sharp Tier · €497/mo",
  "sector-sweep": "Sector Sweep · €1,997",
};

const TIER_TONES: Record<
  RoadmapTier,
  { border: string; bg: string; accent: string }
> = {
  firstlook: {
    border: "border-amber-700/40",
    bg: "from-amber-950/15",
    accent: "text-amber-300",
  },
  dashboard: {
    border: "border-sky-700/40",
    bg: "from-sky-950/15",
    accent: "text-sky-300",
  },
  insider: {
    border: "border-teal-700/40",
    bg: "from-teal-950/15",
    accent: "text-teal-300",
  },
  sharp: {
    border: "border-rose-700/40",
    bg: "from-rose-950/15",
    accent: "text-rose-300",
  },
  "sector-sweep": {
    border: "border-violet-700/40",
    bg: "from-violet-950/15",
    accent: "text-violet-300",
  },
};

interface BuyerRoadmapProps {
  /** Which tier's arc to render. */
  tier: RoadmapTier;
  /**
   * Optional headline override. Defaults to the canonical Brunson framing
   * "Where you are now → where this takes you."
   */
  headline?: string;
  /**
   * Optional subhead. Defaults to a tier-specific calendar framing.
   */
  subhead?: string;
}

export default function BuyerRoadmap({
  tier,
  headline = "Where you are now → where this takes you.",
  subhead,
}: BuyerRoadmapProps) {
  const beats = BEATS_BY_TIER[tier];
  const label = TIER_LABELS[tier];
  const tone = TIER_TONES[tier];

  const defaultSubhead = `Four beats on the calendar for ${label}. The ladder math by the date it actually moves.`;

  return (
    <section
      aria-label={`Buyer roadmap for ${label}`}
      className={`rounded-xl border ${tone.border} bg-gradient-to-br ${tone.bg} via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5`}
    >
      <header className="space-y-2">
        <p
          className={`${tone.accent} text-[11px] font-semibold uppercase tracking-wider`}
        >
          The roadmap · {label}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug tracking-tight">
          {headline}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          {subhead ?? defaultSubhead}
        </p>
      </header>

      <ol className="space-y-3">
        {beats.map((beat, i) => (
          <li
            key={i}
            className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 sm:p-5 space-y-1.5"
          >
            <div className="flex items-baseline gap-3">
              <span
                className={`${tone.accent} text-[10px] font-semibold uppercase tracking-wider tabular-nums shrink-0`}
              >
                {beat.when}
              </span>
              <span className="text-gray-500 text-[10px] font-mono tabular-nums">
                {String(i + 1).padStart(2, "0")} / {String(beats.length).padStart(2, "0")}
              </span>
            </div>
            <p className="text-gray-100 font-semibold text-sm sm:text-base leading-snug">
              {beat.what}
            </p>
            {beat.why && (
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {beat.why}
              </p>
            )}
          </li>
        ))}
      </ol>

      <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-4">
        Full public roadmap (shipped / in flight / on deck / cut) at{" "}
        <Link
          href="/roadmap"
          className={`${tone.accent} underline decoration-dotted hover:opacity-80`}
        >
          /roadmap
        </Link>
        . Reviewed and re-published quarterly.
      </p>
    </section>
  );
}
