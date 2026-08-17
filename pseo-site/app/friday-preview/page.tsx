import type { Metadata } from "next";
import Link from "next/link";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { getTopMoversThisWeek } from "@/lib/data";
import SqueezeForm from "../squeeze/SqueezeForm";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

/**
 * Brunson Best Bait, DotCom Secrets Ch 13.
 *
 * The "trailer for the Sunday digest." This page shows the SHAPE of
 * what's about to publish, sector, stage, velocity delta, signal type -
 * for the five orgs that will land in the Sunday digest at 09:00 UTC,
 * with the org names redacted. The only way to get the actual names is
 * to be subscribed when the digest sends.
 *
 * Brunson's rule of bait: bait works when it shows enough that the
 * visitor can verify the value, but not so much that they no longer
 * need to consume the offer. A redacted-but-shape-visible preview is
 * the trailer pattern, same engine output as the digest, name field
 * blurred, sector and metric stack fully visible.
 *
 * The page rebuilds with the dataset (revalidate: 1h via the static
 * data lifecycle), so on Friday at noon the preview reflects the same
 * top-5 the Sunday email will reveal. No special cron, no live data
 * fetch, pure static off the existing data pipeline.
 */
export const metadata: Metadata = withEditorialOverride({
  title: "Friday preview, what lands Sunday at 09:00 UTC",
  description:
    "Trailer for the Sunday digest. Sector, stage, velocity delta, signal type for the five orgs about to publish. Names redacted, subscribe to get the actual list.",
  alternates: { canonical: "/friday-preview" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Friday preview, Sunday's five, with names redacted",
    description:
      "See the shape of Sunday's digest before it ships. Subscribe free to get the actual names.",
    url: "https://signals.gitdealflow.com/friday-preview",
    type: "article",
  },
});

// Sector → stage band → velocity bucket → signal-type taxonomy. The
// Friday-noon trailer shows all four; org name is intentionally redacted.
function bucket(pct: number): string {
  if (pct >= 200) return "≥ +200% in 14 days";
  if (pct >= 100) return "+100-200% in 14 days";
  if (pct >= 50) return "+50-100% in 14 days";
  return "+30-50% in 14 days";
}

function stageBadge(stage: string): { color: string; bg: string; label: string } {
  const lower = stage.toLowerCase();
  if (lower.includes("seed") || lower.includes("pre-seed"))
    return { color: "text-emerald-300", bg: "bg-emerald-950/40 border-emerald-700/30", label: stage };
  if (lower.includes("series a"))
    return { color: "text-sky-300", bg: "bg-sky-950/40 border-sky-700/30", label: stage };
  if (lower.includes("series b") || lower.includes("series c"))
    return { color: "text-purple-300", bg: "bg-purple-950/40 border-purple-700/30", label: stage };
  return { color: "text-amber-300", bg: "bg-amber-950/40 border-amber-700/30", label: stage };
}

export default function FridayPreviewPage() {
  const top = getTopMoversThisWeek(5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/friday-preview#page",
        name: "Friday preview, Sunday's five, names redacted",
        url: "https://signals.gitdealflow.com/friday-preview",
        description:
          "Right-shaped-bait teaser surface, show the shape of the Sunday digest without revealing the names.",
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
            name: "Friday preview",
            item: "https://signals.gitdealflow.com/friday-preview",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/friday-preview"
        languages={getHreflangLanguages("/friday-preview")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/friday-preview" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-3">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Friday preview · Names land Sunday 09:00 UTC
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Sunday&rsquo;s five.{" "}
            <span className="text-amber-400">Names redacted</span>{" "}
            <span className="whitespace-nowrap">until 09:00 UTC.</span>
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Same engine output as the Sunday email, sector, stage, velocity
            delta, signal type, with the org names hidden. Subscribe free
            and the actual list lands in your inbox the moment the digest
            sends.
          </p>
        </header>

        <ol className="space-y-4">
          {top.map((mover, i) => {
            const stage = stageBadge(mover.stage);
            return (
              <li
                key={`${mover.sectorSlug}-${mover.name}-${i}`}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-3"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span
                      aria-hidden="true"
                      className="font-mono text-amber-400 font-bold text-lg shrink-0 w-6"
                    >
                      #{i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Org name
                      </p>
                      <p
                        aria-label="Org name redacted until Sunday 09:00 UTC"
                        className="text-gray-100 font-bold text-base sm:text-lg"
                      >
                        <span className="select-none px-3 py-1 rounded bg-slate-700/80 text-slate-700 tracking-[0.4em]">
                          ████████████
                        </span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${stage.bg} ${stage.color}`}
                  >
                    {stage.label}
                  </span>
                </div>

                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm pt-2 border-t border-slate-800">
                  <div>
                    <dt className="text-gray-400 text-[11px] uppercase tracking-wider mb-0.5">
                      Sector
                    </dt>
                    <dd className="text-gray-200 font-medium">
                      {mover.sectorName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-[11px] uppercase tracking-wider mb-0.5">
                      14-day velocity
                    </dt>
                    <dd className="text-amber-300 font-semibold">
                      {bucket(mover.velocityChangePct)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-[11px] uppercase tracking-wider mb-0.5">
                      Signal type
                    </dt>
                    <dd className="text-gray-200 font-medium">
                      {mover.signalType}
                    </dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ol>

        <section
          aria-label="Subscribe to get the actual names on Sunday"
          className="space-y-4"
        >
          <div className="space-y-1">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Get Sunday&rsquo;s actual names
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
              Subscribe free. Names land at 09:00 UTC on Sunday.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              The five org names, every repo URL, the engine&rsquo;s
              one-line read on each, delivered to your inbox the instant
              the digest sends. No card, one email a week, reply to
              unsubscribe.
            </p>
          </div>
          <SqueezeForm />
        </section>

        <aside className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-2">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Why redact?
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Show enough to let the buyer verify the value, but not so much
            that they no longer need to consume the offer. The shape of the
            digest IS the value preview, sector + stage + velocity-bucket +
            signal-type stack is the engine&rsquo;s actual output. Names are
            the payload. Trailer first, payload Sunday.
          </p>
        </aside>

        <p className="text-gray-400 text-sm border-t border-slate-800 pt-5 leading-relaxed">
          Want the full ranking now (not just five)?{" "}
          <Link
            href="/trending"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            Live ranked panel
          </Link>{" "}
          ·{" "}
          <Link
            href="/predicted"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            Acceleration Watch
          </Link>{" "}
          ·{" "}
          <Link
            href="/firstlook"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            €7 sector deep dive
          </Link>
          .
        </p>
      </div>
    </>
  );
}
