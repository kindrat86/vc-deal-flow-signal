#!/usr/bin/env python3
"""Vercel deployment watchdog — detect failures and auto-redeploy real ones.

Polls recent deployments across the three tracked projects. For each
deployment in state ERROR:

  - If a READY deployment exists for the same commit SHA → log as a benign
    race casualty and do nothing (a sibling deploy already shipped).
  - Otherwise → POST /v13/deployments with `deploymentId` to redeploy,
    preserving the original target (production / preview).

State (which (project, sha) pairs we've already redeployed) lives in
vercel-watchdog.state.json so we don't loop forever on a genuinely broken
build. After MAX_REDEPLOYS_PER_SHA attempts, the watchdog stops retrying
and just logs ALERT for human follow-up.

Auth: reads the token from the Vercel CLI's auth.json.
Schedule: com.gitdealflow.vercel-watchdog.plist (every 15 min).
Usage:
    python3 vercel-watchdog.py            # poll + auto-fix
    python3 vercel-watchdog.py --dry-run  # poll + report only, no API writes
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STATE_FILE = os.path.join(SCRIPT_DIR, "vercel-watchdog.state.json")
AUTH_FILE = os.path.expanduser(
    "~/Library/Application Support/com.vercel.cli/auth.json"
)

TEAM_ID = "team_VqIhc5enyfXN91ZlfQhyz2bC"
PROJECTS = [
    {"id": "prj_oHjfXDFOz4gHCnrY4U1zUDa6TIzZ", "name": "vc-deal-flow-signal"},
    {"id": "prj_M3iknyIgZ8JMxPZzEPTWdSjm4l3E", "name": "landing"},
    {"id": "prj_s0JL6C4uFTmt83OnzAZDgeMDnlaU", "name": "pseo-site"},
]

LOOKBACK_HOURS = 24
MAX_REDEPLOYS_PER_SHA = 2
MAX_REDEPLOYS_PER_CYCLE = 5  # Hard cap per run as runaway-loop safety belt.

# Substrings in readyStateReason that indicate the failure can never be fixed
# by retrying the same deployment — needs a human / fresh commit instead.
PERMANENT_FAILURE_HINTS = (
    "must have access to the team",  # git author not on team
    "deployment_can_never_deploy",
    "Source files for project not found",
    # CLI prebuilt upload was missing files; same tgz on retry == same error.
    "Config file was not found",
)


def log(msg: str) -> None:
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    print(f"{ts} {msg}", flush=True)


def load_token() -> str:
    with open(AUTH_FILE) as f:
        return json.load(f)["token"]


def load_state() -> dict:
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"attempts": {}}


def save_state(state: dict) -> None:
    tmp = STATE_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(state, f, indent=2, sort_keys=True)
    os.replace(tmp, STATE_FILE)


def vercel_api(token: str, method: str, path: str, body: dict | None = None) -> dict:
    url = f"https://api.vercel.com{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def list_deployments(token: str, project_id: str) -> list[dict]:
    since_ms = int(time.time() * 1000) - LOOKBACK_HOURS * 3600 * 1000
    path = (
        f"/v6/deployments?projectId={project_id}"
        f"&teamId={TEAM_ID}&limit=50&since={since_ms}"
    )
    return vercel_api(token, "GET", path).get("deployments", [])


def commit_sha(d: dict) -> str | None:
    meta = d.get("meta") or {}
    return (
        meta.get("githubCommitSha")
        or meta.get("gitlabCommitSha")
        or meta.get("bitbucketCommitSha")
        # Vercel CLI deploys carry the commit under the generic gitCommitSha key.
        or meta.get("gitCommitSha")
    )


def redeploy(token: str, project_name: str, deployment_id: str, target: str | None) -> dict:
    body: dict = {"name": project_name, "deploymentId": deployment_id}
    if target:
        body["target"] = target
    return vercel_api(
        token, "POST", f"/v13/deployments?teamId={TEAM_ID}&forceNew=1", body
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Report failures but don't redeploy or write state",
    )
    args = parser.parse_args()

    token = load_token()
    state = load_state()
    attempts = state.setdefault("attempts", {})

    redeploy_count = 0
    error_count = 0
    benign_count = 0
    alert_count = 0
    permanent_count = 0

    for project in PROJECTS:
        try:
            deployments = list_deployments(token, project["id"])
        except urllib.error.HTTPError as e:
            log(f"ERROR list_deployments {project['name']}: {e.code} {e.reason}")
            continue

        by_sha: dict[str, dict] = defaultdict(lambda: {"error": [], "ready": []})
        for d in deployments:
            sha = commit_sha(d) or d.get("uid") or ""
            state_str = d.get("state") or d.get("readyState")
            if state_str == "ERROR":
                by_sha[sha]["error"].append(d)
            elif state_str == "READY":
                by_sha[sha]["ready"].append(d)

        for sha, group in by_sha.items():
            if not group["error"]:
                continue
            error_count += len(group["error"])
            sha_short = sha[:7] if sha else "<none>"

            if group["ready"]:
                benign_count += len(group["error"])
                log(
                    f"BENIGN {project['name']} sha={sha_short} "
                    f"errors={len(group['error'])} ready={len(group['ready'])} — race casualty"
                )
                continue

            latest = max(group["error"], key=lambda x: x.get("created", 0))
            dep_id = latest.get("uid")
            target = latest.get("target")
            source = latest.get("source") or ""
            # /v6/deployments listing returns errorMessage; readyStateReason
            # only ships in the per-deployment GET. Check both.
            reason = (latest.get("errorMessage") or latest.get("readyStateReason") or "")
            always_refuse = bool(latest.get("alwaysRefuseToBuild"))
            attempt_key = f"{project['id']}:{sha}"
            past = attempts.get(attempt_key, {"count": 0, "last_dep": None})

            # Never redeploy a deployment that is itself already a redeploy —
            # otherwise the watchdog amplifies its own failures into a loop.
            if source == "redeploy":
                permanent_count += 1
                log(
                    f"SKIP-REDEPLOY-OF-REDEPLOY {project['name']} sha={sha_short} "
                    f"dep={dep_id} target={target} — already a redeploy, leaving alone"
                )
                continue

            if redeploy_count >= MAX_REDEPLOYS_PER_CYCLE:
                alert_count += 1
                log(
                    f"CYCLE-CAP {project['name']} sha={sha_short} dep={dep_id} "
                    f"target={target} — hit MAX_REDEPLOYS_PER_CYCLE={MAX_REDEPLOYS_PER_CYCLE}"
                )
                continue

            if always_refuse or any(h in reason for h in PERMANENT_FAILURE_HINTS):
                permanent_count += 1
                log(
                    f"PERMANENT {project['name']} sha={sha_short} dep={dep_id} "
                    f"target={target} reason={reason!r} — needs human (no API retry possible)"
                )
                continue

            if past["count"] >= MAX_REDEPLOYS_PER_SHA:
                alert_count += 1
                log(
                    f"ALERT {project['name']} sha={sha_short} dep={dep_id} "
                    f"target={target} attempts={past['count']} — max retries hit, manual fix needed"
                )
                continue

            if args.dry_run:
                log(
                    f"DRY-RUN would-redeploy {project['name']} sha={sha_short} "
                    f"dep={dep_id} target={target} attempt={past['count'] + 1}"
                )
                continue

            try:
                result = redeploy(token, project["name"], dep_id, target)
                redeploy_count += 1
                past["count"] += 1
                past["last_dep"] = result.get("id") or result.get("uid")
                past["last_at"] = datetime.now(timezone.utc).isoformat()
                attempts[attempt_key] = past
                log(
                    f"REDEPLOY {project['name']} sha={sha_short} from={dep_id} "
                    f"to={past['last_dep']} target={target} attempt={past['count']}"
                )
            except urllib.error.HTTPError as e:
                detail = e.read().decode("utf-8", "replace")[:500]
                log(
                    f"ERROR redeploy {project['name']} dep={dep_id}: "
                    f"{e.code} {e.reason} {detail}"
                )

    if not args.dry_run:
        save_state(state)
    log(
        f"SUMMARY errors={error_count} benign={benign_count} permanent={permanent_count} "
        f"redeployed={redeploy_count} alerts={alert_count} dry_run={args.dry_run}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
