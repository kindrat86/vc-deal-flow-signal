import importlib.util
from pathlib import Path
import unittest


TRACKER = Path(__file__).parents[1] / "monitoring" / "digest-engagement.py"


def load_tracker():
    spec = importlib.util.spec_from_file_location("digest_engagement", TRACKER)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class DigestEngagementHistoryTests(unittest.TestCase):
    def test_upsert_history_replaces_prior_measurement_for_same_issue(self):
        tracker = load_tracker()
        history = [{
            "ts": "2026-08-24T06:05:00+00:00",
            "date": "2026-08-23",
            "sent": 30,
            "opened": 0,
            "clicked": 0,
            "measured": True,
        }]
        fresh = {
            "sent": 30, "opened": 8, "clicked": 2, "delivered": 20,
            "bounced": 0, "suppressed": 0, "open_rate": 33.3,
            "click_rate": 6.7, "bounce_rate": 0.0, "measured": True,
        }

        result, changed = tracker.upsert_history(
            history, "2026-08-23", fresh, "2026-08-25T06:05:00+00:00"
        )

        self.assertTrue(changed)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["opened"], 8)
        self.assertEqual(result[0]["clicked"], 2)
        self.assertEqual(result[0]["ts"], "2026-08-25T06:05:00+00:00")

    def test_upsert_history_keeps_prior_row_when_measurement_has_not_changed(self):
        tracker = load_tracker()
        counts = {
            "sent": 30, "opened": 8, "clicked": 2, "delivered": 20,
            "bounced": 0, "suppressed": 0, "open_rate": 33.3,
            "click_rate": 6.7, "bounce_rate": 0.0, "measured": True,
        }
        history = [{"ts": "2026-08-25T06:05:00+00:00", "date": "2026-08-23", **counts}]

        result, changed = tracker.upsert_history(
            history, "2026-08-23", counts, "2026-08-26T06:05:00+00:00"
        )

        self.assertFalse(changed)
        self.assertEqual(result, history)


if __name__ == "__main__":
    unittest.main()
