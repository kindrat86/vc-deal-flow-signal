#!/usr/bin/env python3
"""Create a truthful weekly GitDealFlow package for investor-facing channels.

This script prepares assets only. It never sends email, posts to LinkedIn,
or submits to a community. The LinkedIn asset is company-page only and needs
explicit approval before publishing.
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

API_URL = "https://signals.gitdealflow.com/api/signals.json"
SIGNALS_HOME = "https://signals.gitdealflow.com"
LANDING_HOME = "https://gitdealflow.com"


def fetch_signals() -> dict:
    request = Request(API_URL, headers={"User-Agent": "GitDealFlow investor brief/1.0"})
    with urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"signals API returned HTTP {response.status}")
        payload = json.load(response)
    if not isinstance(payload, dict) or not isinstance(payload.get("trending"), list):
        raise RuntimeError("signals API payload is missing a trending list")
    return payload


def tracked_url(source: str, content: str) -> str:
    query = urlencode(
        {
            "utm_source": source,
            "utm_medium": "earned-community",
            "utm_campaign": "gdf-investor-brief",
            "utm_content": content,
        }
    )
    return f"{LANDING_HOME}/for/angel-investors?{query}"


def escape_markdown(value: object) -> str:
    return str(value).replace("|", "\\|").replace("\n", " ").strip()


def render(today: datetime, payload: dict) -> str:
    period = escape_markdown(payload.get("meta", {}).get("period", "current weekly dataset"))
    top = payload["trending"][:3]
    if len(top) < 3:
        raise RuntimeError("signals API returned fewer than three trending startups")

    rows = []
    for item in top:
        rows.append(
            "| {name} | {stage} | {geography} | {velocity} | {contributors} | {signal} |".format(
                name=escape_markdown(item.get("name", "Unknown")),
                stage=escape_markdown(item.get("stage", "Not stated")),
                geography=escape_markdown(item.get("geography", "Not stated")),
                velocity=escape_markdown(item.get("commitVelocityChange", "Not stated")),
                contributors=escape_markdown(item.get("contributors", "Not stated")),
                signal=escape_markdown(item.get("signalType", "Not stated")),
            )
        )

    featured = top[0]
    name = escape_markdown(featured.get("name", "the leading startup"))
    signal = escape_markdown(featured.get("signalType", "an engineering change"))
    velocity = escape_markdown(featured.get("commitVelocityChange", "a change"))
    contributors = escape_markdown(featured.get("contributors", "a reported contributor count"))
    sector = escape_markdown(featured.get("sector", "the tracked dataset"))
    profile = featured.get("profileUrl") or SIGNALS_HOME
    company_link = tracked_url("linkedin", "company-page")
    newsletter_link = tracked_url("newsletter", "editorial-brief")
    community_link = tracked_url("vc-community", "discussion-post")

    return f"""# GitDealFlow investor distribution package\n\n**Generated:** {today.strftime('%Y-%m-%d %H:%M %Z')}  \n**Dataset period:** {period}  \n**Status:** prepared assets only, nothing was sent or posted.\n\n## Purpose\n\nOne weekly, source-backed package for angels, scouts, and seed investors. It is designed for a GitDealFlow company-page LinkedIn post, a newsletter editor contribution, and a VC community discussion.\n\nThe package is deliberately not a buy list, a funding prediction, or investment advice. It identifies public engineering changes worth verifying in normal diligence.\n\n## This week's three signals\n\n| Startup | Stage | Geography | 14-day commit velocity change | Contributors | Signal |\n|---|---|---|---:|---:|---|\n{chr(10).join(rows)}\n\nPrimary source: [GitDealFlow public signals API]({API_URL}).\n\n## 1. LinkedIn company page asset\n\n**Publish state:** Draft. The GitDealFlow company page needs explicit approval before posting. Do not use Maryan's personal LinkedIn profile.\n\n> **Three public GitHub signals for an investor's weekly diligence queue**\n>\n> This week's public GitHub data puts **{name}** at the top of GitDealFlow's tracked engineering changes: **{velocity}** 14-day commit velocity change, **{contributors}** contributors, and a **{signal}** signal.\n>\n> GitDealFlow tracks public GitHub activity across 350+ startups in 15 sectors. The point is not to predict a round. It is to spot a change early enough to ask better diligence questions.\n>\n> Two other teams also stood out this week. The full, source-linked list is here: {company_link}\n>\n> Data source: {API_URL}\n>\n> #VentureCapital #AngelInvesting #StartupDiligence\n\n## 2. Newsletter editor contribution\n\n**Use:** Offer as a short, no-sponsorship data note to a newsletter editor who has asked for contributions or accepts them publicly. Do not send unsolicited bulk outreach.\n\n**Subject:** Three public GitHub changes investors can verify this week\n\n> I prepared a short public-data note for investors. The lead item is **{name}**, where GitDealFlow recorded **{velocity}** 14-day commit velocity change and **{contributors}** contributors, tagged as **{signal}**.\n>\n> The useful angle is not a funding call. It is a repeatable diligence prompt: what changed in the product, team, or market that could explain the public engineering shift?\n>\n> The full three-item, source-linked note is here: {newsletter_link}\n>\n> You are welcome to cite the public API and methodology. No sponsorship is requested.\n\n## 3. VC community discussion seed\n\n**Use:** Post only where the community rules allow a disclosed, source-backed discussion. Open by stating GitDealFlow ownership. Keep the link in a follow-up comment if direct links are filtered.\n\n> I work on GitDealFlow, which tracks public GitHub engineering activity. This week's sharpest change is **{name}**: **{velocity}** 14-day commit velocity change, **{contributors}** contributors, and a **{signal}** signal.\n>\n> For angels and scouts: what would you check next before treating this as a serious sourcing lead? Customer pull, hiring, open-source adoption, founder activity, or something else?\n>\n> I am not calling this a funding prediction. It is one public signal to challenge with normal diligence. Source and the other two changes: {community_link}\n\n## Publishing rules\n\n1. Link to the public API or a specific public profile, never to a private dashboard.\n2. Say "public GitHub signal" and describe the exact observed field.\n3. Never claim this predicts funding, revenue, customer growth, or company quality.\n4. LinkedIn is company-page only, with explicit approval.\n5. Log any published URL, channel, date, and UTM in the channel board before measuring visits, replies, demos, or subscriptions.\n6. Stop a channel after four packages with no qualified visitor, reply, subscriber, demo, or revenue signal.\n\n## Evidence links\n\n- Featured profile: {profile}\n- Methodology: {SIGNALS_HOME}/methodology\n- Public signals API: {API_URL}\n- Investor landing page: {LANDING_HOME}/for/angel-investors\n"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    now = datetime.now(ZoneInfo("Europe/Athens"))
    packet = render(now, fetch_signals())
    args.output_dir.mkdir(parents=True, exist_ok=True)
    dated = args.output_dir / f"{now:%Y-%m-%d}-investor-distribution-package.md"
    latest = args.output_dir / "latest.md"
    dated.write_text(packet, encoding="utf-8")
    latest.write_text(packet, encoding="utf-8")
    print(dated)


if __name__ == "__main__":
    main()
