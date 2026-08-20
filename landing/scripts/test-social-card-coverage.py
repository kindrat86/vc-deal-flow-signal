#!/usr/bin/env python3
"""Regression check: each indexable apex page must expose a large social card."""
from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CARD_URL = "https://gitdealflow.com/assets/gitdealflow-social-card-1200x630.png"


def sitemap_pages():
    spec = importlib.util.spec_from_file_location("rebuild_sitemap", ROOT / "_rebuild_sitemap.py")
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module.discover_pages()


def value_for(html: str, name: str, attribute: str) -> str | None:
    for tag in re.findall(r'<meta\b[^>]*>', html, re.I):
        attrs = {
            key.lower(): value
            for key, _, value in re.findall(r'([\w:-]+)\s*=\s*(["\'])(.*?)\2', tag, re.S)
        }
        if attrs.get(attribute.lower(), "").lower() == name.lower():
            return attrs.get("content", "").strip() or None
    return None


def main() -> int:
    card_path = ROOT / "assets" / "gitdealflow-social-card-1200x630.png"
    failures: list[str] = []
    if not card_path.is_file():
        failures.append(f"missing card asset: {card_path.relative_to(ROOT)}")

    pages = sitemap_pages()
    for url, rel, _ in pages:
        html = (ROOT / rel).read_text(encoding="utf-8", errors="ignore")
        og = value_for(html, "og:image", "property")
        twitter = value_for(html, "twitter:image", "name")
        twitter_card = value_for(html, "twitter:card", "name")
        width = value_for(html, "og:image:width", "property")
        height = value_for(html, "og:image:height", "property")
        missing = []
        if not og:
            missing.append("og:image")
        if not twitter:
            missing.append("twitter:image")
        if twitter_card != "summary_large_image":
            missing.append("twitter:card=summary_large_image")
        if width != "1200" or height != "630":
            missing.append("og:image dimensions 1200x630")
        if missing:
            failures.append(f"{url or '/'} ({rel}): {', '.join(missing)}")

    if failures:
        print(f"FAIL: {len(failures)} social-card problems across {len(pages)} indexable pages")
        print("\n".join(failures[:30]))
        return 1
    print(f"PASS: {len(pages)} indexable pages expose 1200x630 OG and X card metadata")
    return 0


if __name__ == "__main__":
    sys.exit(main())
