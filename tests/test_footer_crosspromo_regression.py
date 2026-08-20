#!/usr/bin/env python3
"""Regression guard for the GitDealFlow portfolio footer contract."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITES = {
    "gitdealflow.com": ROOT / "landing" / "index.html",
    "signals.gitdealflow.com": ROOT / "pseo-site" / "components" / "Footer.tsx",
}


def footer_block(source: str) -> str:
    marker = 'data-portfolio-cross-promo="v1"'
    start = source.find(marker)
    assert start >= 0, "footer cross-promo marker is missing"
    nav_start = source.rfind("<nav", 0, start)
    end = source.find("</nav>", start)
    assert nav_start >= 0 and end >= 0, "cross-promo marker must live in a nav block"
    return source[nav_start : end + len("</nav>")]


def test_each_gdf_homepage_footer_has_nine_measured_sibling_links() -> None:
    expected = {
        "gitdealflow.com": {
            "signals.gitdealflow.com",
            "sipiteno.com",
            "invisibleexit.com",
            "unlocksaas.com",
            "voicelogpro.com",
            "carshake.online",
            "churnlens.site",
            "sanctionsai.dev",
            "sipi.bot",
        },
        "signals.gitdealflow.com": {
            "gitdealflow.com",
            "sipiteno.com",
            "invisibleexit.com",
            "unlocksaas.com",
            "voicelogpro.com",
            "carshake.online",
            "churnlens.site",
            "sanctionsai.dev",
            "sipi.bot",
        },
    }

    for origin, path in SITES.items():
        source = path.read_text(encoding="utf-8")
        assert source.count('data-portfolio-cross-promo="v1"') == 1
        block = footer_block(source)
        links = re.findall(r'https://([^/?"\s]+)/(?:\?([^"\s]+))?', block)
        assert len(links) == 9
        targets = {host for host, _ in links}
        assert targets == expected[origin]
        for _, query in links:
            assert f"utm_source={origin}" in query
            assert "utm_medium=referral" in query
            assert "utm_campaign=portfolio_crosspromo" in query
            assert "utm_content=footer" in query
