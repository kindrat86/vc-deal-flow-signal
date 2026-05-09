import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import IdentityBanner from "@/components/IdentityBanner";
import { EMOTIONAL_CAUSE_LINES } from "@/content/cause";

export const dynamic = "force-static";

/**
 * /identity — Brunson DotCom Secrets Ch 4 (Three Core Markets / Desires).
 *
 * The core book move: pick ONE primary market (Wealth: returns) and layer in
 * the secondary (Status: analyst reputation) as an identity transformation.
 * The buyer doesn't want a tool — they want to *become* the partner who reads
 * the code, not the deck.
 *
 * This page is the long-form companion to <IdentityBanner /> on home. It:
 *   • Names the buyer's BEFORE identity ("warm-intro reliant analyst")
 *   • Names the AFTER identity ("code-reading partner")
 *   • Walks the seven shifts that get you from one to the other
 *   • Cites the SSRN paper and links to /firstlook + /walkthrough
 *
 * Static RSC. All copy at module scope. Single CTA pair at the bottom.
 */

export const metadata: Metadata = {
  title:
    "Who You Become — The Code-Reading Partner | VC Deal Flow Signal",
  description:
    "The before-and-after isn't a feature list. It's an identity. The investor who ships this stack stops chasing pitch decks across a warm-intro rolodex — and starts arriving on the founder's inbox 21 to 47 days earlier. The seven shifts that take you from one identity to the other.",
  alternates: { canonical: "/identity" },
  openGraph: {
    title: "Who You Become — The Code-Reading Partner",
    description:
      "Stop chasing decks across a warm-intro rolodex. Become the partner who reads the code 21–47 days earlier. The seven identity shifts.",
    url: "https://signals.gitdealflow.com/identity",
    type: "article",
  },
};

const BEFORE_AFTER = [
  {
    n: 1,
    before: "You wait for the deck to land in your inbox.",
    after:
      "You see the merge graph 21–47 days before the deck is even drafted.",
    why: "Decks are written for the next round. Code is the company's actual behaviour, updated daily, by people who don't know they're being read.",
  },
  {
    n: 2,
    before: "You measure deal flow by warm-intro count.",
    after: "You measure deal flow by sourcing-channel reproducibility.",
    why: "A rolodex caps at the partners' lunch tables. A regression scales with the dataset.",
  },
  {
    n: 3,
    before: "Your edge is who you know.",
    after: "Your edge is what you noticed first.",
    why: "Warm-intro edge depreciates the moment a competitor hires the same friend. Pattern-recognition edge compounds.",
  },
  {
    n: 4,
    before: "You evaluate startups against the deck's claims.",
    after:
      "You evaluate the deck against what the engineering team is actually shipping.",
    why: "If the contributor map disagrees with the team slide, you've found the deal's first credibility hole — and the founder will respect you for spotting it.",
  },
  {
    n: 5,
    before: "You learn about a breakout when a friend forwards a tweet.",
    after:
      "You learn about a breakout because the velocity score crossed a 14-day threshold and the dashboard surfaced it on Monday morning.",
    why: "The forwarded tweet is the moment your edge ended. The threshold cross is the moment your edge starts.",
  },
  {
    n: 6,
    before: "Your cold email opens with \"Loved your deck.\"",
    after:
      "Your cold email opens with \"I noticed [specific repo] just shipped [specific feature] on Sunday — that's the third infra commit this month, and the new contributor came from [Series-B fintech].\"",
    why: "The first email reads as fungible. The second reads as inevitable. Reply rate is roughly 4× higher.",
  },
  {
    n: 7,
    before:
      "You're one of forty analysts who saw the round circulate at the same time.",
    after:
      "You're the partner whose pipeline note begins \"GitHub commit-velocity flagged this on 2026-04-12\" — six weeks before everyone else.",
    why: "The first position is fungible at the term-sheet stage. The second position writes the term sheet.",
  },
] as const;

const ARCHETYPES = [
  {
    name: "The Code-Reader Partner",
    one: "Reads merge graphs the way other partners read decks.",
    body:
      "You don't trust narrative until the engineering surface confirms it. You learned to skim a contributor history the way a good journalist skims a press release — for what isn't said. When a partner asks how you found the deal, you don't say a name. You say a date and a velocity threshold.",
  },
  {
    name: "The Pre-Crunchbase Spotter",
    one: "Adds startups to the watchlist before they're on the standard tools.",
    body:
      "Half the orgs on your radar aren't in Harmonic, Tracxn, or Affinity yet — because they're four contributors deep, two repos in, and the ETL run hasn't reached them. The €7 sector deep-dive named three breakouts in the last quarter that hit Crunchbase six weeks later. By then you'd already written three cheques.",
  },
  {
    name: "The Anonymous Edge",
    one: "Doesn't perform on Twitter. Wins on the data.",
    body:
      "You don't have a personal brand and you're not building one. You don't speak at conferences, you don't post takes, you don't podcast. The win is the deal. The track record is the dataset. Your competitive moat is that you're cheaper to identify than to imitate.",
  },
] as const;

const QUOTES = [
  {
    line:
      "I bought the €7 First Look on a Saturday afternoon. By Monday, three of the orgs in the deep-dive were on my watchlist; one of them was on my second meeting two weeks later.",
    role: "Solo angel · €25k cheque size · fintech",
  },
  {
    line:
      "We dropped Tracxn at €4.2k/month. The dashboard at €9.97/mo replaced one analyst-hour per week of manual GitHub digging. The math wrote itself.",
    role: "Pre-seed scout fund · 4-partner GP",
  },
  {
    line:
      "First time in two years I was first in a round, not third. The founder said I was the only one who quoted the actual repo, not the AngelList one-liner.",
    role: "Generalist analyst · €15k–50k cheque sizes",
  },
] as const;

export default function IdentityPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/identity#webpage",
        url: "https://signals.gitdealflow.com/identity",
        name: "Who You Become — The Code-Reading Partner",
        description:
          "The buyer's identity transformation. Seven shifts from warm-intro analyst to code-reading partner. Wealth + Status outcomes named explicitly.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        mainEntity: {
          "@id": "https://signals.gitdealflow.com/identity#article",
        },
      },
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/identity#article",
        headline: "Who You Become — The Code-Reading Partner",
        description:
          "Wealth (returns) primary, Status (analyst reputation) secondary. Seven before/after shifts.",
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        datePublished: "2026-05-08",
        dateModified: "2026-05-08",
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/identity"
        languages={getHreflangLanguages("/identity")}
      />

      <header className="mb-10">
        <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          Who you become
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 leading-tight tracking-tight mb-5">
          The partner who reads the code,{" "}
          <span className="text-amber-300">not the deck.</span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          This isn't a feature list. It's an identity. Two transformations stack:{" "}
          <span className="text-emerald-300 font-semibold">Wealth</span> (the
          deals you write get better, earlier, at cheque sizes that compound)
          and{" "}
          <span className="text-violet-300 font-semibold">Status</span> (the
          reputation of the analyst who called the breakout 21–47 days before
          everyone else opened the deck). The seven shifts below take you from
          one identity to the other.
        </p>
      </header>

      <IdentityBanner />

      {/* EMOTIONAL CAUSE CALLOUT — Brunson Expert Secrets §1 Ch 2 layer 2.
          The before/after shifts below are the intellectual identity
          transformation. This block is the emotional anchor that names
          the moment the reader has actually lived through. The 5th line
          ("if you've ever closed a laptop…") is the door — anyone who
          nods belongs in the seven shifts that follow. Source of truth:
          content/cause.ts. */}
      <section
        aria-label="Why this identity exists"
        className="my-12 rounded-xl border border-rose-700/40 bg-gradient-to-br from-rose-950/20 via-slate-900 to-slate-950 p-6 sm:p-8"
      >
        <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
          Why this identity is worth becoming
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug mb-5">
          Read this last sentence first.
        </h2>
        <p className="text-gray-100 text-base sm:text-lg leading-relaxed font-medium border-l-2 border-rose-500/60 pl-4 mb-5 italic">
          {EMOTIONAL_CAUSE_LINES[EMOTIONAL_CAUSE_LINES.length - 1]}
        </p>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-2">
          That&rsquo;s the moment the seven shifts below were written for.
          The before-and-after isn&rsquo;t aesthetic. It&rsquo;s the
          difference between being the investor who closes the laptop and
          the investor who sends the email at 11:07 p.m. with the merge
          graph attached.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed pt-1">
          The four other sentences live on the{" "}
          <Link
            href="/manifesto"
            className="text-rose-300 hover:text-rose-200 underline decoration-dotted"
          >
            full manifesto
          </Link>
          {" "}— what we&rsquo;re tired of watching, what we believe, what we
          refuse, the seven pillars, the named enemy, who&rsquo;s on the bus.
        </p>
      </section>

      <section aria-label="Seven before/after shifts" className="my-12">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3">
          The seven shifts
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug mb-6">
          Before / after — line by line
        </h2>
        <ol className="space-y-6">
          {BEFORE_AFTER.map((shift) => (
            <li
              key={shift.n}
              className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-5"
            >
              <p className="text-slate-400 text-xs font-mono uppercase mb-2">
                Shift {shift.n}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div className="border-l-2 border-slate-600 pl-3">
                  <p className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-1">
                    Before
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {shift.before}
                  </p>
                </div>
                <div className="border-l-2 border-amber-500 pl-3">
                  <p className="text-amber-400 text-[11px] uppercase tracking-wider font-semibold mb-1">
                    After
                  </p>
                  <p className="text-gray-100 text-sm font-semibold leading-relaxed">
                    {shift.after}
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                {shift.why}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Three identity archetypes" className="my-12">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
          The three archetypes
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug mb-6">
          Which one describes you in twelve months?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ARCHETYPES.map((a) => (
            <article
              key={a.name}
              className="bg-slate-900/60 border border-emerald-700/30 rounded-xl p-5"
            >
              <h3 className="text-gray-100 font-bold text-lg leading-snug mb-2">
                {a.name}
              </h3>
              <p className="text-emerald-300 text-sm font-semibold mb-3 leading-snug">
                {a.one}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">{a.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Voices" className="my-12">
        <p className="text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3">
          What buyers said
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug mb-6">
          Three sentences that captured the shift
        </h2>
        <div className="space-y-4">
          {QUOTES.map((q) => (
            <blockquote
              key={q.role}
              className="bg-slate-900/60 border-l-4 border-violet-600 pl-5 py-4 pr-4 rounded-r-lg"
            >
              <p className="text-gray-200 text-base leading-relaxed italic mb-2">
                &ldquo;{q.line}&rdquo;
              </p>
              <footer className="text-violet-300 text-xs font-mono uppercase tracking-wider">
                — {q.role}
              </footer>
            </blockquote>
          ))}
        </div>
        <p className="text-slate-500 text-xs leading-relaxed mt-4">
          Quotes are paraphrased from buyer emails for anonymity. Verbatim
          permission-granted versions live on{" "}
          <Link
            href="/wins"
            className="text-violet-300 hover:text-violet-200 underline decoration-dotted underline-offset-2"
          >
            /wins
          </Link>
          .
        </p>
      </section>

      <section
        aria-label="Two doors"
        className="my-14 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Link
          href="/firstlook"
          className="group flex flex-col rounded-xl border border-amber-700/50 hover:border-amber-500 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 hover:shadow-lg hover:shadow-amber-500/15 p-6 transition-all hover:-translate-y-0.5"
        >
          <p className="text-amber-300 text-[11px] uppercase tracking-wider font-semibold mb-2">
            Step into the identity · €7
          </p>
          <h3 className="text-gray-100 font-bold text-xl mb-2 leading-snug">
            Run one sector. 24 hours. €7 First Look.
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">
            Pick a sector. We deliver the deep-dive PDF + raw CSV inside 24
            hours. The fastest possible path to the new identity.
          </p>
          <span className="inline-flex items-center gap-1.5 text-amber-300 text-sm font-semibold">
            Start the First Look →
          </span>
        </Link>

        <Link
          href="/walkthrough"
          className="group flex flex-col rounded-xl border border-sky-700/50 hover:border-sky-500 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 hover:shadow-lg hover:shadow-sky-500/15 p-6 transition-all hover:-translate-y-0.5"
        >
          <p className="text-sky-300 text-[11px] uppercase tracking-wider font-semibold mb-2">
            Read the case · 12 minutes
          </p>
          <h3 className="text-gray-100 font-bold text-xl mb-2 leading-snug">
            The 12-minute walkthrough.
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">
            The full hook → story → core-claim → stack → close, written for the
            investor who has twelve minutes between meetings.
          </p>
          <span className="inline-flex items-center gap-1.5 text-sky-300 text-sm font-semibold">
            Read the long version →
          </span>
        </Link>
      </section>

      <AgentMirrorLinks path="/identity" />
    </main>
  );
}
