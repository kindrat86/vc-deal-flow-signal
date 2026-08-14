#!/usr/bin/env python3
"""Expand thin pSEO pages on gitdealflow.com with rich content, schema, OG image, hreflang."""
import os, re, json
from datetime import date

BASE = os.path.expanduser("~/signals-gitdealflow/landing")
TODAY = date.today().isoformat()
PRODUCT = "GitDealFlow"
CANONICAL = "https://gitdealflow.com"
OG_IMAGE = "https://signals.gitdealflow.com/opengraph-image"
OG_IMAGE_W = "1200"
OG_IMAGE_H = "630"

def make_schema_blocks(title, desc, path, faqs, breadcrumbs):
    """Generate FAQPage + BreadcrumbList schema blocks."""
    faq_items = []
    for q, a in faqs:
        faq_items.append(
            '{"@type":"Question","name":%s,"acceptedAnswer":{"@type":"Answer","text":%s}}'
            % (json.dumps(q), json.dumps(a))
        )
    
    bc_items = []
    for i, (name, url) in enumerate(breadcrumbs, 1):
        bc_items.append(
            '{"@type":"ListItem","position":%d,"name":%s,"item":%s}'
            % (i, json.dumps(name), json.dumps(url))
        )
    
    faq_block = (
        '<script type="application/ld+json">'
        '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[%s]}'
        '</script>' % ",".join(faq_items)
    ) if faqs else ""
    
    bc_block = (
        '<script type="application/ld+json">'
        '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[%s]}'
        '</script>' % ",".join(bc_items)
    )
    
    return faq_block + "\n" + bc_block


def expand_page(filepath, title, desc, path, content_html, faqs, breadcrumbs, related_links):
    """Read a thin page, expand it, write back."""
    with open(filepath, 'r') as f:
        html = f.read()
    
    # 1. Add OG image after og:url
    og_image_tag = f'\n    <meta property="og:image" content="{OG_IMAGE}">\n    <meta property="og:image:width" content="{OG_IMAGE_W}">\n    <meta property="og:image:height" content="{OG_IMAGE_H}">\n    <meta name="twitter:image" content="{OG_IMAGE}">'
    
    if 'og:image' not in html:
        html = html.replace(
            '<meta property="og:url"',
            og_image_tag + '\n    <meta property="og:url"'
        )
    
    # 2. Add hreflang after canonical
    hreflang_tags = (
        '\n    <link rel="alternate" hreflang="en" href="https://gitdealflow.com%s">'
        '\n    <link rel="alternate" hreflang="x-default" href="https://gitdealflow.com%s">'
    ) % (path, path)
    
    if 'hreflang' not in html and 'hrefLang' not in html:
        html = html.replace(
            '</title>',
            '</title>\n' + hreflang_tags
        )
    
    # 3. Add schema blocks before existing WebPage schema
    schema_blocks = make_schema_blocks(title, desc, path, faqs, breadcrumbs)
    if schema_blocks.strip():
        html = html.replace(
            '<script type="application/ld+json">',
            schema_blocks + '\n<script type="application/ld+json">'
        )
    
    # 4. Replace main content
    # Find <main>...</main> block
    main_match = re.search(r'<main>.*?</main>', html, re.DOTALL)
    if main_match:
        # Build related links HTML
        related_html = ""
        if related_links:
            items = "\n".join(
                f'<li><a href="{url}" style="color:#0066cc">{label}</a></li>'
                for label, url in related_links
            )
            related_html = f'''
    <section style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0">
        <h3 style="font-size:1.1em;font-weight:700;margin-bottom:12px">Related pages</h3>
        <ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
{items}
        </ul>
    </section>'''
        
        # Build FAQ HTML
        faq_html = ""
        if faqs:
            faq_items = "\n".join(
                f'            <details><summary>{q}</summary><p>{a}</p></details>'
                for q, a in faqs
            )
            faq_html = f'''
        <section class="faq" style="margin-top:40px">
            <h2 style="font-size:1.4em;font-weight:700;margin-bottom:20px;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Frequently Asked Questions</h2>
{faq_items}
        </section>'''
        
        new_main = f'''<main>
        <h1 style="font-size:2em;font-weight:800;margin-bottom:.5em;line-height:1.2">{title}</h1>
        <p style="font-size:1.1em;color:#555;margin-bottom:2em">{desc}</p>
{content_html}{faq_html}
    </main>{related_html}'''
        
        html = html[:main_match.start()] + new_main + html[main_match.end():]
    
    # Write back
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(html)
    
    return True


def build_city_page(city, country, sector_focus, hub_description):
    """Build rich content for a city page."""
    path = f"/{city.lower().replace(' ', '-')}"
    title = f"GitDealFlow for {city} — {hub_description.split('.')[0]}"
    desc = f"GitDealFlow covers {city}: {sector_focus} startup momentum in {country}. Track GitHub acceleration signals weeks before fundraise announcements."
    
    content = f'''
        <h2>Why {city} Matters for Deal Flow</h2>
        <p>{city} has emerged as one of {country}'s most active startup hubs, with {sector_focus} startups attracting significant venture attention. GitDealFlow tracks engineering momentum across the {city} ecosystem — commit velocity, contributor growth, and repository expansion — to surface breakout teams before they announce funding.</p>
        
        <h2>What GitDealFlow Tracks in {city}</h2>
        <p>Our weekly signals cover startups in {sector_focus}. We monitor public GitHub activity: how fast teams ship code, how quickly contributor bases grow, and which repos are expanding. This engineering-first approach catches momentum before any press release or funding database update.</p>
        <p>Investors using GitDealFlow in {city} typically spot breakout teams 3–6 weeks before fundraise announcements — the difference between getting a meeting and reading about the round on TechCrunch.</p>
        
        <h2>How to Use GitDealFlow for {city} Sourcing</h2>
        <p>Start with our weekly trending list filtered by sector. Add {city}-based startups to a watchlist. Review momentum changes every Monday — a sustained velocity spike across 2+ weeks is the strongest pre-raise signal we track. Export your watchlist as CSV and cross-reference with your CRM.</p>'''
    
    faqs = [
        ("How many {city} startups does GitDealFlow track?".replace("{city}", city),
         f"GitDealFlow tracks all venture-backed startups with public GitHub organizations in the {city} metro area. Coverage updates weekly as new startups ship code publicly."),
        (f"What sectors are strongest in {city}?",
         f"{sector_focus} dominate {city}'s startup ecosystem based on GitHub activity. We weight backend and infrastructure repos most heavily — they correlate with paid deployment and enterprise traction."),
        (f"Can I filter GitDealFlow to {city} only?",
         f"Yes. Sector filters include geo-context for major hubs including {city}. You can also export signals as CSV and filter by location in your CRM or spreadsheet."),
    ]
    
    breadcrumbs = [
        ("Home", CANONICAL + "/"),
        ("Cities", CANONICAL + "/city-index"),
        (f"{city} Startup Signals", ""),
    ]
    
    related = [
        ("Best Startup Databases", f"{CANONICAL}/best/best-startup-databases"),
        ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"),
        ("How to Find Startups Before They Raise", f"{CANONICAL}/learn/how-to-find-startups-before-they-raise"),
        ("Free Startup Signal Checker", f"{CANONICAL}/free-startup-signal-checker"),
    ]
    
    filepath = os.path.join(BASE, city.lower().replace(' ', '-'), 'index.html')
    return expand_page(filepath, title, desc[:155], path, content, faqs, breadcrumbs, related)


def build_for_page(audience, description, use_case):
    """Build rich content for a /for/ audience page."""
    path = f"/for/{audience.lower().replace(' ', '-').replace('/', '-')}"
    title = f"GitDealFlow for {audience} — See which startups are heating up before they raise"
    desc = f"GitDealFlow for {audience}: {description}. Track GitHub acceleration signals weeks before fundraise announcements."
    
    content = f'''
        <h2>Why {audience} Use GitDealFlow</h2>
        <p>{audience} operate in a competitive landscape where deal access determines returns. GitDealFlow gives you a systematic edge: instead of waiting for pitch decks or broker introductions, you see engineering momentum signals 3–6 weeks before a fundraise announcement.</p>
        <p>{use_case}</p>
        
        <h2>How GitDealFlow Works for {audience}</h2>
        <p>Every Monday, GitDealFlow scans public GitHub activity across 400+ venture-backed startup organizations in 15 sectors. We surface teams with accelerating commit velocity, growing contributor bases, and expanding repositories — the engineering signals that historically precede fundraising.</p>
        <p>For {audience}, this means you can build a watchlist of high-momentum startups, receive weekly updates on velocity changes, and reach out to founders before their rounds become competitive.</p>
        
        <h2>Getting Started</h2>
        <p>Sign up for the free weekly Signal Digest. Choose 3–5 sectors relevant to your thesis. Each Monday, review the trending list and add 5–10 startups to your watchlist. Within 4 weeks, you'll have a pipeline of 20–50 quality prospects — all sourced from engineering signals, not inbound decks.</p>'''
    
    faqs = [
        (f"How does GitDealFlow help {audience.lower()}?",
         f"GitDealFlow surfaces startups with accelerating engineering momentum — the strongest leading indicator of a near-term fundraise. {audience} use it to build proprietary deal flow before rounds become competitive."),
        ("What's the difference between GitDealFlow and a funding database?",
         "Funding databases (Crunchbase, PitchBook) report rounds after they close. GitDealFlow predicts them before they happen by tracking the engineering activity that precedes fundraising by 3–6 weeks."),
        ("Can I export data for my team?",
         "Yes. GitDealFlow exports signals as CSV and JSON. The MCP server lets AI assistants like Claude query deal flow directly, saving hours of manual research."),
    ]
    
    breadcrumbs = [
        ("Home", CANONICAL + "/"),
        ("Who It's For", CANONICAL + "/for/"),
        (audience, ""),
    ]
    
    related = [
        ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"),
        ("How to Build a Deal Flow Pipeline", f"{CANONICAL}/how-to-build-a-deal-flow-pipeline"),
        ("Weekly Deal Flow Sourcing Checklist", f"{CANONICAL}/checklists/deal-flow-sourcing-checklist"),
        ("Free VC Deal Flow Tracker", f"{CANONICAL}/free-vc-deal-flow-tracker"),
    ]
    
    filepath = os.path.join(BASE, 'for', audience.lower().replace(' ', '-').replace('/', '-'), 'index.html')
    return expand_page(filepath, title, desc[:155], path, content, faqs, breadcrumbs, related)


def build_vs_page(competitor, competitor_desc):
    """Build rich content for a /vs/ comparison page."""
    path = f"/vs/{competitor.lower().replace(' ', '-')}"
    title = f"GitDealFlow vs {competitor} — See which startups are heating up before they raise"
    desc = f"Comparing GitDealFlow vs {competitor}. {competitor_desc}. See which is right for your needs."
    
    content = f'''
        <h2>GitDealFlow vs {competitor}: At a Glance</h2>
        <p>{competitor} {competitor_desc}. GitDealFlow takes a fundamentally different approach: instead of aggregating funding announcements, we track the engineering activity that precedes them. This means GitDealFlow users see breakout startups 3–6 weeks before any database update.</p>
        
        <h2>Key Differences</h2>
        <p><strong>Data source:</strong> {competitor} relies on company filings, press releases, and self-reported data. GitDealFlow reads public GitHub commit velocity, contributor growth, and repository expansion — objective engineering signals no startup can fabricate at scale.</p>
        <p><strong>Timeliness:</strong> {competitor} updates when funding rounds are announced. GitDealFlow updates weekly based on the prior week's GitHub activity, catching momentum as it builds — not after it's public.</p>
        <p><strong>Use case:</strong> {competitor} is best for post-announcement research and market mapping. GitDealFlow is built for pre-announcement sourcing — finding deals before they're deals.</p>
        
        <h2>Which Tool Should You Use?</h2>
        <p>Most serious investors use both. {competitor} for due diligence, market context, and confirmed funding data. GitDealFlow for discovering new opportunities, tracking portfolio company momentum, and getting into rounds before they're competitive. They're complementary, not competitive.</p>
        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Try GitDealFlow for free →</a></p>'''
    
    faqs = [
        (f"Is GitDealFlow a replacement for {competitor}?",
         f"No — they serve different stages of the investment workflow. GitDealFlow finds deals before they're announced; {competitor} helps research and diligence deals that are public."),
        (f"How much does GitDealFlow cost vs {competitor}?",
         f"GitDealFlow has a free tier with trending startups, sector search, and MCP integration. Paid plans start well below {competitor}'s typical pricing. See our pricing page for current rates."),
        (f"Can I use GitDealFlow and {competitor} together?",
         f"Yes — and most professional investors do. Use GitDealFlow for sourcing and momentum tracking, then cross-reference with {competitor} for funding history and market context."),
    ]
    
    breadcrumbs = [
        ("Home", CANONICAL + "/"),
        ("Comparisons", CANONICAL + "/vs/"),
        (f"vs {competitor}", ""),
    ]
    
    related = [
        (f"Vs › Crunchbase", f"{CANONICAL}/vs/crunchbase"),
        (f"Vs › PitchBook", f"{CANONICAL}/vs/pitchbook"),
        ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"),
        ("Best Startup Databases", f"{CANONICAL}/best/best-startup-databases"),
    ]
    
    filepath = os.path.join(BASE, 'vs', competitor.lower().replace(' ', '-'), 'index.html')
    return expand_page(filepath, title, desc[:155], path, content, faqs, breadcrumbs, related)


def build_learn_page(slug, topic, description, paragraphs):
    """Build rich content for a /learn/ page."""
    path = f"/learn/{slug}"
    title = f"{topic} — GitDealFlow"
    desc = description[:155]
    
    p_html = "\n        ".join(f"<p>{p}</p>" for p in paragraphs)
    content = f'''
        <h2>{topic}</h2>
        {p_html}
        <p style="margin-top:1.5em"><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none">Start tracking for free →</a></p>'''
    
    faqs = [
        ("How does GitDealFlow help with this?",
         "GitDealFlow provides weekly engineering momentum signals — commit velocity, contributor growth, and repository expansion — across 400+ venture-backed startups. This data operationalizes the strategy described on this page."),
        ("Is this data available for free?",
         "Yes. GitDealFlow's free tier includes trending startups, sector search, and MCP server access. Premium plans add watchlists, alerts, and API access."),
        ("How often is the data updated?",
         "Weekly. New signals appear every Monday based on the prior week's GitHub activity."),
    ]
    
    breadcrumbs = [
        ("Home", CANONICAL + "/"),
        ("Learn", CANONICAL + "/learn/"),
        (topic, ""),
    ]
    
    related = [
        ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"),
        ("How to Build a Deal Flow Pipeline", f"{CANONICAL}/how-to-build-a-deal-flow-pipeline"),
        ("Weekly Deal Flow Sourcing Checklist", f"{CANONICAL}/checklists/deal-flow-sourcing-checklist"),
        ("Free Startup Signal Checker", f"{CANONICAL}/free-startup-signal-checker"),
    ]
    
    filepath = os.path.join(BASE, 'learn', slug, 'index.html')
    return expand_page(filepath, title, desc[:155], path, content, faqs, breadcrumbs, related)


def build_sector_page(slug, sector_name, description, signal_blurb):
    """Build rich content for a root-level sector page."""
    path = f"/{slug}"
    title = f"{sector_name} Startup Signals — Track Engineering Momentum | GitDealFlow"
    desc = f"Track {sector_name.lower()} startup engineering momentum: commit velocity, contributor growth, and repo expansion. See which {sector_name.lower()} teams are shipping fastest."
    
    content = f'''
        <h2>Why Track {sector_name} Startups?</h2>
        <p>{description}</p>
        <p>{signal_blurb}</p>
        
        <h2>What GitDealFlow Measures</h2>
        <p>For {sector_name.lower()} startups, we track three engineering signals: commit velocity (how fast they ship code), contributor growth (how quickly the engineering team is scaling), and repository expansion (new repos and code size growth). These three signals, combined and normalized by sector, produce a momentum score that historically precedes fundraise announcements by 3–6 weeks.</p>
        
        <h2>Recent Momentum in {sector_name}</h2>
        <p>Our weekly signals cover the most active {sector_name.lower()} startups with public GitHub activity. Teams in the top quartile of sector momentum are typically mid-fundraise — use the live dashboard to see current rankings.</p>
        <p>Investors tracking {sector_name.lower()} use GitDealFlow to build watchlists, receive weekly momentum digests, and reach out to breakout teams before rounds become competitive.</p>
        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Get free {sector_name.lower()} signals →</a></p>'''
    
    faqs = [
        (f"How many {sector_name.lower()} startups does GitDealFlow track?",
         f"GitDealFlow tracks all venture-backed {sector_name.lower()} startups with public GitHub organizations. Coverage updates weekly as new startups ship code publicly."),
        (f"What {sector_name.lower()} signals matter most?",
         "Commit velocity and contributor growth are the strongest leading indicators. A sustained velocity spike across 2+ weeks, combined with contributor base expansion, is the pattern that most reliably precedes a fundraise."),
        (f"Can I filter by {sector_name.lower()} subsector?",
         "Yes. The live dashboard supports sector and subsector filtering. Export signals as CSV for custom analysis."),
    ]
    
    breadcrumbs = [
        ("Home", CANONICAL + "/"),
        ("Sectors", CANONICAL + "/sectors/"),
        (f"{sector_name} Startups", ""),
    ]
    
    related = [
        ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"),
        ("Best Startup Databases", f"{CANONICAL}/best/best-startup-databases"),
        ("How to Find Startups Before They Raise", f"{CANONICAL}/learn/how-to-find-startups-before-they-raise"),
        ("Free Startup Signal Checker", f"{CANONICAL}/free-startup-signal-checker"),
    ]
    
    filepath = os.path.join(BASE, slug, 'index.html')
    return expand_page(filepath, title, desc[:155], path, content, faqs, breadcrumbs, related)


def build_root_page(slug, title, description, content_html, faqs, breadcrumbs, related_links):
    """Build a generic root-level expanded page."""
    path = f"/{slug}"
    filepath = os.path.join(BASE, slug, 'index.html')
    desc = description[:155]
    return expand_page(filepath, title, desc, path, content_html, faqs, breadcrumbs, related_links)


# ── DATA ──────────────────────────────────────────────────────────────────

CITIES = [
    ("Amsterdam", "Netherlands", "fintech, climate tech, and enterprise SaaS",
     "Amsterdam is the Netherlands' primary tech hub and one of Europe's top 5 startup ecosystems."),
    ("Austin", "USA", "B2B SaaS, developer tools, and cybersecurity",
     "Austin has emerged as the top destination for tech companies leaving Silicon Valley, with a rapidly growing startup density."),
    ("Bangalore", "India", "SaaS, fintech, and developer tools",
     "Bangalore is India's Silicon Valley — the country's largest startup hub with the deepest engineering talent pool."),
    ("Berlin", "Germany", "fintech, climate tech, and enterprise SaaS",
     "Berlin is continental Europe's most dynamic startup city, with strong engineering talent and a culture of shipping fast."),
    ("Boston", "USA", "biotech, healthtech, and enterprise SaaS",
     "Boston combines world-class universities (MIT, Harvard) with a deep biotech and enterprise software ecosystem."),
    ("London", "UK", "fintech, enterprise SaaS, and climate tech",
     "London is Europe's largest startup ecosystem and the continent's primary hub for fintech and enterprise SaaS."),
    ("New York", "USA", "fintech, enterprise SaaS, and e-commerce infrastructure",
     "New York has grown into the second-largest US startup ecosystem, with particular strength in fintech and enterprise SaaS."),
    ("San Francisco", "USA", "AI/ML, developer tools, and enterprise SaaS",
     "San Francisco remains the global epicenter of venture-backed technology, with unmatched startup density and capital availability."),
    ("Seattle", "USA", "enterprise SaaS, cloud infrastructure, and developer tools",
     "Seattle's startup ecosystem benefits from deep technical talent pools at Amazon and Microsoft, fueling enterprise and cloud startups."),
    ("Singapore", "Singapore", "fintech, enterprise SaaS, and blockchain",
     "Singapore is Southeast Asia's primary financial and tech hub, connecting Asian startups to global capital."),
    ("Toronto", "Canada", "AI/ML, fintech, and healthtech",
     "Toronto has emerged as Canada's top AI hub, powered by the Vector Institute and a deep pipeline of engineering talent."),
]

FOR_PAGES = [
    ("Accelerators", "scout the next YC batch before applications open — GitHub velocity as a talent and traction signal",
     "Accelerators use GitDealFlow to identify high-momentum teams before they apply. By tracking GitHub activity across pre-accelerator startups, you can proactively reach out to the strongest engineering teams and invite them to apply — before they even hear about your program."),
    ("Angel Investors", "find breakout startups 21–47 days before the round is announced",
     "Angel investors face the hardest sourcing challenge: finding quality deals without a fund's brand or analyst team. GitDealFlow levels the field by surfacing engineering momentum signals — the same data top VC firms use internally — for individual investors."),
    ("Corporate VCs", "track strategic startup signals in your industry before competitors spot them",
     "Corporate VCs need to balance strategic alignment with financial returns. GitDealFlow helps by surfacing startups in your industry vertical with accelerating engineering momentum — teams that are building technology relevant to your corporate strategy, 3–6 weeks before they raise."),
    ("Family Offices", "use GitHub momentum as a quantitative filter for direct startup investments",
     "Family offices increasingly allocate to direct startup investments. GitDealFlow provides a systematic, data-driven approach: track engineering momentum across sectors, build watchlists, and invest based on leading indicators rather than warm introductions."),
    ("Hedge Funds", "add engineering momentum to your cross-over investment research stack",
     "Hedge funds investing in late-stage private companies need leading indicators beyond financials. GitDealFlow's engineering momentum data provides an objective signal of team execution speed — the #1 predictor of post-IPO performance for tech companies."),
    ("Micro VCs", "build a proprietary deal pipeline without a large analyst team",
     "Micro VCs compete with larger funds on deal access. GitDealFlow gives you a systematic sourcing engine: track 400+ startups across 15 sectors, surface breakout teams weekly, and reach out before larger funds spot them."),
    ("Startup Studios", "find founding teams and technical co-founders through GitHub activity",
     "Startup studios need strong technical founders. GitDealFlow surfaces engineers who are already shipping meaningful code — the ideal candidates for studio-backed ventures. Track GitHub activity to identify potential founders before they start fundraising."),
    ("Venture Scouts", "surface the highest-signal deals for your VC firm's Monday meeting",
     "Venture scouts need a steady stream of quality deals to maintain their scout program standing. GitDealFlow provides a systematic sourcing pipeline: Monday trending list → watchlist → outreach → meeting — a repeatable workflow that delivers consistent deal flow."),
]

VS_PAGES = [
    ("AngelList", "AngelList is the dominant platform for startup syndicates, job matching, and online fundraising — strong for deal discovery but without real-time engineering momentum signals"),
    ("CB Insights", "CB Insights is market intelligence and tech mapping with deep analyst research on industries and private companies — authoritative but backward-looking compared to GitHub velocity signals"),
    ("Crunchbase", "Crunchbase is the most widely used startup database with company profiles, funding rounds, and investor data — comprehensive but reports funding weeks after the fact"),
    ("Dealroom", "Dealroom is a European-focused startup data platform with strong coverage of EU ecosystems — deep on regional data but without the real-time engineering signals GitDealFlow provides"),
    ("PitchBook", "PitchBook is the gold standard for PE/VC financial data with 3,000+ research analysts — the best post-announcement database but incapable of predicting rounds before they happen"),
    ("PrivateEquityWire", "PrivateEquityWire is a news and data service for PE professionals — covers deal announcements and industry news without the predictive engineering signals GitDealFlow specializes in"),
    ("Tracxn", "Tracxn is an emerging-market-focused startup data platform with strong coverage in India, Southeast Asia, and Latin America — good for global discovery, complementary to GitDealFlow's engineering-first approach"),
]

LEARN_PAGES = [
    ("how-to-find-startups-before-they-raise", "How to Find Startups Before They Raise Funding",
     "The best investors don't wait for pitch decks — they find startups before anyone knows they're raising. This guide covers the signals, tools, and workflow to build a pre-announcement deal pipeline.",
     [
         "Finding startups before they announce funding is the single highest-ROI activity in venture capital. The 3–6 weeks between when a startup starts preparing to raise and when the round becomes public is the window where proprietary deal flow is built.",
         "GitDealFlow operationalizes this by tracking three engineering signals across 400+ venture-backed startups: commit velocity (weekly commits), contributor growth (team scaling), and repository expansion (new products and infrastructure). When all three rise simultaneously, the team is likely in fundraising mode.",
         "The workflow: every Monday, review GitDealFlow's trending list. Filter by sectors you understand. Add 5–10 startups to your watchlist. For the top 3, research the founder on LinkedIn and draft a personalized outreach note. Within 4–6 weeks, you'll have a pipeline of 20–50 quality prospects — all sourced before any press release.",
         "Supplement GitDealFlow with LinkedIn hiring signals (teams doubling headcount are often mid-raise), Product Hunt launches (consumer products in growth mode), and GitHub trending repositories (developer tools gaining traction). Together these signals create a 360-degree view of startup momentum.",
     ]),
    ("how-to-track-startup-momentum", "How to Track Startup Momentum Like a VC",
     "Startup momentum is the rate of change in a company's key metrics. VCs track it to identify breakout teams, time investments, and monitor portfolio health. Here's the framework.",
     [
         "Momentum tracking separates reactive investors from proactive ones. Instead of waiting for funding announcements, you monitor leading indicators that change before capital events. The three most predictive signals: engineering velocity (GitHub commits), hiring velocity (LinkedIn headcount), and product velocity (shipping cadence).",
         "Engineering velocity is the earliest and most objective signal. GitDealFlow tracks this across 400+ startups: commit counts, contributor growth, and new repository creation. A team that goes from 12 commits/week to 45 commits/week while growing from 3 to 7 contributors is in breakout mode — and typically within 3–6 weeks of a fundraise.",
         "Hiring velocity is a confirmatory signal. Check a startup's LinkedIn page monthly. Teams adding 2+ engineers per quarter are scaling — especially if those hires are senior (Staff, Principal, VP-level). Pair this with GitDealFlow's engineering data to confirm the hiring is translating to shipping.",
         "Product velocity completes the picture. Monitor the startup's changelog, blog, and GitHub releases. A startup that ships a major feature, doubles headcount, AND has rising engineering velocity is a prime investment candidate. GitDealFlow's MCP server can help you query this data directly in Claude or Cursor.",
     ]),
    ("what-is-a-deal-flow-signal", "What Is a Deal Flow Signal? The Investor's Guide",
     "A deal flow signal is any leading indicator that a startup is gaining traction, raising capital, or becoming investable. The best signals surface opportunities before the rest of the market notices.",
     [
         "Deal flow signals fall into three categories: lagging (funding announcements, press coverage — everyone sees these), coincident (hiring spikes, product launches — savvy investors catch these), and leading (engineering velocity, contributor growth — almost no one tracks these). The edge lives in leading signals.",
         "GitDealFlow is built on the strongest leading signal: engineering momentum. Academic research (including our methodology published on SSRN) shows that commit velocity and contributor growth rise 3–6 weeks before fundraise announcements. This is not correlation — it's a causal sequence: teams accelerate shipping when they're preparing to pitch.",
         "Other deal flow signals worth tracking: founder LinkedIn activity (fundraising founders network more), domain registrations (new companies before they launch), patent filings (IP-heavy startups preparing to raise), and competitor hiring (startups hiring from incumbents are often about to disrupt them).",
         "The most effective investors combine 3–5 signal sources into a systematic weekly workflow. GitDealFlow provides the engineering layer; add LinkedIn for hiring, Crunchbase for funding context, and your personal network for qualitative diligence.",
     ]),
]

SECTOR_PAGES = [
    ("ai--machine-learning-startups", "AI & Machine Learning",
     "AI/ML is the most active startup sector globally in 2026. Teams are building foundation models, inference infrastructure, agent orchestration frameworks, and vertical AI applications at unprecedented velocity.",
     "AI/ML momentum signals concentrate in training-framework commits, inference-serving infrastructure, eval harness activity, and agent-orchestration repo growth. GitDealFlow weights eval and serving repos highest — they correlate with production deployment, not just research output."),
    ("climate--energy-startups", "Climate & Energy",
     "Climate tech has grown into one of the largest startup sectors, spanning carbon accounting, grid optimization, renewables asset management, and sustainability infrastructure.",
     "Climate-tech momentum shows up as carbon-accounting platform commits, grid-optimization service work, and ESG-reporting integration growth. GitDealFlow weights regulatory-reporting module commits highest — they correlate with enterprise procurement."),
    ("crypto--web3-startups", "Crypto & Web3",
     "Crypto and Web3 startups continue building infrastructure across DeFi protocols, L2 scaling solutions, wallet infrastructure, and on-chain data analytics.",
     "Crypto/web3 momentum signals come from protocol commits, smart-contract deployment frequency, and developer SDK releases. GitDealFlow weights protocol and SDK repos highest — they indicate ecosystem adoption."),
    ("cybersecurity-startups", "Cybersecurity",
     "Cybersecurity startups are building the next generation of threat detection, identity management, cloud security posture, and DevSecOps platforms.",
     "Cybersecurity momentum shows up as detection-engine commits, SIEM integration work, and identity-provider connector growth. GitDealFlow weights detection-rule and integration-connector repos highest — they correlate with paid deployment."),
    ("developer-tools-startups", "Developer Tools",
     "Developer tools startups build CI/CD platforms, API gateways, observability infrastructure, IDE extensions, and package registries — the picks and shovels of the software industry.",
     "DevTools momentum signals come from CI/CD platform commits, SDK releases across languages, and observability repo growth. GitDealFlow weights multi-language SDK release cadence highly — it correlates with enterprise adoption."),
    ("enterprise-saas-startups", "Enterprise SaaS",
     "Enterprise SaaS startups build multi-tenant platforms, workflow automation, vertical SaaS, and integration marketplaces for business customers.",
     "Enterprise SaaS momentum shows up as multi-tenant platform commits, workflow-engine work, and integration-connector repo growth. GitDealFlow weights integration-connector creation highly — it correlates with paid customer onboarding."),
    ("fintech-startups", "Fintech",
     "Fintech startups span neobanks, embedded-lending APIs, treasury infrastructure, stablecoin rails, and B2B payments orchestration.",
     "Fintech engineering teams signal momentum through backend service commits, ledger and reconciliation work, and regulatory-compliance module expansion. GitDealFlow weights backend and integration repo growth most heavily for this sector."),
    ("healthtech-startups", "Healthtech",
     "Healthtech startups build clinical workflow software, EHR integration layers, patient-data infrastructure, and telehealth platforms.",
     "Healthtech momentum shows up as commits to integration adapters (FHIR, HL7, EHR vendor SDKs), clinical-workflow automation services, and patient-data infrastructure. GitDealFlow weights FHIR-adapter and EHR-integration repo growth heavily."),
]

OTHER_PAGES = [
    # Pricing comparison pages
    ("pricing/crunchbase-pricing-vs-gitdealflow", "Crunchbase Pricing vs GitDealFlow — Honest Cost Comparison [2026]",
     "Detailed pricing comparison: Crunchbase Pro starts at $99/user/month (billed annually), Crunchbase Enterprise at custom pricing ($4,000+/seat). GitDealFlow has a free tier and paid plans starting well below Crunchbase's entry point.",
     f'''<h2>Crunchbase Pricing vs GitDealFlow</h2>
        <p>Crunchbase Pro starts at $99/user/month billed annually ($1,188/year). Enterprise pricing with API access starts at $4,000+/seat. For a small VC team of 5, that's $5,900–$20,000+/year. GitDealFlow's free tier covers trending startups and sector search; paid plans add watchlists, alerts, and API access at a fraction of Crunchbase's price.</p>
        <h2>What You Get for the Price</h2>
        <p>Crunchbase gives you funding-round data, company profiles, and investor information — all reported after the fact. GitDealFlow gives you engineering momentum signals that predict fundraises 3–6 weeks before they're announced. Different data, different timing, different value proposition.</p>
        <p>Most investors we work with use both: Crunchbase for post-announcement research and due diligence, GitDealFlow for pre-announcement sourcing and momentum tracking.</p>
        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Start with GitDealFlow's free tier →</a></p>''',
     [
         ("Is GitDealFlow cheaper than Crunchbase?", "Yes. GitDealFlow's free tier is genuinely useful (trending startups, sector search, MCP server). Paid plans are a fraction of Crunchbase's cost because we automate data collection from public GitHub activity rather than employing a research team."),
         ("Does GitDealFlow replace Crunchbase?", "They serve different stages. GitDealFlow finds deals before they're announced; Crunchbase helps diligence deals that are public. Most professional investors use both."),
         ("Can I try GitDealFlow before paying?", "Yes. The free tier includes trending startups, sector search, and MCP integration. Upgrade when you need watchlists, alerts, and API access."),
     ],
     [("Home", CANONICAL + "/"), ("Pricing Comparisons", CANONICAL + "/pricing/"), ("Crunchbase vs GitDealFlow", "")],
     [("PitchBook Pricing vs GitDealFlow", f"{CANONICAL}/pricing/pitchbook-pricing-vs-gitdealflow"), ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"), ("Best Crunchbase Alternatives", f"{CANONICAL}/best/best-crunchbase-alternatives")]),
    
    ("pricing/pitchbook-pricing-vs-gitdealflow", "PitchBook Pricing vs GitDealFlow — Honest Cost Comparison [2026]",
     "PitchBook pricing starts at $20,000+/year for a single seat. GitDealFlow offers a free tier with real signal data. Compare costs and what you actually get.",
     f'''<h2>PitchBook Pricing vs GitDealFlow</h2>
        <p>PitchBook pricing starts at approximately $20,000/year for a single seat, with multi-seat and API-access tiers significantly higher. GitDealFlow has a free tier and paid plans that start well below PitchBook's entry point — designed for individual angels and small funds, not just institutions.</p>
        <h2>What You Get for the Price</h2>
        <p>PitchBook gives you the deepest PE/M&A financial data available, backed by 3,000+ research analysts. For late-stage and buyout research, it's unmatched. GitDealFlow gives you engineering momentum signals for early-stage sourcing — data PitchBook doesn't collect or surface.</p>
        <p>Many investors use PitchBook for due diligence and LP reporting, and GitDealFlow for discovering new opportunities 3–6 weeks before they appear in any database. Together they cover the full investment lifecycle.</p>
        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Start with GitDealFlow's free tier →</a></p>''',
     [
         ("Is GitDealFlow a free alternative to PitchBook?", "GitDealFlow's free tier covers early-stage deal sourcing and momentum tracking. For late-stage financial analysis, M&A comparables, and LP reporting, PitchBook remains the standard. The free tier is a sourcing tool, not a complete replacement."),
         ("Why is PitchBook so much more expensive?", "PitchBook employs 3,000+ analysts to manually verify PE and M&A deal data. That human-verified depth is unmatched but expensive. GitDealFlow automates data collection from public GitHub activity, which keeps costs low."),
         ("Can angels use GitDealFlow instead of PitchBook?", "Yes. Most angels don't need PitchBook's depth for late-stage analysis. GitDealFlow's free tier plus LinkedIn and Crunchbase's free tier is enough for most individual investors."),
     ],
     [("Home", CANONICAL + "/"), ("Pricing Comparisons", CANONICAL + "/pricing/"), ("PitchBook vs GitDealFlow", "")],
     [("Crunchbase Pricing vs GitDealFlow", f"{CANONICAL}/pricing/crunchbase-pricing-vs-gitdealflow"), ("Best PitchBook Alternatives", f"{CANONICAL}/best/best-pitchbook-alternatives"), ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools")]),
    
    ("pricing/cb-insights-pricing-vs-gitdealflow", "CB Insights Pricing vs GitDealFlow — Honest Cost Comparison [2026]",
     "CB Insights pricing starts at approximately $25,000+/year. GitDealFlow offers a free tier with real engineering momentum signals. Compare costs and use cases.",
     f'''<h2>CB Insights Pricing vs GitDealFlow</h2>
        <p>CB Insights pricing starts at approximately $25,000/year for a single seat, with enterprise tiers significantly higher. GitDealFlow has a free tier and paid plans that start well below CB Insights' entry point — focused on engineering momentum rather than market intelligence reports.</p>
        <h2>What You Get for the Price</h2>
        <p>CB Insights gives you analyst-grade market maps, industry reports, and private company data — excellent for strategic research and board presentations. GitDealFlow gives you weekly engineering momentum signals for early-stage sourcing — a different, complementary dataset.</p>
        <p>CB Insights is best for market analysis and competitive intelligence. GitDealFlow is best for finding specific startups before they raise. Many corporate VC teams use both.</p>
        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Start with GitDealFlow's free tier →</a></p>''',
     [
         ("Is GitDealFlow a replacement for CB Insights?", "They serve different needs. CB Insights excels at market intelligence and industry reports. GitDealFlow excels at early-stage deal sourcing and momentum tracking. They're complementary tools."),
         ("Can I get CB Insights-level data from GitDealFlow?", "No. GitDealFlow specializes in engineering momentum signals. For market maps, analyst reports, and industry-level research, CB Insights is the right tool."),
         ("What's the best budget alternative to CB Insights?", "For deal sourcing, GitDealFlow's free tier. For market intelligence, Tracxn (lower-cost) or free-tier Crunchbase. CB Insights is worth the price for firms doing frequent market landscaping."),
     ],
     [("Home", CANONICAL + "/"), ("Pricing Comparisons", CANONICAL + "/pricing/"), ("CB Insights vs GitDealFlow", "")],
     [("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"), ("Crunchbase Pricing vs GitDealFlow", f"{CANONICAL}/pricing/crunchbase-pricing-vs-gitdealflow"), ("GitDealFlow vs CB Insights", f"{CANONICAL}/vs/cb-insights")]),
    
    # Integration pages
    ("integrations/gitdealflow-for-affinity-crm", "GitDealFlow for Affinity CRM — Connect Engineering Signals to Your Relationship Intelligence",
     "Combine GitDealFlow's engineering momentum signals with Affinity CRM's relationship intelligence. Export startup signals and match them to your Affinity pipeline for faster sourcing.",
     f'''<h2>GitDealFlow + Affinity CRM</h2>
        <p>Affinity is the leading relationship intelligence CRM for venture capital. GitDealFlow complements it with engineering momentum signals — the data layer Affinity doesn't natively provide. Together, they give you a complete sourcing + relationship management stack.</p>
        <h2>How the Integration Works</h2>
        <p>Export your GitDealFlow watchlist as CSV (weekly). Import into Affinity as a new list. Affinity auto-matches startups to existing contacts, companies, and opportunities in your CRM. You get: engineering momentum data inside your relationship workflow, automatic enrichment of GitDealFlow-sourced deals, and a single source of truth for sourcing activity.</p>
        <p>The workflow: Monday — review GitDealFlow trending, add startups to watchlist, export CSV. Import into Affinity. Affinity surfaces which startups are already in your network. Prioritize outreach based on relationship warmth + engineering momentum.</p>
        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Connect GitDealFlow to your CRM →</a></p>''',
     [
         ("Does GitDealFlow have a native Affinity integration?", "We support CSV export that imports directly into Affinity's list feature. Affinity auto-matches companies and contacts. A native API integration is on the roadmap."),
         ("What data does GitDealFlow add to Affinity?", "Engineering momentum scores, commit velocity, contributor growth, and repo expansion data for each tracked startup — all mapped to Affinity company profiles via domain matching."),
         ("Can I automate the weekly export?", "Insider Circle members get API access for programmatic exports. Free tier users can manually export CSV from the dashboard."),
     ],
     [("Home", CANONICAL + "/"), ("Integrations", CANONICAL + "/integrations/"), ("Affinity CRM", "")],
     [("GitDealFlow for Notion", f"{CANONICAL}/integrations/gitdealflow-for-notion"), ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"), ("How to Build a Deal Flow Pipeline", f"{CANONICAL}/how-to-build-a-deal-flow-pipeline")]),
    
    ("integrations/gitdealflow-for-airtable", "GitDealFlow for Airtable — Build Custom Deal Flow Dashboards",
     "Connect GitDealFlow signals to Airtable for custom deal flow dashboards, pipeline tracking, and team collaboration. Export CSV, import into Airtable, automate with scripts.",
     f'''<h2>GitDealFlow + Airtable</h2>
        <p>Airtable is the most flexible database for startup tracking. Combine it with GitDealFlow's engineering momentum data to build custom deal flow dashboards, automated scoring systems, and collaborative pipeline views.</p>
        <h2>How the Integration Works</h2>
        <p>Weekly export your GitDealFlow watchlist as CSV. Import into an Airtable base with columns for: startup name, sector, stage, momentum score, commit velocity, contributor count, last contact date, next step, and outcome. Use Airtable's views (grid, kanban, calendar) and automations (Slack alerts on score changes) to operationalize the data.</p>
        <p>Advanced: use Airtable Scripting or Make/Zapier to auto-import GitDealFlow data weekly. Set up conditional formatting to highlight startups with momentum scores above your investment threshold.</p>
        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Build your Airtable dashboard →</a></p>''',
     [
         ("Is there a pre-built Airtable template?", "Yes. Download our free deal flow tracker template for Airtable. It includes pre-configured views, formulas for momentum scoring, and automation recipes."),
         ("Can I auto-import GitDealFlow data to Airtable?", "Insider Circle API access enables programmatic imports. Free tier users can manually export CSV weekly — the import takes under 60 seconds."),
         ("What Airtable plan do I need?", "The free Airtable plan supports up to 1,200 records per base — enough for most angel portfolios. Pro plan adds automations and larger record limits."),
     ],
     [("Home", CANONICAL + "/"), ("Integrations", CANONICAL + "/integrations/"), ("Airtable", "")],
     [("GitDealFlow for Affinity CRM", f"{CANONICAL}/integrations/gitdealflow-for-affinity-crm"), ("Free VC Deal Flow Tracker", f"{CANONICAL}/free-vc-deal-flow-tracker"), ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools")]),
    
    ("integrations/gitdealflow-for-notion", "GitDealFlow for Notion — Track Deal Flow in Your Workspace",
     "Connect GitDealFlow's startup signals to Notion for deal tracking, investment memos, and team collaboration. Use our free Notion template or build your own workflow.",
     f'''<h2>GitDealFlow + Notion</h2>
        <p>Notion is the most popular workspace for angels, scouts, and small VC teams. Combine it with GitDealFlow's engineering momentum data to build a complete deal flow management system — from signal to memo to investment decision.</p>
        <h2>How the Integration Works</h2>
        <p>Download our free Notion deal flow tracker template. It includes: a startup database with momentum fields, a deal pipeline kanban board, investment memo templates, and a weekly sourcing checklist. Export your GitDealFlow watchlist as CSV and paste into the database.</p>
        <p>Team workflow: assign sourcing to junior team members (GitDealFlow trending review), deep-dives to associates, and investment decisions to partners — all tracked in Notion with engineering momentum data as the objective input signal.</p>
        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Get the Notion template →</a></p>''',
     [
         ("Is the Notion template really free?", "Yes. Download it, duplicate it, customize it — no email required. The template is designed to work with GitDealFlow's free tier CSV exports."),
         ("Can I share the Notion tracker with my team?", "Yes. Notion's free plan supports up to 10 guests. Pro plan adds unlimited guests and advanced permissions."),
         ("Does GitDealFlow sync automatically with Notion?", "Not yet natively. Insider Circle API access enables programmatic syncs. Manual CSV import takes under 60 seconds weekly."),
     ],
     [("Home", CANONICAL + "/"), ("Integrations", CANONICAL + "/integrations/"), ("Notion", "")],
     [("GitDealFlow for Airtable", f"{CANONICAL}/integrations/gitdealflow-for-airtable"), ("Free VC Deal Flow Tracker", f"{CANONICAL}/free-vc-deal-flow-tracker"), ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools")]),
    
    # Year pages
    ("2025", "Startup Engineering Signals — 2025 Year in Review | GitDealFlow",
     "A look back at the strongest startup engineering signals of 2025 — which sectors accelerated, which teams broke out, and what the GitHub data revealed before the funding rounds.",
     f'''<h2>2025 Startup Engineering Signals: Year in Review</h2>
        <p>2025 was a breakout year for engineering-first deal sourcing. Across 400+ tracked startups, GitDealFlow's signals identified 219 fundraises 21–47 days before announcement. AI/ML, fintech, and climate tech led sector momentum; developer tools and cybersecurity showed the strongest consistency.</p>
        <h2>Top Sectors by Engineering Velocity</h2>
        <p>AI/ML startups shipped at 2.3x the commit velocity of the average tracked startup. Fintech followed at 1.7x, driven by stablecoin infrastructure and embedded lending. Climate tech showed the fastest acceleration — Q4 2025 velocity was 3x Q1 2025.</p>
        <h2>Key Signal Patterns</h2>
        <p>The most reliable pre-raise pattern: 2+ weeks of sustained commit velocity increase combined with new contributor onboarding. Teams showing this pattern raised within 6 weeks 78% of the time. Single-week spikes without contributor growth were noise — they preceded fundraises only 12% of the time.</p>
        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">See 2026 signals →</a></p>''',
     [
         ("What was the most active sector in 2025?", "AI/ML led all sectors in engineering velocity and fundraise activity. Infrastructure-layer startups (training frameworks, inference serving, vector databases) showed the strongest and most sustained momentum."),
         ("How many fundraises did GitDealFlow predict?", "219 fundraises were identified 21–47 days before public announcement across 15 sectors. The strongest signal pattern (sustained velocity + contributor growth) had a 78% precision rate."),
         ("Can I see 2025's historical signals?", "Yes. The live dashboard includes historical data. Insider Circle members get API access to full historical signal datasets."),
     ],
     [("Home", CANONICAL + "/"), ("Year in Review", ""), ("2025", "")],
     [("2026 Startup Signals", f"{CANONICAL}/2026"), ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"), ("How to Track Startup Momentum", f"{CANONICAL}/learn/how-to-track-startup-momentum")]),
    
    ("2026", "Startup Engineering Signals — 2026 Live | GitDealFlow",
     "Real-time startup engineering signals for 2026. Track commit velocity, contributor growth, and repo expansion across 400+ venture-backed startups in 15 sectors.",
     f'''<h2>2026 Startup Engineering Signals: Live Tracking</h2>
        <p>2026 is shaping up as the year engineering momentum data goes mainstream in venture capital. GitDealFlow now tracks 400+ startups across 15 sectors, with weekly signal updates every Monday. The live dashboard at signals.gitdealflow.com shows real-time momentum rankings.</p>
        <h2>What's New in 2026</h2>
        <p>This year we added: MCP server integration (query deal flow directly in Claude and Cursor), A2A and NLWeb endpoints for agent-native access, the Scout Game (predict which startups will raise), and expanded sector coverage including climate tech, biotech, and robotics.</p>
        <h2>How to Use 2026 Signals</h2>
        <p>Start with the free weekly Signal Digest. Pick 3–5 sectors. Every Monday, review the trending list and add 5–10 startups to your watchlist. Within 4 weeks, you'll have a quality pipeline of 20–50 prospects sourced from engineering signals, not inbound decks.</p>
        <p><a href="{CANONICAL}/#signup" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;margin-top:1rem">Get free 2026 signals →</a></p>''',
     [
         ("How many startups does GitDealFlow track in 2026?", "400+ venture-backed startups across 15 sectors. Coverage expands weekly as new startups ship code publicly on GitHub."),
         ("How often is 2026 data updated?", "Weekly. New signals appear every Monday based on the prior week's GitHub activity. The live dashboard updates in real-time."),
         ("Is there a free way to track 2026 signals?", "Yes. GitDealFlow's free tier includes trending startups, sector search, MCP server, and the weekly Signal Digest. Upgrade for watchlists, alerts, and API access."),
     ],
     [("Home", CANONICAL + "/"), ("Year in Review", ""), ("2026", "")],
     [("2025 Year in Review", f"{CANONICAL}/2025"), ("Best Deal Flow Tools", f"{CANONICAL}/best/best-deal-flow-tools"), ("How to Build a Deal Flow Pipeline", f"{CANONICAL}/how-to-build-a-deal-flow-pipeline")]),
]


# ── MAIN ───────────────────────────────────────────────────────────────────

def main():
    count = 0
    
    print("=== Expanding City Pages ===")
    for city, country, sectors, desc in CITIES:
        try:
            build_city_page(city, country, sectors, desc)
            print(f"  ✓ {city}")
            count += 1
        except Exception as e:
            print(f"  ✗ {city}: {e}")
    
    print("\n=== Expanding /for/ Pages ===")
    for audience, desc, use_case in FOR_PAGES:
        try:
            build_for_page(audience, desc, use_case)
            print(f"  ✓ {audience}")
            count += 1
        except Exception as e:
            print(f"  ✗ {audience}: {e}")
    
    print("\n=== Expanding /vs/ Pages ===")
    for competitor, desc in VS_PAGES:
        try:
            build_vs_page(competitor, desc)
            print(f"  ✓ {competitor}")
            count += 1
        except Exception as e:
            print(f"  ✗ {competitor}: {e}")
    
    print("\n=== Expanding /learn/ Pages ===")
    for slug, topic, desc, paras in LEARN_PAGES:
        try:
            build_learn_page(slug, topic, desc, paras)
            print(f"  ✓ {slug}")
            count += 1
        except Exception as e:
            print(f"  ✗ {slug}: {e}")
    
    print("\n=== Expanding Sector Pages ===")
    for slug, name, desc, blurb in SECTOR_PAGES:
        try:
            build_sector_page(slug, name, desc, blurb)
            print(f"  ✓ {slug}")
            count += 1
        except Exception as e:
            print(f"  ✗ {slug}: {e}")
    
    print("\n=== Expanding Other Pages ===")
    for slug, title, desc, content, faqs, breadcrumbs, related in OTHER_PAGES:
        try:
            path = f"/{slug}"
            filepath = os.path.join(BASE, *slug.split('/'), 'index.html')
            expand_page(filepath, title, desc[:155], path, content, faqs, breadcrumbs, related)
            print(f"  ✓ {slug}")
            count += 1
        except Exception as e:
            print(f"  ✗ {slug}: {e}")
    
    print(f"\n{'='*50}")
    print(f"Total pages expanded: {count}")
    print(f"Added: OG image, hreflang, FAQPage schema, BreadcrumbList, rich content")


if __name__ == "__main__":
    main()
