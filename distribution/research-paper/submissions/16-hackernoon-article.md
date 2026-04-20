# HackerNoon — paper announcement cross-post

**Target URL:** https://app.hackernoon.com/new

**Rationale:** HackerNoon has an editorial review queue (3–7 days)
but once published, the post ranks well on Google and carries solid
domain authority (DA 85+).

## Pre-existing account

- `@TheData_7cdit42c` (per memory `project_hackernoon`). First story
  on "Alternative Data for Venture Capital" is in the editorial queue.

## Article

Title:
```
I Released a Public Dataset on Startup Engineering Velocity (219 Obs, 55 VC-Backed Startups)
```

Subtitle / "What's this story about?":
```
A longitudinal panel of GitHub signals, a CC BY 4.0 dataset, and an SSRN preprint — and the three things I got wrong building it.
```

Tags (HackerNoon allows 5):
```
venture-capital, open-source, data-science, github, alt-data
```

Cover image: `distribution/logo-v2-512.png` or `distribution/twitter-banner.png`.

Body: adapt from `12-devto-article.md`, rewritten with HackerNoon's
conversational voice (use their Brunson-style guide if available;
otherwise keep it tight and opinionated).

## Submission flow

1. Open https://app.hackernoon.com/new.
2. Paste the body into the editor.
3. Add cover image.
4. Fill title + subtitle + tags.
5. Click **Submit for Review**.

Typical review: 3–7 business days.

## After publish

1. HackerNoon URL format: `https://hackernoon.com/<slug>`.
2. Paste into `../amplification-status.json` under `hackernoon`.
3. Add to Wikidata paper item Q139493250 as P973 (described at URL).

## Automation

HackerNoon has no public API for writes. Use Chrome MCP.

See `scripts/submit-hackernoon.mjs`.
