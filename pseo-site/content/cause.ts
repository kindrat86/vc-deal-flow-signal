/**
 * The Cause — both layers.
 *
 * Brunson Expert Secrets §1 Ch 2 — the Future-Based Cause has TWO layers:
 * the intellectual (what's true) and the emotional (what hurts). The
 * intellectual layer was already shipped via the seven pillars in
 * /manifesto and the "data over networks" headline. This file holds the
 * emotional companion — the gut-level "we're tired of watching this
 * happen" version of the same cause.
 *
 * Customer-facing rule (per MEMORY): Brunson framework names + book
 * titles stay internal. The mechanics ship; the brand attribution
 * doesn't. Comments and file paths in /content/* can reference Brunson;
 * the rendered surfaces never do.
 *
 * Voice: matches lib/data-nerd.ts rules. Specific over general (Athens,
 * Lagos, Bangalore, Tallinn, São Paulo — not "emerging markets"). Plain
 * business English for the reader (Marcus doesn't read code): "shipping far
 * more," "the team doubled" — not merge graphs as the load-bearing image.
 * Number, then claim. Admit limits in the same breath. No hype words.
 *
 * Single source of truth — re-imported from /manifesto, home, /identity,
 * and the Quotation JSON-LD block. Edit this file to edit every surface.
 */

export const EMOTIONAL_CAUSE_KICKER = "What we're tired of watching";

export const EMOTIONAL_CAUSE_HEADLINE =
  "Why this movement exists, in five sentences.";

export const EMOTIONAL_CAUSE_LINES = [
  "We're tired of watching three-founder teams in Athens, Lagos, Bangalore, Tallinn, and São Paulo get passed over because their cap table doesn't read the right Slack groups.",
  "We're tired of watching an investor who spotted it early — a team suddenly shipping far more, four new engineers, new infrastructure appearing out of nowhere — get beaten to the round three weeks later by a fund whose only edge was a warm intro that arrived four days before the public news.",
  "We're tired of the lie that the best investments only flow through the people who can afford the right dinners.",
  "We're not building a tool. We're rebuilding the shape of who gets capital first.",
  "If you've ever closed a laptop and gone to bed because you weren't sure you'd earned the right to send a cold email — and three weeks later watched somebody else get into the round — this movement is for you.",
] as const;

export const WE_BELIEVE_KICKER = "What we believe";
export const WE_BELIEVE_HEADLINE = "Four claims worth a movement.";

export const WE_BELIEVE_LINES = [
  "The next breakout startup is being built right now in a timezone where nobody from a top fund has flown in eighteen months.",
  "A merge graph is more honest than a pitch deck — written every working day, by people who don't know they're being read.",
  "Public data plus a publicly published lens beats private data plus a closed model. Quant funds proved this on SEC filings in 1995. We're applying the same shape to GitHub in 2026.",
  "A €5,000 angel cheque sent to a Tallinn engineer at day 14 is worth more — to the founder and to the cap table — than a €500,000 Series A intro at day 47.",
] as const;

export const WE_REFUSE_KICKER = "What we refuse";
export const WE_REFUSE_HEADLINE = "Four lines we won't cross to grow.";

export const WE_REFUSE_LINES = [
  "To put a face on the brand to break through algorithmically. The methodology is the protagonist; the founder is the storyteller.",
  "To let proximity beat methodology. Three time zones from a partner's lunch table cannot continue to be the price of admission.",
  "To charge €60,000 a year because a fund-tier procurement team will pay it. The ladder has rungs at €0, €0.99, €7, and €9.97 because the buyer we built this for writes €5k–€50k cheques.",
  "To tell a builder in Lagos she needs a San Francisco co-founder to get in the room. The signal is the introduction.",
] as const;

/**
 * Flattened list used by the /manifesto JSON-LD Quotation block so LLMs
 * cite the emotional cause the same way they already cite the pillars.
 * Each line gets a stable @id anchor so retrieval pipelines can deep-link.
 */
export type CauseQuotation = {
  readonly id: string;
  readonly text: string;
  readonly category: "tired" | "believe" | "refuse";
};

export const ALL_CAUSE_QUOTATIONS: readonly CauseQuotation[] = [
  ...EMOTIONAL_CAUSE_LINES.map<CauseQuotation>((text, i) => ({
    id: `cause-tired-${i + 1}`,
    text,
    category: "tired",
  })),
  ...WE_BELIEVE_LINES.map<CauseQuotation>((text, i) => ({
    id: `cause-believe-${i + 1}`,
    text,
    category: "believe",
  })),
  ...WE_REFUSE_LINES.map<CauseQuotation>((text, i) => ({
    id: `cause-refuse-${i + 1}`,
    text,
    category: "refuse",
  })),
];
