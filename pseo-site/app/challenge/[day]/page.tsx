import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import {
  CHALLENGE_DAYS,
  getChallengeDay,
  getNextDay,
  getPrevDay,
} from "@/content/challenge-curriculum";

// SSG, one static page per challenge day. Permalinks let subscribers
// re-consult outside the email and let the curriculum index in search.
export function generateStaticParams() {
  return CHALLENGE_DAYS.map((d) => ({ day: d.slug }));
}

type Params = Promise<{ day: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { day: slug } = await params;
  const d = getChallengeDay(slug);
  if (!d) return { title: "Challenge, Not found" };

  const title = `Day ${d.day}, ${d.title} | 30-Day Deal Flow Reset Challenge`;
  return {
    title,
    description: `${d.oneLine} ${d.whyItMatters.slice(0, 120)}…`,
    alternates: { canonical: `/challenge/${d.slug}` },
    openGraph: {
      title,
      description: d.oneLine,
      url: `https://signals.gitdealflow.com/challenge/${d.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      site: "@sipiteno",
      title,
      description: d.oneLine,
    },
  };
}

export default async function ChallengeDayPage({
  params,
}: {
  params: Params;
}) {
  const { day: slug } = await params;
  const d = getChallengeDay(slug);
  if (!d) notFound();

  const prev = getPrevDay(d.day);
  const next = getNextDay(d.day);
  const isLastDay = d.day === CHALLENGE_DAYS.length;
  const isPhaseEnd = d.day === 7 || d.day === 14 || d.day === 21;
  const phaseLabel: Record<typeof d.phase, string> = {
    learn: "Week 1, Learn",
    apply: "Week 2, Apply",
    synthesize: "Week 3, Synthesize",
    operationalize: "Week 4, Operationalize",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        name: `Day ${d.day}, ${d.title}`,
        description: d.whyItMatters,
        learningResourceType: "Lesson",
        educationalLevel: "Practitioner",
        timeRequired: "PT5M",
        teaches: d.title,
        isPartOf: {
          "@type": "Course",
          name: "30-Day Deal Flow Reset Challenge",
          url: "https://signals.gitdealflow.com/challenge",
        },
        url: `https://signals.gitdealflow.com/challenge/${d.slug}`,
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "HowTo",
        name: `${d.title}, 5-minute exercise`,
        description: d.oneLine,
        totalTime: "PT5M",
        step: d.procedure.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text: step,
        })),
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
            name: "Challenge",
            item: "https://signals.gitdealflow.com/challenge",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `Day ${d.day}, ${d.title}`,
            item: `https://signals.gitdealflow.com/challenge/${d.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks
        path={`/challenge/${d.slug}`}
        qaCategory="methodology"
      />
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
          <Link
            href="/challenge"
            className="hover:text-gray-300 transition-colors"
          >
            Challenge
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">
            Day {d.day}, {d.title}
          </span>
        </nav>

        {/* Progress dots, "where you are in the journey" device.
            Compact 30-day layout with extra spacing every 7 days to visually
            separate the four week-phases (learn / apply / synthesize /
            operationalize). Current day highlighted, past days emerald,
            future days slate. */}
        <div
          className="flex items-center flex-wrap gap-1 mb-8"
          aria-label={`Progress: day ${d.day} of ${CHALLENGE_DAYS.length}`}
        >
          {CHALLENGE_DAYS.map((cd) => (
            <Link
              key={cd.day}
              href={`/challenge/${cd.slug}`}
              aria-label={`Go to day ${cd.day}, ${cd.title}`}
              className={`h-2 rounded-full transition-all ${
                cd.day === d.day
                  ? "w-6 bg-sky-400"
                  : cd.day < d.day
                    ? "w-2 bg-emerald-500/60 hover:bg-emerald-400"
                    : "w-2 bg-slate-700 hover:bg-slate-600"
              } ${cd.day % 7 === 1 && cd.day > 1 ? "ml-3" : ""}`}
            />
          ))}
          <span className="text-gray-500 text-xs ml-3 font-mono">
            {d.day} / {CHALLENGE_DAYS.length}
          </span>
        </div>

        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">
            {phaseLabel[d.phase]} · Day {d.day} of {CHALLENGE_DAYS.length}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
            Day {d.day}: {d.title}
          </h1>
          <p className="text-sky-300 text-base leading-relaxed font-medium">
            {d.oneLine}
          </p>
        </header>

        {/* Yesterday recap (Brunson serial-continuity device, "the
            cliffhanger pickup"). Skipped on Day 1. */}
        {d.yesterdayRecap ? (
          <section
            className="mb-8 rounded-lg border border-slate-800 bg-slate-900/60 px-5 py-4"
            aria-label="Yesterday recap"
          >
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
              Yesterday
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {d.yesterdayRecap}
            </p>
          </section>
        ) : (
          <section
            className="mb-8 rounded-lg border border-slate-800 bg-slate-900/60 px-5 py-4"
            aria-label="Day 1 starting frame"
          >
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
              Where this starts
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Pick one startup before you read further. Any one. A founder you
              met, a company you almost-invested in, a portfolio org you want to
              monitor. Have its GitHub URL ready, every signal in the
              following six days runs against the same org you pick today.
            </p>
          </section>
        )}

        <section className="mb-8" aria-label="Why this signal matters">
          <h2 className="text-gray-100 font-semibold text-lg mb-3">
            Why this signal matters
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {d.whyItMatters}
          </p>
        </section>

        <section
          className="mb-8 rounded-xl border border-sky-700/40 bg-sky-950/20 p-6"
          aria-label="The 5-minute exercise"
        >
          <h2 className="text-sky-300 text-sm font-medium mb-4 uppercase tracking-wider">
            The 5-minute exercise
          </h2>
          <ol className="space-y-3 text-gray-200 text-sm leading-relaxed">
            {d.procedure.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8" aria-label="What you're filtering for">
          <h2 className="text-gray-100 font-semibold text-lg mb-3">
            What you&rsquo;re filtering for
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">{d.filterFor}</p>
        </section>

        <section className="mb-8" aria-label="Edge case">
          <h2 className="text-gray-100 font-semibold text-lg mb-3">
            Edge case
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">{d.edgeCase}</p>
        </section>

        {d.bonus ? (
          <section
            className="mb-8 rounded-lg border border-amber-700/40 bg-amber-950/20 px-5 py-4"
            aria-label="Bonus"
          >
            <p className="text-amber-300 text-xs font-medium uppercase tracking-wider mb-2">
              Bonus
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{d.bonus}</p>
          </section>
        ) : null}

        {/* Tomorrow teaser, Brunson cliffhanger / open-loop. */}
        <section
          className="mb-12 rounded-lg border border-slate-800 bg-slate-900/60 px-5 py-4"
          aria-label="Tomorrow"
        >
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
            {isLastDay ? "What happens next" : "Tomorrow"}
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {d.tomorrowTeaser}
          </p>
        </section>

        {/* Day 30 graduation CTA, Stack-Slide close. */}
        {isLastDay ? (
          <section
            className="mb-10 rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-6 sm:p-8"
            aria-label="Graduation"
          >
            <h2 className="text-emerald-300 text-sm font-medium mb-2 uppercase tracking-wider">
              You&rsquo;ve finished the system
            </h2>
            <p className="text-gray-200 text-base leading-relaxed mb-5">
              Thirty days. Six atomic signals. One operational sourcing system -
              watchlist, weekly rhythm, alerts, share template, MCP integration,
              custom weights. Three optional ways to keep using it, pick none
              of them and the system stays yours.
            </p>
            <Link
              href="/challenge/done"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors"
            >
              See the three options →
            </Link>
          </section>
        ) : null}

        {/* Phase-boundary checkpoint (Days 7, 14, 21), celebrates the
            week, primes the next phase, keeps continuity. */}
        {isPhaseEnd && !isLastDay ? (
          <section
            className="mb-10 rounded-xl border border-sky-700/40 bg-sky-950/20 p-5"
            aria-label="Week checkpoint"
          >
            <p className="text-sky-300 text-xs font-medium mb-2 uppercase tracking-wider">
              Checkpoint, Week {Math.ceil(d.day / 7)} closes today
            </p>
            <p className="text-gray-200 text-sm leading-relaxed">
              You&rsquo;re {Math.round((d.day / CHALLENGE_DAYS.length) * 100)}% through.
              The full curriculum is permanent at every <code className="text-sky-300">/challenge/&lt;slug&gt;</code> URL -
              bookmark this page if you want to revisit the procedure later.
            </p>
          </section>
        ) : null}

        {/* Prev / next navigation. */}
        <nav
          className="flex flex-col sm:flex-row gap-3 mb-10"
          aria-label="Day navigation"
        >
          {prev ? (
            <Link
              href={`/challenge/${prev.slug}`}
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 px-4 py-3 transition-colors"
            >
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-0.5">
                ← Day {prev.day}
              </span>
              <span className="text-gray-200 text-sm font-medium">
                {prev.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/challenge"
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 px-4 py-3 transition-colors"
            >
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-0.5">
                ← Challenge
              </span>
              <span className="text-gray-200 text-sm font-medium">
                Back to landing
              </span>
            </Link>
          )}
          {next ? (
            <Link
              href={`/challenge/${next.slug}`}
              className="flex-1 rounded-lg border border-sky-700/40 bg-sky-950/20 hover:border-sky-600/60 px-4 py-3 transition-colors text-right"
            >
              <span className="text-sky-400 text-xs uppercase tracking-wider block mb-0.5">
                Day {next.day} →
              </span>
              <span className="text-gray-100 text-sm font-medium">
                {next.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/challenge/done"
              className="flex-1 rounded-lg border border-emerald-700/40 bg-emerald-950/20 hover:border-emerald-600/60 px-4 py-3 transition-colors text-right"
            >
              <span className="text-emerald-400 text-xs uppercase tracking-wider block mb-0.5">
                Graduation →
              </span>
              <span className="text-gray-100 text-sm font-medium">
                What&rsquo;s next
              </span>
            </Link>
          )}
        </nav>

        <p className="text-xs text-gray-400 text-center">
          Curriculum:{" "}
          <Link
            href="/challenge"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /challenge
          </Link>{" "}
          · Methodology:{" "}
          <Link
            href="/methodology"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /methodology
          </Link>{" "}
          · Paper:{" "}
          <a
            href="https://ssrn.com/abstract=6606558"
            target="_blank"
            rel="noopener"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            ssrn.com/abstract=6606558
          </a>
        </p>
      </div>
    </>
  );
}
