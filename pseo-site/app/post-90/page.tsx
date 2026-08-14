import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

const SITE = "https://signals.gitdealflow.com";

/**
 * Brunson DotCom Secrets Ch 11, Phase 6 — "Change the Selling Environment".
 *
 * The 90-day soap-opera + Seinfeld rhythm has run its course in the inbox.
 * If we keep delivering State-of-the-Engine prose to the same email
 * surface, the reader habituates and tunes the rhythm out. Phase 6 is the
 * deliberate move to a *different context* where the next phase of the
 * relationship lives.
 *
 * The environment shift is REAL — three concrete channel changes:
 *   1. Audio podcast feed (`/post-90/feed.xml`) — buyer subscribes in
 *      Apple Podcasts / Spotify / Overcast. Now the rhythm arrives in a
 *      different app, with a different sense modality (voice, not text).
 *   2. Calendar feed (`/post-90/calendar.ics`) — buyer adds the monthly
 *      Stadium Pitch + quarterly State-of-the-Engine to their calendar.
 *      The rhythm is now a scheduled event, not an email surprise.
 *   3. Engine Room cohort page (this surface) — visually distinct from
 *      the public site (terminal monospace, status-board feel). The
 *      reader knows they crossed a threshold.
 *
 * Anonymity-safe: synthetic Cartesia Theo voice powers the audio, no
 * founder face/voice/name. Cohort framing is "graduates of the 90-day
 * signal rhythm" — methodology authority, not personality cult.
 */

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Engine Room — the post-90 cohort home",
  description:
    "You crossed Day 90. The Engine Room is where the rhythm continues — Sunday voice memo in your podcast app, monthly founder talk on your calendar, quarterly State-of-the-Engine post-mortem on the record. Three subscribe links. No more inbox-only.",
  alternates: { canonical: "/post-90" },
  openGraph: {
    title: "Engine Room — the post-90 cohort home",
    description:
      "Sunday voice memo, monthly founder talk, quarterly post-mortem. The 90-day rhythm continues in your podcast app and your calendar — not just your inbox.",
    type: "article",
    url: `${SITE}/post-90`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Engine Room — post-90 cohort home",
    description:
      "Sunday voice memo, monthly founder talk, quarterly post-mortem. Channel-shift from inbox to podcast app and calendar.",
  },
};

const RITUALS = [
  {
    cadence: "Sunday · 09:00 UTC · weekly",
    title: "The Brief",
    medium: "Audio · synthetic voice · 4–6 min",
    body:
      "A short voice memo from the engine. The week's single sharpest acceleration break, what shifted on the panel, and one thing to put on the radar before Monday. Lands in the same podcast app you already open — Apple Podcasts, Spotify, Overcast, anything that takes an RSS URL.",
    cta: "Subscribe to the feed",
    href: "/post-90/feed.xml",
    accent: "amber",
  },
  {
    cadence: "First Tuesday of each month · 16:00 UTC",
    title: "The monthly founder talk",
    medium: "Synthetic-voice video · 8–12 min · YouTube + RSS",
    body:
      "The monthly address — what the panel showed across 350+ venture-backed orgs, what shifted in the false-positive rate, and one falsifiable prediction on the record. Same content cadence as State of GitHub, now scheduled in your calendar so it lands as an event, not an email surprise.",
    cta: "Add to calendar",
    href: "/post-90/calendar.ics",
    accent: "sky",
  },
  {
    cadence: "Day 90 / Day 180 / Day 270 / Day 365",
    title: "The Post-Mortem",
    medium: "Long-form written · public ledger",
    body:
      "Every 90 days, the State-of-the-Engine email reports back on the previous quarter's specific prediction and lays a fresh one for the next quarter. Predictions resolve onto the public Receipts ledger — same format as panel-validation entries, append-only, no opinions.",
    cta: "Open the Receipts ledger",
    href: "/wins",
    accent: "emerald",
  },
] as const;

const ACCENT_CLASSES = {
  amber: { bar: "border-amber-500", label: "text-amber-400", btn: "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border-amber-500/40" },
  sky: { bar: "border-sky-500", label: "text-sky-400", btn: "bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border-sky-500/40" },
  emerald: { bar: "border-emerald-500", label: "text-emerald-400", btn: "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border-emerald-500/40" },
} as const;

const SUBSCRIBE_LINKS = [
  {
    label: "Apple Podcasts",
    sub: "Open the feed URL in Apple Podcasts → ⊕ Add a Show by URL.",
    href: `podcast://signals.gitdealflow.com/post-90/feed.xml`,
    raw: `${SITE}/post-90/feed.xml`,
  },
  {
    label: "Spotify",
    sub: "Spotify accepts public RSS feeds via Spotify for Podcasters.",
    href: `${SITE}/post-90/feed.xml`,
    raw: `${SITE}/post-90/feed.xml`,
  },
  {
    label: "Overcast / Pocket Casts / any RSS reader",
    sub: "Paste the raw RSS URL into your podcast app.",
    href: `${SITE}/post-90/feed.xml`,
    raw: `${SITE}/post-90/feed.xml`,
  },
  {
    label: "Calendar (iCal / Google Calendar / Outlook)",
    sub: "Subscribe to the .ics URL — the monthly Stadium drop + quarterly post-mortem land as events.",
    href: `${SITE}/post-90/calendar.ics`,
    raw: `${SITE}/post-90/calendar.ics`,
  },
] as const;

const COMMITMENT_RITUAL = [
  "Open the Sunday voice memo in your podcast app of choice. Background-listen while you make coffee. The whole point of the channel-shift is that you are *not* in your email when this lands.",
  "Add the calendar feed once. The first Tuesday of every month from now on, the founder talk is on your calendar — not a surprise drop.",
  "When the quarterly post-mortem hits, reply with one sentence: did the previous quarter's prediction resolve on your radar before consensus? That sentence is the only feedback loop the engine asks for.",
] as const;

export default function Post90Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/post-90#page`,
        name: "Engine Room — post-90 cohort home",
        description:
          "Cohort home for graduates of the 90-day signal rhythm. Sunday voice memo, monthly founder talk, quarterly State-of-the-Engine post-mortem. Three subscribe channels — podcast app, calendar app, public Receipts ledger.",
        url: `${SITE}/post-90`,
        inLanguage: "en-US",
        isPartOf: { "@type": "WebSite", name: "VC Deal Flow Signal", url: "https://gitdealflow.com" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Engine Room", item: `${SITE}/post-90` },
        ],
      },
      {
        "@type": "PodcastSeries",
        "@id": `${SITE}/post-90#podcast`,
        name: "Engine Room — VC Deal Flow Signal",
        description:
          "Weekly synthetic-voice voice memo for graduates of the 90-day signal rhythm. The single sharpest acceleration break each Sunday, plus the monthly founder talk and quarterly State-of-the-Engine post-mortem.",
        url: `${SITE}/post-90`,
        webFeed: `${SITE}/post-90/feed.xml`,
        publisher: { "@type": "Organization", name: "VC Deal Flow Signal", url: "https://gitdealflow.com" },
        inLanguage: "en-US",
      },
      {
        "@type": "ItemList",
        name: "Engine Room rituals",
        numberOfItems: RITUALS.length,
        itemListElement: RITUALS.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: r.title,
          description: r.body,
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/post-90`}
        languages={getHreflangLanguages("/post-90")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/post-90" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Engine Room</span>
        </nav>

        {/* Status-board header — visually distinct from the rest of the site
            on purpose. Brunson Phase 6: the environment changed. */}
        <header className="space-y-5 border border-amber-500/30 bg-slate-950/70 rounded-lg p-6 sm:p-8 font-mono">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest">
            <span className="px-2 py-0.5 rounded border border-amber-500/40 text-amber-400">
              Cohort · Day 90+
            </span>
            <span className="px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-400">
              Channel · audio + calendar + ledger
            </span>
            <span className="px-2 py-0.5 rounded border border-sky-500/40 text-sky-400">
              Status · live
            </span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold text-amber-100 leading-[1.1] tracking-tight"
            data-speakable
          >
            Engine Room.
          </h1>
          <p className="text-amber-200/80 text-base sm:text-lg leading-relaxed font-sans" data-speakable>
            You crossed Day 90 of the signal rhythm. The 21-email welcome
            sequence and daily-drip end here — the relationship
            doesn&rsquo;t. From this page on, the rhythm lives in three
            different surfaces, deliberately outside your inbox.
          </p>
          <div className="text-sm text-gray-400 font-sans pt-2 border-t border-amber-500/20">
            <span className="text-amber-400">›</span> Why the change of context:
            inbox-only repetition habituates. The rituals below land in apps you
            already open daily for other reasons. Same engine, three different
            modes of attention.
          </div>
        </header>

        {/* Newcomer on-ramp — cold/SEO arrivals aren't at Day 90 yet.
            Give them a free entry point instead of a dead-end. */}
        <section className="rounded-lg border border-gray-800 bg-slate-900/40 p-5 sm:p-6 space-y-2">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider font-mono">
            New here?
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Not at Day 90 yet? This page is the cohort home for readers who
            already finished the 90-day rhythm. Start with the free Sunday
            digest —{" "}
            <a
              href="https://gitdealflow.com/#signup"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline font-semibold"
            >
              subscribe to the Acceleration Watch
            </a>{" "}
            — or read{" "}
            <Link href="/start-here" className="text-amber-400 hover:underline font-semibold">
              /start-here
            </Link>{" "}
            for the full picture first. No code required.
          </p>
        </section>

        {/* Three rituals — the actual environment shift, listed plainly. */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-100" data-speakable>
            Three rituals. Three different apps.
          </h2>
          <div className="space-y-4">
            {RITUALS.map((r) => {
              const c = ACCENT_CLASSES[r.accent];
              return (
                <article
                  key={r.title}
                  className={`block border-l-4 ${c.bar} bg-slate-900/60 p-5 sm:p-6 rounded-r-lg`}
                >
                  <div className={`text-xs font-semibold uppercase tracking-widest ${c.label} mb-1`}>
                    {r.cadence}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-100 mb-1">
                    {r.title}
                  </h3>
                  <div className="text-xs text-gray-500 mb-3 font-mono">
                    {r.medium}
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    {r.body}
                  </p>
                  <Link
                    href={r.href}
                    className={`inline-block px-4 py-2 rounded text-sm font-semibold border ${c.btn} transition-colors`}
                  >
                    {r.cta} →
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* Subscribe options — each is a literal channel switch. */}
        <section className="space-y-5">
          <h2 className="text-xl font-bold text-gray-100" data-speakable>
            Subscribe — paste one URL.
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            The same RSS feed plugs into every podcast app. The calendar feed
            adds the founder talk + post-mortem dates to your calendar. Two
            URLs, four apps, done.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUBSCRIBE_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="block border border-gray-800 hover:border-amber-500/50 bg-slate-900/40 hover:bg-slate-900/70 p-4 rounded-lg transition-colors"
              >
                <div className="text-amber-400 text-sm font-semibold mb-1">
                  {s.label}
                </div>
                <div className="text-xs text-gray-400 mb-2">{s.sub}</div>
                <code className="block text-xs text-gray-500 font-mono break-all">
                  {s.raw}
                </code>
              </a>
            ))}
          </div>
        </section>

        {/* The 30-day commitment — Brunson "buyer ritual" mechanic. */}
        <section className="space-y-4 border-l-2 border-amber-500/40 pl-5 py-1">
          <h2 className="text-xl font-bold text-gray-100" data-speakable>
            The cohort commitment — three steps, one minute.
          </h2>
          <ol className="space-y-3">
            {COMMITMENT_RITUAL.map((step, i) => (
              <li key={i} className="text-gray-300 text-sm sm:text-base leading-relaxed">
                <span className="text-amber-400 font-mono mr-2">[{i + 1}]</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Recap — what changes vs. what stays. */}
        <section className="space-y-3 border border-gray-800 bg-slate-950/40 rounded-lg p-6">
          <h2 className="text-base font-bold text-gray-100 uppercase tracking-wider">
            What changes / what stays
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-emerald-400 font-mono text-xs mb-2">+ NEW (post-Day-90)</div>
              <ul className="space-y-1 text-gray-300">
                <li>• Sunday voice memo in your podcast app</li>
                <li>• Monthly founder talk on your calendar</li>
                <li>• Quarterly post-mortem on the record</li>
                <li>• Public Receipts ledger as the resolve-tracker</li>
              </ul>
            </div>
            <div>
              <div className="text-sky-400 font-mono text-xs mb-2">= UNCHANGED</div>
              <ul className="space-y-1 text-gray-300">
                <li>
                  • Free Sunday <Link href="/weekly" className="text-sky-400 hover:underline">Acceleration Watch</Link> email
                </li>
                <li>
                  • Public <Link href="/research" className="text-sky-400 hover:underline">SSRN methodology</Link> + dataset
                </li>
                <li>
                  • <Link href="/pricing" className="text-sky-400 hover:underline">Founding-rate</Link> tiers locked
                </li>
                <li>
                  • Reply-to-unsubscribe still works on every email
                </li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="pt-8 border-t border-gray-800 text-xs text-gray-500 space-y-2">
          <p>
            <span className="text-amber-400 font-mono">›</span> The Engine Room
            page is the public landing for cohort graduates. The audio voice is
            a synthetic Cartesia model — same anonymity rule that governs every
            other surface on this site. The methodology, not the personality.
          </p>
          <p>
            Want the funnel hub instead?{" "}
            <Link href="/funnels" className="text-amber-400 hover:underline">
              /funnels
            </Link>{" "}
            · The State-of-the-Engine archive lives at{" "}
            <Link href="/state-of-github" className="text-amber-400 hover:underline">
              /state-of-github
            </Link>
            .
          </p>
        </footer>
      </div>
    </>
  );
}
