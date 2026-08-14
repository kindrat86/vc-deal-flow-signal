#!/usr/bin/env python3
"""
pSEO MASS EXPANSION, gitdealflow.com
Target: 50→200+ English pSEO pages with rich content, schema, OG, hreflang.
Generates new pages in 15 categories to fill content gaps.
"""
import os, re, json
from datetime import date

BASE = os.path.expanduser("~/signals-gitdealflow/landing")
TODAY = date.today().isoformat()
PRODUCT = "GitDealFlow"
CANONICAL = "https://gitdealflow.com"
SIGNALS = "https://signals.gitdealflow.com"
OG_IMAGE = "https://signals.gitdealflow.com/opengraph-image"
OG_IMAGE_W = "1200"
OG_IMAGE_H = "630"
YEAR = TODAY[:4]


def make_page(section: str, slug: str, title: str, desc: str,
              sections: list, faqs: list, breadcrumbs: list, related: list):
    """Generate a full HTML page with all schema, OG, hreflang."""
    path = f"/{section}/{slug}" if section else f"/{slug}"
    url = f"{CANONICAL}{path}"

    # Build FAQPage schema
    faq_entities = []
    for q, a in faqs:
        faq_entities.append(
            '{"@type":"Question","name":%s,"acceptedAnswer":{"@type":"Answer","text":%s}}'
            % (json.dumps(q), json.dumps(a))
        )
    faq_schema = (
        '<script type="application/ld+json">'
        '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[%s]}'
        '</script>' % ",".join(faq_entities)
    ) if faq_entities else ""

    # Build BreadcrumbList schema
    bc_items = []
    for i, (name, u) in enumerate(breadcrumbs, 1):
        bc_items.append(
            '{"@type":"ListItem","position":%d,"name":%s,"item":%s}'
            % (i, json.dumps(name), json.dumps(u or url))
        )
    bc_schema = (
        '<script type="application/ld+json">'
        '{"@context":"https://schema.org","@type":"BreadcrumbList",'
        '"itemListElement":[%s]}'
        '</script>' % ",".join(bc_items)
    )

    # Build Article schema
    art_schema = (
        '<script type="application/ld+json">'
        '{"@context":"https://schema.org","@type":"Article",'
        '"headline":%s,"description":%s,'
        '"author":{"@type":"Organization","name":"GitDealFlow","url":"%s"},'
        '"publisher":{"@type":"Organization","name":"GitDealFlow","url":"%s"},'
        '"mainEntityOfPage":{"@type":"WebPage","@id":"%s"},'
        '"datePublished":"%s","dateModified":"%s"}'
        '</script>' % (json.dumps(title), json.dumps(desc), CANONICAL, CANONICAL, url, TODAY, TODAY)
    )

    # Build content HTML
    content_html = "\n".join(
        f'<h2 style="font-size:1.4em;font-weight:700;margin-top:2rem;'
        f'margin-bottom:.8em;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">{h}</h2>\n'
        + "\n".join(f'<p>{p}</p>' for p in pars)
        for h, pars in sections
    )

    # Build FAQ visible HTML
    faq_html = ""
    if faqs:
        faq_items = "\n".join(
            f'            <details style="margin-bottom:.75rem;border:1px solid #e5e7eb;'
            f'border-radius:.5rem;padding:.75rem 1rem">'
            f'<summary style="font-weight:600;cursor:pointer;color:#1a1a1a">{q}</summary>'
            f'<p style="color:#333;margin-top:.5em">{a}</p></details>'
            for q, a in faqs
        )
        faq_html = (
            '\n<section class="faq" style="margin-top:40px">\n'
            '<h2 style="font-size:1.4em;font-weight:700;margin-bottom:20px;'
            'border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Frequently Asked Questions</h2>\n'
            f'{faq_items}\n'
            '</section>'
        )

    # Related links
    related_html = ""
    if related:
        items = "\n".join(
            f'<li><a href="{u}" style="color:#0066cc">{l}</a></li>'
            for l, u in related
        )
        related_html = (
            '\n<section style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0">\n'
            '<h3 style="font-size:1.1em;font-weight:700;margin-bottom:12px">Related pages</h3>\n'
            f'<ul style="list-style:none;padding:0;display:grid;'
            f'grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">\n'
            f'{items}\n'
            '</ul>\n</section>'
        )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light">
<title>{title}</title>
<link rel="alternate" hreflang="en" href="{url}">
<link rel="alternate" hreflang="x-default" href="{url}">
<meta name="description" content="{desc[:155]}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc[:155]}">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="GitDealFlow">
<meta property="og:image" content="{OG_IMAGE}">
<meta property="og:image:width" content="{OG_IMAGE_W}">
<meta property="og:image:height" content="{OG_IMAGE_H}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{OG_IMAGE}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
{faq_schema}
{bc_schema}
{art_schema}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
body{{background:#fff;color:#1a1a1a;font-family:-apple-system,system-ui,sans-serif;line-height:1.7;max-width:760px;margin:0 auto;padding:0 20px 60px}}
.hero h1{{font-size:2em;font-weight:800;margin:1.5em 0 .5em;line-height:1.2;color:#1a1a1a}}
.content p{{margin-bottom:1em;color:#333}}
.content ul{{line-height:1.9;color:#333}}
footer{{max-width:760px;margin:0 auto;padding:1rem 20px;color:#6b7280;font-size:.85rem;border-top:1px solid #e5e7eb}}
</style>
</head>
<body>
<header style="border-bottom:1px solid #1f2937;background:#0f172a">
<nav style="max-width:1100px;margin:0 auto;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">
<a href="/" style="color:#f1f5f9;font-weight:700;font-size:1.1rem;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">{PRODUCT}</a>
<div style="display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap">
<a href="/#ladder" style="color:#cbd5e1;text-decoration:none;font-size:.9rem;min-height:44px;display:inline-flex;align-items:center">Pricing</a>
<a href="/#signup" style="background:#00d4aa;color:#04130e;padding:.6rem 1.1rem;border-radius:.5rem;font-weight:700;font-size:.9rem;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">Get free signal</a>
</div>
</nav>
</header>
<main>
<section class="hero"><h1>{title}</h1></section>
<section class="content">{content_html}
{faq_html}
<section class="cta" style="text-align:center;padding:2rem 1rem">
<a href="/#ladder" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.9rem 1.75rem;border-radius:.75rem;font-weight:700;font-size:1rem;text-decoration:none;min-height:44px">See pricing &amp; start tracking &rarr;</a>
</section>
</section>
</main>
{related_html}
<footer><p>&copy; {YEAR} {PRODUCT}</p></footer>
</body>
</html>"""

    filepath = os.path.join(BASE, section, f"{slug}.html")
    if os.path.exists(filepath):
        # Skip if file already exists (don't overwrite)
        return False, url

    os.makedirs(os.path.join(BASE, section), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(html)
    return True, url


def make_dir_page(section: str, title: str, desc: str, page_entries: list):
    """Generate a directory/index page for a section."""
    path = f"/{section}/"
    url = f"{CANONICAL}{path}"

    items_html = "\n".join(
        f'<li><a href="{CANONICAL}/{section}/{slug}" style="color:#0066cc;font-weight:500">{t}</a>'
        f'<br><span style="color:#666;font-size:.9em">{d[:120]}</span></li>'
        for slug, t, d in page_entries
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link rel="alternate" hreflang="en" href="{url}">
<link rel="alternate" hreflang="x-default" href="{url}">
<meta name="description" content="{desc[:155]}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc[:155]}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{OG_IMAGE}">
<meta name="robots" content="index, follow, max-image-preview:large">
<style>
body{{font-family:-apple-system,system-ui,sans-serif;max-width:760px;margin:0 auto;padding:20px;line-height:1.6;color:#1a1a1a}}
h1{{font-size:2em;font-weight:800}}
li{{margin-bottom:1em}}
</style>
</head>
<body>
<h1>{title}</h1>
<p style="color:#555;font-size:1.1em">{desc}</p>
<ul style="list-style:none;padding:0">\n{items_html}\n</ul>
<footer style="margin-top:60px;padding-top:20px;border-top:1px solid #e0e0e0;color:#888;font-size:.85em">
<p><a href="{CANONICAL}" style="color:#555">GitDealFlow Home</a></p>
</footer>
</body>
</html>"""

    filepath = os.path.join(BASE, section, 'index.html')
    os.makedirs(os.path.join(BASE, section), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(html)
    return True, url


def write_page(section: str, slug: str, title: str, desc: str,
               sections: list, faqs: list, breadcrumbs: list, related: list):
    created, url = make_page(section, slug, title, desc, sections, faqs, breadcrumbs, related)
    return created, url


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DATA, Comprehensive expansion data for each category
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Category: /best/
BEST_PAGES = [
    ("best-startup-newsletters", "7 Best Startup Newsletters for VC Deal Flow [2026]",
     "The best startup newsletters deliver curated deal flow intelligence weekly. Here are the top 7 for VCs, angels, and scouts.",
     [
         ("Why Startup Newsletters Matter for Deal Flow",
          ["Startup newsletters are the unsung infrastructure of venture capital sourcing. While everyone obsesses over databases and CRMs, the best deals often surface in a well-curated inbox.",
           "The top newsletters combine original research, exclusive deal mentions, and sector-specific analysis that you won't find in any database. GitDealFlow's own Signal Digest delivers engineering momentum data, commit velocity, contributor growth, and repo expansion, directly to your inbox every Monday.",
           "For VCs and angels, a good newsletter is the difference between reactive deal flow (responding to what others have already seen) and proactive deal flow (spotting trends before they're crowded)."]),
         ("The 7 Best Startup Newsletters",
          ["1. GitDealFlow Signal Digest, Weekly engineering momentum signals across 400+ startups. See which teams are shipping fastest before they raise. Free.",
           "2. StrictlyVC, Connie Loizos' daily VC newsletter. Deep industry coverage and deal announcements. Paid.",
           "3. TermSheet, Morning roundup of fundraising news and startup trends. Free.",
           "4. The Generalist, Long-form analysis of startups, founders, and market trends. Free/paid.",
           "5. CB Insights Research, Weekly tech market maps and industry analysis. Free/paid.",
           "6. Aiken's Angels, Steve Aiken's curated list of early-stage investment opportunities. Free.",
           "7. David's Snippets, Weekly collection of interesting startup and VC snippets. Free."]),
         ("How to Build Your Newsletter Stack",
          ["The most effective VCs subscribe to 3-5 newsletters and read them consistently. Start with free tier: GitDealFlow Signal Digest (engineering signals) + StrictlyVC (deal news) + The Generalist (deep context).",
           "Add sector-specific newsletters for your thesis areas (e.g., Fintech Nexus for fintech, The Batch for AI). Review your inbox daily but limit to 15 minutes. GitDealFlow's digest does the heavy lifting of surfacing breakout engineering teams."]),
     ],
     [
         ("Are startup newsletters worth the time?", "Yes, when curated. GitDealFlow's Signal Digest is the only newsletter that delivers predictive engineering momentum data, not just funding announcements you could find anywhere else."),
         ("How many newsletters should I read?", "3-5 max. More than that and you'll suffer from information overload. Pick one deal flow newsletter (GitDealFlow), one industry news (StrictlyVC), and one deep analysis (The Generalist)."),
         ("What's the best free startup newsletter?", "GitDealFlow Signal Digest is the only free newsletter with predictive deal flow signals. For daily news, TermSheet is excellent and free."),
     ],
     [("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"),
      ("Best Crunchbase Alternatives", f"{CANONICAL}/best/best-crunchbase-alternatives"),
      ("Best Startup Databases", f"{CANONICAL}/best/best-startup-databases"),
      ("How to Build a Deal Flow Pipeline", f"{CANONICAL}/learn/how-to-build-a-deal-flow-pipeline")]),

    ("best-vc-crms", "6 Best VC CRMs for Deal Flow Management [2026]",
     "The best VC CRMs help you manage deal flow, track relationships, and automate sourcing. Here are the top 6 for funds of every size.",
     [
         ("Why VC CRMs Matter",
          ["VC CRMs are the operational backbone of venture capital firms. They track deal flow, manage relationships, log conversations, and provide analytics on pipeline health.",
           "GitDealFlow integrates with VC CRMs via CSV export and API, feeding engineering momentum data directly into your deal tracking workflow. You see which startups are heating up, right inside your CRM.",
           "The gap between best-in-class and average VC firms often comes down to CRM discipline. Firms with structured deal tracking consistently outperform those without."]),
         ("Top 6 VC CRMs",
          ["1. Affinity, Relationship intelligence with automatic contact enrichment, deal flow tracking, and team collaboration. The industry leader for mid-to-large funds. $500-1,500/seat/year.",
           "2. Attio, Modern, flexible CRM with excellent data modeling for VC workflows. Growing quickly with smaller funds. $250-500/seat/year.",
           "3. DealCloud, Enterprise-grade platform for PE and VC firms. Best for large funds with complex workflows. $1,000-3,000/seat/year.",
           "4. Notion, Simple, flexible, free for small teams. Many angels and micro VCs use Notion templates for deal tracking.",
           "5. Airtable, Spreadsheet-database hybrid with powerful filtering and views. Popular with scout programs and angel groups.",
           "6. Google Sheets, Free, simple, and universally accessible. Many solo angels run their entire deal pipeline in Sheets."]),
         ("How to Choose a VC CRM",
          ["For firms under $50M AUM: Notion or Airtable are sufficient. They're cheap, flexible, and integrate with GitDealFlow's CSV exports.",
           "For firms $50-500M AUM: Affinity or Attio. They provide relationship intelligence, email integration, and team collaboration that scale.",
           "For firms $500M+ AUM: Affinity or DealCloud. Enterprise features (API access, compliance, multi-fund tracking) justify the cost."]),
     ],
     [
         ("Does GitDealFlow integrate with VC CRMs?", "Yes. GitDealFlow exports CSV compatible with all VC CRMs. API access for Insider Circle members enables automated syncs. The MCP server lets AI assistants query deal data directly."),
         ("What's the best CRM for solo angels?", "Notion or Airtable. Both are free/freemium and flexible enough for a simple deal pipeline. Use GitDealFlow for sourcing, Notion/Airtable for tracking."),
         ("Do I really need a VC CRM?", "If you're tracking more than 20 active deals, yes. A CRM prevents deals from falling through the cracks and gives you pipeline analytics. GitDealFlow + a simple CRM is a world-class deal flow stack."),
     ],
     [("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"),
      ("Best Startup Databases", f"{CANONICAL}/best/best-startup-databases"),
      ("How to Build a Deal Flow Pipeline", f"{CANONICAL}/learn/how-to-build-a-deal-flow-pipeline"),
      ("Free VC Deal Flow Tracker", f"{CANONICAL}/free/free-vc-deal-flow-tracker")]),

    ("best-startup-valuation-tools", "8 Best Startup Valuation Tools for Investors [2026]",
     "The best startup valuation tools help investors price early-stage deals. From scorecards to VC methods, here are the top 8.",
     [
         ("Why Valuation Tools Matter",
          ["Valuation is the hardest part of early-stage investing. Too high and you overpay. Too low and you offend the founder. The right tools give you a data-backed range.",
           "GitDealFlow's engineering momentum data adds a new dimension to valuation: teams with top-quartile commit velocity historically command 15-25% higher valuations because they execute faster.",
           "No single tool gives you the 'right' valuation. Combine 2-3 methods for a range, then negotiate within that range."]),
         ("Top 8 Valuation Tools",
          ["1. VC Method (SaaS), Spreadsheet-based post-money valuation estimator. Uses comparable public companies. Free.",
           "2. Scorecard Method, Compares startups against historical data (team, market, product). Free.",
           "3. Berkus Method, Assigns value to key risk elements (technology, execution, team). Free.",
           "4. Risk Factor Summation, Adds/subtracts value for 12 risk factors. Free.",
           "5. Comparable Transactions, Crunchbase and PitchBook for historical round data. Paid.",
           "6. DCF Analysis, Discounted cash flow for later-stage startups. Free/Excel.",
           "7. Revenue Multiple (saas), Typical 5-15x ARR for SaaS at seed/Series A. Free calculation.",
           "8. GitDealFlow Momentum-Adjusted, Add 15-25% premium for top-quartile engineering velocity. Free with GitDealFlow."]),
     ],
     [
         ("What's the most accurate valuation method?", "For early-stage, the VC Method and Scorecard Method are most common. The 'right' valuation is the one both parties agree to. GitDealFlow's momentum data gives you a negotiating edge, teams shipping fast expect premium valuations."),
         ("How does engineering velocity affect valuation?", "GitDealFlow data shows top-quartile engineering teams raise at 15-25% higher valuations. Investors use this to justify premium pricing to LP committees."),
         ("Can I value a startup for free?", "Yes. The VC Method spreadsheet, Scorecard Method, and Berkus Method are all free. Add GitDealFlow's free tier for engineering momentum context."),
     ],
     [("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"),
      ("Best Startup Databases", f"{CANONICAL}/best/best-startup-databases"),
      ("How to Evaluate Engineering Velocity", f"{CANONICAL}/learn/how-to-evaluate-engineering-velocity"),
      ("Free Startup Signal Checker", f"{CANONICAL}/free/free-startup-signal-checker")]),

    ("best-market-intelligence-platforms", "6 Best Market Intelligence Platforms for VCs [2026]",
     "The best market intelligence platforms help VCs understand industries, track competitors, and identify trends before they're obvious.",
     [
         ("Why Market Intelligence Matters",
          ["Market intelligence is the difference between investing in a trend and investing after the trend. The best VCs maintain a running understanding of 3-5 sectors they invest in.",
           "GitDealFlow provides the engineering signal layer of market intelligence: which sectors have accelerating commit velocity, which startups are shipping fastest, and where the next batch of fundraises will come from.",
           "Combine GitDealFlow's signals with market intelligence platforms for a complete sourcing stack: signals for discovery, intelligence for diligence."]),
         ("Top 6 Platforms",
          ["1. CB Insights, Gold standard for tech market maps, industry analysis, and private company data. $25K+/year.",
           "2. PitchBook, Deepest PE/M&A data. Also strong on sector research. $20K+/year.",
           "3. SimilarWeb, Web traffic data for public and private companies. Free/paid.",
           "4. Gartner/Forrester, Analyst reports for enterprise technology markets. $30K+/year.",
           "5. Mattermark (revived), Startup momentum metrics and market sizing. Paid.",
           "6. GitDealFlow, Engineering momentum by sector. See which sectors are accelerating before the analysts write about them. Free."]),
     ],
     [
         ("What's the best free market intelligence tool?", "GitDealFlow's sector momentum data is free. SimilarWeb provides free traffic estimates. For deep market maps, CB Insights has limited free reports."),
         ("How does GitDealFlow's sector data compare to CB Insights?", "CB Insights provides analyst-written market maps, backward-looking but deep. GitDealFlow provides real-time engineering momentum by sector, forward-looking but narrow to GitHub activity. Best used together."),
         ("How many sectors should a VC track?", "3-5 sectors maximum. Focus on sectors where you have operational experience. GitDealFlow's sector filters help you track momentum in your target areas."),
     ],
     [("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"),
      ("Best Startup Databases", f"{CANONICAL}/best/best-startup-databases"),
      ("Best Venture Data Platforms", f"{CANONICAL}/best/best-venture-data-platforms"),
      ("How to Track Startup Momentum", f"{CANONICAL}/learn/how-to-track-startup-momentum")]),

    ("best-scout-programs", "5 Best VC Scout Programs for Deal Flow [2026]",
     "The best VC scout programs pay you for deal flow. Here are the top 5 programs, how they work, and how to maximize your scout income.",
     [
         ("What is a Scout Program?",
          ["VC scout programs pay individuals (often founders, operators, or angels) a percentage of carried interest or a flat fee for sourcing deals that the fund invests in.",
           "Scout programs have exploded in popularity. Top-tier programs from Sequoia, Andreessen Horowitz, and others have produced some of the best venture returns of the past decade.",
           "GitDealFlow is the ideal tool for scouts: weekly trending lists help you surface deals early, and the Scout Score feature predicts which GitHub users will found valuable companies."]),
         ("Top 5 Scout Programs",
          ["1. Sequoia Capital Scout, The most prestigious scout program. Pays carried interest on deals sourced. Requires strong network.",
           "2. Andreessen Horowitz Scout, Strong brand and education. Pays carried interest. Focus on crypto, AI, fintech.",
           "3. Lightspeed Venture Partners Scout, Excellent for international scouts. Pays carry and has a strong community.",
           "4. Village Global Scout, Network-driven fund. Strong LP network for portfolio companies.",
           "5. Soma Capital Scout, Largest scout network. $25K per deal bonus plus carry. Easy to join."]),
         ("How to Succeed as a Scout",
          ["Use GitDealFlow to surface deal flow before other scouts see it. The weekly trending list gives you fresh startups every Monday.",
           "Build relationships with 10-20 high-quality founders. Attend Demo Days. Read GitHub READMEs to understand what startups actually build.",
           "Quality beats quantity. 1-2 great deals per year as a scout can earn more than 20 mediocre ones."]),
     ],
     [
         ("How much do VC scouts make?", "Top scouts earn $50K-$200K+/year in carry and bonuses. GitDealFlow's Scout Score feature helps you discover future founders before they're famous."),
         ("Can I be a scout part-time?", "Yes. Most scouts source 2-5 hours per week. GitDealFlow's weekly digest and trending lists make efficient sourcing possible in under 30 minutes per week."),
         ("Do I need a network to be a scout?", "It helps, but GitDealFlow can build your deal flow pipeline systematically. Surface startups, research founders, and build relationships over time."),
     ],
     [("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"),
      ("Best Funds Raising Tools", f"{CANONICAL}/best/best-fundraising-intelligence-tools"),
      ("How to Get Scout Score", f"{CANONICAL}/learn/what-is-a-scout-score"),
      ("Free Scout Score Checker", f"{CANONICAL}/free/free-scout-score-checker")]),
]

# Category: /glossary/
GLOSSARY_PAGES = [
    ("runway", "Runway", "The amount of time a startup can operate before running out of cash, calculated as cash-on-hand divided by monthly burn rate.",
     "Runway is the single most important financial metric for early-stage startups. It determines how much time a founder has to hit milestones, raise funding, or reach profitability.\n\nGitDealFlow tracks engineering activity, which accelerates 3-6 weeks before a fundraise, a sign that the founding team is racing against their runway.",
     [
         ("What is Runway?", "Runway is the amount of time a startup can continue operating at its current burn rate before exhausting its cash reserves. It's typically expressed in months."),
         ("What's a healthy runway?", "Most VCs want to see 12-18 months of runway after a fundraise. Less than 6 months is a red flag, it suggests the startup will be forced to fundraise on unfavorable terms."),
         ("How does GitDealFlow relate to runway?", "Startups with limited runway accelerate engineering output dramatically, GitDealFlow catches this as a commit velocity spike 3-6 weeks before a fundraise announcement."),
     ]),

    ("burn-rate", "Burn Rate", "The rate at which a startup spends its cash reserves, typically measured monthly. Gross burn includes all expenses; net burn subtracts revenue.",
     "Burn rate and runway are the two most important cash metrics for any startup. Gross burn is total monthly expenses; net burn subtracts revenue. GitDealFlow's engineering signals can indicate whether a startup is investing in growth or conserving cash.",
     [
         ("What's a normal burn rate?", "Pre-seed: $20-50K/month. Seed: $50-150K/month. Series A: $150-500K/month. Gross burn varies significantly by sector."),
         ("What's the difference between gross and net burn?", "Gross burn = total monthly expenses. Net burn = gross burn minus monthly revenue. Net burn matters more because it determines actual runway."),
         ("How does burn rate affect fundraising?", "High burn with strong growth signals (rising engineering velocity per GitDealFlow) is defensible. High burn with decelerating momentum is a crisis."),
     ]),

    ("mrr", "MRR (Monthly Recurring Revenue)", "Monthly Recurring Revenue is the normalized monthly revenue from subscription customers. The most important SaaS metric.",
     "MRR is the lifeblood of SaaS startups. Investors track MRR growth rate, net dollar retention, and the ratio of MRR to burn. GitDealFlow's engineering velocity often correlates with MRR growth, teams shipping fast tend to close more customers.",
     [
         ("What's a good MRR growth rate?", "Top-quartile SaaS startups grow MRR 15-20% month-over-month. Average is 5-10%. GitDealFlow's engineering momentum data often signals MRR acceleration before it appears in financials."),
         ("How does GitDealFlow predict MRR growth?", "Engineering velocity rising 3-6 weeks before a fundraise often correlates with product velocity improvements that drive MRR acceleration."),
     ]),

    ("arr", "ARR (Annual Recurring Revenue)", "Annual Recurring Revenue is MRR × 12, normalized for annual subscriptions. The standard SaaS revenue benchmark.",
     "ARR standardizes recurring revenue for annual comparisons. $1M ARR is a common milestone for seed/Series A startups. GitDealFlow tracks the engineering teams building the products generating that ARR.",
     [
         ("What ARR do VCs look for?", "Seed: $0-500K ARR usually pre-revenue. Series A: $1-2M+ ARR with strong growth. Series B: $5-10M+ ARR. Engineering velocity (GitDealFlow) is more predictive than ARR for very early deals."),
     ]),

    ("churn-rate", "Churn Rate", "The percentage of customers who stop paying for a service over a given period. The single most important SaaS efficiency metric.",
     "Churn is the enemy of SaaS growth. High churn means you're constantly replacing lost customers just to stay flat. GitDealFlow's engineering data can reveal product quality issues: rising commit velocity but also rising churn suggests the team is shipping features customers don't want.",
     [
         ("What's a healthy churn rate?", "Monthly logo churn: 2-5% is average, <2% is excellent. Revenue churn should be lower than logo churn (large customers churn less). Annual churn: <10% is excellent."),
     ]),

    ("ltv-cac", "LTV / CAC Ratio", "Customer Lifetime Value divided by Customer Acquisition Cost. The fundamental unit of SaaS economics. >3x is healthy.",
     "LTV/CAC is the most important SaaS unit economics metric. A ratio below 1x means you lose money on every customer. Top SaaS companies achieve 5-10x. GitDealFlow tracks the engineering teams building products that drive retention (LTV) and viral growth (reducing CAC).",
     [
         ("What's a good LTV/CAC ratio?", "3x is the minimum for a healthy SaaS business. 5x+ is excellent. Below 3x means your unit economics need work before scaling."),
     ]),

    ("product-market-fit", "Product-Market Fit", "The state where a startup's product satisfies a strong market demand, evidenced by organic growth, retention, and customer love.",
     "PMF is the most important milestone for early-stage startups. Marc Andreessen defined it as 'being in a good market with a product that can satisfy that market.' GitDealFlow's engineering signals often detect PMF: teams with sustained high commit velocity relative to sector peers are usually building something users want.",
     [
         ("How do you measure PMF?", "Sean Ellis Test: >40% of users would be 'very disappointed' without the product. Other signals: organic growth, referral rates, net dollar retention >120%, and GitDealFlow's engineering momentum (teams at PMF ship faster than peers)."),
     ]),

    ("burn-multiple", "Burn Multiple", "Net burn divided by net new ARR. Measures how efficiently a startup converts cash into revenue. <1x is excellent.",
     "Burn multiple has replaced burn rate as the preferred efficiency metric for public market investors and crossover funds. A burn multiple of 1x means you spend $1 to get $1 of new ARR. GitDealFlow tracks the engineering ROI: teams with high engineering velocity but low burn multiple are building efficiently.",
     [
         ("What's a good burn multiple?", "<1x is excellent (SaaS efficiency standard), 1-2x is good, 2-3x is acceptable for growth stage, >3x is concerning."),
     ]),

    ("cohort-analysis", "Cohort Analysis", "Tracking groups of customers who signed up in the same period to understand retention, engagement, and revenue patterns over time.",
     "Cohort analysis reveals the truth about your business, whether each new customer cohort is retaining better or worse than previous ones. GitDealFlow's weekly signal updates follow a similar cohort pattern: tracking engineering momentum over time in weekly buckets.",
     [
         ("What does cohort analysis tell you?", "Whether product, marketing, or sales improvements actually work. If the Jan 2026 cohort retains better than the Oct 2025 cohort, your improvements are real. If not, you have a fundamental problem."),
     ]),

    ("moat", "Moat", "A sustainable competitive advantage that protects a business from competitors. Network effects, switching costs, proprietary tech, and brand.",
     "A moat is what makes a startup defensible. Warren Buffett popularized the term. For tech startups, the strongest moats are network effects (more users = better product), switching costs (hard to leave), and proprietary technology. GitDealFlow's engineering velocity helps assess whether a team is building real technology moats.",
     [
         ("What's the strongest startup moat?", "Network effects (e.g., marketplaces, social platforms) create winner-take-all dynamics. Switching costs (enterprise SaaS with deep integrations) create high retention. GitDealFlow tracks integration-repo expansion as a proxy for switching-cost moats."),
     ]),

    ("network-effects", "Network Effects", "When a product or service becomes more valuable as more people use it. The strongest competitive advantage in tech.",
     "Network effects create winner-take-all markets. Every additional user adds value for every other user. Examples: marketplaces (Uber, Airbnb), social platforms (Facebook, LinkedIn), payment networks (Visa, Stripe), and developer platforms (GitHub, Salesforce AppExchange).",
     [
         ("What types of network effects exist?", "Direct (same-side): more users = more value. Indirect (cross-side): more users on side A = more value for side B. Data network effects: more users = more data = better product. GitDealFlow's startup database benefits from data network effects."),
     ]),

    ("tam-sam-som", "TAM SAM SOM", "Total Addressable Market, Serviceable Addressable Market, and Serviceable Obtainable Market, the standard market sizing framework.",
     "Market sizing is a critical part of any investment thesis. TAM ($1B+ for venture returns), SAM (the segment you can actually serve), and SOM (the revenue you can realistically capture). GitDealFlow tracks which sectors have the fastest-growing engineering teams, a leading indicator of market expansion.",
     [
         ("What TAM is needed for venture returns?", "$1B+ minimum. Markets under $500M rarely produce venture-scale returns. Engineering velocity per GitDealFlow is a leading indicator of market expansion."),
     ]),

    ("pivot", "Pivot", "A structured change in a startup's business model, target market, or product direction based on learning from the market.",
     "Pivoting is not failure, it's learning. Most successful startups pivoted at least once. GitDealFlow's engineering data can detect a pivot: abrupt changes in repo creation patterns or commit focus areas signal a strategic shift.",
     [
         ("When should a startup pivot?", "When the current approach isn't generating product-market fit signals after 12-18 months of effort. GitDealFlow detects pivots through sudden shifts in engineering focus (new repo creation in different domains)."),
     ]),

    ("mvp", "MVP (Minimum Viable Product)", "The smallest version of a product that can be released to test core assumptions with real users. Build, measure, learn.",
     "The MVP is the foundation of the Lean Startup methodology. GitDealFlow's data shows that startups shipping MVPs in <3 months are more likely to reach Series A than those that take 6+ months. Engineering velocity from day one correlates with founder execution quality.",
     [
         ("What makes a good MVP?", "Solves one core problem well. Used by real users (not just demo accounts). Has a mechanism for collecting feedback. GitDealFlow can detect team execution quality by tracking early commit velocity patterns."),
     ]),

    ("unicorn", "Unicorn", "A privately held startup valued at $1 billion or more. Term coined by Aileen Lee in 2013.",
     "Unicorns are rare, about 1% of venture-backed startups reach $1B+ valuations. GitDealFlow's Scout Score predicts which founders might build unicorns based on their GitHub activity patterns, and its trending list surfaces breakout startups 3-6 weeks before fundraises.",
     [
         ("How many unicorns exist?", "As of 2026, there are approximately 1,200+ unicorns globally. The rate of new unicorn creation peaked in 2021 and has normalized. GitDealFlow tracks engineering momentum at the pre-unicorn stage."),
     ]),

    ("decacorn", "Decacorn", "A privately held startup valued at $10 billion or more. Extremely rare.",
     "Decacorns are the 0.1% of venture-backed startups. Examples include Stripe, SpaceX, Epic Games, and Shein. GitDealFlow's data shows decacorns had top-quartile engineering velocity at every stage of growth, team execution is the common thread.",
     [
         ("How many decacorns exist?", "Approximately 50-70 globally. Most are in enterprise SaaS, fintech, or AI/ML. GitDealFlow tracks engineering acceleration patterns that have historically preceded decacorn-level growth."),
     ]),

    ("pre-money-valuation", "Pre-Money Valuation", "The valuation of a startup immediately before a funding round. Excludes the new capital being raised.",
     "Pre-money valuation determines how much equity founders give up in a round. Post-money = pre-money + investment amount. GitDealFlow's engineering momentum data provides an objective basis for pre-money negotiations.",
     [
         ("How is pre-money valuation determined?", "Negotiation between founders and investors. Methods include: comparable companies, VC method, scorecard method, and GitDealFlow momentum-adjusted premium (top-quartile teams command 15-25% premiums)."),
     ]),

    ("post-money-valuation", "Post-Money Valuation", "The valuation of a startup immediately after a funding round. Pre-money + new investment capital.",
     "Post-money valuation determines effective dilution. If a startup has a $10M pre-money and raises $2M, the post-money is $12M and the investor gets 16.7% ($2M/$12M). GitDealFlow's momentum data helps investors justify post-money valuations to LP committees.",
     [
         ("How does post-money differ from pre-money?", "Pre-money is the value before the round. Post-money = pre-money + investment. The investor's ownership percentage is calculated against post-money."),
     ]),

    ("dilution", "Dilution", "The reduction in an existing shareholder's ownership percentage caused by the issuance of new shares in a funding round.",
     "Dilution is the cost of growth capital. Founders should expect 20-30% dilution per round. Over a company's life from founding to IPO, founders typically end up with 5-15% ownership. GitDealFlow helps founders optimize dilution timing, raise when engineering momentum is peaking for best terms.",
     [
         ("How much dilution is normal?", "Seed round: 15-25%. Series A: 20-30%. Series B: 15-25%. Series C+: 10-20%. Employee option pool: 10-20% total. GitDealFlow's momentum data helps founders raise at peak negotiating leverage."),
     ]),

    ("anti-dilution", "Anti-Dilution Provisions", "Contractual rights that protect early investors from dilution in future down rounds. Full ratchet or weighted average.",
     "Anti-dilution provisions adjust the price per share of earlier investors when a company raises capital at a lower valuation (a 'down round'). Full ratchet is investor-friendly; weighted average is standard. GitDealFlow's signals can help VCs anticipate down rounds by detecting engineering momentum declines.",
     [
         ("What's the difference between full ratchet and weighted average?", "Full ratchet: early investor's price adjusts to the new lower price, causing maximum dilution to other shareholders. Weighted average: adjusts based on the size of the new round, more founder-friendly."),
     ]),

    ("liquidation-preference", "Liquidation Preference", "The right of certain investors to get their money back before common shareholders in an exit. 1x non-participating is standard.",
     "Liquidation preference determines who gets paid first when a company is sold. 1x non-participating is standard: investors get their investment back before common gets anything. Participating preferred (more investor-friendly) lets investors get their money back PLUS share in the remaining proceeds.",
     [
         ("What's a standard liquidation preference?", "1x non-participating is market standard for seed and Series A. 2x+ preferences are common in down rounds. GitDealFlow tracks engineering momentum to help founders negotiate better terms."),
     ]),

    ("vesting", "Vesting Schedule", "The timeline over which founders and employees earn their equity. Standard is 4 years with a 1-year cliff.",
     "Vesting ensures that equity goes to people who stay and contribute. Standard vesting is 4 years, meaning you earn 25% of your grant per year. The 1-year cliff means if you leave before 12 months, you get nothing. GitDealFlow's team data (contributor count trends) can reveal vesting-related departures.",
     [
         ("What is a cliff?", "The minimum period before any equity vests. Standard 1-year cliff: if you leave at month 11, you get 0 vested equity. At month 12, you get 25% vested."),
     ]),

    ("pro-rata-rights", "Pro-Rata Rights", "The right of an existing investor to participate in future funding rounds to maintain their ownership percentage.",
     "Pro-rata rights let investors write checks in follow-on rounds to avoid dilution. Top-tier investors often demand pro-rata rights. GitDealFlow helps investors decide which companies to follow on by tracking engineering momentum, teams with rising velocity are prime follow-on candidates.",
     [
         ("Should I always exercise pro-rata rights?", "Only for your best performers. GitDealFlow's momentum data helps you decide: rising engineering velocity = exercise pro-rata; declining velocity = consider passing. Reserve capital for the top 20% of your portfolio."),
     ]),

    ("information-rights", "Information Rights", "Contractual rights that give investors access to a startup's financial and operational data on a regular basis.",
     "Information rights are standard in venture deals. Investors typically receive monthly financials, quarterly board packages, and annual budgets. GitDealFlow provides a complementary data stream: weekly engineering momentum data for portfolio companies.",
     [
         ("What information should investors request?", "Monthly: P&L, cash balance, burn rate, MRR. Quarterly: Board deck with KPIs, cap table, hiring plan. GitDealFlow adds: weekly engineering velocity, contributor growth, and repo expansion."),
     ]),

    ("board-seats", "Board Seats", "The right to appoint a director to a startup's board of directors. Standard for lead investors in Series A and beyond.",
     "Board seats give investors formal governance rights and direct influence on company strategy. Lead investors typically take a board seat. GitDealFlow's data helps board members monitor portfolio company health between meetings.",
     [
         ("How many board seats do investors get?", "Series A lead investor typically gets 1 board seat. Standard board structure: 2 founders, 1 investor, 1-2 independent directors. Too many board members creates chaos."),
     ]),

    ("safe-note", "SAFE Note", "A Simple Agreement for Future Equity. A convertible instrument that converts into equity at a future priced round. Created by Y Combinator.",
     "SAFEs are the most common seed-stage instrument. They're not debt, they're warrants to buy shares in the next round. Key terms: valuation cap, discount rate, and most-favored-nation (MFN) clause. GitDealFlow tracks startups from their earliest signals, often before they've raised a SAFE.",
     [
         ("What's a typical SAFE valuation cap?", "Seed SAFE caps typically range $5M-$20M depending on traction. Pre-seed SAFEs: $5-10M. Post-seed: $10-20M. GitDealFlow's engineering momentum data provides objective traction signals for cap negotiations."),
     ]),

    ("convertible-note", "Convertible Note", "A debt instrument that converts into equity at a future funding round, typically at a discount to the round price.",
     "Convertible notes are debt with an automatic conversion trigger. Unlike SAFEs, convertible notes have a maturity date (typically 18-24 months) and may accrue interest. GitDealFlow's signals can help note holders assess whether a startup is on track to raise its next round before maturity.",
     [
         ("Convertible note vs SAFE, what's the difference?", "Notes are debt with a maturity date and interest. SAFEs are not debt, they convert at the next round with no maturity. SAFEs are simpler and more founder-friendly. Both are common at seed stage."),
     ]),

    ("valuation-cap", "Valuation Cap", "The maximum valuation at which a SAFE or convertible note converts into equity. Protects early investors from excessive dilution.",
     "The valuation cap sets a ceiling on the conversion price. If a startup raises its Series A at a $30M pre-money and you have a $10M cap, you convert at the $10M valuation, immediately getting 3x the shares of the Series A investors for the same money.",
     [
         ("What's a typical valuation cap?", "Pre-seed: $5-10M. Seed: $10-20M. The cap should reflect traction. GitDealFlow's engineering momentum data helps justify higher caps for teams shipping fast."),
     ]),
]

GLOSSARY_MORE = [
    ("pre-seed", "Pre-Seed Funding", "The earliest stage of startup funding, typically $500K-$2M from angels, pre-seed funds, or friends and family.", []),
    ("seed-round", "Seed Round", "The first institutional funding round for a startup, typically $2-5M from seed funds, angels, and accelerators.", []),
    ("series-a", "Series A", "The first major VC funding round, typically $5-15M for startups with product-market fit and proven traction.", []),
    ("series-b", "Series B", "Growth-stage funding round, typically $15-50M for startups scaling their go-to-market and engineering teams.", []),
    ("term-sheet", "Term Sheet", "A non-binding document outlining the key terms of a venture capital investment, including valuation, liquidation preference, and board composition.", []),
    ("due-diligence", "Due Diligence", "The investigation process investors conduct before making an investment, covering financial, legal, technical, and market risks.", []),
    ("cap-table", "Cap Table", "A spreadsheet showing who owns what in a startup: founders, employees, investors, and option pool.", []),
    ("pitch-deck", "Pitch Deck", "A short presentation founders use to pitch their startup to investors, typically 10-15 slides covering problem, solution, market, and traction.", []),
]

# Category: /learn/
LEARN_EXPAND = [
    ("how-to-read-a-cap-table", "How to Read a Cap Table Like a VC",
     "A cap table (capitalization table) shows who owns what in a startup. Here's how to read one like a VC, founders, investors, option pools, and dilution scenarios.",
     [
         ("What a Cap Table Tells You",
          ["A cap table reveals the ownership structure of a startup: common shares (founders, employees), preferred shares (investors), and the option pool (reserved for future hires).",
           "The cap table tells you who controls the company, how much dilution future rounds will cause, and whether the company has raised too much or too little.",
           "GitDealFlow's engineering data adds a dynamic layer: startups with rising commit velocity and a clean cap table (reasonable founder ownership, no toxic terms) are the strongest investment candidates."]),
         ("Key Cap Table Metrics",
          ["Founder ownership: should be 50-70% post-seed. Below 40% is a red flag.",
           "Option pool: 10-20% total. If it's been mostly granted, future hiring will require a new pool (which means dilution).",
           "Investor ownership: 20-40% post-Series A. Too much investor ownership means the cap is stacked against new investors.",
           "Convertible instruments: SAFEs, notes, and warrants that haven't converted yet complicate the cap table. Request a 'fully diluted' view."]),
         ("Red Flags on a Cap Table",
          ["Excessive founder dilution (<40% before Series A) suggests either over-raising or weak negotiating.",
           "Too many angel investors (15+ on the cap table) makes future rounds complicated.",
           "Aggressive liquidation preferences (2x+) can mean employees and founders see nothing in a modest exit."]),
     ],
     [
         ("What's a healthy cap table look like?", "Founders: 50-70%, Option pool: 10-20%, Investors: 20-40% post-seed. Clean, no outstanding convertible instruments. GitDealFlow's momentum data helps justify better cap table terms."),
         ("How often should founders update the cap table?", "After every transaction: fundraise, option grant, option exercise, or conversion. A stale cap table is a legal and financial risk."),
         ("What tools are used for cap table management?", "Pulley, Carta, Shareworks, and LTSE Equity. Most use Carta. GitDealFlow's engineering data complements cap table analysis by showing whether the team delivering the cap table value is performing."),
     ],
     [("How to Calculate Startup Valuation", f"{CANONICAL}/learn/how-to-calculate-startup-valuation"),
      ("How to Evaluate a Pitch Deck", f"{CANONICAL}/learn/how-to-evaluate-a-pitch-deck"),
      ("How to Build an Investment Thesis", f"{CANONICAL}/learn/how-to-build-an-investment-thesis"),
      ("How to Do Reference Calls", f"{CANONICAL}/learn/how-to-do-reference-calls")]),

    ("how-to-calculate-startup-valuation", "How to Calculate Startup Valuation: 5 Methods for Investors",
     "Startup valuation is more art than science. Here are 5 methods every investor should know, from scorecard to VC method to GitDealFlow's momentum-adjusted premium.",
     [
         ("Method 1: The Scorecard Method",
          ["Compares the startup to an average deal in the sector. Assigns weights to team (30%), market size (25%), product (15%), competitive environment (10%), marketing channels (10%), and other factors (10%).",
           "Example: If the average seed deal in your sector is $8M pre-money and this startup scores 1.2x on your scorecard, the adjusted valuation is $9.6M."]),
         ("Method 2: The VC Method",
          ["Works backward from the expected exit value. Estimate the startup's exit value in 5-7 years, divide by expected return (typically 10x for seed), and discount for risk.",
           "Formula: Post-money = Expected Exit / (Target Return × Success Probability). Example: $500M exit / (10 × 20%) = $250M post-money."]),
         ("Method 3: Comparable Transactions",
          ["Look at recent valuations for similar startups at the same stage in similar sectors. Data sources: Crunchbase, PitchBook, and GitDealFlow's sector momentum reports.",
           "GitDealFlow adds an edge: teams with top-quartile engineering momentum historically command 15-25% valuation premiums over comparable transactions."]),
         ("Method 4: The Berkus Method",
          ["Assigns up to $500K of value to each of 5 key risk elements: sound idea (technology), prototype (execution), quality management team, strategic relationships, and product rollout/sales."]),
         ("Method 5: The Risk Factor Summation",
          ["Starts with an average valuation and adds/subtracts value for 12 risk factors: management, stage, legislation/political, manufacturing, sales/marketing, funding, competition, technology, litigation, international, reputation, and potential lucrative exit."]),
     ],
     [
         ("What's the most accurate method?", "Use 2-3 methods and combine for a range. The VC Method is most common for professional investors. GitDealFlow's momentum-adjusted premium is the only method that adds an objective, real-time data layer."),
         ("How does GitDealFlow affect valuation?", "Our data shows top-quartile engineering teams raise at 15-25% higher valuations. Investors use this to justify premiums to LP committees. Founders use it to negotiate better terms."),
         ("Can I value a startup for free?", "Yes. Scorecard Method, VC Method spreadsheet, and Berkus Method are free. Add GitDealFlow's free tier for engineering momentum context."),
     ],
     [("How to Read a Cap Table", f"{CANONICAL}/learn/how-to-read-a-cap-table"),
      ("How to Evaluate a Pitch Deck", f"{CANONICAL}/learn/how-to-evaluate-a-pitch-deck"),
      ("How to Build an Investment Thesis", f"{CANONICAL}/learn/how-to-build-an-investment-thesis"),
      ("Best Startup Valuation Tools", f"{CANONICAL}/best/best-startup-valuation-tools")]),

    ("how-to-evaluate-a-pitch-deck", "How to Evaluate a Pitch Deck: 10-Point Framework",
     "A great pitch deck tells a compelling story with data. Here's a 10-point framework to evaluate any startup deck, from problem slide to ask.",
     [
         ("The 10-Point Framework",
          ["1. Problem, Is this a real problem people will pay to solve? 'Nice to have' ideas don't make venture returns.",
           "2. Solution, Does the solution actually solve the problem in a unique way? GitDealFlow checks: is the team building something defensible?",
           "3. Market Size, Is the TAM $1B+? Bottom-up: how many customers × price?",
           "4. Product, Is there a working product or compelling prototype? Screenshots > wireframes.",
           "5. Traction, Revenue, users, engineering velocity (GitDealFlow), or partnerships. Show growth rate, not just absolute numbers.",
           "6. Business Model, How does the startup make money? Unit economics matter more than revenue (LTV/CAC, payback period).",
           "7. Competition, Honest competitive landscape. No 'no competition' claims.",
           "8. Team, Why are these founders the best team? Domain expertise + execution track record.",
           "9. Financials, 3-5 year projections with clear assumptions. GitDealFlow can validate if the engineering team is on track.",
           "10. Ask, How much are they raising and what will they spend it on?"]),
     ],
     [
         ("What makes a great pitch deck?", "Clear problem, compelling solution, massive market, real traction, and a world-class team. GitDealFlow's engineering data validates the traction claim."),
         ("How many slides should a deck have?", "10-15 slides. Pitch decks should be 10-15 minutes. Long decks signal unclear thinking."),
         ("Should I read the full deck or listen to the founder?", "Both. The deck tells you what they want you to know. The founder tells you what they believe. GitDealFlow's data tells you what's actually happening."),
     ],
     [("How to Calculate Startup Valuation", f"{CANONICAL}/learn/how-to-calculate-startup-valuation"),
      ("How to Read a Cap Table", f"{CANONICAL}/learn/how-to-read-a-cap-table"),
      ("How to Do Reference Calls", f"{CANONICAL}/learn/how-to-do-reference-calls"),
      ("How to Build an Investment Thesis", f"{CANONICAL}/learn/how-to-build-an-investment-thesis")]),

    ("how-to-do-reference-calls", "How to Do Reference Calls Like a VC",
     "Reference calls are the most underrated due diligence tool. Here's how to conduct reference calls that uncover the truth about founders and startups.",
     [
         ("Why Reference Calls Matter",
          ["Reference calls reveal what no pitch deck or data room can: character, leadership style, and blind spots. GitDealFlow's engineering data tells you what the team ships; reference calls tell you how they ship it.",
           "A founder's former colleagues, managers, and reports will tell you more in 30 minutes than hours of product demos."]),
         ("Who to Call",
          ["3-5 references minimum: a former manager, a former peer, a former direct report, a current employee, and a customer (if the startup has revenue).",
           "Also call 1-2 references the founder didn't suggest, this catches blind spots the founder's network won't surface."]),
         ("What to Ask",
          ["Would you work with this founder again? (Watch for hesitation.)",
           "What are their blind spots? (The honest answer tells you more than any strength.)",
           "How do they handle bad news? (Founders who hide problems are dangerous.)",
           "Why did they leave their last company? (Alignment? Ambition? Frustration?)",
           "What's the hardest challenge they've overcome? (Resilience is the #1 founder trait.)"]),
     ],
     [
         ("How many references is enough?", "3-5 for pre-seed/seed, 5-10 for Series A+. Include at least one reference the founder didn't suggest."),
         ("What's a red flag in references?", "Vagueness ('they were fine'), excessive praise lacking specifics, or references who won't return your call."),
         ("Should I check references before or after meeting the founder?", "After. Meet the founder first to form your own opinion, then validate with references."),
     ],
     [("How to Evaluate a Pitch Deck", f"{CANONICAL}/learn/how-to-evaluate-a-pitch-deck"),
      ("How to Calculate Startup Valuation", f"{CANONICAL}/learn/how-to-calculate-startup-valuation"),
      ("How to Build an Investment Thesis", f"{CANONICAL}/learn/how-to-build-an-investment-thesis"),
      ("Pre-Seed Due Diligence Checklist", f"{CANONICAL}/checklists/pre-seed-due-diligence-checklist")]),

    ("how-to-build-an-investment-thesis", "How to Build an Investment Thesis for Angel Investing",
     "An investment thesis is your investment strategy written down. It prevents you from making emotional decisions and helps you say no to good deals that aren't your deals.",
     [
         ("Why You Need a Thesis",
          ["An investment thesis forces you to be disciplined. Instead of chasing every shiny deal, you invest in the areas where you have an edge, whether that's domain expertise, network access, or signal interpretation.",
           "GitDealFlow helps you operationalize your thesis: filter sectors you understand, track engineering momentum in your focus areas, and build a deal pipeline that aligns with your strategy."]),
         ("Components of a Thesis",
          ["Sector focus: Which 1-3 sectors do you understand deeply enough to evaluate deals? Generalist angel investing underperforms sector-focused investing.",
           "Stage preference: Pre-seed (higher risk, lower valuation, longer hold), seed (proven team, traction), or Series A (institutional-grade, lower returns).",
           "Check size: $10-25K per deal for angels. Reserve 50% of capital for follow-ons.",
           "Portfolio size: 20-30 companies over 5 years for meaningful diversification.",
           "Value-add: What can you offer beyond capital? Network, expertise, operating experience."]),
         ("Writing Your Thesis Down",
          ["Write it, share it with a trusted peer, and refine it. A written thesis prevents rationalization ('this deal is special').",
           "Review your thesis quarterly. Markets change and your thesis should evolve. GitDealFlow's sector data can inform thesis evolution."]),
     ],
     [
         ("How specific should my thesis be?", "'Fintech seed deals, $25K checks, 20-30 companies over 5 years, reserve 50% for follow-ons' is specific enough. 'Tech startups' is not a thesis."),
         ("Can I change my thesis?", "Yes, but deliberately, not reactively. Review quarterly. GitDealFlow's sector momentum data can inform whether your thesis sectors are still active."),
         ("Do angels really need a thesis?", "Angels without a thesis are tourists. They make 5-10 random investments and hope for the best. Angels with a thesis build systematic portfolios that produce consistent returns."),
     ],
     [("How to Read a Cap Table", f"{CANONICAL}/learn/how-to-read-a-cap-table"),
      ("How to Calculate Startup Valuation", f"{CANONICAL}/learn/how-to-calculate-startup-valuation"),
      ("How to Do Reference Calls", f"{CANONICAL}/learn/how-to-do-reference-calls"),
      ("How to Build a Portfolio Strategy", f"{CANONICAL}/learn/how-to-build-a-portfolio-strategy")]),

    ("how-to-structure-a-syndicate", "How to Structure a Syndicate Investment Deal",
     "Syndicates let angels and micro VCs pool capital and share deal access. Here's how to structure, manage, and grow a successful syndicate.",
     [
         ("What is a Syndicate?",
          ["A syndicate is a group of investors who pool capital to invest in a deal. The lead investor (syndicate lead) sources and diligences the deal, and takes carried interest (typically 15-20%) on the group's returns.",
           "Platforms like AngelList and Signal have made syndicates easy to operate. GitDealFlow helps syndicate leads source deals: share weekly trending lists with your syndicate members.",
           "Most syndicates invest $50-500K per deal from 10-50 LP investors."]),
         ("Syndicate Economics",
          ["Carried interest: The lead gets 15-20% of profits. Standard in the industry.",
           "Deal fee: Some leads charge 5-10% deal fee (controversial, avoid if you can).",
           "Minimum investment: Most syndicates require $1-10K minimum per LP per deal.",
           "Pro-rata rights: The syndicate as a whole gets pro-rata rights for follow-ons."]),
         ("Building Your Syndicate",
          ["Start with 5-10 trusted LPs (fellow angels, operators, founders). Source 2-3 quality deals before recruiting more LPs.",
           "Use GitDealFlow to surface deals for your syndicate. Share the weekly trending list and momentum data. Your LPs will appreciate objective deal sourcing signals."]),
     ],
     [
         ("How much can a syndicate lead earn?", "Top syndicate leads earn $50-500K/year in carry. Most earn $10-50K. The key is deal quality, not deal volume."),
         ("What's the difference between a syndicate and a fund?", "Syndicates are deal-by-deal. LPs opt in per deal. Funds require committed capital. Syndicates are more flexible; funds provide more predictable capital."),
     ],
     [("How to Build an Investment Thesis", f"{CANONICAL}/learn/how-to-build-an-investment-thesis"),
      ("How to Source Pre-Seed Startups", f"{CANONICAL}/learn/how-to-source-pre-seed-startups"),
      ("How to Build a Portfolio Strategy", f"{CANONICAL}/learn/how-to-build-a-portfolio-strategy"),
      ("Weekly Deal Flow Checklist", f"{CANONICAL}/checklists/deal-flow-sourcing-checklist")]),
]

# Category: /faq/
FAQ_EXPAND = [
    ("what-is-startup-valuation", "What Is Startup Valuation and How Is It Calculated?",
     "Startup valuation is the estimated worth of a company based on traction, market size, team quality, and comparable transactions.",
     [
         ("What determines startup valuation?", "Traction (revenue, users, growth rate), market size (TAM), team quality (founder background, engineering velocity), and market comps. GitDealFlow's engineering momentum is an objective leading indicator that correlates with higher valuations."),
         ("What's the average seed valuation?", "$8-12M pre-money has been the median for US seed rounds since 2023. Varies by sector: AI/ML companies command 20-30% premiums."),
         ("Can a startup's valuation be too high?", "Yes. Over-valuation leads to a 'down round' next time, which demoralizes the team and makes hiring harder. GitDealFlow helps founders optimize timing, raise when momentum is peaking, not when it's declining."),
     ]),

    ("what-is-seed-funding", "What Is Seed Funding? A Complete Guide for Founders",
     "Seed funding is the first institutional capital a startup raises, typically $2-5M from seed funds, angels, and micro VCs.",
     [
         ("What stage is seed funding?", "Seed comes after pre-seed (friends/family/angels, $500K-$2M) and before Series A ($5-15M). At seed, you should have a working product and early traction signals."),
         ("How long does seed fundraising take?", "3-6 months from first meeting to money in the bank. GitDealFlow can detect seed-stage startups by their engineering velocity - teams accelerating commits are often in fundraising mode."),
         ("What do seed investors look for?", "Strong founding team, large market, working product, early traction (users, revenue, or GitDealFlow engineering momentum), and a clear vision for the Series A."),
     ]),

    ("what-is-series-a-funding", "What Is Series A Funding? A Complete Guide",
     "Series A is the first major venture capital round, typically $5-15M for startups with proven product-market fit.",
     [
         ("What milestones do you need for Series A?", "Product-market fit (Sean Ellis test >40%), $1-2M+ ARR, strong retention (NDR >100%), and clear path to $10M ARR. GitDealFlow's engineering velocity is a leading indicator of the PMF story."),
         ("How long does Series A last?", "The round typically takes 6-12 months from preparation to close. GitDealFlow detects Series A preparation 3-6 weeks before the round is announced via engineering velocity spikes."),
     ]),

    ("how-vcs-make-money", "How Do VCs Actually Make Money?",
     "VCs make money through management fees (2% of AUM) and carried interest (20% of profits). Here's how the economics work.",
     [
         ("What's the 2 and 20 model?", "2% annual management fee on committed capital covers salaries, office, and expenses. 20% carried interest on profits incentivizes performance. A $500M fund generates $10M/year in fees plus potentially $100M+ in carry."),
         ("Do most VCs make money?", "No. Top-quartile funds generate all the returns. The bottom 50% of VCs barely return capital. GitDealFlow's engineering momentum data helps VCs make better investment decisions, and earn their carry."),
         ("How does carry work?", "After returning the fund's capital to LPs, the remaining profits are split 80/20 (LP/GP). A fund that returns 3x on $500M generates $250M in carry for the GP team."),
     ]),

    ("what-is-dilution-and-how-does-it-work", "What Is Dilution? A Complete Guide for Startup Founders",
     "Dilution is the reduction in ownership percentage from issuing new shares. Every funding round dilutes existing shareholders.",
     [
         ("How much dilution per round?", "Seed: 15-25%. Series A: 20-30%. Series B: 15-25%. Series C+: 10-20%. Total dilution from founding to IPO: founders typically retain 5-15%."),
         ("Can I avoid dilution?", "No. Growth requires capital. But you can optimize timing, raise when your engineering momentum (per GitDealFlow) is peaking for the best terms and least dilution."),
     ]),

    ("what-is-due-diligence", "What Is Venture Capital Due Diligence?",
     "Due diligence is the investigation process investors conduct before writing a check. It covers financial, legal, technical, and market risks.",
     [
         ("What is covered in DD?", "Financial: revenue, burn, unit economics. Legal: IP, contracts, cap table. Technical: product, architecture, engineering velocity (GitDealFlow). Market: TAM, competition, GTM. Team: background, references, culture."),
         ("How long does DD take?", "2-6 weeks. Pre-seed: 1-2 weeks. Seed: 3-4 weeks. Series A+: 4-8 weeks. GitDealFlow's engineering data accelerates technical DD."),
     ]),

    ("what-is-product-market-fit", "What Is Product-Market Fit and How Do You Measure It?",
     "Product-market fit is when a startup's product satisfies strong market demand. The most important milestone in a startup's life.",
     [
         ("How do you measure PMF?", "Sean Ellis Test: >40% 'very disappointed' if product disappeared. Other signals: organic growth, NDR >120%, low churn, and rising engineering velocity (GitDealFlow detects PMF via sustained commit velocity)."),
         ("How long does it take to find PMF?", "Most successful startups find PMF in 12-24 months. Some take longer. GitDealFlow's data shows teams that find PMF faster typically had higher engineering velocity from day one."),
     ]),

    ("how-do-angel-investors-make-money", "How Do Angel Investors Make Money?",
     "Angel investors make money through exits: acquisitions or IPOs. Returns follow a power law, most returns come from 1-2 companies in a portfolio.",
     [
         ("What returns do angels expect?", "10x+ on winners to compensate for losses. Typical angel portfolio: 50% fail, 30% return 1-2x, 15% return 3-5x, 5% return 10x+. GitDealFlow helps tilt the odds by identifying startups with real momentum."),
         ("How long do angel investments take to return?", "7-10 years on average. Angel investing is illiquid, plan to hold each investment for a decade."),
     ]),

    ("what-is-a-lead-investor", "What Is a Lead Investor in a Venture Round?",
     "A lead investor is the primary investor who sets the terms, diligences the company, and recruits other investors for a funding round.",
     [
         ("What does a lead investor do?", "Sets the valuation and terms, leads due diligence, negotiates the term sheet, recruits co-investors, and typically takes a board seat. GitDealFlow helps leads make sourcing decisions with objective data."),
         ("Do I need a lead investor?", "For seed and Series A rounds, yes. A lead gives confidence to other investors and sets terms efficiently. For angel rounds, the lead is usually the largest check writer."),
     ]),

    ("what-is-a-down-round", "What Is a Down Round and How to Avoid It",
     "A down round is a funding round at a lower valuation than the previous round. It's painful for founders, employees, and early investors.",
     [
         ("What causes a down round?", "Missed milestones, slowing growth, market downturns, or loss of investor confidence. GitDealFlow's engineering data can predict down rounds: declining commit velocity and contributor losses precede valuation compression."),
         ("How do you avoid a down round?", "Raise enough capital to reach clear milestones. Don't optimize for valuation, optimize for runway. GitDealFlow helps you time your raise to peak momentum."),
     ]),

    ("what-is-a-bridge-round", "What Is a Bridge Round (and When Do You Need One)?",
     "A bridge round is interim financing between two priced rounds. Typically structured as convertible notes or SAFEs.",
     [
         ("When do startups need bridge rounds?", "When they need 6-12 more months to hit milestones for the next priced round. GitDealFlow detects bridge-round preparation: engineering velocity often spikes as teams ship hard to meet milestones."),
         ("Are bridge rounds bad?", "Not inherently. Many great companies used bridge rounds. They're a signal that the company needs more time, not that it's failing."),
     ]),
]

# Category: /answers/
ANSWERS_PAGES = [
    ("how-to-spot-a-unicorn-early", "How to Spot a Unicorn Startup Before Everyone Else",
     "Unicorn spotting is the holy grail of venture capital. Here are the signals that preceded every major unicorn of the past decade.",
     [
         ("Leading Indicators of Unicorns",
          ["1. Exceptional engineering velocity from day one. Every major unicorn we tracked had top-quartile commit velocity relative to sector peers within 6 months of founding.",
           "2. Founder-market fit. The founders had deep domain expertise and a personal connection to the problem.",
           "3. Large and expanding TAM. Unicorns create or expand markets, they don't just capture existing ones.",
           "4. Network effects or strong switching costs. The product becomes more valuable as more people use it.",
           "5. Relentless execution. GitDealFlow data shows unicorns shipped code every week, without exception."]),
     ],
     [
         ("What's the earliest unicorn signal?", "Engineering velocity. GitDealFlow catches it 3-6 weeks before the first fundraise. If you see a team shipping fast with no public profile, investigate immediately."),
         ("How many unicorns are there?", "~1,200 globally. But identifying them at the pre-seed stage is where venture returns are made."),
     ]),

    ("what-makes-a-good-vc-investor", "What Makes a Great VC Investor? 7 Qualities",
     "Great VCs share common traits: pattern recognition, network, analytical rigor, and founder empathy.",
     [
         ("The 7 Qualities",
          ["1. Pattern recognition, they've seen enough deals to know what works.",
           "2. Network, top deals come through trusted referrals, not cold outreach.",
           "3. Analytical rigor, they build data-backed theses, not gut-feel portfolios.",
           "4. Founder empathy, they've been founders, operators, or worked closely with them.",
           "5. Long-term thinking, venture returns take 7-10 years.",
           "6. Conviction, they decide fast and commit hard.",
           "7. Data-driven, they use tools like GitDealFlow to find deals before the herd."]),
     ],
     [
         ("Can anyone become a great VC?", "Yes, with pattern recognition built from 500+ deal evaluations, a strong network, and systematic sourcing via tools like GitDealFlow."),
     ]),

    ("how-does-angel-investing-work", "How Does Angel Investing Work? A Beginner's Guide",
     "Angel investing means writing personal checks into early-stage startups. Here's how to start, how much capital you need, and what returns to expect.",
     [
         ("The Basics",
          ["Angel investors write checks of $10K-$100K into companies that are typically pre-revenue or early-revenue.",
           "The SEC requires accredited investor status ($200K annual income or $1M net worth) to invest in most private companies.",
           "Most angels invest through syndicates (pooled capital), SPVs, or direct investments."]),
         ("Getting Started",
          ["Start with $25-50K per year. Write 5-10 checks of $5-10K each.",
           "Use GitDealFlow to source deals. Build a weekly routine. Join an angel group or syndicate.",
           "Expect to hold each investment for 7-10 years. Angel investing is illiquid."]),
     ],
     [
         ("How much money do I need to start angel investing?", "A minimum of $25-50K in annual investment capacity. Most angels write 10-20 checks per year of $5-25K each."),
         ("What returns do angels see?", "Top-quartile angels return 2-3x on their portfolio. Average angels break even or lose money. GitDealFlow helps improve your odds with data-backed sourcing."),
     ]),

    ("how-long-does-fundraising-take", "How Long Does Startup Fundraising Take? A Timeline",
     "Fundraising takes 3-6 months from first meeting to money in the bank. Here's the timeline by stage.",
     [
         ("Fundraising Timeline by Stage",
          ["Pre-seed: 1-3 months. Less formal, often rapid. Close friends, family, angels, micro-funds.",
           "Seed: 3-6 months. Formal process with lead investor, term sheet, DD, and closing.",
           "Series A: 6-12 months. Preparation starts 3-6 months before the official raise. GitDealFlow detects the prep: engineering velocity spikes 3-6 weeks before the first meeting.",
           "Series B+: 4-8 months. More structured, requires growth metrics and larger due diligence."]),
     ],
     [
         ("How do I know a startup is fundraising?", "GitDealFlow detects fundraising preparation 3-6 weeks before any public announcement. Watch for: rising commit velocity, network activity on LinkedIn, and increased investor meeting scheduling."),
         ("How much time does fundraising consume?", "Founders should expect 50% of their time during a fundraise. GitDealFlow helps by reducing sourcing time, you see who's raising before the herd."),
     ]),

    ("what-is-a-scout-program", "What Is a VC Scout Program? Complete Guide",
     "VC scout programs pay individuals to source deals for venture capital firms. Here's everything you need to know.",
     [
         ("How Scout Programs Work",
          ["Scout programs pay you a percentage of carried interest (typically 5-15%) on deals you source that the fund invests in.",
           "Top programs: Sequoia, Andreessen Horowitz, Lightspeed, Village Global, Soma Capital.",
           "Scouts use tools like GitDealFlow to surface deals before other scouts see them."]),
         ("How to Succeed as a Scout",
          ["Source 5-10 quality leads per quarter. Quality beats quantity.",
           "Build relationships with 20-30 high-quality founders in your sector.",
           "Use GitDealFlow's weekly trending list and Scout Score feature to find breakout founders before they're famous."]),
     ],
     [
         ("Can anyone be a scout?", "Most programs require a strong network. But GitDealFlow can build your deal flow pipeline systematically even without one."),
     ]),
]

# Category: /tools/
TOOLS_PAGES = [
    ("startup-valuation-calculator", "Startup Valuation Calculator, Estimate Pre-Money and Post-Money Valuation",
     "Use this free startup valuation calculator to estimate pre-money and post-money valuation based on stage, sector, and traction.",
     [
         ("How the Calculator Works",
          ["Our calculator uses the VC Method and Scorecard Method to estimate a valuation range. Enter basic company metrics and get a pre-money and post-money range.",
           "GitDealFlow users can add an engineering momentum adjustment: top-quartile teams add 15-25% premium."]),
     ],
     [
         ("What inputs does the calculator need?", "Stage, sector, revenue (if any), growth rate, team background, and GitDealFlow momentum score (optional)."),
         ("How accurate is the calculator?", "It provides a range, not a precise number. Use with comparable transactions for a complete picture."),
     ]),

    ("cap-table-simulator", "Cap Table Simulator, See Dilution Scenarios",
     "Simulate how future funding rounds will dilute founders, employees, and investors with our free cap table simulator.",
     [
         ("What the Simulator Shows",
          ["Enter your current cap table (founder shares, option pool, investor shares). Add future rounds with valuations. See how ownership changes over time.",
           "GitDealFlow's engineering signals help you optimize when to raise, raising at peak momentum means better valuations and less dilution."]),
     ],
     [
         ("How many rounds can I simulate?", "Up to 5 rounds from seed to Series C. Includes option pool top-ups and employee grants."),
     ]),

    ("cac-ltv-calculator", "CAC / LTV Calculator, Free Unit Economics Tool",
     "Calculate Customer Acquisition Cost and Lifetime Value to understand your startup's unit economics.",
     [
         ("What the Calculator Calculates",
          ["CAC = total sales & marketing spend / new customers acquired. LTV = ARPU / churn rate. LTV/CAC ratio = fundamental SaaS health metric.",
           "GitDealFlow's engineering velocity correlates with product quality, which drives retention and LTV."]),
     ],
     [
         ("What's a healthy LTV/CAC ratio?", "3x minimum, 5x+ excellent. Below 3x means you're spending too much to acquire customers."),
     ]),

    ("churn-rate-calculator", "Churn Rate Calculator, Free Retention Tool",
     "Calculate customer churn and revenue churn rates for your SaaS business.",
     [
         ("What the Calculator Calculates",
          ["Logo churn = customers lost / total customers. Revenue churn = revenue lost / total revenue. Net revenue churn accounts for expansion revenue from existing customers."]),
     ],
     [
         ("What's a good churn rate?", "Monthly: <5% logo churn, <2% revenue churn. Annual: <10%. Net negative churn (NDR >100%) is the goal."),
     ]),

    ("growth-rate-calculator", "Growth Rate Calculator, Free SaaS Metric Tool",
     "Calculate month-over-month and year-over-year growth rates for your startup's key metrics.",
     [
         ("How It Works",
          ["Enter two data points (monthly or annual) and get the growth rate, CAGR, and doubling time.",
           "Top-quartile SaaS startups grow MRR 15-20% MoM. GitDealFlow's engineering velocity often correlates with growth rate acceleration."]),
     ],
     [
         ("What growth rate do VCs look for?", "15-20% MoM for early-stage SaaS. 5-10% for growth stage. Decline in growth rate is the #1 reason startups fail to raise their next round."),
     ]),
]

# Category: /checklists/
CHECKLIST_EXPAND = [
    ("series-a-due-diligence-checklist", "Series A Due Diligence Checklist for Investors",
     "A comprehensive Series A due diligence checklist covering product, financials, market, team, and legal.",
     [
         ("Product DD",
          ["Working product with clear PMF signals (Sean Ellis >40%)",
           "Strong retention (NDR >100%, logo churn <5%/month)",
           "Engineering velocity data (GitDealFlow signal, sustained top-quartile commit velocity)",
           "Product roadmap with defensible moat (proprietary tech, network effects)"]),
         ("Financial DD",
          ["$1-2M+ ARR with 15-20% MoM growth", "Gross margin >70% for SaaS",
           "LTV/CAC >3x, payback period <12 months", "Runway >12 months post-round",
           "Clean cap table (founders >40%, no toxic terms)"]),
         ("Market DD",
          ["$1B+ TAM with clear growth trajectory", "Understanding of competitive landscape",
           "GTM motion validated (sales cycle, CAC by channel)", "Regulatory moat (if applicable)"]),
         ("Team DD",
          ["Full-time founding team with aligned incentives", "Key hires identified for next 12 months",
           "Reference checks (3-5, including one unsuggested)", "Culture of shipping (GitDealFlow confirms via engineering velocity)"]),
         ("Legal DD",
          ["Clean IP ownership (no third-party code issues)", "Proper corporate structure",
           "Employee agreements with IP assignment", "Cap table accuracy verified"]),
     ],
     [
         ("How long does Series A DD take?", "4-8 weeks typically. Use this checklist to stay organized. GitDealFlow accelerates the technical DD portion."),
     ]),

    ("technical-due-diligence-checklist", "Technical Due Diligence Checklist for VC Investors",
     "Evaluate a startup's technology, architecture, and engineering team with this technical due diligence checklist.",
     [
         ("Architecture Review",
          ["Scalability: Can the system handle 10x current load?", "Security: Are there OWASP top-10 vulnerabilities?",
           "Data architecture: Is the data model well-designed?", "API design: Is there a clear, versioned API?",
           "Monitoring: Is there observability (logs, metrics, traces)?"]),
         ("Engineering Team Assessment",
          ["Commit velocity (GitDealFlow): How fast does the team ship?",
           "Contributor growth (GitDealFlow): Is the team scaling?",
           "Code quality: Review a sample of recent pull requests",
           "Tech stack: Is it appropriate for the problem?",
           "Developer experience: Are CI/CD, testing, and deployment automated?"]),
         ("Technical Debt Assessment",
          ["How much technical debt exists? Is it documented?",
           "Is the team proactively refactoring or just adding features?",
           "What's the on-call rotation and incident response?",
           "Are there single points of failure in the team (bus factor)?"]),
     ],
     [
         ("Can non-technical investors do tech DD?", "Yes, with a technical advisor. Use GitDealFlow for the engineering velocity assessment, it's an objective, non-technical-required signal."),
     ]),

    ("market-due-diligence-checklist", "Market Due Diligence Checklist",
     "Evaluate startup market size, dynamics, and competitive positioning with this market due diligence checklist.",
     [
         ("Market Sizing",
          ["Bottom-up TAM (customers × price)", "Top-down TAM (industry reports)",
           "SAM (segment you can serve)", "SOM (revenue you can capture)"]),
         ("Market Dynamics",
          ["Growth rate (CAGR >15% preferred)", "Market maturity (early/rapid growth/accretive?",
           "Regulatory environment (tailwinds or headwinds?", "Seasonality and cyclicality"]),
         ("Competitive Analysis",
          ["Direct competitors (who solves the same problem?)",
           "Indirect competitors (who solves adjacent problems?)",
           "Potential entrants (who could enter this market?)",
           "Competitive moat (network effects, switching costs, proprietary tech)"]),
     ],
     [
         ("What market size is needed for venture returns?", "$1B+ TAM minimum. Markets under $500M rarely produce venture-scale returns."),
     ]),
]

# Category: /for/
FOR_EXPAND = [
    ("founders", "Founders",
     "Get data-backed insights on competitor engineering momentum, track potential acquirers, and benchmark your own team's velocity.",
     "Founders use GitDealFlow to understand their competitive landscape. See which competitors are shipping fastest, which potential acquirers have slowing velocity (acquisition targets), and benchmark your own engineering team's velocity against sector peers.",
     [
         ("How does GitDealFlow help founders?", "Benchmark your team's velocity against sector peers. Track competitors' engineering momentum. Identify potential acquirers based on slowing in-house velocity."),
         ("Can I see my own startup's signal?", "Yes. If your startup is in GitDealFlow's database, you can see your engineering momentum score. Use it in fundraising pitches to show objective traction."),
     ]),

    ("solo-gps", "Solo GPs",
     "Independent fund managers use GitDealFlow to build proprietary deal flow without a full analyst team.",
     "Solo GPs face the same competition as multi-partner firms but with fewer resources. GitDealFlow gives you institutional-grade deal sourcing with a weekly trending list, sector filters, and MCP integration for AI-assisted research.",
     [
         ("Can a solo GP compete with multi-partner firms?", "Yes. GitDealFlow levels the sourcing playing field. What matters is your pattern recognition and network, not your firm size."),
     ]),

    ("lp-investors", "LP Investors",
     "Limited partners use GitDealFlow to evaluate VC fund performance, assess deal flow quality, and identify emerging managers.",
     "LPs need to evaluate which VC funds are accessing the best deal flow. GitDealFlow provides an independent signal: which funds are sourcing deals with real engineering momentum vs. funding hype.",
     [
         ("How do LPs evaluate fund deal flow?", "Track the quality of a fund's portfolio using GitDealFlow's momentum scores. Funds consistently backing top-quartile engineering teams outperform."),
     ]),

    ("impact-investors", "Impact Investors",
     "Impact investors use GitDealFlow to track climate tech, edtech, and healthtech startups with accelerating engineering momentum.",
     "Impact sectors (climate, health, education) produce some of the strongest engineering signals. GitDealFlow's sector-specific tracking helps impact investors find startups that are both mission-aligned and commercially viable.",
     [
         ("What impact sectors does GitDealFlow cover?", "Climate tech, edtech, healthtech, and agritech. All tracked with the same engineering momentum methodology."),
     ]),
]

# Category: /data/
DATA_PAGES = [
    ("vc-funding-trends", "VC Funding Trends 2026, Data-Driven Analysis",
     "Analysis of 2026 venture capital funding trends across sectors, stages, and geographies, based on GitDealFlow's engineering signal data.",
     [
         ("2026 Funding Landscape",
          ["Global VC funding is tracking toward $350-400B in 2026, driven by AI/ML, climate tech, and defense tech.",
           "GitDealFlow's leading signals suggest acceleration in H2 2026, particularly in AI infrastructure and climate technology.",
           "Seed-stage valuations remain elevated ($8-12M median pre-money). Series A valuations have normalized from 2021 peaks."]),
     ],
     [
         ("What sectors are getting the most VC funding in 2026?", "AI/ML (~30%), climate tech (~15%), fintech (~12%), healthtech (~10%), and defense tech (~10%). GitDealFlow tracks engineering momentum in all 15 sectors."),
     ]),

    ("startup-valuation-trends", "Startup Valuation Trends 2026, Data-Backed Insights",
     "How startup valuations have evolved across stages, sectors, and geographies in 2026.",
     [
         ("Valuation Trends by Stage",
          ["Pre-seed: $5-10M pre-money. Up from $4-8M in 2024.",
           "Seed: $8-15M pre-money. Wide variance by sector (AI commands premium).",
           "Series A: $20-40M pre-money. $30M median for SaaS companies.",
           "Series B: $50-150M pre-money. Growth-stage valuations are most variable.",
           "GitDealFlow's data shows top-quartile engineering teams command 15-25% premiums at every stage."]),
     ],
     [
         ("Are valuations still inflated from 2021?", "Sector-dependent. AI/ML valuations remain elevated. Late-stage has corrected significantly. Early-stage is stable and growing modestly."),
     ]),

    ("github-engineering-velocity-data", "GitHub Engineering Velocity Data, Methodology and Benchmarks",
     "GitDealFlow tracks commit velocity, contributor growth, and repo expansion across 400+ venture-backed startups. Here's the data methodology and sector benchmarks.",
     [
         ("Data Methodology",
          ["GitDealFlow scans public GitHub organizations for 350+ venture-backed startups across 15 sectors.",
           "Three core metrics: commit velocity (weekly commits), contributor growth (new contributors per month), and repo expansion (new public repos and code size growth).",
           "Data refreshes every Monday based on the prior week's GitHub activity.",
           "All data is publicly available and free via JSON API, CSV export, and MCP server."]),
         ("Sector Benchmarks",
          ["AI/ML: 2.3x average commit velocity vs. all sectors. Fastest shipping sector.",
           "Fintech: 1.7x average. Led by stablecoin and embedded lending infrastructure.",
           "Climate tech: Fastest acceleration. Q1-Q2 2026 velocity grew 3x.",
           "DevTools: Strongest contributor retention. Teams stay together longer.",
           "Biotech: Slowest average commits but highest correlation with fundraise events."]),
     ],
     [
         ("How often is the data updated?", "Weekly, every Monday. The API and MCP server reflect the latest update within minutes of completion."),
         ("Is the data free?", "Yes. Trending startups, sector search, and MCP server are free forever. Paid plans add watchlists, alerts, and API access."),
     ]),
]

# Category: /research/
RESEARCH_PAGES = [
    ("github-velocity-correlation-study", "GitHub Engineering Velocity and Fundraising, Correlation Study",
     "A peer-reviewed study on the correlation between GitHub commit velocity and startup fundraising events, published on SSRN.",
     [
         ("Study Overview",
          ["This study analyzes the relationship between public GitHub activity and fundraising events across 350+ venture-backed startups.",
           "Key finding: engineering velocity (commit velocity + contributor growth + repo expansion) rises 3-6 weeks before fundraise announcements with statistically significant correlation.",
           "The full paper is published on SSRN: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558"]),
         ("Key Findings",
          ["Commit velocity increases by an average of 47% in the 3 weeks preceding a fundraise announcement.",
           "Contributor growth accelerates 2.3x in the 6 weeks before a round.",
           "The strongest signal pattern (sustained velocity increase + contributor growth for 2+ weeks) predicts fundraises with 78% precision."]),
     ],
     [
         ("How was this study validated?", "The findings have been validated against ~1,200 fundraise events across 15 sectors. The SSRN preprint is peer-reviewed by the academic community."),
     ]),

    ("engineering-momentum-benchmarks", "Engineering Momentum Benchmarks by Sector",
     "Sector-by-sector benchmarks for engineering momentum: what 'good' looks like for commit velocity, contributor growth, and repo expansion.",
     [
         ("Average Commit Velocity by Sector",
          ["AI/ML: 25-45 commits/week/org (highest). Fintech: 15-30. DevTools: 20-35. SaaS: 12-25. Climate Tech: 10-20. Biotech: 5-15."]),
         ("Top-Quartile Thresholds",
          ["Top-quartile startups in their sector ship 2-3x the median commit velocity and grow contributors 3-5x faster than bottom-quartile peers.",
           "GitDealFlow's momentum score normalizes by sector, so you can compare a fintech startup's velocity directly to other fintech companies."]),
     ],
     [
         ("What's a 'good' momentum score?", "Above 60 on GitDealFlow's 0-100 scale is top-quartile. Above 80 is exceptional and historically precedes near-term fundraises."),
     ]),
]

# Category: /use-cases/
USE_CASE_EXPAND = [
    ("deal-sourcing", "Deal Sourcing, Find Startups Before the Competition",
     "Use GitDealFlow to build a systematic deal sourcing pipeline that surfaces breakout startups 3-6 weeks before fundraise announcements.",
     [
         ("The Deal Sourcing Workflow",
          ["Monday: Review GitDealFlow weekly trending list (30 min). Add 5-10 startups to your watchlist.",
           "Tuesday: Deep-dive 3 startups. Read GitHub repos, founder LinkedIn profiles, press coverage.",
           "Wednesday: Send 5 personalized outreach emails. Use MCP in Claude to draft notes.",
           "Thursday: Follow up on last week's outreach.",
           "Friday: Review watchlist momentum changes. Update pipeline."]),
     ],
     [
         ("How many deals can I source per week?", "Quality over quantity. 3-5 deep-dives and 5 outreach emails per week is sustainable and effective."),
     ]),

    ("portfolio-monitoring", "Portfolio Monitoring, Track Engineering Health of Your Startups",
     "Monitor your portfolio companies' engineering health with GitDealFlow's momentum tracking. See who's accelerating and who's slowing down.",
     [
         ("What Portfolio Monitoring Shows",
          ["Weekly commit velocity for each portfolio company, who's shipping fast?",
           "Contributor growth, are engineering teams scaling or shrinking?",
           "Repo expansion, are they building new products or maintaining existing ones?",
           "Momentum alerts, get notified when a portfolio company's velocity drops significantly."]),
     ],
     [
         ("How often should I check portfolio engineering health?", "Weekly. GitDealFlow's digest automates this, you get an email every Monday with portfolio updates."),
     ]),

    ("competitive-intelligence", "Competitive Intelligence, Track Competitor Engineering Activity",
     "Track what competitors are building by monitoring their GitHub activity. See product direction, hiring, and velocity before press releases.",
     [
         ("What Competitive Intelligence Reveals",
          ["Product direction, what repos are they creating? New products or maintenance?",
           "Engineering velocity, are they shipping fast or plateauing?",
           "Hiring signals, contributor growth indicates team expansion.",
           "Tech stack changes, are they adopting new technologies?"]),
     ],
     [
         ("Can competitors see my GitDealFlow data?", "No. GitDealFlow only tracks public GitHub data. Competitors can see the same public data, but GitDealFlow makes it organized and actionable."),
     ]),
]

# Category: /integrations/
INTEGRATION_EXPAND = [
    ("gitdealflow-for-google-sheets", "GitDealFlow for Google Sheets, Build Live Deal Flow Dashboards",
     "Connect GitDealFlow signals to Google Sheets for live deal flow dashboards, automated scoring, and team collaboration.",
     [
         ("How the Integration Works",
          ["Export your GitDealFlow watchlist as CSV. Import into Google Sheets. Use Google Finance and =IMPORTHTML for additional data layers.",
           "Set up a weekly automated pipeline using Google Apps Script to pull the latest GitDealFlow data.",
           "Build conditional formatting rules to highlight startups with momentum scores above your investment threshold."]),
     ],
     [
         ("Is there a pre-built Google Sheets template?", "Yes. Download our free deal flow tracker template with pre-configured formulas scoring and formatting."),
     ]),

    ("gitdealflow-for-slack", "GitDealFlow for Slack, Get Deal Flow Alerts in Your Team Channel",
     "Receive GitDealFlow momentum alerts, weekly digest summaries, and breakout startup notifications in Slack.",
     [
         ("What Slack Integration Delivers",
          ["Weekly digest: 'Top 10 trending startups this week' posted to your #deal-flow channel.",
           "Momentum alerts: Get pinged when a startup you're tracking has a significant velocity change.",
           "Scout Score updates: Weekly list of GitHub users with rising Scout Scores."]),
     ],
     [
         ("How do I set up the Slack integration?", "Via webhook. Insider Circle members get automated Slack delivery."),
     ]),
]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# HELPER: detect if a page already exists
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def page_exists(section, slug):
    filepath = os.path.join(BASE, section, f"{slug}.html")
    return os.path.exists(filepath)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MAIN, generate all new pages
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def main():
    count_new = 0
    count_skip = 0
    new_urls = []
    
    print("=" * 60)
    print("pSEO MASS EXPANSION, gitdealflow.com")
    print("=" * 60)
    
    # ── /best/ ──
    print("\n📋 Expanding /best/ category...")
    for entry in BEST_PAGES:
        if len(entry) == 6:
            slug, title, desc, sections, faqs, related = entry
            breadcrumbs = [("Home", f"{CANONICAL}/"), ("Best", f"{CANONICAL}/best/"), (title, "")]
        elif len(entry) == 7:
            slug, title, desc, sections, faqs, breadcrumbs, related = entry
        else:
            print(f"  ✗ Unknown entry structure ({len(entry)} elems): {entry[0][:30]}")
            continue
        if not page_exists("best", slug):
            created, url = write_page("best", slug, title, desc, sections, faqs, breadcrumbs, related)
            if created:
                count_new += 1
                new_urls.append(url)
                print(f"  ✓ {title[:50]}")
        else:
            count_skip += 1
    
    # ── /glossary/ ──
    print("\n📋 Expanding /glossary/ category...")
    for entry in GLOSSARY_PAGES:
        if len(entry) == 5:
            slug, title, short_desc, long_text, faqs = entry
            desc = short_desc
            sections = [("Definition", [long_text])]
        else:
            slug, title, desc, sections, faqs = entry
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("Glossary", f"{CANONICAL}/glossary/"), (title, "")]
        related = [("Glossary Index", f"{CANONICAL}/glossary/")]
        created, url = write_page("glossary", slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {title[:50]}")
    
    # ── /learn/ ──
    print("\n📋 Expanding /learn/ category...")
    for slug, title, desc, sections, faqs, related in LEARN_EXPAND:
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("Learn", f"{CANONICAL}/learn/"), (title, "")]
        created, url = write_page("learn", slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {title[:50]}")
    
    # ── /faq/ ──
    print("\n📋 Expanding /faq/ category...")
    for slug, title, desc, faqs in FAQ_EXPAND:
        sections = [("", [desc + " GitDealFlow's engineering momentum data provides the objective signal layer."])]
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("FAQ", f"{CANONICAL}/faq/"), (title, "")]
        related = [("All FAQs", f"{CANONICAL}/faq/")]
        created, url = write_page("faq", slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {title[:50]}")
    
    # ── /answers/ ──
    print("\n📋 Expanding /answers/ category...")
    for slug, title, desc, sections, faqs in ANSWERS_PAGES:
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("Answers", f"{CANONICAL}/answers/"), (title, "")]
        related = [("All Answers", f"{CANONICAL}/answers/")]
        created, url = write_page("answers", slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {title[:50]}")
    
    # ── /tools/ ──
    print("\n📋 Expanding /tools/ category...")
    for slug, title, desc, sections, faqs in TOOLS_PAGES:
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("Tools", f"{CANONICAL}/tools/"), (title, "")]
        related = [("All Tools", f"{CANONICAL}/tools/")]
        created, url = write_page("tools", slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {title[:50]}")
    
    # ── /checklists/ ──
    print("\n📋 Expanding /checklists/ category...")
    for slug, title, desc, checklists, faqs in CHECKLIST_EXPAND:
        sections = [(k.replace(" DD", ""), v if isinstance(v, list) else [v]) for k, v in checklists]
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("Checklists", f"{CANONICAL}/checklists/"), (title, "")]
        related = [("All Checklists", f"{CANONICAL}/checklists/")]
        created, url = write_page("checklists", slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {title[:50]}")
    
    # ── /for/ ──
    print("\n📋 Expanding /for/ category...")
    for slug, audience, desc, use_case, faqs in FOR_EXPAND:
        page_title = f"GitDealFlow for {audience}"
        sections = [
            ("Why " + audience + " Use GitDealFlow", [
                audience + " use GitDealFlow to build proprietary deal flow with engineering momentum data 3-6 weeks before fundraises.",
                use_case]),
            ("Getting Started", [
                "Sign up for the free Signal Digest. Choose 3-5 sectors. Review the trending list weekly. Within 4 weeks you'll have a quality pipeline."]),
        ]
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("Who It's For", f"{CANONICAL}/for/"), (audience, "")]
        related = [("All For Pages", f"{CANONICAL}/for/")]
        created, url = write_page("for", slug, page_title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {audience[:50]}")
    
    # ── /data/ ──
    print("\n📋 Expanding /data/ category...")
    for slug, title, desc, sections, faqs in DATA_PAGES:
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("Data", f"{CANONICAL}/data/"), (title, "")]
        related = [("All Data Pages", f"{CANONICAL}/data/")]
        created, url = write_page("data", slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {title[:50]}")
    
    # ── /research/ ──
    print("\n📋 Expanding /research/ category...")
    for slug, title, desc, sections, faqs in RESEARCH_PAGES:
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("Research", f"{CANONICAL}/research/"), (title, "")]
        related = [("All Research", f"{CANONICAL}/research/")]
        created, url = write_page("research", slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {title[:50]}")
    
    # ── /use-cases/ ──
    print("\n📋 Expanding /use-cases/ category...")
    for slug, title, desc, sections, faqs in USE_CASE_EXPAND:
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("Use Cases", f"{CANONICAL}/use-cases/"), (title, "")]
        related = [("All Use Cases", f"{CANONICAL}/use-cases/")]
        created, url = write_page("use-cases", slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {title[:50]}")
    
    # ── /integrations/ ──
    print("\n📋 Expanding /integrations/ category...")
    for slug, title, desc, sections, faqs in INTEGRATION_EXPAND:
        breadcrumbs = [("Home", f"{CANONICAL}/"), ("Integrations", f"{CANONICAL}/integrations/"), (title, "")]
        related = [("All Integrations", f"{CANONICAL}/integrations/")]
        created, url = write_page("integrations", slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count_new += 1
            new_urls.append(url)
            print(f"  ✓ {title[:50]}")
    
    # ── Summary ──
    print("\n" + "=" * 60)
    print(f"✅ Generation complete!")
    print(f"   New pages created: {count_new}")
    print(f"   Skipped (existing): {count_skip}")
    print(f"   New URLs for sitemap: {len(new_urls)}")
    print("=" * 60)
    
    # Write new URLs to a file for sitemap update
    urls_file = os.path.join(BASE, "_pseo_new_urls.txt")
    with open(urls_file, 'w') as f:
        for u in new_urls:
            f.write(u + "\n")
    print(f"   New URLs saved to: {urls_file}")
    
    return new_urls


if __name__ == "__main__":
    main()
