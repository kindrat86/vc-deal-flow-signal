#!/usr/bin/env bash
# Pre-deploy gate for gitdealflow.com landing site.
#
# VALIDATION ONLY (default):
#   bash scripts/release-landing.sh
#   → Regenerates sitemaps, checks drift, validates locally.
#   → Never deploys.
#
# SAFE TOOL CHECK:
#   bash scripts/release-landing.sh --check-deploy-tools
#   → Runs all sitemap gates AND resolves/verifies the Vercel CLI.
#   → Never deploys.  Useful as a pre-flight before a production
#     deploy window.
#
# PRODUCTION DEPLOY:
#   bash scripts/release-landing.sh --prod
#   → Runs all gates, resolves Vercel CLI, then deploys.
#   → Fails closed on any error.
#
# VERCEL CLI OVERRIDE:
#   VERCEL_BIN=/path/to/vercel bash scripts/release-landing.sh --prod
#   → Uses the specified binary instead of auto-discovery.
#
# AUTHORIZATION BOUNDARY:
#   This script is a convenience wrapper — it cannot technically
#   prevent a user with unrestricted Vercel credentials from
#   running `vercel --prod` directly.  Production deployments
#   should originate from the protected `main` branch through the
#   GitHub/Vercel integration or be performed only by authorized
#   maintainers.
#
#   The GitHub Sitemap Gate workflow
#   (`.github/workflows/sitemap-gate.yml`) is the CI enforcement
#   layer.  Mark the `sitemap` job as a required status check in
#   the branch-protection rules for `main`.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LANDING_DIR="$REPO_DIR/landing"

# Ensure ~/.local/bin and common global-package directories are
# on PATH for non-interactive shells (login shells get this from
# .profile / .zshrc, but `bash -c` and CI runners often do not).
for extra in "$HOME/.local/bin" "$HOME/.hermes/node/bin" "/opt/homebrew/bin" "/usr/local/bin"; do
    if [[ -d "$extra" && ":$PATH:" != *":$extra:"* ]]; then
        PATH="$extra:$PATH"
    fi
done
export PATH

# ── Usage ─────────────────────────────────────────────────────

USAGE="Usage: bash scripts/release-landing.sh [--check-deploy-tools|--prod]
  (no argument)           Validate sitemaps only; never deploy.
  --check-deploy-tools    Validate sitemaps and verify Vercel CLI
                          resolution; never deploy.
  --prod                  Validate sitemaps, verify Vercel CLI,
                          then deploy to production."

# ── Argument parsing ──────────────────────────────────────────

DO_DEPLOY=false
DO_TOOL_CHECK=false

if [[ $# -eq 0 ]]; then
    echo "=== Release Gate (validation only — no deploy) ==="
elif [[ "${1:-}" == "--prod" ]]; then
    DO_DEPLOY=true
    echo "=== Release Gate (PRODUCTION DEPLOY) ==="
elif [[ "${1:-}" == "--check-deploy-tools" ]]; then
    DO_TOOL_CHECK=true
    echo "=== Release Gate (deploy-tool check — no deploy) ==="
else
    echo "ERROR: Unknown argument '${1}'" >&2
    echo "$USAGE" >&2
    exit 1
fi

# ── Vercel CLI resolution ─────────────────────────────────────

# Resolved Vercel CLI path (cached after first successful resolution)
VERCEL_CLI=""

resolve_vercel_cli() {
    # Return early if already resolved
    if [[ -n "${VERCEL_CLI:-}" ]]; then
        return 0
    fi

    # 1. Explicit override
    if [[ -n "${VERCEL_BIN:-}" ]]; then
        if [[ ! -x "$VERCEL_BIN" ]]; then
            echo "ERROR: VERCEL_BIN='$VERCEL_BIN' is not executable" >&2
            return 1
        fi
        if ! "$VERCEL_BIN" --version &>/dev/null; then
            echo "ERROR: VERCEL_BIN='$VERCEL_BIN' does not appear to be the Vercel CLI" >&2
            echo "  Run: $VERCEL_BIN --version  (should print a version number)" >&2
            return 1
        fi
        VERCEL_CLI="$VERCEL_BIN"
        return 0
    fi

    # 2. Try command -v (respects PATH)
    local found
    found="$(command -v vercel 2>/dev/null || true)"
    if [[ -n "$found" && -x "$found" ]]; then
        if "$found" --version &>/dev/null; then
            VERCEL_CLI="$found"
            return 0
        fi
    fi

    # 3. Search common global-package directories
    local search_dirs=(
        "$HOME/.local/bin"
        "$HOME/.hermes/node/bin"
        "/opt/homebrew/bin"
        "/usr/local/bin"
    )
    # Also check npm/pnpm/yarn global bin directories
    for pm in npm pnpm yarn; do
        local gbin
        gbin="$(command -v "$pm" 2>/dev/null && "$pm" bin -g 2>/dev/null || true)"
        if [[ -n "$gbin" && -d "$gbin" ]]; then
            search_dirs+=("$gbin")
        fi
    done

    for dir in "${search_dirs[@]}"; do
        local candidate="$dir/vercel"
        if [[ -x "$candidate" ]]; then
            if "$candidate" --version &>/dev/null; then
                VERCEL_CLI="$candidate"
                return 0
            fi
        fi
    done

    # 4. Not found — actionable error
    echo "" >&2
    echo "ERROR: Vercel CLI not found in this non-interactive environment." >&2
    echo "" >&2
    echo "The Vercel CLI is required for production deployments." >&2
    echo "It was not found via 'command -v vercel' or in common" >&2
    echo "global-package directories." >&2
    echo "" >&2
    echo "Fix options:" >&2
    echo "  1. Set VERCEL_BIN to the full path:" >&2
    echo "     VERCEL_BIN=/path/to/vercel bash scripts/release-landing.sh --prod" >&2
    echo "" >&2
    echo "  2. Add the global bin directory to your PATH:" >&2
    echo "     export PATH=\"\$HOME/.local/bin:\$PATH\"" >&2
    echo "     (Add this to your ~/.bashrc or ~/.zshrc)" >&2
    echo "" >&2
    echo "  3. Install Vercel CLI globally:" >&2
    echo "     npm install -g vercel" >&2
    echo "" >&2
    echo "The vercel binary must respond to: vercel --version" >&2
    return 1
}

# ── Step 1: Regenerate sitemaps ──────────────────────────────

run_sitemap_gates() {
    echo ""
    echo "[1/3] Regenerating sitemaps..."
    cd "$LANDING_DIR"
    python3 _rebuild_sitemap.py

    # ── Step 2: Check for drift ───────────────────────────────

    echo ""
    echo "[2/3] Checking for sitemap drift..."

    SITEMAP_FILES=(
        sitemap.xml
        sitemap-index.xml
        sitemap-pages.xml
        image-sitemap.xml
    )

    if ! git -C "$REPO_DIR" diff --exit-code -- \
        "${SITEMAP_FILES[@]/#/landing/}"; then
        echo ""
        echo "❌ SITEMAP DRIFT DETECTED"
        echo ""
        echo "The sitemap generator produced different output than what is"
        echo "committed.  HTML pages were added, removed, or renamed without"
        echo "updating the sitemaps."
        echo ""
        echo "Review the diff above.  If it looks correct, commit it:"
        echo "  cd landing"
        echo "  git add ${SITEMAP_FILES[*]}"
        echo "  git commit -m 'chore: regenerate sitemaps'"
        echo ""
        exit 1
    fi
    echo "  ✅ Sitemap files match generated output"

    # ── Step 3: Validate sitemap tree ─────────────────────────

    echo ""
    echo "[3/3] Validating sitemap tree..."

    if ! python3 _validate_sitemap.py --local-only; then
        echo ""
        echo "❌ SITEMAP VALIDATION FAILED — fix the errors above before deploying."
        exit 1
    fi

    echo ""
}

# ── Main ─────────────────────────────────────────────────────

run_sitemap_gates

if $DO_DEPLOY || $DO_TOOL_CHECK; then
    echo "--- Vercel CLI resolution ---"
    if resolve_vercel_cli; then
        ver="$("$VERCEL_CLI" --version 2>&1 || echo "unknown")"
        echo "  Resolved: $VERCEL_CLI"
        echo "  Version:  $ver"
        echo "  ✅ Sitemap gates passed"
    else
        echo "  ❌ Vercel CLI resolution failed"
        exit 1
    fi
    echo ""
fi

if $DO_TOOL_CHECK; then
    echo "=== ✅ All checks passed — deployment tools verified ==="
    echo ""
    echo "Deployment was NOT performed (--check-deploy-tools mode)."
    echo ""
    echo "To deploy, run:"
    echo "  bash scripts/release-landing.sh --prod"
    exit 0
fi

if $DO_DEPLOY; then
    echo "=== ✅ All gates passed — deploying to production ==="
    echo ""
    echo "This will deploy to https://gitdealflow.com"
    echo "Press Ctrl-C within 5 seconds to cancel..."
    sleep 5

    cd "$LANDING_DIR"
    "$VERCEL_CLI" --prod --yes

    echo ""
    echo "=== Deploy complete ==="
    echo ""
    echo "Post-deploy validation:"
    echo "  cd landing && python3 _validate_sitemap.py"
    echo ""
    echo "For a preview deployment, validate against the preview URL:"
    echo "  cd landing && python3 _validate_sitemap.py --base https://YOUR-DEPLOY.vercel.app"
    exit 0
fi

# Validation-only mode
echo "=== ✅ All gates passed — ready for deploy ==="
echo ""
echo "To check deployment tools without deploying:"
echo "  bash scripts/release-landing.sh --check-deploy-tools"
echo ""
echo "To deploy, run:"
echo "  bash scripts/release-landing.sh --prod"
echo ""
echo "After deploy, validate production:"
echo "  cd landing && python3 _validate_sitemap.py"
