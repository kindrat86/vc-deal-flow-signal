import type { Metadata } from "next";
import Link from "next/link";
import { LAUNCHES, type PLCStage } from "@/content/launches";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Launches — Jeff Walker PLF, the four-stage way",
  description:
    "Active and archived launches. Each entry is a 4-stage Product Launch Funnel: Sideways Story, Ownership Experience, Internal Struggle, Big Idea (Open Cart).",
  alternates: { canonical: "/launch" },
  openGraph: {
    title: "Launches — VC Deal Flow Signal",
    description:
      "Active and archived launches. Each entry is a 4-stage Product Launch Funnel — Sideways Story, Ownership Experience, Internal Struggle, Big Idea.",
    type: "article",
    url: `${SITE}/launch`,
  },
};

export const dynamic = "force-static";

const PLC_LABELS: Record<PLCStage, string> = {
  "sideways-story": "Sideways Story",
  "ownership-experience": "Ownership Experience",
  "internal-struggle": "Internal Struggle",
  "big-idea": "Big Idea",
};

const PLC_DESCRIPTION: { plc: PLCStage; what: string }[] = [
  {
    plc: "sideways-story",
    what:
      "The bigger opportunity, why this matters now. Frames the shift the buyer is missing.",
  },
  {
    plc: "ownership-experience",
    what:
      "What it actually feels like to own the result. The Sunday morning, the dashboard open, the rhythm.",
  },
  {
    plc: "internal-struggle",
    what:
      "The doubts the buyer brings to the page. We name them, then dissolve them on the record.",
  },
  {
    plc: "big-idea",
    what:
      "The offer, the window, the cart. Specific spots, specific dates, specific math.",
  },
];

export default function LaunchIndex() {
  const open = LAUNCHES.filter((l) => l.isOpen);
  const closed = LAUNCHES.filter((l) => !l.isOpen);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/launch#collection`,
        name: "Launches — VC Deal Flow Signal",
        description:
          "Active and archived 4-stage Product Launch Funnels (Jeff Walker PLF).",
        url: `${SITE}/launch`,
        hasPart: LAUNCHES.map((l) => ({
          "@type": "Article",
          name: l.headline,
          url: `${SITE}/launch/${l.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Launches",
            item: `${SITE}/launch`,
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
      <AgentMirrorLinks path="/launch" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-3">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            Product Launches · Jeff Walker PLF
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Every launch, with the cart open or the window closed.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Each entry below is a 4-stage Product Launch Funnel — Jeff
            Walker&rsquo;s canonical sequence. Sideways Story, Ownership
            Experience, Internal Struggle, Big Idea. Permanent record so you
            can see the offer that was on the table when the window was
            open.
          </p>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-950/30 p-5 space-y-4">
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
            The four stages, in plain English
          </p>
          <ol className="grid sm:grid-cols-2 gap-3 list-none pl-0">
            {PLC_DESCRIPTION.map((d, i) => (
              <li
                key={d.plc}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 space-y-1"
              >
                <p className="text-sky-300 text-[11px] font-semibold uppercase tracking-wider">
                  Stage {i + 1} · {PLC_LABELS[d.plc]}
                </p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {d.what}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* PRE-LAUNCH RAISE-YOUR-HAND — Brunson DotCom Secrets Ch 22 audit fix
            2026-05-09 (push 94→100): "Could add explicit pre-launch
            'raise your hand' segmentation." Pre-launch list captures intent
            BEFORE the launch window opens, lets the buyer self-segment by
            track, and primes a hot list when the cart goes live. Three
            tracks because we're running three concurrent launch archetypes:
            Agent Credits (per-call API tier), Sector Sweep (€1,997 cohort),
            and Charter Cohort (Insider €77/mo founding-member tier). The
            radio-segmentation pre-qualifies the buyer; when the cart opens
            they get the right launch in their inbox, not a blanket blast. */}
        <section
          aria-label="Pre-launch raise-your-hand — get notified when the next cart opens"
          className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-7 space-y-5"
        >
          <div className="space-y-2">
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              Raise your hand · Pre-launch list
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
              Want to know when the next cart opens? Tell us which one.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              We run three concurrent launch tracks — Agent Credits,
              Sector Sweep, Charter Cohort. Each opens on its own
              cadence. Pick which one (or all three) and we&rsquo;ll
              email you the moment that specific cart opens. No
              broadcast blasts; no &ldquo;here&rsquo;s a launch you
              don&rsquo;t care about&rdquo; — only the track you
              raised your hand for.
            </p>
          </div>

          <form
            action="/api/launch/raise-hand"
            method="POST"
            className="space-y-4"
          >
            <fieldset className="space-y-2.5">
              <legend className="text-gray-200 text-xs font-semibold uppercase tracking-wider mb-1">
                Which track(s) — pick one or more
              </legend>
              <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3 hover:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="tracks"
                  value="agent-credits"
                  className="mt-1 accent-amber-400"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-100 font-semibold text-sm leading-snug">
                    Agent Credits
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed mt-0.5">
                    Per-call API + MCP tier for autonomous diligence
                    agents. €0.19 USDC per deep-signal call. For
                    builders running Claude/GPT-class agents against
                    the dataset.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3 hover:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="tracks"
                  value="sector-sweep"
                  className="mt-1 accent-amber-400"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-100 font-semibold text-sm leading-snug">
                    Sector Sweep · €1,997 cohort
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed mt-0.5">
                    8 slots per quarter. 40-page custom deep-dive on
                    the sector you pick. For partners who want a
                    written artefact, not a recurring dashboard.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3 hover:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="tracks"
                  value="charter-cohort"
                  className="mt-1 accent-amber-400"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-100 font-semibold text-sm leading-snug">
                    Charter Cohort · Insider €77/mo
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed mt-0.5">
                    Founding-member rate locked through Q4 2026.
                    Monthly Insider Drop, full archive, leaderboard
                    access. Doors open Mon → Thu every cohort.
                  </p>
                </div>
              </label>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-gray-200 text-xs font-semibold uppercase tracking-wider mb-1">
                Buyer archetype (helps us tailor the launch email)
              </legend>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { value: "solo-angel", label: "Solo angel · €5k–€50k checks" },
                  { value: "fund-partner", label: "Fund partner · €100k–€2M" },
                  { value: "operator", label: "Operator / GP / corp-dev" },
                  { value: "builder", label: "Builder / agent-developer" },
                  { value: "other", label: "Other / just curious" },
                ].map((a) => (
                  <label
                    key={a.value}
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 hover:border-slate-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="archetype"
                      value={a.value}
                      className="accent-amber-400"
                    />
                    <span className="text-gray-200 text-xs leading-snug">
                      {a.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="space-y-2">
              <label
                htmlFor="raise-hand-email"
                className="block text-gray-200 text-xs font-semibold uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="raise-hand-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@yourfund.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input type="hidden" name="utm_source" value="launch-index" />
              <input type="hidden" name="utm_medium" value="organic" />
              <input type="hidden" name="utm_campaign" value="raise-hand-2026" />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 transition-colors"
            >
              Add me to the pre-launch list →
            </button>
          </form>

          <p className="text-gray-400 text-xs leading-relaxed border-t border-amber-900/40 pt-3">
            One email per cart-open, per track you raised your hand
            for. No broadcast blasts. Unsubscribe in one click. Same
            anonymity-preserving stack as the weekly digest — your
            email never appears on any public list, leaderboard, or
            attendee roster.
          </p>
        </section>

        {open.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              Cart open
            </h2>
            <div className="grid gap-4">
              {open.map((l) => {
                const liveVideoCount = l.stages.filter(
                  (s) => s.videoCue?.kind === "youtube",
                ).length;
                const cuedVideoCount = l.stages.filter(
                  (s) => s.videoCue?.kind === "scheduled",
                ).length;
                return (
                  <Link
                    key={l.slug}
                    href={`/launch/${l.slug}`}
                    className="group block rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 hover:border-amber-500/60 transition-colors"
                  >
                    <p className="text-amber-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
                      Launch open · closes{" "}
                      {new Date(l.closesAt)
                        .toUTCString()
                        .replace(":00 GMT", " UTC")}
                    </p>
                    <h3 className="text-gray-100 font-bold text-xl leading-snug group-hover:text-amber-200 transition-colors">
                      {l.headline}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      {l.hook}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {l.stages.map((s) => (
                        <span
                          key={s.n}
                          className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 px-2 py-0.5 text-[10px] font-semibold text-slate-300"
                        >
                          {s.n} · {PLC_LABELS[s.plc]}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-500 text-[11px] mt-2">
                      {liveVideoCount} live walkthrough
                      {liveVideoCount === 1 ? "" : "s"} ·{" "}
                      {cuedVideoCount} synthetic-voice render
                      {cuedVideoCount === 1 ? "" : "s"} cued
                    </p>
                    <p className="text-amber-300 text-sm mt-3 inline-flex items-center gap-1">
                      Read the launch <span aria-hidden>→</span>
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {closed.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Archive
            </h2>
            <div className="grid gap-3">
              {closed.map((l) => (
                <Link
                  key={l.slug}
                  href={`/launch/${l.slug}`}
                  className="block rounded-lg border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-600 transition-colors"
                >
                  <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
                    Closed
                  </p>
                  <h3 className="text-gray-100 font-semibold text-base leading-snug">
                    {l.headline}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                    {l.hook}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-gray-400 text-sm border-t border-slate-800 pt-5">
          See every door at{" "}
          <Link
            href="/funnels"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /funnels
          </Link>
          .
        </p>
      </div>
    </>
  );
}
