/**
 * Platform-specific voice rosters, rebuilt for Marcus (2026-05-31).
 *
 * Source of truth for the X roster: `marketing/dream-100-marcus-x.md` (the
 * Marcus Dream 100, derived from `brand/voice.md` §Avatar +
 * `brunson/08-dream-customer.md`). Marcus is a corp-dev / PE-operating-partner /
 * non-engineer tech-VP (also reads as a solo angel / scout / seed) who does NOT
 * read code and needs the engineering signal translated into business language.
 * So these rosters point at BUSINESS-language surfaces, analysts, SaaS/cloud
 * metrics, PE/M&A operators, deals-media, market-map/category analysts, NOT the
 * OSS-maintainer / dev-Twitter / Show-HN channels of the retired developer-
 * investor avatar.
 *
 * Honest counts, not padded rosters. Marcus's footprint is lopsided: X is his
 * home (100 accounts, sourced + flagged). Reddit is thinner (~30 business/PE/
 * SaaS/finance communities). Hacker News is barely Marcus's surface at all, it
 * stays as a small READ-ONLY awareness map of fundraise / M&A ground-truth
 * threads, never an engagement roster. We don't pad to a round 100 with shaky
 * entries (same discipline the Dream-100 source used).
 *
 * Handle accuracy: several brand/firm handles are best-guesses flagged via the
 * `note` field ("Handle unverified, confirm before outreach"), carried over
 * from the `(confirm)` marks in the source. Verify before loading into
 * `tools/dream100-mention-radar/`.
 *
 * Pages at /voices, /voices/reddit, /voices/hacker-news, /voices/twitter render
 * this data. Every entry is anonymity-rule compliant, public handles, public
 * URLs, no individuals we track inside the paid product.
 *
 * Last refreshed: 2026-05-31.
 */

export type VoiceStatus =
  | "engage"
  | "watch"
  | "hold"
  | "read"
  | "blocked";

export interface PlatformVoice {
  /** Display name (subreddit, handle, thread family, list name). */
  name: string;
  /** One-sentence "why we read it / what it gives us". */
  what: string;
  /** Optional href, public URL, never a personal DM or paywalled link. */
  href?: string;
  /** Engagement status (mirrors /target-list semantics). */
  status: VoiceStatus;
  /** Optional context note, auto-mod rule, anonymity flag, throttling, etc. */
  note?: string;
}

export interface PlatformList {
  /** URL-safe slug, drives /voices/[slug]. */
  slug: string;
  /** Human label rendered in headings ("Reddit", "Hacker News", "X / Twitter"). */
  label: string;
  /** Short tagline shown in cards and OG. */
  tagline: string;
  /** 2-3 sentence intro on the platform page. */
  intro: string;
  /** Cadence rule, when and how the company-page surface engages. */
  cadence: string;
  /** Status code rule overrides specific to the platform. */
  rule: string;
  /** Total entries, sanity-check at runtime. */
  expected: number;
  /** The literal roster, ordered by attention priority. */
  items: PlatformVoice[];
}

export const PLATFORM_STATUS_META: Record<
  VoiceStatus,
  { short: string; long: string; tone: string }
> = {
  engage: {
    short: "Engage",
    long: "Active engagement layer, we reply with a translated data point or pitch a complementary data angle.",
    tone: "emerald",
  },
  watch: {
    short: "Watch",
    long: "Monitoring, we read the signal and reply only when one translated data point genuinely fits.",
    tone: "sky",
  },
  hold: {
    short: "Hold",
    long: "Engagement paused. Listed for transparency.",
    tone: "amber",
  },
  read: {
    short: "Read",
    long: "Read-only consumption. Awareness and ground-truth, no engagement layer.",
    tone: "slate",
  },
  blocked: {
    short: "Blocked",
    long: "Cannot engage, platform constraint, anonymity rule, or policy.",
    tone: "rose",
  },
};

const CONFIRM_NOTE = "Handle unverified, confirm before outreach.";

// ────────────────────────────────────────────────────────────────────────────
// X / TWITTER, 100 accounts that hold Marcus's attention
// Buckets from marketing/dream-100-marcus-x.md: A business-of-tech analysts,
// B SaaS/cloud metrics, D PE/M&A operators, F market-map/data desks (Tier 1);
// C VC "who's hot" commentary, E deals-media (Tier 2). engage = data desks /
// benchmark orgs / deals desks we actively pitch or reply to with translated
// data; watch = T1 analysts/operators we monitor and selectively reply to;
// read = mega-reach, big media orgs, and T2 awareness accounts.
// ────────────────────────────────────────────────────────────────────────────

const TWITTER_VOICES: PlatformVoice[] = [
  // F, Market-map / deal-data / category-analyst desks (Tier 1), most direct path to Marcus
  { name: "@cbinsights", what: "CB Insights, market maps / deal data for corp-dev. Pitch a complementary acceleration chart.", href: "https://x.com/cbinsights", status: "engage", note: CONFIRM_NOTE },
  { name: "@PitchBook", what: "PitchBook, PE/VC deal data, corp-dev-native. Offer an angle they don't cover.", href: "https://x.com/PitchBook", status: "engage", note: CONFIRM_NOTE },
  { name: "@crunchbase", what: "Crunchbase, company/deal data. Complementary pre-announce acceleration signal.", href: "https://x.com/crunchbase", status: "engage", note: CONFIRM_NOTE },
  { name: "@sacra_inc", what: "Sacra, private-company research for buyers. Translated-data partnership.", href: "https://x.com/sacra_inc", status: "engage", note: CONFIRM_NOTE },
  { name: "@public_comps", what: "Public Comps, SaaS comps for PE/corp-dev. Pair acceleration with comps.", href: "https://x.com/public_comps", status: "engage", note: CONFIRM_NOTE },
  { name: "@meritechcapital", what: "Meritech, SaaS comps data, widely used by buyers. Complementary data.", href: "https://x.com/meritechcapital", status: "engage", note: CONFIRM_NOTE },
  { name: "@tracxn", what: "Tracxn, private-market deal data. Complementary signal angle.", href: "https://x.com/tracxn", status: "engage", note: CONFIRM_NOTE },
  { name: "@Dealroomco", what: "Dealroom, market intelligence for buyers. Data-angle pitch.", href: "https://x.com/Dealroomco", status: "engage", note: CONFIRM_NOTE },
  { name: "@ContraryRes", what: "Contrary Research, private-company memos. Translated signal source.", href: "https://x.com/ContraryRes", status: "engage", note: CONFIRM_NOTE },
  { name: "@Gartner_inc", what: "Gartner, category analysts; the 'worth a meeting' lens. Category-momentum view.", href: "https://x.com/Gartner_inc", status: "watch", note: CONFIRM_NOTE },
  { name: "@forrester", what: "Forrester, enterprise category analysis. Data-contribution angle.", href: "https://x.com/forrester", status: "watch", note: CONFIRM_NOTE },
  { name: "@bessemervp", what: "Bessemer, State of the Cloud benchmarks. Cite their index with our data.", href: "https://x.com/bessemervp", status: "watch", note: CONFIRM_NOTE },
  { name: "@battery_ventures", what: "Battery, OpenCloud enterprise benchmark reports. Complementary benchmark.", href: "https://x.com/battery_ventures", status: "watch", note: CONFIRM_NOTE },
  { name: "@scalevp", what: "Scale Venture Partners, SaaS metrics benchmarks. Benchmark angle.", href: "https://x.com/scalevp", status: "watch", note: CONFIRM_NOTE },
  { name: "@iconiqcapital", what: "ICONIQ Growth, GTM/SaaS benchmarks for PE/corp-dev. Translated contribution.", href: "https://x.com/iconiqcapital", status: "watch", note: CONFIRM_NOTE },
  { name: "@SapphireVC", what: "Sapphire Ventures, enterprise benchmark reports. Benchmark partnership.", href: "https://x.com/SapphireVC", status: "watch", note: CONFIRM_NOTE },

  // E, Tech-dealmaking journalists & media (Tier 2), data-exclusive pitch targets
  { name: "@danprimack", what: "Dan Primack, Axios Pro Rata. The M&A/deals newsletter; offer an exclusive translated data point.", href: "https://x.com/danprimack", status: "engage" },
  { name: "@EricNewcomer", what: "Eric Newcomer, Newcomer. VC/deals insider; be a source on pre-announce traction.", href: "https://x.com/EricNewcomer", status: "engage" },
  { name: "@TheInformation", what: "The Information, premium deal/tech reporting. Data-exclusive pitch.", href: "https://x.com/TheInformation", status: "engage", note: CONFIRM_NOTE },
  { name: "@StrictlyVC", what: "StrictlyVC, daily VC/deals audience. Guest data piece.", href: "https://x.com/StrictlyVC", status: "engage", note: CONFIRM_NOTE },
  { name: "@AxiosProRata", what: "Axios Pro Rata (newsletter), the deals desk. Recurring data sidebar pitch.", href: "https://x.com/AxiosProRata", status: "engage", note: CONFIRM_NOTE },
  { name: "@FortuneMagazine", what: "Fortune, Term Sheet M&A/deals newsletter. Data point for a mention.", href: "https://x.com/FortuneMagazine", status: "engage", note: CONFIRM_NOTE },
  { name: "@kateclarktweets", what: "Kate Clark, deals reporter. Translated-signal source.", href: "https://x.com/kateclarktweets", status: "watch", note: CONFIRM_NOTE },
  { name: "@teddyschleifer", what: "Teddy Schleifer, Puck. Money/deals reporting; source on a deal trend.", href: "https://x.com/teddyschleifer", status: "watch", note: CONFIRM_NOTE },
  { name: "@bizcarson", what: "Biz Carson, startup/deals reporter. Translated-data source.", href: "https://x.com/bizcarson", status: "watch", note: CONFIRM_NOTE },
  { name: "@Lessin", what: "Jessica Lessin, The Information. Deal-media leadership; data exclusive.", href: "https://x.com/Lessin", status: "watch", note: CONFIRM_NOTE },
  { name: "@PuckNews", what: "Puck, business/money insider audience. Source on a deal trend.", href: "https://x.com/PuckNews", status: "watch", note: CONFIRM_NOTE },
  { name: "@business", what: "Bloomberg, M&A/markets reach. Data-story pitch (high bar).", href: "https://x.com/business", status: "read", note: CONFIRM_NOTE },
  { name: "@WSJ", what: "WSJ (Pro / Deals), corp-dev/PE readership. Exclusive data only.", href: "https://x.com/WSJ", status: "read", note: CONFIRM_NOTE },
  { name: "@axios", what: "Axios, business/tech deal coverage. Pro Rata data angle.", href: "https://x.com/axios", status: "read", note: CONFIRM_NOTE },
  { name: "@TechCrunch", what: "TechCrunch, funding/deal coverage. Trend-data source.", href: "https://x.com/TechCrunch", status: "read", note: CONFIRM_NOTE },
  { name: "@CNBC", what: "CNBC, markets/deals, exec audience. Translated trend data.", href: "https://x.com/CNBC", status: "read", note: CONFIRM_NOTE },

  // B, SaaS / cloud metrics & GTM benchmark voices (Tier 1)
  { name: "@jaminball", what: "Jamin Ball, Clouded Judgement. Public-SaaS metrics; corp-dev/PE bible. Pair our signal with his comps.", href: "https://x.com/jaminball", status: "engage" },
  { name: "@kyle_poyar", what: "Kyle Poyar, Growth Unhinged. GTM/PLG benchmarks for operators. Translated benchmark cut.", href: "https://x.com/kyle_poyar", status: "engage" },
  { name: "@SaaStr", what: "SaaStr (org), the SaaS-exec watering hole. Data contribution to a SaaStr piece.", href: "https://x.com/SaaStr", status: "engage", note: CONFIRM_NOTE },
  { name: "@peterwalker99", what: "Peter Walker, Carta. Startup/market data, business-framed. Complementary acceleration data.", href: "https://x.com/peterwalker99", status: "engage" },
  { name: "@jasonlk", what: "Jason Lemkin, SaaStr. SaaS business to a massive exec audience. 'Worth a meeting' framing.", href: "https://x.com/jasonlk", status: "watch" },
  { name: "@hnshah", what: "Hiten Shah, SaaS metrics/products. Business-framed signal.", href: "https://x.com/hnshah", status: "watch" },
  { name: "@patticus", what: "Patrick Campbell, ex-ProfitWell. Pricing/retention metrics. Translated traction angle.", href: "https://x.com/patticus", status: "watch" },
  { name: "@lennysan", what: "Lenny Rachitsky, product/business to the operators who buy. Shortlist-style insight.", href: "https://x.com/lennysan", status: "watch" },
  { name: "@gokulr", what: "Gokul Rajaram, board/operator, corp-dev adjacent. High-bar translated data.", href: "https://x.com/gokulr", status: "watch" },
  { name: "@davegerhardt", what: "Dave Gerhardt, Exit Five. B2B exec/marketing audience. Business-language signal.", href: "https://x.com/davegerhardt", status: "watch" },
  { name: "@bbalfour", what: "Brian Balfour, Reforge. Growth strategy for operators. Benchmark angle.", href: "https://x.com/bbalfour", status: "watch" },
  { name: "@aprildunford", what: "April Dunford, positioning/category for buyers. 'Which category is heating up' framing.", href: "https://x.com/aprildunford", status: "watch", note: CONFIRM_NOTE },
  { name: "@TheSaaSCFO", what: "Ben Murray, The SaaS CFO. SaaS metrics for finance/corp-dev. Translated metric angle.", href: "https://x.com/TheSaaSCFO", status: "watch", note: CONFIRM_NOTE },
  { name: "@David_Cancel", what: "David Cancel, Drift. B2B exec operator. Translated trend data.", href: "https://x.com/David_Cancel", status: "read", note: CONFIRM_NOTE },
  { name: "@andrewchen", what: "Andrew Chen, a16z. Growth business essays. Translated-data engagement.", href: "https://x.com/andrewchen", status: "read" },
  { name: "@tomloverro", what: "Tom Loverro, IVP. Macro/SaaS market commentary. Deal-relevant data point.", href: "https://x.com/tomloverro", status: "read", note: CONFIRM_NOTE },

  // A, Business-of-tech analysts & strategists (Tier 1), Marcus's reading diet
  { name: "@ttunguz", what: "Tomasz Tunguz, Theory Ventures. Data-driven SaaS/cloud posts. Provide a benchmark cut he'd reshare.", href: "https://x.com/ttunguz", status: "engage" },
  { name: "@auren", what: "Auren Hoffman, World of DaaS. Data-as-a-business; corp-dev/PE audience. Translated dataset angle.", href: "https://x.com/auren", status: "engage" },
  { name: "@mattturck", what: "Matt Turck, FirstMark (MAD landscape). Market-map thinking for buyers. Category-momentum view.", href: "https://x.com/mattturck", status: "engage", note: CONFIRM_NOTE },
  { name: "@benthompson", what: "Ben Thompson, Stratechery. The canonical tech→business translator; corp-dev/PE read him daily.", href: "https://x.com/benthompson", status: "watch" },
  { name: "@packyM", what: "Packy McCormick, Not Boring. Strategy narratives for investor/operator readers.", href: "https://x.com/packyM", status: "watch" },
  { name: "@mariodgabriele", what: "Mario Gabriele, The Generalist. Long-form company/strategy analysis.", href: "https://x.com/mariodgabriele", status: "watch", note: CONFIRM_NOTE },
  { name: "@benedictevans", what: "Benedict Evans, macro tech analysis for execs/boards.", href: "https://x.com/benedictevans", status: "watch" },
  { name: "@asymco", what: "Horace Dediu, disruption/business analysis.", href: "https://x.com/asymco", status: "watch" },
  { name: "@ByrneHobart", what: "Byrne Hobart, The Diff. Finance × tech for sophisticated allocators. Deal-relevant data point.", href: "https://x.com/ByrneHobart", status: "watch" },
  { name: "@eladgil", what: "Elad Gil, High Growth Handbook. Operator/board business framing.", href: "https://x.com/eladgil", status: "watch" },
  { name: "@danshipper", what: "Dan Shipper, Every. AI-for-operators, business lens.", href: "https://x.com/danshipper", status: "watch", note: CONFIRM_NOTE },
  { name: "@sarahtavel", what: "Sarah Tavel, Benchmark. Marketplace/business essays.", href: "https://x.com/sarahtavel", status: "watch" },
  { name: "@hunterwalk", what: "Hunter Walk, Homebrew. Business-of-startups commentary. Shortlist-style reply.", href: "https://x.com/hunterwalk", status: "watch" },
  { name: "@ericstromberg", what: "Eric Stromberg, Bedrock. Business memos for allocators.", href: "https://x.com/ericstromberg", status: "watch", note: CONFIRM_NOTE },
  { name: "@nbashaw", what: "Nathan Baschez, Every/Lex. Business-of-software writing.", href: "https://x.com/nbashaw", status: "watch", note: CONFIRM_NOTE },
  { name: "@profgalloway", what: "Scott Galloway, business-of-tech to a huge exec audience. Read; mega-reach.", href: "https://x.com/profgalloway", status: "read" },
  { name: "@om", what: "Om Malik, veteran tech-business analyst. Read.", href: "https://x.com/om", status: "read" },
  { name: "@cdixon", what: "Chris Dixon, a16z. Big-audience business essays. Read.", href: "https://x.com/cdixon", status: "read" },

  // D, PE / M&A / acquisitions / holdco & public-markets operators (Tier 1), Marcus's professional neighborhood
  { name: "@patrick_oshag", what: "Patrick O'Shaughnessy, Colossus. Sophisticated investor/PE audience. Offer a translated dataset angle.", href: "https://x.com/patrick_oshag", status: "engage" },
  { name: "@QuartrApp", what: "Quartr, IR/earnings business intel. Translated data partnership angle.", href: "https://x.com/QuartrApp", status: "engage", note: CONFIRM_NOTE },
  { name: "@TheTranscript_", what: "The Transcript, earnings-call business signal. Complementary private-co signal.", href: "https://x.com/TheTranscript_", status: "engage", note: CONFIRM_NOTE },
  { name: "@awilkinson", what: "Andrew Wilkinson, Tiny. Acquisitions/holdco; corp-dev mindset. 'Who's worth acquiring' framing.", href: "https://x.com/awilkinson", status: "watch" },
  { name: "@sweatystartup", what: "Nick Huber, acquisitions/operating audience. Translated traction signal.", href: "https://x.com/sweatystartup", status: "watch" },
  { name: "@bgurley", what: "Bill Gurley, Benchmark. Deal/market commentary, exec-trusted. High-bar translated data.", href: "https://x.com/bgurley", status: "watch" },
  { name: "@brad_gerstner", what: "Brad Gerstner, Altimeter. Growth/public-markets; corp-dev relevant. Deal-relevant data.", href: "https://x.com/brad_gerstner", status: "watch" },
  { name: "@jefflonsdale", what: "Joe Lonsdale, 8VC. Enterprise/PE-adjacent. Business-language data.", href: "https://x.com/jefflonsdale", status: "watch", note: CONFIRM_NOTE },
  { name: "@mjmauboussin", what: "Michael Mauboussin, valuation/strategy; PE/corp-dev gold. Data on durable advantage.", href: "https://x.com/mjmauboussin", status: "watch", note: CONFIRM_NOTE },
  { name: "@10kdiver", what: "10-K Diver, financial analysis for operators. Plain-English signal explainer.", href: "https://x.com/10kdiver", status: "watch" },
  { name: "@morganhousel", what: "Morgan Housel, Collab Fund. Finance/business, broad trust. Business-framed insight.", href: "https://x.com/morganhousel", status: "watch" },
  { name: "@modestproposal1", what: "Modest Proposal, public-markets/business analysis. Deal-relevant data.", href: "https://x.com/modestproposal1", status: "watch" },
  { name: "@TSOH_Investing", what: "Alex Morris, company business analysis. Translated traction angle.", href: "https://x.com/TSOH_Investing", status: "watch", note: CONFIRM_NOTE },
  { name: "@jposhaughnessy", what: "Jim O'Shaughnessy, Infinite Loops. Markets/business; operator audience.", href: "https://x.com/jposhaughnessy", status: "watch", note: CONFIRM_NOTE },
  { name: "@fabricegrinda", what: "Fabrice Grinda, FJ Labs. M&A/marketplace dealmaking. 'Worth a look' data.", href: "https://x.com/fabricegrinda", status: "watch" },
  { name: "@rohitkrishnan", what: "Rohit Krishnan, Strange Loop Canon. Business strategy essays. Translated trend data.", href: "https://x.com/rohitkrishnan", status: "watch", note: CONFIRM_NOTE },
  { name: "@APompliano", what: "Anthony Pompliano, markets/deals; broad reach. Business-framed signal.", href: "https://x.com/APompliano", status: "read" },
  { name: "@chamath", what: "Chamath Palihapitiya, deals/PE-ish business takes. Read; mega-reach.", href: "https://x.com/chamath", status: "read" },

  // C, VC / growth investors posting "who's hot" commentary (Tier 2), awareness, looser fit
  { name: "@msuster", what: "Mark Suster, Upfront. VC business essays. Translated-data engagement.", href: "https://x.com/msuster", status: "watch" },
  { name: "@semil", what: "Semil Shah, Haystack. Early-stage business commentary. Translated signal.", href: "https://x.com/semil", status: "watch" },
  { name: "@loganbartlett", what: "Logan Bartlett, Redpoint. Market/deal commentary + pod. Deal-relevant data.", href: "https://x.com/loganbartlett", status: "watch", note: CONFIRM_NOTE },
  { name: "@eriktorenberg", what: "Erik Torenberg, Turpentine. Business-pod network. Feed a translated data segment.", href: "https://x.com/eriktorenberg", status: "watch" },
  { name: "@jason", what: "Jason Calacanis, deals/startup business, huge reach. Business-framed signal.", href: "https://x.com/jason", status: "read" },
  { name: "@rabois", what: "Keith Rabois, operator/deal takes. High-bar data only.", href: "https://x.com/rabois", status: "read" },
  { name: "@bhorowitz", what: "Ben Horowitz, a16z. Business-of-building audience. Translated angle.", href: "https://x.com/bhorowitz", status: "read" },
  { name: "@pmarca", what: "Marc Andreessen, mega-reach business/tech takes. High-bar only.", href: "https://x.com/pmarca", status: "read" },
  { name: "@fdestin", what: "Fred Destin, Stride. VC business commentary (EU). Business-framed data.", href: "https://x.com/fdestin", status: "read", note: CONFIRM_NOTE },
  { name: "@bryce", what: "Bryce Roberts, business-of-funding takes. Shortlist framing.", href: "https://x.com/bryce", status: "read", note: CONFIRM_NOTE },
  { name: "@a16z", what: "a16z (firm), enterprise/business research reach. Cite their thesis with our data.", href: "https://x.com/a16z", status: "read", note: CONFIRM_NOTE },
  { name: "@sequoia", what: "Sequoia (firm), market-defining business content. Complementary data.", href: "https://x.com/sequoia", status: "read", note: CONFIRM_NOTE },
  { name: "@GoogleVentures", what: "GV (firm), enterprise deal audience. Translated angle.", href: "https://x.com/GoogleVentures", status: "read", note: CONFIRM_NOTE },
  { name: "@Greylock", what: "Greylock (firm), enterprise/business reach. Data contribution.", href: "https://x.com/Greylock", status: "read", note: CONFIRM_NOTE },
  { name: "@IVP", what: "IVP (firm), growth-stage deal audience. Benchmark angle.", href: "https://x.com/IVP", status: "read", note: CONFIRM_NOTE },
  { name: "@generalcatalyst", what: "General Catalyst (firm), enterprise/health/deal reach. Translated data.", href: "https://x.com/generalcatalyst", status: "read", note: CONFIRM_NOTE },
];

// ────────────────────────────────────────────────────────────────────────────
// REDDIT, ~30 business / PE / SaaS / finance communities where Marcus reads
// Marcus is thinner on Reddit than on X, and he is NOT in the dev subs the
// retired avatar lived in. These are the buy-side / corp-dev / operator /
// SaaS-business communities. Engagement is comment-only and rare, Reddit
// auto-mods anything that smells like a product pitch on the finance/VC subs.
// ────────────────────────────────────────────────────────────────────────────

const REDDIT_VOICES: PlatformVoice[] = [
  { name: "r/PrivateEquity", what: "Marcus's literal professional neighborhood, PE/operating-partner buyers. Comment-only.", href: "https://reddit.com/r/PrivateEquity", status: "engage", note: "Comment-only. Product names auto-removed." },
  { name: "r/venturecapital", what: "What's getting funded and valued. Comment-only on data-question threads.", href: "https://reddit.com/r/venturecapital", status: "engage", note: "Comment-only. Hero posts auto-removed." },
  { name: "r/SaaS", what: "SaaS-business reality, traction-vs-hype, ARR, churn threads. Comment-only.", href: "https://reddit.com/r/SaaS", status: "engage" },
  { name: "r/investmentbanking", what: "M&A / deal-side diligence crowd. Adjacent to corp-dev buyers.", href: "https://reddit.com/r/investmentbanking", status: "watch" },
  { name: "r/CorporateFinance", what: "Corp-dev / FP&A / finance professionals, Marcus's coworkers.", href: "https://reddit.com/r/CorporateFinance", status: "watch", note: CONFIRM_NOTE },
  { name: "r/SecurityAnalysis", what: "Buy-side diligence discipline. Pattern memory for 'is this real traction.'", href: "https://reddit.com/r/SecurityAnalysis", status: "watch" },
  { name: "r/startups", what: "The companies Marcus evaluates, in their own words.", href: "https://reddit.com/r/startups", status: "watch" },
  { name: "r/ycombinator", what: "Cohort + 'who's hot' signal. Adjacent to our pattern memory.", href: "https://reddit.com/r/ycombinator", status: "watch" },
  { name: "r/fintech", what: "A sector Marcus actively evaluates. News + traction threads.", href: "https://reddit.com/r/fintech", status: "watch" },
  { name: "r/AngelInvesting", what: "Solo-angel buyers (the small-cheque end of the avatar).", href: "https://reddit.com/r/AngelInvesting", status: "watch" },
  { name: "r/investing", what: "Broad markets. Awareness + tone calibration.", href: "https://reddit.com/r/investing", status: "read" },
  { name: "r/ValueInvesting", what: "Valuation discipline. Buy-side pattern memory.", href: "https://reddit.com/r/ValueInvesting", status: "read" },
  { name: "r/stocks", what: "Public-markets awareness. What names are in the conversation.", href: "https://reddit.com/r/stocks", status: "read" },
  { name: "r/FinancialCareers", what: "Finance/IB/PE professional audience. Avatar concentration.", href: "https://reddit.com/r/FinancialCareers", status: "read" },
  { name: "r/Entrepreneur", what: "Generalist founder/operator community. Awareness only.", href: "https://reddit.com/r/Entrepreneur", status: "read" },
  { name: "r/business", what: "Broad business audience. Awareness.", href: "https://reddit.com/r/business", status: "read" },
  { name: "r/Economics", what: "Macro context for the deal environment.", href: "https://reddit.com/r/Economics", status: "read" },
  { name: "r/MBA", what: "Business-decision-maker audience. Corp-dev / consulting adjacency.", href: "https://reddit.com/r/MBA", status: "read" },
  { name: "r/consulting", what: "Strategy / corp-dev adjacency. Buyer-archetype reads.", href: "https://reddit.com/r/consulting", status: "read" },
  { name: "r/technology", what: "Mass-tech sector awareness, what's breaking into the mainstream.", href: "https://reddit.com/r/technology", status: "read" },
  { name: "r/artificial", what: "AI-sector heat. Which names are 'worth a meeting' this quarter.", href: "https://reddit.com/r/artificial", status: "read" },
  { name: "r/MachineLearning", what: "AI/ML sector awareness (read-only, not an engagement sub for Marcus).", href: "https://reddit.com/r/MachineLearning", status: "read" },
  { name: "r/cybersecurity", what: "A sector Marcus evaluates. SecOps-company awareness.", href: "https://reddit.com/r/cybersecurity", status: "read" },
  { name: "r/ITManagers", what: "Enterprise-buyer adjacency. What budget-holders actually adopt.", href: "https://reddit.com/r/ITManagers", status: "read" },
  { name: "r/projectmanagement", what: "Operator adjacency. Tool-adoption signal.", href: "https://reddit.com/r/projectmanagement", status: "read" },
  { name: "r/smallbusiness", what: "Bootstrap / outside-VC counterweight. Awareness.", href: "https://reddit.com/r/smallbusiness", status: "read" },
  { name: "r/EntrepreneurRideAlong", what: "Build-in-public threads. Useful traction-vs-hype reads.", href: "https://reddit.com/r/EntrepreneurRideAlong", status: "read" },
  { name: "r/financialindependence", what: "Personal-finance / angel-investor crossover.", href: "https://reddit.com/r/financialindependence", status: "read" },
  { name: "r/SaaSMarketing", what: "GTM/SaaS-business audience. Awareness of go-to-market signal.", href: "https://reddit.com/r/SaaSMarketing", status: "read", note: CONFIRM_NOTE },
  { name: "r/Entrepreneurship", what: "Founder/operator audience. Awareness, low engagement.", href: "https://reddit.com/r/Entrepreneurship", status: "read", note: CONFIRM_NOTE },
];

// ────────────────────────────────────────────────────────────────────────────
// HACKER NEWS, a thin READ-ONLY awareness map (NOT a Marcus engagement roster)
// Honest framing: HN is a builder/founder surface. Marcus (corp-dev / PE /
// non-eng-VP) barely lives here. We read it for fundraise / M&A / traction
// ground-truth, never to engage. No padding to 100, that would be fiction.
// ────────────────────────────────────────────────────────────────────────────

const HACKER_NEWS_VOICES: PlatformVoice[] = [
  { name: "Topic: Series A / fundraise news", what: "Fundraise announcements, ground truth for 'did the signal precede the round.'", href: "https://hn.algolia.com/?q=Series+A", status: "read" },
  { name: "Topic: Series B / late-stage", what: "Later-stage rounds. Pattern memory.", href: "https://hn.algolia.com/?q=Series+B", status: "read" },
  { name: "Algolia: 'acquired by'", what: "Acquisition announcements, Marcus's outcome of record.", href: "https://hn.algolia.com/?q=acquired+by", status: "read" },
  { name: "Algolia: 'raised $'", what: "Funding-event firehose. Cross-confirms our predictions.", href: "https://hn.algolia.com/?q=raised", status: "read" },
  { name: "Launch HN: YC-cohort launches", what: "Where YC companies introduce themselves, early 'worth a meeting' reads.", href: "https://hn.algolia.com/?q=Launch+HN", status: "read" },
  { name: "Topic: Y Combinator / Demo Day", what: "Cohort validation signal. Who's getting attention this batch.", href: "https://hn.algolia.com/?q=Demo+Day", status: "read" },
  { name: "Ask HN: who is hiring (monthly)", what: "Hiring waves, a traction proxy Marcus cares about (team doubling).", href: "https://hn.algolia.com/?q=Ask+HN+who+is+hiring", status: "read" },
  { name: "Topic: enterprise software", what: "Enterprise-SaaS conversation. Sector awareness for buyers.", href: "https://hn.algolia.com/?q=enterprise+software", status: "read" },
  { name: "Topic: AI infrastructure", what: "AI-infra sector heat, which categories are accelerating.", href: "https://hn.algolia.com/?q=AI+infrastructure", status: "watch" },
  { name: "Topic: valuation / multiples", what: "Valuation debate threads. Buy-side pattern memory.", href: "https://hn.algolia.com/?q=valuation+multiple", status: "read" },
  { name: "Algolia: 'product-market fit'", what: "PMF discussion, how operators judge real traction.", href: "https://hn.algolia.com/?q=product+market+fit", status: "read" },
  { name: "Algolia: 'go to market'", what: "GTM threads. Translates to 'is this scaling' for a buyer.", href: "https://hn.algolia.com/?q=go+to+market", status: "read" },
  { name: "Topic: IPO / public markets", what: "Exit-environment context for corp-dev/PE.", href: "https://hn.algolia.com/?q=IPO", status: "read" },
  { name: "HN front-page (rolling 30d)", what: "What's breaking out into broad attention this month.", href: "https://news.ycombinator.com/news", status: "read" },
  { name: "HN newest (firehose)", what: "Pre-front-page submissions, earliest awareness layer.", href: "https://news.ycombinator.com/newest", status: "read" },
  { name: "Topic: SaaS metrics / ARR", what: "Public ARR/retention discussion. Traction-vs-hype reads.", href: "https://hn.algolia.com/?q=ARR", status: "read" },
  { name: "Algolia: 'revenue multiple'", what: "Comp/valuation threads. Corp-dev/PE pattern memory.", href: "https://hn.algolia.com/?q=revenue+multiple", status: "read" },
  { name: "Topic: vector databases / agents (sector)", what: "AI-sector subcategory heat. Awareness of breakout categories.", href: "https://hn.algolia.com/?q=vector+database", status: "read" },
  { name: "YC: company list on HN", what: "Live YC alumni list, back-checks our predictions.", href: "https://news.ycombinator.com/yc.html", status: "read" },
  { name: "HN 'state of' annual reports", what: "Annual sector retrospectives. Decade-pattern context.", href: "https://hn.algolia.com/?q=state+of", status: "read" },
];

// ────────────────────────────────────────────────────────────────────────────
// LIST OF LISTS
// ────────────────────────────────────────────────────────────────────────────

export const PLATFORM_LISTS: PlatformList[] = [
  {
    slug: "twitter",
    label: "X / Twitter",
    tagline:
      "100 X accounts that hold Marcus's attention, analysts, SaaS-metrics, PE/M&A, deals-media, market-map.",
    intro:
      "X is where Marcus reads. Not dev Twitter, the business-of-tech analysts, SaaS/cloud-metrics voices, PE/M&A operators, deals journalists, and market-map analysts he uses to decide who's worth a meeting. We engage the data desks and benchmark voices with a complementary, translated data point; we monitor the analysts and reply only when one plain-English signal genuinely fits. Never raw commits, never quant jargon.",
    cadence:
      "Read daily. 3-5 replies a day on the engage/watch accounts, each carrying ONE translated data point ('Company X's engineering activity is accelerating faster than its category, worth a look,' + link). Pitch the market-map / data desks (Bucket F) and deals newsletters (Bucket E) a complementary, translated data angle. The company account is the only voice, no founder face, name, or DMs.",
    rule:
      "Anonymity rule: no founder face / voice / name. Lead with the job, a credible, plain-English shortlist, never with code or quant framing. Several handles are flagged unverified; confirm before any outreach.",
    expected: 100,
    items: TWITTER_VOICES,
  },
  {
    slug: "reddit",
    label: "Reddit",
    tagline:
      "~30 business, PE, SaaS, and finance communities where corp-dev and operator buyers actually read.",
    intro:
      "Marcus is thinner on Reddit than on X, and he is NOT in the dev subs the old avatar lived in. This is the buy-side neighborhood, PE, venture, corp-dev/finance, SaaS-business, and the sectors he evaluates. Engagement is comment-only and rare: the finance and VC subs auto-remove anything that names a product, so we comment with a translated data point on a real question or we just read.",
    cadence:
      "Comment-only on the engage subs (r/PrivateEquity, r/venturecapital, r/SaaS), and only when a translated data point answers a real question. 40-55 words, no URL in the first comment, ceiling of two comments a week. Everything else is read/watch.",
    rule:
      "Never main-post on the finance/VC subs, auto-mod removes it and shadowbans the account. No raw commits or quant jargon anywhere. Honest scope: this roster is intentionally short, Marcus's real Reddit footprint is small.",
    expected: 30,
    items: REDDIT_VOICES,
  },
  {
    slug: "hacker-news",
    label: "Hacker News",
    tagline:
      "A thin, read-only awareness map, HN is a builder surface, not Marcus's home.",
    intro:
      "Honest framing: Hacker News is a builder/founder crowd, not where corp-dev / PE / non-engineer-VP buyers live. We don't pretend Marcus is here. This short roster is read-only ground truth, fundraise, M&A, hiring-wave, and sector-heat threads that confirm whether the engineering signal preceded the round. No engagement layer, no padding to 100.",
    cadence:
      "Read-only. Daily search-lane monitoring on the fundraise / M&A / hiring lanes; weekly skim of the front-page archive for sector heat. We do not post or comment as the brand on HN, it isn't Marcus's surface.",
    rule:
      "No engagement. HN stays a ground-truth and awareness map only. If a Marcus-relevant business thread ever warrants a translated data point, it goes out as a one-off, never as a campaign.",
    expected: 20,
    items: HACKER_NEWS_VOICES,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

export function getPlatformList(slug: string): PlatformList | undefined {
  return PLATFORM_LISTS.find((p) => p.slug === slug);
}

export function getAllPlatformSlugs(): string[] {
  return PLATFORM_LISTS.map((p) => p.slug);
}

export function platformVoiceCount(): number {
  return PLATFORM_LISTS.reduce((n, p) => n + p.items.length, 0);
}

/**
 * Build-time sanity check, every platform must have exactly its declared
 * `expected` count. Throws on drift so the build catches the regression.
 */
export function assertPlatformCounts(): void {
  for (const p of PLATFORM_LISTS) {
    if (p.items.length !== p.expected) {
      throw new Error(
        `Platform ${p.slug} expected ${p.expected} entries, got ${p.items.length}`,
      );
    }
  }
}

export function platformStatusCounts(slug: string): Record<VoiceStatus, number> {
  const list = getPlatformList(slug);
  const counts: Record<VoiceStatus, number> = {
    engage: 0,
    watch: 0,
    hold: 0,
    read: 0,
    blocked: 0,
  };
  if (!list) return counts;
  for (const v of list.items) counts[v.status]++;
  return counts;
}
