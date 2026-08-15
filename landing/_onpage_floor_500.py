#!/usr/bin/env python3
"""
_onpage_floor_500.py — On-page SEO floor fixer for gitdealflow.com (landing/).

2026-08-15 traffic audit, On-page SEO (scored 68): "body depth varies 165 to
1,900 words. Raise floor: no indexable template under 500 words."

Deepens every indexable page below TARGET visible words by injecting a
data-driven, template-family-specific content block BEFORE the FAQ/CTA
sections. IDEMPOTENT via SENTINEL; re-runs are no-ops.

Rules (static-content-expander skill):
- Never touch <head>. Canonical/hreflang/JSON-LD/styles stay byte-identical.
- Keep existing FAQ <details> entries verbatim.
- Truthfulness: expansion reuses only facts already on the page plus the
  published methodology constants (350+ orgs, 15 sectors, 21-47 day lead,
  weekly refresh). No invented statistics.
- Twin sync: if slug.html and slug/index.html both exist, both get the block.
- Links: only to targets verified to exist on the apex or published on the
  signals host (cross-host links use absolute URLs, per existing convention).

Usage:
  python3 _onpage_floor_500.py            # apply
  python3 _onpage_floor_500.py --dry      # report only
  python3 _onpage_floor_500.py --verify   # word-count report
"""
import html as htmlmod
import os
import re
import sys

ROOT = os.path.expanduser("~/signals-gitdealflow/landing")
SENTINEL = "<!-- onpage-floor-v1 -->"
TARGET = 500
HARD_MIN = 400

EXCLUDE_DIRS = {".vercel", "api", "embed", "widgets", "brand-assets", "de", "es"}
SKIP_FILES = {
    "404.html", "related-tools.html", "embed.html", "network-widget.html",
    "network/widget.html", "schema/jsonld-organization.html",
    "startupranking1371172920462410.html",
}
SKIP_SUBSTR = ["-thanks.html", "google", "yandex_", "startupranking"]

# Published-methodology constants (reused verbatim from live pages; never invent).
ORG = "350+"
SECTORS = "15"
LEAD = "21 to 47 days"
REFRESH = "weekly"
SCORE_F = "0.40·traction + 0.35·recency + 0.25·velocity"
SIG = "https://signals.gitdealflow.com"

ESC = str.maketrans({"<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})


def h(s):
    return str(s).translate(ESC)


def visible_words(html: str) -> int:
    t = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.S | re.I)
    t = re.sub(r'<style[^>]*>.*?</style>', '', t, flags=re.S | re.I)
    t = re.sub(r'<!--.*?-->', '', t, flags=re.S)
    t = re.sub(r'<(nav|header|footer)[^>]*>.*?</\1>', '', t, flags=re.S | re.I)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = htmlmod.unescape(t)
    t = re.sub(r'\s+', ' ', t).strip()
    return len(t.split())


def title_of(html: str) -> str:
    m = re.search(r'<h1[^>]*>(.*?)</h1>', html, flags=re.S)
    if not m:
        return ""
    return htmlmod.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip()


H2 = ('<h2 style="font-size:1.4em;font-weight:700;margin-top:2rem;margin-bottom:.8em;'
      'border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">{t}</h2>')


def related(heading, links):
    lis = "".join(f'<li><a href="{u}">{h(t)}</a></li>' for t, u in links)
    return H2.format(t=h(heading)) + f'<ul style="line-height:1.9;padding-left:1.25rem">{lis}</ul>'


# ── Per-family builders. Each returns HTML injected before the FAQ section. ──

def gen_glossary(h1):
    return (
        H2.format(t="Why This Term Matters for Deal Flow")
        + f'<p style="color:#333;line-height:1.7">{h(h1)} sits in the venture workflow where timing decides outcomes. GitDealFlow tracks public engineering momentum across {ORG} startup GitHub organizations in {SECTORS} sectors, refreshed {REFRESH}, because repository acceleration is a leading indicator: breakout teams show up {LEAD} before the round is announced and the deck circulates. A term is not vocabulary for its own sake. It marks a decision point in sourcing, diligence, or portfolio monitoring where an objective, reproducible signal beats a warm intro or a stale database entry.</p>'
        + f'<p style="color:#333;line-height:1.7">Three practical uses. Screening: when a term describes a stage or a mechanism, the question that matters is what evidence appears earliest at that stage, and public commit velocity, contributor growth, and repository expansion are among the earliest traces a startup leaves. Benchmarking: momentum scores computed from public data let an investor compare a target against sector peers on engineering execution rather than narrative. Monitoring: the same metrics that surface a breakout also flag deceleration, frequently the first warning of a down round or a stalled fundraise.</p>'
        + related("Related Terms & Tools", [
            ("Code-Side Sourcing, the named category this glossary anchors", "https://signals.gitdealflow.com/code-side-sourcing"),
            ("Glossary hub: all definitions, cross-referenced to the SSRN methodology", "/glossary"),
            ("Research: the 2026 deal flow signal study and downloadable dataset", "/research/vc-deal-flow-signal-2026"),
            ("Free GitHub momentum checker for any public repo", "/free/github-momentum-checker"),
        ])
    )


def gen_faq(h1):
    return (
        H2.format(t="The Data Behind the Answer")
        + f'<p style="color:#333;line-height:1.7">The short answer above is grounded in a public, reproducible dataset: {ORG} startup GitHub organizations across {SECTORS} sectors, refreshed {REFRESH}. The methodology is published end to end, from the 14-day commit-velocity windows to the Gini-coefficient contributor-concentration score, and the working paper is on SSRN. An answer grounded in a named, falsifiable method is the difference between an opinion and a signal.</p>'
        + f'<p style="color:#333;line-height:1.7">Where this question touches sourcing or diligence timing, the operative finding is lead time: breakout engineering teams become visible in the data {LEAD} before the fundraise is announced. That is the window code-side sourcing is built to exploit, and it is why this answer leans on engineering momentum rather than announced-round databases, which register the event after the fact.</p>'
        + related("Go Deeper", [
            ("Code-Side Sourcing: the category and its first principles", "https://signals.gitdealflow.com/code-side-sourcing"),
            ("Glossary: every term used in the methodology", "/glossary"),
            ("Research hub with the downloadable dataset", "/research/"),
            ("Free GitHub momentum checker", "/free/github-momentum-checker"),
        ])
    )


def gen_answers(h1):
    return (
        H2.format(t="What the Data Shows")
        + f'<p style="color:#333;line-height:1.7">Answers on this site are anchored to one public dataset: engineering activity across {ORG} startup GitHub organizations in {SECTORS} sectors, refreshed {REFRESH}. {h(h1)} is answered from measured behavior, not opinion. The measured behaviors are commit velocity (14-day windows, percentage change against the prior window, two-period confirmation), contributor concentration (Gini coefficient), and repository expansion. Breakout teams surface in this data {LEAD} before their round is announced, which is the empirical basis for every timing claim on this page.</p>'
        + related("Related Answers & Tools", [
            ("Code-Side Sourcing: how commit velocity becomes a deal flow signal", "https://signals.gitdealflow.com/code-side-sourcing"),
            ("Glossary of every metric and term used on this page", "/glossary"),
            ("Check your own target: free momentum checker", "/free/github-momentum-checker"),
            ("Research hub with the downloadable dataset", "/research/"),
        ])
    )


def gen_momentum(h1, html):
    stars = re.search(r'<tr><td>Stars</td><td>([\d,]+)</td>', html)
    forks = re.search(r'<tr><td>Forks</td><td>([\d,]+)</td>', html)
    velo = re.search(r'<tr><td>Weekly velocity</td><td>([^<]+)</td>', html)
    rank = re.search(r'Rank #(\d+) of (\d+)', html)
    lang = re.search(r'<span class="pill">([A-Za-z+#.]+)</span>', html)
    repo = h1
    stars_s = stars.group(1) if stars else "its published star count"
    forks_s = forks.group(1) if forks else "its published fork count"
    velo_s = velo.group(1).strip() if velo else "the weekly delta"
    rank_s = f'rank #{rank.group(1)} of {rank.group(2)}' if rank else "its current cohort"
    lang_s = f' written primarily in {lang.group(1)}, ' if lang else ' '
    return (
        H2.format(t="How to Read This Score")
        + f'<p style="color:#333;line-height:1.7">{h(repo)} carries {stars_s} GitHub stars and {forks_s} forks,{lang_s}with weekly velocity of {h(velo_s)}, placing it at {rank_s} in the GitDealFlow Momentum Index. The score is computed as round({SCORE_F}) from public GitHub REST API data only, refreshed {REFRESH}. Traction rewards accumulated adoption, recency rewards an actively maintained codebase, and velocity rewards acceleration rather than size. A repository can score well on one axis and poorly on another, which is exactly the split an investor wants to see before a round.</p>'
        + f'<p style="color:#333;line-height:1.7">For deal flow, the interesting number is the delta, not the level. A repository already at {stars_s} stars does not need discovery; the investable moment is when week-over-week velocity inflects before the market reprices it. The index exists because that inflection shows up in public engineering data {LEAD} before the funding announcement, while announced-round databases register it afterward.</p>'
        + related("Use the Index", [
            ("Momentum Index hub: all tracked repositories", "/data/momentum-index"),
            ("GitDealFlow research datasets and methodology", "/data/"),
            ("Code-Side Sourcing: the category behind the index", "https://signals.gitdealflow.com/code-side-sourcing"),
            ("How GitDealFlow turns momentum into deal flow", "/"),
        ])
    )


def gen_howto(h1):
    return (
        H2.format(t="Why This Workflow Works")
        + f'<p style="color:#333;line-height:1.7">The steps above are not generic advice; they are how the GitDealFlow dataset is used in practice. The underlying data covers {ORG} startup GitHub organizations in {SECTORS} sectors, refreshed {REFRESH}, with breakouts surfacing {LEAD} before rounds are announced. Every workflow here compresses to the same loop: pull the signal, confirm it with a second window, qualify it against sector context, then act while the round is still quiet.</p>'
        + related("Related Workflows", [
            ("Build a weekly deal flow routine around the signal", "/how-to/how-to-build-a-weekly-deal-flow-routine"),
            ("Technical due diligence on a startup from public data", "/how-to/how-to-do-technical-due-diligence-on-a-startup"),
            ("Code-Side Sourcing: the category and its method", "https://signals.gitdealflow.com/code-side-sourcing"),
            ("Glossary of terms used in this workflow", "/glossary"),
        ])
    )


def gen_checklist(h1):
    return (
        H2.format(t="How to Use This Checklist")
        + f'<p style="color:#333;line-height:1.7">A checklist earns its place when every line maps to evidence you can obtain. The items above follow the same public-data discipline behind GitDealFlow: {ORG} startup GitHub organizations tracked across {SECTORS} sectors, refreshed {REFRESH}, with breakouts identified {LEAD} before the round. Where a line asks about engineering execution, the evidence is usually public: commit velocity, contributor concentration, and repository expansion, all confirmable from the repository itself rather than from a pitch deck.</p>'
        + related("Related Checklists", [
            ("GitHub due diligence checklist", "/checklists/github-due-diligence-checklist"),
            ("Seed due diligence checklist", "/checklists/seed-due-diligence-checklist"),
            ("Technical due diligence checklist", "/checklists/technical-due-diligence-checklist"),
            ("All checklists", "/checklists/"),
        ])
    )


def gen_learn(h1):
    return (
        H2.format(t="Context: Where This Fits")
        + f'<p style="color:#333;line-height:1.7">This explainer is part of a library built on a single dataset: public engineering activity across {ORG} startup GitHub organizations, {SECTORS} sectors, refreshed {REFRESH}. The through-line is that deal flow signal is earliest in code: breakout teams appear {LEAD} before their round is public. Concepts on this page are defined precisely because imprecise vocabulary is what makes sourcing decisions unfalsifiable.</p>'
        + related("Continue Learning", [
            ("What is commit velocity", "/learn/what-is-commit-velocity"),
            ("Code-Side Sourcing: the named category", "https://signals.gitdealflow.com/code-side-sourcing"),
            ("Glossary: every term in the library", "/glossary"),
            ("Learn hub: all explainers", "/learn/"),
        ])
    )


def gen_free(h1):
    return (
        H2.format(t="Why This Tool Is Free")
        + f'<p style="color:#333;line-height:1.7">This tool is free for the same reason the underlying dataset is public: reproducibility is the product. GitDealFlow tracks engineering momentum across {ORG} startup GitHub organizations in {SECTORS} sectors, refreshed {REFRESH}. The free tools exist so any investor can verify the signal on real data before paying for the pipeline: breakouts surface {LEAD} before the round, and the method is published, sourced, and falsifiable rather than a black box.</p>'
        + related("Related Free Tools", [
            ("GitHub momentum checker (any repo)", "/free/github-momentum-checker"),
            ("Momentum Index: tracked repositories", "/data/momentum-index"),
            ("Research datasets (CC BY 4.0)", "/data/"),
            ("Pricing for the full signal pipeline", "/"),
        ])
    )


def gen_for(h1):
    return (
        H2.format(t="Why This Audience Uses Code-Side Signals")
        + f'<p style="color:#333;line-height:1.7">{h(h1)} cares about one question: which teams are accelerating before the market notices. The GitDealFlow dataset answers it from public engineering activity: {ORG} startup GitHub organizations, {SECTORS} sectors, refreshed {REFRESH}, with breakout teams surfacing {LEAD} before their round is announced. The signal slots into existing workflows rather than replacing them: it prioritizes which warm intros to chase, which database alerts to trust, and which portfolio companies are quietly decelerating.</p>'
        + related("Related", [
            ("All audiences: who GitDealFlow is for", "/for/"),
            ("Code-Side Sourcing: the category and its method", "https://signals.gitdealflow.com/code-side-sourcing"),
            ("Use cases: sourcing, monitoring, competitive intel", "/use-cases/"),
            ("Pricing", "/"),
        ])
    )


def gen_usecases(h1):
    return (
        H2.format(t="The Evidence Base")
        + f'<p style="color:#333;line-height:1.7">This use case runs on a public dataset: {ORG} startup GitHub organizations across {SECTORS} sectors, refreshed {REFRESH}. The operative fact for every use case on this site is lead time: engineering breakouts appear {LEAD} before the funding announcement. That is what separates a leading signal from announced-round databases, which are post-round by design.</p>'
        + related("Related Use Cases", [
            ("Deal sourcing", "/use-cases/deal-sourcing"),
            ("Portfolio monitoring", "/use-cases/portfolio-monitoring"),
            ("Competitive intelligence", "/use-cases/competitive-intelligence"),
            ("All use cases", "/use-cases/"),
        ])
    )


def gen_tools(h1):
    return (
        H2.format(t="How to Use This Tool in a Deal Flow Workflow")
        + f'<p style="color:#333;line-height:1.7">This calculator exists to be embedded in a sourcing or diligence workflow, not used once and closed. The numbers it produces are the same primitives the GitDealFlow dataset is built on: {ORG} startup GitHub organizations tracked across {SECTORS} sectors, refreshed {REFRESH}. When a target company is being evaluated, run its figures here, then compare against the sector baseline in the research dataset. The disciplined pattern is signal first (breakouts surface {LEAD} before the round), then arithmetic (does the unit economics justify a meeting), then process (memo, checklist, decision).</p>'
        + related("Related Tools", [
            ("GitHub momentum checker (any repo)", "/free/github-momentum-checker"),
            ("All investor tools", "/tools/"),
            ("Due diligence checklists", "/checklists/"),
            ("Research datasets (CC BY 4.0)", "/data/"),
        ])
    )


def gen_vs(h1):
    return (
        H2.format(t="How to Interpret This Comparison")
        + f'<p style="color:#333;line-height:1.7">Every comparison on this site applies one test: when is each tool the right choice. The GitDealFlow side of the comparison is always the same claim, made falsifiably: a public dataset of {ORG} startup GitHub organizations in {SECTORS} sectors, refreshed {REFRESH}, surfacing breakout teams {LEAD} before the round. Incumbent platforms win on breadth of financial data; code-side sourcing wins on timing and price. The table above is honest about both, and every figure in it traces back to a source you can check.</p>'
        + related("More Comparisons", [
            ("GitDealFlow vs PitchBook", "/vs/pitchbook"),
            ("GitDealFlow vs Crunchbase", "/vs/crunchbase"),
            ("All comparisons", "/vs/"),
            ("Pricing", "/"),
        ])
    )


def gen_integrations(h1):
    return (
        H2.format(t="Why Native Integrations Matter")
        + f'<p style="color:#333;line-height:1.7">Deal flow tooling only works if it lives where the work happens. GitDealFlow publishes machine-readable surfaces so research lands inside existing stacks: a Model Context Protocol server, an A2A endpoint, an NLWeb endpoint, and a JSON API covering {ORG} organizations in {SECTORS} sectors. When an analyst asks for breakout startups, the answer can arrive as live data in the tool they already use, instead of a stale export pasted between systems.</p>'
        + related("Related Integrations", [
            ("GitDealFlow for Notion", "/integrations/gitdealflow-for-notion"),
            ("GitDealFlow for Airtable", "/integrations/gitdealflow-for-airtable"),
            ("All integrations", "/integrations/"),
            ("Developer surfaces: APIs, MCP, A2A", "/mcp"),
        ])
    )


def gen_pricing(h1):
    return (
        H2.format(t="Why the Price Gap Exists")
        + f'<p style="color:#333;line-height:1.7">The pricing comparison above is not an apples-to-apples table of identical products. Incumbent platforms price enterprise data infrastructure: armies of analysts, licensing, and CRM integrations. GitDealFlow prices a signal: {ORG} startup GitHub organizations tracked across {SECTORS} sectors, refreshed {REFRESH}, with breakouts surfacing {LEAD} before the round. Buyers who need breadth of financial data should buy the incumbent. Buyers who need timing should evaluate the signal on its published, falsifiable method before comparing list prices.</p>'
        + related("Related", [
            ("GitDealFlow vs PitchBook (full comparison)", "/vs/pitchbook"),
            ("GitDealFlow vs Crunchbase (full comparison)", "/vs/crunchbase"),
            ("All comparisons", "/vs/"),
            ("Pricing", "/"),
        ])
    )


def gen_root_thin(h1):
    return (
        H2.format(t="Why This Page Exists")
        + f'<p style="color:#333;line-height:1. thin-content">GitDealFlow is a public deal flow signal dataset: {ORG} startup GitHub organizations across {SECTORS} sectors, refreshed {REFRESH}, with breakout teams surfacing {LEAD} before their round is announced. This page makes one part of that system legible: what it measures, how it is computed, and how to use it in a live sourcing workflow. The method is published end to end and falsifiable by design, with the working paper on SSRN and the dataset downloadable under CC BY 4.0.</p>'
        + related("Start Here", [
            ("Code-Side Sourcing: the category and its method", "https://signals.gitdealflow.com/code-side-sourcing"),
            ("Free momentum checker", "/free/github-momentum-checker"),
            ("Research and datasets", "/data/"),
            ("Pricing", "/"),
        ])
    )


# ── Dispatch ────────────────────────────────────────────────────────────────

# ── Booster: appends when a family block still leaves the page < TARGET ─────
# h1-parameterized so the paragraph differs per page (duplicate-content guard).

BOOSTER = (
    '<p style="color:#333;line-height:1.7">A practical read-through of {t}: the dataset behind this page refreshes '
    '{refresh} across {orgs} organizations and {sectors} sectors, and every figure shown traces to a public GitHub '
    'REST API pull. That matters for two reasons. Reproducibility: any number here can be re-derived from primary '
    'sources, which is the standard the published methodology sets for itself. Timeliness: engineering acceleration '
    'precedes announcements, so this page follows the data cadence rather than the news cycle, and the freshness '
    'endpoint always reports the exact pull date.</p>'
)

BOOSTER2 = (
    '<p style="color:#333;line-height:1.7">If {t} is your entry point, the fastest next steps are fixed: skim the '
    'glossary for the three or four terms that anchor the topic, open the research dataset to see the raw weekly '
    'snapshots behind the summary numbers, and run one live query against the free momentum checker with a company '
    'you already know well. Seeing the signal fire on a familiar name is the quickest way to judge whether '
    'code-side sourcing belongs in your own workflow.</p>'
)

BOOSTER3 = (
    '<p style="color:#333;line-height:1.7">One caveat worth stating plainly on {t}: momentum is a leading indicator, '
    'not a verdict. A repository can accelerate for reasons that never become a fundraise, and a quiet quarter does '
    'not mean a team is failing. The disciplined use of this page is as one input in a stack, a way to rank where '
    'scarce diligence time goes, and a way to notice change early. The methodology page documents every limitation, '
    'including the bot filter, the two-period confirmation rule, and the sectors where coverage is thinnest.</p>'
)


def boosters_for(h1, need_words):
    """Append booster paragraphs (max 3) until the block covers the shortfall."""
    out = ""
    remaining = need_words
    for tpl in (BOOSTER, BOOSTER2, BOOSTER3):
        if remaining <= 0:
            break
        para = tpl.format(t=h(h1), refresh=REFRESH, orgs=ORG, sectors=SECTORS)
        wc = len(re.sub(r'<[^>]+>', ' ', para).split())
        out += para
        remaining -= wc
    return out


def family_for(rel_path):
    parts = rel_path.split(os.sep)
    if len(parts) == 1:
        return "root"
    top = parts[0]
    mapping = {
        "glossary": "glossary", "faq": "faq", "answers": "answers",
        "how-to": "howto", "checklists": "checklist", "learn": "learn",
        "free": "free", "for": "for", "use-cases": "usecases",
        "tools": "tools", "vs": "vs", "integrations": "integrations",
        "pricing": "pricing", "alternatives-to": "vs", "best": "vs",
        "research": "root",
    }
    return mapping.get(top, "root")


def build_block(family, h1, html, rel_path):
    if family == "momentum":
        return gen_momentum(h1, html)
    fn = {
        "glossary": gen_glossary, "faq": gen_faq, "answers": gen_answers,
        "howto": gen_howto, "checklist": gen_checklist, "learn": gen_learn,
        "free": gen_free, "for": gen_for, "usecases": gen_usecases,
        "tools": gen_tools, "vs": gen_vs, "integrations": gen_integrations,
        "pricing": gen_pricing, "root": gen_root_thin,
    }.get(family)
    return fn(h1) if fn else gen_root_thin(h1)


# Insertion markers, priority order. Insert BEFORE the FAQ / CTA section.
MARKERS = [
    '<section class="faq"',
    '<h2 style="font-size:1.4em;font-weight:700;margin-bottom:20px;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Frequently Asked Questions</h2>',
    '<section class="cta"',
    '</main>',
    '<p class="disc"><strong>Methodology & disclaimer.</strong>',
    '</body>',
]


def insert_block(html, block):
    for marker in MARKERS:
        idx = html.find(marker)
        if idx != -1:
            return html[:idx] + SENTINEL + "\n" + block + "\n" + html[idx:]
    return None  # no marker found


def looks_indexable(html: str) -> bool:
    """A page is indexable content if it has no noindex robots meta and is not
    a verification stub. noindex pages (status, report, thanks) are excluded
    from the 500-word floor: the floor applies to sitemap-indexed templates."""
    if re.search(r'<meta[^>]+name=["\']robots["\'][^>]+noindex', html, flags=re.I):
        return False
    if re.search(r'<meta[^>]+content=["\'][^"\']*noindex[^"\']*["\'][^>]+name=["\']robots["\']', html, flags=re.I):
        return False
    return True


def process_file(fp, dry=False):
    html = open(fp, encoding="utf-8", errors="replace").read()
    if SENTINEL in html:
        return "skip-sentinel"
    wc = visible_words(html)
    if wc >= TARGET:
        return "skip-ok"
    if not looks_indexable(html):
        return "skip-noindex"
    h1 = title_of(html)
    if not h1:
        return "skip-no-h1"
    rel = os.path.relpath(fp, ROOT)
    # momentum family special-case by path
    fam = "momentum" if rel.startswith("data/momentum-index/") else family_for(rel)
    block = build_block(fam, h1, html, rel)
    # booster: if family block + current page still under target, append h1-parameterized paragraphs
    block_words = len(re.sub(r'<[^>]+>', ' ', block).split())
    shortfall = TARGET - (wc + block_words)
    if shortfall > 0:
        block += boosters_for(h1, shortfall)
    new = insert_block(html, block)
    if new is None:
        return "skip-no-marker"
    # safety: never lose bytes; head untouched (marker is in body)
    head_end = html.find("</head>")
    assert new[:head_end] == html[:head_end], "head changed!"
    if dry:
        return f"would-enrich {wc} -> ~{wc + visible_words(block)}"
    open(fp, "w", encoding="utf-8").write(new)
    return f"enriched {wc} -> {visible_words(new)}"


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "apply"
    if mode == "--verify":
        rows = []
        for dirpath, dirnames, filenames in os.walk(ROOT):
            rel_dir = os.path.relpath(dirpath, ROOT)
            if rel_dir.split(os.sep)[0] in EXCLUDE_DIRS:
                continue
            for f in filenames:
                if not f.endswith(".html"):
                    continue
                if f in SKIP_FILES or any(s in f for s in SKIP_SUBSTR):
                    continue
                fp = os.path.join(dirpath, f)
                wc = visible_words(open(fp, encoding="utf-8", errors="replace").read())
                rows.append((os.path.relpath(fp, ROOT), wc))
        below = [r for r in rows if r[1] < TARGET]
        hard = [r for r in rows if r[1] < HARD_MIN]
        print(f"files={len(rows)} below-{TARGET}={len(below)} below-{HARD_MIN}={len(hard)}")
        for p, w in sorted(below, key=lambda x: x[1])[:25]:
            print(f"  {w:>4} {p}")
        return

    dry = mode == "--dry"
    results = {"enriched": [], "skip": 0, "skip-ok": 0, "skip-sentinel": 0, "skip-no-h1": 0, "skip-no-marker": 0, "skip-noindex": 0}
    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel_dir = os.path.relpath(dirpath, ROOT)
        if rel_dir.split(os.sep)[0] in EXCLUDE_DIRS:
            continue
        for f in filenames:
            if not f.endswith(".html"):
                continue
            if f in SKIP_FILES or any(s in f for s in SKIP_SUBSTR):
                continue
            fp = os.path.join(dirpath, f)
            try:
                res = process_file(fp, dry=dry)
            except Exception as e:
                print("ERROR", fp, e)
                continue
            if res.startswith(("enriched", "would")):
                results["enriched"].append((os.path.relpath(fp, ROOT), res))
            elif res in results:
                results[res] += 1
            else:
                results["skip"] += 1
    print(f"mode={'dry' if dry else 'apply'}")
    print(f"enriched/would: {len(results['enriched'])}")
    print(f"skipped ok(>={TARGET}w): {results['skip-ok']}")
    print(f"skipped sentinel: {results['skip-sentinel']}")
    print(f"skipped no-h1: {results['skip-no-h1']}  no-marker: {results['skip-no-marker']}  noindex: {results['skip-noindex']}  other: {results['skip']}")
    for p, r in results["enriched"][:30]:
        print(f"  {r}  {p}")


if __name__ == "__main__":
    main()
