from __future__ import annotations

import argparse
import collections
import datetime as dt
import html
import json
import re
import subprocess
from pathlib import Path
from typing import Any

MAILBOX = "[Gmail]/All Mail"
RECIPIENT_QUERY = "(to signal@gitdealflow.com or to signals@gitdealflow.com)"
EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)


def classify_subject(subject: str) -> str | None:
    lowered = subject.strip().lower()
    if lowered.startswith("voc feedback:"):
        return "feedback"
    if lowered.startswith("voc support:"):
        return "support"
    if lowered.startswith("voc pulse:"):
        return "satisfaction"
    if lowered.startswith("cancellation alert:") or lowered.startswith("exit survey:"):
        return "churn"
    if lowered.startswith("gdf onboarding -"):
        return "onboarding"
    return None


def clean_excerpt(raw: str, limit: int = 500) -> str:
    value = html.unescape(re.sub(r"<[^>]+>", " ", raw or ""))
    value = re.split(r"\n\s*On .{0,120} wrote:\s*\n", value, maxsplit=1, flags=re.I)[0]
    value = re.split(r"\n\s*>+", value, maxsplit=1)[0]
    value = EMAIL_RE.sub("[email]", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value[:limit]


def theme_for(text: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ("cancel", "unsubscribe", "left", "churn")):
        return "churn"
    if any(word in lowered for word in ("price", "cost", "expensive", "budget")):
        return "price"
    if any(word in lowered for word in ("wrong", "inaccurate", "stale", "data quality", "false positive")):
        return "data_quality"
    if any(word in lowered for word in ("login", "email did not", "email never", "not arrive", "not received", "onboarding", "confirm")):
        return "onboarding_delivery"
    if any(word in lowered for word in ("filter", "geography", "csv", "export", "integration", "feature", "api")):
        return "feature_request"
    return "other"


def render_report(records: list[dict[str, str]], start: str, end: str) -> str:
    theme_counts = collections.Counter(record["theme"] for record in records)
    kind_counts = collections.Counter(record["kind"] for record in records)
    lines = [
        "# GitDealFlow customer truth",
        "",
        f"Window: {start} through {end}",
        "",
        f"## {len(records)} structured customer-voice records",
        "",
    ]
    if not records:
        lines.extend(["No structured feedback, support, satisfaction, onboarding, or churn record arrived in this window.", ""])
    else:
        lines.extend(["### Sources", ""])
        for kind, count in sorted(kind_counts.items(), key=lambda item: (-item[1], item[0])):
            lines.append(f"- {kind}: {count}")
        lines.extend(["", "### Themes", ""])
        for theme, count in sorted(theme_counts.items(), key=lambda item: (-item[1], item[0])):
            lines.append(f"- {theme}: {count}")
        lines.extend(["", "### Anonymized verbatims", ""])
        for record in records:
            lines.append(f"- **{record['date']} | {record['kind']} | {record['theme']}**: {record['excerpt'] or '[no written answer]'}")
        lines.append("")
    lines.extend([
        "## Audit rule",
        "",
        "Any future claim about a customer pain, objection, requested feature, satisfaction, or churn reason must cite one of these records or be labeled a hypothesis. A single record is low confidence; two independent records are medium confidence; three or more independent records are high confidence.",
        "",
    ])
    return "\n".join(lines)


def _run_json(args: list[str]) -> dict[str, Any]:
    result = subprocess.run(args, check=True, capture_output=True, text=True, timeout=120)
    return json.loads(result.stdout)


def _message_text(message_id: str) -> str:
    message = _run_json(["himalaya", "--json", "message", "read", "--mailbox", MAILBOX, message_id])
    parts = message.get("parts") or []
    chunks: list[str] = []
    for index in message.get("text_body") or []:
        if isinstance(index, int) and 0 <= index < len(parts):
            body = parts[index].get("body") or {}
            if isinstance(body.get("Text"), str):
                chunks.append(body["Text"])
    if not chunks:
        for index in message.get("html_body") or []:
            if isinstance(index, int) and 0 <= index < len(parts):
                body = parts[index].get("body") or {}
                if isinstance(body.get("Html"), str):
                    chunks.append(body["Html"])
    return clean_excerpt("\n".join(chunks))


def collect(days: int, today: dt.date | None = None) -> tuple[list[dict[str, str]], str, str]:
    end_date = today or dt.datetime.now(dt.timezone.utc).date()
    start_date = end_date - dt.timedelta(days=max(1, days) - 1)
    query = f"after {start_date.isoformat()} and {RECIPIENT_QUERY} order by date desc"
    payload = _run_json(["himalaya", "--json", "envelope", "search", "--mailbox", MAILBOX, "--page-size", "200", query])
    records: list[dict[str, str]] = []
    for envelope in payload.get("envelopes") or []:
        subject = str(envelope.get("subject") or "")
        kind = classify_subject(subject)
        if not kind:
            continue
        excerpt = _message_text(str(envelope.get("id")))
        records.append({
            "date": str(envelope.get("date") or "")[:10],
            "kind": kind,
            "theme": theme_for(f"{subject} {excerpt}"),
            "excerpt": excerpt,
        })
    return records, start_date.isoformat(), end_date.isoformat()


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the private weekly GitDealFlow customer-voice digest.")
    parser.add_argument("--days", type=int, default=7)
    parser.add_argument("--output-dir", default=str(Path.home() / "gitdealflow-audit" / "voc"))
    args = parser.parse_args()

    records, start, end = collect(args.days)
    output_dir = Path(args.output_dir).expanduser()
    output_dir.mkdir(parents=True, exist_ok=True)
    report = render_report(records, start, end)
    (output_dir / "latest.md").write_text(report, encoding="utf-8")
    (output_dir / f"{end}.md").write_text(report, encoding="utf-8")
    (output_dir / f"{end}.json").write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    themes = collections.Counter(record["theme"] for record in records)
    summary = ", ".join(f"{key}={value}" for key, value in sorted(themes.items())) or "no structured records"
    print(f"GitDealFlow VOC: {len(records)} records ({summary}). Private report: {output_dir / 'latest.md'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
