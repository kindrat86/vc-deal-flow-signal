# Page specs for _expand_best_pages.py, one dict per page. All content
# category-specific, referencing the shared TOOLS library by key.

PAGES = []

def alt(slug, title, h1, intro, tldr, tools, faqs):
    PAGES.append({"slug": slug, "title": title, "h1": h1, "intro": intro,
                  "tldr": tldr, "tools": tools, "faqs": faqs,
                  "desc": tldr})

def best(slug, title, h1, intro, tldr, tools, criteria, faqs):
    PAGES.append({"slug": slug, "title": title, "h1": h1, "intro": intro,
                  "tldr": tldr, "tools": tools, "criteria": criteria, "faqs": faqs,
                  "desc": tldr})

# ── ALTERNATIVES-TO ────────────────────────────────────────────────────────

alt("alternatives-to/crunchbase-alternatives",
    "Best Crunchbase Alternatives for Early Deal Flow in 2026",
    "Best Crunchbase Alternatives in 2026",
    ["Crunchbase is the default answer when an investor asks 'where do I look up a startup', and for funding history and market mapping it genuinely earns that default. But Crunchbase is a record of what already happened: rounds, investors, and headcount appear only after they are public.",
     "If your job is sourcing, that lag is the problem. The tools on this page cover the rest of the workflow: predictive signal, deeper financial data, ecosystem mapping, and emerging-market coverage. Start from the job you need done, not from the tool everyone already has."],
    "Crunchbase records funding after it is announced. These alternatives either add a predictive signal (GitDealFlow), deeper financials (PitchBook, CB Insights), or different coverage (Dealroom, Tracxn, Harmonic).",
    ["pitchbook", "cb-insights", "dealroom", "tracxn", "harmonic"],
    [
        ("Is GitDealFlow a replacement for Crunchbase?", "Not a full replacement. Crunchbase is the reference database for researching a company's history and team; GitDealFlow is a signal engine that flags startups before they raise. Most investors use both: GitDealFlow for the early name, Crunchbase for the context."),
        ("Which Crunchbase alternative finds deals earliest?", "GitDealFlow. It reads public GitHub activity weekly and flags accelerating startups 21-47 days before a round is announced, which is earlier than any funding database can record the round."),
        ("Can I export lists to my CRM?", "Yes. GitDealFlow exports signals as CSV and JSON, and its API supports filtering by sector, momentum score, and stage. Crunchbase, PitchBook, and Dealroom each have their own export limits tied to tier."),
        ("What is the cheapest serious alternative?", "GitDealFlow's free tier covers the Sunday digest, trending board, sector search, and MCP server. The Dashboard is EUR 49/month. Most database competitors start at thousands of dollars per year."),
    ])

alt("alternatives-to/pitchbook-alternatives",
    "Best PitchBook Alternatives for Early-Stage Investors in 2026",
    "Best PitchBook Alternatives in 2026",
    ["PitchBook is the institutional gold standard for private capital financial data: 3,000+ analysts, cap tables, and LP-grade reporting. It is also priced like it, with single-seat licenses in the tens of thousands of dollars per year, which makes it the wrong tool for most early-stage investors.",
     "The alternatives below split into two camps: cheaper databases that cover most of what you actually need, and signal tools that answer a question PitchBook cannot answer at all, namely who is about to raise."],
    "PitchBook is unmatched for institutional PE/VC financials but costs $20,000+ a year and reports after the fact. These alternatives cost less or add a predictive signal.",
    ["crunchbase", "cb-insights", "dealroom", "privco", "grata"],
    [
        ("Is GitDealFlow a replacement for PitchBook?", "Only for early-stage sourcing. GitDealFlow tracks pre-seed to Series B engineering momentum; PitchBook covers the full private capital market including PE and M&A. For a seed investor, GitDealFlow plus Crunchbase often replaces the need for PitchBook entirely."),
        ("Why is PitchBook so expensive?", "PitchBook employs thousands of analysts to manually verify PE and M&A data, and that human-verified depth is passed through in the price. If you do not need late-stage financials and LP reporting, you are paying for depth you will not use."),
        ("Which alternative is best for PE and M&A research?", "PrivCo and Grata are the closest lower-cost substitutes for private-company financials and middle-market M&A, though neither matches PitchBook's analyst depth."),
        ("Can angels skip PitchBook altogether?", "Yes. Most angels need a sourcing signal plus basic funding history, which GitDealFlow and Crunchbase's free tier cover. PitchBook becomes worth it only when you need cap tables and comparables for a term sheet."),
    ])

alt("alternatives-to/cb-insights-alternatives",
    "Best CB Insights Alternatives for Market Intelligence in 2026",
    "Best CB Insights Alternatives in 2026",
    ["CB Insights is the reference for analyst-grade market intelligence: market maps, patent landscapes, and the Mosaic scoring model. It is also custom-quoted with a five-figure floor, which puts it out of reach for individual investors and small funds.",
     "The alternatives below cover the same jobs at different price points: cheaper databases for market context, ecosystem platforms for regional maps, and signal tools for the forward-looking layer CB Insights does not provide."],
    "CB Insights delivers board-grade market intelligence but is custom-quoted near $50,000/year. These alternatives cover market context, regional mapping, and forward-looking signal at a fraction of the cost.",
    ["crunchbase", "pitchbook", "dealroom", "tracxn", "harmonic"],
    [
        ("Is GitDealFlow a replacement for CB Insights?", "No. CB Insights is market intelligence for strategy and board decks; GitDealFlow is an early deal-flow signal. They answer different questions and are often used together by corporate VCs."),
        ("Which CB Insights alternative is best for market maps?", "Dealroom for European ecosystem maps and Tracxn for sector taxonomies are the closest functional substitutes, both far cheaper than CB Insights."),
        ("Does CB Insights track engineering momentum?", "No. CB Insights tracks funding, patents, news, and M&A. GitDealFlow tracks the public GitHub activity that precedes a raise, which is a different and earlier signal."),
        ("What should a corporate VC use instead?", "A stack: Dealroom or Tracxn for the market map, GitDealFlow for the weekly momentum feed that tells you which companies to shortlist. Together they cover strategy and sourcing for less than CB Insights alone."),
    ])

alt("alternatives-to/angellist-alternatives",
    "Best AngelList Alternatives for Deal Sourcing and Investing in 2026",
    "Best AngelList Alternatives in 2026",
    ["AngelList is the dominant platform for turning a lead investor's conviction into a fundable vehicle: syndicates, rolling funds, and SPVs, plus the Wellfound job marketplace. What it does not do is tell you which startup to back in the first place.",
     "The alternatives below fill the gaps around AngelList: the sourcing signal that surfaces the deal before a syndicate opens, the research databases for diligence, and the CRMs and cap table tools for after you invest."],
    "AngelList is fundraising infrastructure, not a sourcing signal. These alternatives add the early signal (GitDealFlow), research depth (Crunchbase, PitchBook, Harmonic), and the post-investment stack (Affinity, Carta).",
    ["crunchbase", "harmonic", "affinity", "carta", "pitchbook"],
    [
        ("Is GitDealFlow a replacement for AngelList?", "No, they are sequential stages. GitDealFlow finds the deal before it is fundable; AngelList gives you the vehicle to invest once you are convinced. They compound rather than compete."),
        ("Does AngelList show which startups are accelerating?", "No. AngelList shows who is raising, hiring, and syndicating. GitDealFlow tracks the public GitHub activity that precedes a raise, 21-47 days earlier."),
        ("What do I use after I invest through a syndicate?", "Carta for cap table and equity management, and Affinity for relationship and pipeline tracking. Neither helps you source, which is why the signal layer comes first."),
        ("Can I use GitDealFlow and AngelList together?", "Yes. GitDealFlow surfaces the accelerating startup, you diligence the momentum, then deploy through an AngelList syndicate or SPV when a lead you respect opens one."),
    ])

alt("alternatives-to/privco-alternatives",
    "Best PrivCo Alternatives for Private Company Financials in 2026",
    "Best PrivCo Alternatives in 2026",
    ["PrivCo is a financial-intelligence database focused on US private companies, with proprietary revenue, EBITDA, and valuation estimates across 5M+ companies, most of them bootstrapped or family-owned. It is a diligence and M&A tool, not an early-stage sourcing tool.",
     "The alternatives below either cover the same financial ground with different depth or geography, or add the early signal PrivCo does not attempt to provide."],
    "PrivCo excels at US private-company financials and M&A intelligence. These alternatives add different coverage (Grata, PitchBook, CB Insights) or a predictive early signal (GitDealFlow).",
    ["pitchbook", "cb-insights", "grata", "crunchbase", "dealroom"],
    [
        ("Is GitDealFlow a replacement for PrivCo?", "No. PrivCo provides revenue and valuation estimates for due diligence; GitDealFlow provides pre-announcement sourcing signals. They serve different stages of the same workflow."),
        ("Which PrivCo alternative is best for middle-market M&A?", "Grata is the closest functional substitute, with revenue estimates, EBITDA, and 800,000+ transactions for comps, aimed at buyout professionals."),
        ("Does PrivCo cover international companies?", "PrivCo is US-focused, listing international companies only when they have raised over $50M. Dealroom and Tracxn are stronger for non-US coverage."),
        ("What should a seed-stage investor use instead?", "GitDealFlow for the sourcing signal and Crunchbase's free tier for funding history. PrivCo's financial estimates are more relevant to M&A and growth-stage diligence than to seed investing."),
    ])

alt("alternatives-to/tracxn-alternatives",
    "Best Tracxn Alternatives for Sector Discovery in 2026",
    "Best Tracxn Alternatives in 2026",
    ["Tracxn organizes millions of companies into thousands of sectors and business models, with the deepest curated coverage in emerging markets like India and Southeast Asia. It is a strong discovery tool, but a taxonomy classifies the past: it tells you what a company does, not what it is about to do.",
     "The alternatives below add what a taxonomy cannot: predictive engineering signal, deeper financials, and ecosystem mapping. They cover the same sectors from different angles."],
    "Tracxn is a powerful sector taxonomy with emerging-market depth. These alternatives add forward-looking signal (GitDealFlow), deeper financials (PitchBook, CB Insights), or regional mapping (Dealroom, Harmonic).",
    ["crunchbase", "pitchbook", "dealroom", "harmonic", "cb-insights"],
    [
        ("Is GitDealFlow a replacement for Tracxn?", "No. Tracxn is a sector-taxonomy database; GitDealFlow is an engineering-momentum signal. Use Tracxn to map a sector and GitDealFlow to time which companies inside it are accelerating."),
        ("Which Tracxn alternative is best for emerging markets?", "Dealroom for European ecosystems and Harmonic for global startup discovery are the closest alternatives, though Tracxn's India and Southeast Asia depth remains a differentiator."),
        ("Does Tracxn track engineering momentum?", "No. Tracxn tracks funding, business models, and taxonomies. GitDealFlow tracks the public GitHub activity that precedes a raise."),
        ("Can I use Tracxn and GitDealFlow together?", "Yes. Map the sector with Tracxn, then run GitDealFlow's weekly leaderboard to see which of those companies are shipping fastest right now."),
    ])

alt("alternatives-to/dealroom-alternatives",
    "Best Dealroom Alternatives for Deal Sourcing in 2026",
    "Best Dealroom Alternatives in 2026",
    ["Dealroom is Europe's reference platform for startup ecosystem data: funding rounds, founder moves, hiring signals, and geography-level market maps. Its strength is regional completeness, but it is a database of what has happened, and its custom pricing with a multi-seat minimum puts it out of reach for many individual investors.",
     "The alternatives below split into cheaper databases that cover similar ground and signal tools that answer the question Dealroom cannot: who is accelerating right now."],
    "Dealroom is the source of record for European ecosystems but is custom-priced with a multi-seat minimum. These alternatives add global coverage, deeper financials, or a predictive early signal (GitDealFlow).",
    ["crunchbase", "pitchbook", "cb-insights", "tracxn", "harmonic"],
    [
        ("Is GitDealFlow a replacement for Dealroom?", "No. Dealroom is an ecosystem database with deep European coverage; GitDealFlow is an engineering-momentum signal. They complement each other, and many EU-focused funds use both."),
        ("Which Dealroom alternative is best for European data?", "Crunchbase and PitchBook both cover European companies, but neither matches Dealroom's founder and hiring signals for the region. GitDealFlow reads European startups through their public GitHub activity instead."),
        ("Does Dealroom track engineering momentum?", "No. Dealroom tracks funding, founders, hiring, and ecosystem data. GitDealFlow tracks the public GitHub activity that precedes a raise."),
        ("What should a seed investor use instead of Dealroom?", "GitDealFlow's Dashboard (EUR 49/month) plus Crunchbase's free tier covers sourcing and context, which is what most seed investors need before Dealroom's enterprise pricing is justified."),
    ])

# ── BEST ───────────────────────────────────────────────────────────────────

best("best/best-angel-investment-platforms.html",
     "Best Angel Investment Platforms in 2026",
     "Best Angel Investment Platforms in 2026",
     ["An angel investment platform solves the operational half of investing: deploying capital, running a syndicate, and tracking your portfolio. What it rarely solves is the sourcing half, which is why the best angels pair a platform with a signal tool.",
      "This guide covers the platforms for deploying and managing angel capital, and where a sourcing signal fits alongside them."],
     "Angel platforms handle capital deployment and portfolio management. Pair one with a sourcing signal (GitDealFlow) to get the deal before the platform sees it.",
     ["angellist", "harmonic", "crunchbase", "affinity"],
     [
         ("Deployment", "How easily can you commit capital: SPVs, syndicates, rolling funds, or direct cheques."),
         ("Sourcing", "Does the platform surface new deals, or only host deals that are already being raised."),
         ("Portfolio tracking", "Can you see valuations, follow-ons, and updates across your whole portfolio."),
         ("Cost model", "Flat fee versus carry: understand what you pay even when nothing returns."),
         ("Network", "Does the platform give you access to other investors, or keep you siloed."),
     ],
     [
        ("Do I need a platform to angel invest?", "No. You can write direct cheques without one, but a platform like AngelList removes the legal and administrative overhead of SPVs and syndicates."),
        ("Which platform is best for finding deals?", "Platforms host deals; they rarely find them early. GitDealFlow's weekly GitHub signal surfaces startups 21-47 days before a round, before any platform lists them."),
        ("How much do angel platforms cost?", "AngelList is free to join and earns a 5% carry on syndicate gains. Data platforms like Crunchbase start at roughly $49/month, and CRMs like Affinity start near $2,000/user/year."),
        ("Can I manage my portfolio in a spreadsheet instead?", "Yes, for a small portfolio. As you cross ten or twenty investments, a purpose-built tool like Carta or Affinity pays for itself in saved time."),
     ])

best("best/best-crunchbase-alternatives.html",
     "Best Crunchbase Alternatives in 2026",
     "Best Crunchbase Alternatives in 2026",
     ["Crunchbase is the default startup database, and for funding history and market mapping it earns the default. The reason to look for an alternative is timing: Crunchbase records rounds after they are public, which is too late to source a deal.",
      "This roundup covers the databases and signal tools that either cost less, cover different ground, or surface the opportunity before Crunchbase ever sees it."],
     "Crunchbase is a record of what already happened. These alternatives add predictive signal (GitDealFlow), deeper financials (PitchBook, CB Insights), or different coverage (Dealroom, Tracxn, Harmonic).",
     ["pitchbook", "cb-insights", "dealroom", "tracxn", "harmonic"],
     [
         ("Coverage", "How many companies, and in which geographies and stages."),
         ("Signal timing", "Does the tool tell you what happened, or what is about to happen."),
         ("Data depth", "Funding history alone, or financials, patents, and analyst research too."),
         ("Cost", "Free tier through enterprise: match the price to your stage and budget."),
         ("Export and API", "Can you pull lists into your CRM or spreadsheet, and how easily."),
     ],
     [
        ("Is GitDealFlow a replacement for Crunchbase?", "Not a full one. Crunchbase is the reference for researching a company's history; GitDealFlow flags startups before they raise. Most investors use both."),
        ("Which Crunchbase alternative finds deals earliest?", "GitDealFlow, because it reads public GitHub activity weekly and flags acceleration 21-47 days before a round."),
        ("What is the cheapest Crunchbase alternative?", "GitDealFlow's free tier covers the Sunday digest, trending board, and MCP server. Its Dashboard is EUR 49/month."),
        ("Which is best for financial depth?", "PitchBook and CB Insights, both custom-quoted with five-figure floors, provide the deepest financial and analyst data."),
     ])

best("best/best-deal-flow-software.html",
     "Best Deal Flow Software for Investors in 2026",
     "Best Deal Flow Software in 2026",
     ["Deal flow software is the system of record for your pipeline: the tools that capture, track, and manage the startups you are evaluating. The category spans relationship-intelligence CRMs, data platforms, and the signal layers that feed the top of the funnel.",
      "This guide separates the two jobs that get lumped together under 'deal flow': sourcing new companies and tracking the ones you already found."],
     "Deal flow software splits into sourcing (finding companies) and pipeline (tracking them). The best stacks use a signal layer for the first and a CRM for the second.",
     ["affinity", "crunchbase", "pitchbook", "harmonic"],
     [
         ("Capture", "How easily can you get a new company into the system."),
         ("Tracking", "Does it show where each deal is in your process."),
         ("Signal freshness", "Does it tell you what changed about a company this week."),
         ("Workflow fit", "Does it match how your team actually works."),
         ("Data ownership", "Can you export your pipeline when you want to leave."),
     ],
     [
        ("Is GitDealFlow a CRM?", "No. GitDealFlow is a signal layer for sourcing: it surfaces startups whose engineering momentum is breaking out. It feeds the top of your pipeline and pairs with whatever CRM you already use."),
        ("What is the difference between deal flow software and a database?", "A database (Crunchbase, PitchBook) tells you who exists. A CRM tracks the companies in your pipeline. A signal layer (GitDealFlow) tells you who is heating up now."),
        ("Do I need deal flow software as an angel?", "Not at first. A spreadsheet works until your volume grows. Most investors need a sourcing signal earlier than a CRM, because finding the right companies is the harder problem."),
        ("What does a VC CRM cost?", "Affinity starts around $2,000 per user per year with a roughly $20,000 minimum, so it is built for funds of five or more people."),
     ])

best("best/best-deal-flow-tools.html",
     "Best Deal Flow Tools for Finding Startups Early in 2026",
     "Best Deal Flow Tools in 2026",
     ["Deal flow tools solve the front half of investing: finding quality startups before the rest of the market. They range from databases and discovery engines to the signal tools that read leading indicators like GitHub activity.",
      "This roundup covers the full sourcing stack, from the databases that tell you who exists to the signal tools that tell you who is about to move."],
     "The deal flow tool you need depends on the stage you are missing. Databases tell you who exists; signal tools (GitDealFlow) tell you who is accelerating right now.",
     ["crunchbase", "pitchbook", "harmonic", "affinity", "angellist"],
     [
         ("Discovery", "Does it surface companies you would not otherwise find."),
         ("Timing", "How early does it catch a startup relative to its round."),
         ("Signal quality", "Is the signal objective and reproducible, or curated."),
         ("Workflow", "Does it feed your CRM and watchlist cleanly."),
         ("Cost", "Free tier through enterprise, matched to your stage."),
     ],
     [
        ("Which deal flow tool finds startups earliest?", "GitDealFlow, by reading public GitHub activity and flagging acceleration 21-47 days before a round. No funding database can beat code-level signal on timing."),
        ("Do I need a database and a signal tool?", "Most investors do. A database (Crunchbase) provides the context once you have a name; a signal tool (GitDealFlow) provides the name in the first place."),
        ("Is Harmonic worth its price?", "Harmonic is a powerful discovery engine but carries a roughly $25,000 minimum, so it is built for established funds rather than solo investors."),
        ("Can I source deals with a free tier?", "Yes. GitDealFlow's free Sunday digest and trending board are enough to test the signal before you pay for the Dashboard."),
     ])

best("best/best-fundraising-intelligence-tools.html",
     "Best Fundraising Intelligence Tools in 2026",
     "Best Fundraising Intelligence Tools in 2026",
     ["Fundraising intelligence means knowing who is raising, who just closed, and who is likely to raise next. The first two are recorded by databases; the third requires a signal tool that reads the leading indicators before the round is public.",
      "This roundup covers the tools that answer all three questions, and where each one fits in your research stack."],
     "Databases record who is raising and who closed; only a signal tool predicts who is about to raise. The best setup layers both.",
     ["crunchbase", "pitchbook", "privco", "grata", "harmonic"],
     [
         ("Round history", "Complete funding history for diligence."),
         ("Who is raising now", "Freshness of the round and investor data."),
         ("Who raises next", "Leading indicators like hiring and engineering velocity."),
         ("Financial depth", "Revenue and valuation estimates where available."),
         ("Cost", "Match the price to how much of your workflow depends on it."),
     ],
     [
        ("Which tool predicts a fundraise earliest?", "GitDealFlow. Its SSRN-validated signal flags startups 21-47 days before a round by reading GitHub activity, earlier than hiring or news signals."),
        ("How do I know who is raising right now?", "Crunchbase and PitchBook update as rounds are announced. For pre-announcement signal, GitDealFlow's weekly leaderboard is the forward-looking layer."),
        ("Which tool has the best financial estimates?", "PrivCo and Grata provide revenue and EBITDA estimates for private companies, aimed at M&A and growth-stage diligence."),
        ("Do I need all of these tools?", "No. Most investors need one database plus one signal tool. The rest is budget-dependent."),
     ])

best("best/best-market-intelligence-platforms.html",
     "Best Market Intelligence Platforms in 2026",
     "Best Market Intelligence Platforms in 2026",
     ["Market intelligence platforms explain a market: who the players are, what they raised, and where the category is going. They are built for strategy memos, board decks, and thesis development.",
      "This roundup covers the platforms that map markets, and where a forward-looking signal tool fits when you need to go from the map to a specific deal."],
     "Market intelligence explains a market; a signal tool tells you who inside it is about to move. The best funds use both.",
     ["cb-insights", "crunchbase", "pitchbook", "dealroom", "tracxn"],
     [
         ("Analyst depth", "How much human research and curation backs the data."),
         ("Market maps", "Can it produce the map or taxonomy you need for a memo."),
         ("Coverage", "Geography and industry breadth."),
         ("Freshness", "How often the data updates."),
         ("Cost", "Five-figure platforms versus self-serve subscriptions."),
     ],
     [
        ("Is GitDealFlow a market intelligence platform?", "Not exactly. GitDealFlow is a deal-flow signal, not a market map. It is the forward-looking layer you bolt onto a platform like CB Insights or Dealroom."),
        ("Which platform is best for board decks?", "CB Insights and PitchBook, both built for institutional reporting, though both carry five-figure price tags."),
        ("Which is best for European markets?", "Dealroom is the reference for European ecosystem data, with founder, hiring, and geography-level signals."),
        ("What should a solo GP use?", "Skip the five-figure platforms. GitDealFlow's Dashboard plus Crunchbase's free tier covers sourcing and context for EUR 49/month."),
     ])

best("best/best-pitchbook-alternatives.html",
     "Best PitchBook Alternatives in 2026",
     "Best PitchBook Alternatives in 2026",
     ["PitchBook is the gold standard for institutional PE/VC financial data, but its five-figure seat price and post-announcement timing make it a poor fit for most early-stage investors.",
      "This roundup covers the cheaper databases and the signal tools that answer the question PitchBook cannot: who is about to raise."],
     "PitchBook is unmatched for institutional financials but costs $20,000+ a year and reports after the fact. These alternatives cost less or add a predictive signal.",
     ["crunchbase", "cb-insights", "dealroom", "privco", "grata"],
     [
         ("Financial depth", "Cap tables, revenue, and valuation data."),
         ("Coverage", "VC, PE, M&A, and geography."),
         ("Signal timing", "Post-announcement data versus leading indicators."),
         ("Cost", "Five-figure institutional pricing versus self-serve."),
         ("Export", "LP reporting and Excel exports."),
     ],
     [
        ("Is GitDealFlow a replacement for PitchBook?", "For early-stage sourcing, yes. GitDealFlow plus Crunchbase covers what a seed investor needs. For PE and M&A financials, PitchBook remains the standard."),
        ("Why is PitchBook so expensive?", "Thousands of analysts verify PE and M&A data by hand, and that depth is passed through in the price."),
        ("Which alternative is best for PE and M&A?", "PrivCo and Grata provide private-company financials and middle-market M&A comps at a lower price."),
        ("Can angels skip PitchBook?", "Yes. A sourcing signal plus Crunchbase's free tier is enough for most angels; PitchBook earns its price only when you need cap tables for a term sheet."),
     ])

best("best/best-pre-seed-trackers.html",
     "Best Pre-Seed Trackers in 2026",
     "Best Pre-Seed Trackers in 2026",
     ["Pre-seed is the hardest stage to source: there is no round to track, no deck circulating, and no press. The only reliable signal is what founders are actually building, which is visible on GitHub before it is visible anywhere else.",
      "This roundup covers the tools that track pre-seed companies through code activity, hiring, and community signals rather than funding data."],
     "Pre-seed companies have no funding history to track, so the best trackers read what founders are building: GitHub activity, hiring, and community signals.",
     ["crunchbase", "harmonic", "angellist", "affinity"],
     [
         ("Code activity", "Does it track GitHub commits and repositories."),
         ("Founder signal", "Does it surface teams before they formally raise."),
         ("Coverage", "Does it include companies too early for a database."),
         ("Freshness", "How often the signal updates."),
         ("Cost", "Free tier through enterprise."),
     ],
     [
        ("How do I find pre-seed companies before anyone else?", "Track public GitHub activity. GitDealFlow reads commit velocity and contributor growth weekly and flags teams 21-47 days before they raise, which is earlier than any funding database."),
        ("Do pre-seed companies appear in Crunchbase?", "Usually only after a small round is filed. The very earliest teams are only visible through code, hiring, and community signals."),
        ("Which tracker is best for founder hiring signals?", "Harmonic tracks hiring and team data across 35M+ companies, though its price is aimed at established funds."),
        ("Can I track pre-seed on a budget?", "Yes. GitDealFlow's free Sunday digest and trending board surface accelerating pre-seed teams at no cost."),
     ])

best("best/best-scout-programs.html",
     "Best VC Scout Programs and Tools for Scouts in 2026",
     "Best VC Scout Programs in 2026",
     ["Scout programs pay operators and angels to source deals for a fund, and the best scouts win on one thing: a steady stream of quality names. That stream does not come from the program itself, it comes from the sourcing tools the scout runs underneath it.",
      "This guide covers the tools that power a scout's pipeline, so you can deliver the deal flow that keeps your scout standing."],
     "A scout's value is proprietary deal flow. These tools build the sourcing pipeline that makes a scout worth their allocation.",
     ["crunchbase", "pitchbook", "harmonic"],
     [
         ("Signal quality", "Does it surface deals the fund would not otherwise see."),
         ("Cadence", "Can it deliver a steady weekly list for your Monday meeting."),
         ("Coverage", "Does it span the sectors your fund cares about."),
         ("Cost", "Does it fit a scout's budget, not a fund's."),
         ("Workflow", "Does it export cleanly into your fund's CRM."),
     ],
     [
        ("What tools do top scouts use?", "A signal tool for early discovery (GitDealFlow), a database for context (Crunchbase or PitchBook), and the fund's CRM for tracking."),
        ("How do scouts find deals before the fund does?", "They track leading indicators like GitHub activity. GitDealFlow's weekly leaderboard flags accelerating startups 21-47 days before a round."),
        ("Is a scout program worth it without a sourcing edge?", "No. The allocation only pays off if your deal flow is proprietary. A signal tool is the difference between passing on the fund's own deals and bringing new ones."),
        ("What does a scout tool stack cost?", "GitDealFlow's Dashboard is EUR 49/month, which is the cheapest layer that produces a real sourcing edge."),
     ])

best("best/best-series-a-trackers.html",
     "Best Series A Trackers in 2026",
     "Best Series A Trackers in 2026",
     ["Series A is where the round becomes visible, but the best investors still want to be in the pipeline before the announcement. Tracking Series A companies means watching both the funding data and the engineering momentum that precedes it.",
      "This roundup covers the tools that track growth-stage companies, from the databases that record the round to the signal tools that catch it early."],
     "Series A rounds are visible in databases, but the allocation is gone by then. These tools track the funding data and the engineering momentum that precedes it.",
     ["crunchbase", "pitchbook", "cb-insights", "harmonic"],
     [
         ("Round data", "Complete Series A funding history and investors."),
         ("Early signal", "Does it flag the company before the round is public."),
         ("Financial depth", "Valuation and cap table data."),
         ("Coverage", "Which stages and geographies."),
         ("Cost", "Matched to a growth-stage research budget."),
     ],
     [
        ("Which tracker catches Series A deals earliest?", "GitDealFlow, which flags the engineering acceleration that precedes a Series A by 21-47 days, before any database records the round."),
        ("Do I need PitchBook for Series A research?", "PitchBook adds valuation and cap table depth, but Crunchbase plus GitDealFlow covers most of what a Series A investor needs at a fraction of the cost."),
        ("How fresh is Series A data?", "Crunchbase and PitchBook update as rounds are announced. GitDealFlow updates every Monday from the prior week's code, so it is always ahead of the announcement."),
        ("Can I build a Series A watchlist on a budget?", "Yes. GitDealFlow's Dashboard (EUR 49/month) plus Crunchbase's free tier covers discovery and context."),
     ])

best("best/best-startup-databases.html",
     "7 Best Startup Databases for Sourcing Deals in 2026",
     "7 Best Startup Databases in 2026",
     ["A startup database is the foundation of any sourcing workflow. The best databases balance coverage (how many startups), freshness (how quickly new ones appear), and signal depth (how much you know about each).",
      "This roundup covers the major databases and explains where a predictive signal tool fits alongside them."],
     "Databases tell you who exists; the best ones also tell you who is heating up. This list ranks them on coverage, freshness, and signal depth.",
     ["crunchbase", "pitchbook", "dealroom", "tracxn", "harmonic", "privco"],
     [
         ("Coverage", "How many companies, and in which geographies and stages."),
         ("Freshness", "How quickly new startups and rounds appear."),
         ("Signal depth", "Funding history alone, or financials and momentum too."),
         ("Cost", "Free tier through enterprise."),
         ("Export", "CSV, API, and CRM integration."),
     ],
     [
        ("Which database has the most startups?", "Crunchbase and Harmonic each claim millions of profiles, while PitchBook has deeper financials on fewer companies. GitDealFlow focuses on 350+ high-signal venture-backed startups actively shipping code."),
        ("How fresh is GitDealFlow's data?", "Weekly. Commit velocity and contributor counts refresh every Monday, versus databases where rounds appear days or weeks after announcement."),
        ("Can I export startup lists?", "Yes. GitDealFlow exports signals as CSV and JSON, with an API for filtering by sector, momentum score, and stage."),
        ("Which database is best for emerging markets?", "Tracxn has the deepest India and Southeast Asia coverage, while Dealroom leads on European ecosystems."),
     ])

best("best/best-startup-newsletters.html",
     "Best Startup Newsletters for Deal Flow in 2026",
     "Best Startup Newsletters in 2026",
     ["A curated startup newsletter is the lowest-effort way to stay current on a market, and the best ones surface names you would not find on your own. The tradeoff is that a newsletter is one curator's opinion, published on their schedule, and every subscriber sees the same list.",
      "This guide covers what to look for in a deal-flow newsletter and how to layer your own proprietary signal on top of the ones you already read."],
     "Newsletters are cheap market awareness, but every subscriber sees the same list. Layer your own signal on top so the newsletter informs you without being your only edge.",
     ["crunchbase", "pitchbook", "dealroom", "cb-insights"],
     [
         ("Curator quality", "Does the author have a real sourcing edge."),
         ("Cadence", "Daily, weekly, or monthly, and how timely."),
         ("Exclusivity", "Is the list public, or does it surface names early."),
         ("Depth", "One-line mentions or real analysis."),
         ("Cost", "Free versus paid, and what the paid tier unlocks."),
     ],
     [
        ("Which startup newsletter finds deals earliest?", "None can beat a proprietary signal. GitDealFlow's Sunday digest surfaces five accelerating startups a week, 21-47 days before they raise, which is earlier than any newsletter."),
        ("Should I pay for a startup newsletter?", "A paid newsletter is worth it for the curator's network and analysis, but treat it as market awareness, not your sourcing edge."),
        ("How do newsletters source their names?", "Most pull from databases, their own network, and inbound pitches. GitDealFlow's data is public GitHub activity, which is objective and reproducible."),
        ("Can I build my own deal-flow newsletter?", "Yes. GitDealFlow's weekly signal and CSV export give you the raw list to write your own, with an edge most curators do not have."),
     ])

best("best/best-startup-research-tools.html",
     "Best Startup Research Tools in 2026",
     "Best Startup Research Tools in 2026",
     ["Startup research tools answer the questions that come after you have a name: who founded it, what did they raise, who are the competitors, and is the market real. They range from databases to analyst platforms.",
      "This roundup covers the research stack, from the databases that give you history to the signal tools that tell you whether the company is still accelerating."],
     "Research tools answer who, what, and how much. Pair them with a signal tool so you also know whether the company is still moving.",
     ["crunchbase", "cb-insights", "pitchbook", "harmonic", "dealroom"],
     [
         ("History", "Complete funding, team, and investor data."),
         ("Market context", "Competitors and category maps."),
         ("Momentum", "Is the company still accelerating today."),
         ("Depth", "Analyst research versus raw data."),
         ("Cost", "Free tier through enterprise."),
     ],
     [
        ("Which research tool is best for due diligence?", "Crunchbase for funding history and CB Insights for market maps and analyst research, depending on budget."),
        ("Does research tell me if a company is still accelerating?", "Not usually. That is GitDealFlow's job: weekly GitHub momentum that shows whether the company is still shipping fast."),
        ("What is the cheapest research stack?", "GitDealFlow's Dashboard (EUR 49/month) plus Crunchbase's free tier covers history, context, and momentum."),
        ("Is CB Insights worth $50,000 a year?", "Only for corporate strategy teams and large funds that need board-grade market maps. Individual investors get more from cheaper tools."),
     ])

best("best/best-startup-signal-tools.html",
     "Best Startup Signal Tools for Early Detection in 2026",
     "Best Startup Signal Tools for Early Detection in 2026",
     ["A startup signal tool reads leading indicators, hiring, code activity, web traffic, before the round is public, so you can source the deal instead of reading about it. The quality of the signal is everything: it must be objective, timely, and reproducible.",
      "This roundup covers the signal tools that detect momentum before a round, and what separates a real edge from a lagging indicator."],
     "The best signal tools read leading indicators like code activity and hiring, before the round is public. Timing and objectivity are the whole game.",
     ["crunchbase", "harmonic", "tracxn"],
     [
         ("Signal type", "Leading (code, hiring) versus lagging (funding, news)."),
         ("Lead time", "How far ahead of the round it flags the company."),
         ("Objectivity", "Is the signal reproducible or opinion-based."),
         ("Cadence", "Weekly refresh versus periodic reports."),
         ("Cost", "Free tier through enterprise."),
     ],
     [
        ("What is the earliest startup signal?", "Public GitHub activity. GitDealFlow's SSRN-validated signal flags startups 21-47 days before a round, earlier than hiring or news signals."),
        ("Is hiring a leading indicator?", "It is leading relative to the round, but engineers often start shipping before hiring scales. Code activity is the earliest objective signal."),
        ("How do I verify a signal tool's claims?", "Look for a published methodology you can audit. GitDealFlow publishes its SSRN preprint and CC BY 4.0 dataset so any investor can reproduce the regression."),
        ("Can I get a signal for free?", "Yes. GitDealFlow's free Sunday digest and trending board surface accelerating startups at no cost."),
     ])

best("best/best-startup-trackers-for-angels.html",
     "Best Startup Trackers for Angel Investors in 2026",
     "Best Startup Trackers for Angel Investors in 2026",
     ["Angels face the hardest sourcing problem in venture: finding quality deals without a fund's brand, analyst team, or warm network. A good tracker levels that field by surfacing objective momentum signals you can act on alone.",
      "This roundup covers the trackers that give an individual angel a systematic edge, from code-level signal to community and platform data."],
     "Angels need an objective edge to compete with funds. These trackers surface momentum signals an individual investor can act on without a team.",
     ["crunchbase", "harmonic", "angellist", "affinity"],
     [
         ("Signal type", "Code, hiring, community, or funding."),
         ("Lead time", "How early it catches a startup."),
         ("Solo fit", "Does it work for one person, or need a team."),
         ("Cost", "Does it fit an angel's budget."),
         ("Workflow", "Does it feed a simple watchlist."),
     ],
     [
        ("What tracker gives an angel the biggest edge?", "GitDealFlow's code-level signal, which flags startups 21-47 days before a round on objective GitHub data, is the most reliable solo edge."),
        ("Do angels need a CRM?", "Not at first. A spreadsheet watchlist works until you cross ten or twenty investments, at which point Affinity or a simple CRM earns its cost."),
        ("How much should an angel spend on tools?", "Start free. GitDealFlow's digest and Crunchbase's free tier cover sourcing and context; spend only when a tool proves it earns its price."),
        ("Can I find deals without a network?", "Yes, that is the point of a signal tool. GitDealFlow surfaces accelerating startups from public data, no warm intro required."),
     ])

best("best/best-startup-trackers.html",
     "Best Startup Trackers in 2026",
     "Best Startup Trackers in 2026",
     ["A startup tracker is the system that tells you which companies are worth watching, and why. The category spans databases, discovery engines, and the signal tools that track momentum rather than funding.",
      "This roundup covers the trackers that answer the two questions every investor asks: who should I watch, and who is moving right now."],
     "The best trackers answer who to watch and who is moving now. Databases answer the first; signal tools answer the second.",
     ["crunchbase", "pitchbook", "harmonic", "dealroom"],
     [
         ("Coverage", "How many companies and which stages."),
         ("Momentum", "Does it track what changed this week."),
         ("Lead time", "How early it catches a breakout."),
         ("Cost", "Free tier through enterprise."),
         ("Export", "CSV, API, and watchlist support."),
     ],
     [
        ("Which tracker catches momentum earliest?", "GitDealFlow, which reads public GitHub activity weekly and flags acceleration 21-47 days before a round."),
        ("What is the difference between a tracker and a database?", "A database records history; a tracker tells you what is moving now. GitDealFlow is the latter."),
        ("Can I track startups for free?", "Yes. GitDealFlow's free Sunday digest and trending board, plus Crunchbase's free tier, cover a basic watchlist."),
        ("Which tracker is best for global coverage?", "Harmonic (35M+ companies) and Dealroom (global ecosystems) have the broadest coverage, while GitDealFlow focuses on 350+ high-signal startups."),
     ])

best("best/best-startup-valuation-tools.html",
     "Best Startup Valuation Tools in 2026",
     "Best Startup Valuation Tools in 2026",
     ["Startup valuation tools help you price a round, model a cap table, and run comparables. They matter most at the diligence stage, after you have sourced a deal and are deciding what it is worth.",
      "This roundup covers cap table platforms, financial-intelligence databases, and where a momentum signal fits into your valuation judgment."],
     "Valuation tools price the deal after you source it. Cap table platforms, financial databases, and momentum signals each answer a piece of the question.",
     ["carta", "privco", "grata", "pitchbook"],
     [
         ("Cap table", "Does it model ownership and dilution."),
         ("Comps", "Does it give you comparable transactions."),
         ("Financial estimates", "Revenue and EBITDA where available."),
         ("Momentum", "Does it tell you whether growth is accelerating."),
         ("Cost", "From startup pricing to enterprise."),
     ],
     [
        ("Which valuation tool do I actually need?", "Carta for cap tables and 409As once you are investing; a financial database for comps; and GitDealFlow for the momentum signal that justifies the price."),
        ("Is GitDealFlow a valuation tool?", "No. GitDealFlow tells you whether a company is accelerating, which informs valuation, but it does not model cap tables or comps."),
        ("What does Carta cost?", "Carta's Launch plan starts at $280/year for up to 25 stakeholders and scales with complexity."),
        ("Where do I find revenue estimates for private companies?", "PrivCo and Grata provide revenue and EBITDA estimates, aimed at M&A and growth-stage diligence."),
     ])

best("best/best-vc-crms.html",
     "Best VC CRMs in 2026",
     "Best VC CRMs in 2026",
     ["A VC CRM is the system of record for your relationships and pipeline: every founder you met, every intro you owe, and where each deal sits. The best ones capture that data automatically so your team does not spend its time babysitting a spreadsheet.",
      "This roundup covers the relationship-intelligence CRMs built for venture, and where a sourcing signal feeds them."],
     "A VC CRM tracks relationships and pipeline; a signal tool feeds it the names. The best funds run both, because a CRM cannot source on its own.",
     ["affinity", "crunchbase", "pitchbook"],
     [
         ("Relationship capture", "Does it auto-log emails and meetings."),
         ("Warm-intro paths", "Does it surface the best path to a contact."),
         ("Pipeline stages", "Does it match your fund's process."),
         ("Sourcing input", "Does it tell you who is new and moving."),
         ("Cost", "Per-seat pricing and minimums."),
     ],
     [
        ("Is GitDealFlow a CRM?", "No. GitDealFlow is a signal layer that feeds the top of your pipeline; it pairs with whatever CRM you use rather than replacing it."),
        ("What does a VC CRM cost?", "Affinity starts around $2,000 per user per year with a roughly $20,000 minimum, built for funds of five or more people."),
        ("Do solo GPs need a CRM?", "Usually not. A focused watchlist works until volume grows. The sourcing signal matters earlier than the CRM."),
        ("How does a CRM get its deal names?", "From your network and inbound. GitDealFlow adds the outbound layer: a weekly list of accelerating startups to load into the CRM."),
     ])

best("best/best-vc-scout-programs.html",
     "Best VC Scout Programs in 2026",
     "Best VC Scout Programs in 2026",
     ["VC scout programs pay operators to source deals, and the best scouts distinguish themselves with proprietary deal flow rather than re-passing the fund's own pipeline. That edge is built with sourcing tools, not the program itself.",
      "This guide covers how to win as a scout, and the tools that produce the deal flow that keeps your allocation."],
     "A scout's edge is proprietary deal flow. The tools below build the pipeline that makes a scout worth their allocation.",
     ["crunchbase", "pitchbook", "harmonic"],
     [
         ("Sourcing edge", "Does it surface deals the fund would not see."),
         ("Cadence", "Can it deliver a weekly list for your Monday meeting."),
         ("Coverage", "Does it span the fund's sectors."),
         ("Cost", "Does it fit a scout's budget."),
         ("Workflow", "Does it export into the fund's CRM."),
     ],
     [
        ("How do scouts build proprietary deal flow?", "By tracking leading indicators like GitHub activity. GitDealFlow's weekly leaderboard flags accelerating startups 21-47 days before a round."),
        ("What tools do top scouts run?", "A signal tool for discovery (GitDealFlow), a database for context (Crunchbase or PitchBook), and the fund's CRM for tracking."),
        ("Is a scout program worth it without an edge?", "No. The allocation only pays off if your names are new to the fund. A signal tool is the cheapest way to build that edge."),
        ("What does a scout stack cost?", "GitDealFlow's Dashboard is EUR 49/month, the cheapest layer that produces a real sourcing edge."),
     ])

best("best/best-vc-screening-tools.html",
     "Best VC Screening Tools in 2026",
     "Best VC Screening Tools in 2026",
     ["Screening is the filter between a long list of startups and the few worth a meeting. The best screening tools give you an objective, repeatable signal so you are not screening on gut feel alone.",
      "This roundup covers the tools that help you rank a pipeline, from databases to the momentum signals that predict a raise."],
     "Screening is ranking a pipeline objectively. Databases give context; momentum signals give the forward-looking score that predicts a raise.",
     ["crunchbase", "cb-insights", "pitchbook", "harmonic"],
     [
         ("Ranking signal", "Does it score companies on something predictive."),
         ("Objectivity", "Is the score reproducible or opinion-based."),
         ("Depth", "How much context per company."),
         ("Cadence", "How often the ranking updates."),
         ("Cost", "Free tier through enterprise."),
     ],
     [
        ("What is the best screening signal?", "Engineering momentum. GitDealFlow's composite of commit velocity and contributor diversity made startups 3.4x more likely to announce a Series A within 60 days in its SSRN panel."),
        ("Can I screen without a database?", "Yes. GitDealFlow's weekly leaderboard ranks 350+ startups by momentum, so you can screen on signal alone and pull history from Crunchbase when needed."),
        ("How do I make screening objective?", "Use a published, reproducible signal. GitDealFlow publishes its methodology and dataset so the ranking is auditable, not a black box."),
        ("What does a screening stack cost?", "GitDealFlow's Dashboard (EUR 49/month) plus Crunchbase's free tier covers ranking and context for most funds."),
     ])

best("best/best-venture-data-platforms.html",
     "Best Venture Data Platforms in 2026",
     "Best Venture Data Platforms in 2026",
     ["Venture data platforms are the databases and intelligence tools that power the modern sourcing workflow: funding data, analyst research, ecosystem maps, and increasingly, the leading indicators that predict a raise.",
      "This roundup covers the major platforms and where a momentum signal fits as the forward-looking layer on top of them."],
     "Venture data platforms tell you who exists and what they raised. Add a momentum signal on top to know who is about to raise.",
     ["pitchbook", "cb-insights", "crunchbase", "dealroom", "tracxn"],
     [
         ("Coverage", "How many companies and which geographies."),
         ("Data type", "Funding, financials, analyst research, or ecosystem."),
         ("Signal timing", "Post-announcement data versus leading indicators."),
         ("Cost", "Five-figure institutional versus self-serve."),
         ("Export", "CSV, API, and reporting."),
     ],
     [
        ("Which venture data platform is best?", "Depends on stage and budget: PitchBook for institutional financials, CB Insights for analyst research, Crunchbase for general coverage, and Dealroom for European ecosystems."),
        ("Do any of these predict a raise?", "Not inherently. GitDealFlow is the forward-looking layer: it reads GitHub activity and flags startups 21-47 days before a round, ahead of any platform."),
        ("What is the cheapest way to get venture data?", "Crunchbase's free tier plus GitDealFlow's free digest, then upgrade only what you actually use."),
        ("Can I get venture data via API?", "Yes. GitDealFlow's MCP server, OpenAPI spec, and JSON/CSV exports are free, and most platforms offer API access at higher tiers."),
     ])

best("best/vc-deal-sourcing-tools",
     "Best VC Deal Sourcing Tools in 2026",
     "Best VC Deal Sourcing Tools in 2026",
     ["Deal sourcing is the highest-leverage activity in venture: the quality of your pipeline determines everything downstream. The best sourcing tools surface companies you would not find through your own network, and do it earlier than the market.",
      "This roundup covers the full sourcing stack, from databases to the signal tools that read leading indicators."],
     "Sourcing tools fall into databases (who exists) and signal tools (who is moving). The best pipeline uses both.",
     ["crunchbase", "pitchbook", "harmonic", "affinity", "angellist"],
     [
         ("Discovery", "Does it surface companies you would not find alone."),
         ("Timing", "How early it catches a startup relative to its round."),
         ("Signal quality", "Objective and reproducible, or curated."),
         ("Workflow", "Does it feed your CRM and watchlist."),
         ("Cost", "Free tier through enterprise."),
     ],
     [
        ("Which sourcing tool finds deals earliest?", "GitDealFlow, by reading public GitHub activity and flagging acceleration 21-47 days before a round."),
        ("Do I need a database and a signal tool?", "Yes. The database gives context once you have a name; the signal tool gives you the name in the first place."),
        ("Can I source deals without a network?", "Yes. GitDealFlow surfaces accelerating startups from public data, which is exactly how you build a pipeline without warm intros."),
        ("What is the cheapest sourcing stack?", "GitDealFlow's free digest plus Crunchbase's free tier, then the EUR 49/month Dashboard when you want the full ranked field."),
     ])
