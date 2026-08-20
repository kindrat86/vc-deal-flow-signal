#!/usr/bin/env python3
"""
Sitemap rebuilder for gitdealflow.com.

Walks the landing/ directory tree, discovers every indexable .html file,
converts to clean URLs, and writes sitemap-pages.xml.

Key properties:
- Only URLs with real deployable .html files are included.
- No theoretical/database-driven slugs.
- Excludes noindex pages, embed widgets, verification files, 404, etc.
- Deterministic: same file tree → same sitemap.
- Honest lastmod: uses each file's mtime (ISO YYYY-MM-DD).
  Omits <lastmod> when a file's mtime is unavailable or unreliable
  (same as the generator run date, content didn't change).

Run: python3 _rebuild_sitemap.py
After run: validate with _validate_sitemap.py
"""

import os, re, hashlib, json
from datetime import date, datetime, timezone
from pathlib import Path

BASE = Path(__file__).resolve().parent
DOMAIN = "gitdealflow.com"
BASE_URL = f"https://{DOMAIN}"
TODAY = date.today().isoformat()

# ── Exclusion rules ───────────────────────────────────────────

# Directories whose contents are never indexable
EXCLUDE_DIRS = {
    ".vercel", "node_modules", ".git",
    "embed",        # embeddable widgets, X-Robots-Tag: noindex
    "widgets",      # embeddable widgets, X-Robots-Tag: noindex
    "network",      # network widget, X-Robots-Tag: noindex
    "schema",       # schema.org files, X-Robots-Tag: noindex
    "api",          # API routes
    "es",           # Spanish, has own sitemap (sitemap-es.xml)
    "de",           # German, has own sitemap (sitemap-de.xml)
}

# Specific files to exclude (non-indexable)
EXCLUDE_FILES = {
    # Canonicalized cross-dupes (commit cbb6c68e): these /best/ pages
    # canonical to /alternatives-to/*, so they must not sit in the
    # sitemap as self-canonical entries (validator: canonical mismatch).
    "best/best-crunchbase-alternatives.html",
    "best/best-pitchbook-alternatives.html",
    # Canonicalized dupe (memory: keywords-100 consolidation): the page
    # canonicals to best/best-deal-flow-tools, so it must not sit in the
    # sitemap as a self-canonical entry (validator: canonical mismatch).
    "best/best-deal-flow-software.html",

    # Error pages
    "404.html",
    # Verification files
    "yandex_f3f5891cbff0b50f.html",
    "google57979683042f3b0e.html",
    "googlea30bb998b91eb6ac.html",
    "BingSiteAuth.xml",
    # Embed/widget artifacts. The root /embed page is now the indexable
    # installation guide; only the iframe payloads stay excluded/noindex.
    "widget.html",
    "related-tools.html",
    "network/widget.html",
    "network-widget.html",
    # Transactional/thanks pages
    "sector-sweep.html",
    "sector-sweep-thanks.html",
    "insider.html",
    "insider-thanks.html",
    "firstlook.html",
    "firstlook-thanks.html",
    "dashboard.html",
    "dashboard-thanks.html",
    "confirmed.html",
    "subscribe-thanks.html",
    "thanks.html",
    "checkout-success.html",
    # Other non-indexable
    "report.html",        # has noindex meta
    "funnel-math.html",
    # Soft-404 / thin content pages (GSC "Soft 404" fix, Aug 2026)
    "pulse.html",              # 270 chars visible text, live JS visualizer
    "trustpilot-footer-link.html",  # 140 chars, link-building artifact
    "embed-gallery.html",      # thin widget gallery
    "embed/tracker.html",      # embeddable widget
    "embed/check-velocity.html",  # embeddable widget
    "embed/momentum.html",     # embeddable widget
}

# Prefix patterns for verification files
EXCLUDE_PREFIXES = (
    "yandex_", "google", "startupranking",
)

# Files whose mtime is not meaningful (generated during build)
MTIME_UNRELIABLE_PREFIXES = (
    # These get rewritten fresh each build, so their mtime is
    # the build time, not the content age.
)

# ── Redirect-source exclusion ─────────────────────────────────

def load_redirect_sources() -> set:
    """Return plain-path redirect sources from vercel.json.

    A discovered page whose URL is a redirect source (e.g.
    /alternatives-to/crunchbase -> /alternatives-to/crunchbase-alternatives)
    must NOT appear in the sitemap: Google flags such entries as
    'Page with redirect'. Only plain paths are considered (no
    wildcards, params, or catch-alls like /:path*).
    """
    try:
        vc = json.loads((BASE / "vercel.json").read_text(encoding="utf-8"))
    except Exception:
        return set()
    sources = set()
    for rule in vc.get("redirects", []):
        src = rule.get("source", "")
        if src.startswith("/") and not any(ch in src for ch in "*:?("):
            sources.add(src.rstrip("/") or "/")
    return sources


REDIRECT_SOURCES = load_redirect_sources()

# ── URL conversion ────────────────────────────────────────────

def file_to_url(rel_path: str) -> str:
    """Convert a relative file path to a clean URL path.
    
    Vercel config: cleanUrls=true, trailingSlash=false.
    /index.html → /
    /about.html → /about
    /sectors/ai-ml/index.html → /sectors/ai-ml
    """
    if rel_path.endswith('.html'):
        path = '/' + rel_path[:-5]
    else:
        path = '/' + rel_path
    
    if path.endswith('/index'):
        path = path[:-6]
        if path == '':
            path = '/'
    
    return path


def has_noindex_meta(filepath: Path) -> bool:
    """Check if an HTML file contains a noindex robots meta tag."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            head = f.read(4000)
        return bool(re.search(
            r'<meta[^>]*name=["\']robots["\'][^>]*content=["\'][^"\']*noindex',
            head, re.IGNORECASE
        ))
    except Exception:
        return False


def should_exclude(rel_path: str, filepath: Path) -> tuple[bool, str]:
    """Return (exclude, reason)."""
    parts = rel_path.split('/')
    
    if parts[0] in EXCLUDE_DIRS:
        return True, f"excluded dir: {parts[0]}"
    
    if rel_path in EXCLUDE_FILES:
        return True, "excluded file"
    
    fname = parts[-1].lower()
    for prefix in EXCLUDE_PREFIXES:
        if fname.startswith(prefix):
            return True, f"verification file: {prefix}"
    
    if has_noindex_meta(filepath):
        return True, "noindex meta tag"
    
    return False, ""


def get_lastmod(filepath: Path):  # -> Optional[str]
    """Get ISO date from file's mtime. Returns None if unreliable.
    
    Uses file mtime (last modification). Falls back to None if
    the mtime is within a few seconds of the current time (meaning
    the file was just regenerated and the mtime isn't meaningful).
    """
    try:
        mtime = filepath.stat().st_mtime
        mtime_dt = datetime.fromtimestamp(mtime, tz=timezone.utc)
        
        # If mtime is within 5 minutes of now, the file was likely
        # just regenerated, omit lastmod (unreliable)
        now = datetime.now(timezone.utc)
        if abs((now - mtime_dt).total_seconds()) < 300:
            return None
        
        return mtime_dt.strftime('%Y-%m-%d')
    except Exception:
        return None


def file_hash(filepath: Path) -> str:
    """Fast hash of file content for change detection."""
    try:
        stat = filepath.stat()
        return f"{stat.st_mtime}:{stat.st_size}"
    except Exception:
        return ""


# ── Main ──────────────────────────────────────────────────────

def discover_pages():  # -> list[tuple[str, str, Optional[str]]]
    """Walk landing/ and return list of (url, rel_path, lastmod) for indexable pages."""
    pages = []
    
    for root, dirs, files in os.walk(BASE):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for fname in files:
            if not fname.endswith('.html'):
                continue
            
            full_path = Path(root) / fname
            rel = str(full_path.relative_to(BASE))
            
            exclude, reason = should_exclude(rel, full_path)
            if exclude:
                continue
            
            url = file_to_url(rel)
            # Skip URLs that are redirect sources (see load_redirect_sources).
            if (url.rstrip("/") or "/") in REDIRECT_SOURCES:
                continue
            lastmod = get_lastmod(full_path)
            pages.append((url, rel, lastmod))
    
    # Deduplicate by URL (about.html and about/index.html both → /about)
    seen = set()
    deduped = []
    for url, rel, lastmod in pages:
        if url not in seen:
            seen.add(url)
            # Prefer the one with a real lastmod
            deduped.append((url, rel, lastmod))
        else:
            # Merge: keep the one with a mtime-based lastmod
            for i, (u, r, lm) in enumerate(deduped):
                if u == url:
                    if lastmod is not None and lm is None:
                        deduped[i] = (url, rel, lastmod)
                    break
    
    # Sort: root first, then alphabetical
    deduped.sort(key=lambda x: (
        0 if x[0] == '/' else 1,
        x[0]
    ))
    
    return deduped


def build_sitemap(pages) -> str:
    """Generate sitemap-pages.xml content."""
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    
    for url, rel, lastmod in pages:
        full_url = BASE_URL if url == '/' else f"{BASE_URL}{url}"
        lines.append("  <url>")
        lines.append(f"    <loc>{full_url}</loc>")
        if lastmod:
            lines.append(f"    <lastmod>{lastmod}</lastmod>")
        lines.append("  </url>")
    
    lines.append('</urlset>')
    return '\n'.join(lines) + '\n'


def sitemap_changed(new_content: str, existing_path: Path) -> bool:
    """Check if sitemap content differs from existing file."""
    if not existing_path.exists():
        return True
    try:
        old = existing_path.read_text(encoding='utf-8')
        return old.strip() != new_content.strip()
    except Exception:
        return True


def update_sitemap_index(sm_path: Path, changed_children: set[str]) -> None:
    """Update lastmod on sitemap index entries for changed children only."""
    if not sm_path.exists():
        return
    
    text = sm_path.read_text(encoding='utf-8')
    updated = text
    
    for child_name in changed_children:
        # Replace lastmod for this child's <sitemap> block
        pattern = re.compile(
            r'(<loc>https://' + re.escape(DOMAIN) + r'/' + re.escape(child_name) +
            r'</loc>\s*<lastmod>)[^<]*(</lastmod>)'
        )
        updated = pattern.sub(r'\g<1>' + TODAY + r'\g<2>', updated)
    
    if updated != text:
        sm_path.write_text(updated, encoding='utf-8')
        print(f"  Updated lastmod for changed children: {changed_children}")


def main():
    print("Rebuilding sitemap-pages.xml from file inventory...")
    
    pages = discover_pages()
    
    # Count pages with lastmod vs without
    with_lm = sum(1 for _, _, lm in pages if lm)
    without_lm = sum(1 for _, _, lm in pages if not lm)
    print(f"  Discovered {len(pages)} indexable pages "
          f"({with_lm} with lastmod, {without_lm} without)")
    
    # Show a sample
    for url, rel, lm in pages[:5]:
        lm_str = f"lastmod={lm}" if lm else "no lastmod"
        print(f"    {url}  ← {rel}  ({lm_str})")
    if len(pages) > 10:
        print(f"    ...")
    for url, rel, lm in pages[-3:]:
        lm_str = f"lastmod={lm}" if lm else "no lastmod"
        print(f"    {url}  ← {rel}  ({lm_str})")
    
    # Generate sitemap
    sitemap = build_sitemap(pages)
    out_path = BASE / "sitemap-pages.xml"
    
    # Only write if changed (deterministic)
    changed = sitemap_changed(sitemap, out_path)
    if changed:
        out_path.write_text(sitemap, encoding='utf-8')
        print(f"\n  Written: {out_path} ({len(sitemap)} bytes, {len(pages)} URLs)")
        
        # Update sitemap index lastmod for this child
        update_sitemap_index(BASE / "sitemap.xml", {"sitemap-pages.xml"})
        update_sitemap_index(BASE / "sitemap-index.xml", {"sitemap-pages.xml"})
    else:
        print(f"\n  Unchanged: {out_path} ({len(pages)} URLs), skipped write")
    
    # Summary
    print(f"\n  Sitemap summary:")
    print(f"    Total pages:         {len(pages)}")
    print(f"    With <lastmod>:      {with_lm}")
    print(f"    Without <lastmod>:   {without_lm}")
    print(f"    File written:        {'yes' if changed else 'no (unchanged)'}")

    # Image sitemap RETIRED (2026-08-16): it held a single URL (homepage +
    # data-nerd.png), which is discoverable via the page itself and sitemap-
    # pages.xml. A 1-URL image sitemap is pure overhead. Do not regenerate.
    # rebuild_image_sitemap(pages, changed)


def rebuild_image_sitemap(pages, pages_changed):
    """RETIRED 2026-08-16. Kept for history; the caller no longer invokes it.

    The image sitemap held exactly one URL (homepage + data-nerd.png), which
    Google discovers via the page and its meta/OG tags anyway. A 1-entry
    image sitemap is a wasted child submission.
    """
    return
    img_path = BASE / "image-sitemap.xml"
    
    # Discover pages with real images
    image_pages = {}  # url -> [(image_loc, image_title)]
    
    for url, rel, lastmod in pages:
        # Find the HTML file
        if rel.endswith('.html'):
            html_path = BASE / rel
        else:
            html_path = BASE / (rel + '.html')
        
        if not html_path.exists():
            continue
        
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                html = f.read()
        except Exception:
            continue
        
        # Extract <img> tags
        img_tags = re.findall(
            r'<img[^>]*src=["\']([^"\']+)["\'][^>]*(?:alt=["\']([^"\']*)["\'])?',
            html, re.IGNORECASE
        )
        
        real_images = []
        for src, alt in img_tags:
            # Skip data URIs, tracking pixels
            if src.startswith('data:'):
                continue
            if any(w in src.lower() for w in ('pixel', 'track', '1x1')):
                continue
            # Skip the shared OG image (social meta, not content)
            if 'opengraph-image' in src:
                continue
            # Skip icon/logos
            if src.endswith('.svg') and any(w in src.lower() for w in ('icon', 'logo')):
                continue
            
            # Normalize to absolute URL
            local_path = None
            if src.startswith('/'):
                local_path = BASE / src.lstrip('/')
            elif src.startswith(f"https://{DOMAIN}/"):
                local_path = BASE / src[len(f"https://{DOMAIN}/"):]
            elif src.startswith(f"http://{DOMAIN}/"):
                local_path = BASE / src[len(f"http://{DOMAIN}/"):]
            
            if local_path is not None:
                # Same-domain URL, check if file exists locally
                if local_path.exists():
                    src = f"https://{DOMAIN}" + ('/' + str(local_path.relative_to(BASE)) if local_path != BASE else '')
                else:
                    # No local file, skip (dynamic route, API, etc.)
                    continue
            elif not src.startswith('http'):
                src = f"https://{DOMAIN}/{src}"
            
            title = (alt or '').strip()[:100]
            if not title:
                # Derive from filename
                fname = src.rstrip('/').split('/')[-1].rsplit('.', 1)[0]
                title = fname.replace('-', ' ').replace('_', ' ').title()[:100]
            
            real_images.append((src, title))
        
        if real_images:
            image_pages[url] = real_images
    
    # Build image sitemap
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ]
    
    total_img_entries = 0
    for url in sorted(image_pages.keys(), key=lambda u: (0 if u == '/' else 1, u)):
        images = image_pages[url]
        full_url = BASE_URL if url == '/' else f"{BASE_URL}{url}"
        lines.append("  <url>")
        lines.append(f"    <loc>{full_url}</loc>")
        for img_loc, img_title in images:
            lines.append("    <image:image>")
            lines.append(f"      <image:loc>{img_loc}</image:loc>")
            lines.append(f"      <image:title>{img_title}</image:title>")
            lines.append("    </image:image>")
            total_img_entries += 1
        lines.append("  </url>")
    
    lines.append('</urlset>')
    new_img = '\n'.join(lines) + '\n'
    
    changed = sitemap_changed(new_img, img_path)
    if changed or pages_changed:
        img_path.write_text(new_img, encoding='utf-8')
        print(f"  image-sitemap.xml: {'written' if changed else 'updated'} "
              f"({len(new_img)} bytes, {len(image_pages)} pages, "
              f"{total_img_entries} image entries)")
    else:
        print(f"  image-sitemap.xml: unchanged ({len(image_pages)} pages, "
              f"{total_img_entries} image entries)")


if __name__ == "__main__":
    main()
