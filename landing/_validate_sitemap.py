#!/usr/bin/env python3
"""
Sitemap validator for gitdealflow.com.

Validates the FULL sitemap tree from sitemap.xml down through every
child sitemap and every page URL. Fails (exit 1) on ANY violation:
redirects, 4xx, 5xx, network errors, duplicates, noindex pages,
canonical mismatches, non-200 child sitemaps, malformed XML.

Usage:
  # Validate against production
  python3 _validate_sitemap.py

  # Validate against a preview deployment (rewrites scheme+host)
  python3 _validate_sitemap.py --base https://landing-XXXXX-sipiteno.vercel.app

  # Local file existence check only (no HTTP)
  python3 _validate_sitemap.py --local-only

  # Validate a single sitemap only
  python3 _validate_sitemap.py --sitemap sitemap-pages.xml

Exit 0 = all clean. Non-zero = violations found.
"""

import os, re, sys, time, xml.etree.ElementTree as ET
from pathlib import Path
from urllib.request import Request, urlopen, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse, urlunparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent
PRODUCTION_HOST = "gitdealflow.com"
PRODUCTION_BASE = f"https://{PRODUCTION_HOST}"

# ═══════════════════════════════════════════════════════════════
# Non-redirecting HTTP opener
# ═══════════════════════════════════════════════════════════════

class NoRedirectHandler(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None
    def http_error_302(self, req, fp, code, msg, headers):
        return fp
    http_error_301 = http_error_303 = http_error_307 = http_error_308 = http_error_302

OPENER = build_opener(NoRedirectHandler)

# ═══════════════════════════════════════════════════════════════
# URL rewriting for --base
# ═══════════════════════════════════════════════════════════════

def rewrite_url(url: str, new_base: str) -> str:
    """Replace scheme+host of `url` with `new_base`, preserving path+query.
    
    Example:
      rewrite_url("https://gitdealflow.com/about", "https://preview.vercel.app")
      → "https://preview.vercel.app/about"
    """
    parsed = urlparse(url)
    new_parsed = urlparse(new_base)
    return urlunparse((
        new_parsed.scheme,
        new_parsed.netloc,
        parsed.path,
        parsed.params,
        parsed.query,
        parsed.fragment
    ))

# ═══════════════════════════════════════════════════════════════
# Sitemap parsing
# ═══════════════════════════════════════════════════════════════

def parse_sitemap_xml(path_or_text: str, *, is_file: bool = True) -> tuple[list[str], bool, str]:
    """Parse a sitemap XML file or string.
    
    Returns (urls, is_index, error).
    - urls: list of <loc> values
    - is_index: True if this is a sitemapindex, False if urlset
    - error: empty string if valid, or error message if malformed
    """
    try:
        if is_file:
            tree = ET.parse(path_or_text)
        else:
            tree = ET.ElementTree(ET.fromstring(path_or_text))
        root = tree.getroot()
        
        # Determine type from root tag
        tag = root.tag.split('}')[-1] if '}' in root.tag else root.tag
        is_index = (tag == 'sitemapindex')
        
        # Extract all <loc> values
        ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = []
        for loc in root.findall('.//sm:loc', ns):
            if loc.text:
                urls.append(loc.text.strip())
        if not urls:
            # Fallback without namespace
            for loc in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
                if loc.text:
                    urls.append(loc.text.strip())
        if not urls:
            # Regex fallback
            text = path_or_text if not is_file else Path(path_or_text).read_text(encoding='utf-8')
            urls = re.findall(r'<loc>([^<]+)</loc>', text)
        
        return urls, is_index, ""
    except ET.ParseError as e:
        return [], False, f"XML parse error: {e}"
    except FileNotFoundError:
        return [], False, "File not found"
    except Exception as e:
        return [], False, str(e)

# ═══════════════════════════════════════════════════════════════
# URL checking
# ═══════════════════════════════════════════════════════════════

def check_http(url):
    """Check one URL via HTTP. Never follows redirects."""
    result = {
        "url": url,
        "status": None,
        "redirect_to": None,
        "error": None,
        "canonical": None,
        "has_noindex": False,
    }
    try:
        req = Request(url, headers={
            "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)"
        })
        resp = OPENER.open(req, timeout=15)
        result["status"] = resp.getcode()
        
        loc = resp.headers.get("Location", "")
        if loc:
            result["redirect_to"] = loc
        
        # For 200 HTML pages, inspect body for canonical + noindex
        if result["status"] == 200:
            ct = resp.headers.get("Content-Type", "")
            if "html" in ct.lower():
                try:
                    body = resp.read(30000).decode('utf-8', errors='replace')
                    # Canonical
                    cm = re.search(
                        r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']',
                        body, re.IGNORECASE
                    )
                    if cm:
                        result["canonical"] = cm.group(1)
                    # Noindex robots meta
                    if re.search(
                        r'<meta[^>]*name=["\']robots["\'][^>]*content=["\'][^"\']*noindex',
                        body, re.IGNORECASE
                    ):
                        result["has_noindex"] = True
                    # Also check X-Robots-Tag from headers
                    xrt = resp.headers.get("X-Robots-Tag", "")
                    if "noindex" in xrt.lower():
                        result["has_noindex"] = True
                except Exception:
                    pass
                    
    except HTTPError as e:
        result["status"] = e.code
    except URLError as e:
        result["status"] = -1
        result["error"] = str(e.reason)[:100]
    except TimeoutError:
        result["status"] = -1
        result["error"] = "timeout"
    except Exception as e:
        result["status"] = -1
        result["error"] = str(e)[:100]
    
    return result

# ═══════════════════════════════════════════════════════════════
# Canonical comparison
# ═══════════════════════════════════════════════════════════════

def canonicals_match(sitemap_url: str, page_canonical: str) -> bool:
    """Check if a page's canonical matches the sitemap URL.
    
    Only normalises trailing-slash differences (the site uses
    trailingSlash=false so bare and slash forms are equivalent).
    Rejects different hostnames, paths, or schemes.
    """
    sm = sitemap_url.rstrip('/')
    pc = page_canonical.rstrip('/')
    
    # Must be same host
    sm_host = urlparse(sm).netloc
    pc_host = urlparse(pc).netloc
    if sm_host != pc_host:
        return False
    
    # Same path after stripping trailing slash  
    sm_path = urlparse(sm).path.rstrip('/')
    pc_path = urlparse(pc).path.rstrip('/')
    
    return sm_path == pc_path

# ═══════════════════════════════════════════════════════════════
# Local file check
# ═══════════════════════════════════════════════════════════════

def url_to_file_path(url: str) -> str:
    """Convert a gitdealflow.com URL to a local relative file path."""
    path = url.replace(f"{PRODUCTION_BASE}", "").replace(f"http://{PRODUCTION_HOST}", "")
    if path in ("", "/"):
        return "index.html"
    path = path.strip("/")
    return f"{path}/index.html"

def check_local(url: str) -> dict:
    """Check if a URL has a matching local .html file."""
    fp = url_to_file_path(url)
    full = BASE_DIR / fp
    exists = full.is_file()
    
    # Also try .html variant (not index.html in dir)
    alt = fp.replace('/index.html', '.html')
    alt_full = BASE_DIR / alt
    alt_exists = alt_full.is_file()
    
    return {
        "url": url,
        "local_file": str(fp),
        "local_exists": exists or alt_exists,
    }

# ═══════════════════════════════════════════════════════════════
# Main validation
# ═══════════════════════════════════════════════════════════════

def validate_full(args) -> int:
    """Validate the entire sitemap tree. Returns exit code."""
    
    base_url = args.base
    local_only = args.local_only
    target_sitemap = args.sitemap
    max_workers = args.max_workers
    
    # ── Step 1: Resolve sitemap index ─────────────────────────
    if target_sitemap:
        sm_files = [Path(target_sitemap)]
    else:
        sm_files = [BASE_DIR / "sitemap.xml"]
    
    all_errors = []
    child_sitemaps = []     # (name, url) for child sitemaps
    page_urls_by_child = {} # child_name → [(canonical_url, check_url)]
    
    for sm_file in sm_files:
        if not sm_file.exists():
            print(f"❌ Sitemap not found: {sm_file}")
            all_errors.append(f"Missing sitemap: {sm_file}")
            continue
        
        # Parse local file
        text = sm_file.read_text(encoding='utf-8')
        locs, is_index, xml_err = parse_sitemap_xml(text, is_file=False)
        
        if xml_err:
            print(f"❌ {sm_file.name}: {xml_err}")
            all_errors.append(f"Malformed XML: {sm_file.name}: {xml_err}")
            continue
        
        if is_index:
            print(f"📂 {sm_file.name}: sitemap INDEX with {len(locs)} children")
            
            # Validate the index itself via HTTP if not local-only
            if not local_only:
                index_url = f"{PRODUCTION_BASE}/sitemap.xml"
                check_target = rewrite_url(index_url, base_url) if base_url else index_url
                r = check_http(check_target)
                status = r["status"]
                print(f"   Index HTTP: [{status}] {check_target}")
                if status != 200:
                    all_errors.append(f"Index non-200: {check_target} [{status}]")
                if r["redirect_to"]:
                    all_errors.append(f"Index redirects: {check_target} → {r['redirect_to']}")
            
            # Validate each child sitemap
            for child_url in locs:
                child_name = child_url.rstrip('/').split('/')[-1]
                
                # HTTP check the child sitemap
                if not local_only:
                    check_target = rewrite_url(child_url, base_url) if base_url else child_url
                    r = check_http(check_target)
                    status = r["status"]
                    
                    locator = f"{child_url}"
                    if base_url:
                        locator += f"\n        checked: {check_target}"
                    
                    if status == 200:
                        print(f"   ✅ {child_name}: [200]")
                        # Parse the child sitemap content
                        try:
                            req = Request(check_target, headers={
                                "User-Agent": "SitemapValidator/1.0"
                            })
                            resp = urlopen(req, timeout=30)
                            child_text = resp.read().decode('utf-8')
                            child_locs, child_is_index, child_err = parse_sitemap_xml(
                                child_text, is_file=False
                            )
                            
                            if child_err:
                                print(f"      ❌ Malformed: {child_err}")
                                all_errors.append(f"Malformed child sitemap: {child_name}: {child_err}")
                                continue
                            if child_is_index:
                                print(f"      ⚠️  Nested sitemapindex (unexpected)")
                                continue
                            
                            # Check for duplicate URLs within this child
                            dupes = len(child_locs) - len(set(child_locs))
                            if dupes:
                                print(f"      ❌ {dupes} duplicate <loc> entries")
                                all_errors.append(f"Duplicates in {child_name}: {dupes}")
                            
                            child_sitemaps.append((child_name, child_url))
                            page_urls_by_child[child_name] = list(dict.fromkeys(child_locs))
                            print(f"      {len(child_locs)} page URLs to validate")
                            
                        except Exception as e:
                            print(f"      ❌ Failed to fetch: {e}")
                            all_errors.append(f"Child sitemap fetch error: {child_name}: {e}")
                    elif status and 300 <= status < 400:
                        print(f"   ❌ {child_name}: [{status}] → {r['redirect_to']}\n        {locator}")
                        all_errors.append(f"Child sitemap redirects: {child_url} [{status}]")
                    else:
                        print(f"   ❌ {child_name}: [{status}]\n        {locator}")
                        all_errors.append(f"Child sitemap error: {child_url} [{status}]")
                else:
                    # Local-only: check if child file exists
                    child_path = BASE_DIR / child_name
                    if child_path.exists():
                        child_locs, _, child_err = parse_sitemap_xml(str(child_path))
                        if child_err:
                            all_errors.append(f"Malformed child: {child_name}: {child_err}")
                            continue
                        child_sitemaps.append((child_name, child_url))
                        page_urls_by_child[child_name] = list(dict.fromkeys(child_locs))
                        print(f"   ✅ {child_name}: {len(child_locs)} URLs (local)")
                    else:
                        print(f"   ❌ {child_name}: local file not found")
                        all_errors.append(f"Missing child sitemap file: {child_name}")
        else:
            # Single urlset (not an index)
            child_sitemaps.append((sm_file.name, f"{PRODUCTION_BASE}/{sm_file.name}"))
            page_urls_by_child[sm_file.name] = list(dict.fromkeys(locs))
            print(f"📄 {sm_file.name}: urlset with {len(locs)} URLs")
    
    if not child_sitemaps:
        print("❌ No valid child sitemaps found")
        return 1
    
    # ── Step 2: Validate all page URLs ─────────────────────────
    total_urls = sum(len(v) for v in page_urls_by_child.values())
    print(f"\n🔍 Validating {total_urls} page URLs across {len(child_sitemaps)} sitemap(s)...\n")
    
    # Build flat list with metadata
    all_checks = []
    for child_name, _ in child_sitemaps:
        for canonical_url in page_urls_by_child[child_name]:
            check_url_target = rewrite_url(canonical_url, base_url) if base_url else canonical_url
            all_checks.append((child_name, canonical_url, check_url_target))
    
    redirects = []
    errors_4xx = []
    errors_5xx = []
    network_errors = []
    noindex_pages = []
    canonical_mismatches = []
    ok_count = 0
    
    start = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {}
        for child_name, canonical_url, check_target in all_checks:
            futures[pool.submit(check_http, check_target)] = (child_name, canonical_url, check_target)
        
        done = 0
        for future in as_completed(futures):
            child_name, canonical_url, check_target = futures[future]
            r = future.result()
            status = r["status"]
            done += 1
            
            if status == 200:
                ok_count += 1
                if r["has_noindex"]:
                    noindex_pages.append((child_name, canonical_url, check_target))
                if r["canonical"]:
                    if not canonicals_match(canonical_url, r["canonical"]):
                        canonical_mismatches.append((child_name, canonical_url, r["canonical"], check_target))
            elif status and 300 <= status < 400:
                redirects.append((child_name, canonical_url, status, r.get("redirect_to", ""), check_target))
            elif status and 400 <= status < 500:
                errors_4xx.append((child_name, canonical_url, status, check_target))
            elif status and 500 <= status < 600:
                errors_5xx.append((child_name, canonical_url, status, check_target))
            else:
                network_errors.append((child_name, canonical_url, r.get("error", "unknown"), check_target))
            
            if done % 50 == 0:
                elapsed = time.time() - start
                print(f"  Progress: {done}/{total_urls} ({elapsed:.1f}s)")
    
    elapsed = time.time() - start
    
    # ── Step 2.5: Thin-content (soft-404) gate — local-only ──
    # Pages with < 150 visible words trigger Google "Soft 404" classification.
    thin_pages = []
    if local_only:
        MIN_WORDS = 150
        for child_name, _ in child_sitemaps:
            for canonical_url in page_urls_by_child[child_name]:
                # Resolve local file path from URL
                path = canonical_url.replace(f"https://{PRODUCTION_HOST}", "").lstrip("/")
                if path == "":
                    candidates = [BASE_DIR / "index.html"]
                else:
                    candidates = [BASE_DIR / f"{path}.html", BASE_DIR / path / "index.html"]
                filepath = next((c for c in candidates if c.exists()), None)
                if not filepath:
                    continue
                try:
                    html = filepath.read_text(encoding="utf-8", errors="replace")
                    body_match = re.search(r"<body[^>]*>(.*?)</body>", html, re.DOTALL)
                    if not body_match:
                        continue
                    body = body_match.group(1)
                    body = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.DOTALL)
                    body = re.sub(r"<style[^>]*>.*?</style>", "", body, flags=re.DOTALL)
                    body = re.sub(r"<noscript[^>]*>.*?</noscript>", "", body, flags=re.DOTALL)
                    text = re.sub(r"<[^>]+>", " ", body)
                    text = re.sub(r"\s+", " ", text).strip()
                    wc = len(text.split())
                    if wc < MIN_WORDS:
                        thin_pages.append((canonical_url, wc, str(filepath.relative_to(BASE_DIR))))
                except Exception:
                    pass
        if thin_pages:
            print(f"\n📏 Thin-content gate ({MIN_WORDS} word minimum):")
            for url, wc, rel in sorted(thin_pages, key=lambda x: x[1]):
                print(f"      {wc:>4} words  {url}")
        else:
            print(f"\n📏 Thin-content gate: ✅ all pages ≥ {MIN_WORDS} words")

    # ── Step 3: Validate image assets (for image sitemaps) ──
    image_asset_errors = []
    for child_name, _ in child_sitemaps:
        if 'image' not in child_name.lower():
            continue
        print(f"\n🖼️  Validating image assets in {child_name}...")
        
        # Re-parse the image sitemap for image:image entries
        child_path = BASE_DIR / child_name
        if child_path.exists():
            ns = {
                'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9',
                'image': 'http://www.google.com/schemas/sitemap-image/1.1'
            }
            try:
                import xml.etree.ElementTree as ET
                tree = ET.parse(str(child_path))
                root = tree.getroot()
                
                img_entries = []
                for url_el in root.findall('sm:url', ns):
                    page_loc_el = url_el.find('sm:loc', ns)
                    page_url = page_loc_el.text.strip() if page_loc_el is not None and page_loc_el.text else None
                    
                    for img_el in url_el.findall('image:image', ns):
                        img_loc_el = img_el.find('image:loc', ns)
                        img_loc = img_loc_el.text.strip() if img_loc_el is not None and img_loc_el.text else None
                        
                        if not img_loc:
                            image_asset_errors.append(f"Missing <image:loc> in {child_name} for page {page_url}")
                            continue
                        if not img_loc.startswith('https://'):
                            image_asset_errors.append(f"Non-HTTPS <image:loc>: {img_loc}")
                            continue
                        
                        check_target = rewrite_url(img_loc, base_url) if base_url and not local_only else img_loc
                        img_entries.append((page_url, img_loc, check_target))
                
                if not img_entries:
                    continue
                
                # Check image assets via HTTP
                if not local_only:
                    checked_imgs = 0
                    img_ok = 0
                    for page_url, img_loc, check_target in img_entries:
                        try:
                            req = Request(check_target, headers={
                                "User-Agent": "Googlebot-Image/1.0"
                            })
                            resp = OPENER.open(req, timeout=15)
                            code = resp.getcode()
                            ct = resp.headers.get('Content-Type', '')
                            
                            if code == 200:
                                if ct.startswith('image/'):
                                    img_ok += 1
                                else:
                                    image_asset_errors.append(
                                        f"Non-image Content-Type for {img_loc}: {ct}"
                                    )
                            elif code and 300 <= code < 400:
                                image_asset_errors.append(
                                    f"Image redirect [{code}]: {img_loc} → {resp.headers.get('Location','?')}"
                                )
                            else:
                                image_asset_errors.append(
                                    f"Image HTTP [{code}]: {img_loc}"
                                )
                        except Exception as e:
                            image_asset_errors.append(
                                f"Image check error: {img_loc}: {getattr(e,'code','ERR')}"
                            )
                        checked_imgs += 1
                    
                    print(f"  {img_ok}/{checked_imgs} image assets pass")
                else:
                    print(f"  {len(img_entries)} image entries (local-only, no HTTP check)")
                    
            except ET.ParseError as e:
                image_asset_errors.append(f"Malformed image sitemap XML: {e}")
            except Exception as e:
                image_asset_errors.append(f"Image sitemap parse error: {e}")
    
    if image_asset_errors:
        for err in image_asset_errors:
            all_errors.append(err)
    
    # ── Step 3: Report ────────────────────────────────────────
    total_errors = (len(redirects) + len(errors_4xx) + len(errors_5xx) +
                    len(network_errors) + len(noindex_pages) + len(canonical_mismatches) +
                    len(thin_pages))
    
    print(f"\n{'═' * 60}")
    print(f"RESULTS ({elapsed:.1f}s)")
    print(f"{'═' * 60}")
    
    def print_section(title, items, emoji, max_show=25):
        if not items:
            print(f"  {emoji} {title}: 0")
            return
        print(f"  {emoji} {title}: {len(items)}")
        for item in items[:max_show]:
            child, canon, *rest = item
            locator = f"[{child}] {canon}"
            if len(item) >= 5:
                check_url = item[-1]
                if check_url != canon:
                    locator += f"\n        checked: {check_url}"
            if title == "Redirects":
                code, dest = rest[0], rest[1] if len(rest) > 1 else ""
                print(f"      [{code}] {locator}\n        → {dest}")
            elif title == "Canonical mismatches":
                page_canon = rest[0]
                print(f"      {locator}\n        page canonical: {page_canon}")
            elif title == "Network errors":
                err = rest[0]
                print(f"      {locator}\n        error: {err}")
            else:
                print(f"      [{rest[0] if rest else '?'}] {locator}")
        if len(items) > max_show:
            print(f"      ... and {len(items) - max_show} more")
    
    print(f"  ✅ Direct 200:   {ok_count}")
    print_section("Redirects", redirects, "🔀")
    print_section("4xx errors", errors_4xx, "❌")
    print_section("5xx errors", errors_5xx, "❌")
    print_section("Network errors", network_errors, "🌐")
    print_section("Noindex pages", noindex_pages, "⚠️")
    print_section("Canonical mismatches", canonical_mismatches, "⚠️")
    print_section("Image asset errors", [(None, e, "") for e in image_asset_errors], "🖼️", max_show=10)
    
    # Cross-sitemap page references are normal (image sitemap
    # legitimately references pages from the pages sitemap)
    
    print(f"\n  Total pages checked: {total_urls}")
    print(f"  Total violations:    {total_errors + len(all_errors)}")
    
    if total_errors + len(all_errors) == 0:
        print(f"\n✅ ALL CLEAN — zero violations")
        return 0
    else:
        print(f"\n❌ FAILED — {total_errors + len(all_errors)} violation(s) found")
        return 1


# ═══════════════════════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════════════════════

def main():
    import argparse
    parser = argparse.ArgumentParser(
        description="Validate gitdealflow.com sitemap tree"
    )
    parser.add_argument(
        "--base",
        help="Base URL for HTTP checks (rewrites scheme+host of sitemap URLs)"
    )
    parser.add_argument(
        "--local-only",
        action="store_true",
        help="Only check local file existence, no HTTP"
    )
    parser.add_argument(
        "--sitemap",
        help="Validate a single sitemap file instead of the full tree"
    )
    parser.add_argument(
        "--max-workers",
        type=int,
        default=15,
        help="Parallel HTTP workers (default: 15)"
    )
    args = parser.parse_args()
    
    exit_code = validate_full(args)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
