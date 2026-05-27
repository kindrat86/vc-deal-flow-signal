---
title: VC Deal Flow Signal — Live Engineering Acceleration
emoji: 📊
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 5.42.0
app_file: app.py
pinned: true
license: cc-by-4.0
short_description: Live VC startup signals from GitHub acceleration
datasets:
  - the-data-nerd/vc-deal-flow-signal-glossary
tags:
  - venture-capital
  - github
  - alternative-data
  - deal-sourcing
  - signal-detection
  - fintech
  - finance
---

# VC Deal Flow Signal — Live Engineering Acceleration

Live interactive demo of the methodology published in
[SSRN 6606558](https://ssrn.com/abstract=6606558):
**A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups**.

## What this Space does

Three tabs that exercise the public, no-auth GitDealFlow API
(`signals.gitdealflow.com/api/v1/*`):

1. **Live signals** — top startups ranked by 14-day commit-velocity acceleration.
   Each row is a public-data delta computed deterministically from the GitHub REST
   API with the bot filter applied (Dependabot/Renovate/GitHub Actions excluded).
2. **Glossary search** — the 84-term controlled vocabulary (Code-Side Sourcing,
   Commit Velocity, Two-Period Confirmation, etc.). Same corpus as the
   [`the-data-nerd/vc-deal-flow-signal-glossary`](https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal-glossary)
   dataset.
3. **Cite this** — copy-paste BibTeX, RIS, APA, MLA, Chicago, and Wikipedia
   `{{cite journal}}` snippets for the paper and the dataset.

## License

Output is **CC BY 4.0** — free to use commercially, attribution required.

## Provenance

- **Methodology**: SSRN 6606558 (DOI [10.2139/ssrn.6606558](https://doi.org/10.2139/ssrn.6606558))
- **Dataset**: [the-data-nerd/vc-deal-flow-signal-glossary](https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal-glossary)
- **Live API**: [signals.gitdealflow.com/api/v1/openapi.json](https://signals.gitdealflow.com/api/v1/openapi.json)
- **MCP server**: [signals.gitdealflow.com/.well-known/mcp.json](https://signals.gitdealflow.com/.well-known/mcp.json)
- **Wikidata**: [Q139376302](https://www.wikidata.org/wiki/Q139376302)

Full canonical site: [gitdealflow.com](https://gitdealflow.com).
