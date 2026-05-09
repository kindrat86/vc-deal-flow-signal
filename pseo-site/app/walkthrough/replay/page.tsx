import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { VideoEmbedBlock } from "@/components/VideoEmbedBlock";
import { LiveReplayBar } from "@/components/LiveReplayBar";
import { FastActionBonuses } from "@/components/FastActionBonuses";
import { DoorsClosingBanner } from "@/components/DoorsClosingBanner";
import TrialClose from "@/components/TrialClose";
import { getReplayWindowSnapshot } from "@/lib/replay-window";
import { getVideoBySlug } from "@/content/videos";

export const dynamic = "force-static";
export const revalidate = 86400;

// /walkthrough/replay — the synthetic-narrator video replay surface.
//
// Brunson Expert Secrets §3 Ch 11 + Ch 14 (Perfect Webinar Hack — Live
// Replay Window). The /walkthrough page is the long-form 12-minute Perfect
// Webinar in text form; this page is the *event-shaped* replay surface
// where the synthetic-voice video (Cartesia "Theo", anonymity-safe per
// memory feedback_anonymity_no_podcasts.md) plays as the primary medium
// rather than a sidebar embed.
//
// The deliverable answers the audit gap on Secret #11:
//   "/walkthrough IS the Perfect Webinar… -5 only because the medium is
//    text. Once a synthetic-narrator video exists at /walkthrough/replay,
//    this jumps."
//
// Mechanics on this page:
//   1. LiveReplayBar — sticky cohort countdown across phases.
//   2. VideoEmbedBlock — anchors walkthrough-vsl (YouTube 6wgrWtR6eZg,
//      already PUBLIC on the channel since 2026-05-06).
//   3. Chapter list — clickable timestamps that deep-link the YouTube
//      player at &t=Xs offsets. Drives the SeekToAction in JSON-LD.
//   4. The Stack — mirrored from /walkthrough so the offer is on the same
//      page as the video; closing while still in flow.
//   5. FastActionBonuses — phase-aware bonus block (Mon→Wed only).
//   6. DoorsClosingBanner — phase-aware ribbon directly above the final
//      Stripe CTA. The deadline lives at the point of decision, not in
//      the chrome.
//   7. Final CTA — Stripe Dashboard founding rate + Risk Reversal.
//   8. Transcript — full paragraph-grain transcript for AEO/skim-readers.
//
// Anonymity rule preserved: the video is the Cartesia synthetic voice on
// a Remotion canvas. No founder face, voice, or name appears.

const SITE = "https://signals.gitdealflow.com";
const STRIPE_DASHBOARD = "https://buy.stripe.com/28E7sK48H04U8ou07u0x200";
const SIGNUP_URL = "https://gitdealflow.com/#signup";
const FIRST_LOOK_URL = "/firstlook";
const VIDEO_SLUG = "walkthrough-vsl";

export const metadata: Metadata = {
  title:
    "The Replay — How To Spot a Series A 47 Days Before the Deck (3-min training)",
  description:
    "The 3-minute synthetic-voice training. Single belief: GitHub commit-velocity acceleration is the most leading public signal in venture capital. Live replay window — fast-action bonuses Mon→Wed, doors close Thursday 23:59 UTC. Chapter timestamps deep-link the player. Founding-member rate €9.97/mo, locked forever. 30-day Signal-or-It's-Free guarantee.",
  alternates: { canonical: "/walkthrough/replay" },
  openGraph: {
    title:
      "The Replay — How To Spot a Series A 47 Days Before the Deck",
    description:
      "3-minute synthetic-voice training. Cohort window — fast-action bonuses lock Wednesday 23:59 UTC.",
    url: `${SITE}/walkthrough/replay`,
    type: "video.other",
  },
  twitter: {
    card: "player",
    title:
      "The Replay — How To Spot a Series A 47 Days Before the Deck",
    description:
      "3-minute synthetic-voice training. Replay open — fast-action bonuses lock Wed 23:59 UTC.",
  },
};

// Mirrored Stack from /walkthrough — same lines, same retail anchors. The
// Brunson rule: the Stack belongs at the point of decision. The reader
// who watched the video and lands on the bottom of this page must see the
// stack again, not be sent back upstream.
const STACK_ITEMS = [
  {
    label: "The Live Dashboard",
    description:
      "109 venture-backed startups ranked by 14-day commit-velocity acceleration, refreshed every Monday at 06:00 UTC. Filter by sector, stage, geography. Same data the SSRN paper was built on.",
    standalone: "€348/yr",
  },
  {
    label: "The 219-Startup Backtest CSV",
    description:
      "Five quarters of historical signal-to-fundraise pairs. The full dataset behind the 21–47-day lead-time claim. Yours to load into a notebook and replicate.",
    standalone: "€297 one-time",
  },
  {
    label: "Monthly Sector Deep-Dive PDF",
    description:
      "Pick one sector each month. We deliver a 12-page deep-dive with top 25 ranked orgs, contributor maps, and the three breakout candidates not yet on Crunchbase. Twelve issues a year.",
    standalone: "€588/yr",
  },
  {
    label: "Two Free Chrome Extensions",
    description:
      "Crunchbase + Wellfound badge that injects a momentum score into every profile, plus VC GitHub Lookup — hover any org or repo, see the velocity in 200ms.",
    standalone: "€198/yr value",
  },
  {
    label: "The Free MCP Server (forever, never gated)",
    description:
      "npx @gitdealflow/mcp-signal — six read-only tools inside Claude, Cursor, Windsurf, or any MCP host. Ask the dashboard a sector question and get the answer inline.",
    standalone: "€0 — bundled",
  },
  {
    label: "Async Watchlist Build",
    description:
      "Send your thesis. We come back with a custom watchlist of the 10 highest-acceleration orgs that match it. One-time, kicks off the day you upgrade.",
    standalone: "€297 one-time",
  },
  {
    label: "Methodology Vault",
    description:
      "The full SSRN preprint, every signal definition, the regression code that produced the lead-time numbers. Open by default — the vault is the unlock to the source data.",
    standalone: "€0 — published",
  },
  {
    label: "30-Day Signal-or-It's-Free Guarantee",
    description:
      "If, in your first 30 days, the signal does not surface a startup you find genuinely interesting, reply REFUND to any email. No forms, no call. Full refund inside two business days.",
    standalone: "Bonus",
  },
] as const;

const STACK_TOTAL = "€1,728/yr";
const FOUNDING_PRICE = "€9.97/mo (locked forever)";

// FAQ block — replay-specific. Different angle than /walkthrough's FAQ:
// these answer questions the visitor only asks once they've watched the
// video. (e.g. "is the voice real?", "where's the live version?")
const FAQS = [
  {
    q: "Is that a real founder voice?",
    a: "No. The narration is the Cartesia 'Theo' synthetic voice, generated programmatically from the script in tools/video/content/. The methodology is real. The voice is a writing convention — same anonymity rule that runs across every video and every email signoff on the site.",
  },
  {
    q: "Why a 3-minute version?",
    a: "Most investors will not sit through a 12-minute training the first time they hit this page. The 3-minute compresses the same arc — Hook, Big Domino, Three Objections, Stack, Close — to the bare bones. If you want the long form, the written 12-minute walkthrough lives at /walkthrough.",
  },
  {
    q: "What happens at the end of the replay window?",
    a: "Three phases on a weekly cycle. Mon 06:00 UTC → Wed 23:59 UTC: live replay open + fast-action bonuses available. Thu 00:00 → Thu 23:59 UTC: bonuses gone, last hours to lock the founding rate. Fri 00:00 → Mon 05:59 UTC: cohort closed, only the free Sunday digest signup is open until next Monday.",
  },
  {
    q: "Is the founding rate really locked forever?",
    a: "Yes — and that's contractual. The €9.97/mo Stripe price is anchored to your checkout date. Even when the public price hits €49/mo, your seat does not move. Brunson's rule: your founding cohort gets the founding rate forever, or the cohort is not real.",
  },
  {
    q: "What if I just want to test before committing to monthly?",
    a: "The €7 First Look Pass is the tripwire — pick any of 19 tracked sectors and we deliver a 14-page deep-dive PDF + raw CSV inside 24 hours. If you upgrade to the Dashboard within 14 days, the €7 is credited. If you don't upgrade, you keep the report.",
  },
] as const;

export default function WalkthroughReplayPage() {
  const replaySnapshot = getReplayWindowSnapshot();
  const video = getVideoBySlug(VIDEO_SLUG);
  const chapters = video?.chapters ?? [];
  const transcriptParagraphs = video?.transcriptParagraphs ?? [];
  const youtubeId = video?.youtubeId ?? null;

  // SeekToAction-friendly chapter timestamps — link to YouTube watch URL
  // with &t=<seconds>s so a click on a chapter row jumps to that moment.
  const chapterUrl = (startSec: number): string =>
    youtubeId
      ? `https://www.youtube.com/watch?v=${youtubeId}&t=${startSec}s`
      : `${SITE}/walkthrough/replay#chapter-${startSec}`;

  function fmtTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  // Phase-aware copy for the hero status line. Server-rendered with the
  // build-time snapshot; LiveReplayBar updates the *visible chrome* to
  // live time. The hero status line is intentionally static so SEO
  // crawlers see a stable string per build.
  const heroEyebrow =
    replaySnapshot.phase === "fast-action"
      ? "Replay open · Fast-action bonuses lock Wed 23:59 UTC"
      : replaySnapshot.phase === "last-hours"
        ? "Last hours · Doors close Thursday 23:59 UTC"
        : "Cohort closed · Next replay opens Monday 06:00 UTC";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/walkthrough/replay#webpage`,
        url: `${SITE}/walkthrough/replay`,
        name: "The Replay — How To Spot a Series A 47 Days Before the Deck",
        description:
          "3-minute synthetic-voice training on the single belief: commit-velocity acceleration is the most leading public signal in venture capital. Live replay window with fast-action bonuses, chapter timestamps, mirrored Stack, and 30-day guarantee.",
        inLanguage: "en-US",
        primaryImageOfPage: video
          ? { "@type": "ImageObject", url: video.thumbnailMaxUrl }
          : undefined,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
        breadcrumb: { "@id": `${SITE}/walkthrough/replay#breadcrumb` },
        isPartOf: { "@id": `${SITE}/#website` },
        mainEntity: video ? { "@id": `${SITE}/watch/${VIDEO_SLUG}#video` } : undefined,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE}/walkthrough/replay#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "12-Minute Walkthrough",
            item: `${SITE}/walkthrough`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Replay",
            item: `${SITE}/walkthrough/replay`,
          },
        ],
      },
      // Course schema — the replay is a structured training event with
      // an instructor (the synthetic narrator), a prerequisite (none),
      // and a defined learning outcome. Helps Google surface the page
      // in the "how to" / training carousel.
      {
        "@type": "Course",
        "@id": `${SITE}/walkthrough/replay#course`,
        name: "How To Spot a Series A 47 Days Before the Deck — 3-Minute Training",
        description:
          "Compressed training on commit-velocity acceleration as a leading public signal in venture-stage outcomes. Hook, single-belief big domino, three objections, the offer stack, and a 30-day guarantee.",
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT3M",
          inLanguage: "en-US",
        },
        isAccessibleForFree: true,
        learningResourceType: "Video Training",
        teaches: [
          "Commit-velocity acceleration as a leading indicator of Series A fundraising",
          "Three objections every investor raises about GitHub data, and the empirical counter to each",
          "How to compute a 14-day acceleration delta with two-period confirmation",
          "When and how the public-data edge compounds vs degrades",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/walkthrough/replay#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/walkthrough/replay`}
        languages={getHreflangLanguages("/walkthrough/replay")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/walkthrough/replay" />

      <LiveReplayBar initialWindow={replaySnapshot} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HERO — replay framing + countdown phrase + video embed */}
        <header className="space-y-5" data-speakable>
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-sky-400 transition-colors">
              ← Home
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <Link
              href="/walkthrough"
              className="hover:text-sky-400 transition-colors"
            >
              12-Minute Walkthrough
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-400">Replay</span>
          </nav>

          <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.18em]">
            {heroEyebrow}
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-100 leading-[1.05]">
            The 3-minute training that argues every other deal-flow source is{" "}
            <span className="text-amber-400">a lagging indicator.</span>
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed">
            One single belief, three objections collapsed, the offer stack, and a 30-day refund. Watch once. The cohort window closes Thursday 23:59 UTC. After that, only the free Sunday digest is open until next Monday.
          </p>

          <p className="text-xs text-gray-500 leading-relaxed">
            Synthetic narration (Cartesia &ldquo;Theo&rdquo;). No founder face, voice, or name. The methodology is the protagonist; the voice is a writing convention.
          </p>
        </header>

        {/* VIDEO — primary medium */}
        <section aria-label="The replay" className="space-y-3">
          <VideoEmbedBlock slug={VIDEO_SLUG} variant="full" />
        </section>

        {/* CHAPTER MARKERS — click-to-seek deep links into the YouTube
            player at the chapter offsets. Implements SeekToAction in
            HTML form so users see the same deep-link structure search
            engines see in the JSON-LD. */}
        {chapters.length > 0 && (
          <section
            aria-label="Chapter markers"
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
          >
            <header className="space-y-1">
              <p className="text-violet-400 text-[10px] font-semibold uppercase tracking-wider">
                Chapter timestamps
              </p>
              <h2 className="text-xl font-bold text-gray-100">
                Skip to any beat in the training.
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed">
                Each row deep-links the YouTube player at the chapter
                offset. Bookmark a chapter and the timestamp is preserved.
              </p>
            </header>
            <ol className="space-y-2 text-sm">
              {chapters.map((c, i) => (
                <li
                  key={`chapter-${i}`}
                  id={`chapter-${c.start}`}
                  className="flex items-baseline gap-3"
                >
                  <span className="tabular-nums text-violet-300 text-xs font-bold shrink-0 w-12">
                    {fmtTime(c.start)}
                  </span>
                  <a
                    href={chapterUrl(c.start)}
                    target={youtubeId ? "_blank" : undefined}
                    rel={youtubeId ? "noopener noreferrer" : undefined}
                    className="text-gray-200 hover:text-sky-300 underline decoration-dotted decoration-slate-700 hover:decoration-sky-500"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* THE CORE CLAIM — Big Domino, repeated under the video so the
            reader who paused at minute 1 sees the single belief in
            text form. */}
        <section
          aria-label="Core claim"
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            The single belief
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            If commit-velocity acceleration is the most leading public signal in venture capital, then every other deal-flow source —{" "}
            <span className="text-sky-400">
              pitch decks, AngelList, Crunchbase, warm intros
            </span>{" "}
            — is a lagging indicator.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The whole training stands or falls on this one sentence. Three minutes is enough to walk it. The full 12-minute version with the worked SSRN cohort is on{" "}
            <Link
              href="/walkthrough"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /walkthrough
            </Link>
            .
          </p>
        </section>

        {/* THREE OBJECTIONS — mirrored from /walkthrough so the reader who
            watched the compressed video doesn't have to navigate to read
            the breakdowns. */}
        <section aria-label="Three objections" className="space-y-5">
          <header className="space-y-2">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              The three objections every investor raises
            </p>
            <h2 className="text-2xl font-bold text-gray-100">
              And why each one collapses on contact with the panel.
            </h2>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-sky-500 bg-slate-900/60 p-5 rounded-r-lg space-y-2">
              <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                #1 · Vehicle objection
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                &ldquo;GitHub data is just noise.&rdquo;
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We don&rsquo;t look at absolute numbers — only sharp deviations from each company&rsquo;s own baseline, with two-period confirmation and a contributor-quality filter. That isn&rsquo;t noise; that&rsquo;s a regime change.
              </p>
            </div>
            <div className="border-l-4 border-emerald-500 bg-slate-900/60 p-5 rounded-r-lg space-y-2">
              <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                #2 · Internal objection
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                &ldquo;I have enough deal flow already.&rdquo;
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your network shows you what other investors already see. Code-side acceleration opens the 21–47 day window before consensus forms — every name on the Sunday digest is one you&rsquo;d otherwise meet 3–6 weeks later.
              </p>
            </div>
            <div className="border-l-4 border-indigo-500 bg-slate-900/60 p-5 rounded-r-lg space-y-2">
              <p className="text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
                #3 · External objection
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                &ldquo;Public data isn&rsquo;t edge.&rdquo;
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Quant funds make billions on SEC filings. The filings are public. The lens is not. The same is true of GitHub — zero current investor tools package commit-velocity acceleration as deal flow.
              </p>
            </div>
          </div>
          <TrialClose tone="emerald">
            If even one of those three objections has been quietly running your sourcing motion, the rest of this page is the door — not the room.
          </TrialClose>
        </section>

        {/* THE STACK — same lines as /walkthrough so the buyer is closing
            on the page that has the video. */}
        <section
          aria-label="The stack"
          className="space-y-5 border-t border-slate-800 pt-8"
        >
          <header className="space-y-2">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              The stack
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              {STACK_TOTAL} of priced artefacts.{" "}
              <span className="text-amber-400">{FOUNDING_PRICE}.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Each line carries the standalone retail anchor. The total is what a fund partner spends assembling each piece independently. The founding rate is what a developer-investor pays once to lock the whole stack in before the public price hike.
            </p>
          </header>
          <ul className="space-y-3">
            {STACK_ITEMS.map((it) => (
              <li
                key={it.label}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 sm:p-5 space-y-1.5"
              >
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <p className="text-gray-100 font-semibold text-sm sm:text-base flex items-baseline gap-2">
                    <span aria-hidden className="text-emerald-400">
                      ✓
                    </span>
                    {it.label}
                  </p>
                  <span className="text-amber-300 text-xs sm:text-sm tabular-nums whitespace-nowrap">
                    {it.standalone}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed pl-5">
                  {it.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* FAST-ACTION BONUSES — phase-aware. Hidden when phase is closed.
            Three named bonuses with concrete dollar values during fast-
            action; switches to a "doors closed, get on the list" card
            during closed phase. */}
        <FastActionBonuses
          initialWindow={replaySnapshot}
          signupUrl={SIGNUP_URL}
        />

        {/* DOORS-CLOSING BANNER — the deadline lives at the point of
            decision, not in the chrome. Server-renders with the build-
            time phase and ticks live on hydration. */}
        <DoorsClosingBanner initialWindow={replaySnapshot} />

        {/* THE CLOSE — final CTA stack. Money / Identity / Pricing /
            Urgency closes are on /walkthrough; here we ship the single
            high-leverage close shaped by the replay window phase. */}
        <section
          id="close"
          className="bg-gradient-to-br from-sky-950/50 via-slate-900 to-slate-950 border border-sky-600 rounded-xl p-6 sm:p-8 text-center space-y-4"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Lock the founding cohort
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            One click. Stripe checkout. Next Monday digest, full dashboard, and the SSRN panel ship inside ten minutes.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mx-auto">
            €9.97/mo, locked forever. The 30-day Signal-or-It&rsquo;s-Free guarantee covers the whole stack. Reply REFUND to any email; refund inside two business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={STRIPE_DASHBOARD}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-base shadow-lg shadow-sky-500/30 transition-colors"
            >
              Lock €9.97/mo founding rate <span aria-hidden="true">→</span>
            </a>
            <a
              href={SIGNUP_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Or start with the free Sunday digest
            </a>
          </div>
          <p className="text-gray-400 text-xs pt-2">
            Want to test on one sector before committing?{" "}
            <Link
              href={FIRST_LOOK_URL}
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              €7 First Look Pass
            </Link>{" "}
            — credited toward the Dashboard if you upgrade in 14 days.
          </p>
        </section>

        {/* TRANSCRIPT — full text of the narration, paragraph-grain.
            Drives AEO / Speakable / agent-readable surfaces, and gives
            skim-readers the same arc as the video. */}
        {transcriptParagraphs.length > 0 && (
          <section
            aria-label="Full transcript"
            className="space-y-4 border-t border-slate-800 pt-8"
          >
            <header className="space-y-1">
              <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">
                Full transcript · CC BY 4.0
              </p>
              <h2 className="text-xl font-bold text-gray-100">
                The training, in writing.
              </h2>
              <p className="text-gray-500 text-xs leading-relaxed">
                Same content as the audio. Searchable, citeable,
                agent-ingestible. License: CC BY 4.0 — quote freely with
                attribution.
              </p>
            </header>
            <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
              {transcriptParagraphs.map((p, i) => (
                <p key={`tx-${i}`}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section
          aria-label="Replay FAQ"
          className="space-y-5 border-t border-slate-800 pt-8"
        >
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        {/* ENCORE — the entire offer in eight lines, mirrored from
            /walkthrough so the closing memory of this page is the
            offer, not the FAQ. */}
        <section
          aria-label="Encore"
          className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            One more time, in eight lines.
          </p>
          <ul className="space-y-2 text-gray-100 text-sm leading-relaxed list-none">
            <li>1. The dashboard refreshes every Monday at 06:00 UTC.</li>
            <li>2. The 219-startup backtest CSV is yours on day one.</li>
            <li>3. Twelve sector deep-dive PDFs ship across the year.</li>
            <li>4. Two free Chrome extensions, plus the free MCP server forever.</li>
            <li>5. One async watchlist build against your written thesis.</li>
            <li>
              6. The methodology vault — SSRN preprint + regression code,
              CC BY 4.0, open by default.
            </li>
            <li>7. Three fast-action bonuses if you lock by Wed 23:59 UTC.</li>
            <li>
              8. €9.97/mo founding rate, locked forever. 30-day refund.
            </li>
          </ul>
          <div className="pt-2">
            <a
              href={STRIPE_DASHBOARD}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
            >
              Lock the founding rate →
            </a>
          </div>
        </section>

        {/* NEXT COHORT — explicit signal that the page recurs weekly,
            so the visitor who lands during a closed phase has a clear
            "come back next Monday" pointer. */}
        <section
          aria-label="Next cohort"
          className="text-center text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-6"
        >
          <p>
            Cohort window resets every Monday at 06:00 UTC. Replay ID:{" "}
            <code className="text-gray-400 font-mono">{replaySnapshot.replayId}</code>
            . If you want the long-form text version of this same arc,
            it&rsquo;s the{" "}
            <Link
              href="/walkthrough"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              12-minute walkthrough
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
