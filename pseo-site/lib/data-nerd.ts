/**
 * The Data Nerd — Attractive Character canon (Russell Brunson DCS Ch 7 + ES Ch 2).
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
 * Short bio — used in email signoff chip and small character cards.
 */
export const DATA_NERD_BIO_SHORT =
  "Engineer-investor. Wrote the SSRN paper (n=219). Replies in batches. Won't do podcasts. Lives behind a regression.";

/**
 * Medium bio — used on /perfect-webinar close, /manifesto signoff, /story footer.
 */
export const DATA_NERD_BIO_MEDIUM =
  "I'm The Data Nerd. I won't tell you my real name and that's on purpose — the methodology is the protagonist, I'm just the storyteller. Engineer for fifteen years, angel-checker since deal #5. The whole product rests on whether the signal is real, not on whether you find me charismatic.";

/**
 * Audio disclosure — required wherever the synthetic voice plays.
 */
export const DATA_NERD_AUDIO_DISCLOSURE =
  "Synthetic voice (Cartesia). Same voice across YouTube, email-audio, and every page narration. There is no founder voice. The methodology is real. The voice is a writing convention.";

/**
 * Polarity — what The Data Nerd stands for, what they stand against.
 * Brunson DCS Ch 7: Attractive Character must take a side.
 */
export const DATA_NERD_POLARITY = [
  {
    n: 1,
    for: "Public data is more valuable than private data.",
    against: "Edge from access.",
    body:
      "Quant funds make billions on SEC filings. The filings are public. The model is not. The same is true of GitHub.",
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
    for: "€9.97/mo is a feature, not a price ceiling.",
    against: "Six-figure data subscriptions for six-person funds.",
    body:
      "We'd rather have a thousand readers who tell five friends than a hundred enterprise contracts. The founding price is locked forever.",
  },
] as const;

/**
 * Voice rules — the shape of every sentence The Data Nerd writes.
 * Brunson Expert Secrets Ch 2 (Charismatic Leader 2.0).
 */
export const DATA_NERD_VOICE_RULES = [
  {
    rule: "Specific over general.",
    body:
      "Never say 'a startup'. Say 'a three-founder fintech with one repo'. Never say 'a fund'. Say 'the partner at [redacted] who DM'd me about the fintech the morning after the announcement'. Specific scales; general dies.",
  },
  {
    rule: "Code metaphors over business metaphors.",
    body:
      "We're talking to engineer-investors. 'Pre-cache the deal flow' lands. 'Synergize the funnel' doesn't. When in doubt, reach for a build pipeline, a regression coefficient, or a merge graph.",
  },
  {
    rule: "Number, then claim. Never claim, then number.",
    body:
      "Wrong: 'GitHub data is the most leading signal — we ran a panel of 219 startups.' Right: '219 startups, five quarters, median 31-day lead time. That's why we say GitHub data is the most leading signal.' Numbers up front earn the claim.",
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
      "The P.S. previews tomorrow's email or the next chapter. The reader closes the browser still curious. That's the entire job of email #N — get them to open email #N+1.",
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
      "Two cars start a race. One is silent at the line. The other idles loud, builds revs, the driver checks his mirrors, the passenger fastens her belt. The silent car may win — but the loud one is doing every observable thing a car about to launch does.",
    lesson:
      "Code is the engine of a startup. When the engine is visibly louder for two weeks running, the launch usually follows. We aren't reading the future. We're reading the things that always happen right before the future arrives.",
  },
  {
    slug: "letter-postman-read",
    title: "The Letter the Postman Already Read",
    body:
      "Imagine the postman could read every letter in his bag. The richest man in town wouldn't pay him for tomorrow's letters — those aren't in the bag yet. He'd pay him for today's letters delivered three days early.",
    lesson:
      "GitHub already wrote the letters. Crunchbase reads them on the day they land. We open them in transit. Everyone else gets the same mail we do — they just get it the week after the founder posted on LinkedIn.",
  },
  {
    slug: "sunday-email",
    title: "The Sunday Email I Never Sent",
    body:
      "The Sunday before the $4M Series A I should have been in, I drafted a three-line email to the founder. 'Saw your settlement-layer commits. The way you're handling the FX edge case is the kind of thing your competitors will copy in eighteen months.' I read it back. Decided I hadn't earned the right. Closed the laptop. Three weeks later the deck went out and the round closed inside a week.",
    lesson:
      "The email I didn't send cost me a position I'd already done the work to deserve. Now I send the email. The product on this site is a system that decides which Sunday emails are worth sending — so I never have to ask whether I've earned the right again.",
  },
  {
    slug: "wrong-reader",
    title: "The Reader Who Told Me I Was Wrong",
    body:
      "Six weeks into the public beta a Series B associate replied to a Tuesday digest with two lines. 'You flagged orgname. Their commit velocity tripled because they migrated a monorepo. There was no acceleration. Just a re-org.' She was right. The model had no signal for monorepo migration events. We added it the next Sunday — false positive rate dropped from 7% to 4% on the back of one reader's reply.",
    lesson:
      "Every methodology is wrong somewhere. The cheap move is to deny it. The expensive move — and the one that compounds — is to publish the limit before the reader finds it. We publish ours at /methodology. The reader who corrects us is the reader who matters most.",
  },
  {
    slug: "tuesday-regression",
    title: "The Tuesday I Broke the Regression",
    body:
      "On a Tuesday in February I refactored the velocity computation 'just to clean it up.' Pushed at 9pm. Wednesday morning the digest went out with three orgs ranked at the top that did not belong there — a hackathon, a bot-heavy security tool, a vendor's documentation repo. Thirty subscribers replied. I rolled back, ran the panel against the prior week's truth set, found the off-by-one in the contributor-deduplication step, shipped the fix Thursday at 3am, posted the post-mortem at /uptime Friday morning.",
    lesson:
      "The methodology is more interesting than the wins. When something breaks, the post-mortem goes public the same week. The regression code, the truth set, the fix commit — all linkable, all CC BY 4.0. That's the whole reason the price is €9.97/mo and not €9,970.",
  },
] as const;

/**
 * Three character flaws — Brunson DCS Ch 7.
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
 * Recognizable catchphrases — Brunson Expert Secrets Ch 2.
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
    where: "Days 0–180 in the welcome + daily-story sequences",
    how: "Every email signs as The Data Nerd. P.S. previews the next.",
  },
  {
    surface: "YouTube",
    where: "Acceleration Watch (weekly), State-of-the-Engine talk (monthly), Data Nerd Brief (weekly)",
    how: "Cartesia synthetic voice — the same voice across every video. No real-voice cameo, ever.",
  },
  {
    surface: "Manifesto + Origin + Founder pages",
    where: "/manifesto, /origin, /about/founder, /story",
    how: "Long-form character: backstory, polarity, parables, flaws.",
  },
  {
    surface: "Page narrations",
    where: "/perfect-webinar, /predicted, /state-of-github audio companions",
    how: "Synthetic voice reads the page. Disclosure on every player.",
  },
  {
    surface: "Weekly Sunday digest",
    where: "Free Acceleration Watch, every Monday 06:00 UTC",
    how: "Five startups, sector-tagged, signed The Data Nerd. The rhythm is the relationship.",
  },
  {
    surface: "Reply-to inbox",
    where: "signal@gitdealflow.com",
    how: "Same handle. Two daily reply batches. No call-scheduling links.",
  },
] as const;

/**
 * Schema.org Person object for The Data Nerd.
 */
export const DATA_NERD_PERSON_SCHEMA = {
  "@type": "Person",
  "@id": "https://signals.gitdealflow.com/about#author",
  name: DATA_NERD_NAME,
  alternateName: ["thedatanerd", "Data Nerd", "@thedatanerd"],
  additionalType: "https://schema.org/Pseudonym",
  description: DATA_NERD_BIO_SHORT,
  jobTitle: "Founder & methodology author, VC Deal Flow Signal",
  knowsAbout: [
    "GitHub commit-velocity analysis",
    "Venture capital deal flow",
    "Quantitative deal sourcing",
    "Open-source momentum signals",
    "Panel-data regression",
  ],
  url: "https://signals.gitdealflow.com/data-nerd",
  sameAs: [
    "https://signals.gitdealflow.com/about/founder",
    "https://signals.gitdealflow.com/origin",
    "https://huggingface.co/the-data-nerd",
    "https://www.kaggle.com/thedatanerd2026",
  ],
  worksFor: {
    "@type": "Organization",
    "@id": "https://gitdealflow.com/#organization",
    name: "VC Deal Flow Signal",
    url: "https://gitdealflow.com",
  },
} as const;
