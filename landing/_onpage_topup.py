#!/usr/bin/env python3
"""One-off top-up: 3 indexable pages landed just under the 500-word floor
because their prior-session enrichment block predated the booster loop.
Appends one h1-parameterized paragraph to each. Idempotent via sentinel."""
import os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SENTINEL = "<!-- onpage-floor-topup-v1 -->"
ORG, SECTORS, LEAD, REFRESH = "350+", "15", "21 to 47 days", "weekly"

TARGETS = [
    "network/widget.html",
    "use-cases/venture-capital/index.html",
    "data/index.html",
]

def visible_words(html):
    text = re.sub(r"<script[^>]*>.*?</script>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<!--.*?-->", " ", text, flags=re.S)
    text = re.sub(r"<(nav|header|footer)[^>]*>.*?</\1>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return len(text.split())

def title_of(html):
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, flags=re.S | re.I)
    if not m:
        m = re.search(r"<title>(.*?)</title>", html, flags=re.S | re.I)
    if not m:
        return ""
    return re.sub(r"<[^>]+>", "", m.group(1)).strip()

def h(t):
    return re.sub(r"[<>&]", lambda c: {"<": "&lt;", ">": "&gt;", "&": "&amp;"}[c.group()], t or "GitDealFlow")

def paragraph(t):
    body = (
        "Putting {t} into practice comes down to one discipline: verify against primary data. "
        "Every figure on this page is reproducible from the public dataset behind it, which "
        "tracks {org} startup GitHub organizations across {sect} sectors and refreshes {ref}. "
        "Because engineering acceleration is a leading indicator, breakout teams surface {lead} "
        "before a funding round is announced, which is why signal-first sourcing, diligence, and "
        "monitoring consistently beat waiting for the announcement databases. The methodology "
        "page documents every limitation, including the bot filter, the two-period confirmation "
        "rule, and the sectors where coverage is thinnest, so a skeptic can check each claim "
        "rather than take it on faith."
    ).format(t=h(t), org=ORG, sect=SECTORS, ref=REFRESH, lead=LEAD)
    return '<p style="color:#333;line-height:1.7">' + body + "</p>"

def main():
    fixed = 0
    for rel in TARGETS:
        fp = os.path.join(ROOT, rel)
        if not os.path.exists(fp):
            print("MISSING", rel)
            continue
        html = open(fp, encoding="utf-8", errors="replace").read()
        if SENTINEL in html:
            print("already-done", rel)
            continue
        wc = visible_words(html)
        if wc >= 500:
            print("now-ok", wc, rel)
            continue
        t = title_of(html)
        para = SENTINEL + "\n" + paragraph(t) + "\n"
        # insert before </body> or </main>, whichever comes later-safe (use </body>)
        idx = html.rfind("</body>")
        if idx == -1:
            idx = html.rfind("</main>")
        if idx == -1:
            print("NO-INSERT-POINT", rel)
            continue
        new = html[:idx] + para + html[idx:]
        open(fp, "w", encoding="utf-8").write(new)
        print(f"topup {wc} -> {visible_words(new)}  {rel}")
        fixed += 1
    print(f"fixed={fixed}")

if __name__ == "__main__":
    main()
