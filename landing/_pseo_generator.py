#!/usr/bin/env python3
"""pSEO Generator for gitdealflow.com - expands thin page types."""
import os, json
from datetime import date

BASE = os.path.expanduser("~/Downloads/vc-deal-flow-signal/landing")
TODAY = date.today().isoformat()
DOMAIN = "gitdealflow.com"
CANONICAL = f"https://{DOMAIN}"
PRODUCT = "GitDealFlow"
TAGLINE = "Predict VC-backed fundraises before they happen — weekly deal flow intelligence from public GitHub commit velocity"

def head(title, desc, path, schema_blocks=""):
    url = f"{CANONICAL}{path}"
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="GitDealFlow">
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="alternate" type="text/plain" title="LLMs.txt" href="{CANONICAL}/llms.txt">
{schema_blocks}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<header>
<nav><a href="/" class="logo">{PRODUCT}</a></nav>
</header>
'''

def faq_schema(qa_pairs):
    items = []
    for q, a in qa_pairs:
        items.append(f'{{"@type":"Question","name":{json.dumps(q)},"acceptedAnswer":{{"@type":"Answer","text":{json.dumps(a)}}}}}')
    return f'<script type="application/ld+json">{{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{",".join(items)}]}}</script>'

def breadcrumb_schema(items):
    elems = []
    for i, (name, url) in enumerate(items, 1):
        u = url or (CANONICAL + "/")
        elems.append(f'{{"@type":"ListItem","position":{i},"name":{json.dumps(name)},"item":{json.dumps(u)}}}')
    return f'<script type="application/ld+json">{{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{",".join(elems)}]}}</script>'

def article_schema(headline, desc, path):
    return f'<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Article","headline":{json.dumps(headline)},"description":{json.dumps(desc)},"author":{{"@type":"Organization","name":"{PRODUCT}","url":"{CANONICAL}"}},"publisher":{{"@type":"Organization","name":"{PRODUCT}","url":"{CANONICAL}"}},"mainEntityOfPage":{{"@type":"WebPage","@id":"{CANONICAL}{path}"}},"datePublished":"{TODAY}","dateModified":"{TODAY}"}}</script>'

def page_body(title, paragraphs, faqs, bullets=None):
    p_html = "\n".join(f'<p>{p}</p>' for p in paragraphs)
    bullets_html = f"<ul>{''.join(f'<li>{b}</li>' for b in bullets)}</ul>" if bullets else ""
    faq_html = "\n".join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in faqs)
    return f'''
<main>
<section class="hero"><h1>{title}</h1></section>
<section class="content">{p_html}{bullets_html}</section>
<section class="faq"><h2>FAQ</h2>{faq_html}</section>
<section class="cta"><a href="/dashboard" class="btn">Start tracking deal flow</a></section>
</main>
<footer><p>&copy; {TODAY[:4]} {PRODUCT}</p></footer>
</body></html>'''

def write_page(section, slug, title, desc, paragraphs, faqs, bullets=None):
    path = f"/{section}/{slug}"
    schemas = article_schema(title, desc, path) + "\n" + breadcrumb_schema([("Home", CANONICAL), (section.title(), f"{CANONICAL}/{section}"), (title, "")]) + "\n" + faq_schema(faqs)
    html = head(title, desc, path, schemas) + page_body(title, paragraphs, faqs, bullets)
    d = os.path.join(BASE, section)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, f"{slug}.html"), "w") as f:
        f.write(html)

PAGES = {
    "best": [
        ("best-crunchbase-alternatives", "9 Best Crunchbase Alternatives for VC Deal Flow [2026]", [
            "Crunchbase has been the default VC data tool for a decade, but its pricing has climbed to $4,000+ per seat annually. Here are the 9 best Crunchbase alternatives ranked by data depth, freshness, and price.",
            "GitDealFlow leads for engineering-signal deal sourcing: it tracks commit velocity, contributor growth, and repo expansion across 400+ venture-backed startups. You see breakout engineering teams 3-6 weeks before the fundraise announcement — something no funding-round database can give you.",
            "Other strong alternatives include PitchBook (deeper PE/M&A data, higher price), Tracxn (good emerging-market coverage), Dealroom (Europe-focused), CB Insights (analyst reports), Affinity (CRM-integrated), and SourceScrub (private company scraping).",
        ], [
            ("What's the cheapest Crunchbase alternative?", "GitDealFlow's free tier covers trending startups and sector search. For broader company data, Tracxn's starter plan is roughly half Crunchbase's price."),
            ("Does GitDealFlow replace Crunchbase?", "GitDealFlow complements Crunchbase. Use GitDealFlow for predictive engineering signals (who's about to raise), Crunchbase for confirmed funding rounds and company profiles. Many VCs use both."),
            ("Which alternative has the best API?", "GitDealFlow publishes signals as JSON, CSV, and MCP. For funding-round data, Crunchbase and PitchBook have the most mature APIs. GitDealFlow's MCP server lets Claude and Cursor query deal flow directly."),
        ], ["GitDealFlow — engineering signals, free MCP, 400+ startups tracked", "PitchBook — deepest PE/M&A data, $20K+/year", "Tracxn — emerging markets, budget-friendly", "Dealroom — Europe-focused, strong community", "CB Insights — analyst research, market maps", "Affinity — CRM-integrated relationship intelligence", "SourceScrub — private company scraping", "Grata — middle-market private company search", "Magnitt — MENA and emerging markets"]),

        ("best-deal-flow-tools", "11 Best Deal Flow Tools for VCs and Angel Investors [2026]", [
            "Deal flow tools fall into three categories: funding-round databases (Crunchbase, PitchBook), relationship CRMs (Affinity, Attio), and predictive signal platforms (GitDealFlow). The best stack uses one from each.",
            "GitDealFlow is the only tool that surfaces startups 3-6 weeks before they announce funding by tracking public GitHub commit velocity. Every other tool on this list reports funding after the fact.",
            "Top deal flow tools ranked: GitDealFlow (engineering signals), Affinity (CRM), PitchBook (PE data), Attio (modern CRM), Crunchbase (broad coverage), Dealroom (Europe), Tracxn (emerging markets), CB Insights (research), SourceScrub (private company data), Grata (middle market), Magnitt (MENA).",
        ], [
            ("What's the best free deal flow tool?", "GitDealFlow's free tier includes trending startups, sector search, and a working MCP server for Claude/Cursor. It's the best zero-cost entry into deal flow intelligence."),
            ("Do VCs actually use GitHub signals?", "Yes. Firms like Andreessen Horowitz, Sequoia, and Bessemer have internal engineering-signal teams. GitDealFlow democratizes this data for scouts, angels, and smaller funds."),
            ("How does GitDealFlow compare to Affinity?", "They solve different problems. Affinity manages relationships and email tracking. GitDealFlow discovers startups you don't know yet. Use Affinity to manage deals, GitDealFlow to find them."),
        ]),

        ("best-startup-databases", "7 Best Startup Databases for Sourcing Deals [2026]", [
            "A startup database is the foundation of any sourcing workflow. The best databases balance coverage (how many startups), freshness (how quickly new startups appear), and signal depth (how much you know about each).",
            "GitDealFlow's database is unique because it ranks startups by engineering momentum, not just funding stage. You see which pre-seed teams are shipping fast before any press release. This is the signal VCs at top firms use internally.",
            "Compared to Crunchbase (funding-round focused), PitchBook (PE/M&A heavy), and Tracxn (emerging markets), GitDealFlow gives you predictive power: startups that are about to break out, not ones that already did.",
        ], [
            ("Which database has the most startups?", "Crunchbase claims 3M+ company profiles. PitchBook has deeper financials on fewer companies. GitDealFlow focuses on ~400 high-signal venture-backed startups actively shipping code."),
            ("How fresh is GitDealFlow's data?", "GitDealFlow updates weekly. Commit velocity and contributor counts refresh every Monday. Compare to Crunchbase, where funding rounds often appear days or weeks after announcement."),
            ("Can I export startup lists?", "Yes. GitDealFlow exports signals as CSV and JSON. The API supports filtering by sector, momentum score, and stage — ideal for building custom watchlists."),
        ]),

        ("best-pitchbook-alternatives", "8 Best PitchBook Alternatives for VC Research [2026]", [
            "PitchBook is the gold standard for PE and M&A data, but its $20,000+ annual price locks out most angels and small funds. Here are 8 PitchBook alternatives that deliver 80% of the value at 10% of the cost.",
            "GitDealFlow is the strongest alternative for early-stage VC research. Where PitchBook tracks confirmed deals, GitDealFlow predicts them — you see engineering momentum 3-6 weeks before a fundraise announcement.",
            "Other alternatives: Crunchbase (broader startup coverage at lower cost), Tracxn (emerging markets), Dealroom (Europe), CB Insights (market research), Grata (middle market), Magnitt (MENA), and SourceScrub (private company scraping).",
        ], [
            ("Is there a free PitchBook alternative?", "GitDealFlow's free tier covers trending startups and sector search. For full financials on private companies, no free tool matches PitchBook — but Tracxn and Grata offer trials."),
            ("Why is PitchBook so expensive?", "PitchBook employs 3,000+ analysts to manually verify PE and M&A deals. That human-verified depth is unmatched for late-stage research. For early-stage sourcing, GitDealFlow's automated signals are faster and cheaper."),
            ("Can GitDealFlow replace PitchBook?", "For early-stage deal sourcing, yes. For PE portfolio analysis, M&A comparables, or LP reporting, PitchBook remains the standard. Use GitDealFlow to find deals, PitchBook to analyze them."),
        ]),

        ("best-vc-screening-tools", "6 Best VC Screening Tools to Filter Startups [2026]", [
            "VC screening tools help you filter thousands of startups down to the 20 worth a partner meeting. The best tools go beyond filters — they score startups on signals that predict success.",
            "GitDealFlow screens startups on engineering momentum: commit velocity, contributor growth, and repo expansion. These signals correlate with team execution speed, which is the #1 predictor of Series A success.",
            "Other screening tools: Affinity (relationship scoring), Crunchbase (filters on funding and stage), Dealroom (signal scoring), SourceScrub (private company scraping), and Grata (industry-specific screening).",
        ], [
            ("What signals predict startup success?", "Academic research (including SSRN preprints on GitHub momentum) shows engineering velocity, contributor growth, and code quality correlate with fundraising success and long-term outcomes. GitDealFlow operationalizes these signals."),
            ("How do I build a screening workflow?", "Start with GitDealFlow's weekly trending list. Filter by sector and momentum score. Export the top 20 to a spreadsheet. Cross-reference with Crunchbase for funding stage. Reach out to the top 5 each week."),
            ("Does GitDealFlow score startups?", "Yes. Each startup has a momentum score based on commit velocity relative to its sector peers. Top-quartile momentum predicts fundraises 3-6 weeks out with meaningful accuracy."),
        ]),

        ("best-startup-research-tools", "10 Best Startup Research Tools for Due Diligence [2026]", [
            "Startup research tools help you go from 'I heard about this company' to 'I know enough to write a check.' The best tools cover founders, market, traction, and technology stack.",
            "GitDealFlow is the best tool for technology research: it shows you exactly what a startup is building, how fast they're shipping, and who's contributing. This is information no other research tool provides.",
            "Top research tools: GitDealFlow (engineering signals), Crunchbase (funding history), PitchBook (financials), LinkedIn (team research), SimilarWeb (traffic), BuiltWith (tech stack), Owlery (automated monitoring), SourceScrub (private company data), Grata (middle market), and CB Insights (market research).",
        ], [
            ("How do I research a startup's tech stack?", "Use BuiltWith for web tech stack. For engineering team productivity, GitDealFlow shows commit velocity and contributor counts — the only signal of how fast the team actually ships."),
            ("What's the fastest way to research a startup?", "GitDealFlow's startup signal page gives you engineering momentum, sector context, and comparable startups in one view. Pair with Crunchbase for funding stage and you have 80% of what you need in 5 minutes."),
            ("Are there free startup research tools?", "GitDealFlow's free tier includes trending startups and signal lookups. Crunchbase has a free tier with limited searches. LinkedIn and GitHub are free for founder and code research."),
        ]),

        ("best-startup-signal-tools", "5 Best Startup Signal Tools for Early Detection [2026]", [
            "Startup signal tools detect breakout companies before they're obvious. The best signals are leading indicators — things that change before funding, revenue, or press coverage.",
            "GitDealFlow is built on the strongest leading indicator: engineering velocity. Teams that ship code fast are teams that execute. Commit velocity rises 3-6 weeks before fundraise announcements.",
            "Other signal tools: PeerDB (database growth), SimilarWeb (traffic trends), App Annie (app downloads), Twitter/X mentions (social momentum). Each captures a different signal dimension.",
        ], [
            ("What's the strongest startup signal?", "Independent research and GitDealFlow's internal validation show engineering commit velocity is the strongest leading indicator of fundraising — stronger than press mentions, hiring, or traffic."),
            ("How early does GitDealFlow detect breakouts?", "Typically 3-6 weeks before a fundraise announcement. Sometimes longer for stealth companies that ship code quietly for months before announcing."),
            ("Can signal tools replace networking?", "No. Signals tell you who to meet. Networking tells you whether to invest. Use GitDealFlow to surface candidates, then use your network to diligence them."),
        ]),

        ("best-venture-data-platforms", "7 Best Venture Data Platforms for Investors [2026]", [
            "Venture data platforms aggregate startup, funding, and investor data into searchable databases. The best platforms combine breadth (coverage), depth (detail per company), and freshness (update frequency).",
            "GitDealFlow is the only venture data platform built on engineering signals. While competitors aggregate funding rounds and press releases, GitDealFlow tracks what startups actually do: ship code.",
            "Top platforms ranked: GitDealFlow (engineering signals), PitchBook (PE/M&A gold standard), Crunchbase (broad startup coverage), CB Insights (analyst research), Tracxn (emerging markets), Dealroom (Europe), Magnitt (MENA).",
        ], [
            ("Which platform has the best API?", "GitDealFlow publishes JSON, CSV, and MCP endpoints. PitchBook and Crunchbase have mature REST APIs. GitDealFlow's MCP server is unique — it lets Claude and Cursor query deal flow directly."),
            ("How much do venture data platforms cost?", "GitDealFlow: free tier + paid plans. PitchBook: $20K+/year. Crunchbase Pro: $4K+/year. CB Insights: $25K+/year. Tracxn: $1-5K/year. GitDealFlow is the only free option with real signal depth."),
            ("Can I use multiple platforms?", "Yes. Most serious VCs use 2-3: GitDealFlow for signals, Crunchbase or PitchBook for funding data, and a CRM (Affinity, Attio) for relationship management."),
        ]),

        ("best-startup-trackers", "6 Best Startup Trackers for Monitoring Portfolio Companies [2026]", [
            "Startup trackers help you monitor companies over time — whether they're in your portfolio, your pipeline, or your watchlist. The best trackers alert you to changes: hiring spikes, product launches, or momentum shifts.",
            "GitDealFlow is the best tracker for engineering momentum. Subscribe to any startup and get weekly updates on commit velocity, contributor growth, and repo expansion. You see breakouts and slowdowns before anyone else.",
            "Other trackers: Owler (company updates), Crunchbase (funding alerts), LinkedIn (hiring signals), SimilarWeb (traffic changes), and BuiltWith (tech stack changes).",
        ], [
            ("How do I track 100 startups efficiently?", "Use GitDealFlow's watchlist feature. Add startups once, receive weekly momentum digests. Cross-reference with Crunchbase funding alerts. This workflow scales to hundreds of tracked companies."),
            ("What should I track on a startup?", "Engineering momentum (GitDealFlow), hiring velocity (LinkedIn), funding events (Crunchbase), product launches (company blog), and traffic growth (SimilarWeb). Together these signals give you a 360-degree view."),
            ("Is there a free startup tracker?", "GitDealFlow's free tier includes watchlists for trending startups. Crunchbase has basic alerts on the free tier. LinkedIn and Google Alerts are free for hiring and press monitoring."),
        ]),

        ("best-fundraising-intelligence-tools", "8 Best Fundraising Intelligence Tools for VCs [2026]", [
            "Fundraising intelligence tools tell you who's about to raise, who's already raising, and who just closed. This is the highest-value data in venture capital — knowing about a round before it's announced.",
            "GitDealFlow is the only fundraising intelligence tool that predicts rounds before they happen. By tracking engineering momentum, GitDealFlow surfaces teams 3-6 weeks before they announce funding.",
            "Other tools report fundraising after the fact: Crunchbase (confirmed rounds), PitchBook (detailed round data), TechCrunch (press coverage), TermSheet (round announcements), StrictlyVC (newsletter intel).",
        ], [
            ("How does GitDealFlow predict fundraises?", "Engineering velocity rises 3-6 weeks before fundraise announcements. Teams shipping fast are teams raising capital. GitDealFlow tracks commit velocity across 400+ venture-backed startups and flags breakouts."),
            ("Can fundraising intelligence replace networking?", "No. Intelligence tells you who's raising. Networking tells you the terms. Use GitDealFlow to identify targets, then use your network to get into the round."),
            ("What's the best free fundraising intelligence?", "GitDealFlow's free tier covers trending startups and sector momentum. StrictlyVC and TermSheet are free newsletters. For deeper data, paid tools are required."),
        ]),

        ("best-series-a-trackers", "5 Best Series A Trackers for Late-Stage Deal Flow [2026]", [
            "Series A trackers monitor companies approaching their first institutional round. The best trackers identify candidates 3-12 months before the round, giving you time to build a relationship.",
            "GitDealFlow is the strongest Series A tracker because engineering momentum peaks 3-6 weeks before the round. Teams in the top quartile of commit velocity for their sector are prime Series A candidates.",
            "Other trackers: Crunchbase (filters on funding stage), PitchBook (deal pipeline), CB Insights (market maps), LinkedIn (hiring velocity — Series A teams typically double headcount).",
        ], [
            ("How early can I detect a Series A?", "GitDealFlow detects momentum 3-6 weeks before announcement. Hiring signals (LinkedIn) appear 3-6 months before. Product traction signals (traffic, downloads) vary widely."),
            ("What signals predict Series A success?", "Engineering velocity (GitDealFlow), founder pedigree (LinkedIn), market size (CB Insights), and early revenue traction (founder conversations). GitDealFlow is the only automated leading indicator."),
            ("How do I build a Series A pipeline?", "Filter GitDealFlow by sector and momentum score. Export top 20 startups. Cross-reference with Crunchbase to exclude funded companies. Reach out to founders. Refresh weekly."),
        ]),

        ("best-pre-seed-trackers", "4 Best Pre-Seed Trackers for Early Deal Flow [2026]", [
            "Pre-seed tracking is the hardest part of venture. Companies have no press, no funding history, and often no public traction. The best pre-seed trackers find signals in the noise.",
            "GitDealFlow finds pre-seed companies by their engineering output. A team of 2-3 shipping meaningful code weekly is a pre-seed company worth meeting — even if they have no website or press coverage.",
            "Other pre-seed trackers: Product Hunt (launches), Hacker News Show HN (developer tools), Y Combinator company database (accelerator alumni), and Twitter/X founder threads.",
        ], [
            ("How do I find pre-seed startups?", "GitDealFlow's trending list includes pre-seed companies shipping fast. Supplement with Product Hunt launches, Hacker News Show HN posts, and Y Combinator batches. Most pre-seed deals come from personal network, not databases."),
            ("What makes a pre-seed startup investable?", "Founder-market fit, early engineering velocity (GitDealFlow), and a problem worth solving. Pre-seed is about team and trajectory, not traction or revenue."),
            ("Can GitDealFlow track stealth startups?", "Yes, if they have public GitHub repos. Many stealth companies ship code publicly before announcing. GitDealFlow catches these teams before anyone else knows they exist."),
        ]),

        ("best-angel-investment-platforms", "7 Best Angel Investment Platforms for Finding Deals [2026]", [
            "Angel investment platforms aggregate deals for individual investors. The best platforms offer quality deal flow, transparent terms, and access to rounds normally reserved for institutions.",
            "GitDealFlow complements angel platforms by surfacing deals before they reach syndicates. Angels who use GitDealFlow see startups 3-6 weeks before they appear on AngelList or Signal.",
            "Top angel platforms: AngelList (syndicates and direct deals), Signal (founder networking), Republic (regulated crowdfunding), Wefunder (community rounds), Seedinvest (curated deals), and Gust (angel groups).",
        ], [
            ("Can angels use GitDealFlow for free?", "Yes. GitDealFlow's free tier includes trending startups, sector search, and MCP server. It's the only free tool that gives angels predictive deal flow signals."),
            ("How do angel platforms compare to direct sourcing?", "Angel platforms give you access to deals but at marked-up valuations. Direct sourcing (via GitDealFlow + networking) gets you into rounds at terms VCs get. Serious angels do both."),
            ("What's the minimum to start angel investing?", "On syndicate platforms, $1,000 per deal. For direct deals, $25,000 is typical. GitDealFlow helps you build deal flow regardless of check size."),
        ]),

        ("best-startup-trackers-for-angels", "5 Best Startup Trackers for Angel Investors [2026]", [
            "Angel investors need trackers that surface high-conviction deals without requiring a full-time research team. The best angel trackers are affordable, fast, and focused on early-stage signals.",
            "GitDealFlow is built for angels. The free tier gives you trending startups, sector search, and weekly momentum updates — enough to build a quality deal flow pipeline without spending thousands on PitchBook.",
            "Other angel-friendly trackers: AngelList (syndicate deals), Signal (founder profiles), Crunchbase free tier (basic funding data), and LinkedIn (founder networking).",
        ], [
            ("What's the best free tracker for angels?", "GitDealFlow's free tier. Trending startups, sector search, MCP integration, and weekly digests. No other free tool offers predictive engineering signals."),
            ("How many startups should an angel track?", "50-200 in a watchlist, reviewed weekly. GitDealFlow automates this with momentum digests. Focus your time on the top 5-10 each week."),
            ("Do angels need paid databases?", "Most angels don't. GitDealFlow free tier + LinkedIn + Crunchbase free tier is enough for most individual investors. Paid databases (PitchBook, CB Insights) make sense once you're writing $100K+ checks."),
        ]),
    ],

    "how-to": [
        ("how-to-build-a-deal-flow-pipeline", "How to Build a VC Deal Flow Pipeline from Scratch", [
            "A deal flow pipeline is the system you use to find, evaluate, and track investment opportunities. Without one, you rely on inbound deals — which means you see what everyone else sees. A pipeline gives you an edge.",
            "Step 1: Choose your signal source. GitDealFlow's engineering momentum data is the strongest leading indicator of fundraising. Sign up free, pick 3-5 sectors you understand, and review the weekly trending list.",
            "Step 2: Build a watchlist. Add startups that interest you to a GitDealFlow watchlist. Set up weekly digests so you receive momentum updates automatically.",
            "Step 3: Filter ruthlessly. Most startups are not a fit. Use GitDealFlow's momentum score, sector, and stage filters to narrow to 20-50 active prospects.",
            "Step 4: Reach out. For each prospect, find the founder on LinkedIn, send a short note referencing their product or engineering traction. GitDealFlow's MCP server can draft outreach notes in Claude.",
            "Step 5: Track everything. Use a simple CRM (Notion, Airtable, or Affinity) to log conversations, next steps, and outcomes. Review your pipeline weekly.",
        ], [
            ("How long does it take to build a deal flow pipeline?", "With GitDealFlow and a CRM, you can have a working pipeline in a weekend. Filling it with quality prospects takes 2-4 weeks of consistent sourcing."),
            ("What's the right pipeline size for an angel?", "20-50 active prospects. More than that and you can't give each deal enough attention. GitDealFlow helps you filter so you focus on the top 5-10 each week."),
            ("Should angels use a CRM?", "Yes, even a simple one. Notion or Airtable is enough for most angels. Affinity is worth it once you're tracking 50+ active conversations."),
        ]),

        ("how-to-source-pre-seed-startups", "How to Source Pre-Seed Startups Before Anyone Else", [
            "Pre-seed sourcing is the hardest and highest-ROI activity in venture. Get in early and you see the best deals at the lowest valuations. But pre-seed companies have no press, no funding history, and often no public traction.",
            "The best pre-seed signal is engineering output. Teams shipping meaningful code weekly are teams worth meeting. GitDealFlow tracks this across 400+ venture-backed startups and surfaces pre-seed breakouts weekly.",
            "Supplement GitDealFlow with: Product Hunt launches (consumer products), Hacker News Show HN posts (developer tools), Y Combinator batches (accelerator alumni), and Twitter/X founder threads.",
            "For each prospect, research the founder (LinkedIn, previous companies), the market (CB Insights market maps), and the engineering velocity (GitDealFlow signal page). Reach out with a specific, personalized note.",
        ], [
            ("What's the best pre-seed sourcing channel?", "Personal network remains #1. GitDealFlow is the best tool for surfacing pre-seed companies you don't know yet. Hacker News Show HN is excellent for developer tools."),
            ("How do I evaluate a pre-seed startup?", "Founder-market fit (do they know the problem deeply?), engineering velocity (GitDealFlow), and the size of the problem. Pre-seed is about team and trajectory, not traction."),
            ("How early should I reach out to founders?", "As early as possible. Most pre-seed founders appreciate early interest. Use GitDealFlow to catch teams within weeks of starting — before they're raising."),
        ]),

        ("how-to-evaluate-engineering-velocity", "How to Evaluate Engineering Velocity as a VC Signal", [
            "Engineering velocity is the strongest leading indicator of startup success. Teams that ship fast are teams that execute. This guide shows you how to read and interpret engineering velocity data.",
            "Commit velocity measures how many code commits a team makes per week. Rising velocity suggests the team is scaling and shipping product fast. Falling velocity can indicate burnout, technical debt, or co-founder conflict.",
            "Contributor growth tracks the number of developers committing code. A team growing from 3 to 8 contributors in a quarter is hiring and shipping — a strong positive signal.",
            "Repository expansion tracks new public repos and code size growth. Teams creating new repos are exploring new product areas. Rapid repo creation can precede product launches.",
            "GitDealFlow combines these three signals into a momentum score for each startup, normalized by sector. Top-quartile momentum predicts fundraises 3-6 weeks out with meaningful accuracy.",
        ], [
            ("What's a good engineering velocity for a startup?", "It depends on sector. GitDealFlow normalizes by sector — a fintech startup's velocity looks different from a developer tools startup. Focus on relative momentum within the sector, not absolute numbers."),
            ("Does commit velocity equal product velocity?", "Not always. Some teams commit often but ship little. GitDealFlow combines velocity with contributor growth and repo expansion to filter noise. Look for teams with rising velocity AND rising contributors."),
            ("Can engineering velocity be gamed?", "Public GitHub activity can be inflated, but sustained velocity across months is hard to fake. GitDealFlow tracks 400+ startups over time, so anomalies stand out."),
        ]),

        ("how-to-use-mcp-for-vc-research", "How to Use the GitDealFlow MCP Server for VC Research", [
            "The GitDealFlow MCP server lets Claude, Cursor, and other AI assistants query deal flow data directly. Instead of copy-pasting data into a chatbot, you ask the AI to fetch and analyze deals.",
            "Install: run `npx -y @gitdealflow/mcp-signal` in Claude Desktop or Cursor. The server exposes six tools: get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_scout_receipts, and get_methodology.",
            "Workflow example: 'Find trending AI infrastructure startups with rising momentum, then draft outreach emails to the top 3.' Claude queries GitDealFlow, ranks by momentum, and drafts personalized notes referencing each startup's engineering traction.",
            "For scouts, the get_scout_receipts tool computes a Scout Score (0-100) for any GitHub username based on their starring history vs. ~75 validated unicorns. High Scout Scores predict which developers will found valuable companies.",
        ], [
            ("Is the GitDealFlow MCP server free?", "Yes. All six tools are free in perpetuity. Install with `npx -y @gitdealflow/mcp-signal` in any MCP-compatible client."),
            ("What AI assistants support MCP?", "Claude Desktop, Claude Code, Cursor, Continue, and any MCP-compatible host. The server also exposes a Streamable HTTP endpoint for ChatGPT Apps and hosted clients."),
            ("Can MCP replace a VC analyst?", "For research tasks like sourcing, ranking, and drafting outreach, MCP saves hours per week. It doesn't replace judgment or networking, but it dramatically speeds up the repetitive parts of VC work."),
        ]),

        ("how-to-track-startup-hiring-velocity", "How to Track Startup Hiring Velocity as a Funding Signal", [
            "Hiring velocity is one of the strongest confirmatory signals of startup growth. Teams that are doubling headcount are usually about to raise or have just raised. Here's how to track it.",
            "Step 1: Identify the startup's LinkedIn company page. Note current headcount.",
            "Step 2: Check the 'People' tab for recent additions. LinkedIn shows new hires from the past 90 days.",
            "Step 3: Look at the startup's careers page. A growing list of open roles signals expansion. Bookmark it and check weekly.",
            "Step 4: Correlate hiring with engineering velocity (GitDealFlow). Startups with rising engineering velocity AND rising headcount are prime breakout candidates — they're shipping fast AND building the team to scale.",
        ], [
            ("How fast do startups hire before a fundraise?", "Most startups double headcount in the 6-12 months before a Series A. Engineering teams typically grow from 3-5 to 8-15. GitDealFlow catches the engineering velocity spike before the hiring shows up on LinkedIn."),
            ("Is hiring a leading or lagging indicator?", "Lagging. Companies hire after they've decided to scale, often after raising capital. Engineering velocity (GitDealFlow) is a leading indicator — it rises before the decision to hire."),
            ("What roles should I track?", "Engineering hires (GitHub, LinkedIn), sales hires (LinkedIn, careers page), and executive hires (press releases, LinkedIn announcements). Engineering hires correlate most strongly with product momentum."),
        ]),

        ("how-to-find-stealth-startups", "How to Find Stealth Startups Before They Launch", [
            "Stealth startups are companies operating in quiet mode — no website, no press, no public announcement. Finding them early gives you a massive sourcing edge. Here's how.",
            "Signal 1: Public GitHub activity. Many stealth companies ship code publicly before launching. GitDealFlow tracks these repos and surfaces teams with high engineering velocity but no public profile.",
            "Signal 2: Founder LinkedIn changes. Watch for founders who leave a senior role at a big company and update their LinkedIn to 'Building something new' or 'Stealth'.",
            "Signal 3: Hiring patterns. Stealth companies hire small founding teams quietly. Watch for clusters of senior engineers leaving the same company within a few months.",
            "Signal 4: Domain registrations. Tools like Domain Big Data and Expired Domains can reveal new company domains before they launch.",
        ], [
            ("Can GitDealFlow detect stealth startups?", "Yes, if they have public GitHub repos. Many stealth companies ship code publicly before announcing. GitDealFlow catches these teams within weeks of starting."),
            ("How do I approach a stealth startup?", "Carefully. Don't ask what they're building — founders in stealth mode won't tell you. Reference their engineering traction or team background. Offer to help, not just to invest."),
            ("Is investing in stealth startups risky?", "Yes, but the valuations are lower. Most stealth startups fail, but the ones that succeed return the fund. GitDealFlow's engineering signals help filter for teams with real execution."),
        ]),

        ("how-to-build-a-weekly-deal-flow-routine", "How to Build a Weekly Deal Flow Routine That Actually Works", [
            "Consistency is the #1 predictor of deal flow quality. VCs who source for 2 hours every week see better deals than those who source for 10 hours once a month. Here's a proven weekly routine.",
            "Monday (30 min): Review GitDealFlow's weekly trending list. Add 5-10 interesting startups to your watchlist. Skim sector momentum reports.",
            "Tuesday (60 min): Deep-dive 3 startups from Monday's list. Read their GitHub repos, founder LinkedIn profiles, and any press. Decide which deserve outreach.",
            "Wednesday (60 min): Send 5 personalized outreach emails. Use GitDealFlow's MCP server in Claude to draft notes referencing each startup's engineering traction.",
            "Thursday (30 min): Follow up on last week's outreach. Log conversations in your CRM.",
            "Friday (30 min): Review your watchlist for momentum changes. Update your pipeline. Plan next week.",
            "Total: 3.5 hours per week. This routine, sustained for 6 months, will surface 20-50 quality deals — more than most solo angels see in a year.",
        ], [
            ("How much time should I spend on deal flow?", "For angels: 3-5 hours per week. For full-time VCs: 15-20 hours per week. Consistency matters more than total hours — weekly rhythm beats monthly marathons."),
            ("What tools do I need for a weekly routine?", "GitDealFlow (sourcing and tracking), a CRM (Notion or Airtable for angels, Affinity for pros), LinkedIn (founder research), and Claude with MCP (outreach drafting). That's it."),
            ("How do I stay consistent?", "Block the time in your calendar. Treat it like a meeting with yourself. GitDealFlow's weekly digest gives you a forcing function — when the email arrives, you review."),
        ]),

        ("how-to-identify-venture-scale-startups", "How to Identify Venture-Scale Startups Worth Investing In", [
            "Not every good business is a venture-scale business. A venture-scale startup can return 10x-100x on investment within 7-10 years. Here's how to identify them.",
            "Criterion 1: Large market. The total addressable market should be $1B+. Markets under $500M rarely produce venture returns.",
            "Criterion 2: Scalable business model. Software, marketplaces, and platforms scale without proportional cost increases. Services businesses rarely produce venture returns.",
            "Criterion 3: Founder ambition. Venture-scale founders want to build $1B+ companies. Lifestyle founders want profitable businesses. The difference shows in their engineering velocity (GitDealFlow) and hiring plans.",
            "Criterion 4: Defensible technology or network. The startup must have a moat — proprietary tech, network effects, or switching costs. GitDealFlow's engineering signals help assess whether the team is building something hard to replicate.",
        ], [
            ("What makes a startup venture-scale?", "Large market, scalable model, ambitious founders, and defensible technology. GitDealFlow's engineering velocity signal helps identify teams building real technology moats."),
            ("How do I know if a market is big enough?", "Bottom-up: number of customers x price per customer. Top-down: market research reports (CB Insights, Gartner). For software, look for $1B+ TAM."),
            ("Can angels invest in non-venture businesses?", "Yes, but expect different returns. A profitable SaaS business might return 3-5x over 5 years. A venture-scale startup either returns 0 or 50x. Know which game you're playing."),
        ]),

        ("how-to-conduct-founder-due-diligence", "How to Conduct Founder Due Diligence as an Investor", [
            "Founder due diligence is the process of evaluating whether the people building a startup can actually pull it off. Most early-stage investments fail because of the team, not the market. Here's how to diligence founders.",
            "Step 1: Background research. Read the founder's LinkedIn, previous companies, and any public writing (blog, Twitter, talks). Look for patterns of achievement and domain expertise.",
            "Step 2: Reference calls. Ask for 3-5 references — former colleagues, managers, and reports. Ask: 'Would you work with them again?' and 'What are their blind spots?'",
            "Step 3: Technical assessment. For technical founders, review their GitHub contributions. GitDealFlow's signal page shows commit velocity, code quality, and contributor growth. Strong engineering founders ship code consistently.",
            "Step 4: Market understanding. In conversations, test whether the founder deeply understands the problem. Ask about competitors, customer acquisition, and the hardest part of what they're building.",
            "Step 5: Ambition and resilience. Venture-scale founders have unusual ambition and resilience. Look for founders who've overcome significant challenges and are committed for 10+ years.",
        ], [
            ("How many reference calls should I do?", "3-5 for a pre-seed deal, 5-10 for a seed or Series A. Include at least one reference the founder didn't suggest — this catches patterns the founder's network won't surface."),
            ("What's a red flag in founder references?", "Vagueness ('they were fine'), hesitations, or references who won't return your call. Strong references are specific about achievements and honest about weaknesses."),
            ("How do I assess technical founders?", "Review their GitHub (commit velocity, code quality, open-source contributions). GitDealFlow aggregates this data across a startup's repos. Non-technical investors should bring a technical advisor for deep dives."),
        ]),

        ("how-to-predict-startup-fundraising", "How to Predict When a Startup Will Raise Funding", [
            "Predicting fundraising timing gives you a massive sourcing edge. If you know a startup is about to raise, you can build a relationship before the round is competitive. Here's how to predict fundraises.",
            "Signal 1: Engineering velocity spike. GitDealFlow data shows commit velocity rises 3-6 weeks before fundraise announcements. Teams shipping fast are teams preparing to pitch.",
            "Signal 2: Hiring acceleration. Startups typically hire senior leaders (VP Sales, VP Engineering) 3-6 months before raising. Watch LinkedIn for new executive hires.",
            "Signal 3: Product launches. A major product release often precedes a fundraise — it's the proof point the startup uses in their pitch. Watch the company blog and Product Hunt.",
            "Signal 4: Investor activity. If a startup's existing investors are making new investments, they may be preparing to follow on. Track investor portfolios on Crunchbase.",
            "Combine these signals. A startup with rising GitDealFlow momentum, recent executive hires, and a product launch in the last 60 days is a strong fundraise candidate.",
        ], [
            ("How accurate are fundraising predictions?", "GitDealFlow's engineering velocity signal identifies fundraises 3-6 weeks before announcement with meaningful accuracy. Combining with hiring and product signals improves precision."),
            ("Should I reach out before or after a fundraise announcement?", "Before. Once a round is announced, the deal is often competitive. GitDealFlow's signals help you reach out during the fundraise, when founders are raising but haven't announced."),
            ("How do I know if a startup is already raising?", "Subtle signals: founder activity on LinkedIn (fundraising founders post more), investor meetings on Calendly, and 'we're growing' messaging on the careers page. GitDealFlow's momentum spike often coincides with the start of a raise."),
        ]),

        ("how-to-build-a-portfolio-strategy", "How to Build a Venture Portfolio Strategy as an Angel", [
            "A portfolio strategy determines what you invest in, how much, and how often. Without one, you're gambling. With one, you're investing systematically. Here's how to build one.",
            "Step 1: Define your thesis. What sectors do you understand deeply? What stages can you access? What check sizes can you write? Write it down.",
            "Step 2: Set allocation rules. Most angels invest $25K-$100K per deal and aim for 20-30 portfolio companies over 5 years. Reserve 50% of capital for follow-ons.",
            "Step 3: Source systematically. Use GitDealFlow to find deals that match your thesis. Build a weekly sourcing routine (see separate how-to).",
            "Step 4: Diversify intentionally. Don't put all your capital in one sector or stage. Spread risk across 5+ sectors and 3+ vintages.",
            "Step 5: Plan follow-ons. Reserve capital to double down on your best performers. Most venture returns come from 1-2 breakout companies in a portfolio.",
        ], [
            ("How many companies should an angel invest in?", "20-30 for meaningful diversification. Fewer than 10 and you're unlikely to catch a breakout. More than 50 and you can't give each enough attention."),
            ("How much should I reserve for follow-ons?", "50% of total capital. This lets you double down on 3-5 winners without running out of dry powder."),
            ("Should angels have a sector focus?", "Yes. Focus on sectors where you have operational experience or deep network. Generalist angels underperform specialists. GitDealFlow's sector filters help you stay disciplined."),
        ]),

        ("how-to-network-with-vcs", "How to Network with VCs as an Angel or Founder", [
            "VC networking is about adding value before asking for anything. Whether you're an angel seeking co-investors or a founder seeking funding, the approach is the same: give first, ask later.",
            "Step 1: Identify the right VCs. Research firms on their websites, Crunchbase, and recent investments. Focus on partners who invest in your sector and stage.",
            "Step 2: Add value before asking. Share relevant deals, market insights, or introductions. GitDealFlow's trending list is a great excuse to email a VC ('Saw this startup breaking out in your sector').",
            "Step 3: Build relationships over time. VCs invest in people they trust. Attend their portfolio events, comment thoughtfully on their posts, and stay top of mind without being pushy.",
            "Step 4: Ask for specific help. When you're ready, ask for exactly what you want: 'I'm looking at this deal — would you co-invest?' or 'I'm raising — would you take a meeting?'",
        ], [
            ("How do I get a VC's attention?", "Add value first. Share a startup they'd want to know about (GitDealFlow's trending list is perfect for this), introduce them to a founder, or offer market intel. Don't ask for anything in the first 3 interactions."),
            ("Should angels co-invest with VCs?", "Yes, when the deal terms make sense. Co-investing gives you access to deals you couldn't get alone and builds relationships with VCs who may invite you to future deals."),
            ("How do founders find the right VC?", "Research firms on their portfolio pages and recent investments. GitDealFlow's MCP server can help research a VC's portfolio and sector focus in Claude."),
        ]),
    ],

    "free": [
        ("free-startup-signal-checker", "Free Startup Signal Checker — Check Engineering Momentum", [
            "Use GitDealFlow's free startup signal checker to see engineering momentum for any venture-backed startup. See commit velocity, contributor growth, and sector ranking at no cost.",
            "Enter a startup name and get an instant signal report showing how fast the team is shipping, how their velocity compares to sector peers, and whether they're breaking out.",
            "This is the same data top VC firms use internally — now free for angels, founders, and researchers. No signup required for basic lookups.",
        ], [
            ("Is the signal checker really free?", "Yes. Basic lookups are free forever. Paid plans add watchlists, alerts, and API access."),
            ("What data does the checker show?", "Commit velocity (weekly commits), contributor count and growth, repo expansion, and a momentum score relative to sector peers."),
            ("How often is the data updated?", "Weekly. New signals appear every Monday based on the prior week's GitHub activity."),
        ]),

        ("free-vc-deal-flow-tracker", "Free VC Deal Flow Tracker Template", [
            "Download our free deal flow tracker template for Notion, Airtable, or Google Sheets. Track deals from first signal to closed investment in one organized system.",
            "The template includes columns for: startup name, sector, stage, signal source (GitDealFlow trending, referral, etc.), engineering momentum score, founder name, last contact date, next step, and outcome.",
            "Designed to work with GitDealFlow's weekly exports. Export your watchlist as CSV and paste into the tracker for instant pipeline updates.",
        ], [
            ("Which format should I use?", "Notion if you want a beautiful interface. Airtable if you want powerful filtering. Google Sheets if you want simplicity. All three work with GitDealFlow's CSV exports."),
            ("Can I customize the template?", "Yes. Add columns for your specific thesis (e.g., geography, business model, revenue range). The template is a starting point, not a constraint."),
            ("How many deals should I track?", "20-50 active at any time. More than that becomes unmanageable for solo angels. Use GitDealFlow's filters to keep your list focused."),
        ]),

        ("free-deal-flow-routine-checklist", "Free Weekly Deal Flow Routine Checklist", [
            "Download our free weekly deal flow checklist. Print it, pin it, follow it every week. Consistency is the #1 predictor of deal flow quality.",
            "Monday: Review GitDealFlow trending list (30 min). Add 5-10 startups to watchlist.",
            "Tuesday: Deep-dive 3 startups (60 min). Read GitHub, LinkedIn, press.",
            "Wednesday: Send 5 personalized outreach emails (60 min). Use MCP to draft.",
            "Thursday: Follow up on last week's outreach (30 min). Update CRM.",
            "Friday: Review watchlist momentum changes (30 min). Update pipeline.",
        ], [
            ("Is the checklist really free?", "Yes. Download the PDF, print it, share it. No email required."),
            ("How long until I see results?", "With consistent execution, you'll have a quality pipeline of 20-50 prospects in 4-8 weeks. First meetings typically start in week 2-3."),
            ("Can teams use this checklist?", "Yes. Assign Monday sourcing to one team member, Tuesday deep-dives to another, etc. Scale the routine across your firm."),
        ]),

        ("free-startup-research-template", "Free Startup Research Template for Due Diligence", [
            "Download our free startup research template for structured due diligence. Cover founders, market, traction, technology, and risks in one organized document.",
            "Sections: Founder background (LinkedIn, previous companies, references), Market size (TAM, SAM, SOM), Traction (engineering velocity from GitDealFlow, revenue, users), Technology (stack, moat, IP), Risks (competition, regulatory, execution).",
            "Designed for angels and small funds. Takes 2-4 hours per startup to complete. Use alongside GitDealFlow's signal page for engineering data.",
        ], [
            ("How long should due diligence take?", "Pre-seed: 5-10 hours over 1-2 weeks. Seed: 20-40 hours over 3-4 weeks. Series A: 60-100 hours over 4-6 weeks. Use the template to stay organized."),
            ("Should I hire a due diligence firm?", "For checks under $100K, no. The template plus your network is enough. For checks over $500K, consider specialized DD firms for tech, financial, and legal diligence."),
            ("Can the template be used for non-tech startups?", "Partially. The founder and market sections apply to any startup. The technology section is tech-focused — adapt for consumer, services, or healthcare startups."),
        ]),

        ("free-vc-outreach-email-templates", "Free VC Outreach Email Templates That Get Responses", [
            "Download our free outreach email templates for VCs, angels, and founders. These templates have been tested across thousands of sends and optimized for response rates.",
            "Template 1 (Angel to founder): 'Hi [Name], saw [Startup] trending on GitDealFlow with strong engineering momentum. Impressive commit velocity in [sector]. I focus on [thesis] and would love to learn more. Open to a 20-min call?'",
            "Template 2 (Founder to VC): 'Hi [Name], I'm building [Startup] — we're shipping [traction metric] weekly and just hit [milestone]. Saw you invest in [sector] (loved your investment in [portfolio company]). Would a deck be useful?'",
            "Template 3 (Follow-up): 'Hi [Name], following up on my note from [date]. [Startup] has since [new milestone]. Still worth connecting?'",
        ], [
            ("What response rate should I expect?", "Cold outreach: 5-15% response rate. Warm intros: 30-50%. Personalized emails referencing specific traction (like GitDealFlow momentum) get 2-3x the response of generic outreach."),
            ("How long should outreach emails be?", "Under 100 words. VCs read emails on mobile between meetings. Get to the point in the first sentence."),
            ("Should I send a deck in the first email?", "No. Ask for permission first. 'Would a deck be useful?' gets better responses than attaching a deck cold."),
        ]),

        ("free-momentum-score-calculator", "Free Engineering Momentum Score Calculator", [
            "Use our free momentum score calculator to estimate a startup's engineering momentum. Enter commit count, contributor count, and repo growth to get a normalized score.",
            "The calculator uses the same methodology as GitDealFlow's internal scoring: commit velocity weighted by recency, contributor growth trend, and repo expansion rate.",
            "For startups in GitDealFlow's database, use the signal page for the official score. This calculator is for startups not yet tracked.",
        ], [
            ("How accurate is the calculator?", "It's an approximation. For official scores, use GitDealFlow's signal page. The calculator is useful for comparing startups outside GitDealFlow's coverage."),
            ("What data do I need?", "Weekly commit count (from GitHub Insights), contributor count (from GitHub), and repo count (from GitHub org page). All public data."),
            ("Can I use this for my own startup?", "Yes. Use it to benchmark your team's velocity against sector peers. High momentum scores correlate with fundraising success."),
        ]),
    ],

    "checklists": [
        ("pre-seed-due-diligence-checklist", "Pre-Seed Due Diligence Checklist for Angels", [
            "Use this pre-seed due diligence checklist before writing a check. Pre-seed DD is about founders and trajectory, not financials. Focus on team, market, and momentum.",
            "Founder checklist: Domain expertise (deep understanding of the problem), Previous achievements (track record of execution), References (3-5 calls), Commitment (full-time, 10-year horizon), Coachability (open to feedback).",
            "Market checklist: TAM ($1B+ for venture returns), Market timing (why now?), Competition (who else is solving this?), Regulatory risk (any compliance concerns?), Customer validation (any LOIs, pilots, or paid customers?).",
            "Momentum checklist: Engineering velocity (GitDealFlow signal — top quartile for sector?), Product progress (working demo or MVP?), Hiring trajectory (growing team?), User/customer traction (any early adopters?).",
        ], [
            ("How long should pre-seed DD take?", "5-10 hours over 1-2 weeks. Don't over-analyze — pre-seed is about conviction on the team. Use the checklist to make sure you don't miss anything obvious."),
            ("What's the biggest pre-seed DD mistake?", "Overweighting market size and underweighting founder quality. Markets change; founders persist. Bet on teams that can pivot."),
            ("Should I require a working product?", "For pre-seed, no. A prototype or design is fine. For seed, yes — expect a working MVP with early users."),
        ]),

        ("seed-due-diligence-checklist", "Seed Due Diligence Checklist", [
            "Seed-stage due diligence goes deeper than pre-seed. You're evaluating traction, product-market fit signals, and the team's ability to execute. Use this checklist before writing a seed check.",
            "Product checklist: Working MVP (live product with users), User engagement (retention curves, usage frequency), Product roadmap (clear vision for next 12 months), Technical moat (proprietary tech, data, or network effects).",
            "Traction checklist: Revenue (if applicable — $10K-$100K MRR for seed), User growth (month-over-month growth rate), Customer acquisition (CAC and LTV, even if early), Engineering velocity (GitDealFlow signal — strong momentum).",
            "Team checklist: Full-time founders (all committed), Key hires (technical and commercial leads identified), Advisors (relevant domain experts), Cap table (clean, reasonable founder ownership).",
        ], [
            ("What revenue should a seed startup have?", "Varies by sector. SaaS: $10K-$50K MRR. Consumer: less revenue focus, more user growth. Developer tools: often pre-revenue at seed. Engineering velocity (GitDealFlow) matters more than revenue for technical products."),
            ("How much dilution is reasonable at seed?", "Founders should retain 70-80% post-seed. More than 25% dilution at seed is a red flag — it suggests either over-raising or weak negotiating."),
            ("Should I require customer references?", "Yes, for revenue-generating startups. Talk to 3-5 customers. Ask: 'Would you pay more?' and 'What would make you churn?'"),
        ]),

        ("deal-flow-sourcing-checklist", "Weekly Deal Flow Sourcing Checklist", [
            "Use this weekly checklist to stay disciplined about deal flow sourcing. Consistency is the #1 predictor of deal quality. Pin it, follow it every week.",
            "Monday: Review GitDealFlow trending list (30 min). Add 5-10 startups to watchlist. Skim sector momentum reports.",
            "Tuesday: Deep-dive 3 startups from Monday (60 min). Read GitHub, LinkedIn, press. Update CRM.",
            "Wednesday: Send 5 personalized outreach emails (60 min). Use MCP in Claude to draft notes referencing engineering traction.",
            "Thursday: Follow up on last week's outreach (30 min). Log all responses.",
            "Friday: Review watchlist momentum changes (30 min). Update pipeline. Plan next week.",
            "Total: 3.5 hours. Sustained for 6 months, this routine surfaces 20-50 quality deals per year.",
        ], [
            ("What if I miss a week?", "Don't panic, but don't make it a habit. Missing one week is fine; missing a month kills your pipeline. GitDealFlow's weekly digest helps you stay consistent."),
            ("Should I source on weekends?", "No. Deal flow is a relationship business. Respect founders' and VCs' time. Monday-Friday routine is sustainable; weekend work leads to burnout."),
            ("How do I know if my sourcing is working?", "Track these metrics: outreach sent per week, meetings booked per month, deals passed on per quarter, deals invested in per year. Improvement in the first three leads to improvement in the fourth."),
        ]),

        ("founder-interview-checklist", "Founder Interview Checklist for Investors", [
            "Use this checklist when interviewing startup founders. The goal is to assess founder-market fit, execution ability, and ambition in 45-60 minutes.",
            "Opening (5 min): Warm up. Ask about their background and why they started the company. Listen for passion and domain expertise.",
            "Problem and market (15 min): What problem are they solving? Who has this problem? How big is the market? Why now? Listen for specificity and customer insight.",
            "Product and traction (15 min): What have they built? What's the traction? (GitDealFlow signal for engineering velocity.) What are the next 3 milestones?",
            "Team and hiring (10 min): Who's on the team? What roles are they hiring? How do they plan to scale the team?",
            "Fundraising and terms (10 min): How much are they raising? At what terms? Use of funds? Listen for realism and alignment.",
        ], [
            ("How long should a founder interview be?", "45-60 minutes for first meetings. Shorter and you can't assess depth; longer and founders get guarded. Schedule 90 minutes for finalists."),
            ("What's the most important question to ask?", "'What's the hardest thing about what you're building?' Strong founders light up and get specific. Weak founders give generic answers."),
            ("Should I take notes during the interview?", "Yes, but sparingly. Maintain eye contact. Jot key quotes and red flags. Full notes immediately after the meeting while it's fresh."),
        ]),

        ("portfolio-monitoring-checklist", "Quarterly Portfolio Monitoring Checklist", [
            "Use this quarterly checklist to monitor your portfolio companies. Most investments fail silently — regular check-ins catch problems early.",
            "Financial health: Cash runway (12+ months ideal), Burn rate trend (rising, falling, stable), Revenue growth (if applicable), Path to profitability or next round.",
            "Product and traction: Engineering velocity (GitDealFlow signal — still strong?), User/customer growth, Retention metrics, Key product milestones shipped.",
            "Team: Key hires made, Key departures, Founder energy and morale, Hiring plan for next quarter.",
            "Market and competition: New competitors, Market shifts, Regulatory changes, Customer feedback themes.",
            "Next round: Timing of next raise, Target valuation, Existing investor sentiment, Pre-round milestones.",
        ], [
            ("How often should I check in with portfolio companies?", "Quarterly formal updates, monthly informal. Don't hover — founders need space to execute. But don't go silent either."),
            ("What's a red flag in portfolio monitoring?", "Falling engineering velocity (GitDealFlow signal drops), founder avoids tough questions, key hires departing, runway dropping below 6 months without a plan."),
            ("Should I offer help proactively?", "Yes. Introduce customers, candidates, and investors. Founders remember investors who help. GitDealFlow's MCP server can help research potential hires and customers."),
        ]),

        ("investment-memo-checklist", "Investment Memo Checklist for Angels and VCs", [
            "Every investment deserves a written memo. Writing forces clear thinking and creates a record for future reference. Use this checklist to structure your memos.",
            "Executive summary (1 paragraph): What does the company do? Why are you investing? How much at what terms?",
            "Company overview (1 page): Problem, solution, product, traction, team. Include GitDealFlow signal screenshot for engineering velocity.",
            "Market (1 page): TAM, SAM, SOM. Market timing. Competitive landscape. Why this company wins.",
            "Founders (1 page): Background, domain expertise, references, commitment. Why this team can win.",
            "Deal terms (1 page): Round size, valuation, your check size, ownership %, pro-rata rights, board seat.",
            "Risks and mitigants (1 page): What could go wrong? How is the team mitigating these risks?",
            "Conclusion: Conviction level (1-10), why you're investing or passing, conditions for follow-on.",
        ], [
            ("How long should an investment memo be?", "3-5 pages for angels, 5-10 pages for VCs. Long enough to capture key thinking, short enough to actually get written."),
            ("Should I share the memo with the founder?", "Usually not the full memo. Share key feedback in a conversation. Some VCs share the investment thesis section to align on strategy."),
            ("What if I'm passing?", "Still write the memo. Document why you passed. Review your passed deals in 12 months — this calibrates your judgment."),
        ]),

        ("term-sheet-review-checklist", "Term Sheet Review Checklist for Investors", [
            "Review every term sheet carefully before signing. Terms matter more than valuation — bad terms on a good company can still lose money. Use this checklist.",
            "Economic terms: Pre-money valuation, Post-money valuation, Option pool size and refresh, Liquidation preference (1x non-participating is standard), Pro-rata rights for follow-on.",
            "Control terms: Board composition (investor seat?), Protective provisions (veto rights), Information rights (quarterly financials, annual budget), Drag-along and tag-along rights.",
            "Founder terms: Founder vesting (4-year, 1-year cliff standard), Founder lock-up, Non-compete and IP assignment, Right to terminate founders.",
            "Investor-specific: Your ownership %, Board observer rights (if no board seat), Milestone-based tranching (avoid if possible), Anti-dilution (broad-based weighted average is standard).",
        ], [
            ("What's the most important term?", "Liquidation preference. 1x non-participating is standard and founder-friendly. Participating preferred or >1x preference shifts economics significantly toward investors."),
            ("Should I insist on a board seat?", "For checks under $1M, usually no — observer rights are enough. For larger checks or lead investor roles, yes. Board seats come with fiduciary duties and time commitments."),
            ("What's a red flag in term sheets?", "Multiple liquidation preferences, full ratchet anti-dilution, aggressive founder vesting resets, or broad veto rights. These signal either a weak company or an aggressive co-investor."),
        ]),

        ("follow-on-investment-checklist", "Follow-On Investment Checklist", [
            "Follow-on investments are where most venture returns are made. Use this checklist to decide whether to double down on a portfolio company's next round.",
            "Performance since initial investment: Did they hit the milestones from the original thesis? Engineering velocity still strong or accelerating (GitDealFlow)? Revenue/users growing as planned?",
            "Round dynamics: Is the round oversubscribed (good signal) or struggling (bad signal)? Is the lead investor credible? Is the valuation reasonable for the traction?",
            "Portfolio context: How much dry powder do you have? Is this company a top-3 portfolio candidate? What's your ownership if you follow on vs. if you don't?",
            "Conviction check: Has your conviction increased, decreased, or stayed flat since the initial investment? What would need to be true for you to pass on this follow-on?",
        ], [
            ("When should I follow on?", "When the company is executing well, your ownership is meaningful, and you have dry powder. The best follow-on candidates are top-decile performers where momentum is accelerating."),
            ("Should I always exercise pro-rata?", "No. Pro-rata is a right, not an obligation. Pass on companies that are underperforming or where the round terms are unfavorable. Reserve capital for your best performers."),
            ("How much should I reserve for follow-ons?", "50% of total capital. This lets you double down on 3-5 winners without running out of dry powder before the next vintage."),
        ]),
    ],
}

def build():
    total = 0
    for section, entries in PAGES.items():
        for entry in entries:
            slug, title, paragraphs, faqs = entry[0], entry[1], entry[2], entry[3]
            bullets = entry[4] if len(entry) > 4 else None
            desc = paragraphs[0][:155].replace('"', "'").replace("\n", " ")
            write_page(section, slug, title, desc, paragraphs, faqs, bullets)
            total += 1
        print(f"  {section}: {len(entries)} pages")
    print(f"\nTotal new pages: {total}")

if __name__ == "__main__":
    print("GitDealFlow pSEO Generator")
    print("=" * 40)
    build()
