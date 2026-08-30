#!/usr/bin/env python3
"""Retired GitDealFlow sender.

This legacy sender used a separate sequence, local recipient files, raw-address
logs, and its own tracking state. Running it could bypass the canonical shared
send gate and duplicate the active lifecycle.

GitDealFlow lifecycle mail is owned by:
  - Vercel native routes for quiz-aware daily/deferred delivery
  - the gated Hermes engine for explicitly approved site-scoped lifecycle work

The original implementation remains recoverable from git history before the
retirement commit.
"""

import sys


def main() -> int:
    print(
        "RETIRED: scripts/send-soap-opera.py is disabled. "
        "Use the gated GitDealFlow lifecycle senders."
    )
    return 64


if __name__ == "__main__":
    raise SystemExit(main())
