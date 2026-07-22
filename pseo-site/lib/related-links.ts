/**
 * Generic related-link generator for pSEO pages.
 * Provides default cross-link groups (methodology, free tools, related content)
 * for any page that doesn't have its own domain-specific linking logic.
 * Used by <RelatedLinks> component across route templates.
 */
import type { RelatedGroup } from "@/components/RelatedLinks";

/** Default "always-on" related-link groups suitable for any content page. */
export function getDefaultRelatedGroups(): RelatedGroup[] {
  return [
    {
      title: "How it's measured",
      links: [
        {
          href: "/methodology",
          label: "Methodology",
          subtitle: "How acceleration is measured, end-to-end.",
        },
        {
          href: "/glossary",
          label: "Glossary",
          subtitle: "Plain-language definitions for every signal type.",
        },
        {
          href: "/faq",
          label: "FAQ",
          subtitle: "60+ answers to sourcing questions.",
        },
      ],
    },
    {
      title: "Free tools & data",
      links: [
        {
          href: "/trending",
          label: "Trending startups",
          subtitle: "Top 20 by acceleration, refreshed weekly.",
        },
        {
          href: "/receipts",
          label: "Scout Score (free)",
          subtitle: "Paste a GitHub username, get a 0–100 taste score.",
        },
        {
          href: "/api/signals.json",
          label: "Signals JSON",
          subtitle: "Live API. CC BY 4.0.",
        },
        {
          href: "/explore",
          label: "Explore the network",
          subtitle: "Interactive link graph of all sectors and signal types.",
        },
      ],
    },
    {
      title: "Buyer resources",
      links: [
        {
          href: "/compare",
          label: "Compare tools",
          subtitle: "Side-by-side with Harmonic, Affinity, Tracxn.",
        },
        {
          href: "/buyers-guide",
          label: "Buyer's guide",
          subtitle: "11 criteria to evaluate any deal-flow tool.",
        },
        {
          href: "/pricing",
          label: "Pricing",
          subtitle: "Free tier + paid plans with 30-day guarantee.",
        },
      ],
    },
  ];
}
