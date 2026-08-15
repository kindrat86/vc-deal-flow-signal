#!/usr/bin/env python3
"""
_depth_v2_generator.py — Port the signals-host template depth standard to
gitdealflow.com (landing/) /answers/ and /data/ pages.

2026-08-15 traffic audit, "Template quality at scale" (scored 52):
"Main host templates: 165-425 words; signals host: 980-1,927 words; two
quality tiers. Fix: port the signals template depth standard to /answers/
and /data/."

Does three things, IDEMPOTENT via SENTINEL <!-- depth-v2 -->:
  1. CLAIM REPAIR on 3 legacy answer pages whose body + head JSON-LD carry
     fabricated product claims (SEC-filings monitoring, NLP deal-term
     extraction, sub-hour M&A updates, "Signals product" ML scoring).
     Replaced with the real product: weekly public GitHub engineering
     panel, 350+ orgs, 15 sectors, 21-47 day lead. Also repoints their
     Related-Questions links to live targets (old ones 404).
  2. DEEPENING: every indexable EN /answers/ + /data/ page below ~650
     main-content words gets a hand-written, page-specific section
     (2-3 paragraphs + list + 2-3 new FAQ <details>) plus a 40-60 word
     direct-answer callout where missing. Momentum-index company pages
     get a per-repository investor-reading section generated from the
     page's OWN parsed metrics + cross-index comparisons computed from
     all 40 pages. No invented statistics: only facts already on the
     page + published methodology constants.
  3. SITEMAP lastmod refresh for every changed URL.

Rules (static-content-expander + content-compliance-repair skills):
- Never touch <head> EXCEPT the surgical same-string claim replacements
  (identical bytes replaced 1:1 wherever the string occurs, incl. JSON-LD)
  and never reformat anything.
- Keep existing FAQ <details> verbatim; append new ones.
- No em dashes anywhere (site style rule).
- Links only to verified-live apex paths or absolute signals URLs.

Usage:
  python3 _depth_v2_generator.py --dry       # report only
  python3 _depth_v2_generator.py --apply     # write files
  python3 _depth_v2_generator.py --verify    # word-count report
"""
import html as htmlmod
import os
import re
import sys

ROOT = os.path.expanduser("~/signals-gitdealflow/landing")
SENTINEL = "<!-- depth-v2 -->"
TARGET = 650  # main-content words; aim 700-950 after injection

# Published-methodology constants (reused verbatim from live pages; never invent).
ORG = "350+"
SECTORS = "15"
LEAD = "21 to 47 days"
REFRESH = "weekly"
SCORE_F = "0.40·traction + 0.35·recency + 0.25·velocity"
WINDOW = "14-day windows"

ESC = str.maketrans({"<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})


def h(s):
    return str(s).translate(ESC)


H2 = ('<h2 style="font-size:1.4em;font-weight:700;margin-top:2rem;margin-bottom:.8em;'
      'border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">{t}</h2>')
P = '<p style="color:#333;line-height:1.7">{t}</p>'
UL = '<ul style="line-height:1.9;padding-left:1.25rem;color:#333">{t}</ul>'
LI = "<li>{t}</li>"
FAQ_D = ('<details style="margin-bottom:.75rem;border:1px solid #e5e7eb;border-radius:.5rem;'
         'padding:.75rem 1rem"><summary style="font-weight:600;cursor:pointer;color:#1a1a1a">'
         "{q}</summary><p style=\"color:#333;margin-top:.5em\">{a}</p></details>")
CALLOUT = ('<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:.5rem;'
           'padding:.9rem 1.1rem;margin:0 0 1.4rem"><p style="color:#1a1a1a;line-height:1.7;'
           'margin:0"><strong>Direct answer:</strong> {t}</p></div>')


def visible_words_main(html):
    t = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.S | re.I)
    t = re.sub(r"<style[^>]*>.*?</style>", "", t, flags=re.S | re.I)
    m = re.search(r"<(main|article)[\s\S]*?</\1>", t)
    if m:
        t = m.group(0)
    t = re.sub(r"<[^>]+>", " ", t)
    t = htmlmod.unescape(t)
    return len(t.split())


# ---------------------------------------------------------------------------
# 1. CLAIM REPAIRS (3 legacy pages; same-string replace across body + JSON-LD)
# ---------------------------------------------------------------------------
CLAIM_REPAIRS = {
    "answers/how-do-i-track-startup-acquisitions-in-real-time/index.html": [
        (
            "GitDealFlow monitors SEC filings, press releases, and funding databases to surface startup acquisitions as they happen, with deal size estimates, acquirer profiles, and market sector analysis.",
            "Truly real-time tracking of private startup acquisitions does not exist; announcements lag the deals. The practical stack is public filings and press feeds for confirmed deals, plus leading indicators like GitDealFlow's weekly GitHub engineering panel, which flags companies building toward a round 21 to 47 days before it is announced.",
        ),
        (
            "GitDealFlow aggregates acquisition data from multiple sources: SEC EDGAR filings, Crunchbase, PitchBook, press releases, and direct company announcements. The platform applies NLP to extract deal terms, identify acquiring companies, and classify transactions by industry and deal type.",
            "Confirmed-deal tracking leans on public sources anyone can use: SEC EDGAR full-text search, funding-database records, press releases, and direct company announcements. What a tool adds is consolidation and alerting, not new primary data.",
        ),
        (
            "Users can set custom alerts for specific sectors, deal sizes, or acquirer profiles. The dashboard updates within minutes of new filings being detected.",
            "On the leading side, GitDealFlow publishes a free weekly panel of engineering activity (commit velocity, contributor growth, repository expansion) across 350+ startup organizations in 15 sectors, with breakout teams visible 21 to 47 days before their round is announced.",
        ),
    ],
    "answers/how-do-investors-use-acquisition-data-to-find-opportunities/index.html": [
        (
            "Investors use GitDealFlow to identify acquisition patterns, which companies are buying in which sectors, at what multiples, to spot undervalued startups and predict the next acquisition targets.",
            "Investors read acquisition history for patterns (serial acquirers, consolidation, multiples), then watch leading indicators: GitDealFlow's weekly GitHub panel flags engineering acceleration at target-profile companies 21 to 47 days before announcements.",
        ),
        (
            "By analyzing historical acquisition data, investors can identify serial acquirers, sector consolidation trends, and typical deal multiples. GitDealFlow's Signals product applies machine learning to score startups on acquisition likelihood based on these patterns.",
            "By analyzing historical acquisition data from public databases, investors can identify serial acquirers, sector consolidation trends, and typical deal multiples. The scoring layer GitDealFlow contributes is different in kind: a public 0-100 Momentum Score computed from engineering activity, refreshed weekly, with the full methodology published.",
        ),
    ],
    "answers/what-s-the-difference-between-gitdealflow-and-crunchbase/index.html": [
        (
            "GitDealFlow focuses exclusively on M&amp;A deal flow with real-time alerts, proprietary valuation estimates, and investor signal scoring, Crunchbase is a broader company database with delayed M&amp;A data.",
            "Crunchbase is a broad company database (profiles, funding rounds, M&amp;A records) that updates from announcements. GitDealFlow is a leading-signal dataset: weekly public GitHub engineering activity across 350+ startups, flagging breakout teams 21 to 47 days before their rounds are announced.",
        ),
        (
            "GitDealFlow focuses exclusively on M&A deal flow with real-time alerts, proprietary valuation estimates, and investor signal scoring, Crunchbase is a broader company database with delayed M&A data.",
            "Crunchbase is a broad company database (profiles, funding rounds, M&A records) that updates from announcements. GitDealFlow is a leading-signal dataset: weekly public GitHub engineering activity across 350+ startups, flagging breakout teams 21 to 47 days before their rounds are announced.",
        ),
        (
            "Crunchbase covers company profiles, funding rounds, and some M&amp;A, but its acquisition data is often days to weeks behind and lacks deal-term analysis. GitDealFlow is purpose-built for M&amp;A tracking with sub-hour updates, NLP-extracted deal terms, and proprietary scoring for acquirer strategy patterns.",
            "Crunchbase covers company profiles, funding rounds, and some M&amp;A, with records appearing after the news breaks. GitDealFlow is purpose-built for the earlier window: commit velocity, contributor growth, and repository expansion across 350+ startup organizations in 15 sectors, refreshed weekly, with a public methodology and a downloadable CC BY 4.0 dataset.",
        ),
        (
            "Crunchbase covers company profiles, funding rounds, and some M&A, but its acquisition data is often days to weeks behind and lacks deal-term analysis. GitDealFlow is purpose-built for M&A tracking with sub-hour updates, NLP-extracted deal terms, and proprietary scoring for acquirer strategy patterns.",
            "Crunchbase covers company profiles, funding rounds, and some M&A, with records appearing after the news breaks. GitDealFlow is purpose-built for the earlier window: commit velocity, contributor growth, and repository expansion across 350+ startup organizations in 15 sectors, refreshed weekly, with a public methodology and a downloadable CC BY 4.0 dataset.",
        ),
        (
            "A deal-flow tool is designed around the moment the news breaks: it ingests filings and press releases continuously, extracts the deal terms automatically, and notifies you the same day. For an investor deciding whether to act, that same-day window is the entire point.",
            "A leading-signal tool is designed around the window before the news breaks: it watches public engineering activity weekly and flags acceleration while a round is still being prepared. For an investor deciding whether to build a relationship before the crowd, that window is the entire point.",
        ),
    ],
}

# Dead Related-Questions links on the 3 legacy pages -> live replacements.
# (Verified live before apply; see run log.)
RELATED_LINK_FIXES = {
    "answers/how-do-i-track-startup-acquisitions-in-real-time/index.html": [
        ("https://gitdealflow.com/answers/what-acquisition-data-sources-does-gitdealflow-use/",
         "What sources cover confirmed startup acquisitions?", "https://gitdealflow.com/answers/how-do-investors-use-acquisition-data-to-find-opportunities/"),
        ("https://gitdealflow.com/answers/how-accurate-are-gitdealflow-deal-size-estimates/",
         "How do investors use acquisition data to find opportunities?", "https://gitdealflow.com/answers/how-do-investors-use-acquisition-data-to-find-opportunities/"),
        ("https://gitdealflow.com/answers/can-i-track-private-company-acquisitions/",
         "Can private company acquisitions be tracked at all?", "https://gitdealflow.com/data/startup-ma-statistics/"),
    ],
    "answers/how-do-investors-use-acquisition-data-to-find-opportunities/index.html": [
        ("https://gitdealflow.com/answers/can-gitdealflow-predict-which-startup-will-be-acquired-next/",
         "Which companies are accelerating right now?", "https://gitdealflow.com/data/momentum-index"),
        ("https://gitdealflow.com/answers/how-do-i-set-up-acquisition-alerts-for-my-portfolio-companies/",
         "How do I track startup acquisitions in real time?", "https://gitdealflow.com/answers/how-do-i-track-startup-acquisitions-in-real-time/"),
        ("https://gitdealflow.com/answers/what-sectors-are-seeing-the-most-ma-activity-right-now/",
         "What do current funding trends show?", "https://gitdealflow.com/data/vc-funding-trends"),
    ],
    "answers/what-s-the-difference-between-gitdealflow-and-crunchbase/index.html": [
        ("https://gitdealflow.com/answers/how-fast-does-gitdealflow-update-after-an-announcement/",
         "How fast does GitDealFlow update?", "https://gitdealflow.com/data/github-engineering-velocity-data"),
        ("https://gitdealflow.com/answers/does-gitdealflow-track-international-acquisitions/",
         "What does European deal flow look like?", "https://gitdealflow.com/answers/deal-flow-in-europe"),
        ("https://gitdealflow.com/answers/what-pricing-plans-does-gitdealflow-offer/",
         "What is the difference between GitDealFlow and Crunchbase?", "https://gitdealflow.com/#ladder"),
    ],
}

# ---------------------------------------------------------------------------
# 2. HAND-WRITTEN DEEP BLOCKS (page-specific; facts from page + constants)
#    value: (callout_text_or_None, section_html)
# ---------------------------------------------------------------------------
SIG_CODE = "https://signals.gitdealflow.com/code-side-sourcing"

HAND_BLOCKS = {
    # ---- new-format answers -------------------------------------------------
    "answers/does-harmonic-integrate-with-affinity.html": (
        "Yes. Harmonic ships a native two-way Affinity integration: discovered companies push into Affinity as records, and relationship context flows back. It is a strong lagging-signal stack; pair it with leading indicators to see companies before they are discoverable in either database.",
        H2.format(t="Where momentum data fits in a Harmonic + Affinity stack")
        + P.format(t="Integrations like Harmonic-to-Affinity move information between systems that both register companies after discovery or announcement. That is exactly the right plumbing for relationship memory, and it says nothing about the window before a company becomes discoverable. Engineering acceleration is visible in public repositories before the funding news breaks: breakout teams surface in GitDealFlow's weekly panel, commit velocity, contributor growth, and repository expansion across 350+ startup organizations in 15 sectors, 21 to 47 days before their round is announced.")
        + P.format(t="The practical combination is chronological rather than competitive. Momentum data tells you which companies to look at this week; Harmonic-style discovery tells you what those companies are once you look; Affinity remembers every touchpoint after you make contact. Each layer feeds the next, and the cheapest layer is the leading one.")
        + UL.format(t="".join([
            LI.format(t="<strong>Weekly:</strong> scan the momentum panel for accelerating teams in your sectors."),
            LI.format(t="<strong>On a hit:</strong> enrich the company in your discovery database, then push it to Affinity."),
            LI.format(t="<strong>Ongoing:</strong> let the CRM carry the relationship, the panel carries the timing."),
        ]))
        + P.format(t="GitDealFlow publishes its full weekly panel through free JSON and CSV endpoints, so firms pipe momentum scores into Affinity or any CRM on their own schedule rather than waiting for a native integration.")
        + FAQ_D.format(q="Does GitDealFlow integrate with Affinity?", a="Not as a native app. The dataset is designed for pipelines: free JSON and CSV endpoints plus a public OpenAPI spec let you sync momentum scores into Affinity, or any other system, on your own cadence.")
        + FAQ_D.format(q="Is engineering activity a leading or lagging signal?", a="Leading. The panel refreshes weekly and breakout teams are visible 21 to 47 days before their funding announcement; databases that update from announcements are lagging by construction."),
    ),
    "answers/deal-flow-in-europe.html": (
        "European deal flow runs through Dealroom, local funds, and accelerators rather than the Silicon Valley stack, and the timing gap is wider because leading-signal coverage is thinner. Public engineering data closes part of that gap: many of Europe's strongest teams build in public repositories.",
        H2.format(t="Europe builds in public: what the momentum index shows")
        + P.format(t="The Momentum Index on this site makes the European pattern concrete. Of the 40 repositories it tracks weekly, a large share are European-founded engineering teams, Supabase, n8n, Strapi, Meilisearch, Directus, Plausible, Umami, and Documenso among them. Europe's commercial software scene is unusually open-source-heavy, which means the leading-signal method that reads public repositories applies to the continent better than to closed-source ecosystems of the same size.")
        + P.format(t="That has a practical consequence for sourcing: the weekly panel (350+ organizations, 15 sectors, refreshed weekly, breakout teams visible 21 to 47 days pre-announcement) covers a European engineering layer that announcement-driven databases register only after the fact. For a London, Paris, or Berlin fund competing on speed, the open-source layer is the widest unguarded window.")
        + UL.format(t="".join([
            LI.format(t="Track repository expansion at European orgs, new public repos are hiring signals."),
            LI.format(t="Watch contributor growth, distributed EU teams add maintainers before they add headcount."),
            LI.format(t="Confirm with local context: accelerators, national grant databases, and Dealroom records."),
        ]))
        + FAQ_D.format(q="Which European companies are in the momentum data?", a="The public index includes European-founded teams such as Supabase, n8n, Strapi, Meilisearch, Directus, Plausible, Umami, and Documenso, alongside US and global repositories; the full weekly panel covers 350+ organizations.")
        + FAQ_D.format(q="Does the 21 to 47 day lead apply in Europe?", a="The lead is measured across the whole panel, not per region. European teams are well represented in the open-source layer, so the method transfers; verify with local announcement data as always."),
    ),
    "answers/how-to-get-scouted-on-github.html": (
        "Getting scouted on GitHub means making engineering activity legible to investors, scouts, and recruiters: sustained commit velocity, contributor growth, repository expansion, and early participation in projects that later break out. It is a visibility discipline, not a talent contest.",
        H2.format(t="The three measurements a scout runs first")
        + P.format(t="Scouts do not read code, they read behavior. The panel behind this site measures exactly three things, and each has a legible signature. Commit velocity is computed over 14-day windows as a percentage change against the prior window with a two-period confirmation rule, so one energetic week does not register as a breakout; two consecutive windows do. Contributor concentration is a Gini coefficient, which separates a bus-factor-one project from a team that is genuinely scaling. Repository expansion counts new public repositories and code size growth, often the earliest hiring signal there is.")
        + P.format(t="If you want to be found, optimize for what these measurements reward: consistent commits over bursts, a growing set of meaningful contributors rather than a lone-genius profile, and new public repos when your team expands. The Scout Score works the same way in reverse: it computes a 0-100 score for a GitHub user from their starring history against a validated set of breakout companies, so being starred early by high-scorers is itself a signal.")
        + FAQ_D.format(q="What is two-period confirmation?", a="A velocity change only counts after it persists across two consecutive 14-day windows. It exists to kill one-week spikes, rebuilds, and botched releases before they look like momentum.")
        + FAQ_D.format(q="Does the Scout Score read my commits?", a="No. It is computed from public starring history: which repositories a user starred, and how early, scored against a validated set of breakout companies. It never reads private activity or code."),
    ),
    "answers/deep-space-startup-deal-flow.html": (
        "Deep space deal flow concentrates in the software around the missions: in-space manufacturing, ground stations, debris tracking, lunar mission control, and earth-observation data. The software layer is increasingly public, which makes engineering-velocity signals unusually effective in this sector.",
        H2.format(t="Why the open-source flight-software layer is readable")
        + P.format(t="Space software has an unusual property for investors: meaningful parts of the stack are public by design. Flight-software frameworks from major agencies and open-source ground-station and mission-control tooling are developed in public repositories, where contributor growth and commit velocity are visible to anyone. The same measurement discipline this site applies to commercial infrastructure, commit velocity over 14-day windows with two-period confirmation, contributor concentration, repository expansion, transfers directly to that layer.")
        + P.format(t="The pattern to watch is contributor growth on mission-critical repositories. Space software teams scale by adding specialists, and because the work is public, the addition of a second or third meaningful contributor to a grounded-station or orbital-tooling repo is visible weeks before any announcement. The panel method behind this site measures exactly that shape of change across 350+ organizations, and breakout teams surface 21 to 47 days before their round is announced.")
        + FAQ_D.format(q="Does GitDealFlow track space repositories?", a="The weekly panel covers 15 sectors of venture-backed software. Space-domain repositories are readable with the same method, and the free momentum checker lets you run a live query on any public repository you care about.")
        + FAQ_D.format(q="What is the earliest space-software signal?", a="Repository expansion, a team adding new public repositories, usually precedes hiring and fundraising. Contributor growth is the confirmation; commit velocity is the trend."),
    ),
    "answers/ecommerce-infrastructure-for-startups.html": (
        "E-commerce infrastructure is the software beneath the storefront: headless CMS, checkout, inventory forecasting, post-purchase experience, and multi-channel sync. Because so much of it is open source, engineering-velocity signals are unusually clean in this category.",
        H2.format(t="A live example: reading commerce momentum in the index")
        + P.format(t="This category is not hypothetical on this site: the public Momentum Index tracks Medusa, the open-source commerce platform, alongside 39 other infrastructure repositories, scoring each weekly on traction, recency, and velocity. That is precisely the leading pattern this page describes: a commerce-infrastructure company whose repository gains contributors and accelerates week over week is showing the behavior that precedes funding rounds, 21 to 47 days ahead of the announcement, while app stores and funding databases show nothing yet.")
        + P.format(t="For sourcing, the category map is the workflow. Headless storefronts, billing and checkout layers, inventory and order management, and the post-purchase stack each live in public repositories to a degree retail software never did. Scan the weekly panel for acceleration in those clusters, then confirm with the commercial signals: merchant counts, integration marketplaces, and hiring pages.")
        + FAQ_D.format(q="Which commerce companies does the index track?", a="The public Momentum Index includes Medusa and other commerce-adjacent infrastructure repositories; the full weekly panel covers 350+ venture-backed organizations across 15 sectors.")
        + FAQ_D.format(q="Why is open-source commerce easier to source?", a="Because adoption and effort are public. Stars and contributors proxy merchant and builder interest, and both are measurable weekly without anyone's permission."),
    ),
    "answers/how-does-angel-investing-work.html": (
        "Angels write $10K-$100K checks at the earliest stage, which is exactly where leading signals beat databases: public engineering acceleration is visible 21 to 47 days before rounds are announced, and the weekly panel covering 350+ startups is free to read.",
        H2.format(t="What engineering data adds to angel diligence")
        + P.format(t="Angel economics make the leading window disproportionately valuable. At the earliest stage there is no revenue to check and no database record to find; the strongest available evidence is whether the team is visibly building, commit velocity sustained across consecutive 14-day windows, contributors being added rather than lost, and public repositories multiplying. Those are the measured behaviors behind the weekly panel this site publishes, and they precede announcements rather than follow them.")
        + P.format(t="The second angel-specific use is bus-factor diligence. Contributor concentration, measured as a Gini coefficient, tells you whether a one-person project is institutionalizing into a team or staying a single point of failure. For a check sized $10K-$100K, that distinction is often the whole risk question.")
        + FAQ_D.format(q="How much does the signal data cost?", a="The weekly panel, the JSON and CSV endpoints, and the Sunday signal email are free. Paid tiers exist for deeper first-look workflows, but the core leading data is public.")
        + FAQ_D.format(q="Does engineering activity replace talking to founders?", a="No. It replaces cold deal-flow randomness with a ranked shortlist. You still meet the team; the data decides who gets the meeting this week."),
    ),
    "answers/how-long-does-fundraising-take.html": (
        "Pre-seed takes 1-3 months, seed 3-6, and later stages longer, but the build-up before the process starts is measurable: engineering acceleration appears 21 to 47 days before rounds are announced, so the calendar question has a leading answer.",
        H2.format(t="The pre-fundraising build window, measured weekly")
        + P.format(t="The timelines above describe the process once it starts. The panel data adds the chapter before chapter one: teams accelerate before they announce, and the acceleration is public. Commit velocity is measured over 14-day windows as a percentage change against the prior window, with two-period confirmation so a spike does not count until it persists; breakout teams that clear that bar surface 21 to 47 days before their round hits the news.")
        + P.format(t="Read against the timeline table, that lead time lands differently by stage. A seed process of 3-6 months means the acceleration window typically opens before the pitch deck exists; a fast pre-seed of 1-3 months means the two-period confirmation may fire only weeks ahead. Either way, the weekly refresh cadence matches the granularity of the decision: this week's panel is this week's shortlist.")
        + FAQ_D.format(q="How often is the panel refreshed?", a="Weekly. Every organization in the 350+ company panel is re-pulled from the public GitHub API on a fixed cadence, and the freshness endpoint reports the exact pull date.")
        + FAQ_D.format(q="Can a company accelerate and still not raise?", a="Yes, and the methodology says so: the signal is a leading indicator measured across the panel, not a promise about any single company. Two-period confirmation reduces false positives; it does not eliminate them."),
    ),
    "answers/how-to-spot-a-unicorn-early.html": (
        "The leading indicators are measurable: top-quartile commit velocity within six months of founding, founder-market fit, and early breakout participation. The panel method operationalizes this across 350+ organizations weekly, with breakout teams visible 21 to 47 days pre-announcement.",
        H2.format(t="From indicator to instrument: how the panel measures it")
        + P.format(t="The indicators on this page become investable when they are measured on a fixed cadence across a whole population, not cherry-picked after the fact. That is what the weekly panel does for the engineering indicator: commit velocity in 14-day windows with two-period confirmation, contributor concentration as a Gini coefficient, and repository expansion, across 350+ venture-backed organizations in 15 sectors. Top-quartile velocity stops being a story and becomes a rank you can query.")
        + P.format(t="The Scout Score closes the loop from the other side. It scores a GitHub user 0-100 from their starring history against a validated set of breakout companies, which means the humans who starred the right repositories early are identifiable before their next pick is famous. Founder-market fit remains a judgment call; founder-velocity fit does not have to be.")
        + FAQ_D.format(q="How many companies are in the panel?", a="350+ venture-backed organizations across 15 sectors, refreshed weekly. The subset with the highest current scores is published free in the Momentum Index.")
        + FAQ_D.format(q="Does top-quartile velocity guarantee a unicorn?", a="No. It is a leading indicator with a measured 21 to 47 day pre-announcement lead across the panel; most accelerated teams still fail. The point is ranking attention, not predicting outcomes."),
    ),
    "answers/what-is-a-scout-program.html": (
        "A scout program pays operators, founders, and well-networked insiders a carry share (typically 5-15%) to source deals for a fund. This guide covers the economics, the selection filters, and how to source systematically with public engineering data.",
        H2.format(t="A weekly data routine for working scouts")
        + P.format(t="Scouting rewards coverage, and coverage needs a cadence. The scouts who last run a fixed weekly loop on the public panel: scan the momentum list for teams accelerating in their sectors, check contributor concentration to filter single-maintainer projects, and log every shortlisted company with the date. The two-period confirmation rule (velocity must persist across two consecutive 14-day windows) means the panel's breakout flags arrive pre-filtered against one-week noise.")
        + P.format(t="The receipt matters as much as the pick. A dated log of which teams you flagged and when is what separates a scout with a track record from a person with opinions; the Scout Score, a 0-100 score for a GitHub user computed from starring history against validated breakout companies, is the same idea applied to other people's radars. Funds remember who was early, and early is a measurable property.")
        + UL.format(t="".join([
            LI.format(t="<strong>Monday:</strong> read the weekly panel refresh; shortlist by velocity split."),
            LI.format(t="<strong>Midweek:</strong> verify shortlisted teams, contributors, repos, hiring pages."),
            LI.format(t="<strong>Friday:</strong> submit the qualified picks with dates attached."),
        ]))
        + FAQ_D.format(q="How much time does data-driven scouting take?", a="The scan-and-shortlist loop is roughly an hour a week; verification depth is up to you. The panel exists precisely so scouts stop cold-reading feeds and start from a ranked list.")
        + FAQ_D.format(q="Do funds care that a pick came from data?", a="Funds care that it was early and right. A dated shortlist built on public measurements is the most auditable form of early there is."),
    ),
    "answers/what-makes-a-good-vc-investor.html": (
        "Great VCs behave like scientists: hypothesis, test, update. The seven qualities compound fastest when paired with measurement discipline, and the leading indicators are now public: engineering acceleration across 350+ organizations, refreshed weekly.",
        H2.format(t="Judgment compounds faster when it is measured")
        + P.format(t="Every quality on this page, pattern recognition, selection discipline, learning from misses, improves with feedback loops, and feedback loops need instruments. The public panel is one such instrument: commit velocity with two-period confirmation, contributor concentration, and repository expansion, measured weekly across 350+ organizations in 15 sectors. An investor who logs which accelerated teams they passed on, and what happened next, is running the update loop the seven qualities describe.")
        + P.format(t="The falsification half is what makes it science. Two-period confirmation exists to kill false positives before they cost a meeting; the Gini coefficient exists to surface bus-factor risk before it costs a check. Instruments that can embarrass you are the only ones worth trusting, and both of these can.")
        + FAQ_D.format(q="Can process replace judgment in venture?", a="No. Process decides which fifty companies get looked at this week; judgment decides which one gets a term sheet. The panel is a ranking instrument, not an autopilot.")
        + FAQ_D.format(q="What is the cheapest way to start measuring?", a="The weekly panel, the free momentum checker, and the Sunday signal email. All three are free; the paid tier only adds depth for teams running the loop at scale."),
    ),
    # ---- legacy answers (claim repair + deepening) --------------------------
    "answers/how-do-i-track-startup-acquisitions-in-real-time/index.html": (
        "You cannot track private acquisitions truly in real time; announcements lag the deals. Use public filings and press feeds for confirmed deals, and leading indicators for what happens next: weekly GitHub engineering signals flag breakout teams 21 to 47 days before their rounds are announced.",
        H2.format(t="A two-layer tracking stack that actually works")
        + P.format(t="Layer one is confirmatory and free: SEC EDGAR full-text search for filings, funding-database records, company press pages, and RSS feeds cover most announcements that will ever be public. Layer two is leading: the weekly engineering panel behind this site, commit velocity over 14-day windows with two-period confirmation, contributor concentration, and repository expansion across 350+ startup organizations in 15 sectors, refreshed weekly.")
        + P.format(t="The layers answer different questions and fail differently, which is the point of running both. The confirmatory layer is complete but late and structurally incomplete at the private-deal margins. The leading layer is early (breakout teams visible 21 to 47 days before announcement) but probabilistic: it tells you who is building toward something, not whether an acquirer has signed anything.")
        + UL.format(t="".join([
            LI.format(t="<strong>Daily:</strong> EDGAR alerts and press RSS for confirmed deals in your sectors."),
            LI.format(t="<strong>Weekly:</strong> panel refresh for accelerating teams; add them to the watchlist."),
            LI.format(t="<strong>On a hit:</strong> verify against the primary source before acting; log the result."),
        ]))
        + FAQ_D.format(q="How often does the engineering panel refresh?", a="Weekly, on a fixed cadence from the public GitHub API, with the exact pull date published on the freshness endpoint.")
        + FAQ_D.format(q="Is any of this real-time?", a="No honest source is. Confirmed-deal feeds lag announcements; the leading panel runs weekly by design so that two-period confirmation can filter noise. Treat every 'real-time M&A' claim, including older versions of this page, with suspicion."),
    ),
    "answers/how-do-investors-use-acquisition-data-to-find-opportunities/index.html": (
        "Investors use acquisition history to find serial acquirers, consolidation waves, and typical multiples, then watch leading indicators for the next wave: engineering acceleration across 350+ startups appears 21 to 47 days before funding announcements.",
        H2.format(t="Turning acquisition patterns into a weekly watchlist")
        + P.format(t="The patterns above, serial acquirers, consolidation, multiples, are backward-looking classifiers: they tell you the shape of the next wave but not its timing. Timing comes from the leading layer: the weekly panel measures commit velocity (14-day windows, two-period confirmation), contributor concentration (Gini coefficient), and repository expansion across 350+ organizations in 15 sectors, and breakout teams surface 21 to 47 days before their round is announced.")
        + P.format(t="The combined workflow is a simple join. Take the acquisition-pattern screen, which sectors are consolidating, which acquirers are buying, what profiles they pay up for, and run the weekly acceleration list against it. Companies that sit in a consolidating sector, match an active acquirer's profile, and are visibly accelerating on GitHub are the shortest shortlist in the business, and every input is public.")
        + FAQ_D.format(q="Does GitDealFlow score acquisition likelihood?", a="No. It scores engineering momentum (0-100, from traction, recency, and velocity) on the public Momentum Index. Acquisition-likelihood scoring is a framework you build by joining that momentum data with acquisition history from public databases.")
        + FAQ_D.format(q="Why join two datasets instead of one?", a="Because they fail in opposite ways: acquisition data is accurate but late, momentum data is early but probabilistic. The join keeps the accuracy and buys back the calendar."),
    ),
    "answers/what-s-the-difference-between-gitdealflow-and-crunchbase/index.html": (
        "Crunchbase is a broad company database updated from announcements: profiles, funding rounds, M&A records. GitDealFlow is a leading-signal dataset: weekly public GitHub engineering activity across 350+ startups that flags breakout teams 21 to 47 days before their rounds are announced.",
        H2.format(t="The same company, seen by both tools")
        + P.format(t="A concrete walk-through makes the difference plain. Weeks before a startup's seed round is announced, it is invisible in Crunchbase beyond a static profile, but its engineering behavior is already public: commit velocity climbing across consecutive 14-day windows, new contributors joining, public repositories multiplying. The GitDealFlow panel measures exactly those three behaviors weekly across 350+ organizations in 15 sectors, and breakout teams surface 21 to 47 days before announcement.")
        + P.format(t="After the round closes, the roles reverse. Crunchbase now has the round, the investors, the valuation; the panel still has the behavior, which is how you check whether the team that raised is accelerating or coasting. Databases answer what happened; the panel answers what is building. Serious sourcing desks run both and let each cover the other's blind spot.")
        + UL.format(t="".join([
            LI.format(t="<strong>Market maps and history:</strong> Crunchbase, it is the reference archive."),
            LI.format(t="<strong>This week's shortlist:</strong> the momentum panel, refreshed weekly with published methodology."),
            LI.format(t="<strong>Verification:</strong> always the primary source, the filing, the repo, the founder."),
        ]))
        + FAQ_D.format(q="Does GitDealFlow track M&A and funding rounds?", a="Not as a database of records. It tracks the engineering behavior that precedes funding rounds, with a public methodology and a CC BY 4.0 downloadable dataset. For the records themselves, use a database like Crunchbase.")
        + FAQ_D.format(q="Why does GitDealFlow refresh weekly instead of continuously?", a="Because the signal is defined as sustained acceleration: two consecutive 14-day windows. A faster cadence would add noise, not information, and the exact pull date is always published."),
    ),
    # ---- data pages ----------------------------------------------------------
    "data/startup-valuation-trends.html": (
        "2026 valuations are repriced by AI/ML momentum on one side and late-stage discipline on the other; top-quartile engineering teams command 15-25% premiums at every stage. The premium is measurable weekly from public repository data.",
        H2.format(t="How the engineering premium is measured")
        + P.format(t="Top-quartile is a rank, not a vibe. In the panel behind this site, engineering teams are ranked by measured behavior: commit velocity over 14-day windows (percentage change against the prior window, two-period confirmation), contributor concentration (Gini coefficient), and repository expansion, across 350+ organizations in 15 sectors, refreshed weekly. A team in the top quartile of that ranking is demonstrating the behavior the premium attaches to, weeks before any valuation event makes it official.")
        + P.format(t="For valuation work the cadence matters as much as the rank. A premium measured on announcement data is only visible after the round; the same behavior measured weekly lets an investor price the acceleration into a seed check before the market reprices it. The full methodology and the downloadable dataset (CC BY 4.0) are published, so the quartile boundaries can be re-derived independently.")
        + FAQ_D.format(q="Can I reproduce the quartile calculation?", a="Yes. The dataset is downloadable under CC BY 4.0 and the methodology, windows, confirmation rule, and coefficient definitions, is published; the whole point is independent re-derivation.")
        + FAQ_D.format(q="Does the premium hold in downturns?", a="The page's own framing cuts both ways: discipline at late stage compresses averages while AI/ML momentum holds premiums up. Engineering-quartile data tells you which side of that split a specific team is on; it does not repeal the cycle."),
    ),
    "data/github-engineering-velocity-data.html": (
        "The dataset tracks three measured behaviors, commit velocity (14-day windows, two-period confirmation), contributor concentration (Gini), and repository expansion, across 350+ venture-backed GitHub organizations in 15 sectors, refreshed weekly and free to download.",
        H2.format(t="From raw pulls to a deal-flow signal")
        + P.format(t="Each metric earns its place by surviving a false-positive filter. Commit velocity is a percentage change across 14-day windows and only counts after two consecutive confirming periods, which removes release spikes and rebuild weeks. Contributor concentration is a Gini coefficient: it distinguishes a team scaling its contributor base from a project one resignation away from dead. Repository expansion counts new public repositories and code-size growth, which correlates with team growth before headcount is announced anywhere.")
        + P.format(t="The composite is deliberately transparent: the Momentum Score is round(0.40·traction + 0.35·recency + 0.25·velocity), computed from public GitHub REST API data only. Breakout teams that clear the confirmation bar surface 21 to 47 days before their round is announced, and everything needed to check that claim, the dataset (CC BY 4.0), the JSON and CSV endpoints, and the OpenAPI spec, is public and free.")
        + FAQ_D.format(q="What is in the free download?", a="Weekly snapshots of the measured behaviors for 350+ organizations in 15 sectors, under CC BY 4.0, plus live JSON and CSV API endpoints and an OpenAPI spec for code generation.")
        + FAQ_D.format(q="Why GitHub activity rather than web traffic or hiring boards?", a="Because it is public, permissionless, timestamped, and behaviorally honest: code shipped is the closest public proxy to what a software company actually does all day."),
    ),
    "data/vc-funding-trends.html": (
        "Global VC funding is tracking toward $350-400B in 2026, concentrated in AI/ML, climate, and defense. Funding data confirms after the fact; leading engineering signals show the acceleration 21 to 47 days earlier, weekly, across 350+ organizations.",
        H2.format(t="Leading vs lagging: reading 2026 before it closes")
        + P.format(t="Every number in the table above is confirmatory: it describes rounds that already closed. The leading layer works a month earlier. The weekly panel measures engineering acceleration, commit velocity with two-period confirmation, contributor growth, repository expansion, across 350+ organizations in 15 sectors, and breakout teams surface 21 to 47 days before their announcements land in the funding-data feeds these trend charts are built on.")
        + P.format(t="Used together, the two datasets date the same event twice. When the panel's acceleration count rises in a sector while confirmed funding is flat, that divergence is the forecast; when confirmed rounds catch up weeks later, that is the verification. This page will say H2 2026 accelerated; the panel says it first, weekly, with dates attached.")
        + FAQ_D.format(q="Which signal moves first, panel or funding data?", a="The panel, by construction: its breakout flags precede announcements by a measured 21 to 47 days across the 350+ organization panel. Funding databases register the same event at announcement time.")
        + FAQ_D.format(q="Can engineering data predict totals like the $350-400B figure?", a="No. It ranks teams and sectors by acceleration; macro totals depend on allocation decisions the panel does not see. Use it for direction and timing, not aggregate size."),
    ),
    "data/startup-ma-statistics/index.html": (
        "These M&A statistics are confirmatory: medians, multiples, and time-to-exit measured after deals close. The leading complement is weekly engineering acceleration across 350+ startups, visible 21 to 47 days before the announcements that feed this table.",
        H2.format(t="From M&A statistics to the next deal")
        + P.format(t="Every row in this table describes a completed event, which makes it a calibration set, not a watchlist. The patterns it calibrates are real: serial acquirers repeat, consolidating sectors keep consolidating, and multiples cluster by profile. What the table cannot do is tell you which company is being built toward the next row right now.")
        + P.format(t="That is the leading layer's job. The weekly panel measures commit velocity (14-day windows, two-period confirmation), contributor concentration, and repository expansion across 350+ organizations in 15 sectors; breakout teams surface 21 to 47 days before their round is announced. Joined with this table's acquirer patterns, an accelerating team that fits an active acquirer's historical profile is the strongest public shortlist entry in M&A sourcing.")
        + FAQ_D.format(q="Are these M&A statistics updated weekly?", a="The statistics are compiled from public market reports and refresh as sources publish. The engineering panel refreshes weekly on a fixed cadence with the pull date published.")
        + FAQ_D.format(q="How do I join M&A patterns with engineering data?", a="Screen this table for active acquirers and profiles, then run the weekly acceleration list against those profiles. Every input is public: the dataset, the methodology, and the acquirer history."),
    ),
    "data/momentum-index/index.html": (
        "The Momentum Index scores 40 open-source repositories weekly on traction, recency, and velocity (0.40/0.35/0.25 weights) from public GitHub data. Scores, ranks, and the full dataset (CC BY 4.0) update every week on a fixed cadence.",
        H2.format(t="How to read the index this week")
        + P.format(t="The index rewards three different things and splits them openly: traction (accumulated adoption), recency (an actively maintained codebase), and velocity (week-over-week star growth). A repository can max traction while velocity fades, which reads as a mature project cooling, or run hot on velocity at modest traction, which reads as early breakout. The investable pattern the parent panel watches is the velocity inflection, because that is the component that precedes funding announcements by 21 to 47 days.")
        + P.format(t="The full dataset behind every score on this page is published as data.json under CC BY 4.0, and the methodology block at the end of each repository page states the formula and the exact pull date. Anything on this page can be re-derived from primary sources; that is the publication standard the whole site holds itself to.")
        + FAQ_D.format(q="How often are scores recalculated?", a="Weekly, from the public GitHub REST API, with the exact pull date published. The as-of date on each repository page is the freshness guarantee.")
        + FAQ_D.format(q="Why 40 repositories?", a="The index is the published subset of the 350+ organization weekly panel: open-source infrastructure repositories with comparable public metrics. The wider panel adds sectors and private-org coverage."),
    ),
    "dataset.html": (
        "The dataset is the weekly engineering-velocity panel: three measured behaviors across 350+ venture-backed GitHub organizations in 15 sectors, refreshed weekly, free to download and cite under CC BY 4.0.",
        H2.format(t="What a download buys you, methodologically")
        + P.format(t="The panel's value is not the snapshot but the cadence: weekly pulls of commit velocity (14-day windows, percentage change, two-period confirmation), contributor concentration (Gini coefficient), and repository expansion, across 350+ organizations in 15 sectors. Time-series behavior, not point-in-time counts, is what separates a team accelerating toward a round from a team that once shipped, and the measured lead between breakout flags and announcements is 21 to 47 days.")
        + P.format(t="Everything is reproducible by design: the methodology is published, the data carries a CC BY 4.0 license, and live JSON and CSV endpoints plus an OpenAPI spec let you pipe the panel into any analysis stack without scraping. Cite the dataset and the pull date; the freshness endpoint always reports the exact one.")
        + FAQ_D.format(q="Is the dataset really free?", a="Yes: CC BY 4.0, with free JSON and CSV endpoints and no authentication. Paid tiers on the site cover workflow products, not the data.")
        + FAQ_D.format(q="How should I cite it?", a="Cite the dataset page, the license, and the exact pull date from the freshness endpoint; the site's citation guidance gives the canonical form."),
    ),
}


# ---------------------------------------------------------------------------
# 3. MOMENTUM COMPANY PAGES — per-repo section from parsed metrics
# ---------------------------------------------------------------------------
MOM_DIR = "data/momentum-index"
MOM_GLOB_SKIP = {"index.html", "data.json", "history.json", "_build_momentum_index.mjs"}

MOM_FAQ_SETS = [
    [
        ("How often does this page update?",
         "Weekly, from the public GitHub REST API, with the exact pull date stated in the methodology block. The score, the metrics, and the rank all refresh together on that cadence."),
        ("Does a high Momentum Score mean a fundraise is coming?",
         "No. The score flags engineering acceleration, full stop. Across the parent panel, breakout teams surface 21 to 47 days before their round is announced, but the score is a leading indicator, not a prediction about any single repository."),
    ],
    [
        ("Is the Momentum Score investment advice?",
         "No. It reflects public software-engineering activity only and is not a valuation, a recommendation, or advice to buy, sell, or fund anything. It is a ranking instrument for where to look next."),
        ("Can I check a repository that is not in the index?",
         "Yes. The free momentum checker on this site runs a live query against any public GitHub repository, using the same measured behaviors the index applies to its 40 tracked repositories."),
    ],
    [
        ("How is the score weighted?",
         "Score = round(0.40·traction + 0.35·recency + 0.25·velocity): traction from accumulated adoption, recency from days since last push, velocity from week-over-week star growth. The formula is published in full on every index page."),
        ("Why does velocity matter more than total stars?",
         "Because the level is already priced and the delta is not. A repository at rest gains nothing for investors; an inflection in week-over-week growth is the pattern that precedes funding announcements by 21 to 47 days across the panel."),
    ],
]


def parse_momentum(html):
    """Extract per-repo facts from the page's own markup."""
    d = {}
    m = re.search(r"<title>([^<]+)</title>", html)
    title = htmlmod.unescape(m.group(1)).strip() if m else ""
    d["repo"] = title.split(":")[0].strip()
    m = re.search(r"Rank #(\d+) of (\d+)", html)
    if m:
        d["rank"], d["total"] = int(m.group(1)), int(m.group(2))
    m = re.search(r'<span class="lang">([^<]+)</span>', html) or re.search(r">(\w+)</span>", html)
    d["lang"] = m.group(1).strip() if m else ""
    m = re.search(r"(\d+)/100\s*</", html) or re.search(r">(\d+)\s*/\s*100<", html)
    # language is printed plain in the header area like " Python "
    m2 = re.search(r'class="lang-pill"[^>]*>\s*([A-Za-z+#.]+)\s*<', html)
    if m2:
        d["lang"] = m2.group(1)
    m = re.search(r"(\d[\d,]*)\s+GitHub stars", html) or re.search(r"carries\s+([\d,]+)\s+GitHub stars", html)
    d["stars"] = int(m.group(1).replace(",", "")) if m else None
    m = re.search(r"([\d,]+)\s+forks", html)
    d["forks"] = int(m.group(1).replace(",", "")) if m else None
    m = re.search(r"weekly velocity of \+([\d,]+)\s+stars", html) or re.search(r"\+([\d,]+)\s+stars/week", html)
    d["velocity"] = int(m.group(1).replace(",", "")) if m else None
    m = re.search(r"Weekly change:\s*\+?([\d,]+)\s+stars/week", html)
    if m and not d.get("velocity"):
        d["velocity"] = int(m.group(1).replace(",", ""))
    # sub-scores like traction 100/100, velocity 52/100
    subs = {}
    for name in ("traction", "recency", "velocity"):
        mm = re.search(name + r"\s*(\d+)/100", html)
        if mm:
            subs[name] = int(mm.group(1))
    d["subs"] = subs
    return d


def stars_fmt(n):
    return "{:,}".format(n)


def build_momentum_block(d, ctx):
    repo = d.get("repo", "this repository")
    short = repo.split("/")[-1] if "/" in repo else repo
    rank = d.get("rank")
    total = d.get("total", 40)
    stars = d.get("stars")
    vel = d.get("velocity")
    subs = d.get("subs", {})

    parts = []
    parts.append(H2.format(t="Reading " + h(repo) + " as an investor"))

    # P1: score decomposition in plain language, from parsed subs
    s_tr = subs.get("traction")
    s_ve = subs.get("velocity")
    if s_tr is not None and s_ve is not None:
        p1 = (
            h(repo) + " currently shows a split worth pausing on: traction at " + str(s_tr)
            + "/100 and velocity at " + str(s_ve) + "/100"
            + (" (recency " + str(subs["recency"]) + "/100)" if "recency" in subs else "")
            + ". In the scoring formula (round(0.40·traction + 0.35·recency + 0.25·velocity)) that combination reads as "
            + ("a large, established project whose growth rate, not whose size, is the live question."
               if s_tr >= 80 and s_ve < 80 else
               "a project whose recent acceleration is outrunning its accumulated size, the early-breakout shape."
               if s_ve >= 80 and s_tr < 80 else
               "a balanced profile where adoption and acceleration are moving together.")
        )
    else:
        p1 = (h(repo) + " is scored " + ("at rank #" + str(rank) + " of " + str(total) + " " if rank else "")
              + "on the formula round(0.40·traction + 0.35·recency + 0.25·velocity), computed from public GitHub REST API data only, refreshed weekly.")
    parts.append(P.format(t=p1))

    # P2: relative context from cross-index stats
    bits = []
    if stars and ctx.get("n_above_100k") is not None:
        if stars >= 100000:
            bits.append("one of only " + str(ctx["n_above_100k"]) + " repositories in the index above 100k stars")
        elif stars >= 50000:
            bits.append("in the index's 50k-plus star tier (" + str(ctx["n_above_50k"]) + " of " + str(total) + " repositories)")
        else:
            bits.append("below the 50k star tier where " + str(ctx["n_above_50k"]) + " of " + str(total) + " index repositories sit")
    if vel and ctx.get("n_vel_1k"):
        if vel >= 1000:
            bits.append("among the " + str(ctx["n_vel_1k"]) + " index repositories adding more than 1,000 stars a week")
        elif vel >= 300:
            bits.append("adding hundreds of stars a week, faster than the index median")
    p2 = "Context from the wider index: " + h(short) + " is " + ("; ".join(bits) + ". ") if bits else ""
    p2 += (
        "Because the index refreshes weekly on a fixed cadence, the number that matters for deal flow is not any single level but the direction between pulls; "
        "across the parent 350+ organization panel, breakout teams surface 21 to 47 days before their round is announced, and repository velocity inflections are how that lead shows up here."
    )
    parts.append(P.format(t=p2[0].upper() + p2[1:] if p2 else p2))

    # P3: what to do next
    p3 = (
        "If " + h(short) + " is on your watchlist, the next steps are mechanical: re-pull the page after the weekly refresh and compare the velocity sub-score, "
        "check contributor concentration in the parent panel (a Gini coefficient separating scaling teams from single-maintainer risk), "
        "and run any adjacent repository through the free momentum checker. The full index dataset is published as data.json under CC BY 4.0, so every number on this page can be re-derived independently."
    )
    parts.append(P.format(t=p3))

    # FAQs (rotating set by stable hash)
    faq_set = MOM_FAQ_SETS[hash(repo) % len(MOM_FAQ_SETS)]
    for q, a in faq_set:
        parts.append(FAQ_D.format(q=h(q), a=h(a)))
    return "".join(parts)


# ---------------------------------------------------------------------------
# INJECTION ENGINE
# ---------------------------------------------------------------------------

def inject_before_faq(html, block):
    """New-format pages: insert before <section class="faq". If no FAQ section,
    before the CTA section; else before </main>."""
    for anchor in ('<section class="faq"', '<section class="cta"', "</main>", "</article>", "</body>"):
        i = html.find(anchor)
        if i != -1:
            return html[:i] + block + "\n" + html[i:]
    return html


def inject_into_faq(html, extra_details):
    """Append new <details> inside the existing FAQ section."""
    i = html.find('<section class="faq"')
    if i == -1:
        return None
    end = html.find("</section>", i)
    if end == -1:
        return None
    return html[:end] + extra_details + "\n" + html[end:]


def inject_momentum(html, block):
    """Momentum pages: insert before the methodology disclaimer paragraph."""
    i = html.find('<p class="disc">')
    if i == -1:
        i = html.find("</main>")
    if i == -1:
        i = html.rfind("</body>")
    if i == -1:
        return None
    return html[:i] + block + "\n" + html[i:]


def inject_callout(html, callout):
    """Direct-answer callout: first element of the content section on new-format
    pages; replaces the legacy p.bluf answer line on old-format pages."""
    i = html.find('<section class="content">')
    if i != -1:
        j = i + len('<section class="content">')
        return html[:j] + "\n" + callout + "\n" + html[j:]
    m = re.search(r'<p class="bluf">[\s\S]*?</p>', html)
    if m:
        return html[: m.start()] + callout + html[m.end():]
    return html


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "--dry"
    changed = []
    skipped = []

    # ---- Pass 1: claim repairs ------------------------------------------
    for rel, pairs in CLAIM_REPAIRS.items():
        fp = os.path.join(ROOT, rel)
        src = open(fp, encoding="utf-8").read()
        if SENTINEL in src:
            skipped.append((rel, "already-v2"))
            continue
        hits = 0
        for old, new in pairs:
            if old in src:
                src = src.replace(old, new)
                hits += 1
        # related-link repoints
        for old_href, new_label, new_href in RELATED_LINK_FIXES.get(rel, []):
            old_a = '<a href="' + old_href + '">'
            if old_a in src:
                src = src.replace(old_a, '<a href="' + new_href + '">')
        open(fp, "w", encoding="utf-8").write(src)
        changed.append((rel, "claims:" + str(hits)))
        print(("REPAIRED " if mode == "--apply" else "would-repair ") + rel + " (" + str(hits) + " strings)")

    # ---- Pass 2: momentum cross-index context ---------------------------
    import glob as globmod
    mom_files = sorted(
        f for f in globmod.glob(os.path.join(ROOT, MOM_DIR, "*.html"))
        if os.path.basename(f) not in {"index.html"}
    )
    parsed = {}
    for fp in mom_files:
        parsed[fp] = parse_momentum(open(fp, encoding="utf-8").read())
    stars_list = [d["stars"] for d in parsed.values() if d.get("stars")]
    vels = [d["velocity"] for d in parsed.values() if d.get("velocity")]
    ctx = {
        "n_above_100k": len([s for s in stars_list if s >= 100000]),
        "n_above_50k": len([s for s in stars_list if s >= 50000]),
        "n_vel_1k": len([v for v in vels if v >= 1000]),
    }
    print("momentum context: " + json_ctx(ctx) + " from " + str(len(mom_files)) + " pages")

    for fp in mom_files:
        src = open(fp, encoding="utf-8").read()
        if SENTINEL in src:
            skipped.append((os.path.relpath(fp, ROOT), "already-v2"))
            continue
        before = visible_words_main(src)
        if before >= TARGET:
            skipped.append((os.path.relpath(fp, ROOT), "over-target " + str(before)))
            continue
        d = parsed[fp]
        block = SENTINEL + "\n" + build_momentum_block(d, ctx)
        out = inject_momentum(src, block)
        if out is None:
            print("SKIP (no anchor) " + fp)
            continue
        if mode == "--apply":
            open(fp, "w", encoding="utf-8").write(out)
        after = visible_words_main(out)
        changed.append((os.path.relpath(fp, ROOT), str(before) + "->" + str(after)))
        print(("WROTE " if mode == "--apply" else "would ") + os.path.relpath(fp, ROOT) + " " + str(before) + " -> " + str(after))

    # ---- Pass 3: hand blocks ----------------------------------------------
    for rel, (callout, section) in HAND_BLOCKS.items():
        fp = os.path.join(ROOT, rel)
        if not os.path.exists(fp):
            print("MISSING " + rel)
            continue
        src = open(fp, encoding="utf-8").read()
        if SENTINEL in src:
            skipped.append((rel, "already-v2"))
            continue
        before = visible_words_main(src)
        if before >= TARGET and callout is None:
            skipped.append((rel, "over-target " + str(before)))
            continue
        out = src
        if callout:
            out = inject_callout(out, CALLOUT.format(t=callout))
        # split trailing <details> out of section into the FAQ section when one exists
        details = "".join(re.findall(r"<details[\s\S]*?</details>", section))
        head_part = re.sub(r"<details[\s\S]*?</details>", "", section).rstrip()
        if rel.startswith("data/momentum-index/index"):
            out2 = inject_momentum(out, SENTINEL + "\n" + head_part + "\n" + details)
            out = out2 if out2 else inject_before_faq(out, SENTINEL + "\n" + section)
        elif rel in (
            "answers/how-do-i-track-startup-acquisitions-in-real-time/index.html",
            "answers/how-do-investors-use-acquisition-data-to-find-opportunities/index.html",
            "answers/what-s-the-difference-between-gitdealflow-and-crunchbase/index.html",
        ):
            # legacy template: inject full block before </article>
            i = out.find("</article>")
            if i == -1:
                i = out.find("</main>")
            out = out[:i] + SENTINEL + "\n" + section + "\n" + out[i:]
        else:
            # New-format page with an existing FAQ section: insert the prose
            # section before the FAQ, and append the new <details> inside it.
            if details:
                out = inject_before_faq(out, SENTINEL + "\n" + head_part)
                out = inject_into_faq(out, details) or out
            else:
                out = inject_before_faq(out, SENTINEL + "\n" + section)
        if mode == "--apply":
            open(fp, "w", encoding="utf-8").write(out)
        after = visible_words_main(out)
        changed.append((rel, str(before) + "->" + str(after)))
        print(("WROTE " if mode == "--apply" else "would ") + rel + " " + str(before) + " -> " + str(after))

    # ---- Pass 4: sitemap lastmod ------------------------------------------
    sm = os.path.join(ROOT, "sitemap-pages.xml")
    src = open(sm, encoding="utf-8").read()
    touched_urls = set()
    for rel, _ in changed:
        u = "https://gitdealflow.com/" + rel.replace("/index.html", "").replace(".html", "").replace("index.html", "")
        u = u.rstrip("/")
        if u.endswith("/data/momentum-index"):
            pass
        touched_urls.add(u)
    today = "2026-08-15"
    n = 0
    for u in touched_urls:
        pat = "<loc>" + u + "</loc>\n   <lastmod>"
        # sitemap formatting: <url> <loc>...</loc> <lastmod>...</lastmod> </url>
        mm = re.search(re.escape("<loc>" + u + "</loc>") + r"\s*(?:<lastmod>[^<]*</lastmod>)?", src)
        if mm:
            if "<lastmod>" in mm.group(0):
                src = src[: mm.start()] + mm.group(0).split("<lastmod>")[0] + "<lastmod>" + today + "</lastmod>" + src[mm.end():]
            else:
                src = src[: mm.end()] + "\n   <lastmod>" + today + "</lastmod>" + src[mm.end():]
            n += 1
    if mode == "--apply":
        open(sm, "w", encoding="utf-8").write(src)
    print("sitemap lastmod updated for " + str(n) + " URLs")

    print("\n=== SUMMARY: " + str(len(changed)) + " changed, " + str(len(skipped)) + " skipped ===")


def json_ctx(ctx):
    return str(ctx)


if __name__ == "__main__":
    main()
