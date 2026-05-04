import type { Metadata } from "next";
import BadgeBuilderClient from "./BadgeBuilderClient";

const SITE = "https://signals.gitdealflow.com";
const TITLE = "Free Scout Score badges for your GitHub README — Badge Builder";
const DESCRIPTION =
  "Drop a live, shields.io-style Scout Score badge into any GitHub profile, or a Commit Momentum tier badge into any tracked repo. Auto-updates, no signup, no telemetry. Same look as Codecov or WakaTime.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/badge-builder" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/badge-builder`,
    type: "website",
    images: [
      { url: `${SITE}/api/og/badge-builder`, width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE}/api/og/badge-builder`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: TITLE,
      url: `${SITE}/badge-builder`,
      description: DESCRIPTION,
      isPartOf: {
        "@type": "WebSite",
        name: "VC Deal Flow Signal",
        url: SITE,
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: "Badge Builder", item: `${SITE}/badge-builder` },
        ],
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2"],
      },
    },
    {
      "@type": "HowTo",
      name: "How to add a Scout Score badge to your GitHub README",
      description:
        "Three-step workflow for embedding a live, auto-updating Scout Score badge in any GitHub profile or repo README. No signup, no telemetry, same look as Codecov or WakaTime.",
      totalTime: "PT15S",
      supply: [{ "@type": "HowToSupply", name: "Public GitHub username" }],
      tool: [{ "@type": "HowToTool", name: "GitHub README editor" }],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Open the badge builder",
          text: "Visit signals.gitdealflow.com/badge-builder. No login or signup required.",
          url: `${SITE}/badge-builder`,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Paste your GitHub username",
          text: "Type your public GitHub handle into the Scout Score input. The live preview renders immediately and three copy-paste snippets generate (markdown, HTML, BBCode).",
          url: `${SITE}/badge-builder#scout`,
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Paste the markdown into your README",
          text: "Copy the markdown snippet and drop it anywhere in your GitHub profile README or repo README. The badge renders within seconds and auto-updates within an hour as your starring history grows.",
          url: `${SITE}/badge-builder#paste`,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is the Scout Score badge free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Both the Scout Score badge (per GitHub user) and the Commit Momentum badge (per tracked repo) are free, with no signup, no telemetry, and no rate limit on the CDN-served version. Same model as Codecov, WakaTime, or shields.io.",
          },
        },
        {
          "@type": "Question",
          name: "Will the badge slow down my README?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. GitHub renders all README images through its camo proxy, which caches the SVG aggressively (24 hours on our CDN with hourly ETag revalidation). The badge endpoint always returns a valid SVG, even on transient errors, so a bad render is a neutral gray pill rather than a broken-image icon.",
          },
        },
        {
          "@type": "Question",
          name: "How often does the Scout Score update?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Within an hour of any change to your starring history. The badge endpoint sets Cache-Control: max-age=300, s-maxage=86400, stale-while-revalidate=604800, with an ETag of {username}:{score}:{rank}. GitHub's camo proxy revalidates against the ETag once per hour per region.",
          },
        },
      ],
    },
  ],
};

export default function BadgeBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BadgeBuilderClient />
    </>
  );
}
