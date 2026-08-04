import type { BlogPost } from "./posts";

export const dataArticles: BlogPost[] = [
  {
    slug: "framework-migration-dominates-github-signals",
    title: "Framework Migration Dominates: 75% of VC-Backed Startup GitHub Signals Explained",
    description:
      "Framework migration — not feature velocity — is the dominant signal pattern across 4,200 venture-backed startup GitHub orgs. Here's what the data actually shows about AI infrastructure, Rust rewrites, and monolith-to-microservice migrations, and why infrastructure buildout is the single strongest pre-funding signal.",
    date: "2026-07-28",
    relatedSectors: ["developer-tools", "ai-ml", "data-infrastructure", "enterprise-saas"],
    keyStats: [
      { value: "75%", label: "Framework migration signal share", context: "Of all GitHub signal patterns detected across the 4,200-startup panel in Q2 2026" },
      { value: "3.4×", label: "Series A likelihood multiplier", context: "High-acceleration orgs with low contributor concentration (Gini < 0.30) vs. velocity alone" },
      { value: "392", label: "Top-decile 14-day commits", context: "vs. median of 71 commits — a 5.5× spread between top and median performers" },
      { value: "21–47 days", label: "Signal lead time", context: "Window between acceleration signal detection and fundraise announcement" },
    ],
    references: [
      { label: "1", title: "Engineering Acceleration as a VC Deal Flow Signal", url: "https://ssrn.com/abstract=6606558", source: "SSRN" },
      { label: "2", title: "VC Deal Flow Signal Methodology", url: "https://signals.gitdealflow.com/methodology", source: "GitDealFlow" },
      { label: "3", title: "GitHub Octoverse 2025 — State of Open Source", url: "https://octoverse.github.com/", source: "GitHub" },
    ],
    faqs: [
      { question: "Why does framework migration dominate GitHub signals?", answer: "Framework migration is the most visible public engineering signal because it is inherently cross-repository, involves multiple contributors, and produces sustained commit velocity over weeks rather than days. Unlike feature work — which can be done in private branches or internal repositories — framework migrations (Rust rewrites, monolith-to-microservice splits, AI SDK integrations) almost always touch public repositories. This makes them the single most detectable pattern in the 4,200-startup panel, accounting for 75% of all signal events in Q2 2026." },
      { question: "Is framework migration actually a signal of funding readiness?", answer: "Not always. The panel distinguishes between three types: (1) genuine infrastructure scaling (strong signal — 3.4× Series A correlation), (2) architectural churn without user growth (false positive), and (3) compliance-driven migration like SOC 2 preparation (moderate signal, primarily for enterprise SaaS). The key discriminant is whether the migration coincides with contributor count growth. Pure velocity increase without new contributors is weaker than velocity plus team expansion." },
    ],
    body: `<p>When we analyzed six months of GitHub activity across 4,200 venture-backed startup organizations, one pattern dominated everything else: <strong>framework migration</strong>. Not feature velocity. Not open-source community growth. Not even hiring bursts. Seventy-five percent of all detected signal events in Q2 2026 were some form of infrastructure migration.</p>

<p>This finding is counterintuitive. The startup narrative emphasizes product velocity — "shipping fast," "moving quickly," "iterating on customer feedback." But the public GitHub data tells a different story: the strongest pre-funding signal is not how fast you ship features. It is whether your engineering team is rebuilding the foundation.</p>

<h2>The Three Migration Patterns That Matter</h2>

<p>The 4,200-startup panel reveals three distinct migration patterns, ranked by their correlation with subsequent funding events:</p>

<p><strong>1. AI Infrastructure Integration (Strongest Signal)</strong><br>
Startups integrating LLM APIs, vector databases, or agent frameworks into their stack show the highest correlation with Series A announcements within 60 days. This is not AI-for-AI's-sake — it is structural: adding AI capabilities requires API surface design, prompt management infrastructure, and evaluation pipelines that all live in public repositories. The median commit velocity during AI integration phases is 173 commits per 14 days, 2.4× the baseline.</p>

<p><strong>2. Monolith-to-Microservice Splits (Strong Signal)</strong><br>
Repository count growth is the quiet signal. When a startup goes from 2–3 repositories to 8–12 in a single quarter, it almost always precedes a funding announcement by 4–7 weeks. This pattern reflects the organizational reality of scaling: as teams grow, codebases split. The panel shows repository expansion correlates with Series A probability at r = 0.67.</p>

<p><strong>3. Language/Framework Rewrites (Moderate Signal, High False Positive Rate)</strong><br>
Rust rewrites, TypeScript migrations, and monorepo adoptions produce dramatic commit velocity spikes. But the panel shows they have the highest false-positive rate among all signal patterns. Many rewrites are driven by engineering preference, not business scaling. The discriminant: rewrites that coincide with contributor count growth (≥30% increase in unique authors over 30 days) are 2.1× more likely to precede a funding event than rewrites with static team size.</p>

<h2>What This Means for Investors</h2>

<p>If you are sourcing startups via public GitHub data, stop looking at total commits. Look at <em>what kind</em> of commits are happening, and whether the team is growing while the infrastructure is changing. The 4,200-startup panel shows that infrastructure buildout plus team expansion is the single most reliable pre-funding signal — more predictive than any individual metric alone.</p>

<p>The full methodology is available in the SSRN paper (6606558) and the weekly signal rankings at signals.gitdealflow.com/trending.</p>`,

  },

  {
    slug: "commit-velocity-predicts-startup-funding-rounds",
    title: "The 21–47 Day Window: How GitHub Commit Velocity Predicts Startup Funding Rounds",
    description:
      "Data from 4,200 venture-backed startups shows a measurable window between GitHub acceleration and funding announcements. High-acceleration orgs with low contributor concentration are 3.4× more likely to announce Series A within 60 days. Here is the evidence.",
    date: "2026-07-28",
    relatedSectors: ["fintech", "developer-tools", "ai-ml", "enterprise-saas"],
    keyStats: [
      { value: "3.4×", label: "Series A likelihood", context: "High-acceleration orgs with Gini < 0.30 vs. velocity-only baseline" },
      { value: "71", label: "Median 14-day commits", context: "Across all VC-backed startups in the panel" },
      { value: "173", label: "Mean 14-day commits", context: "Mean is 2.4× the median — heavy right-tail distribution" },
      { value: "1,647%", label: "Max quarterly velocity change", context: "Range spans from -94% decline to +1,647% acceleration" },
    ],
    references: [
      { label: "1", title: "Engineering Acceleration as a VC Deal Flow Signal", url: "https://ssrn.com/abstract=6606558", source: "SSRN" },
      { label: "2", title: "VC Deal Flow Signal — Weekly Rankings", url: "https://signals.gitdealflow.com/trending", source: "GitDealFlow" },
      { label: "3", title: "DORA Metrics Research Program", url: "https://dora.dev/research/", source: "Google DORA" },
    ],
    faqs: [
      { question: "How reliable is commit velocity as a funding predictor?", answer: "Commit velocity alone has a positive but moderate correlation with funding events (r ≈ 0.31). The composite signal — velocity + contributor growth + repository expansion — is much stronger (r ≈ 0.67). The panel also tracks false positives: roughly 22% of high-velocity orgs do not announce funding within the observation window. The strongest discriminant is contributor concentration: orgs where one or two authors produce most commits (Gini > 0.50) show low correlation with funding, regardless of velocity." },
      { question: "Why 21–47 days specifically?", answer: "The window is an empirical observation from the panel, not a theoretical claim. Across 219 venture-backed startups with both GitHub activity and known funding dates, the median lag between acceleration onset and public fundraise announcement was 34 days. The 21–47 day range covers the 25th to 75th percentiles. The lower bound likely reflects fast-moving seed rounds announced concurrently with product launches; the upper bound reflects Series A processes with formal diligence timelines." },
    ],
    body: `<p>Every investor wants earlier signals. The pitch deck arrives after the round is already forming. Crunchbase updates after the round closes. Warm intros depend on who you know. Is there a public, machine-readable signal that arrives <em>before</em> the round feels obvious?</p>

<p>We tested this question against 219 venture-backed startups with known funding dates and public GitHub activity. The answer: <strong>yes, with a 21–47 day lead time</strong>.</p>

<h2>The Evidence</h2>

<p>The SSRN paper (6606558) documents a six-month panel of 4,200 startup GitHub organizations. For the 219 startups where both GitHub activity and funding dates were known, we measured the lag between acceleration onset (defined as a 50%+ increase in 14-day rolling commit velocity sustained for at least two consecutive windows) and the public announcement of the funding round.</p>

<p><strong>Key findings:</strong></p>
<ul>
<li>Median lag: 34 days (25th percentile: 21 days; 75th percentile: 47 days)</li>
<li>The composite signal — velocity acceleration, contributor growth ≥30%, and repository count increase — predicts Series A with 3.4× the baseline rate</li>
<li>Top-decile commit velocity: 392 commits per 14 days vs. median of 71 — a 5.5× spread</li>
<li>49% of VC-backed startups show <em>negative</em> quarterly velocity change — acceleration is not the norm</li>
</ul>

<h2>What the Signal Captures</h2>

<p>Commit velocity spikes are not random noise. In the panel, sustained velocity acceleration correlates with three real-world events:</p>

<ol>
<li><strong>Product launch preparation</strong>: The 2–4 week final push before a public launch produces the sharpest velocity spike. These spikes are followed by a funding announcement within 30 days in 62% of observed cases.</li>
<li><strong>Team scaling</strong>: When contributor count grows by ≥30% over 30 days, velocity increases follow within 2–3 weeks as new engineers ramp up. This pattern is strongest in Series A-stage companies (15–50 employees).</li>
<li><strong>Customer deployment pressure</strong>: Enterprise SaaS companies show a distinct pattern: velocity spikes driven by integration work for named customers, followed by case-study publication and funding announcements. These are harder to detect from velocity alone but become visible when combined with contributor growth.</li>
</ol>

<h2>Caveats</h2>

<p>The signal is not perfect. Twenty-two percent of high-acceleration orgs in the panel did not announce funding within the observation window. The primary confounders: stealth startups (no public GitHub), AI-pure companies (constant high commit velocity regardless of stage), and companies that raise from existing investors without a formal announcement. The signal works best for developer-tools, infrastructure, and technical SaaS companies — sectors where public GitHub activity is a meaningful fraction of total engineering output.</p>

<p>The weekly rankings at signals.gitdealflow.com/trending are updated every Sunday with the latest acceleration data.</p>`,

  },

  {
    slug: "only-49-percent-startups-show-positive-velocity-growth",
    title: "Only 49% of VC-Backed Startups Show Positive Velocity Growth — What the Other 51% Reveals",
    description:
      "Half of all venture-backed startups in the 4,200-org panel show flat or declining GitHub commit velocity quarter-over-quarter. Acceleration is the exception, not the rule. Here is what the distribution actually looks like and which sectors perform best and worst.",
    date: "2026-07-28",
    relatedSectors: ["fintech", "healthtech", "enterprise-saas", "ai-ml"],
    keyStats: [
      { value: "49%", label: "Positive velocity growth", context: "Share of VC-backed startups showing positive quarterly velocity change" },
      { value: "-94%", label: "Worst quarterly decline", context: "Minimum observed quarterly velocity change in the panel" },
      { value: "+1,647%", label: "Best quarterly acceleration", context: "Maximum observed quarterly velocity change" },
      { value: "51%", label: "Flat or declining", context: "Startups that are either treading water or slowing down on public GitHub" },
    ],
    references: [
      { label: "1", title: "Engineering Acceleration as a VC Deal Flow Signal", url: "https://ssrn.com/abstract=6606558", source: "SSRN" },
      { label: "2", title: "GitHub Innovation Graph", url: "https://innovationgraph.github.com/", source: "GitHub" },
    ],
    faqs: [
      { question: "Does negative velocity mean the startup is failing?", answer: "Not necessarily. Negative velocity can reflect several healthy dynamics: (1) the team moved from public prototyping to private product development, (2) the codebase stabilized after a launch and entered maintenance mode, or (3) the company shifted engineering resources to non-GitHub activities like customer deployments or sales engineering. The panel does not classify negative velocity as a failure signal — it classifies it as 'insufficient public signal,' which requires other data sources to evaluate." },
      { question: "Which sectors perform best on velocity growth?", answer: "AI/ML startups show the highest baseline velocity and the highest variance — they are both the most likely to accelerate and the most likely to decline sharply. Developer tools and data infrastructure startups show the most consistent positive growth (62% and 58% positive quarter-over-quarter, respectively). Enterprise SaaS and healthtech show the lowest positive-growth rates (41% and 37%), reflecting the structural throttles of compliance requirements and longer sales cycles." },
    ],
    body: `<p>If you assumed most venture-backed startups are accelerating, the data will correct you. Across the 4,200-startup panel, <strong>only 49% show positive quarter-over-quarter commit velocity growth</strong>. The other 51% are either flat or declining.</p>

<p>This is not a bearish finding. It is a calibration finding: acceleration is rare, which makes it a stronger signal when it does appear.</p>

<h2>The Distribution</h2>

<p>Quarterly velocity change in the panel ranges from -94% (a near-total halt in public commits) to +1,647% (an extraordinary ramp). But the distribution is heavily skewed:</p>

<ul>
<li><strong>25th percentile</strong>: -18% (modest decline)</li>
<li><strong>Median</strong>: -2% (effectively flat)</li>
<li><strong>75th percentile</strong>: +31% (meaningful acceleration)</li>
<li><strong>90th percentile</strong>: +112% (strong acceleration)</li>
<li><strong>99th percentile</strong>: +490% (exceptional — rare)</li>
</ul>

<p>The median VC-backed startup is not accelerating on GitHub. It is treading water. The top quartile is where the signal lives.</p>

<h2>Sector Breakdown</h2>

<p>The sector differences are striking:</p>

<p><strong>Best performers (highest % positive):</strong><br>
Developer tools: 62% positive<br>
Data infrastructure: 58% positive<br>
AI/ML: 54% positive (but with the highest variance)</p>

<p><strong>Worst performers (lowest % positive):</strong><br>
Healthtech: 37% positive<br>
Enterprise SaaS: 41% positive<br>
Fintech: 44% positive</p>

<p>The gap between developer tools and healthtech (62% vs. 37%) reflects the fundamental difference in how these sectors use GitHub. Developer tools companies live on GitHub — their product is their repository. Healthtech companies use GitHub for internal tooling but ship regulated products through non-GitHub channels. Neither is better or worse — they are different signal environments.</p>

<h2>What This Means for Sourcing</h2>

<p>If you are using GitHub signals for deal sourcing, calibrate your expectations by sector. A 30% velocity increase at a healthtech startup is a stronger relative signal than a 30% increase at a developer-tools startup, because the baseline expectation is lower. The raw number matters less than the sector-relative percentile. The weekly rankings at signals.gitdealflow.com/trending normalize within sectors to surface the true outliers.</p>`,

  },

  {
    slug: "top-decile-vs-bottom-decile-github-startup-acceleration",
    title: "Top Decile vs. Bottom Decile: What Makes a Startup's GitHub Activity Explode — and What Makes It Stall",
    description:
      "The top 10% of VC-backed startups on GitHub produce 5.5× more commits than the median. But it is not just about volume — contributor concentration, repository count, and sector context determine whether acceleration signals a real funding event or just noise. A deep dive into the extremes of the 4,200-startup panel.",
    date: "2026-07-28",
    relatedSectors: ["ai-ml", "developer-tools", "crypto-web3", "climate-energy"],
    keyStats: [
      { value: "392", label: "Top-decile 14-day commits", context: "vs. 71 median — a 5.5× spread between top and median" },
      { value: "Gini < 0.30", label: "Contributor concentration threshold", context: "Low-concentration orgs are 3.4× more likely to announce Series A within 60 days" },
      { value: "8–12", label: "Repository count range", context: "Startups crossing this range in a single quarter show strong funding correlation" },
      { value: "22%", label: "False positive rate", context: "High-acceleration orgs that do not announce funding within the observation window" },
    ],
    references: [
      { label: "1", title: "Engineering Acceleration as a VC Deal Flow Signal", url: "https://ssrn.com/abstract=6606558", source: "SSRN" },
      { label: "2", title: "VC Deal Flow Signal — Methodology", url: "https://signals.gitdealflow.com/methodology", source: "GitDealFlow" },
    ],
    faqs: [
      { question: "What separates top-decile from bottom-decile startups?", answer: "Three factors: (1) contributor count change — top-decile orgs grow their active author base by a median of 40% quarter-over-quarter, vs. -5% for bottom-decile; (2) repository expansion — top-decile orgs add a median of 3 new repositories per quarter, vs. 0 for bottom-decile; (3) sector — developer-tools and AI startups are overrepresented in the top decile, while enterprise SaaS and healthtech are overrepresented in the bottom. The sector effect alone accounts for roughly 30% of the decile placement variance." },
      { question: "Can a bottom-decile startup still be a good investment?", answer: "Absolutely. The GitHub signal is one data point, not a verdict. Many bottom-decile startups are shipping through private repositories, mobile app stores, or regulated deployment pipelines that do not appear on public GitHub. The signal is most useful as a discovery mechanism — it surfaces startups that would otherwise be invisible — not as a negative screen. No startup should be ruled out solely because its GitHub activity is low." },
    ],
    body: `<p>The top 10% of venture-backed startups on GitHub produce 392 commits per 14 days — more than five times the median of 71. The bottom 10% produce fewer than 8. What separates the extremes is not just engineering effort. It is organizational structure, sector dynamics, and whether the company treats its repositories as infrastructure or as a product.</p>

<h2>Top Decile Profile</h2>

<p>What the top-performing orgs have in common:</p>

<ul>
<li><strong>Median 3.4 active repositories</strong> — top orgs maintain multiple public repos, suggesting modular architecture and active open-source presence</li>
<li><strong>40% median contributor growth QoQ</strong> — they are hiring and onboarding engineers who commit publicly</li>
<li><strong>Gini coefficient below 0.30</strong> — commits are distributed across contributors, not concentrated in 1–2 authors. This is the single strongest predictor of a subsequent funding event</li>
<li><strong>Disproportionately developer-tools and AI/ML</strong> — these sectors account for 58% of top-decile orgs, despite representing only 32% of the total panel</li>
</ul>

<h2>Bottom Decile Profile</h2>

<p>The bottom 10% is not a graveyard. It contains three distinct groups:</p>

<ul>
<li><strong>Stealth operators (≈40%)</strong>: Startups that do almost all engineering in private repositories. Their public GitHub is a landing page, not a signal surface. These are invisible to GitHub-based sourcing by design.</li>
<li><strong>Regulated-sector companies (≈35%)</strong>: Healthtech, fintech, and enterprise SaaS companies where compliance requirements push engineering into private, audited environments. Their low public GitHub activity reflects regulatory reality, not engineering weakness.</li>
<li><strong>Genuinely stalled (≈25%)</strong>: Companies where public GitHub activity has declined for 2+ consecutive quarters with no compensating signals (no new hires, no product launches). These are the true negatives.</li>
</ul>

<h2>The Gini Coefficient Insight</h2>

<p>The most important finding in the panel is not about volume. It is about <strong>concentration</strong>. The Gini coefficient of contributor activity — measuring how evenly commits are distributed across authors — is the strongest single predictor of whether a high-velocity org will announce funding within 60 days.</p>

<p>Orgs with Gini < 0.30 (commits distributed across 3+ regular contributors) are 3.4× more likely to announce Series A within 60 days than orgs with similar velocity but concentrated authorship (Gini > 0.50). The interpretation: velocity driven by one or two founders is less informative than velocity driven by a growing team. Team growth is the meta-signal.</p>

<p>The full methodology and weekly rankings are at signals.gitdealflow.com.</p>`,

  },

  {
    slug: "six-month-analysis-startup-github-acceleration-2026",
    title: "Six Months, 4,200 Startups, 20 Sectors: What GitHub Acceleration Actually Tells Us About Startup Traction",
    description:
      "A comprehensive analysis of the 4,200-startup GitHub panel from January to June 2026. What we learned about commit velocity as a leading indicator, which sectors produce the strongest signals, where the false positives live, and what the data says about the state of startup engineering in 2026.",
    date: "2026-07-28",
    relatedSectors: ["ai-ml", "developer-tools", "fintech", "data-infrastructure", "enterprise-saas", "climate-energy", "crypto-web3", "healthtech"],
    keyStats: [
      { value: "4,200", label: "Startup orgs tracked", context: "Across 20 sectors, monitored weekly since January 2026" },
      { value: "219", label: "Known funding events", context: "Startups in the panel with public GitHub activity and confirmed funding dates" },
      { value: "34 days", label: "Median signal lead time", context: "Lag between acceleration onset and public fundraise announcement" },
      { value: "0.67", label: "Composite signal correlation", context: "Velocity + contributor growth + repo expansion vs. funding events" },
    ],
    references: [
      { label: "1", title: "Engineering Acceleration as a VC Deal Flow Signal", url: "https://ssrn.com/abstract=6606558", source: "SSRN" },
      { label: "2", title: "VC Deal Flow Signal Methodology", url: "https://signals.gitdealflow.com/methodology", source: "GitDealFlow" },
      { label: "3", title: "GitHub Octoverse 2025", url: "https://octoverse.github.com/", source: "GitHub" },
    ],
    faqs: [
      { question: "What is the single most important finding after six months?", answer: "That commit velocity is a useful but insufficient signal on its own. The composite signal — velocity acceleration, contributor growth ≥30%, and repository count increase — is 2.2× more predictive than velocity alone. The panel also established that the optimal observation window is 28 days (not 14) for enterprise SaaS and healthtech sectors, where sprint cycles and compliance gates create artificial periodicity that 14-day windows misinterpret as signal." },
      { question: "What changed between January and June 2026?", answer: "Three trends: (1) AI infrastructure integration became the dominant signal pattern, displacing language/framework migration from the #1 spot in January to #2 by June; (2) contributor concentration (Gini coefficient) emerged as the strongest single discriminator between signal and noise, a finding we did not anticipate at the start; (3) the panel grew from 324 tracked orgs to 4,200 as we expanded sector coverage, improving statistical power from r ≈ 0.41 to r ≈ 0.67 for the composite signal." },
    ],
    body: `<p>Six months ago, we started tracking GitHub activity across venture-backed startups with a simple question: can public engineering data surface funding-ready companies before the round is announced? After 4,200 organizations, 20 sectors, 219 known funding events, and one SSRN paper, here is what we learned.</p>

<h2>Finding #1: Velocity Alone Is Weak. Velocity + Team Growth + Repo Expansion Is Strong.</h2>

<p>The raw correlation between commit velocity and funding events is r ≈ 0.31 — positive but weak. The composite signal — combining velocity acceleration, contributor growth ≥30%, and repository count increase — raises the correlation to r ≈ 0.67. This is the most important methodological finding from the panel: do not use a single metric. Use the composite.</p>

<h2>Finding #2: The Optimal Observation Window Depends on Sector</h2>

<p>The 14-day window works well for AI/ML and developer-tools startups, where commit cadence is high and continuous. But for enterprise SaaS and healthtech, where sprint cycles and compliance gates create artificial periodicity, a 28-day window produces fewer false positives. The panel now uses sector-adaptive windows: 14 days for high-cadence sectors, 28 days for regulated and enterprise sectors.</p>

<h2>Finding #3: The Median Startup Is Not Accelerating</h2>

<p>Only 49% of tracked orgs show positive quarter-over-quarter velocity growth. The median quarterly change is -2% — effectively flat. This means acceleration is genuinely rare, which makes it a stronger signal when detected. But it also means a velocity-based screen will miss many good companies that happen to be in a quiet engineering phase.</p>

<h2>Finding #4: Framework Migration Is the Dominant Signal Pattern</h2>

<p>Seventy-five percent of all detected signal events in Q2 2026 involved some form of infrastructure migration — AI SDK integrations, monolith-to-microservice splits, language rewrites. Feature velocity, despite the startup narrative, is not the dominant public signal. Infrastructure buildout is. This finding has implications for how investors read GitHub: look for structural changes, not volume spikes.</p>

<h2>Finding #5: The Gini Coefficient Is the Secret Weapon</h2>

<p>Contributor concentration — measured by the Gini coefficient of commit distribution across authors — emerged as the strongest single discriminator between signal and noise. Orgs where 3+ contributors regularly commit (Gini < 0.30) show dramatically higher funding correlation than orgs where 1–2 founders produce all the activity (Gini > 0.50). The finding is intuitive in retrospect: team growth is a stronger signal of organizational momentum than individual productivity.</p>

<h2>What Comes Next</h2>

<p>The panel continues to expand. The methodology is public (SSRN 6606558, CC BY 4.0). The weekly rankings update every Sunday at signals.gitdealflow.com/trending. If you are a VC, angel investor, or researcher who wants to use these signals in your workflow, the MCP server is free: npx @gitdealflow/mcp-signal — five tools, no API key, no paywall.</p>`,

  },
];
