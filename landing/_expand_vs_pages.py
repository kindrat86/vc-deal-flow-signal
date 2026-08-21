#!/usr/bin/env python3
"""
Expand the 5 thin /vs/ comparison pages on gitdealflow.com to 1,500-2,500 words
each, with a side-by-side feature table, sourced pricing, use-case scenarios,
and a 5-item FAQ (mirrored in FAQPage JSON-LD).

Models the flagship pitchbook/crunchbase pages exactly. All competitor claims
are verified against public sources (Aug 2026). No em dashes anywhere.

GitDealFlow pricing (current, from /pricing): Free Sunday digest, EUR 1 Teardown,
EUR 7 First Look, EUR 49/mo Dashboard (EUR 441/yr), EUR 197/mo Insider,
EUR 1,997 Sector Sweep. Founding window (EUR 9.97/97) CLOSED June 30.
"""
import os, json

BASE = os.path.expanduser("~/signals-gitdealflow/landing")
CANONICAL = "https://gitdealflow.com"
OG_IMAGE = "https://signals.gitdealflow.com/opengraph-image"

# Reuse the exact boilerplate blocks from the canonical pitchbook page so the
# PostHog snippet, portfolio network, and footer stay byte-identical.
SRC = open(os.path.join(BASE, "vs/pitchbook/index.html"), encoding="utf-8").read()

def grab(start, end):
    i = SRC.index(start)
    j = SRC.index(end, i) + len(end)
    return SRC[i:j]

POSTHOG = grab('<script>\n    !function(t,e)', '</script>')
NETWORK_STYLE = grab('<style>\n.portfolio-network', '</style>')
NETWORK_SECTION = grab('<section class="portfolio-network">', '</section>')

ALL_VS = [
    ("crunchbase", "GitDealFlow vs Crunchbase"),
    ("pitchbook", "GitDealFlow vs PitchBook"),
    ("cb-insights", "GitDealFlow vs CB Insights"),
    ("dealroom", "GitDealFlow vs Dealroom"),
    ("tracxn", "GitDealFlow vs Tracxn"),
    ("angellist", "GitDealFlow vs AngelList"),
    ("privateequitywire", "GitDealFlow vs Private Equity Wire"),
]

PRICE_NOTE = '<p style="font-size:.85em;color:#777;margin-top:1em">Competitor pricing reflects public listings and third-party reports as of August 2026; verify current terms before purchase. GitDealFlow pricing is current as of August 2026.</p>'


def faq_schema(faqs):
    items = []
    for q, a in faqs:
        items.append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a},
        })
    return json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": items}, ensure_ascii=False)


def breadcrumb_schema(slug, competitor):
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": CANONICAL + "/"},
            {"@type": "ListItem", "position": 2, "name": "Comparisons", "item": CANONICAL + "/vs/"},
            {"@type": "ListItem", "position": 3, "name": "vs " + competitor, "item": f"{CANONICAL}/vs/{slug}"},
        ],
    }, ensure_ascii=False)


def webpage_schema(title, meta_desc, slug, competitor):
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": meta_desc,
        "url": f"{CANONICAL}/vs/{slug}",
        "isPartOf": {"@type": "WebSite", "name": "GitDealFlow", "url": CANONICAL},
        "about": {"@type": "Thing", "name": competitor},
    }, ensure_ascii=False)


def table_html(rows, competitor):
    trs = []
    for i, (dim, gdf, comp) in enumerate(rows):
        last = '' if i < len(rows) - 1 else ''
        trs.append(
            '<tr style="border-bottom:1px solid #e5e7eb">'
            f'<td style="padding:.75rem;font-weight:600">{dim}</td>'
            f'<td style="padding:.75rem;background:#f0f7ff">{gdf}</td>'
            f'<td style="padding:.75rem">{comp}</td></tr>'
        )
    rows_html = "\n".join(trs)
    return (
        '<h2>Side-by-Side Comparison</h2>\n'
        '<table style="width:100%;border-collapse:collapse;margin:1.5rem 0">\n'
        '<tr style="border-bottom:2px solid #e5e7eb">'
        '<th style="text-align:left;padding:.75rem;width:30%">Dimension</th>'
        '<th style="text-align:left;padding:.75rem;width:35%;background:#f0f7ff">GitDealFlow</th>'
        f'<th style="text-align:left;padding:.75rem;width:35%">{competitor}</th></tr>\n'
        f'{rows_html}\n</table>'
    )


def faq_html(faqs):
    items = "\n".join(f'            <details><summary>{q}</summary><p>{a}</p></details>' for q, a in faqs)
    return (
        '<section class="faq" style="margin-top:40px">\n'
        '<h2 style="font-size:1.4em;font-weight:700;margin-bottom:20px;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Frequently Asked Questions</h2>\n'
        f'{items}\n</section>'
    )


def related_html(current_slug):
    items = []
    for slug, label in ALL_VS:
        if slug == current_slug:
            continue
        items.append(f'<li><a href="{CANONICAL}/vs/{slug}" style="color:#0066cc">{label}</a></li>')
    return (
        '<section style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0">\n'
        '<h3 style="font-size:1.1em;font-weight:700;margin-bottom:12px">Related comparisons</h3>\n'
        '<ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">\n'
        + "\n".join(items) + "\n</ul>\n</section>"
    )


def render(d):
    slug = d["slug"]
    competitor = d["competitor"]
    title = d["title"]
    meta_desc = d["meta_desc"]
    h1 = d["h1"]
    intro = d["intro"]
    table = d["table"]
    pricing = d["pricing"]
    why = d["why"]
    keydiff = d["keydiff"]
    scenarios = d["scenarios"]
    which = d["which"]
    faqs = d["faqs"]

    scenario_html = "\n".join(f'        <p><strong>{t}:</strong> {b}</p>' for t, b in scenarios)
    keydiff_html = "\n".join(f'        <p><strong>{t}:</strong> {b}</p>' for t, b in keydiff)
    why_html = "\n".join(f'        <p>{p}</p>' for p in why)
    pricing_html = "\n".join(f'        <p>{p}</p>' for p in pricing)
    which_html = "\n".join(f'        <p>{p}</p>' for p in which)

    main = f'''    <main>
        <h1 style="font-size:2em;font-weight:800;margin-bottom:.5em;line-height:1.2">{h1}</h1>
        <p style="font-size:1.1em;color:#555;margin-bottom:2em">{intro}</p>

        {table_html(table, competitor)}

        <h2>Pricing and Value Comparison</h2>
{pricing_html}
        {PRICE_NOTE}

        <h2>Why Code-Side Sourcing Is a Leading Signal While {competitor} Reports After the Fact</h2>
{why_html}

        <h2>Key Differences</h2>
{keydiff_html}

        <h2>Use-Case Scenarios</h2>
{scenario_html}

        <h2>Which Tool Should You Use When?</h2>
{which_html}

        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Try GitDealFlow for free &rarr;</a></p>

        {faq_html(faqs)}
    </main>'''

    page = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>{title}</title>
    <link rel="alternate" hreflang="en" href="{CANONICAL}/vs/{slug}">
    <link rel="alternate" hreflang="es" href="{CANONICAL}/es/vs/{slug}">
    <link rel="alternate" hreflang="de" href="{CANONICAL}/de/vs/{slug}">
    <link rel="alternate" hreflang="x-default" href="{CANONICAL}/vs/{slug}"><link rel="stylesheet" href="/ux.css?v=20260808-2"><meta name="theme-color" content="#ffffff"><meta name="color-scheme" content="light">
    <meta name="description" content="{meta_desc}">
    <link rel="canonical" href="{CANONICAL}/vs/{slug}">
<link rel="manifest" href="/site.webmanifest">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="GitDealFlow">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{meta_desc}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="{OG_IMAGE}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:image" content="{OG_IMAGE}">
    <meta property="og:url" content="{CANONICAL}/vs/{slug}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{meta_desc}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <script type="application/ld+json">{faq_schema(faqs)}</script>
<script type="application/ld+json">{breadcrumb_schema(slug, competitor)}</script>
<script type="application/ld+json">{webpage_schema(title, meta_desc, slug, competitor)}</script>
{POSTHOG}
<script src="/ux.js" defer></script>
  </head>
<body style="font-family:-apple-system,system-ui,sans-serif;max-width:760px;margin:60px auto;padding:0 20px;line-height:1.7;color:#1a1a1a;background:#fff">
    <header style="margin-bottom:40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem"><a href="{CANONICAL}" style="font-weight:800;font-size:1.1rem;color:#1a1a1a;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">GitDealFlow</a><nav aria-label="Primary navigation" style="display:flex;gap:1.25rem"><a href="{CANONICAL}/pricing" style="color:#0066cc;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">Pricing</a><a href="https://signals.gitdealflow.com" style="color:#0066cc;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">Live signals</a></nav></header>

{main}

    {related_html(slug)}

    <section style="margin-top:30px;padding:20px;background:#f0f7ff;border-radius:8px;border-left:4px solid #0066cc">
        <p style="margin:0;font-weight:600">See live startup momentum data at <a href="https://signals.gitdealflow.com" style="color:#0066cc">signals.gitdealflow.com</a>. Free API, MCP server, and real-time GitHub acceleration tracking across 15 sectors, updated every Monday.</p>
    </section>

    <section style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0">
        <h3 style="font-size:1.1em;font-weight:700;margin-bottom:12px">Open data and research</h3>
        <ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
<li><a href="{CANONICAL}/data/momentum-index" style="color:#0066cc">GitHub Momentum Index (40 repos ranked)</a></li>
<li><a href="https://signals.gitdealflow.com/methodology" style="color:#0066cc">Full methodology (SSRN preprint)</a></li>
<li><a href="{CANONICAL}/datasets" style="color:#0066cc">Open datasets catalog (10 CC BY 4.0 datasets)</a></li>
        </ul>
    </section>

    <footer style="margin-top:60px;padding-top:20px;border-top:1px solid #e0e0e0;color:#888;font-size:.85em">
        <p><strong>GitDealFlow</strong>: See which startups are heating up before they raise.</p>
        <p><a href="{CANONICAL}" style="color:#555">Home</a> &middot; <a href="{CANONICAL}/pricing" style="color:#555">Pricing</a> &middot; <a href="https://signals.gitdealflow.com" style="color:#555">Live signals</a> &middot; <a href="{CANONICAL}/datasets" style="color:#555">Open data</a></p>
    </footer>

{NETWORK_STYLE}
{NETWORK_SECTION}
</body>
</html>'''

    path = os.path.join(BASE, "vs", slug, "index.html")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(page)
    return path


# ── COMPETITOR CONTENT ──────────────────────────────────────────────────────

COMPETITORS = [
    {
        "slug": "angellist",
        "competitor": "AngelList",
        "title": "GitDealFlow vs AngelList: Signal vs Fundraising Platform",
        "meta_desc": "GitDealFlow vs AngelList comparison: GitDealFlow flags startups accelerating on GitHub 21-47 days before they raise. AngelList is where you deploy capital into syndicates and rolling funds. See which fits your workflow.",
        "h1": "GitDealFlow vs AngelList: Find the deal, then fund the deal",
        "intro": "AngelList (with Wellfound for hiring) is the dominant platform for startup fundraising: syndicates, rolling funds, and SPVs let accredited investors pool capital into deals, and its job marketplace connects founders with early hires. GitDealFlow is a leading-indicator signal feed that reads public GitHub engineering activity across 350+ startups and flags breakout momentum 21-47 days before a round is announced. They solve different halves of the same problem: GitDealFlow tells you which startup to back, and AngelList gives you the rails to back it.",
        "table": [
            ("Core function", "Pre-announcement sourcing: flags startups accelerating before they raise", "Fundraising infrastructure: syndicates, rolling funds, SPVs, and a job marketplace"),
            ("Data source", "Public GitHub: commit velocity, contributor diversity, repo expansion", "Self-reported startup profiles, investor network, and syndicate deal activity"),
            ("Signal type", "Leading indicator (21-47 days ahead of the round)", "Coincident: a deal appears once a lead has already opened a syndicate"),
            ("Coverage", "350+ startups across 15 sectors, pre-seed to Series B", "Tens of thousands of startups and investors across syndicates, funds, and jobs"),
            ("Free tier", "Sunday digest (5 names), trending board, sector search, MCP server, Chrome extension", "Free to join and browse as an accredited investor"),
            ("Starting price", "Free, then EUR 49/mo Dashboard (EUR 441/yr); EUR 7 First Look and EUR 1 Teardown one-time", "Free to invest; AngelList earns 5% carried interest on syndicate gains plus fund admin fees"),
            ("API access", "Free MCP server, OpenAPI 3.1, A2A, NLWeb, JSON and CSV", "No public self-serve API; data lives inside the platform"),
            ("Best for", "Finding the deal before it is on anyone's radar", "Deploying capital into SPVs and syndicates, running a rolling fund, hiring early staff"),
            ("Methodology", "Open: SSRN preprint (abstract 6606558), CC BY 4.0 dataset", "Platform mechanics; not a predictive methodology"),
        ],
        "pricing": [
            "AngelList is free to join as an investor: backers pay nothing to browse deals or commit to syndicates. AngelList makes its money on performance, taking a 5% carried interest on syndicate gains plus fund administration fees on rolling funds, while syndicate leads keep their own carry. There is no monthly subscription to buy a seat on AngelList. GitDealFlow's free tier covers the Sunday digest (five accelerating startups every week), the live trending board, sector search, and full MCP server access. The paid Dashboard tier is EUR 49/month (EUR 441/year) for the full ranked field of 140+ startups refreshed weekly, with a EUR 7 First Look Pass and a EUR 1 Tweet Teardown as low-cost entry points.",
            "The two cost models are fundamentally different: AngelList only costs you when you make money, while GitDealFlow costs a flat monthly fee for a steady signal. For an angel who writes a handful of cheques a year, the pair is complementary: pay EUR 49/month for the sourcing signal, and pay AngelList's carry only when a syndicated deal actually returns.",
        ],
        "why": [
            "AngelList's data tells you what is already being funded. When a syndicate lead opens a deal on AngelList, the round is effectively in motion: the lead has committed, the valuation is set, and backers are filling the SPV. That is a strong coincident signal, but it is not an early one. The engineering activity that convinced the lead to commit happened weeks earlier, and it happened in public on GitHub.",
            "GitDealFlow reads that earlier layer. The SSRN research panel (n=219 confirmed fundraises) found that a composite of commit-velocity acceleration plus low top-contributor concentration (Gini under 0.30) preceded a Series A announcement by a median of 31 days, with a range of 21-47 days across sectors. A startup whose GitHub is surging is one a syndicate lead is about to notice. GitDealFlow lets you notice first.",
            "This is why the two tools compound: GitDealFlow surfaces the name before any syndicate opens, and AngelList is often where you deploy once you are convinced. One is the radar; the other is the trigger.",
        ],
        "keydiff": [
            ("Objective signal vs self-reported profile", "GitDealFlow reads activity a startup cannot easily fake at scale (public commit velocity, contributor growth, repo expansion). AngelList profiles are company-authored, and syndicate activity reflects a lead's marketing as much as the startup's momentum."),
            ("Sourcing vs execution", "GitDealFlow's entire product is the short list of names you would otherwise miss. AngelList's product is the legal, regulatory, and back-office machinery for investing once you have a name."),
            ("Investor vs operator audience", "GitDealFlow is built for investors and scouts who need proprietary deal flow. AngelList serves both sides: investors deploying capital, and founders raising it or hiring."),
        ],
        "scenarios": [
            ("The solo angel building deal flow", "Start with GitDealFlow's free Sunday digest. For the names that match your thesis, check GitHub momentum history, then watch AngelList to see if a syndicate lead you trust opens an SPV. You form your own read early, and validate it against the crowd."),
            ("The emerging fund manager running a rolling fund", "AngelList Rolling Funds is your infrastructure (subscriptions, capital calls, reporting). GitDealFlow is your top of funnel: a weekly ranked list of accelerating startups across your target sectors, exported as CSV into your CRM."),
            ("The scout who needs a steady Monday list", "GitDealFlow's Dashboard gives you 140+ ranked startups every week with a one-line reason each is moving. AngelList adds the social layer: who else is backing it, and whether a syndicate is already forming."),
        ],
        "which": [
            "<strong>Use GitDealFlow for:</strong> finding the startup before any syndicate opens, tracking engineering momentum week over week, and building a pipeline without a warm network.",
            "<strong>Use AngelList for:</strong> deploying capital into SPVs and syndicates, running a rolling fund, and hiring early engineers through Wellfound.",
            "<strong>Use both:</strong> GitDealFlow to choose the deal, and AngelList to execute it.",
        ],
        "faqs": [
            ("Is GitDealFlow a replacement for AngelList?", "No. GitDealFlow finds the deal before it is fundable; AngelList is the fundraising and syndication infrastructure you use after you decide to invest. They are complementary."),
            ("How much does GitDealFlow cost vs AngelList?", "AngelList is free to join as an investor and earns a 5% carry on syndicate gains plus fund admin fees, so you only pay on performance. GitDealFlow has a free tier and a EUR 49/month Dashboard (EUR 441/year), with EUR 7 First Look and EUR 1 Teardown entry points."),
            ("Can I use GitDealFlow and AngelList together?", "Yes, and the workflow is natural: GitDealFlow surfaces the accelerating startup, you diligence the momentum, then deploy through an AngelList syndicate or SPV when one is available."),
            ("Does AngelList show engineering momentum?", "No. AngelList shows who is raising, hiring, and syndicating, not commit velocity or contributor growth. GitDealFlow tracks the public GitHub activity that AngelList does not collect."),
            ("Which is better for a first-time angel?", "Start with GitDealFlow's free digest to build your own deal flow, and use AngelList to invest when you find syndicates led by investors you respect. The free tiers of both together cost nothing."),
        ],
    },
    {
        "slug": "cb-insights",
        "competitor": "CB Insights",
        "title": "GitDealFlow vs CB Insights: Early Signal vs Market Intel",
        "meta_desc": "GitDealFlow vs CB Insights comparison: GitDealFlow reads GitHub commit velocity to flag startups 21-47 days before they raise. CB Insights provides analyst-grade market maps and Mosaic scores. Pricing, data, and use cases.",
        "h1": "GitDealFlow vs CB Insights: Momentum signal or market intelligence?",
        "intro": "CB Insights is the institutional standard for technology market intelligence: analyst research, market maps, Mosaic scores, patent data, and expert collections used by corporate strategy teams and large funds. GitDealFlow is a focused leading-indicator feed that reads public GitHub engineering activity across 350+ startups and flags breakout momentum 21-47 days before a round is announced. CB Insights explains the market; GitDealFlow tells you who inside it is about to move.",
        "table": [
            ("Core function", "Pre-announcement deal sourcing", "Market intelligence, tech trend analysis, competitive landscape"),
            ("Data source", "Public GitHub: commit velocity, contributor diversity, repo expansion", "Proprietary data, analyst research, patents, news, and funding records"),
            ("Signal type", "Leading indicator (21-47 days ahead)", "Analytical: curated market maps and Mosaic scores on a periodic cadence"),
            ("Coverage", "350+ startups across 15 sectors, pre-seed to Series B", "Millions of private companies plus patents, news, and research across industries"),
            ("Free tier", "Sunday digest, trending board, sector search, MCP server, Chrome extension", "No self-serve free tier; a research newsletter and some public reports only"),
            ("Starting price", "Free, then EUR 49/mo Dashboard (EUR 441/yr); EUR 7 First Look, EUR 1 Teardown", "Custom-quoted; third-party reports place the floor near $50,000/year"),
            ("API access", "Free MCP server, OpenAPI 3.1, A2A, NLWeb, JSON and CSV", "Enterprise tier, custom-quoted"),
            ("Best for", "Early-stage deal sourcing and portfolio momentum tracking", "Corporate strategy, market mapping, board decks, competitive intelligence"),
            ("Methodology", "Open: SSRN preprint (abstract 6606558), CC BY 4.0 dataset", "Proprietary analyst plus ML scoring (Mosaic)"),
        ],
        "pricing": [
            "CB Insights does not publish list pricing; everything is custom-quoted with an annual commitment. Third-party sources consistently place the floor around $50,000 per year, with typical contracts landing between $50,000 and $265,000 depending on seats, modules, and negotiation, and no self-serve tier below that. GitDealFlow's free tier covers the Sunday digest, trending board, sector search, and full MCP server access. The paid Dashboard is EUR 49/month (EUR 441/year), with EUR 7 First Look and EUR 1 Teardown entry points.",
            "They serve different budgets for different jobs. CB Insights is a line item for a corporate strategy or fund research budget; GitDealFlow is a self-serve subscription an individual investor can put on a personal card. The data overlap is near zero, so the price gap is not a like-for-like comparison: it is the difference between buying market context and buying an early signal.",
        ],
        "why": [
            "CB Insights' edge is analyst depth. Human researchers build market maps, interview industry participants, and score companies with the Mosaic algorithm. That depth is genuinely useful for understanding a market's structure, but it is inherently periodic: a report or a map is a snapshot taken weeks ago and published on a schedule.",
            "GitDealFlow's edge is recency and objectivity. Every Monday it reads the prior week's GitHub activity and reranks 350+ startups by velocity deviation from their own baseline. The SSRN panel (n=219) found the composite signal (velocity acceleration plus low contributor concentration, Gini under 0.30) preceded a Series A announcement by a median of 31 days. No analyst cycle required: the code ships and the signal updates.",
            "The honest framing: CB Insights tells you the shape of a sector, and GitDealFlow tells you the name that is about to break out inside it. A corporate VC team uses both: the market map for the strategy memo, and the signal feed for the actual sourcing.",
        ],
        "keydiff": [
            ("Analyst curation vs algorithmic feed", "CB Insights combines human research with ML scoring; GitDealFlow is a deterministic weekly batch process over public GitHub. One is curated depth, the other is raw recency."),
            ("Market intelligence vs deal discovery", "CB Insights answers what is happening in this market; GitDealFlow answers which specific startups are accelerating right now."),
            ("Report cadence vs weekly refresh", "CB Insights research ships on a calendar; GitDealFlow's leaderboard updates every Monday from the prior week's code activity, so the ranking is always current."),
        ],
        "scenarios": [
            ("Corporate venture team sizing a new category", "Use CB Insights for the market map, funding history, and competitive landscape, then run GitDealFlow to identify the specific startups in that category with the fastest engineering momentum for a shortlist."),
            ("Solo GP who needs a pipeline, not a report", "CB Insights at $50,000/year is overkill. GitDealFlow's EUR 49/month Dashboard gives you 140+ ranked startups weekly with a one-line reason each is moving."),
            ("Fund doing quarterly LP reporting", "CB Insights' Mosaic scores and market maps slot straight into the deck. GitDealFlow adds a forward-looking layer: which portfolio and prospect companies are accelerating technically right now."),
        ],
        "which": [
            "<strong>Use GitDealFlow for:</strong> finding deals before they are announced, tracking weekly engineering momentum, and sourcing on an individual budget.",
            "<strong>Use CB Insights for:</strong> market maps, competitive intelligence, patent analysis, and board-level research.",
            "<strong>Use both:</strong> the map from CB Insights, and the timing from GitDealFlow.",
        ],
        "faqs": [
            ("Is GitDealFlow a replacement for CB Insights?", "No. CB Insights is market intelligence for strategy and research; GitDealFlow is an early deal-flow signal. They answer different questions."),
            ("How much does GitDealFlow cost vs CB Insights?", "CB Insights is custom-quoted, with third-party reports placing the floor near $50,000/year. GitDealFlow has a free tier and a EUR 49/month Dashboard (EUR 441/year), with EUR 7 First Look and EUR 1 Teardown entry points."),
            ("Can I use GitDealFlow and CB Insights together?", "Yes. Use CB Insights for the market map and competitive context, and GitDealFlow for the weekly engineering momentum that tells you which names to shortlist."),
            ("Does CB Insights track GitHub activity?", "No. CB Insights tracks funding, patents, news, M&A, and analyst research. It does not track commit velocity or contributor growth the way GitDealFlow does."),
            ("Which signal is faster?", "GitDealFlow updates weekly from public GitHub activity, so momentum appears within days. CB Insights research is deeper but ships on a longer, periodic cadence."),
        ],
    },
    {
        "slug": "dealroom",
        "competitor": "Dealroom",
        "title": "GitDealFlow vs Dealroom: Engineering vs Ecosystem Data",
        "meta_desc": "GitDealFlow vs Dealroom comparison: GitDealFlow reads GitHub commit velocity to flag startups 21-47 days before they raise. Dealroom is the source of record for EU startup ecosystems. Pricing, data, and use cases.",
        "h1": "GitDealFlow vs Dealroom: Engineering momentum or ecosystem coverage?",
        "intro": "Dealroom is Europe's reference platform for startup and tech ecosystem data: funding rounds, founder tracking, job postings, and geography-level market maps used by investors, corporates, and governments, with especially deep European coverage. GitDealFlow is a leading-indicator signal feed that reads public GitHub engineering activity across 350+ startups and flags breakout momentum 21-47 days before a round is announced. Dealroom maps the ecosystem; GitDealFlow reads the code inside it.",
        "table": [
            ("Core function", "Pre-announcement deal sourcing", "Tech ecosystem data and startup database, strongest in Europe"),
            ("Data source", "Public GitHub: commit velocity, contributor diversity, repo expansion", "Funding rounds, founder tracking, job postings, geography and ecosystem data"),
            ("Signal type", "Leading indicator (21-47 days ahead)", "Ecosystem intelligence: funding, founder moves, and geo momentum"),
            ("Coverage", "350+ startups across 15 sectors, global GitHub footprint", "One million plus companies, deep European coverage, global ecosystem"),
            ("Free tier", "Sunday digest, trending board, sector search, MCP server, Chrome extension", "A 3-day Premium trial; no permanent free tier"),
            ("Starting price", "Free, then EUR 49/mo Dashboard (EUR 441/yr); EUR 7 First Look, EUR 1 Teardown", "Custom-priced; third-party sources cite roughly EUR 12,500/seat/year with a three-seat minimum"),
            ("API access", "Free MCP server, OpenAPI 3.1, A2A, NLWeb, JSON and CSV", "REST API and a hosted MCP server on paid tiers"),
            ("Best for", "Finding deals before they are announced, momentum tracking", "EU ecosystem mapping, regional deal flow, founder and hiring intelligence"),
            ("Methodology", "Open: SSRN preprint (abstract 6606558), CC BY 4.0 dataset", "Proprietary data collection and ecosystem modeling"),
        ],
        "pricing": [
            "Dealroom is custom-priced, and third-party sources cite roughly EUR 12,500 per seat per year for Premium with a three-seat minimum, putting a real entry point around EUR 37,500/year before API access. It offers a short free trial but no permanent free tier. GitDealFlow's free tier covers the Sunday digest, trending board, sector search, and full MCP server access; the paid Dashboard is EUR 49/month (EUR 441/year), with EUR 7 First Look and EUR 1 Teardown entry points.",
            "Both products recently added an MCP server, so the gap is narrowing on the distribution side. The difference is the underlying signal: Dealroom's value is breadth across companies, founders, and geographies; GitDealFlow's value is a narrow, deep, real-time read on engineering momentum. The price gap reflects breadth versus focus.",
        ],
        "why": [
            "Dealroom's strength is ecosystem completeness, especially in Europe. If you need to know every startup in Berlin or Amsterdam, who founded them, what they raised, and who is hiring, Dealroom is the source of record. That data is rich but lagging: a funding round or a founder move appears after it is public.",
            "GitDealFlow reads the earlier, objective layer: public GitHub activity. The SSRN panel (n=219) found the composite signal of commit-velocity acceleration plus low top-contributor concentration (Gini under 0.30) preceded a Series A announcement by a median of 31 days. A startup's engineering surge shows up on GitHub weeks before it shows up in any ecosystem database.",
            "For an EU-focused fund, the two combine cleanly: Dealroom for the regional map and founder network, and GitDealFlow for the engineering signal that tells you which of those companies is actually accelerating right now.",
        ],
        "keydiff": [
            ("Ecosystem vs engineering", "Dealroom models the ecosystem (companies, founders, jobs, geos); GitDealFlow models the code (commits, contributors, repos)."),
            ("European strength vs global GitHub", "Dealroom's deepest coverage is Europe; GitDealFlow reads public GitHub activity wherever a startup ships, so its footprint is global by construction."),
            ("Founder and hiring intelligence vs commit velocity", "Dealroom tracks founder moves and hiring; GitDealFlow tracks shipping speed, which is the leading indicator that precedes the founder news."),
        ],
        "scenarios": [
            ("EU-focused fund mapping a region", "Dealroom gives you the full startup, founder, and funding map of the region. GitDealFlow adds the forward-looking layer: which of those companies are accelerating on GitHub right now."),
            ("Global investor who wants timing", "Dealroom's EU depth is less relevant if your mandate is global. GitDealFlow's GitHub-based signal covers 15 sectors worldwide and updates every Monday."),
            ("Government or ecosystem program tracking regional momentum", "Dealroom is the reporting standard for ecosystem dashboards. GitDealFlow supplements it with a technical momentum read that is objective and reproducible."),
        ],
        "which": [
            "<strong>Use GitDealFlow for:</strong> pre-announcement sourcing and weekly momentum tracking across sectors.",
            "<strong>Use Dealroom for:</strong> EU ecosystem mapping, founder and hiring intelligence, and regional reporting.",
            "<strong>Use both:</strong> the ecosystem map from Dealroom, and the timing from GitDealFlow.",
        ],
        "faqs": [
            ("Is GitDealFlow a replacement for Dealroom?", "No. Dealroom is an ecosystem database with deep European coverage; GitDealFlow is an engineering-momentum signal. They complement each other."),
            ("How much does GitDealFlow cost vs Dealroom?", "Dealroom is custom-priced, with third-party sources citing roughly EUR 12,500/seat/year and a three-seat minimum. GitDealFlow has a free tier and a EUR 49/month Dashboard (EUR 441/year), with EUR 7 First Look and EUR 1 Teardown entry points."),
            ("Can I use GitDealFlow and Dealroom together?", "Yes. Use Dealroom for the ecosystem map and founder network, and GitDealFlow for the engineering signal that flags which companies are accelerating now."),
            ("Does Dealroom track GitHub commits?", "No. Dealroom tracks funding, founders, hiring, and ecosystem data. It does not track commit velocity or contributor growth the way GitDealFlow does."),
            ("Which has better European coverage?", "Dealroom is the reference for European ecosystem data. GitDealFlow reads public GitHub activity globally, so it covers European startups through their code rather than through curated profiles."),
        ],
    },
    {
        "slug": "privateequitywire",
        "competitor": "Private Equity Wire",
        "title": "GitDealFlow vs Private Equity Wire: Signal vs PE News",
        "meta_desc": "GitDealFlow vs Private Equity Wire comparison: GitDealFlow flags startups accelerating on GitHub 21-47 days before they raise. Private Equity Wire covers PE deal news after it is announced. Which fits your workflow.",
        "h1": "GitDealFlow vs Private Equity Wire: Predict the deal or read about it?",
        "intro": "Private Equity Wire is a news and data service covering institutional private equity across the US and Europe: deal announcements, fundraising closes, and key appointments. GitDealFlow is a leading-indicator signal feed that reads public GitHub engineering activity across 350+ startups and flags breakout momentum 21-47 days before a round is announced. Private Equity Wire reports the deal after it is done; GitDealFlow surfaces the company before it is one.",
        "table": [
            ("Core function", "Pre-announcement sourcing signal", "PE news, deal announcements, fundraising and appointments coverage"),
            ("Data source", "Public GitHub: commit velocity, contributor diversity, repo expansion", "Journalism and editorial coverage of announced PE activity"),
            ("Signal type", "Leading indicator (21-47 days ahead)", "Lagging: reports deals and fundraises after they are public"),
            ("Coverage", "350+ startups across 15 sectors, pre-seed to Series B", "Institutional PE across the US and Europe"),
            ("Free tier", "Sunday digest, trending board, sector search, MCP server, Chrome extension", "Limited free content; full access via subscription"),
            ("Starting price", "Free, then EUR 49/mo Dashboard (EUR 441/yr); EUR 7 First Look, EUR 1 Teardown", "EUR 2,995 to EUR 6,550 per year (higher tier includes database access)"),
            ("API access", "Free MCP server, OpenAPI 3.1, A2A, NLWeb, JSON and CSV", "No self-serve API"),
            ("Best for", "Finding early-stage software companies before they raise", "Staying current on PE deal flow, fundraising, and industry news"),
            ("Methodology", "Open: SSRN preprint (abstract 6606558), CC BY 4.0 dataset", "Editorial journalism; not a predictive methodology"),
        ],
        "pricing": [
            "Private Equity Wire is subscription-based, with third-party sources citing EUR 2,995 to EUR 6,550 per year, where the higher tier includes database access. GitDealFlow's free tier covers the Sunday digest, trending board, sector search, and full MCP server access; the paid Dashboard is EUR 49/month (EUR 441/year), with EUR 7 First Look and EUR 1 Teardown entry points.",
            "The more important difference is what you are buying. A Private Equity Wire subscription keeps you informed about a market; a GitDealFlow subscription gives you a repeatable, objective signal for finding software companies before they become market news. For a deal-sourcing investor, the second is the edge.",
        ],
        "why": [
            "Private Equity Wire is a news product, and news is inherently lagging: an editor can only write about a deal once it is announced, and by then the allocation is gone. That is not a flaw, it is the definition of news. It is useful for staying current on a market, but it cannot give you a head start.",
            "GitDealFlow reads the layer that precedes the news: public GitHub activity. The SSRN panel (n=219) found the composite signal of commit-velocity acceleration plus low top-contributor concentration (Gini under 0.30) preceded a Series A announcement by a median of 31 days. For a PE firm sourcing software assets, that signal can flag which companies are accelerating technically months before a sell-side process begins.",
            "Different audiences, different stages: Private Equity Wire serves the LP, allocator, and deal professional who needs to track a market; GitDealFlow serves the investor who wants to be early to a specific company.",
        ],
        "keydiff": [
            ("News vs signal", "Private Equity Wire is editorial coverage of announced activity; GitDealFlow is an algorithmic read on unannounced engineering momentum."),
            ("PE focus vs VC focus", "Private Equity Wire covers institutional private equity; GitDealFlow tracks venture-backed startups from pre-seed to Series B."),
            ("Readership vs sourcing", "Private Equity Wire optimizes for readers staying informed; GitDealFlow optimizes for investors building proprietary deal flow."),
        ],
        "scenarios": [
            ("PE professional tracking a market", "Private Equity Wire keeps you current on deals, fundraising, and personnel moves. Pair it with GitDealFlow when you want to spot software companies building aggressively before they reach a process."),
            ("Venture investor who wants timing", "Private Equity Wire's PE focus is the wrong lens for early-stage VC. GitDealFlow's GitHub-based signal across 15 sectors is the right tool."),
            ("Corporate development team sourcing software targets", "GitDealFlow flags which companies are accelerating technically; Private Equity Wire provides the market and deal context once a target is in diligence."),
        ],
        "which": [
            "<strong>Use GitDealFlow for:</strong> finding early-stage software companies before they are on anyone's radar.",
            "<strong>Use Private Equity Wire for:</strong> staying current on institutional PE deal flow and fundraising news.",
            "<strong>Use both:</strong> GitDealFlow for the early signal, and Private Equity Wire for market context during diligence.",
        ],
        "faqs": [
            ("Is GitDealFlow a replacement for Private Equity Wire?", "No. Private Equity Wire is a news and data service; GitDealFlow is a pre-announcement sourcing signal. They serve different needs."),
            ("How much does GitDealFlow cost vs Private Equity Wire?", "Private Equity Wire is EUR 2,995 to EUR 6,550 per year by subscription. GitDealFlow has a free tier and a EUR 49/month Dashboard (EUR 441/year), with EUR 7 First Look and EUR 1 Teardown entry points."),
            ("Can I use GitDealFlow and Private Equity Wire together?", "Yes. Use GitDealFlow to find software companies building aggressively, and Private Equity Wire for market and deal context during diligence."),
            ("Does Private Equity Wire predict rounds?", "No. It reports deals and fundraises after they are announced. GitDealFlow is designed to flag companies before they raise."),
            ("Is GitDealFlow for PE investors?", "GitDealFlow tracks venture-backed startups from pre-seed to Series B, so it is best for early-stage and growth sourcing. It can flag software companies accelerating before a sell-side process, but it does not replace PE financial data."),
        ],
    },
    {
        "slug": "tracxn",
        "competitor": "Tracxn",
        "title": "GitDealFlow vs Tracxn: Velocity vs Sector Taxonomy",
        "meta_desc": "GitDealFlow vs Tracxn comparison: GitDealFlow reads GitHub commit velocity to flag startups 21-47 days before they raise. Tracxn is a sector-taxonomy database with emerging-market strength. Pricing, data, use cases.",
        "h1": "GitDealFlow vs Tracxn: Engineering velocity or sector taxonomy?",
        "intro": "Tracxn is a sector-organized startup and market-intelligence platform with a massive taxonomy: millions of companies mapped across thousands of sectors, with particular strength in emerging markets like India and Southeast Asia. GitDealFlow is a focused leading-indicator feed that reads public GitHub engineering activity across 350+ startups and flags breakout momentum 21-47 days before a round is announced. Tracxn organizes the market into sectors; GitDealFlow tells you which companies inside a sector are accelerating.",
        "table": [
            ("Core function", "Pre-announcement deal sourcing", "Sector-taxonomy database and market intelligence"),
            ("Data source", "Public GitHub: commit velocity, contributor diversity, repo expansion", "Web and public sources plus analyst curation, organized by taxonomy"),
            ("Signal type", "Leading indicator (21-47 days ahead)", "Database plus sector reports, lagging and periodic"),
            ("Coverage", "350+ startups across 15 sectors, pre-seed to Series B", "7.7M+ companies, 3k+ sectors, 290k+ investors, strong emerging markets"),
            ("Free tier", "Sunday digest, trending board, sector search, MCP server, Chrome extension", "A free Lite tier with limited personal-use access"),
            ("Starting price", "Free, then EUR 49/mo Dashboard (EUR 441/yr); EUR 7 First Look, EUR 1 Teardown", "Lite free; Premium custom-quoted (third-party sources cite roughly $6,000 to $24,000/year)"),
            ("API access", "Free MCP server, OpenAPI 3.1, A2A, NLWeb, JSON and CSV", "Enterprise tier, custom"),
            ("Best for", "Timing and early signal on specific startups", "Sector coverage and emerging-market discovery"),
            ("Methodology", "Open: SSRN preprint (abstract 6606558), CC BY 4.0 dataset", "Proprietary taxonomy and analyst curation"),
        ],
        "pricing": [
            "Tracxn offers a free Lite tier for limited personal use, with Premium custom-quoted. Third-party sources cite roughly $6,000 to $24,000 per year depending on coverage and seats, and there is no self-serve mid-tier. GitDealFlow's free tier covers the Sunday digest, trending board, sector search, and full MCP server access; the paid Dashboard is EUR 49/month (EUR 441/year), with EUR 7 First Look and EUR 1 Teardown entry points.",
            "Both products have a genuine free tier, which is unusual in this category. The difference is breadth versus timing: Tracxn's paid value is the depth of its sector taxonomy and emerging-market coverage; GitDealFlow's paid value is a weekly, objective engineering-momentum signal that updates every Monday.",
        ],
        "why": [
            "Tracxn's edge is taxonomy breadth: millions of companies organized into thousands of sectors and business models, with analyst-crafted sector reports. That is powerful for mapping a market, especially in emerging geographies where other databases are thin. But a taxonomy is a classification of the past: it tells you what a company does and did, not what it is about to do.",
            "GitDealFlow's edge is timing and objectivity. The SSRN panel (n=219) found the composite signal of commit-velocity acceleration plus low top-contributor concentration (Gini under 0.30) preceded a Series A announcement by a median of 31 days. A company that just tripled its shipping pace shows up in GitDealFlow's Monday leaderboard before it shows up in any sector report.",
            "For emerging-market investors, the combination is natural: Tracxn for the sector landscape and company discovery, and GitDealFlow for the engineering signal that tells you which of those companies is accelerating right now.",
        ],
        "keydiff": [
            ("Taxonomy breadth vs signal depth", "Tracxn classifies millions of companies; GitDealFlow tracks a focused set of 350+ by engineering momentum."),
            ("Emerging-market strength vs global GitHub", "Tracxn's strongest coverage is India, Southeast Asia, and emerging markets; GitDealFlow reads public GitHub activity globally by construction."),
            ("Sector reports vs weekly feed", "Tracxn ships analyst sector reports on a cadence; GitDealFlow reranks its leaderboard every Monday from the prior week's code."),
        ],
        "scenarios": [
            ("Emerging-market investor building a sector view", "Use Tracxn for the sector landscape and company list in India or Southeast Asia, then run GitDealFlow for the engineering-momentum read on the shortlist."),
            ("Global investor who wants the early signal", "Tracxn's taxonomy is helpful, but GitDealFlow's weekly GitHub-based leaderboard is the faster, more objective timing signal across 15 sectors."),
            ("Analyst writing a sector deep-dive", "Tracxn's taxonomy and reports give structure; GitDealFlow's commit-velocity and contributor-growth data give the forward-looking evidence of who is actually shipping."),
        ],
        "which": [
            "<strong>Use GitDealFlow for:</strong> pre-announcement timing and weekly momentum tracking.",
            "<strong>Use Tracxn for:</strong> sector taxonomy, emerging-market coverage, and company discovery.",
            "<strong>Use both:</strong> the sector map from Tracxn, and the timing from GitDealFlow.",
        ],
        "faqs": [
            ("Is GitDealFlow a replacement for Tracxn?", "No. Tracxn is a sector-taxonomy database with emerging-market strength; GitDealFlow is an engineering-momentum signal. They are complementary."),
            ("How much does GitDealFlow cost vs Tracxn?", "Tracxn has a free Lite tier and custom-priced Premium (third-party sources cite roughly $6,000 to $24,000/year). GitDealFlow has a free tier and a EUR 49/month Dashboard (EUR 441/year), with EUR 7 First Look and EUR 1 Teardown entry points."),
            ("Can I use GitDealFlow and Tracxn together?", "Yes. Use Tracxn for the sector landscape and company list, and GitDealFlow for the engineering signal that flags which companies are accelerating now."),
            ("Does Tracxn track GitHub activity?", "No. Tracxn organizes companies by taxonomy and tracks funding and business models. It does not track commit velocity or contributor growth the way GitDealFlow does."),
            ("Which is better for emerging markets?", "Tracxn has the deepest curated emerging-market coverage. GitDealFlow reads public GitHub activity globally, so it covers emerging-market startups through their code where they ship publicly."),
        ],
    },
]


if __name__ == "__main__":
    for d in COMPETITORS:
        p = render(d)
        print("wrote", p)
