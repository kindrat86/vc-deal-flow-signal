import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { LiveReplayBar } from "@/components/LiveReplayBar";
import { DoorsClosingBanner } from "@/components/DoorsClosingBanner";
import { getHreflangLanguages } from "@/lib/hreflang";
import { getReplayWindowSnapshot } from "@/lib/replay-window";

/**
 * Brunson "doors closed" waitlist landing.
 *
 * Reached when /api/checkout/founder gates a click outside the open
 * cohort (Friday → Sunday, or before Monday 06:00 UTC). Three jobs:
 *
 *   1. Don't be a 5xx — give the buyer a coherent reason and timeline.
 *   2. Capture them on the free Acceleration Watch list so they convert
 *      next cohort instead of bouncing.
 *   3. Show the cohort calendar so this isn't read as a backend bug.
 *
 * The page is static (force-static) — phase-aware copy is delegated to
 * <LiveReplayBar /> and <DoorsClosingBanner />, which hydrate to live
 * state on the client. So this page is correct even if a buyer somehow
 * lands here during fast-action phase (rare, but defensive).
 */

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Doors closed for this cohort — waitlist for next Monday 06:00 UTC",
  description:
    "The €9.97/mo founding-member checkout is paused until next cohort opens Monday 06:00 UTC. Get on the free Acceleration Watch in the meantime — five startups every Monday, ranked by 14-day commit-velocity acceleration.",
  alternates: { canonical: "/founder-closed" },
  // Brunson rule: closed-cart pages should not be SEO-indexed. They serve a
  // funnel function only — Google should land buyers on /perfect-webinar
  // and /pricing instead.
  robots: { index: false, follow: false },
  openGraph: {
    title: "Doors closed — waitlist for next cohort",
    description:
      "The founding-member rate is only checkoutable Mon 06:00 UTC → Thu 23:59 UTC each week. Get on the free Acceleration Watch and we'll email you when next cohort opens.",
    url: "https://signals.gitdealflow.com/founder-closed",
    type: "article",
  },
};

const SIGNUP_URL = "https://gitdealflow.com/#signup";
const FIRST_LOOK_URL = "/firstlook";

const COHORT_CALENDAR = [
  {
    day: "Mon 06:00 UTC",
    label: "Doors open",
    detail:
      "Live replay opens. Fast-action bonuses unlock for 60 hours. Founding-rate checkout is live.",
    tone: "open",
  },
  {
    day: "Wed 23:59 UTC",
    label: "Fast-action ends",
    detail:
      "Three named bonuses (same-week Sweep slot · founding-rate ratchet · 12 archived digests) drop off. Seat itself remains.",
    tone: "warn",
  },
  {
    day: "Thu 23:59 UTC",
    label: "Cart closes",
    detail:
      "Stripe checkout link starts returning this waitlist page. Existing members keep their rate; new sign-ups wait for Monday.",
    tone: "close",
  },
  {
    day: "Fri – Sun",
    label: "Doors closed",
    detail:
      "You are here. Free Acceleration Watch is unaffected — sign up and we'll email you the moment Monday's doors open.",
    tone: "closed",
  },
] as const;

const TONE_CLASSES: Record<(typeof COHORT_CALENDAR)[number]["tone"], string> = {
  open: "border-emerald-500/40 bg-emerald-950/30",
  warn: "border-amber-500/40 bg-amber-950/30",
  close: "border-rose-500/40 bg-rose-950/30",
  closed: "border-slate-600/60 bg-slate-900/60",
};

const FAQS = [
  {
    q: "Why is the cart closed at all? Why not just take the money?",
    a: "Two reasons. One — the founding rate is only locked for the people who lock it inside an open cohort. If we sold it 24/7 the lock would be meaningless. Two — Brunson's rule: every cohort needs a doors-open and doors-close moment, or the urgency stops working. We chose Mon→Thu so the buyer who decides on Tuesday and the buyer who decides on Thursday land in the same room.",
  },
  {
    q: "When exactly does the next cohort open?",
    a: "Monday 06:00 UTC, every week. The countdown above is live — refresh to see seconds. If you sign up to the free Acceleration Watch, we email you the moment doors open.",
  },
  {
    q: "Is the founding rate still €9.97/mo when I come back Monday?",
    a: "Yes. The rate is contractually locked at €9.97/mo for the full life of your subscription, regardless of which cohort you join. The public price hike to €49/mo does not affect anyone who locked at the founding rate, ever.",
  },
  {
    q: "Can I still get the €7 First Look Pass?",
    a: "Always. The First Look Pass (one-sector deep dive, 24-hour delivery) is checkout-open 24/7 — it's a tripwire, not the founding-member tier. Click below if you want to test on one sector this weekend.",
  },
  {
    q: "What about the fast-action bonuses?",
    a: "Those expired Wednesday 23:59 UTC of the previous cohort. The next cohort gets a fresh set. Locking on Monday morning maximises bonus-window length (Mon 06:00 → Wed 23:59 = 65.98 hours).",
  },
];

export default function FounderClosedPage() {
  const replaySnapshot = getReplayWindowSnapshot();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/founder-closed#webpage",
        url: "https://signals.gitdealflow.com/founder-closed",
        name: "Doors closed — waitlist for next cohort",
        description: metadata.description as string,
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
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
            name: "Perfect Webinar",
            item: "https://signals.gitdealflow.com/perfect-webinar",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Founder cohort — closed",
            item: "https://signals.gitdealflow.com/founder-closed",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/founder-closed"
        languages={getHreflangLanguages("/founder-closed")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/founder-closed" />

      {/* Sticky countdown — same component as /perfect-webinar so the
          buyer sees a consistent cohort clock everywhere. */}
      <LiveReplayBar initialWindow={replaySnapshot} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              ← Home
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <Link
              href="/perfect-webinar"
              className="hover:text-gray-300"
            >
              Perfect Webinar
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-400">Cohort closed</span>
          </nav>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Cart closed · This cohort
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            The founding-member cart is{" "}
            <span className="text-slate-400">paused until Monday 06:00 UTC</span>
            .
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Live replays open every Monday at 06:00 UTC and close every
            Thursday at 23:59 UTC. You landed here because Stripe is gated
            outside that window — by design, not by accident. Below: the
            calendar, what to do meanwhile, and the FAQ.
          </p>
        </header>

        {/* Live banner with seconds-precision countdown to Monday open. */}
        <DoorsClosingBanner initialWindow={replaySnapshot} />

        {/* What to do now — two real CTAs. */}
        <section
          aria-label="What to do now"
          className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 sm:p-8 space-y-5"
        >
          <h2 className="text-2xl font-bold text-gray-100">
            Two things you can do right now
          </h2>

          <div className="space-y-4">
            <article className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-5 space-y-2">
              <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                #1 · Free · Always-open
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                Get on the Acceleration Watch — Mondays at 09:00 UTC.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Five startups every Monday, ranked by 14-day commit-velocity
                acceleration. We email the digest the same morning the next
                cohort opens, so you'll know the moment doors lift. No card,
                no commitment.
              </p>
              <a
                href={SIGNUP_URL}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm transition-colors"
              >
                Join the free Acceleration Watch →
              </a>
            </article>

            <article className="rounded-lg border border-amber-500/40 bg-amber-950/20 p-5 space-y-2">
              <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
                #2 · €7 · Always-open tripwire
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                Test one sector this weekend — €7 First Look Pass.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The First Look Pass is the only paid surface that doesn't
                close on cohort cycle. €7 once, pick any of 19 tracked
                sectors, get the full deep-dive PDF + raw CSV within 24
                hours. If you upgrade to the Dashboard founding rate Monday,
                the €7 credits.
              </p>
              <Link
                href={FIRST_LOOK_URL}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 font-semibold text-sm transition-colors"
              >
                Test one sector for €7 →
              </Link>
            </article>
          </div>
        </section>

        {/* Cohort calendar — visual reassurance that this is a system,
            not an outage. */}
        <section aria-label="Cohort calendar" className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">
            How the weekly cohort works
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            One cohort per ISO week. Every cohort gets the same 90-hour
            window. The calendar is identical every week — the goal is
            predictability, not surprise scarcity.
          </p>
          <ol className="space-y-3">
            {COHORT_CALENDAR.map((step, i) => (
              <li
                key={step.day}
                className={`flex items-start gap-4 rounded-lg border ${TONE_CLASSES[step.tone]} p-4`}
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-bold flex items-center justify-center font-mono"
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <p className="text-gray-100 font-semibold text-sm">
                      {step.label}
                    </p>
                    <p className="text-gray-400 text-xs font-mono">
                      {step.day}
                    </p>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mt-1">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ — defensible answers to the five questions every closed-cart
            visitor asks. */}
        <section id="faq" aria-label="FAQ" className="space-y-5 border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        {/* Final reminder + return path. */}
        <section className="border-t border-slate-800 pt-8 text-center space-y-4">
          <p className="text-gray-400 text-sm leading-relaxed">
            Want to re-read the pitch while you wait?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/perfect-webinar"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Read the 12-minute Perfect Webinar →
            </Link>
            <Link
              href="/perfect-webinar/5min"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-300 font-semibold text-sm transition-colors"
            >
              Or the 5-minute version →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
