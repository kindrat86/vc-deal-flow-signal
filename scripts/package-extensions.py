#!/usr/bin/env python3
"""Rebuild the three store packages for the GitDealFlow Chrome extension.

Source: chrome-extension/ (Manifest V3, "VC Deal Flow Signal").
Produces dist-extensions/momentum-badge-{chrome,edge,firefox}-v<version>.zip.

Chrome and Edge packages are identical. The Firefox package is the same
content plus browser_specific_settings.gecko (id is FIXED forever: changing
it creates a new add-on and loses installs/reviews).

Store-only assets (screenshots, store icons, dev tool icon) are EXCLUDED from
the zip. Run from the repo root: python3 scripts/package-extensions.py
"""
import json
import os
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "chrome-extension")
OUT = os.path.join(ROOT, "dist-extensions")

# Files that go into every store zip.
INCLUDE_FILES = [
    "manifest.json",
    "content.js",
    "popup.js",
    "popup.html",
    "popup.css",
    "styles.css",
]
# icon files are added separately (see below).

# Firefox-only manifest additions. The gecko.id is immutable.
GECKO_ID = "momentum-badge@gitdealflow.com"
GECKO_STRICT_MIN = "121.0"


def manifest_data():
    with open(os.path.join(SRC, "manifest.json"), encoding="utf-8") as f:
        return json.load(f)


def write_zip(zip_path, manifest):
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))
        for name in INCLUDE_FILES:
            if name == "manifest.json":
                continue
            zf.write(os.path.join(SRC, name), arcname=name)
        icons_dir = os.path.join(SRC, "icons")
        for icon in sorted(os.listdir(icons_dir)):
            if icon.endswith(".png"):
                zf.write(os.path.join(icons_dir, icon), arcname=f"icons/{icon}")
    return zip_path


def main():
    os.makedirs(OUT, exist_ok=True)
    base = manifest_data()
    version = base["version"]

    # Chrome + Edge: identical (Edge accepts the Chrome zip as-is).
    chrome_path = os.path.join(OUT, f"momentum-badge-chrome-v{version}.zip")
    write_zip(chrome_path, base)
    edge_path = os.path.join(OUT, f"momentum-badge-edge-v{version}.zip")
    write_zip(edge_path, base)

    # Firefox: add gecko id (never change it).
    firefox_manifest = json.loads(json.dumps(base))  # deep copy
    firefox_manifest["browser_specific_settings"] = {
        "gecko": {
            "id": GECKO_ID,
            "strict_min_version": GECKO_STRICT_MIN,
        }
    }
    firefox_path = os.path.join(OUT, f"momentum-badge-firefox-v{version}.zip")
    write_zip(firefox_path, firefox_manifest)

    for p in (chrome_path, edge_path, firefox_path):
        size = os.path.getsize(p)
        print(f"OK  {os.path.basename(p)}  ({size} bytes)")


if __name__ == "__main__":
    main()
