import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { PLATFORM_HOOKS, UNIVERSAL_STORY } from "@/content/platform-hooks";

// Brunson Traffic Secrets §1 Ch 3, platform-native opener variants.
// Twelve resolutions of one universal story (commit-velocity =
// 21-47-day pre-fundraise signal). Audit gap pre-2026-05-09: the same
// opener was reused across every channel. This surface ships the
// transparency play (show the variants publicly, methodology-first)
// AND functions as the single source of truth that the daily-briefing
// pipeline reads from.
//
// Customer-visible copy stays neutral, no Brunson framework names per
// the durable rule in feedback_brunson_internal_only.md.

export const dynamic = "force-static";

const CANONICAL = "https://signals.gitdealflow.com/distribution/platform-hooks";

export const metadata: Metadata = {
  title: "Platform-native openers, twelve ways to introduce the same signal",
  description:
    "How the same product story (commit-velocity acceleration as a 21-47-day pre-fundraise signal) gets reframed for each of the twelve platforms we publish on. Twitter / Reddit / Hacker News / dev.to / Hashnode / Discord / LinkedIn / Email / AngelList / Product Hunt / Indie Hackers / Telegram. Each variant carries an opener pattern, audience signal, format constraint, timing window, and the platform-specific landmine.",
  alternates: { canonical: "/distribution/platform-hooks" },
  openGraph: {
    title:
      "Platform-native openers, twelve ways to introduce the same signal",
    description:
      "Twelve openers, one story. The merge graph as the new pitch deck, reframed for Twitter, Reddit, Hacker News, dev.to, Hashnode, Discord, LinkedIn, email, AngelList, Product Hunt, Indie Hackers, and Telegram.",
    url: CANONICAL,
    type: "article",
  },
};

const TEMPERATURE_LABEL: Record<string, { label: string; tone: string }> = {
  cold: {
    label: "Cold audience",
    tone: "text-rose-400 border-rose-700/40 bg-rose-950/20",
  },
  warm: {
    label: "Warm audience",
    tone: "text-amber-400 border-amber-700/40 bg-amber-950/20",
  },
  hot: {
    label: "Owned channel",
    tone: "text-emerald-400 border-emerald-700/40 bg-emerald-950/20",
  },
};

export default function PlatformHooksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${CANONICAL}#article`,
        headline:
          "Platform-native openers, twelve ways to introduce the same signal",
        description:
          "Methodology page documenting how a single product story gets re-framed across twelve distribution platforms, Twitter, Reddit, Hacker News, dev.to, Hashnode, Discord, LinkedIn, email, AngelList, Product Hunt, Indie Hackers, Telegram.",
        url: CANONICAL,
        mainEntityOfPage: CANONICAL,
        author: {
          "@type": "Person",
          "@id": "https://signals.gitdealflow.com/about#person",
        },
        publisher: {
          "@id": "https://gitdealflow.com/#organization",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "h3"],
        },
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
            name: "Distribution",
            item: "https://signals.gitdealflow.com/distribution",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Platform-native openers",
            item: CANONICAL,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Platform-native opener variants",
        numberOfItems: PLATFORM_HOOKS.length,
        itemListElement: PLATFORM_HOOKS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.platform,
          url: `${CANONICAL}#${p.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={CANONICAL}
        languages={getHreflangLanguages("/distribution/platform-hooks")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/distribution/platform-hooks" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/distribution" className="hover:text-gray-300">
              Distribution
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Platform-native openers</span>
          </nav>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Distribution lab · Methodology
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Twelve openers, one story.{" "}
            <span className="text-emerald-400">
              The merge graph as the new pitch deck.
            </span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            The product story is one sentence:{" "}
            <em className="text-gray-200 not-italic">
              public commit-velocity acceleration crosses a falsifiable
              threshold 21-47 days before a Series A round closes.
            </em>{" "}
            That sentence wins on Hacker News and gets you flagged on
            LinkedIn. It converts on Indie Hackers and reads as bragging on
            r/startups. So we resolve it twelve different ways, one per
            platform we publish on. Each variant carries an opener pattern,
            an audience signal, a format constraint, a timing window, and the
            specific landmine to avoid.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            This page exists for two reasons. First, transparency, if
            you&rsquo;re a buyer comparing tools, you should see how the
            methodology shows up everywhere, not just on the homepage.
            Second, it&rsquo;s the single source of truth our daily-briefing
            pipeline reads from. When the same opener starts appearing on
            two surfaces, that&rsquo;s a regression we catch from this page.
          </p>
        </header>

        <section
          aria-label="The universal story"
          className="rounded-xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5"
        >
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            The universal story
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            The opener / narrative / offer triad, same arc, twelve resolutions.
          </h2>
          <dl className="grid sm:grid-cols-3 gap-5 text-sm">
            <div className="space-y-2 rounded-lg border border-emerald-900/40 bg-slate-950/60 p-4">
              <dt className="text-emerald-300 text-[11px] font-semibold uppercase tracking-wider">
                Opener
              </dt>
              <dd className="text-gray-200 leading-relaxed">
                {UNIVERSAL_STORY.opener}
              </dd>
            </div>
            <div className="space-y-2 rounded-lg border border-emerald-900/40 bg-slate-950/60 p-4">
              <dt className="text-emerald-300 text-[11px] font-semibold uppercase tracking-wider">
                Narrative
              </dt>
              <dd className="text-gray-200 leading-relaxed">
                {UNIVERSAL_STORY.narrative}
              </dd>
            </div>
            <div className="space-y-2 rounded-lg border border-emerald-900/40 bg-slate-950/60 p-4">
              <dt className="text-emerald-300 text-[11px] font-semibold uppercase tracking-wider">
                Offer
              </dt>
              <dd className="text-gray-200 leading-relaxed">
                {UNIVERSAL_STORY.offer}
              </dd>
            </div>
          </dl>
        </section>

        <section aria-label="Platform-by-platform variants" className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            The twelve variants.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Each card carries the opener pattern, the example opener
            (copy-paste ready for our team), the story angle, the offer
            phrasing, the format constraint, the timing window, and the
            platform-specific rule we never break.
          </p>

          <ol className="space-y-4 list-none p-0">
            {PLATFORM_HOOKS.map((hook, idx) => {
              const tempSpec = TEMPERATURE_LABEL[hook.temperature];
              return (
                <li
                  id={hook.slug}
                  key={hook.slug}
                  className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 sm:p-6 space-y-4 scroll-mt-20"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      aria-hidden
                      className="text-2xl select-none"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      {hook.glyph}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-100">
                      {String(idx + 1).padStart(2, "0")} · {hook.platform}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${tempSpec.tone}`}
                    >
                      {tempSpec.label}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      <span className="text-gray-500">handle</span>{" "}
                      <code className="text-gray-300">{hook.handle}</code>
                    </span>
                  </div>

                  <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                        Audience signal
                      </dt>
                      <dd className="text-gray-300 leading-relaxed">
                        {hook.audienceSignal}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                        Opener pattern
                      </dt>
                      <dd className="text-gray-300 leading-relaxed">
                        {hook.openerPattern}
                      </dd>
                    </div>
                  </dl>

                  <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/15 p-4 space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                      Example opener
                    </p>
                    <blockquote className="text-gray-100 leading-relaxed italic whitespace-pre-line">
                      {hook.exampleOpener}
                    </blockquote>
                  </div>

                  <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Story angle
                      </dt>
                      <dd className="text-gray-300 leading-relaxed">
                        {hook.storyAngle}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Offer phrasing
                      </dt>
                      <dd className="text-gray-300 leading-relaxed">
                        {hook.offerPhrasing}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Format constraint
                      </dt>
                      <dd className="text-gray-300 leading-relaxed">
                        {hook.formatConstraint}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Timing window
                      </dt>
                      <dd className="text-gray-300 leading-relaxed">
                        {hook.timing}
                      </dd>
                    </div>
                  </dl>

                  <div className="rounded-lg border border-rose-900/40 bg-rose-950/15 p-3 space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-300">
                      The rule we never break
                    </p>
                    <p className="text-gray-200 leading-relaxed text-sm">
                      {hook.rule}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section
          aria-label="How to use this page"
          className="rounded-xl border border-slate-800 bg-slate-950/30 p-6 sm:p-8 space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            How to read this page.
          </h2>
          <ul className="text-gray-300 text-sm leading-relaxed list-disc list-inside space-y-2 marker:text-emerald-500">
            <li>
              <strong className="text-gray-100">If you&rsquo;re a buyer:</strong>{" "}
              this is the methodology behind every public-surface mention you
              see of the signal. We don&rsquo;t reuse the homepage paragraph as
              a tweet, and we don&rsquo;t reuse a tweet as a LinkedIn post.
            </li>
            <li>
              <strong className="text-gray-100">If you&rsquo;re a builder:</strong>{" "}
              the table is reusable. Swap our universal story for yours,
              keep the platform-side rules. Twelve openers usually catch every
              audience temperature you ship to.
            </li>
            <li>
              <strong className="text-gray-100">If you&rsquo;re an agent:</strong>{" "}
              the same data is available as JSON at{" "}
              <Link
                href="/api/v1/platform-hooks.json"
                className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
              >
                /api/v1/platform-hooks.json
              </Link>
              . Every variant is keyed by stable slug.
            </li>
          </ul>
        </section>

        <section
          aria-label="Related"
          className="rounded-xl border border-slate-800 bg-slate-950/20 p-6 space-y-3"
        >
          <h2 className="text-lg font-bold text-gray-100">Related</h2>
          <ul className="text-gray-300 text-sm leading-relaxed list-disc list-inside space-y-1 marker:text-emerald-500">
            <li>
              <Link
                href="/distribution"
                className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
              >
                /distribution
              </Link>{" "}
the full surface map (every channel, every mirror, every
              feed).
            </li>
            <li>
              <Link
                href="/earned-plays"
                className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
              >
                /earned-plays
              </Link>{" "}
the named earned-traffic plays we run on a weekly cadence.
            </li>
            <li>
              <Link
                href="/target-list"
                className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
              >
                /target-list
              </Link>{" "}
the 100 voices we read on the engineering-signal frontier.
            </li>
            <li>
              <Link
                href="/methodology"
                className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
              >
                /methodology
              </Link>{" "}
the regression and the dataset behind the universal story.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
