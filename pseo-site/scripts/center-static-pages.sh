#!/usr/bin/env bash
# Centre body text on signals.gitdealflow.com's static (non-Next) pages under
# public/. Those pages load neither globals.css nor ux.css, so none of the
# app's centring rules ever reach them. Idempotent: keyed on the marker, so
# re-running after a page regenerates only touches what lost the block.
#
#   usage: center-static.sh [<path-to-pseo-site>]
set -euo pipefail

SITE="${1:-$HOME/signals-gitdealflow/pseo-site}"
ROOT="$SITE/public"
MARKER="CENTERED TEXT 2026-07-25"

# list-style-position: inside keeps bullets with their centred text instead of
# stranding them at the list's left indent.
BLOCK='<style>/* '"$MARKER"' */body,body *{text-align:center!important}ul,ol{list-style-position:inside;padding-left:0}pre,pre *,code,code *{text-align:left!important}</style>'

changed=0; skipped=0
while IFS= read -r f; do
  if grep -q "$MARKER" "$f"; then skipped=$((skipped+1)); continue; fi
  if [ "$(grep -c '</head>' "$f")" -ne 1 ]; then echo "SKIP (no single </head>): $f"; skipped=$((skipped+1)); continue; fi
  python3 - "$f" "$BLOCK" <<'PY'
import sys, io
path, block = sys.argv[1], sys.argv[2]
with io.open(path, encoding='utf-8') as fh:
    src = fh.read()
assert src.count('</head>') == 1
with io.open(path, 'w', encoding='utf-8') as fh:
    fh.write(src.replace('</head>', block + '\n</head>', 1))
PY
  changed=$((changed+1))
done < <(find "$ROOT" -name '*.html' \
           ! -name 'google*' \
           ! -path '*embed*' ! -path '*widget*' ! -path '*ticker*' \
           ! -name 'related-tools.html')

echo "centred: $changed   skipped: $skipped"
