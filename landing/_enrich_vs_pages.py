#!/usr/bin/env python3
"""
Enrich the 5 generated /vs/ pages with three additional substantive sections
(What Each Tool Does Best, How Investors Combine the Two, Bottom Line) to push
each page past 1,500 words of genuinely useful comparison content.
Idempotent: each section is guarded against double-insertion by a marker comment.
"""
import os

BASE = os.path.expanduser("~/signals-gitdealflow/landing")

# Per-competitor enrichment. Each paragraph is 3-4 sentences of real substance.
ENRICH = {
    "angellist": {
        "bestof": [
            "AngelList does one thing better than anyone: it turns a lead investor's conviction into a fundable vehicle. Syndicates, rolling funds, and SPVs come with standardized legal documents, automated capital calls, and a built-in network of accredited backers, so a solo investor or emerging manager can deploy capital without hiring a fund administrator. Its Wellfound job marketplace is also the default place early-stage startups hire their first engineers. If you already know the deal you want, AngelList removes every operational obstacle to closing it.",
            "GitDealFlow does one thing better than anyone: it finds the deal before the fundraising process even starts. By reading public GitHub activity (commit velocity, contributor growth, and repository expansion) across 350+ startups every Monday, it surfaces breakout teams 21-47 days before a round is announced, with an open SSRN methodology any investor can audit and reproduce. If you want proprietary deal flow rather than access to deals everyone already sees, that is the difference.",
        ],
        "combine": "The highest-leverage workflow uses both tools in sequence rather than either alone. GitDealFlow's Monday digest surfaces five names that are accelerating on GitHub; you diligence the momentum signal, then watch AngelList to see whether a syndicate lead you respect has opened an SPV. When one has, you deploy through it. The signal tells you where to look before the market, and the platform lets you act the moment you are convinced.",
        "bottomline": "AngelList and GitDealFlow are not substitutes; they are sequential stages of the same pipeline. GitDealFlow gives you the early name, and AngelList gives you the vehicle to invest in it. An angel who uses GitDealFlow to source and AngelList to execute gets both the timing advantage and the operational convenience, for a total out-of-pocket cost that is still effectively zero until a deal actually returns.",
    },
    "cb-insights": {
        "bestof": [
            "CB Insights does analyst-grade market intelligence better than anyone in the category. Human researchers and the Mosaic scoring model produce market maps, patent landscapes, and competitive teardowns that hold up in a boardroom, and the research is deep enough to anchor a fund's investment thesis. For a corporate strategy team or a fund writing a thesis memo, that curated depth is worth its five-figure price tag.",
            "GitDealFlow does recency and objectivity better than anyone. A deterministic weekly batch over public GitHub reranks 350+ startups by velocity deviation from their own baseline, so the leaderboard reflects what shipped last week, not what an analyst published last quarter. There is no analyst cycle and no editorial delay: the code ships, and the signal updates. For deal sourcing, that timing is the product.",
        ],
        "combine": "Corporate investors typically run the two side by side rather than choosing between them. CB Insights provides the market map and competitive context that justify a category bet in the first place; GitDealFlow provides the weekly engineering-momentum feed that tells you which specific companies inside that category are accelerating right now. The map comes from research, the timing comes from code, and the two datasets barely overlap.",
        "bottomline": "Choose CB Insights when the deliverable is a market map or a board deck; choose GitDealFlow when the deliverable is a shortlist of names before they are on anyone's radar. Corporate VCs and funds that need both use CB Insights for the map and GitDealFlow for the timing, and at roughly a hundredth of the price, GitDealFlow is the entry point most individual investors actually reach for first.",
    },
    "dealroom": {
        "bestof": [
            "Dealroom does ecosystem completeness better than anyone, especially in Europe. Funding rounds, founder moves, hiring signals, and geography-level market maps make it the source of record for investors, corporates, and governments mapping a region. If your question is what is happening across an entire startup ecosystem, Dealroom answers it with a depth that is hard to match.",
            "GitDealFlow does the leading indicator better than anyone. Public GitHub commit velocity, contributor growth, and repository expansion flag breakout teams 21-47 days before a round, with an open SSRN methodology that any investor can reproduce from the CC BY 4.0 dataset. If your question is which specific company is about to accelerate, GitDealFlow answers it weeks early, on objective evidence.",
        ],
        "combine": "The two tools answer different questions about the same startups, which is why funds that cover Europe often run both. Dealroom maps the region: who the founders are, what has been raised, who is hiring, and which geographies are heating up. GitDealFlow reads the code: which of those companies are committing fastest right now. The ecosystem map tells you where to concentrate, and the signal tells you which name to act on first.",
        "bottomline": "Dealroom and GitDealFlow are complementary layers rather than competitors: Dealroom maps the ecosystem, and GitDealFlow reads the code inside it. A fund covering Europe gets the regional map from Dealroom and the forward-looking momentum from GitDealFlow, and the pair covers the full sourcing-to-diligence workflow at a fraction of what a single all-in-one platform would cost.",
    },
    "privateequitywire": {
        "bestof": [
            "Private Equity Wire does institutional PE news better than a generic database: timely deal announcements, fundraising closes, and personnel moves across the US and Europe, written for LPs, allocators, and deal professionals. If you need to stay current on a market and read about deals shortly after they are announced, it is a clean, focused read.",
            "GitDealFlow does the pre-announcement signal better than any news product, for one structural reason: it does not wait for the announcement. Weekly GitHub analysis flags software companies that are accelerating 21-47 days before a round, so you can act while the deal is still being prepared rather than after it has been written up.",
        ],
        "combine": "The two serve different moments in the same workflow. GitDealFlow is the early-stage radar: it surfaces software companies building aggressively before any press release. Private Equity Wire is the market context layer: once a target is in diligence, its coverage tells you what is happening across the surrounding market, who is raising, and who is moving. The signal starts the process; the news informs the diligence.",
        "bottomline": "Private Equity Wire tells you what already happened in private equity; GitDealFlow tells you which software companies are about to make news. A sourcing-focused investor uses GitDealFlow for the early signal and keeps a Private Equity Wire subscription for market context during diligence. They solve different problems, and most serious investors end up wanting both.",
    },
    "tracxn": {
        "bestof": [
            "Tracxn does sector taxonomy better than anyone, especially in emerging markets. Millions of companies organized into thousands of sectors and business models, with analyst reports behind them, make it a strong discovery tool for India, Southeast Asia, and other regions where Western databases are thin. If your question is what exists in this sector, Tracxn answers it with real breadth.",
            "GitDealFlow does timing better than any taxonomy, because a taxonomy cannot tell you what is about to happen. Weekly GitHub analysis flags the companies inside a sector that are accelerating right now, 21-47 days before a round, with an open SSRN methodology and a CC BY 4.0 dataset any investor can audit. A taxonomy classifies the past; GitDealFlow reads the present.",
        ],
        "combine": "Emerging-market investors get the most from using the two together. Tracxn gives you the sector landscape and the company list in a target geography; GitDealFlow gives you the engineering-momentum read that tells you which of those companies are shipping fastest. You map the market with one, and time the entry with the other.",
        "bottomline": "Tracxn organizes the market into sectors; GitDealFlow tells you which companies inside a sector are accelerating. Emerging-market investors get the landscape from Tracxn and the timing from GitDealFlow, and the pair covers both discovery and the early signal. If you only need one, the free tiers of both are enough to test the fit.",
    },
}


def inject(html, before_marker, block):
    if block.lstrip().startswith("<!--"):
        marker = block.split("\n", 1)[0].strip()
    else:
        marker = block.strip()[:40]
    # guard against double-insertion
    if marker in html:
        return html
    return html.replace(before_marker, block + "\n" + before_marker, 1)


for slug, e in ENRICH.items():
    path = os.path.join(BASE, "vs", slug, "index.html")
    html = open(path, encoding="utf-8").read()

    bestof_block = (
        '        <h2>What Each Tool Does Best</h2>\n'
        + "\n".join(f'        <p>{p}</p>' for p in e["bestof"])
    )
    combine_block = (
        '        <h2>How Investors Combine the Two</h2>\n'
        f'        <p>{e["combine"]}</p>'
    )
    bottomline_block = (
        '        <h2>Bottom Line</h2>\n'
        f'        <p>{e["bottomline"]}</p>'
    )

    # Insert before Key Differences, and before the CTA (bottom line last)
    html = inject(html, '        <h2>Key Differences</h2>', bestof_block)
    html = inject(html, '        <h2>Key Differences</h2>', combine_block)
    html = inject(html, f'        <p><a href="https://gitdealflow.com/#signup"', bottomline_block)

    open(path, "w", encoding="utf-8").write(html)
    print("enriched", slug)
