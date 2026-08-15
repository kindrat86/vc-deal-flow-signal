#!/usr/bin/env python3
"""
Third pass: add a concrete "How to Switch (or Use Both) in 3 Steps" section with
an ordered list, competitor-specific, to push every /vs/ page past 1,500 words.
Idempotent (guarded by heading marker).
"""
import os

BASE = os.path.expanduser("~/signals-gitdealflow/landing")

SWITCH = {
    "angellist": {
        "intro": "Switching is the wrong frame here: AngelList and GitDealFlow are complementary, so the practical move is to layer GitDealFlow's signal in front of your existing AngelList workflow.",
        "steps": [
            "Sign up for the free Sunday digest and let it run for two weeks. Five names every Sunday, each with a sector, stage, and a plain-English reason it is moving, and no card required to start.",
            "For a name that matches your thesis, open the signals dashboard and check the momentum history, then search AngelList to see whether a syndicate lead you respect has already opened a deal. That tells you how early you are.",
            "When you are ready to act, deploy through an AngelList SPV or rolling fund exactly as you do today, but now you are arriving weeks before the crowd, with your own read to back the decision.",
        ],
    },
    "cb-insights": {
        "intro": "You probably will not switch away from CB Insights entirely; the realistic move is to add GitDealFlow as the top-of-funnel layer and keep CB Insights for the deep research.",
        "steps": [
            "Start with GitDealFlow's free digest and trending board for two weeks to confirm the engineering signal is useful for the categories you cover.",
            "For the names GitDealFlow surfaces, pull the funding history and market context from CB Insights to diligence them before outreach.",
            "When you commit to a category thesis, use CB Insights for the market map and GitDealFlow for the weekly momentum feed that tells you which specific companies to shortlist and when.",
        ],
    },
    "dealroom": {
        "intro": "Dealroom and GitDealFlow sit naturally side by side, so the practical move is to add the engineering signal to your existing ecosystem workflow.",
        "steps": [
            "Keep Dealroom as your ecosystem map and founder database, and let it keep answering the who-is-where question it is built for.",
            "Add GitDealFlow's free digest, then the Dashboard when you are ready, to get the weekly engineering-momentum ranking across your target sectors.",
            "Cross-reference the two: when a company appears in both your Dealroom region and your GitDealFlow momentum list, that is the name to reach out to first, because it is both well-positioned and accelerating.",
        ],
    },
    "privateequitywire": {
        "intro": "Private Equity Wire and GitDealFlow serve different stages, so the move is additive rather than a replacement.",
        "steps": [
            "Keep Private Equity Wire for market and deal news, and let it keep you current on fundraising closes and personnel moves.",
            "Add GitDealFlow's free digest to get the pre-announcement signal on software companies before they become news.",
            "When GitDealFlow flags a company and you move it into diligence, use Private Equity Wire for the surrounding market context that informs the deal memo.",
        ],
    },
    "tracxn": {
        "intro": "Tracxn and GitDealFlow are complementary, so the practical move is to layer the timing signal onto your existing sector-discovery workflow.",
        "steps": [
            "Keep Tracxn as your sector taxonomy and company-discovery layer, especially for emerging markets where its coverage is deepest.",
            "Add GitDealFlow's free digest, then the Dashboard when you are ready, to get the weekly engineering-momentum ranking inside the sectors you care about.",
            "When a company ranks high on GitDealFlow and also appears in your Tracxn sector list, that is your highest-conviction shortlist: the market says it exists, and the code says it is accelerating.",
        ],
    },
}


def inject(html, before_marker, block):
    marker = block.split("\n", 1)[0].strip()
    if marker in html:
        return html
    return html.replace(before_marker, block + "\n" + before_marker, 1)


for slug, e in SWITCH.items():
    path = os.path.join(BASE, "vs", slug, "index.html")
    html = open(path, encoding="utf-8").read()

    steps = "\n".join(f'            <li>{s}</li>' for s in e["steps"])
    block = (
        '        <h2>How to Switch (or Use Both) in 3 Steps</h2>\n'
        f'        <p>{e["intro"]}</p>\n'
        '        <ol style="padding-left:1.4rem;margin:1em 0">\n'
        f'{steps}\n'
        '        </ol>'
    )

    html = inject(html, '        <h2>Bottom Line</h2>', block)
    open(path, "w", encoding="utf-8").write(html)
    print("switched", slug)
