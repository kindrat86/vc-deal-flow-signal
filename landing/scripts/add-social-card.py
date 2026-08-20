#!/usr/bin/env python3
"""Create the shared GitDealFlow social card and add fallback metadata to sitemap pages."""
from __future__ import annotations

import importlib.util
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
CARD_REL = "assets/gitdealflow-social-card-1200x630.png"
CARD_URL = f"https://gitdealflow.com/{CARD_REL}"


def load_pages():
    spec = importlib.util.spec_from_file_location("rebuild_sitemap", ROOT / "_rebuild_sitemap.py")
    if spec is None or spec.loader is None:
        raise RuntimeError("could not load sitemap inventory")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.discover_pages()


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
    return ImageFont.truetype(name, size)


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill: str, outline: str | None = None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def make_card() -> Path:
    target = ROOT / CARD_REL
    target.parent.mkdir(parents=True, exist_ok=True)
    image = Image.new("RGB", (1200, 630), "#101729")
    draw = ImageDraw.Draw(image)

    # Subtle grid gives a data-product feel without relying on a fake product UI.
    for x in range(0, 1201, 48):
        draw.line((x, 0, x, 630), fill="#17233a", width=1)
    for y in range(0, 631, 48):
        draw.line((0, y, 1200, y), fill="#17233a", width=1)

    # Brand mark and name.
    rounded(draw, (70, 58, 110, 98), 10, "#8057ed")
    draw.line((80, 84, 89, 75, 97, 81, 104, 68), fill="#ffffff", width=4, joint="curve")
    draw.text((126, 64), "GITDEALFLOW", font=font(30, True), fill="#eef2ff")

    rounded(draw, (70, 138, 278, 179), 20, "#102d31", outline="#39d7b0", width=1)
    draw.text((91, 147), "PUBLIC SIGNAL DATA", font=font(18, True), fill="#61e7c1")

    draw.text((70, 220), "Startup momentum", font=font(60, True), fill="#f8f9ff")
    draw.text((70, 288), "before the announcement", font=font(60, True), fill="#bca9ff")
    draw.text((70, 382), "Public GitHub activity, turned into a weekly", font=font(27), fill="#c2cade")
    draw.text((70, 420), "read on engineering acceleration.", font=font(27), fill="#c2cade")
    draw.text((70, 549), "gitdealflow.com", font=font(22, True), fill="#61e7c1")

    # Measured product facts only, kept large enough for small previews.
    panel = (750, 94, 1130, 540)
    rounded(draw, panel, 28, "#1a263b", outline="#3c5271", width=2)
    draw.text((790, 136), "WEEKLY SIGNAL READ", font=font(20, True), fill="#aab8cf")
    rounded(draw, (790, 184, 1067, 330), 26, "#8057ed")
    draw.text((818, 220), "350+", font=font(54, True), fill="#ffffff")
    draw.text((820, 286), "STARTUP ORGS", font=font(16, True), fill="#ede9ff")

    facts = [("15", "SECTORS"), ("OPEN", "DATA"), ("WEEKLY", "REFRESH")]
    for i, (value, label) in enumerate(facts):
        x = 790 + i * 104
        draw.text((x, 378), value, font=font(24, True), fill="#f8f9ff")
        draw.text((x, 414), label, font=font(13, True), fill="#aab8cf")

    image.save(target, "PNG", optimize=True)
    return target


def meta_tags(html: str):
    for tag in re.findall(r'<meta\b[^>]*>', html, re.I):
        attrs = {
            key.lower(): value
            for key, _, value in re.findall(r'([\w:-]+)\s*=\s*(["\'])(.*?)\2', tag, re.S)
        }
        yield tag, attrs


def has_meta(html: str, attribute: str, value: str) -> bool:
    return any(attrs.get(attribute.lower(), "").lower() == value.lower() for _, attrs in meta_tags(html))


def inject_missing_tags(html: str) -> tuple[str, int]:
    changes = 0
    # Existing compact Twitter cards should expand to the required large-card format.
    for tag, attrs in list(meta_tags(html)):
        if attrs.get("name", "").lower() == "twitter:card" and attrs.get("content", "").lower() != "summary_large_image":
            html = html.replace(tag, '<meta name="twitter:card" content="summary_large_image">', 1)
            changes += 1

    tags: list[str] = []
    if not has_meta(html, "property", "og:image"):
        tags.append(f'<meta property="og:image" content="{CARD_URL}">')
    if not has_meta(html, "property", "og:image:width"):
        tags.append('<meta property="og:image:width" content="1200">')
    if not has_meta(html, "property", "og:image:height"):
        tags.append('<meta property="og:image:height" content="630">')
    if not has_meta(html, "name", "twitter:card"):
        tags.append('<meta name="twitter:card" content="summary_large_image">')
    if not has_meta(html, "name", "twitter:image"):
        tags.append(f'<meta name="twitter:image" content="{CARD_URL}">')
    if not tags:
        return html, changes

    block = "\n" + "\n".join(tags) + "\n"
    head_end = re.search(r'</head\s*>', html, re.I)
    if head_end:
        return html[:head_end.start()] + block + html[head_end.start():], changes + len(tags)
    body_start = re.search(r'<body\b', html, re.I)
    if body_start:
        return html[:body_start.start()] + "<head>" + block + "</head>\n" + html[body_start.start():], changes + len(tags)
    raise ValueError("no insertion point")


def main() -> None:
    card = make_card()
    changed_pages = 0
    added_tags = 0
    for _, rel, _ in load_pages():
        path = ROOT / rel
        html = path.read_text(encoding="utf-8", errors="ignore")
        updated, count = inject_missing_tags(html)
        if count:
            path.write_text(updated, encoding="utf-8")
            changed_pages += 1
            added_tags += count
    print(f"generated {card.relative_to(ROOT)} (1200x630)")
    print(f"updated {changed_pages} pages with {added_tags} missing social meta tags")


if __name__ == "__main__":
    main()
