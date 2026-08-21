// Sourced from the current public signals API on 2026-08-21.
// Keep this list aligned with api/signals.json.meta.totalSectors and use it
// for every First Look selector, validator, and delivery message.
export const LIVE_SECTORS = [
  { slug: "healthcare", label: "Healthcare" },
  { slug: "edtech", label: "EdTech" },
  { slug: "ecommerce-infrastructure", label: "E-commerce Infrastructure" },
  { slug: "supply-chain", label: "Supply Chain" },
  { slug: "web3", label: "Web3" },
  { slug: "enterprise-saas", label: "Enterprise SaaS" },
  { slug: "data-infrastructure", label: "Data Infrastructure" },
  { slug: "robotics", label: "Robotics" },
  { slug: "legal-tech", label: "Legal Tech" },
  { slug: "hr-tech", label: "HR Tech" },
  { slug: "proptech", label: "PropTech" },
  { slug: "agtech", label: "AgTech" },
  { slug: "gaming", label: "Gaming" },
  { slug: "space-tech", label: "Space Tech" },
  { slug: "social-community", label: "Social & Community" },
] as const;

export const LIVE_SECTOR_SLUGS = LIVE_SECTORS.map(({ slug }) => slug);
export const LIVE_SECTOR_SET = new Set<string>(LIVE_SECTOR_SLUGS);
export const LIVE_SECTOR_LABELS = LIVE_SECTORS.map(({ label }) => label).join(", ");
