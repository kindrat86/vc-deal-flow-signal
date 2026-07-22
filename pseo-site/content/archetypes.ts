/**
 * Three reader-archetypes for VC Deal Flow Signal.
 *
 * Single source of truth for: /who-this-is-for, the homepage archetype-card
 * preview, the /about reader-section, the /quiz archetype routing, and any
 * future surface that needs to address one of the three buying motions.
 *
 * Constraint: customer copy is anonymity-safe and framework-neutral. Archetype
 * names ("Solo Angel", "Fund GP", "Family Office Analyst") are industry-standard,
 * not borrowed terminology. Internal mapping to the Brunson Dream-Customer
 * workbook lives in `brunson/08-dream-customer.md` §8 (NOT shipped to the public).
 *
 * Edit here → render everywhere. Each archetype carries:
 *   - id           : stable URL/query-string token (kebab-case)
 *   - label        : public name
 *   - shortLabel   : compact label for nav/pills
 *   - oneLiner     : single sentence the buyer should recognise themselves in
 *   - dayShape     : 3 short clauses describing their week-rhythm
 *   - jobs         : 3 jobs-to-be-done in their own voice
 *   - entryTier    : the pricing tier that's their primary on-ramp
 *   - rampTier     : the next tier they'd typically grow into
 *   - entryCta     : the button text + href for the entry tier
 *   - rampCta      : optional secondary button
 *   - whatBuys     : 3 reasons this reader signs up specifically
 *   - notForYouIf  : the disqualifier line that helps the WRONG reader leave
 *   - accent       : tailwind colour token used for visual differentiation
 *
 * Audit 2026-05-09: split from the single "developer-investor" composite.
 * Source workbook: brunson/08-dream-customer.md §8 (V2 split).
 */

export type ArchetypeId = "solo-angel" | "fund-gp" | "family-office";

export interface Archetype {
  id: ArchetypeId;
  label: string;
  shortLabel: string;
  oneLiner: string;
  dayShape: [string, string, string];
  jobs: [string, string, string];
  entryTier: {
    name: string;
    price: string;
    href: string;
    external?: boolean;
  };
  rampTier: {
    name: string;
    price: string;
    href: string;
    external?: boolean;
  };
  entryCta: { label: string; href: string; external?: boolean };
  rampCta: { label: string; href: string; external?: boolean };
  whatBuys: [string, string, string];
  notForYouIf: string;
  accent: "sky" | "amber" | "emerald";
}

export const ARCHETYPES: readonly Archetype[] = [
  {
    id: "solo-angel",
    label: "Solo Angel",
    shortLabel: "Solo Angel",
    oneLiner:
      "Engineer or ex-founder writing personal angel checks of €5k–€50k. Five to forty investments to date. Lives in Cursor, Claude, and GitHub all day.",
    dayShape: [
      "Code in the morning, scroll Hacker News and Twitter at lunch.",
      "An AngelList syndicate invite at 14:00; decide on the check by 18:00.",
      "Read a Pragmatic Engineer issue in bed.",
    ],
    jobs: [
      "Show me one company a week I’d otherwise miss.",
      "Confirm my hunch that a startup I’m circling is shipping faster than its peers.",
      "Give me a Sunday digest dense enough that I don’t need to scroll Twitter on Monday.",
    ],
    entryTier: {
      name: "Free Acceleration Watch",
      price: "€0",
      href: "https://gitdealflow.com/#signup",
      external: true,
    },
    rampTier: {
      name: "Dashboard",
      price: "€49/mo",
      href: "/pricing",
    },
    entryCta: {
      label: "Start with the free Sunday digest",
      href: "https://gitdealflow.com/#signup",
      external: true,
    },
    rampCta: {
      label: "Or jump to the €49/mo Dashboard",
      href: "/pricing",
    },
    whatBuys: [
      "A Sunday digest where five names beats fifty — density over volume.",
      "MCP-native: query the data straight from Claude or Cursor, no dashboard tab.",
      "Methodology PDF over founder polish. Engineer-coded honesty, not enterprise theatre.",
    ],
    notForYouIf:
      "You write €1M+ tickets out of a fund and need full-coverage screening — that’s a different category. Sharp Tier (€497/mo) would feel like overkill for a personal checkbook.",
    accent: "sky",
  },
  {
    id: "fund-gp",
    label: "Fund GP / Scout",
    shortLabel: "Fund GP",
    oneLiner:
      "Sole or lead GP at a fund under $50M AUM, or a named scout for a larger fund. Writes a Monday memo for partners. Has at least one analyst or a sourcing-tool stack you’re paying for.",
    dayShape: [
      "Memo before standup, founder calls in the afternoon.",
      "End of day = watchlist updates plus one LP question answered.",
      "Friday is the LP-update draft; the leading indicator goes in paragraph two.",
    ],
    jobs: [
      "Give me fifty names per sector my analyst can chase.",
      "Custom watchlist I can share with my partner, plus an API into our internal CRM.",
      "A 21–47-day first-mover window I can credibly explain in an LP update.",
    ],
    entryTier: {
      name: "Insider Circle",
      price: "€197/mo",
      href: "/insider",
    },
    rampTier: {
      name: "Sharp Tier",
      price: "€497/mo (capped 8 funds)",
      href: "/apply",
    },
    entryCta: {
      label: "Read the Insider case (24-hour lead)",
      href: "/insider",
    },
    rampCta: {
      label: "Or apply for Sharp Tier",
      href: "/apply",
    },
    whatBuys: [
      "A 24-hour lead window over the free digest — your analyst sees it before consensus does.",
      "White-labeled API + custom watchlists; methodology source under CC BY 4.0 so an LP can audit it.",
      "Quarterly review call with the methodology lead. Capped 8 funds means scarcity is real, not theatre.",
    ],
    notForYouIf:
      "You’re a Series-B+ partner with a six-figure data budget — Harmonic, Tracxn, and Affinity are built for full-coverage screening. We’re a leading-indicator overlay, not a replacement.",
    accent: "amber",
  },
  {
    id: "family-office",
    label: "Family Office Analyst",
    shortLabel: "Family Office",
    oneLiner:
      "Analyst or principal at a single-family office, multi-family office, or institutional allocator. Less personal stake, more recurring rigor. Writes detailed diligence memos. You buy methodology, not features.",
    dayShape: [
      "Mornings on existing-portfolio monitoring.",
      "Afternoons on a deep-dive into one sector.",
      "End of week is a written report to principal or compliance.",
    ],
    jobs: [
      "A reproducible methodology paper my compliance team can audit.",
      "ClaimReview-grade provenance on every public claim — not a marketing assertion.",
      "Annual contract with a named methodology lead, not a Stripe self-service flow.",
    ],
    entryTier: {
      name: "Sector Sweep",
      price: "€1,997 once",
      href: "/sector-sweep",
    },
    rampTier: {
      name: "Methodology Partnership",
      price: "€14,997/yr",
      href: "/methodology-partnership",
    },
    entryCta: {
      label: "Commission a Sector Sweep",
      href: "/sector-sweep",
    },
    rampCta: {
      label: "Or open the Methodology Partnership",
      href: "/methodology-partnership",
    },
    whatBuys: [
      "SSRN paper with replication appendix. CC BY 4.0 licensing — your compliance team can host the dataset internally.",
      "Methodology Partnership is a named partnership, not a subscription. Procurement-friendly, annually renewed.",
      "Anonymous-by-design matches a compliance preference for source over personality. The voice is the methodology.",
    ],
    notForYouIf:
      "You need a self-serve €9.97 SaaS. The Dashboard is honest, but it isn’t the contract shape your compliance team will sign. Start at Sector Sweep or above.",
    accent: "emerald",
  },
] as const;

export function getArchetype(id: ArchetypeId): Archetype {
  const found = ARCHETYPES.find((a) => a.id === id);
  if (!found) {
    throw new Error(`[archetypes] unknown id: ${id}`);
  }
  return found;
}

export const ARCHETYPE_IDS: readonly ArchetypeId[] = ARCHETYPES.map(
  (a) => a.id,
);

/**
 * Map quiz tier-route (F/T/D/I) → most likely archetype.
 *
 * Heuristic only — the quiz V2 also collects an explicit self-ID question,
 * which overrides this map. Use this as the fallback when the user skips Q5.
 */
export const TIER_TO_ARCHETYPE: Record<"F" | "T" | "D" | "I", ArchetypeId> = {
  F: "solo-angel",
  T: "solo-angel",
  D: "solo-angel",
  I: "fund-gp",
};
