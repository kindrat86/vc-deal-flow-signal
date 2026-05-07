import type { Metadata } from "next";
import Link from "next/link";
import { DataNerdAudio } from "@/components/DataNerdAudio";

export const metadata: Metadata = {
  title:
    "Launch Diary: 0 votes on Product Hunt, 15 upvotes on the post-mortem",
  description:
    "Honest numbers from a Sunday Product Hunt launch with no email list, anonymous handle, and 1 real subscriber. The post-mortem on Indie Hackers got more engagement than the launch. Here is what the comments taught me about distribution, MCP-as-channel, and the 2021 playbook trap.",
  alternates: {
    canonical: "/story",
  },
  openGraph: {
    title:
      "Launch Diary: 0 votes on Product Hunt, 15 upvotes on the post-mortem",
    description:
      "Sunday PH launch with no list. Editorial didn't feature it. The post-mortem on IH taught me more than the launch did.",
    url: "https://signals.gitdealflow.com/story",
    type: "article",
  },
};

export default function StoryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/story#article",
        headline:
          "Launch Diary: 0 votes on Product Hunt, 15 upvotes on the post-mortem",
        description:
          "Sunday Product Hunt launch with no email list, anonymous handle, and 1 real subscriber. The Indie Hackers post-mortem got more engagement than the launch itself. Detailed numbers, what worked, what didn't, and what the comments taught me about distribution.",
        url: "https://signals.gitdealflow.com/story",
        datePublished: "2026-05-02T00:00:00.000Z",
        dateModified: "2026-05-02T00:00:00.000Z",
        author: {
          "@type": "Person",
          "@id": "https://signals.gitdealflow.com/about#author",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/story",
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
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Story",
            item: "https://signals.gitdealflow.com/story",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Why did the Product Hunt launch get 0 votes?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "VC Deal Flow Signal launched with no email list (1 real subscriber after filtering testers and bots), an anonymous handle, and zero pre-existing audience to drive day-one velocity. Product Hunt editorial selects featured products partly based on first-hour traction, which requires either a warm network or a credibility signal that compensates for it. Neither was in place. Five other launches in the same 07:01:00Z batch were featured. This one was not. The result is honest signal about what happens when a B2B credibility product launches without B2B trust signals.",
            },
          },
          {
            "@type": "Question",
            name: "What channel actually worked on launch day?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Discord. Specifically the MCP angle (free npx @gitdealflow/mcp-signal install) outperformed the dashboard angle 3:1 on engagement across Cursor, MCP Community, and Vercel forum servers. Three confirmed installs from one technical message versus zero installable conversions from the broad Product Hunt push the same day. The lesson: distribution channel and product surface being the same thing is a completely different leverage ratio than driving traffic to a landing page.",
            },
          },
          {
            "@type": "Question",
            name: "Why is 'upvoter mining' dead in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Product Hunt stripped public upvoter lists in 2022. The whole strategy of finding accounts that upvoted similar products and direct-messaging them is structurally unavailable. Most circulating PH launch guides still reference upvoter mining, hunter follower counts as the main lever, and batch-with-big-names timing because nobody retracts a 2021 tweet when the algorithm changes in 2022. The half-life of bad advice on these platforms is approximately forever.",
            },
          },
          {
            "@type": "Question",
            name: "What is the cross-commenting strategy?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Cross-commenting means leaving substantive replies on other Product Hunt launches in the 14 days before your own. The goal is profile recognition, not direct traffic. Nobody checks your profile when you post; they check it when they're deciding whether to upvote. Nineteen comments before launch drove most of the profile clicks the launch itself generated. Profile recognition compounds and is the single highest-ROI prep move for a Product Hunt launch in 2026.",
            },
          },
          {
            "@type": "Question",
            name: "What is the 'PH as passive listing' reframe?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Stop treating Product Hunt as a binary launch event. Treat it as a passive listing that compounds when content does the lifting. The spike model is structurally dead unless you already have an audience. The page exists; new content (a methodology paper, an MCP server on npm, a Chrome extension, blog posts) all point at the existing PH page and let it accrete backlinks. PH is the canonical hub. Distribution is everything upstream of it, sustained over months, not a single launch day.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Story</span>
        </nav>

        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
          Launch Diary · Published 2026-05-02
        </p>

        <h1
          className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6 leading-tight"
          data-speakable
        >
          0 votes on Product Hunt, 15 upvotes on the post-mortem
        </h1>

        <p
          className="text-gray-400 text-base leading-relaxed mb-10"
          data-speakable
        >
          A Sunday launch with no email list. Anonymous handle. Editorial did
          not feature it. Five other products in the same 07:01:00Z batch were
          featured. This one was not. What follows is the honest version of
          what happened and what the comments on the Indie Hackers post-mortem
          taught me about distribution.
        </p>

        <DataNerdAudio
          slug="story"
          label="Listen — The Data Nerd reads the launch diary"
          subtitle="Same Cartesia voice as every other narration on this site. The face stays anonymous; the voice is consistent on purpose."
        />

        {/* Hero's Two Journeys — Brunson Expert Secret #6: identity-shift
            narrative. Audit 2026-05-05: this was the lowest-scoring chapter
            in the Expert Secrets section (55/100). The launch-diary above
            covers the external journey; this block adds the internal one. */}
        <section className="mb-10 rounded-xl border-l-4 border-sky-500 bg-slate-900/60 p-6">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
            The two journeys
          </p>
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What I did, and who I became.
          </h2>
          <div className="space-y-4 text-gray-300 text-base leading-relaxed">
            <p>
              <strong className="text-gray-100">External journey:</strong> I
              went from a developer who occasionally wrote angel checks and
              kept losing deals to better-networked investors, to running a
              read-only data tool that any developer-investor can use to spot
              the same patterns weeks before AngelList does. The tool exists
              because I wrote it for myself first and stayed disciplined about
              not turning it into a startup-pitch dashboard.
            </p>
            <p>
              <strong className="text-gray-100">Internal journey:</strong>{" "}
              I stopped trying to network my way into deals and started reading
              commit graphs the way quant funds read SEC filings. The shift
              wasn&rsquo;t learning a new skill — it was accepting that the
              edge I was looking for was already public, already free, already
              updating every fifteen minutes, and that nobody else was watching
              it because nobody had bothered to package it for an investor
              audience. The product is a side-effect of that internal shift.
              Most of the work on this site is me trying to share the shift,
              not the tool.
            </p>
            <p className="text-gray-400 text-sm border-l border-slate-700 pl-4 italic">
              If the internal journey lands for you — if you read commit graphs
              and feel like the consensus deal-flow tools are reading the
              wrong column — the rest of this site (the{" "}
              <a
                href="/perfect-webinar"
                className="text-sky-400 hover:text-sky-300 not-italic underline decoration-dotted"
              >
                Perfect Webinar
              </a>
              , the{" "}
              <a
                href="/quiz"
                className="text-sky-400 hover:text-sky-300 not-italic underline decoration-dotted"
              >
                avatar quiz
              </a>
              , the{" "}
              <a
                href="/pricing"
                className="text-sky-400 hover:text-sky-300 not-italic underline decoration-dotted"
              >
                six tiers
              </a>
              ) is the operational version of this paragraph.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            The numbers, before the narrative
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed space-y-3">
            <p>Product Hunt: 0 votes, 0 comments at T+8h. Not featured.</p>
            <p>
              Email list at launch: 1 real subscriber after filtering testers
              and verified-disposable bots.
            </p>
            <p>
              Telegram channel at launch: 1 subscriber. Skipped any send
              activity.
            </p>
            <p>
              Discord, MCP angle:{" "}
              <span className="text-sky-400">3 confirmed installs</span> from
              one message across Cursor, MCP Community, and Vercel forum
              servers. Roughly 3:1 vs the dashboard push.
            </p>
            <p>
              Reddit pre-launch build-in-public threads: 9 + 1 substantive
              comments and 564 + 176 views by Sunday evening.
            </p>
            <p>
              Indie Hackers post-mortem the same evening:{" "}
              <span className="text-sky-400">
                15 upvotes, ~30 substantive commenters
              </span>
              . The most useful distribution data of the entire week.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What the comments taught me that the launch did not
          </h2>

          <h3 className="text-base font-semibold text-gray-200 mt-6 mb-3">
            1. The channel I built as an afterthought outperformed the channel
            I optimized for
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            The{" "}
            <Link
              href="/install"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              free MCP server
            </Link>{" "}
            converted at roughly 3:1 against the broad PH push. A landing page
            is a billboard. An MCP install is already inside the workflow. The
            trust gap between those two things is enormous: you never have to
            sell again after someone integrates the tool.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 italic">
            &ldquo;The MCP install is a solved trust problem. The landing page
            is a trust problem you have to solve every single visit. Those are
            fundamentally different economics, and most acquisition advice is
            written for the billboard world.&rdquo;
            <br />
            <span className="text-xs text-gray-400 not-italic">
              — ReleaseLog, on the Indie Hackers post-mortem
            </span>
          </p>

          <h3 className="text-base font-semibold text-gray-200 mt-6 mb-3">
            2. The 2021 playbook is structurally dead in 2026
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Product Hunt stripped public upvoter lists in 2022. The most-shared
            launch guides still reference upvoter mining, hunter-follower
            counts as the main lever, and batch-with-big-names timing. The
            tactics look reasonable until you check when the post was written.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 italic">
            &ldquo;The half-life of bad advice on these platforms is
            approximately forever. Nobody retracts a 2021 tweet when the
            algorithm changes in 2022. Post-mortems beat playbooks for exactly
            that reason.&rdquo;
            <br />
            <span className="text-xs text-gray-400 not-italic">
              — epopteia, on the Indie Hackers post-mortem
            </span>
          </p>

          <h3 className="text-base font-semibold text-gray-200 mt-6 mb-3">
            3. Cross-commenting is the highest-ROI prep move
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Nineteen substantive comments on other Product Hunt launches in the
            two weeks before mine drove most of the profile clicks the launch
            generated. Nobody checks your profile when you post. They check it
            when they are deciding whether to upvote.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 italic">
            &ldquo;&apos;Audience lined up&apos; isn&apos;t a list of warm
            contacts you email the morning of. It&apos;s the comment history
            you built in the three weeks before. The listing got people to
            click; the history got them to trust.&rdquo;
            <br />
            <span className="text-xs text-gray-400 not-italic">
              — HarborPointPress, on the Indie Hackers post-mortem
            </span>
          </p>

          <h3 className="text-base font-semibold text-gray-200 mt-6 mb-3">
            4. Treat Product Hunt as a passive listing, not a binary launch
            event
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            The healthiest reframe of the entire thread. The spike model is
            dead unless you already have an audience. The page exists. New
            content all points at the existing PH page and lets it accrete
            backlinks. Distribution is upstream of the launch and sustained
            over months, not concentrated on one day.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 italic">
            &ldquo;PH treats a relaunch as a downranked listing. The signal
            that matters internally is first-launch velocity, and once
            that&apos;s spent the page just sits as a passive SEO asset.
            Re-listing in five days dilutes the URL you already have. The
            better play: leave the page alone, point all new content at it as
            the canonical hub, and let it accrete backlinks.&rdquo;
            <br />
            <span className="text-xs text-gray-400 not-italic">
              — davidamoroso, on the Indie Hackers post-mortem
            </span>
          </p>

          <h3 className="text-base font-semibold text-gray-200 mt-6 mb-3">
            5. The B2B trust gap I did not price in
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Anonymous handle, no LinkedIn personal, no IRL conversations about
            the product. All deliberate calls. Editorial filter for B2B is
            rational about this: an anonymous handle with zero network history
            is an accurate signal that the buyer cannot yet verify who is
            curating the data.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 italic">
            &ldquo;PH editorial didn&apos;t just reject a product. It rejected
            a B2B product without B2B trust signals. The same product with a
            named founder, a LinkedIn with 500+ connections, or a single
            reference customer would have passed a different filter even with
            identical completeness. This reframes the relist strategy: the SSRN
            paper isn&apos;t just a new hook, it&apos;s a trust signal that
            compensates for the anonymity gap.&rdquo;
            <br />
            <span className="text-xs text-gray-400 not-italic">
              — aegiswizard, on the Indie Hackers post-mortem
            </span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What changed as a result
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed space-y-4">
            <p>
              <span className="text-gray-200 font-medium">
                Friday relist held.
              </span>{" "}
              The original PH page is the canonical hub. Re-listing without
              resolving the editorial issue would just produce a second
              silence. Every new content surface (this story, the SSRN paper,
              the MCP server) points at the existing page.
            </p>
            <p>
              <span className="text-gray-200 font-medium">
                MCP angle is now the lead.
              </span>{" "}
              Show HN with the{" "}
              <Link
                href="/install"
                className="text-sky-400 hover:text-sky-300 underline"
              >
                free MCP install
              </Link>{" "}
              as the lead next week. The dashboard becomes the upgrade path,
              not the hook.
            </p>
            <p>
              <span className="text-gray-200 font-medium">
                Methodology paper as the credibility anchor.
              </span>{" "}
              Lead with the paper, follow with the technical install, list the
              product last. Buyers de-anonymize in stages: academic credential,
              technical try, product commitment. The order matters.
            </p>
            <p>
              <span className="text-gray-200 font-medium">
                Post-mortems are the distribution.
              </span>{" "}
              The willingness to publish zeros turned a failed launch into a
              credibility asset that the polished launch could not have
              produced. This page exists because of that.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Receipts (the things you can verify yourself)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/methodology"
              className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700 transition-colors"
            >
              <p className="text-sky-400 text-sm font-medium">
                Methodology →
              </p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                The full signal definition and the 47-day median lead-time
                analysis. SSRN paper linked from here.
              </p>
            </Link>
            <Link
              href="/research"
              className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700 transition-colors"
            >
              <p className="text-sky-400 text-sm font-medium">Research →</p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Thirty research findings cited from the SSRN paper. Read them
                free, no sign-up.
              </p>
            </Link>
            <Link
              href="/install"
              className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700 transition-colors"
            >
              <p className="text-sky-400 text-sm font-medium">
                Install (MCP) →
              </p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                <code className="text-gray-300">
                  npx @gitdealflow/mcp-signal
                </code>
                . Five free tools, runs in Cursor or Claude Desktop. Ten
                minutes from install to first signal.
              </p>
            </Link>
            <Link
              href="/predict"
              className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700 transition-colors"
            >
              <p className="text-sky-400 text-sm font-medium">Predict →</p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                The forward-looking prediction game. Call whether a startup
                raises a Series A in six months. Public leaderboard.
              </p>
            </Link>
            <Link
              href="/receipts"
              className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700 transition-colors"
            >
              <p className="text-sky-400 text-sm font-medium">Receipts →</p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                The backwards-looking version. Paste your GitHub username, see
                which unicorns you starred early.
              </p>
            </Link>
            <Link
              href="/citations"
              className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700 transition-colors"
            >
              <p className="text-sky-400 text-sm font-medium">Citations →</p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Cross-graph map of every external citation, dataset mirror, and
                academic index this product appears in.
              </p>
            </Link>
          </div>
        </section>

        {/* THE FAIL STORY — Brunson 4 core story lines (Expert Secrets Ch 9).
            Origin / customer / Big Domino we already have; this is the
            missing fourth: the failure-and-shift story that earns belief
            by showing what went wrong before it went right. */}
        <section className="mb-10 rounded-xl border border-rose-700/30 bg-rose-950/10 p-6 sm:p-7 space-y-4">
          <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
            The deal I missed
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            Before the dataset existed, I trusted the deck. Once.
          </h2>
          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
            <p>
              In 2023 a small dev-tool company landed in my inbox via a warm
              intro. Solid deck. Familiar logos in the &ldquo;customers&rdquo; row.
              Founder seemed sharp on a 30-minute call. The check would have
              been €10k. I passed because the deck didn&rsquo;t convince me
              the engineering team could ship the next eighteen months of
              roadmap.
            </p>
            <p>
              Eleven months later the same company raised at a 9× valuation
              from a name-brand fund. The roadmap had shipped. The team had
              tripled. Their public GitHub had been telling that story the
              entire time — five new repos, a 4× contributor expansion, and a
              clean velocity curve I would have read in two minutes if I had
              known to look.
            </p>
            <p>
              The deck was the lagging indicator. The code was the leading one.
              I&rsquo;d optimised for the wrong source of truth. The product
              that exists now is the version of the tool I wish had existed
              the day that intro hit my inbox.
            </p>
            <p className="italic text-rose-300/80 pt-2 border-t border-rose-900/40">
              That deal is the reason this is built around <strong>commit velocity</strong>,
              not pitch deck quality.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What is next
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            The launch was one bet of seven this week. The post-mortem turned
            into the eighth. The next surfaces are the dev.to long-form, the
            Show HN with the MCP angle as the lead, and the Reddit follow-ups
            in the same subreddits where the build-in-public threads already
            live.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            None of these will produce a featured Product Hunt placement. None
            of them need to. The distribution that actually works for this
            product is sustained over months and lives upstream of any single
            launch day.
          </p>
        </section>

        <section className="mb-2 rounded-lg border border-sky-900 bg-sky-950/30 p-6">
          <h2 className="text-base font-semibold text-gray-100 mb-2">
            Try the thing the post-mortem said worked
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            The MCP install was the conversion the launch could not produce.
            Ten minutes from install to first signal. Free. No sign-up. Works
            in Cursor, Claude Desktop, or any MCP-compatible client.
          </p>
          <code className="block bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sky-300 text-sm font-mono mb-4">
            npx @gitdealflow/mcp-signal
          </code>
          <Link
            href="/install"
            className="inline-block bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
          >
            Install instructions →
          </Link>
        </section>
      </div>
    </>
  );
}
