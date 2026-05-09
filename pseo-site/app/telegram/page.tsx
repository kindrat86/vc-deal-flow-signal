import type { Metadata } from "next";
import Link from "next/link";
import TelegramCTA from "@/components/TelegramCTA";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";
export const revalidate = 86400;

const TITLE = "Public Telegram — second owned pipe after email";
const DESCRIPTION =
  "The five-name Acceleration Watch and mid-week sector alerts, mirrored to a public broadcast Telegram channel. Free, no signup, no DMs, no login. Email is owned channel #1; Telegram is #2.";
const CANONICAL = "https://signals.gitdealflow.com/telegram";
const TELEGRAM_HREF = "https://t.me/gitdealflow";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/telegram" },
  openGraph: {
    url: CANONICAL,
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "VC Deal Flow Signal",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  keywords: [
    "vc deal flow signal telegram",
    "github commit velocity telegram",
    "code-side sourcing telegram channel",
    "engineering acceleration telegram",
    "venture capital telegram channel",
    "startup signal telegram",
  ],
};

// Brunson Traffic Secrets §3 Ch 11 — "After the Slap" — V8 audit (2026-05-09)
// flagged Telegram as a buried second owned channel. This page is the
// funnel-shape push: hook + reason-why + stack + objection handling +
// CTA. Anonymity-safe (broadcast channel, no DMs, no founder face).

const REASONS_WHY = [
  {
    h: "Email is the briefing. Telegram is the alarm.",
    p: "Sunday-evening reading happens in email. Mid-week alarms happen on a phone. Most investors say they read every Acceleration Watch, then admit they ignore everything between Mondays. The channel closes that gap without adding another inbox.",
  },
  {
    h: "Pseudonymous by construction.",
    p: "No identity required. No phone number visible. No DMs accepted. The channel is broadcast-only — same five-name list, same mid-week sector pings, same methodology change notes. The founder never asks who you are; the channel never asks for a login.",
  },
  {
    h: "Free, forever, with no upsell pressure inline.",
    p: "Pricing pages are at /pricing. The channel does not advertise tiers. If a fund-tier investor (€97/mo Insider) wants to upgrade, the door is mentioned exactly once a quarter — at the bottom of a methodology post, never on a signal post.",
  },
  {
    h: "Mute it. Pin it. Forward it.",
    p: "Telegram has the lowest friction-per-message of any chat platform: mute the channel, keep the icon visible, forward a single signal to a partner without copy-pasting. That's the same UX a co-investor expects from a syndicate group, minus the syndicate.",
  },
] as const;

const FAQS = [
  {
    q: "Why a public Telegram and not a private Slack or Discord?",
    a: "Slack and Discord both require account creation, identity exposure, and channel-based moderation. The audience is global investors and operators, many of whom guard their identity in venture conversations. Public Telegram lets a reader subscribe with one click, stay pseudonymous, and never compromise their primary chat platform. Private Telegram (Insider Circle, €97/mo) exists separately for paying members.",
  },
  {
    q: "How often does the channel post?",
    a: "Every Monday at 09:00 UTC, the five-name Acceleration Watch goes live (mirrored from email within 60 seconds). Two to four mid-week posts per week when sectors break the panel's threshold. One to two methodology updates per month. SSRN preprint anchor links when new versions ship. No daily posts, no engagement bait, no off-topic.",
  },
  {
    q: "Will the channel send me DMs?",
    a: "No. The channel is broadcast-only. The founder never DMs subscribers from the channel. The only way to reach the founder directly is via the Insider Circle private group (paid) or signal@gitdealflow.com (anyone).",
  },
  {
    q: "Can I forward channel posts to my partners?",
    a: "Yes. Telegram preserves attribution on forward (the original channel name and post link travel with the message). The dataset is CC BY 4.0; quoting and forwarding with attribution is encouraged, including inside fund Slack workspaces and IC memos.",
  },
  {
    q: "What does the public channel get that the email doesn't?",
    a: "Mid-week sector pings (when AI infra crosses 2× contributor influx, the channel fires before the next Monday email). Live methodology change notes (the email recaps changes monthly; the channel posts them when shipped). Synthetic-voice clips from the monthly /state-of-github address (audio is anonymity-safe — no founder voice, only Cartesia Theo synthetic narration).",
  },
  {
    q: "What does the private (paid) Telegram get that the public doesn't?",
    a: "The Insider Circle private group (€97/mo) gets next Monday's five names 24 hours early, custom watchlists, the JSON/CSV API for portfolio cross-checks, direct line to the founder, and ~30 fund-tier subscribers comparing notes. The public channel posts the same five names — but 24 hours later. See /pricing for the full ladder.",
  },
] as const;

export default function TelegramPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${CANONICAL}#webpage`,
        url: CANONICAL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en-US",
        isPartOf: {
          "@id": "https://signals.gitdealflow.com/#website",
        },
        about: {
          "@type": "Service",
          "@id": `${CANONICAL}#service`,
          name: "VC Deal Flow Signal — Public Telegram Channel",
          description:
            "Public broadcast Telegram channel mirroring the weekly Acceleration Watch and mid-week sector alerts. Free, pseudonymous, broadcast-only.",
          provider: {
            "@id": "https://gitdealflow.com/#organization",
          },
          areaServed: "Worldwide",
          audience: {
            "@type": "Audience",
            audienceType: "Venture capital investors, angel investors, operators",
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
            url: TELEGRAM_HREF,
            availability: "https://schema.org/InStock",
          },
          serviceType: "Broadcast distribution",
          serviceOutput: {
            "@type": "Periodical",
            name: "Acceleration Watch — Telegram mirror",
            issn: "3065-4521",
          },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${CANONICAL}#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Telegram",
            item: CANONICAL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={CANONICAL}
        languages={getHreflangLanguages("/telegram")}
      />
      <AgentMirrorLinks path="/telegram" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* HOOK — Russell DCS Ch 4. One promise, one mechanism, one frame. */}
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <p className="text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            Owned channel #2 · public · free
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            Email is the briefing.
            <br />
            Telegram is the alarm.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            The same five-name Monday Acceleration Watch — mirrored to a
            public broadcast channel within 60 seconds. Plus mid-week
            sector pings the email doesn&rsquo;t carry. Free, pseudonymous,
            no DMs, no login, no founder face. The second pipe that closes
            the gap between Sunday-evening reading and Wednesday-afternoon
            signal-noticing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={TELEGRAM_HREF}
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              Join t.me/gitdealflow →
            </Link>
            <Link
              href="#why-telegram"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold border border-slate-700 text-gray-300 hover:bg-slate-800 transition-colors"
            >
              Why Telegram (not Slack)
            </Link>
          </div>
        </header>

        {/* OFFER STACK — Russell ES Ch 11. Each item is falsifiable.
            "Mondays at 09:00 UTC" — verifiable by reading the channel
            history. "Mid-week within 60 seconds of email" — verifiable
            by timestamp comparison. */}
        <section
          aria-label="What you get from the public channel"
          className="rounded-xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5"
        >
          <header className="space-y-1">
            <p className="text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              What you get
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
              Five named drops a week. Pinned. Forwardable.
            </h2>
          </header>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block w-2 h-2 rounded-full bg-cyan-400 shrink-0" aria-hidden="true" />
              <div className="text-gray-200">
                <strong>Monday 09:00 UTC — Acceleration Watch.</strong>{" "}
                <span className="text-gray-400">
                  Five startups whose 14-day commit-velocity acceleration
                  cleared the panel&rsquo;s 2× threshold and whose
                  contributor-Gini dropped under 0.30. Same five the email
                  carries; channel mirror lands within 60 seconds.
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block w-2 h-2 rounded-full bg-cyan-400 shrink-0" aria-hidden="true" />
              <div className="text-gray-200">
                <strong>Mid-week — sector pings.</strong>{" "}
                <span className="text-gray-400">
                  When AI infra, dev-tools, climate-tech, fintech rails, or
                  any of the 19 tracked sectors crosses 2× cohort baseline
                  before the next Monday refresh, the channel fires. Email
                  picks it up the following Monday; channel fires within
                  hours of the threshold cross.
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block w-2 h-2 rounded-full bg-cyan-400 shrink-0" aria-hidden="true" />
              <div className="text-gray-200">
                <strong>Monthly — methodology change notes.</strong>{" "}
                <span className="text-gray-400">
                  Every regression coefficient that moves, every
                  contributor-classification rule that changes, every false-
                  positive cohort the panel reclassifies — posted with diff
                  link to the public methodology and SSRN preprint
                  (abstract 6606558).
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block w-2 h-2 rounded-full bg-cyan-400 shrink-0" aria-hidden="true" />
              <div className="text-gray-200">
                <strong>First Wednesday of the month — State of GitHub.</strong>{" "}
                <span className="text-gray-400">
                  Synthetic-voice clip + transcript from the monthly{" "}
                  <Link href="/state-of-github" className="underline decoration-dotted text-cyan-300">
                    Stadium Pitch
                  </Link>
                  . No founder voice — Cartesia Theo synthetic narration
                  only. Anonymity-safe by construction.
                </span>
              </div>
            </li>
          </ul>
          <p className="text-gray-500 text-xs italic pt-2 border-t border-slate-800">
            Cadence is published, not promised — the channel post history
            is the proof. Scroll back any month and count the drops.
          </p>
        </section>

        {/* REASONS-WHY — Russell ES Ch 10 (False Beliefs / Vehicle).
            The default investor objection to a public channel is "I don't
            want another pipe to monitor". Each reason-why dismantles a
            specific version of that objection. */}
        <section id="why-telegram" aria-label="Why a public Telegram" className="space-y-6">
          <header className="space-y-2">
            <p className="text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              Why public Telegram (and not Slack, Discord, or another email)
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
              Four reasons most investors miss until they pin it
            </h2>
          </header>
          <div className="grid gap-4 sm:grid-cols-2">
            {REASONS_WHY.map((r) => (
              <article
                key={r.h}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-2"
              >
                <h3 className="text-gray-100 font-semibold text-base leading-tight">
                  {r.h}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{r.p}</p>
              </article>
            ))}
          </div>
        </section>

        {/* OWNED-CHANNEL HIERARCHY — Russell TS Ch 11 ("After the Slap").
            Make it explicit: which channels do we own, which do we rent.
            The channel inherits trust from being co-equal with email,
            not a downgrade from it. */}
        <section
          aria-label="Owned vs rented channels"
          className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-6 sm:p-7 space-y-4"
        >
          <header className="space-y-1">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Where Telegram sits in the distribution stack
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-tight">
              Two pipes we own. Five we rent.
            </h2>
          </header>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-emerald-950/20 border border-emerald-700/40 p-4 space-y-2">
              <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
                Owned (we control delivery)
              </p>
              <ul className="text-gray-300 text-sm space-y-1.5 leading-relaxed">
                <li>
                  <strong className="text-gray-100">Email list</strong> — the
                  briefing. Sunday rhythm, Monday ship, full archive at{" "}
                  <Link href="/predicted" className="underline decoration-dotted text-emerald-300">
                    /predicted
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-gray-100">Public Telegram</strong>{" "}
                  — the alarm. Real-time mirror plus mid-week pings.
                  Pseudonymous, broadcast-only.
                </li>
                <li>
                  <strong className="text-gray-100">MCP server + API</strong>{" "}
                  — the agent surface.{" "}
                  <Link href="/integrations" className="underline decoration-dotted text-emerald-300">
                    /integrations
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-gray-100">Chrome extensions</strong>{" "}
                  — the in-browser badge. Crunchbase + GitHub overlays.
                </li>
              </ul>
            </div>
            <div className="rounded-md bg-slate-950 border border-slate-700/60 p-4 space-y-2">
              <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                Rented (platform owns delivery)
              </p>
              <ul className="text-gray-400 text-sm space-y-1.5 leading-relaxed">
                <li>X / Twitter — replies, threads, no list ownership</li>
                <li>Reddit — subreddit-gated, mod-controlled</li>
                <li>Hacker News — single-post visibility, no follow</li>
                <li>dev.to + Hashnode — algo-gated reach</li>
                <li>Discord — community-gated, login-required</li>
              </ul>
              <p className="text-gray-500 text-xs italic pt-1">
                Rented platforms feed both owned channels. The asymmetry is
                the point — we lose nothing if a rented platform deplatforms
                us.
              </p>
            </div>
          </div>
        </section>

        {/* CTA — Russell DCS Ch 9 (23 Building Blocks · Block #6 Call to Action) */}
        <TelegramCTA tone="neutral" context="generic" />

        {/* FAQ — answer surfaces (FAQPage schema in JSON-LD above). Each
            answer is a paragraph, not a sentence — answer-engine optimised
            for Claude/Perplexity/ChatGPT direct quotation. */}
        <section
          aria-label="Frequently asked questions"
          className="space-y-5"
        >
          <header className="space-y-1">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Frequently asked
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
              The six questions investors ask before they pin
            </h2>
          </header>
          <dl className="space-y-4">
            {FAQS.map((f) => (
              <div
                key={f.q}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-2"
              >
                <dt className="text-gray-100 font-semibold text-base leading-tight">
                  {f.q}
                </dt>
                <dd className="text-gray-400 text-sm leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CLOSING / NEXT-STEP RAIL — keeps the user on owned surfaces. */}
        <section
          aria-label="Adjacent surfaces"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3"
        >
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Where to go next
          </p>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm">
            <li>
              <Link href="/predicted" className="text-cyan-300 hover:text-cyan-200 underline decoration-dotted">
                /predicted — weekly Acceleration Watch archive →
              </Link>
            </li>
            <li>
              <Link href="/state-of-github" className="text-cyan-300 hover:text-cyan-200 underline decoration-dotted">
                /state-of-github — monthly Stadium Pitch →
              </Link>
            </li>
            <li>
              <Link href="/insider" className="text-cyan-300 hover:text-cyan-200 underline decoration-dotted">
                /insider — private Telegram + 24h lead (€97/mo) →
              </Link>
            </li>
            <li>
              <Link href="/integrations" className="text-cyan-300 hover:text-cyan-200 underline decoration-dotted">
                /integrations — MCP, email, RSS, API →
              </Link>
            </li>
            <li>
              <Link href="/distribution" className="text-cyan-300 hover:text-cyan-200 underline decoration-dotted">
                /distribution — every owned + earned + rented surface →
              </Link>
            </li>
            <li>
              <Link href="/manifesto" className="text-cyan-300 hover:text-cyan-200 underline decoration-dotted">
                /manifesto — the six pillars, public over private →
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
