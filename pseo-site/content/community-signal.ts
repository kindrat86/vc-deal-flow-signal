/**
 * /community-signal, communities ranked by deal-flow yield.
 *
 * Cousin of /voices, indexed by *community type* instead of platform. /voices
 * answers "which 100 entries do I read on Reddit / HN / X?"; /community-signal
 * answers "which rooms, subreddits, Discords, Slacks, Discourse forums,
 * newsletter comment sections, produce the developer-investor and the
 * stealth-stage builder we end up funding?"
 *
 * Each entry is a public surface (a subreddit, a Discord invite, a forum URL,
 * a Discourse instance, a Slack workspace landing page). Anonymity rule
 * applies the same as everywhere else: we do not name individuals we track
 * inside the paid product. Listing a community ≠ listing its members.
 *
 * Yield tier semantics:
 *   - primary   : direct deal-flow surface. Multiple repos / founders we
 *                 currently surface have first publicly shown up here.
 *   - secondary : adjacent. Signals overlap, but we rarely cite a community
 *                 as a deal's first-mention surface.
 *   - ambient   : culture / reading list / tone calibration. Useful for
 *                 framing decks and trend essays, not for sourcing.
 *
 * Status code semantics mirror /voices/[platform]:
 *   - engage  : active engagement layer (we comment, post, or integrate)
 *   - watch   : monitoring only (we read the signal, do not post)
 *   - hold    : engagement paused (listed for transparency)
 *   - read    : read-only consumption (no engagement layer)
 *   - blocked : cannot engage (platform constraint, anonymity rule, policy)
 *
 * Last refreshed: 2026-05-22.
 */

export type YieldTier = "primary" | "secondary" | "ambient";

export type CommunityStatus =
  | "engage"
  | "watch"
  | "hold"
  | "read"
  | "blocked";

export type CommunityPlatform =
  | "reddit"
  | "discord"
  | "slack"
  | "discourse"
  | "newsletter"
  | "forum"
  | "github"
  | "twitter-list"
  | "other";

export interface Community {
  /** Display name (community handle / room name). */
  name: string;
  /** Public URL, homepage, invite, or landing. Omit if surface has no public link. */
  url?: string;
  /** Surface type, drives the platform badge on the page. */
  platform: CommunityPlatform;
  /** One-sentence "what we get from listening here". */
  what: string;
  /** Deal-flow yield tier (primary / secondary / ambient). */
  yield: YieldTier;
  /** Engagement status. */
  status: CommunityStatus;
  /** Optional context note, auto-mod rule, anonymity flag, throttling, etc. */
  note?: string;
}

export interface CommunityGroup {
  /** URL-safe slug, drives /community-signal/[slug]. */
  slug: string;
  /** Human label rendered in headings ("Indie founder forums"). */
  label: string;
  /** One-phrase archetype, who hangs out here. */
  archetype: string;
  /** Short tagline rendered in cards and OG. */
  tagline: string;
  /** 2-3 sentence intro on the page. */
  intro: string;
  /** Why this group ranks where it does, paragraph used in the yield section. */
  yieldStory: string;
  /** When and how we read it. */
  cadence: string;
  /** Engagement / anonymity caveat for this group. */
  caveat: string;
  /** Expected count, sanity check at build time. */
  expected: number;
  /** Roster, ordered by attention priority (top = most yield). */
  items: Community[];
}

export const YIELD_META: Record<
  YieldTier,
  { short: string; long: string; tone: string }
> = {
  primary: {
    short: "Primary",
    long: "Direct deal-flow surface. Multiple repos we surface first showed up here.",
    tone: "emerald",
  },
  secondary: {
    short: "Secondary",
    long: "Adjacent. Signals overlap, but rarely the first-mention surface.",
    tone: "sky",
  },
  ambient: {
    short: "Ambient",
    long: "Culture / reading list. Useful for framing, not for sourcing.",
    tone: "slate",
  },
};

export const COMMUNITY_STATUS_META: Record<
  CommunityStatus,
  { short: string; long: string; tone: string }
> = {
  engage: {
    short: "Engage",
    long: "Active engagement layer, we comment, post, or integrate.",
    tone: "emerald",
  },
  watch: {
    short: "Watch",
    long: "Monitoring only, we read the signal, do not post.",
    tone: "sky",
  },
  hold: {
    short: "Hold",
    long: "Engagement paused. Listed for transparency.",
    tone: "amber",
  },
  read: {
    short: "Read",
    long: "Read-only consumption. No engagement layer.",
    tone: "slate",
  },
  blocked: {
    short: "Blocked",
    long: "Cannot engage, platform constraint, anonymity rule, or policy.",
    tone: "rose",
  },
};

export const PLATFORM_META: Record<
  CommunityPlatform,
  { short: string; long: string }
> = {
  reddit: { short: "Reddit", long: "Subreddit" },
  discord: { short: "Discord", long: "Discord server" },
  slack: { short: "Slack", long: "Slack workspace" },
  discourse: { short: "Discourse", long: "Discourse forum" },
  newsletter: { short: "Newsletter", long: "Newsletter / comment section" },
  forum: { short: "Forum", long: "Web forum" },
  github: { short: "GitHub", long: "GitHub Discussions" },
  "twitter-list": { short: "X List", long: "Twitter / X list" },
  other: { short: "Other", long: "Other surface" },
};

// ────────────────────────────────────────────────────────────────────────────
// 1. INDIE FOUNDER FORUMS, bootstrapper economics, build-in-public crowd
// ────────────────────────────────────────────────────────────────────────────

const INDIE_FOUNDER_FORUMS: Community[] = [
  { name: "IndieHackers.com", url: "https://www.indiehackers.com", platform: "forum", what: "Bootstrapper economics, different ladder, same dataset.", yield: "primary", status: "engage" },
  { name: "r/IndieHackers", url: "https://reddit.com/r/IndieHackers", platform: "reddit", what: "Mirror of the IH forum on Reddit. Slightly noisier, faster.", yield: "primary", status: "engage" },
  { name: "r/SideProject", url: "https://reddit.com/r/SideProject", platform: "reddit", what: "Hobby-build to startup pipeline. Earliest GitHub-trending signal.", yield: "primary", status: "watch" },
  { name: "r/microsaas", url: "https://reddit.com/r/microsaas", platform: "reddit", what: "Niche SaaS founder audience. One-person commercial repos.", yield: "secondary", status: "read" },
  { name: "WIP.co", url: "https://wip.co", platform: "forum", what: "Daily-streak ship logs. Patterns we use to detect a repo turning commercial.", yield: "secondary", status: "watch" },
  { name: "ProductHunt Makers", url: "https://www.producthunt.com/makers", platform: "forum", what: "Pre-launch builder community. Repo-to-launch lead time.", yield: "primary", status: "watch" },
  { name: "MakerLog", url: "https://getmakerlog.com", platform: "forum", what: "Build-log community. Ambient signal on ship cadence.", yield: "ambient", status: "read" },
  { name: "r/Entrepreneur", url: "https://reddit.com/r/Entrepreneur", platform: "reddit", what: "Generalist founder community. Comment-only on data-driven threads.", yield: "secondary", status: "read" },
  { name: "r/EntrepreneurRideAlong", url: "https://reddit.com/r/EntrepreneurRideAlong", platform: "reddit", what: "Build-in-public threads. Useful avatar reads.", yield: "secondary", status: "watch" },
  { name: "MicroConf Connect", url: "https://microconfconnect.com", platform: "slack", what: "Bootstrapped SaaS Slack. Mostly paid-customer side, but quiet.", yield: "ambient", status: "read" },
  { name: "Tiny.fyi (Hustle Fund)", url: "https://www.tinyseed.com", platform: "newsletter", what: "Tiny Seed-adjacent reading list for bootstrapper-to-fund-able transition.", yield: "ambient", status: "read" },
  { name: "Build in Public (X)", url: "https://twitter.com/search?q=%23buildinpublic", platform: "twitter-list", what: "Cross-platform hashtag firehose. Lower precision, useful for tone.", yield: "secondary", status: "watch" },
];

// ────────────────────────────────────────────────────────────────────────────
// 2. AI BUILDER ROOMS, agent / model / infra builder communities
// ────────────────────────────────────────────────────────────────────────────

const AI_BUILDER_ROOMS: Community[] = [
  { name: "LangChain Discord", url: "https://discord.gg/langchain", platform: "discord", what: "Agent framework community. First-look at agent-startup repos.", yield: "primary", status: "watch" },
  { name: "Hugging Face Discord", url: "https://discord.gg/hugging-face-879548962464493619", platform: "discord", what: "Open-model ecosystem. Model-release-to-startup lead time.", yield: "primary", status: "watch" },
  { name: "LlamaIndex Discord", url: "https://discord.gg/llamaindex", platform: "discord", what: "RAG-stack builder community. Vertical-AI repo signal.", yield: "primary", status: "watch" },
  { name: "Latent Space Discord", url: "https://www.latent.space", platform: "discord", what: "AI-engineer community attached to the podcast. High signal-to-noise.", yield: "primary", status: "watch" },
  { name: "AI Engineer Slack", url: "https://www.ai.engineer", platform: "slack", what: "Production-AI engineer community. Where infra companies recruit.", yield: "primary", status: "watch" },
  { name: "r/LocalLLaMA", url: "https://reddit.com/r/LocalLLaMA", platform: "reddit", what: "On-device-AI infrastructure. Engineering-first audience.", yield: "primary", status: "engage" },
  { name: "EleutherAI Discord", url: "https://discord.gg/eleutherai", platform: "discord", what: "Research-adjacent open-source ML. Watch for spin-out repos.", yield: "primary", status: "read" },
  { name: "Modal Labs Discord", url: "https://modal.com/slack", platform: "discord", what: "Serverless-GPU users. Often early adopters from yet-to-launch AI orgs.", yield: "secondary", status: "watch" },
  { name: "r/LangChain", url: "https://reddit.com/r/LangChain", platform: "reddit", what: "Builder Q&A. Slower than Discord but indexable.", yield: "secondary", status: "watch" },
  { name: "r/PromptEngineering", url: "https://reddit.com/r/PromptEngineering", platform: "reddit", what: "Prompt-as-craft community. Useful for trend detection.", yield: "secondary", status: "read" },
  { name: "MLOps Community Slack", url: "https://mlops.community", platform: "slack", what: "Production-ML practitioners. Crossover with deal-flow targets.", yield: "primary", status: "watch" },
  { name: "Weights & Biases Discord", url: "https://wandb.me/discord", platform: "discord", what: "Experiment-tracking customers. Adjacent to research-to-product flips.", yield: "secondary", status: "watch" },
];

// ────────────────────────────────────────────────────────────────────────────
// 3. DEVTOOLS MAKER ROOMS, framework + runtime + IDE communities
// ────────────────────────────────────────────────────────────────────────────

const DEVTOOLS_MAKER_ROOMS: Community[] = [
  { name: "Vercel Community", url: "https://vercel.community", platform: "discord", what: "Next.js orbit + adjacent infra-on-Vercel orgs. Top deal-flow surface.", yield: "primary", status: "watch" },
  { name: "Cursor Community", url: "https://forum.cursor.com", platform: "forum", what: "AI-IDE user community. Vibe-coders building inside.", yield: "primary", status: "watch" },
  { name: "Bun Discord", url: "https://bun.sh/discord", platform: "discord", what: "JS-runtime community. Tooling-on-Bun startups surface here first.", yield: "primary", status: "watch" },
  { name: "Astro Discord", url: "https://astro.build/chat", platform: "discord", what: "Content-site framework. Adjacent media-and-publishing infra.", yield: "secondary", status: "watch" },
  { name: "Supabase Discord", url: "https://discord.supabase.com", platform: "discord", what: "Backend-as-a-service customers. High overlap with seed-stage SaaS.", yield: "primary", status: "watch" },
  { name: "Cloudflare Developers Discord", url: "https://discord.cloudflare.com", platform: "discord", what: "Edge / Workers / R2 / D1 builders. Infra-on-edge orgs.", yield: "secondary", status: "watch" },
  { name: "Resend Discord", url: "https://discord.gg/resend", platform: "discord", what: "Transactional-email customers. SaaS go-to-market overlap.", yield: "secondary", status: "watch" },
  { name: "Deno Discord", url: "https://discord.gg/deno", platform: "discord", what: "Alt-JS runtime + Deploy customers. Niche but high-signal.", yield: "secondary", status: "watch" },
  { name: "Tauri Discord", url: "https://discord.com/invite/tauri", platform: "discord", what: "Rust-desktop-app community. Single-binary-SaaS pattern.", yield: "secondary", status: "watch" },
  { name: "Zed Discord", url: "https://zed.dev/community-links", platform: "discord", what: "Modern-editor users. Adjacent to AI-IDE attention map.", yield: "primary", status: "watch" },
  { name: "Lovable Discord", url: "https://lovable.dev/community", platform: "discord", what: "Vibe-coding startup community. Generated-product crowd.", yield: "primary", status: "watch" },
  { name: "Vite Discord", url: "https://chat.vite.dev", platform: "discord", what: "Build-tool community. Frontend-tooling org signal.", yield: "secondary", status: "watch" },
];

// ────────────────────────────────────────────────────────────────────────────
// 4. VC & ANGEL FORUMS, capital-side rooms
// ────────────────────────────────────────────────────────────────────────────

const VC_AND_ANGEL_FORUMS: Community[] = [
  { name: "r/venturecapital", url: "https://reddit.com/r/venturecapital", platform: "reddit", what: "VC-side reality. Comment-only, auto-mod removes any post that names a product.", yield: "primary", status: "engage", note: "Comments-only. Hero posts auto-removed." },
  { name: "r/AngelInvesting", url: "https://reddit.com/r/AngelInvesting", platform: "reddit", what: "Angel-side avatar. Developer-investor lives here.", yield: "primary", status: "engage" },
  { name: "r/startups", url: "https://reddit.com/r/startups", platform: "reddit", what: "General founder community. We engage on data-question threads.", yield: "secondary", status: "engage" },
  { name: "AngelList Syndicate threads", url: "https://www.angellist.com/syndicates", platform: "forum", what: "Syndicate-deal comment sections. Sentiment signal on hot deals.", yield: "secondary", status: "read" },
  { name: "Hustle Fund (Camp List, etc.)", url: "https://www.hustlefund.vc", platform: "newsletter", what: "Pre-seed-side reading list. Adjacent angel-investor avatar.", yield: "ambient", status: "read" },
  { name: "Stratechery", url: "https://stratechery.com", platform: "newsletter", what: "Strategic-frame reference. Used in trend essays, not sourcing.", yield: "ambient", status: "read" },
  { name: "This Week in Startups", url: "https://thisweekinstartups.com", platform: "forum", what: "Podcast-attached community. Mass-market VC tone.", yield: "ambient", status: "read" },
  { name: "OnDeck (public)", url: "https://www.beondeck.com", platform: "forum", what: "Founder-fellowship public surfaces. Members-only side is paywalled.", yield: "secondary", status: "read" },
  { name: "r/PrivateEquity", url: "https://reddit.com/r/PrivateEquity", platform: "reddit", what: "PE-side audience. Adjacent buyer archetype.", yield: "ambient", status: "read" },
  { name: "VC Twitter (X list)", url: "https://twitter.com/i/lists/1252830840762122240", platform: "twitter-list", what: "Public VC-list firehose. Watch for thesis flips before they hit memos.", yield: "primary", status: "watch" },
  { name: "Acquire.com community", url: "https://acquire.com", platform: "forum", what: "Bootstrapper-acquisition listings. Adjacent buyer pool.", yield: "secondary", status: "watch" },
  { name: "MicroAcquire forum (legacy)", url: "https://acquire.com/blog", platform: "forum", what: "Legacy MicroAcquire write-ups. Pattern-memory source.", yield: "ambient", status: "read" },
];

// ────────────────────────────────────────────────────────────────────────────
// 5. B2B SAAS OPERATOR GROUPS, go-to-market + ops crowd
// ────────────────────────────────────────────────────────────────────────────

const B2B_SAAS_OPERATOR_GROUPS: Community[] = [
  { name: "r/SaaS", url: "https://reddit.com/r/SaaS", platform: "reddit", what: "SaaS founder reality. Pricing, ARR, churn threads convert to dashboard interest.", yield: "primary", status: "engage" },
  { name: "RevOps Co-op", url: "https://www.revopscoop.com", platform: "slack", what: "Revenue-ops community. Buyer-archetype crossover.", yield: "primary", status: "read" },
  { name: "ProductLed Community", url: "https://community.productled.com", platform: "forum", what: "PLG go-to-market builders. Adjacent buyer pool.", yield: "primary", status: "watch" },
  { name: "SaaStr Slack (community page)", url: "https://www.saastr.com/community", platform: "slack", what: "SaaS-conf-attached community. Brand-heavy, mid signal.", yield: "secondary", status: "read" },
  { name: "Sales Hacker", url: "https://www.saleshacker.com", platform: "forum", what: "Sales-side practitioner community. GTM-pattern memory.", yield: "secondary", status: "read" },
  { name: "Pavilion (public surfaces)", url: "https://www.joinpavilion.com", platform: "forum", what: "GTM-exec community. Private Slack; public site is the only handle.", yield: "secondary", status: "blocked", note: "Paid + members-only. Public site listed for transparency." },
  { name: "DemandCurve community", url: "https://www.demandcurve.com", platform: "newsletter", what: "Growth-marketing reading list. Bootstrapper-to-fund transition trend.", yield: "secondary", status: "read" },
  { name: "r/Sales", url: "https://reddit.com/r/sales", platform: "reddit", what: "Generalist sales audience. Ambient tone signal.", yield: "ambient", status: "read" },
  { name: "r/Entrepreneur", url: "https://reddit.com/r/Entrepreneur", platform: "reddit", what: "Mass-market founder community. Cross-listed with /indie-founder-forums.", yield: "ambient", status: "read" },
  { name: "First 1000 (newsletter)", url: "https://www.firstthousand.co", platform: "newsletter", what: "Early-traction case studies. Pattern-memory source for GTM stories.", yield: "ambient", status: "read" },
  { name: "Modern Sales Pros Slack", url: "https://modernsalespros.com", platform: "slack", what: "Enterprise-sales practitioner Slack. Adjacent buyer archetype.", yield: "ambient", status: "read" },
  { name: "ProductHunt Discussion forums", url: "https://www.producthunt.com/discussions", platform: "forum", what: "Launch-day conversation surface. Post-launch traction signal.", yield: "secondary", status: "watch" },
];

// ────────────────────────────────────────────────────────────────────────────
// 6. OPEN-SOURCE MAINTAINER SPACES, repo, foundation, sustainability
// ────────────────────────────────────────────────────────────────────────────

const OSS_MAINTAINER_SPACES: Community[] = [
  { name: "GitHub Discussions (per-repo)", url: "https://docs.github.com/en/discussions", platform: "github", what: "Repo-attached discussion surface. Often the first 'we're going commercial' hint.", yield: "primary", status: "watch" },
  { name: "CNCF Slack", url: "https://slack.cncf.io", platform: "slack", what: "Cloud-native foundation community. Infra-grade deal-flow.", yield: "primary", status: "watch" },
  { name: "LF AI & Data Slack", url: "https://lfaidata.foundation", platform: "slack", what: "Linux Foundation AI / Data sub-foundation. Foundation-pattern repos.", yield: "primary", status: "watch" },
  { name: "Sustain OSS Discourse", url: "https://discourse.sustainoss.org", platform: "discourse", what: "OSS-sustainability discussion. Maintainer-burnout to commercial flip.", yield: "primary", status: "read" },
  { name: "Open Collective Slack", url: "https://opencollective.com", platform: "slack", what: "OSS-funding community. Watch for transition-to-company patterns.", yield: "secondary", status: "read" },
  { name: "r/opensource", url: "https://reddit.com/r/opensource", platform: "reddit", what: "Maintainership audience.", yield: "secondary", status: "watch" },
  { name: "r/programming", url: "https://reddit.com/r/programming", platform: "reddit", what: "Default tech-news firehose. Slow-engage, high-attention.", yield: "secondary", status: "watch" },
  { name: "Apache mailing lists", url: "https://www.apache.org/foundation/mailinglists.html", platform: "other", what: "ASF dev / user lists. Foundation-grade infra signal.", yield: "ambient", status: "read" },
  { name: "Hacktoberfest Discord", url: "https://hacktoberfest.com", platform: "discord", what: "Maintainer-meets-contributor event. Ambient annual signal.", yield: "ambient", status: "read" },
  { name: "crates.io Discord (Rust)", url: "https://www.rust-lang.org/community", platform: "discord", what: "Rust-package community. Systems-infra startup signal.", yield: "secondary", status: "watch" },
  { name: "npm Community Forum", url: "https://github.com/orgs/community/discussions/categories/code-to-cloud-npm", platform: "github", what: "Package-ecosystem discussion. Adoption signal.", yield: "secondary", status: "watch" },
  { name: "Maintainer Month (GitHub)", url: "https://maintainermonth.github.com", platform: "github", what: "Annual maintainer-spotlight surface. Pattern memory.", yield: "ambient", status: "read" },
];

// ────────────────────────────────────────────────────────────────────────────
// 7. INFRA & PLATFORM ENGINEERING CIRCLES, k8s, sre, devops, platform-eng
// ────────────────────────────────────────────────────────────────────────────

const INFRA_PLATFORM_ENG_CIRCLES: Community[] = [
  { name: "Kubernetes Slack", url: "https://slack.k8s.io", platform: "slack", what: "K8s-project community. Cloud-native infra deal-flow.", yield: "primary", status: "watch" },
  { name: "Platform Engineering community", url: "https://platformengineering.org", platform: "slack", what: "Platform-team practitioners. Buyer-archetype + builder archetype overlap.", yield: "primary", status: "watch" },
  { name: "r/devops", url: "https://reddit.com/r/devops", platform: "reddit", what: "Infrastructure-as-code, observability, platform engineering.", yield: "primary", status: "watch" },
  { name: "r/kubernetes", url: "https://reddit.com/r/kubernetes", platform: "reddit", what: "K8s practitioner audience.", yield: "secondary", status: "watch" },
  { name: "r/sre", url: "https://reddit.com/r/sre", platform: "reddit", what: "Reliability-engineering audience. High-overlap with observability orgs.", yield: "primary", status: "watch" },
  { name: "HashiCorp Discuss", url: "https://discuss.hashicorp.com", platform: "discourse", what: "HashiCorp-tooling discussion. Infra-OSS pattern memory.", yield: "secondary", status: "read" },
  { name: "DevOpsDays community", url: "https://devopsdays.org", platform: "forum", what: "Conference-attached community. Ambient ops-culture signal.", yield: "ambient", status: "read" },
  { name: "CNCF Slack", url: "https://slack.cncf.io", platform: "slack", what: "Cloud-native foundation Slack, listed again here for infra-eng angle.", yield: "primary", status: "watch" },
  { name: "Reliability Engineering Slack", url: "https://www.reliabilityengineering.community", platform: "slack", what: "Reliability-eng practitioner Slack. SRE-buyer crossover.", yield: "secondary", status: "watch" },
  { name: "DataDog Community", url: "https://www.datadoghq.com/community", platform: "forum", what: "Observability-customer community. Adjacent buyer pool.", yield: "secondary", status: "read" },
  { name: "r/aws", url: "https://reddit.com/r/aws", platform: "reddit", what: "AWS-customer audience. Cross-confirms cloud-native bets.", yield: "ambient", status: "read" },
  { name: "Honeycomb Pollinators", url: "https://www.honeycomb.io/community", platform: "slack", what: "Honeycomb-customer observability community. Niche but high-signal.", yield: "ambient", status: "read" },
];

// ────────────────────────────────────────────────────────────────────────────
// 8. FRONTEND & PRODUCT BUILDER ROOMS, UI, design system, web framework
// ────────────────────────────────────────────────────────────────────────────

const FRONTEND_PRODUCT_BUILDER_ROOMS: Community[] = [
  { name: "Next.js Discord", url: "https://nextjs.org/discord", platform: "discord", what: "Next.js community. Vercel-orbit orgs surface here first.", yield: "primary", status: "watch" },
  { name: "Reactiflux Discord", url: "https://www.reactiflux.com", platform: "discord", what: "React-community Discord. Broad frontend-org signal.", yield: "primary", status: "watch" },
  { name: "Tailwind CSS Discord", url: "https://tailwindcss.com/discord", platform: "discord", what: "Tailwind-ecosystem community. Component-lib-to-startup pipeline.", yield: "primary", status: "watch" },
  { name: "shadcn/ui community (GitHub)", url: "https://github.com/shadcn-ui/ui/discussions", platform: "github", what: "shadcn/ui Discussions. UI-primitive adoption signal.", yield: "primary", status: "watch" },
  { name: "Svelte Discord", url: "https://svelte.dev/chat", platform: "discord", what: "Svelte / SvelteKit community.", yield: "secondary", status: "watch" },
  { name: "Vue.js Discord", url: "https://chat.vuejs.org", platform: "discord", what: "Vue / Nuxt community. Adjacent frontend org signal.", yield: "secondary", status: "watch" },
  { name: "Mantine Discord", url: "https://discord.gg/wbH82zuWMN", platform: "discord", what: "Mantine UI-kit community. Niche component-lib signal.", yield: "secondary", status: "watch" },
  { name: "Figma Friends Slack", url: "https://friends.figma.com", platform: "slack", what: "Figma-power-user / community Slack. Designer crossover.", yield: "ambient", status: "read" },
  { name: "Designer Hangout Slack", url: "https://www.designerhangout.co", platform: "slack", what: "Design-practitioner Slack. Ambient design-side signal.", yield: "ambient", status: "read" },
  { name: "r/reactjs", url: "https://reddit.com/r/reactjs", platform: "reddit", what: "React community, half of our dataset's frontend orgs land here.", yield: "secondary", status: "watch" },
  { name: "r/nextjs", url: "https://reddit.com/r/nextjs", platform: "reddit", what: "Next.js community. Vercel-orbit orgs surface here first.", yield: "primary", status: "watch" },
  { name: "r/webdev", url: "https://reddit.com/r/webdev", platform: "reddit", what: "Frontend-leaning practitioner audience.", yield: "secondary", status: "read" },
];

// ────────────────────────────────────────────────────────────────────────────
// 9. DATA & ML ENGINEERING COLLECTIVES, pipelines, warehouses, ML eng
// ────────────────────────────────────────────────────────────────────────────

const DATA_AND_ML_ENG_COLLECTIVES: Community[] = [
  { name: "dbt Community Slack", url: "https://www.getdbt.com/community/join-the-community", platform: "slack", what: "dbt-practitioner Slack. Modern-data-stack adoption signal.", yield: "primary", status: "watch" },
  { name: "MLOps Community Slack", url: "https://mlops.community", platform: "slack", what: "Production-ML practitioners. Crossover with AI-builder rooms.", yield: "primary", status: "watch" },
  { name: "r/dataengineering", url: "https://reddit.com/r/dataengineering", platform: "reddit", what: "Data-platform stack threads. High GitHub-org overlap.", yield: "primary", status: "watch" },
  { name: "r/MachineLearning", url: "https://reddit.com/r/MachineLearning", platform: "reddit", what: "Where ML papers and infrastructure orgs first surface.", yield: "primary", status: "watch" },
  { name: "DataTalks.Club Slack", url: "https://datatalks.club", platform: "slack", what: "Data-eng practitioner Slack. Cohort-of-engineers signal.", yield: "primary", status: "read" },
  { name: "Locally Optimistic Slack", url: "https://locallyoptimistic.com", platform: "slack", what: "Analytics-practitioner Slack. Niche but high-signal-density.", yield: "secondary", status: "read" },
  { name: "Snowflake DataSuperheroes", url: "https://www.snowflake.com/data-superheroes", platform: "forum", what: "Snowflake-power-user community. Adjacent buyer pool.", yield: "ambient", status: "read" },
  { name: "Hex Community", url: "https://learn.hex.tech/docs/welcome-to-hex/community", platform: "forum", what: "Hex-customer notebook community.", yield: "secondary", status: "read" },
  { name: "r/datascience", url: "https://reddit.com/r/datascience", platform: "reddit", what: "Data-science practitioner audience.", yield: "secondary", status: "watch" },
  { name: "Weights & Biases Discord", url: "https://wandb.me/discord", platform: "discord", what: "Experiment-tracking customers. Research-to-product flips.", yield: "secondary", status: "watch" },
  { name: "Hugging Face Forum", url: "https://discuss.huggingface.co", platform: "discourse", what: "HF discussion forum. Long-tail of model-product transitions.", yield: "secondary", status: "watch" },
  { name: "Modern Data Stack (forum)", url: "https://www.moderndatastack.xyz", platform: "forum", what: "MDS vendor + buyer crossover surface.", yield: "primary", status: "watch" },
];

// ────────────────────────────────────────────────────────────────────────────
// 10. FOUNDER-NEWSLETTER COMMENT SECTIONS, analyst-led reading rooms
// ────────────────────────────────────────────────────────────────────────────

const FOUNDER_NEWSLETTER_COMMENT_SECTIONS: Community[] = [
  { name: "Lenny's Newsletter (comments)", url: "https://www.lennysnewsletter.com", platform: "newsletter", what: "PM-leaning, top engagement-density comment section in the genre.", yield: "primary", status: "watch" },
  { name: "Latent Space", url: "https://www.latent.space", platform: "newsletter", what: "AI-engineer newsletter + Discord. Crossover with /ai-builder-rooms.", yield: "primary", status: "watch" },
  { name: "The Pragmatic Engineer (comments)", url: "https://www.pragmaticengineer.com", platform: "newsletter", what: "Senior-engineer-leaning. Org-shape signal for stealth-stage repos.", yield: "secondary", status: "watch" },
  { name: "Trends.vc community", url: "https://trends.vc", platform: "newsletter", what: "Trend-report newsletter. Useful for thesis-flip detection.", yield: "primary", status: "watch" },
  { name: "Not Boring", url: "https://www.notboring.co", platform: "newsletter", what: "Narrative-essay newsletter. Ambient framing source.", yield: "ambient", status: "read" },
  { name: "The Generalist", url: "https://www.generalist.com", platform: "newsletter", what: "Long-form analyst newsletter. Reading-list source.", yield: "secondary", status: "read" },
  { name: "Stratechery", url: "https://stratechery.com", platform: "newsletter", what: "Strategic-frame reference. Used in essays, not sourcing.", yield: "ambient", status: "read" },
  { name: "The Diff", url: "https://www.thediff.co", platform: "newsletter", what: "Finance-leaning tech analyst. Reading-list source.", yield: "secondary", status: "read" },
  { name: "Software Engineering Daily", url: "https://softwareengineeringdaily.com", platform: "newsletter", what: "Engineering-podcast community. Ambient signal.", yield: "ambient", status: "read" },
  { name: "TLDR newsletter", url: "https://tldr.tech", platform: "newsletter", what: "Daily-summary newsletter. Mass-market tech tone.", yield: "ambient", status: "read" },
  { name: "Bytes (JS) newsletter", url: "https://bytes.dev", platform: "newsletter", what: "JS-ecosystem newsletter. Adoption signal for frontend tooling.", yield: "secondary", status: "read" },
  { name: "Greg Isenberg ecosystem (newsletters)", url: "https://www.gregisenberg.com", platform: "newsletter", what: "Internet-culture / community-led-business reading list. Indie-builder framing source.", yield: "secondary", status: "read" },
];

// ────────────────────────────────────────────────────────────────────────────

export const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    slug: "indie-founder-forums",
    label: "Indie founder forums",
    archetype: "Bootstrappers, build-in-public crowd, micro-SaaS operators",
    tagline:
      "Bootstrapped, indie, build-in-public, the rooms where a repo first leaks a commercial plan.",
    intro:
      "Founder-side rooms whose median citizen runs a one-to-three-person commercial repo. These are not VC rooms. We read them for the inverse signal, a maintainer announcing pricing, hiring a second engineer, or moving a side project into a workdays-only cadence.",
    yieldStory:
      "Primary surfaces are the IndieHackers forum, r/SideProject, and the ProductHunt makers stream, three places where bootstrappers most often telegraph a transition to a fundable shape. Secondary rooms (WIP, MakerLog, r/microsaas) provide tone but rarely first-mention signal.",
    cadence:
      "Weekly read on Mondays. Active engagement is comment-only on data-question threads.",
    caveat:
      "Anonymity rule applies: we do not name individual founders we surface. Community URLs are public; member rosters are not.",
    expected: 12,
    items: INDIE_FOUNDER_FORUMS,
  },
  {
    slug: "ai-builder-rooms",
    label: "AI builder rooms",
    archetype: "Agent, model, and inference-infra builders",
    tagline:
      "LangChain, HF, Latent Space, MLOps, where the next AI-infra repo gets its first 100 users.",
    intro:
      "Builder-side rooms attached to the agent, model, and inference-infra stacks. These rooms front-run the public GitHub-trending feed by ~2-6 weeks on infra-grade tools and by ~1-2 days on vertical-AI apps.",
    yieldStory:
      "Primary surfaces are LangChain Discord, HF Discord, Latent Space, MLOps Community Slack, and r/LocalLLaMA, five rooms that account for the first public mention of a meaningful share of the AI infra repos we surface inside the product.",
    cadence:
      "Daily read on three of these; weekly read on the rest. Comment-only on technical threads. No product mentions until a maintainer asks.",
    caveat:
      "AI rooms move fast and reward repetition. We avoid posting from any single account more than once per surface per week.",
    expected: 12,
    items: AI_BUILDER_ROOMS,
  },
  {
    slug: "devtools-maker-rooms",
    label: "Devtools maker rooms",
    archetype: "Framework, runtime, and IDE customers / contributors",
    tagline:
      "Vercel, Cursor, Bun, Supabase, Astro, the rooms where infra-on-infra repos surface.",
    intro:
      "Framework-, runtime-, and IDE-attached communities. The audience is half-builders, half-customers, same people, different hat. Repos that build on top of these stacks usually leak a launch plan inside the host community first.",
    yieldStory:
      "Primary surfaces are Vercel Community, Cursor forum, Bun Discord, Supabase Discord, Zed Discord, and Lovable Discord, six rooms where vibe-coding-era startups currently break first.",
    cadence:
      "Weekly read on the primary five. Watch-only on the rest.",
    caveat:
      "These rooms are heavily moderated against self-promotion. Engagement is reactive only, we never post a hero thread.",
    expected: 12,
    items: DEVTOOLS_MAKER_ROOMS,
  },
  {
    slug: "vc-and-angel-forums",
    label: "VC and angel forums",
    archetype: "Capital-side rooms, VCs, angels, scout networks",
    tagline:
      "Where the buy-side discusses what it just saw. Inverse signal of /devtools-maker-rooms.",
    intro:
      "Capital-side rooms. These rarely produce a first-mention signal (deals are not announced here), but they are the surface where thesis flips and sector rotations show up before they hit memos.",
    yieldStory:
      "Primary surface is the public VC Twitter / X list, plus r/venturecapital and r/AngelInvesting as the only large public capital-side rooms left. The rest are reading-list sources for framing.",
    cadence:
      "Daily read on VC Twitter, weekly on the rest. Comments-only on r/venturecapital (any post that names a product is auto-removed).",
    caveat:
      "Capital-side rooms are dense with anonymity violations. We strictly do not name individual investors we engage with or are tracking.",
    expected: 12,
    items: VC_AND_ANGEL_FORUMS,
  },
  {
    slug: "b2b-saas-operator-groups",
    label: "B2B SaaS operator groups",
    archetype: "GTM, RevOps, PLG, sales, the operator-side rooms",
    tagline:
      "r/SaaS, RevOps Co-op, ProductLed, where SaaS GTM patterns leak first.",
    intro:
      "GTM-side rooms. The audience here is half-buyer, half-builder. We read these for the second-derivative signal, a repo's commercial plan, pricing experiments, and PLG-vs-sales-led inflection.",
    yieldStory:
      "Primary surfaces are r/SaaS, RevOps Co-op, ProductLed Community, and ProductHunt Discussion forums, four rooms where SaaS operator patterns leak earliest. The rest are read-only.",
    cadence:
      "Weekly read on the primary surfaces, monthly on the rest.",
    caveat:
      "Some rooms (Pavilion, Operator Collective) are paid + private. Listed for transparency; engagement is blocked by the anonymity rule.",
    expected: 12,
    items: B2B_SAAS_OPERATOR_GROUPS,
  },
  {
    slug: "open-source-maintainer-spaces",
    label: "Open-source maintainer spaces",
    archetype: "Maintainers, foundation-grade infra contributors",
    tagline:
      "GitHub Discussions, CNCF Slack, Sustain OSS, where 'we're going commercial' leaks earliest.",
    intro:
      "Maintainer-side rooms. The high-yield pattern here is the maintainer-to-company transition, a project's GitHub Discussions or a foundation's Slack often carry the earliest public signal that a repo is leaving the foundation orbit for a company.",
    yieldStory:
      "Primary surfaces are GitHub Discussions (per-repo), CNCF Slack, LF AI & Data Slack, and Sustain OSS Discourse, four surfaces where the OSS-to-company flip telegraphs ~3-6 weeks before a press announcement.",
    cadence:
      "Weekly read on the four primary surfaces; ambient consumption of the rest via aggregator.",
    caveat:
      "Foundation-grade rooms are governance-sensitive, we read, we do not engage on roadmap or sustainability threads.",
    expected: 12,
    items: OSS_MAINTAINER_SPACES,
  },
  {
    slug: "infra-and-platform-eng-circles",
    label: "Infra and platform-engineering circles",
    archetype: "K8s, SRE, devops, platform-team practitioners",
    tagline:
      "K8s Slack, Platform Engineering, r/sre, buyer + builder at the same table.",
    intro:
      "Platform-engineering and infra-ops rooms. The audience is overwhelmingly buyers, but they are also the early-adopter user base for the infra-grade tools we surface inside the product.",
    yieldStory:
      "Primary surfaces are Kubernetes Slack, Platform Engineering community, r/devops, and r/sre, four rooms whose membership shows the highest crossover with infra-grade GitHub orgs we surface.",
    cadence:
      "Weekly read on the four primary surfaces.",
    caveat:
      "Platform-eng rooms reward operational precision and punish marketing language. Engagement is technical Q&A only.",
    expected: 12,
    items: INFRA_PLATFORM_ENG_CIRCLES,
  },
  {
    slug: "frontend-and-product-builder-rooms",
    label: "Frontend and product-builder rooms",
    archetype: "UI, design system, web framework practitioners",
    tagline:
      "Next.js Discord, Reactiflux, Tailwind, shadcn/ui, the surface where frontend-org repos surface first.",
    intro:
      "Frontend-framework and design-system rooms. Half our dataset's frontend-org repos surface here before they hit GitHub trending. This is the highest first-mention density among non-AI builder rooms.",
    yieldStory:
      "Primary surfaces are Next.js Discord, Reactiflux, Tailwind Discord, and shadcn/ui Discussions, four rooms with the highest first-mention density for frontend-org repos.",
    cadence:
      "Weekly read on the four primary surfaces.",
    caveat:
      "Frontend rooms are heavily moderated against link-drops. Engagement is reactive (technical Q&A) only.",
    expected: 12,
    items: FRONTEND_PRODUCT_BUILDER_ROOMS,
  },
  {
    slug: "data-and-ml-eng-collectives",
    label: "Data and ML engineering collectives",
    archetype: "Pipeline, warehouse, modern-data-stack, ML-engineering practitioners",
    tagline:
      "dbt, MLOps, r/dataengineering, Modern Data Stack, where production-data orgs first leak hiring + roadmap.",
    intro:
      "Data-eng and ML-eng practitioner rooms. The audience overlaps with /infra-and-platform-eng-circles but indexes harder on data-platform and modern-data-stack adoption. Crossover with /ai-builder-rooms is intentional, same people, different lens.",
    yieldStory:
      "Primary surfaces are dbt Community Slack, MLOps Community Slack, r/dataengineering, r/MachineLearning, DataTalks.Club Slack, and Modern Data Stack forum, six rooms where data-platform repos most often first telegraph commercial plans.",
    cadence:
      "Weekly read on the six primary surfaces.",
    caveat:
      "Data-eng rooms reward operational precision. No marketing-shaped posts.",
    expected: 12,
    items: DATA_AND_ML_ENG_COLLECTIVES,
  },
  {
    slug: "founder-newsletter-comment-sections",
    label: "Founder-newsletter comment sections",
    archetype: "Analyst-led reading rooms with attached comment threads",
    tagline:
      "Lenny's, Latent Space, Pragmatic Engineer, Trends.vc, where thesis-shaping happens in public.",
    intro:
      "Analyst-led newsletters with active comment sections. These rarely produce first-mention deal-flow but they shape how a sector is read, and the comment threads carry the operator-side reaction in near-real-time.",
    yieldStory:
      "Primary surfaces are Lenny's Newsletter, Latent Space, and Trends.vc, three rooms whose comment threads we cite most often in trend essays and thesis memos.",
    cadence:
      "Weekly digest read across the twelve. Active comment posting is rare; reading is daily.",
    caveat:
      "Newsletter comments are tied to a paid subscription on most surfaces. Read-only is the default; engagement gated by anonymity.",
    expected: 12,
    items: FOUNDER_NEWSLETTER_COMMENT_SECTIONS,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

export function getAllCommunitySlugs(): string[] {
  return COMMUNITY_GROUPS.map((g) => g.slug);
}

export function getCommunityGroup(slug: string): CommunityGroup | undefined {
  return COMMUNITY_GROUPS.find((g) => g.slug === slug);
}

export function communityYieldCounts(
  slug: string,
): Record<YieldTier, number> {
  const counts: Record<YieldTier, number> = {
    primary: 0,
    secondary: 0,
    ambient: 0,
  };
  const g = getCommunityGroup(slug);
  if (!g) return counts;
  for (const c of g.items) counts[c.yield]++;
  return counts;
}

export function communityStatusCounts(
  slug: string,
): Record<CommunityStatus, number> {
  const counts: Record<CommunityStatus, number> = {
    engage: 0,
    watch: 0,
    hold: 0,
    read: 0,
    blocked: 0,
  };
  const g = getCommunityGroup(slug);
  if (!g) return counts;
  for (const c of g.items) counts[c.status]++;
  return counts;
}

/**
 * Build-time invariant, fail the build if any group's roster drifts off its
 * declared `expected` count. Caught here rather than letting an off-by-one
 * malformed roster ship.
 */
export function assertCommunityCounts(): void {
  for (const g of COMMUNITY_GROUPS) {
    if (g.items.length !== g.expected) {
      throw new Error(
        `[community-signal] group "${g.slug}" has ${g.items.length} items; expected ${g.expected}.`,
      );
    }
  }
}

export function totalCommunityCount(): number {
  return COMMUNITY_GROUPS.reduce((n, g) => n + g.items.length, 0);
}
