export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

/** A figure inserted after a specific H2 heading in the post body. */
export interface BlogFigure {
  /** ID matching a key in components/figures/index.tsx */
  id: string;
  /** Insert after the first H2 whose text contains this substring */
  afterHeading: string;
}

export interface BlogReference {
  label: string;
  title: string;
  url: string;
  source: string;
}

export interface BlogKeyStat {
  value: string;
  label: string;
  context?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  summary?: string;
  date: string;
  body: string;
  relatedSectors: string[];
  faqs: BlogFAQ[];
  figures?: BlogFigure[];
  references?: BlogReference[];
  keyStats?: BlogKeyStat[];
  howTo?: {
    name: string;
    description: string;
    totalTime?: string;
    steps: HowToStep[];
  };
}

export const posts: BlogPost[] = [
  {
    slug: "how-to-read-github-signals-for-startup-investing",
    title: "How to Read GitHub Signals for Startup Investing",
    description:
      "A practical guide for investors on interpreting GitHub engineering activity as a leading indicator of startup traction. Covers commit velocity, contributor growth, and what patterns actually predict fundraises.",
    references: [
      { label: "1", title: "GitHub REST API — Commit Activity", url: "https://docs.github.com/en/rest/metrics/statistics#get-the-last-year-of-commit-activity", source: "GitHub Docs" },
      { label: "2", title: "GitHub REST API — Contributors", url: "https://docs.github.com/en/rest/metrics/statistics#get-all-contributor-commit-activity", source: "GitHub Docs" },
      { label: "3", title: "Alternative Data in Private Markets", url: "https://www.bain.com/insights/alternative-data-in-private-equity/", source: "Bain & Company" },
    ],
    keyStats: [
      { value: "6-12 weeks", label: "Signal lead time", context: "Before fundraise announcements" },
      { value: "20", label: "Sectors tracked", context: "Updated weekly" },
      { value: "4", label: "Signal types", context: "Hiring burst, buildout, spike, migration" },
    ],
    summary:
      "GitHub commit velocity — measured as the rate of change in 14-day commit counts — is the earliest publicly available signal of startup momentum. When a startup's engineering acceleration doubles in a two-week window, it typically precedes a fundraise announcement by three to six weeks. This guide covers the four signal types (hiring burst, infrastructure buildout, deploy spike, framework migration), what to ignore, and a practical workflow for turning GitHub data into actionable deal flow.",
    date: "2026-03-28",
    relatedSectors: ["ai-ml", "developer-tools", "data-infrastructure"],
    figures: [
      { id: "signal-types", afterHeading: "Four Types of Engineering Signals" },
      { id: "signal-timeline", afterHeading: "When Do Engineering Signals" },
    ],
    howTo: {
      name: "How to Read GitHub Signals for Startup Investing",
      description:
        "A step-by-step process for using public GitHub engineering data to identify breakout startups before they raise. Takes 15-20 minutes per company.",
      totalTime: "PT20M",
      steps: [
        {
          name: "Pick 2-3 sectors you know well",
          text: "Focus on sectors where you have domain expertise. This lets you distinguish meaningful engineering acceleration from routine activity. VC Deal Flow Signal tracks 20 sectors — start with your strongest.",
        },
        {
          name: "Watch the weekly sector rankings for unfamiliar names",
          text: "Check the sector ranking pages each week. When a startup you do not recognize appears in the top 3 by commit velocity change, flag it for research. The top movers are showing engineering acceleration that has historically preceded fundraises by 6-12 weeks.",
        },
        {
          name: "Classify the signal type",
          text: "Look at whether the acceleration is driven by contributor growth (hiring burst), new repositories (infrastructure buildout), raw velocity increase (deploy spike), or general acceleration (framework migration). Each type tells you something different about the company's stage and trajectory.",
        },
        {
          name: "Cross-reference with Crunchbase and the company's GitHub",
          text: "Check the startup's funding history on Crunchbase. Are they pre-raise or post-raise? Then look at their GitHub directly: is the activity product-related or maintenance noise? Does the tech stack match what they claim to be building?",
        },
        {
          name: "Reach out during the acceleration window",
          text: "If the signal is strong and the timing is right (weeks 2-4 of a velocity spike), reach out to the founder. You are ahead of the crowd at this point — most investors will not hear about the company for another 4-8 weeks.",
        },
      ],
    },
    faqs: [
      {
        question: "What is engineering acceleration in the context of startup investing?",
        answer: "Engineering acceleration is the rate of change in a startup's commit velocity — not absolute output, but whether engineering activity is speeding up relative to the company's own baseline. When a startup's commit velocity doubles in two weeks, something fundamental has changed: new hires, product-market fit, or fundraise-driven shipping. VC Deal Flow Signal tracks this metric across 20 sectors as a leading indicator of startup momentum.",
      },
      {
        question: "How far in advance do GitHub signals predict fundraises?",
        answer: "In VC Deal Flow Signal's data, engineering acceleration signals precede fundraise announcements by three to six weeks on average. The pattern starts with rising commit velocity in weeks 1-2, becomes obvious in weeks 3-4 with new repositories and classifiable signal types, and the fundraise announcement typically follows in weeks 8-12. Reaching out to founders in weeks 2-4 puts investors ahead of the crowd.",
      },
      {
        question: "Can GitHub commit data be gamed or faked?",
        answer: "While individual commits can be trivially created, sustained engineering acceleration is very difficult to fake. VC Deal Flow Signal measures change from baseline rather than absolute counts, which filters out documentation sprints, CI/CD noise, and inflated commit volumes. A genuine product sprint looks fundamentally different from artificial activity when compared to a company's own historical patterns.",
      },
    ],
    body: `GitHub is the largest free dataset of real-time engineering activity in the world. Every public commit, every new repository, every contributor who joins a project — it is all timestamped and queryable. Yet almost no investor uses it for deal sourcing.

The reason is simple: raw GitHub data is noisy. Thousands of commits a day across millions of repositories. Without a framework for what matters, it is just noise.

This post explains the framework we use at VC Deal Flow Signal to turn GitHub activity into actionable deal flow intelligence.

## What Is Engineering Acceleration?

We do not measure absolute engineering output. A company with 500 commits a week is not necessarily more interesting than one with 50. What matters is the rate of change — acceleration.

When a startup's commit velocity doubles in two weeks, something has changed. Maybe they just closed a seed round and are shipping furiously. Maybe they hired three engineers and are building out infrastructure. Maybe they found product-market fit and are iterating fast on customer feedback.

Whatever the cause, the effect is visible in the commit graph weeks before it appears in a press release or a pitch deck landing in your inbox. We have identified [five specific GitHub patterns that predict fundraises](/blog/5-github-patterns-that-predict-fundraises) with the most consistency.

## What Are the Four Types of Engineering Signals?

We classify engineering acceleration into four patterns:

**Engineering hiring burst**: Contributor count jumps 50% or more in a short window. This usually means the company just closed a round and is scaling the team. If you are seeing this signal, you are likely too late for the current round — but perfectly timed for the next one.

**Infrastructure buildout**: Three or more new public repositories created in 30 days. The company is expanding its technical surface area — new microservices, new SDKs, new internal tools. This is classic Series A behavior: the product works, now they are building the platform.

**Deploy frequency spike**: Commit velocity increases 150% or more versus baseline. The team is shipping at an unusually high rate. This can indicate a product launch, a pivot, or a response to sudden customer demand. All are interesting to investors.

**Framework migration**: General acceleration that does not fit the above categories. Often indicates a technology stack transition — moving from a prototype stack to a production stack. This is the subtlest signal but can indicate the shift from exploration to exploitation.

## What GitHub Activity Is Not a Useful Signal?

Not all GitHub activity is meaningful for investors:

- **Open source maintenance**: Popular open source projects have high commit volumes but that tells you nothing about the company's product trajectory.
- **Documentation pushes**: A burst of markdown commits usually means a docs sprint, not product acceleration.
- **CI/CD noise**: Some teams commit generated files or configuration changes that inflate commit counts without reflecting product work.

We mitigate these by measuring change from baseline rather than absolute counts. A docs sprint looks different from a product sprint when you compare the commit graph to the company's own history.

## When Do Engineering Signals Appear Before Fundraises?

In our data, engineering acceleration signals precede fundraise announcements by three to six weeks on average. The pattern looks like this:

1. **Weeks 1-2**: Commit velocity starts climbing. Contributor count may tick up.
2. **Weeks 3-4**: Acceleration becomes obvious. New repositories appear. Signal type becomes classifiable.
3. **Weeks 5-8**: The company is heads-down building. If they are raising, the round is in progress but not yet announced.
4. **Weeks 8-12**: Fundraise announcement, TechCrunch article, your inbox lights up with the same deck everyone else got.

If you are reaching out in weeks 2-4, you are ahead of the crowd. That is the window this data gives you.

## How Should Investors Use This in Practice?

The most effective approach is sector-focused. Pick two or three sectors you know well and watch the weekly rankings:

1. When a startup you do not recognize appears in the top 3, research them.
2. Look at their GitHub: is the activity product-related or infrastructure-related?
3. Cross-reference with Crunchbase: are they pre-raise? Post-raise and scaling?
4. If the signal is strong and the timing is right, reach out to the founder.

The worst thing you can do with this data is use it as a replacement for judgment. Engineering acceleration is a leading indicator, not a guarantee. But combined with sector expertise and founder evaluation, it gives you a structural timing advantage that most investors do not have. For a deeper look at technical evaluation, see our guide on [how VCs use GitHub for due diligence](/blog/github-due-diligence-for-vcs).

## Where Can I Start Watching?

We track engineering acceleration across 20 startup sectors, updated weekly. Each sector page ranks the top startups by commit velocity change and classifies their signal type.

Browse the sector rankings to see which startups are accelerating right now.`,
  },
  {
    slug: "what-is-deal-flow-signal",
    title: "What Is Deal Flow Signal? A Guide for Investors",
    description:
      "Deal flow signal refers to data-driven indicators that help investors identify promising startups before traditional channels surface them. Learn how engineering momentum serves as a leading indicator of traction.",
    references: [
      { label: "1", title: "The Rise of Alternative Data in VC", url: "https://hbr.org/2022/11/how-to-use-alternative-data-to-find-the-best-deals", source: "Harvard Business Review" },
      { label: "2", title: "GitHub Octoverse 2024", url: "https://github.blog/news-insights/octoverse/octoverse-2024/", source: "GitHub Blog" },
    ],
    summary:
      "Deal flow signal is any data-driven indicator that surfaces a promising startup before traditional channels — warm intros, pitch decks, press — bring it to investors. The four main types are engineering signals (GitHub, 6-12 weeks lead time), hiring signals (job boards, 4-8 weeks), web traffic signals (4-6 weeks), and social signals (1-2 weeks). GitHub engineering activity provides the longest lead time and is the hardest to game, making it the most reliable early deal flow signal for venture investors.",
    date: "2026-03-25",
    figures: [
      { id: "lead-time-comparison", afterHeading: "Are GitHub Signals the Best" },
    ],
    relatedSectors: ["enterprise-saas", "fintech", "ai-ml"],
    faqs: [
      {
        question: "What is deal flow signal in venture capital?",
        answer: "Deal flow signal is any data-driven indicator that helps an investor identify a promising startup before traditional deal sourcing channels — warm introductions, pitch decks, demo days, and press coverage — surface it. The most common types include engineering signals (GitHub commit velocity), hiring signals (job postings), web traffic signals, and social signals. Engineering signals provide the longest lead time at 6-12 weeks before fundraise announcements.",
      },
      {
        question: "What types of alternative data can investors use for deal sourcing?",
        answer: "Investors can use four main types of alternative data for deal sourcing: engineering activity from GitHub (6-12 weeks lead time), hiring signals from job boards and LinkedIn (4-8 weeks), web traffic data from tools like SimilarWeb (4-6 weeks), and social signals from Twitter, Hacker News, and Product Hunt (1-2 weeks). GitHub engineering data has the highest lead time and is the hardest to game.",
      },
      {
        question: "How much lead time do engineering signals provide over traditional deal flow?",
        answer: "Engineering signals from GitHub typically provide 6-12 weeks of lead time over traditional deal flow channels. Traditional deal flow — Crunchbase alerts, warm introductions, press coverage — surfaces companies after they have already raised or are well into a competitive round. Engineering acceleration signals appear when the team starts building, which is weeks before any public announcement.",
      },
    ],
    body: `Deal flow signal is any data-driven indicator that helps an investor identify a promising startup before traditional deal sourcing channels surface it. Traditional deal flow relies on warm introductions, pitch decks, demo days, and industry press. Deal flow signal supplements this with quantitative, real-time data.

## Why Is Traditional Deal Flow Not Enough?

Most VCs source deals through their network. The problem is that networks are shared. By the time a startup is making the rounds at demo day or landing in your inbox via a warm intro, it is also landing in every other investor's inbox.

The result is that competitive deals — the ones most likely to generate outsized returns — are identified late and negotiated under pressure. The investor who arrives first has a structural advantage: they set the terms, they build the relationship before the founder is overwhelmed with options. This is why [alternative data is becoming essential for venture capital](/blog/alternative-data-venture-capital).

## What Are the Main Types of Deal Flow Signal?

There are several categories of deal flow signal, each with different lead times and reliability:

**Engineering signals** (highest lead time): Changes in a startup's public engineering activity — commit velocity, contributor growth, repository creation. These signals appear 6-12 weeks before fundraise announcements because engineering acceleration precedes product milestones, which precede fundraise decisions.

**Hiring signals** (medium lead time): Job postings, especially for senior engineering and go-to-market roles, indicate growth plans. Lead time is typically 4-8 weeks.

**Web traffic signals** (medium lead time): Rapid growth in a startup's web traffic can indicate product-market fit. Lead time is 4-6 weeks.

**Social signals** (low lead time): Mentions on Twitter, Hacker News, Product Hunt, and industry forums. By the time a startup trends on social media, most investors are already aware.

## Why Are GitHub Signals the Best Leading Indicator?

GitHub engineering activity has unique properties that make it the most reliable early deal flow signal:

1. **It is hard to fake.** Commits represent actual work. You cannot game commit velocity the way you can game social media metrics.
2. **It is continuous.** Unlike hiring signals (which appear when a job is posted) or press (which appears when a company wants attention), engineering activity happens daily.
3. **It is free and public.** Unlike web traffic data (which requires third-party tools) or hiring data (which requires scraping job boards), GitHub data is available via a public API.
4. **It reveals intent.** The type of engineering work — infrastructure buildout vs. feature shipping vs. team scaling — tells you what phase the company is in.

## How Does VC Deal Flow Signal Work?

We monitor GitHub engineering activity across 20 startup sectors. For each sector, we:

1. Identify active startup organizations using topic-based search.
2. Pull commit activity, contributor data, and repository creation data.
3. Calculate 14-day commit velocity and its rate of change.
4. Classify the signal type (hiring burst, infrastructure buildout, deploy spike, framework migration).
5. Rank startups by engineering acceleration.

The result is a weekly-updated ranking of startups showing the strongest engineering momentum in each sector. Investors can use this to identify breakout companies weeks before they appear through traditional channels.

## How Do I Get Started with Deal Flow Signal?

The simplest way to start using deal flow signal is to get our free Signal Report — five breakout startups with real GitHub acceleration data, delivered weekly. For deeper access, our Dashboard gives you the full ranked list across all 20 sectors with filtering by stage, geography, and signal type. To learn the practical framework, read our guide on [how to read GitHub signals for startup investing](/blog/how-to-read-github-signals-for-startup-investing).`,
  },
  {
    slug: "github-due-diligence-for-vcs",
    title: "How VCs Use GitHub for Technical Due Diligence",
    description:
      "A practical framework for using public GitHub data in venture capital due diligence. What to look for, what to ignore, and how engineering signals complement traditional diligence methods.",
    references: [
      { label: "1", title: "GitHub REST API — Repository Statistics", url: "https://docs.github.com/en/rest/metrics/statistics", source: "GitHub Docs" },
      { label: "2", title: "Technical Due Diligence for VCs", url: "https://a16z.com/how-to-evaluate-a-technical-team/", source: "Andreessen Horowitz" },
    ],
    keyStats: [
      { value: "2-5 min", label: "Per-company screening time", context: "Using public GitHub data" },
      { value: "5", label: "Diligence dimensions", context: "Velocity, team, tech, repos, strategy" },
      { value: "50%+", label: "Contributor growth threshold", context: "Indicates recent fundraise" },
    ],
    howTo: {
      name: "How to Use GitHub for VC Technical Due Diligence",
      description: "A step-by-step process for using public GitHub data at every stage of the venture investment process — from sourcing through portfolio monitoring.",
      totalTime: "PT15M",
      steps: [
        { name: "Screen with commit velocity change", text: "Use commit velocity change to identify startups worth researching. VC Deal Flow Signal automates this across 20 sectors, surfacing companies showing unusual engineering acceleration." },
        { name: "Check the GitHub organization profile", text: "Look at the GitHub org: how many public repos, when was the last push, is there consistent activity or sporadic bursts? This takes 2 minutes and filters out inactive teams." },
        { name: "Research before the meeting", text: "Before a founder meeting, check their GitHub for languages, frameworks, and active contributor count. This gives you informed technical questions to ask during the call." },
        { name: "Verify founder claims post-meeting", text: "After the founder pitch, cross-reference their claims with GitHub. Does the team size match contributor counts? Does their velocity match commit patterns?" },
        { name: "Monitor portfolio companies", text: "After investing, use GitHub signals as an early warning system. A 50% drop in commit velocity over two months may indicate team attrition or strategic confusion — before the quarterly board update." },
      ],
    },
    summary:
      "Public GitHub data cannot replace a technical deep dive, but it can help investors decide which companies deserve one. GitHub profiles reveal engineering velocity and consistency, team composition, technology choices, and open source strategy. The most effective approach uses GitHub data at every stage: commit velocity change for sourcing, org profiles for initial screening, contributor patterns for pre-meeting research, and ongoing monitoring as a portfolio early-warning system.",
    date: "2026-04-01",
    relatedSectors: ["developer-tools", "ai-ml", "enterprise-saas"],
    faqs: [
      {
        question: "Can public GitHub data replace traditional technical due diligence?",
        answer: "No. Public GitHub data cannot replace a proper technical deep dive with the engineering team. But it can do something equally valuable: help investors decide which companies deserve that deep dive in the first place. It serves as a fast screening tool at the sourcing stage and a verification tool at the due diligence stage, complementing — not replacing — traditional technical evaluation.",
      },
      {
        question: "What should investors look for on a startup's GitHub profile?",
        answer: "Investors should check five things: (1) commit velocity consistency — regular shipping vs. erratic bursts, (2) contributor count and growth — a proxy for team size and scaling, (3) technology choices — whether the stack matches the company's stage, (4) new repository creation — signs of platform building, and (5) the ratio of product code to maintenance activity. These checks take 2-5 minutes per company.",
      },
      {
        question: "Is it ethical to use public GitHub data for investment decisions?",
        answer: "Using public data for investment decisions is legal and common practice. However, investors should not contact individual contributors directly or attempt to recruit from portfolio companies based on GitHub profiles. GitHub data should be one signal among many — never the sole basis for an investment decision. The strongest investment thesis combines engineering signals with market analysis, founder evaluation, and customer reference checks.",
      },
    ],
    body: `Technical due diligence is one of the most time-consuming parts of the venture investment process. VCs typically hire external consultants, schedule deep-dive sessions with engineering teams, and review architecture documents. This process takes weeks and often happens late in the deal cycle.

Public GitHub data cannot replace a proper technical deep dive. But it can do something equally valuable: help you decide which companies deserve that deep dive in the first place.

## What Can Public GitHub Data Tell Investors?

GitHub profiles reveal several dimensions of engineering health that are useful for investors:

**Engineering velocity and consistency**: Is the team shipping regularly, or are there long gaps followed by frantic bursts? Consistent commit patterns suggest disciplined engineering practices. Erratic patterns may indicate management instability, pivots, or part-time teams.

**Team composition signals**: Contributor counts, contribution patterns, and the ratio of organizational contributors to external ones reveal team structure. A startup with 3 contributors making 90% of commits has a different risk profile than one with 15 active contributors.

**Technology choices**: The programming languages, frameworks, and tools visible in public repositories tell you about technical maturity. A seed-stage startup using enterprise-grade infrastructure tooling may be over-engineering. A growth-stage company still on prototype-quality tools may have technical debt.

**Open source strategy**: Some startups use open source as a go-to-market channel (developer tools, infrastructure). Their GitHub activity IS the product signal. Others keep everything private and only have minor utility repos public. The absence of public activity is not a negative signal for the latter.

## What Are the Limitations of GitHub Data for Due Diligence?

**Code quality**: Commit volume says nothing about code quality, test coverage, or architectural soundness. A team making 200 commits a week could be writing excellent code or terrible code.

**Private repository activity**: Most startups keep their core product code private. Public repos may represent only a fraction of actual engineering work. Never assume low public activity means low engineering output.

**Individual contributor value**: Not all contributors are equal. One senior engineer making 10 thoughtful commits may contribute more value than five junior developers making 50 commits each.

**Business context**: Engineering acceleration without business context is just a number. The same commit pattern could indicate product-market fit, a desperate pivot, or a hackathon project.

## How Should Investors Use GitHub in Their Due Diligence Process?

Here is how to use GitHub data at each stage of the investment process:

**Sourcing stage**: Use commit velocity change to identify startups worth researching. This is what VC Deal Flow Signal automates — surfacing the companies showing unusual engineering acceleration. See the [7 engineering metrics every investor should track](/blog/startup-engineering-metrics-investors-should-track) for a complete checklist.

**Initial screening**: Look at the GitHub organization profile. How many public repos? When was the last push? Is there a pattern of consistent activity, or sporadic bursts? This takes 2 minutes and can save you from scheduling calls with inactive teams.

**Pre-meeting research**: Before a founder meeting, check their GitHub. What languages and frameworks do they use? How many active contributors? This gives you informed questions to ask during the call.

**Post-meeting verification**: After hearing the founder's story about their engineering team and roadmap, cross-reference with GitHub. Does the team size they claimed match contributor counts? Does their claimed velocity match commit patterns?

**Portfolio monitoring**: After investing, use GitHub signals as an early warning system. A portfolio company whose commit velocity drops 50% over two months may be experiencing team attrition, strategic confusion, or runway pressure. This signal appears before the quarterly board update.

## What Are the Ethical Considerations of Using GitHub Data?

Using public data for investment decisions is legal and common. However, there are ethical considerations:

Do not contact individual contributors or attempt to recruit from portfolio companies. GitHub profiles are public, but using them to poach talent is poor form in the investor community.

Do not make investment decisions based solely on GitHub data. It is one signal among many. The strongest investment thesis combines engineering signals with market analysis, founder evaluation, and customer reference checks.

Always remember that engineering acceleration is a leading indicator, not a guarantee. Some of the fastest-accelerating startups will fail. The data gives you timing advantage, not outcome certainty. For the specific patterns to watch, read about the [5 GitHub patterns that predict fundraises](/blog/5-github-patterns-that-predict-fundraises).`,
  },
  {
    slug: "5-github-patterns-that-predict-fundraises",
    references: [
      { label: "1", title: "GitHub Search API — Repositories", url: "https://docs.github.com/en/rest/search/search#search-repositories", source: "GitHub Docs" },
      { label: "2", title: "Crunchbase Global Funding Report 2025", url: "https://about.crunchbase.com/blog/global-funding-report/", source: "Crunchbase" },
    ],
    keyStats: [
      { value: "5", label: "Predictive patterns", context: "Identified from GitHub data" },
      { value: "50%+", label: "Contributor jump", context: "Pattern 1: hiring burst" },
      { value: "100%+", label: "Velocity regime change", context: "Pattern 5: strongest signal" },
    ],
    title: "5 GitHub Patterns That Predict Startup Fundraises",
    description:
      "Five specific GitHub engineering patterns that have historically preceded startup fundraise announcements by 6-12 weeks. What to look for and why these patterns work as leading indicators.",
    figures: [
      { id: "signal-timeline", afterHeading: "How Should Investors Combine" },
    ],
    summary:
      "Five GitHub patterns reliably precede startup fundraise announcements: (1) the contributor step function — a 50%+ jump in unique contributors, signaling post-round hiring, (2) the infrastructure explosion — 3-5 new repos in a month, (3) the weekend surge — sustained 7-day commit patterns from multiple contributors, (4) the documentation sprint — proactive docs suggesting preparation for scrutiny, and (5) the velocity regime change — commit velocity exceeding the 6-month average by 100%+. The strongest signal is when patterns 1 and 5 appear simultaneously.",
    date: "2026-04-04",
    relatedSectors: ["ai-ml", "fintech", "cybersecurity"],
    faqs: [
      {
        question: "What GitHub patterns predict startup fundraises?",
        answer: "Five GitHub patterns reliably precede fundraise announcements: (1) The Contributor Step Function — a sudden 50%+ jump in unique contributors, indicating post-round hiring, (2) The Infrastructure Explosion — 3-5 new repos in a month, signaling platform buildout, (3) The Weekend Surge — sustained 7-day commit patterns from multiple contributors, (4) The Documentation Sprint — proactive documentation suggesting preparation for scrutiny, and (5) The Velocity Regime Change — commit velocity exceeding the 6-month average by 100%+.",
      },
      {
        question: "How reliable are GitHub-based fundraise predictions?",
        answer: "GitHub patterns are leading indicators, not guarantees. They appear with enough regularity to be useful — particularly when multiple patterns overlap — but not all engineering acceleration leads to fundraising. Some acceleration reflects product-market fit, pivots, or hackathon activity. The patterns are most reliable when a startup shows two or more signals simultaneously, such as contributor growth combined with a velocity regime change.",
      },
      {
        question: "Which combination of GitHub patterns is the strongest fundraise signal?",
        answer: "The strongest combination is Pattern 1 (contributor step function — sudden team growth) plus Pattern 5 (velocity regime change — sustained doubling of commit velocity). When both appear simultaneously, the startup has almost certainly either just closed a round or is in the middle of one. The new hires are shipping code at an accelerated pace, and the compound signal is very difficult to produce without real organizational change.",
      },
    ],
    body: `After tracking GitHub engineering activity across thousands of startups, we have identified five patterns that consistently appear before fundraise announcements. These patterns are not guarantees, but they appear with enough regularity to be useful as leading indicators for investors. If you are new to this approach, start with our primer on [how to read GitHub signals for startup investing](/blog/how-to-read-github-signals-for-startup-investing).

## Pattern 1: What Does a Sudden Contributor Jump Signal?

The most reliable fundraise predictor is a sudden, sustained increase in unique contributors. Not a gradual climb — a step function. The team goes from 5 contributors to 12 in a two-week window.

Why it works: most startups hire in bursts immediately after closing a round. The new hires start committing code within days of joining. If you see the contributor count jump, the round likely closed 2-4 weeks ago and the announcement is 4-8 weeks away.

What to look for: contributor count increases 50% or more in a 14-day window, sustained for at least 4 weeks after.

## Pattern 2: What Does a Burst of New Repositories Mean?

A startup that suddenly creates 3-5 new public repositories in a single month is building platform infrastructure. This pattern typically appears at the Seed-to-Series-A transition: the core product works, and now the team is building the supporting ecosystem.

Why it works: infrastructure buildout requires capital. Companies do not invest in platform engineering unless they have runway. The timing suggests a recent or imminent fundraise.

What to look for: 3 or more new repositories created in 30 days, with the new repos being infrastructure-related (SDKs, APIs, internal tools, deployment configs) rather than experimental or documentation repos.

## Pattern 3: What Does Weekend Commit Activity Indicate?

When a startup's commit pattern shifts from weekday-only to seven-days-a-week, something has changed. This is especially meaningful when the weekend activity comes from multiple contributors, not just a solo founder.

Why it works: teams work weekends when they are racing toward a deadline. Common triggers include a product launch, a fundraise-related demo, or a competitive response. All of these are signals that something significant is happening.

What to look for: sustained weekend commit activity across 2 or more contributors for 3 or more consecutive weekends.

## Pattern 4: Why Is a Documentation Sprint a Fundraise Signal?

A sudden burst of documentation commits — README updates, API docs, architecture diagrams, contributing guides — often precedes a fundraise or launch. This is the team preparing for scrutiny.

Why it works: documentation is the last thing engineering teams do voluntarily. When they document proactively, they are either preparing for due diligence (fundraise), opening up to community contributions (launch), or onboarding new hires (post-fundraise). All three are interesting to investors.

What to look for: a week or more of documentation-heavy commits after a period of feature development. The sequence matters: code first, docs second suggests intentional preparation.

## Pattern 5: What Is a Velocity Regime Change?

The strongest signal is not high velocity — it is a change in velocity regime. A startup that averages 30 commits per 14-day window for six months, then suddenly jumps to 90 commits for three consecutive windows, has undergone a fundamental shift.

Why it works: velocity regime changes reflect organizational changes. Common causes include new funding (more engineers), product-market fit (faster iteration), or a strategic pivot (rebuilding). Regime changes that sustain for 6 or more weeks are particularly meaningful.

What to look for: commit velocity that exceeds the 6-month average by 100% or more, sustained for 3 or more consecutive 14-day windows.

## How Should Investors Combine These Patterns?

The patterns above are most powerful in combination. A startup showing Pattern 1 (contributor jump) and Pattern 5 (velocity regime change) simultaneously is almost certainly in the middle of a fundraise or has just closed one.

VC Deal Flow Signal tracks all five patterns across 20 startup sectors and classifies them into four signal types: engineering hiring burst, infrastructure buildout, deploy frequency spike, and framework migration. For the full metrics checklist, see [7 engineering metrics every investor should track](/blog/startup-engineering-metrics-investors-should-track). Browse the sector rankings to see which startups are showing these patterns right now.`,
  },
  {
    slug: "alternative-data-venture-capital",
    title: "Alternative Data for Venture Capital: Why GitHub Is the Most Underused Signal",
    references: [
      { label: "1", title: "Alternative Data and AI in Investment Management", url: "https://www.cfainstitute.org/en/research/foundation/2020/alternative-data", source: "CFA Institute" },
      { label: "2", title: "GitHub Octoverse 2024 — Developer Activity", url: "https://github.blog/news-insights/octoverse/octoverse-2024/", source: "GitHub Blog" },
      { label: "3", title: "The Rise of Alternative Data in Private Markets", url: "https://www.bain.com/insights/alternative-data-in-private-equity/", source: "Bain & Company" },
    ],
    description:
      "Alternative data has transformed public market investing. Now it is coming to venture capital. GitHub engineering activity is the most accessible, real-time, and underused alternative data source for startup investors.",
    figures: [
      { id: "lead-time-comparison", afterHeading: "Is GitHub the Best Alternative" },
    ],
    summary:
      "Alternative data transformed public market investing over the past decade — satellite imagery, credit card data, app downloads. Venture capital has been slower to adopt it, despite the most accessible alternative data source sitting in the open: GitHub. GitHub engineering data is continuous (updated daily), free (public API), hard to fake (commits represent real work), and reveals intent (activity type indicates company phase). Almost no investor monitors it systematically, creating an information asymmetry for those who do.",
    date: "2026-04-07",
    relatedSectors: ["ai-ml", "data-infrastructure", "fintech"],
    faqs: [
      {
        question: "What is alternative data in venture capital?",
        answer: "Alternative data in venture capital is any dataset that reveals startup traction before it appears through conventional deal sourcing channels. The main categories include engineering activity from GitHub (commit velocity, contributor growth), hiring signals from job boards, web traffic from analytics tools, social mentions from platforms like Twitter and Hacker News, and patent filings. Unlike traditional deal flow data (funding announcements, press, warm intros), alternative data provides a leading rather than lagging indicator.",
      },
      {
        question: "Why is GitHub data considered the most underused signal for VCs?",
        answer: "GitHub data stands out among alternative data sources because it is continuous (updated daily, not monthly), free and public (no scraping or paid tools required), hard to fake (commits represent real engineering work), and reveals intent (the type of activity tells you what phase the company is in). Despite these properties, almost no investor monitors GitHub systematically — creating an information asymmetry for those who do.",
      },
      {
        question: "How do hedge funds and quant investors use alternative data?",
        answer: "Quantitative investment firms have used alternative data in public markets for over a decade — satellite imagery of parking lots, credit card transactions, app downloads. The edge comes not from exclusive data but from reading what others ignore, faster and more consistently. The same principle applies to venture capital: every investor has access to GitHub, but almost none monitor it systematically. Building a workflow around engineering signals creates a structural timing advantage.",
      },
    ],
    body: `Alternative data changed public market investing over the past decade. Satellite imagery of parking lots, credit card transaction data, app download metrics — hedge funds built entire strategies on signals that traditional analysts ignored.

Venture capital has been slower to adopt alternative data. Most deal sourcing still relies on warm introductions, demo days, and newsletters. The irony is that the most accessible alternative data source for startup investing has been sitting in the open for years: GitHub.

## What Counts as Alternative Data for Venture Capital?

In public markets, alternative data is any dataset that provides insight into a company's performance beyond traditional financial filings. For venture capital, the concept is similar — any signal that reveals startup traction before it appears through conventional deal sourcing channels.

The main categories of alternative data for VCs:

**Engineering activity** (GitHub): Commit velocity, contributor growth, repository expansion. Available via public API, updated daily, hard to fake. Lead time: 6-12 weeks before fundraise announcements.

**Hiring signals** (job boards, LinkedIn): New job postings, especially for senior engineering and go-to-market roles. Scraping required, updated weekly. Lead time: 4-8 weeks.

**Web traffic** (SimilarWeb, Sensor Tower): Rapid growth in a startup's web or app traffic. Requires paid tools, updated monthly. Lead time: 4-6 weeks.

**Social signals** (Twitter, HN, Reddit): Mentions, upvotes, and community engagement. Free but noisy, real-time. Lead time: 1-2 weeks (often lagging, not leading).

**Patent filings** (USPTO, EPO): New patent applications signal R&D direction. Free but delayed by 18 months, so more useful for competitive analysis than timing.

## Why Is GitHub the Best Alternative Data Source for VCs?

Among all alternative data sources for VCs, GitHub engineering activity has unique properties:

**It is continuous and granular.** Unlike hiring signals (which appear when a job is posted) or web traffic (which updates monthly), GitHub commits happen daily. You can track weekly velocity changes and catch acceleration patterns in real time.

**It is free and public.** GitHub's API provides commit history, contributor data, and repository metadata at no cost. No scraping required. No third-party tools needed for basic analysis.

**It reflects real work.** Commits represent actual engineering output. You cannot game commit velocity the way you can game social media metrics or app store rankings. A team that ships 200 commits in a week did real engineering work.

**It reveals intent.** The type of engineering activity — new infrastructure repos, contributor scaling, velocity spikes — tells you what phase a startup is in. Infrastructure buildout looks different from feature shipping, which looks different from a documentation sprint before a fundraise.

## How Do Quantitative Investors Approach Alternative Data?

Quantitative investment firms have understood for years that public data, processed systematically, creates information asymmetry. The edge is not in having exclusive data — it is in reading what others ignore, faster and more consistently.

The same principle applies to venture capital. Every investor has access to GitHub. Almost none of them monitor it systematically. The investor who builds a workflow around engineering signals has a structural timing advantage: they see acceleration patterns 6-12 weeks before the fundraise announcement that fills everyone else's inbox.

This is not theoretical. At VC Deal Flow Signal, we track thousands of startup GitHub orgs across 20 sectors and rank them by engineering acceleration. The patterns are consistent: commit velocity spikes, contributor growth bursts, and infrastructure buildouts appear weeks before TechCrunch writes about the company. We break down the [5 GitHub patterns that predict fundraises](/blog/5-github-patterns-that-predict-fundraises) in a separate deep dive.

## How Can Investors Start Using Alternative Data?

If you are an investor interested in adding alternative data to your sourcing process, start with the highest signal-to-noise ratio source: GitHub engineering acceleration.

1. Pick 2-3 sectors you know well
2. Watch the weekly sector rankings for unfamiliar names in the top 3
3. Cross-reference with Crunchbase for funding history and stage
4. Reach out to founders during the acceleration window (weeks 2-4 of a velocity spike)

The combination of engineering signals for timing and traditional data for due diligence gives you both a lead time advantage and a solid evaluation framework. For a practical walkthrough, see [how to source deals before Crunchbase](/blog/source-startup-deals-before-crunchbase).

Browse our sector rankings to see which startups are showing engineering acceleration right now, or get the free Signal Report for a weekly summary of the top breakout signals.`,
  },
  {
    slug: "source-startup-deals-before-crunchbase",
    title: "How to Source Startup Deals Before They Appear on Crunchbase",
    references: [
      { label: "1", title: "GitHub REST API — Commit Activity", url: "https://docs.github.com/en/rest/metrics/statistics#get-the-last-year-of-commit-activity", source: "GitHub Docs" },
      { label: "2", title: "Crunchbase — Global Funding Data", url: "https://about.crunchbase.com/blog/global-funding-report/", source: "Crunchbase" },
      { label: "3", title: "Hacker News — Show HN Guidelines", url: "https://news.ycombinator.com/showhn.html", source: "Y Combinator" },
    ],
    description:
      "Crunchbase tells you what already happened. Learn three approaches to finding startups before they raise — using GitHub signals, community sourcing, and hiring data as leading indicators.",
    figures: [
      { id: "lead-time-comparison", afterHeading: "How Should Investors Combine All Three" },
    ],
    summary:
      "Crunchbase is a lagging indicator — companies appear after rounds close. Three approaches find startups earlier: GitHub engineering signals (6-12 weeks lead time, the earliest public signal), community sourcing from Hacker News, Product Hunt, and Indie Hackers (variable lead time, wide coverage), and hiring signals from job boards (4-8 weeks). The most effective workflow combines all three: GitHub signals for timing, community signals for context, hiring data for confirmation, and Crunchbase for verification. The full process takes 15-20 minutes per company.",
    date: "2026-04-10",
    relatedSectors: ["developer-tools", "enterprise-saas", "ai-ml"],
    howTo: {
      name: "How to Source Startup Deals Before They Appear on Crunchbase",
      description:
        "A weekly workflow for finding breakout startups using GitHub signals, community sourcing, and hiring data — before they hit Crunchbase. Takes 15-20 minutes per company.",
      totalTime: "PT20M",
      steps: [
        {
          name: "Check the sector rankings for your focus areas",
          text: "Every week, open the VC Deal Flow Signal sector rankings for the 2-3 sectors you invest in. Look for unfamiliar names in the top 3 with strong commit velocity change — these are the companies showing unusual engineering acceleration.",
        },
        {
          name: "Spend 5 minutes on their GitHub",
          text: "Open the startup's GitHub organization. Is the activity product-related or maintenance noise? Are new repos appearing? Is the contributor count growing? This quick check filters out false positives from docs sprints or CI/CD activity.",
        },
        {
          name: "Search community platforms for context",
          text: "Search Hacker News, Reddit, and Twitter for the company name. Is the founder talking about traction, customer feedback, or hiring? Community signals add qualitative context to the quantitative GitHub data.",
        },
        {
          name: "Check their careers page for hiring signals",
          text: "Visit the startup's website and look for open roles. Senior engineering hires suggest post-fundraise scaling. Head of Sales or VP Marketing suggests go-to-market buildout. Multiple simultaneous postings confirm a coordinated growth push.",
        },
        {
          name: "Verify on Crunchbase and reach out",
          text: "Open Crunchbase to check funding history and competitive landscape. If the company is pre-raise and all signals align — engineering acceleration, community buzz, active hiring — reach out to the founder. You are 6-12 weeks ahead of investors who only use Crunchbase alerts.",
        },
      ],
    },
    faqs: [
      {
        question: "How can investors find startup deals before Crunchbase?",
        answer: "Investors can find deals before Crunchbase using three signal types: (1) GitHub engineering signals — the earliest indicator, detecting commit velocity spikes 6-12 weeks before fundraise announcements, (2) community signals from Hacker News, Product Hunt, and Indie Hackers — variable lead time, wide coverage, and (3) hiring signals from job boards and LinkedIn — 4-8 weeks lead time. Combining all three with Crunchbase for verification gives both timing advantage and diligence depth.",
      },
      {
        question: "What is the earliest public signal of startup momentum?",
        answer: "GitHub engineering acceleration is the earliest publicly available signal of startup momentum. The logic is straightforward: engineering acceleration precedes product milestones, which precede fundraise decisions, which precede Crunchbase entries. When a startup's commit velocity doubles in a two-week window and the change is sustained, the underlying cause — post-fundraise scaling, product-market fit, or launch preparation — is already in motion 6-12 weeks before any public announcement.",
      },
      {
        question: "How much time does GitHub signal data give you over Crunchbase alerts?",
        answer: "GitHub engineering signals provide 6-12 weeks of lead time over Crunchbase alerts. Crunchbase alerts trigger on fundraise announcements, which are published after the round closes — zero lead time. GitHub signals detect acceleration patterns while the round is still in progress or before fundraising even begins. The top movers in VC Deal Flow Signal's weekly rankings consistently include companies that announce raises 4-8 weeks later.",
      },
    ],
    body: `Every investor uses Crunchbase. That is exactly the problem.

Crunchbase is excellent at what it does: a comprehensive database of startup funding rounds, team members, and company profiles. But by design, it is a lagging indicator. A company appears in your Crunchbase alert after the round closes, after the terms are set, after the press release is written. You are seeing what already happened.

The investors who consistently get into the best deals are the ones who found the company before it appeared on Crunchbase. This post covers three practical approaches to doing that.

## How Do GitHub Engineering Signals Help You Find Deals First?

GitHub engineering activity is the earliest publicly available signal of startup momentum — and part of a broader shift toward [alternative data in venture capital](/blog/alternative-data-venture-capital). The logic is straightforward: engineering acceleration precedes product milestones, which precede fundraise decisions, which precede Crunchbase entries.

When a startup's commit velocity doubles in a two-week window and the change is sustained, something fundamental has shifted. Common causes:

- **Post-fundraise scaling**: New capital deployed → new engineers hired → commit velocity spikes. The round closed but is not yet announced. Lead time: 6-12 weeks before the Crunchbase entry.
- **Product-market fit iteration**: Customer feedback driving rapid feature development. Lead time: 8-16 weeks before a fundraise decision is even made.
- **Launch preparation**: Team pushing toward a release. Often followed by press coverage and investor attention.

What to look for:
- **Commit velocity change > 100%**: The startup's 14-day commit count doubled compared to the prior window.
- **Contributor growth > 50%**: New team members appeared — likely recent hires.
- **3+ new repositories in 30 days**: Infrastructure buildout, classic Series A behavior.

This is what VC Deal Flow Signal tracks across 20 sectors weekly. The top movers consistently include companies that announce raises 4-8 weeks later.

## Which Community Platforms Surface Startups Earliest?

Community platforms surface startups at different stages of visibility:

**Hacker News Show HN** — Very early signal. Founders posting technical projects before they have a pitch deck. Lead time: months before any institutional awareness. The challenge is volume — most Show HN posts are weekend projects, not fundable companies.

**Indie Hackers** — Build-in-public culture means founders share revenue numbers, growth metrics, and technical decisions openly. Lead time: weeks to months. The signal is in the engagement — posts that generate deep technical discussion often indicate real traction.

**Product Hunt** — Launch signal, not traction signal. By the time a startup launches on Product Hunt, they usually have a polished product and some early customers. Lead time: 2-4 weeks before broader awareness.

**Y Combinator batch lists** — Published at demo day, which is late in the cycle (investors already competing for these companies). But the companies that raise quietly before or after demo day are the ones to watch.

The community sourcing approach works best when you are deeply embedded in a specific community. An investor who reads r/venturecapital daily catches signals that a broader scan would miss.

## How Can Hiring Data Reveal Upcoming Fundraises?

Job postings reveal a startup's growth plans before they are announced publicly:

- **Senior engineering hires** (VP Engineering, Staff Engineer): Team is scaling, likely post-fundraise.
- **Head of Sales / VP Marketing**: Go-to-market is being built. Product-market fit is likely established.
- **Multiple simultaneous postings**: Coordinated hiring push, usually funded by a recent or imminent round.

Where to find hiring signals:
- LinkedIn job postings (filter by company size 1-50)
- AngelList/Wellfound job boards
- Y Combinator's Work at a Startup
- Hacker News monthly "Who's Hiring" threads

Lead time: 4-8 weeks before the round is announced. Shorter than GitHub signals, but the signal is more explicit about the type of growth.

## How Should Investors Combine All Three Signal Types?

The most effective approach combines all three signal types:

1. **GitHub signals** surface companies showing engineering acceleration (earliest warning)
2. **Community signals** add context — is the founder talking about traction? Customer feedback? Hiring?
3. **Hiring signals** confirm the growth trajectory — are they actively building the team?
4. **Crunchbase** verifies funding history and competitive landscape (due diligence, not sourcing)

This progression gives you the best of both worlds: timing advantage from alternative data, and verification depth from traditional sources.

## What Does This Look Like in Practice?

Every week, check the sector rankings for your focus areas. When an unfamiliar name appears in the top 3 with a strong acceleration signal:

1. Spend 5 minutes on their GitHub — is the activity product-related or maintenance noise?
2. Search Hacker News, Reddit, and Twitter for the company name — any community buzz?
3. Check their careers page — are they hiring?
4. Open Crunchbase — what is their funding history? Are they pre-raise?
5. If all signals align, reach out to the founder.

This workflow takes 15-20 minutes per company and puts you weeks ahead of investors who only use Crunchbase alerts. For the full screening checklist, see the [7 engineering metrics every investor should track](/blog/startup-engineering-metrics-investors-should-track).

Browse the sector rankings to start identifying startups before they appear in your inbox.`,
  },
  {
    slug: "startup-engineering-metrics-investors-should-track",
    title: "7 Startup Engineering Metrics Every Investor Should Track",
    references: [
      { label: "1", title: "GitHub REST API — Repository Statistics", url: "https://docs.github.com/en/rest/metrics/statistics", source: "GitHub Docs" },
      { label: "2", title: "GitHub REST API — Search Repositories", url: "https://docs.github.com/en/rest/search/search#search-repositories", source: "GitHub Docs" },
      { label: "3", title: "DORA Metrics — Accelerate State of DevOps", url: "https://dora.dev/research/", source: "Google DORA" },
    ],
    keyStats: [
      { value: "7", label: "Engineering metrics", context: "Trackable from public GitHub data" },
      { value: "+15%", label: "Average velocity change", context: "Across tracked startups" },
      { value: "3+", label: "New repos in 30 days", context: "Infrastructure buildout threshold" },
    ],
    howTo: {
      name: "How to Screen Startups Using GitHub Engineering Metrics",
      description: "A quick-screen checklist using seven public GitHub metrics to evaluate whether a startup deserves deeper investor research.",
      totalTime: "PT10M",
      steps: [
        { name: "Check commit velocity change", text: "Is the startup's 14-day commit velocity change positive and above +50%? This is the primary signal. Below +50% is normal variance; above +100% is a regime change worth investigating." },
        { name: "Evaluate contributor growth", text: "Has the contributor count grown recently? A 50%+ jump in unique contributors indicates a hiring burst — likely post-fundraise scaling. Compare the current count to six weeks ago." },
        { name: "Count new repositories", text: "How many new public repos were created in the last 30 days? Three or more signals infrastructure buildout — the team is expanding its technical surface area, classic Series A behavior." },
        { name: "Verify activity is product-related", text: "Is the commit activity in product-related code, or just documentation, CI/CD configs, and dependency updates? Open the top repositories and check recent commit messages." },
        { name: "Cross-reference the tech stack", text: "Do the programming languages and frameworks match the company's pitch? A startup claiming to build an AI platform should show Python, ML frameworks, and data infrastructure in their repos." },
      ],
    },
    description:
      "Seven engineering metrics from public GitHub data that help investors evaluate startup momentum: commit velocity, contributor growth, repo expansion, weekend activity, and more. A practical checklist for data-driven deal sourcing.",
    figures: [
      { id: "screening-checklist", afterHeading: "How Should Investors Use These Metrics" },
    ],
    summary:
      "Seven engineering metrics from public GitHub data help investors evaluate startup momentum: (1) commit velocity — 14-day rolling baseline, (2) commit velocity change — the primary signal, measuring acceleration, (3) contributor count — team size proxy, (4) contributor growth rate — the most reliable fundraise predictor at 50%+, (5) new repository count — signals infrastructure buildout, (6) weekend commit ratio — indicates deadline pressure, and (7) language/framework distribution — reveals technical maturity. A startup that passes all five quick-screen checks (positive velocity change, contributor growth, new repos, product-related activity, matching tech stack) is worth a deeper look.",
    date: "2026-04-14",
    relatedSectors: ["developer-tools", "cybersecurity", "fintech"],
    faqs: [
      {
        question: "What engineering metrics should startup investors track?",
        answer: "Investors should track seven engineering metrics from public GitHub data: (1) commit velocity — 14-day rolling commit count, (2) commit velocity change — the percentage change vs. prior period (the primary signal), (3) contributor count — proxy for team size, (4) contributor growth rate — indicates hiring bursts, (5) new repository count — signals infrastructure buildout, (6) weekend commit ratio — indicates deadline pressure, and (7) language/framework distribution — reveals technical maturity and stack choices.",
      },
      {
        question: "What is the most important GitHub metric for venture capital deal sourcing?",
        answer: "Commit velocity change — the percentage change in 14-day commit count compared to the prior window — is the single most useful engineering metric for investors. It measures acceleration rather than absolute volume, which makes it comparable across startups of different sizes. A sustained velocity change above +50% for 3 or more consecutive windows is a meaningful signal. Above +100% is a regime change that has historically preceded fundraise announcements.",
      },
      {
        question: "How can investors quickly screen startups using GitHub data?",
        answer: "A quick screening checklist: (1) Is commit velocity change positive and above 50%? (2) Has contributor count grown recently? (3) Are there new repos in the last 30 days? (4) Is the activity product-related, not just docs or CI/CD? (5) Does the tech stack match the company's pitch? If a startup passes all five checks, it deserves a deeper look. If it fails the first two, the engineering signal is not there. VC Deal Flow Signal automates checks 1-4 across 20 sectors weekly.",
      },
    ],
    body: `Most investors evaluate startups on revenue growth, market size, and team pedigree. These are important. But they are also the metrics that every other investor looks at.

Engineering metrics — available from public GitHub data — provide a complementary view of startup health that almost nobody monitors. Here are seven metrics worth tracking, what they tell you, and how to use them. For the broader context on why this data matters, see [what is deal flow signal](/blog/what-is-deal-flow-signal).

## 1. What Is Commit Velocity?

**What it is:** Total commits to a startup's most active public repository over a rolling 14-day window.

**What it tells you:** The raw volume of engineering output. High absolute velocity is not inherently meaningful — some teams commit frequently with small changes, others commit less often with larger changes. The value is in tracking it over time to establish a baseline.

**How to use it:** Commit velocity is the denominator for the most important metric (velocity change). Track it to understand the startup's normal operating rhythm before evaluating whether a change is significant.

## 2. Why Is Commit Velocity Change the Primary Signal?

**What it is:** The percentage change in commit velocity compared to the preceding 14-day window.

**What it tells you:** Whether the engineering team is accelerating, maintaining pace, or slowing down. This is the single most useful engineering metric for investors because it measures *acceleration* — the rate of change.

**How to use it:** A sustained velocity change above +50% for 3+ consecutive windows is a meaningful signal. At VC Deal Flow Signal, this is the primary ranking metric across all 20 sectors. Startups showing +100% or higher velocity change are flagged as top movers.

**Benchmark:** In our dataset, the average velocity change across 43 tracked startups is approximately +15%. Anything above +50% is unusual. Above +100% is a regime change.

## 3. What Does Contributor Count Tell Investors?

**What it is:** The number of unique contributors to the startup's most active public repository.

**What it tells you:** A rough proxy for engineering team size. More useful as a trend than an absolute number, since not all employees contribute to public repos, and not all contributors are employees.

**How to use it:** Compare contributor count to the startup's claimed team size. A company claiming 30 engineers but showing 5 GitHub contributors either has most code in private repos (normal) or is overstating their team (investigate further).

## 4. Why Does Contributor Growth Rate Predict Fundraises?

**What it is:** The change in unique contributor count over a 6-week comparison window.

**What it tells you:** Whether the engineering team is growing. A sudden jump (50%+ in a short window) almost always indicates a hiring burst — new engineers who joined and started committing.

**How to use it:** Contributor growth above 50% in a 2-week window is our most reliable fundraise predictor. New hires start committing code within days of joining. If you see the contributor count step up sharply, the round likely closed recently and the announcement is coming.

## 5. What Does New Repository Creation Signal?

**What it is:** The number of public repositories created by the startup's GitHub organization in the last 30 days.

**What it tells you:** Whether the startup is expanding its technical surface area. New repos usually mean new microservices, SDKs, internal tools, or platform components.

**How to use it:** Three or more new repos in 30 days is what we call an "infrastructure buildout" signal. This pattern is classic Series A behavior: the core product works, and the team is building the surrounding platform. It signals both technical maturity and available capital.

## 6. What Does Weekend Commit Activity Reveal?

**What it is:** The proportion of commits that occur on Saturday and Sunday versus weekdays.

**What it tells you:** How intensely the team is working. Weekend commits from multiple contributors (not just a solo founder) indicate a deadline push.

**How to use it:** A sustained shift from weekday-only to 7-day commit patterns across multiple contributors is a soft signal that something time-sensitive is happening: a product launch, a fundraise demo, or a competitive response. This metric is most useful as a confirming signal alongside velocity change.

## 7. What Do Language and Framework Choices Indicate?

**What it is:** The programming languages and frameworks visible in the startup's public repositories.

**What it tells you:** The technical stack and maturity level. A seed-stage startup using Kubernetes, Terraform, and enterprise monitoring tools may be over-engineering. A growth-stage company still using prototype-quality tools may have hidden technical debt.

**How to use it:** Cross-reference with the startup's claimed technology during due diligence. If they say they are building an AI platform, their repos should show Python, ML frameworks, and data processing infrastructure. If the repos tell a different story, ask why.

## How Should Investors Use These Metrics Together?

When evaluating a startup from its public GitHub profile, check these in order:

1. Is commit velocity change positive and above 50%? (Active acceleration)
2. Has contributor count grown recently? (Team scaling)
3. Are there new repos in the last 30 days? (Platform building)
4. Is the activity product-related, not just docs/CI/CD? (Meaningful work)
5. Does the tech stack match the company's pitch? (Consistency check)

If a startup passes all five checks, it is worth a deeper look. If it fails the first two, move on — the engineering signal is not there. For real-world application, read how investors [use GitHub for technical due diligence](/blog/github-due-diligence-for-vcs).

VC Deal Flow Signal automates checks 1-4 across 20 sectors weekly. Browse the sector rankings to see which startups pass the screen right now.`,
  },
  {
    slug: "what-is-engineering-acceleration",
    title: "What Is Engineering Acceleration? The Metric VCs Are Starting to Track",
    description: "Engineering acceleration measures the rate of change in a startup's engineering output. Learn why this metric matters more than absolute commit counts and how investors use it to time fundraise signals.",
    summary: "Engineering acceleration is the rate of change in a startup's commit velocity — not how much code they write, but how much faster they are writing it compared to their own baseline. A startup with 40 commits this period and 20 last period shows +100% acceleration. This metric has historically preceded fundraise announcements by three to six weeks because the underlying causes — post-raise hiring, product-market fit iteration, launch preparation — drive engineering output before they drive press coverage or Crunchbase entries.",
    date: "2026-04-14",
    relatedSectors: ["ai-ml", "developer-tools", "enterprise-saas"],
    references: [
      { label: "1", title: "DORA Metrics — Accelerate State of DevOps", url: "https://dora.dev/research/", source: "Google DORA" },
      { label: "2", title: "GitHub REST API — Commit Activity", url: "https://docs.github.com/en/rest/metrics/statistics#get-the-last-year-of-commit-activity", source: "GitHub Docs" },
    ],
    faqs: [
      { question: "What is engineering acceleration?", answer: "Engineering acceleration measures the rate of change in a startup's engineering output relative to its own historical baseline. It is calculated as the percentage change in 14-day commit velocity versus the prior period. A +100% acceleration means the team doubled its commit rate." },
      { question: "Why does engineering acceleration matter for investors?", answer: "Engineering acceleration is a leading indicator of startup momentum. When a team accelerates its engineering output, the cause is usually post-fundraise scaling, product-market fit iteration, or launch preparation — all of which precede the public signals (press coverage, Crunchbase entries) that most investors rely on." },
      { question: "How is engineering acceleration different from DORA metrics?", answer: "DORA metrics (deployment frequency, lead time, change failure rate) measure engineering process quality — how well a team ships. Engineering acceleration measures output momentum — whether they are speeding up. DORA requires internal CI/CD access; acceleration can be measured from public GitHub data, making it useful as an external investment signal." },
    ],
    body: `Engineering acceleration is the single most important metric at VC Deal Flow Signal — and the reason it works as a deal sourcing tool.

## What Is Engineering Acceleration?

Engineering acceleration measures the rate of change in a startup's engineering output. Not how much code they write, but how much faster they are writing it compared to their own baseline.

The formula is straightforward: take the 14-day commit count, compare it to the prior 14-day window, and express the change as a percentage. A startup with 40 commits this period and 20 last period shows +100% acceleration.

This is different from absolute engineering volume. A company with 500 commits per week is not necessarily more interesting than one with 50 — what matters is whether the 50-commit company just jumped from 25. That jump is the signal.

## Why Does This Metric Matter for Investors?

The logic chain is simple:

1. A startup decides to raise, or achieves product-market fit, or plans a launch
2. This decision drives engineering activity — hiring, shipping, building
3. Engineering acceleration appears in public GitHub data
4. Six to twelve weeks later, the fundraise announcement or press coverage appears

Most investors only see step 4. Engineering acceleration lets you see step 3 — the earliest publicly available signal that something meaningful has changed.

## How Is It Different From DORA Metrics?

DORA metrics (deployment frequency, lead time, change failure rate, time to restore) measure engineering process quality. Engineering acceleration measures engineering output momentum. DORA tells you how well a team ships; acceleration tells you whether they are speeding up. Both are valuable, but acceleration is more useful as an external signal because it does not require internal access to CI/CD systems.

## What Are the Four Signal Types?

When a startup shows acceleration, we classify the pattern into one of four types based on which metric is driving the change. See our [glossary](/glossary) for full definitions of each signal type: engineering hiring burst, infrastructure buildout, deploy frequency spike, and framework migration. Each pattern has different implications for investors.

Browse the [sector rankings](/) to see which startups are showing engineering acceleration right now.`,
  },
  {
    slug: "commit-velocity-explained",
    title: "Commit Velocity Explained: What Investors Need to Know",
    description: "Commit velocity is the total number of commits to a startup's GitHub repository over a rolling 14-day window. Learn what it measures, what it misses, and how to interpret it for deal sourcing.",
    summary: "Commit velocity counts the total commits to a startup's most active public repository over 14 days. As a standalone metric it is noisy — commit size, quality, and automation all create false signals. What matters for investors is commit velocity change: the rate at which velocity is accelerating or decelerating. A +150% velocity change classifies as a deploy frequency spike, while sustained positive change across multiple windows indicates genuine engineering momentum.",
    date: "2026-04-13",
    relatedSectors: ["developer-tools", "data-infrastructure", "ai-ml"],
    references: [
      { label: "1", title: "GitHub REST API — Commit Activity", url: "https://docs.github.com/en/rest/metrics/statistics#get-the-last-year-of-commit-activity", source: "GitHub Docs" },
    ],
    faqs: [
      { question: "What is commit velocity?", answer: "Commit velocity is the total number of commits to a startup's most active public GitHub repository over a rolling 14-day window. It measures the raw volume of engineering output." },
      { question: "Is high commit velocity always a good sign?", answer: "Not necessarily. High absolute commit velocity can reflect automated commits, documentation updates, or CI/CD activity rather than meaningful product development. What matters more is commit velocity change — whether the rate is accelerating." },
      { question: "What is a good commit velocity for a startup?", answer: "There is no universal benchmark — commit velocity depends on team size, commit granularity, and workflow conventions. A solo founder with 50 commits/week and a 10-person team with 200 commits/week may have equivalent per-engineer output. The useful metric is velocity change relative to the company's own baseline, not absolute counts." },
    ],
    body: `Commit velocity is one of the most cited — and most misunderstood — metrics in GitHub-based deal sourcing.

## What Is Commit Velocity?

Commit velocity is the total number of commits to a startup's most active public GitHub repository over a rolling 14-day window. At VC Deal Flow Signal, we pull this data from the GitHub API's commit activity endpoint [1].

The metric is intentionally simple: count the commits. No weighting by lines of code, no filtering by author, no adjustment for commit size. Simplicity makes it comparable across companies and sectors.

## What Does Commit Velocity Actually Measure?

Commit velocity measures engineering output volume — how much work is being pushed to version control. It is a proxy for engineering activity, not engineering quality.

A startup with 200 commits in 14 days has roughly 14 commits per day. For a team of 10 engineers, that is a healthy shipping cadence. For a solo founder, it might indicate automated tooling or excessive granularity.

## What Are the Limitations?

Commit velocity has known limitations that investors should understand:

**Commit size varies**: One commit might change a single config line; another might refactor 5,000 lines. Velocity treats them equally.

**Automation inflates counts**: CI/CD bots, automated dependency updates, and auto-formatting tools can inflate commit counts without meaningful engineering work.

**Private repos are invisible**: Many startups keep their core product code in private repositories. Commit velocity only captures public activity.

**Squash vs. merge**: Teams that squash commits will show lower velocity than teams that merge individual commits. This is a workflow choice, not a quality signal.

## Why Commit Velocity Change Matters More

This is the key insight: absolute commit velocity is noisy. Commit velocity change — the rate at which velocity is accelerating — is the real signal. See our detailed guide on [how to read GitHub signals for startup investing](/blog/how-to-read-github-signals-for-startup-investing).

A startup going from 20 to 40 commits in a 14-day window shows +100% velocity change. That acceleration has meaning regardless of the absolute numbers — something changed in how the team is working. That something is what investors care about.

Visit our [glossary](/glossary#commit-velocity) for formal definitions of all engineering metrics.`,
  },
  {
    slug: "pre-seed-deal-sourcing-github",
    title: "Pre-Seed Deal Sourcing with GitHub Data: A Practical Guide",
    description: "How to use GitHub engineering signals to find pre-seed startups before they raise. Covers what pre-seed activity looks like on GitHub, signal patterns, and a step-by-step sourcing workflow.",
    summary: "Pre-seed startups are the hardest to find through traditional deal sourcing because they have no funding history, press coverage, or database entries. GitHub is one of the few places where pre-seed activity is visible: 1-3 contributors, rapid commit acceleration from a low base, and new repository creation. The key signal is disproportionate acceleration — a small team suddenly shipping at 3-5x their baseline rate, which typically indicates a product breakthrough or preparation for a first fundraise.",
    date: "2026-04-12",
    relatedSectors: ["developer-tools", "ai-ml", "web3"],
    references: [
      { label: "1", title: "GitHub Search API — Repositories", url: "https://docs.github.com/en/rest/search/search#search-repositories", source: "GitHub Docs" },
    ],
    keyStats: [
      { value: "1-7", label: "Contributors", context: "Typical pre-seed team size" },
      { value: "+200%", label: "Acceleration threshold", context: "Signals product breakthrough" },
      { value: "3-5x", label: "Baseline multiplier", context: "Disproportionate acceleration" },
    ],
    howTo: {
      name: "How to Source Pre-Seed Startups Using GitHub Data",
      description: "A step-by-step workflow for finding pre-seed startups before they raise, using public GitHub engineering signals.",
      totalTime: "PT15M",
      steps: [
        { name: "Filter for pre-seed stage", text: "Check the sector rankings weekly and filter for startups showing 'Pre-seed' stage estimation (1-7 contributors). These are the earliest-stage companies in the dataset." },
        { name: "Look for disproportionate acceleration", text: "Identify companies with +200% or higher velocity change from a small base. A solo founder going from 5 to 25 commits/week shows +400% — the absolute number is small, but the acceleration is the signal." },
        { name: "Verify the activity is product-related", text: "Open their GitHub organization and check recent commits. Is the activity in product code, or just docs and CI/CD configs? Product-related commits from 1-3 contributors indicate genuine building." },
        { name: "Check founder presence online", text: "Search for the founder on Twitter, Hacker News, and Indie Hackers. Active founders discussing their product or seeking feedback are more likely to be building something real." },
        { name: "Reach out before anyone else", text: "If the signals align — acceleration, product activity, active founder — reach out directly. At pre-seed, there is no deal competition yet because no one else knows the company exists." },
      ],
    },
    faqs: [
      { question: "Can you find pre-seed startups on GitHub?", answer: "Yes. Pre-seed startups often have public GitHub activity before they have any other public presence. Look for organizations with 1-3 contributors showing rapid commit acceleration from a low base — this pattern indicates early product development that often precedes a first fundraise." },
      { question: "What does pre-seed engineering activity look like on GitHub?", answer: "Pre-seed activity typically shows 1-7 contributors, commit velocity under 100 per 14 days, but with high acceleration rates (+200% or more). New repository creation (infrastructure buildout) is common as founders move from prototype to more structured development." },
      { question: "How do you find pre-seed startups before they raise?", answer: "Filter sector rankings for startups with 1-7 contributors showing +200% or higher velocity change. These disproportionate acceleration rates from a small base indicate a product breakthrough or first-fundraise preparation. Then verify on GitHub: is the activity product-related? Check Hacker News and Twitter for founder activity." },
    ],
    body: `Pre-seed startups are invisible to most deal sourcing tools. They have no Crunchbase entry, no press coverage, no PitchBook profile. But many of them have GitHub activity.

## Why GitHub Works for Pre-Seed Sourcing

GitHub is one of the few public data sources where pre-seed activity is visible. Before a startup has a pitch deck, before it has a website, the founders are writing code. That code — if the repositories are public — creates a data trail.

At VC Deal Flow Signal, we estimate startup stage from contributor count: pre-seed companies typically have 1-7 contributors. When we see a small team showing disproportionate acceleration — committing at 3-5x their baseline rate — something is happening worth investigating.

## What Pre-Seed Signals Look Like

Pre-seed engineering activity has a distinctive pattern:

**Low absolute velocity, high acceleration**: A solo founder going from 5 commits/week to 25 commits/week shows +400% velocity change. In absolute terms, 25 commits is nothing. But the acceleration is the signal.

**Infrastructure buildout from zero**: New repositories appearing (3+ in 30 days) in a young organization suggests the founder is moving from prototype to structured development. This is classic pre-seed-to-seed transition behavior.

**Contributor count jumping from 1 to 3-4**: When a solo founder suddenly has co-contributors, they either found a co-founder, hired their first engineer, or attracted open source contributors. All three are positive signals.

## A Pre-Seed Sourcing Workflow

1. Check the [sector rankings](/) weekly and filter for startups showing "Pre-seed" stage estimation
2. Look for companies with +200% or higher velocity change from a small base
3. Open their GitHub organization — is the activity product-related?
4. Check if the founder is active on Twitter, Hacker News, or Indie Hackers
5. If signals align, reach out before anyone else knows the company exists

For the complete screening methodology, see the [7 engineering metrics every investor should track](/blog/startup-engineering-metrics-investors-should-track).`,
  },
  {
    slug: "series-a-signals-github-data",
    title: "Series A Signals: What GitHub Data Reveals About Growth-Stage Startups",
    description: "Series A startups show distinctive GitHub patterns: infrastructure buildout, rapid contributor growth, and platform expansion. Learn what these signals mean for investors evaluating growth-stage deals.",
    summary: "Series A startups display distinct GitHub patterns that differentiate them from earlier stages. The hallmarks are infrastructure buildout (3+ new repositories in 30 days indicating platform development), contributor growth exceeding 50% (post-fundraise hiring), and increasing repository specialization (microservices, SDKs, internal tools). These patterns indicate a startup has moved from finding product-market fit to building the platform for scale — the exact inflection point Series A investors target.",
    date: "2026-04-11",
    relatedSectors: ["enterprise-saas", "fintech", "data-infrastructure"],
    references: [
      { label: "1", title: "GitHub REST API — Repository Statistics", url: "https://docs.github.com/en/rest/metrics/statistics", source: "GitHub Docs" },
    ],
    faqs: [
      { question: "What GitHub patterns indicate a Series A startup?", answer: "Series A startups typically show 20-49 contributors, infrastructure buildout (3+ new repos in 30 days), and increasing repository specialization. The dominant signal type is 'infrastructure buildout' — the team is building the platform around a working core product." },
      { question: "What is infrastructure buildout in startup engineering?", answer: "Infrastructure buildout means a startup created 3 or more new public repositories in 30 days. At Series A, these typically include API client libraries, SDK packages, CLI tools, and deployment infrastructure — signs that the team is building a platform around a working core product." },
      { question: "How does contributor growth signal a funding round?", answer: "When contributor count jumps 50%+ in a short window (e.g., from 12 to 20 contributors), the company has likely closed a round and is scaling. This appears in GitHub data within weeks of new hires joining, but the Crunchbase entry may lag by 6-12 weeks." },
    ],
    body: `Series A startups look different on GitHub than pre-seed or seed companies. The patterns are distinctive enough to identify from public data alone.

## What Makes Series A GitHub Activity Different

At the pre-seed and seed stages, GitHub activity is concentrated: one or two repositories, a small team, and commit patterns driven by individual contributors. At Series A, the picture changes.

The defining characteristic is platform expansion. The core product works — customers are using it — and now the team is building everything around it: SDKs, developer documentation, internal tools, deployment infrastructure, monitoring systems.

## The Infrastructure Buildout Signal

The strongest Series A signal is infrastructure buildout: 3 or more new public repositories created in 30 days. This is not a founder experimenting with side projects. This is a company with capital deploying it into platform development.

Common new repositories at this stage include API client libraries, CLI tools, integration frameworks, and documentation sites. Each represents a deliberate investment in making the product accessible to more users or developers.

## Contributor Growth as a Post-Raise Indicator

When contributor count jumps 50% or more in a short window, the company has likely just closed a round and is scaling the engineering team. At Series A, this typically means going from 8-12 contributors to 15-25.

The timing is important: contributor growth appears in GitHub data within weeks of new engineers joining, but the fundraise announcement may not appear on Crunchbase for another 6-12 weeks. This gap is the investor's opportunity.

## How to Use These Signals

Filter the [sector rankings](/) for startups estimated at "Series A/B" stage. Look for companies showing "Infrastructure buildout" signal type with contributor growth above 50%. Cross-reference with the [trending page](/trending) to find the strongest movers.

For a complete framework on interpreting these signals, see our guide to [GitHub due diligence for VCs](/blog/github-due-diligence-for-vcs).`,
  },
  {
    slug: "open-source-startups-investor-guide",
    title: "Open Source Startups: An Investor's Guide to GitHub Signal Analysis",
    description: "Open source startups present unique challenges for GitHub-based deal sourcing. Learn how to separate community contributions from commercial engineering activity and identify the open source companies worth investing in.",
    summary: "Open source startups require a different analytical lens for GitHub signal interpretation. Community contributions inflate commit counts and contributor numbers, making raw velocity metrics misleading. The key adjustments: focus on the company-owned repositories (not the community fork), track contributor growth in core maintainers (not occasional contributors), and look for the commercial infrastructure signal — new private or semi-private repos for billing, auth, and enterprise features. The strongest open source investment signal is when community engagement and commercial engineering acceleration happen simultaneously.",
    date: "2026-04-09",
    relatedSectors: ["developer-tools", "data-infrastructure", "ai-ml"],
    references: [
      { label: "1", title: "GitHub Octoverse 2024", url: "https://github.blog/news-insights/octoverse/octoverse-2024/", source: "GitHub Blog" },
    ],
    faqs: [
      { question: "How do you evaluate open source startups with GitHub data?", answer: "Focus on the company-owned organization (not community forks), track core maintainer growth rather than total contributors, and look for commercial infrastructure signals — new repos for enterprise features, billing, or deployment tooling. Community star velocity is a social signal; commit velocity in the core product is the engineering signal." },
      { question: "What is the strongest open source investment signal?", answer: "Simultaneous community growth and commercial acceleration. When the open source project is gaining stars and contributors while the company organization is building enterprise infrastructure (billing, auth, deployment tooling), the open source flywheel is working — community traction is converting into commercial opportunity." },
      { question: "Do GitHub stars matter for startup investing?", answer: "Stars measure social interest, not engineering traction or commercial viability. A repository with 10,000 stars may have zero revenue. Stars can indicate developer mindshare, but commit velocity in the company's own repositories is a more reliable signal of engineering momentum." },
    ],
    body: `Open source startups are some of the most interesting investment opportunities in developer tools and infrastructure. But they present unique challenges for GitHub-based signal analysis.

## The Community Noise Problem

For most startups, commit velocity is a clean signal — the commits come from the team. For open source startups, commits come from everywhere: core team, community contributors, one-time bug fixers, documentation translators, and bots.

This noise inflates the standard metrics. A popular open source project might show 500 contributors, but only 10 are paid employees. A commit velocity spike might reflect a documentation sprint by the community, not product acceleration by the company.

## How to Separate Commercial from Community Signals

The key is to focus on the company-owned organization, not the project repository. Most commercial open source startups have a GitHub organization with multiple repos: the main project, plus commercial tools, SDKs, enterprise features, and infrastructure.

Track these separately:
- **Core project repo**: Community engagement signal (stars, forks, external PRs)
- **Organization-level repos**: Commercial engineering signal (new repos, internal tools, enterprise features)
- **Contributor growth in core maintainers**: Hiring signal (new team members with commit access)

## The Strongest Open Source Investment Signal

The most compelling signal is simultaneous community growth and commercial acceleration. When the open source project is gaining stars and contributors while the company organization is building enterprise infrastructure, the flywheel is working.

## Practical Screening

Browse the [Developer Tools sector rankings](/startups-to-watch/developer-tools-q2-2026) and look for companies with high contributor counts (50+) but moderate contributor growth. Then check if they show infrastructure buildout signals — new repos for commercial features.

For the full deal sourcing framework, see [how to source startup deals before they appear on Crunchbase](/blog/source-startup-deals-before-crunchbase).`,
  },
  {
    slug: "github-signals-vs-hiring-data",
    title: "GitHub Signals vs Hiring Data: Which Predicts Fundraises Better?",
    description: "Compare GitHub engineering signals and hiring data as leading indicators of startup fundraises. Lead time, reliability, coverage, and which investors should use — or whether the combination beats either alone.",
    summary: "GitHub engineering signals provide 6-12 weeks of lead time before fundraise announcements, while hiring data provides 4-8 weeks. GitHub signals are earlier because engineering acceleration precedes hiring decisions — a team accelerates its code output before posting job listings. Hiring data is more explicit about growth type (engineering vs. sales vs. marketing) but narrower in coverage. The optimal approach combines both: GitHub signals for early detection, hiring data for confirmation and growth-type classification.",
    date: "2026-04-08",
    relatedSectors: ["enterprise-saas", "ai-ml", "hr-tech"],
    references: [
      { label: "1", title: "GitHub REST API — Contributors", url: "https://docs.github.com/en/rest/metrics/statistics#get-all-contributor-commit-activity", source: "GitHub Docs" },
    ],
    faqs: [
      { question: "Which predicts fundraises better: GitHub signals or hiring data?", answer: "GitHub signals provide earlier lead time (6-12 weeks vs 4-8 weeks for hiring) because engineering acceleration precedes hiring decisions. Hiring data is more explicit about growth type. The combination of both is stronger than either alone — GitHub for timing, hiring for confirmation." },
      { question: "How much lead time do GitHub signals give over hiring data?", answer: "GitHub engineering signals typically provide 6-12 weeks of lead time before fundraise announcements, compared to 4-8 weeks for hiring data. The gap exists because engineering acceleration (more commits, faster shipping) precedes the hiring decisions that follow. By the time a job posting appears, the engineering acceleration has been visible for weeks." },
      { question: "Should investors use GitHub signals or hiring data?", answer: "Both — sequentially. Use GitHub signals for early detection (which companies are accelerating?) then hiring data for confirmation and growth-type classification (are they hiring engineers, sales, or marketing?). The combination provides both timing advantage and strategic context." },
    ],
    body: `Two alternative data sources dominate the conversation about startup deal sourcing: GitHub engineering signals and hiring data. Both claim to predict fundraises before traditional channels. Which actually works better?

## GitHub Signals: The Earliest Public Indicator

GitHub engineering acceleration appears 6-12 weeks before fundraise announcements. The logic: a startup accelerates engineering output → builds product → raises capital → announces the round. GitHub catches step one.

The signal is in the rate of change. A commit velocity increase of +100% or more, sustained over multiple weeks, indicates something fundamental shifted in how the team is working. See [what is engineering acceleration](/blog/what-is-engineering-acceleration) for the full explanation.

## Hiring Data: The Most Explicit Indicator

Job postings on LinkedIn, AngelList, and company career pages provide 4-8 weeks of lead time. Hiring data is later than GitHub signals but more explicit: a "VP Engineering" posting tells you they are scaling the technical team, while a "Head of Sales" posting tells you they are building go-to-market.

Hiring data answers "what are they building?" GitHub data answers "how fast are they building?"

## The Comparison

**Lead time**: GitHub wins (6-12 weeks vs 4-8 weeks). Engineering acceleration precedes hiring decisions because teams ship faster before they staff up.

**Signal explicitness**: Hiring wins. A job posting for "Senior ML Engineer" tells you more about strategic direction than a commit velocity spike.

**Coverage**: Hiring wins for breadth (every company hires). GitHub wins for depth (commit-level granularity on technical startups).

**Cost**: Both are free for basic analysis. GitHub data is available via API; hiring data requires scraping or paid platforms.

## The Optimal Approach

Use both, sequentially. GitHub signals surface the candidates (earliest warning). Hiring data confirms the trajectory (what type of growth). This is the workflow described in our guide on [sourcing deals before Crunchbase](/blog/source-startup-deals-before-crunchbase).

Browse the [trending page](/trending) for the startups showing the strongest engineering acceleration this week.`,
  },
  {
    slug: "fintech-startup-engineering-signals",
    title: "Fintech Startup Engineering Signals: What the GitHub Data Shows",
    description: "An analysis of engineering acceleration patterns specific to fintech startups. Regulatory-driven development cycles, compliance infrastructure, and what makes fintech GitHub signals different from other sectors.",
    summary: "Fintech startups show distinctive engineering patterns driven by regulatory requirements. Infrastructure buildout signals in fintech often indicate compliance infrastructure (KYC/AML systems, audit logging, encryption) rather than product expansion. The strongest fintech investment signal is simultaneous product acceleration and compliance buildout — this combination suggests a company preparing for a regulated launch, which typically requires significant capital and precedes fundraising by 8-12 weeks.",
    date: "2026-04-07",
    relatedSectors: ["fintech", "enterprise-saas", "cybersecurity"],
    references: [
      { label: "1", title: "GitHub REST API — Repository Statistics", url: "https://docs.github.com/en/rest/metrics/statistics", source: "GitHub Docs" },
    ],
    faqs: [
      { question: "What makes fintech GitHub signals different from other sectors?", answer: "Fintech engineering signals are influenced by regulatory requirements. Infrastructure buildout often indicates compliance infrastructure (KYC, AML, audit logging) rather than product expansion. Deploy frequency spikes may reflect regulatory deadline-driven development rather than customer-driven iteration." },
      { question: "What is the strongest fintech investment signal on GitHub?", answer: "Simultaneous product acceleration and compliance buildout. When a fintech company is shipping product features and building compliance infrastructure (KYC, audit logging, encryption) at the same time, it is preparing for a regulated launch — which requires significant capital and often precedes fundraising." },
      { question: "Can you find fintech startups using GitHub data?", answer: "Yes, but with sector-specific interpretation. Fintech companies with public repos typically focus on developer-facing products (payment APIs, banking-as-a-service, trading infrastructure). Consumer fintech companies are less likely to have public GitHub activity. Check the Fintech sector rankings for current data." },
    ],
    body: `Fintech startups show different engineering patterns on GitHub compared to other sectors. Understanding these patterns is essential for investors using engineering signals to source fintech deals.

## Regulatory-Driven Development Cycles

The most important difference: fintech development cycles are partly driven by regulatory requirements, not just product-market fit. When a fintech startup shows a commit velocity spike, it may be responding to a compliance deadline rather than customer demand.

This does not make the signal less valuable — regulatory compliance requires engineering investment, which requires capital. But it changes the interpretation. A fintech company building KYC infrastructure is not necessarily iterating on product-market fit; it may be preparing for a regulated launch.

## What Infrastructure Buildout Means in Fintech

In most sectors, infrastructure buildout (3+ new repositories in 30 days) indicates platform expansion. In fintech, the new repositories often serve a different purpose: compliance infrastructure, audit logging, encryption libraries, and regulatory reporting tools.

Look at the repository names and descriptions. New repos named "kyc-service," "audit-log," or "compliance-api" tell a different story than "marketplace-sdk" or "developer-tools."

## The Strongest Fintech Signal

The most compelling fintech investment signal is simultaneous product acceleration and compliance buildout. When a company is shipping product features and building compliance infrastructure at the same time, it is preparing for a regulated launch. This typically requires significant capital, which means fundraising is imminent or recently completed.

Browse the [Fintech sector rankings](/startups-to-watch/fintech-q2-2026) to see the current data, or compare approaches using our [best deal flow tools for seed-stage investors](/compare/best-deal-flow-tools-seed-investors) guide.`,
  },
  {
    slug: "ai-startup-signals-2026",
    title: "AI Startup Engineering Signals in 2026: What Investors Should Watch",
    description: "The AI sector shows the highest commit velocity of any sector we track. Learn which AI engineering patterns signal real traction vs. hype, and how to use GitHub data to find the AI startups worth investing in.",
    summary: "AI startups in 2026 show the highest average commit velocity of any sector — but also the highest noise. The key to interpreting AI engineering signals: distinguish model training infrastructure (high compute, low commit frequency, research-oriented) from product engineering (rapid iteration, frequent commits, customer-driven). The strongest AI investment signals come from companies transitioning from research to product — when commit velocity shifts from sporadic large commits to frequent small commits, the team is moving from experimentation to shipping.",
    date: "2026-04-06",
    relatedSectors: ["ai-ml", "data-infrastructure", "developer-tools"],
    references: [
      { label: "1", title: "GitHub Octoverse 2024 — AI Development", url: "https://github.blog/news-insights/octoverse/octoverse-2024/", source: "GitHub Blog" },
      { label: "2", title: "Stanford AI Index Report 2025", url: "https://aiindex.stanford.edu/report/", source: "Stanford HAI" },
    ],
    faqs: [
      { question: "How do you evaluate AI startup engineering signals?", answer: "Distinguish model training infrastructure (sporadic large commits, research-oriented) from product engineering (frequent small commits, customer-driven iteration). The strongest signal is a transition from research-style to product-style commit patterns, indicating the company is moving from experimentation to shipping." },
      { question: "What makes AI startups different on GitHub?", answer: "AI startups show the highest average commit velocity but also the highest noise of any sector. Open source experimentation, research-oriented commits, and community activity inflate the standard metrics. The key is separating product engineering (shipping features) from research exploration (running experiments)." },
      { question: "What is the best AI startup investment signal?", answer: "The research-to-product transition. When an AI startup's commit pattern shifts from sporadic large commits (experiments, model checkpoints) to frequent small commits (API endpoints, deployment config, monitoring), the team is moving from 'does this work?' to 'let's ship this.' This transition often precedes a fundraise." },
    ],
    body: `AI is the highest-velocity sector in our dataset. It is also the noisiest. Here is how to read AI startup engineering signals in 2026.

## The AI Velocity Paradox

AI startups show the highest average commit velocity of any sector we track at VC Deal Flow Signal. But high velocity alone does not mean high quality deal flow. The AI sector has more open source experimentation, more research-oriented commits, and more hype-driven activity than any other sector.

The challenge for investors: separating genuine product engineering from research exploration and open source community activity. See our guide on [evaluating open source startups](/blog/open-source-startups-investor-guide) for the analytical framework.

## Research vs. Product Commit Patterns

AI startups go through a distinctive phase transition that is visible in GitHub data:

**Research phase**: Sporadic large commits, Jupyter notebooks, experiment tracking, model checkpoints. Commit messages reference papers and experiments rather than features and fixes. Velocity is unpredictable.

**Product phase**: Frequent small commits, API endpoints, deployment configuration, monitoring setup. Commit messages reference users, features, and bugs. Velocity is sustained and accelerating.

The transition from research to product is the signal. When an AI startup's commit pattern shifts from sporadic-and-large to frequent-and-small, the team is moving from "does this work?" to "let's ship this." That transition often precedes a fundraise.

## What to Watch in 2026

The current AI sector shows interesting signal diversity. Browse the [AI & Machine Learning sector rankings](/startups-to-watch/ai-ml-q2-2026) to see who is accelerating.

For a broader perspective on using alternative data for deal sourcing, see [why GitHub is the most underused signal in venture capital](/blog/alternative-data-venture-capital).`,
  },
  {
    slug: "deal-sourcing-workflow-weekly",
    title: "A Weekly Deal Sourcing Workflow Using Engineering Signals",
    description: "A 30-minute weekly workflow for investors who want to use GitHub engineering signals for deal sourcing. Step-by-step process: check rankings, screen startups, verify signals, and build a pipeline.",
    summary: "This workflow takes 30 minutes per week and surfaces 2-5 actionable startup leads from engineering signal data. Step 1: Check the trending page for top movers (5 min). Step 2: Filter by your focus sectors (5 min). Step 3: Screen the top 3 unfamiliar names — open their GitHub, check if activity is product-related (10 min). Step 4: Cross-reference with community and hiring signals (5 min). Step 5: Add qualified leads to your pipeline with the engineering data as context (5 min).",
    date: "2026-04-05",
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
    references: [
      { label: "1", title: "VC Deal Flow Signal — Methodology", url: "https://signals.gitdealflow.com/methodology", source: "VC Deal Flow Signal" },
    ],
    howTo: {
      name: "Weekly Deal Sourcing Workflow Using Engineering Signals",
      description: "A 30-minute weekly process for finding startup investment leads using GitHub engineering acceleration data.",
      totalTime: "PT30M",
      steps: [
        { name: "Check the trending page", text: "Open signals.gitdealflow.com/trending and scan the top 10 startups by commit velocity change. Note any unfamiliar names. This takes 5 minutes." },
        { name: "Filter by your focus sectors", text: "Navigate to the 2-3 sector pages that match your investment thesis. Look for startups in the top 3 that you have not seen before. 5 minutes." },
        { name: "Screen the top candidates", text: "For each unfamiliar startup, open their GitHub organization. Check: is the activity product-related? Are real engineers committing, or is it bots? Does the tech stack match the company description? 10 minutes for 3 startups." },
        { name: "Cross-reference with other signals", text: "Search Hacker News, Twitter, and LinkedIn for the company name. Check their careers page for open roles. Is there community buzz or active hiring? 5 minutes." },
        { name: "Add to your pipeline", text: "For startups that pass all checks, add them to your deal pipeline with the engineering data as context: velocity change, signal type, contributor count. Reach out to the founder. 5 minutes." },
      ],
    },
    faqs: [
      { question: "How long does this workflow take?", answer: "30 minutes per week. The workflow is designed to fit into a Monday morning routine: check rankings, screen candidates, verify signals, and add qualified leads to your pipeline." },
      { question: "How many leads does this workflow typically produce?", answer: "2-5 actionable leads per week, depending on how many sectors you track and how selective you are. The quality is high because engineering acceleration is a leading indicator — you are finding companies before they appear in traditional deal sourcing channels." },
    ],
    body: `Most investors know they should use data for deal sourcing. Few have a repeatable process for doing it. Here is a 30-minute weekly workflow using engineering signals.

## Why a Weekly Cadence?

VC Deal Flow Signal refreshes data every Monday. Engineering acceleration is a weekly signal — commit velocity change is calculated over 14-day windows. Checking more frequently than weekly adds no new information. Checking less frequently means you miss the timing advantage.

Monday morning is ideal: the data is fresh, and you can add qualified leads to your pipeline before the week's meetings.

## The 30-Minute Workflow

This process is deliberately simple. The goal is not exhaustive analysis — it is fast identification of startups worth a deeper look.

## Step 1: Check the Trending Page (5 minutes)

Open the [trending page](/trending) and scan the top 10 startups by commit velocity change. These are the companies showing the strongest engineering acceleration across all sectors this week.

Look for unfamiliar names. If a company you have never heard of appears in the top 5, that is the signal working as intended — you are seeing it before mainstream channels surface it.

## Step 2: Filter by Your Focus Sectors (5 minutes)

Navigate to the 2-3 [sector pages](/) that match your investment thesis. Within each sector, look for startups in the top 3 that are new to you.

## Step 3: Screen the Top Candidates (10 minutes)

For each unfamiliar startup, spend 3-4 minutes on their GitHub. The [5-check screening framework](/blog/startup-engineering-metrics-investors-should-track) covers what to look for.

## Step 4: Cross-Reference (5 minutes)

Search for the company on Hacker News, Twitter, and LinkedIn. Check their careers page. The goal is to confirm the engineering signal with qualitative context.

## Step 5: Add to Pipeline (5 minutes)

For startups that pass all checks, add them to your deal tracking system. Include the engineering data: velocity change, signal type, contributor count, and the date you first noticed them. This creates a record of your timing advantage.

Subscribe to the [Signal Digest](https://gitdealflow.com/#signup) to get the highlights delivered to your inbox every Monday.`,
  },
  {
    slug: "cybersecurity-startup-signals",
    title: "Cybersecurity Startup Signals: Reading GitHub Data for Security Deals",
    description: "Cybersecurity startups have unique GitHub patterns: rapid response to CVEs, compliance-driven sprints, and infrastructure hardening. Learn what cybersecurity engineering signals mean for investors.",
    summary: "Cybersecurity startups show unique engineering patterns on GitHub. Deploy frequency spikes often correlate with CVE response cycles rather than product iteration. Infrastructure buildout signals frequently indicate security compliance infrastructure (SOC 2, ISO 27001) rather than product expansion. The strongest cybersecurity investment signal is sustained acceleration outside of incident response — when a security startup is shipping fast without an external trigger, the team is building toward a milestone.",
    date: "2026-04-04",
    relatedSectors: ["cybersecurity", "enterprise-saas", "data-infrastructure"],
    references: [
      { label: "1", title: "GitHub Advisory Database", url: "https://github.com/advisories", source: "GitHub" },
      { label: "2", title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework", source: "NIST" },
    ],
    faqs: [
      { question: "How do cybersecurity GitHub signals differ from other sectors?", answer: "Cybersecurity deploy frequency spikes often reflect CVE response rather than product iteration. Infrastructure buildout may indicate compliance infrastructure (SOC 2, ISO 27001). The strongest signal is sustained acceleration outside of incident-response cycles." },
      { question: "How do you separate CVE response from real product acceleration?", answer: "Check the timing: does the velocity spike coincide with a major CVE disclosure? If the spike happens within days of a published vulnerability, it is likely reactive patching. Sustained acceleration over 2-3 weeks without an external trigger indicates genuine product momentum." },
      { question: "What does compliance infrastructure signal in cybersecurity startups?", answer: "New repositories related to SOC 2 audit trails, ISO 27001 documentation, or penetration testing frameworks indicate a company preparing for enterprise sales. Most enterprise buyers require SOC 2 compliance, so this buildout is a positive investment signal — it requires capital and precedes revenue growth." },
    ],
    body: `Cybersecurity startups present unique challenges for GitHub-based signal analysis. The sector's engineering patterns are driven by threat response cycles and compliance requirements in ways that other sectors are not.

## CVE-Driven Development

The most distinctive cybersecurity pattern: deploy frequency spikes that correlate with CVE disclosures. When a major vulnerability is published, security companies rush to patch, update, and ship. This creates commit velocity spikes that are reactive, not strategic.

For investors, the question is whether a velocity spike reflects incident response or product momentum. Check the timing: does the spike coincide with a major CVE disclosure? If so, the acceleration is defensive, not offensive.

## Compliance Infrastructure Signals

Like fintech, cybersecurity startups build significant compliance infrastructure: SOC 2 audit trails, ISO 27001 documentation, penetration testing frameworks, and security certification tooling.

New repositories related to compliance indicate a company preparing for enterprise sales — most enterprise buyers require SOC 2 compliance at minimum. This is a positive investment signal because enterprise-readiness requires capital and precedes revenue growth.

## The Strongest Cybersecurity Signal

The most compelling cybersecurity investment signal is sustained engineering acceleration that is not correlated with external events. When a security startup is shipping fast without a CVE trigger or compliance deadline, the team is building something new. That organic acceleration is the same signal that works across all sectors — and it precedes fundraising by the same 6-12 week window.

Browse the [Cybersecurity sector rankings](/startups-to-watch/cybersecurity-q2-2026) to see which security startups are showing engineering acceleration right now.`,
  },
  {
    slug: "climate-tech-engineering-signals",
    title: "Climate Tech Engineering Signals: What GitHub Data Reveals About Green Startups",
    description: "Climate tech startups combine hardware and software development, creating unique GitHub patterns. Learn how to interpret engineering signals for energy, carbon, and sustainability startups.",
    summary: "Climate tech startups combine hardware and software development in ways that create distinctive GitHub patterns. Software-heavy climate companies (carbon accounting, energy trading, grid optimization) show patterns similar to enterprise SaaS. Hardware-adjacent companies (battery management, sensor networks, IoT) show lower commit velocity but higher infrastructure buildout. The key insight for investors: climate tech engineering acceleration often indicates a transition from R&D to deployment — the moment when a technology moves from lab to field, which requires capital.",
    date: "2026-04-03",
    relatedSectors: ["climate-tech", "data-infrastructure", "enterprise-saas"],
    references: [
      { label: "1", title: "IEA — World Energy Investment 2025", url: "https://www.iea.org/reports/world-energy-investment", source: "International Energy Agency" },
    ],
    faqs: [
      { question: "Can you use GitHub data to evaluate climate tech startups?", answer: "Yes, but with nuance. Software-heavy climate companies (carbon accounting, energy trading) show standard engineering signals. Hardware-adjacent companies show lower commit velocity but meaningful infrastructure buildout when transitioning from R&D to deployment." },
      { question: "What is the strongest climate tech investment signal?", answer: "The R&D-to-deployment transition. When a climate tech company's GitHub activity shifts from experimental (research notebooks, prototype code) to operational (deployment scripts, monitoring, CI/CD pipelines), the technology is moving from lab to field. This transition requires capital and often precedes fundraising." },
      { question: "Which climate tech companies show up on GitHub?", answer: "Software-heavy climate companies appear most clearly: carbon accounting platforms, energy trading tools, grid optimization software, and ESG reporting systems. Hardware-adjacent companies building intelligence layers (battery management, sensor networks, predictive maintenance) also show meaningful GitHub signals." },
    ],
    body: `Climate tech is one of the fastest-growing sectors in venture capital. But it also one of the hardest to analyze with software engineering metrics, because many climate tech companies build physical products.

## The Software-Hardware Spectrum

Climate tech startups fall along a spectrum from pure software to pure hardware. At the software end: carbon accounting platforms, renewable energy trading tools, grid optimization software, and ESG reporting systems. These companies look like enterprise SaaS on GitHub — high commit velocity, standard signal patterns.

At the hardware end: battery manufacturers, solar panel companies, and industrial decarbonization. These companies may have minimal public GitHub activity because most of their engineering work is in hardware design, not software.

The most interesting companies for GitHub signal analysis sit in the middle: hardware-adjacent software companies that build the intelligence layer for physical systems. Battery management systems, sensor networks, predictive maintenance for wind farms, and energy grid optimization.

## What Climate Tech Signals Look Like

**Software-heavy climate tech**: Looks like enterprise SaaS. Commit velocity, contributor growth, and signal types follow standard patterns. Use the same analytical framework as any other sector.

**Hardware-adjacent climate tech**: Lower absolute commit velocity, but meaningful infrastructure buildout signals. New repositories for data pipelines, IoT integrations, and edge computing indicate a transition from R&D to deployment.

## The R&D-to-Deployment Transition

The strongest climate tech investment signal is the R&D-to-deployment transition. When a company's GitHub activity shifts from experimental (research notebooks, prototype code) to operational (deployment scripts, monitoring, CI/CD), the technology is moving from lab to field.

This transition requires capital — deploying physical systems costs money. Engineering acceleration during this phase is a strong fundraise predictor.

Browse the [Climate Tech sector rankings](/startups-to-watch/climate-tech-q2-2026) to see which green startups are showing acceleration right now.`,
  },
  {
    slug: "investor-mistakes-github-signals",
    title: "5 Mistakes Investors Make When Reading GitHub Signals",
    description: "Common pitfalls when using GitHub engineering data for deal sourcing: confusing stars with traction, ignoring private repos, overweighting absolute velocity, missing the context behind spikes, and treating signals as investment decisions.",
    summary: "Five common mistakes when interpreting GitHub signals for investing: (1) Confusing GitHub stars with engineering traction — stars measure social interest, not engineering output. (2) Ignoring private repos — some of the best startups keep all code private. (3) Overweighting absolute velocity — a 500-commit company is not necessarily better than a 50-commit company. (4) Missing spike context — not all velocity spikes are positive (docs sprints, bot activity, one-time migrations). (5) Treating signals as investment decisions — engineering acceleration is a sourcing tool, not a diligence replacement.",
    date: "2026-04-02",
    relatedSectors: ["developer-tools", "ai-ml", "enterprise-saas"],
    references: [
      { label: "1", title: "GitHub Octoverse 2024", url: "https://github.blog/news-insights/octoverse/octoverse-2024/", source: "GitHub Blog" },
    ],
    faqs: [
      { question: "What are the biggest mistakes investors make with GitHub signals?", answer: "The five most common: confusing stars with traction, ignoring the private repo blind spot, overweighting absolute commit counts over acceleration, missing the context behind velocity spikes (bots, docs, migrations), and treating engineering signals as investment decisions rather than sourcing signals." },
      { question: "Are GitHub signals reliable for investment decisions?", answer: "GitHub signals are reliable for deal sourcing — identifying interesting companies early. They are not reliable as standalone investment decisions. Engineering acceleration should be the first step in a diligence process, not the last. Always verify with direct founder conversations, product evaluation, and market analysis." },
    ],
    body: `GitHub engineering signals are a powerful deal sourcing tool. They are also easy to misread. Here are the five most common mistakes investors make — and how to avoid them.

## Mistake 1: Confusing Stars with Traction

GitHub stars measure social interest. They are a vanity metric, not an engineering signal. A repository with 10,000 stars may have zero commercial traction. A repository with 50 stars may power a company with $5M ARR.

Stars tell you what developers find interesting. Commit velocity tells you what companies are actually building. Focus on the latter.

## Mistake 2: Ignoring the Private Repo Blind Spot

Public GitHub activity is a biased sample. Many startups — especially in enterprise SaaS, fintech, and healthcare — keep all their code in private repositories. A startup with no public GitHub activity is not necessarily inactive; it may be very active in ways you cannot see.

This means GitHub signals work best for sectors with a culture of open source or public development: developer tools, infrastructure, AI/ML, and Web3. For sectors with strong privacy norms, use GitHub signals as one input among many.

## Mistake 3: Overweighting Absolute Velocity

A startup with 500 commits per week is not necessarily more interesting than one with 50. What matters is the rate of change — is the 50-commit startup accelerating?

Absolute velocity correlates with team size, not with momentum. [Commit velocity change](/glossary#commit-velocity-change) normalizes for team size by measuring acceleration relative to the company's own baseline.

## Mistake 4: Missing Spike Context

Not all velocity spikes are positive signals. Common false positives:
- Documentation sprints (high commit count, low engineering substance)
- CI/CD bot activity (automated commits inflating counts)
- One-time migrations (framework upgrades, monorepo restructuring)
- Hackathon artifacts (intense activity that does not sustain)

The fix: spend 5 minutes on the GitHub organization before acting on a spike. Check recent commit messages and which repositories are active. This is step 3 in our [weekly sourcing workflow](/blog/deal-sourcing-workflow-weekly).

## Mistake 5: Treating Signals as Decisions

Engineering acceleration is a sourcing signal, not an investment thesis. It tells you which companies are worth investigating — not which companies are worth investing in.

The signal gets you to the table early. The decision still requires founder conversations, product evaluation, market analysis, and competitive landscape assessment. GitHub data gives you timing advantage; due diligence gives you conviction.

For the full screening framework, see the [7 engineering metrics every investor should track](/blog/startup-engineering-metrics-investors-should-track).`,
  },
];

// Merge in the auto-generated signal report if it exists, then sort newest-first
const allPosts = [...posts];
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { signalReport } = require("./signal-report-latest");
  if (signalReport) allPosts.push(signalReport);
} catch {
  // No signal report generated yet — that's fine
}
allPosts.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export function getPost(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return allPosts.map((p) => p.slug);
}

export { allPosts };
