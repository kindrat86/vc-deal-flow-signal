/**
 * /watch/[slug] — per-video embed page.
 *
 * Each entry in `content/videos.ts` gets a static page here with:
 *   - YouTube embed (privacy-enhanced, lazy-loaded)
 *   - Full VideoObject JSON-LD with Clip[] chapters and SeekToAction
 *   - On-page transcript paragraphs (anonymity-safe — no founder face/voice)
 *   - BreadcrumbList + WebPage + Speakable
 *   - Backlinks to the canonical anchor pages (/predicted, /walkthrough)
 *
 * VEO levers concentrated here: Clip schema gives YouTube/Bing/Google search
 * the chapter carousel; transcript paragraphs let LLMs ground citations on
 * exact lines; embedUrl + contentUrl let agents pick how to consume.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HreflangLinks } from "@/components/HreflangLinks";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import {
  videos,
  getVideoBySlug,
  getAllVideoSlugs,
  isoDuration,
  watchPageUrl,
  embedUrl,
  publicUrl,
  type SiteVideo,
} from "@/content/videos";

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 86400;

export function generateStaticParams() {
  return getAllVideoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVideoBySlug(slug);
  if (!v) return { title: "Video not found" };
  const url = watchPageUrl(slug);
  return {
    title: v.title,
    description: v.description,
    alternates: { canonical: `/watch/${slug}` },
    openGraph: {
      title: v.title,
      description: v.description,
      url,
      type: "video.other",
      videos: v.youtubeId
        ? [
            {
              url: embedUrl(v),
              secureUrl: embedUrl(v),
              type: "text/html",
              width: v.format === "short" ? 405 : 1280,
              height: v.format === "short" ? 720 : 720,
            },
          ]
        : v.contentUrl
          ? [
              {
                url: v.contentUrl,
                secureUrl: v.contentUrl,
                type: "video/mp4",
                width: 1280,
                height: 720,
              },
            ]
          : undefined,
      images: [
        { url: v.thumbnailMaxUrl, width: 1280, height: 720, alt: v.title },
      ],
    },
    twitter: {
      card: "player",
      title: v.title,
      description: v.description,
      images: [v.thumbnailMaxUrl],
    },
  };
}

function buildVideoJsonLd(v: SiteVideo) {
  const pageUrl = watchPageUrl(v.slug);
  const fullEmbed = embedUrl(v);

  // Clip[] — Google's chapter carousel. Each Clip needs name, startOffset,
  // endOffset, and a url that uses the t= seek param so the viewer jumps
  // directly to the chapter.
  const clips = v.chapters.map((c, i) => ({
    "@type": "Clip",
    "@id": `${pageUrl}#clip-${i + 1}`,
    name: c.name,
    description: c.description ?? c.name,
    startOffset: c.start,
    endOffset: c.end,
    url: v.youtubeId
      ? `https://www.youtube.com/watch?v=${v.youtubeId}&t=${c.start}s`
      : `${pageUrl}?t=${c.start}`,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoObject",
        "@id": `${pageUrl}#video`,
        name: v.title,
        alternateName: v.title.split("—")[0]?.trim(),
        description: v.description,
        thumbnailUrl: [v.thumbnailMaxUrl, v.thumbnailUrl],
        contentUrl: v.contentUrl ?? undefined,
        embedUrl: fullEmbed,
        uploadDate: v.uploadDate,
        duration: isoDuration(v.durationSeconds),
        isFamilyFriendly: true,
        inLanguage: "en-US",
        keywords: v.tags.join(", "),
        regionsAllowed:
          "US,GB,DE,FR,CA,AU,JP,IN,SG,NL,SE,IE,ES,IT,BR,MX,KR,IL,PL,GR,FI,DK,NO,CH,AT,BE,PT,CZ,RO,HU,NZ",
        license: "https://creativecommons.org/licenses/by/4.0/",
        creditText: "The Data Nerd · Cartesia synthetic voice (anonymity-safe)",
        publisher: {
          "@type": "Organization",
          "@id": `${APEX}/#organization`,
          name: "VC Deal Flow Signal",
          alternateName: "GitDealFlow",
          url: APEX,
          logo: {
            "@type": "ImageObject",
            url: `${SITE}/icon.png`,
          },
        },
        creator: {
          "@type": "Person",
          name: "The Data Nerd",
          url: `${SITE}/about/founder`,
          identifier: "https://orcid.org/0009-0002-2222-4112",
        },
        hasPart: clips,
        potentialAction: {
          "@type": "SeekToAction",
          target: v.youtubeId
            ? `https://www.youtube.com/watch?v=${v.youtubeId}&t={seek_to_second_number}s`
            : `${pageUrl}?t={seek_to_second_number}`,
          "startOffset-input": "required name=seek_to_second_number",
        },
        transcript: v.transcriptParagraphs.join("\n\n"),
        sameAs: v.youtubeId
          ? [
              `https://www.youtube.com/watch?v=${v.youtubeId}`,
              `https://youtu.be/${v.youtubeId}`,
            ]
          : undefined,
        isPartOf: { "@id": `${SITE}/#website` },
      },
      ...clips,
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: v.title,
        description: v.description,
        inLanguage: "en-US",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: v.thumbnailMaxUrl,
        },
        video: { "@id": `${pageUrl}#video` },
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Watch", item: `${SITE}/watch` },
          { "@type": "ListItem", position: 3, name: v.title, item: pageUrl },
        ],
      },
    ],
  };
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVideoBySlug(slug);
  if (!v) notFound();

  const pageUrl = watchPageUrl(slug);
  const jsonLd = buildVideoJsonLd(v);
  const aspectClass = v.format === "short" ? "aspect-[9/16] max-w-md mx-auto" : "aspect-video";

  // Sibling videos for cross-linking
  const others = videos.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <>
      <HreflangLinks canonical={pageUrl} languages={{}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/watch/${slug}`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-sky-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/watch" className="hover:text-sky-300">
            Watch
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page" className="text-slate-300">
            {v.title.split("—")[0]?.trim() ?? v.title}
          </span>
        </nav>

        <header className="space-y-4">
          <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
            {v.format === "short" ? "Short · 9:16" : "Video"} · {fmtTime(v.durationSeconds)} · synthetic voice · CC BY 4.0
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {v.title}
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            {v.description}
          </p>
        </header>

        <figure
          className={`${aspectClass} w-full overflow-hidden rounded-xl bg-black border border-slate-800 shadow-2xl`}
        >
          {v.youtubeId ? (
            <iframe
              title={v.title}
              src={embedUrl(v)}
              allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0"
            />
          ) : v.contentUrl ? (
            <video
              controls
              preload="metadata"
              poster={v.thumbnailMaxUrl}
              playsInline
              className="w-full h-full"
              aria-label={v.title}
              crossOrigin="anonymous"
            >
              <source src={v.contentUrl} type="video/mp4" />
              <track
                kind="captions"
                label="English"
                srcLang="en"
                src={`/api/v1/transcripts/${v.slug}`}
                default
              />
            </video>
          ) : null}
        </figure>

        <section
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3"
          aria-labelledby="chapters"
        >
          <h2
            id="chapters"
            className="text-xl font-bold text-gray-100"
          >
            Chapters
          </h2>
          <ol className="text-gray-300 text-sm space-y-2">
            {v.chapters.map((c, i) => {
              const t = v.youtubeId
                ? `https://www.youtube.com/watch?v=${v.youtubeId}&t=${c.start}s`
                : `${v.contentUrl ?? ""}#t=${c.start}`;
              return (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-emerald-400 w-12 shrink-0">
                    {fmtTime(c.start)}
                  </span>
                  <a
                    href={t}
                    rel="noopener"
                    className="text-sky-300 hover:text-sky-200 underline decoration-dotted"
                  >
                    {c.name}
                  </a>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">Transcript</h2>
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            Synthetic voice — Cartesia &ldquo;Theo&rdquo; — anonymity-safe per
            the project&rsquo;s no-founder-face rule.
          </p>
          <div className="space-y-4 text-gray-300 text-base leading-relaxed">
            {v.transcriptParagraphs.map((p, i) => (
              <p key={i} data-speakable>
                {p}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-100">Where to go next</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm">
            <li>
              <Link href="/predicted" className="text-sky-300 hover:underline">
                → Engineering Acceleration Watch (this week&rsquo;s picks)
              </Link>
            </li>
            <li>
              <Link
                href="/walkthrough"
                className="text-sky-300 hover:underline"
              >
                → 12-minute walkthrough (long version)
              </Link>
            </li>
            <li>
              <Link href="/methodology" className="text-sky-300 hover:underline">
                → How signals are computed
              </Link>
            </li>
            <li>
              <Link href="/trending" className="text-sky-300 hover:underline">
                → Live ranked dashboard
              </Link>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">Other videos</h2>
          <ul className="grid sm:grid-cols-3 gap-3 text-sm">
            {others.map((o) => (
              <li
                key={o.slug}
                className="rounded-lg border border-slate-800 bg-slate-900/30 p-3 hover:border-emerald-500/40"
              >
                <Link
                  href={`/watch/${o.slug}`}
                  className="text-sky-300 hover:text-sky-200 font-medium block mb-1"
                >
                  {o.title.split("—")[0]?.trim() ?? o.title}
                </Link>
                <p className="text-xs text-slate-400">
                  {fmtTime(o.durationSeconds)} ·{" "}
                  {o.format === "short" ? "Short" : "Long-form"}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {v.youtubeId ? (
          <p className="text-xs text-slate-500 border-t border-slate-800 pt-4">
            Canonical YouTube URL:{" "}
            <a
              href={publicUrl(v)}
              rel="noopener"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              {publicUrl(v)}
            </a>
            {" · "}
            JSON catalog:{" "}
            <Link
              href="/api/v1/videos.json"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /api/v1/videos.json
            </Link>
          </p>
        ) : null}
      </div>
    </>
  );
}
