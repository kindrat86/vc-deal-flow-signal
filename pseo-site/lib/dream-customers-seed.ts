/**
 * Seed list of 73 verified Marcus-100 VC targets (apex buyers for GitDealFlow).
 *
 * Re-seedable: the seed script upserts by `handle`. Edit a row here + re-run
 * `npx tsx scripts/seed-dream-customers.ts` to update PB (handle is the key,
 * so you can correct firm/role/url/confidence safely; do not rename handles
 * via this file — drop + re-add through the UI instead).
 *
 * Segment buckets:
 *   A — Solo GPs & Micro-VCs        (29 rows)
 *   B — Mid-Tier VC Partners        (37 rows, non-engineer)
 *   D — Family Office Tech Principals (3 rows)
 *   F — VC Platform / Research Leads (4 rows)
 *
 * Confidence is from the most recent live X-profile verification pass; LOW
 * means the account was inactive or the role mapping needs re-check before
 * outreach.
 */

export type Segment = "A" | "B" | "D" | "F";
export type Confidence = "HIGH" | "MEDIUM" | "LOW";

export interface SeedRow {
  name: string;
  handle: string;
  firm: string;
  role: string;
  segment: Segment;
  confidence: Confidence;
}

export const DREAM_CUSTOMERS_SEED: SeedRow[] = [
  // A — Solo GPs & Micro-VCs (29)
  { name: "Cyan Banister", handle: "cyantist", firm: "Long Journey Ventures", role: "General Partner", segment: "A", confidence: "HIGH" },
  { name: "Turner Novak", handle: "TurnerNovak", firm: "Banana Capital", role: "Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Josh Buckley", handle: "joshbuckley", firm: "Buckley Ventures", role: "Founder/Solo GP", segment: "A", confidence: "HIGH" },
  { name: "Lachy Groom", handle: "lachygroom", firm: "Groom Ventures", role: "Solo GP", segment: "A", confidence: "MEDIUM" },
  { name: "Brianne Kimmel", handle: "briannekimmel", firm: "Worklife VC", role: "Founder/Managing Partner", segment: "A", confidence: "HIGH" },
  { name: "Jesse Draper", handle: "JesseDraper", firm: "Halogen Ventures", role: "Founding Partner", segment: "A", confidence: "HIGH" },
  { name: "David Hornik", handle: "davidhornik", firm: "Lobby Capital", role: "Founding Partner", segment: "A", confidence: "HIGH" },
  { name: "Harry Stebbings", handle: "HarryStebbings", firm: "20VC", role: "Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Niko Bonatsos", handle: "bonatsos", firm: "Verdict Capital (ex-GC)", role: "Co-Founder", segment: "A", confidence: "HIGH" },
  { name: "Nikhil Basu Trivedi", handle: "nbt", firm: "Footwork", role: "Co-Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Charles Hudson", handle: "chudson", firm: "Precursor Ventures", role: "Founder/Managing Partner", segment: "A", confidence: "HIGH" },
  { name: "Ryan Hoover", handle: "rrhoover", firm: "Weekend Fund", role: "Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Elizabeth Yin", handle: "dunkhippo33", firm: "Hustle Fund", role: "Co-Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Eric Bahn", handle: "ericbahn", firm: "Hustle Fund", role: "Co-Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Allison Pickens", handle: "PickensAllison", firm: "The New Normal Fund", role: "Solo GP", segment: "A", confidence: "HIGH" },
  { name: "Roy Bahat", handle: "roybahat", firm: "Bloomberg Beta", role: "Head", segment: "A", confidence: "HIGH" },
  { name: "Mac Conwell", handle: "MacConwell", firm: "RareBreed Ventures", role: "Founder/Managing Partner", segment: "A", confidence: "HIGH" },
  { name: "Lolita Taub", handle: "lolitataub", firm: "Ganas Ventures", role: "Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Paige Finn Doherty", handle: "paigefinnn", firm: "Behind Genius Ventures", role: "Founding Partner", segment: "A", confidence: "HIGH" },
  { name: "Mark Suster", handle: "msuster", firm: "Upfront Ventures", role: "Managing Partner", segment: "A", confidence: "HIGH" },
  { name: "Jenny Fielding", handle: "jefielding", firm: "Everywhere Ventures", role: "Co-Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Brad Feld", handle: "bfeld", firm: "Foundry Group", role: "Partner", segment: "A", confidence: "HIGH" },
  { name: "Seth Levine", handle: "sether", firm: "Foundry Group", role: "Co-Founder/Partner", segment: "A", confidence: "MEDIUM" },
  { name: "Sam Lessin", handle: "lessin", firm: "Slow Ventures", role: "Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Aileen Lee", handle: "aileenlee", firm: "Cowboy Ventures", role: "Founder/Managing Partner", segment: "A", confidence: "LOW" },
  { name: "Jason Lemkin", handle: "jasonlk", firm: "SaaStr Fund", role: "Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Hadley Harris", handle: "Hadley", firm: "Eniac Ventures", role: "Co-Founder/GP", segment: "A", confidence: "HIGH" },
  { name: "Bedy Yang", handle: "bedy", firm: "500 Global", role: "Managing Partner", segment: "A", confidence: "HIGH" },
  { name: "Christine Tsai", handle: "christine_tsai", firm: "500 Global", role: "CEO/Founding Partner", segment: "A", confidence: "HIGH" },

  // B — Mid-Tier VC Partners (37)
  { name: "Sarah Tavel", handle: "sarahtavel", firm: "Benchmark", role: "General Partner", segment: "B", confidence: "HIGH" },
  { name: "Greg Sands", handle: "gsands", firm: "Costanoa Ventures", role: "Founder/Managing Partner", segment: "B", confidence: "HIGH" },
  { name: "Kirsten Green", handle: "kirstenagreen", firm: "Forerunner Ventures", role: "Founder/Managing Partner", segment: "B", confidence: "HIGH" },
  { name: "Dan Levitan", handle: "Levitan", firm: "Maveron", role: "Co-Founder/Partner", segment: "B", confidence: "HIGH" },
  { name: "Jeff Lieberman", handle: "JeffLLieberman", firm: "Insight Partners", role: "Managing Director", segment: "B", confidence: "MEDIUM" },
  { name: "Lonne Jaffe", handle: "lonnej", firm: "Insight Partners", role: "Managing Director", segment: "B", confidence: "HIGH" },
  { name: "Susan Lyne", handle: "smlyne", firm: "BBG Ventures", role: "Co-Founder/Managing Partner", segment: "B", confidence: "MEDIUM" },
  { name: "Paul Martino", handle: "ahpah", firm: "Bullpen Capital", role: "Managing Partner", segment: "B", confidence: "HIGH" },
  { name: "Bryan Roberts", handle: "BRobertsVC", firm: "Venrock", role: "Partner", segment: "B", confidence: "HIGH" },
  { name: "Jeremy Liew", handle: "jeremysliew", firm: "Lightspeed", role: "Partner", segment: "B", confidence: "HIGH" },
  { name: "Andrew Chen", handle: "andrewchen", firm: "a16z", role: "General Partner", segment: "B", confidence: "HIGH" },
  { name: "Connie Chan", handle: "conniechan", firm: "a16z (transitioning out)", role: "GP (winding down)", segment: "B", confidence: "LOW" },
  { name: "Eric Vishria", handle: "ericvishria", firm: "Benchmark", role: "General Partner", segment: "B", confidence: "HIGH" },
  { name: "Mike Maples, Jr.", handle: "m2jr", firm: "Floodgate", role: "Partner", segment: "B", confidence: "HIGH" },
  { name: "Ann Miura-Ko", handle: "annimaniac", firm: "Floodgate", role: "Co-Founding Partner", segment: "B", confidence: "MEDIUM" },
  { name: "Tony Conrad", handle: "tonyconrad", firm: "True Ventures", role: "Partner", segment: "B", confidence: "HIGH" },
  { name: "Bijan Sabet", handle: "bijan", firm: "Spark Capital", role: "Co-Founder/GP", segment: "B", confidence: "HIGH" },
  { name: "Jenny Lefcourt", handle: "jennylefcourt", firm: "Freestyle Capital", role: "GP", segment: "B", confidence: "LOW" },
  { name: "Logan Bartlett", handle: "loganbartlett", firm: "Redpoint Ventures", role: "Managing Director", segment: "B", confidence: "HIGH" },
  { name: "Tomasz Tunguz", handle: "ttunguz", firm: "Theory Ventures", role: "Founder/GP", segment: "B", confidence: "HIGH" },
  { name: "Carolina Brochado", handle: "ctbrochado", firm: "EQT Growth", role: "Partner", segment: "B", confidence: "HIGH" },
  { name: "Will Quist", handle: "wquist", firm: "Slow Ventures", role: "Partner", segment: "B", confidence: "HIGH" },
  { name: "Hemant Taneja", handle: "htaneja", firm: "General Catalyst", role: "CEO", segment: "B", confidence: "HIGH" },
  { name: "Matt Turck", handle: "mattturck", firm: "FirstMark Capital", role: "General Partner", segment: "B", confidence: "HIGH" },
  { name: "Rick Heitzmann", handle: "rick", firm: "FirstMark Capital", role: "Founder/Managing Director", segment: "B", confidence: "HIGH" },
  { name: "Beth Ferreira", handle: "bethferreira", firm: "FirstMark Capital", role: "Partner", segment: "B", confidence: "MEDIUM" },
  { name: "Aydin Senkut", handle: "asenkut", firm: "Felicis", role: "Founder/Managing Partner", segment: "B", confidence: "HIGH" },
  { name: "Andy Weissman", handle: "aweissman", firm: "Union Square Ventures", role: "Managing Partner", segment: "B", confidence: "HIGH" },
  { name: "Fred Wilson", handle: "fredwilson", firm: "Union Square Ventures", role: "Co-Founder", segment: "B", confidence: "HIGH" },
  { name: "Frank Rotman", handle: "fintechjunkie", firm: "QED Investors", role: "Partner Emeritus", segment: "B", confidence: "MEDIUM" },
  { name: "Niki Scevak", handle: "nikiscevak", firm: "Blackbird Ventures", role: "Co-Founder/Partner", segment: "B", confidence: "HIGH" },
  { name: "Sarah Cannon", handle: "SarahRCannon", firm: "Index → Coatue (verify)", role: "General Partner", segment: "B", confidence: "MEDIUM" },
  { name: "Brad Gerstner", handle: "altcap", firm: "Altimeter Capital", role: "Founder/CEO", segment: "B", confidence: "HIGH" },
  { name: "Ben Lerer", handle: "BenjLerer", firm: "Lerer Hippeau", role: "Managing Partner", segment: "B", confidence: "HIGH" },
  { name: "Justin Mateen", handle: "Justin_Mateen", firm: "JAM Fund", role: "Founder/Managing Partner", segment: "B", confidence: "HIGH" },
  { name: "Steve Vassallo", handle: "vassallo", firm: "Foundation Capital", role: "General Partner", segment: "B", confidence: "MEDIUM" },
  { name: "Patrick Chung", handle: "patrickchung", firm: "Xfund", role: "Managing General Partner", segment: "B", confidence: "HIGH" },

  // D — Family Office Tech Principals (3)
  { name: "Matthew Jacobson", handle: "mjacobson1003", firm: "ICONIQ Growth", role: "General Partner", segment: "D", confidence: "HIGH" },
  { name: "Murali Joshi", handle: "12muralij", firm: "ICONIQ Growth", role: "Partner", segment: "D", confidence: "MEDIUM" },
  { name: "Roy Luo", handle: "roybluo", firm: "ICONIQ Growth", role: "General Partner", segment: "D", confidence: "MEDIUM" },

  // F — VC Platform / Insights / Research Leads (4)
  { name: "Sonya Huang", handle: "sonyatweetybird", firm: "Sequoia Capital", role: "Partner (AI thesis lead)", segment: "F", confidence: "HIGH" },
  { name: "Alfred Lin", handle: "Alfred_Lin", firm: "Sequoia Capital", role: "Partner", segment: "F", confidence: "HIGH" },
  { name: "Beezer Clarkson", handle: "Beezer232", firm: "Sapphire Partners", role: "Managing Director (LP-side)", segment: "F", confidence: "HIGH" },
  { name: "Frank Chen", handle: "withfries2", firm: "(ex-a16z, current TBD)", role: "Former Partner", segment: "F", confidence: "LOW" },
];
