# Appendix — A 90-Minute Replication Walkthrough

This appendix takes you from a fresh laptop to a verified rank against the live GitDealFlow leaderboard in roughly ninety minutes. The procedure is intentionally hand-held. If at the end of the appendix your computed Scout Score for the chosen organization differs from the live leaderboard by more than five points, write to me and I will help debug — but I have run this with several dozen first-time readers and the typical first-pass success rate is around eighty per cent on the first try and ninety-five per cent on the second.

The appendix uses Modal Labs as the worked example. You can substitute any organization on the live leaderboard, but Modal is well-documented in the prior chapters and well-suited to first-pass replication.

## What you need

Before you start the timer, you should have:

1. **A laptop with Python 3.10 or later installed.** Most macOS and Linux machines already have this; on Windows install from python.org. Verify with `python3 --version`.
2. **A GitHub personal access token with read-only scopes.** Generate at `https://github.com/settings/tokens?type=beta`. Select "Public repositories (read-only)" and "Read metadata". No write scopes needed. Set a one-month expiry — you can re-generate later. Save the token to a file or password manager; you will only see it once.
3. **A Libraries.io API key.** Sign up at `libraries.io` (free), confirm email, and copy the API key from `libraries.io/account`. The free tier is one request per second, more than enough for this walkthrough.
4. **The `requests` Python library.** Install with `pip install requests`. That is the only dependency.
5. **A terminal.** macOS Terminal, Linux gnome-terminal, or Windows PowerShell are all fine.

If any of these are not in place, set them up now. The walkthrough assumes them.

## Minute zero — set up the environment

Open a terminal. Create a working directory and a Python file:

```bash
mkdir gdf-replication
cd gdf-replication
touch signals.py
```

Open `signals.py` in your editor. Paste this scaffolding at the top:

```python
import os
import requests
from datetime import datetime, timedelta

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN") or "PASTE_TOKEN_HERE"
LIBRARIES_IO_KEY = os.environ.get("LIBRARIES_IO_KEY") or "PASTE_KEY_HERE"

ORG = "modal-labs"
REPO = "modal-client"

GH_HEADERS = {"Authorization": f"Bearer {GITHUB_TOKEN}"}
```

Replace the `PASTE_*_HERE` placeholders with your actual tokens, or set the environment variables in your shell — your preference. The script will not work without both.

Verify the GitHub token works:

```python
def verify_token():
    r = requests.get("https://api.github.com/rate_limit", headers=GH_HEADERS)
    r.raise_for_status()
    print(f"Rate limit remaining: {r.json()['rate']['remaining']}")

verify_token()
```

Run with `python3 signals.py`. You should see "Rate limit remaining: 4990" or similar. If you see "401 Unauthorized" your token is wrong; regenerate it.

That is the setup. We are at minute five.

## Minutes five to fifteen — primitive 1, the commit fetcher

Add this function to `signals.py`:

```python
def fetch_commits(org, repo, since, until):
    meta = requests.get(
        f"https://api.github.com/repos/{org}/{repo}",
        headers=GH_HEADERS
    ).json()
    default_branch = meta["default_branch"]

    url = f"https://api.github.com/repos/{org}/{repo}/commits"
    params = {
        "sha": default_branch,
        "since": since.isoformat() + "Z",
        "until": until.isoformat() + "Z",
        "per_page": 100,
    }
    commits = []
    while url:
        r = requests.get(url, params=params, headers=GH_HEADERS)
        r.raise_for_status()
        commits.extend(r.json())
        url = r.links.get("next", {}).get("url")
        params = {}
    return commits
```

Test it by pulling commits from the last seven days:

```python
recent = fetch_commits(ORG, REPO, datetime.utcnow() - timedelta(days=7), datetime.utcnow())
print(f"Recent 7-day commits on {ORG}/{REPO}: {len(recent)}")
```

Run again. You should see a count somewhere between twenty and two hundred, depending on the week. If you get zero, double-check the `ORG` and `REPO` strings — `modal-labs/modal-client` is the correct path.

That is primitive 1. We are at minute fifteen.

## Minutes fifteen to twenty-five — primitive 2, the contributor classifier

Add the classifier:

```python
KNOWN_BOTS = {
    "dependabot", "renovate", "renovate-bot", "github-actions",
    "copilot", "stale", "imgbot", "mergify", "mergify-bot",
    "release-please", "snyk-bot", "allcontributors",
}

def classify_author(commit):
    author = commit.get("author")
    if not author:
        return "unknown"
    login = (author.get("login") or "").lower()
    if login.endswith("[bot]"):
        return "bot"
    if login in KNOWN_BOTS:
        return "bot"
    return "human"
```

Test it by counting humans in the recent commits:

```python
human_count = sum(1 for c in recent if classify_author(c) == "human")
bot_count = sum(1 for c in recent if classify_author(c) == "bot")
print(f"Human commits: {human_count}, bot commits: {bot_count}")
```

For Modal, you should see a roughly ninety-to-ten ratio of humans to bots. If your ratio is much different, your bot list is incomplete or the repository's bot population is unusual.

We are at minute twenty-five.

## Minutes twenty-five to forty — Signal 1

Implement Signal 1 in full:

```python
def signal_1():
    now = datetime.utcnow()
    windows = [
        (now - timedelta(days=14), now),
        (now - timedelta(days=28), now - timedelta(days=14)),
        (now - timedelta(days=42), now - timedelta(days=28)),
    ]
    counts = []
    for since, until in windows:
        commits = fetch_commits(ORG, REPO, since, until)
        humans = [c for c in commits if classify_author(c) == "human"]
        counts.append(len(humans))

    current, prior, prior_prior = counts
    print(f"Commits — current: {current}, prior: {prior}, prior-prior: {prior_prior}")

    if prior < 10:
        return {"fires": False, "reason": "absolute_floor", "score": 0}

    acceleration = (current - prior) / prior
    confirmed = current > prior and prior > prior_prior
    fires = acceleration > 2.0 and confirmed

    score = min(100, max(0, acceleration * 50)) if confirmed else 0
    return {
        "fires": fires,
        "acceleration_pct": acceleration * 100,
        "two_period_confirmed": confirmed,
        "score": score,
    }

result_1 = signal_1()
print(f"Signal 1 fires: {result_1['fires']}, score: {result_1['score']:.1f}")
```

Run it. The numbers will be specific to the current week — Modal's commit cadence varies. The score is what we will use later in the composite.

If your run takes more than fifteen seconds, you have a slow internet connection or you are being rate-limited. The free GitHub tier rate-limits at five thousand requests per hour, which is plenty for this walkthrough but can be exhausted by aggressive concurrent scripts.

We are at minute forty.

## Minutes forty to fifty-five — Signal 2

Implement Signal 2:

```python
def signal_2():
    now = datetime.utcnow()
    long_lookback = fetch_commits(ORG, REPO, now - timedelta(days=180), now - timedelta(days=60))
    recent_60 = fetch_commits(ORG, REPO, now - timedelta(days=60), now)
    recent_14 = fetch_commits(ORG, REPO, now - timedelta(days=14), now)

    prior_logins = {c["author"]["login"] for c in long_lookback
                    if c.get("author") and classify_author(c) == "human"}
    recent_logins = {c["author"]["login"] for c in recent_60
                     if c.get("author") and classify_author(c) == "human"}
    new_authors = recent_logins - prior_logins

    recent_14_logins = {c["author"]["login"] for c in recent_14
                        if c.get("author") and classify_author(c) == "human"}
    new_in_14 = recent_14_logins & new_authors

    score = min(100, len(new_in_14) * 20)
    fires = len(new_in_14) >= 4
    return {
        "fires": fires,
        "new_in_14": list(new_in_14),
        "count": len(new_in_14),
        "score": score,
    }

result_2 = signal_2()
print(f"Signal 2 fires: {result_2['fires']}, score: {result_2['score']}, new authors: {result_2['new_in_14']}")
```

Run. The new-authors list is the most interesting output of the entire walkthrough — these are the names of recent contributors. If the firing is real, you can paste any of them into LinkedIn search and find recent Modal hires. Try it. The first time you do this, the signal becomes viscerally real.

We are at minute fifty-five.

## Minutes fifty-five to sixty-five — Signal 6

Skip ahead to Signal 6 because the dependency-adoption signal is the second-most-honest signal in the book, and Modal happens to be a developer-tools company with an active npm package. Implement:

```python
def signal_6():
    package = "@modal-labs/cli"  # Modal's npm-published CLI
    url = f"https://libraries.io/api/npm/{package}/dependent_repositories"
    params = {"api_key": LIBRARIES_IO_KEY, "per_page": 100, "page": 1}
    dependents = []
    while True:
        r = requests.get(url, params=params)
        if r.status_code == 404:
            return {"fires": False, "reason": "package_not_indexed", "score": None}
        r.raise_for_status()
        page = r.json()
        if not page:
            break
        dependents.extend(page)
        if len(page) < 100:
            break
        params["page"] += 1

    now = datetime.utcnow()
    def parse_pushed(d):
        try:
            return datetime.fromisoformat(d["pushed_at"].replace("Z", ""))
        except Exception:
            return None

    recent = [d for d in dependents
              if parse_pushed(d) and parse_pushed(d) > now - timedelta(days=30)]
    prior = [d for d in dependents
             if parse_pushed(d) and now - timedelta(days=60) < parse_pushed(d) <= now - timedelta(days=30)]

    if len(recent) < 20:
        return {"fires": False, "reason": "absolute_floor", "score": 0}
    if not prior:
        return {"fires": False, "reason": "no_prior", "score": 0}

    ratio = len(recent) / len(prior)
    score = min(100, max(0, (ratio - 1) * 30))
    return {
        "fires": ratio > 3.0,
        "ratio": ratio,
        "recent_count": len(recent),
        "prior_count": len(prior),
        "score": score,
    }

result_6 = signal_6()
print(f"Signal 6 fires: {result_6['fires']}, score: {result_6.get('score')}")
```

If Modal does not publish a primary npm package under the name above (the canonical name has changed at least once historically), you may get a `package_not_indexed` result. Substitute their primary published package — you can find it at `npmjs.com/~modal-labs` or in their docs.

We are at minute sixty-five.

## Minutes sixty-five to seventy-five — composing the score

Compute the partial Scout Score from Signals 1, 2, and 6:

```python
def partial_score(s1, s2, s6):
    weights = {"s1": 0.22, "s2": 0.20, "s6": 0.14}
    s6_score = s6.get("score") or 0
    weighted = (
        s1["score"] * weights["s1"] +
        s2["score"] * weights["s2"] +
        s6_score * weights["s6"]
    )
    total_weight = sum(weights.values())
    normalized = weighted / total_weight
    return normalized

score = partial_score(result_1, result_2, result_6)
print(f"\nPartial Scout Score (signals 1, 2, 6): {score:.1f}")
```

Now go to the GitDealFlow leaderboard at `signals.gitdealflow.com` and look up the same organization. The full Scout Score there will be in the same approximate range, but slightly different because it includes the four signals we did not implement in this appendix (3, 4, 5, 7). The relative magnitude should match: if your partial score is in the seventy-to-ninety range, the leaderboard will show a high overall rank; if your partial score is in the thirty-to-fifty range, the rank will be in the middle of the list.

We are at minute seventy-five.

## Minutes seventy-five to ninety — verification and inspection

Spend the last fifteen minutes inspecting the output. Read the new-author list from Signal 2 and try to resolve at least three of them on LinkedIn. Read the firing reason for Signal 1 — was it the acceleration or the volume floor? Look at the commit log on `github.com/modal-labs/modal-client/commits` and confirm the recent commits look like real engineering work rather than dependency bumps.

The single most useful exercise at this point is to compare your computed numbers to a public Series A announcement timeline. Modal Labs announced its Series A on October 19, 2023. If you replicate this appendix on Modal as it stood in mid-September 2023 (you would need historical data to do this, which is harder), you would see Signal 1 firing strongly. The data has moved on, but the historical pattern is in the public record and is verifiable by date-bounding your `since` and `until` parameters.

If your numbers feel directionally off — much higher or much lower than the leaderboard would suggest — the most common cause is one of three things:

**Wrong repository.** Modal has multiple repositories. The signal is most informative on `modal-client`, which is their primary product repository. Computing on `modal-examples` or `modal-docs` will give different and less informative numbers.

**Stale token.** GitHub personal tokens expire. If you generated yours weeks ago, regenerate.

**Rate-limit exhaustion.** If you have run the script several times and exhausted your hourly quota, the API will start returning 403s. Wait an hour and re-run.

If your numbers feel directionally right but you want to validate against the live leaderboard, write to `signal@gitdealflow.com` with your numbers and I will pull the corresponding leaderboard score for that week and you can compare.

We are at minute ninety. You have, with a $0 budget, a personal access token, and roughly a hundred lines of Python, replicated a meaningful portion of the GitDealFlow signal stack on a real organization. You can now run this against any organization on GitHub. You have also verified that the methodology is real — you computed the numbers yourself from raw public data, and the numbers match the published methodology.

That is the deal this book makes. Public data, fully replicable, no licence, no scraping, no proprietary anything. The seven-signal stack is yours now. The leaderboard, the MCP server, and the email digest are conveniences that automate what you have just done by hand. They are not where the value lives. The value lives in the methodology, and the methodology is in your hands.

Use it well.
