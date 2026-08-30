from __future__ import annotations

import json
import subprocess
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHECKER = ROOT / "monitoring" / "check-refresh-freshness.py"
WRAPPER = ROOT / "monitoring" / "run-weekly-digest.sh"
FETCHER = ROOT / "pseo-site" / "scripts" / "fetch-github-data.ts"


class RefreshFreshnessTests(unittest.TestCase):
    def run_checker(self, payload: object | None) -> subprocess.CompletedProcess[str]:
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "github-refresh-metadata.json"
            if payload is not None:
                path.write_text(json.dumps(payload), encoding="utf-8")
            return subprocess.run(
                [
                    "/Users/sipi/.local/bin/python3.11",
                    str(CHECKER),
                    str(path),
                    "--max-age-days",
                    "8",
                ],
                text=True,
                capture_output=True,
                check=False,
            )

    @staticmethod
    def valid_payload(completed_at: str) -> dict[str, object]:
        sectors = [f"sector-{index}" for index in range(5)]
        return {
            "completed_at": completed_at,
            "sectors_processed": sectors,
            "sector_count": len(sectors),
        }

    def test_fresh_completion_marker_passes(self) -> None:
        completed_at = (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
        result = self.run_checker(self.valid_payload(completed_at))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("fresh=yes", result.stdout)

    def test_stale_completion_marker_fails_closed(self) -> None:
        completed_at = (datetime.now(timezone.utc) - timedelta(days=9)).isoformat()
        result = self.run_checker(self.valid_payload(completed_at))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("fresh=no", result.stderr)

    def test_completion_marker_requires_sector_manifest(self) -> None:
        completed_at = (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
        result = self.run_checker({"completed_at": completed_at})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("invalid", result.stderr.lower())

    def test_partial_sector_manifest_fails_closed(self) -> None:
        completed_at = (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
        result = self.run_checker(
            {
                "completed_at": completed_at,
                "sectors_processed": [f"sector-{index}" for index in range(4)],
                "sector_count": 4,
            }
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("incomplete", result.stderr.lower())

    def test_missing_completion_marker_fails_closed(self) -> None:
        result = self.run_checker(None)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("missing", result.stderr.lower())

    def test_malformed_completion_marker_fails_closed(self) -> None:
        result = self.run_checker({"completed_at": "not-a-date"})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("invalid", result.stderr.lower())

    def test_wrapper_enforces_freshness_before_live_sender(self) -> None:
        text = WRAPPER.read_text(encoding="utf-8")
        self.assertIn('GITHUB_REFRESH_TIMEOUT_SECONDS="${GITHUB_REFRESH_TIMEOUT_SECONDS:-1800}"', text)
        self.assertIn("--min-sector-count 5", text)
        check_pos = text.index("check-refresh-freshness.py")
        send_pos = text.index('node send-weekly-digest.mjs --date "$DATE_UTC" --send')
        self.assertLess(check_pos, send_pos)

    def test_fetcher_writes_completion_marker_after_dataset(self) -> None:
        text = FETCHER.read_text(encoding="utf-8")
        data_pos = text.index('fs.writeFileSync(dataPath')
        marker_pos = text.index('github-refresh-metadata.json')
        self.assertGreater(marker_pos, data_pos)
        self.assertIn("completed_at", text)


if __name__ == "__main__":
    unittest.main()
