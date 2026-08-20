import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

/**
 * /origin/your-journey, Brunson Expert Secrets Ch 8 (Hero's Two Journeys),
 * companion to /origin.
 *
 * Background: the 2026-05-09 Secret-Trilogy audit scored Hero's Two Journeys
 * at 91/100 with the note: "the buyer's journey gets less ink than the
 * founder's." /origin is the FOUNDER's journey (told in first person, "I
 * watched a $4M Series A from the wrong side"). This page is the BUYER's
 * journey, told in second person, the reader's own future-and-past arc.
 *
 * It mirrors /origin's eight-section structure beat-for-beat so a reader
 * who finishes /origin and clicks through can feel the symmetry:
 *
 *   /origin (founder)              →  /origin/your-journey (buyer)
 *   01 The old journey             →  01 Where you are right now
 *   02 The wall                    →  02 The deal you'll never tell anyone about
 *   03 False belief #1             →  03 "I just need a better network"
 *   04 False belief #2             →  04 "This kind of edge isn't for me"
 *   05 False belief #3             →  05 "If this worked I'd already be doing it"
 *   06 The new journey             →  06 The first move (concrete action)
 *   07 Identity shift              →  07 Who you become, six months in
 *   08 Your turn                   →  08 The door (CTA)
 *
 * Distinct from /identity (which is a structured 7-shift before/after
 * grid + 3 archetypes + quotes). This page is pure narrative, the reader
 * reading their own future. /identity is the table; this is the story.
 *
 * Static RSC. All copy at module scope. JSON-LD Article + isPartOf back to
 * /origin so the symmetry is machine-readable too.
 */

export const metadata: Metadata = withEditorialOverride({
  title:
    "Your Journey, the buyer's arc",
  description:
    "The companion to /origin, told from your seat. The deal you'll never tell anyone about, the three false beliefs you've been holding without naming, the first concrete move, and what you actually look like as an investor six months from now. Eight sections, ten-minute read.",
  alternates: { canonical: "/origin/your-journey" },
  openGraph: {
    title: "Your Journey, the buyer's arc",
    description:
      "From the deal you missed to the partner who reads code first. The buyer's journey, told beat-for-beat against the founder's.",
    url: "https://signals.gitdealflow.com/origin/your-journey",
    type: "article",
  },
});

export default function YourJourneyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id":
          "https://signals.gitdealflow.com/origin/your-journey#article",
        headline:
          "Your Journey, the buyer's arc against the founder's origin",
        description:
          "The buyer-side companion to /origin. The deal you'll never tell anyone about, the three false beliefs you're holding without naming them, the first concrete move, and the identity you arrive at six months in.",
        url: "https://signals.gitdealflow.com/origin/your-journey",
        datePublished: "2026-05-09T00:00:00.000Z",
        dateModified: "2026-05-09T00:00:00.000Z",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
        },
        mainEntityOfPage:
          "https://signals.gitdealflow.com/origin/your-journey",
        // isPartOf wires this page to /origin in structured data, so an
        // LLM reading the schema sees the two journeys as one work.
        isPartOf: {
          "@type": "Article",
          "@id": "https://signals.gitdealflow.com/origin#article",
          name: "Origin, the founder backstory behind VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com/origin",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
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
          {
            "@type": "ListItem",
            position: 3,
            name: "Your Journey",
            item:
              "https://signals.gitdealflow.com/origin/your-journey",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/origin/your-journey"
        languages={getHreflangLanguages("/origin/your-journey")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/origin/your-journey" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/origin"
            className="hover:text-gray-300 transition-colors"
          >
            Origin
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Your Journey</span>
        </nav>

        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            Your Journey · Hero&rsquo;s Two Journeys (the other side) · 10-minute read
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight"
            data-speakable
          >
            On{" "}
            <Link
              href="/origin"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /origin
            </Link>
            , I told you the deal I missed.{" "}
            <span className="text-sky-400">
              Now let me tell you yours, the one you haven&rsquo;t told anyone
              about either.
            </span>
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            The founder&rsquo;s arc on /origin is told in first person, because
            it happened to me. This one is told in second person, because
            it&rsquo;s about to happen to you, or it already has and
            you&rsquo;re still pretending it didn&rsquo;t. Eight beats, mirrored
            against the founder&rsquo;s eight beats, so you can feel the
            symmetry between why I built this and why you&rsquo;d use it.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            If you haven&rsquo;t read{" "}
            <Link
              href="/origin"
              className="text-gray-300 hover:text-gray-100 underline decoration-dotted"
            >
              the founder version
            </Link>{" "}
            yet, do that first, this one lands harder when the two arcs read
            against each other.
          </p>
        </header>

        {/* 01, WHERE YOU ARE NOW (mirrors /origin §01 The old journey) */}
        <section className="space-y-4">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            01 · Where you are right now
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            You source deals the way you were taught to source them.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            You evaluate companies for a living. Maybe you trained as an
            engineer; maybe you never wrote a line and just work alongside
            them. Somewhere along the way you started writing small
            cheques, €5K, €10K, occasionally €25K, into devtools, AI infra,
            developer-shaped SaaS. The thesis was the obvious one: I know
            technical founders, I can recognise good code, I&rsquo;ll see good
            companies before the generalists do.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            That worked, kind of. You got into a few good rounds. You missed a
            lot more than you talk about. You&rsquo;ve told yourself the misses
            are because you don&rsquo;t live in San Francisco; because your
            calendar is too full of the day job; because the partners with the
            real rolodex were already in the room before the deck reached you.
            You&rsquo;ve probably told two friends some version of that
            sentence in the last year.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Those explanations aren&rsquo;t wrong, exactly. They&rsquo;re
            just incomplete. There&rsquo;s a different sentence underneath
            them, and you&rsquo;ve been working around it for a while.
          </p>
        </section>

        {/* 02, THE WALL (mirrors /origin §02 The wall) */}
        <section className="space-y-4">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            02 · The deal you&rsquo;ll never tell anyone about
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            There&rsquo;s a Series A you watched in real time, from the wrong
            side of it. Same as I did.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            You know the one. Three founders, one repo, beautifully boring
            product. You bumped into them on Hacker News, or in a Slack group,
            or because a friend forwarded a tweet six months before anyone
            else cared. You opened the GitHub org once, on a Saturday, while
            half-watching something you weren&rsquo;t really watching. You
            noticed the commit graph was unusual. You drafted a three-line
            email. The email sat in drafts.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Then nothing happened, until three or four weeks later when a
            $4M-or-thereabouts Series A landed in your TechCrunch tab and you
            felt the specific, private flavour of regret that only investors
            who almost-acted ever feel. The check you didn&rsquo;t write was
            a few hundred euros into a company that&rsquo;s worth a hundred
            million now. You haven&rsquo;t told that story at any dinner. You
            won&rsquo;t. It&rsquo;s the one where you were right and slow at
            the same time.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Here&rsquo;s the part that matters. The data you noticed on that
            Saturday <em className="not-italic font-semibold">was already
            public</em>. It updated every day. It was free. The investors who
            got into the round either had a warm intro you didn&rsquo;t, fine,
            that happens, or they were watching the same data you were and
            had a system that made them act on it inside the week, not the
            month. The wall isn&rsquo;t your network. It&rsquo;s the rhythm.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Once you name that, three beliefs that have been quietly running
            your sourcing start to wobble.
          </p>
        </section>

        {/* 03, FALSE BELIEF #1 (mirrors /origin §03) */}
        <section className="space-y-3">
          <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">
            03 · False belief #1, the one you tell yourself out loud
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            &ldquo;I just need a better network.&rdquo;
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            This is the belief you say at dinners. You go to conferences. You
            DM founders. You introduce yourself in Slack groups. You write a
            tweet about devtools every other week and hope a partner you
            respect quote-RTs it. None of it solves the actual problem. The
            actual problem isn&rsquo;t that you don&rsquo;t know enough
            people. It&rsquo;s that{" "}
            <em className="not-italic font-semibold">by the time</em> a deck
            reaches you through any warm intro, no matter how senior, three
            other investors are already in the room.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The network is getting you{" "}
            <em className="not-italic font-semibold">to</em> the table. It is
            not getting you there <em className="not-italic font-semibold">first</em>.
            And you know this, because every time you go all-in on networking
            for a quarter you feel slightly more tired and the round
            announcements still surprise you on Tuesdays. Effort scales. Lead
            time doesn&rsquo;t.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The question that replaces &ldquo;how do I grow my network&rdquo;
            is &ldquo;what gets me there first?&rdquo; The Saturday-deal you
            never told anyone about answered that question for you. You just
            haven&rsquo;t built the system around the answer yet.
          </p>
        </section>

        {/* 04, FALSE BELIEF #2 (mirrors /origin §04) */}
        <section className="space-y-3">
          <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">
            04 · False belief #2, the one you tell yourself in private
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            &ldquo;This kind of edge isn&rsquo;t built for someone my size.&rdquo;
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            This belief is quieter. You don&rsquo;t say it at dinners. You say
            it to yourself when the Harmonic sales rep emails you a deck
            starting at €60K/yr, or when the Pitchbook seat your friend has
            shows up on his expense report. The belief is: tools that surface
            edge before the round are built for funds with hundreds of
            associates and six-figure data budgets. People writing €5K-€50K
            cheques on the side of a day job aren&rsquo;t the customer.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The belief isn&rsquo;t crazy, it&rsquo;s how the category was
            built. But the category was built that way because{" "}
            <em className="not-italic font-semibold">enterprise sales
            motions are expensive</em>, not because the data ladder requires
            them. Strip the sales motion out, run the same regression on the
            same public dataset, and the price drops by two orders of
            magnitude. Quant hedge funds make billions on SEC filings, data
            anyone with a browser can read. The edge isn&rsquo;t the access.
            The edge is the lens. And the lens doesn&rsquo;t care how big your
            cheque is.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            This site is what that strip-out looks like. €9.97/mo founding
            rate, locked forever, for someone who wants earlier signal without
            a fund-sized stack. The First Look Pass is €7. The cheap rung
            exists because the buyer is not the partner-with-budget. You were
            right that the category wasn&rsquo;t built for you. You were wrong that
            it couldn&rsquo;t be.
          </p>
        </section>

        {/* 05, FALSE BELIEF #3 (mirrors /origin §05) */}
        <section className="space-y-3">
          <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">
            05 · False belief #3, the one you argue with yourself about
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            &ldquo;If this worked, I&rsquo;d already be doing it.&rdquo;
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            This is the meta-belief. It runs underneath everything else. The
            shape of it: I&rsquo;m a smart engineer. I read the same
            blogs as everyone else. If reading commit graphs were a real edge,
            I&rsquo;d have rolled my own dashboard already. Therefore either
            it isn&rsquo;t edge, or it&rsquo;s edge that anyone with my
            tooling can replicate, which means it isn&rsquo;t edge. Q.E.D.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The argument has two holes. The first: you&rsquo;ve probably
            spent four weekends in the last two years building precisely this
            tool, getting it 60% of the way there, then putting it down
            because the cron broke or the GitHub API rate-limited you or you
            got busy at work. Building the lens once is doable. Maintaining
            it weekly across 350+ venture-backed orgs is a job. There&rsquo;s
            a difference between &ldquo;I could build it&rdquo; and &ldquo;I
            actually have it running every Monday at 06:00 UTC.&rdquo;
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The second hole: the existence proof you&rsquo;re looking for is
            sitting in your TechCrunch tab every week. The investors who got
            into the Saturday-deal{" "}
            <em className="not-italic font-semibold">were already doing
            this.</em> You weren&rsquo;t in the room because you were arguing
            with yourself about whether the room exists, while other people
            were already inside it acting on the same data you were looking
            at. The category isn&rsquo;t hypothetical. You&rsquo;re just on
            the wrong side of it.
          </p>
        </section>

        {/* 06, THE FIRST MOVE (mirrors /origin §06 The new journey) */}
        <section className="space-y-4 border-t border-slate-800 pt-8">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            06 · The first move
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Here is the smallest possible thing you can do this Sunday.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            You don&rsquo;t need to commit to anything yet. You don&rsquo;t
            need to lock the founding rate. You don&rsquo;t need to write a
            post about your new sourcing thesis. The first move is small and
            specific: subscribe to the Acceleration Watch. Free. One email a
            week. Five startups every Monday, ranked by 14-day commit-velocity
            acceleration in your sector. Sector-tagged. Direct GitHub link
            on each.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            For three Sundays you do nothing except read the email and feel
            whether the names land. On the fourth Sunday, and this is the
            commitment you&rsquo;re actually making, not the email signup -
            you pick one name from one digest and you send the founder a
            three-line email about a specific repo file. Not &ldquo;loved your
            deck.&rdquo; Specific. &ldquo;I noticed your settlement-layer repo
            shipped the test harness on Sunday and you brought a contributor
            in from [Series-B fintech] last fortnight. Are you raising?&rdquo;
            That&rsquo;s the move. Three lines, specific, on a Tuesday.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            That&rsquo;s the entire shape of the new sourcing motion: weekly
            digest in, specific email out, founder reply, meeting, cheque -
            all of it happening before any deck circulates. The rest of the
            ladder (€7 First Look Pass, €49/mo Dashboard, €197/mo Insider
            Circle) just gives you more surface area for the same shape, on
            more sectors, faster. The shape itself is the thing. You can run
            it for free for as long as you want.
          </p>
        </section>

        {/* 07, WHO YOU BECOME (mirrors /origin §07 Identity shift) */}
        <section className="space-y-3">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            07 · Who you become, six months in
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            You stop trying to know more people. You start reading better.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            It&rsquo;s a Tuesday morning, four months from the day you
            subscribed. You open the laptop, you read Monday&rsquo;s
            five-name digest from the day before, and you forward two of them
            to the partner you co-invest with most often, with one line of
            commentary each. By 10:00 you&rsquo;ve sent two cold emails, the
            specific kind, with the repo file and the contributor name. By
            lunchtime one of them has replied. The reply is the founder
            saying &ldquo;how did you know about that file?&rdquo; The answer
            is on the Acceleration Watch in your inbox.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            That&rsquo;s the rhythm at month four. By month six you&rsquo;re
            quietly running your own watchlist of sixty orgs, you&rsquo;ve
            written three cheques into companies the consensus tools
            haven&rsquo;t indexed yet, and the partner you forward to has
            started forwarding back. The conversations at dinners are
            different, you&rsquo;re no longer the angel who&rsquo;s slightly
            embarrassed about the slow misses. You&rsquo;re the one who picks
            up a board seat because the founder remembered the cold email
            from before the round.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The shift isn&rsquo;t a tactic. It&rsquo;s identity. The
            warm-intro investor optimises for who they know. The First Mover
            optimises for what the engineering is actually doing, read for them,
            in plain English. The first compounds with
            seniority and dinners. The second compounds with rhythm and
            tooling. They feel different from the inside. The second one
            scales without your physical presence in any room. That&rsquo;s
            the move{" "}
            <Link
              href="/origin"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              I made for myself
            </Link>{" "}
            and the move I&rsquo;m asking you to make.
          </p>
        </section>

        {/* 08, THE DOOR (mirrors /origin §08 Your turn) */}
        <section className="space-y-4 border-t border-slate-800 pt-8">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            08 · The door
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            You&rsquo;ve read both arcs now. Pick the door that matches where
            you actually are.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Three doors, sized to three different commitments. None of them is
            wrong. The honest move is the one that matches where you actually
            are right now, not where you want to be in six months.
          </p>
          <ul className="text-gray-200 text-base leading-relaxed space-y-3 pl-1 pt-2">
            <li>
              <span className="text-emerald-400 font-semibold">→ Free.</span>{" "}
              <a
                href="https://gitdealflow.com/#signup"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted font-medium"
              >
                Subscribe to the Acceleration Watch
              </a>
              {" "}, five names every Monday, sector-tagged, no commitment. Run
              the four-Sunday experiment from §06. If the names don&rsquo;t
              land, unsubscribe and lose nothing.
            </li>
            <li>
              <span className="text-amber-400 font-semibold">→ €7.</span>{" "}
              <Link
                href="/firstlook"
                className="text-amber-400 hover:text-amber-300 underline decoration-dotted font-medium"
              >
                Buy the First Look Pass
              </Link>
              {" "}on your thesis sector. One sector, full deep-dive in 24
              hours, three pre-Crunchbase breakouts named, raw CSV. Credit the
              €7 toward Dashboard if you upgrade in 14 days.
            </li>
            <li>
              <span className="text-sky-400 font-semibold">→ €49/mo.</span>{" "}
              <Link
                href="/pricing"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
              >
                Lock the founding-rate Dashboard
              </Link>
              {" "}, 350+ ranked orgs, refreshed weekly, founding rate locked
              forever. The all-in version of the rhythm in §06.
            </li>
          </ul>
          <p className="text-gray-400 text-sm leading-relaxed pt-3">
            If you&rsquo;d rather see the whole map first, the{" "}
            <Link
              href="/funnels"
              className="text-gray-300 hover:text-gray-100 underline decoration-dotted"
            >
              Funnel Hub
            </Link>{" "}
            shows every entry point with the buyer it&rsquo;s sized for. The
            shorter, table-shaped version of who-you-become is at{" "}
            <Link
              href="/identity"
              className="text-gray-300 hover:text-gray-100 underline decoration-dotted"
            >
              /identity
            </Link>
            . The 12-minute walkthrough of the methodology itself is at{" "}
            <Link
              href="/walkthrough"
              className="text-gray-300 hover:text-gray-100 underline decoration-dotted"
            >
              /walkthrough
            </Link>
            .
          </p>
        </section>

        <section className="border-t border-slate-800 pt-8 text-sm text-gray-400 leading-relaxed">
          <p>
            This page is the buyer-side companion to{" "}
            <Link
              href="/origin"
              className="text-gray-400 hover:text-gray-200 underline decoration-dotted"
            >
              /origin
            </Link>
            . The two arcs are designed to be read against each other. If
            you&rsquo;ve read both and want to talk, I read every reply to{" "}
            <a
              href="mailto:signals@gitdealflow.com"
              className="text-gray-400 hover:text-gray-200 underline decoration-dotted"
            >
              signals@gitdealflow.com
            </a>
            . I won&rsquo;t reply with a sales pitch. I&rsquo;ll reply with
            the specific data on the deal you almost wrote, if you tell me
            which one it was.
          </p>
        </section>
      </div>
    </>
  );
}
