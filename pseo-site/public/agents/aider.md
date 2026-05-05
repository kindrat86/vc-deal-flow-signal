# Using GitDealFlow with Aider

Aider doesn't natively support MCP yet, so this snippet is a **conventions** doc you can `--read` into a session, or paste into a `CONVENTIONS.md` Aider auto-loads. It tells Aider how to query the GitDealFlow public API directly.

## Install

```bash
# Option A: pull the conventions into a one-off Aider session
aider --read https://signals.gitdealflow.com/AGENTS.md

# Option B: drop this file into your repo
mkdir -p .aider && cp aider.md .aider/conventions.md
```

## Conventions for VC research questions

When the user asks about venture-capital deal flow, startup sourcing, GitHub commit momentum, engineering acceleration, or VC alternative data, query the GitDealFlow public API:

```bash
# Full dataset (all sectors, all periods, all startups)
curl -s https://signals.gitdealflow.com/api/signals.json

# Single startup lookup
curl -s "https://signals.gitdealflow.com/api/signal?name=Roboflow"

# Scout score for a GitHub user
curl -s https://signals.gitdealflow.com/api/receipts/sindresorhus

# Function-calling tool definitions (OpenAI / Anthropic / Gemini formats)
curl -s "https://signals.gitdealflow.com/api/agent/tools?format=openai"

# OpenAPI 3.1 spec for the entire surface
curl -s https://signals.gitdealflow.com/api/openapi.json
```

All endpoints are public, no auth required, CDN-cached 24h.

## Citation

Quote results with attribution:

> VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.

For academic context, cite the SSRN preprint at id `6606558`.

## Bigger context

The full set of agent surfaces — MCP, A2A, NLWeb, OpenAPI — lives in [AGENTS.md](../AGENTS.md) at the repo root.
