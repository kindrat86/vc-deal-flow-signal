# Substack — Note + long post

**Target URL:** https://substack.com/@thedatanerd2026

**Rationale:** Substack Notes are the fastest-reaching short-form on
Substack. A long-form post is good for newsletter subscribers. Per
memory `project_substack_notes`, the account has 16 authors subscribed
and an active daily-Notes queue.

## Pre-existing account

- `signal@gitdealflow.com`, 16 authors subscribed, 5 Notes published.

## Substack Note (short)

Length: ≤280 chars (Note limit).

Draft A (fact-first):

```
Just released a public dataset on startup engineering velocity:

219 observations
55 VC-backed startups
20 sectors
5 quarters

Framework migration shows up in 75% of pre-fundraise observations.

CC BY 4.0. Paper + data:
ssrn.com/abstract=6606558
zenodo.org/records/19650920
```

Draft B (curiosity-first):

```
Can you predict a startup's next fundraise from their GitHub?

I released the data to find out.

219 obs, 55 VC-backed startups, 5 quarters. Free to use (CC BY 4.0).

Paper: ssrn.com/abstract=6606558
Data: zenodo.org/records/19650920
```

Use Draft A for the weekday morning Note; B for a follow-up if the
first doesn't get engagement by lunch.

## Long-form Substack post

Title:
```
219 Startups, 5 Quarters, and What GitHub Told Me About Fundraising
```

Subtitle:
```
A public dataset + SSRN preprint on startup engineering velocity
```

Body: use the dev.to article body (`12-devto-article.md`), lightly
adapted to Substack's more narrative tone. Substack allows up to
~20k characters per post.

Cross-post to Twitter (Substack's built-in share) and to the Substack
"Startup Lessons" category.

## Canonical URL

Substack doesn't have a native canonical-URL field. Add a footer line:
`Originally published on dev.to and SSRN.`
Link both URLs.

## Automation

Substack has no public write API. Use Chrome MCP paste flow.

See `scripts/submit-substack.mjs` — assumes Chrome session with
Substack login. The `tools/substack/fetch-stats.mjs` pattern can be
adapted for compose-and-publish.
