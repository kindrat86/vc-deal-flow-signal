#!/usr/bin/env python3
"""Fail closed when the last completed GitHub refresh is stale."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("metadata", type=Path)
    parser.add_argument("--max-age-days", type=float, default=8.0)
    parser.add_argument("--min-sector-count", type=int, default=5)
    return parser.parse_args()


def fail(message: str) -> int:
    print(message, file=sys.stderr)
    return 2


def main() -> int:
    args = parse_args()
    if args.max_age_days <= 0 or args.min_sector_count <= 0:
        return fail("invalid freshness policy")
    if not args.metadata.is_file():
        return fail("refresh metadata missing")

    try:
        payload = json.loads(args.metadata.read_text(encoding="utf-8"))
        raw = payload["completed_at"]
        sectors_processed = payload["sectors_processed"]
        sector_count = payload["sector_count"]
        if not isinstance(raw, str):
            raise ValueError("completed_at is not a string")
        if isinstance(sector_count, bool) or not isinstance(sector_count, int) or sector_count <= 0:
            raise ValueError("sector_count is invalid")
        if (
            not isinstance(sectors_processed, list)
            or len(sectors_processed) != sector_count
            or any(not isinstance(slug, str) or not slug.strip() for slug in sectors_processed)
            or len(set(sectors_processed)) != sector_count
        ):
            raise ValueError("sectors_processed is invalid")
        if sector_count < args.min_sector_count:
            return fail(
                f"refresh metadata incomplete: sector_count={sector_count} "
                f"minimum={args.min_sector_count}"
            )
        completed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        if completed.tzinfo is None:
            raise ValueError("completed_at lacks timezone")
    except (OSError, json.JSONDecodeError, KeyError, TypeError, ValueError):
        return fail("refresh metadata invalid")

    age_seconds = (datetime.now(timezone.utc) - completed.astimezone(timezone.utc)).total_seconds()
    max_age_seconds = args.max_age_days * 86400
    if age_seconds < -300:
        return fail("refresh metadata invalid: timestamp is in the future")
    if age_seconds > max_age_seconds:
        return fail(f"fresh=no age_seconds={int(age_seconds)}")

    print(f"fresh=yes age_seconds={max(0, int(age_seconds))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
