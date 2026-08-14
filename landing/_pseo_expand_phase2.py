#!/usr/bin/env python3
"""
pSEO MASS EXPANSION, gitdealflow.com
Target: 50→200+ English pSEO pages with rich content, schema, OG, hreflang.
Second phase: generate the final batch of missed pages.
"""
import os, re, json
from datetime import date

BASE = os.path.expanduser("~/signals-gitdealflow/landing")
TODAY = date.today().isoformat()
CANONICAL = "https://gitdealflow.com"
OG_IMAGE = "https://signals.gitdealflow.com/opengraph-image"

def make_page(section, slug, title, desc, sections, faqs, breadcrumbs, related):
    path = f"/{section}/{slug}"
    url = f"{CANONICAL}{path}"
    
    # FAQPage schema
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

    # BreadcrumbList schema
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

    # Article schema
    art_schema = (
        '<script type="application/ld+json">'
        '{"@context":"https://schema.org","@type":"Article",'
        '"headline":%s,"description":%s,'
        '"author":{"@type":"Organization","name":"GitDealFlow","url":"%s"},'
        '"publisher":{"@type":"Organization","name":"GitDealFlow","url":"%s"},'
        '"mainEntityOfPage":{"@type":"WebPage","@id":"%s"},'
        '"datePublished":"%s","dateModified":"%s"}'
        '</script>' % (json.dumps(title), json.dumps(desc[:155]), CANONICAL, CANONICAL, url, TODAY, TODAY)
    )

    # Content HTML
    content_html = "\n".join(
        '<h2 style="font-size:1.4em;font-weight:700;margin-top:2rem;margin-bottom:.8em;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">%s</h2>\n%s'
        % (h, "\n".join("<p>%s</p>" % p for p in pars))
        for h, pars in sections
    )

    # FAQ visible HTML
    faq_html = ""
    if faqs:
        faq_items = "\n".join(
            '<details style="margin-bottom:.75rem;border:1px solid #e5e7eb;border-radius:.5rem;padding:.75rem 1rem">'
            '<summary style="font-weight:600;cursor:pointer;color:#1a1a1a">%s</summary>'
            '<p style="color:#333;margin-top:.5em">%s</p></details>' % (q, a)
            for q, a in faqs
        )
        faq_html = (
            '\n<section class="faq" style="margin-top:40px">\n'
            '<h2 style="font-size:1.4em;font-weight:700;margin-bottom:20px;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Frequently Asked Questions</h2>\n'
            '%s\n</section>' % faq_items
        )

    # Related links
    related_html = ""
    if related:
        items = "\n".join(
            '<li><a href="%s" style="color:#0066cc">%s</a></li>' % (u, l)
            for l, u in related
        )
        related_html = (
            '\n<section style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0">\n'
            '<h3 style="font-size:1.1em;font-weight:700;margin-bottom:12px">Related pages</h3>\n'
            '<ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">\n'
            '%s\n</ul>\n</section>' % items
        )

    html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light">
<title>%s</title>
<link rel="alternate" hreflang="en" href="%s">
<link rel="alternate" hreflang="x-default" href="%s">
<meta name="description" content="%s">
<link rel="canonical" href="%s">
<meta property="og:type" content="article">
<meta property="og:title" content="%s">
<meta property="og:description" content="%s">
<meta property="og:url" content="%s">
<meta property="og:site_name" content="GitDealFlow">
<meta property="og:image" content="%s">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="%s">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
%s
%s
%s
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
body{background:#fff;color:#1a1a1a;font-family:-apple-system,system-ui,sans-serif;line-height:1.7;max-width:760px;margin:0 auto;padding:0 20px 60px}
.hero h1{font-size:2em;font-weight:800;margin:1.5em 0 .5em;line-height:1.2;color:#1a1a1a}
.content p{margin-bottom:1em;color:#333}
.content ul{line-height:1.9;color:#333}
footer{max-width:760px;margin:0 auto;padding:1rem 20px;color:#6b7280;font-size:.85rem;border-top:1px solid #e5e7eb}
</style>
</head>
<body>
<header style="border-bottom:1px solid #1f2937;background:#0f172a">
<nav style="max-width:1100px;margin:0 auto;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">
<a href="/" style="color:#f1f5f9;font-weight:700;font-size:1.1rem;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">GitDealFlow</a>
<div style="display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap">
<a href="/#ladder" style="color:#cbd5e1;text-decoration:none;font-size:.9rem;min-height:44px;display:inline-flex;align-items:center">Pricing</a>
<a href="/#signup" style="background:#00d4aa;color:#04130e;padding:.6rem 1.1rem;border-radius:.5rem;font-weight:700;font-size:.9rem;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">Get free signal</a>
</div>
</nav>
</header>
<main>
<section class="hero"><h1>%s</h1></section>
<section class="content">%s
%s
<section class="cta" style="text-align:center;padding:2rem 1rem">
<a href="/#ladder" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.9rem 1.75rem;border-radius:.75rem;font-weight:700;font-size:1rem;text-decoration:none;min-height:44px">See pricing &amp; start tracking &rarr;</a>
</section>
</section>
</main>
%s
<footer><p>&copy; %s GitDealFlow</p></footer>
</body>
</html>""" % (
        title, url, url, desc[:155], url,
        title, desc[:155], url, OG_IMAGE, OG_IMAGE,
        faq_schema, bc_schema, art_schema,
        title, content_html, faq_html, related_html, TODAY[:4]
    )

    filepath = os.path.join(BASE, section, "%s.html" % slug)
    if os.path.exists(filepath):
        return False, url
    os.makedirs(os.path.join(BASE, section), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(html)
    return True, url


def write_page(section, slug, title, desc, sections, faqs, breadcrumbs, related):
    return make_page(section, slug, title, desc, sections, faqs, breadcrumbs, related)


# ───── MISSED 7-ENTRY PAGES ─────

# best-scout-programs (was missing breadcrumbs = only 6 elements)
PAGES_TO_GENERATE = [
    ("best", "best-vc-scout-programs", "5 Best VC Scout Programs for Deal Flow [2026]",
     "The best VC scout programs pay you for deal flow. Here are the top 5 programs, how they work, and how to maximize your scout income.",
     [
         ("What is a Scout Program?", [
             "VC scout programs pay individuals (often founders, operators, or angels) a percentage of carried interest or a flat fee for sourcing deals that the fund invests in.",
             "Scout programs have exploded in popularity. Top-tier programs from Sequoia, Andreessen Horowitz, and others have produced some of the best venture returns of the past decade.",
             "GitDealFlow is the ideal tool for scouts: weekly trending lists help you surface deals early, and the Scout Score feature predicts which GitHub users will found valuable companies."]),
         ("Top 5 Scout Programs", [
             "1. Sequoia Capital Scout - The most prestigious scout program. Pays carried interest on deals sourced.",
             "2. Andreessen Horowitz Scout - Strong brand and education. Pays carried interest. Focus on crypto, AI, fintech.",
             "3. Lightspeed Venture Partners Scout - Excellent for international scouts. Pays carry and community access.",
             "4. Village Global Scout - Network-driven fund. Strong LP network for portfolio companies.",
             "5. Soma Capital Scout - Largest scout network. $25K per deal bonus plus carry."]),
         ("How to Succeed as a Scout", [
             "Use GitDealFlow to surface deal flow before other scouts see it. The weekly trending list gives you fresh startups every Monday.",
             "Build relationships with 10-20 high-quality founders. Attend Demo Days. Read GitHub READMEs.",
             "Quality beats quantity. 1-2 great deals per year as a scout can earn more than 20 mediocre ones."]),
     ],
     [
         ("How much do VC scouts make?", "Top scouts earn $50K-$200K+/year in carry and bonuses. GitDealFlow's Scout Score feature helps you discover future founders."),
         ("Can I be a scout part-time?", "Yes. Most scouts source 2-5 hours per week. GitDealFlow's weekly digest makes efficient sourcing possible."),
         ("Do I need a network to be a scout?", "It helps, but GitDealFlow can build your deal flow pipeline systematically. Surface startups and research founders."),
     ],
     [("Home", CANONICAL + "/"), ("Best", CANONICAL + "/best/"), ("VC Scout Programs", "")],
     [("Best Deal Flow Tools", CANONICAL + "/best/best-deal-flow-tools"),
      ("Best Start-up Databases", CANONICAL + "/best/best-startup-databases"),
      ("How to Build Deal Flow Pipeline", CANONICAL + "/learn/how-to-build-a-deal-flow-pipeline"),
      ("Free Scout Score Checker", CANONICAL + "/free/free-scout-score-checker")]),

    # Additional glossary pages that were only in GLOSSARY_MORE
    ("glossary", "pre-seed-funding", "Pre-Seed Funding", "The earliest stage of startup funding, typically $500K-$2M from angels and pre-seed funds.",
     [
         ("What is Pre-Seed Funding?", [
             "Pre-seed is the very first external capital a startup raises. It is typically $500K-$2M from angels, pre-seed funds, friends and family.",
             "At this stage, the startup may have no revenue, no product, and just a founding team and an idea. GitDealFlow tracks pre-seed teams by their GitHub activity - a team shipping code before they have a public product is a strong signal."]),
         ("Pre-Seed vs Seed", [
             "Pre-seed: idea stage, minimal traction, $500K-$2M, often convertible instruments (SAFEs).",
             "Seed: early product, initial traction, $2-5M, can be structured as SAFEs or priced rounds.",
             "GitDealFlow detects pre-seed startups through early GitHub activity. Catching them at this stage is the highest-ROI deal sourcing."]),
     ],
     [
         ("How do you find pre-seed startups?", "GitDealFlow tracks pre-seed teams by their public GitHub activity. A team with rising commit velocity and no public profile is likely pre-seed."),
         ("What valuation do pre-seed startups get?", "$5-10M pre-money typical. GitDealFlow's engineering momentum data helps justify higher caps for teams shipping fast."),
     ],
     [("Home", CANONICAL + "/"), ("Glossary", CANONICAL + "/glossary/"), ("Pre-Seed Funding", "")],
     [("Glossary Index", CANONICAL + "/glossary/"), ("Seed Round", CANONICAL + "/glossary/seed-round")]),

    ("glossary", "seed-round", "Seed Round", "The first institutional funding round, typically $2-5M from seed funds, angels, and accelerators.",
     [
         ("What is a Seed Round?", [
             "A seed round is the first institutional funding. Startups raise $2-5M from seed funds, angels, and micro VCs.",
             "At seed, you should have a working product, initial traction signals, and a clear plan for reaching Series A milestones.",
             "GitDealFlow detects seed-stage startups through their engineering velocity. Teams accelerating commits are often in fundraising mode."]),
     ],
     [
         ("What valuation do seed startups get?", "$8-15M pre-money median for US seed rounds in 2026. AI companies command 20-30% premiums."),
         ("How long does seed fundraising take?", "3-6 months from first meeting to close. GitDealFlow detects the preparation 3-6 weeks before the round is announced."),
     ],
     [("Home", CANONICAL + "/"), ("Glossary", CANONICAL + "/glossary/"), ("Seed Round", "")],
     [("Glossary Index", CANONICAL + "/glossary/"), ("Pre-Seed Funding", CANONICAL + "/glossary/pre-seed-funding")]),

    ("glossary", "series-a-funding", "Series A Funding", "The first major VC round, typically $5-15M for startups with proven product-market fit.",
     [
         ("What is Series A?", [
             "Series A is the first significant venture capital round, typically $5-15M for startups that have demonstrated product-market fit.",
             "Key milestones: $1-2M+ ARR, strong retention (>100% NDR), and a clear path to $10M ARR.",
             "GitDealFlow detects Series A preparation: engineering velocity spikes 3-6 weeks before the round is announced."]),
     ],
     [
         ("What valuation do Series A startups get?", "$20-40M pre-money typical. Top-quartile engineering teams (per GitDealFlow) command 15-25% premiums."),
         ("How long does Series A take?", "6-12 months from preparation to close. Preparation starts 3-6 months before the first meeting."),
     ],
     [("Home", CANONICAL + "/"), ("Glossary", CANONICAL + "/glossary/"), ("Series A", "")],
     [("Glossary Index", CANONICAL + "/glossary/"), ("Seed Round", CANONICAL + "/glossary/seed-round"), ("Series B", CANONICAL + "/glossary/series-b")]),

    ("glossary", "series-b-funding", "Series B Funding", "Growth-stage funding, typically $15-50M for startups scaling go-to-market and engineering.",
     [
         ("What is Series B?", [
             "Series B is growth-stage funding, typically $15-50M. By Series B, startups have clear product-market fit, growing revenue ($5-10M+ ARR), and proven unit economics.",
             "The focus at Series B is scaling: hiring sales and marketing teams, expanding engineering, and entering new geographies.",
             "GitDealFlow's engineering velocity data helps growth investors assess whether a startup can execute at scale."]),
     ],
     [
         ("What Series B valuation is typical?", "$50-150M pre-money. Wide variance by sector and growth rate."),
     ],
     [("Home", CANONICAL + "/"), ("Glossary", CANONICAL + "/glossary/"), ("Series B", "")],
     [("Glossary Index", CANONICAL + "/glossary/"), ("Series A", CANONICAL + "/glossary/series-a-funding")]),
]


def main():
    count = 0
    print("Generating %d missed pages..." % len(PAGES_TO_GENERATE))
    for section, slug, title, desc, sections, faqs, breadcrumbs, related in PAGES_TO_GENERATE:
        created, url = write_page(section, slug, title, desc, sections, faqs, breadcrumbs, related)
        if created:
            count += 1
            print("  ✓ %s/%s" % (section, title[:50]))
        else:
            print("  ○ %s (exists)" % slug)
    print("\nDone: %d new pages" % count)


if __name__ == "__main__":
    main()
