#!/usr/bin/env python3
"""
GEO citation-share probe
========================

Measures whether AI answer engines actually surface and cite VC Deal Flow Signal
(signals.gitdealflow.com) when asked the buyer/agent questions we want to win.

Why this exists
---------------
On-page GEO (llms.txt, corpus feeds, MCP/A2A/NLWeb, schema) is maxed, but GEO
*success* is downstream and normally unverifiable from our side. This probe turns
that blind spot into a tracked metric: fix a query battery, sample each query
against an answer engine, detect brand/domain citations and competitor
share-of-voice, and append a trend record every run.

Providers
---------
  anthropic  (default) Claude Messages API + server-side web_search tool.
                       Needs ANTHROPIC_API_KEY (read from env or tools/.env).
  manual               Ingest a pre-collected dump (You.com / Perplexity / ChatGPT
                       exports). See geo-baseline-2026-05-31.json for the shape.

Outputs (written next to this script)
  geo-citation-log.jsonl   append-only history, one JSON record per run
  geo-citation-latest.md   human-readable snapshot of the most recent run

Usage
  python3 geo-citation-probe.py                                  # anthropic, full battery
  python3 geo-citation-probe.py --samples 3                      # sample each query 3x
  python3 geo-citation-probe.py --provider manual --ingest geo-baseline-2026-05-31.json
  python3 geo-citation-probe.py --dry-run                        # print battery, no calls
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
QUERIES_FILE = HERE / "geo-queries.json"
LOG_FILE = HERE / "geo-citation-log.jsonl"
LATEST_MD = HERE / "geo-citation-latest.md"

# --- What counts as "us" ---------------------------------------------------
# Tier 1: our canonical domains. A citation here is the strongest GEO win.
OWN_DOMAINS = ["signals.gitdealflow.com", "gitdealflow.com"]
# Tier 2: owned/earned ecosystem surfaces that still route credit to us.
OWN_ECOSYSTEM = [
    "github.com/kindrat86", "glama.ai/mcp/servers/kindrat86",
    "cursor.directory/plugins/vc-deal-flow-signal", "npmjs.com/package/@gitdealflow",
    "dev.to/data_nerd", "huggingface.co/the-data-nerd",
    "hackernoon.com/can-github-activity-predict-the-next-startup-fundraise",
    "earezki.com",  # syndication of our methodology piece
]
# Brand strings detected in the answer prose (not just the citation list).
BRAND_TERMS = [
    "vc deal flow signal", "gitdealflow", "@gitdealflow/mcp-signal",
    "scout score", "engineering acceleration", "scout receipts",
]
# Competitors / substitutes — for share-of-voice.
COMPETITORS = [
    "harmonic", "crunchbase", "pitchbook", "tracxn", "dealroom", "cb insights",
    "cbinsights", "evertrace", "signalfire", "specter", "affinity", "openvc",
    "coresignal", "apollo.io", "reporank", "star history", "devactivity",
    "brightdata", "bright data", "fundable",
]


def norm(s: str) -> str:
    return (s or "").lower()


def extract_urls(blob: str) -> list[str]:
    return re.findall(r"https?://[^\s\"'<>)\]}]+", blob or "")


def classify_answer(answer_text: str, urls: list[str]) -> dict:
    """Return citation/mention flags for a single sampled answer."""
    text = norm(answer_text)
    url_blob = norm(" ".join(urls))
    haystack = text + " " + url_blob

    own_domain = any(d in url_blob for d in OWN_DOMAINS)
    own_eco = own_domain or any(e in url_blob for e in OWN_ECOSYSTEM)
    brand = any(b in haystack for b in BRAND_TERMS)
    comps = sorted({c for c in COMPETITORS if c in haystack})

    return {
        "own_domain_cited": own_domain,
        "own_ecosystem_cited": own_eco,
        "brand_mentioned": brand,
        "surfaced": own_eco or brand,          # cited OR named anywhere
        "competitors_present": comps,
    }


def aggregate(samples: list[dict]) -> dict:
    """samples: list of {id,intent,answer,urls,flags}."""
    n = len(samples)
    if n == 0:
        return {"n": 0}

    def rate(key):
        return round(sum(1 for s in samples if s["flags"][key]) / n, 3)

    # share of voice = our surfaced count / (ours + competitor brands seen), per sample averaged
    sov_num = sum(1 for s in samples if s["flags"]["surfaced"])
    comp_hits = sum(len(s["flags"]["competitors_present"]) for s in samples)
    sov = round(sov_num / (sov_num + comp_hits), 3) if (sov_num + comp_hits) else 0.0

    # per-intent + per-query rollups
    by_intent: dict[str, dict] = {}
    by_query: dict[str, dict] = {}
    for s in samples:
        for bucket, key in ((by_intent, s["intent"]), (by_query, s["id"])):
            b = bucket.setdefault(key, {"n": 0, "surfaced": 0, "own_domain": 0})
            b["n"] += 1
            b["surfaced"] += int(s["flags"]["surfaced"])
            b["own_domain"] += int(s["flags"]["own_domain_cited"])
    for b in list(by_intent.values()) + list(by_query.values()):
        b["surfaced_rate"] = round(b["surfaced"] / b["n"], 3)
        b["own_domain_rate"] = round(b["own_domain"] / b["n"], 3)

    return {
        "n": n,
        "own_domain_citation_rate": rate("own_domain_cited"),
        "own_ecosystem_citation_rate": rate("own_ecosystem_cited"),
        "brand_mention_rate": rate("brand_mentioned"),
        "surfaced_rate": rate("surfaced"),
        "share_of_voice": sov,
        "by_intent": by_intent,
        "by_query": by_query,
    }


# --- Providers -------------------------------------------------------------
def load_anthropic_key() -> str | None:
    key = os.environ.get("ANTHROPIC_API_KEY")
    if key:
        return key
    env = HERE.parent / "tools" / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("ANTHROPIC_API_KEY="):
                v = line.split("=", 1)[1].strip().strip('"').strip("'")
                if v:
                    return v
    return None


def ask_anthropic(prompt: str, key: str, model: str) -> tuple[str, list[str]]:
    """Query Claude with the server-side web_search tool; return (text, cited_urls)."""
    body = {
        "model": model,
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": prompt}],
        "tools": [{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}],
    }
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(body).encode(),
        headers={
            "content-type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode())
    # Robust: collect prose from text blocks, URLs from the entire serialized response
    # (covers web_search_tool_result blocks + citation objects regardless of schema drift).
    text_parts = [b.get("text", "") for b in data.get("content", []) if b.get("type") == "text"]
    urls = sorted(set(extract_urls(json.dumps(data))))
    return " ".join(text_parts), urls


# --- Run modes -------------------------------------------------------------
def load_battery() -> list[dict]:
    spec = json.loads(QUERIES_FILE.read_text())
    return [q for q in spec["queries"] if not q.get("id", "").startswith("_")]


def run_anthropic(samples_per_query: int, model: str) -> tuple[str, list[dict]]:
    key = load_anthropic_key()
    if not key:
        sys.exit("ANTHROPIC_API_KEY not found (env or tools/.env). Use --provider manual instead.")
    out = []
    for q in load_battery():
        for i in range(samples_per_query):
            try:
                text, urls = ask_anthropic(q["prompt"], key, model)
            except Exception as e:  # noqa: BLE001 - never let one query kill the run
                print(f"  ! {q['id']} sample {i}: {e}", file=sys.stderr)
                continue
            out.append({"id": q["id"], "intent": q["intent"], "answer": text,
                        "urls": urls, "flags": classify_answer(text, urls)})
            print(f"  · {q['id']} sample {i}: surfaced={out[-1]['flags']['surfaced']}")
    return f"anthropic/{model}", out


def run_manual(ingest_path: str) -> tuple[str, list[dict]]:
    dump = json.loads(Path(ingest_path).read_text())
    engine = dump.get("engine", "manual")
    out = []
    for r in dump.get("results", []):
        urls = r.get("urls", [])
        out.append({"id": r["id"], "intent": r.get("intent", "?"), "answer": r.get("answer", ""),
                    "urls": urls, "flags": classify_answer(r.get("answer", ""), urls)})
    return engine, out


# --- Reporting -------------------------------------------------------------
def write_report(record: dict) -> None:
    with LOG_FILE.open("a") as f:
        f.write(json.dumps(record) + "\n")

    agg = record["aggregate"]
    lines = [
        "# GEO Citation Share — Latest Snapshot",
        "",
        f"- **Run:** {record['ts']}",
        f"- **Engine:** `{record['engine']}`",
        f"- **Queries × samples:** {record['n_queries']} × {record['samples_per_query']} = {agg['n']} answers",
        "",
        "## Headline metrics",
        "",
        "| Metric | Value | Reads as |",
        "|---|---:|---|",
        f"| Own-domain citation rate | **{pct(agg['own_domain_citation_rate'])}** | answers citing signals/gitdealflow.com |",
        f"| Owned-ecosystem citation rate | {pct(agg['own_ecosystem_citation_rate'])} | + GitHub/Glama/Cursor/npm/dev.to/HackerNoon |",
        f"| Brand mention rate | {pct(agg['brand_mention_rate'])} | brand named in the answer prose |",
        f"| Surfaced rate (cited OR named) | {pct(agg['surfaced_rate'])} | any presence in the answer |",
        f"| Share of voice | {pct(agg['share_of_voice'])} | us ÷ (us + competitor brands) |",
        "",
        "## By intent cluster",
        "",
        "| Intent | Samples | Surfaced | Own-domain |",
        "|---|---:|---:|---:|",
    ]
    for intent, b in sorted(agg["by_intent"].items(), key=lambda kv: -kv[1]["surfaced_rate"]):
        lines.append(f"| {intent} | {b['n']} | {pct(b['surfaced_rate'])} | {pct(b['own_domain_rate'])} |")
    lines += ["", "## By query", "", "| Query | Samples | Surfaced | Own-domain |", "|---|---:|---:|---:|"]
    for qid, b in sorted(agg["by_query"].items(), key=lambda kv: -kv[1]["surfaced_rate"]):
        lines.append(f"| `{qid}` | {b['n']} | {pct(b['surfaced_rate'])} | {pct(b['own_domain_rate'])} |")
    lines += [
        "",
        "## How to read this",
        "",
        "- **Own-domain rate** is the truest GEO win — the engine put *our URL* in front of the user.",
        "- **Surfaced rate** counts softer wins (brand named, or an owned ecosystem surface cited).",
        "- A query that flips between hit and miss across identical samples means the citation is",
        "  probabilistic — raise `--samples` for that cluster to get a stable read.",
        "- Lowest clusters are the GEO backlog: that is where on-page + off-page work should target next.",
        "",
        f"_History: `{LOG_FILE.name}` ({count_lines(LOG_FILE)} runs logged)._",
    ]
    LATEST_MD.write_text("\n".join(lines) + "\n")


def pct(x: float) -> str:
    return f"{round(x * 100)}%"


def count_lines(p: Path) -> int:
    return sum(1 for _ in p.open()) if p.exists() else 0


def main() -> None:
    ap = argparse.ArgumentParser(description="GEO citation-share probe")
    ap.add_argument("--provider", choices=["anthropic", "manual"], default="anthropic")
    ap.add_argument("--ingest", help="manual-mode dump file (JSON)")
    ap.add_argument("--samples", type=int, default=2, help="samples per query (anthropic)")
    ap.add_argument("--model", default="claude-sonnet-4-5", help="anthropic model id")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if args.dry_run:
        for q in load_battery():
            print(f"[{q['intent']:11}] {q['id']:22} {q['prompt']}")
        return

    if args.provider == "manual":
        if not args.ingest:
            sys.exit("--provider manual requires --ingest <dump.json>")
        engine, samples = run_manual(args.ingest)
        samples_per_query = 0  # variable per query in a manual dump
    else:
        engine, samples = run_anthropic(args.samples, args.model)
        samples_per_query = args.samples

    agg = aggregate(samples)
    record = {
        "ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "engine": engine,
        "n_queries": len({s["id"] for s in samples}),
        "samples_per_query": samples_per_query,
        "aggregate": agg,
        "samples": [{k: s[k] for k in ("id", "intent", "flags")} for s in samples],
    }
    write_report(record)
    print(f"\nGEO run logged → {LOG_FILE.name}")
    print(f"  own-domain citation rate : {pct(agg['own_domain_citation_rate'])}")
    print(f"  surfaced rate            : {pct(agg['surfaced_rate'])}")
    print(f"  share of voice           : {pct(agg['share_of_voice'])}")
    print(f"Snapshot → {LATEST_MD.name}")


if __name__ == "__main__":
    main()
