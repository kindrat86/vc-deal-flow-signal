#!/usr/bin/env python3
"""Fail closed on an invalid GitDealFlow platform-session registry."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "distribution" / "platform-session-registry.json"


def fail(message: str) -> None:
    print(f"platform-session-registry FAILED: {message}")
    raise SystemExit(1)


def main() -> None:
    data = json.loads(REGISTRY.read_text())
    if data.get("schema_version") != 1:
        fail("unsupported schema_version")
    rules = data.get("rules")
    if not isinstance(rules, dict) or not all(rules.get(k) is True for k in (
        "one_owner_per_session",
        "public_write_requires_identity_check",
        "do_not_share_session_across_platforms",
        "stop_on_login_or_captcha_gate",
    )):
        fail("required safety rules are missing or disabled")

    sessions = data.get("sessions")
    if not isinstance(sessions, list) or not sessions:
        fail("sessions must be a non-empty list")

    ids: set[str] = set()
    platforms: set[str] = set()
    for session in sessions:
        for key in ("id", "browser", "isolation", "platform", "account", "identity_check"):
            if not isinstance(session.get(key), str) or not session[key].strip():
                fail(f"session missing {key}")
        if session["id"] in ids:
            fail(f"duplicate session id: {session['id']}")
        if session["platform"] in platforms:
            fail(f"duplicate platform owner: {session['platform']}")
        if not isinstance(session.get("allowed_actions"), list) or not isinstance(session.get("forbidden_actions"), list):
            fail(f"session actions invalid: {session['id']}")
        ids.add(session["id"])
        platforms.add(session["platform"])

    hn = next((x for x in sessions if x["platform"] == "Hacker News"), None)
    if not hn or hn["browser"] != "none" or "all writes" not in hn["forbidden_actions"]:
        fail("Hacker News must have no active automation session and all writes prohibited")

    print(f"platform-session-registry OK: {len(sessions)} uniquely owned platform sessions")


if __name__ == "__main__":
    main()
