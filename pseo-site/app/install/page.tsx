import type { Metadata } from "next";
import InstallClient from "./InstallClient";
import { withEditorialOverride } from "@/lib/metadata";

const SITE = "https://signals.gitdealflow.com";
const TITLE = "GitDealFlow Bookmarklet, See investor signal on every github.com page";
const DESCRIPTION =
  "One drag, zero install. The GitDealFlow bookmarklet pops a momentum-and-Scout-Score card on any github.com profile or repo. Free, works in every browser, no extension store review.";

export const metadata: Metadata = withEditorialOverride({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/install" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/install`,
    type: "website",
    images: [
      { url: `${SITE}/api/og/badge-builder`, width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sipiteno",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE}/api/og/badge-builder`],
  },
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: TITLE,
      url: `${SITE}/install`,
      description: DESCRIPTION,
      isPartOf: { "@type": "WebSite", name: "VC Deal Flow Signal", url: SITE },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: "Install", item: `${SITE}/install` },
        ],
      },
    },
    {
      "@type": "HowTo",
      name: "How to install the GitDealFlow bookmarklet",
      description:
        "Three-step workflow to drop a one-click momentum + Scout Score overlay on every github.com page.",
      totalTime: "PT20S",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Show your bookmarks bar",
          text: "On Chrome / Edge / Brave / Comet press Cmd/Ctrl+Shift+B. On Firefox right-click the toolbar and enable Bookmarks Toolbar. On Safari turn on Show Favorites Bar in the View menu.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Drag the GitDealFlow button to your bookmarks bar",
          text: "On signals.gitdealflow.com/install drag the orange GitDealFlow Signal button onto your visible bookmarks bar. The browser saves it as a bookmarklet, a clickable JavaScript link.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Click the bookmark on any github.com page",
          text: "Open any github.com profile or repo page, then click the GitDealFlow Signal bookmark. A live momentum-and-Scout-Score card opens in a small window. Free, no signup, works on every browser.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How is this different from the three GitDealFlow Chrome Extensions?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Four install paths, four surfaces. (1) The bookmarklet works on github.com pages, the place where engineering momentum first shows up. (2) Chrome Extension #1 overlays signal on Crunchbase and Wellfound profiles. (3) Chrome Extension #2, VC GitHub Lookup, hovers any github.com repo or org link from any page and returns velocity in 200ms. (4) Chrome Extension #3, VC Term Highlighter, underlines VC terms (SAFE, runway, burn multiple, commit velocity, …) on any web page and links to the full definition in the GitDealFlow glossary. Use all four, or pick whichever matches where you scout deal flow today.",
          },
        },
        {
          "@type": "Question",
          name: "Does the bookmarklet send my browsing data anywhere?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The bookmarklet only reads the current github.com URL when you click it, then opens a popup window pointing at signals.gitdealflow.com with the org and repo as URL params. It does not run any background scripts, does not track navigation, and only executes when you click the bookmark.",
          },
        },
        {
          "@type": "Question",
          name: "Does it work in Firefox / Safari / Arc?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Bookmarklets are vanilla JavaScript saved as a bookmark, so they work in every modern browser, Chrome, Firefox, Safari, Edge, Brave, Arc, Opera, Comet, Vivaldi. No extension store review required.",
          },
        },
        {
          "@type": "Question",
          name: "What happens if the repo isn't tracked yet?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You'll see an Untracked card with a Predict button. Lock in a forward call, if the repo is later validated and raises in the next 6 months, you get credit on the Scout leaderboard.",
          },
        },
      ],
    },
  ],
};

export default function InstallPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InstallClient />
    </>
  );
}
