import type { Metadata } from "next";
import Link from "next/link";
import { allPosts } from "@/content/posts";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Signal of the Week - Weekly Startup Engineering Acceleration Deep Dive",
  description:
    "A single-startup editorial each Monday. One company, one signal, one story - drawn from our ranking of 400+ startup GitHub orgs by engineering acceleration. Free, non-gated, citation-encouraged.",
  alternates: {
    canonical: "/signal-of-the-week",
  },
};

export default function SignalOfTheWeekArchivePage() {
  const today = new Date().toISOString().slice(0, 10);
  const sotwPosts = allPosts.filter(
    (p) => p.slug.startsWith("signal-of-the-week-") && p.date <= today
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://signals.gitdealflow.com/signal-of-the-week#collection",
        name: "Signal of the Week Archive",
        description:
          "Archive of weekly single-startup engineering-acceleration editorials from VC Deal Flow Signal.",
        url: "https://signals.gitdealflow.com/signal-of-the-week",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
        hasPart: sotwPosts.map((p) => ({
          "@type": "Article",
          headline: p.title,
          datePublished: p.date,
          url: `https://signals.gitdealflow.com/blog/${p.slug}`,
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
            name: "Signal of the Week",
            item: "https://signals.gitdealflow.com/signal-of-the-week",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://signals.gitdealflow.com/signal-of-the-week#faq",
        url: "https://signals.gitdealflow.com/signal-of-the-week",
        inLanguage: "en-US",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Signal of the Week?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A single-startup editorial published every Monday, one company, one signal, one story. The pick is the #1 engineering-acceleration mover across the 400+-org tracking set for the week. Free, non-gated, citation-encouraged. Use it in newsletters, podcasts, or research notes; suggested citation appears at the bottom of each edition.",
            },
          },
          {
            "@type": "Question",
            name: "How is the weekly Signal pick chosen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Monday data refresh ranks every tracked startup by 14-day commit-velocity change. The top mover is filtered through a two-period confirmation rule (must persist into the second 14-day window) and a bot-noise filter, then assigned a primary signal-type label (hiring burst / shipping sprint / infrastructure buildout / platform migration). The resulting single startup becomes that week's editorial subject.",
            },
          },
          {
            "@type": "Question",
            name: "Can I republish the editorial?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, every edition is licensed CC BY 4.0. Republish in newsletters, podcasts, blog posts, or research notes with attribution to \"VC Deal Flow Signal (signals.gitdealflow.com)\". The suggested citation format is reprinted at the bottom of each editorial. Republication requires no permission email; just include the canonical URL and author byline.",
            },
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Signal of the Week</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Signal of the Week
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-4">
          Every Monday we publish a single-startup editorial - the #1
          engineering-acceleration mover across our 400+-org tracking set. One
          company, one signal, one story. Free, non-gated, and citation-encouraged.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-10">
          Use it in your newsletter, podcast, or research note - no permission
          required. Suggested citation format appears at the bottom of each
          edition. Full methodology at{" "}
          <Link
            href="/methodology"
            className="text-sky-400 hover:text-sky-300 underline transition-colors"
          >
            /methodology
          </Link>
          .
        </p>

        {sotwPosts.length === 0 ? (
          <p className="text-gray-400 text-sm">
            The first edition ships Monday May 4, 2026. Check back then, or
            subscribe below to get it in your inbox.
          </p>
        ) : (
          <div className="space-y-4">
            {sotwPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
              >
                <p className="text-gray-400 text-xs mb-2">{post.date}</p>
                <h2 className="text-gray-100 font-semibold text-base mb-2 group-hover:text-sky-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-xl border border-amber-900/40 bg-amber-950/20 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
            Share this week's signal
          </p>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            The current top breakout is auto-rendered as a 1200×630 PNG card. Tweet it,
            paste it in Slack, drop it in your fund's deal-flow channel. Crunchbase API:
            $20K/yr. GitDealFlow A2A: free.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/api/og/signal-card"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
            >
              Get share card (PNG)
            </a>
            <a
              href="https://twitter.com/intent/tweet?text=Free%20Agent2Agent%20endpoint%20for%20VC%20startup%20signals.%20Crunchbase%20API%3A%20%2420K%2Fyr.%20GitDealFlow%20A2A%3A%20free.&url=https%3A%2F%2Fsignals.gitdealflow.com%2Fa2a"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-amber-800/60 hover:border-amber-700 text-amber-300 text-sm font-semibold transition-colors"
            >
              Tweet the meme
            </a>
            <Link
              href="/a2a"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-semibold transition-colors"
            >
              Plug into your AI →
            </Link>
          </div>
        </div>

        <SeoCta
          heading="Get Signal of the Week in your inbox"
          signoffIndex={5}
          className="mt-12"
        />
        <p className="mt-4 text-center text-xs text-gray-500">
          Building with AI tools?{" "}
          <Link
            href="https://github.com/kindrat86/mcp-deal-flow-signal"
            className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
          >
            Install the MCP server
          </Link>{" "}
          to query the same data from Claude or Cursor.
        </p>
      </div>
    </>
  );
}
