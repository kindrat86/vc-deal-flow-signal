import type { Metadata } from "next";
import Link from "next/link";
import { LAUNCHES, type PLCStage } from "@/content/launches";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Launches — Jeff Walker PLF, the four-stage way",
  description:
    "Active and archived launches. Each entry is a 4-stage Product Launch Funnel: Sideways Story, Ownership Experience, Internal Struggle, Big Idea (Open Cart).",
  alternates: { canonical: "/launch" },
  openGraph: {
    title: "Launches",
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

        <section className="rounded-xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Use this page if you want the full launch archive. But if your real question is current offers, where to start, or which paid lane fits this week, take the sharper routes first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/who-this-is-for" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 text-slate-950 text-sm font-semibold hover:bg-signal-600 transition-colors">
              Pick your starting lane →
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              See every paid layer →
            </Link>
            <Link href="/firstlook" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              See First Look →
            </Link>
          </div>
        </section>

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

        <DataNerdSignoff variant="default" className="mt-12" />
      </div>
    </>
  );
}
