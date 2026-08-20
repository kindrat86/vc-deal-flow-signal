from __future__ import annotations

import importlib.util
import unittest
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

SCRIPT = Path(__file__).with_name("generate-investor-distribution-brief.py")
spec = importlib.util.spec_from_file_location("investor_distribution_brief", SCRIPT)
assert spec and spec.loader
brief = importlib.util.module_from_spec(spec)
spec.loader.exec_module(brief)


class InvestorDistributionBriefTests(unittest.TestCase):
    def test_render_creates_a_diligence_card_for_every_available_signal(self) -> None:
        payload = {
            "meta": {"period": {"name": "Q3 2026"}},
            "trending": [
                {
                    "name": "Northstar",
                    "stage": "Seed",
                    "geography": "EU",
                    "commitVelocityChange": "+120%",
                    "contributors": 8,
                    "signalType": "Infrastructure buildout",
                    "githubUrl": "https://github.com/northstar",
                },
                {
                    "name": "Harbor",
                    "stage": "Pre-seed",
                    "geography": "US",
                    "commitVelocityChange": "+80%",
                    "contributors": 5,
                    "signalType": "Deploy frequency spike",
                    "githubUrl": "https://github.com/harbor",
                },
                {
                    "name": "Cedar",
                    "stage": "Seed",
                    "geography": "UK",
                    "commitVelocityChange": "+55%",
                    "contributors": 4,
                    "signalType": "Engineering hiring burst",
                    "githubUrl": "https://github.com/cedar",
                },
                {
                    "name": "Solace",
                    "stage": "Pre-seed",
                    "geography": "APAC",
                    "commitVelocityChange": "+42%",
                    "contributors": 3,
                    "signalType": "Contributor growth",
                    "githubUrl": "https://github.com/solace",
                },
            ],
        }

        rendered = brief.render(datetime(2026, 8, 20, 9, 10, tzinfo=ZoneInfo("Europe/Athens")), payload)

        self.assertIn("## Investor-native diligence cards", rendered)
        self.assertEqual(rendered.count("### Signal "), 4)
        for name in ("Northstar", "Harbor", "Cedar", "Solace"):
            self.assertIn(f"### Signal", rendered)
            self.assertIn(name, rendered)
        self.assertIn("https://github.com/solace", rendered)
        self.assertIn("What changed that could explain this public engineering shift?", rendered)

    def test_render_includes_a_copy_ready_sector_table_for_both_social_channels(self) -> None:
        payload = {
            "meta": {"period": {"name": "Q3 2026"}},
            "trending": [
                {
                    "name": "Northstar",
                    "stage": "Seed",
                    "geography": "EU",
                    "commitVelocityChange": "+120%",
                    "contributors": 8,
                    "signalType": "Infrastructure buildout",
                    "githubUrl": "https://github.com/northstar",
                }
            ],
            "sectors": [
                {
                    "name": "Healthcare",
                    "startupCount": 26,
                    "startups": [
                        {
                            "name": "Northstar",
                            "commitVelocityChange": "+120%",
                            "commitVelocity14d": 12,
                            "contributors": 8,
                            "signalType": "Infrastructure buildout",
                        }
                    ],
                },
                {
                    "name": "Developer Tools",
                    "startupCount": 12,
                    "startups": [
                        {
                            "name": "Forge",
                            "commitVelocityChange": "+80%",
                            "contributors": 5,
                            "signalType": "Deploy frequency spike",
                        }
                    ],
                },
            ],
        }

        rendered = brief.render(datetime(2026, 8, 20, 9, 10, tzinfo=ZoneInfo("Europe/Athens")), payload)

        expected_row = "| Healthcare | 26 | Northstar | +120% | 12 | 8 | Infrastructure buildout |"
        self.assertIn("## This week's sector table", rendered)
        self.assertIn(expected_row, rendered)
        self.assertIn("## 1. X asset", rendered)
        self.assertIn("## 2. LinkedIn company page asset", rendered)
        self.assertGreaterEqual(rendered.count(expected_row), 2)
        self.assertIn("not a funding prediction, investment recommendation, or evidence of revenue", rendered)


if __name__ == "__main__":
    unittest.main()
