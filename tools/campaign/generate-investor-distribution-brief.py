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


def render_signal_card(index: int, item: dict) -> str:
    name = escape_markdown(item.get("name", "Unknown startup"))
    stage = escape_markdown(item.get("stage", "Not stated"))
    geography = escape_markdown(item.get("geography", "Not stated"))
    velocity = escape_markdown(item.get("commitVelocityChange", "Not stated"))
    contributors = escape_markdown(item.get("contributors", "Not stated"))
    signal = escape_markdown(item.get("signalType", "Not stated"))
    source = item.get("githubUrl") or item.get("profileUrl") or API_URL
    return f"""### Signal {index}: {name}\n\n**Observed public change:** {signal}. 14-day commit velocity change: {velocity}. Contributors: {contributors}. Stage: {stage}. Geography: {geography}.\n\n**Investor read:** This is a public technical change to verify in normal diligence. It is not a funding prediction, investment recommendation, or evidence of revenue or company quality.\n\n**Verify next:** What changed that could explain this public engineering shift? Check the product release, hiring, customer pull, open-source adoption, and founder context.\n\n**Public source:** {source}\n"""


def sector_rows(payload: dict) -> list[dict]:
    rows = []
    for sector in payload.get("sectors", []):
        startups = sector.get("startups") or []
        if not startups:
            continue
        leader = startups[0]
        rows.append(
            {
                "sector": escape_markdown(sector.get("name", "Unknown sector")),
                "tracked": escape_markdown(sector.get("startupCount", len(startups))),
                "name": escape_markdown(leader.get("name", "Not stated")),
                "velocity": escape_markdown(leader.get("commitVelocityChange", "Not stated")),
                "commits": escape_markdown(leader.get("commitVelocity14d", "Not stated")),
                "contributors": escape_markdown(leader.get("contributors", "Not stated")),
                "signal": escape_markdown(leader.get("signalType", "Not stated")),
            }
        )
    return rows


def render_sector_table(rows: list[dict]) -> str:
    header = "| Sector | Tracked | This week's top public change | 14-day velocity | 14-day commits | Contributors | Signal |"
    divider = "|---|---:|---|---:|---:|---:|---|"
    values = [
        "| {sector} | {tracked} | {name} | {velocity} | {commits} | {contributors} | {signal} |".format(**row)
        for row in rows
    ]
    return "\n".join([header, divider, *values])


def render_x_thread(rows: list[dict]) -> str:
    chunk_size = 2
    chunk_count = (len(rows) + chunk_size - 1) // chunk_size
    total_posts = chunk_count + 2
    posts = [
        f"1/{total_posts} Weekly public GitHub sector table. Top observed change in each sector, not a funding prediction, investment recommendation, or proof of revenue.\n\nRead % alongside 14-day commits and contributors, tiny prior weeks can inflate it."
    ]
    for start in range(0, len(rows), chunk_size):
        chunk = rows[start : start + chunk_size]
        lines = [f"{start // chunk_size + 2}/{total_posts} Sector table, continued:"]
        lines.extend(
            "{sector}: {name}, {velocity}, {commits} commits/14d, {contributors} contributors, {signal}. {tracked} tracked.".format(**row)
            for row in chunk
        )
        posts.append("\n".join(lines))
    posts.append(
        f"{total_posts}/{total_posts} Source: https://signals.gitdealflow.com/api/signals.json\n\nUse this as a diligence queue: verify product releases, hiring, customer pull, open-source adoption, and founder context before acting."
    )
    return "\n\n".join(f"**Post {index}:**\n\n{text}" for index, text in enumerate(posts, start=1))


def render(today: datetime, payload: dict) -> str:
    raw_period = payload.get("meta", {}).get("period", "current weekly dataset")
    period = escape_markdown(raw_period.get("name", raw_period) if isinstance(raw_period, dict) else raw_period)
    top = payload["trending"]
    if not top:
        raise RuntimeError("signals API returned no trending startups")

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
    cards = "\n".join(render_signal_card(index, item) for index, item in enumerate(top, start=1))
    weekly_sector_rows = sector_rows(payload)
    weekly_sector_table = render_sector_table(weekly_sector_rows)
    x_thread = render_x_thread(weekly_sector_rows)

    return f"""# GitDealFlow investor distribution package\n\n**Generated:** {today.strftime('%Y-%m-%d %H:%M %Z')}  \n**Dataset period:** {period}  \n**Status:** prepared assets only, nothing was sent or posted.\n\n## Purpose\n\nOne weekly, source-backed package for angels, scouts, and seed investors. It is designed for a GitDealFlow company-page LinkedIn post, a newsletter editor contribution, and a VC community discussion.\n\nThe package is deliberately not a buy list, a funding prediction, or investment advice. It identifies public engineering changes worth verifying in normal diligence.\n\n## This week's public technical signals\n\n| Startup | Stage | Geography | 14-day commit velocity change | Contributors | Signal |\n|---|---|---|---:|---:|---|\n{chr(10).join(rows)}\n\nPrimary source: [GitDealFlow public signals API]({API_URL}).\n\n## This week's sector table\n\n{weekly_sector_table}\n\n**How to read it:** Each sector row names the first public change in its current ordered sector feed. Percentages alone can mislead when the prior 14-day window was small. Read the percentage alongside absolute 14-day commits and contributor count. This is not a funding prediction, investment recommendation, or evidence of revenue or company quality.\n\n## Investor-native diligence cards\n\n{cards}\n\n## 1. X asset\n\n**Publish state:** Draft. X remains a draft until explicitly approved.\n\n{x_thread}\n\n## 2. LinkedIn company page asset\n\n**Publish state:** Draft. The GitDealFlow company page needs explicit approval before posting. Do not use Maryan's personal LinkedIn profile.\n\n> **Three public GitHub signals for an investor's weekly diligence queue**\n>\n> This week's public GitHub data puts **{name}** at the top of GitDealFlow's tracked engineering changes: **{velocity}** 14-day commit velocity change, **{contributors}** contributors, and a **{signal}** signal.\n>\n> GitDealFlow tracks public GitHub activity across 350+ startups in 15 sectors. The point is not to predict a round. It is to spot a change early enough to ask better diligence questions.\n>\n> **This week's sector table**\n>\n> {weekly_sector_table}\n>\n> Read the percentage with the absolute 14-day commits and contributor count. Small prior windows can make a percentage look large. This is not a funding prediction, investment recommendation, or evidence of revenue or company quality.\n>\n> Data source: {API_URL}\n>\n> #VentureCapital #AngelInvesting #StartupDiligence\n\n## 2. Newsletter editor contribution\n\n**Use:** Offer as a short, no-sponsorship data note to a newsletter editor who has asked for contributions or accepts them publicly. Do not send unsolicited bulk outreach.\n\n**Subject:** Three public GitHub changes investors can verify this week\n\n> I prepared a short public-data note for investors. The lead item is **{name}**, where GitDealFlow recorded **{velocity}** 14-day commit velocity change and **{contributors}** contributors, tagged as **{signal}**.\n>\n> The useful angle is not a funding call. It is a repeatable diligence prompt: what changed in the product, team, or market that could explain the public engineering shift?\n>\n> The full three-item, source-linked note is here: {newsletter_link}\n>\n> You are welcome to cite the public API and methodology. No sponsorship is requested.\n\n## 3. VC community discussion seed\n\n**Use:** Post only where the community rules allow a disclosed, source-backed discussion. Open by stating GitDealFlow ownership. Keep the link in a follow-up comment if direct links are filtered.\n\n> I work on GitDealFlow, which tracks public GitHub engineering activity. This week's sharpest change is **{name}**: **{velocity}** 14-day commit velocity change, **{contributors}** contributors, and a **{signal}** signal.\n>\n> For angels and scouts: what would you check next before treating this as a serious sourcing lead? Customer pull, hiring, open-source adoption, founder activity, or something else?\n>\n> I am not calling this a funding prediction. It is one public signal to challenge with normal diligence. Source and the other two changes: {community_link}\n\n## Publishing rules\n\n1. Link to the public API or a specific public profile, never to a private dashboard.\n2. Say "public GitHub signal" and describe the exact observed field.\n3. Never claim this predicts funding, revenue, customer growth, or company quality.\n4. LinkedIn is company-page only, with explicit approval.\n5. Log any published URL, channel, date, and UTM in the channel board before measuring visits, replies, demos, or subscriptions.\n6. Stop a channel after four packages with no qualified visitor, reply, subscriber, demo, or revenue signal.\n\n## Evidence links\n\n- Featured profile: {profile}\n- Methodology: {SIGNALS_HOME}/methodology\n- Public signals API: {API_URL}\n- Investor landing page: {LANDING_HOME}/for/angel-investors\n"""


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
