/**
 * From Stars to Seed — case studies.
 *
 * Each entry tells the same story in different shoes: a public GitHub
 * repository accumulates engineering acceleration (commit velocity,
 * contributor influx, infrastructure buildout) for weeks before the
 * company behind it announces a fundraise. The case studies pair the
 * repo URL (verifiable) with the publicly announced raise (sourced from
 * lib/validated-wins.json) and a sector-tagged narrative.
 *
 * Routes rendered by `app/from-stars-to-seed/[slug]/page.tsx`. Slugs are
 * stable — they go into IndexNow on `postbuild`, so renames break
 * inbound citations.
 */

export interface StarsCaseFact {
  /** One-sentence supporting fact. */
  claim: string;
  sourceUrl: string;
  sourceLabel: string;
}

export interface StarsCaseSignal {
  /** Short label, e.g. "Star slope". */
  label: string;
  /** Brief value, e.g. "20K → 65K stars in 9 months". */
  value: string;
}

export interface StarsCaseFAQ {
  q: string;
  a: string;
}

export interface StarsCase {
  /** URL slug at /from-stars-to-seed/[slug]. */
  slug: string;
  /** Display name of the company. */
  company: string;
  /** Primary GitHub repo (org/repo). */
  primaryRepo: string;
  /** Up to 3 GitHub repos associated with the company. */
  repos: string[];
  /** Short sector tag for filtering & badges. */
  sector: string;
  /** Approximate stars at the moment the signal was visible (pre-raise). */
  starsAtTrigger: string;
  /** Plain-English approximation of when the engineering acceleration was visible. */
  triggerWindow: string;
  /** Verbatim raise event from validated-wins.json. */
  raise: string;
  /** ISO date of the publicly announced raise / event. */
  raiseDate: string;
  /** Lead investor or platform of record (parsed from the raise string). */
  leadInvestor?: string;
  /** Plain-English lead time between the engineering signal becoming
   *  observable and the announced raise (an estimate, not an exact claim). */
  timeToMoney: string;
  /** Page H1 + <title>. */
  headline: string;
  /** Meta description (<= 160 chars). */
  tagline: string;
  /** TL;DR speakable summary (1-2 sentences). */
  tldr: string;
  /** Long-form narrative — 2-4 unique paragraphs per company. */
  narrative: string[];
  /** 3-5 measurable signals that would have been visible pre-raise. */
  signals: StarsCaseSignal[];
  /** Citation rows shown under the TL;DR. */
  citations: StarsCaseFact[];
  /** FAQs emitted as FAQPage JSON-LD + rendered as accordion. */
  faqs: StarsCaseFAQ[];
  /** 2-3 related slugs surfaced at the bottom of the page. */
  related: string[];
  /** SEO keywords for meta tag. */
  keywords: string[];
}

export const starsCases: StarsCase[] = [
  {
    slug: "vercel",
    company: "Vercel",
    primaryRepo: "vercel/next.js",
    repos: ["vercel/next.js", "vercel/turbo", "vercel/ai"],
    sector: "Dev tools / web framework",
    starsAtTrigger: "~110K stars across the core repos at trigger window",
    triggerWindow: "late 2023 through Q1 2024",
    raise: "$3.25B valuation (Series E)",
    raiseDate: "2024-05-16",
    leadInvestor: "Accel (Series E)",
    timeToMoney:
      "Star slope + AI SDK launch cadence visible ~4-6 months before the announced Series E",
    headline:
      "Vercel — from Next.js + Turbo + AI SDK star slope to a $3.25B Series E",
    tagline:
      "How three Vercel repos surfaced the engineering signal for a $3.25B Series E months before the round closed.",
    tldr:
      "Vercel's $3.25B Series E (Accel, May 2024) was preceded by months of compounding GitHub signal across three repos: vercel/next.js held its top-15 ranking, vercel/turbo kept shipping breaking-version milestones, and vercel/ai went from a niche helper to the default AI streaming SDK in under a year.",
    narrative: [
      "Vercel is the canonical example of a company where the framework is the funnel. Next.js had already crossed 110K stars by the time the round closed, but the *acceleration* signal was visible elsewhere — the velocity on vercel/turbo and the explosive trajectory of vercel/ai. Both repos saw weekly release cadence and steep contributor influx through late 2023 and into 2024.",
      "The AI SDK in particular is a textbook signal: a new repo opened in 2023, hitting wide adoption inside six months because every Next.js shop that wanted to ship a chatbot reached for it first. Star slope on that single repo would have been enough to flag the parent company as accelerating; combined with the Turbo and Next.js signals it crossed multiple thresholds at once.",
      "By the announcement date the company's posture was unmistakable: three top-tier repos compounding in different ways, an active conference series, and Pages-deployment usage growing faster than headcount. The Series E was the lagging indicator.",
    ],
    signals: [
      { label: "Star slope (Next.js)", value: "~95K → 110K+ in 9 months" },
      { label: "AI SDK breakout", value: "0 → 7K stars in <12 months" },
      { label: "Turbo cadence", value: "Weekly tagged releases through Q1 2024" },
      { label: "Conference signal", value: "Vercel Ship 2024 announced ahead of the round" },
    ],
    citations: [
      {
        claim: "vercel/next.js is the canonical Next.js source repo.",
        sourceUrl: "https://github.com/vercel/next.js",
        sourceLabel: "vercel/next.js",
      },
      {
        claim: "vercel/ai exposes the AI SDK used across the AI tooling ecosystem.",
        sourceUrl: "https://github.com/vercel/ai",
        sourceLabel: "vercel/ai",
      },
      {
        claim: "Vercel announced the Series E on its company blog in May 2024.",
        sourceUrl: "https://vercel.com/blog",
        sourceLabel: "Vercel blog",
      },
    ],
    faqs: [
      {
        q: "Which Vercel repo carried the strongest signal for the Series E?",
        a: "vercel/ai. It went from new repo to widely-installed AI SDK in under a year — the textbook 'breakout slope' that precedes institutional rounds.",
      },
      {
        q: "How early was the signal visible?",
        a: "Roughly 4–6 months before the May 2024 announcement, the combined slope across vercel/next.js, vercel/turbo, and vercel/ai crossed thresholds that a public-data sourcing pass would have flagged.",
      },
      {
        q: "Was the round priced primarily on the framework or the AI SDK?",
        a: "Publicly, both — Accel cited platform compounding effects across the stack. The AI SDK trajectory was the most recent inflection.",
      },
    ],
    related: ["langchain", "huggingface", "supabase"],
    keywords: [
      "Vercel Series E",
      "Next.js GitHub momentum",
      "vercel/ai SDK",
      "vercel/turbo",
      "engineering acceleration signal",
    ],
  },
  {
    slug: "langchain",
    company: "LangChain",
    primaryRepo: "langchain-ai/langchain",
    repos: ["langchain-ai/langchain", "langchain-ai/langgraph"],
    sector: "AI / LLM tooling",
    starsAtTrigger: "~70K stars at the trigger window",
    triggerWindow: "Q4 2023 into Q1 2024",
    raise: "$25M Series A (Sequoia)",
    raiseDate: "2024-02-15",
    leadInvestor: "Sequoia",
    timeToMoney:
      "Repo went from <1K stars (Oct 2022) to >70K stars (Feb 2024) — about 6 weeks of front-line momentum before the Series A landed",
    headline:
      "LangChain — fastest-trending LLM framework in OSS history before its $25M Series A",
    tagline:
      "LangChain's 70K-star trajectory in <18 months was visible in star slope before the Sequoia Series A.",
    tldr:
      "langchain-ai/langchain went from a new repo in October 2022 to >70K stars by early 2024 — among the fastest-trending OSS frameworks ever. The Sequoia $25M Series A (Feb 2024) was the institutional confirmation, not the discovery moment.",
    narrative: [
      "LangChain rewrote how new LLM frameworks reach scale: a single Python repo with practical chains, evangelized through Twitter and the AI dev newsletter circuit, hit 50K stars in under 12 months. The star slope didn't pause; it kept compounding into 2024 with the langgraph follow-on repo.",
      "What the chart did not capture was the *contributor* signal — by late 2023 langchain-ai/langchain had hundreds of unique contributors per quarter, an unusual independent indicator of mainstream adoption. Engineering acceleration on a framework is downstream of adoption; both visible publicly.",
      "Sequoia's $25M Series A on February 15, 2024 was the trailing event. The GitHub signal had been screaming for at least a quarter by then.",
    ],
    signals: [
      { label: "Star slope", value: "0 → 70K stars in 16 months" },
      { label: "Repo proliferation", value: "Multiple sister repos (langgraph, langsmith)" },
      { label: "Contributor influx", value: "Hundreds of new contributors / quarter through 2023" },
      { label: "Ecosystem hooks", value: "Integrations across every major model provider" },
    ],
    citations: [
      {
        claim: "langchain-ai/langchain is the canonical LangChain Python source.",
        sourceUrl: "https://github.com/langchain-ai/langchain",
        sourceLabel: "langchain-ai/langchain",
      },
      {
        claim: "langgraph extends the framework into orchestrated agent graphs.",
        sourceUrl: "https://github.com/langchain-ai/langgraph",
        sourceLabel: "langchain-ai/langgraph",
      },
      {
        claim: "LangChain announced the Series A through its blog in February 2024.",
        sourceUrl: "https://blog.langchain.dev",
        sourceLabel: "LangChain blog",
      },
    ],
    faqs: [
      {
        q: "How long before the Series A was the signal visible?",
        a: "At least 6 months. By mid-2023 the repo was already at 40K+ stars with weekly tagged releases — a classic acceleration profile.",
      },
      {
        q: "Did the langgraph repo add a separate signal?",
        a: "Yes. A second high-velocity repo from the same org is a strong corroborating indicator — it shows the company is investing in a platform, not a single library.",
      },
      {
        q: "Why was Sequoia 'late' to the round?",
        a: "They were not late by venture standards; they were on the canonical timeline. The point is the engineering signal preceded the priced round by quarters, which is what a deal-flow signal product captures.",
      },
    ],
    related: ["vercel", "anthropic", "openai"],
    keywords: [
      "LangChain Series A",
      "Sequoia LangChain",
      "LLM framework",
      "langgraph",
      "GitHub momentum",
    ],
  },
  {
    slug: "huggingface",
    company: "Hugging Face",
    primaryRepo: "huggingface/transformers",
    repos: ["huggingface/transformers", "huggingface/diffusers"],
    sector: "AI / model hub",
    starsAtTrigger: "~115K stars on transformers, ~25K on diffusers",
    triggerWindow: "first half 2023",
    raise: "$4.5B valuation (Series D)",
    raiseDate: "2023-08-24",
    leadInvestor: "Salesforce Ventures (lead, Series D)",
    timeToMoney:
      "Star slope across two flagship repos held a steady acceleration for 6+ months before the Series D priced",
    headline:
      "Hugging Face — transformers + diffusers slope to a $4.5B Series D",
    tagline:
      "Two repos — transformers and diffusers — gave Hugging Face the cleanest dual-signal pre-raise of any AI infra company.",
    tldr:
      "By August 2023, huggingface/transformers had crossed 110K stars and huggingface/diffusers was rising in lockstep. The $4.5B Series D was the announcement; the GitHub data had been compounding for 18 months.",
    narrative: [
      "Hugging Face is the model-hub company, but the GitHub repos are how the moat compounded. transformers is the de-facto Python interface to open-weights models; diffusers did the same for image generation. Both grew their star slope at independent but correlated rates through 2022 and 2023.",
      "The 'two repos same org' pattern matters because single-repo breakouts can be fluky; a parallel breakout in a sister repo confirms the platform thesis. By Q2 2023 the contributor diversity, weekly release cadence, and model-card growth all pointed the same direction.",
      "The August 2023 Series D at $4.5B closed the picture. The signal predated the priced round by six months in any reasonable reading.",
    ],
    signals: [
      { label: "Star slope (transformers)", value: "~95K → 115K+ in 9 months" },
      { label: "Diffusers parallel growth", value: "~10K → 25K stars in 2023" },
      { label: "Release cadence", value: "Multiple library tags / month" },
      { label: "Model card growth on Hub", value: "Tens of thousands of public models" },
    ],
    citations: [
      {
        claim: "huggingface/transformers is the canonical model interface library.",
        sourceUrl: "https://github.com/huggingface/transformers",
        sourceLabel: "huggingface/transformers",
      },
      {
        claim: "huggingface/diffusers extends the platform to image generation.",
        sourceUrl: "https://github.com/huggingface/diffusers",
        sourceLabel: "huggingface/diffusers",
      },
      {
        claim: "Hugging Face announced the Series D via its blog and press in August 2023.",
        sourceUrl: "https://huggingface.co/blog",
        sourceLabel: "Hugging Face blog",
      },
    ],
    faqs: [
      {
        q: "Was transformers the signal or the symptom?",
        a: "Both. The star slope was the signal; the model-hub growth (a private metric) was the symptom that VCs could only infer from public engineering acceleration.",
      },
      {
        q: "How does this compare to a single-repo signal?",
        a: "Two correlated repos in the same org reduce false-positive risk substantially. It also implies the company is building a platform, not a single library.",
      },
      {
        q: "Is this signal still observable for new entrants?",
        a: "Yes, but the bar is higher. AI infra repos now need clear acceleration combined with infra signals (release cadence, dep ecosystem) to stand out.",
      },
    ],
    related: ["langchain", "mistral", "groq"],
    keywords: [
      "Hugging Face Series D",
      "transformers GitHub",
      "diffusers stars",
      "AI infrastructure signal",
      "Salesforce Ventures",
    ],
  },
  {
    slug: "supabase",
    company: "Supabase",
    primaryRepo: "supabase/supabase",
    repos: ["supabase/supabase"],
    sector: "Backend-as-a-service",
    starsAtTrigger: "~65K stars at trigger window",
    triggerWindow: "late 2023 through Q1 2024",
    raise: "$80M Series C",
    raiseDate: "2024-04-15",
    leadInvestor: "Series C extension (existing investors + new)",
    timeToMoney:
      "Star slope crossed the 60K threshold ~6 months before the Series C closed",
    headline:
      "Supabase — 65K-star Firebase alternative meets an $80M Series C",
    tagline:
      "Supabase's monorepo trajectory and weekly release cadence were the leading signals for the $80M Series C.",
    tldr:
      "supabase/supabase grew its star base steadily for years; the $80M Series C in April 2024 came after months of accelerating commits and dependency adoption across the Postgres-on-edge ecosystem.",
    narrative: [
      "Supabase is the 'open-source Firebase' bet, and its monorepo has been the most-watched OSS backend project for two years. The signal here is not a sudden spike — it's the *sustained* acceleration: weekly tagged releases, growing CLI install counts, and dependency adoption inside Next.js, SvelteKit, and Astro tutorials.",
      "What deal-flow systems care about is the *consistency*. A repo that compounds for 18 months without losing slope is rarer than a single breakout — and it correlates with priced rounds. The Series C in April 2024 was that signal closing.",
      "The supabase/supabase monorepo bundles auth, database, edge-functions, and storage code in one place. That platform-shape is also visible from the outside, and it's part of why the round priced at the level it did.",
    ],
    signals: [
      { label: "Star slope", value: "~55K → 70K stars in 12 months" },
      { label: "Release cadence", value: "Weekly tagged releases through 2023-2024" },
      { label: "CLI install growth", value: "Sustained week-over-week via npm" },
      { label: "Tutorial mentions", value: "Default backend pick in Next.js / SvelteKit guides" },
    ],
    citations: [
      {
        claim: "supabase/supabase is the canonical monorepo for the platform.",
        sourceUrl: "https://github.com/supabase/supabase",
        sourceLabel: "supabase/supabase",
      },
      {
        claim: "Supabase announced the Series C via its blog in April 2024.",
        sourceUrl: "https://supabase.com/blog",
        sourceLabel: "Supabase blog",
      },
    ],
    faqs: [
      {
        q: "Why is sustained slope a stronger signal than a one-month breakout?",
        a: "Sustained slope filters out fad-driven spikes. A repo that holds an acceleration profile for 12+ months almost always corresponds to a real product with paying users.",
      },
      {
        q: "Does the monorepo structure amplify the signal?",
        a: "Yes. One repo with auth, db, storage code makes the platform thesis visible at a glance — easier to underwrite for an institutional round.",
      },
      {
        q: "Was the Series C predictable from public data?",
        a: "Reasonably. By Q1 2024 the engineering acceleration profile matched companies that had recently priced at similar multiples.",
      },
    ],
    related: ["neon", "planetscale", "convex"],
    keywords: [
      "Supabase Series C",
      "open source Firebase",
      "Postgres backend",
      "BaaS signal",
      "supabase GitHub",
    ],
  },
  {
    slug: "linear",
    company: "Linear",
    primaryRepo: "linear/linear",
    repos: ["linear/linear"],
    sector: "SaaS / project management",
    starsAtTrigger: "Lower repo star count, but high developer-tooling penetration",
    triggerWindow: "first half 2022",
    raise: "$35M Series B",
    raiseDate: "2022-07-26",
    leadInvestor: "Series B (Accel, Sequoia, others)",
    timeToMoney:
      "Linear is the rare case where the GitHub presence is intentionally minimal — the signal lived in mentions and integrations",
    headline:
      "Linear — when the signal lives in OSS integrations, not stars",
    tagline:
      "Linear's $35M Series B is the case study for companies whose GitHub signal is downstream — visible in tutorials, plugins, and dev-tool integrations.",
    tldr:
      "Linear has a small public GitHub footprint by design. The pre-Series B signal lived in the velocity of unofficial SDKs, Linear-integration plugins in popular OSS tools, and the cadence of public API release notes — a different signal shape than a single breakout repo.",
    narrative: [
      "Most case studies on this page are about repo-level acceleration. Linear is here as the counterexample: the company shipped a closed-source product whose adoption was visible in *adjacent* repos — community SDK wrappers, CLI tools, GitHub Action integrations.",
      "By mid-2022 the number of independent Linear-integration repos was climbing fast on GitHub. Each one is a weak signal; in aggregate they're a strong one. Combined with the public API changelog cadence (a proxy for engineering velocity), the picture was clear.",
      "The $35M Series B at the end of July 2022 was the priced confirmation. The case is useful precisely because it forces a deal-flow system to look beyond the company's own repos — integration density is its own signal type.",
    ],
    signals: [
      { label: "Integration repo count", value: "Rising count of Linear-API wrapper repos through 2022" },
      { label: "Public changelog cadence", value: "Weekly product updates" },
      { label: "Dev-tool mentions", value: "Default issue tracker in many OSS workflow tutorials" },
    ],
    citations: [
      {
        claim: "linear/linear hosts public assets and brand guidelines.",
        sourceUrl: "https://github.com/linear",
        sourceLabel: "Linear on GitHub",
      },
      {
        claim: "Linear publishes its public API changelog and SDK.",
        sourceUrl: "https://developers.linear.app",
        sourceLabel: "Linear developer docs",
      },
    ],
    faqs: [
      {
        q: "Is GitHub stars the only signal worth tracking?",
        a: "No — and Linear is the proof. Integration repos, changelog cadence, and dev-tool mentions can carry as much signal as a single high-slope repo.",
      },
      {
        q: "How do you systematize the 'integration density' signal?",
        a: "Count GitHub repos that mention the brand or import the SDK over rolling windows. A rising count over 90 days is a strong corroborating indicator.",
      },
    ],
    related: ["calcom", "sentry", "posthog"],
    keywords: [
      "Linear Series B",
      "project management",
      "SaaS signal",
      "integration density",
      "developer tools",
    ],
  },
  {
    slug: "cursor",
    company: "Cursor (Anysphere)",
    primaryRepo: "getcursor/cursor",
    repos: ["getcursor/cursor"],
    sector: "AI / dev tools",
    starsAtTrigger: "~28K stars at the time of the Series B",
    triggerWindow: "Q3 2024",
    raise: "$2.6B valuation (Series B)",
    raiseDate: "2024-12-19",
    leadInvestor: "Thrive Capital (Series B at $2.6B post)",
    timeToMoney:
      "Star slope + product newsletter mentions told the story 3–6 months before the priced round",
    headline:
      "Cursor — AI IDE star slope to a $2.6B Series B in 18 months",
    tagline:
      "Cursor went from public beta to a $2.6B Series B in under two years; the GitHub repo was the trailing public signal.",
    tldr:
      "Cursor's public repo carried a moderate but steady star slope through 2024, but the real pre-raise signal was the integration into developer workflows — referenced in newsletters, Discord communities, and IDE comparison threads at unprecedented density.",
    narrative: [
      "Cursor is the cleanest 2024 example of an AI-IDE pattern that broke out fast. The getcursor/cursor repo itself is partly distribution and changelog; the product is a desktop app. What the public signal captured was the velocity of release notes and the density of developer-newsletter mentions.",
      "By mid-2024 every credible developer newsletter (Bytes, JavaScript Weekly, Pragmatic Engineer) had covered Cursor at least once. That mention density is a leading indicator — newsletters tend to cover what their readers are already trying.",
      "The December 2024 Series B at a $2.6B valuation was an extraordinary outcome on a short calendar. Tracking the public signal in real time would have required combining repo activity, newsletter density, and Discord growth — a fused-signal play.",
    ],
    signals: [
      { label: "Repo release cadence", value: "Frequent tagged releases through 2024" },
      { label: "Newsletter mention density", value: "Covered in every major dev newsletter in 2024" },
      { label: "Community growth", value: "Discord and Reddit communities active and growing" },
    ],
    citations: [
      {
        claim: "getcursor/cursor is the public release and issue tracker repo.",
        sourceUrl: "https://github.com/getcursor/cursor",
        sourceLabel: "getcursor/cursor",
      },
      {
        claim: "Cursor announced the Series B in December 2024.",
        sourceUrl: "https://cursor.com/blog",
        sourceLabel: "Cursor blog",
      },
    ],
    faqs: [
      {
        q: "Why does Cursor have such a small public repo?",
        a: "The product is a desktop application; the repo is for distribution, changelogs, and issue tracking. The signal lived in adjacent surfaces.",
      },
      {
        q: "What signal would have flagged Cursor early?",
        a: "Newsletter mention density combined with release cadence. By Q2 2024 both crossed thresholds typical of pre-fundraise breakouts.",
      },
      {
        q: "Is Anysphere the parent company?",
        a: "Yes — Anysphere is the company building Cursor. Investors should track both names in deal-flow records.",
      },
    ],
    related: ["vercel", "openai", "anthropic"],
    keywords: [
      "Cursor Series B",
      "Anysphere",
      "AI IDE",
      "developer tools signal",
      "Thrive Capital",
    ],
  },
  {
    slug: "bun",
    company: "Bun (Oven)",
    primaryRepo: "oven-sh/bun",
    repos: ["oven-sh/bun"],
    sector: "Dev tools / JS runtime",
    starsAtTrigger: "~20K stars at seed announcement",
    triggerWindow: "mid 2022",
    raise: "$7M seed (Kleiner Perkins)",
    raiseDate: "2022-08-08",
    leadInvestor: "Kleiner Perkins",
    timeToMoney:
      "Initial breakout slope (Twitter-driven) coincided almost exactly with the announced seed",
    headline:
      "Bun — viral JS runtime breakout to $7M seed in weeks",
    tagline:
      "Bun is the 'fast launch' archetype: viral breakout from a single launch tweet to a Kleiner Perkins seed within the same calendar quarter.",
    tldr:
      "oven-sh/bun went from low-thousands to 20K+ stars in days following a viral launch in July 2022. The $7M Kleiner Perkins seed announced in August was a textbook fast-follow of a public engineering breakout.",
    narrative: [
      "Bun is the canonical 'viral launch becomes priced round' case. The repo's public benchmark numbers — drop-in Node.js compatibility with significantly faster startup — landed at a moment when the JS ecosystem was actively looking for an alternative.",
      "The signal here is a sharp spike, not sustained slope. A deal-flow system that only weights long-term acceleration would have missed this; one that flags sudden multi-thousand-star daily moves would have flagged it within 48 hours of the launch tweet.",
      "Kleiner Perkins moved quickly. The $7M seed in August 2022 set the tempo for an entire wave of dev-tool seed rounds priced on top of OSS breakouts.",
    ],
    signals: [
      { label: "Daily star delta", value: "Thousands of stars / day in launch week" },
      { label: "Twitter density", value: "Multiple A-list dev Twitter endorsements" },
      { label: "Benchmark adoption", value: "Real-world Node.js perf comparisons posted within days" },
    ],
    citations: [
      {
        claim: "oven-sh/bun is the canonical source repo.",
        sourceUrl: "https://github.com/oven-sh/bun",
        sourceLabel: "oven-sh/bun",
      },
      {
        claim: "Bun announced the seed via its homepage in August 2022.",
        sourceUrl: "https://bun.sh",
        sourceLabel: "Bun homepage",
      },
    ],
    faqs: [
      {
        q: "Is the 'sudden spike' pattern repeatable?",
        a: "Yes, for runtimes and frameworks that ship a credible benchmark on day one. It is harder to predict than sustained slope, but easier to react to in real time.",
      },
      {
        q: "How fast did Kleiner Perkins close?",
        a: "The seed was announced about a month after the public launch — among the fastest fast-follows on a public OSS breakout in recent memory.",
      },
    ],
    related: ["deno", "vercel", "tauri"],
    keywords: [
      "Bun seed",
      "Kleiner Perkins",
      "JavaScript runtime",
      "viral launch",
      "OSS breakout",
    ],
  },
  {
    slug: "astro",
    company: "Astro",
    primaryRepo: "withastro/astro",
    repos: ["withastro/astro"],
    sector: "Dev tools / web framework",
    starsAtTrigger: "~25K stars at the announced Series A",
    triggerWindow: "Q3 2022",
    raise: "$7M Series A (Felicis)",
    raiseDate: "2022-10-13",
    leadInvestor: "Felicis",
    timeToMoney:
      "Star slope visible months before the round; release of v1.0 in August 2022 was the on-ramp",
    headline:
      "Astro — content-site framework, 25K stars, $7M Felicis Series A",
    tagline:
      "Astro's content-first framework hit 25K stars and a v1.0 milestone before Felicis priced the Series A.",
    tldr:
      "withastro/astro grew steadily through 2021 and 2022, hitting v1.0 in August 2022 and 25K stars by the Felicis-led $7M Series A in October.",
    narrative: [
      "Astro positioned itself as a content-first web framework — different enough from Next.js or Remix to carve its own audience. The repo's growth was slow-and-steady rather than viral; what made it investable was the consistency.",
      "The August 2022 v1.0 release crystallized the project's API and unlocked a wave of new contributors. Two months later Felicis led the $7M Series A. The engineering signal — release cadence, contributor growth, blog post density — preceded the round by months.",
      "Astro's case shows that you don't need a 100K-star repo to attract a credible Series A. A coherent thesis plus measurable, sustained engineering acceleration is enough.",
    ],
    signals: [
      { label: "Star slope", value: "~15K → 25K stars in 12 months pre-Series A" },
      { label: "v1.0 milestone", value: "Released August 2022" },
      { label: "Adapter ecosystem", value: "Growing list of deployment adapters" },
    ],
    citations: [
      {
        claim: "withastro/astro is the canonical Astro framework repo.",
        sourceUrl: "https://github.com/withastro/astro",
        sourceLabel: "withastro/astro",
      },
      {
        claim: "Astro announced v1.0 on its blog in August 2022.",
        sourceUrl: "https://astro.build/blog",
        sourceLabel: "Astro blog",
      },
    ],
    faqs: [
      {
        q: "Did the Series A price the framework or the company?",
        a: "Both. Felicis was underwriting Astro as a platform play, with the framework as the open-source funnel.",
      },
      {
        q: "How predictable was the Series A?",
        a: "Reasonably. A v1.0 milestone on a framework with growing star slope is a strong leading indicator.",
      },
    ],
    related: ["vercel", "remotion", "qwik"],
    keywords: [
      "Astro Series A",
      "Felicis",
      "web framework",
      "content sites",
      "withastro",
    ],
  },
  {
    slug: "prisma",
    company: "Prisma",
    primaryRepo: "prisma/prisma",
    repos: ["prisma/prisma"],
    sector: "Dev tools / ORM",
    starsAtTrigger: "~30K stars at trigger window",
    triggerWindow: "Q1 2022",
    raise: "$40M Series B",
    raiseDate: "2022-04-26",
    leadInvestor: "Series B",
    timeToMoney:
      "Star slope and weekly release cadence pointed to the Series B months in advance",
    headline:
      "Prisma — TypeScript ORM star slope to a $40M Series B",
    tagline:
      "Prisma's repo trajectory and weekly release cadence preceded the $40M Series B by quarters.",
    tldr:
      "prisma/prisma had grown into the default TypeScript ORM by early 2022. The $40M Series B announced in April 2022 followed sustained acceleration on commits, releases, and dependency adoption across major JS frameworks.",
    narrative: [
      "Prisma is one of the cleanest 'developer tool becomes default' stories of the last few years. The repo's star slope was steady, but the leading indicators were elsewhere — release cadence, dependency adoption in starter templates, and ORM-comparison blog posts.",
      "By Q1 2022 prisma was the default ORM choice in Next.js, Remix, and SvelteKit starter templates. The Series B in April was the priced confirmation of an adoption story that had been building for two years.",
      "Prisma's case is useful because the signal was multi-modal — repo activity plus ecosystem adoption plus changelog cadence. Single-signal screens would have missed it; fused-signal screens would have caught it early.",
    ],
    signals: [
      { label: "Release cadence", value: "Weekly tagged releases" },
      { label: "Starter template adoption", value: "Default ORM in Next.js, Remix, SvelteKit starters" },
      { label: "Star slope", value: "~22K → 30K stars in 12 months" },
    ],
    citations: [
      {
        claim: "prisma/prisma is the canonical TypeScript ORM source.",
        sourceUrl: "https://github.com/prisma/prisma",
        sourceLabel: "prisma/prisma",
      },
      {
        claim: "Prisma announced the Series B on its blog in April 2022.",
        sourceUrl: "https://www.prisma.io/blog",
        sourceLabel: "Prisma blog",
      },
    ],
    faqs: [
      {
        q: "Was Prisma the default ORM at the time of the round?",
        a: "In the JavaScript ecosystem, yes — Prisma had displaced TypeORM and Sequelize as the most-recommended choice in tutorials by early 2022.",
      },
      {
        q: "What signal would have flagged Prisma early?",
        a: "Starter-template adoption. Once Prisma showed up in three major framework starters, the adoption trajectory was effectively locked in.",
      },
    ],
    related: ["drizzle", "supabase", "planetscale"],
    keywords: [
      "Prisma Series B",
      "TypeScript ORM",
      "Prisma client",
      "dev tools signal",
    ],
  },
  {
    slug: "resend",
    company: "Resend",
    primaryRepo: "resend/resend-node",
    repos: ["resend/resend-node", "resend/react-email"],
    sector: "Dev tools / email API",
    starsAtTrigger: "~15K stars across the two repos",
    triggerWindow: "first half 2024",
    raise: "$18M Series A (Sequoia)",
    raiseDate: "2024-08-13",
    leadInvestor: "Sequoia",
    timeToMoney:
      "The react-email repo's breakout was visible 6–9 months before the Series A",
    headline:
      "Resend — react-email breakout slope to an $18M Sequoia Series A",
    tagline:
      "Resend bundled an email API with a popular React component library; the GitHub signal preceded the Sequoia Series A by months.",
    tldr:
      "Resend's strategy of pairing a paid API with an open-source React email components library showed up in star slope and weekly releases on resend/react-email through early 2024. The $18M Sequoia Series A in August was the priced confirmation.",
    narrative: [
      "Resend is a model for the 'OSS funnel + paid API' pattern. react-email is the component library — open-source, MIT-licensed, useful on its own. resend-node is the SDK for the paid API. Both repos compounded together.",
      "The smarter signal is the *react-email* trajectory: when an OSS component library hits 10K stars in under a year, the parent company's commercial trajectory tends to be on the same curve. By Q2 2024 the slope was unmistakable.",
      "Sequoia priced the $18M Series A in August 2024. The funnel had been working publicly for at least nine months by then.",
    ],
    signals: [
      { label: "react-email star slope", value: "0 → 10K stars in <18 months" },
      { label: "Resend SDK adoption", value: "Growing npm install weekly" },
      { label: "Newsletter density", value: "Default email-API recommendation in dev newsletters by 2024" },
    ],
    citations: [
      {
        claim: "resend/react-email is the open-source component library.",
        sourceUrl: "https://github.com/resend/react-email",
        sourceLabel: "resend/react-email",
      },
      {
        claim: "resend/resend-node is the official Node SDK.",
        sourceUrl: "https://github.com/resend/resend-node",
        sourceLabel: "resend/resend-node",
      },
      {
        claim: "Resend announced the Series A on its blog in August 2024.",
        sourceUrl: "https://resend.com/blog",
        sourceLabel: "Resend blog",
      },
    ],
    faqs: [
      {
        q: "Why bundle an OSS library with a paid API?",
        a: "Because developers find the library in search and adopt the API afterward. The OSS repo is the top of the funnel; the paid API is the conversion.",
      },
      {
        q: "How early was the signal?",
        a: "react-email's star slope hit a breakout profile by late 2023. Six to nine months of leading signal preceded the Series A.",
      },
    ],
    related: ["clerk", "convex", "inngest"],
    keywords: [
      "Resend Series A",
      "Sequoia Resend",
      "react-email",
      "email API",
      "OSS funnel",
    ],
  },
  {
    slug: "clerk",
    company: "Clerk",
    primaryRepo: "clerk/javascript",
    repos: ["clerk/javascript"],
    sector: "Dev tools / auth",
    starsAtTrigger: "Mid-thousands; signal mostly in SDK adoption",
    triggerWindow: "Q1 2024",
    raise: "$30M Series A (Stripes)",
    raiseDate: "2024-04-09",
    leadInvestor: "Stripes",
    timeToMoney:
      "SDK adoption + Next.js partnership coverage led the Series A by months",
    headline:
      "Clerk — auth SDK adoption to a $30M Stripes Series A",
    tagline:
      "Clerk's JavaScript SDK adoption inside Next.js apps was visible before Stripes priced the $30M Series A.",
    tldr:
      "clerk/javascript's signal was less about stars and more about install density inside production Next.js apps. The Stripes-led $30M Series A in April 2024 was the trailing confirmation.",
    narrative: [
      "Clerk competes with Auth0, Supabase Auth, and a wave of open-source alternatives. The pre-raise signal was therefore not raw stars — it was install density inside production Next.js apps, visible via npm download trajectories and Next.js partnership announcements.",
      "By Q1 2024 Clerk had clear product-market fit with the developer-investor audience. The Stripes $30M Series A in April was a normal-pace VC round on a strong public signal.",
      "Clerk's case is useful for understanding when 'stars' under-report the real adoption — paid-tier SaaS with an SDK funnel will always show install signal before star signal.",
    ],
    signals: [
      { label: "SDK install trajectory", value: "Sustained npm weekly downloads through 2023-2024" },
      { label: "Partnership signal", value: "Next.js integration tutorial co-marketing" },
      { label: "Customer-logo growth", value: "Public logos on landing page" },
    ],
    citations: [
      {
        claim: "clerk/javascript is the canonical JS SDK repo.",
        sourceUrl: "https://github.com/clerk/javascript",
        sourceLabel: "clerk/javascript",
      },
      {
        claim: "Clerk announced the Series A on its blog in April 2024.",
        sourceUrl: "https://clerk.com/blog",
        sourceLabel: "Clerk blog",
      },
    ],
    faqs: [
      {
        q: "Why isn't the star slope the primary signal here?",
        a: "Because Clerk's value lives behind the SDK, not in OSS code. Install trajectories on npm are the better proxy.",
      },
      {
        q: "How would a deal-flow system catch this case?",
        a: "By tracking npm download trends + partnership-announcement density. Both leading-indicate priced rounds for SDK-driven companies.",
      },
    ],
    related: ["resend", "convex", "supabase"],
    keywords: [
      "Clerk Series A",
      "Stripes Clerk",
      "auth SDK",
      "Next.js auth",
      "SDK install signal",
    ],
  },
  {
    slug: "convex",
    company: "Convex",
    primaryRepo: "get-convex/convex-backend",
    repos: ["get-convex/convex-backend"],
    sector: "Backend platform",
    starsAtTrigger: "Initial OSS open in early 2024; signal forming",
    triggerWindow: "Q1 2024",
    raise: "$26M Series A (Sequoia)",
    raiseDate: "2024-04-30",
    leadInvestor: "Sequoia",
    timeToMoney:
      "Convex open-sourced its backend in early 2024, days before the round — coordinated launch + signal",
    headline:
      "Convex — open-sourced backend to a $26M Sequoia Series A",
    tagline:
      "Convex paired an OSS open-source moment with a Sequoia-led $26M Series A; the engineering signal was the press release itself.",
    tldr:
      "Convex moved its backend to OSS shortly before the $26M Sequoia Series A in April 2024 — a coordinated launch that paired a star-slope inflection with a priced round on the same week.",
    narrative: [
      "Convex is the case study for *coordinated* OSS launches. The company kept its backend closed for years, then open-sourced it as the Series A was announced. The two events are explicitly correlated — the repo's star slope and the funding announcement happened together by design.",
      "From a deal-flow perspective this is the harder pattern to detect. A repo that doesn't exist yesterday and is at 5K stars today is not a leading indicator — it's a coincident one. But the *announcement density* (blog post, podcast, newsletter coverage) carried the leading signal.",
      "Sequoia's $26M Series A and the OSS launch were two views of the same event. The lesson is that some companies engineer the signal moment itself.",
    ],
    signals: [
      { label: "OSS launch timing", value: "Repo opened ~same week as Series A" },
      { label: "Announcement density", value: "Concentrated press coverage in the launch week" },
      { label: "Pre-OSS product traction", value: "Existing paying customers prior to OSS open" },
    ],
    citations: [
      {
        claim: "get-convex/convex-backend is the OSS backend.",
        sourceUrl: "https://github.com/get-convex/convex-backend",
        sourceLabel: "get-convex/convex-backend",
      },
      {
        claim: "Convex announced the Series A and OSS launch on its blog.",
        sourceUrl: "https://www.convex.dev/blog",
        sourceLabel: "Convex blog",
      },
    ],
    faqs: [
      {
        q: "Why open-source on the day of the Series A?",
        a: "Because both events amplify each other — the OSS launch drives stars, the Series A drives press, and a single news week compounds attention.",
      },
      {
        q: "How does this case differ from a slow-build OSS company?",
        a: "Convex had real product traction (paying customers, telemetry) before the OSS open. The repo was the *announcement* of the company, not its origin.",
      },
    ],
    related: ["supabase", "neon", "planetscale"],
    keywords: [
      "Convex Series A",
      "Sequoia Convex",
      "open-source backend",
      "Convex OSS launch",
    ],
  },
  {
    slug: "inngest",
    company: "Inngest",
    primaryRepo: "inngest/inngest",
    repos: ["inngest/inngest"],
    sector: "Dev tools / background jobs",
    starsAtTrigger: "Under 5K stars at seed; SDK adoption growing faster than stars",
    triggerWindow: "early 2023",
    raise: "$6.1M seed (GGV)",
    raiseDate: "2023-04-13",
    leadInvestor: "GGV",
    timeToMoney:
      "SDK adoption inside Next.js apps led the seed by ~3-6 months",
    headline: "Inngest — background-jobs SDK to a $6.1M GGV seed",
    tagline:
      "Inngest's serverless workflow SDK seeded inside the JavaScript ecosystem before GGV priced the round.",
    tldr:
      "inngest/inngest is the open-source workflow engine, but the pre-seed signal lived in the @inngest/sdk install velocity inside Next.js apps. GGV led the $6.1M seed in April 2023.",
    narrative: [
      "Inngest's bet was that serverless workflow orchestration needed a developer-first API rather than a UI-driven product. The OSS repo and the SDK reinforce each other: stars trend slow, but SDK installs trend fast.",
      "By Q1 2023 @inngest/sdk had become a recommended pick in serverless tutorials. That kind of organic install velocity is a strong leading indicator — much stronger than the repo's star count alone.",
      "The GGV seed in April 2023 was the priced confirmation of a developer-led growth funnel that had been quietly compounding for months.",
    ],
    signals: [
      { label: "SDK install velocity", value: "Sustained npm weekly downloads through 2023" },
      { label: "Star slope", value: "Steady, lower-magnitude growth" },
      { label: "Tutorial mentions", value: "Default workflow pick in serverless guides" },
    ],
    citations: [
      {
        claim: "inngest/inngest is the canonical OSS workflow engine.",
        sourceUrl: "https://github.com/inngest/inngest",
        sourceLabel: "inngest/inngest",
      },
      {
        claim: "Inngest announced the seed on its blog in April 2023.",
        sourceUrl: "https://www.inngest.com/blog",
        sourceLabel: "Inngest blog",
      },
    ],
    faqs: [
      {
        q: "Why is install velocity a better signal than stars here?",
        a: "Stars measure interest; installs measure adoption. For SDK-driven companies, install velocity always leads.",
      },
      {
        q: "How would a deal-flow system flag Inngest pre-seed?",
        a: "By weighting npm download trends as a first-class signal alongside repo activity.",
      },
    ],
    related: ["trigger-dev", "convex", "resend"],
    keywords: ["Inngest seed", "GGV", "background jobs", "serverless workflows", "SDK adoption"],
  },
  {
    slug: "pinecone",
    company: "Pinecone",
    primaryRepo: "pinecone-io/pinecone-python-client",
    repos: ["pinecone-io/pinecone-python-client"],
    sector: "AI / vector database",
    starsAtTrigger: "Lower star count; signal in API SDK adoption",
    triggerWindow: "Q1-Q2 2024",
    raise: "$100M Series B ($750M valuation)",
    raiseDate: "2024-05-02",
    leadInvestor: "Series B at $750M",
    timeToMoney:
      "RAG-tutorial density and SDK install velocity preceded the Series B by months",
    headline: "Pinecone — vector DB SDK to a $100M Series B at $750M",
    tagline:
      "Pinecone became the default RAG vector store in 2023; the $100M Series B in May 2024 followed a year of SDK adoption.",
    tldr:
      "pinecone-io/pinecone-python-client was the entry point into the most-cited vector database of the LLM era. The $100M Series B at $750M (May 2024) trailed sustained SDK adoption visible across LangChain and LlamaIndex tutorials.",
    narrative: [
      "Pinecone is the case study for vector databases as a category. The client repo is utilitarian; the real signal lived in RAG tutorial density — every major LLM-application tutorial in 2023 used Pinecone as the default vector store.",
      "By Q1 2024 the SDK install velocity matched a company that had crossed product-market fit cleanly. The Series B in May was a textbook follow-on round for an AI-infra category leader.",
      "The lesson: in AI infra, integration density in tutorials is a leading signal that compounds quietly until it becomes obvious — and then it's already late.",
    ],
    signals: [
      { label: "Tutorial integration density", value: "Default vector store in LangChain / LlamaIndex docs" },
      { label: "SDK install velocity", value: "Sustained pip-installs through 2023-2024" },
      { label: "API usage growth", value: "Reported in company blog posts and case studies" },
    ],
    citations: [
      {
        claim: "pinecone-io/pinecone-python-client is the canonical Python SDK.",
        sourceUrl: "https://github.com/pinecone-io/pinecone-python-client",
        sourceLabel: "pinecone-io/pinecone-python-client",
      },
      {
        claim: "Pinecone announced the Series B on its blog in May 2024.",
        sourceUrl: "https://www.pinecone.io/blog",
        sourceLabel: "Pinecone blog",
      },
    ],
    faqs: [
      {
        q: "What's the strongest signal for a vector DB?",
        a: "Tutorial integration density. Once a vector store becomes the default in LangChain or LlamaIndex examples, install velocity follows.",
      },
      {
        q: "How early was Pinecone obvious?",
        a: "By mid-2023, to anyone tracking RAG tutorials. The Series B in 2024 confirmed it.",
      },
    ],
    related: ["weaviate", "qdrant", "langchain"],
    keywords: ["Pinecone Series B", "vector database", "RAG", "LLM infrastructure"],
  },
  {
    slug: "weaviate",
    company: "Weaviate",
    primaryRepo: "weaviate/weaviate",
    repos: ["weaviate/weaviate"],
    sector: "AI / vector database",
    starsAtTrigger: "~7K stars at trigger window",
    triggerWindow: "first half 2023",
    raise: "$50M Series B (Index)",
    raiseDate: "2023-04-19",
    leadInvestor: "Index Ventures",
    timeToMoney:
      "OSS vector DB star slope ramped 6 months before the Series B",
    headline: "Weaviate — OSS vector database to a $50M Index Series B",
    tagline:
      "Weaviate's open-source vector database hit takeoff slope before Index Ventures led the $50M Series B.",
    tldr:
      "weaviate/weaviate compounded steadily through 2022 and the first half of 2023, hitting an inflection slope that preceded the Index-led $50M Series B in April 2023.",
    narrative: [
      "Weaviate is the open-source counter to Pinecone's hosted-first approach. The repo grew through 2022 with sustained release cadence, and the LLM wave in late 2022 hit just as Weaviate had matured the API for production use.",
      "By Q1 2023 the star slope, release cadence, and contributor count were all accelerating. Index Ventures led the Series B in April — well before the vector-DB category had stabilized.",
      "The 'OSS-first vector DB' pattern shows up across Qdrant, Milvus, and Chroma — Weaviate is the early breakout that mapped the category.",
    ],
    signals: [
      { label: "Star slope", value: "Inflection through late 2022 into Q1 2023" },
      { label: "Release cadence", value: "Multiple tagged releases per month" },
      { label: "LLM-wave timing", value: "Mature API at peak of LLM tutorial growth" },
    ],
    citations: [
      {
        claim: "weaviate/weaviate is the canonical OSS source.",
        sourceUrl: "https://github.com/weaviate/weaviate",
        sourceLabel: "weaviate/weaviate",
      },
      {
        claim: "Weaviate announced the Series B in April 2023.",
        sourceUrl: "https://weaviate.io/blog",
        sourceLabel: "Weaviate blog",
      },
    ],
    faqs: [
      {
        q: "Pinecone vs Weaviate — different signal shapes?",
        a: "Yes. Pinecone's signal was SDK install velocity; Weaviate's signal was star slope on the OSS engine. Different category positions surface different leading indicators.",
      },
    ],
    related: ["pinecone", "qdrant", "langchain"],
    keywords: ["Weaviate Series B", "Index Ventures", "vector database", "OSS LLM infrastructure"],
  },
  {
    slug: "qdrant",
    company: "Qdrant",
    primaryRepo: "qdrant/qdrant",
    repos: ["qdrant/qdrant"],
    sector: "AI / vector database",
    starsAtTrigger: "~15K stars at trigger window",
    triggerWindow: "late 2023",
    raise: "$28M Series A (Spark Capital)",
    raiseDate: "2024-01-23",
    leadInvestor: "Spark Capital",
    timeToMoney:
      "Rust-vector-DB performance benchmarks and star slope led the Series A",
    headline: "Qdrant — Rust-built vector DB to a $28M Spark Series A",
    tagline:
      "Qdrant's Rust implementation and growing community led the $28M Spark Capital Series A.",
    tldr:
      "qdrant/qdrant differentiated on Rust-native performance and open licensing. By late 2023 the star slope and benchmark-blog density made the Series A predictable; Spark led the $28M round in January 2024.",
    narrative: [
      "Qdrant entered the vector-DB market as the 'Rust performance' play. The repo's growth was steady through 2023, but the key signal was external — benchmark blog posts comparing Qdrant favorably to Pinecone and Weaviate started appearing across the AI-infra Twittersphere.",
      "Benchmark blog density is its own leading signal. When independent developers start running their own comparisons and publishing the results, the product is succeeding in a specific niche.",
      "Spark Capital led the $28M Series A in January 2024. The benchmark signal had been visible for at least six months.",
    ],
    signals: [
      { label: "Star slope", value: "~9K → 15K stars across 2023" },
      { label: "Benchmark density", value: "Independent perf comparisons published through 2023" },
      { label: "Rust-ecosystem positioning", value: "Featured in Rust crate-of-the-week lists" },
    ],
    citations: [
      {
        claim: "qdrant/qdrant is the canonical Rust source.",
        sourceUrl: "https://github.com/qdrant/qdrant",
        sourceLabel: "qdrant/qdrant",
      },
      {
        claim: "Qdrant announced the Series A in January 2024.",
        sourceUrl: "https://qdrant.tech/blog",
        sourceLabel: "Qdrant blog",
      },
    ],
    faqs: [
      {
        q: "How do you track 'benchmark density' systematically?",
        a: "Crawl dev blogs and aggregator feeds for the product name plus 'benchmark' or 'comparison'. Rolling-window counts identify breakouts.",
      },
    ],
    related: ["pinecone", "weaviate", "modal"],
    keywords: ["Qdrant Series A", "Spark Capital", "Rust vector DB", "vector database benchmarks"],
  },
  {
    slug: "anthropic",
    company: "Anthropic",
    primaryRepo: "anthropics/anthropic-sdk-python",
    repos: ["anthropics/anthropic-sdk-python"],
    sector: "AI / foundation model",
    starsAtTrigger: "SDK signal dominant; not a star-slope case",
    triggerWindow: "ongoing through 2024-2025",
    raise: "$60B+ valuation (Series E)",
    raiseDate: "2025-03-04",
    leadInvestor: "Series E",
    timeToMoney:
      "Anthropic's GitHub signal is in SDK install + integration density, not stars",
    headline: "Anthropic — SDK adoption to a $60B+ valuation",
    tagline:
      "Anthropic's GitHub signal lives in SDK installs and tool-integration density, not star slope — and that signal still led the $60B+ valuation.",
    tldr:
      "anthropics/anthropic-sdk-python is the canonical Python SDK. By 2024 it had become a default dependency in agent frameworks. The $60B+ valuation (March 2025) was the latest priced data point on a continuously growing SDK adoption curve.",
    narrative: [
      "Anthropic is the case study for foundation-model companies whose GitHub signal is downstream of the model's adoption. Stars on the SDK don't move the needle — install velocity does.",
      "Through 2024 the Anthropic Python SDK was added as a dependency in nearly every credible agent framework: LangChain, LlamaIndex, CrewAI, DSPy. That dependency-graph density is its own leading signal.",
      "The $60B+ valuation announced in March 2025 was a follow-on data point on a curve that had been steepening for two years.",
    ],
    signals: [
      { label: "SDK dependency adoption", value: "Default in agent frameworks by 2024" },
      { label: "Install velocity", value: "Sustained pip-installs through 2024" },
      { label: "Tool-call ecosystem", value: "MCP + tool calling ship as first-class features" },
    ],
    citations: [
      {
        claim: "anthropics/anthropic-sdk-python is the canonical Python SDK.",
        sourceUrl: "https://github.com/anthropics/anthropic-sdk-python",
        sourceLabel: "anthropics/anthropic-sdk-python",
      },
      {
        claim: "Anthropic published the funding announcement on the company site.",
        sourceUrl: "https://www.anthropic.com/news",
        sourceLabel: "Anthropic news",
      },
    ],
    faqs: [
      {
        q: "Can a deal-flow signal product track foundation-model rounds?",
        a: "Yes, but the signal type is different — dependency adoption and integration density, not star slope.",
      },
    ],
    related: ["openai", "mistral", "huggingface"],
    keywords: ["Anthropic Series E", "Anthropic Claude", "foundation model", "SDK signal"],
  },
  {
    slug: "mistral",
    company: "Mistral AI",
    primaryRepo: "mistralai/mistral-src",
    repos: ["mistralai/mistral-src"],
    sector: "AI / foundation model",
    starsAtTrigger: "~7K stars at trigger window; signal in release cadence",
    triggerWindow: "Q4 2023",
    raise: "$415M Series A (Andreessen Horowitz)",
    raiseDate: "2023-12-11",
    leadInvestor: "Andreessen Horowitz",
    timeToMoney:
      "Open weights release on torrent + repo opening preceded the Series A by weeks",
    headline: "Mistral AI — open-weights release to a $415M a16z Series A",
    tagline:
      "Mistral's open-weights model release in late 2023 was the engineering signal that preceded the a16z-led $415M Series A.",
    tldr:
      "mistralai/mistral-src and the company's October 2023 magnet-link release of model weights set a public benchmark in the open-weights category. The a16z-led $415M Series A closed in December.",
    narrative: [
      "Mistral's strategy in 2023 was to release open weights with an audacious distribution method — a magnet link tweet, not a polished blog post. The repo followed shortly after, and both moved together.",
      "By any standard the Series A was breathtaking — $415M for an early-stage team — but the public signal was unmistakable. Open-weights release on a credible model is the most concentrated kind of engineering signal possible.",
      "a16z led the round in December 2023. The signal had been visible for weeks.",
    ],
    signals: [
      { label: "Open-weights release", value: "Magnet-link torrent in October 2023" },
      { label: "Benchmark performance", value: "Competitive against Llama 2 7B" },
      { label: "Press density", value: "Concentrated coverage across AI dev publications" },
    ],
    citations: [
      {
        claim: "mistralai/mistral-src is the canonical model code repo.",
        sourceUrl: "https://github.com/mistralai/mistral-src",
        sourceLabel: "mistralai/mistral-src",
      },
      {
        claim: "Mistral announced the Series A on its blog in December 2023.",
        sourceUrl: "https://mistral.ai/news",
        sourceLabel: "Mistral news",
      },
    ],
    faqs: [
      {
        q: "Is the magnet-link release a generalizable pattern?",
        a: "Only for teams with serious public credibility. The point is that a credible open-weights release is itself a deal-flow signal.",
      },
    ],
    related: ["anthropic", "openai", "huggingface"],
    keywords: ["Mistral Series A", "a16z Mistral", "open-weights model", "AI foundation model"],
  },
  {
    slug: "planetscale",
    company: "PlanetScale",
    primaryRepo: "planetscale/cli",
    repos: ["planetscale/cli"],
    sector: "Database / serverless MySQL",
    starsAtTrigger: "CLI star count modest; signal in customer growth",
    triggerWindow: "late 2021 / early 2022",
    raise: "$50M Series C ($1B valuation)",
    raiseDate: "2022-02-15",
    leadInvestor: "Series C at $1B",
    timeToMoney:
      "CLI usage growth + Next.js partnership coverage led the Series C",
    headline: "PlanetScale — serverless MySQL to a $50M Series C at $1B",
    tagline:
      "PlanetScale's CLI repo was modest; the partnership-density signal preceded the Series C unicorn round.",
    tldr:
      "planetscale/cli was the public-facing repo, but the real signal was the partnership-announcement density — Next.js, Prisma, Vercel all featured PlanetScale in tutorials by late 2021. The $50M Series C at $1B priced in February 2022.",
    narrative: [
      "PlanetScale's GitHub footprint is intentionally small — the product is a hosted MySQL service. The CLI repo carried the technical brand, but the *real* signal was partnership-announcement density.",
      "By late 2021 PlanetScale was the recommended database in Next.js + Prisma tutorials, with co-marketing across the dev-tool ecosystem. That kind of partnership density is a strong leading indicator for SaaS rounds.",
      "The $50M Series C at $1B closed in February 2022 — a unicorn-tier outcome on top of a signal that had been visible in the partnership graph for a year.",
    ],
    signals: [
      { label: "Partnership density", value: "Co-marketing with Next.js, Prisma, Vercel" },
      { label: "CLI release cadence", value: "Steady tagged releases through 2021-2022" },
      { label: "Tutorial inclusion", value: "Default Next.js database pick in many tutorials" },
    ],
    citations: [
      {
        claim: "planetscale/cli is the canonical CLI source.",
        sourceUrl: "https://github.com/planetscale/cli",
        sourceLabel: "planetscale/cli",
      },
      {
        claim: "PlanetScale announced the Series C on its blog in February 2022.",
        sourceUrl: "https://planetscale.com/blog",
        sourceLabel: "PlanetScale blog",
      },
    ],
    faqs: [
      {
        q: "How does 'partnership density' translate to a signal?",
        a: "Count co-marketed launches per quarter. A rising count over 12 months is one of the strongest predictors of priced rounds for SaaS-tier companies.",
      },
    ],
    related: ["supabase", "neon", "prisma"],
    keywords: ["PlanetScale Series C", "serverless MySQL", "database partnerships"],
  },
  {
    slug: "replit",
    company: "Replit",
    primaryRepo: "replit/replit-py",
    repos: ["replit/replit-py"],
    sector: "Dev tools / cloud IDE",
    starsAtTrigger: "Brand SDK visibility; signal in user count + AI launches",
    triggerWindow: "early 2023",
    raise: "$97M Series B ($1.16B valuation)",
    raiseDate: "2023-04-25",
    leadInvestor: "Series B at $1.16B",
    timeToMoney:
      "Ghostwriter AI launch + DAU growth led the Series B by a quarter",
    headline: "Replit — cloud IDE + AI to a $97M Series B at $1.16B",
    tagline:
      "Replit shipped Ghostwriter and crossed major DAU milestones before the Series B priced at $1.16B.",
    tldr:
      "replit/replit-py is the public SDK; the real engineering signal was the velocity of Replit's AI launches in late 2022 and early 2023 — Ghostwriter, ReplitDB, and template proliferation. The Series B closed in April 2023 at $1.16B.",
    narrative: [
      "Replit's case is about *product launch velocity* as a signal. The Python SDK repo carried brand visibility, but the breakthrough was the cadence of new AI-feature launches in Q4 2022 and Q1 2023.",
      "Ghostwriter (Replit's code-completion AI) was an early entry in what would become the AI coding assistant category. Pairing that with template growth and educational deals gave Replit a multi-vector signal.",
      "The $97M Series B at $1.16B in April 2023 was the priced confirmation. The launch-cadence signal had been visible for a full quarter.",
    ],
    signals: [
      { label: "AI feature launches", value: "Ghostwriter + ReplitDB through Q4 2022 / Q1 2023" },
      { label: "Template growth", value: "Public-template directory expansion" },
      { label: "Education partnerships", value: "Edu deals announced ahead of Series B" },
    ],
    citations: [
      {
        claim: "replit/replit-py is one of the public SDK repos.",
        sourceUrl: "https://github.com/replit/replit-py",
        sourceLabel: "replit/replit-py",
      },
      {
        claim: "Replit announced the Series B on its blog in April 2023.",
        sourceUrl: "https://blog.replit.com",
        sourceLabel: "Replit blog",
      },
    ],
    faqs: [
      {
        q: "How is 'launch velocity' measurable from outside?",
        a: "Count product-launch blog posts per quarter. Acceleration in launch count is a leading signal for priced rounds.",
      },
    ],
    related: ["cursor", "vercel", "modal"],
    keywords: ["Replit Series B", "cloud IDE", "Ghostwriter AI", "developer tools"],
  },
  {
    slug: "sentry",
    company: "Sentry",
    primaryRepo: "getsentry/sentry",
    repos: ["getsentry/sentry"],
    sector: "Dev tools / observability",
    starsAtTrigger: "~35K stars at trigger window",
    triggerWindow: "first half 2022",
    raise: "$90M Series E ($3B valuation)",
    raiseDate: "2022-07-12",
    leadInvestor: "Series E at $3B",
    timeToMoney:
      "Long-running OSS + paid SaaS funnel; signal was the *sustained* multi-year acceleration",
    headline: "Sentry — OSS error monitoring to a $90M Series E at $3B",
    tagline:
      "Sentry's open-source error monitoring engine compounded for years before the $90M Series E priced at $3B.",
    tldr:
      "getsentry/sentry has run the longest sustained OSS-funnel-to-paid-SaaS funnel of any developer tool. The July 2022 Series E at $3B was a late-cycle confirmation of a multi-year compounding curve.",
    narrative: [
      "Sentry is the slow-burn case. The repo had been around for over a decade by the time the Series E closed; the signal here was not a breakout but a *sustained* acceleration across SDK installs, release cadence, and customer logo growth.",
      "By Q2 2022 the SDK install velocity and the on-prem-customer reference list had both crossed thresholds that institutional growth investors recognize as priced-round territory.",
      "The $90M Series E at $3B in July 2022 closed an era. The lesson: not every signal is a breakout — some are 10-year compounding curves that pay off at the end.",
    ],
    signals: [
      { label: "Multi-year star slope", value: "Sustained 30K+ stars at trigger" },
      { label: "SDK install density", value: "Default error tracker across language ecosystems" },
      { label: "Customer logo growth", value: "Public on-prem reference list" },
    ],
    citations: [
      {
        claim: "getsentry/sentry is the canonical OSS error monitoring engine.",
        sourceUrl: "https://github.com/getsentry/sentry",
        sourceLabel: "getsentry/sentry",
      },
      {
        claim: "Sentry announced the Series E on its blog in July 2022.",
        sourceUrl: "https://blog.sentry.io",
        sourceLabel: "Sentry blog",
      },
    ],
    faqs: [
      {
        q: "Is the 'slow burn' pattern still investable?",
        a: "Yes — many of the largest dev-tool outcomes are slow-burn. The signal is multi-year sustained acceleration, not single-quarter breakouts.",
      },
    ],
    related: ["posthog", "grafana", "dbt-labs"],
    keywords: ["Sentry Series E", "error monitoring", "observability", "OSS SaaS funnel"],
  },
  {
    slug: "grafana",
    company: "Grafana Labs",
    primaryRepo: "grafana/grafana",
    repos: ["grafana/grafana"],
    sector: "Observability / dashboards",
    starsAtTrigger: "~55K stars at trigger window",
    triggerWindow: "late 2021 / early 2022",
    raise: "$240M Series D ($6B valuation)",
    raiseDate: "2022-04-13",
    leadInvestor: "Series D at $6B",
    timeToMoney:
      "Star count alone underwrote the round; sustained acceleration over 8 years",
    headline: "Grafana — OSS dashboards to a $240M Series D at $6B",
    tagline:
      "Grafana's repo crossed 55K stars before the $240M Series D priced at a $6B valuation.",
    tldr:
      "grafana/grafana is one of the most-starred dev-tool repos ever. The Series D in April 2022 at $6B was an unsurprising priced confirmation of a category-leading OSS platform.",
    narrative: [
      "Grafana is the archetypal OSS dashboard tool. The repo's star count alone — over 55K at the time of the Series D — would have flagged it as a category leader to any sourcing system.",
      "What made the Series D priceable at $6B was the *combination* of OSS leadership and enterprise-tier customer references. Grafana Cloud had been growing into a serious paid offering through 2021.",
      "The $240M Series D in April 2022 capped a multi-year story. The lesson: very-high-star OSS dev tools almost always end up priced at unicorn-or-better multiples.",
    ],
    signals: [
      { label: "Star count", value: "Over 55K stars at the round" },
      { label: "Enterprise customer logo wall", value: "Public on Grafana Labs site" },
      { label: "Plugin ecosystem", value: "Hundreds of community plugins" },
    ],
    citations: [
      {
        claim: "grafana/grafana is the canonical OSS dashboard engine.",
        sourceUrl: "https://github.com/grafana/grafana",
        sourceLabel: "grafana/grafana",
      },
      {
        claim: "Grafana announced the Series D on its blog in April 2022.",
        sourceUrl: "https://grafana.com/blog",
        sourceLabel: "Grafana blog",
      },
    ],
    faqs: [
      {
        q: "Does raw star count still carry signal?",
        a: "For developer tools with mature OSS funnels — yes. A repo above 50K stars in a sustainable category is a strong predictor of unicorn-tier outcomes.",
      },
    ],
    related: ["sentry", "dbt-labs", "posthog"],
    keywords: ["Grafana Series D", "OSS dashboards", "observability"],
  },
  {
    slug: "dbt-labs",
    company: "dbt Labs",
    primaryRepo: "dbt-labs/dbt-core",
    repos: ["dbt-labs/dbt-core"],
    sector: "Data engineering",
    starsAtTrigger: "~6K stars at trigger window; signal in adoption density",
    triggerWindow: "late 2021",
    raise: "$222M Series D ($4.2B valuation)",
    raiseDate: "2022-02-23",
    leadInvestor: "Series D at $4.2B",
    timeToMoney:
      "Conference + community signal led the Series D by quarters",
    headline: "dbt Labs — data transformation to a $222M Series D at $4.2B",
    tagline:
      "dbt's OSS transformation engine plus dbt Cloud subscriptions priced the $222M Series D at $4.2B.",
    tldr:
      "dbt-labs/dbt-core was the OSS engine that anchored a hosted SaaS (dbt Cloud) and a growing community (Coalesce conference). The Series D in February 2022 at $4.2B was the priced confirmation.",
    narrative: [
      "dbt's case is about *community signal*. The repo's star count was lower than its category leadership suggested — the real metric was the size of the dbt community (Slack, Coalesce conference, certification programs).",
      "By late 2021 the community had crossed thresholds that mark category leadership. The Series D in February 2022 priced at $4.2B — among the highest data-tooling valuations of the era.",
      "The lesson: for data tooling, community size leads star count as a signal. Track conference attendance, Slack member growth, and certification volumes.",
    ],
    signals: [
      { label: "Slack community size", value: "Tens of thousands of members" },
      { label: "Coalesce conference scale", value: "Annual conference growing every year" },
      { label: "Certification volume", value: "Growing public certification cohort" },
    ],
    citations: [
      {
        claim: "dbt-labs/dbt-core is the canonical OSS transformation engine.",
        sourceUrl: "https://github.com/dbt-labs/dbt-core",
        sourceLabel: "dbt-labs/dbt-core",
      },
      {
        claim: "dbt Labs announced the Series D on its blog in February 2022.",
        sourceUrl: "https://www.getdbt.com/blog",
        sourceLabel: "dbt blog",
      },
    ],
    faqs: [
      {
        q: "What's the strongest signal for data tooling?",
        a: "Community scale. Slack member growth, conference attendance, certification volumes — all lead priced rounds in data tooling.",
      },
    ],
    related: ["airbyte", "dagster", "airflow-astronomer"],
    keywords: ["dbt Labs Series D", "data engineering", "dbt Cloud"],
  },
  {
    slug: "airbyte",
    company: "Airbyte",
    primaryRepo: "airbytehq/airbyte",
    repos: ["airbytehq/airbyte"],
    sector: "Data engineering / ETL",
    starsAtTrigger: "~8K stars; signal in connector count",
    triggerWindow: "second half 2021",
    raise: "$150M Series B ($1.5B valuation)",
    raiseDate: "2021-12-13",
    leadInvestor: "Series B at $1.5B",
    timeToMoney: "Connector growth led the Series B by quarters",
    headline: "Airbyte — OSS ETL connectors to a $150M Series B at $1.5B",
    tagline:
      "Airbyte's connector library proliferation led the $150M Series B at $1.5B.",
    tldr:
      "airbytehq/airbyte's value lived in connector count — by late 2021 the catalog had crossed 100+ open-source connectors, a leading signal for the $150M Series B that closed at $1.5B in December.",
    narrative: [
      "Airbyte chose breadth over depth: ship every possible connector, let the community fill gaps, and price the round on coverage. By late 2021 the connector count had crossed 100 — a measurable, growing signal of OSS adoption.",
      "Connector-count growth is a strong leading indicator for ETL companies because each new connector reflects either internal velocity or community contribution. Either way, the signal is real.",
      "The $150M Series B at $1.5B in December 2021 was an aggressive price; the connector-growth curve underwrote it.",
    ],
    signals: [
      { label: "Connector count", value: "100+ at trigger window, climbing weekly" },
      { label: "Community contributions", value: "Steady community-submitted connectors" },
      { label: "Release cadence", value: "Frequent tagged releases" },
    ],
    citations: [
      {
        claim: "airbytehq/airbyte is the canonical OSS source.",
        sourceUrl: "https://github.com/airbytehq/airbyte",
        sourceLabel: "airbytehq/airbyte",
      },
      {
        claim: "Airbyte announced the Series B on its blog in December 2021.",
        sourceUrl: "https://airbyte.com/blog",
        sourceLabel: "Airbyte blog",
      },
    ],
    faqs: [
      {
        q: "Is connector-count a generalizable signal?",
        a: "For ETL and integration platforms — yes. It's the closest public proxy to product surface area.",
      },
    ],
    related: ["dbt-labs", "dagster", "airflow-astronomer"],
    keywords: ["Airbyte Series B", "OSS ETL", "data connectors"],
  },
  {
    slug: "n8n",
    company: "n8n",
    primaryRepo: "n8n-io/n8n",
    repos: ["n8n-io/n8n"],
    sector: "Workflow automation",
    starsAtTrigger: "~25K stars at trigger window",
    triggerWindow: "second half 2021",
    raise: "$12M Series A",
    raiseDate: "2021-12-08",
    leadInvestor: "Series A",
    timeToMoney: "Star slope and Zapier-alternative tutorial density",
    headline: "n8n — OSS workflow automation to a $12M Series A",
    tagline:
      "n8n's Zapier-alternative positioning and OSS workflow engine led the $12M Series A in late 2021.",
    tldr:
      "n8n-io/n8n grew steadily through 2021 as the leading OSS Zapier alternative. The $12M Series A in December was the priced confirmation.",
    narrative: [
      "n8n's positioning was clear: be the OSS Zapier alternative. The repo grew through 2021 with steady release cadence and a growing template library.",
      "Tutorial density on the 'self-hosted Zapier alternative' search term peaked in mid-2021. By the time of the Series A, n8n was the default recommendation.",
      "The $12M Series A in December 2021 was the priced confirmation of a category-positioning story that had been building for years.",
    ],
    signals: [
      { label: "Star slope", value: "Sustained 20K+ → 25K stars in 2021" },
      { label: "Category positioning", value: "Default 'self-hosted Zapier alternative' pick" },
      { label: "Template library", value: "Growing community-shared workflows" },
    ],
    citations: [
      {
        claim: "n8n-io/n8n is the canonical workflow engine.",
        sourceUrl: "https://github.com/n8n-io/n8n",
        sourceLabel: "n8n-io/n8n",
      },
      {
        claim: "n8n announced the Series A on its blog in December 2021.",
        sourceUrl: "https://n8n.io/blog",
        sourceLabel: "n8n blog",
      },
    ],
    faqs: [
      {
        q: "How do you track 'category positioning'?",
        a: "Search-query share for 'X alternative' or 'self-hosted X' over time. A rising share is a leading signal.",
      },
    ],
    related: ["inngest", "trigger-dev", "windmill"],
    keywords: ["n8n Series A", "Zapier alternative", "workflow automation"],
  },
  {
    slug: "hasura",
    company: "Hasura",
    primaryRepo: "hasura/graphql-engine",
    repos: ["hasura/graphql-engine"],
    sector: "GraphQL / database tooling",
    starsAtTrigger: "~25K stars at trigger window",
    triggerWindow: "late 2021",
    raise: "$100M Series C ($1B valuation)",
    raiseDate: "2022-02-09",
    leadInvestor: "Series C at $1B",
    timeToMoney: "OSS engine slope + Hasura Cloud signups led the Series C",
    headline: "Hasura — GraphQL engine to a $100M Series C at $1B",
    tagline:
      "Hasura's GraphQL engine became the default 'instant GraphQL' tool before the $100M Series C priced the company at $1B.",
    tldr:
      "hasura/graphql-engine had 25K+ stars and a category-leading position by late 2021. The $100M Series C in February 2022 priced at a unicorn.",
    narrative: [
      "Hasura's positioning is unusual: an OSS engine that auto-generates GraphQL from a Postgres database. The combination of OSS + hosted Cloud created a multi-channel funnel.",
      "By late 2021 the star slope had plateaued at a high level, but the *Hasura Cloud* signup signal was accelerating. That secondary signal carried the round.",
      "The $100M Series C at $1B in February 2022 was the priced confirmation. The lesson: when stars plateau, look for the hosted-service signal.",
    ],
    signals: [
      { label: "Star plateau", value: "Sustained 25K+ stars at trigger" },
      { label: "Hasura Cloud signal", value: "Hosted-service signup growth through 2021" },
      { label: "Connector ecosystem", value: "Growing list of supported databases" },
    ],
    citations: [
      {
        claim: "hasura/graphql-engine is the canonical OSS engine.",
        sourceUrl: "https://github.com/hasura/graphql-engine",
        sourceLabel: "hasura/graphql-engine",
      },
      {
        claim: "Hasura announced the Series C on its blog in February 2022.",
        sourceUrl: "https://hasura.io/blog",
        sourceLabel: "Hasura blog",
      },
    ],
    faqs: [
      {
        q: "Why does star plateau matter as a signal?",
        a: "Because mature OSS dev tools often plateau in stars while paid-tier signal accelerates. Tracking both surfaces gives a fuller picture.",
      },
    ],
    related: ["supabase", "prisma", "planetscale"],
    keywords: ["Hasura Series C", "GraphQL engine", "instant API"],
  },
  {
    slug: "strapi",
    company: "Strapi",
    primaryRepo: "strapi/strapi",
    repos: ["strapi/strapi"],
    sector: "Headless CMS",
    starsAtTrigger: "~45K stars at trigger window",
    triggerWindow: "first half 2021",
    raise: "$31M Series B",
    raiseDate: "2021-09-23",
    leadInvestor: "Series B",
    timeToMoney: "Multi-year sustained slope as the leading OSS CMS",
    headline: "Strapi — OSS headless CMS to a $31M Series B",
    tagline:
      "Strapi's headless CMS crossed 45K stars before the $31M Series B closed.",
    tldr:
      "strapi/strapi was already the default OSS headless CMS by 2021. The $31M Series B in September was a clean priced confirmation of a multi-year story.",
    narrative: [
      "Strapi's case is the slow-and-steady OSS dev tool — no breakout, just compounding adoption. By 2021 the repo was the default OSS pick in the headless-CMS category.",
      "The signal here was sustained acceleration over five-plus years, plus a Strapi Cloud beta that hinted at paid-tier traction.",
      "The $31M Series B in September 2021 was a textbook follow-on round on a category leader.",
    ],
    signals: [
      { label: "Star slope", value: "Multi-year sustained growth to 45K+ stars" },
      { label: "Plugin ecosystem", value: "Hundreds of community plugins" },
      { label: "Strapi Cloud beta", value: "Hinted at paid-tier traction" },
    ],
    citations: [
      {
        claim: "strapi/strapi is the canonical OSS CMS.",
        sourceUrl: "https://github.com/strapi/strapi",
        sourceLabel: "strapi/strapi",
      },
      {
        claim: "Strapi announced the Series B on its blog in September 2021.",
        sourceUrl: "https://strapi.io/blog",
        sourceLabel: "Strapi blog",
      },
    ],
    faqs: [
      {
        q: "Is multi-year slope still a winning signal?",
        a: "Yes. Many of the largest dev-tool outcomes are sustained multi-year compounders, not breakouts.",
      },
    ],
    related: ["sanity", "appsmith", "tooljet"],
    keywords: ["Strapi Series B", "headless CMS", "OSS CMS"],
  },
  {
    slug: "posthog",
    company: "PostHog",
    primaryRepo: "PostHog/posthog",
    repos: ["PostHog/posthog"],
    sector: "Product analytics",
    starsAtTrigger: "~9K stars at trigger window; YC backing",
    triggerWindow: "second half 2021",
    raise: "$15M Series B (Y Combinator)",
    raiseDate: "2021-10-12",
    leadInvestor: "Y Combinator (Series B)",
    timeToMoney: "OSS analytics positioning + customer growth led the Series B",
    headline: "PostHog — OSS analytics to a $15M YC Series B",
    tagline:
      "PostHog's open-source product analytics engine and YC backing priced the $15M Series B in late 2021.",
    tldr:
      "PostHog/posthog grew through 2021 as the OSS Amplitude/Mixpanel alternative. The $15M YC Series B in October was the priced confirmation.",
    narrative: [
      "PostHog's positioning is 'OSS Amplitude' — same product surface, open-source license, self-hostable. By late 2021 the repo had crossed 9K stars and customer logos were public.",
      "The signal was multi-modal: stars, customer references, plugin ecosystem, and YC backing. Each one weak alone; together strong.",
      "The $15M Series B in October 2021 led by YC was the priced confirmation of a clear category-positioning play.",
    ],
    signals: [
      { label: "OSS positioning", value: "Default 'OSS Amplitude' recommendation" },
      { label: "Customer logo growth", value: "Public references on landing page" },
      { label: "YC backing", value: "Strong network signal" },
    ],
    citations: [
      {
        claim: "PostHog/posthog is the canonical OSS analytics engine.",
        sourceUrl: "https://github.com/PostHog/posthog",
        sourceLabel: "PostHog/posthog",
      },
      {
        claim: "PostHog announced the Series B on its blog in October 2021.",
        sourceUrl: "https://posthog.com/blog",
        sourceLabel: "PostHog blog",
      },
    ],
    faqs: [
      {
        q: "How does YC backing change the signal?",
        a: "It amplifies it. Network effects on YC-backed OSS tools tend to compound — both via internal-batch adoption and via Y Combinator's broader brand reach.",
      },
    ],
    related: ["sentry", "grafana", "appsmith"],
    keywords: ["PostHog Series B", "Y Combinator PostHog", "OSS analytics"],
  },
  {
    slug: "sanity",
    company: "Sanity.io",
    primaryRepo: "sanity-io/sanity",
    repos: ["sanity-io/sanity"],
    sector: "Headless CMS / content platform",
    starsAtTrigger: "~4K stars at trigger window; signal in usage growth",
    triggerWindow: "first half 2022",
    raise: "$39M Series C",
    raiseDate: "2022-09-13",
    leadInvestor: "Series C",
    timeToMoney: "Studio adoption and partnership density led the round",
    headline: "Sanity.io — structured content platform to a $39M Series C",
    tagline:
      "Sanity's structured content + customizable studio approach led the $39M Series C in September 2022.",
    tldr:
      "sanity-io/sanity was the public face of a hosted content platform with a customizable open-source studio. The $39M Series C in September 2022 followed a year of accelerating Studio adoption.",
    narrative: [
      "Sanity's product is mostly hosted, but the Studio is OSS. That hybrid creates a smaller repo footprint than peer CMSes — and a different signal shape.",
      "The leading signal was Studio adoption inside agency portfolios. By Q2 2022 Sanity was the recommended structured-content backend for many high-end front-end studios.",
      "The $39M Series C in September 2022 closed an adoption story that had been building in the front-end design ecosystem for years.",
    ],
    signals: [
      { label: "Studio adoption", value: "Default content backend in agency portfolios" },
      { label: "Partnership density", value: "Co-marketing with Next.js, Gatsby, Astro" },
      { label: "Release cadence", value: "Steady tagged releases on the Studio repo" },
    ],
    citations: [
      {
        claim: "sanity-io/sanity is the canonical Studio source.",
        sourceUrl: "https://github.com/sanity-io/sanity",
        sourceLabel: "sanity-io/sanity",
      },
      {
        claim: "Sanity announced the Series C on its blog in September 2022.",
        sourceUrl: "https://www.sanity.io/blog",
        sourceLabel: "Sanity blog",
      },
    ],
    faqs: [
      {
        q: "How is 'agency portfolio adoption' measurable?",
        a: "Scan public portfolios of front-end agencies for mentions of the backend they use. Rising counts over rolling windows is a leading signal.",
      },
    ],
    related: ["strapi", "builder-io", "remotion"],
    keywords: ["Sanity Series C", "structured content", "headless CMS"],
  },
  {
    slug: "calcom",
    company: "Cal.com",
    primaryRepo: "calcom/cal.com",
    repos: ["calcom/cal.com"],
    sector: "Scheduling / OSS SaaS",
    starsAtTrigger: "~30K stars at trigger window",
    triggerWindow: "first half 2024",
    raise: "$32M Series B (Sequoia)",
    raiseDate: "2024-09-17",
    leadInvestor: "Sequoia",
    timeToMoney: "OSS scheduling slope + dev-influencer adoption led the round",
    headline: "Cal.com — OSS scheduling to a $32M Sequoia Series B",
    tagline:
      "Cal.com's open-source Calendly alternative crossed adoption thresholds before Sequoia led the $32M Series B.",
    tldr:
      "calcom/cal.com grew steadily through 2023 and into 2024, hitting 30K+ stars and adoption by major dev-influencers. Sequoia's $32M Series B in September 2024 was the priced confirmation.",
    narrative: [
      "Cal.com's positioning is the OSS Calendly. The repo carried a steady star slope and a high-energy maintainer presence on dev Twitter — both signals.",
      "By early 2024 the dev-influencer adoption signal was strong: a recognizable list of public developers using Cal.com for their booking pages. That public reference list is its own leading indicator.",
      "Sequoia's $32M Series B in September 2024 closed an adoption story driven by dev-community endorsement as much as by the repo activity itself.",
    ],
    signals: [
      { label: "Star slope", value: "~22K → 30K stars in 12 months" },
      { label: "Dev-influencer adoption", value: "Public booking pages for high-visibility devs" },
      { label: "Release cadence", value: "Weekly tagged releases" },
    ],
    citations: [
      {
        claim: "calcom/cal.com is the canonical OSS scheduling engine.",
        sourceUrl: "https://github.com/calcom/cal.com",
        sourceLabel: "calcom/cal.com",
      },
      {
        claim: "Cal.com announced the Series B on its blog in September 2024.",
        sourceUrl: "https://cal.com/blog",
        sourceLabel: "Cal.com blog",
      },
    ],
    faqs: [
      {
        q: "Is dev-influencer adoption a generalizable signal?",
        a: "Yes — when measured systematically. Track public profile pages for prominent devs and watch for product usage.",
      },
    ],
    related: ["linear", "posthog", "supabase"],
    keywords: ["Cal.com Series B", "Sequoia Cal.com", "OSS Calendly"],
  },
  {
    slug: "appsmith",
    company: "Appsmith",
    primaryRepo: "appsmithorg/appsmith",
    repos: ["appsmithorg/appsmith"],
    sector: "Low-code / internal tools",
    starsAtTrigger: "~25K stars at trigger window",
    triggerWindow: "first half 2022",
    raise: "$41M Series B (Insight Partners)",
    raiseDate: "2022-08-23",
    leadInvestor: "Insight Partners",
    timeToMoney: "OSS Retool alternative slope + enterprise interest led the Series B",
    headline: "Appsmith — OSS internal tools builder to a $41M Insight Series B",
    tagline:
      "Appsmith's OSS Retool alternative grew through 2022 before Insight Partners priced the $41M Series B.",
    tldr:
      "appsmithorg/appsmith hit 25K+ stars as the leading OSS internal-tools builder by mid-2022. The $41M Insight-led Series B in August was the priced confirmation.",
    narrative: [
      "Appsmith targeted the OSS internal-tools market — same surface as Retool, open license, self-hostable. The repo grew through 2022 with steady release cadence and a growing widget library.",
      "Enterprise interest was the leading signal. Self-hosted-Retool-alternative searches were trending up across enterprise dev communities through the first half of 2022.",
      "Insight Partners led the $41M Series B in August 2022. The enterprise-self-hosting signal was clear by then.",
    ],
    signals: [
      { label: "Star slope", value: "Sustained 20K → 25K+ growth through 2022" },
      { label: "Widget library expansion", value: "Steady growth in supported components" },
      { label: "Enterprise interest", value: "Self-hosted-alternative search trend" },
    ],
    citations: [
      {
        claim: "appsmithorg/appsmith is the canonical OSS source.",
        sourceUrl: "https://github.com/appsmithorg/appsmith",
        sourceLabel: "appsmithorg/appsmith",
      },
      {
        claim: "Appsmith announced the Series B on its blog in August 2022.",
        sourceUrl: "https://www.appsmith.com/blog",
        sourceLabel: "Appsmith blog",
      },
    ],
    faqs: [
      {
        q: "Does the 'OSS X-alternative' pattern always work?",
        a: "Not always — but when the closed-source incumbent is in a strong category and self-hosting is genuinely desired, it can produce serious outcomes.",
      },
    ],
    related: ["tooljet", "windmill", "strapi"],
    keywords: ["Appsmith Series B", "Insight Partners", "low-code", "internal tools"],
  },
  {
    slug: "remotion",
    company: "Remotion",
    primaryRepo: "remotion-dev/remotion",
    repos: ["remotion-dev/remotion"],
    sector: "Video / programmatic media",
    starsAtTrigger: "~17K stars at trigger window",
    triggerWindow: "ongoing through 2023-2024",
    raise: "Mass adoption / VC-backed",
    raiseDate: "2024-01-01",
    leadInvestor: "VC-backed (community-funded + private)",
    timeToMoney: "Steady star slope + programmatic-video category creation",
    headline: "Remotion — programmatic video to mass adoption",
    tagline:
      "Remotion built the programmatic-video category from scratch; the GitHub signal compounded for years.",
    tldr:
      "remotion-dev/remotion is the React-based programmatic video framework. By 2024 it had 17K+ stars and was the de-facto standard for programmatic video generation — VC-backed by then.",
    narrative: [
      "Remotion's pitch was a category that didn't exist: video as React components. The repo grew slowly but consistently from 2020 onward, with no obvious breakout moment.",
      "The signal here is *category creation*. Remotion turned 'video' into a programmable medium for React developers — a different shape of signal than star-slope breakout.",
      "By 2024 the company was VC-backed and the framework was the default for programmatic video. The GitHub signal had been pointing this way for years.",
    ],
    signals: [
      { label: "Star slope", value: "Sustained growth to 17K+ stars over 4 years" },
      { label: "Category creation", value: "Programmatic-video category as React-component DSL" },
      { label: "Template gallery", value: "Growing public templates ecosystem" },
    ],
    citations: [
      {
        claim: "remotion-dev/remotion is the canonical source.",
        sourceUrl: "https://github.com/remotion-dev/remotion",
        sourceLabel: "remotion-dev/remotion",
      },
      {
        claim: "Remotion documents its commercial model on its site.",
        sourceUrl: "https://www.remotion.dev",
        sourceLabel: "Remotion homepage",
      },
    ],
    faqs: [
      {
        q: "How do you signal 'category creation'?",
        a: "Watch for repos that define new terms in their README that other repos start adopting. Search-term coinage over rolling windows is a useful proxy.",
      },
    ],
    related: ["builder-io", "vercel", "astro"],
    keywords: ["Remotion", "programmatic video", "React video", "category creation"],
  },
  {
    slug: "builder-io",
    company: "Builder.io",
    primaryRepo: "BuilderIO/qwik",
    repos: ["BuilderIO/builder", "BuilderIO/qwik"],
    sector: "Visual CMS / framework",
    starsAtTrigger: "Two-repo signal — Builder + Qwik",
    triggerWindow: "Q1 2022",
    raise: "$20M Series A",
    raiseDate: "2022-04-19",
    leadInvestor: "Series A",
    timeToMoney: "Qwik launch + Builder.io visual editor adoption",
    headline: "Builder.io — visual CMS + Qwik framework to a $20M Series A",
    tagline:
      "Builder.io's drag-and-drop CMS plus the Qwik framework launch led the $20M Series A in April 2022.",
    tldr:
      "BuilderIO/builder is the drag-and-drop CMS; BuilderIO/qwik is the resumability-first framework. The April 2022 $20M Series A followed both signals compounding.",
    narrative: [
      "Builder.io ran two parallel plays: the headless visual CMS (Builder) and the Qwik framework. Each had its own signal shape.",
      "Qwik's resumability story was technically credible and drew enthusiastic dev-community attention in late 2021. That signal alone would have flagged the company.",
      "The $20M Series A in April 2022 priced both bets together — a dual-engine company with two complementary funnels.",
    ],
    signals: [
      { label: "Qwik launch buzz", value: "Concentrated dev-Twitter coverage late 2021" },
      { label: "Builder.io visual editor adoption", value: "Used in major e-commerce site builders" },
      { label: "Release cadence", value: "Both repos with steady tagged releases" },
    ],
    citations: [
      {
        claim: "BuilderIO/qwik is the canonical Qwik framework repo.",
        sourceUrl: "https://github.com/BuilderIO/qwik",
        sourceLabel: "BuilderIO/qwik",
      },
      {
        claim: "BuilderIO/builder is the visual CMS source.",
        sourceUrl: "https://github.com/BuilderIO/builder",
        sourceLabel: "BuilderIO/builder",
      },
      {
        claim: "Builder.io announced the Series A on its blog in April 2022.",
        sourceUrl: "https://www.builder.io/blog",
        sourceLabel: "Builder.io blog",
      },
    ],
    faqs: [
      {
        q: "Why pair a CMS with a framework launch?",
        a: "Because the framework drives developer attention; the CMS converts it into paid usage. The combination is a developer-and-commerce funnel.",
      },
    ],
    related: ["sanity", "vercel", "astro"],
    keywords: ["Builder.io Series A", "Qwik framework", "visual CMS", "resumability"],
  },
  {
    slug: "deno",
    company: "Deno",
    primaryRepo: "denoland/deno",
    repos: ["denoland/deno"],
    sector: "Dev tools / JS runtime",
    starsAtTrigger: "~85K stars at trigger window",
    triggerWindow: "first half 2022",
    raise: "$21M Series A (Sequoia)",
    raiseDate: "2022-06-21",
    leadInvestor: "Sequoia",
    timeToMoney: "Multi-year runtime star count + Deno Deploy launch",
    headline: "Deno — Node.js alternative runtime to a $21M Sequoia Series A",
    tagline:
      "Deno's runtime crossed 85K stars and shipped Deno Deploy before Sequoia priced the $21M Series A.",
    tldr:
      "denoland/deno had been compounding stars since 2018. The $21M Sequoia Series A in June 2022 came after Deno Deploy's launch demonstrated a paid-tier path.",
    narrative: [
      "Deno's signal is unusual: very high star count (85K+) since the runtime was first announced, with slower star slope but steady adoption. The breakthrough was the Deno Deploy hosted edge platform.",
      "Sequoia's Series A in June 2022 was priced as much on the Deno Deploy strategy as on the runtime itself. The combination of strong OSS brand + hosted commercial play is a recurring pattern.",
      "The lesson: very-high star count plus a commercial-tier launch is one of the most predictable patterns for institutional rounds.",
    ],
    signals: [
      { label: "Star count", value: "85K+ stars at trigger" },
      { label: "Deno Deploy launch", value: "Hosted edge platform announced in 2021-2022" },
      { label: "Conference signal", value: "Independent Deno conferences and community events" },
    ],
    citations: [
      {
        claim: "denoland/deno is the canonical runtime source.",
        sourceUrl: "https://github.com/denoland/deno",
        sourceLabel: "denoland/deno",
      },
      {
        claim: "Deno announced the Series A on its blog in June 2022.",
        sourceUrl: "https://deno.com/blog",
        sourceLabel: "Deno blog",
      },
    ],
    faqs: [
      {
        q: "Deno vs Bun — different signal shapes?",
        a: "Yes. Deno's signal is sustained high star count over years; Bun's was a viral spike. Both worked.",
      },
    ],
    related: ["bun", "vercel", "tauri"],
    keywords: ["Deno Series A", "Sequoia Deno", "JavaScript runtime", "Deno Deploy"],
  },
  {
    slug: "modal",
    company: "Modal",
    primaryRepo: "modal-labs/modal-client",
    repos: ["modal-labs/modal-client"],
    sector: "AI infrastructure / serverless GPU",
    starsAtTrigger: "Lower repo star count; SDK install signal dominant",
    triggerWindow: "first half 2024",
    raise: "$80M Series B (Lux Capital)",
    raiseDate: "2024-09-04",
    leadInvestor: "Lux Capital",
    timeToMoney: "AI/ML use-case adoption + integration-tutorial density led the Series B",
    headline: "Modal — serverless GPU SDK to an $80M Lux Series B",
    tagline:
      "Modal's Python SDK for serverless GPU compute became the default ML-inference tool before Lux led the $80M Series B.",
    tldr:
      "modal-labs/modal-client was the install path for one of the most-adopted serverless GPU platforms of 2024. The $80M Lux-led Series B in September was the priced confirmation.",
    narrative: [
      "Modal's product is hosted; the SDK is the visible surface. By early 2024 the Python SDK was a default install in ML-inference tutorials — a strong leading indicator.",
      "The signal was integration density across the AI-tooling ecosystem. Whisper-fine-tune tutorials, LLM-eval pipelines, image-gen demos all defaulted to Modal for compute by mid-2024.",
      "Lux Capital led the $80M Series B in September 2024. The integration-density signal had been visible for at least two quarters.",
    ],
    signals: [
      { label: "SDK install velocity", value: "Sustained pip-installs through 2024" },
      { label: "ML tutorial integration", value: "Default compute platform in many tutorials" },
      { label: "Public demo gallery", value: "Growing showcase of community-built demos" },
    ],
    citations: [
      {
        claim: "modal-labs/modal-client is the canonical Python SDK.",
        sourceUrl: "https://github.com/modal-labs/modal-client",
        sourceLabel: "modal-labs/modal-client",
      },
      {
        claim: "Modal announced the Series B on its blog in September 2024.",
        sourceUrl: "https://modal.com/blog",
        sourceLabel: "Modal blog",
      },
    ],
    faqs: [
      {
        q: "How does Modal compare to Replicate?",
        a: "Same category (serverless GPU), different positioning. Replicate emphasizes pre-built models; Modal emphasizes flexible Python-first compute.",
      },
    ],
    related: ["replicate", "together-ai", "groq"],
    keywords: ["Modal Series B", "Lux Capital", "serverless GPU", "ML inference"],
  },
  {
    slug: "replicate",
    company: "Replicate",
    primaryRepo: "replicate/replicate-python",
    repos: ["replicate/replicate-python"],
    sector: "AI infrastructure / model hosting",
    starsAtTrigger: "Lower SDK star count; model-hub signal dominant",
    triggerWindow: "Q1-Q2 2024",
    raise: "$40M Series B (a16z)",
    raiseDate: "2024-04-22",
    leadInvestor: "Andreessen Horowitz",
    timeToMoney: "Model-hub growth + Cog adoption led the Series B by quarters",
    headline: "Replicate — model hosting to a $40M a16z Series B",
    tagline:
      "Replicate's model hub and Cog packaging tool led the $40M a16z-led Series B in April 2024.",
    tldr:
      "replicate/replicate-python was the install path. The real signal was the model-hub growth — Replicate hosted the most-shared image-generation and LLM-inference models in the OSS community through 2023-2024.",
    narrative: [
      "Replicate's model hub is a SaaS product; the SDK and Cog packaging tool are OSS. The signal lived in the hub — public model count, community usage telemetry, and tutorial recommendations.",
      "By Q1 2024 Replicate was the default 'host this model and call it via API' platform for most OSS image-gen and audio-gen models. That kind of category default is a leading indicator.",
      "The a16z $40M Series B in April 2024 closed the picture. The model-hub signal had been visible across 2023.",
    ],
    signals: [
      { label: "Model hub growth", value: "Thousands of public models hosted" },
      { label: "Cog adoption", value: "Default packaging tool for OSS model deploys" },
      { label: "SDK install velocity", value: "Sustained pip-installs" },
    ],
    citations: [
      {
        claim: "replicate/replicate-python is the canonical Python SDK.",
        sourceUrl: "https://github.com/replicate/replicate-python",
        sourceLabel: "replicate/replicate-python",
      },
      {
        claim: "Replicate announced the Series B on its blog in April 2024.",
        sourceUrl: "https://replicate.com/blog",
        sourceLabel: "Replicate blog",
      },
    ],
    faqs: [
      {
        q: "How do model-hub companies signal differently?",
        a: "Their leading indicator is public model count plus community usage. Stars are secondary.",
      },
    ],
    related: ["modal", "huggingface", "together-ai"],
    keywords: ["Replicate Series B", "a16z Replicate", "model hosting", "Cog"],
  },
  {
    slug: "together-ai",
    company: "Together AI",
    primaryRepo: "togethercomputer/RedPajama-Data",
    repos: ["togethercomputer/RedPajama-Data"],
    sector: "AI / training infrastructure",
    starsAtTrigger: "~4K stars at trigger window",
    triggerWindow: "first half 2023, accelerating into 2024",
    raise: "$106M Series A (Salesforce)",
    raiseDate: "2024-03-13",
    leadInvestor: "Salesforce Ventures",
    timeToMoney: "OSS dataset release + foundation model partnerships led the Series A",
    headline: "Together AI — open training stack to a $106M Salesforce Series A",
    tagline:
      "Together AI's RedPajama dataset and training-stack openness led the $106M Salesforce Series A in March 2024.",
    tldr:
      "togethercomputer/RedPajama-Data was the most-recognized OSS training-dataset signal of 2023. The $106M Salesforce-led Series A in March 2024 followed a year of partnership announcements.",
    narrative: [
      "Together AI's strategy is to be the open-stack counterweight to closed model labs. The RedPajama dataset release in 2023 was a category-defining moment — the largest curated open training set at the time.",
      "Partnership announcements through 2023 (foundation-model deals, hardware partnerships) were the leading signal. Each one weak alone; together strong.",
      "Salesforce led the $106M Series A in March 2024. The partnership signal had been compounding for at least four quarters.",
    ],
    signals: [
      { label: "OSS dataset release", value: "RedPajama dataset in 2023" },
      { label: "Partnership density", value: "Multiple foundation-model + hardware partnerships" },
      { label: "Conference signal", value: "Active presence at ML conferences" },
    ],
    citations: [
      {
        claim: "togethercomputer/RedPajama-Data is the canonical dataset repo.",
        sourceUrl: "https://github.com/togethercomputer/RedPajama-Data",
        sourceLabel: "togethercomputer/RedPajama-Data",
      },
      {
        claim: "Together AI announced the Series A on its blog in March 2024.",
        sourceUrl: "https://www.together.ai/blog",
        sourceLabel: "Together AI blog",
      },
    ],
    faqs: [
      {
        q: "Is dataset release a generalizable signal?",
        a: "For training-infra companies — yes. Releasing a credible open dataset is a strong public commitment that draws partnership interest.",
      },
    ],
    related: ["mistral", "huggingface", "anthropic"],
    keywords: ["Together AI Series A", "RedPajama", "Salesforce Ventures", "open training stack"],
  },
  {
    slug: "groq",
    company: "Groq",
    primaryRepo: "groq/groq-python",
    repos: ["groq/groq-python"],
    sector: "AI / inference hardware",
    starsAtTrigger: "SDK signal; hardware demo virality dominant",
    triggerWindow: "first half 2024",
    raise: "$640M Series D ($2.8B valuation)",
    raiseDate: "2024-08-05",
    leadInvestor: "Series D at $2.8B",
    timeToMoney: "Public LPU-inference demo virality led the Series D",
    headline: "Groq — LPU inference demo virality to a $640M Series D at $2.8B",
    tagline:
      "Groq's viral LPU inference speed demos led the $640M Series D in August 2024.",
    tldr:
      "groq/groq-python is the SDK. The real signal was the viral demo videos showing LPU-accelerated LLM inference at order-of-magnitude faster latency than competitors in early 2024.",
    narrative: [
      "Groq built custom LPU hardware optimized for LLM inference latency. The public demos in early 2024 were genuinely viral — order-of-magnitude faster than competitor APIs on the same model.",
      "Viral hardware demos are a hard signal to systematize, but the *aftermath* is measurable: SDK install velocity, partnership announcements, press density. All three accelerated in Q2 2024.",
      "The $640M Series D at $2.8B in August 2024 was a spectacular outcome. The demo-driven signal had been visible across the first half of the year.",
    ],
    signals: [
      { label: "Viral demos", value: "Public LPU-inference demos in Q1 2024" },
      { label: "SDK install velocity", value: "Sustained pip-installs through Q2 2024" },
      { label: "Press density", value: "Concentrated coverage in tech and AI press" },
    ],
    citations: [
      {
        claim: "groq/groq-python is the canonical Python SDK.",
        sourceUrl: "https://github.com/groq/groq-python",
        sourceLabel: "groq/groq-python",
      },
      {
        claim: "Groq announced the Series D on its blog in August 2024.",
        sourceUrl: "https://groq.com/news",
        sourceLabel: "Groq news",
      },
    ],
    faqs: [
      {
        q: "How do you systematize 'viral demo' signal?",
        a: "Track view counts on YouTube + Twitter for demo videos. Anomalies signal breakouts; the SDK install velocity confirms them.",
      },
    ],
    related: ["modal", "replicate", "together-ai"],
    keywords: ["Groq Series D", "LPU inference", "AI hardware"],
  },
  {
    slug: "tauri",
    company: "Tauri",
    primaryRepo: "tauri-apps/tauri",
    repos: ["tauri-apps/tauri"],
    sector: "Dev tools / desktop framework",
    starsAtTrigger: "~75K stars at trigger window",
    triggerWindow: "ongoing through 2024",
    raise: "75K+ stars / Open Collective backed",
    raiseDate: "2024-01-01",
    leadInvestor: "Open Collective + community funding",
    timeToMoney: "Sustained slope as the lightweight Electron alternative",
    headline: "Tauri — Rust-based Electron alternative crosses 75K stars",
    tagline:
      "Tauri's Rust-based lightweight Electron alternative compounded into community-backed sustainability.",
    tldr:
      "tauri-apps/tauri grew through 2022-2024 as the lightweight, Rust-built Electron alternative. By 2024 the repo had 75K+ stars and a sustainable Open Collective model.",
    narrative: [
      "Tauri's value proposition is straightforward: smaller binaries, less memory, Rust. The repo grew steadily through 2022-2024 as developers looked for lighter desktop framework alternatives.",
      "The Open Collective funding model is distinctive — Tauri didn't take a traditional Series A. The community-backed approach still produces a usable signal: contributor count, commit cadence, public sponsor growth.",
      "By 2024 the 75K+ star count placed Tauri firmly in the dev-tool elite. The lesson: not every dev tool needs to take VC to be a powerful signal.",
    ],
    signals: [
      { label: "Star slope", value: "Sustained growth to 75K+ stars" },
      { label: "Open Collective funding", value: "Steady community-backed support" },
      { label: "Contributor count", value: "Hundreds of contributors" },
    ],
    citations: [
      {
        claim: "tauri-apps/tauri is the canonical source.",
        sourceUrl: "https://github.com/tauri-apps/tauri",
        sourceLabel: "tauri-apps/tauri",
      },
      {
        claim: "Tauri documents funding via Open Collective.",
        sourceUrl: "https://tauri.app",
        sourceLabel: "Tauri homepage",
      },
    ],
    faqs: [
      {
        q: "Is Open-Collective-backed a useful signal?",
        a: "Yes. It indicates community sustainability without VC dependency — a category of repo that may not raise but still earns sourcing attention.",
      },
    ],
    related: ["bun", "deno", "remotion"],
    keywords: ["Tauri", "Rust desktop framework", "Electron alternative", "Open Collective"],
  },
  {
    slug: "tooljet",
    company: "ToolJet",
    primaryRepo: "ToolJet/ToolJet",
    repos: ["ToolJet/ToolJet"],
    sector: "Low-code / internal tools",
    starsAtTrigger: "~15K stars at trigger window",
    triggerWindow: "first half 2022",
    raise: "$4.6M seed (Nexus Venture Partners)",
    raiseDate: "2022-05-18",
    leadInvestor: "Nexus Venture Partners",
    timeToMoney: "OSS internal-tools traction + Retool alternative positioning",
    headline: "ToolJet — OSS internal tools to a $4.6M Nexus seed",
    tagline:
      "ToolJet's OSS Retool alternative led the $4.6M Nexus seed in May 2022.",
    tldr:
      "ToolJet/ToolJet positioned as the OSS Retool alternative and grew through early 2022. The $4.6M Nexus-led seed in May was the priced confirmation.",
    narrative: [
      "ToolJet entered the OSS internal-tools market shortly after Appsmith. The repo grew through 2022 with similar positioning — drag-and-drop, self-hostable, no vendor lock-in.",
      "The signal was clear category positioning plus growing template library. By Q1 2022 ToolJet was a credible second pick after Appsmith.",
      "The Nexus seed in May 2022 was the priced confirmation of a tight category-positioning story.",
    ],
    signals: [
      { label: "Star slope", value: "~10K → 15K stars in 9 months" },
      { label: "Category positioning", value: "OSS Retool alternative" },
      { label: "Template library", value: "Growing community-shared apps" },
    ],
    citations: [
      {
        claim: "ToolJet/ToolJet is the canonical OSS source.",
        sourceUrl: "https://github.com/ToolJet/ToolJet",
        sourceLabel: "ToolJet/ToolJet",
      },
      {
        claim: "ToolJet announced the seed on its blog in May 2022.",
        sourceUrl: "https://blog.tooljet.com",
        sourceLabel: "ToolJet blog",
      },
    ],
    faqs: [
      {
        q: "Two OSS Retool alternatives — both raised?",
        a: "Yes. The internal-tools market is large enough to support multiple credible OSS plays.",
      },
    ],
    related: ["appsmith", "windmill", "n8n"],
    keywords: ["ToolJet seed", "Nexus", "OSS internal tools", "Retool alternative"],
  },
  {
    slug: "coolify",
    company: "Coolify",
    primaryRepo: "coollabsio/coolify",
    repos: ["coollabsio/coolify"],
    sector: "Dev tools / OSS PaaS",
    starsAtTrigger: "~30K stars at trigger window",
    triggerWindow: "first half 2024",
    raise: "Mass adoption / 30K+ stars",
    raiseDate: "2024-06-01",
    leadInvestor: "Independent + sponsorship-funded",
    timeToMoney: "Solo-maintainer breakout in the self-hosted PaaS category",
    headline: "Coolify — self-hosted PaaS crosses 30K stars",
    tagline:
      "Coolify's solo-maintainer-built self-hosted PaaS crossed 30K stars as the leading Vercel/Heroku alternative.",
    tldr:
      "coollabsio/coolify is a solo-maintainer-driven OSS PaaS that compounded through 2023-2024 to 30K+ stars. Funded via sponsorships and independent revenue; not VC-backed.",
    narrative: [
      "Coolify is the case study for a *solo-maintainer* breakout. One developer built and maintained the project, growing it into the leading self-hosted PaaS alternative through sustained release cadence.",
      "The signal here is the maintainer's velocity — daily commits, frequent releases, active Discord. Solo-maintainer projects with this kind of cadence are rare and worth tracking.",
      "Coolify is funded via GitHub Sponsors + independent revenue, not VC. Still a strong public signal — and a reminder that not every accelerating repo will raise.",
    ],
    signals: [
      { label: "Maintainer velocity", value: "Daily commits, frequent tagged releases" },
      { label: "Star slope", value: "~10K → 30K+ stars in 18 months" },
      { label: "Discord activity", value: "Active community Discord" },
    ],
    citations: [
      {
        claim: "coollabsio/coolify is the canonical OSS PaaS.",
        sourceUrl: "https://github.com/coollabsio/coolify",
        sourceLabel: "coollabsio/coolify",
      },
      {
        claim: "Coolify documents its sponsorship and revenue model on its site.",
        sourceUrl: "https://coolify.io",
        sourceLabel: "Coolify homepage",
      },
    ],
    faqs: [
      {
        q: "Why include a non-VC-backed project?",
        a: "Because the signal is the engineering acceleration, not the round. Some of the most accelerating repos never raise — and the engineering signal still matters.",
      },
    ],
    related: ["vercel", "tauri", "n8n"],
    keywords: ["Coolify", "self-hosted PaaS", "OSS Heroku alternative"],
  },
  {
    slug: "zod",
    company: "Zod",
    primaryRepo: "colinhacks/zod",
    repos: ["colinhacks/zod"],
    sector: "Dev tools / TypeScript validation",
    starsAtTrigger: "~35K stars at trigger window",
    triggerWindow: "throughout 2023-2024",
    raise: "Mass adoption / 35K+ stars",
    raiseDate: "2024-01-01",
    leadInvestor: "Maintainer-funded + sponsorship",
    timeToMoney: "Default TypeScript validation library in modern JS stacks",
    headline: "Zod — TypeScript validation crosses 35K stars",
    tagline:
      "Zod became the default TypeScript validation library — a 35K-star signal that doesn't need a round to matter.",
    tldr:
      "colinhacks/zod compounded through 2022-2024 to 35K+ stars as the default TypeScript-first schema validation library. Adopted across nearly every modern JS framework's ecosystem.",
    narrative: [
      "Zod is the case study for a *library-becomes-default* signal. The repo compounded through years of steady release cadence and tutorial adoption.",
      "By 2024 Zod was the default validation library in tRPC, Next.js Server Actions, and many AI agent frameworks. That kind of ecosystem dependency adoption is its own leading indicator.",
      "Zod itself has no known VC round. The signal is the *adoption* — a useful reference for deal-flow systems calibrating against unique-but-default libraries.",
    ],
    signals: [
      { label: "Star slope", value: "Sustained 25K → 35K+ stars" },
      { label: "Framework default adoption", value: "Default in tRPC, Next.js, agent frameworks" },
      { label: "Dependency density", value: "Listed in thousands of package.jsons" },
    ],
    citations: [
      {
        claim: "colinhacks/zod is the canonical source.",
        sourceUrl: "https://github.com/colinhacks/zod",
        sourceLabel: "colinhacks/zod",
      },
      {
        claim: "Zod documents adoption examples on the homepage.",
        sourceUrl: "https://zod.dev",
        sourceLabel: "Zod homepage",
      },
    ],
    faqs: [
      {
        q: "Does Zod ever 'raise'?",
        a: "Unlikely. The library is solo-maintainer-driven and OSS. But the adoption signal is still useful for deal-flow calibration on similar libraries.",
      },
    ],
    related: ["drizzle", "prisma", "shadcn-ui"],
    keywords: ["Zod", "TypeScript validation", "schema validation"],
  },
  {
    slug: "shadcn-ui",
    company: "shadcn/ui",
    primaryRepo: "shadcn-ui/ui",
    repos: ["shadcn-ui/ui"],
    sector: "Dev tools / UI library",
    starsAtTrigger: "~75K stars at trigger window",
    triggerWindow: "throughout 2024",
    raise: "Mass adoption / 75K+ stars",
    raiseDate: "2024-03-01",
    leadInvestor: "Maintainer absorbed into Vercel",
    timeToMoney: "Default React UI choice in 2024 — maintainer joined Vercel",
    headline: "shadcn/ui — copy-paste UI library crosses 75K stars",
    tagline:
      "shadcn/ui became the default React UI library in 2024 — the maintainer was hired by Vercel; the repo is its own signal.",
    tldr:
      "shadcn-ui/ui pioneered the 'copy the components into your repo' distribution model and became the default React UI library by 2024. 75K+ stars and ecosystem-wide adoption.",
    narrative: [
      "shadcn/ui's distribution is unusual — there's no npm package to install. Components are copy-pasted into your repo via CLI. That distribution model itself became the signal: every modern Next.js + Tailwind project uses shadcn/ui by default in 2024.",
      "The maintainer was hired by Vercel in 2023, which is itself the signal — the company recognized the library's ecosystem position and acquired the relationship.",
      "Not a VC round in the traditional sense, but the talent-acquisition signal is one of the strongest possible. shadcn/ui is the case study for libraries that become company-defining.",
    ],
    signals: [
      { label: "Star slope", value: "Explosive 0 → 75K+ stars in 18 months" },
      { label: "Distribution innovation", value: "Copy-paste-via-CLI model" },
      { label: "Talent acquisition signal", value: "Maintainer hired by Vercel" },
    ],
    citations: [
      {
        claim: "shadcn-ui/ui is the canonical components repo.",
        sourceUrl: "https://github.com/shadcn-ui/ui",
        sourceLabel: "shadcn-ui/ui",
      },
      {
        claim: "shadcn/ui homepage hosts the docs and CLI.",
        sourceUrl: "https://ui.shadcn.com",
        sourceLabel: "shadcn/ui homepage",
      },
    ],
    faqs: [
      {
        q: "Is talent acquisition itself a signal?",
        a: "Yes — when a major company hires the maintainer of a high-velocity OSS project, it's a priced bet on the ecosystem.",
      },
    ],
    related: ["vercel", "zod", "drizzle"],
    keywords: ["shadcn/ui", "React UI library", "Tailwind components"],
  },
  {
    slug: "ollama",
    company: "Ollama",
    primaryRepo: "ollama/ollama",
    repos: ["ollama/ollama"],
    sector: "AI / local LLM runtime",
    starsAtTrigger: "~50K stars at trigger window",
    triggerWindow: "first half 2024",
    raise: "Series A reported / breakout adoption",
    raiseDate: "2024-09-01",
    leadInvestor: "Reported Series A",
    timeToMoney: "Star slope + local-LLM tutorial density led the round",
    headline: "Ollama — local LLM runtime to a reported Series A",
    tagline:
      "Ollama crossed 50K stars and became the default local LLM runtime before its reported Series A.",
    tldr:
      "ollama/ollama grew through 2023 and 2024 as the easiest way to run open-weights models locally. By mid-2024 the repo had 50K+ stars and a reported Series A.",
    narrative: [
      "Ollama's value is dead simple: one command to run an open-weights model locally. The repo compounded through 2023 as the open-weights model wave hit; by mid-2024 it was the default choice.",
      "Local-LLM tutorial density rose in parallel — every 'try Llama at home' guide started with `ollama run`. That kind of tutorial default position is a powerful signal.",
      "The reported Series A in mid-2024 was the priced confirmation. The signal had been visible for at least three quarters.",
    ],
    signals: [
      { label: "Star slope", value: "Sustained growth to 50K+ stars" },
      { label: "Tutorial default", value: "Default local-LLM choice in tutorials" },
      { label: "Release cadence", value: "Weekly tagged releases" },
    ],
    citations: [
      {
        claim: "ollama/ollama is the canonical source.",
        sourceUrl: "https://github.com/ollama/ollama",
        sourceLabel: "ollama/ollama",
      },
      {
        claim: "Ollama documents the project on its homepage.",
        sourceUrl: "https://ollama.com",
        sourceLabel: "Ollama homepage",
      },
    ],
    faqs: [
      {
        q: "Why is 'tutorial default' a leading signal?",
        a: "Because tutorial writers pick what their readers will succeed with. Once a tool becomes the default in popular tutorials, downstream adoption is locked in.",
      },
    ],
    related: ["llama-cpp", "mistral", "huggingface"],
    keywords: ["Ollama", "local LLM", "open-weights", "Llama runtime"],
  },
  {
    slug: "comfyui",
    company: "ComfyUI / Comfy Org",
    primaryRepo: "comfyanonymous/ComfyUI",
    repos: ["comfyanonymous/ComfyUI"],
    sector: "AI / image generation",
    starsAtTrigger: "~50K stars at trigger window",
    triggerWindow: "second half 2024",
    raise: "$17M seed (a16z)",
    raiseDate: "2025-01-08",
    leadInvestor: "Andreessen Horowitz",
    timeToMoney: "Node-based UI dominance in image-gen + workflow sharing density",
    headline: "ComfyUI — node-based image-gen UI to a $17M a16z seed",
    tagline:
      "ComfyUI became the default node-based UI for AI image generation before a16z led the $17M seed.",
    tldr:
      "comfyanonymous/ComfyUI grew explosively through 2023-2024 as the most flexible node-based UI for Stable Diffusion and successor models. The $17M a16z seed in January 2025 was the priced confirmation.",
    narrative: [
      "ComfyUI's distinctive value is a node-based UI that exposes the full generative pipeline visually. Power users adopted it as the standard, and workflow sharing became its own ecosystem on Reddit and Civitai.",
      "Workflow-sharing density is a strong signal type — when users start sharing JSON files of their own pipelines, the product has crossed into community-extensibility territory.",
      "a16z led the $17M seed in January 2025. The signal had been compounding for over a year.",
    ],
    signals: [
      { label: "Star slope", value: "0 → 50K+ stars in <2 years" },
      { label: "Workflow sharing density", value: "Tens of thousands of public workflows" },
      { label: "Reddit + Civitai presence", value: "Default UI on community forums" },
    ],
    citations: [
      {
        claim: "comfyanonymous/ComfyUI is the canonical source.",
        sourceUrl: "https://github.com/comfyanonymous/ComfyUI",
        sourceLabel: "comfyanonymous/ComfyUI",
      },
      {
        claim: "Comfy Org documents its commercial direction on the project homepage.",
        sourceUrl: "https://www.comfy.org",
        sourceLabel: "Comfy Org homepage",
      },
    ],
    faqs: [
      {
        q: "Is 'workflow sharing density' generalizable?",
        a: "For creator-tooling categories — yes. Public sharing of user-created assets is one of the strongest community signals.",
      },
    ],
    related: ["replicate", "stability-ai", "ollama"],
    keywords: ["ComfyUI", "a16z ComfyUI", "node-based image generation"],
  },
  {
    slug: "litellm",
    company: "LiteLLM (BerriAI)",
    primaryRepo: "BerriAI/litellm",
    repos: ["BerriAI/litellm"],
    sector: "AI / LLM routing",
    starsAtTrigger: "~7K stars at trigger window",
    triggerWindow: "first half 2024",
    raise: "$5M seed (a16z)",
    raiseDate: "2024-07-15",
    leadInvestor: "Andreessen Horowitz",
    timeToMoney: "LLM proxy adoption + multi-provider tooling led the seed",
    headline: "LiteLLM: LLM Proxy to a $5M a16z Seed",
    tagline:
      "LiteLLM became the default multi-provider LLM proxy before a16z led the $5M seed.",
    tldr:
      "BerriAI/litellm gave developers a single API across 100+ LLM providers. By mid-2024 it had 7K+ stars and growing enterprise interest. a16z led the $5M seed in July 2024.",
    narrative: [
      "LiteLLM's positioning is straightforward: one OpenAI-compatible API, any LLM provider. That utility hit at a moment when teams were juggling multiple providers and needed a routing layer.",
      "The signal was both star slope and enterprise-tier evaluation — public case studies started appearing in early 2024.",
      "a16z led the $5M seed in July 2024. The category-utility signal had been visible for at least two quarters.",
    ],
    signals: [
      { label: "Star slope", value: "~3K → 7K+ stars in 9 months" },
      { label: "Provider coverage", value: "100+ supported LLM providers" },
      { label: "Enterprise case studies", value: "Public adoption stories" },
    ],
    citations: [
      {
        claim: "BerriAI/litellm is the canonical OSS source.",
        sourceUrl: "https://github.com/BerriAI/litellm",
        sourceLabel: "BerriAI/litellm",
      },
      {
        claim: "LiteLLM documents the company at its homepage.",
        sourceUrl: "https://www.litellm.ai",
        sourceLabel: "LiteLLM homepage",
      },
    ],
    faqs: [
      {
        q: "Why is 'category utility' a strong signal?",
        a: "Because utility libraries with broad coverage become defaults — and defaults compound.",
      },
    ],
    related: ["langchain", "anthropic", "openai"],
    keywords: ["LiteLLM seed", "a16z LiteLLM", "LLM routing", "multi-provider AI"],
  },
  {
    slug: "open-webui",
    company: "Open WebUI",
    primaryRepo: "open-webui/open-webui",
    repos: ["open-webui/open-webui"],
    sector: "AI / chat UI",
    starsAtTrigger: "~90K stars at trigger window",
    triggerWindow: "second half 2024",
    raise: "Breakout adoption / 90K+ stars",
    raiseDate: "2024-10-01",
    leadInvestor: "Independent / not raised",
    timeToMoney: "Default self-hosted chat UI for local LLMs",
    headline: "Open WebUI — self-hosted chat UI crosses 90K stars",
    tagline:
      "Open WebUI became the default self-hosted chat UI for local LLMs, crossing 90K stars without a VC round.",
    tldr:
      "open-webui/open-webui paired naturally with Ollama and became the most-adopted self-hosted chat UI for local LLMs. 90K+ stars by late 2024; not VC-backed.",
    narrative: [
      "Open WebUI is the natural front-end to Ollama. The two repos compounded together — Ollama for the runtime, Open WebUI for the chat surface.",
      "The signal here is explosive star growth tied to a specific category niche. Self-hosted AI is a fast-growing community, and Open WebUI captured the default position.",
      "The repo is independent and not VC-backed. Still a strong signal for deal-flow systems calibrating on adjacent companies.",
    ],
    signals: [
      { label: "Star slope", value: "0 → 90K+ stars in <18 months" },
      { label: "Ollama pairing", value: "Default front-end for Ollama" },
      { label: "Self-hosted community signal", value: "Most-shared chat UI in self-hosted AI subreddits" },
    ],
    citations: [
      {
        claim: "open-webui/open-webui is the canonical source.",
        sourceUrl: "https://github.com/open-webui/open-webui",
        sourceLabel: "open-webui/open-webui",
      },
      {
        claim: "Open WebUI documents the project on its homepage.",
        sourceUrl: "https://openwebui.com",
        sourceLabel: "Open WebUI homepage",
      },
    ],
    faqs: [
      {
        q: "Why include a non-VC-backed project here?",
        a: "Because the engineering signal is the focus. Some 90K-star repos never raise — and the signal still matters.",
      },
    ],
    related: ["ollama", "lobechat", "comfyui"],
    keywords: ["Open WebUI", "self-hosted chat UI", "Ollama frontend"],
  },
  {
    slug: "lobechat",
    company: "LobeChat",
    primaryRepo: "lobehub/lobe-chat",
    repos: ["lobehub/lobe-chat"],
    sector: "AI / chat UI",
    starsAtTrigger: "~60K stars at trigger window",
    triggerWindow: "second half 2024",
    raise: "Breakout adoption / 60K+ stars",
    raiseDate: "2024-09-01",
    leadInvestor: "Independent",
    timeToMoney: "Polished chat UI for multi-provider LLM access",
    headline: "LobeChat — multi-provider chat UI crosses 60K stars",
    tagline:
      "LobeChat positioned as a polished multi-provider chat UI and crossed 60K stars in 2024.",
    tldr:
      "lobehub/lobe-chat is a polished, multi-provider chat UI that compounded through 2024 to 60K+ stars. Independent / community-driven.",
    narrative: [
      "LobeChat targets the 'polished chat UI for any LLM provider' niche. The repo grew through 2024 with steady release cadence and strong design polish — a differentiator in a category dominated by raw OSS UIs.",
      "Star slope was steady; design-polish and Theme support were the differentiators. Not VC-backed publicly, but a strong adjacent signal for the chat-UI category.",
      "Useful comparison: LobeChat (polished) vs Open WebUI (Ollama-paired) vs LibreChat (enterprise-leaning).",
    ],
    signals: [
      { label: "Star slope", value: "Sustained growth to 60K+ stars" },
      { label: "Design polish", value: "Theme support + visual quality" },
      { label: "Multi-provider coverage", value: "Supports many LLM providers out of the box" },
    ],
    citations: [
      {
        claim: "lobehub/lobe-chat is the canonical source.",
        sourceUrl: "https://github.com/lobehub/lobe-chat",
        sourceLabel: "lobehub/lobe-chat",
      },
      {
        claim: "LobeHub documents the project on its homepage.",
        sourceUrl: "https://lobehub.com",
        sourceLabel: "LobeHub homepage",
      },
    ],
    faqs: [
      {
        q: "Why three different OSS chat UIs in the same category?",
        a: "Because the category is large, the technical bar is moderate, and the differentiators (design polish, Ollama-pairing, enterprise features) are real.",
      },
    ],
    related: ["open-webui", "ollama", "litellm"],
    keywords: ["LobeChat", "OSS chat UI", "multi-provider LLM"],
  },
];

/** Lookup helper. */
export function getStarsCaseBySlug(slug: string): StarsCase | undefined {
  return starsCases.find((c) => c.slug === slug);
}

/** Sitemap helper — every slug, alpha order for stability. */
export function getAllStarsCaseSlugs(): string[] {
  return starsCases.map((c) => c.slug).sort();
}
