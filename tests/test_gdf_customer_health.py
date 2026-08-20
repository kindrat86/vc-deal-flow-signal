#!/usr/bin/env python3
import importlib.util
import pathlib
import unittest
from datetime import datetime, timedelta, timezone

SCRIPT = pathlib.Path("/Users/sipi/.hermes/scripts/gdf-engagement-watch.py")
spec = importlib.util.spec_from_file_location("gdf_engagement_watch", SCRIPT)
assert spec is not None and spec.loader is not None
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class CustomerHealthRulesTest(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 8, 19, tzinfo=timezone.utc)

    def test_new_buyer_without_dashboard_activity_needs_setup_help(self):
        result = module.evaluate_customer_health(
            purchased_at=self.now - timedelta(hours=25),
            last_meaningful_activity=None,
            last_billing_portal_at=None,
            support_requested_at=None,
            tier="dashboard",
            now=self.now,
        )
        self.assertEqual(result["action"], "send_setup_help")
        self.assertEqual(result["reason"], "no_dashboard_activity_after_24h")

    def test_insider_silent_for_21_days_needs_personal_follow_up(self):
        result = module.evaluate_customer_health(
            purchased_at=self.now - timedelta(days=40),
            last_meaningful_activity=self.now - timedelta(days=22),
            last_billing_portal_at=None,
            support_requested_at=None,
            tier="insider",
            now=self.now,
        )
        self.assertEqual(result["action"], "alert_founder")
        self.assertEqual(result["reason"], "insider_inactive_21d")

    def test_recent_activity_is_healthy(self):
        result = module.evaluate_customer_health(
            purchased_at=self.now - timedelta(days=20),
            last_meaningful_activity=self.now - timedelta(days=2),
            last_billing_portal_at=None,
            support_requested_at=None,
            tier="dashboard",
            now=self.now,
        )
        self.assertEqual(result["action"], "none")
        self.assertEqual(result["reason"], "active")

    def test_fourteen_day_silence_gets_value_checkin(self):
        result = module.evaluate_customer_health(
            purchased_at=self.now - timedelta(days=30),
            last_meaningful_activity=self.now - timedelta(days=15),
            last_billing_portal_at=None,
            support_requested_at=None,
            tier="dashboard",
            now=self.now,
        )
        self.assertEqual(result["action"], "send_value_checkin")
        self.assertEqual(result["reason"], "inactive_14d")

    def test_already_sent_action_is_not_sent_again(self):
        self.assertFalse(module.action_is_due("send_setup_help", {"send_setup_help"}))
        self.assertTrue(module.action_is_due("send_value_checkin", {"send_setup_help"}))

    def test_insider_without_any_activity_escalates_after_setup_was_sent(self):
        result = module.evaluate_customer_health(
            purchased_at=self.now - timedelta(days=22),
            last_meaningful_activity=None,
            last_billing_portal_at=None,
            support_requested_at=None,
            tier="insider",
            now=self.now,
        )
        self.assertEqual(result["action"], "send_setup_help")
        self.assertTrue(module.action_is_due("alert_founder", {"send_setup_help"}))

    def test_pinned_paid_customer_audience_is_selected_even_when_not_first(self):
        audience = module.resolve_paid_customer_audience([
            {"id": "other-audience"},
            {"id": "1ddf358e-2416-4481-a0f5-538fd12f6e73"},
        ])
        self.assertEqual(audience, "1ddf358e-2416-4481-a0f5-538fd12f6e73")

    def test_missing_pinned_paid_customer_audience_fails_closed(self):
        with self.assertRaisesRegex(RuntimeError, "pinned paid-customer audience"):
            module.resolve_paid_customer_audience([{"id": "other-audience"}])

    def test_daily_metrics_line_has_all_retention_counts(self):
        line = module.daily_metrics_line(
            paid_customers=3,
            inactive_24h=2,
            inactive_14d=1,
            portal_opens=4,
            rescues_sent=1,
        )
        self.assertEqual(
            line,
            "Daily: paid customers 3, inactive 24h 2, inactive 14d 1, portal opens 4, rescues sent 1.",
        )

    def test_existing_buyer_uses_purchase_date_not_backfill_date(self):
        purchased_at = self.now - timedelta(days=51)
        backfilled_at = self.now - timedelta(hours=1)
        self.assertEqual(
            module.customer_monitoring_start(purchased_at, backfilled_at),
            purchased_at,
        )

    def test_day_90_winback_is_due_once_and_not_early(self):
        cancelled_at = self.now - timedelta(days=90)
        self.assertTrue(module.winback_90_is_due(cancelled_at, None, self.now))
        self.assertFalse(module.winback_90_is_due(cancelled_at, self.now, self.now))
        self.assertFalse(module.winback_90_is_due(self.now - timedelta(days=89), None, self.now))


if __name__ == "__main__":
    unittest.main()
