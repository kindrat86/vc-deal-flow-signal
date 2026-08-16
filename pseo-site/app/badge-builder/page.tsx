import type { Metadata } from "next";
import Link from "next/link";
import startupsData from "@/data/startups.json";
import { getAllSectors, getCurrentPeriod } from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { BADGE_LABEL, BADGE_HEIGHT, badgeWidth, badgeValue } from "@/lib/badge-dims";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Free Engineering Momentum Badge, Show Your Startup's GitHub Velocity",
  description:
    "Free shields.io-style SVG badge showing your startup's engineering momentum score. Auto-updates weekly. Embed on your website, README, or pitch deck. No signup required.",
  alternates: { canonical: "/badge-builder" },
  openGraph: {
    title: "Free Engineering Momentum Badge",
    description:
      "Free SVG badge showing your startup's GitHub velocity. Auto-updates. Embed anywhere.",
    type: "website",
    url: `${SITE}/badge-builder`,
  },
};

interface StartupBadge {
  name: string;
  slug: string;
  velocity: number;
  change: string;
  signal: string;
  sector: string;
}

export default function BadgeBuilderPage() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();

  // Gather sample startups for the showcase
  const samples: StartupBadge[] = [];
  const seen = new Set<string>();
  for (const sector of sectors) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot) continue;
    for (const s of snapshot.startups) {
      const slug = (s.name || "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      if (slug && !seen.has(slug) && samples.length < 12) {
        seen.add(slug);
        samples.push({
          name: s.name,
          slug,
          velocity: s.commitVelocity14d || 0,
          change: s.commitVelocityChange || "0%",
          signal: s.signalType || "steady",
          sector: sector.name,
        });
      }
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Engineering Momentum Badge Builder",
        description:
          "Free SVG badge showing your startup's GitHub commit velocity. Embed on your website, README, or pitch deck.",
        url: `${SITE}/badge-builder`,
        isPartOf: { "@type": "WebSite", url: SITE, name: "VC Deal Flow Signal" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the engineering momentum badge?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A free SVG badge you can embed on your startup's website, GitHub README, or pitch deck. It shows your real-time engineering momentum score based on public GitHub data, commit velocity, contributor growth, and signal type. It auto-updates weekly.",
            },
          },
          {
            "@type": "Question",
            name: "How do I embed the badge?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Use the Markdown or HTML snippet below, replacing YOUR_STARTUP_NAME with your startup slug. The badge auto-updates every week.",
            },
          },
          {
            "@type": "Question",
            name: "Is it free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, completely free. No signup, no API key, no tracking. The badge is generated from our public dataset and updates automatically.",
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
      <AgentMirrorLinks path="/badge-builder" qaCategory="badge" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Badge Builder</span>
        </nav>

        <header className="mb-10">
          <p className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Free · Auto-updating · No signup
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Show Your Engineering Momentum in Your README
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            A free shields.io-style badge for any startup tracked by VC Deal Flow
            Signal. Embed it on your website, GitHub profile, or pitch deck. It
            auto-refreshes every Monday with your latest commit velocity and
            signal type.
          </p>
        </header>

        {/* Usage section */}
        <section className="mb-12 rounded-xl border border-sky-900/50 bg-sky-950/30 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            How to use
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2 font-medium">
                Markdown (GitHub, README):
              </p>
              <pre className="rounded-lg bg-slate-950 border border-slate-800 p-4 text-sm text-gray-300 overflow-x-auto">
                <code>
                  {`[![engineering momentum](https://signals.gitdealflow.com/api/badge/YOUR_STARTUP_NAME)](https://signals.gitdealflow.com/badge-builder)`}
                </code>
              </pre>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2 font-medium">HTML:</p>
              <pre className="rounded-lg bg-slate-950 border border-slate-800 p-4 text-sm text-gray-300 overflow-x-auto">
                <code>
                  {`<a href="https://signals.gitdealflow.com/badge-builder">`}
                  {"\n"}
                  {`  <img src="https://signals.gitdealflow.com/api/badge/YOUR_STARTUP_NAME" alt="engineering momentum badge" />`}
                  {"\n"}
                  {`</a>`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Live examples */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Live examples
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {samples.map((s) => (
              <div
                key={s.slug}
                className="rounded-lg border border-slate-800 bg-slate-900 p-4 flex flex-col items-center gap-2"
              >
                <img
                  src={`/api/badge/${s.slug}`}
                  alt={`${s.name} momentum badge`}
                  width={badgeWidth(BADGE_LABEL, badgeValue(s.velocity, s.signal))}
                  height={BADGE_HEIGHT}
                  className="h-7 w-auto"
                  loading="lazy"
                />
                <span className="text-gray-400 text-xs">{s.name}</span>
                <code className="text-sky-400 text-[10px] bg-slate-950 px-1.5 py-0.5 rounded">
                  /api/badge/{s.slug}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How often does it update?",
                a: "Every Monday ~09:00 UTC when the weekly data refresh ships. Your badge always shows the latest commit velocity from the past 14 days.",
              },
              {
                q: "What if my startup isn't listed?",
                a: "We track 400+ venture-backed startups across 15 sectors. If your GitHub organization is active and you'd like to be added, reach out at signals@gitdealflow.com.",
              },
              {
                q: "Can I customize the colors?",
                a: "The right-side color reflects your signal type: breakout (amber), acceleration (green), steady (blue), cooling (red). It updates automatically with your signal.",
              },
              {
                q: "Is there an API for this?",
                a: "Yes. GET /api/signals.json returns the full dataset. GET /api/badge/:name returns the SVG. Both are free and require no authentication.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="text-gray-200 font-medium mb-1">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center border-t border-slate-800 pt-10">
          <p className="text-gray-400 text-sm mb-2">
            Powered by the VC Deal Flow Signal public dataset.
          </p>
          <p className="text-gray-500 text-xs">
            CC BY 4.0 · Free forever · No authentication required
          </p>
        </div>
      </div>
    </>
  );
}
