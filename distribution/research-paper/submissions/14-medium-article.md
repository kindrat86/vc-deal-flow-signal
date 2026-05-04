# Medium — paper announcement cross-post

**Target URL:** https://medium.com/new-story

**Rationale:** Medium reach is capped for non-Partner accounts but the
SEO benefit (DA 95) is still real. Use Chrome MCP paste pattern from
`medium-daily-publisher` task.

## Pre-existing account

- `signal@gitdealflow.com` (created 2026-04-19, per memory).
- Brunson-humanized queue pattern already established.

## Article

Title (Brunson-humanized):
```
I built a public dataset on startup engineering velocity — here's what surprised me
```

Canonical URL: the dev.to article (so Medium respects SEO priority).

Body: same as dev.to version, cut to ~900 words for Medium's more
casual audience.

## Tags (Medium allows 5)

```
Venture Capital, Open Source, Data Science, GitHub, Alternative Data
```

## Canonical-URL setting (critical)

Before publishing:
1. Open **"More settings"** (the three-dot icon in Medium editor).
2. Scroll to **"Canonical URL"**.
3. Paste dev.to URL.
4. Publish.

## Automation

Medium API is deprecated (per memory `feedback_medium_api_deprecated`).
Use Chrome MCP direct-paste via the existing scheduled task
`medium-daily-publisher`. Drop this draft into the Medium queue:

```json
// distribution/medium-autopublish/queue.json — append:
{
  "order": 99,
  "status": "draft-ready",
  "slug": "i-built-a-public-dataset-on-startup-engineering-velocity",
  "mediumTitle": "I built a public dataset on startup engineering velocity — here's what surprised me",
  "tags": ["Venture Capital", "Open Source", "Data Science", "GitHub", "Alternative Data"],
  "canonicalUrl": "https://dev.to/data_nerd/i-released-a-public-dataset-on-startup-engineering-velocity",
  "scheduledFor": "2026-04-22",
  "bodyPath": "distribution/research-paper/submissions/14-medium-article.md"
}
```
