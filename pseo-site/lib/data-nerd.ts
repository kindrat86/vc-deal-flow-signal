/**
 * The Data Nerd, Attractive Character canon (Russell Brunson DCS Ch 7 + ES Ch 2).
 *
 * Single source of truth for the synthetic narrator persona used across the site,
 * email drips, YouTube voice-over, and structured-data Person schema.
 *
 * The Data Nerd is a *pseudonymous handle*, not a fictional human. Behind it is
 * a real engineer-investor who refuses to attach their face/name/voice to the
 * brand (manifesto pillar #4). The handle is what readers see; the methodology
 * is what they buy.
 *
 * Anonymity rule: synthetic TTS, abstract avatars, and the handle are allowed.
 * Real face/voice/name never appears.
 */

export const DATA_NERD_NAME = "The Data Nerd";
export const DATA_NERD_HANDLE = "@thedatanerd";
export const DATA_NERD_TAGLINE =
  "Anonymous engineer-investor. Wrote the SSRN methodology paper. Refuses to do podcasts.";

/**
 * Short bio, used in email signoff chip and small character cards.
 */
export const DATA_NERD_BIO_SHORT =
  "Engineer-investor. Wrote the SSRN paper (n=219). Replies in batches. Won't do podcasts. Lives behind a regression.";

/**
 * Medium bio, used on /walkthrough close, /manifesto signoff, /story footer.
 */
export const DATA_NERD_BIO_MEDIUM =
  "I'm The Data Nerd. I won't tell you my real name and that's on purpose, the methodology is the protagonist, I'm just the storyteller. Engineer for fifteen years, angel-checker since deal #5. The whole product rests on whether the signal is real, not on whether you find me charismatic.";

/**
 * Audio disclosure, required wherever the synthetic voice plays.
 */
export const DATA_NERD_AUDIO_DISCLOSURE =
  "Synthetic voice (Cartesia). Same voice across YouTube, email-audio, and every page narration. There is no founder voice. The methodology is real. The voice is a writing convention.";

/**
 * Identity archetype, Brunson Expert Secrets Ch 2 (Charismatic Leader 2.0).
 *
 * The character must explicitly belong to one of four canonical archetypes
 * so the reader can place the voice on a recognisable map. Picking and
 * declaring the archetype is itself a credibility move, it tells the
 * reader what they should expect from the next hundred emails before they
 * commit to opening one.
 *
 * The Data Nerd is a Reluctant Reporter: the discovery (GitHub commit
 * acceleration as a leading deal-flow signal) preceded the obligation to
 * publish. The character did not set out to lead a movement, the data
 * forced the position.
 */
export const DATA_NERD_ARCHETYPE = {
  label: "Reluctant Reporter",
  oneLine:
    "I didn't set out to lead a movement. I noticed something true and felt obligated to publish it.",
  body:
    "The four archetypes a founder character can occupy are Leader, Adventurer, Reluctant Hero, and Reporter. Leaders front-load conviction; Adventurers front-load risk; Reluctant Heroes front-load reluctance; Reporters front-load curiosity. I'm the fourth one with a touch of the third, a Reluctant Reporter. The first time I noticed the seabird flock I thought I was seeing a coincidence. The fifth time I checked I knew I owed the fishermen the warning. The product on this site is the warning, formalised.",
  contrast:
    "Not a Leader (I won't take stage), not an Adventurer (I won't sell risk as romance), not a pure Reluctant Hero (I'm not waiting to be drafted), a Reporter who can't unsee the pattern and a Reluctant Hero about whether the discovery is mine to publish.",
  proof: [
    "Refused 14 podcast invitations in the last six months, every reply is a stock paragraph at /press/anonymity-policy.",
    "Methodology paper went on SSRN before any sales page existed. The order was: discovery → publication → product, not product → publication → discovery.",
    "First six months of email drips were unsigned. The handle 'The Data Nerd' was added only when readers asked who was writing them.",
  ],
} as const;

/**
 * Tribe, what the character calls the readers who self-identify as members
 * of the movement. Brunson Expert Secrets Ch 3: the tribe needs a name the
 * member can wear.
 *
 * Avatar pivot (2026-05-30, canonical `brand/voice.md` §Avatar +
 * `brunson/08-dream-customer.md`): the buyer is **Marcus**, a solo angel,
 * scout, seed fund, corp-dev, or PE-operating-partner / non-engineer tech-VP
 * who evaluates companies for a living but **does NOT read code**, whose core
 * fear is "looking non-technical in a technical room," and who needs the
 * engineering signal **translated into business language**. We retired the
 * "developer-investor / code-reading partner" label (deprecated 2026-05-12):
 * handing a non-coder a code-reader identity pokes his deepest fear instead of
 * relieving it. The wearable label now names the *timing edge*, not a coding
 * skill, "First Mover" (the one who reaches the founder before the round, on
 * a signal someone else read for them). Per `marketing/messaging-guide.md`:
 * "we surface the signal, you make the calls / you don't read code."
 */
export const DATA_NERD_TRIBE = {
  name: "First Movers",
  oneLine:
    "We move on the engineering signal before the round, without reading a line of code.",
  badge: "first mover · early on signal, not on luck",
  body:
    "The reader who nods through the polarity is a First Mover, a solo angel, scout, seed fund, corp-dev or PE operator who evaluates companies for a living but doesn't read code and doesn't want to. The handle the reader earns is 'first mover': the investor who reaches the founder before the round, on a signal someone else translated into plain English. The product is built around that identity. The pricing is built around that identity. Every page on this site is built around that identity. If the label feels off, if you'd rather pull up the merge graph and run the regression yourself, that's diagnostic, and the product is probably wrong for you.",
} as const;

/**
 * Polarity, what The Data Nerd stands for, what they stand against.
 * Brunson DCS Ch 7: Attractive Character must take a side. Eight polarities
 * is the canon-spec spread (four is a teaser; eight is the audit-grade set).
 *
 * The 4 → 8 expansion was added 2026-05-09 to push the character page out
 * of the 'four-pillar teaser' shape and into a full belief manifest.
 */
export const DATA_NERD_POLARITY = [
  {
    n: 1,
    for: "Public data is more valuable than private data.",
    against: "Edge from access.",
    body:
      "Renaissance Technologies started in 1988 on data anyone could buy, Reuters quotes, SEC filings, OPRA ticks. Medallion compounded ~39% net for thirty years. The data wasn't edge. The lens was. Same logic on GitHub.",
  },
  {
    n: 2,
    for: "Code is more honest than copy.",
    against: "The deck is the company.",
    body:
      "A pitch deck is a marketing artifact written for the next round. A merge graph is the company's actual behaviour, updated daily.",
  },
  {
    n: 3,
    for: "Anonymity is a credibility signal.",
    against: "Cult of personality.",
    body:
      "If the signal needs a charismatic founder to land, the signal isn't strong enough. If we're right, the data carries the argument.",
  },
  {
    n: 4,
    for: "€49/mo is a feature, not a price ceiling.",
    against: "Six-figure data subscriptions for six-person funds.",
    body:
      "We'd rather have a thousand readers who tell five friends than a hundred enterprise contracts. Founding members who joined before 2026-06-30 keep their price locked forever.",
  },
  {
    n: 5,
    for: "Methodology before metrics.",
    against: "Black-box scores.",
    body:
      "Every number on this site links to the formula that produced it. The /methodology page is the moat. If you can reproduce the regression, you can audit the claim. If we hide the formula we deserve to be ignored.",
  },
  {
    n: 6,
    for: "False positives published in the same email as the wins.",
    against: "Curated case-study reels.",
    body:
      "Every Tuesday digest names at least one signal that fired wrong the prior week, with the post-mortem inline. A vendor who never publishes a miss is a vendor with no calibration discipline. The /scorecard page is permanent and includes every miss.",
  },
  {
    n: 7,
    for: "Async over live.",
    against: "Discovery-call theatre.",
    body:
      "Two daily reply batches. No calendar links above the Sharp tier. A long written email beats a 30-minute call you scheduled to qualify yourself. If the question can be answered in writing, the call wastes the buyer's hour and the founder's anonymity at the same time.",
  },
  {
    n: 8,
    for: "Distribution is a moat. Friction is the leak.",
    against: "Walled-garden datasets.",
    body:
      "Every public surface has a markdown mirror at /md. Every page has an agent-card endpoint. The MCP server installs in one line. The OpenAPI spec is at a stable URL. We pay the cost of redundant discoverability so the reader, the agent, and the LLM all find us through whichever path fits them.",
  },
] as const;

/**
 * Voice rules, the shape of every sentence The Data Nerd writes.
 * Brunson Expert Secrets Ch 2 (Charismatic Leader 2.0).
 */
export const DATA_NERD_VOICE_RULES = [
  {
    rule: "Specific over general.",
    body:
      "Never say 'a startup'. Say 'a three-founder fintech with one repo'. Never say 'a fund'. Say 'the partner at [redacted] who DM'd me about the fintech the morning after the announcement'. Specific scales; general dies.",
  },
  {
    rule: "Translate, don't dump, plain business English over code jargon.",
    body:
      "We're talking to Marcus: a dealmaker who evaluates companies but doesn't read code, and whose fear is looking non-technical in a technical room. The Data Nerd is an engineer, but he writes for a non-coder, he reaches for the plain-English image a corp-dev partner would use ('they're shipping far more than usual,' 'the team doubled overnight,' 'they're building the thing competitors will copy in a year'), never a merge graph or a regression coefficient as the load-bearing explanation. An occasional code metaphor is fine as flavour; it can never be the thing the reader has to decode. 'Synergize the funnel' is still banned, so is anything that makes the reader feel he should already know what a commit graph is.",
  },
  {
    rule: "Number, then claim. Never claim, then number.",
    body:
      "Wrong: 'GitHub data is the most leading signal, we ran a panel of 219 startups.' Right: '219 startups, five quarters, median 31-day lead time. That's why we say GitHub data is the most leading signal.' Numbers up front earn the claim.",
  },
  {
    rule: "Admit what we don't know in the same breath.",
    body:
      "Every claim has a limit. Naming it before the reader does is the cheapest credibility move there is. 'False positive rate is 4%. We're trying to get it to 2% by Q4 but right now it's 4%.' Better than 'industry-leading accuracy'.",
  },
  {
    rule: "No hype words.",
    body:
      "Banned: 'unlock', 'leverage', 'game-changer', 'revolutionary', 'AI-powered' (without an actual model name), 'cutting-edge', 'next-generation'. If a word would survive being deleted, delete it.",
  },
  {
    rule: "Cliffhanger at the end of every email.",
    body:
      "The P.S. previews tomorrow's email or the next chapter. The reader closes the browser still curious. That's the entire job of email #N, get them to open email #N+1.",
  },
  {
    rule: "Never sign anyone else's name.",
    body:
      "Every byline is 'The Data Nerd' or unsigned. There is no second persona. There is no team handle. Voice fragmentation breaks the character; one handle, every surface, forever.",
  },
] as const;

/**
 * Six parables.
 */
export const DATA_NERD_PARABLES = [
  {
    slug: "lighthouse-keeper",
    title: "The Unknown Lighthouse Keeper",
    body:
      "A lighthouse keeper notices a particular flock of seabirds arrive a week before every storm. He doesn't know why. He only knows that when the birds arrive, ships should already be in harbour. The fishermen who follow him stop losing boats. The ones who say 'birds aren't weather data' keep losing them.",
    lesson:
      "Engineering acceleration is the seabird flock. It doesn't prove the storm. It precedes it reliably enough that ignoring it is the expensive choice.",
  },
  {
    slug: "loud-engine",
    title: "The Loud Engine",
    body:
      "Two cars start a race. One is silent at the line. The other idles loud, builds revs, the driver checks his mirrors, the passenger fastens her belt. The silent car may win, but the loud one is doing every observable thing a car about to launch does.",
    lesson:
      "Code is the engine of a startup. When the engine is visibly louder for two weeks running, the launch usually follows. We aren't reading the future. We're reading the things that always happen right before the future arrives.",
  },
  {
    slug: "letter-postman-read",
    title: "The Letter the Postman Already Read",
    body:
      "Imagine the postman could read every letter in his bag. The richest man in town wouldn't pay him for tomorrow's letters, those aren't in the bag yet. He'd pay him for today's letters delivered three days early.",
    lesson:
      "GitHub already wrote the letters. Crunchbase reads them on the day they land. We open them in transit. Everyone else gets the same mail we do, they just get it the week after the founder posted on LinkedIn.",
  },
  {
    slug: "sunday-email",
    title: "The Sunday Email I Never Sent",
    body:
      "The Sunday before the $4M Series A I should have been in, I drafted a three-line email to the founder. 'Saw your settlement-layer commits. The way you're handling the FX edge case is the kind of thing your competitors will copy in eighteen months.' I read it back. Decided I hadn't earned the right. Closed the laptop. Three weeks later the deck went out and the round closed inside a week.",
    lesson:
      "The email I didn't send cost me a position I'd already done the work to deserve. Now I send the email. The product on this site is a system that decides which Sunday emails are worth sending, so I never have to ask whether I've earned the right again.",
  },
  {
    slug: "wrong-reader",
    title: "The Reader Who Told Me I Was Wrong",
    body:
      "Six weeks into the public beta a Series B associate replied to a Tuesday digest with two lines. 'You flagged orgname. Their commit velocity tripled because they migrated a monorepo. There was no acceleration. Just a re-org.' She was right. The model had no signal for monorepo migration events. We added it the next Sunday, false positive rate dropped from 7% to 4% on the back of one reader's reply.",
    lesson:
      "Every methodology is wrong somewhere. The cheap move is to deny it. The expensive move, and the one that compounds, is to publish the limit before the reader finds it. We publish ours at /methodology. The reader who corrects us is the reader who matters most.",
  },
  {
    slug: "tuesday-regression",
    title: "The Tuesday I Broke the Regression",
    body:
      "On a Tuesday in February I refactored the velocity computation 'just to clean it up.' Pushed at 9pm. Wednesday morning the digest went out with three orgs ranked at the top that did not belong there, a hackathon, a bot-heavy security tool, a vendor's documentation repo. Thirty subscribers replied. I rolled back, ran the panel against the prior week's truth set, found the off-by-one in the contributor-deduplication step, shipped the fix Thursday at 3am, posted the post-mortem at /uptime Friday morning.",
    lesson:
      "The methodology is more interesting than the wins. When something breaks, the post-mortem goes public the same week. The regression code, the truth set, the fix commit, all linkable, all CC BY 4.0. That's the whole reason the price is €49/mo and not €4,900.",
  },
] as const;

/**
 * Three character flaws, Brunson DCS Ch 7.
 */
export const DATA_NERD_FLAWS = [
  {
    label: "Slow to reply.",
    body:
      "Email replies happen in two daily batches, never inside the hour. No LinkedIn DMs at all. If you need a vendor on Slack at 11pm, I'm not it.",
  },
  {
    label: "Won't do calls before you've subscribed.",
    body:
      "Sharp Tier funds get one quarterly call, included. Insider Circle gets the monthly group briefing. Below that, everything is async and written. I'd rather write you a long email than waste your hour on a discovery call you didn't need.",
  },
  {
    label: "No video, podcasts, or named publication.",
    body:
      "Anonymity is non-negotiable. If your firm requires named attribution on every paper or photo on every LinkedIn post, I'm the wrong vendor. The handle is what lets me say uncomfortable things about how the consensus deal-flow industry works.",
  },
] as const;

/**
 * Recognizable catchphrases, Brunson Expert Secrets Ch 2.
 */
export const DATA_NERD_CATCHPHRASES = [
  "Trust the math, not me.",
  "The methodology is the protagonist. I'm the storyteller.",
  "Public data, private lens.",
  "The deck lags the code by 21 to 47 days.",
  "Code is more honest than copy.",
  "If we're right, the data carries the argument.",
  "Read the methodology before you trust the metric.",
] as const;

/**
 * Where the reader will meet The Data Nerd across the site.
 */
export const DATA_NERD_TOUCHPOINTS = [
  {
    surface: "Email drip",
    where: "Days 0-180 in the welcome + daily-story sequences",
    how: "Every email signs as The Data Nerd. P.S. previews the next.",
  },
  {
    surface: "YouTube",
    where: "Acceleration Watch (weekly), State-of-the-Engine talk (monthly), Data Nerd Brief (weekly)",
    how: "Cartesia synthetic voice, the same voice across every video. No real-voice cameo, ever.",
  },
  {
    surface: "Manifesto + Origin + Founder pages",
    where: "/manifesto, /origin, /about/founder, /story",
    how: "Long-form character: backstory, polarity, parables, flaws.",
  },
  {
    surface: "Page narrations",
    where: "/walkthrough, /predicted, /state-of-github audio companions",
    how: "Synthetic voice reads the page. Disclosure on every player.",
  },
  {
    surface: "Weekly Sunday digest",
    where: "Free Acceleration Watch, every Monday 06:00 UTC",
    how: "Five startups, sector-tagged, signed The Data Nerd. The rhythm is the relationship.",
  },
  {
    surface: "Reply-to inbox",
    where: "signals@gitdealflow.com",
    how: "Same handle. Two daily reply batches. No call-scheduling links.",
  },
] as const;

/**
 * Now status, what The Data Nerd is currently working on.
 *
 * Brunson Expert Secrets Ch 2 + Ch 9: the character must be in daily contact
 * with the tribe. The weekly Sunday digest + monthly /state-of-github
 * address cover the public broadcast cadence. /now is the in-between
 * surface, what's open in the IDE this week, what just shipped, what's
 * blocking, what's in the parking lot.
 *
 * Update every Monday. Five fields, no more. The cadence IS the character.
 *
 * The literal "/now" page is part of the broader nownownow.com convention
 * (Derek Sivers), a public commit by the founder to keep this surface
 * fresher than About-Me. We adopt the convention because it's a perfect
 * anonymity-compatible character beat: status, not face.
 */
export const DATA_NERD_NOW = {
  asOf: "2026-06-01",
  weekISO: "2026-W23",
  shipping: [
    "Shipped a full conversion pass on signals.gitdealflow.com: killed a fabricated value-stack on /methodology-partnership, fixed the 'free → €7' link mismatches, and put the voice (and the right author tag) back on ~75 programmatic pages that had started reading like faceless SEO.",
    "Right behind it: localized the subscribe prompt on the non-English pages, cut the multi-button clutter on /research, /receipts, /origin and the weekly Top-100 down to one clear next step, and folded the duplicate tweet-teardown product back into /teardown.",
    "On the data side: unsubscribes now propagate to the subscriber store, and the Sunday digest carries a one-click HTTPS unsubscribe header.",
  ],
  reading: [
    "Reader replies from the two daily batches, still the cheapest place the next methodology fix comes from.",
    "The conversion-audit backlog: which faceless surfaces still need the plain-English, no-code-required treatment.",
  ],
  blocked: [
    "Auto-refreshing this /now page from real commit activity. Until that's built, the page only stays current if I update it by hand, which is exactly the kind of thing this section exists to admit.",
  ],
  parkingLot: [
    "The long tail of the conversion audit: the i18n depth pass and the remaining CTA-sprawl trims on secondary pages.",
    "Grading the first 60-day windows on the public /predicted picks as they come due on /scorecard.",
    "A member-public /wins/[handle] profile per consenting subscriber, drafted, still not shipped.",
  ],
  rhythm: {
    monday: "Sunday digest goes out · /predicted refresh",
    tuesday: "Reply batch · grading-window check on prior week's picks",
    wednesday: "Long-form essay (alternating Substack / dev.to) · methodology refinement",
    thursday: "Reply batch · panel-data audit",
    friday: "Friday Preview ships · /scorecard refresh",
    saturday: "Off, no email replies, no commits, no public surface changes",
    sunday: "Sunday digest pre-flight · the next week's /now update queues",
  },
} as const;

/**
 * Future self, the 12-month character arc.
 *
 * Brunson Expert Secrets Ch 22 (Decade in a Day): the character has to
 * project a future. Not a roadmap of features, a public commitment about
 * who the character will be 12 months from now. This is the readers'
 * future-pacing of the character itself, not the product. The two are
 * intentionally distinct: /roadmap is the product future, this is the
 * narrator future.
 *
 * Read this 12 months from publish (2026-05-09 → 2027-05-09) and grade
 * against what shipped. That's the credibility test.
 */
export const DATA_NERD_FUTURE_SELF = {
  publishedAt: "2026-05-09",
  graderDate: "2027-05-09",
  twelveMonthCommit: [
    {
      n: 1,
      label: "Still anonymous.",
      body:
        "No founder face, no real voice, no real-name media tour. If a podcast audience grows by 100K through breaking the rule, the rule still holds. The whole product rests on whether this commitment is kept; the day it breaks is the day the methodology has to compete with personality, and it loses.",
    },
    {
      n: 2,
      label: "Twelve State-of-Engine addresses on the record.",
      body:
        "One per month, every month, May 2026 → April 2027. Each one with a falsifiable prediction graded the following month. Twelve in a row is the cadence proof, eleven is a project, twelve is a practice.",
    },
    {
      n: 3,
      label: "/scorecard published with at least 80 weekly picks graded.",
      body:
        "Twelve months × 4-5 weekly picks per Sunday = ~52 grading windows by May 2027. Hit/Miss/Pending public, no curation. If the published precision drops below 60% across the panel, the price drops with it, the credibility chain has to hold both directions.",
    },
    {
      n: 4,
      label: "One additional methodology author on the SSRN paper.",
      body:
        "Co-author named, credit shared. Not because the work needs help (it doesn't) but because a methodology that lives in one anonymous head is one regression-rewrite away from breaking. A second name on the next preprint version is a continuity commitment to the buyer.",
    },
    {
      n: 5,
      label: "Insider Circle at 200 paid members or the price drops.",
      body:
        "Founding-member rate locked at €97/mo until 200 active subscribers, then a 60-day notice and a public price hike. The cohort closes when the math closes. Members who joined early stay at the locked rate forever.",
    },
  ],
} as const;

/**
 * Canonical author identity, E-E-A-T entity reconciliation.
 *
 * The Data Nerd is pseudonymous BY DESIGN (polarity #3: "Anonymity is a
 * credibility signal"). We never reveal a real name/face/voice. But a
 * pseudonymous author can still carry strong Experience / Expertise /
 * Authoritativeness / Trust IF the handle resolves to ONE persistent,
 * externally-verifiable entity rather than several weakly-linked partial
 * persons.
 *
 * Two rules enforce that:
 *   1. ONE @id everywhere, `${SITE}/about#person`. This is the id the rest
 *      of the site already points at (23 references, including bare
 *      `{ "@id": ... }` author pointers). Never mint a second id (no
 *      `#author`, no anonymous bare nodes). A split @id splits the entity
 *      and caps the trust signal. The authoritative full node MUST be
 *      emitted on /about so every pointer resolves to a rich, credentialed
 *      Person rather than dangling.
 *   2. The full verified anchor set on every author node. Each URL below is
 *      an independently checkable, already-published surface (see
 *      /citations). Anonymity-safe: scholarly IDs + handles only, never a
 *      real name. ORCID + the SSRN / Semantic Scholar *author* pages are
 *      what let an E-E-A-T-aware crawler treat the handle as a credentialed
 *      researcher with a publication record, not an anonymous byline.
 */
export const DATA_NERD_ORCID = "0009-0002-2222-4112";

export const DATA_NERD_AUTHOR_ID =
  "https://signals.gitdealflow.com/about#person";

/** schema.org-correct way to attach an ORCID to a Person/author node. */
export const DATA_NERD_ORCID_IDENTIFIER = {
  "@type": "PropertyValue",
  propertyID: "ORCID",
  value: DATA_NERD_ORCID,
  url: `https://orcid.org/${DATA_NERD_ORCID}`,
} as const;

/**
 * Verified, already-published external identity anchors. Order: scholarly
 * trust anchors first (ORCID, SSRN author page, Semantic Scholar author
 * page), then dataset/code/social handles, then internal long-form bio
 * surfaces. Note: Wikidata Q139376302 is the *brand* entity, not the
 * person, it lives on the Organization node, never here.
 */
export const DATA_NERD_AUTHOR_SAMEAS = [
  "https://orcid.org/0009-0002-2222-4112",
  "https://ssrn.com/author=8027395",
  "https://www.semanticscholar.org/author/The-Data-Nerd/2430837379",
  "https://huggingface.co/the-data-nerd",
  "https://www.kaggle.com/thedatanerd2026",
  "https://github.com/kindrat86",
  "https://news.ycombinator.com/user?id=the_data_nerd",
  "https://www.indiehackers.com/The_Data_Nerd",
  "https://signals.gitdealflow.com/citations",
  "https://signals.gitdealflow.com/about/founder",
  "https://signals.gitdealflow.com/origin",
] as const;

/**
 * Reusable author node for `author` / `accountablePerson` / `creator`
 * fields in any Article, ScholarlyArticle, or Dataset JSON-LD.
 *
 * Use this EVERYWHERE instead of hand-rolling an inline Person, it carries
 * the stable @id, the ORCID identifier, and the full sameAs set, so a
 * crawler reconciles the entity from a single page view.
 */
export const DATA_NERD_AUTHOR_REF = {
  "@type": "Person",
  "@id": DATA_NERD_AUTHOR_ID,
  name: DATA_NERD_NAME,
  url: "https://signals.gitdealflow.com/about",
  identifier: DATA_NERD_ORCID_IDENTIFIER,
  sameAs: [...DATA_NERD_AUTHOR_SAMEAS],
} as const;

/**
 * Schema.org Person object for The Data Nerd, the full author entity.
 * Emitted at high authority (/data-nerd, /about) with the same @id as
 * DATA_NERD_AUTHOR_REF so every lightweight reference reconciles to it.
 */
export const DATA_NERD_PERSON_SCHEMA = {
  "@type": "Person",
  "@id": DATA_NERD_AUTHOR_ID,
  name: DATA_NERD_NAME,
  alternateName: ["thedatanerd", "Data Nerd", "@thedatanerd"],
  description: DATA_NERD_BIO_MEDIUM,
  disambiguatingDescription:
    "Pseudonymous engineer-investor and sole methodology author of VC Deal Flow Signal. Identity is withheld by design; the handle resolves to a persistent ORCID and a published SSRN preprint.",
  jobTitle: "Founder & methodology author, VC Deal Flow Signal",
  identifier: DATA_NERD_ORCID_IDENTIFIER,
  knowsAbout: [
    "GitHub commit-velocity analysis",
    "Venture capital deal flow",
    "Quantitative deal sourcing",
    "Open-source momentum signals",
    "Panel-data regression",
  ],
  url: "https://signals.gitdealflow.com/data-nerd",
  sameAs: [...DATA_NERD_AUTHOR_SAMEAS],
  worksFor: {
    "@type": "Organization",
    "@id": "https://gitdealflow.com/#organization",
    name: "VC Deal Flow Signal",
    url: "https://gitdealflow.com",
  },
} as const;
