#!/usr/bin/env bash
# Pre-deploy gate for gitdealflow.com landing site.
#
# VALIDATION ONLY (default):
#   bash scripts/release-landing.sh
#   → Regenerates sitemaps, checks drift, validates locally.
#   → Never deploys.
#
# PRODUCTION DEPLOY:
#   bash scripts/release-landing.sh --prod
#   → Runs all gates first.  Only invokes `vercel --prod --yes` if
#     every check passes.  Fails closed on any error.
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

# ── Parse --prod flag ─────────────────────────────────────────

DO_DEPLOY=false
if [[ "${1:-}" == "--prod" ]]; then
    DO_DEPLOY=true
    echo "=== Release Gate (PRODUCTION DEPLOY) ==="
elif [[ -z "${1:-}" ]]; then
    echo "=== Release Gate (validation only — no deploy) ==="
else
    echo "ERROR: Unknown argument '${1}'" >&2
    echo "Usage: bash scripts/release-landing.sh [--prod]" >&2
    echo "  (no argument)  Validate sitemaps only, never deploy" >&2
    echo "  --prod         Run all gates, then deploy to production" >&2
    exit 1
fi

# ── Step 1: Regenerate sitemaps ──────────────────────────────

echo ""
echo "[1/3] Regenerating sitemaps..."
cd "$LANDING_DIR"
python3 _rebuild_sitemap.py

# ── Step 2: Check for drift ──────────────────────────────────

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

# ── Step 3: Validate sitemap tree ────────────────────────────

echo ""
echo "[3/3] Validating sitemap tree..."

if ! python3 _validate_sitemap.py --local-only; then
    echo ""
    echo "❌ SITEMAP VALIDATION FAILED — fix the errors above before deploying."
    exit 1
fi

echo ""

# ── Deploy (only with --prod) ────────────────────────────────

if $DO_DEPLOY; then
    echo "=== ✅ All gates passed — deploying to production ==="
    echo ""
    
    # Final confirmation
    echo "This will deploy to https://gitdealflow.com"
    echo "Press Ctrl-C within 5 seconds to cancel..."
    sleep 5
    
    cd "$LANDING_DIR"
    vercel --prod --yes
    
    echo ""
    echo "=== Deploy complete ==="
    echo ""
    echo "Post-deploy validation:"
    echo "  cd landing && python3 _validate_sitemap.py"
    echo ""
    echo "For a preview deployment, validate against the preview URL:"
    echo "  cd landing && python3 _validate_sitemap.py --base https://YOUR-DEPLOY.vercel.app"
else
    echo "=== ✅ All gates passed — ready for deploy ==="
    echo ""
    echo "To deploy, run:"
    echo "  bash scripts/release-landing.sh --prod"
    echo ""
    echo "After deploy, validate production:"
    echo "  cd landing && python3 _validate_sitemap.py"
fi
