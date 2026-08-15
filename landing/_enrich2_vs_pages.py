#!/usr/bin/env python3
"""
Second enrichment pass: add "Data Each Tool Tracks" and "Who Each Tool Is Best
For" sections (2 paragraphs each, competitor-specific) to push every /vs/ page
past 1,500 words with substantive, non-redundant detail. Idempotent.
"""
import os

BASE = os.path.expanduser("~/signals-gitdealflow/landing")

GDF_DATA = "GitDealFlow tracks five engineering signals per startup: 14-day commit-velocity change, contributor diversity measured as a Gini coefficient, repository expansion rate, deploy-frequency spikes, and infrastructure buildout. The composite is what the SSRN research panel showed precedes a Series A by 21-47 days, and every number derives from public GitHub activity, so any investor can reproduce the results from the open CC BY 4.0 dataset."

ENRICH2 = {
    "angellist": {
        "comp_data": "AngelList tracks a different layer entirely: who is raising, who is leading a syndicate, who is hiring, and what a company's self-reported profile says. It records the fundraising process itself (commitments, SPVs, rolling-fund subscriptions) rather than the engineering activity that precedes it. The data is social and transactional, not technical.",
        "gdf_who": "GitDealFlow is built for investors who want a timing edge: solo angels, venture scouts, micro funds, and family offices that source from data rather than warm introductions. If your constraint is finding quality deals before they become competitive, this is the tool for that job.",
        "comp_who": "AngelList is built for two audiences: accredited investors who want a low-friction way to deploy capital (backers and syndicate leads), and founders who want to raise or hire. If your constraint is the operational machinery of investing, this is the platform.",
    },
    "cb-insights": {
        "comp_data": "CB Insights tracks private-company financials, funding rounds, M&A, patents, news mentions, and analyst research, all scored through the Mosaic algorithm into growth and momentum signals. The data is curated by human analysts and updated on research cycles rather than a weekly schedule, which makes it deep but inherently periodic.",
        "gdf_who": "GitDealFlow is built for investors who need a steady, self-serve early signal: solo GPs, scouts, angels, and small funds. The Dashboard's 60+ weekly ranked startups, each with a one-line reason it is moving, are the deliverable.",
        "comp_who": "CB Insights is built for corporate strategy teams, large funds, and innovation groups that need market maps, competitive intelligence, and board-grade research. The price and the analyst depth are aimed squarely at institutional budgets.",
    },
    "dealroom": {
        "comp_data": "Dealroom tracks funding rounds, valuations, founder backgrounds and moves, job postings, and geography-level ecosystem metrics across more than a million companies, with its deepest coverage in Europe. It recently added a hosted MCP server so agents can query its live company, funding, and talent signals.",
        "gdf_who": "GitDealFlow is built for investors who want the early timing signal regardless of geography: the GitHub-based feed covers 15 sectors worldwide and updates every Monday, which suits a global or sector-driven mandate.",
        "comp_who": "Dealroom is built for EU-focused funds, corporates, and government ecosystem programs that need regional market maps, founder intelligence, and ecosystem reporting. Its European depth is the core of its value.",
    },
    "privateequitywire": {
        "comp_data": "Private Equity Wire tracks announced private-equity activity: deal announcements, fundraising closes, and key appointments across the US and Europe, produced by journalists. The data is editorial and covers only what is already public, so it is timely but never early.",
        "gdf_who": "GitDealFlow is built for early-stage and growth investors who want the pre-announcement signal: the weeks between a startup's engineering surge and its public round are exactly the window where proprietary deal flow is won.",
        "comp_who": "Private Equity Wire is built for LPs, allocators, fund-of-funds professionals, and deal teams who need to stay current on institutional private equity. It is a market-awareness tool, not a sourcing signal.",
    },
    "tracxn": {
        "comp_data": "Tracxn tracks company data, funding rounds, acquisitions, investor profiles, and sector taxonomies across 7.7M+ companies and 3,000+ sectors, backed by analyst-crafted reports, with its deepest coverage in emerging markets like India and Southeast Asia.",
        "gdf_who": "GitDealFlow is built for investors who want the objective weekly timing signal: the Monday leaderboard tells you which companies are shipping fastest right now, independent of what any analyst report said last quarter.",
        "comp_who": "Tracxn is built for investors and corporates who need broad sector discovery and company mapping, especially in emerging markets. Its taxonomy is the point; the forward-looking timing is not.",
    },
}


def inject(html, before_marker, block):
    marker = block.split("\n", 1)[0].strip()
    if marker in html:
        return html
    return html.replace(before_marker, block + "\n" + before_marker, 1)


for slug, e in ENRICH2.items():
    path = os.path.join(BASE, "vs", slug, "index.html")
    html = open(path, encoding="utf-8").read()

    data_block = (
        '        <h2>Data Each Tool Tracks</h2>\n'
        f'        <p>{GDF_DATA}</p>\n'
        f'        <p>{e["comp_data"]}</p>'
    )
    who_block = (
        '        <h2>Who Each Tool Is Best For</h2>\n'
        f'        <p>{e["gdf_who"]}</p>\n'
        f'        <p>{e["comp_who"]}</p>'
    )

    html = inject(html, '        <h2>What Each Tool Does Best</h2>', data_block)
    html = inject(html, '        <h2>How Investors Combine the Two</h2>', who_block)

    open(path, "w", encoding="utf-8").write(html)
    print("enriched2", slug)
