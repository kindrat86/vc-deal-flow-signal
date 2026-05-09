import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import AnimatedDemo from "./AnimatedDemo";
import { videos } from "@/content/videos";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Watch — VC Deal Flow Signal in 90 seconds (silent demo)",
  description:
    "Silent visual walkthrough of the VC Deal Flow Signal engine. No audio, no narrator, no face. Just the dashboard breathing — commit velocity, contributor diversity, dependents graph, the composite score animating in real time.",
  alternates: { canonical: "/watch" },
  openGraph: {
    title: "Watch — VC Deal Flow Signal in 90 seconds (silent demo)",
    description:
      "Silent visual walkthrough of the VC Deal Flow Signal engine. No audio, no narrator. Dashboard breathing in real time.",
    type: "article",
    url: `${SITE}/watch`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch — VC Deal Flow Signal in 90 seconds",
    description:
      "Silent visual walkthrough. No audio, no narrator. Dashboard breathing in real time.",
  },
};

export const dynamic = "force-static";

export default function WatchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}/watch#article`,
        headline:
          "Watch — VC Deal Flow Signal in 90 seconds (silent visual demo)",
        description:
          "Silent visual walkthrough of the VC Deal Flow Signal engine — no audio, no narrator, no face. Just the dashboard breathing.",
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
        datePublished: "2026-05-06",
        dateModified: "2026-05-06",
        mainEntityOfPage: `${SITE}/watch`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Watch",
            item: `${SITE}/watch`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks canonical={`${SITE}/watch`} languages={{}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/watch" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-fuchsia-300 text-xs font-medium uppercase tracking-wider">
            Visual demo · No audio · No narrator · 90 seconds
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Watch the engine breathe.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            A silent visual walkthrough — no audio, no presenter, no face. Just
            the dashboard animating. Commit velocity climbs. Contributor count
            broadens. Dependents fan out. The composite score crosses the
            fundraise-precursor threshold. That&rsquo;s the whole product.
          </p>
        </header>

        <AnimatedDemo />

        {/* Video catalog — every video this site exposes, with chapters + transcripts */}
        <section
          className="rounded-xl border border-emerald-700/30 bg-emerald-950/10 p-6 space-y-4"
          aria-labelledby="catalog"
        >
          <h2 id="catalog" className="text-xl font-bold text-gray-100">
            Watch catalog — chapters &amp; transcripts
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every video this site exposes — the silent canvas demo above, the
            self-hosted MCP screencast, plus three synthetic-voice videos on
            the YouTube channel. Each catalog page carries Clip-schema chapters
            and the full transcript so the content is readable without watching.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm">
            {videos.map((v) => (
              <li
                key={v.slug}
                className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 hover:border-emerald-500/40 transition-colors"
              >
                <Link
                  href={`/watch/${v.slug}`}
                  className="text-sky-300 hover:text-sky-200 font-medium block mb-1"
                >
                  → {v.title.split("—")[0]?.trim() ?? v.title}
                </Link>
                <p className="text-xs text-slate-400">
                  {v.format === "short" ? "Short · 9:16" : "Long-form"} ·{" "}
                  {Math.floor(v.durationSeconds / 60)}:
                  {(v.durationSeconds % 60).toString().padStart(2, "0")} ·{" "}
                  {v.chapters.length} chapter{v.chapters.length === 1 ? "" : "s"}
                </p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 mt-2">
            Machine-readable catalog at{" "}
            <Link
              href="/api/v1/videos.json"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /api/v1/videos.json
            </Link>
            {" · "}
            sitemap at{" "}
            <Link
              href="/sitemap-videos.xml"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /sitemap-videos.xml
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-100">
            What you just watched
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300 text-sm leading-relaxed">
            <li>
              <strong className="text-gray-100">Commit velocity</strong> rising
              past the company&rsquo;s own 90-day baseline (1.3x is the
              acceleration threshold the SSRN panel uses).
            </li>
            <li>
              <strong className="text-gray-100">Contributor count</strong>{" "}
              broadening — five external committers added inside 14 days, the
              specific 2x-influx pattern that anchors the lead-time number on
              this site&rsquo;s home page.
            </li>
            <li>
              <strong className="text-gray-100">Dependents graph</strong>{" "}
              expanding outward — external repos that depend on this org&rsquo;s
              code, the cheapest available proxy for &ldquo;is anyone actually
              using this.&rdquo;
            </li>
            <li>
              <strong className="text-gray-100">Composite score</strong>{" "}
              crossing the 5-of-6 threshold for the first time in this
              org&rsquo;s history. That&rsquo;s the pattern that historically
              precedes Series A by 21 to 47 days.
            </li>
          </ol>
        </section>

        <section className="rounded-xl border border-fuchsia-700/30 bg-gradient-to-br from-fuchsia-950/20 via-slate-900 to-slate-950 p-6 space-y-3">
          <p className="text-fuchsia-300 text-xs font-semibold uppercase tracking-wider">
            Why this isn&rsquo;t on YouTube
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            The founder of VC Deal Flow Signal is anonymous by design. No video
            interviews, no podcast appearances, no real-name attribution. This
            page renders the same visual content you&rsquo;d expect from a
            product video — just rendered live in the browser instead of
            hosted from a face-bearing channel. The methodology, the data, and
            the engine are all public; only the founder isn&rsquo;t.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-100">
            What to do after watching
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
            <li>
              <Link
                href="https://gitdealflow.com/#signup"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                Get the Sunday digest →
              </Link>{" "}
              Five names a week, free forever.
            </li>
            <li>
              <Link
                href="/firstlook"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                Pick a sector for €7 →
              </Link>{" "}
              Full deep-dive PDF in 24 hours.
            </li>
            <li>
              <Link
                href="/perfect-webinar"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                Read the 12-minute walkthrough →
              </Link>{" "}
              The long version of why the signal works.
            </li>
            <li>
              <Link
                href="/funnels"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                See every door →
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
