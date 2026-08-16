#!/usr/bin/env python3
"""
Sweep stale panel-size claims to the canonical wording across GitDealFlow
surfaces. Idempotent. Canonical block: pseo-site/lib/canonical-stats.ts.
Marketing form sanctioned today: "400+" (live panel 411, in-flight ~540).

Also repairs two factual defects found during the sweep:
  - "350+ public AND PRIVATE GitHub orgs" -> private repos are never read
    (methodology: public GitHub REST API only)
  - stale "Q2 2026 data" citation tokens -> current period Q3 2026

Run from repo root:  python3 pseo-site/scripts/sweep_claims.py
"""
import os
import re
import sys

PSEO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(PSEO)
NEW = "400+"

report = {"landing_files": 0, "landing_subs": 0, "pseo_files": 0, "pseo_subs": 0,
          "skipped": [], "unmatched": []}

# ── landing sweep ────────────────────────────────────────────────────────────
KEEP_EXACT = ("350+ clicks", "350+ MCP servers")

LANDING_RULES = [
    # (pattern, replacement, note)
    (re.compile(r"350\+\+"), NEW, "typo"),
    # factual fix: never private repos
    (re.compile(r"350\+ public and private GitHub orgs"), f"{NEW} public GitHub orgs", "private-fix"),
    # noun-after (EN)
    (re.compile(r"350\+(?= (?:venture-backed |tracked |ranked |trending |candidate |public |high-signal |"
                r"startup |startups |orgs |orgs' |organizations |GitHub |companies |venture-relevant ))"), NEW, "noun-after"),
    # noun-before panel forms
    (re.compile(r"350\+(?= (?:organization |company |startup |engineering-organisation |weekly )?panel)"), NEW, "panel"),
    (re.compile(r"the 350\+ organization weekly panel"), f"the {NEW} organization weekly panel", "panel2"),
    (re.compile(r"350\+ organisation"), f"{NEW} organisation", "org-uk"),
    (re.compile(r"350\+ organizaciones"), f"{NEW} organizaciones", "org-es"),
    (re.compile(r"350\+ Startup-Engineering-Organisationen"), f"{NEW} Startup-Engineering-Organisationen", "org-de"),
    (re.compile(r"350\+ Startup-Organisationen"), f"{NEW} Startup-Organisationen", "org-de2"),
    (re.compile(r"350\+ Startups"), f"{NEW} Startups", "de-startups"),
    (re.compile(r"350\+ companies"), f"{NEW} companies", "companies"),
    (re.compile(r"set of 350\+ by engineering momentum"), f"set of {NEW} by engineering momentum", "set"),
    (re.compile(r"focuses on 350\+ high-signal"), f"focuses on {NEW} high-signal", "focus"),
    (re.compile(r"tracking 350\+ companies"), f"tracking {NEW} companies", "tracking"),
    (re.compile(r"(?<![0-9])369(?![0-9])"), NEW, "stale-369"),
    # citation period token (stale since Q3 flip)
    (re.compile(r"gitdealflow\.com\), Q2 2026 data"), "gitdealflow.com), Q3 2026 data", "citation-period"),
    # dashboard size claim
    (re.compile(r"\b60\+ startups\b"), f"{NEW} startups", "dashboard-60"),
    (re.compile(r"\b60\+ ranked startups\b"), f"{NEW} ranked startups", "dashboard-60b"),
]


def sweep_landing():
    for dp, dn, fnames in os.walk(os.path.join(ROOT, "landing")):
        dn[:] = [d for d in dn if d not in ("node_modules",)]
        for fn in fnames:
            if not fn.endswith((".html", ".txt")):
                continue
            p = os.path.join(dp, fn)
            with open(p, encoding="utf-8", errors="ignore") as fh:
                txt = fh.read()
            orig = txt
            # protect keep-tokens
            for i, tok in enumerate(KEEP_EXACT):
                txt = txt.replace(tok, f"@@KEEP{i}@@")
            subs = 0
            for rx, repl, _note in LANDING_RULES:
                txt, n = rx.subn(repl, txt)
                subs += n
            # generic fallback: every remaining 350+ is a panel claim
            txt, n = re.subn(r"350\+", NEW, txt)
            subs += n
            # restore keep-tokens
            for i, tok in enumerate(KEEP_EXACT):
                txt = txt.replace(f"@@KEEP{i}@@", tok)
            if txt != orig:
                with open(p, "w", encoding="utf-8") as fh:
                    fh.write(txt)
                report["landing_files"] += 1
                report["landing_subs"] += subs
            # report leftovers for manual review
            for m in re.finditer(r".{40}350\+.{40}", txt):
                s = m.group(0)
                if not any(k in s for k in KEEP_EXACT):
                    report["unmatched"].append(f"{os.path.relpath(p, ROOT)}: ...{s.strip()[:90]}...")


# ── pseo TS sweep (exact strings) ───────────────────────────────────────────
PSEO_RULES = {
    "app/pricing/page.tsx": [
        ("140 startups ranked across 15 sectors", f"{NEW} startups ranked across 15 sectors"),
        ("140 ranked startups across 15 sectors", f"{NEW} ranked startups across 15 sectors"),
        ("and ranks 140 startups across 15 sectors", f"and ranks {NEW} startups across 15 sectors"),
        ("covering 140 startups across 15 sectors", f"covering {NEW} startups across 15 sectors"),
        ("140 venture-backed startups ranked by", f"{NEW} venture-backed startups ranked by"),
    ],
    "app/use-cases/page.tsx": [],
    "content/agent-queries.ts": [],
    "content/use-cases.ts": [
        ("filter 140 ranked startups", f"filter {NEW} ranked startups"),
        ("Dashboard ranks 50+ startups every Monday", f"Dashboard ranks {NEW} startups every Monday"),
    ],
    "components/PricingLadder.tsx": [
        ("Full Dashboard (140 startups, 15 sectors)", f"Full Dashboard ({NEW} startups, 15 sectors)"),
    ],
    "app/dashboard/page.tsx": [
        ("Browse and filter 60+ startups ranked", f"Browse and filter {NEW} startups ranked"),
    ],
    "content/posts.ts": [
        ('{ value: "350+", label: "Startup orgs tracked"', f'{{ value: "{NEW}", label: "Startup orgs tracked"'),
        ('{ value: "350+", label: "Startup GitHub orgs tracked weekly"', f'{{ value: "{NEW}", label: "Startup GitHub orgs tracked weekly"'),
        # stale hardcoded sector sizes (they move weekly): make them non-numeric
        ("from web3 (42 startups) to agtech (11)", "from the largest cluster (web3) to the smallest (agtech)"),
        ("Web3 is the largest at 42 startups and agtech the smallest at 11.",
         "Web3 is the largest cluster and agtech the smallest; sizes shift weekly as orgs are added."),
    ],
    "content/methodology-faqs.ts": [
        ("Canonical figures: 15 active sectors,\n * ~350+ tracked organizations",
         "Canonical figures: 15 active sectors,\n * 400+ tracked organizations (derived; see lib/canonical-stats.ts)"),
        ("for roughly 350+ startup organizations across 15 sectors",
         f"for roughly {NEW} startup organizations across 15 sectors"),
    ],
    "public/agents.md": [
        ("~350+ candidate startup GitHub orgs every Sunday", f"~{NEW} candidate startup GitHub orgs every Sunday"),
    ],
    "public/agents/huggingface-dataset-readme.md": [
        ("~350+ venture-backed startup organizations across 15 sectors",
         f"~{NEW} venture-backed startup organizations across 15 sectors"),
    ],
    "content/press-releases.ts": [
        ("The 2026 report covers 4,800 venture-backed GitHub organizations across 15 sector clusters",
         "The 2026 report covers 500+ cumulative venture-backed GitHub organizations tracked across 15 sector clusters"),
    ],
    "lib/for-framework-data.ts": [
        ("The corpus is 350+ venture-backed startups", f"The corpus is {NEW} venture-backed startups"),
    ],
    "app/state-of-github/page.tsx": [
        ("What 350+ GitHub orgs and 219 startup-period observations", f"What {NEW} GitHub orgs and 219 startup-period observations"),
        ("Across 350+ venture-backed startup GitHub organizations and 12 weekly observation windows",
         f"Across {NEW} venture-backed startup GitHub organizations and 12 weekly observation windows"),
    ],
}


def generic_pass(txt: str) -> tuple[str, int]:
    """Stale panel tokens valid on any pseo TS surface."""
    n = 0
    txt, k = re.subn(r"350\+\+", "400+", txt); n += k
    txt, k = re.subn(r"(?<![0-9])369(?![0-9])", "400+", txt); n += k
    txt, k = re.subn(r"\b140 (startups|ranked|venture-backed)", r"400+ \1", txt); n += k
    txt, k = re.subn(r"\b60\+ startups\b", "400+ startups", txt); n += k
    txt, k = re.subn(r"thousands of startups", "400+ startups", txt); n += k
    txt, k = re.subn(r"across 4,800 venture-backed GitHub organizations",
                     "across 500+ cumulative venture-backed GitHub organizations", txt); n += k
    txt, k = re.subn(r"52 weeks of 4,800 organizations",
                     "52 weeks across the cumulative org panel", txt); n += k
    txt, k = re.subn(r"4,800 venture-backed GitHub organizations across 15 sector clusters and 52 weekly",
                     "500+ cumulative venture-backed GitHub organizations across 15 sector clusters and 52 weekly", txt); n += k
    txt, k = re.subn(r"The 2026 report covers 4,800 venture-backed",
                     "The 2026 report covers 500+ cumulative venture-backed", txt); n += k
    txt, k = re.subn(r"~?350\+", "400+", txt); n += k
    return txt, n


def sweep_pseo():
    import pathlib
    # exact-string rules first
    for rel, rules in PSEO_RULES.items():
        p = os.path.join(PSEO, rel)
        if not os.path.exists(p):
            report["skipped"].append(rel)
            continue
        with open(p, encoding="utf-8") as fh:
            txt = fh.read()
        orig = txt
        subs = 0
        for old_s, new_s in rules:
            if old_s in txt:
                txt = txt.replace(old_s, new_s)
                subs += 1
        if txt != orig:
            with open(p, "w", encoding="utf-8") as fh:
                fh.write(txt)
            report["pseo_files"] += 1
            report["pseo_subs"] += subs
    # generic pass over EVERY ts/tsx surface (app, content, components, lib)
    for sub in ("app", "content", "components", "lib"):
        base = os.path.join(PSEO, sub)
        if not os.path.isdir(base):
            continue
        for f in pathlib.Path(base).rglob("*"):
            if f.suffix not in (".ts", ".tsx") or f.name.endswith(".d.ts"):
                continue
            if any(part in {"node_modules", ".next", ".turbo"} for part in f.parts):
                continue
            txt = f.read_text(encoding="utf-8", errors="ignore")
            txt2, subs = generic_pass(txt)
            if subs:
                f.write_text(txt2, encoding="utf-8")
                report["pseo_files"] += 1
                report["pseo_subs"] += subs


# ── repo-level READMEs / manifest / chrome ──────────────────────────────────
ROOT_RULES = {
    "README.md": [("Track 369 venture-backed startup GitHub organizations",
                   f"Track {NEW} venture-backed startup GitHub organizations")],
    "mcp-server/README.md": [
        ("for 369 GitHub orgs", f"for {NEW} GitHub orgs"),
        ("Tracks commit velocity, contributor growth, and repository expansion for 369 GitHub orgs",
         f"Tracks commit velocity, contributor growth, and repository expansion for {NEW} GitHub orgs"),
    ],
    "mcp-server/openai-app/manifest.json": [
        ("across 369 startup GitHub orgs in 15 sectors", f"across {NEW} startup GitHub orgs in 15 sectors"),
    ],
    "chrome-extension/PUBLISH.md": [
        ("across 369 startups in 15 sectors", f"across {NEW} startups in 15 sectors"),
    ],
    "chrome-extension/content.js": [
        ("Browse 350+ tracked startups", f"Browse {NEW} tracked startups"),
    ],
    "AGENTS.md": [("~400 startup GitHub orgs", f"~{NEW} startup GitHub orgs")],
}


def sweep_root():
    for rel, rules in ROOT_RULES.items():
        p = os.path.join(ROOT, rel)
        if not os.path.exists(p):
            report["skipped"].append(rel)
            continue
        with open(p, encoding="utf-8") as fh:
            txt = fh.read()
        orig = txt
        subs = 0
        for old, new in rules:
            if old in txt:
                txt = txt.replace(old, new)
                subs += 1
        if txt != orig:
            with open(p, "w", encoding="utf-8") as fh:
                fh.write(txt)
            report["pseo_files"] += 1
            report["pseo_subs"] += subs


if __name__ == "__main__":
    sweep_landing()
    sweep_pseo()
    sweep_root()
    print(f"landing: {report['landing_files']} files, {report['landing_subs']} rule substitutions")
    print(f"pseo/root: {report['pseo_files']} files, {report['pseo_subs']} substitutions")
    if report["skipped"]:
        print("skipped (absent):", ", ".join(report["skipped"]))
    if report["unmatched"]:
        print(f"\n{len(report['unmatched'])} leftover 350+ contexts (manual review):")
        for u in report["unmatched"][:40]:
            print("  ", u)
        sys.exit(2 if report["unmatched"] else 0)
