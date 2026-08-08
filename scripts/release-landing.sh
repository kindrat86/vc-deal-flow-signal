#!/usr/bin/env bash
# Pre-deploy gate for gitdealflow.com landing site.
#
# Run this BEFORE `vercel --prod --yes` to ensure the sitemap is
# regenerated, validated, and committed.  The same checks run in CI
# (`.github/workflows/sitemap-gate.yml`) on PRs and pushes to main.
#
# Usage:
#   bash scripts/release-landing.sh
#
# Exit 0 = ready to deploy.  Non-zero = fix the reported issue first.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LANDING_DIR="$(cd "$SCRIPT_DIR/../landing" && pwd)"

echo "=== Sitemap Gate ==="

# 1. Regenerate sitemap from current file inventory
echo ""
echo "[1/3] Regenerating sitemap..."
cd "$LANDING_DIR"
python3 _rebuild_sitemap.py

# 2. Check for uncommitted sitemap changes
echo ""
echo "[2/3] Checking for sitemap drift..."
if ! git diff --exit-code -- \
    sitemap.xml sitemap-index.xml sitemap-pages.xml image-sitemap.xml; then
    echo ""
    echo "❌ SITEMAP DRIFT DETECTED"
    echo ""
    echo "The sitemap generator produced changes.  HTML pages were added,"
    echo "removed, or renamed without updating the sitemap."
    echo ""
    echo "Review the diff above.  If it looks correct, commit it:"
    echo "  cd landing"
    echo "  git add sitemap.xml sitemap-index.xml sitemap-pages.xml image-sitemap.xml"
    echo "  git commit -m 'chore: regenerate sitemaps'"
    echo ""
    exit 1
fi
echo "  ✅ Sitemap files match generated output"

# 3. Validate sitemap locally
echo ""
echo "[3/3] Validating sitemap tree..."
python3 _validate_sitemap.py --local-only
echo ""

echo "=== ✅ Ready to deploy ==="
echo ""
echo "  cd landing && vercel --prod --yes"
echo ""
echo "After deploy, validate the production sitemap:"
echo "  cd landing && python3 _validate_sitemap.py"
echo ""
echo "Or validate a preview deployment:"
echo "  cd landing && python3 _validate_sitemap.py --base https://YOUR-DEPLOY.vercel.app"
