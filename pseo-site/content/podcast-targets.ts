/**
 * Podcast guest targets, synthetic-voice outreach list (Traffic Secrets Ch 15:
 * Letterman Method, anonymity-adapted).
 *
 * Anonymity rule: founder face/voice/real name are never exposed. The
 * Letterman Method (going on shows) is partially open via synthetic voice
 * (Cartesia "Theo", the same voice powering /vsl and the monthly Stadium
 * Pitch). This file enumerates the shows we will pitch, the angle, the
 * contact path, the fit score, and the current outreach status.
 *
 * Status semantics:
 *  - "ready"      Pitch drafted, awaiting send (manual; founder reviews)
 *  - "pitched"    First-touch sent; awaiting reply
 *  - "in-talks"   Host replied positively, scheduling
 *  - "scheduled"  Recording date set
 *  - "live"       Episode published
 *  - "passed"     Host declined or unresponsive after 3 follow-ups
 *  - "blocked"    Show requires live face/voice that breaks anonymity rule
 */

export interface PodcastTarget {
  /** Slug used in /podcasts/[slug] if we later promote individual targets. */
  slug: string;
  /** Show name as it appears on directories. */
  name: string;
  /** Host(s), public name only; we never personalize beyond what they share publicly. */
  host: string;
  /** Show focus. Drives which prepared topic we lead with. */
  focus: "ai-eng" | "ai-research" | "vc" | "devtools" | "data" | "founder" | "general-tech";
  /** Estimated audience size (back-of-envelope, public sources). */
  audienceTier: "S" | "A" | "B" | "C";
  /** Publicly listed contact path. */
  contact: {
    email?: string;
    form?: string;
    twitterDM?: string;
    linkedinDM?: string;
    note?: string;
  };
  /** Show URL (Apple/Spotify/website). */
  url: string;
  /** Why this show is a fit (1 sentence). */
  fitReason: string;
  /** Which prepared topic to lead with (slug from guest-topics.ts). */
  leadTopicSlug: string;
  /** ICP score 0-100, Match × Reach × Engage rubric. */
  icpScore: number;
  /** Anonymity compatibility:
   *  - "synthetic-ok"   Show accepts pre-recorded/AI-narrated guests
   *  - "voice-only"     Show is voice-only (audio-only podcast, no video), synthetic possible if asked nicely
   *  - "video-required" Show requires video; blocked under anonymity rule
   *  - "unknown"        Need to ask in pitch
   */
  anonymityFit: "synthetic-ok" | "voice-only" | "video-required" | "unknown";
  /** Current status per the semantics above. */
  status:
    | "ready"
    | "pitched"
    | "in-talks"
    | "scheduled"
    | "live"
    | "passed"
    | "blocked";
  /** Last-touch date (ISO) for follow-up cadence. */
  lastTouch?: string;
  /** Free-text note: what we tried, what worked, what to remember. */
  note?: string;
}

/**
 * Curated 22-target list. Tier-S are the dream-100-equivalent of podcasting in
 * our category. Tier-A are reachable. Tier-B are warm-up reps. Tier-C are
 * niche but ICP-aligned (Solo angels listen to these).
 *
 * No live in-person shows. No video-required shows in the active list, they
 * are documented in BLOCKED_TARGETS below for transparency.
 */
export const PODCAST_TARGETS: PodcastTarget[] = [
  // ─── Tier S, AI/ML research + engineering ─────────────────────────────────
  {
    slug: "twiml-ai",
    name: "TWIML AI Podcast",
    host: "Sam Charrington",
    focus: "ai-research",
    audienceTier: "S",
    contact: {
      email: "sam@twimlai.com",
      form: "https://twimlai.com/contact/",
      twitterDM: "@samcharrington",
      note: "Sam pre-records remotely; Riverside-based. Has hosted methodology-paper authors before.",
    },
    url: "https://twimlai.com/podcast/",
    fitReason:
      "TWIML covers ML methodology papers; our SSRN GitHub-velocity panel is exactly the kind of preprint they showcase.",
    leadTopicSlug: "github-velocity-as-leading-indicator",
    icpScore: 88,
    anonymityFit: "voice-only",
    status: "ready",
    note: "Lead pitch: 'methodology paper, no founder face needed, synthetic voice rendering of the segment available on request.'",
  },
  {
    slug: "latent-space",
    name: "Latent Space",
    host: "swyx & Alessio Fanelli",
    focus: "ai-eng",
    audienceTier: "S",
    contact: {
      email: "podcast@latent.space",
      twitterDM: "@swyx",
      note: "swyx is in our Dream 100. Latent Space favours technical depth over personality.",
    },
    url: "https://www.latent.space/podcast",
    fitReason:
      "Latent Space audience = AI engineers building agents; we ship a free MCP server and our agent-credits funnel is shipped.",
    leadTopicSlug: "agent-native-vc-tooling",
    icpScore: 92,
    anonymityFit: "voice-only",
    status: "ready",
    note: "Cross-link: swyx already in Dream 100 engagement log.",
  },
  {
    slug: "practical-ai",
    name: "Practical AI",
    host: "Daniel Whitenack & Chris Benson",
    focus: "ai-eng",
    audienceTier: "S",
    contact: {
      form: "https://changelog.com/contact",
      email: "editors@changelog.com",
      note: "Changelog network, they have a clean editorial form. No anonymity friction documented for prior guests.",
    },
    url: "https://changelog.com/practicalai",
    fitReason:
      "Practical AI covers applied ML for non-research audiences; the 'public GitHub data → predictive signal' angle lands cleanly here.",
    leadTopicSlug: "github-velocity-as-leading-indicator",
    icpScore: 84,
    anonymityFit: "voice-only",
    status: "ready",
  },
  {
    slug: "this-day-in-ai",
    name: "This Day in AI Podcast",
    host: "Michael & Chris Sharkey",
    focus: "ai-eng",
    audienceTier: "A",
    contact: {
      email: "podcast@thisdayinai.com",
      twitterDM: "@thisdayinai",
      note: "Weekly news show, favours timely takes. Pitch around an active week (new model release, agent-eco event).",
    },
    url: "https://thisdayinaipodcast.com/",
    fitReason:
      "Ad-hoc news commentary slot, they read ML/agent newsletters live. Good cold-open surface for our agent-credits angle.",
    leadTopicSlug: "agent-native-vc-tooling",
    icpScore: 78,
    anonymityFit: "voice-only",
    status: "ready",
  },
  {
    slug: "machine-learning-street-talk",
    name: "Machine Learning Street Talk",
    host: "Tim Scarfe & Keith Duggar",
    focus: "ai-research",
    audienceTier: "A",
    contact: {
      twitterDM: "@MLStreetTalk",
      email: "tim@mlst.ai",
      note: "Long-form research conversations. Will prefer the methodology angle over the product angle.",
    },
    url: "https://www.youtube.com/c/MachineLearningStreetTalk",
    fitReason:
      "Methodology-first audience; our SSRN panel + reproducibility appendix slots exactly into their format.",
    leadTopicSlug: "open-data-vc-academia-bridge",
    icpScore: 80,
    anonymityFit: "video-required",
    status: "blocked",
    note: "MLST is YouTube-first with face cam. Re-evaluate if they accept synthetic-avatar guests; otherwise ship a written piece for their newsletter instead.",
  },

  // ─── Tier S, VC podcasts ─────────────────────────────────────────────────
  {
    slug: "20vc",
    name: "20VC with Harry Stebbings",
    host: "Harry Stebbings",
    focus: "vc",
    audienceTier: "S",
    contact: {
      form: "https://www.20vc.com/contact",
      twitterDM: "@HarryStebbings",
      note: "Harry runs a tight booking funnel; pitch must include 'one new framework + one specific data point.'",
    },
    url: "https://www.20vc.com/",
    fitReason:
      "Harry covers GP/LP dynamics + emerging managers; 'code-side sourcing' is a new framework with a defensible 219-company panel behind it.",
    leadTopicSlug: "code-side-sourcing-as-category",
    icpScore: 86,
    anonymityFit: "video-required",
    status: "blocked",
    note: "20VC is video-first. Re-evaluate quarterly, Harry has done audio-only carve-outs before.",
  },
  {
    slug: "invest-like-the-best",
    name: "Invest Like the Best",
    host: "Patrick O'Shaughnessy",
    focus: "vc",
    audienceTier: "S",
    contact: {
      email: "podcast@joincolossus.com",
      form: "https://www.joincolossus.com/about",
      note: "Patrick books months out and prefers institutional guests. Pitch the panel as data-research, not founder-promo.",
    },
    url: "https://www.joincolossus.com/episodes",
    fitReason:
      "Colossus audience overlaps with quant-curious GPs. The SSRN paper opens the door; founder identity is incidental.",
    leadTopicSlug: "open-data-vc-academia-bridge",
    icpScore: 75,
    anonymityFit: "video-required",
    status: "blocked",
    note: "Long shot, video-required. Track for opportunity but don't burn cycles.",
  },
  {
    slug: "logan-bartlett",
    name: "The Logan Bartlett Show",
    host: "Logan Bartlett",
    focus: "vc",
    audienceTier: "A",
    contact: {
      twitterDM: "@loganbartlett",
      email: "logan@redpoint.com",
      note: "Logan covers SaaS + infra. Pitch the 'engineers as buyers of VC software' angle.",
    },
    url: "https://www.theloganbartlettshow.com/",
    fitReason:
      "Redpoint thesis-fit, they invest in VC tooling. Our /alternatives content map gives him concrete competitive intel.",
    leadTopicSlug: "code-side-sourcing-as-category",
    icpScore: 72,
    anonymityFit: "video-required",
    status: "blocked",
  },
  {
    slug: "bg2-pod",
    name: "BG2 Pod",
    host: "Brad Gerstner & Bill Gurley",
    focus: "vc",
    audienceTier: "S",
    contact: {
      twitterDM: "@bgurley",
      note: "BG2 books high-signal guests. Single-pitch only; if they pass, don't follow up for 6 months.",
    },
    url: "https://www.bg2pod.com/",
    fitReason:
      "Bill Gurley has historically engaged with public-data investment frameworks. The panel + SSRN paper is the door-opener.",
    leadTopicSlug: "open-data-vc-academia-bridge",
    icpScore: 70,
    anonymityFit: "video-required",
    status: "blocked",
  },

  // ─── Tier A, Devtools / engineering ──────────────────────────────────────
  {
    slug: "software-engineering-daily",
    name: "Software Engineering Daily",
    host: "Jeff Meyerson estate / Sean Falconer",
    focus: "devtools",
    audienceTier: "A",
    contact: {
      email: "host@softwareengineeringdaily.com",
      form: "https://softwareengineeringdaily.com/contact/",
      note: "SED is audio-first, accepts remote pre-records.",
    },
    url: "https://softwareengineeringdaily.com/",
    fitReason:
      "SED audience = senior engineers and SREs. The 'reading public GitHub at scale' methodology lands as a pure systems story.",
    leadTopicSlug: "scaling-public-github-reads",
    icpScore: 82,
    anonymityFit: "voice-only",
    status: "ready",
    note: "SED has hosted anonymous ops engineers before. Lead with the systems angle, not the VC angle.",
  },
  {
    slug: "changelog",
    name: "The Changelog",
    host: "Adam Stacoviak & Jerod Santo",
    focus: "devtools",
    audienceTier: "A",
    contact: {
      form: "https://changelog.com/contact",
      email: "editors@changelog.com",
      note: "Same network as Practical AI. Two-show family, pitch one, get a chance at both.",
    },
    url: "https://changelog.com/podcast",
    fitReason:
      "Open-source-first audience. Our CC BY 4.0 dataset + open MCP server + open methodology paper is dead-center editorial fit.",
    leadTopicSlug: "open-data-vc-academia-bridge",
    icpScore: 86,
    anonymityFit: "voice-only",
    status: "ready",
  },
  {
    slug: "go-time",
    name: "Go Time (Changelog)",
    host: "Changelog rotating cast",
    focus: "devtools",
    audienceTier: "B",
    contact: { form: "https://changelog.com/contact" },
    url: "https://changelog.com/gotime",
    fitReason:
      "Stretch fit, only if we publish a Go-language reference implementation of the panel ingestion pipeline.",
    leadTopicSlug: "scaling-public-github-reads",
    icpScore: 55,
    anonymityFit: "voice-only",
    status: "ready",
    note: "Optional, only pitch if we ship a Go reference implementation in tools/.",
  },
  {
    slug: "syntax-fm",
    name: "Syntax.fm",
    host: "Wes Bos & Scott Tolinski",
    focus: "devtools",
    audienceTier: "A",
    contact: {
      twitterDM: "@syntaxfm",
      email: "hi@syntax.fm",
    },
    url: "https://syntax.fm/",
    fitReason:
      "Frontend audience, overlap is thinner but our Chrome extensions ship to a frontend-engineer surface.",
    leadTopicSlug: "agent-native-vc-tooling",
    icpScore: 60,
    anonymityFit: "voice-only",
    status: "ready",
    note: "Lower priority, pitch only after Latent Space + Practical AI close.",
  },

  // ─── Tier A, Data / quant ────────────────────────────────────────────────
  {
    slug: "data-engineering-podcast",
    name: "Data Engineering Podcast",
    host: "Tobias Macey",
    focus: "data",
    audienceTier: "A",
    contact: {
      email: "hosts@dataengineeringpodcast.com",
      form: "https://www.dataengineeringpodcast.com/contact/",
      note: "Tobias accepts remote pre-records and is methodology-friendly.",
    },
    url: "https://www.dataengineeringpodcast.com/",
    fitReason:
      "DE audience cares about reproducible pipelines. Our 'panel construction from public GitHub' is a narratable end-to-end pipeline story.",
    leadTopicSlug: "scaling-public-github-reads",
    icpScore: 82,
    anonymityFit: "voice-only",
    status: "ready",
  },
  {
    slug: "data-skeptic",
    name: "Data Skeptic",
    host: "Kyle Polich",
    focus: "data",
    audienceTier: "B",
    contact: {
      email: "podcast@dataskeptic.com",
      twitterDM: "@dataskeptic",
    },
    url: "https://dataskeptic.com/",
    fitReason:
      "Skeptic-first framing. Our 38% false-positive disclosure + falsifiability commitments are exactly the methodology rigor they reward.",
    leadTopicSlug: "false-positives-and-the-falsifiability-rule",
    icpScore: 76,
    anonymityFit: "voice-only",
    status: "ready",
  },
  {
    slug: "the-radar",
    name: "The Radar (O'Reilly)",
    host: "Mike Loukides + rotating",
    focus: "data",
    audienceTier: "B",
    contact: {
      email: "radar@oreilly.com",
      note: "O'Reilly Radar accepts contributed segments; can be 5-min commentary slot, not full episode.",
    },
    url: "https://www.oreilly.com/radar/",
    fitReason:
      "Radar features methodology pieces tied to public datasets. Synthetic-voice 5-min segment fits their format cleanly.",
    leadTopicSlug: "open-data-vc-academia-bridge",
    icpScore: 70,
    anonymityFit: "voice-only",
    status: "ready",
  },

  // ─── Tier A, Founder / SaaS ──────────────────────────────────────────────
  {
    slug: "indie-hackers",
    name: "Indie Hackers Podcast",
    host: "Courtland Allen / Channing Allen",
    focus: "founder",
    audienceTier: "A",
    contact: {
      twitterDM: "@csallen",
      email: "courtland@indiehackers.com",
      note: "IH has accepted anonymous solo-founder guests in the past (with voice).",
    },
    url: "https://www.indiehackers.com/podcast",
    fitReason:
      "IH audience overlap with our 'founders shipping for engineers' positioning + free MCP server distribution story.",
    leadTopicSlug: "free-mcp-as-distribution",
    icpScore: 75,
    anonymityFit: "voice-only",
    status: "ready",
    note: "Pitch as 'anonymous solo-founder, methodology over personality', Courtland has accepted this framing for past guests.",
  },
  {
    slug: "lenny-pod",
    name: "Lenny's Podcast",
    host: "Lenny Rachitsky",
    focus: "founder",
    audienceTier: "S",
    contact: {
      email: "lenny@lennysnewsletter.com",
      twitterDM: "@lennysan",
      note: "Lenny in Dream 100; bookings tend to require known operator profile.",
    },
    url: "https://www.lennyspodcast.com/",
    fitReason:
      "Lenny covers PM/growth; angle = 'how I went from product-led to data-research-led growth'.",
    leadTopicSlug: "research-as-distribution",
    icpScore: 70,
    anonymityFit: "video-required",
    status: "blocked",
    note: "Video-required. Track but don't waste cycles.",
  },
  {
    slug: "saastr-cro-confidential",
    name: "SaaStr / CRO Confidential",
    host: "Sam Blond / Jason Lemkin",
    focus: "founder",
    audienceTier: "B",
    contact: { form: "https://www.saastr.com/contact/" },
    url: "https://www.saastr.com/podcasts/",
    fitReason:
      "Stretch, SaaStr audience cares about ARR ramp; angle = 'free MCP + €0.99 book funnel as customer acquisition.'",
    leadTopicSlug: "free-mcp-as-distribution",
    icpScore: 55,
    anonymityFit: "video-required",
    status: "blocked",
  },

  // ─── Tier B, Niche AI/agents ─────────────────────────────────────────────
  {
    slug: "no-priors",
    name: "No Priors",
    host: "Sarah Guo & Elad Gil",
    focus: "ai-research",
    audienceTier: "S",
    contact: { twitterDM: "@saranormous", note: "Elad in Dream 100. Hard book." },
    url: "https://www.no-priors.com/",
    fitReason:
      "Sarah + Elad cover applied AI; agent-credits + free MCP is on-thesis.",
    leadTopicSlug: "agent-native-vc-tooling",
    icpScore: 70,
    anonymityFit: "video-required",
    status: "blocked",
  },
  {
    slug: "ml-podcast",
    name: "Gradient Dissent (Weights & Biases)",
    host: "Lukas Biewald",
    focus: "ai-eng",
    audienceTier: "B",
    contact: {
      email: "podcast@wandb.com",
      form: "https://wandb.ai/site/podcast",
    },
    url: "https://wandb.ai/site/podcast",
    fitReason:
      "W&B audience builds production ML; methodology angle + reproducibility appendix lands cleanly.",
    leadTopicSlug: "scaling-public-github-reads",
    icpScore: 72,
    anonymityFit: "voice-only",
    status: "ready",
  },
  {
    slug: "agentic-horizons",
    name: "Agentic Horizons",
    host: "Independent / rotating",
    focus: "ai-eng",
    audienceTier: "C",
    contact: { note: "Newer agent-focused podcast. Lower bar to entry, fits agent-credits angle." },
    url: "https://podcasts.apple.com/search?term=agentic",
    fitReason:
      "Niche agent-eco podcasts emerging in 2026. Warm-up reps: lower audience tier but synthetic-voice-friendly defaults.",
    leadTopicSlug: "agent-native-vc-tooling",
    icpScore: 60,
    anonymityFit: "synthetic-ok",
    status: "ready",
    note: "Use as warm-up reps for the synthetic-voice format before pitching Tier-S shows.",
  },

  // ─── Tier C, European angle ──────────────────────────────────────────────
  {
    slug: "20mins-vc-eu",
    name: "Twenty Minute VC, European GP slots",
    host: "Harry Stebbings (audio carve-outs)",
    focus: "vc",
    audienceTier: "B",
    contact: { form: "https://www.20vc.com/contact" },
    url: "https://www.20vc.com/",
    fitReason: "Harry sometimes books European angle as audio-only.",
    leadTopicSlug: "code-side-sourcing-as-category",
    icpScore: 65,
    anonymityFit: "voice-only",
    status: "ready",
  },
];

/**
 * Convenience filters for /podcasts page rendering.
 */
export function getActiveTargets() {
  return PODCAST_TARGETS.filter(
    (t) => t.status !== "blocked" && t.status !== "passed",
  );
}

export function getReadyTargets() {
  return PODCAST_TARGETS.filter((t) => t.status === "ready");
}

export function getBlockedTargets() {
  return PODCAST_TARGETS.filter((t) => t.status === "blocked");
}

export function getTargetBySlug(slug: string): PodcastTarget | undefined {
  return PODCAST_TARGETS.find((t) => t.slug === slug);
}

export function getTargetsCountByStatus(): Record<string, number> {
  return PODCAST_TARGETS.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}
