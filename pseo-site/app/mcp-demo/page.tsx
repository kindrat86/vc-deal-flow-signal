import type { Metadata } from "next";
import Link from "next/link";

const APEX = "https://gitdealflow.com";
const SIGNALS = "https://signals.gitdealflow.com";
const VIDEO_URL = `${APEX}/mcp-demo.mp4`;
const THUMB_URL = `${APEX}/mcp-demo.gif`;
const PAGE_URL = `${SIGNALS}/mcp-demo`;
const UPLOAD_DATE = "2026-04-17";
const DURATION_ISO = "PT1M12S";
const DURATION_SECONDS = 72;
const VIDEO_TITLE = "VC Deal Flow Signal MCP Server — Claude Desktop Demo";
const VIDEO_DESCRIPTION =
  "Live demo of the VC Deal Flow Signal MCP server running inside Claude Desktop. Shows trending startups, sector search, and individual startup signal lookups via natural-language prompts. Free, no API key required.";

export const metadata: Metadata = {
  title: "MCP Server Demo — VC Deal Flow Signal in Claude Desktop",
  description: VIDEO_DESCRIPTION,
  alternates: {
    canonical: "/mcp-demo",
  },
  openGraph: {
    title: VIDEO_TITLE,
    description: VIDEO_DESCRIPTION,
    url: PAGE_URL,
    type: "video.other",
    videos: [
      {
        url: VIDEO_URL,
        secureUrl: VIDEO_URL,
        type: "video/mp4",
        width: 1280,
        height: 720,
      },
    ],
    images: [{ url: THUMB_URL, width: 1280, height: 720, alt: VIDEO_TITLE }],
  },
  twitter: {
    card: "player",
    title: VIDEO_TITLE,
    description: VIDEO_DESCRIPTION,
    images: [THUMB_URL],
  },
};

export default function McpDemoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoObject",
        "@id": `${PAGE_URL}#video`,
        name: VIDEO_TITLE,
        description: VIDEO_DESCRIPTION,
        thumbnailUrl: THUMB_URL,
        contentUrl: VIDEO_URL,
        embedUrl: VIDEO_URL,
        uploadDate: UPLOAD_DATE,
        duration: DURATION_ISO,
        isFamilyFriendly: true,
        inLanguage: "en-US",
        regionsAllowed:
          "US,GB,DE,FR,CA,AU,JP,IN,SG,NL,SE,IE,ES,IT,BR,MX,KR,IL,PL,GR,FI,DK,NO,CH,AT,BE,PT,CZ,RO,HU,NZ",
        license: "https://creativecommons.org/licenses/by/4.0/",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: APEX,
          logo: {
            "@type": "ImageObject",
            url: `${SIGNALS}/icon.png`,
          },
        },
        potentialAction: {
          "@type": "SeekToAction",
          target: `${PAGE_URL}?t={seek_to_second_number}`,
          "startOffset-input": "required name=seek_to_second_number",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: VIDEO_TITLE,
        description: VIDEO_DESCRIPTION,
        inLanguage: "en-US",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: THUMB_URL,
        },
        video: { "@id": `${PAGE_URL}#video` },
        isPartOf: { "@id": `${SIGNALS}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".speakable"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SIGNALS },
          { "@type": "ListItem", position: 2, name: "MCP Demo", item: PAGE_URL },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <nav className="text-sm text-slate-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-sky-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page">MCP Demo</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {VIDEO_TITLE}
        </h1>

        <p className="text-lg text-slate-300 speakable mb-8">
          {VIDEO_DESCRIPTION}
        </p>

        <figure className="rounded-xl overflow-hidden border border-slate-800 bg-black shadow-2xl">
          <video
            controls
            preload="metadata"
            poster={THUMB_URL}
            playsInline
            className="w-full h-auto block"
            aria-label={VIDEO_TITLE}
          >
            <source src={VIDEO_URL} type="video/mp4" />
            <track kind="descriptions" label="English description" srcLang="en" />
            Your browser does not support HTML5 video. Download the demo:{" "}
            <a href={VIDEO_URL} className="text-sky-400 underline">
              mcp-demo.mp4
            </a>
            .
          </video>
          <figcaption className="px-4 py-3 text-sm text-slate-400">
            Duration {DURATION_SECONDS}s — silent — recorded {UPLOAD_DATE}.
          </figcaption>
        </figure>

        <section className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
              What this demo shows
            </h2>
            <ul className="text-slate-200 space-y-2 text-sm">
              <li>• Trending startups across 20+ sectors</li>
              <li>• Sector-by-sector signal search</li>
              <li>• Individual startup deep-signal lookup</li>
              <li>• Natural-language prompts via Claude Desktop</li>
            </ul>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Try it yourself
            </h2>
            <p className="text-slate-200 text-sm mb-3">
              Six MCP tools, free forever. No API key required to install.
            </p>
            <Link
              href="/install"
              className="inline-block rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 text-sm"
            >
              Installation guide
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-3">Where to go next</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm">
            <li>
              <Link href="/methodology" className="text-sky-300 hover:underline">
                → How signals are computed (methodology)
              </Link>
            </li>
            <li>
              <Link href="/weekly" className="text-sky-300 hover:underline">
                → This week&apos;s top movers
              </Link>
            </li>
            <li>
              <Link href="/agents" className="text-sky-300 hover:underline">
                → Agent + MCP integration index
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-sky-300 hover:underline">
                → Pricing &amp; tiers
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
