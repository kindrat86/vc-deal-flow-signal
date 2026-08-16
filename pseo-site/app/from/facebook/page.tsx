import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import TrialClose from "@/components/TrialClose";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";

/**
 * /from/facebook, Pre-frame landing page for Meta-paid traffic.
 *
 * Brunson DotCom Secrets §2 Ch 7, Pre-Frame Bridge. The promise the visitor
 * just clicked on the ad needs to be ECHOED on the first paint of the
 * landing, not buried under a generic homepage. This page is the bridge:
 *   - Headline mirrors the ad copy literal (signal vs noise framing).
 *   - Trust signals collapse (SSRN n=219, 21-47d lead) shown above the fold.
 *   - One CTA, straight to /firstlook with FB UTM payload preserved through
 *     the link href (already-baked) so attribution survives.
 *
 * Anonymity rule: data-only. No founder photo, no founder voice. The chart
 * is the hero. Synthetic-voice video lives at /watch (silent canvas) and
 * /vsl (Cartesia "Theo" narration), both linked but not auto-played here
 * (FB feed sends users in fast, auto-playing video kills the bridge).
 */

export const metadata: Metadata = {
  title:
    "From Facebook, The signal your network can't see (€7 sector deep dive)",
  description:
    "You clicked a Facebook ad. Here's what the ad actually proves: in a 219-startup SSRN panel, GitHub commit-velocity acceleration shows up 21-47 days before the Series A press release. Pick a sector, €7 once, full deep dive in 24 hours.",
  alternates: { canonical: "/from/facebook" },
  openGraph: {
    title: "The signal your network can't see, €7 sector deep dive",
    description:
      "GitHub commit-velocity acceleration leads Series A press releases by 21-47 days. SSRN-indexed panel of 219 startups. €7 once. 24-hour SLA.",
    url: `${SITE}/from/facebook`,
    type: "article",
    images: [
      {
        url: `${SITE}/firstlook/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "VC Deal Flow Signal, First Look Pass",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The signal your network can't see, €7 sector deep dive",
    description:
      "21-47 days of pre-deck lead time, in a 219-startup SSRN panel. €7 once.",
  },
  robots: {
    // Pre-frame landings should be discoverable but not compete with /firstlook
    // for canonical SEO weight. /firstlook is the conversion canonical; this
    // page exists to bridge ad-traffic only.
    index: true,
    follow: true,
  },
};

const PROOF_POINTS = [
  {
    label: "SSRN-indexed panel",
    value: "n = 219",
    detail: "Confirmed Series A & B fundraises, 2023-2025",
  },
  {
    label: "Lead-time median",
    value: "21-47 days",
    detail: "Commit-velocity signal precedes press release",
  },
  {
    label: "Hit rate at 90 days",
    value: "live",
    detail: "Graded openly on the public scorecard (currently un-graded)",
  },
  {
    label: "Cost to verify",
    value: "€7",
    detail: "One sector, full deep dive, 24-hour SLA",
  },
] as const;

const WHAT_YOU_GET = [
  "Top 25 GitHub orgs in your sector, ranked by 14-day commit-velocity acceleration",
  "Three pre-Crunchbase breakouts, orgs surfaced before the consensus deal-flow tools indexed them",
  "Contributor influx map (top 10 orgs × 30-day window), predicts hiring announcements",
  "Raw CSV (every org × every metric), drop into your CRM or notebook",
  "14-page written walkthrough PDF, what stood out, what's a false positive, the thesis-specific surprises",
] as const;

const FAQ = [
  {
    q: "Why am I seeing this from a Facebook ad?",
    a: "We run a small €5/day FB retargeting test. If you've visited signals.gitdealflow.com before, the pixel may have followed you here. The ad budget is intentionally small, we're testing whether the message lands, not buying scale.",
  },
  {
    q: "Why is the founder anonymous?",
    a: "Anonymity is a methodology guarantee. We never need a personal brand for the data to be falsifiable, the SSRN panel, the open methodology, and the reproducible regression do the work. No founder face on Facebook. No founder face anywhere.",
  },
  {
    q: "Is the €7 really credited toward the Dashboard?",
    a: "Yes. If you upgrade to Dashboard (€49/mo; the €9.97 founding rate closed 2026-06-30) within 14 days of the First Look purchase, the €7 is credited. If you don't, the deep dive is yours regardless.",
  },
  {
    q: "What if the report doesn't surface a useful signal?",
    a: "30-day Signal-or-It's-Free guarantee. If the deep dive doesn't surface at least one startup you'd want to know about earlier, full refund. Two refunds requested in three years.",
  },
] as const;

export default function FromFacebookPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/from/facebook`,
        name: "From Facebook, VC Deal Flow Signal pre-frame",
        description:
          "Bridge page for visitors arriving from Meta-paid traffic. Restates the ad's claim (21-47d pre-deck lead time) and routes to /firstlook.",
        isPartOf: { "@id": `${SITE}/#website` },
        inLanguage: "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "From Facebook",
            item: `${SITE}/from/facebook`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks canonical={`${SITE}/from/facebook`} languages={{}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/from/facebook" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            From Facebook · Pre-frame
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            You clicked the ad. Here&rsquo;s what it&rsquo;s actually
            <span className="text-sky-400"> proving.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            The Facebook ad said: <em>your network is showing you yesterday&rsquo;s
            deals</em>. That&rsquo;s the headline. The proof is below, a
            219-startup SSRN-indexed panel where GitHub commit-velocity
            acceleration showed up 21 to 47 days <em>before</em> the Series A
            press release. Pick a sector, pay €7, get the full deep-dive PDF
            in 24 hours. €7 credited if you upgrade to Dashboard in 14 days.
          </p>
        </header>

        {/* Proof grid, 4 cells, hero placement above fold on most viewports */}
        <section
          aria-labelledby="proof"
          className="rounded-xl border border-sky-700/30 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 space-y-5"
        >
          <h2
            id="proof"
            className="text-xs font-semibold text-sky-300 uppercase tracking-wider"
          >
            Proof on the page · Not after the click
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PROOF_POINTS.map((p) => (
              <div
                key={p.label}
                className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 space-y-1"
              >
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  {p.label}
                </p>
                <p className="text-2xl font-bold text-sky-300">{p.value}</p>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Methodology grounded in SSRN abstract 6606558. Reproducible against
            CC BY 4.0 Zenodo dataset. Every line on this page is falsifiable.
          </p>
        </section>

        <section
          aria-labelledby="cta-primary"
          className="rounded-xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5"
        >
          <h2 id="cta-primary" className="text-2xl font-bold text-gray-100">
            One sector. €7. 24 hours.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            That&rsquo;s the whole offer. You pick a tracked sector at
            checkout, we ship the deep-dive PDF + CSV + JSON inside 24 business
            hours. €7 credited toward Dashboard (€49/mo; the €9.97 founding rate closed 2026-06-30) if you
            upgrade in 14 days. 30-day Signal-or-It&rsquo;s-Free guarantee.
          </p>
          <ul className="space-y-2">
            {WHAT_YOU_GET.map((line) => (
              <li
                key={line}
                className="text-gray-300 text-sm leading-relaxed pl-4 relative"
              >
                <span className="absolute left-0 text-emerald-400">→</span>
                {line}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/firstlook?utm_source=facebook&utm_medium=cpc&utm_campaign=fb-2026-q3&utm_content=fromfb-cta"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-slate-950 font-semibold transition-colors"
            >
              Pick my sector for €7 →
            </Link>
            <Link
              href="/?utm_source=facebook&utm_medium=cpc&utm_campaign=fb-2026-q3&utm_content=fromfb-free"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 hover:border-slate-500 px-6 py-3 text-gray-200 font-medium transition-colors"
            >
              Or just the free Sunday digest →
            </Link>
          </div>
        </section>

        <TrialClose tone="amber">
          The methodology is open, the data is public, the regression is
          replicable in 90 minutes against the Zenodo dataset. If the proof
          stack reads as more falsifiable than most VC alt-data, would the €7
          deep-dive be the cheapest way to verify it on a sector you actually
          care about?
        </TrialClose>

        <section
          aria-labelledby="anonymity"
          className="rounded-xl border border-fuchsia-700/30 bg-fuchsia-950/10 p-6 space-y-3"
        >
          <h2 id="anonymity" className="text-xl font-bold text-gray-100">
            Why this isn&rsquo;t a founder-face ad
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            VC Deal Flow Signal&rsquo;s founder is anonymous by design. No
            founder photo, no founder voice, no real-name attribution, on
            Facebook or anywhere else. The chart on the ad creative is the
            hero. The methodology paper is the bio. The reproducible regression
            is the credibility. We don&rsquo;t need a personal brand for
            falsifiable data to do its work.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            If the brand-without-face thing is itself a turn-off, we&rsquo;re
            not the right tool. If you&rsquo;d rather verify the methodology
            than meet the founder, the{" "}
            <Link
              href="/research"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              SSRN panel
            </Link>{" "}
            is open and the{" "}
            <Link
              href="/reproducibility"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              replication notebook
            </Link>{" "}
            takes 90 minutes.
          </p>
        </section>

        <section aria-labelledby="faq" className="space-y-4">
          <h2 id="faq" className="text-2xl font-bold text-gray-100">
            What you&rsquo;re probably wondering
          </h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div
                key={f.q}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-2"
              >
                <h3 className="text-sm font-semibold text-gray-100">{f.q}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="next"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3"
        >
          <h2 id="next" className="text-xl font-bold text-gray-100">
            What to do next
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
            <li>
              <Link
                href="/firstlook?utm_source=facebook&utm_medium=cpc&utm_campaign=fb-2026-q3&utm_content=fromfb-list"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                Pick my sector for €7 →
              </Link>{" "}
              The 24-hour deep-dive offer.
            </li>
            <li>
              <Link
                href="/watch?utm_source=facebook&utm_medium=cpc&utm_campaign=fb-2026-q3"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                Watch the silent 90-second demo →
              </Link>{" "}
              The dashboard breathing, no audio, no narrator.
            </li>
            <li>
              <Link
                href="/walkthrough?utm_source=facebook&utm_medium=cpc&utm_campaign=fb-2026-q3"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                Read the 12-minute walkthrough →
              </Link>{" "}
              Long-form why the signal works.
            </li>
            <li>
              <Link
                href="/research"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                The SSRN methodology paper →
              </Link>{" "}
              The original abstract 6606558.
            </li>
            <li>
              <Link
                href="/distribution"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                Every channel we publish on →
              </Link>{" "}
              Substack, dev.to, RSS, MCP, Bluesky, Mastodon.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
