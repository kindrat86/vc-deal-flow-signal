#!/usr/bin/env python3
"""
GitDealFlow cornerstone article generator.

Generates 12 long-form, investor-search-intent cornerstone articles that fill the
content gaps flagged in the traffic/discovery audit. Each page uses the current
ux.css light template with Article + BreadcrumbList + FAQPage JSON-LD.

Run: python3 _gen_cornerstone_articles.py
Output: flat .html files in learn/, how-to/, checklists/, best/
Then: python3 _rebuild_sitemap.py  (auto-discovers new files)
Then: node scripts/verify-jsonld.mjs .   (JSON-LD validation)
"""

import json
import os
from datetime import date

BASE = os.path.dirname(os.path.abspath(__file__))
DOMAIN = "gitdealflow.com"
BASE_URL = "https://" + DOMAIN
SIGNALS = "https://signals.gitdealflow.com"
PUBDATE = "2026-08-14"
OG_IMAGE = SIGNALS + "/opengraph-image"

# HTML escape that is immune to shadowing
_ESC = str.maketrans({"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;"})


def h(s):
    return str(s).translate(_ESC)


def j(d):
    """Compact JSON for JSON-LD blocks."""
    return json.dumps(d, ensure_ascii=True, separators=(",", ":"))


def render_block(item):
    """Render one body item: str -> <p>, list -> <ul>, dict{table} -> <table>."""
    if isinstance(item, str):
        return "<p>" + h(item) + "</p>"
    if isinstance(item, list):
        lis = "\n".join("<li>" + h(x) + "</li>" for x in item)
        return "<ul>" + lis + "</ul>"
    if isinstance(item, dict) and "table" in item:
        t = item["table"]
        head = "".join("<th>" + h(c) + "</th>" for c in t["headers"])
        rows = ""
        for r in t["rows"]:
            rows += "<tr>" + "".join("<td>" + h(c) + "</td>" for c in r) + "</tr>"
        return (
            '<table style="width:100%;border-collapse:collapse;margin:1em 0;font-size:.95em">'
            "<thead><tr>" + head + "</tr></thead><tbody>" + rows + "</tbody></table>"
        )
    return ""


def build_sections(sections):
    out = []
    for heading, blocks in sections:
        out.append("<h2>" + h(heading) + "</h2>")
        for b in blocks:
            out.append(render_block(b))
    return "\n".join(out)


def build_faq(faqs):
    rows = []
    for q, a in faqs:
        rows.append(
            "<details><summary>" + h(q) + "</summary><p>" + h(a) + "</p></details>"
        )
    return "\n".join(rows)


def build_related(related):
    lis = "\n".join(
        '<li><a href="' + url + '" style="color:#0066cc">' + h(label) + "</a></li>"
        for label, url in related
    )
    return (
        '<ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">'
        + lis
        + "</ul>"
    )


def build_page(a):
    slug = a["slug"]
    directory = a["dir"]
    url = BASE_URL + "/" + directory + "/" + slug
    title = a["title"]
    title_tag = title + " | GitDealFlow"
    meta_desc = a["meta_desc"]
    h1 = a["h1"]
    lead = a.get("lead", "")
    breadcrumb_section = a["breadcrumb_section"]
    breadcrumb_url = a["breadcrumb_url"]

    article_json = j({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": meta_desc,
        "author": {"@type": "Organization", "name": "GitDealFlow", "url": BASE_URL},
        "publisher": {"@type": "Organization", "name": "GitDealFlow", "url": BASE_URL},
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "datePublished": PUBDATE,
        "dateModified": PUBDATE,
    })

    bc_json = j({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL},
            {"@type": "ListItem", "position": 2, "name": breadcrumb_section, "item": breadcrumb_url},
            {"@type": "ListItem", "position": 3, "name": h1, "item": url},
        ],
    })

    faq_entities = [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a_}}
        for q, a_ in a["faqs"]
    ]
    faq_json = j({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq_entities,
    })

    sections_html = build_sections(a["sections"])
    faq_html = build_faq(a["faqs"])
    related_html = build_related(a["related"])

    cta = (
        '<p style="margin-top:1.5em"><a href="https://gitdealflow.com/#signup" '
        'style="display:inline-block;background:#00d4aa;color:#04130e;padding:.8rem 1.5rem;'
        'border-radius:.5rem;font-weight:700;text-decoration:none">Start tracking for free &rarr;</a></p>'
    )

    head = (
        "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n"
        '<meta charset="UTF-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n'
        "<title>" + h(title_tag) + "</title>\n"
        '<link rel="alternate" hreflang="en" href="' + url + '">\n'
        '<link rel="alternate" hreflang="x-default" href="' + url + '">\n'
        '<link rel="stylesheet" href="/ux.css?v=20260808-2">\n'
        '<meta name="theme-color" content="#ffffff">\n'
        '<meta name="color-scheme" content="light">\n'
        '<meta name="description" content="' + h(meta_desc) + '">\n'
        '<link rel="canonical" href="' + url + '">\n'
        '<link rel="manifest" href="/site.webmanifest">\n'
        '<meta name="mobile-web-app-capable" content="yes">\n'
        '<meta name="apple-mobile-web-app-capable" content="yes">\n'
        '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'
        '<meta name="apple-mobile-web-app-title" content="GitDealFlow">\n'
        '<meta property="og:title" content="' + h(title_tag) + '">\n'
        '<meta property="og:description" content="' + h(meta_desc) + '">\n'
        '<meta property="og:type" content="article">\n'
        '<meta property="og:image" content="' + OG_IMAGE + '">\n'
        '<meta property="og:image:width" content="1200">\n'
        '<meta property="og:image:height" content="630">\n'
        '<meta property="og:url" content="' + url + '">\n'
        '<meta property="og:site_name" content="GitDealFlow">\n'
        '<meta name="twitter:card" content="summary_large_image">\n'
        '<meta name="twitter:image" content="' + OG_IMAGE + '">\n'
        '<meta name="twitter:title" content="' + h(title_tag) + '">\n'
        '<meta name="twitter:description" content="' + h(meta_desc) + '">\n'
        '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">\n'
        '<script type="application/ld+json">' + article_json + "</script>\n"
        '<script type="application/ld+json">' + bc_json + "</script>\n"
        '<script type="application/ld+json">' + faq_json + "</script>\n"
        '<script src="/ux.js" defer></script>\n'
        "</head>\n"
    )

    body = (
        '<body style="font-family:-apple-system,system-ui,sans-serif;max-width:760px;margin:60px auto;padding:0 20px;line-height:1.7;color:#1a1a1a;background:#fff">\n'
        '<header style="margin-bottom:40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">'
        '<a href="https://gitdealflow.com" style="font-weight:800;font-size:1.1rem;color:#1a1a1a;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">GitDealFlow</a>'
        '<nav aria-label="Primary navigation" style="display:flex;gap:1.25rem">'
        '<a href="https://gitdealflow.com/pricing" style="color:#0066cc;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">Pricing</a>'
        '<a href="https://signals.gitdealflow.com" style="color:#0066cc;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">Live signals</a>'
        "</nav></header>\n"
        "<main>\n"
        "<h1 style=\"font-size:2em;font-weight:800;margin-bottom:.5em;line-height:1.2\">" + h(h1) + "</h1>\n"
        '<p style="font-size:1.1em;color:#555;margin-bottom:2em">' + h(lead) + "</p>\n"
        + sections_html + "\n"
        + cta + "\n"
        '<section class="faq" style="margin-top:40px">\n'
        '<h2 style="font-size:1.4em;font-weight:700;margin-bottom:20px;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Frequently Asked Questions</h2>\n'
        + faq_html + "\n"
        "</section>\n"
        "</main>\n"
        '<section style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0">\n'
        '<h3 style="font-size:1.1em;font-weight:700;margin-bottom:12px">Related pages</h3>\n'
        + related_html + "\n"
        "</section>\n"
        '<section style="margin-top:30px;padding:20px;background:#f0f7ff;border-radius:8px;border-left:4px solid #0066cc">\n'
        '<p style="margin:0;font-weight:600">&#128269; See live startup momentum data at <a href="https://signals.gitdealflow.com" style="color:#0066cc">signals.gitdealflow.com</a> - free API, MCP server, and real-time GitHub acceleration tracking.</p>\n'
        "</section>\n"
        '<footer style="margin-top:60px;padding-top:20px;border-top:1px solid #e0e0e0;color:#888;font-size:.85em">\n'
        "<p><strong>GitDealFlow</strong> - See which startups are heating up before they raise.</p>\n"
        '<p><a href="https://gitdealflow.com" style="color:#555">Home</a> &middot; <a href="https://gitdealflow.com/pricing" style="color:#555">Pricing</a> &middot; <a href="https://signals.gitdealflow.com" style="color:#555">Live signals</a></p>\n'
        "</footer>\n"
        "<!-- BRUNSON TRUST BAR - idempotency:trust-bar-v1 -->\n"
        "<!-- /BRUNSON TRUST BAR -->\n"
        "</body>\n</html>\n"
    )

    return head + body


# ============================================================================
# Content definitions
# ============================================================================

SIGNAL_SENTENCE = (
    "GitDealFlow reads three public GitHub signals (commit velocity, contributor growth, "
    "and repository expansion) across 350+ venture-backed startups in 15 sectors, and "
    "surfaces breakout engineering teams 3 to 6 weeks before fundraise announcements."
)

ARTICLES = [
    # 1 ----------------------------------------------------------------
    {
        "dir": "learn",
        "slug": "what-is-commit-velocity",
        "title": "What Is Commit Velocity? Definition and Why It Predicts Fundraising",
        "meta_desc": "Commit velocity measures how fast a startup's engineering team ships code. Learn what it is, how to read it, and why it predicts fundraises 3 to 6 weeks early.",
        "h1": "What Is Commit Velocity?",
        "lead": "Commit velocity is the rate at which a startup's engineers commit code to public repositories, usually measured in commits per week. It is one of the few leading indicators of startup traction that you can read for free, and it has historically risen 3 to 6 weeks before a fundraise is announced.",
        "breadcrumb_section": "Learn",
        "breadcrumb_url": BASE_URL + "/learn",
        "sections": [
            ("What commit velocity actually measures", [
                "Commit velocity counts how frequently a team pushes code. A startup shipping daily is committing far more often than one that pushes once a month. Raw commit counts are noisy, so the useful form is the trend over time: is velocity rising, flat, or falling across 4 to 12 weeks.",
                "Velocity is a proxy for execution, not for code quality. A team that ships constantly is answering the question investors care about most: can this team actually build and iterate? In early-stage investing, where revenue and product-market fit are often unproven, shipping speed is one of the best available signals of execution.",
            ]),
            ("Why commit velocity predicts fundraising", [
                "The pattern is causal, not just correlational. When a startup prepares to raise, it accelerates: founders push to ship the roadmap items they will demo, engineers race to close the gaps diligence will expose, and the team front-loads work before the distraction of a fundraise process.",
                "That acceleration shows up in public GitHub activity before it shows up anywhere else. A round announcement, a press hit, or a Crunchbase entry is a lagging indicator; the commit spike that preceded it is the leading indicator. GitDealFlow's published methodology (SSRN abstract 6606558) documents this lead time across a panel of 219 startup-period observations across 55 startups.",
            ]),
            ("How to read commit velocity like an investor", [
                "Three questions turn a raw commit count into a signal:",
                [
                    "Trend: is the 4-week average rising or falling? A sustained rise is bullish; a one-week spike is noise.",
                    "Concentration: is the work coming from one person or a team? Velocity driven by a single founder is fragile; velocity spread across contributors is durable.",
                    "Sector context: a developer-tools startup will commit differently from a biotech startup. Compare within sector, not across sectors.",
                ],
                "GitDealFlow normalizes velocity by sector so that a fintech team and a developer-tools team are judged on the same relative scale. That normalization is what makes the signal usable across a portfolio.",
            ]),
            ("What commit velocity does NOT tell you", [
                "Commit velocity has real limits, and good investors hold them in mind:",
                [
                    "It can be gamed: teams can inflate commits with trivial changes. Sustained velocity over months is hard to fake, but single-week spikes are not evidence.",
                    "It is blind to private work: a team that moved development to private repos or internal tools disappears from the public signal.",
                    "It says nothing about quality: shipping fast and shipping well are different. Velocity is an execution signal, not a code-quality audit.",
                ],
                "This is why commit velocity should never be used alone. The strongest readings combine velocity with contributor growth and repository expansion, the other two signals GitDealFlow tracks.",
            ]),
            ("Using commit velocity in your process", [
                "Investors use commit velocity in three places: sourcing (find teams whose velocity just broke out), screening (quickly rank a long list of candidates by execution evidence), and diligence (confirm that a founder's claims about momentum match the public record).",
                "The weekly GitDealFlow digest surfaces the five startups with the strongest velocity breakouts each Sunday, so the signal arrives pre-packaged rather than requiring you to run the numbers yourself.",
            ]),
        ],
        "faqs": [
            ("What is a good commit velocity for a startup?", "There is no universal number. Velocity is meaningful only as a trend and relative to sector. GitDealFlow normalizes by sector, so a fintech team and a developer-tools team are comparable on the same relative scale. Focus on rising 4-week averages, not absolute counts."),
            ("Can commit velocity be faked?", "Single-week spikes can be inflated with trivial commits, but sustained velocity across months is hard to fake. GitDealFlow tracks 350+ startups over time, so anomalies and one-off spikes stand out against each team's own history."),
            ("Does commit velocity equal product velocity?", "Not always. Some teams commit often but ship little. That is why GitDealFlow combines velocity with contributor growth and repository expansion to filter noise. Look for rising velocity with rising contributors, not velocity alone."),
            ("How often is commit velocity data updated?", "Weekly. New signals appear every Monday based on the prior week's public GitHub activity."),
        ],
        "related": [
            ("What Is Engineering Velocity?", BASE_URL + "/learn/what-is-engineering-velocity"),
            ("What Is Contributor Growth?", BASE_URL + "/learn/what-is-contributor-growth"),
            ("Engineering Benchmarks by Stage", BASE_URL + "/learn/engineering-benchmarks-by-stage"),
            ("GitHub Due Diligence Checklist", BASE_URL + "/checklists/github-due-diligence-checklist"),
        ],
    },
    # 2 ----------------------------------------------------------------
    {
        "dir": "learn",
        "slug": "what-is-engineering-velocity",
        "title": "What Is Engineering Velocity? The Leading Indicator VCs Miss",
        "meta_desc": "Engineering velocity measures how fast a startup ships software. Learn the three components, why it leads fundraising by 3 to 6 weeks, and how investors use it.",
        "h1": "What Is Engineering Velocity?",
        "lead": "Engineering velocity is the rate at which a startup's engineering team produces software. More than a raw commit count, it combines how fast the team ships, how fast the team is growing, and how fast its codebase is expanding into new areas. It is the leading indicator most VCs never look at.",
        "breadcrumb_section": "Learn",
        "breadcrumb_url": BASE_URL + "/learn",
        "sections": [
            ("The three components of engineering velocity", [
                "A complete picture of engineering velocity is built from three public signals:",
                [
                    "Commit velocity: how frequently the team pushes code, the raw pace of shipping.",
                    "Contributor growth: how many distinct developers are committing, a measure of team expansion and hiring.",
                    "Repository expansion: how many new public repositories and lines of code are appearing, a measure of exploration into new product areas.",
                ],
                "Each signal answers a different question. Velocity asks 'are they shipping?', contributor growth asks 'are they scaling?', and repository expansion asks 'are they expanding?'. Together they separate real momentum from activity theater.",
            ]),
            ("Why engineering velocity is a leading indicator", [
                "Most investor data is lagging. Funding rounds, press coverage, and revenue reports all describe what already happened. Engineering velocity describes what is happening right now, in public, before anyone announces anything.",
                "Teams accelerate before they raise because fundraising forces deadlines: the roadmap gets compressed, hiring decisions get made, and the codebase is pushed forward to support the pitch. That acceleration is visible in GitHub weeks before the round hits the press. This is the core insight behind GitDealFlow: 3 to 6 weeks of lead time, documented in a published methodology on SSRN.",
            ]),
            ("Engineering velocity vs product velocity", [
                "These are related but not identical. Product velocity is about what ships to customers: features, releases, outcomes. Engineering velocity is about what the team is producing in code.",
                "A team can have high engineering velocity and low product velocity if it is building the wrong thing. A team can also have high product velocity with lower engineering velocity if it is efficient. The practical rule: engineering velocity is a signal of execution capacity, and it is most useful early, when there is no product revenue to measure yet.",
            ]),
            ("Reading velocity in context", [
                "Velocity is never meaningful in the abstract. Three contexts matter:",
                [
                    "Stage: a pre-seed team of three commits differently from a Series B team of forty.",
                    "Sector: hardware and biotech teams commit differently from pure software teams.",
                    "Geography and tooling: some teams work in private repos or use GitLab, which changes what is publicly visible.",
                ],
                "GitDealFlow handles the sector problem by normalizing every startup's momentum relative to its sector peers. That normalization is what lets you compare a fintech breakout to a developer-tools breakout on one leaderboard.",
            ]),
            ("How investors use engineering velocity", [
                "The workflow is simple: watch for velocity breakouts, verify them against contributor growth, then reach out while the round is still being assembled. The signal does the sourcing; you do the judgment.",
                "The free weekly GitDealFlow digest ships five breakout names every Sunday, each verifiable on GitHub, typically 21 to 47 days before the round is public.",
            ]),
        ],
        "faqs": [
            ("What is the difference between commit velocity and engineering velocity?", "Commit velocity is one component: how often the team commits code. Engineering velocity is the broader concept that also includes contributor growth and repository expansion. Commit velocity measures pace; engineering velocity measures pace, scale, and direction together."),
            ("Why do VCs miss engineering velocity?", "Most VCs run on lagging data sources: Crunchbase, press, and their own networks. Public GitHub activity is free but requires engineering-adjacent tooling and a weekly routine to read. Most funds have never built that muscle."),
            ("Is high engineering velocity always good?", "Not always. Velocity that comes from one founder is fragile, and velocity building the wrong product is wasted effort. The signal is strongest when velocity rises together with contributor growth and is consistent over months."),
        ],
        "related": [
            ("What Is Commit Velocity?", BASE_URL + "/learn/what-is-commit-velocity"),
            ("What Is Contributor Growth?", BASE_URL + "/learn/what-is-contributor-growth"),
            ("How to Evaluate a Startup's Engineering Team", BASE_URL + "/how-to/how-to-evaluate-a-startups-engineering-team"),
            ("GitHub Signals for VC Due Diligence", BASE_URL + "/learn/github-signals-for-vc-due-diligence"),
        ],
    },
    # 3 ----------------------------------------------------------------
    {
        "dir": "learn",
        "slug": "what-is-contributor-growth",
        "title": "What Is Contributor Growth? Reading Team Expansion as a Buy Signal",
        "meta_desc": "Contributor growth tracks how many developers are committing to a startup's repos. Learn why rising contributor counts signal conviction and how to read the trend.",
        "h1": "What Is Contributor Growth?",
        "lead": "Contributor growth measures how many distinct developers are committing code to a startup's repositories over time. When a team grows from three contributors to eight in a quarter, it is hiring and shipping at once, and that is one of the strongest early signals an investor can read for free.",
        "breadcrumb_section": "Learn",
        "breadcrumb_url": BASE_URL + "/learn",
        "sections": [
            ("What contributor growth measures", [
                "Contributor growth counts the number of unique people actively committing to a startup's public repositories, and watches how that number changes week over week. It is distinct from commit velocity: velocity measures output, contributor growth measures the size and shape of the team producing it.",
                "A rising contributor count usually means one of two things: the team is hiring, or an open-source project is attracting external contributors. Both are bullish for different reasons, and a good signal separates the two.",
            ]),
            ("Why team expansion is a buy signal", [
                "Hiring is conviction made visible. A founder who adds engineers is betting their own cash and equity that the roadmap is worth building, and they are doing it before revenue proves it out. That is a far stronger signal than a pitch deck slide that says 'we are hiring'.",
                "Open-source contributor growth is a different but equally interesting signal: it means developers outside the company find the product useful enough to contribute. For developer-tools and infrastructure startups, external contributors are early product-market fit in code form.",
            ]),
            ("How to read the trend", [
                "As with all these signals, the trend matters more than the snapshot:",
                [
                    "Steady growth: hiring and retaining engineers, the healthiest pattern.",
                    "A step-change jump: often a new hire batch or a fundraising-driven hiring sprint.",
                    "Decline: churn, a funding gap, or a pivot, all worth investigating.",
                    "Flat with rising velocity: a small team doing more with less, which can be efficient or can signal burnout risk.",
                ],
                "GitDealFlow tracks contributor counts weekly across 350+ startups, so these patterns are visible as a time series rather than a single number.",
            ]),
            ("Red flags in contributor data", [
                "Not all contributor growth is good news. Watch for:",
                [
                    "The single-bus-factor team: one founder accounts for nearly all commits. That is concentration risk, not momentum.",
                    "Contractor churn: many short-tenure contributors who appear and vanish can inflate the count without adding real team.",
                    "Vanity open-source: external contributors fixing typos can inflate the count without signaling real product pull.",
                ],
                "The mitigation is always the same: read contributor growth alongside commit velocity and repository expansion, and look for teams where all three move together.",
            ]),
            ("Contributor growth in the diligence workflow", [
                "In diligence, contributor growth answers the question 'is this team actually scaling?'. A founder may claim a team of ten engineers, but the public record either confirms or contradicts that claim. The GitHub Due Diligence Checklist uses contributor growth as one of its core checks for exactly this reason.",
            ]),
        ],
        "faqs": [
            ("What counts as a contributor?", "A distinct developer who commits code to a startup's public repositories within a tracking window. The count is of unique people, not of commits, so one prolific engineer does not distort the team-size signal."),
            ("Is open-source contributor growth the same as team growth?", "No. Team growth is the company hiring its own engineers; open-source growth is external developers contributing. Both are useful but they signal different things: hiring signals conviction, external contribution signals early product pull."),
            ("Can contributor counts be inflated?", "Yes, most easily with short-tenure contractors or trivial external pull requests. That is why contributor growth should be read as a trend and combined with commit velocity and repository expansion."),
        ],
        "related": [
            ("What Is Commit Velocity?", BASE_URL + "/learn/what-is-commit-velocity"),
            ("What Is Engineering Velocity?", BASE_URL + "/learn/what-is-engineering-velocity"),
            ("How to Source Startup Deals on GitHub", BASE_URL + "/how-to/how-to-source-deals-on-github"),
            ("GitHub Due Diligence Checklist", BASE_URL + "/checklists/github-due-diligence-checklist"),
        ],
    },
    # 4 ----------------------------------------------------------------
    {
        "dir": "how-to",
        "slug": "how-to-evaluate-a-startups-engineering-team",
        "title": "How to Evaluate a Startup's Engineering Team Before You Invest",
        "meta_desc": "A four-step framework for evaluating a startup's engineering team using public GitHub data: footprint, velocity, repository expansion, and cross-checking.",
        "h1": "How to Evaluate a Startup's Engineering Team",
        "lead": "You cannot sit in on a team's standups before you invest, but you can read the public record of how they build. This four-step framework evaluates a startup's engineering team using evidence anyone can inspect on GitHub, before you commit a dollar.",
        "breadcrumb_section": "How-To",
        "breadcrumb_url": BASE_URL + "/how-to",
        "sections": [
            ("Step 1: Map the public engineering footprint", [
                "Start by finding what the team actually builds in public. Locate the company's GitHub organization, list its repositories, and note which are active versus dormant. The footprint itself is informative: a team with one active repo is different from one with a dozen.",
                "Ask: are the repos the real product, or a marketing demo? Is the main product open source or private? If the core product is private, the public signal will be thinner, and you should weight the other signals accordingly.",
            ]),
            ("Step 2: Read velocity and contributor growth over time", [
                "Pull commit velocity and contributor counts for the last 12 weeks, not the last week. Look for three things:",
                [
                    "Is velocity trending up, flat, or down? A rising 4-week average is execution evidence; a falling one is a warning.",
                    "Is the work spread across a team, or concentrated in one founder? Concentration is fragility.",
                    "Is contributor count growing? Team expansion is conviction made visible.",
                ],
                "GitDealFlow computes these signals weekly and normalizes them by sector, so you get a comparable momentum score instead of raw numbers you have to interpret yourself.",
            ]),
            ("Step 3: Check repository expansion and architecture signals", [
                "New repositories are a window into where the team is heading. Teams create new repos when they start new product lines, spin out tooling, or open-source a component. A cluster of new repos often precedes a product launch.",
                "Also read the structural signals: how issues and pull requests are handled, whether code review is happening, and whether the commit history is coherent. Sloppy process in public is usually sloppy process in private too.",
            ]),
            ("Step 4: Triangulate with non-GitHub signals", [
                "Engineering evidence is one input, not the whole picture. Cross-check it against:",
                [
                    "Hiring: are they actually adding the engineers their public activity implies?",
                    "Product: does the shipped product match the claimed roadmap?",
                    "Funding and network: do the founders have the access and relationships to raise?",
                    "Narrative: does the founder's story match the public record of their work?",
                ],
                "When the GitHub evidence and the founder's claims disagree, believe the GitHub evidence. It is the one record the founder did not write for you.",
            ]),
            ("Common mistakes when evaluating engineering teams", [
                "Investors most often go wrong in four ways: reading a single-week snapshot instead of a trend, comparing across sectors instead of within them, overweighting commit counts while ignoring contributor concentration, and assuming no public footprint means no engineering. A thin public footprint is a data limitation, not proof of incompetence, but it does mean you should lean harder on qualitative diligence.",
            ]),
        ],
        "faqs": [
            ("What if the startup's code is all in private repos?", "Then the public signal is limited, and you should weight qualitative diligence more heavily. The public footprint is a data source, not the only one. A thin footprint is not proof of a weak team, but it removes one of your cheapest checks."),
            ("How long a history do I need before I trust the signal?", "Twelve weeks of weekly data is the practical minimum to see a trend. Anything shorter is a snapshot, and snapshots mislead. GitDealFlow tracks teams continuously so the history is already there when you need it."),
            ("Is commit velocity a substitute for a technical interview?", "No. It is evidence of execution pace, not of architecture judgment or code quality. Use it to decide who is worth a deeper look, then do the qualitative work on the shortlist."),
        ],
        "related": [
            ("What Is Engineering Velocity?", BASE_URL + "/learn/what-is-engineering-velocity"),
            ("What Is Contributor Growth?", BASE_URL + "/learn/what-is-contributor-growth"),
            ("GitHub Due Diligence Checklist", BASE_URL + "/checklists/github-due-diligence-checklist"),
            ("How to Do Technical Due Diligence on a Startup", BASE_URL + "/how-to/how-to-do-technical-due-diligence-on-a-startup"),
        ],
    },
    # 5 ----------------------------------------------------------------
    {
        "dir": "how-to",
        "slug": "how-to-source-deals-on-github",
        "title": "How to Source Startup Deals on GitHub: A Step-by-Step Playbook",
        "meta_desc": "GitHub is an underused deal source. Learn a four-step playbook to source startup deals from public engineering activity before funding is announced.",
        "h1": "How to Source Startup Deals on GitHub",
        "lead": "Every round announcement you read started weeks earlier as a spike in public engineering activity. This playbook turns GitHub, the world's largest public record of shipping, into a repeatable deal-sourcing channel.",
        "breadcrumb_section": "How-To",
        "breadcrumb_url": BASE_URL + "/how-to",
        "sections": [
            ("Why GitHub is an underused deal source", [
                "GitHub is public, free, and updated in real time, yet almost no fund sources from it. The reason is simple: raw commit data is noisy and engineering-flavored, so investors who lack a technical filter skip it. That inefficiency is your edge.",
                "The opportunity is structural. Funding announcements, press, and Crunchbase are crowded, lagging, and indexed by everyone. Engineering activity is a leading signal that almost no one is reading systematically. The investor who builds the habit wins the deals others see three to six weeks late.",
            ]),
            ("Step 1: Define your GitHub sourcing universe", [
                "You cannot watch all of GitHub, so define the universe that matters to your thesis:",
                [
                    "Sectors: pick 2 to 5 sectors where engineering activity is a meaningful signal (developer tools, AI/ML, fintech, cybersecurity, dev infrastructure).",
                    "Stage: pre-seed and seed are where the signal is strongest, before revenue exists to measure.",
                    "Geography and thesis fit: filter to teams you can actually access and write checks into.",
                ],
                "GitDealFlow maintains a universe of 350+ venture-backed startups across 15 sectors, updated weekly, so the filtering is already done for you if you prefer to start from a curated list.",
            ]),
            ("Step 2: Set up velocity and contributor alerts", [
                "Once the universe is defined, watch for breakouts rather than scanning continuously. The signals to watch:",
                [
                    "A sustained rise in commit velocity across 4+ weeks.",
                    "A step-change in contributor count, indicating a hiring sprint.",
                    "A cluster of new repositories, indicating a new product push.",
                ],
                "The weekly GitDealFlow digest packages the top breakouts into five names every Sunday, with the underlying GitHub evidence attached so you can verify before you reach out.",
            ]),
            ("Step 3: Qualify signals into a watchlist", [
                "A breakout is not a deal; it is a lead. Qualify each one by asking: is the team's momentum real and sustained, is the sector within my thesis, and can I get access? Score each candidate and keep a watchlist of the ones that pass.",
                "Most breakouts will not become investments, and that is fine. The point of the watchlist is to have a warm, pre-qualified set of teams to approach, not to act on every signal.",
            ]),
            ("Step 4: Reach out before the round", [
                "The entire advantage of GitHub sourcing is timing. If you reach a team while the round is still being assembled, you are a source of access rather than a late check in a crowded round. Reference the specific work you saw, because a founder will instantly know you did the homework.",
                "A short, specific note ('I noticed your team's commit velocity has tripled this quarter') lands far better than a generic 'I'd love to learn more'. The signal is your icebreaker.",
            ]),
        ],
        "faqs": [
            ("Does GitHub sourcing work for non-technical investors?", "Yes. You do not need to read code, only to read the trends: is velocity rising, is the team growing, is the repo footprint expanding. GitDealFlow does the code-level reading and hands you the momentum score and the names."),
            ("How early can GitHub sourcing get me into a deal?", "The lead time between the engineering breakout and the public round is typically 3 to 6 weeks, and often 21 to 47 days. That window is where access is easiest and terms are best."),
            ("Is this only for software startups?", "It is strongest for software and software-adjacent companies (fintech, AI, dev tools, security) where code is the product. Hardware and biotech have thinner public engineering footprints, so the signal is weaker there."),
        ],
        "related": [
            ("How to Build a Startup Watchlist", BASE_URL + "/how-to/how-to-build-a-startup-watchlist"),
            ("Venture Scouting: Best Practices", BASE_URL + "/learn/venture-scouting-best-practices"),
            ("How to Find Pre-Seed Startups Before They Raise", BASE_URL + "/how-to/find-pre-seed-startups"),
            ("Best Deal Flow Software", BASE_URL + "/best/best-deal-flow-software"),
        ],
    },
    # 6 ----------------------------------------------------------------
    {
        "dir": "how-to",
        "slug": "how-to-build-a-startup-watchlist",
        "title": "How to Build a Startup Watchlist That Actually Works",
        "meta_desc": "A watchlist only works if it drives action. Learn a four-step method to build, rank, track, and act on a startup watchlist using public momentum data.",
        "h1": "How to Build a Startup Watchlist",
        "lead": "Most startup watchlists are graveyards: names get added, nothing gets tracked, and no check ever happens. This method turns a watchlist into a working pipeline by attaching a momentum signal to every name and a weekly review to the process.",
        "breadcrumb_section": "How-To",
        "breadcrumb_url": BASE_URL + "/how-to",
        "sections": [
            ("Step 1: Pick your watchlist criteria", [
                "A watchlist is only useful if it is smaller than your attention span. Decide up front what earns a spot: thesis fit, sector, stage, and a concrete momentum threshold. If a team does not meet the bar, it does not go on the list.",
                "The criteria should be written down. Vague lists grow until they are unusable; explicit criteria keep the list honest and make the weekly review a series of yes-or-no decisions.",
            ]),
            ("Step 2: Add and rank candidates", [
                "Every candidate gets a score, not just a name. Rank on the dimensions that predict your success: momentum trend, team quality, market, and access. The ranking matters because it decides where your limited outreach time goes.",
                "A simple three-tier ranking (A: reach out this week, B: track, C: parked) keeps the list actionable. Most names should be B or C; the A tier is your actual pipeline.",
            ]),
            ("Step 3: Track momentum week over week", [
                "The watchlist only earns its keep if you watch it change. Each week, ask one question for every name: did their momentum go up, down, or sideways? A team whose velocity just broke out is an outreach priority; a team whose velocity is collapsing is a warning to investigate or drop.",
                "This is where a data source matters. GitDealFlow tracks commit velocity, contributor growth, and repository expansion weekly across 350+ startups, so the momentum question is answered by the data instead of by your memory.",
            ]),
            ("Step 4: Act on changes", [
                "The weekly review should end in actions, not observations. A momentum breakout becomes a reach-out. A sustained decline becomes a question for the founder. A new repo cluster becomes a reason to re-rank the team up.",
                "The discipline is the whole game: same time every week, same one question per name, same follow-through. A watchlist with a weekly routine is a pipeline; without one it is a list of URLs.",
            ]),
            ("Tools for running a watchlist", [
                "You can run a watchlist in a spreadsheet, but the heavy lifting is keeping the momentum data fresh. Two approaches:",
                [
                    "Manual: a sheet with one row per startup and a weekly column for the momentum trend, updated from your own GitHub review.",
                    "Automated: a signal layer that tracks momentum for you and surfaces the changes, so the weekly review is reading a report instead of doing arithmetic.",
                ],
                "GitDealFlow's free tier includes sector search and trending startups; paid tiers add saved watchlists and alerts when a tracked team's momentum changes.",
            ]),
        ],
        "faqs": [
            ("How many startups should be on a watchlist?", "Fewer than you think. A focused list of 20 to 50 names you actually review weekly beats a list of 500 you never open. The constraint is your weekly attention, not the number of interesting startups."),
            ("How often should I review my watchlist?", "Weekly. The whole advantage of engineering-momentum data is that it changes week to week, so a monthly review misses the breakout window. Same time every week is the habit that makes it work."),
            ("What triggers a reach-out?", "A sustained momentum breakout (4+ weeks of rising velocity), a contributor-growth step-change, or a cluster of new repositories. Any of these is a reason to move a name to the A tier and reach out that week."),
        ],
        "related": [
            ("How to Source Startup Deals on GitHub", BASE_URL + "/how-to/how-to-source-deals-on-github"),
            ("How to Track VC Deals Using Public Data", BASE_URL + "/how-to/track-vc-deals"),
            ("Venture Scouting: Best Practices", BASE_URL + "/learn/venture-scouting-best-practices"),
            ("Best Deal Flow Software", BASE_URL + "/best/best-deal-flow-software"),
        ],
    },
    # 7 ----------------------------------------------------------------
    {
        "dir": "how-to",
        "slug": "how-to-do-technical-due-diligence-on-a-startup",
        "title": "How to Do Technical Due Diligence on a Startup (6 Steps)",
        "meta_desc": "A six-step method for technical due diligence on a startup, using public GitHub evidence to verify execution, process, and team claims before you invest.",
        "h1": "How to Do Technical Due Diligence on a Startup",
        "lead": "Technical due diligence answers the question every investor faces but few know how to check: is the technology real, is the team capable, and will it scale? This six-step method uses public GitHub evidence to answer those questions before you sign.",
        "breadcrumb_section": "How-To",
        "breadcrumb_url": BASE_URL + "/how-to",
        "sections": [
            ("What technical due diligence covers", [
                "Technical due diligence is the check on the engineering substance of a deal. It covers whether the product actually exists, whether the team can build and scale it, and whether the architecture will support the growth the pitch assumes.",
                "You do not need to be an engineer to run a useful version of it. You need to know what evidence to ask for and how to read the public record that either confirms or contradicts the founder's claims.",
            ]),
            ("Step 1: Verify the product exists in code", [
                "The first check is the most basic: does the company's public GitHub footprint match the product the founder described? Look for the repositories behind the product, check their activity, and confirm the code is real, current, and coherent, not a demo built for the data room.",
                "If the core product is private, ask for a walkthrough and treat the thin public footprint as a data limitation rather than a red flag.",
            ]),
            ("Step 2: Read the velocity and contributor history", [
                "Pull 12 weeks of commit velocity and contributor growth. A rising trend with a growing team is the healthy pattern. A flat or falling trend, a single-bus-factor team, or heavy contractor churn are all things to probe with the founder.",
                "This is the quantitative core of technical DD: it converts the founder's claims about momentum and team into a verifiable time series.",
            ]),
            ("Step 3: Assess engineering process", [
                "Read how the team works in public: how pull requests are reviewed, how issues are triaged, whether there are tests, and whether releases are disciplined. Sloppy public process is a leading indicator of sloppy private process.",
                "Process matters because diligence is a prediction about the future: you are betting the team can keep shipping at scale, not just that they shipped once.",
            ]),
            ("Step 4: Check for red flags", [
                "A short list of red flags to look for, none of them fatal alone but all of them worth a conversation:",
                [
                    "One founder accounting for nearly all commits, and no hiring despite claimed growth.",
                    "A velocity spike in the weeks before the raise that does not match prior history.",
                    "Repositories that were abandoned mid-feature, suggesting a pattern of not finishing.",
                    "Public claims (team size, product scope) that do not match the public record.",
                ],
                "None of these prove a bad investment, but each is a question the founder should be able to answer cleanly.",
            ]),
            ("Step 5: Write it up", [
                "Technical DD only matters if it lands in the memo. Summarize the evidence in one page: what the footprint shows, the velocity and contributor trend, the process assessment, and the open questions. The GitHub Due Diligence Checklist is built for exactly this write-up, with 21 checks across four categories and a scoring rubric.",
            ]),
        ],
        "faqs": [
            ("Do I need to be technical to do technical due diligence?", "No. You need to read trends and patterns, not code. Is velocity rising, is the team growing, is the process disciplined? A data layer like GitDealFlow hands you those trends as scores, so the analysis is judgment, not arithmetic."),
            ("What is the single most important technical DD check?", "The trend in commit velocity and contributor growth over 12 weeks. It converts the founder's claims about momentum into a verifiable record, and it is the hardest signal to fake over a meaningful window."),
            ("Should I skip technical DD for a seed round?", "No, but weight it by stage. At seed you are checking that the team can execute, not auditing a mature architecture. The same public evidence answers the seed question: is this team actually shipping?"),
        ],
        "related": [
            ("GitHub Due Diligence Checklist", BASE_URL + "/checklists/github-due-diligence-checklist"),
            ("How to Evaluate a Startup's Engineering Team", BASE_URL + "/how-to/how-to-evaluate-a-startups-engineering-team"),
            ("GitHub Signals for VC Due Diligence", BASE_URL + "/learn/github-signals-for-vc-due-diligence"),
            ("What Is Engineering Velocity?", BASE_URL + "/learn/what-is-engineering-velocity"),
        ],
    },
    # 8 ----------------------------------------------------------------
    {
        "dir": "checklists",
        "slug": "github-due-diligence-checklist",
        "title": "GitHub Due Diligence Checklist: 21 Checks Before You Invest",
        "meta_desc": "A 21-point checklist for due diligence on a startup's GitHub footprint: velocity, team, process, and red flags, with a scoring rubric.",
        "h1": "GitHub Due Diligence Checklist",
        "lead": "This is the checklist version of technical due diligence: 21 checks across four categories, each answerable from public GitHub data. Run it on any software startup before you invest, and attach the results to your investment memo.",
        "breadcrumb_section": "Checklists",
        "breadcrumb_url": BASE_URL + "/checklists",
        "sections": [
            ("Velocity: is the team actually shipping?", [
                "1. Is 12-week commit velocity trending up, flat, or down?",
                "2. Is there a sustained rise in the 4-week average, or only a one-week spike?",
                "3. Does the velocity match the founder's claims about momentum?",
                "4. Is there active development in the repositories behind the core product?",
                "5. Are there abandoned repositories that suggest a pattern of not finishing?",
            ]),
            ("Team: is the engineering team real and scaling?", [
                "6. How many distinct contributors committed in the last 90 days?",
                "7. Is contributor count growing, flat, or shrinking?",
                "8. Is the work concentrated in one founder, or spread across a team?",
                "9. Does the team size match what the founder claimed in the pitch?",
                "10. Is there evidence of short-tenure contractor churn inflating the count?",
            ]),
            ("Process: how do they actually work?", [
                "11. Are pull requests reviewed, or merged without review?",
                "12. Are issues triaged and closed, or left to pile up?",
                "13. Is there a test suite, and is it run?",
                "14. Are releases tagged and versioned with discipline?",
                "15. Is commit history coherent, or a series of vague 'fix' messages?",
                "16. Is there documentation that suggests the code is maintainable?",
            ]),
            ("Expansion and red flags: where are they heading?", [
                "17. Are new repositories appearing, indicating new product lines?",
                "18. Is the codebase growing in a direction that matches the roadmap?",
                "19. Is there a velocity spike right before the raise that does not match history?",
                "20. Are there public claims (team, product, traction) that contradict the record?",
                "21. Does the overall footprint match the stage and sector the founder describes?",
            ]),
            ("How to score the checklist", [
                "Score each check as pass, warn, or fail. Then use a simple rubric:",
                [
                    "Strong: 18+ pass, no fails. The engineering substance supports the deal.",
                    "Mixed: 12 to 17 pass, or 1 to 2 fails. Proceed only if the founder answers the warns cleanly.",
                    "Weak: fewer than 12 pass, or 3+ fails. The engineering evidence does not support the investment.",
                ],
                "The point is not the number; it is forcing every claim through a public-evidence filter. A founder who clears the checklist cleanly has done something real.",
            ]),
            ("What to do with the results", [
                "Attach the scored checklist to your investment memo. The pass and warn items become your diligence questions for the founder; the fail items become either deal-breakers or the specific conditions you negotiate around.",
                "For teams where the core product is private, note the thinner footprint explicitly and lean on qualitative diligence instead of pretending the signal is complete.",
            ]),
        ],
        "faqs": [
            ("How long does this checklist take to run?", "With a signal layer that already tracks velocity and contributor growth, the velocity and team sections take minutes. The process and red-flag sections require reading the repositories, which is 30 to 60 minutes per company."),
            ("Is this checklist only for software startups?", "It is strongest for software and software-adjacent companies where code is the product. For hardware and biotech, the public footprint is thinner and you should weight qualitative diligence more heavily."),
            ("Can I use this checklist for open-source-heavy companies?", "Yes, and you should add a check for external contributor pull: is the open-source community actually using and contributing to the project? For developer-tools companies, that is early product-market fit in code form."),
        ],
        "related": [
            ("How to Do Technical Due Diligence on a Startup", BASE_URL + "/how-to/how-to-do-technical-due-diligence-on-a-startup"),
            ("How to Evaluate a Startup's Engineering Team", BASE_URL + "/how-to/how-to-evaluate-a-startups-engineering-team"),
            ("What Is Commit Velocity?", BASE_URL + "/learn/what-is-commit-velocity"),
            ("Technical Due Diligence Checklist", BASE_URL + "/checklists/technical-due-diligence-checklist"),
        ],
    },
    # 9 ----------------------------------------------------------------
    {
        "dir": "learn",
        "slug": "venture-scouting-best-practices",
        "title": "Venture Scouting: Best Practices and a 4-Step Playbook",
        "meta_desc": "What venture scouts actually do, and the best practices that separate productive scouts from busy ones: leading indicators, a weekly routine, receipts, and access.",
        "h1": "Venture Scouting: Best Practices",
        "lead": "Scouting is a sourcing role: find exceptional founders before the market does, and bring them to a fund or syndicate that can write the check. The best scouts do not network harder, they source from better information, on a schedule, with receipts. This is the playbook.",
        "breadcrumb_section": "Learn",
        "breadcrumb_url": BASE_URL + "/learn",
        "sections": [
            ("What venture scouts actually do", [
                "A scout's job is deal origination, not diligence or portfolio management. The deliverable is a steady stream of high-quality, early-access deal referrals. Scouts are paid for access and judgment, usually via carried interest or a fee per closed deal.",
                "The best scouts are defined by one thing: a repeatable source of deals the fund would not otherwise see. Everything else, brand, network, volume, is secondary to having a differentiated origin channel.",
            ]),
            ("Best practice 1: Source from leading indicators", [
                "Lagging sources (Crunchbase, press, demo days) are crowded because everyone reads them. Leading indicators (engineering activity, hiring, product signals) are uncrowded because they require effort to read. The scout who sources from leading indicators sees deals three to six weeks before the market.",
                "Public GitHub activity is the strongest free leading indicator for software startups. A velocity breakout precedes a round announcement by 3 to 6 weeks, which is exactly the window where a scout's introduction carries the most value.",
            ]),
            ("Best practice 2: Build a repeatable weekly routine", [
                "Scouting compounds through consistency, not intensity. A fixed weekly routine: review the new momentum breakouts, qualify them against your fund's thesis, add the survivors to a watchlist, and reach out to the A tier that week.",
                "The routine removes the question of 'what should I do today' and replaces it with a process. Scouts who ship five qualified referrals a week, every week, outperform scouts who binge-network quarterly.",
            ]),
            ("Best practice 3: Write receipts", [
                "A receipt is a dated, verifiable record of what you saw and when. It proves your picks were early and yours, not borrowed from the public round announcement. The GitDealFlow Scout Score is one form of receipt: a backwards-looking measure of whether a GitHub user starred validated unicorns before the market did.",
                "Receipts matter because scouting is a trust business. A fund will pay a scout who can show 'I flagged this team in week 1, here is the record'. Write down every referral with a date and the signal that triggered it.",
            ]),
            ("Best practice 4: Focus on access and speed", [
                "A scout's value is the introduction, so optimize for access and speed: reach teams while the round is still open, reference the specific signal you saw (it proves you did the work), and route the founder to the decision-maker fastest.",
                "Speed compounds with the leading-indicator approach: if you see the signal three to six weeks early, you have that entire window to be the first credible introduction the founder receives.",
            ]),
        ],
        "faqs": [
            ("How do scouts get paid?", "Typically via carried interest in the fund or syndicate they refer into, or a fee per closed deal. The exact structure varies, but the economics always reward access and early, quality referrals."),
            ("What makes a scout's source differentiated?", "A source is differentiated if the fund could not trivially get the same deals itself. Leading indicators like engineering activity are differentiated; Crunchbase and demo days are not, because everyone already reads them."),
            ("Do I need a big network to be a scout?", "A network helps with access, but a differentiated source is the foundation. A scout with a strong signal source and a thin network can build access over time; a scout with a big network and no differentiated source competes on volume alone."),
        ],
        "related": [
            ("How to Source Startup Deals on GitHub", BASE_URL + "/how-to/how-to-source-deals-on-github"),
            ("How to Build a Startup Watchlist", BASE_URL + "/how-to/how-to-build-a-startup-watchlist"),
            ("What Is a Scout Score?", BASE_URL + "/faq/what-is-a-scout-score"),
            ("Best Deal Flow Software", BASE_URL + "/best/best-deal-flow-software"),
        ],
    },
    # 10 ----------------------------------------------------------------
    {
        "dir": "learn",
        "slug": "github-signals-for-vc-due-diligence",
        "title": "GitHub Signals for VC Due Diligence: A Practical Guide",
        "meta_desc": "How VCs use public GitHub signals (commit velocity, contributor growth, repository expansion) as due-diligence evidence, and what the signals can and cannot prove.",
        "h1": "GitHub Signals for VC Due Diligence",
        "lead": "Due diligence is about verifying claims with evidence, and GitHub is the largest public record of how a software startup actually works. This guide explains the three signals that matter, what they prove, and how to fold them into a standard diligence process.",
        "breadcrumb_section": "Learn",
        "breadcrumb_url": BASE_URL + "/learn",
        "sections": [
            ("Why GitHub is due-diligence evidence", [
                "Most diligence evidence is self-reported: the founder's deck, the data room, the references they chose. GitHub is different because the founder did not write it for you. It is a contemporaneous, third-party record of what the team actually did, week by week.",
                "That property makes it uniquely valuable for verification. When a founder claims a team of ten engineers shipping fast, the GitHub record either confirms it or does not, and the founder cannot edit the past.",
            ]),
            ("The three signals explained", [
                "Three public signals carry most of the diligence value:",
                [
                    "Commit velocity: how frequently the team ships, the execution signal.",
                    "Contributor growth: how the team is scaling, the conviction signal.",
                    "Repository expansion: where the team is heading, the direction signal.",
                ],
                "Read together, they answer the three diligence questions that matter most: can this team execute, is it scaling, and is it building toward the roadmap it pitched?",
            ]),
            ("What the signals can and cannot prove", [
                "Be precise about the evidential weight. The signals prove execution pace, team scaling, and product direction. They do not prove code quality, market demand, or founder integrity, and a thin public footprint (private repos) is a data limitation, not a red flag.",
                "The discipline is to use the signals to verify specific claims, not to generate a blanket score. 'Is the founder's momentum claim true?' is a clean question the data answers. 'Is this a good company?' is not, and no single signal should be asked to answer it.",
            ]),
            ("Folding GitHub signals into your diligence process", [
                "The practical integration is three steps: run the GitHub Due Diligence Checklist early to spot gaps, use the velocity and contributor trends to frame founder questions, and record the results in the memo alongside the financial and legal review.",
                "The signals are cheapest and highest-value at the top of the funnel, where they screen out weak execution before you spend hours on a data room. A 30-minute GitHub review can save a full day of diligence on a team that is not actually shipping.",
            ]),
            ("The limits to keep in mind", [
                "Three limits deserve repeating: the signal is sector-dependent (software-heavy sectors show more), it is gameable in the short run (sustained trends are the antidote), and it is blind to private work. A good process treats GitHub as one strong input among several, not as a substitute for the rest of diligence.",
            ]),
        ],
        "faqs": [
            ("Can GitHub signals replace traditional due diligence?", "No. They verify execution, team scaling, and product direction, but they cannot verify market demand, code quality, or integrity. Use them to make traditional diligence faster and sharper, not to replace it."),
            ("Which sectors have the strongest GitHub signal?", "Software and software-adjacent sectors: developer tools, AI/ML, fintech, cybersecurity, and data infrastructure. Hardware and biotech have thinner public engineering footprints."),
            ("How do I handle a startup with no public GitHub presence?", "Treat it as a data limitation, not a red flag, and weight qualitative diligence more heavily. Ask for a code walkthrough and references who can speak to the team's execution."),
        ],
        "related": [
            ("GitHub Due Diligence Checklist", BASE_URL + "/checklists/github-due-diligence-checklist"),
            ("How to Do Technical Due Diligence on a Startup", BASE_URL + "/how-to/how-to-do-technical-due-diligence-on-a-startup"),
            ("What Is Engineering Velocity?", BASE_URL + "/learn/what-is-engineering-velocity"),
            ("How to Evaluate a Startup's Engineering Team", BASE_URL + "/how-to/how-to-evaluate-a-startups-engineering-team"),
        ],
    },
    # 11 ----------------------------------------------------------------
    {
        "dir": "learn",
        "slug": "engineering-benchmarks-by-stage",
        "title": "Engineering Benchmarks by Funding Stage: Pre-Seed to Series B",
        "meta_desc": "What engineering maturity looks like at each funding stage, and why stage and sector context matter more than any universal benchmark number.",
        "h1": "Engineering Benchmarks by Funding Stage",
        "lead": "There is no universal 'good' number of commits, but there are clear patterns in what engineering maturity looks like at each funding stage. This guide maps those patterns so you can judge a team against its peers, not against a made-up threshold.",
        "breadcrumb_section": "Learn",
        "breadcrumb_url": BASE_URL + "/learn",
        "sections": [
            ("Why stage changes what you look for", [
                "Engineering maturity means something different at each stage. A pre-seed team's job is to prove it can ship at all; a Series B team's job is to prove it can ship at scale with process. Judging a Series B team by pre-seed expectations, or vice versa, produces the wrong conclusion.",
                "The right approach is stage-relative: measure each team against what its stage requires, and against its sector peers, rather than against a universal benchmark that does not exist.",
            ]),
            ("Pre-seed and seed: evidence of shipping", [
                "At the earliest stages, there is usually no revenue and little product history, so the question is simply: can this team build? What to look for:",
                [
                    "Consistent, rising commit velocity showing the team ships continuously, not in bursts.",
                    "A small but real contributor base, typically the founding engineers, with early signs of expansion.",
                    "A repository footprint that matches the product being built, not a demo built for fundraising.",
                ],
                "At this stage, momentum matters more than absolute volume, and a rising trend is far more informative than a high snapshot.",
            ]),
            ("Series A: evidence of scaling", [
                "Series A is where execution must scale, so the signal shifts from 'can they ship' to 'can they scale the team and the process'. What to look for:",
                [
                    "Contributor growth: the team should be expanding in line with the hiring plan.",
                    "Velocity spread across a growing team, not concentrated in the founding engineers.",
                    "Disciplined process: reviewed pull requests, a test suite, and versioned releases.",
                ],
                "A Series A team that is still a single-founder codebase is a concentration risk, regardless of how fast that founder ships.",
            ]),
            ("Series B and beyond: evidence of process", [
                "At Series B and later, the question is whether the engineering organization can survive scale. What to look for:",
                [
                    "A broad contributor base with stable, low-churn growth.",
                    "Clear repository architecture that supports the product roadmap.",
                    "Strong engineering process: code review, testing, CI, and documentation.",
                ],
                "By this stage, raw velocity matters less than sustainability. A team shipping fast on a fragile foundation is a liability, not an asset.",
            ]),
            ("The caveat: no universal numbers", [
                "Any benchmark that quotes a specific 'commits per week per stage' number is inventing precision that does not exist in the data. Sector, product type, team size, and public-versus-private repo choices all change the numbers by more than stage does.",
                "The honest benchmark is relative: is this team's momentum rising, is it scaling, and is it building toward its roadmap, compared to its sector peers? That is exactly what GitDealFlow's sector-normalized momentum score measures, and why it is more useful than a raw count.",
            ]),
        ],
        "faqs": [
            ("Is there a minimum commit count a startup should hit?", "No. Absolute commit counts are not meaningful across sectors, product types, and repo setups. Judge momentum as a trend and relative to sector peers, not against a fixed threshold."),
            ("When should I worry about slow engineering?", "Worry about a falling trend more than a low snapshot: a team whose 12-week velocity is declining is a red flag at any stage. A low but rising trend is often fine, especially at pre-seed."),
            ("Does the benchmark change for open-source companies?", "Yes. Open-source-heavy companies add a second dimension: external contributor pull. Strong external contribution is early product-market fit in code form, and it should be read alongside the internal team signals."),
        ],
        "related": [
            ("What Is Commit Velocity?", BASE_URL + "/learn/what-is-commit-velocity"),
            ("What Is Contributor Growth?", BASE_URL + "/learn/what-is-contributor-growth"),
            ("GitHub Signals for VC Due Diligence", BASE_URL + "/learn/github-signals-for-vc-due-diligence"),
            ("How to Evaluate a Startup's Engineering Team", BASE_URL + "/how-to/how-to-evaluate-a-startups-engineering-team"),
        ],
    },
    # 12 ----------------------------------------------------------------
    {
        "dir": "best",
        "slug": "best-deal-flow-software",
        "title": "Best Deal Flow Software for Investors in 2026 (CRM + Pipeline)",
        "meta_desc": "A buyer's guide to deal flow software: what it does, how to choose, and how CRM-style pipeline tools compare to a signal layer like GitDealFlow.",
        "h1": "Best Deal Flow Software for Investors in 2026",
        "lead": "Deal flow software is the system of record for your pipeline: the tools that capture, track, and manage the startups you are evaluating. This guide explains what to look for, the categories on the market, and where a signal layer fits alongside a CRM.",
        "breadcrumb_section": "Best",
        "breadcrumb_url": BASE_URL + "/best",
        "sections": [
            ("What deal flow software does", [
                "Deal flow software solves one problem: investors see more companies than they can remember. The software captures each company, tracks where it is in your process, and keeps the pipeline visible so deals do not slip.",
                "There are two distinct jobs that get lumped together under 'deal flow': sourcing (finding new companies) and pipeline management (tracking the ones you found). The best setup treats these as separate layers.",
            ]),
            ("How to choose: the criteria that matter", [
                "Judge any deal flow tool against these five criteria before you look at features:",
                [
                    "Capture: how easily can you get a new company into the system?",
                    "Tracking: does it show where each deal is in your process?",
                    "Signal freshness: does it tell you what changed about a company this week?",
                    "Workflow fit: does it match how your team actually works?",
                    "Data ownership: can you export your pipeline when you want to leave?",
                ],
                "Most tools win on capture and tracking. Few win on signal freshness, which is why a dedicated signal layer is usually bolted on.",
            ]),
            ("The category landscape", [
                "Deal flow tools fall into a few recognizable categories:",
                [
                    "CRM-style pipeline tools: general relationship and pipeline software adapted to venture, built around capturing contacts and tracking stages.",
                    "Venture-native CRMs: purpose-built for fund workflows, with pipeline stages, LP reporting, and portfolio tracking baked in.",
                    "Data platforms: large startup databases used for sourcing and reference (Crunchbase, PitchBook, Tracxn, Dealroom).",
                    "Signal layers: tools that surface which startups are heating up right now from leading indicators, feeding the top of the pipeline.",
                ],
                "The data platforms answer 'who exists', the signal layers answer 'who is heating up now', and the CRMs answer 'where is each deal in my process'. They are complements, not substitutes.",
            ]),
            ("Where a signal layer like GitDealFlow fits", [
                "GitDealFlow is a signal layer, not a CRM. It reads public GitHub activity (commit velocity, contributor growth, repository expansion) across 350+ startups in 15 sectors and surfaces the ones heating up 3 to 6 weeks before a round is public.",
                "The practical stack is therefore two layers: a signal layer for sourcing (GitDealFlow feeds you the breakouts), and a CRM for pipeline (your existing tool tracks the deals through to close). The signal layer fills the top of the funnel that a CRM, on its own, cannot.",
            ]),
            ("What to avoid", [
                "Three buying mistakes are common: paying for a data platform when you need a pipeline tool, expecting a CRM to do sourcing when it only tracks, and buying features you will not use. Start from the job you need done, pick the tool for that job, and add layers as your process matures.",
            ]),
        ],
        "faqs": [
            ("What is the difference between deal flow software and a startup database?", "A startup database (Crunchbase, PitchBook) tells you who exists. Deal flow software (a CRM) tracks the companies in your pipeline. A signal layer (GitDealFlow) tells you who is heating up now. They are different layers of the same workflow."),
            ("Is GitDealFlow a CRM?", "No. GitDealFlow is a signal layer for sourcing: it surfaces startups whose engineering momentum is breaking out, before the round is public. It feeds the top of your pipeline, and pairs with whatever CRM you already use."),
            ("Do I need deal flow software as an angel investor?", "Not necessarily at first. A focused watchlist in a spreadsheet works until your deal volume grows. What most investors need earlier is a signal layer, because sourcing the right companies is a harder problem than tracking them."),
        ],
        "related": [
            ("Best Deal Flow Tools", BASE_URL + "/best/best-deal-flow-tools"),
            ("How to Build a Startup Watchlist", BASE_URL + "/how-to/how-to-build-a-startup-watchlist"),
            ("How to Source Startup Deals on GitHub", BASE_URL + "/how-to/how-to-source-deals-on-github"),
            ("Best VC CRMs", BASE_URL + "/best/best-vc-crms"),
        ],
    },
]


def main():
    written = []
    for a in ARTICLES:
        directory = a["dir"]
        slug = a["slug"]
        out_dir = os.path.join(BASE, directory)
        os.makedirs(out_dir, exist_ok=True)
        path = os.path.join(out_dir, slug + ".html")
        html = build_page(a)
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        written.append(path)
        # quick visible-word count for verification
        import re
        text = re.sub(r"<(style|script)[^>]*>.*?</\1>", "", html, flags=re.S | re.I)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        print("WROTE %-55s %5d words" % (path.replace(BASE + "/", ""), len(text.split())))
    print("\nTotal pages written:", len(written))


if __name__ == "__main__":
    main()
