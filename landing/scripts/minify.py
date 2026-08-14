#!/usr/bin/env python3
"""
Build/minify script for gitdealflow.com landing page.

Strategies:
  1. Extract inline <style> blocks → inline.css (browser-cached, ~15KB off HTML)
  2. Strip tabs at line starts, collapse multiple blank lines
  3. Remove HTML comments (except conditionals)
  4. Report savings

Two-pass extract: first scan all files to collect CSS, write inline.css, then
replace <style> in each file.
"""

import os
import re
import sys

LANDING = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(LANDING)


def collect_extracted_css(files: list[str]) -> dict[str, list[str]]:
    """Scan all files, collect all inline <style> block contents keyed by file."""
    css_map: dict[str, list[str]] = {}
    for fname in files:
        fpath = os.path.join(LANDING, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        blocks = re.findall(
            r'<style[^>]*>(.*?)</style>', content, flags=re.DOTALL | re.IGNORECASE
        )
        if blocks:
            css_map[fname] = blocks
    return css_map


def dedupe_css_blocks(blocks: list[str]) -> list[str]:
    """Remove duplicate CSS blocks (exact string matches)."""
    seen: set[str] = set()
    result: list[str] = []
    for b in blocks:
        stripped = b.strip()
        if stripped not in seen:
            seen.add(stripped)
            result.append(stripped)
    return result


def minify_html(html: str) -> str:
    """Minify HTML: strip leading tabs, collapse blank lines, remove comments."""
    # Remove leading tabs on each line
    html = re.sub(r'^\t+', '', html, flags=re.MULTILINE)
    # Remove HTML comments (not conditionals or special markers)
    html = re.sub(
        r'<!--(?!\s*\[if\s|<!\[endif\]).*?-->', '', html, flags=re.DOTALL
    )
    # Collapse 3+ blank lines to 2
    html = re.sub(r'\n{3,}', '\n\n', html)
    # Strip trailing whitespace per line
    html = '\n'.join(line.rstrip() for line in html.split('\n'))
    return html


def main():
    extract_css = '--no-extract-css' not in sys.argv

    html_files = sorted(
        f
        for f in os.listdir(LANDING)
        if f.endswith('.html') and os.path.isfile(os.path.join(LANDING, f))
    )

    if not html_files:
        print('No HTML files found.')
        return

    print(f'Processing {len(html_files)} HTML files...')

    total_orig = 0
    total_new = 0
    total_css = 0

    # ---- PASS 1: collect, dedupe, write inline.css ----
    if extract_css:
        css_map = collect_extracted_css(html_files)
        all_blocks: list[str] = []
        for blocks in css_map.values():
            all_blocks.extend(blocks)

        if all_blocks:
            unique_blocks = dedupe_css_blocks(all_blocks)
            combined_css = '\n\n'.join(unique_blocks)
            css_path = os.path.join(LANDING, 'inline.css')

            with open(css_path, 'w', encoding='utf-8') as f:
                f.write(combined_css)
            total_css = len(combined_css)
            print(f'  → Extracted {len(unique_blocks)} CSS block(s) ({total_css: } bytes) → inline.css')
            print(f'  → Deduplicated: {len(all_blocks)} → {len(unique_blocks)}')

    # ---- PASS 2: replace <style> with <link>, minify ----
    for fname in html_files:
        fpath = os.path.join(LANDING, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            original = f.read()

        orig_size = len(original)
        html = original

        if extract_css and total_css > 0:
            # Replace <style>...</style> with placeholder comment
            # Use a unique marker so we can find it
            html = re.sub(
                r'<style[^>]*>.*?</style>',
                '<!--css:inline-->',
                html,
                flags=re.DOTALL | re.IGNORECASE,
            )
            # Replace first occurrence of </head> with <link href="/inline.css" rel="stylesheet"> + </head>
            # But actually insert BEFORE </head>: handle that below
            html = html.replace('</head>', '<link rel="stylesheet" href="/inline.css"></head>')

        html = minify_html(html)

        # Ensure the DOCTYPE is on its own line
        html = re.sub(r'^<!DOCTYPE html>\s*', '<!DOCTYPE html>\n', html, flags=re.IGNORECASE)

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(html)

        new_size = len(html)
        savings = orig_size - new_size
        total_orig += orig_size
        total_new += new_size

        pct = round(100 * savings / orig_size, 1) if orig_size else 0
        flag = ' ⚠️' if extract_css and fname == html_files[0] and 'inline.css' in html else ''
        print(f'  {fname:<38} {orig_size:>7,} → {new_size:>7,} ({savings:>+7,}, {pct}%)')

    total_savings = total_orig - total_new
    total_pct = round(100 * total_savings / total_orig, 1) if total_orig else 0
    print(f'  {"─" * 58}')
    print(f'  {"TOTAL":<38} {total_orig:>7,} → {total_new:>7,} ({total_savings:>+7,}, {total_pct}%)')
    if total_css:
        print(f'\n  🎯 HTML reduced by {total_savings: } bytes + {total_css: } bytes moved to external CSS (browser-cached)')


if __name__ == '__main__':
    main()
