import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdAudio } from "@/components/DataNerdAudio";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import ThreeCoreStoriesNav from "@/components/ThreeCoreStoriesNav";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Origin — the founder backstory behind VC Deal Flow Signal",
  description:
    "Why a developer who also writes angel checks decided that warm-intro deal flow was a structurally broken vehicle, and what replaced it. The full origin arc — identity shift, three false beliefs collapsed, the new vehicle.",
  alternates: { canonical: "/origin" },
  openGraph: {
    title: "Origin — VC Deal Flow Signal",
    description:
      "From warm-intro investor to GitHub-momentum investor, three false beliefs collapsed.",
    url: "https://signals.gitdealflow.com/origin",
    type: "article",
  },
};

export default function OriginPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/origin#article",
        headline: "Origin — the founder backstory behind VC Deal Flow Signal",
        description:
          "Why a developer who also writes angel checks decided that warm-intro deal flow was a structurally broken vehicle, and what replaced it.",
        url: "https://signals.gitdealflow.com/origin",
        datePublished: "2026-05-05T00:00:00.000Z",
        dateModified: "2026-05-05T00:00:00.000Z",
        author: {
          "@type": "Person",
          "@id": "https://signals.gitdealflow.com/about#author",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about/founder",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/origin",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
        // Brunson Expert Secrets Ch 8 (Hero's Two Journeys) — the founder's
        // arc on this page is half of the work; the buyer's arc lives at
        // /origin/your-journey. hasPart wires the symmetry into structured
        // data so an LLM reading the schema sees the two arcs as one piece.
        hasPart: {
          "@type": "Article",
          "@id":
            "https://signals.gitdealflow.com/origin/your-journey#article",
          name: "Your Journey — the buyer's arc",
          url: "https://signals.gitdealflow.com/origin/your-journey",
        },
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
            name: "Origin",
            item: "https://signals.gitdealflow.com/origin",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/origin"
        languages={getHreflangLanguages("/origin")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/origin" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Origin</span>
        </nav>

        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            Origin · Hero&rsquo;s Two Journeys · 8-minute read
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight"
            data-speakable
          >
            I used to think deal flow was a network problem.{" "}
            <span className="text-sky-400">
              Then I watched a $4M Series A I should have been in.
            </span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            This is the long version — the identity-shift story where you took
            the wrong road first, three false beliefs broke one by one, and the
            new road became the only road that made sense. Read it if you want
            to know why I built this. Skip it if you just want the data.
          </p>
          <DataNerdAudio
            slug="origin"
            label="Listen — The Data Nerd tells the origin story"
            subtitle="Synthetic voice (Cartesia). The same voice you'll hear on every YouTube short and every email-audio companion."
          />
        </header>

        {/* THE OLD JOURNEY */}
        <section className="space-y-4">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            01 · The old journey
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            For ten years, I sourced deals the way every angel does.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            I&rsquo;m an engineer first. Fifteen years of shipping production
            code, half of those years on infrastructure or AI plumbing. I
            started writing small angel cheques somewhere around deal #5 of my
            life — €5K to €25K, mostly into devtools and AI infra, mostly
            through warm intros from other engineers I&rsquo;d worked with. The
            thesis was simple: I know technical founders, I can recognise good
            code, I&rsquo;ll see early-stage software companies before the
            general-purpose investors do.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            For ten years that worked, kind of. I got into a few good rounds. I
            missed dozens. I told myself the misses were because I lived in
            Athens, not San Francisco; because I didn&rsquo;t go to enough
            dinners; because my network wasn&rsquo;t senior enough. The
            obvious explanations.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            They were the wrong explanations. The real one took a small fintech
            startup to show me.
          </p>
        </section>

        {/* THE WALL */}
        <section className="space-y-4">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            02 · The wall
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            The Series A I watched in real time, from the wrong side of it.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            In late 2024 I was tracking a small fintech team. Three founders,
            one repo, beautifully boring product. No press. No AngelList buzz.
            Nobody in my network had mentioned them. I had drafted a
            three-line email I never sent, the kind that starts with &ldquo;I
            saw your repo and I love what you&rsquo;re doing with the
            settlement layer.&rdquo; The email sat in drafts for two weeks.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            On a Saturday I idly opened their GitHub org. Their commit velocity
            had tripled in the prior fortnight. Four new contributors had
            joined. They&rsquo;d spun up three new infrastructure repos. None
            of this was visible anywhere except on github.com. Nobody in my
            warm-intro network was talking about them. Nobody on AngelList had
            posted about them. They were not, in any sense, on the radar yet.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Three weeks later they announced a $4M Series A led by a top-tier
            fund. The investors who got in had either been told by a warm
            intro — fine, but slow — or had been watching the same data I had
            and acting on it. The data was free. It was public. It updated in
            real time. I didn&rsquo;t need a better network. I needed a better
            lens on data I already had access to.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            That&rsquo;s when the three false beliefs started to collapse.
          </p>
        </section>

        {/* FALSE BELIEF 1 */}
        <section className="space-y-3">
          <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">
            03 · False belief #1 — collapsed
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            &ldquo;The right answer is to grow my network.&rdquo;
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            I had spent ten years trying to fix a network problem. I went to
            conferences. I cold-DMed founders. I introduced myself in Slack
            groups. I wrote tweets. None of it solved the actual problem,
            because the actual problem wasn&rsquo;t my network — it was the
            sequence. By the time a deck reached me through any warm intro, no
            matter how senior, three other investors were already in the room.
            The network was getting me <em className="not-italic font-semibold">to</em>{" "}
            the table. It was not getting me there <em className="not-italic font-semibold">first</em>.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Once I named that, the question became: what gets me there first?
            The fintech team had told me the answer without saying anything.
            Their code was visible weeks before any human heard of them.
            Engineering acceleration was not noise. It was sequence. I just
            needed a system to read it.
          </p>
        </section>

        {/* FALSE BELIEF 2 */}
        <section className="space-y-3">
          <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">
            04 · False belief #2 — collapsed
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            &ldquo;Public data is too noisy to be useful.&rdquo;
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The first thing every investor said when I described what I was
            building was &ldquo;isn&rsquo;t GitHub data just noise?&rdquo; A
            fair question. Raw commit counts are noisy. Bots inflate them.
            Hackathons spike them. A single developer pushing config files
            looks the same as a team shipping features. The whole point of the
            objection is that the data is visible to everyone, so it
            can&rsquo;t be edge.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            But that argument falls apart the moment you stop looking at
            absolute numbers. Quant hedge funds make billions on SEC filings —
            data anyone with a browser can read. The edge isn&rsquo;t the
            access. The edge is the lens. When you stop reading commit counts
            and start reading <strong className="text-gray-100">
              acceleration relative to a company&rsquo;s own baseline
            </strong>, the noise drops out and the regime changes show up. We
            ran the regression on 219 startups. The 21-to-47-day lead time
            held. SSRN-indexed it. The lens existed. Nobody had built the
            product around it.
          </p>
        </section>

        {/* FALSE BELIEF 3 */}
        <section className="space-y-3">
          <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">
            05 · False belief #3 — collapsed
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            &ldquo;If this worked, the big incumbents would already do it.&rdquo;
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The third objection was the one I had to argue with myself. If
            GitHub momentum is real edge, why hadn&rsquo;t Crunchbase or
            Affinity or Harmonic built it already? They have engineering
            teams. They have data scientists. They&rsquo;ve had a decade.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The honest answer surprised me. The big incumbents are optimised
            for the funnel they already monetise — the warm-intro funnel. Their
            customers are funds with hundreds of associates whose job is to
            work the deck queue. A 47-day lead time isn&rsquo;t a feature for
            them; it&rsquo;s a different funnel they&rsquo;d have to retrain
            their entire customer base on. The opportunity for a new product
            is precisely the funnel the incumbents won&rsquo;t cannibalise.
            That&rsquo;s why category-creators always win the next platform —
            the people serving the old one are too profitable to disrupt
            themselves.
          </p>
        </section>

        {/* THE NEW JOURNEY */}
        <section className="space-y-4 border-t border-slate-800 pt-8">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            06 · The new journey
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            From warm-intro investor to GitHub-momentum investor.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            I built the system over six months. The first version was a single
            Sunday-morning script that ranked one sector by commit acceleration
            and emailed me the top five. I used it for myself. Sent the founder
            of #2 a three-line email about a specific repo file. He replied
            inside an hour. We talked the next week. I wrote a small cheque
            two weeks before he started raising. That sequence — code-side
            observation → specific email → reply → meeting → cheque <em className="not-italic">
              before
            </em> the deck — became the new shape of how I source deals.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The product on this site is the same script, productised. The
            dashboard ranks 209 venture-backed orgs every Monday. The First
            Look Pass turns it into a one-sector deep dive in 24 hours. The
            Insider Circle adds spike alerts and a private community. The
            Sharp Tier is for funds that want it integrated into their
            CRM. Same lens. Different surfaces.
          </p>
        </section>

        {/* IDENTITY SHIFT */}
        <section className="space-y-3">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            07 · Identity shift
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            I stopped trying to know more people. I started trying to read better.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The shift isn&rsquo;t tactical. It&rsquo;s identity. A
            warm-intro investor optimises for who they know. A code-side
            investor optimises for what they read. The first compounds with
            seniority and dinners. The second compounds with rhythm and
            tooling. They feel different from the inside. The second one
            scales without your physical presence in any room. That&rsquo;s
            the move I want my readers to make.
          </p>
        </section>

        {/* CALL TO READER */}
        <section className="space-y-4 border-t border-slate-800 pt-8">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            08 · Your turn
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Where this leaves you.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            If you&rsquo;ve nodded once in the last eight minutes, you&rsquo;re
            in the same place I was in early 2025. The cheap move is the free
            weekly digest — five startups every Monday, sector-tagged, no
            commitment. The slightly committed move is the €7 First Look on
            your thesis sector. The all-in move is the €9.97/mo founding-price
            Dashboard, which is locked forever for anyone who joins before the
            cohort closes.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            None of these doors are wrong. Pick the one that matches the way
            you actually want to buy.
          </p>

          {/* Brunson Expert Secrets Ch 8 (Hero's Two Journeys) — the
              founder's arc above is half of the work. The matching buyer's
              arc lives at /origin/your-journey. Promoted to a dedicated
              card above the CTAs so a reader who finished the founder
              journey lands on their own arc next, not on a checkout. */}
          <Link
            href="/origin/your-journey"
            className="block rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-5 sm:p-6 hover:border-sky-600 hover:from-sky-950/45 transition-colors group"
          >
            <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider mb-2">
              The matching arc · 10-minute read
            </p>
            <h3 className="text-gray-100 font-bold text-lg sm:text-xl leading-snug mb-2">
              Now read{" "}
              <span className="text-sky-400 group-hover:text-sky-300">
                your journey
              </span>
              {" "}— the same arc, told from your seat.
              <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              The deal you&rsquo;ll never tell anyone about, the three false
              beliefs you&rsquo;re holding without naming, the first concrete
              move on a Sunday, and what you actually look like as an investor
              six months in. Eight beats, mirrored against the eight beats above.
            </p>
          </Link>

          <ul className="text-gray-200 text-base leading-relaxed space-y-2 pl-1 pt-2">
            <li>
              →{" "}
              <a
                href="https://gitdealflow.com/#signup"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted font-medium"
              >
                Subscribe to the Acceleration Watch (free, weekly)
              </a>
            </li>
            <li>
              →{" "}
              <Link
                href="/firstlook"
                className="text-amber-400 hover:text-amber-300 underline decoration-dotted font-medium"
              >
                Buy the First Look Pass on your sector (€7)
              </Link>
            </li>
            <li>
              →{" "}
              <Link
                href="/pricing"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
              >
                Lock the founding price on the Dashboard (€9.97/mo, forever)
              </Link>
            </li>
            <li>
              →{" "}
              <Link
                href="/funnels"
                className="text-gray-300 hover:text-gray-100 underline decoration-dotted font-medium"
              >
                See all 9 doors mapped on the Funnel Hub
              </Link>
            </li>
          </ul>
        </section>

        {/* Brunson Expert Secrets Ch 9 — The Three Core Stories.
            Audit 2026-05-09 (Ch 9 push 94→100): replace the generic
            "more reading" footer below with story-aware transition CTAs
            that move the reader explicitly into the Vehicle and Identity
            stories. The footer below is preserved for the secondary
            references (founder page, walkthrough, /story post-mortem)
            but the primary next-step is now the Three Core Stories nav. */}
        <ThreeCoreStoriesNav current="origin" />

        <section className="border-t border-slate-800 pt-8 text-sm text-gray-400 leading-relaxed">
          <p>
            More about who&rsquo;s writing this on{" "}
            <Link
              href="/about/founder"
              className="text-gray-400 hover:text-gray-200 underline decoration-dotted"
            >
              the founder page
            </Link>
            . The shorter, lighter version of the same story is the{" "}
            <Link
              href="/walkthrough"
              className="text-gray-400 hover:text-gray-200 underline decoration-dotted"
            >
              12-minute walkthrough
            </Link>
            . The launch-diary post-mortem (zero PH votes, what I learned) lives
            at{" "}
            <Link
              href="/story"
              className="text-gray-400 hover:text-gray-200 underline decoration-dotted"
            >
              /story
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
