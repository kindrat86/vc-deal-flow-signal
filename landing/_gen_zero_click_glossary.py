#!/usr/bin/env python3
"""
Generate zero-click definition pages for GitDealFlow's proprietary coined terms
on the apex domain (gitdealflow.com/glossary/).

Reads the single source of truth (pseo-site/content/glossary.ts, already
extracted to /tmp/glossary_terms.json) and emits one static HTML page per
proprietary term, matching the existing landing/glossary/*.html template.

Zero-click structure (the whole point):
  - A 40-55 word `snippet` rendered as the FIRST <p> after the <h1>,
    marked [data-speakable] so Google AI Overviews / Assistant / LLMs can lift it.
  - FAQPage schema whose first Question is "What is {term}?" answered by the snippet.
  - DefinedTerm schema linking into the site's DefinedTermSet vocabulary.
  - Article + BreadcrumbList schema.
  - meta description = the snippet (the exact text a featured snippet would show).
"""
import json, re, html as _html
from pathlib import Path

LANDING = Path("/Users/sipi/signals-gitdealflow/landing")
OUT = LANDING / "glossary"
SITE = "https://gitdealflow.com"
SIGNALS = "https://signals.gitdealflow.com"
SSRN = "https://ssrn.com/abstract=6606558"
TODAY = "2026-08-15"

terms = {t["id"]: t for t in json.load(open("/tmp/glossary_terms.json"))}

# The proprietary terms to create (id -> family label + optional apex learn/faq cross-link)
PROPRIETARY = {
    "code-side-sourcing": ("Code-Side Sourcing", None),
    "commit-velocity-acceleration-engine": ("The Engine", None),
    "commit-velocity": ("Engineering Acceleration", "/learn/what-is-commit-velocity"),
    "commit-velocity-change": ("Engineering Acceleration", "/learn/what-is-commit-velocity"),
    "engineering-acceleration": ("Engineering Acceleration", "/learn/what-is-engineering-velocity"),
    "deal-flow-signal": ("Venture Vocabulary", "/learn/what-is-a-deal-flow-signal"),
    "contributor-growth": ("Engineering Acceleration", "/learn/what-is-contributor-growth"),
    "engineering-hiring-burst": ("Signal Type", None),
    "infrastructure-buildout": ("Signal Type", None),
    "deploy-frequency-spike": ("Signal Type", None),
    "framework-migration": ("Signal Type", None),
    "bot-filter": ("Engineering Acceleration", None),
    "two-period-confirmation": ("Engineering Acceleration", None),
    "top-contributor-concentration": ("Engineering Acceleration", None),
    "scout-score": ("Scout", "/faq/what-is-a-scout-score"),
}

def esc(s):
    return _html.escape(s, quote=False)

def json_escape(s):
    return json.dumps(s, ensure_ascii=False)

def first_sentence(text):
    m = re.match(r"^[^.]*\.", text)
    return (m.group(0) if m else text).strip()

def make_page(tid, family, learn_link):
    t = terms[tid]
    term = t["term"]
    snippet = t["snippet"].strip()
    definition = t["definition"].strip()
    lede = first_sentence(snippet)
    url = f"{SITE}/glossary/{tid}"
    slug = f"/glossary/{tid}"

    # FAQ entries: question 1 = the zero-click answer (snippet verbatim)
    faq = [
        {
            "q": f"What is {term}?",
            "a": snippet,
        },
        {
            "q": f"How does GitDealFlow use {term}?",
            "a": definition,
        },
    ]

    faq_json = json.dumps({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in faq
        ],
    }, ensure_ascii=False)

    breadcrumb_json = json.dumps({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Glossary", "item": SITE + "/glossary/"},
            {"@type": "ListItem", "position": 3, "name": term, "item": url},
        ],
    }, ensure_ascii=False)

    article_json = json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": f"{term}, definition and meaning",
        "description": lede,
        "author": {"@type": "Organization", "name": "GitDealFlow", "url": SITE},
        "publisher": {"@type": "Organization", "name": "GitDealFlow", "url": SITE},
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "datePublished": TODAY,
        "dateModified": TODAY,
    }, ensure_ascii=False)

    defined_term_json = json.dumps({
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "@id": url + "#term",
        "name": term,
        "description": definition,
        "termCode": tid,
        "url": url,
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "@id": SIGNALS + "/glossary#vocabulary",
            "name": "VC Deal Flow Signal, controlled vocabulary",
            "url": SIGNALS + "/glossary",
        },
        "subjectOf": {"@type": "ScholarlyArticle", "@id": SSRN, "url": SSRN},
    }, ensure_ascii=False)

    # Related cross-links
    related_links = [
        {"href": SIGNALS + f"/define/{tid}", "label": f"{term} — full signal definition"},
        {"href": SIGNALS + "/methodology", "label": "Methodology (SSRN panel)"},
        {"href": SITE + "/glossary/", "label": "Glossary index"},
    ]
    if learn_link:
        related_links.insert(0, {"href": SITE + learn_link, "label": f"{term} — practical guide"})

    related_html = "\n".join(
        f'<li><a href="{l["href"]}" style="color:#0066cc">{esc(l["label"])}</a></li>'
        for l in related_links
    )

    title = f"{term}: Definition, Meaning &amp; Why It Matters | GitDealFlow"
    page_title_plain = f"{term}: Definition, Meaning & Why It Matters | GitDealFlow"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light">
<title>{esc(page_title_plain)}</title>
<link rel="alternate" hreflang="en" href="{url}">
<link rel="alternate" hreflang="x-default" href="{url}">
<meta name="description" content="{esc(snippet)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{esc(term)}">
<meta property="og:description" content="{esc(lede)}">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="GitDealFlow">
<meta property="og:image" content="https://signals.gitdealflow.com/opengraph-image">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://signals.gitdealflow.com/opengraph-image">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<script type="application/ld+json">{faq_json}</script>
<script type="application/ld+json">{breadcrumb_json}</script>
<script type="application/ld+json">{article_json}</script>
<script type="application/ld+json">{defined_term_json}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
body{{background:#fff;color:#1a1a1a;font-family:-apple-system,system-ui,sans-serif;line-height:1.7;max-width:760px;margin:0 auto;padding:0 20px 60px}}
.hero h1{{font-size:2em;font-weight:800;margin:1.5em 0 .5em;line-height:1.2;color:#1a1a1a}}
.answer{{font-size:1.15em;line-height:1.65;color:#111;background:#f0fdfa;border-left:4px solid #00d4aa;padding:1rem 1.2rem;border-radius:.4rem;margin:0 0 1.5em}}
.content p{{margin-bottom:1em;color:#333}}
.content ul{{line-height:1.9;color:#333}}
footer{{max-width:760px;margin:0 auto;padding:1rem 20px;color:#6b7280;font-size:.85rem;border-top:1px solid #e5e7eb}}
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
<section class="hero"><h1>{esc(term)}</h1></section>
<section class="content">
<p class="answer" data-speakable>{esc(snippet)}</p>

<h2 style="font-size:1.4em;font-weight:700;margin-top:2rem;margin-bottom:.8em;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Full definition</h2>
<p data-speakable>{esc(definition)}</p>

<section class="faq" style="margin-top:40px">
<h2 style="font-size:1.4em;font-weight:700;margin-bottom:20px;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Frequently Asked Questions</h2>
<details style="margin-bottom:.75rem;border:1px solid #e5e7eb;border-radius:.5rem;padding:.75rem 1rem"><summary style="font-weight:600;cursor:pointer;color:#1a1a1a">What is {esc(term)}?</summary><p style="color:#333;margin-top:.5em">{esc(snippet)}</p></details>
<details style="margin-bottom:.75rem;border:1px solid #e5e7eb;border-radius:.5rem;padding:.75rem 1rem"><summary style="font-weight:600;cursor:pointer;color:#1a1a1a">How does GitDealFlow use {esc(term)}?</summary><p style="color:#333;margin-top:.5em">{esc(definition)}</p></details>
</section>

<section class="cta" style="text-align:center;padding:2rem 1rem">
<a href="/#ladder" style="display:inline-block;background:#00d4aa;color:#04130e;padding:.9rem 1.75rem;border-radius:.75rem;font-weight:700;font-size:1rem;text-decoration:none;min-height:44px">See pricing &amp; start tracking &rarr;</a>
</section>
</section>
</main>

<section style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0">
<h3 style="font-size:1.1em;font-weight:700;margin-bottom:12px">Related pages</h3>
<ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
{related_html}
</ul>
</section>
<footer><p>&copy; 2026 GitDealFlow</p></footer>

  <script>
    (function(){{
      function _load(){{var s=document.createElement('script');s.src='/pixels.js';s.async=true;document.head.appendChild(s);}}
      if('requestIdleCallback' in window){{requestIdleCallback(_load,{{timeout:3000}});}} else {{setTimeout(_load,2500);}}
    }})();
  </script>

  </body>
</html>
"""

if __name__ == "__main__":
    created = []
    for tid, (family, learn_link) in PROPRIETARY.items():
        if tid not in terms:
            print(f"  !! MISSING term in source: {tid}")
            continue
        out_path = OUT / f"{tid}.html"
        out_path.write_text(make_page(tid, family, learn_link), encoding="utf-8")
        created.append(tid)
        print(f"  + {tid}.html")
    print(f"\nCreated {len(created)} pages.")
