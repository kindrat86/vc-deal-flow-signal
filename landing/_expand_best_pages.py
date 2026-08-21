#!/usr/bin/env python3
"""
Expand all thin /alternatives-to/ and /best/ pages on gitdealflow.com into rich
1,300-1,800 word listicles/roundups using a shared, source-verified tool-facts
library. One consistent template (matching /vs/), valid JSON-LD, no em dashes.

GitDealFlow facts (current): 350+ startups, 15 sectors, Free Sunday digest,
EUR 1 Teardown, EUR 7 First Look, EUR 49/mo Dashboard (EUR 441/yr),
EUR 197/mo Insider, EUR 1,997 Sector Sweep. Lead time 21-47 days (SSRN n=219).
"""
import os, json, re

BASE = os.path.expanduser("~/signals-gitdealflow/landing")
CANONICAL = "https://gitdealflow.com"
OG_IMAGE = "https://signals.gitdealflow.com/opengraph-image"

# Reuse exact boilerplate from the canonical pitchbook page.
SRC = open(os.path.join(BASE, "vs/pitchbook/index.html"), encoding="utf-8").read()
def grab(s, e):
    i = SRC.index(s); j = SRC.index(e, i) + len(e); return SRC[i:j]
POSTHOG = grab('<script>\n    !function(t,e)', '</script>')
NETWORK_STYLE = grab('<style>\n.portfolio-network', '</style>')
NETWORK_SECTION = grab('<section class="portfolio-network">', '</section>')

PRICE_NOTE = '<p style="font-size:.85em;color:#777;margin-top:1em">Prices reflect public listings and third-party reports as of August 2026; confirm current terms before purchase. GitDealFlow pricing is current as of August 2026.</p>'

# ── SHARED TOOL FACTS (source-verified Aug 2026) ───────────────────────────
TOOLS = {
    "crunchbase": {
        "name": "Crunchbase",
        "what": "Funding database and company profiles",
        "price": "from $49/mo Pro (billed annually)",
        "best": "Company research, funding history, market mapping",
        "blurb": "Crunchbase is the reference database of the startup world: funding rounds, investors, acquisitions, and company profiles across millions of companies. It is the place to research a company's history and map a market, but every data point is recorded after the event is public. Use it for diligence and market context, not for early signal.",
    },
    "pitchbook": {
        "name": "PitchBook",
        "what": "Institutional PE/VC financial data",
        "price": "custom, roughly $20,000-$30,000/yr per seat",
        "best": "Institutional financial data, LP reporting, PE/M&A",
        "blurb": "PitchBook is the institutional standard for private capital market data: 3.4M+ companies, 3,000+ research analysts, and deep PE/VC financials. It is the gold standard for post-announcement financial data, cap tables, and LP reporting, and it is priced for funds with a dedicated research budget.",
    },
    "cb-insights": {
        "name": "CB Insights",
        "what": "Market intelligence and analyst research",
        "price": "custom, roughly $50,000+/yr",
        "best": "Market maps, competitive intelligence, board decks",
        "blurb": "CB Insights delivers analyst-grade market intelligence: market maps, patent landscapes, and the Mosaic scoring model. Its research is deep enough to anchor a fund's thesis, but it ships on a periodic cadence and is priced for corporate strategy teams and large funds rather than individual investors.",
    },
    "dealroom": {
        "name": "Dealroom",
        "what": "EU-focused startup ecosystem data",
        "price": "custom, roughly EUR 12,500/seat/yr (3-seat min)",
        "best": "EU ecosystem mapping, founder intelligence, regional reporting",
        "blurb": "Dealroom is Europe's reference platform for startup ecosystem data: funding rounds, founder moves, hiring signals, and geography-level market maps. Its strength is regional completeness, especially in Europe, and it recently added a hosted MCP server for agent access.",
    },
    "tracxn": {
        "name": "Tracxn",
        "what": "Sector-taxonomy database, emerging-market strong",
        "price": "free Lite, Premium custom (roughly $6,000-$24,000/yr)",
        "best": "Sector taxonomy, emerging markets, company discovery",
        "blurb": "Tracxn organizes millions of companies into thousands of sectors and business models, with the deepest curated coverage in emerging markets like India and Southeast Asia. It is a strong discovery tool for sector landscapes and company lists, backed by analyst-crafted reports.",
    },
    "angellist": {
        "name": "AngelList",
        "what": "Fundraising platform (syndicates, rolling funds, jobs)",
        "price": "free to invest, 5% carry on syndicate gains",
        "best": "Syndicate investing, rolling funds, startup hiring",
        "blurb": "AngelList (with Wellfound for hiring) is the dominant platform for startup fundraising: syndicates, rolling funds, and SPVs that let accredited investors pool capital, plus a job marketplace. It is free to join and earns a 5% carried interest on syndicate gains plus fund administration fees.",
    },
    "private-equity-wire": {
        "name": "Private Equity Wire",
        "what": "Institutional PE news and data",
        "price": "EUR 2,995-EUR 6,550/yr",
        "best": "PE deal news, fundraising intel, appointments",
        "blurb": "Private Equity Wire is a news and data service covering institutional private equity across the US and Europe: deal announcements, fundraising closes, and key appointments. It keeps you current on a market but reports deals only after they are announced.",
    },
    "privco": {
        "name": "PrivCo",
        "what": "US private company financial intelligence",
        "price": "subscription, free limited account plus paid tiers",
        "best": "US private company financials, M&A, valuations",
        "blurb": "PrivCo is a financial-intelligence database focused on US private companies, with proprietary revenue, EBITDA, and valuation estimates across 5M+ companies, most of them bootstrapped or family-owned. It is built for M&A and diligence rather than early-stage deal sourcing.",
    },
    "harmonic": {
        "name": "Harmonic",
        "what": "Startup discovery engine (35M+ companies)",
        "price": "custom, roughly $25,000/yr minimum",
        "best": "Startup discovery at scale, data-driven sourcing",
        "blurb": "Harmonic is a startup discovery engine with data on 35M+ companies and 195M+ people, positioned as a Bloomberg Terminal for startups. It maps the startup landscape in real time for VC, corporate development, and GTM teams, priced for established funds.",
    },
    "affinity": {
        "name": "Affinity",
        "what": "Relationship-intelligence CRM for VC/PE",
        "price": "$2,000-$2,700/user/yr, roughly $20k minimum",
        "best": "VC relationship management, warm-intro paths, pipeline",
        "blurb": "Affinity is a relationship-intelligence CRM purpose-built for venture capital and private equity. It auto-captures email and calendar activity into a 50M+ person network graph and surfaces the warmest path to any contact, priced for funds of five or more people.",
    },
    "carta": {
        "name": "Carta",
        "what": "Cap table and equity management",
        "price": "from $280/yr Launch (scales with stakeholders)",
        "best": "Cap tables, 409A valuations, equity management",
        "blurb": "Carta is the leading cap table and equity management platform, with 409A valuations, portfolio tracking, and fund administration. It is a tool for managing the companies you have already invested in, not for finding new ones.",
    },
    "grata": {
        "name": "Grata",
        "what": "Middle-market private company intelligence",
        "price": "custom, enterprise",
        "best": "Middle-market sourcing, M&A, revenue estimates",
        "blurb": "Grata is a middle-market private company intelligence platform, with revenue estimates, EBITDA figures, ownership structures, and 800,000+ transactions for comparable analysis. It is built for M&A and buyout professionals rather than early-stage venture.",
    },
}

GDF_BLURB = ("GitDealFlow reads public GitHub activity (commit velocity, contributor growth, and repository expansion) across 350+ startups in 15 sectors every Monday, and surfaces the teams accelerating 21-47 days before a round is announced. The methodology is published open-access on SSRN (abstract 6606558) with a CC BY 4.0 dataset any investor can audit. Its free tier covers the Sunday digest, trending board, and MCP server; the Dashboard is EUR 49/month (EUR 441/year).")

# "Choose it when" guidance line per tool.
CHOOSE = {
    "crunchbase": "Choose it when you need to research a known company's history, team, and investors.",
    "pitchbook": "Choose it when you need cap tables, valuation data, and LP-grade reporting for a term sheet or fund.",
    "cb-insights": "Choose it when the deliverable is a market map or a board deck.",
    "dealroom": "Choose it when you are mapping a European ecosystem or tracking founder moves.",
    "tracxn": "Choose it when you need sector taxonomy and emerging-market company discovery.",
    "angellist": "Choose it when you are ready to deploy capital through a syndicate or run a rolling fund.",
    "private-equity-wire": "Choose it when you need to stay current on institutional PE deal news.",
    "privco": "Choose it when you need US private-company revenue and valuation estimates for diligence.",
    "harmonic": "Choose it when you need startup discovery at scale and have an enterprise budget.",
    "affinity": "Choose it when your fund needs relationship intelligence and pipeline tracking.",
    "carta": "Choose it when you need cap tables and 409A valuations for a company you already hold.",
    "grata": "Choose it when you are sourcing middle-market M&A targets.",
}

HOW_EVALUATED = ("We scored every tool on four things: signal timing (how early it catches a startup), coverage (how many companies and which geographies), data depth (funding history alone, or financials and momentum too), and cost (free tier through enterprise). GitDealFlow is included on every list because it is the only one that reads public GitHub activity as a leading indicator, flagging startups 21-47 days before a round with a methodology any investor can audit. Prices reflect public listings and third-party reports as of August 2026.")

HOW_START = ("Start with the free tier of whatever tool matches your immediate job, and only pay when a tool proves it earns its price. The most common pattern is a signal tool for sourcing plus a database for context: GitDealFlow surfaces the accelerating startup, and Crunchbase or PitchBook fills in the history. Export your shortlist to a spreadsheet or CRM as you go, and review the signal weekly rather than once a quarter, because momentum is what changes between meetings.")

GDF_BEST = "Pre-announcement sourcing: find startups before they raise"
GDF_PRICE = "Free / EUR 49/mo Dashboard"


def faq_schema(faqs):
    return json.dumps({"@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]},
        ensure_ascii=False)


def article_schema(title, desc, url):
    return json.dumps({"@context": "https://schema.org", "@type": "Article",
        "headline": title, "description": desc,
        "author": {"@type": "Organization", "name": "GitDealFlow", "url": CANONICAL},
        "publisher": {"@type": "Organization", "name": "GitDealFlow", "url": CANONICAL},
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "datePublished": "2026-08-15", "dateModified": "2026-08-15"}, ensure_ascii=False)


def breadcrumb_schema(title, url):
    return json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": CANONICAL + "/"},
            {"@type": "ListItem", "position": 2, "name": title, "item": url}]}, ensure_ascii=False)


def faq_html(faqs):
    items = "\n".join(f'            <details><summary>{q}</summary><p>{a}</p></details>' for q, a in faqs)
    return ('<section class="faq" style="margin-top:40px">\n'
            '<h2 style="font-size:1.4em;font-weight:700;margin-bottom:20px;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Frequently Asked Questions</h2>\n'
            f'{items}\n</section>')


def table_html(rows):
    trs = "\n".join(
        '<tr style="border-bottom:1px solid #e5e7eb">'
        f'<td style="padding:.75rem;font-weight:600">{a}</td>'
        f'<td style="padding:.75rem;background:#f0f7ff">{b}</td>'
        f'<td style="padding:.75rem">{c}</td></tr>' for a, b, c in rows)
    return ('<h2>Side-by-Side Comparison</h2>\n'
            '<table style="width:100%;border-collapse:collapse;margin:1.5rem 0">\n'
            '<tr style="border-bottom:2px solid #e5e7eb">'
            '<th style="text-align:left;padding:.75rem;width:28%">Tool</th>'
            '<th style="text-align:left;padding:.75rem;width:37%;background:#f0f7ff">What it is</th>'
            '<th style="text-align:left;padding:.75rem;width:35%">Starting price</th></tr>\n'
            f'{trs}\n</table>')


def render(p):
    slug = p["slug"]          # full path e.g. "alternatives-to/crunchbase-alternatives"
    title = p["title"]
    desc = p["desc"]
    h1 = p["h1"]
    intro = p["intro"]        # list of paragraphs
    tldr = p.get("tldr")      # optional TL;DR string
    tools = p["tools"]        # list of tool keys (GitDealFlow added automatically)
    criteria = p.get("criteria")  # list of (label, text) for "how to choose"
    gdf_section = p.get("gdf_section", True)
    faqs = p["faqs"]          # list of (q, a)

    url = f"{CANONICAL}/{slug}"

    # intro paragraphs
    intro_html = "\n".join(f'        <p style="font-size:1.1em;color:#333;margin-bottom:1.2em">{x}</p>' for x in intro)

    # TL;DR
    tldr_html = ""
    if tldr:
        tldr_html = f'        <p style="background:#f0f7ff;border-left:4px solid #0066cc;padding:12px 16px;margin:1.5em 0;border-radius:4px"><strong>TL;DR:</strong> {tldr}</p>'

    # comparison table rows: tool, what, price (include GitDealFlow)
    rows = [("GitDealFlow", GDF_BEST, GDF_PRICE)]
    for k in tools:
        t = TOOLS[k]
        rows.append((t["name"], t["best"], t["price"]))

    # individual tool breakdowns
    blurb_html = ['        <h2>The Alternatives, Reviewed</h2>']
    for k in tools:
        t = TOOLS[k]
        blurb_html.append(f'        <h3 style="font-size:1.15em;font-weight:700;margin:1.2em 0 .3em">{t["name"]}</h3>')
        blurb_html.append(f'        <p>{t["blurb"]}</p>')
        blurb_html.append(f'        <p style="font-size:.9em;color:#666"><strong>Best for:</strong> {t["best"]}. <strong>Pricing:</strong> {t["price"]}. {CHOOSE.get(k, "")}</p>')
    blurb_html.append('        <h3 style="font-size:1.15em;font-weight:700;margin:1.2em 0 .3em">GitDealFlow</h3>')
    blurb_html.append(f'        <p>{GDF_BLURB}</p>')
    blurb_html.append(f'        <p style="font-size:.9em;color:#666"><strong>Best for:</strong> {GDF_BEST}. <strong>Pricing:</strong> {GDF_PRICE}.</p>')
    blurb_html = "\n".join(blurb_html)

    # criteria section (for "best" pages) or "what X does well" (alternatives)
    criteria_html = ""
    if criteria:
        crit_items = "\n".join(f'            <li><strong>{lbl}:</strong> {txt}</li>' for lbl, txt in criteria)
        criteria_html = ('        <h2>How to Choose</h2>\n'
                         '        <p>Before you compare features, weigh each tool against the criteria that actually decide whether it earns its cost:</p>\n'
                         f'        <ul style="padding-left:1.4rem;line-height:1.9">{crit_items}\n        </ul>')

    # why GitDealFlow section
    gdf_html = ""
    if gdf_section:
        gdf_html = ('        <h2>Why GitDealFlow Belongs on the Shortlist</h2>\n'
                    f'        <p>{GDF_BLURB}</p>\n'
                    '        <p>Most of the tools above answer the question "who exists and what did they raise". GitDealFlow answers a different one: "who is accelerating right now, before anyone has announced anything". That timing is the difference between sourcing a deal and reading about it after the allocation is gone.</p>')

    main = f'''    <main>
        <h1 style="font-size:2em;font-weight:800;margin-bottom:.5em;line-height:1.2">{h1}</h1>
{intro_html}
{tldr_html}

        {table_html(rows)}
        {PRICE_NOTE}

{blurb_html}

{criteria_html}

{gdf_html}

        <h2>How We Evaluated</h2>
        <p>{HOW_EVALUATED}</p>

        <h2>How to Get Started</h2>
        <p>{HOW_START}</p>

        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Try GitDealFlow for free &rarr;</a></p>

        {faq_html(faqs)}
    </main>'''

    page = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>{title}</title>
    <link rel="alternate" hreflang="en" href="{url}">
    <link rel="alternate" hreflang="x-default" href="{url}"><link rel="stylesheet" href="/ux.css?v=20260808-2"><meta name="theme-color" content="#ffffff"><meta name="color-scheme" content="light">
    <meta name="description" content="{desc}">
    <link rel="canonical" href="{url}">
<link rel="manifest" href="/site.webmanifest">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="GitDealFlow">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="{OG_IMAGE}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:image" content="{OG_IMAGE}">
    <meta property="og:url" content="{url}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{desc}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <script type="application/ld+json">{faq_schema(faqs)}</script>
<script type="application/ld+json">{article_schema(title, desc, url)}</script>
<script type="application/ld+json">{breadcrumb_schema(title, url)}</script>
{POSTHOG}
<script src="/ux.js" defer></script>
  </head>
<body style="font-family:-apple-system,system-ui,sans-serif;max-width:760px;margin:60px auto;padding:0 20px;line-height:1.7;color:#1a1a1a;background:#fff">
    <header style="margin-bottom:40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem"><a href="{CANONICAL}" style="font-weight:800;font-size:1.1rem;color:#1a1a1a;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">GitDealFlow</a><nav aria-label="Primary navigation" style="display:flex;gap:1.25rem"><a href="{CANONICAL}/pricing" style="color:#0066cc;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">Pricing</a><a href="https://signals.gitdealflow.com" style="color:#0066cc;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">Live signals</a></nav></header>

{main}

    <section style="margin-top:30px;padding:20px;background:#f0f7ff;border-radius:8px;border-left:4px solid #0066cc">
        <p style="margin:0;font-weight:600">See live startup momentum data at <a href="https://signals.gitdealflow.com" style="color:#0066cc">signals.gitdealflow.com</a>. Free API, MCP server, and real-time GitHub acceleration tracking across 15 sectors, updated every Monday.</p>
    </section>

    <footer style="margin-top:60px;padding-top:20px;border-top:1px solid #e0e0e0;color:#888;font-size:.85em">
        <p><strong>GitDealFlow</strong>: See which startups are heating up before they raise.</p>
        <p><a href="{CANONICAL}" style="color:#555">Home</a> &middot; <a href="{CANONICAL}/pricing" style="color:#555">Pricing</a> &middot; <a href="https://signals.gitdealflow.com" style="color:#555">Live signals</a></p>
    </footer>

{NETWORK_STYLE}
{NETWORK_SECTION}
</body>
</html>'''

    # determine file path
    if slug.endswith(".html"):
        path = os.path.join(BASE, slug)
    else:
        path = os.path.join(BASE, slug, "index.html")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(page)
    return path


if __name__ == "__main__":
    # import the page specs from a sibling module to keep this file focused
    from expand_best_specs import PAGES
    for p in PAGES:
        path = render(p)
        print("wrote", path)
