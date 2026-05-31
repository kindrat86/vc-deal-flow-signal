#!/usr/bin/env python3
"""
scan-evan-fit.py — Standing thesis filter for Evan Buhler (Talok Capital).

Reverse-engineered thesis (see thesis-reverse-engineering.md):
  Early (pre-seed/seed) APPLICATION-LAYER ai / embedded fintech / future-of-work /
  creator tools / neurotech. NOT dev-tools, NOT bot-inflated momentum.

Re-run weekly. It prints ONLY companies that trip Evan's lane.
If it prints nothing, there is nothing worth pinging him about — that is the point.

Usage:  python3 marketing/evan-buhler-2026-05-29/scan-evan-fit.py
"""
import json, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA = os.path.join(ROOT, "pseo-site", "data", "startups.json")

EARLY = {"Pre-seed", "Seed"}

# Sectors that are core to Evan's lane vs. excluded
LANE_SECTORS = {
    "AI & Machine Learning", "Fintech", "HR Tech", "Legal Tech",
    "Healthcare", "EdTech", "Social & Community",
}
EXCLUDE_SECTORS = {"Developer Tools", "Data Infrastructure", "Cybersecurity"}

# app-layer / thesis keywords
LANE_KW = [
    "assistant", "copilot", "agent", "consumer", "patient", "therapy", "neuro",
    "brain", "bci", "payment", "lending", "credit", "invoice", "embedded finance",
    "creator", "content", "hiring", "recruit", "career", "tutor", "student",
    "legal", "contract", "wellness", "mental",
]
# dev-tools / infra / non-venture red flags (auto-reject).
# Includes OSS / nonprofit markers: Evan writes angel checks into venture-backable
# startups, not open-source projects or community LMS/CMS.
DEV_KW = [
    "library", "framework", "sdk", "compiler", "kubernetes", "devops", "cli",
    "self-hosted", "open-source platform", "open source platform", "api that puts developers",
    "developers first", "building blocks", "engine", "protocol", "masternode",
    "open source", "open-source", "opensource", "make development", "packages",
    "learning management system", "lms", "cms", "networking applications",
]


def is_dead(s):
    """Dying or near-zero repos are not live signals."""
    try:
        v = int(s.get("commitVelocity14d") or 0)
    except (TypeError, ValueError):
        v = 0
    ch = (s.get("commitVelocityChange") or "").replace("%", "").replace("+", "")
    try:
        chv = int(ch)
    except ValueError:
        chv = 0
    return v < 10 or chv <= -85


def is_bot_inflated(s):
    """High velocity with tiny contributor count => likely automated commits, not real eng."""
    try:
        v = int(s.get("commitVelocity14d") or 0)
        c = int(s.get("contributors") or 0)
    except (TypeError, ValueError):
        return False
    return v > 800 and c <= 4


def main():
    d = json.load(open(DATA))
    current = next((p["slug"] for p in d["periods"] if p.get("current")), None)
    if not current:
        current = d["periods"][0]["slug"]

    seen = {}
    for sec in d["sectors"]:
        for s in sec["periods"].get(current, {}).get("startups", []):
            entry = seen.setdefault(s["name"], {"sectors": set(), "rec": s})
            entry["sectors"].add(sec["name"])

    hits = []
    for name, v in seen.items():
        s, secs = v["rec"], v["sectors"]
        desc = (s.get("description") or "").lower()
        stage = s.get("stage", "")

        if stage not in EARLY:
            continue
        if secs & EXCLUDE_SECTORS and not (secs & LANE_SECTORS):
            continue
        if any(t in desc for t in DEV_KW):
            continue
        if is_bot_inflated(s):
            continue
        if is_dead(s):
            continue
        if not desc.strip():  # no description => can't assess thesis fit, skip
            continue

        in_lane = bool(secs & LANE_SECTORS) or any(t in desc for t in LANE_KW)
        if not in_lane:
            continue
        hits.append((name, sorted(secs), s))

    print(f"== Evan-fit scan | period {current} | {len(seen)} startups screened ==\n")
    if not hits:
        print("No companies clear Evan's thesis this period. Do NOT ping him.")
        return
    for name, secs, s in hits:
        print(f"[{s.get('stage')}] {name}  {secs}  ({s.get('geography','?')})")
        print(f"    {s.get('description','')}")
        print(f"    v14d={s.get('commitVelocity14d')} ch={s.get('commitVelocityChange')} "
              f"contrib={s.get('contributors')} | {s.get('websiteUrl','')}\n")


if __name__ == "__main__":
    sys.exit(main())
