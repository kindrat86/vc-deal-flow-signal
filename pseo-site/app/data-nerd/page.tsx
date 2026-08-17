import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SeoCta from "@/components/SeoCta";
import {
  DATA_NERD_NAME,
  DATA_NERD_TAGLINE,
  DATA_NERD_BIO_MEDIUM,
  DATA_NERD_AUDIO_DISCLOSURE,
  DATA_NERD_POLARITY,
  DATA_NERD_VOICE_RULES,
  DATA_NERD_PARABLES,
  DATA_NERD_FLAWS,
  DATA_NERD_CATCHPHRASES,
  DATA_NERD_TOUCHPOINTS,
  DATA_NERD_PERSON_SCHEMA,
  DATA_NERD_ARCHETYPE,
  DATA_NERD_TRIBE,
  DATA_NERD_FUTURE_SELF,
  DATA_NERD_NOW,
} from "@/lib/data-nerd";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = withEditorialOverride({
  title: `${DATA_NERD_NAME}, character bible · VC Deal Flow Signal`,
  description:
    "The pseudonymous narrator behind VC Deal Flow Signal: identity archetype (Reluctant Reporter), backstory, six parables, eight polarities, three character flaws, seven voice rules, current weekly status, twelve-month commitments. Character bible, implemented under the anonymity rule.",
  alternates: { canonical: "/data-nerd" },
  openGraph: {
    title: `${DATA_NERD_NAME}`,
    description:
      "The pseudonymous narrator behind the methodology. Reluctant Reporter archetype, six parables, eight polarities, three flaws, twelve-month public commitments, character without a face.",
    url: "https://signals.gitdealflow.com/data-nerd",
    type: "profile",
  },
});

export default function DataNerdPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://signals.gitdealflow.com/data-nerd#page",
        name: `${DATA_NERD_NAME}, character bible`,
        description:
          "Pseudonymous narrator profile: backstory, parables, polarity, flaws, voice rules, and synthetic-voice disclosure.",
        url: "https://signals.gitdealflow.com/data-nerd",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
        mainEntity: DATA_NERD_PERSON_SCHEMA,
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
            name: DATA_NERD_NAME,
            item: "https://signals.gitdealflow.com/data-nerd",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/data-nerd"
        languages={getHreflangLanguages("/data-nerd")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/data-nerd" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{DATA_NERD_NAME}</span>
        </nav>

        <header className="space-y-4">
          <p className="text-amber-400 text-xs font-medium uppercase tracking-wider">
            Character bible (under the anonymity rule)
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight"
            data-speakable
          >
            I&rsquo;m {DATA_NERD_NAME}.{" "}
            <span className="text-amber-300">
              I&rsquo;m a handle, not a person, and that&rsquo;s the whole
              product.
            </span>
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            {DATA_NERD_BIO_MEDIUM}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            {DATA_NERD_TAGLINE}
          </p>
        </header>

        <section className="rounded-xl border border-amber-700/30 bg-amber-950/10 p-5 sm:p-6 space-y-3">
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            00 · Disclosure
          </p>
          <h2 className="text-xl font-bold text-gray-100">
            What &ldquo;handle, not a person&rdquo; actually means.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Behind the handle is one real engineer-investor. The handle exists
            because the methodology has to stand on whether the signal is real,
            not on whether the person delivering it is charismatic. You will
            never see my face. You will never hear my real voice. You will
            never see my real name on this site.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            What you will hear: a synthetic voice (Cartesia) reading every
            page narration, every YouTube short, every monthly founder talk.
            Same synthetic voice across every surface so the brand has rhythm
            even without a person. {DATA_NERD_AUDIO_DISCLOSURE}
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            What you will read: the same handle (&ldquo;{DATA_NERD_NAME}
            &rdquo;) signed at the bottom of every email, every page, every
            video script. Voice fragmentation breaks the character; one
            handle, every surface, forever. The methodology paper on{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              rel="noopener noreferrer"
              target="_blank"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
            >
              SSRN
            </a>{" "}
            uses my real name behind a Sipiteno Ltd. corporate veil; everything
            on this site uses the handle.
          </p>
        </section>

        {/* READER FRAMING, plain-English reassurance for the non-coding
            buyer (Marcus) BEFORE the dense character canon begins. The bible
            below is engineering-heavy by design; this box tells the reader
            they never have to decode it. Reuses the verbatim reassurance +
            tribe creed from lib/data-nerd. Additive scaffolding only. */}
        <section className="rounded-xl border border-sky-700/40 bg-sky-950/15 p-5 sm:p-6 space-y-3">
          <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider">
            Before you read on
          </p>
          <h2 className="text-xl font-bold text-gray-100">
            You never read a line of code, the read is done for you.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            This is the character bible, so it gets engineering-heavy below -
            merge graphs, regressions, contributor de-duplication, the lot.
            That&rsquo;s the engine. You only ever see the translated read.
            The creed of the people this is built for:{" "}
            <span className="text-sky-200 italic">
              &ldquo;{DATA_NERD_TRIBE.oneLine}&rdquo;
            </span>
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            So when a section gets technical, that&rsquo;s the machinery
            talking, not a quiz. Where the jargon runs thickest you&rsquo;ll
            see a{" "}
            <span className="text-sky-200 font-semibold">
              In plain English:
            </span>{" "}
            line that says the same thing the way a corp-dev partner would
            say it across a table.
          </p>
        </section>

        {/* ARCHETYPE, declares which of the four canonical character
            archetypes this character occupies. The reader places the voice
            on a recognisable map before reading another paragraph. */}
        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-7 space-y-3">
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            01 · Identity archetype
          </p>
          <h2 className="text-2xl font-bold text-gray-100" data-speakable>
            <span className="text-amber-300">{DATA_NERD_ARCHETYPE.label}.</span>{" "}
            {DATA_NERD_ARCHETYPE.oneLine}
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {DATA_NERD_ARCHETYPE.body}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-amber-700/40 pl-4">
            <strong className="text-amber-200">In contrast:</strong>{" "}
            {DATA_NERD_ARCHETYPE.contrast}
          </p>
          <details className="text-sm text-gray-400 leading-relaxed pt-1">
            <summary className="cursor-pointer text-amber-300 hover:text-amber-200 font-semibold">
              Three observable receipts
            </summary>
            <ul className="space-y-2 mt-3 pl-4">
              {DATA_NERD_ARCHETYPE.proof.map((p, i) => (
                <li
                  key={i}
                  className="border-l border-amber-700/30 pl-3"
                >
                  {p}
                </li>
              ))}
            </ul>
          </details>
        </section>

        {/* TRIBE, name the people the reader joins by self-identifying
            with the character. Brunson Expert Secrets Ch 3. */}
        <section className="space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            02 · The tribe
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            If you nod through this page, you&rsquo;re a{" "}
            <span className="text-sky-300">
              {DATA_NERD_TRIBE.name.slice(0, -1)}
            </span>
            .
          </h2>
          <p className="text-gray-300 text-base leading-relaxed italic">
            &ldquo;{DATA_NERD_TRIBE.oneLine}&rdquo;
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            {DATA_NERD_TRIBE.body}
          </p>
        </section>

        <section className="space-y-5">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            03 · Polarity ({DATA_NERD_POLARITY.length} positions)
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            What I believe that the consensus deal-flow industry doesn&rsquo;t.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Eight polarities. If you nod through all eight, you&rsquo;re my
            reader. If even one feels wrong, please save your money, this is
            the wrong product for you and that&rsquo;s honest.
          </p>
          <ul className="space-y-4">
            {DATA_NERD_POLARITY.map((p) => (
              <li
                key={p.n}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-amber-300 font-bold tabular-nums shrink-0">
                    {p.n}.
                  </span>
                  <p className="text-emerald-300 text-base font-bold leading-snug">
                    For: {p.for}
                  </p>
                </div>
                <p className="text-rose-300 text-sm font-semibold leading-snug pl-6">
                  Against: {p.against}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed pl-6">
                  {p.body}
                </p>
                {p.n === 2 && (
                  <p className="text-sky-200 text-sm leading-relaxed pl-6 border-l-2 border-sky-700/40 ml-0">
                    <span className="font-semibold">In plain English:</span>{" "}
                    the deck is what a company says about itself for the next
                    fundraise; what its engineers actually ship every day is
                    the truer story. You watch the work, not the pitch, and
                    you never have to open the work yourself.
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-5">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            04 · Six parables
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Stories I tell to explain why engineering signals work.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every core claim needs a parable that makes it feel obvious. These
            are the six I rotate through emails, videos, and the Sunday digest.
            Each one is also hyperlinkable at{" "}
            <Link
              href="/parables"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
            >
              /parables
            </Link>{" "}
            so you can send a single one to a friend without sending them
            this whole bible.
          </p>
          <ol className="space-y-5">
            {DATA_NERD_PARABLES.map((p, i) => (
              <li
                key={p.slug}
                id={p.slug}
                className="rounded-xl border-l-4 border-amber-500 bg-slate-900/60 p-5 space-y-3"
              >
                <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                  Parable {i + 1} ·{" "}
                  <Link
                    href={`/parables/${p.slug}`}
                    className="hover:text-amber-200 underline decoration-dotted"
                  >
                    {p.title}
                  </Link>
                </p>
                <p className="text-gray-100 text-base leading-relaxed">
                  {p.body}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed border-t border-slate-800 pt-3">
                  <strong className="text-emerald-300">Lesson:</strong>{" "}
                  {p.lesson}
                </p>
                {p.slug === "wrong-reader" && (
                  <p className="text-sky-200 text-sm leading-relaxed border-l-2 border-sky-700/40 pl-4">
                    <span className="font-semibold">In plain English:</span>{" "}
                    the team looked like it had suddenly tripled its output -
                    but it was just two teams&rsquo; work getting merged into
                    one place, not real new momentum. A reader who knew the
                    company caught it; we fixed the blind spot, and our
                    false-alarm rate dropped.
                  </p>
                )}
                {p.slug === "tuesday-regression" && (
                  <p className="text-sky-200 text-sm leading-relaxed border-l-2 border-sky-700/40 pl-4">
                    <span className="font-semibold">In plain English:</span>{" "}
                    I tinkered with how the scoring works, broke it, and
                    Wednesday&rsquo;s list put three companies on top that
                    didn&rsquo;t belong there. Readers told me; I traced it to
                    one small counting bug, fixed it, and posted exactly what
                    went wrong in public. You only ever saw the corrected
                    list and the post-mortem.
                  </p>
                )}
                <p className="text-xs">
                  <Link
                    href={`/parables/${p.slug}`}
                    className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
                  >
                    Standalone page →
                  </Link>
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            05 · Three flaws, on purpose
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            What&rsquo;s wrong with me, deliberately.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            A founder character without visible flaws reads as a brochure.
            These are real. If they&rsquo;re dealbreakers, I&rsquo;m the wrong
            vendor.
          </p>
          <ul className="space-y-3">
            {DATA_NERD_FLAWS.map((f, i) => (
              <li
                key={i}
                className="rounded-lg border border-rose-700/30 bg-rose-950/10 p-4"
              >
                <p className="text-rose-300 text-sm font-bold leading-snug mb-2">
                  Flaw {i + 1}, {f.label}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {f.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            06 · Seven voice rules
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            How every sentence on this site gets shaped before it ships.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            A consistent founder voice compounds across surfaces. These are the
            seven rules every page, email, and video script gets reviewed
            against. They&rsquo;re published so the reader can audit drift.
          </p>
          <ol className="space-y-3">
            {DATA_NERD_VOICE_RULES.map((r, i) => (
              <li
                key={i}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4"
              >
                <p className="text-emerald-300 text-sm font-bold leading-snug mb-2">
                  Rule {i + 1}, {r.rule}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {r.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            07 · Catchphrases
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Lines I repeat until the reader can repeat them back.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Founder voices have 5-7 verbal tells the audience can quote. These
            are mine. If you&rsquo;ve been reading for more than two months
            and one of these doesn&rsquo;t sound familiar, the voice has
            drifted and someone owes you a refund.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DATA_NERD_CATCHPHRASES.map((c, i) => (
              <li
                key={i}
                className="rounded-lg border border-amber-700/30 bg-amber-950/10 p-4"
              >
                <p className="text-amber-200 text-sm italic leading-relaxed">
                  &ldquo;{c}&rdquo;
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            08 · Where you&rsquo;ll meet me
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Six surfaces. One handle. Same voice.
          </h2>
          <ul className="space-y-3">
            {DATA_NERD_TOUCHPOINTS.map((t, i) => (
              <li
                key={i}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4"
              >
                <p className="text-emerald-300 text-sm font-bold leading-snug mb-1">
                  {t.surface}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed mb-1">
                  <strong className="text-gray-200">Where:</strong> {t.where}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  <strong className="text-gray-300">How:</strong> {t.how}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* NOW, link to the live status surface. */}
        <section className="rounded-xl border border-emerald-700/30 bg-gradient-to-br from-emerald-950/15 via-slate-900 to-slate-950 p-6 sm:p-7 space-y-3">
          <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
            09 · Live status, what I&rsquo;m doing this week
          </p>
          <h2 className="text-xl font-bold text-gray-100">
            Updated every Monday, {DATA_NERD_NOW.weekISO}.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            The Sunday digest covers broadcast cadence; the monthly{" "}
            <Link
              href="/state-of-github"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              State of GitHub
            </Link>{" "}
            address covers the long-form. The /now page is the in-between -
            five fields, five minutes, every Monday. The cadence IS the
            character.
          </p>
          <Link
            href="/now"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-300 hover:text-emerald-200 underline decoration-dotted pt-1"
          >
            Open the /now page →
          </Link>
        </section>

        {/* FUTURE SELF, public commitments graded May 2027. */}
        <section className="space-y-4 border-t border-slate-800 pt-8">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            10 · Twelve months from now
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Five public commitments. Graded {DATA_NERD_FUTURE_SELF.graderDate}.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            The character has to project a future or it&rsquo;s a static
            pose. These are the five public commits the narrator will be
            graded against on{" "}
            <span className="font-mono text-amber-200">
              {DATA_NERD_FUTURE_SELF.graderDate}
            </span>
            . Either kept or admitted-broken-with-reason. No third option.
          </p>
          <ol className="space-y-3">
            {DATA_NERD_FUTURE_SELF.twelveMonthCommit.map((c) => (
              <li
                key={c.n}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4"
              >
                <p className="text-amber-300 text-sm font-bold leading-snug mb-1">
                  Commit {c.n}, {c.label}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {c.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <SeoCta
          heading="If the voice landed, the cheapest next step is the free Sunday issue"
          blurb="Five breakout startups every Sunday, the engineering signal translated into plain English, 21 to 47 days before the deck circulates. No code-reading, no card."
          secondary={{ label: "Or test one sector, First Look €7 →", href: "/firstlook" }}
          signoff={false}
          className="mb-6"
        />

        <section className="rounded-xl border border-sky-700/40 bg-sky-950/15 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            11 · Where to go next
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            If you&rsquo;ve nodded through all of this, you&rsquo;re my reader.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Three doors, by commitment level:
          </p>
          <ul className="text-gray-200 text-base leading-relaxed space-y-2 pl-1 pt-2">
            <li>
              →{" "}
              <a
                href="https://gitdealflow.com/#signup"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted font-medium"
              >
                Subscribe to the Acceleration Watch (free, weekly Sunday)
              </a>
              . The cheap test of the voice. Five startups every Monday.
            </li>
            <li>
              →{" "}
              <Link
                href="/firstlook"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-medium"
              >
                Buy the First Look Pass (€7, 24-hour deep-dive on your sector)
              </Link>
              . The tripwire. First dollar.
            </li>
            <li>
              →{" "}
              <Link
                href="/walkthrough"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
              >
                Read the 12-minute walkthrough
              </Link>{" "}
              for the long-form sales argument. Same voice, more density.
            </li>
            <li>
              →{" "}
              <Link
                href="/manifesto"
                className="text-rose-300 hover:text-rose-200 underline decoration-dotted font-medium"
              >
                Read the Manifesto
              </Link>{" "}
              for the seven movement pillars and the named enemy.
            </li>
            <li>
              →{" "}
              <Link
                href="/origin"
                className="text-gray-300 hover:text-gray-100 underline decoration-dotted font-medium"
              >
                Read the Origin
              </Link>{" "}
the founder backstory, three false beliefs collapsed.
            </li>
            <li>
              →{" "}
              <Link
                href="/about/founder"
                className="text-gray-300 hover:text-gray-100 underline decoration-dotted font-medium"
              >
                Read the Founder page
              </Link>{" "}
same character, slightly different angle, with audio.
            </li>
          </ul>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Character framing drawn from direct-response sales canon.
          Implemented under the anonymity rule (manifesto pillar #4), handle,
          synthetic voice, methodology glyph, no real face/name/voice.
        </p>
      </div>
    </>
  );
}
