"""
VC Deal Flow Signal — live demo Space.

Three Gradio tabs that exercise the public, no-auth GitDealFlow API:
1. Live signals — top startups by 14-day commit-velocity acceleration.
2. Glossary search — the 84-term controlled vocabulary.
3. Cite this — copy-paste citation snippets for the SSRN paper + dataset.

All data is fetched live from signals.gitdealflow.com/api/v1/* on every
interaction so we never serve stale snapshots. The API is rate-limited,
public, and CC BY 4.0.

License: CC BY 4.0 — attribution required.
Canonical site: https://gitdealflow.com
Methodology paper: https://ssrn.com/abstract=6606558
"""

from __future__ import annotations

import gradio as gr
import requests

BASE = "https://signals.gitdealflow.com"
UA = "vc-deal-flow-signal-hf-space/1.0 (+https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-signal)"
TIMEOUT = 15


def _get_json(path: str) -> dict | list:
    """GET an API endpoint and return parsed JSON, raising on non-2xx."""
    url = f"{BASE}{path}"
    r = requests.get(url, headers={"User-Agent": UA}, timeout=TIMEOUT)
    r.raise_for_status()
    return r.json()


# ── Tab 1: Live signals ────────────────────────────────────────────────


def load_signals(limit: int) -> list[list]:
    """Fetch top startups ranked by engineering acceleration."""
    try:
        data = _get_json("/api/v1/signals.json")
    except requests.RequestException as e:
        return [["—", "—", "—", "—", f"API unavailable: {e}"]]

    # API shape: {"meta": {...}, "trending": [...], "sectors": [...]}.
    # Each trending item has: name, description, stage, geography,
    # commitVelocity14d, commitVelocityChange, contributors, contributorGrowth,
    # newRepos, signalType, githubUrl, websiteUrl.
    rows = data.get("trending") if isinstance(data, dict) else []
    if not isinstance(rows, list):
        return [["—", "—", "—", "—", "Unexpected API shape"]]

    out = []
    for r in rows[: max(1, min(int(limit), 50))]:
        name = r.get("name") or "—"
        signal = r.get("signalType") or "—"
        delta = r.get("commitVelocityChange") or "—"
        stage = r.get("stage") or "—"
        # Prefer GitHub deep link (Code-Side Sourcing source of truth).
        link = r.get("githubUrl") or r.get("websiteUrl") or BASE
        out.append([name, signal, str(delta), stage, link])
    if not out:
        out = [["—", "—", "—", "—", "No trending signals returned"]]
    return out


# ── Tab 2: Glossary search ─────────────────────────────────────────────


def _load_glossary() -> list[dict]:
    """Fetch the controlled vocabulary from the public JSON-LD surface."""
    try:
        data = _get_json("/api/v1/glossary.json")
    except requests.RequestException:
        return []
    if not isinstance(data, dict):
        return []
    terms = data.get("hasDefinedTerm") or []
    return [t for t in terms if isinstance(t, dict)]


GLOSSARY_CACHE: list[dict] = _load_glossary()


def search_glossary(query: str) -> list[list]:
    """Substring filter across term name + definition."""
    q = (query or "").strip().lower()
    if not GLOSSARY_CACHE:
        return [["—", "Glossary API unavailable — try again in a minute.", "—"]]
    if not q:
        rows = GLOSSARY_CACHE[:20]
    else:
        rows = [
            t
            for t in GLOSSARY_CACHE
            if q in (t.get("name") or "").lower()
            or q in (t.get("description") or "").lower()
        ][:50]
    if not rows:
        return [[f"No match for '{query}'", "—", "—"]]
    out = []
    for t in rows:
        name = t.get("name") or "—"
        defn = t.get("description") or "—"
        if len(defn) > 280:
            defn = defn[:277] + "…"
        term_id = t.get("termCode") or ""
        link = f"{BASE}/define/{term_id}" if term_id else BASE
        out.append([name, defn, link])
    return out


# ── Tab 3: Cite this ───────────────────────────────────────────────────

CITATIONS = {
    "BibTeX (paper)": """@article{thedatanerd2026vcdealflow,
  title   = {A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups},
  author  = {{The Data Nerd}},
  journal = {SSRN Electronic Journal},
  year    = {2026},
  doi     = {10.2139/ssrn.6606558},
  url     = {https://ssrn.com/abstract=6606558},
  note    = {Published by VC Deal Flow Signal (GitDealFlow). CC BY 4.0.},
  orcid   = {0009-0002-2222-4112}
}""",
    "RIS (paper)": """TY  - JOUR
AU  - The Data Nerd
TI  - A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups
JO  - SSRN Electronic Journal
PY  - 2026
DO  - 10.2139/ssrn.6606558
UR  - https://ssrn.com/abstract=6606558
ER  -""",
    "APA (paper)": (
        "The Data Nerd. (2026). A Longitudinal Panel of GitHub Engineering "
        "Velocity for Venture-Backed Startups. SSRN Electronic Journal. "
        "https://doi.org/10.2139/ssrn.6606558"
    ),
    "Wikipedia (paper)": (
        "<ref>{{cite journal |last=The Data Nerd "
        "|title=A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups "
        "|journal=SSRN Electronic Journal |year=2026 |doi=10.2139/ssrn.6606558 "
        "|url=https://ssrn.com/abstract=6606558 "
        "|publisher=VC Deal Flow Signal (GitDealFlow) "
        "|orcid=0009-0002-2222-4112}}</ref>"
    ),
    "Wikipedia (dataset)": (
        "<ref>{{cite web |last=The Data Nerd "
        "|title=VC Deal Flow Signal — Public Engineering-Velocity Panel "
        "|publisher=VC Deal Flow Signal (GitDealFlow) |year=2026 "
        "|url=https://signals.gitdealflow.com/api/dataset.jsonl "
        "|format=NDJSON |access-date={{subst:CURRENTDATE}}}}</ref>"
    ),
    "HF dataset (BibTeX)": """@dataset{thedatanerd2026vcdealflowglossary,
  title     = {VC Deal Flow Signal — Controlled Vocabulary Glossary},
  author    = {{The Data Nerd}},
  year      = {2026},
  publisher = {Hugging Face},
  url       = {https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal-glossary},
  license   = {CC BY 4.0}
}""",
}


def get_citation(fmt: str) -> str:
    return CITATIONS.get(fmt, "")


# ── App layout ─────────────────────────────────────────────────────────


HEADER = """
# 📊 VC Deal Flow Signal

**Engineering acceleration as a leading indicator of fundraise events.**
Three-to-six-week lead time, all from public GitHub data, fully reproducible.

[Methodology paper (SSRN)](https://ssrn.com/abstract=6606558) ·
[Glossary dataset](https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal-glossary) ·
[Live API](https://signals.gitdealflow.com/api/v1/openapi.json) ·
[MCP server](https://signals.gitdealflow.com/.well-known/mcp.json) ·
[Wikidata Q139376302](https://www.wikidata.org/wiki/Q139376302)
"""

FOOTER = """
---
Built by [VC Deal Flow Signal](https://gitdealflow.com).
Data is **CC BY 4.0** — free to use commercially, attribution required.
"""


with gr.Blocks(
    title="VC Deal Flow Signal — Live Engineering Acceleration",
    theme=gr.themes.Soft(primary_hue="blue", neutral_hue="slate"),
) as demo:
    gr.Markdown(HEADER)

    with gr.Tabs():
        with gr.Tab("Live signals"):
            gr.Markdown(
                "Top startups ranked by 14-day commit-velocity acceleration. "
                "Live from `signals.gitdealflow.com/api/v1/signals.json`. "
                "Bot filter applied (Dependabot, Renovate, GitHub Actions excluded)."
            )
            sig_limit = gr.Slider(
                minimum=5,
                maximum=50,
                value=20,
                step=5,
                label="How many signals to show",
            )
            sig_btn = gr.Button("Fetch live signals", variant="primary")
            sig_table = gr.Dataframe(
                headers=[
                    "Company",
                    "Signal type",
                    "Δ velocity (14d)",
                    "Stage",
                    "GitHub / website",
                ],
                interactive=False,
                wrap=True,
            )
            sig_btn.click(load_signals, inputs=[sig_limit], outputs=[sig_table])
            demo.load(load_signals, inputs=[sig_limit], outputs=[sig_table])

        with gr.Tab("Glossary search"):
            gr.Markdown(
                "Search the 84-term controlled vocabulary. Same corpus as the "
                "[`the-data-nerd/vc-deal-flow-signal-glossary`]"
                "(https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal-glossary) "
                "Hugging Face dataset."
            )
            glossary_query = gr.Textbox(
                label="Search term or definition (substring match)",
                placeholder="e.g. commit velocity, hiring burst, dream 100…",
            )
            glossary_table = gr.Dataframe(
                headers=["Term", "Definition", "Deep link"],
                interactive=False,
                wrap=True,
            )
            glossary_query.change(
                search_glossary,
                inputs=[glossary_query],
                outputs=[glossary_table],
            )
            demo.load(search_glossary, inputs=[glossary_query], outputs=[glossary_table])

        with gr.Tab("Cite this"):
            gr.Markdown(
                "Copy-paste-ready citation snippets for the SSRN paper, the "
                "public dataset, and the Hugging Face glossary corpus."
            )
            fmt = gr.Radio(
                choices=list(CITATIONS.keys()),
                value="BibTeX (paper)",
                label="Format",
            )
            cite_box = gr.Code(
                language=None,
                interactive=False,
                lines=10,
            )
            fmt.change(get_citation, inputs=[fmt], outputs=[cite_box])
            demo.load(get_citation, inputs=[fmt], outputs=[cite_box])

    gr.Markdown(FOOTER)


if __name__ == "__main__":
    demo.queue().launch()
