/**
 * The Data Nerd — character bible for the GitDealFlow social mascot.
 *
 * Anonymity rule (project memory, 2026-05-05): synthetic TTS, AI avatars,
 * and mascots are EXPLICITLY allowed. The founder's real face/voice/name
 * never appears. The Data Nerd is the canonical brand character that
 * fronts every social post, video, and audio segment — Twitter/X,
 * Instagram, Facebook, TikTok, LinkedIn, podcast.
 *
 * Used by:
 *   - /data-nerd                           hub page
 *   - /data-nerd/social                    social mascot directory
 *   - /api/v1/social-mascot.json           programmatic mirror
 *   - marketing/social-mascot-playbook.md  operator playbook
 *   - tools/video/scripts/06-channel-optimize.mjs (channel keywords)
 */

export const DATA_NERD = {
  // ── Identity ──────────────────────────────────────────────────
  name: "Data Nerd",
  handles: {
    twitter: "@data_nerd",
    instagram: "@gitdealflow.datanerd",
    facebook: "GitDealFlowDataNerd",
    tiktok: "@data_nerd_signals",
    linkedin: "GitDealFlow",
    youtube: "@gitdealflow",
    threads: "@gitdealflow.datanerd",
    bluesky: "@datanerd.gitdealflow.com",
    substack_notes: "@gitdealflow",
  },
  status: {
    twitter: "live",
    instagram: "reserved", // user creates handle when ready
    facebook: "reserved",
    tiktok: "reserved",
    linkedin: "live",
    youtube: "live",
    threads: "reserved",
    bluesky: "live",
    substack_notes: "live",
  },

  // ── Visual identity ───────────────────────────────────────────
  // Anonymous — no human face. Composed of:
  //   - Slate background (#0a0e1a, matches site dark theme)
  //   - Sky-400 (#38bdf8) accent for chart elements
  //   - Emerald-400 (#34d399) for positive signals
  //   - Mono font (Inter Mono) for numbers
  //   - Sans font (Inter) for prose
  // Avatar: an abstract "constellation" mark — 7 dots arranged like a
  //   star map, each dot one of the 7 atomic GitHub signals. Generated
  //   in Figma; SVG in /public/data-nerd-avatar.svg.
  visual: {
    avatarPath: "/data-nerd-avatar.svg",
    bgColor: "#0a0e1a",
    accentPrimary: "#38bdf8", // sky-400
    accentPositive: "#34d399", // emerald-400
    accentWarning: "#fbbf24", // amber-400
    accentNegative: "#f87171", // red-400
    fontMono: "ui-monospace, 'JetBrains Mono', 'Courier New', monospace",
    fontSans: "system-ui, -apple-system, sans-serif",
  },

  // ── Voice (synthetic) ─────────────────────────────────────────
  // Cartesia "Theo" voice for all spoken content. Calibrated emphasis
  // on technical terms, slow pace on numbers. ~$0.05/video.
  voice: {
    provider: "Cartesia",
    voiceName: "Theo",
    rate: 0.95,
    pitch: 0,
    style: "neutral-confident",
    pronunciationOverrides: [
      { from: "GitDealFlow", to: "git deal flow" },
      { from: "SSRN", to: "S S R N" },
      { from: "MCP", to: "M C P" },
      { from: "API", to: "A P I" },
      { from: "PR", to: "P R" },
      { from: "VC", to: "V C" },
      { from: "GP", to: "G P" },
      { from: "LP", to: "L P" },
    ],
  },

  // ── Tone of voice ─────────────────────────────────────────────
  tone: {
    primary: [
      "Direct — no filler, no jargon stack",
      "Numerate — every claim has a number behind it",
      "Self-deprecating about the framework, not the user",
      "Skeptical of consensus narratives",
      "Specific about edge cases — frameworks fail and we say where",
    ],
    avoid: [
      "Hype words: 'unlock', 'leverage', 'synergy', 'paradigm', 'disruptive'",
      "Empty enthusiasm: '!!!', 'amazing', 'incredible', 'mind-blowing'",
      "Authority cosplay: 'as a VC', 'in my experience', 'I've seen 100s of...'",
      "Vague metaphors: 'the future of', 'the next wave', 'unprecedented'",
      "Anything that requires the founder's identity to be credible",
    ],
    rules: [
      "Open with the number, not the conclusion. ('38% close-within-47-days' before 'this works'.)",
      "If you can't cite the data, drop the claim.",
      "When the framework fails, say so. Failure modes are credibility.",
      "Never use 'we' to mean 'the team' — 'we' is the framework + the data + the methodology paper.",
      "Founder ('I') stays anonymous. The mascot ('the framework' / 'the data') does the talking.",
    ],
  },

  // ── Content pillars ──────────────────────────────────────────
  // Every post fits one of five pillars. Keep ratios across a month.
  pillars: [
    {
      slug: "signal-of-the-week",
      label: "Signal of the Week",
      ratio: 0.30,
      description:
        "One named startup, one signal, one 30-second walkthrough. Always public-data only. Always with the GitHub URL.",
      example:
        "Signal of the week: ShadcnUI's 0.42 commit-velocity ratio. 14d ÷ 90d = 1.62. Above the 1.5 threshold for the third week running. github.com/shadcn-ui/ui — Insights → Pulse to verify.",
    },
    {
      slug: "framework-explainer",
      label: "Framework Explainer",
      ratio: 0.25,
      description:
        "Single-signal explainer with the 5-min procedure. Designed to be screenshotted/saved.",
      example:
        "How to read a dependents graph in 60 seconds: Insights → Dependency graph → Dependents. Most investors don't know this page exists. It's the cheapest external-adoption proxy.",
    },
    {
      slug: "data-point",
      label: "Data Point",
      ratio: 0.20,
      description:
        "One number from the panel. Always cited (SSRN id 6606558). Always with implication.",
      example:
        "Startups that closed had a contributor-diversity Gini of 0.34 at month -3. Startups that didn't: 0.61. The shape of the codebase matters more than the size of it.",
    },
    {
      slug: "calibration-case",
      label: "Calibration Case",
      ratio: 0.15,
      description:
        "Look back at a recently-funded startup. What did the framework say at month -3?",
      example:
        "Vercel's Series E announced 2026-04. Composite at month -3: 5/6. The only miss: dependents graph (no public OSS). Framework would have flagged this round before the headline.",
    },
    {
      slug: "operator-prompt",
      label: "Operator Prompt",
      ratio: 0.10,
      description:
        "Direct ask of the audience — 'try this on a startup you know'. Conversion-driving.",
      example:
        "Try the manual procedure on one startup you almost-invested in. Gut prediction first, then the score. Reply with the delta.",
    },
  ],

  // ── Posting cadence ──────────────────────────────────────────
  cadence: {
    twitter: "Daily — one Signal of the Week + one Data Point + one Operator Prompt across the day",
    linkedin: "3×/week — long-form Signal of the Week + one Calibration Case + one Framework Explainer",
    instagram:
      "3×/week — carousel format. Signal of the Week (Mon), Framework Explainer (Wed), Calibration Case (Fri)",
    facebook:
      "1×/week — repurpose the Wednesday Instagram carousel as a Facebook post with extended caption",
    tiktok:
      "1×/week — 60-second synthetic-voice walkthrough. Reuses the YouTube Short audio.",
    youtube_shorts:
      "1×/week (Wed) — Data Nerd Brief, character-shaped Short via existing tools/video pipeline",
    threads_bluesky:
      "Mirror of Twitter. Same content, posted via the existing Substack Notes + ATproto pipeline.",
  },

  // ── Brand artefacts published in the repo ────────────────────
  artefacts: {
    avatar_svg: "/data-nerd-avatar.svg",
    avatar_png_1024: "/data-nerd-avatar-1024.png",
    avatar_png_512: "/data-nerd-avatar-512.png",
    cover_image_2400x1260: "/data-nerd-cover.png",
    voice_sample_mp3: "/audio/data-nerd-voice-sample.mp3",
    style_guide_pdf: "/data-nerd-style-guide.pdf",
  },
} as const;

// ── Hashtag bank — used across IG/TikTok/LinkedIn ──────────────
export const HASHTAG_BANK = {
  primary: ["#GitDealFlow", "#DataNerd", "#CodeSideSourcing"],
  vertical: [
    "#VentureCapital",
    "#AngelInvesting",
    "#StartupSourcing",
    "#AlternativeData",
    "#DevTools",
  ],
  topical: [
    "#GitHubSignals",
    "#FundraisingSignals",
    "#OpenSource",
    "#TechStartups",
    "#FundManagement",
  ],
  reach: [
    "#startupinvesting",
    "#vcfunding",
    "#techinvestors",
    "#angelinvestor",
    "#deeptechvc",
    "#fundraising",
    "#startuplife",
    "#devtech",
  ],
} as const;

// ── Posting hours (UTC) ───────────────────────────────────────
// Calibrated for an investor + dev-tools audience: US East/West morning,
// EU afternoon. Avoids US sleeping window 02:00-09:00 UTC.
export const POSTING_HOURS_UTC = {
  twitter: ["13:00", "16:30", "19:00"], // 09 ET, 12:30 ET, 15 ET
  linkedin: ["13:00", "17:00"], // 09 ET, 13 ET (LinkedIn peaks at 1pm ET)
  instagram: ["18:00"], // 14 ET / 11 PT (IG is forgiving on time)
  facebook: ["14:00"], // 10 ET
  tiktok: ["19:00"], // 15 ET (TikTok evening US peak)
  threads_bluesky: ["13:00", "16:30"], // mirror Twitter slots
} as const;
