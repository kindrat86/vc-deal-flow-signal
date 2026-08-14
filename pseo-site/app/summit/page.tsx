import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { SUMMIT, summitDays, isTalkLive, isTalkLocked } from "@/content/summit";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "VC Engineering Acceleration Summit, 5 days · 20 anonymous-by-design talks · Free",
  description:
    "Five days, twenty talks, the new playbook for sourcing venture deals from public engineering data. Each talk is free for 24 hours after it airs. Anonymous-by-design, no founder face, only the methodology.",
  alternates: { canonical: "/summit" },
  openGraph: {
    title:
      "VC Engineering Acceleration Summit, 5 days · 20 talks · Free",
    description:
      "Five days, twenty talks. Each talk free for 24h after it airs. The core claim, the methodology, the sector deep-dives, the operationalisation, the founder talk.",
    url: `${SITE}/summit`,
    type: "article",
  },
};

const STACK = [
  { label: "20 talks, released on a rolling basis, synthetic narration, anonymous-by-design", value: "€0 free for 24h after each talk airs" },
  { label: "Full transcripts of every talk (PDF + markdown)", value: "€197 with All-Access Pass" },
  { label: "Slide decks and chart packs from every talk", value: "€197 with All-Access Pass" },
  { label: "219-startup panel dataset, the same CC BY 4.0 file published free at /api/signals.csv; paying gets you the cleaned import-ready build and the talk walkthroughs", value: "€297 standalone, included with All-Access" },
  { label: "Lifetime replays of every talk after the free window closes", value: "€197 with All-Access Pass" },
  { label: "Methodology vault: SSRN preprint, Zenodo dataset, regression code", value: "Free, always" },
] as const;

export default function SummitPage() {
  const days = summitDays();
  const now = new Date();
  const totalTalks = days.reduce((s, d) => s + d.talks.length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "@id": `${SITE}/summit#event`,
        name: SUMMIT.name,
        description: SUMMIT.tagline,
        startDate: SUMMIT.startsAt,
        endDate: SUMMIT.endsAt,
        eventAttendanceMode:
          "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "VirtualLocation",
          url: `${SITE}/summit`,
        },
        organizer: { "@id": "https://gitdealflow.com/#organization" },
        image: `${SITE}/icon.png`,
        offers: [
          {
            "@type": "Offer",
            name: "Free Pass, each talk free for 24h after it airs",
            price: "0",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: `${SITE}/summit`,
            validFrom: SUMMIT.startsAt,
          },
          {
            "@type": "Offer",
            name: "All-Access Pass, lifetime replays + transcripts + slides + 219-startup panel dataset",
            price: String(SUMMIT.allAccessPrice),
            priceCurrency: SUMMIT.allAccessCurrency,
            availability: "https://schema.org/InStock",
            url: `${SITE}/summit/all-access`,
          },
        ],
        subEvent: days.flatMap((d) =>
          d.talks.map((t) => ({
            "@type": "Event",
            name: t.title,
            startDate: t.airAt,
            endDate: new Date(
              new Date(t.airAt).getTime() + t.freeWindowHours * 3600 * 1000
            ).toISOString(),
            url: `${SITE}/summit/${t.slug}`,
            performer: {
              "@type": "Person",
              name: t.speaker,
              jobTitle: t.speakerRole,
            },
          }))
        ),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Summit", item: `${SITE}/summit` },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/summit`}
        languages={getHreflangLanguages("/summit")}
      />
      <AgentMirrorLinks path="/summit" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span className="mx-2">/</span>
          <span>Summit</span>
        </nav>

        {/* Hero, the squeeze */}
        <header className="space-y-5">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            20 talks · released on a rolling basis · free for 24h after each airs
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            The new playbook for sourcing venture deals from public engineering data.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed" data-speakable>
            Five days, twenty talks, the entire methodology behind the SSRN
            panel of 219 venture-backed startups, taught chapter by chapter
            by the data nerds who wrote it. Each talk free for 24 hours after
            it airs. Anonymous-by-design: no founder face, no founder voice,
            no real names. Synthetic narration, Remotion-rendered slides, the
            same pipeline that ships the Acceleration Watch.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            <strong className="text-gray-300">{totalTalks} talks</strong>, released on a rolling basis ·{" "}
            register to get each one as it drops ·{" "}
            <strong className="text-gray-300">€0 for 24 hours after each talk airs</strong> ·
            All-Access Pass for lifetime replays + transcripts + 219-startup panel dataset ·{" "}
            <Link href="/summit/all-access" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
              €{SUMMIT.allAccessPrice} one-time
            </Link>
          </p>
        </header>

        {/* Squeeze form, register for free */}
        <section
          id="register"
          className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5"
        >
          <h2 className="text-2xl font-bold text-gray-100">
            Register your Free Pass
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Talks air on a rolling basis. Register and we email you the moment
            each one unlocks, free to watch for 24 hours after it airs. No
            code required to follow along. Unsubscribe in one click. We use the
            same{" "}
            <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
              published methodology
            </Link>{" "}
            for the talks as for the dashboard, no marketing spin, no founder
            face, just the work.
          </p>
          <form
            action="/api/summit/register"
            method="POST"
            className="flex flex-col sm:flex-row gap-3"
          >
            <label htmlFor="summit-email" className="sr-only">Email</label>
            <input
              id="summit-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@yourfund.com"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <input type="hidden" name="utm_source" value="summit" />
            <input type="hidden" name="utm_medium" value="organic" />
            <input type="hidden" name="utm_campaign" value="summit-2026-05" />
            <button
              type="submit"
              className="rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 transition-colors"
            >
              Reserve free pass →
            </button>
          </form>
          <p className="text-xs text-gray-400 leading-relaxed">
            By registering, you opt in to summit emails (one each time a talk
            unlocks) and the weekly Acceleration Watch digest. Both unsubscribe
            in one click. Anonymity-preserving, we never publish attendee
            lists.
          </p>
        </section>

        {/* Big Domino */}
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            The single belief the summit hinges on
          </h2>
          <p className="text-xl sm:text-2xl text-gray-100 leading-snug font-medium">
            If GitHub commit-velocity acceleration is the most leading public
            signal in venture capital, then every other deal-flow source -
            pitch decks, AngelList, Crunchbase, warm intros, is a lagging
            indicator.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            The whole investing thesis falls or stands on whether that single
            belief is true. Day 1 of the summit makes it falsifiable. The next
            four days operationalise it.
          </p>
        </section>

        {/* Schedule */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-100">
            The schedule
          </h2>
          {days.map((d) => (
            <div key={d.day} className="space-y-4">
              <header className="flex items-baseline justify-between border-b border-slate-800 pb-2">
                <h3 className="text-lg font-semibold text-gray-100">
                  {d.caption}
                </h3>
                <p className="text-xs text-gray-400 font-mono">{d.date}</p>
              </header>
              <ul className="space-y-3">
                {d.talks.map((t) => {
                  const live = isTalkLive(t, now);
                  const locked = isTalkLocked(t, now);
                  const status = live ? "live" : locked ? "locked" : "scheduled";
                  return (
                    <li key={t.slug}>
                      <Link
                        href={`/summit/${t.slug}`}
                        className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700 p-4 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
                              {t.duration} · {t.speaker}
                            </p>
                            <p className="text-sky-300 font-semibold leading-snug">
                              {t.title}
                            </p>
                            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                              {t.subtitle}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                              status === "live"
                                ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40"
                                : status === "locked"
                                  ? "bg-slate-800 text-gray-400 border border-slate-700"
                                  : "bg-amber-900/30 text-amber-200 border border-amber-700/40"
                            }`}
                          >
                            {status === "live" ? "Live now" : status === "locked" ? "All-Access" : "Scheduled"}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        {/* Stack & All-Access upsell */}
        <section className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-100">
            What's in the All-Access Pass
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Each talk is free for 24 hours after it airs. After the window
            closes, every talk is locked behind the All-Access Pass, €
            {SUMMIT.allAccessPrice} one-time, lifetime access to all 20 talks,
            full transcripts, slide decks, and the 219-startup panel dataset
            that the panel was built on. No subscription, no expiration.
          </p>
          <ul className="space-y-3">
            {STACK.map((s) => (
              <li
                key={s.label}
                className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-4"
              >
                <span className="text-emerald-400 shrink-0">✓</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-200 leading-snug">{s.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.value}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/summit/all-access"
              className="rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-semibold px-6 py-3 transition-colors text-center"
            >
              Get the All-Access Pass, €{SUMMIT.allAccessPrice}
            </Link>
            <a
              href="#register"
              className="rounded-lg border border-slate-700 hover:border-slate-600 text-gray-200 font-semibold px-6 py-3 transition-colors text-center"
            >
              Register Free Pass first
            </a>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            30-day refund, no questions asked. Reply REFUND to any email.
          </p>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          <details className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <summary className="cursor-pointer text-gray-200 font-medium">
              Why is everything anonymous?
            </summary>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Manifesto pillar #4, methodology over personality. The product
              is a dataset, not a personality. The work has to stand on whether
              the signal is real, not on whether the person delivering it is
              charismatic. Speakers are pseudonymous data-nerd roles -
              Methodology Lead, Quantitative Architect, Sector Analyst, Agent
              Architect, narrated by the same synthetic Cartesia voice that
              ships the Acceleration Watch.
            </p>
          </details>
          <details className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <summary className="cursor-pointer text-gray-200 font-medium">
              How is each talk delivered?
            </summary>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Remotion-rendered slides + synthetic Cartesia narration. The
              same anonymous-by-design pipeline behind the weekly Acceleration
              Watch and the monthly founder talk on /state-of-github. Every
              talk has a full text transcript so you can read or skim if you'd
              rather not watch.
            </p>
          </details>
          <details className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <summary className="cursor-pointer text-gray-200 font-medium">
              What's the catch with the Free Pass?
            </summary>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              No catch. Each talk is free for 24 hours after it airs. After
              that the talk locks behind the All-Access Pass. The free window
              creates a real reason to attend live (or watch within 24 hours);
              the All-Access Pass funds the production cost of running the
              summit and producing the transcripts. We never gate the
              underlying methodology, that's published openly on /methodology
              under CC BY 4.0, free forever, and neither is the dataset: the panel itself is published free at /api/signals.csv under the same licence.
            </p>
          </details>
          <details className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <summary className="cursor-pointer text-gray-200 font-medium">
              Can I get a refund on the All-Access Pass?
            </summary>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              30 days, no questions asked. Reply REFUND to any email. We
              process inside two business days. The signal is reproducible
              from public data, we'd rather refund a buyer who didn't get
              value than retain a buyer who didn't.
            </p>
          </details>
        </section>

        {/* Trail */}
        <p className="text-xs text-gray-400 text-center border-t border-slate-800 pt-6">
          See also:{" "}
          <Link href="/state-of-github" className="hover:text-gray-300">State of GitHub address</Link>{" "}·{" "}
          <Link href="/walkthrough" className="hover:text-gray-300">12-min walkthrough</Link>{" "}·{" "}
          <Link href="/manifesto" className="hover:text-gray-300">Manifesto</Link>{" "}·{" "}
          <Link href="/firstlook" className="hover:text-gray-300">€7 First Look</Link>
        </p>
      </div>
    </>
  );
}
