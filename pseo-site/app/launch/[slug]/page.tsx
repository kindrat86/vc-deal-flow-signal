import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLaunchBySlug,
  getAllLaunchSlugs,
  type Launch,
  type LaunchStage,
  type VideoCue,
} from "@/content/launches";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { withEditorialOverride } from "@/lib/metadata";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllLaunchSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const launch = getLaunchBySlug(slug);
  if (!launch) return {};
  return withEditorialOverride({
    title: `${launch.headline}`,
    description: launch.hook,
    alternates: { canonical: `/launch/${slug}` },
    openGraph: {
      title: launch.headline,
      description: launch.hook,
      type: "article",
      url: `${SITE}/launch/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: launch.headline,
      description: launch.hook,
    },
  });
}

function CountdownLine({ launch }: { launch: Launch }) {
  const closes = new Date(launch.closesAt);
  return (
    <p className="text-amber-200/90 text-xs font-mono mt-1">
      Cart closes {closes.toUTCString().replace(":00 GMT", " UTC")}
    </p>
  );
}

const PLC_BADGE: Record<
  LaunchStage["plc"],
  { label: string; tone: string }
> = {
  "sideways-story": {
    label: "Sideways Story",
    tone: "border-sky-500/40 bg-sky-950/40 text-sky-200",
  },
  "ownership-experience": {
    label: "Ownership Experience",
    tone: "border-emerald-500/40 bg-emerald-950/40 text-emerald-200",
  },
  "internal-struggle": {
    label: "Internal Struggle",
    tone: "border-rose-500/40 bg-rose-950/40 text-rose-200",
  },
  "big-idea": {
    label: "Big Idea, Open Cart",
    tone: "border-amber-500/40 bg-amber-950/40 text-amber-200",
  },
};

function VideoCueBlock({ cue }: { cue: VideoCue }) {
  if (cue.kind === "youtube" && cue.youtubeId) {
    const src = `https://www.youtube-nocookie.com/embed/${cue.youtubeId}?rel=0&modestbranding=1`;
    return (
      <figure className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <div
          className="relative w-full"
          style={{ paddingBottom: "56.25%" }}
        >
          <iframe
            src={src}
            title={cue.title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <figcaption className="px-4 py-3 border-t border-slate-800 space-y-1">
          <p className="text-gray-100 text-sm font-semibold">{cue.title}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{cue.caption}</p>
        </figcaption>
      </figure>
    );
  }

  // kind === "scheduled", render a placeholder card with the queue date.
  // Synthetic-voice render lands on the scheduledFor date via the Stadium-Pitch
  // GitHub Actions cron (Cartesia Theo + Remotion).
  const dateLabel = cue.scheduledFor
    ? new Date(cue.scheduledFor).toUTCString().replace(/ \d\d:\d\d:\d\d GMT/, "")
    : "soon";
  return (
    <figure className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-5 py-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 text-xs font-semibold">
          ▶
        </span>
        <div className="space-y-0.5">
          <p className="text-gray-100 text-sm font-semibold">{cue.title}</p>
          <p className="text-slate-400 text-xs">
            Synthetic walkthrough · {Math.round(cue.durationSeconds / 60)} min
            · cued for {dateLabel}
          </p>
        </div>
      </div>
      <p className="text-gray-400 text-xs leading-relaxed">{cue.caption}</p>
    </figure>
  );
}

export default async function LaunchPage({ params }: PageProps) {
  const { slug } = await params;
  const launch = getLaunchBySlug(slug);
  if (!launch) notFound();

  // VideoObject schema for every stage that has a youtube cue. Synthetic-only
  // (kind === "scheduled") cues are intentionally not advertised in schema
  // until the synthetic render is actually live, otherwise we publish a
  // ContentURL we can't yet honour.
  const videoObjects = launch.stages
    .filter((s) => s.videoCue?.kind === "youtube" && s.videoCue.youtubeId)
    .map((s) => {
      const cue = s.videoCue!;
      const id = cue.youtubeId!;
      return {
        "@type": "VideoObject",
        "@id": `${SITE}/launch/${slug}#video-stage-${s.n}`,
        name: cue.title,
        description: cue.caption,
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        contentUrl: `https://www.youtube.com/watch?v=${id}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
        uploadDate: "2026-05-06",
        duration: `PT${cue.durationSeconds}S`,
        inLanguage: "en-US",
      };
    });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}/launch/${slug}#article`,
        headline: launch.headline,
        description: launch.hook,
        articleBody: launch.stages.map((s) => s.body.join("\n\n")).join("\n\n"),
        datePublished: "2026-05-06",
        dateModified: "2026-05-08",
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
        mainEntityOfPage: `${SITE}/launch/${slug}`,
      },
      {
        "@type": "SoftwareApplication",
        name: launch.headline,
        description: launch.abstract,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: String(launch.priceEUR),
          priceCurrency: "EUR",
          url: launch.buyUrl,
          availability: launch.isOpen
            ? "https://schema.org/InStock"
            : "https://schema.org/Discontinued",
          priceValidUntil: launch.closesAt.slice(0, 10),
        },
      },
      {
        "@type": "HowTo",
        "@id": `${SITE}/launch/${slug}#howto`,
        name: `4-stage Product Launch Funnel, ${launch.headline}`,
        description:
          "Jeff Walker PLC sequence: Sideways Story → Ownership Experience → Internal Struggle → Big Idea (Open Cart).",
        step: launch.stages.map((s) => ({
          "@type": "HowToStep",
          position: s.n,
          name: PLC_BADGE[s.plc].label,
          text: s.headline,
          itemListElement: s.body.map((p, i) => ({
            "@type": "HowToDirection",
            position: i + 1,
            text: p,
          })),
        })),
      },
      ...videoObjects,
      {
        "@type": "FAQPage",
        mainEntity: launch.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Launch",
            item: `${SITE}/launch`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: launch.headline,
            item: `${SITE}/launch/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks canonical={`${SITE}/launch/${slug}`} languages={{}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/launch/${slug}`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          {launch.isOpen && (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/30 px-3 py-1 text-amber-200 text-[11px] font-semibold uppercase tracking-wider">
              <span aria-hidden>★</span>
              Launch window open
            </div>
          )}
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            Product Launch · Jeff Walker PLF
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {launch.headline}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {launch.hook}
          </p>
          {launch.isOpen && <CountdownLine launch={launch} />}
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Abstract
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {launch.abstract}
          </p>
        </section>

        <nav
          aria-label="The four PLC stages"
          className="rounded-xl border border-slate-800 bg-slate-950/30 p-4"
        >
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-3">
            The four stages, Jeff Walker PLF
          </p>
          <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2 list-none pl-0">
            {launch.stages.map((s) => {
              const badge = PLC_BADGE[s.plc];
              return (
                <li key={s.n}>
                  <a
                    href={`#stage-${s.n}`}
                    className={`block rounded-lg border ${badge.tone} px-3 py-2 text-[11px] font-semibold leading-tight hover:brightness-125 transition`}
                  >
                    <span className="opacity-70">Stage {s.n}</span>
                    <br />
                    {badge.label}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <ol className="space-y-12 list-none pl-0">
          {launch.stages.map((stage) => {
            const badge = PLC_BADGE[stage.plc];
            return (
              <li
                key={stage.n}
                id={`stage-${stage.n}`}
                className="space-y-5 scroll-mt-24"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-500/40 bg-sky-950/40 text-sky-300 font-bold text-sm">
                    {stage.n}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border ${badge.tone} px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider`}
                  >
                    {badge.label}
                  </span>
                  <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
                    {stage.caption}
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
                  {stage.headline}
                </h2>
                {stage.videoCue && <VideoCueBlock cue={stage.videoCue} />}
                <div className="space-y-4 text-gray-300 text-base leading-relaxed">
                  {stage.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5">
          <div>
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              The Stack
            </p>
            <h2 className="text-2xl font-bold text-gray-100">
              What you get when you buy in this window.
            </h2>
          </div>
          <ul className="space-y-3">
            {launch.stack.map((item) => (
              <li
                key={item.label}
                className="flex items-start gap-3 border-b border-slate-800/60 pb-3 last:border-b-0 last:pb-0"
              >
                <span className="text-amber-300 font-bold shrink-0 mt-0.5">
                  →
                </span>
                <div className="flex-1 flex flex-wrap items-baseline gap-x-4 gap-y-1 justify-between">
                  <p className="text-gray-100 font-semibold text-sm">
                    {item.label}
                  </p>
                  <p className="text-gray-400 text-xs font-mono shrink-0">
                    {item.standalone}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-700 pt-4 space-y-1.5">
            <p className="text-gray-400 text-sm">
              Standalone value:{" "}
              <span className="text-gray-200 font-semibold">
                {launch.standaloneTotal}
              </span>
            </p>
            <p className="text-gray-200 text-base font-semibold">
              Launch price:{" "}
              <span className="text-amber-300">{launch.launchPrice}</span>
            </p>
            <p className="text-gray-400 text-xs">
              After window: {launch.postLaunchPrice}
            </p>
          </div>
          {launch.isOpen ? (
            <a
              href={launch.buyUrl}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/30 transition-colors"
            >
              {launch.ctaLabel}
            </a>
          ) : (
            <p className="text-gray-400 text-sm">
              Launch window is closed. Standard pricing now applies, see{" "}
              <Link
                href="/pricing"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                /pricing
              </Link>
              .
            </p>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {launch.faq.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        <p className="text-gray-400 text-sm border-t border-slate-800 pt-5">
          See every door into VC Deal Flow Signal at{" "}
          <Link
            href="/funnels"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /funnels
          </Link>
          {" "}or read the{" "}
          <Link
            href="/walkthrough"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            12-minute walkthrough
          </Link>
          .
        </p>
      </div>
    </>
  );
}
