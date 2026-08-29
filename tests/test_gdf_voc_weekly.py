from __future__ import annotations

import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "monitoring" / "gdf_voc_weekly.py"
spec = importlib.util.spec_from_file_location("gdf_voc_weekly", SCRIPT)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def test_classifies_only_structured_customer_voice_subjects():
    assert module.classify_subject("VOC feedback: weekly [sunday]") == "feedback"
    assert module.classify_subject("VOC support: login") == "support"
    assert module.classify_subject("VOC pulse: 7/10 [footer]") == "satisfaction"
    assert module.classify_subject("Cancellation alert: person@example.com") == "churn"
    assert module.classify_subject("Exit survey: too_many_emails (person@example.com)") == "churn"
    assert module.classify_subject("GDF onboarding - Not yet") == "onboarding"
    assert module.classify_subject("Product Hunt notification") is None


def test_redacts_email_and_removes_quoted_thread():
    raw = "I could not filter by geography. Reply to person@example.com\n\nOn Tue, Someone wrote:\n> old thread"
    assert module.clean_excerpt(raw) == "I could not filter by geography. Reply to [email]"


def test_tags_customer_language_deterministically():
    assert module.theme_for("I could not filter by geography or export CSV") == "feature_request"
    assert module.theme_for("The login email never arrived") == "onboarding_delivery"
    assert module.theme_for("The ranking was wrong and the data looked stale") == "data_quality"
    assert module.theme_for("It costs too much") == "price"
    assert module.theme_for("Please cancel") == "churn"


def test_report_contains_counts_themes_and_anonymized_verbatims():
    records = [
        {"date": "2026-08-29", "kind": "feedback", "theme": "feature_request", "excerpt": "Need geography filters"},
        {"date": "2026-08-29", "kind": "support", "theme": "onboarding_delivery", "excerpt": "Login email did not arrive"},
    ]
    report = module.render_report(records, "2026-08-23", "2026-08-29")
    assert "2 structured customer-voice records" in report
    assert "feature_request" in report
    assert "Need geography filters" in report
    assert "@" not in report
