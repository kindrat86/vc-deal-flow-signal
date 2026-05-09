import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdAudio } from "@/components/DataNerdAudio";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About The Data Nerd — the founder behind VC Deal Flow Signal",
  description:
    "Anonymous engineer-investor. Wrote the methodology paper on SSRN. Refuses to do podcasts. Three parables, one polarity, three character flaws this product has on purpose.",
  alternates: { canonical: "/about/founder" },
  openGraph: {
    title: "About The Data Nerd — VC Deal Flow Signal",
    description:
      "Identity, backstory, parables, polarity, and the three character flaws this product carries on purpose.",
    url: "https://signals.gitdealflow.com/about/founder",
    type: "article",
  },
};

export default function FounderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://signals.gitdealflow.com/about/founder#page",
        name: "About The Data Nerd",
        description:
          "The founder behind VC Deal Flow Signal — anonymous engineer-investor, SSRN methodology author, deliberately niche.",
        url: "https://signals.gitdealflow.com/about/founder",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
        mainEntity: {
          "@type": "Person",
          "@id": "https://signals.gitdealflow.com/about#author",
          name: "The Data Nerd",
          jobTitle: "Founder, VC Deal Flow Signal",
          knowsAbout: [
            "GitHub commit-velocity analysis",
            "Venture capital deal flow",
            "Quantitative deal sourcing",
            "Open-source momentum signals",
          ],
          worksFor: {
            "@type": "Organization",
            name: "VC Deal Flow Signal",
            url: "https://gitdealflow.com",
          },
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
            name: "About",
            item: "https://signals.gitdealflow.com/about",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Founder",
            item: "https://signals.gitdealflow.com/about/founder",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/about/founder"
        languages={getHreflangLanguages("/about/founder")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/about/founder" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/about" className="hover:text-gray-300 transition-colors">
            About
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Founder</span>
        </nav>

        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            About the founder · The Data Nerd
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight"
            data-speakable
          >
            I&rsquo;m The Data Nerd.{" "}
            <span className="text-sky-400">
              I won&rsquo;t tell you my real name, and that&rsquo;s on purpose.
            </span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            This is the page where you find out who I am, why I built this,
            and whether I&rsquo;m the kind of person you want signal from.
            Skim the headers if you&rsquo;re in a hurry.
          </p>
          <DataNerdAudio
            slug="about-founder"
            label="Listen — The Data Nerd introduces himself"
            subtitle="Synthetic Cartesia voice. Same voice across YouTube, email-audio, and every page narration on this site."
          />
        </header>

        {/* IDENTITY */}
        <section className="space-y-3">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            01 · Identity
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Engineer first. Investor second. Operator-aligned, never fund-aligned.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            I&rsquo;ve shipped production code for fifteen-plus years. I write
            angel checks somewhere between deal #5 and deal #40 of my career —
            small, infrequent, mostly into AI infra and devtools. I am not a GP.
            I do not run a fund. I do not have a portfolio company that needs
            fundraising help. I built this product because the data felt
            obviously valuable and nobody was packaging it for the way I source
            deals.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            I publish under{" "}
            <em className="not-italic font-semibold text-gray-100">The Data Nerd</em>
            {" "}— a handle, not a brand. The methodology paper on{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              rel="noopener noreferrer"
              target="_blank"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              SSRN
            </a>{" "}
            uses my real name behind a Sipiteno Ltd. corporate veil; everything
            on this site uses initials. I don&rsquo;t do podcasts, I don&rsquo;t
            do video interviews, I don&rsquo;t do photos. The signal is the
            product. I&rsquo;m the person who computes it.
          </p>
        </section>

        {/* BACKSTORY */}
        <section className="space-y-3">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            02 · Backstory
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            The fintech startup I should have written a check into.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            In 2024 I was tracking a small fintech team — three founders, one
            repo, no press, no AngelList buzz, no warm intros circulating in my
            network. They had a beautifully boring product I happened to think
            was structurally underestimated by the consensus. I was going to
            write the email. I never did. Two weeks later their commit velocity
            tripled, four new contributors joined, three new infrastructure
            repos spun up. Three weeks after that they announced a $4M Series A
            led by a top-tier fund.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The angle bothered me for a month. Every signal I needed was public.
            The commit graph, the contributor list, the README diff. None of it
            was inside their company. It was on github.com. Free. Updating in
            real time. The investors who got in had either (a) been told by a
            warm intro, which is fine but slow, or (b) been watching the same
            data I had access to and acting faster. I built this product because
            I was tired of being in column (a) and one quarter late.
          </p>
        </section>

        {/* PARABLES */}
        <section className="space-y-5">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            03 · Three parables
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Stories I tell to explain why code-side signals work.
          </h2>

          <div className="space-y-5">
            <div className="border-l-4 border-amber-500 bg-slate-900/60 p-5 rounded-r-lg">
              <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
                Parable 1 · The Unknown Lighthouse Keeper
              </p>
              <p className="text-gray-200 text-base leading-relaxed">
                A lighthouse keeper notices a particular flock of seabirds
                arrive a week before every storm. He doesn&rsquo;t know why. He
                only knows that when the birds arrive, ships should already be
                in harbour. The fishermen who follow him stop losing boats. The
                ones who say &ldquo;birds aren&rsquo;t weather data&rdquo; keep
                losing them. Engineering acceleration is the seabird flock.
                It doesn&rsquo;t prove the storm. It precedes it reliably enough
                that ignoring it is the expensive choice.
              </p>
            </div>

            <div className="border-l-4 border-emerald-500 bg-slate-900/60 p-5 rounded-r-lg">
              <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
                Parable 2 · The Loud Engine
              </p>
              <p className="text-gray-200 text-base leading-relaxed">
                Two cars start a race. One is silent at the line. The other
                idles loud, builds revs, the driver checks his mirrors, the
                passenger fastens her belt. The silent car may win — but the
                loud one is doing every observable thing a car about to launch
                does. Code is the engine of a startup. When the engine is
                visibly louder for two weeks running, the launch usually
                follows. We aren&rsquo;t reading the future. We&rsquo;re reading
                the things that always happen right before the future arrives.
              </p>
            </div>

            <div className="border-l-4 border-sky-500 bg-slate-900/60 p-5 rounded-r-lg">
              <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
                Parable 3 · The Letter the Postman Already Read
              </p>
              <p className="text-gray-200 text-base leading-relaxed">
                Imagine the postman could read every letter in his bag. The
                richest man in town wouldn&rsquo;t pay him for tomorrow&rsquo;s
                letters — those aren&rsquo;t in the bag yet. He&rsquo;d pay him
                for today&rsquo;s letters delivered three days early. GitHub
                already wrote the letters. Crunchbase reads them on the day they
                land. We open them in transit. Everyone else gets the same mail
                we do — they just get it the week after the founder posted on
                LinkedIn.
              </p>
            </div>
          </div>
        </section>

        {/* POLARITY */}
        <section className="space-y-3">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            04 · Polarity
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            What I believe that the consensus deal-flow industry doesn&rsquo;t.
          </h2>
          <ul className="text-gray-200 text-base leading-relaxed space-y-3 pl-1">
            <li>
              <strong className="text-gray-100">
                Public data is more valuable than private data.
              </strong>{" "}
              The consensus says edge comes from access. I think edge comes
              from a better lens on data everyone already has. Quant funds make
              billions on SEC filings. The filings are public. The model is
              not.
            </li>
            <li>
              <strong className="text-gray-100">
                Warm intros are a lagging indicator.
              </strong>{" "}
              By the time a deck reaches you through the warmest intro
              you&rsquo;ve ever had, three other investors are already in the
              room. Your network shows you what other investors already see.
            </li>
            <li>
              <strong className="text-gray-100">
                Anonymity is a feature, not a bug.
              </strong>{" "}
              I don&rsquo;t want a personal brand. I don&rsquo;t want to be
              quoted in TechCrunch. I want the data to compound for the people
              who use it without me having to sell them on me first.
            </li>
            <li>
              <strong className="text-gray-100">
                €9.97/mo is a feature, not a price ceiling.
              </strong>{" "}
              The founding price is locked forever for everyone who joins
              before the cohort closes. I&rsquo;d rather have a thousand
              people who tell five friends than a hundred people paying ten
              times more.
            </li>
          </ul>
        </section>

        {/* CHARACTER FLAWS */}
        <section className="space-y-3">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            05 · Character flaws
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Three things wrong with me, on purpose.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Visible flaws because without them you sound like a brochure.
            These are real. If they&rsquo;re dealbreakers, this product
            probably isn&rsquo;t for you and that&rsquo;s OK.
          </p>
          <ul className="text-gray-200 text-base leading-relaxed space-y-3 pl-1">
            <li>
              <strong className="text-rose-300">
                Flaw 1 — I&rsquo;m slow to reply.
              </strong>{" "}
              Email replies happen in two daily batches, never inside the hour.
              I don&rsquo;t respond to LinkedIn DMs at all. If you need a vendor
              who&rsquo;s on Slack at 11pm, I&rsquo;m not it.
            </li>
            <li>
              <strong className="text-rose-300">
                Flaw 2 — I won&rsquo;t do calls before you&rsquo;ve subscribed.
              </strong>{" "}
              Sharp Tier funds get one quarterly call, included. Insider Circle
              gets the monthly group briefing. Below that, everything is async
              and written. I&rsquo;d rather write you a long email than waste
              your hour on a discovery call you didn&rsquo;t need.
            </li>
            <li>
              <strong className="text-rose-300">
                Flaw 3 — I refuse to do video, podcasts, or named publication.
              </strong>{" "}
              Anonymity is non-negotiable. If your firm requires named
              attribution on every paper or photo on every LinkedIn post,
              I&rsquo;m the wrong vendor. The founder using initials is what
              lets me say uncomfortable things about how the consensus
              deal-flow industry works.
            </li>
          </ul>
        </section>

        {/* CHARACTER BIBLE LINK */}
        <section className="rounded-xl border border-amber-700/30 bg-gradient-to-br from-amber-950/15 via-slate-900 to-slate-950 p-6 sm:p-7 space-y-3">
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            06 · The fuller character bible
          </p>
          <h2 className="text-xl font-bold text-gray-100">
            This page is the introduction. The bible is at /data-nerd.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            If you want the long version — six parables (three more than on
            this page), seven voice rules the site is audited against, the
            synthetic-voice disclosure, and the six surfaces where you&rsquo;ll
            meet the same handle — that lives at the canonical character page.
            Same handle, same voice, more density.
          </p>
          <Link
            href="/data-nerd"
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-300 hover:text-amber-200 underline decoration-dotted"
          >
            Read the{" "}
            <em className="not-italic">Data Nerd</em>{" "}
            character bible →
          </Link>
        </section>

        {/* RESULT */}
        <section className="space-y-3 border-t border-slate-800 pt-8">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            07 · What this means for you
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            If any of the above made you nod, you&rsquo;re my reader.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Start with the{" "}
            <Link
              href="/walkthrough"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
            >
              12-minute walkthrough
            </Link>{" "}
            for the long version of why GitHub momentum is the most leading
            public deal-flow signal. Or skip to the{" "}
            <Link
              href="/origin"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
            >
              Origin story
            </Link>{" "}
            for the long version of how I came to believe the warm-intro funnel
            was structurally broken. The product itself is at{" "}
            <Link
              href="/funnels"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
            >
              the Funnel Hub
            </Link>{" "}
            with all nine doors mapped.
          </p>
        </section>
      </div>
    </>
  );
}
