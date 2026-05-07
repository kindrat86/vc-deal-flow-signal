import type { Metadata } from "next";
import Link from "next/link";
import { getAllSectors, getCurrentPeriod, getAllPeriods } from "@/lib/data";
import { getHreflangLanguages } from "@/lib/hreflang";
import { HreflangLinks } from "@/components/HreflangLinks";

export const metadata: Metadata = {
  title: "About VC Deal Flow Signal — Who We Are & How It Works",
  description:
    "VC Deal Flow Signal tracks startup engineering acceleration from public GitHub data. Learn who built it, why, how the data pipeline works, and how to use it for deal sourcing.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: { canonical: "/about" },
  // F5 — absolute og:url (Next 16 drops relative og:url even with metadataBase).
  openGraph: { url: "https://signals.gitdealflow.com/about", type: "website" },
};

export default function AboutPage() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);
  const totalStartups = activeSectors.reduce(
    (sum, s) => sum + s.periods[period.slug].startups.length,
    0
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "VC Deal Flow Signal",
        url: "https://gitdealflow.com",
        description:
          "Independent data product that tracks startup engineering acceleration using public GitHub data. Monitors commit velocity, contributor growth, and repository expansion across startup sectors to surface breakout engineering teams before they appear through traditional deal sourcing channels.",
        foundingDate: "2025",
        sameAs: [
          "https://x.com/data_nerd",
          "https://t.me/gitdealflow",
          "https://www.linkedin.com/company/gitdealflow",
          "https://www.wikidata.org/wiki/Q139376302",
          "https://www.crunchbase.com/organization/gitdealflow",
          "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
          "https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm",
          "https://www.sideprojectors.com/project/78284/vc-deal-flow-signal-engineering-momentum-for-vcs",
          "https://signals.gitdealflow.com",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: "signal@gitdealflow.com",
          contactType: "customer support",
        },
        knowsAbout: [
          "Venture capital deal sourcing",
          "Startup engineering metrics",
          "GitHub data analysis",
          "Alternative data for investors",
          "Engineering acceleration signals",
        ],
      },
      {
        "@type": "Person",
        "@id": "https://signals.gitdealflow.com/about#author",
        name: "The Data Nerd",
        url: "https://signals.gitdealflow.com/about",
        jobTitle: "Founder & Data Engineer",
        description:
          "Builder of VC Deal Flow Signal. Background in data engineering and quantitative analysis. Writes about using public GitHub data as an alternative signal for startup investing.",
        worksFor: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
        },
        knowsAbout: [
          "GitHub API data engineering",
          "Startup engineering metrics",
          "Alternative data for venture capital",
          "Data pipeline architecture",
          "Quantitative deal sourcing",
          "Programmatic SEO",
          "Next.js application development",
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "expertise",
            name: "Data Engineering & GitHub API Analysis",
          },
        ],
        sameAs: [
          "https://orcid.org/0009-0002-2222-4112",
          "https://x.com/data_nerd",
          "https://t.me/gitdealflow",
          "https://www.linkedin.com/company/gitdealflow",
          "https://github.com/kindrat86",
          "https://news.ycombinator.com/user?id=the_data_nerd",
          "https://www.indiehackers.com/The_Data_Nerd",
          "https://dev.to/the_data_nerd",
          "https://gitdealflow.substack.com",
          "https://hackernoon.com/u/TheData_7cdit42c",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://gitdealflow.com#organization",
        name: "VC Deal Flow Signal",
        url: "https://gitdealflow.com",
        sameAs: [
          "https://x.com/data_nerd",
          "https://t.me/gitdealflow",
          "https://www.linkedin.com/company/gitdealflow",
          "https://www.wikidata.org/wiki/Q139376302",
          "https://www.crunchbase.com/organization/gitdealflow",
          "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
          "https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm",
          "https://www.sideprojectors.com/project/78284/vc-deal-flow-signal-engineering-momentum-for-vcs",
        ],
      },
      {
        "@type": "AboutPage",
        name: "About VC Deal Flow Signal",
        url: "https://signals.gitdealflow.com/about",
        mainEntity: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
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
            name: "About",
            item: "https://signals.gitdealflow.com/about",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is VC Deal Flow Signal?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "VC Deal Flow Signal is an independent data product that tracks startup engineering acceleration using public GitHub data. It monitors commit velocity, contributor growth, and repository expansion across 4,200 startup organizations in 20 sectors to surface breakout engineering teams before they appear in traditional deal sourcing channels like Crunchbase or PitchBook. Engineering acceleration signals have historically preceded fundraise announcements by three to six weeks.",
            },
          },
          {
            "@type": "Question",
            name: "Who built VC Deal Flow Signal?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "VC Deal Flow Signal was built by The Data Nerd, a data engineer with a background in venture data and quantitative analysis. The project is operated independently and is not affiliated with any VC firm, accelerator program, or investment platform. The methodology is openly published on SSRN, the dataset is mirrored on Zenodo with a DOI, and the source code and MCP server are publicly available.",
            },
          },
          {
            "@type": "Question",
            name: "Why was VC Deal Flow Signal built?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The product was built because the existing investor data stack — Crunchbase, PitchBook, Affinity, and similar — surfaces startup activity after public events. By the time a startup appears in those sources, the round is often allocated and competitive. Public GitHub data is the earliest publicly observable signal of startup momentum, and no commercial product was tracking it longitudinally at scale until VC Deal Flow Signal launched.",
            },
          },
          {
            "@type": "Question",
            name: "Is VC Deal Flow Signal affiliated with any VC firm?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. VC Deal Flow Signal is operated independently. The product is not owned, sponsored, or operated by any venture capital firm, accelerator, family office, or investment platform. The data is provided to all subscribers at the same price and on the same terms regardless of the subscriber's affiliation or fund size.",
            },
          },
          {
            "@type": "Question",
            name: "What sectors does VC Deal Flow Signal cover?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The product tracks 20 startup sectors including AI and Machine Learning, Fintech, Climate Tech, Developer Tools, Cybersecurity, Healthcare, Enterprise SaaS, Data Infrastructure, Web3, Robotics, HR Tech, PropTech, EdTech, Marketing Tech, Sales Tech, Legal Tech, Vertical SaaS, Open Source Infrastructure, Hardware, and Consumer Apps with public engineering footprints. Each sector is ranked weekly using the same engineering acceleration methodology.",
            },
          },
          {
            "@type": "Question",
            name: "How can I contact VC Deal Flow Signal?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Email signal@gitdealflow.com for product questions, methodology questions, partnership inquiries, or press requests. Response time is typically under 48 hours. The product team is small and intentionally direct — emails go to the founder, not a support queue.",
            },
          },
          {
            "@type": "Question",
            name: "Is the product open source?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The MCP server (npm package @gitdealflow/mcp-signal) is open source and available on GitHub. The methodology is openly published on SSRN. The underlying dataset is mirrored on Zenodo with a CC-BY-4.0 license. The production data pipeline and dashboard application are proprietary, but the metrics and signal definitions are fully reproducible from the published methodology.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/about"
        languages={getHreflangLanguages("/about")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">About</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6 leading-tight">
          About VC Deal Flow Signal
        </h1>

        <p className="text-gray-400 text-base leading-relaxed mb-10">
          VC Deal Flow Signal is an independent data product that tracks startup
          engineering acceleration using public GitHub data. We surface breakout
          engineering teams before they appear through traditional deal sourcing
          channels — warm introductions, press coverage, or database alerts.
        </p>

        {/* The problem */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Why This Exists
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed space-y-4">
            <p>
              Most investors source deals through their network. The problem is
              that networks are shared. By the time a startup is making the rounds
              at demo day or landing in your inbox via a warm intro, it is also in
              every other investor&apos;s inbox.
            </p>
            <p>
              The investor who arrives first has a structural advantage. Engineering
              acceleration — the rate of change in a startup&apos;s commit
              velocity — is the earliest publicly available signal of momentum. It
              precedes product milestones, which precede fundraise decisions, which
              precede press announcements.
            </p>
            <p>
              We built VC Deal Flow Signal to turn that raw GitHub data into
              actionable deal flow intelligence: sector rankings, signal
              classification, and trend tracking — updated weekly.
            </p>
          </div>
        </section>

        {/* What we track */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What We Track
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="rounded-lg border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 text-center">
              <p className="text-sky-300 text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">
                {activeSectors.length}
              </p>
              <p className="text-gray-400 text-[11px] mt-2 uppercase tracking-wider font-medium">
                Sectors
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 text-center">
              <p className="text-sky-300 text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">
                {totalStartups}+
              </p>
              <p className="text-gray-400 text-[11px] mt-2 uppercase tracking-wider font-medium">
                Startups
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 text-center">
              <p className="text-sky-300 text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">
                {allPeriods.length}
              </p>
              <p className="text-gray-400 text-[11px] mt-2 uppercase tracking-wider font-medium">
                Quarters of data
              </p>
            </div>
            <div className="rounded-lg border border-emerald-800/40 bg-gradient-to-b from-emerald-950/30 to-slate-950 p-5 text-center">
              <p className="inline-flex items-center gap-1.5 text-emerald-300 text-2xl sm:text-3xl font-bold tracking-tight">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Weekly
              </p>
              <p className="text-gray-400 text-[11px] mt-2 uppercase tracking-wider font-medium">
                Data refresh
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed space-y-4">
            <p>
              Every Monday, our pipeline queries the GitHub API for commit
              activity, contributor data, and repository metadata across{" "}
              {activeSectors.length} startup sectors. We calculate 14-day commit
              velocity and its rate of change, classify each startup&apos;s signal
              type, and regenerate the ranked sector pages.
            </p>
            <p>
              The four signal types — engineering hiring burst, infrastructure
              buildout, deploy frequency spike, and framework migration — each
              indicate a different phase of startup development. In our data,
              these patterns have preceded fundraise announcements by three to
              six weeks.
            </p>
          </div>
        </section>

        {/* Data principles */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Our Data Principles
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-gray-100 font-medium mb-2">
                Transparency
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our{" "}
                <Link
                  href="/methodology"
                  className="text-sky-500 hover:text-sky-400 underline transition-colors"
                >
                  methodology
                </Link>{" "}
                is fully public. We explain exactly how data is sourced,
                filtered, and ranked — including known limitations. The{" "}
                <Link
                  href="/api/signals.json"
                  className="text-sky-500 hover:text-sky-400 underline transition-colors"
                >
                  public API
                </Link>{" "}
                provides machine-readable access to all current data.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-gray-100 font-medium mb-2">
                Acceleration over absolutes
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We measure the rate of change, not raw volume. A startup with 50
                commits that doubled from 25 is more interesting than one with
                500 commits that stayed flat. This makes the signal comparable
                across companies of different sizes.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-gray-100 font-medium mb-2">
                Not investment advice
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Engineering acceleration is a leading indicator, not a guarantee.
                Not all accelerating startups will raise or succeed. We provide
                timing intelligence — investors must apply their own judgment,
                sector expertise, and due diligence.
              </p>
            </div>
          </div>
        </section>

        {/* Author / founder section */}
        <section className="mb-10" id="author">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Who Built This
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed space-y-4">
            <p>
              Built by{" "}
              <strong className="text-gray-200">The Data Nerd</strong> — a
              data engineer with a background in quantitative analysis and
              large-scale data pipelines. After years of watching VCs rely on
              word-of-mouth and warm intros for deal sourcing, he started
              asking a simple question: what if you could see which startups
              are accelerating before anyone talks about them?
            </p>
            <p>
              VC Deal Flow Signal is the answer. It continuously monitors
              public GitHub activity across thousands of startups, turning raw
              commits, contributor growth, and release cadence into a single
              acceleration score. No hype, no press releases — just
              engineering momentum measured weekly.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://x.com/data_nerd"
                className="text-sky-500 hover:text-sky-400 underline text-xs font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter/X
              </a>
              <a
                href="https://t.me/gitdealflow"
                className="text-sky-500 hover:text-sky-400 underline text-xs font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
              <a
                href="https://www.linkedin.com/company/gitdealflow"
                className="text-sky-500 hover:text-sky-400 underline text-xs font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="mailto:signal@gitdealflow.com"
                className="text-sky-500 hover:text-sky-400 underline text-xs font-medium transition-colors"
              >
                signal@gitdealflow.com
              </a>
            </div>
          </div>
        </section>

        {/* How to use it */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            How to Use This Data
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed space-y-4">
            <p>
              <strong className="text-gray-200">For deal sourcing:</strong>{" "}
              Browse the{" "}
              <Link
                href="/"
                className="text-sky-500 hover:text-sky-400 underline transition-colors"
              >
                sector rankings
              </Link>{" "}
              weekly. When an unfamiliar name appears in the top 3, research
              them. Cross-reference with Crunchbase for funding history and reach
              out during the acceleration window (weeks 2-4).
            </p>
            <p>
              <strong className="text-gray-200">
                For portfolio monitoring:
              </strong>{" "}
              Track your portfolio companies on the{" "}
              <Link
                href="/trending"
                className="text-sky-500 hover:text-sky-400 underline transition-colors"
              >
                trending page
              </Link>
              . A sudden drop in commit velocity can indicate team attrition,
              strategic confusion, or runway pressure — signals that appear
              before the quarterly board update.
            </p>
            <p>
              <strong className="text-gray-200">For AI and tools:</strong> The{" "}
              <Link
                href="/api/signals.json"
                className="text-sky-500 hover:text-sky-400 underline transition-colors"
              >
                JSON API
              </Link>{" "}
              and{" "}
              <Link
                href="/llms.txt"
                className="text-sky-500 hover:text-sky-400 underline transition-colors"
              >
                llms.txt
              </Link>{" "}
              provide machine-readable access for AI agents, dashboards, and
              custom integrations. Free with attribution.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Contact
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed">
            <div className="space-y-2">
              <p>
                <strong className="text-gray-200">Email:</strong>{" "}
                <a
                  href="mailto:signal@gitdealflow.com"
                  className="text-sky-500 hover:text-sky-400 underline transition-colors"
                >
                  signal@gitdealflow.com
                </a>
              </p>
              <p>
                <strong className="text-gray-200">Twitter/X:</strong>{" "}
                <a
                  href="https://x.com/data_nerd"
                  className="text-sky-500 hover:text-sky-400 underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @data_nerd
                </a>
              </p>
              <p>
                <strong className="text-gray-200">Telegram:</strong>{" "}
                <a
                  href="https://t.me/gitdealflow"
                  className="text-sky-500 hover:text-sky-400 underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  t.me/gitdealflow
                </a>
              </p>
              <p>
                <strong className="text-gray-200">LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/company/gitdealflow"
                  className="text-sky-500 hover:text-sky-400 underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/company/gitdealflow
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Start watching the signals
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Browse startup rankings across {activeSectors.length} sectors, or
            get this week's top 5 breakout startups free.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
            >
              Browse Sectors
            </Link>
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              See This Week's Signals
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
