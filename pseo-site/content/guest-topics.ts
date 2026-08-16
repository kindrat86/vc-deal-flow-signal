/**
 * Prepared guest segments, synthetic-voice-renderable topics for podcast
 * appearances under the anonymity rule.
 *
 * Each topic is a 5-7 minute segment. The Data Nerd persona narrates via
 * Cartesia "Theo" (same voice powering /vsl and the monthly Stadium Pitch).
 * The "transcriptOpening" field gives the host the first 60 seconds verbatim
 * so they can decide if the format works without a back-and-forth.
 *
 * Anonymity-safe by construction: no founder face, no real name, no live
 * conversation. Hosts get a pre-recorded segment + a written Q&A that
 * answers their top 5 questions (also pre-recorded if they ask).
 */

export interface GuestTopic {
  slug: string;
  /** Headline a host can drop into their show notes verbatim. */
  title: string;
  /** Sub-headline (one sentence, ~20 words). */
  subheadline: string;
  /** Target segment length in minutes. */
  length: 5 | 7 | 10 | 15;
  /** Three audience profiles this topic lands with. */
  audienceFit: string[];
  /** Three concrete data points or claims the segment delivers. */
  promises: string[];
  /** First-60-seconds transcript, verbatim, so the host can preview the voice + tone. */
  transcriptOpening: string;
  /** 5 questions the host can ask in a follow-up Q&A round (also synthetic-voice-renderable). */
  hostQuestions: string[];
  /** Receipt links the host can drop in show notes. */
  references: { label: string; url: string }[];
  /** ISO date the topic was last refreshed (data points may go stale). */
  lastReviewed: string;
}

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";

export const GUEST_TOPICS: GuestTopic[] = [
  {
    slug: "github-velocity-as-leading-indicator",
    title:
      "GitHub Commit Velocity Is the Most Leading Public Signal in VC. Here's the Panel.",
    subheadline:
      "How a 219-company longitudinal panel showed a median 21-to-47-day lead time over Series A announcements.",
    length: 7,
    audienceFit: [
      "AI/ML researchers curious about applied alternative-data work",
      "Venture capitalists wondering if public data can produce real edge",
      "Engineers who want to know what their own commit graph signals to outsiders",
    ],
    promises: [
      "The exact composite signal, six primitives, weighted, falsifiable, with the false-positive rate published openly.",
      "Why the 38% false positives are mostly silent rounds and product launches, not noise, and what that means for sourcing.",
      "The replication appendix: how anyone can reproduce the panel against the public dataset in one afternoon.",
    ],
    transcriptOpening:
      "Most of what gets called venture deal flow is rumor with a calendar invite attached. Warm intros, partner-meeting syncs, the curated Slack of founders who already raised. None of it is leading. By the time it reaches you it's already lagging, and you're either the third call the founder takes or you're not in the room. So we built a panel. Two hundred and nineteen confirmed Series A and Series B fundraises, observed weekly across 400+ venture-backed startup GitHub organizations for five quarters. We measured commit velocity, contributor influx, dependents-graph fan-out, repository creation rate, and two more primitives. Then we asked: how far in advance does the engineering signal fire? The answer was a median 21 to 47 days. Not in retrospect, at the time. The paper is on SSRN. The dataset is open. This segment is the operator-level walk-through. I'm The Data Nerd, founder of VC Deal Flow Signal, narrating in synthetic voice because the methodology matters more than my face. Here's the seven-minute version.",
    hostQuestions: [
      "If GitHub velocity is leading, why hasn't every fund already built this?",
      "What's the failure mode, when does this signal lie to you?",
      "Is the 38% false positive rate actually false, or is it just data we can't see?",
      "How does this interact with private-data alternatives like Harmonic or Tracxn?",
      "If I'm a solo angel, what's the cheapest version of this I can run myself?",
    ],
    references: [
      { label: "SSRN paper (DOI 10.2139/ssrn.6606558)", url: "https://ssrn.com/abstract=6606558" },
      { label: "Methodology", url: `${SITE}/methodology` },
      { label: "Reproducibility appendix", url: `${SITE}/reproducibility` },
      { label: "Public dataset (Hugging Face)", url: "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal" },
    ],
    lastReviewed: "2026-05-09",
  },
  {
    slug: "code-side-sourcing-as-category",
    title:
      "Code-Side Sourcing: Naming the Category That Sits Between Crunchbase Scraping and Warm Intros",
    subheadline:
      "Why the third era of VC sourcing, reading public engineering activity at scale, needed a name before it could be priced.",
    length: 7,
    audienceFit: [
      "Emerging-manager GPs building thesis-led funds",
      "VC platform teams evaluating which alternative-data layer to buy",
      "Founders curious how investors will discover them in the next 24 months",
    ],
    promises: [
      "The three eras of deal sourcing, networks (1990-2010), databases (2010-2024), code-side (2024-present), with the inflection events that ended each era.",
      "Why naming a category is a marketing-first act with second-order pricing implications, and how we landed on 'code-side sourcing.'",
      "The four properties any code-side product must have to be defensible against the next wave of public-LLM-powered scrapers.",
    ],
    transcriptOpening:
      "There's a move in classical direct-response marketing where if you can name a new category, you don't have to compete in the old one. Crunchbase named startup intelligence. Harmonic named relationship-graph deal sourcing. We had to name what we do, because what we do isn't either of those, and pretending it was would have left us competing on price against products that have a hundred-fold our headcount. The name we landed on is code-side sourcing. The 'side' is doing work in that compound, it's the same morphology as supply-side, demand-side, sell-side, buy-side. It frames our act, which is reading the supply of public engineering activity at scale, against the historical opposite, which is reading the supply of pitch decks. Once you name it, you can teach it. Once you can teach it, you can charge for it. That's the seven-minute case for why naming the category mattered more than building the product first. I'm The Data Nerd. Here's the walk-through.",
    hostQuestions: [
      "Is 'code-side sourcing' actually a defensible category, or are you just rebranding?",
      "What's the test, when would you abandon the name?",
      "Who are the three other companies you'd consider category-mates, and how do you treat them?",
      "If LLMs can summarize any GitHub repo in a second, doesn't that commoditize this in 24 months?",
      "What's the hardest objection you get from investors, and how do you handle it?",
    ],
    references: [
      { label: "Code-Side Sourcing, category definition", url: `${SITE}/code-side-sourcing` },
      { label: "Mechanism, Commit-Velocity Acceleration Engine", url: `${SITE}/mechanism` },
      { label: "Alternatives", url: `${SITE}/alternatives` },
    ],
    lastReviewed: "2026-05-09",
  },
  {
    slug: "agent-native-vc-tooling",
    title:
      "What Agent-Native VC Tooling Actually Looks Like, and Why We Charge Per Call",
    subheadline:
      "Free MCP server, EUR 0.19 per deep-signal call via x402 USDC, no subscription gate. Here's why.",
    length: 7,
    audienceFit: [
      "AI engineers building investor-facing agents",
      "VCs experimenting with Claude/Cursor for diligence workflows",
      "Anyone curious how x402 micropayments will reshape API pricing",
    ],
    promises: [
      "The architectural choice: free MCP for human-augmented use, per-call for autonomous-agent use, with no subscription middle-ground.",
      "Why x402 + USDC + Base lets us charge fractions of a cent without account creation, and what breaks at scale.",
      "The agent-credits funnel from a product perspective: what converts, what doesn't, what we'd ship next.",
    ],
    transcriptOpening:
      "The interesting question about AI agents in VC isn't whether they'll do diligence. They will. The interesting question is who pays for the data they consume, and how. For us the answer was: the human user pays nothing for the MCP server, which gives them six tools they can use through Claude or Cursor or any other client. The autonomous agent pays nineteen cents per deep-signal call, settled in USDC on Base via the x402 protocol, no account, no API key, no Stripe, no invoicing. The agent encounters an HTTP 402, signs the payment, gets the payload, moves on. That's the entire onboarding flow. We made this choice because the unit economics of subscriptions don't survive an agent that runs a thousand calls overnight, and the unit economics of zero don't survive an investor who wants to extract our entire panel into their own model. Per-call splits the difference. I'm The Data Nerd. Here's the architectural walk-through and what we'd change.",
    hostQuestions: [
      "Why x402 over a regular API key + Stripe metered billing?",
      "What's the failure mode, what breaks if an agent runs 100k calls in an hour?",
      "How do you prevent the agent from extracting your entire panel?",
      "Do users actually understand the difference between MCP and per-call, or does it confuse them?",
      "If you were starting again today, what would you do differently?",
    ],
    references: [
      { label: "Agent-Credits page", url: `${SITE}/for-builders` },
      { label: "MCP server (live)", url: `${SITE}/api/mcp/rpc` },
      { label: "x402 launch press release", url: `${SITE}/press/agent-credits-launch-q2-2026` },
    ],
    lastReviewed: "2026-05-09",
  },
  {
    slug: "open-data-vc-academia-bridge",
    title:
      "Why a Venture-Capital Product Published Its Methodology on SSRN, And Re-Released the Data CC BY 4.0",
    subheadline:
      "Open data is not anti-business; it's the only defensible moat when the next product is shipped by a team three times your size.",
    length: 5,
    audienceFit: [
      "Open-source maintainers wondering if 'open core' works in VC tooling",
      "Researchers curious whether industry data ever makes it into peer review",
      "Founders evaluating moat strategies in commoditizing markets",
    ],
    promises: [
      "The economic argument for open data, and how it interacts with paid product surfaces (Insider Circle, Sector Sweep, Vault).",
      "The academic-distribution play: SSRN preprint, Zenodo dataset mirror, ORCID-attributed authorship, ClaimReview every claim.",
      "Why this isn't possible without an anonymity-first founder identity, and what we'd give up if we changed.",
    ],
    transcriptOpening:
      "There's a way to think about moats that I think is wrong, which is that you build a moat by hiding things. The opposite is closer to true. You build a moat by publishing things in a way that anyone who copies you ends up doing free marketing for you, because every copy is forced to cite the original. We published our methodology on SSRN, with a DOI. We released the dataset under Creative Commons Attribution 4.0. We registered an ORCID for the founder identity, even though that founder is an anonymous persona, because ORCID doesn't require government ID, and citation infrastructure does require a stable author identifier. The result is that every researcher, every journalist, every analyst who quotes our number now quotes us with attribution that can't be stripped. That's the moat. Five minutes on why we did it, what it cost, and what we'd do differently. I'm The Data Nerd.",
    hostQuestions: [
      "Doesn't open data destroy your business model?",
      "Why SSRN specifically, why not arXiv or Hugging Face Papers?",
      "How does academic citation actually convert to revenue?",
      "What stopped you from doing this earlier?",
      "Would you recommend this strategy to other founders?",
    ],
    references: [
      { label: "SSRN paper", url: "https://ssrn.com/abstract=6606558" },
      { label: "Zenodo mirror", url: "https://zenodo.org/records/19650920" },
      { label: "ORCID record", url: "https://orcid.org/0009-0002-2222-4112" },
      { label: "Citation guide", url: `${SITE}/citation-guide` },
    ],
    lastReviewed: "2026-05-09",
  },
  {
    slug: "scaling-public-github-reads",
    title:
      "How to Read 400+ GitHub Organizations a Week Without Getting Rate-Limited Into Oblivion",
    subheadline:
      "The systems story behind the panel, five primitives, three layers of caching, one war with the secondary-rate-limit ledger.",
    length: 10,
    audienceFit: [
      "Senior engineers doing data-pipeline work at scale",
      "SREs curious about the GitHub API rate-limit topology",
      "Anyone building public-LLM-grounded products at scale",
    ],
    promises: [
      "The exact rate-limit topology of the GitHub REST and GraphQL APIs, primary, secondary, abuse, search, with the latencies we observed.",
      "Why we ended up running our own conditional-request ledger and what that bought us.",
      "The three pipeline failure modes that cost us the most time, and how we'd architect the next version.",
    ],
    transcriptOpening:
      "Rate limits on the GitHub API are documented in three places, and only two of them are accurate. The third is the secondary rate limit, which is documented as 'don't make too many concurrent requests' but is actually a sliding-window counter on a per-resource basis that resets at variable intervals depending on how the underlying service is feeling. Reading 400+ organizations a week, across two API surfaces, with five primitives per organization, gets you into a sustained negotiation with this third rate limit. We lost about three months of engineering time to it. I want to walk through what we learned, including the embarrassing parts. Ten minutes, systems-first, no marketing. I'm The Data Nerd, narrating in synthetic voice, the technical content is the same.",
    hostQuestions: [
      "What's the cheapest hardware you can run this pipeline on?",
      "Did you consider GitHub Archive instead of live API reads?",
      "What's the legal posture on scraping at this scale?",
      "How do you handle organizations going private mid-observation?",
      "If you had to rebuild this on day one, what would you do differently?",
    ],
    references: [
      { label: "Methodology", url: `${SITE}/methodology` },
      { label: "Reproducibility appendix", url: `${SITE}/reproducibility` },
      { label: "Standards (data quality)", url: `${SITE}/standards` },
    ],
    lastReviewed: "2026-05-09",
  },
  {
    slug: "false-positives-and-the-falsifiability-rule",
    title:
      "The 38 Percent False-Positive Rate We Won't Hide, And Why That's the Whole Point",
    subheadline:
      "Why publishing the failure rate of your signal is the only credible move, and how 'silent rounds' broke our intuition.",
    length: 5,
    audienceFit: [
      "Data scientists who love a good post-mortem",
      "Investors who want a rigorous take on alt-data overclaiming",
      "Anyone who's tired of vendor decks claiming '95% accuracy' with no error bars",
    ],
    promises: [
      "Why a 38% false-positive rate is a feature, not a bug, and what an honest 0% claim would actually mean.",
      "The breakdown of those 38%: silent rounds (~70%), product launches (~15%), real false signals (~4%), still-open windows (~11%).",
      "The 'corrections' page: a public log of every claim we've had to retract or revise.",
    ],
    transcriptOpening:
      "Anyone who tells you their alternative-data signal has a 95 percent hit rate is either selling you a thing that doesn't exist, or measuring against a denominator that's been quietly shrunk to make the numerator look better. Our number is 62 percent. Inverse: 38 percent of the orgs the panel flags do not raise a publicly announced round inside the 90-day window. We publish that. Loudly. Because if I claimed 95 you should walk away from the table, and I'd rather have you sitting at the table at 62 with a clear-eyed view of what the other 38 are. Of those 38, our best estimate is that about 70 percent are silent rounds, extension rounds, secondaries, strategic check-ins, that just don't appear on Crunchbase. Another 15 percent had a major product launch in the same window. About 11 percent are still inside their open observation window. Only 4 percent appear to be genuine false signals, orgs where nothing material happened. Five minutes on why this matters more than the headline number. I'm The Data Nerd.",
    hostQuestions: [
      "How do you actually verify 'silent rounds' if they're, by definition, silent?",
      "What's the corrections process, when have you had to revise a claim?",
      "How does the false-positive rate vary by sector?",
      "Is the 4% genuinely-false bucket actually our methodology failing, or just fundamental ambiguity?",
      "What would it take to get this to 75 or 80 percent?",
    ],
    references: [
      { label: "Corrections log", url: `${SITE}/corrections` },
      { label: "Attestations (ClaimReview)", url: `${SITE}/attestations` },
      { label: "Standards", url: `${SITE}/standards` },
    ],
    lastReviewed: "2026-05-09",
  },
  {
    slug: "free-mcp-as-distribution",
    title:
      "We Gave Away the MCP Server. Here's What It Did to the Top of the Funnel.",
    subheadline:
      "How a free six-tool MCP server became the highest-converting acquisition channel for a paid VC product.",
    length: 7,
    audienceFit: [
      "Founders deciding whether to launch an MCP integration",
      "Indie hackers exploring agent-native distribution",
      "AI/ML engineers shipping their own MCP servers and wondering if the funnel works",
    ],
    promises: [
      "The numbers: monthly active MCP installs, conversion rate to free Signal Digest, conversion rate from there to paid Insider Circle.",
      "Why MCP is structurally different from a 'free trial', the user is integrated before they can compare alternatives.",
      "The three things we got wrong on day one of the MCP launch and what we'd do instead.",
    ],
    transcriptOpening:
      "A free MCP server is not a free trial. A free trial gives the user fourteen days to evaluate before they have to swipe. A free MCP server gives the user a permanent integration into the workflow they already live in, which is, in our case, Claude Desktop or Cursor. They install it once. From that moment forward, every time they ask their agent 'what GitHub orgs are accelerating in cybersecurity this week,' the answer comes from us. They don't have to remember our brand. They don't have to remember our URL. Their agent does. That's distribution. We launched the MCP server free, with six tools, with no rate limit on the human-augmented surface. The conversion to paid is roughly an order of magnitude better than the conversion from our cold-traffic homepage. Seven minutes on why, with the numbers. I'm The Data Nerd.",
    hostQuestions: [
      "Doesn't free MCP cannibalize your paid tier?",
      "How do you think about LLM-side caching of your responses?",
      "What's the abuse vector, what stops someone from extracting your whole dataset?",
      "Did you consider shipping the MCP server as a paid tier?",
      "What's the next agent-runtime you'd ship for, and why?",
    ],
    references: [
      { label: "MCP server install", url: `${SITE}/install` },
      { label: "Agent-credits funnel", url: `${SITE}/for-builders` },
      { label: "/agents, agent marketplace mirrors", url: `${SITE}/agents` },
    ],
    lastReviewed: "2026-05-09",
  },
];

export function getTopicBySlug(slug: string): GuestTopic | undefined {
  return GUEST_TOPICS.find((t) => t.slug === slug);
}

export function getTopicTitle(slug: string): string {
  return getTopicBySlug(slug)?.title ?? slug;
}
