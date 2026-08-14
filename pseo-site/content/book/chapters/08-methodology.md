# Methodology, How to Compute Every Signal Yourself

This chapter is the formal computation procedure for every signal in the book. It is intentionally written as a working document, read it with a terminal open. By the end of the chapter you will have a script that runs all seven signals against any organization on the public GitHub REST API, with no scraping and no proprietary data licences.

## The data sources

Every signal in this book is computable from public, free, properly-rate-limited data sources. There are six:

1. The GitHub REST API at `api.github.com`. Authenticated with a personal access token, rate-limited at five thousand requests per hour. The free tier is sufficient for a watchlist of two to three hundred organizations on a weekly cadence.
2. The GitHub stargazers endpoint with the timestamp-aware accept header. Same rate limits.
3. The Libraries.io public API at `libraries.io/api`. Rate-limited at one request per second on the free tier; sufficient for the dependency-adoption signal across all major registries.
4. The npm registry at `registry.npmjs.org` for downloads counts. No authentication required, soft rate limits.
5. Public BigQuery datasets for PyPI downloads (`bigquery-public-data.pypi.file_downloads`) and the GitHub dependency graph (`bigquery-public-data.libraries_io.dependencies`). Free tier of one terabyte per month is more than enough.
6. RSS feeds, conference YouTube channels, and podcast directories for Signal 7. No formal API; standard scrape patterns apply.

That is the full data stack. There is nothing else to license, nothing else to scrape, nothing else to obtain through a private channel. Every claim in this book is recomputable by you, on a personal-budget infrastructure footprint, indefinitely, for as long as GitHub keeps the public REST API free, which it has done for the entire fifteen-year history of the platform.

## The shared computational primitives

Every signal in the book reuses three primitives. Implement these once and the per-signal code becomes a thin layer.

### Primitive 1: the paginated commit fetcher

The single most-called function in the signal stack pulls commits from a repository over a specified date range. The implementation is straightforward but has three subtleties that catch first-time implementers.

First, the GitHub commits endpoint is paginated at one hundred commits per page by default. For active repositories you will need several pages. Use the `Link` response header rather than incrementing the `page` query parameter manually, GitHub's pagination has occasional edge cases at exactly the hundred-commit boundary that the Link header handles correctly.

Second, the `since` and `until` parameters take ISO 8601 timestamps. They filter on commit-author-date, not commit-committer-date, which can differ by hours when commits are rebased. For acceleration calculations the difference is usually noise; for surgical lead-time analysis it can matter and you should be deliberate.

Third, the default branch is not always `main`. About fifteen per cent of older repositories still use `master`, and a small but non-zero percentage use a custom branch (`develop`, `production`, `default`). Pull the default branch from the repository metadata endpoint rather than assuming.

```python
def fetch_commits(org: str, repo: str, since: datetime, until: datetime, token: str):
    headers = {"Authorization": f"Bearer {token}"}
    default_branch = requests.get(
        f"https://api.github.com/repos/{org}/{repo}",
        headers=headers
    ).json()["default_branch"]

    url = f"https://api.github.com/repos/{org}/{repo}/commits"
    params = {
        "sha": default_branch,
        "since": since.isoformat() + "Z",
        "until": until.isoformat() + "Z",
        "per_page": 100,
    }
    commits = []
    while url:
        r = requests.get(url, params=params, headers=headers)
        r.raise_for_status()
        commits.extend(r.json())
        url = r.links.get("next", {}).get("url")
        params = {}  # next URLs already include params
    return commits
```

That is roughly twenty lines of Python. It is the most-called function in the stack. Every signal that depends on commit data calls it.

### Primitive 2: the contributor classifier

The contributor classifier takes a commit and decides whether the author is a human, a bot, or unclassifiable. The implementation uses three rules in order:

```python
def classify_author(commit) -> str:
    author = commit.get("author")
    if not author:
        return "unknown"
    login = author.get("login", "").lower()
    if login.endswith("[bot]"):
        return "bot"
    KNOWN_BOTS = {
        "dependabot", "renovate", "renovate-bot", "github-actions",
        "copilot", "stale", "imgbot", "mergify", "mergify-bot",
        "release-please", "snyk-bot", "allcontributors",
    }
    if login in KNOWN_BOTS:
        return "bot"
    return "human"
```

The bot list is empirically derived from inspection of the SSRN panel. New bots appear from time to time and the list should be reviewed quarterly. The GitDealFlow MCP server's `get_commit_velocity` tool maintains the canonical list and you can pull it from there if you do not want to maintain your own.

### Primitive 3: the repository metadata cache

The repository metadata endpoint (`/repos/{owner}/{repo}`) returns a payload that includes the default branch, the creation date, the size, the language, the topics, and the latest push date. Most signals need at least one of these fields. The endpoint is rate-limit-cheap but the latency is higher than other endpoints, so caching it locally with a one-hour TTL is worth the small implementation cost.

```python
@lru_cache(maxsize=1024)
def repo_metadata(org: str, repo: str, token: str):
    r = requests.get(
        f"https://api.github.com/repos/{org}/{repo}",
        headers={"Authorization": f"Bearer {token}"}
    )
    r.raise_for_status()
    return r.json()
```

That is the third primitive. Everything else is a composition.

## Signal 1, Commit Velocity Acceleration

The full computation in code:

```python
def signal_1_commit_velocity(org: str, repo: str, token: str) -> dict:
    now = datetime.utcnow()
    windows = [
        (now - timedelta(days=14), now),                          # current
        (now - timedelta(days=28), now - timedelta(days=14)),     # prior
        (now - timedelta(days=42), now - timedelta(days=28)),     # prior_prior
    ]
    counts = []
    for since, until in windows:
        commits = fetch_commits(org, repo, since, until, token)
        human_commits = [c for c in commits if classify_author(c) == "human"]
        counts.append(len(human_commits))

    current, prior, prior_prior = counts
    if prior < 10:
        return {"fires": False, "reason": "absolute_floor"}
    acceleration = (current - prior) / prior
    two_period_confirmation = current > prior and prior > prior_prior
    fires = acceleration > 2.0 and two_period_confirmation
    return {
        "fires": fires,
        "acceleration": acceleration,
        "current": current,
        "prior": prior,
        "prior_prior": prior_prior,
        "two_period_confirmation": two_period_confirmation,
    }
```

That is the complete Signal 1 implementation. Approximately twenty-five lines of code. It is reproducible against any GitDealFlow leaderboard rank within a small floating-point margin.

## Signal 2, Contributor Influx

```python
def signal_2_contributor_influx(org: str, repo: str, token: str) -> dict:
    now = datetime.utcnow()
    recent_60 = fetch_commits(org, repo, now - timedelta(days=60), now, token)
    prior_60 = fetch_commits(org, repo, now - timedelta(days=180), now - timedelta(days=60), token)

    recent_authors = {c["author"]["login"] for c in recent_60
                      if c.get("author") and classify_author(c) == "human"}
    prior_authors = {c["author"]["login"] for c in prior_60
                     if c.get("author") and classify_author(c) == "human"}
    new_authors = recent_authors - prior_authors

    recent_14 = fetch_commits(org, repo, now - timedelta(days=14), now, token)
    recent_14_authors = {c["author"]["login"] for c in recent_14
                         if c.get("author") and classify_author(c) == "human"}
    new_14 = recent_14_authors & new_authors

    prior_14 = fetch_commits(org, repo, now - timedelta(days=28), now - timedelta(days=14), token)
    prior_14_authors = {c["author"]["login"] for c in prior_14
                        if c.get("author") and classify_author(c) == "human"}
    new_prior_14 = (recent_authors - (prior_authors - prior_14_authors)) & prior_14_authors

    return {
        "fires": len(new_14) >= 4 and len(new_prior_14) >= 2,
        "new_in_recent_14": list(new_14),
        "count_recent_14": len(new_14),
        "count_prior_14": len(new_prior_14),
    }
```

The pagination cost for this signal is higher than for Signal 1 because the look-back window is longer. Budget approximately three or four times the API calls.

## Signal 3, Infrastructure Repository Buildout

```python
INFRA_KEYWORDS = ["infra", "terraform", "tofu", "helm", "k8s", "kubernetes",
                  "deploy", "release", "ci", "pipeline", "observability",
                  "runbook", "oncall", "schemas", "proto", "contracts",
                  "tools", "admin", "internal", "ops"]

INFRA_FILES = ["Chart.yaml", "kustomization.yaml", "values.yaml",
               "main.tf", "providers.tf", ".github/workflows",
               "docker-compose.yml", "skaffold.yaml"]

def classify_repo(org: str, repo: str, token: str) -> str:
    meta = repo_metadata(org, repo, token)
    name_lower = repo.lower()
    if any(kw in name_lower for kw in INFRA_KEYWORDS):
        return "infrastructure"
    contents = requests.get(
        f"https://api.github.com/repos/{org}/{repo}/contents/",
        headers={"Authorization": f"Bearer {token}"}
    ).json()
    file_names = {c["name"] for c in contents if c.get("type") == "file"}
    if file_names & set(INFRA_FILES):
        return "infrastructure"
    if "docs" in name_lower or "documentation" in name_lower:
        return "documentation"
    return "product"
```

The classifier above is heuristic; it produces a small number of false classifications that you should manually correct on the first pass. The GitDealFlow `classify_repository` MCP tool maintains a more sophisticated version that uses the README contents and the language-distribution histogram, but the heuristic above is sufficient for rough computation.

## Signal 4, Star-Velocity Detachment

```python
def signal_4_star_detachment(org: str, repo: str, token: str) -> dict:
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.star+json",
    }
    url = f"https://api.github.com/repos/{org}/{repo}/stargazers"
    params = {"per_page": 100}
    stars = []
    pages = 0
    while url and pages < 50:  # cap pages for very-popular repos
        r = requests.get(url, params=params, headers=headers)
        r.raise_for_status()
        page_stars = r.json()
        if not page_stars:
            break
        stars.extend(page_stars)
        oldest = datetime.fromisoformat(page_stars[-1]["starred_at"].replace("Z", ""))
        if oldest < datetime.utcnow() - timedelta(days=42):
            break
        url = r.links.get("next", {}).get("url")
        params = {}
        pages += 1

    star_dates = [datetime.fromisoformat(s["starred_at"].replace("Z", ""))
                  for s in stars]
    now = datetime.utcnow()
    current = sum(1 for d in star_dates if d > now - timedelta(days=14))
    prior = sum(1 for d in star_dates
                if now - timedelta(days=28) < d <= now - timedelta(days=14))
    if prior < 10:
        return {"fires": False, "reason": "absolute_floor"}
    star_accel = (current - prior) / prior
    commit_signal = signal_1_commit_velocity(org, repo, token)
    commit_accel = commit_signal.get("acceleration", 0)
    return {
        "fires": star_accel > 2.0 and commit_accel < 0.5,
        "star_acceleration": star_accel,
        "commit_acceleration": commit_accel,
    }
```

The pagination cap of fifty pages prevents a runaway loop on extremely popular repositories. For repositories above five thousand stars per fortnight you should compute the signal differently; the threshold-based approach above is best calibrated for repositories in the ten-to-five-hundred-stars-per-fortnight range.

## Signal 5, Issue Closure Cadence

```python
def signal_5_issue_cadence(org: str, repo: str, token: str) -> dict:
    now = datetime.utcnow()
    headers = {"Authorization": f"Bearer {token}"}
    url = f"https://api.github.com/repos/{org}/{repo}/issues"
    params = {
        "state": "all",
        "since": (now - timedelta(days=120)).isoformat() + "Z",
        "per_page": 100,
    }
    issues = []
    while url:
        r = requests.get(url, params=params, headers=headers)
        r.raise_for_status()
        issues.extend(r.json())
        url = r.links.get("next", {}).get("url")
        params = {}

    real_issues = [i for i in issues if "pull_request" not in i]
    closed = [i for i in real_issues if i["state"] == "closed"]

    def time_to_close_hours(issue):
        c = datetime.fromisoformat(issue["created_at"].replace("Z", ""))
        cl = datetime.fromisoformat(issue["closed_at"].replace("Z", ""))
        return (cl - c).total_seconds() / 3600

    recent = [time_to_close_hours(i) for i in closed
              if datetime.fromisoformat(i["closed_at"].replace("Z", "")) > now - timedelta(days=30)]
    prior = [time_to_close_hours(i) for i in closed
             if now - timedelta(days=60) < datetime.fromisoformat(i["closed_at"].replace("Z", "")) <= now - timedelta(days=30)]

    if len(recent) < 10:
        return {"fires": False, "reason": "volume_floor"}

    recent_median = sorted(recent)[len(recent) // 2]
    prior_median = sorted(prior)[len(prior) // 2] if prior else float("inf")

    tightening = (prior_median - recent_median) / prior_median if prior_median else 0
    return {
        "fires": tightening > 0.5,
        "recent_median_hours": recent_median,
        "prior_median_hours": prior_median,
        "tightening_pct": tightening * 100,
    }
```

Issue endpoints are noisy because GitHub conflates issues with pull requests in the API response. The `pull_request` filter is essential.

## Signal 6, Downstream Dependency Adoption

This signal depends on Libraries.io, which is a third-party service. The free tier requires registering for an API key; sign up at `libraries.io` and store the key in `LIBRARIES_IO_API_KEY`.

```python
def signal_6_dependency_adoption(package_name: str, registry: str, libraries_io_key: str) -> dict:
    url = f"https://libraries.io/api/{registry}/{package_name}/dependent_repositories"
    params = {"api_key": libraries_io_key, "per_page": 100, "page": 1}
    dependents = []
    while True:
        r = requests.get(url, params=params)
        r.raise_for_status()
        page = r.json()
        if not page:
            break
        dependents.extend(page)
        params["page"] += 1
        if len(page) < 100:
            break
    now = datetime.utcnow()
    recent = [d for d in dependents
              if "pushed_at" in d and
              datetime.fromisoformat(d["pushed_at"].replace("Z", "")) > now - timedelta(days=30)]
    prior = [d for d in dependents
             if "pushed_at" in d and
             now - timedelta(days=60) < datetime.fromisoformat(d["pushed_at"].replace("Z", "")) <= now - timedelta(days=30)]
    if len(recent) < 20:
        return {"fires": False, "reason": "absolute_floor"}
    if not prior:
        return {"fires": False, "reason": "no_prior"}
    ratio = len(recent) / len(prior)
    return {
        "fires": ratio > 3.0,
        "recent_count": len(recent),
        "prior_count": len(prior),
        "ratio": ratio,
    }
```

The Libraries.io API uses `pushed_at` as the proxy for "still actively using this dependency". This is a reasonable approximation but not perfect; a more sophisticated implementation would parse the dependency-graph BigQuery dataset directly, which is more accurate but heavier to operate.

## Signal 7, Founding-Team Public Visibility

Signal 7 is the only signal that is not fully scriptable. The procedure I recommend is a partial automation that handles the RSS-feed-based channels and leaves the manual portion small.

```python
def signal_7_visibility(founder_profiles: list, since_days: int = 60) -> dict:
    """
    founder_profiles is a list of dicts with keys:
      name, blog_rss, twitter_handle, podcast_search_terms, conference_youtube_id
    """
    output_count = 0
    by_channel = {"blog": 0, "talk": 0, "podcast": 0, "thread": 0}
    cutoff = datetime.utcnow() - timedelta(days=since_days)

    for profile in founder_profiles:
        if profile.get("blog_rss"):
            posts = parse_rss(profile["blog_rss"])
            recent = [p for p in posts if p["pub_date"] > cutoff]
            output_count += len(recent)
            by_channel["blog"] += len(recent)
        # twitter / podcast / talk channels require manual entry per current
        # API surface, populate manually from your weekly check
    return {
        "output_count": output_count,
        "by_channel": by_channel,
    }
```

The manual portion of Signal 7 should be a small-spreadsheet-grade workflow. Maintain a per-startup tab with the founder names and the RSS/handle links, and update the Twitter/podcast/talk counts manually on your weekly review. For a watchlist of twenty to thirty active candidates this takes about an hour per week.

## Composing the seven signals into a Scout Score

The Scout Score is a weighted composition of the seven signals into a single zero-to-one-hundred number. The weights, derived from the SSRN panel by maximising AUROC against the binary "Series A within ninety days" outcome, are:

| Signal | Weight |
|---|---|
| 1, Commit Velocity Acceleration | 0.22 |
| 2, Contributor Influx | 0.20 |
| 3, Infrastructure Buildout | 0.16 |
| 4, Star-Velocity Detachment | 0.10 |
| 5, Issue Closure Cadence | 0.10 |
| 6, Dependency Adoption | 0.14 |
| 7, Founding-Team Visibility | 0.08 |

A composite of this form, applied to a watchlist of two to three hundred organizations and re-computed weekly, produces a ranked list whose top decile contains a meaningful concentration of Series-A-bound companies. Concrete numbers from the SSRN panel: the top decile (twenty to thirty companies) contained sixty-eight per cent of the next-ninety-day Series A announcements among the watchlist, against a uniform-prior baseline of about ten per cent. That is a six-to-seven-times concentration ratio.

The Scout Score with these weights is implemented as the `compute_scout_score` MCP tool in the GitDealFlow server, and the output for any organization is publicly viewable on the live leaderboard. You can verify the weights yourself by re-running the signals and the weighted sum on any org and comparing to the leaderboard rank.

## What to skip and what to insist on

Three computational corners are worth cutting; three are not.

Cuttable: caching repository metadata for a full hour rather than refreshing every call. Caching the human-vs-bot classification for a full week. Skipping Signal 6 entirely for non-developer-tools organizations, the score for those organizations should weight the other six and renormalize, not zero-fill.

Not cuttable: the two-period confirmation. The bot filter on the contributor classifier. The volume floors on every signal. The pagination on the commits endpoint. The `pull_request` filter on the issues endpoint. The default-branch lookup before pulling commits.

The cuttable corners trade fidelity for compute cost; the not-cuttable corners trade correctness for compute cost, and the false-positive rate climbs sharply when you cut them. I have seen first-time implementers cut all three of the not-cuttable corners on the first pass and produce a system whose firing rate looks superficially reasonable but whose hit rate is closer to thirty per cent than to sixty-eight. Do not be that implementer. The not-cuttable list is not negotiable.

## What you have at the end

By the end of this chapter, with the code above pasted into a single Python file and a personal access token in your environment, you can run all seven signals against any organization on GitHub. The full computation for one organization takes between thirty seconds and two minutes depending on repository activity and rate-limit pressure. For a watchlist of two hundred organizations, budget two to four hours per weekly run.

The next chapter is the replication appendix. It walks you through running the computation on a single organization, end to end, and verifying the output against the live GitDealFlow leaderboard. Before you turn the page, you should have a Python environment with `requests` installed, a personal access token at `https://github.com/settings/tokens` with read-only scopes, and a Libraries.io API key from `libraries.io`. The appendix takes ninety minutes when you have those three things in place.
