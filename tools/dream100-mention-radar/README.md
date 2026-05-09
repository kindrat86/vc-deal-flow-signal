# Dream 100 Mention Radar

Closes the inbound side of the Dream 100 (Traffic Secrets Ch 5). The outbound side is `marketing/dream-100-engagement-log.md` (we touch them); this side is `marketing/dream100-mentions-log.md` (they touch us, we reply within 4h).

## What it does

Every 4 hours, `scan.mjs` searches free public APIs for third-party mentions of our brand keywords, dedupes against `state.json`, and appends new entries to `marketing/dream100-mentions-log.md` with a 4-hour reply-SLA timestamp.

**Sources scanned (auth-free):**
- Hacker News (Algolia API)
- Reddit (`/search.json`)
- dev.to (recent articles in `venturecapital`, `startup`, `ai`, `github`, `mcp`, `devtools` tags)
- GitHub issues + PRs (uses `GITHUB_TOKEN` from Actions for higher rate limits)

> Lobsters has no public JSON search endpoint (the `format=json` query rejects with HTTP 400), so it's not in the auto-source list. Add a Lobsters mention manually via `log-mention.mjs --where lobsters`.

**Sources logged manually** (no public API or rate-limited): X/Twitter, LinkedIn, Substack comments, podcasts, DMs. Use `log-mention.mjs`.

## Files

| File | Purpose |
| --- | --- |
| `scan.mjs` | Auto-scanner. Run by GH Actions every 4h. |
| `log-mention.mjs` | CLI to log a manual mention from a platform `scan.mjs` can't reach. |
| `keywords.json` | Brand keywords (strong + soft) and excluded domains. |
| `state.json` | Dedup state. Append-only. URLs in `seen` won't be re-logged. |

## Usage

### Auto (default — runs in CI)

Nothing to do. The workflow at `.github/workflows/dream100-mention-radar.yml` triggers every 4 hours, runs `scan.mjs`, and commits new mentions if any are found.

### Manual scan (local)

```bash
node tools/dream100-mention-radar/scan.mjs              # scan all sources, last 2 days
node tools/dream100-mention-radar/scan.mjs --dry        # report only, don't write
node tools/dream100-mention-radar/scan.mjs --since 7d   # widen the lookback window
node tools/dream100-mention-radar/scan.mjs --source hn  # one source only
```

### Logging a manual mention (X/LinkedIn/Substack/podcast/DM)

```bash
node tools/dream100-mention-radar/log-mention.mjs \
  --where twitter \
  --who "@swyx" \
  --url "https://x.com/swyx/status/1234567890" \
  --quote "Just saw gitdealflow predict the Series A on day 31"
```

Required: `--where`, `--who`, `--url`. Optional: `--quote`, `--title`, `--keyword`.

## Adding a new auto-source

Add a `scanX(kws)` function in `scan.mjs` that returns an array of:

```ts
{
  platform: string,         // e.g. "Mastodon"
  who: string,              // handle or display name
  title: string,            // up to 140 chars
  url: string,              // canonical URL — used for dedup
  quote: string,            // up to 280 chars
  detectedAt: number,       // Date.now()
  keyword: string,          // which keyword matched
  strength: "strong" | "soft",
  rawCreatedAt: number,     // when the post was published (ms)
}
```

Then add `"yourSource"` to the source list in `main()` and to the `argv.source` whitelist.

## Anonymity rule

The reply playbook in `marketing/dream100-mentions-log.md` enforces the project-wide anonymity rule (no founder face/voice/name, synthetic voice OK). Replies should always be:

- "we / the panel / the methodology" — never "I"
- Number-first, link-second
- Cite the methodology under CC BY 4.0 to externalize the proof
- Decline live appearances; offer Cartesia-narrated prerecorded segments

## Rate-limit notes

- **HN Algolia:** ~10 RPS, no auth. We make ~10 calls per run (1 per keyword) — well under.
- **Reddit:** unauthenticated quota is 10 RPM with a User-Agent. Strong-keyword-only scanning keeps us under.
- **Lobsters:** no published quota, but we hit 1× per strong keyword.
- **GitHub:** 30 RPM unauthenticated, 5000 RPH with `GITHUB_TOKEN`. We use the token in CI.

If a source returns non-200, it's logged to stderr and skipped — the rest of the run continues.

## Why this matters

> "When someone *else* puts your name in front of *their* audience, you have a 4-hour window where the algorithm amplifies your reply into the original post's reach. Miss the window and your reply lands in a separate, much smaller conversation." — Brunson, paraphrased

Score impact: this closes the gap on Traffic Secrets Ch 5 (was 90/100, projected 100/100 once a real reply lands inside the SLA).
