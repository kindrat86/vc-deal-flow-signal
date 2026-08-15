#!/usr/bin/env python3
"""
i18n Generator for gitdealflow.com, Spanish (es) and German (de).
Reads every .html file in the landing dir, produces translated copies under /es/ and /de/
with proper hreflang, and updates the original English pages with es/de links.
"""

import os, re, json, shutil
from datetime import date
from html.parser import HTMLParser

BASE = os.path.expanduser("~/signals-gitdealflow/landing")
DOMAIN = "gitdealflow.com"
CANONICAL = f"https://{DOMAIN}"
TODAY = date.today().isoformat()

# ─── Translation maps ──────────────────────────────────────────

MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"]
MONTHS_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
MONTHS_DE = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]

BRAND_EN = {
    "GitDealFlow": ("GitDealFlow", "GitDealFlow"),
    "The Data Nerd": ("El Nerd de los Datos", "Der Daten-Nerd"),
    "Startup Signals 21-47 Days Before the Round": ("Señales de Startups 21-47 Días Antes de la Ronda", "Startup-Signale 21-47 Tage vor der Runde"),
    "VC Deal Flow Signal": ("Señal de Flujo de Acuerdos VC", "VC-Deal-Flow-Signal"),
}

COMMON_NAV = {
    "Pricing": ("Precios", "Preise"),
    "Get free signal": ("Obtén señal gratis", "Kostenloses Signal erhalten"),
    "Live signals": ("Señales en vivo", "Live-Signale"),
    "Home": ("Inicio", "Startseite"),
    "About": ("Acerca de", "Über uns"),
    "See pricing & start tracking →": ("Ver precios y empezar →", "Preise ansehen & starten →"),
}

SECTORS = {
    "fintech": ("Fintech", "Fintech"),
    "ai-ml": ("IA/ML", "KI/ML"),
    "healthtech": ("Healthtech", "Healthtech"),
    "climate-tech": ("Tecnología Climática", "Klimatech"),
    "cybersecurity": ("Ciberseguridad", "Cybersicherheit"),
    "devtools": ("Herramientas para Desarrolladores", "Entwicklertools"),
    "biotech": ("Biotecnología", "Biotechnologie"),
    "edtech": ("Edtech", "Edtech"),
    "ecommerce": ("Comercio Electrónico", "E-Commerce"),
    "saas": ("SaaS", "SaaS"),
    "enterprise": ("Enterprise", "Enterprise"),
    "deep-tech": ("Deep Tech", "Deep Tech"),
    "robotics": ("Robótica", "Robotik"),
    "mobility": ("Movilidad", "Mobilität"),
    "logistics": ("Logística", "Logistik"),
    "proptech": ("Proptech", "Proptech"),
    "legaltech": ("Legaltech", "Legaltech"),
    "insurtech": ("Insurtech", "Insurtech"),
    "hrtech": ("HR Tech", "HR Tech"),
    "martech": ("Martech", "Martech"),
    "media": ("Medios", "Medien"),
    "gaming": ("Gaming", "Gaming"),
    "consumer": ("Consumidor", "Consumer"),
    "agritech": ("Agritech", "Agritech"),
    "web3": ("Web3", "Web3"),
}

# ─── Utility functions ─────────────────────────────────────────

def rel_path_to_url(rel_path):
    """Convert a relative file path to a URL path."""
    if rel_path.endswith('/index.html'):
        return '/' + rel_path[:-len('index.html')]
    elif rel_path.endswith('.html'):
        return '/' + rel_path[:-5]
    else:
        return '/' + rel_path

def get_url_parts(html_path):
    """Given a file path relative to landing, return (lang, url_path)."""
    parts = html_path.split('/')
    first = parts[0]
    if first in ('es', 'de'):
        lang = first
        rest = '/'.join(parts[1:])
    else:
        lang = 'en'
        rest = '/'.join(parts)
    url = rel_path_to_url(rest)
    return lang, url

def make_lang_url(lang, url_path):
    """Build a full URL for a given language path."""
    if url_path == '/':
        return f"https://{DOMAIN}/{lang}/" if lang != 'en' else f"https://{DOMAIN}/"
    if lang == 'en':
        return f"https://{DOMAIN}{url_path}"
    return f"https://{DOMAIN}/{lang}{url_path}"

def extract_page_meta(html):
    """Extract title and description from HTML."""
    title = ""
    desc = ""
    m1 = re.search(r'<title>(.*?)</title>', html, re.DOTALL)
    if m1: title = m1.group(1).strip()
    m2 = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.DOTALL)
    if m2: desc = m2.group(1).strip()
    m2b = re.search(r'<meta\s+content=["\'](.*?)["\']\s+name=["\']description["\']', html, re.DOTALL)
    if m2b: desc = m2b.group(1).strip()
    return title, desc

def extract_body_content(html):
    """Extract visible body text for translation context."""
    # Remove script and style blocks
    cleaned = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
    cleaned = re.sub(r'<style[^>]*>.*?</style>', '', cleaned, flags=re.DOTALL)
    cleaned = re.sub(r'<[^>]+>', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned[:500]

def translate_date(text, lang):
    """Replace English month names with Spanish/German."""
    for i, en in enumerate(MONTHS_EN):
        if lang == 'es':
            text = text.replace(en, MONTHS_ES[i])
        elif lang == 'de':
            text = text.replace(en, MONTHS_DE[i])
    return text

def translate_brand(text, lang):
    """Translate brand-adjacent phrases."""
    idx = 1 if lang == 'es' else 2
    for en, pair in BRAND_EN.items():
        text = text.replace(en, pair[idx-1])
    return text

def simple_translate(text, lang):
    """Simple string replacements for navigation and common terms."""
    idx = 1 if lang == 'es' else 2
    for en, pair in COMMON_NAV.items():
        text = text.replace(en, pair[idx-1])
    text = translate_date(text, lang)
    text = translate_brand(text, lang)
    return text

# ─── HTML manipulation ─────────────────────────────────────────

def add_hreflang_to_head(html, en_url, es_url, de_url, lang='en'):
    """Add proper hreflang links to the head section."""
    # Remove existing hreflang lines
    html = re.sub(r'\s*<link\s+rel=["\']alternate["\']\s+hreflang=["\'][^"\']+["\']\s+href=["\'][^"\']+["\'][^>]*/?>\s*', '', html)
    
    hreflang_block = f"""
    <link rel="alternate" hreflang="en" href="{en_url}">
    <link rel="alternate" hreflang="es" href="{es_url}">
    <link rel="alternate" hreflang="de" href="{de_url}">
    <link rel="alternate" hreflang="x-default" href="{en_url}">"""
    
    # Insert after <meta charset> or <title>
    html = re.sub(r'(</title>)', r'\1' + hreflang_block, html, count=1)
    return html

def update_lang_attr(html, lang='en'):
    """Update the lang attribute on the html tag."""
    return re.sub(r'<html\s+lang=["\'][^"\']+["\']', f'<html lang="{lang}"', html, count=1)

def update_canonical(html, canonical_url):
    """Update canonical URL."""
    html = re.sub(r'<link\s+rel=["\']canonical["\']\s+href=["\'][^"\']+["\']', 
                  f'<link rel="canonical" href="{canonical_url}"', html)
    return html

def update_og_url(html, url):
    """Update og:url."""
    html = re.sub(r'<meta\s+property=["\']og:url["\']\s+content=["\'][^"\']+["\']',
                  f'<meta property="og:url" content="{url}"', html)
    return html

def update_twitter_site(html, lang):
    """Keep twitter:site pointing to @sipiteno (brand, not language-specific)."""
    return html  # No change needed

def translate_title_desc(html, lang):
    """Translate title and meta description."""
    title, desc = extract_page_meta(html)
    if not title:
        return html
    
    new_title = simple_translate(title, lang)
    new_desc = simple_translate(desc, lang) if desc else new_title
    
    html = re.sub(r'<title>.*?</title>', f'<title>{new_title}</title>', html, count=1)
    html = re.sub(r'(<meta\s+name=["\']description["\']\s+content=["\'])(.*?)(["\'])',
                  lambda m: m.group(1) + new_desc + m.group(3), html, count=1)
    html = re.sub(r'(<meta\s+content=["\'])(.*?)(["\']\s+name=["\']description["\'])',
                  lambda m: m.group(1) + new_desc + m.group(3), html, count=1)
    html = re.sub(r'(<meta\s+property=["\']og:title["\']\s+content=["\'])(.*?)(["\'])',
                  lambda m: m.group(1) + new_title + m.group(3), html, count=1)
    html = re.sub(r'(<meta\s+property=["\']og:description["\']\s+content=["\'])(.*?)(["\'])',
                  lambda m: m.group(1) + new_desc + m.group(3), html, count=1)
    html = re.sub(r'(<meta\s+name=["\']twitter:title["\']\s+content=["\'])(.*?)(["\'])',
                  lambda m: m.group(1) + new_title + m.group(3), html, count=1)
    html = re.sub(r'(<meta\s+name=["\']twitter:description["\']\s+content=["\'])(.*?)(["\'])',
                  lambda m: m.group(1) + new_desc + m.group(3), html, count=1)
    
    return html

def translate_json_ld_text(html, lang):
    """Translate natural-language strings inside JSON-LD blocks."""
    idx = 1 if lang == 'es' else 2
    
    def _translate_schema(match):
        text = match.group(0)
        # Don't translate identifiers/URLs, only natural language
        # Translate "name" and "description" fields
        text = re.sub(r'"name":\s*"(GitDealFlow|The Data Nerd|Startup Signals|VC Deal Flow Signal)"',
                      lambda m: f'"name": "{BRAND_EN.get(m.group(1), (m.group(1), m.group(1)))[idx-1]}"' if m.group(1) in BRAND_EN else m.group(0),
                      text)
        # Translate common terms in name/description fields
        text = re.sub(r'"name":\s*"([^"]*)"',
                      lambda m: f'"name": "{simple_translate(m.group(1), lang)}"',
                      text)
        text = re.sub(r'"description":\s*"([^"]*)"',
                      lambda m: f'"description": "{simple_translate(m.group(1), lang)}"',
                      text)
        return text
    
    html = re.sub(r'<script type="application/ld\+json">.*?</script>', _translate_schema, html, flags=re.DOTALL)
    return html

def has_decent_content(html):
    """Check if the page has enough body text to be worth translating."""
    body = extract_body_content(html)
    return len(body) > 100 or '404' not in html[:200]

def is_translatable_slug(slug):
    """Check if a path/slug is worth translating."""
    skip_patterns = [
        'yandex_', 'google', 'startupranking', 'sector-sweep', 
        'insider', 'firstlook', 'dashboard', 'thanks',
        'network', 'embed', 'widget', 'schema/', 
        '.xml', '.txt', '.json', '.md', '.js', '.css',
        'webmanifest', 'icon', 'png', 'jpg', 'svg',
        'apple-touch'
    ]
    for pat in skip_patterns:
        if pat in slug:
            return False
    return True

# ─── Main processing ──────────────────────────────────────────

def build():
    print("GitDealFlow i18n Generator")
    print("=" * 50)
    
    # Collect all HTML files
    html_files = []
    for root, dirs, files in os.walk(BASE):
        # Skip node_modules, es, de directories
        dirs[:] = [d for d in dirs if d not in ('node_modules', 'es', 'de')]
        for f in files:
            if f.endswith('.html'):
                rel = os.path.relpath(os.path.join(root, f), BASE)
                html_files.append(rel)
    
    html_files.sort()
    print(f"Found {len(html_files)} English HTML files")
    
    # Build URL mapping
    url_map = {}  # url_path -> {en: file, es: file, de: file}
    index_pages = []
    
    for rel in html_files:
        if '/es/' in rel or '/de/' in rel:
            continue
        if not is_translatable_slug(rel):
            print(f"  SKIP: {rel}")
            continue
        
        lang, url_path = get_url_parts(rel)
        url_map[url_path] = url_map.get(url_path, {})
        url_map[url_path][lang] = rel
        if rel.endswith('index.html') or rel == 'index.html':
            index_pages.append(rel)
    
    print(f"\nProcessing {len(url_map)} unique URL paths")
    
    # Build (es, de) translations for each page
    translated_count = 0
    for url_path, files in url_map.items():
        en_file = files.get('en')
        if not en_file:
            continue
        
        en_path = os.path.join(BASE, en_file)
        try:
            with open(en_path, 'r') as f:
                en_html = f.read()
        except:
            print(f"  ERROR reading {en_path}")
            continue
        
        if not has_decent_content(en_html):
            print(f"  SKIP (no content): {en_file}")
            continue
        
        en_url = make_lang_url('en', url_path)
        es_url = make_lang_url('es', url_path)
        de_url = make_lang_url('de', url_path)
        
        # For each language
        for lang in ('es', 'de'):
            # Determine output path: /es/<path> or /de/<path>
            if en_file == 'index.html':
                out_rel = f"{lang}/index.html"
            elif en_file.endswith('/index.html'):
                # e.g., sectors/fintech/index.html -> es/sectors/fintech/index.html
                out_rel = f"{lang}/{en_file}"
            else:
                out_rel = f"{lang}/{en_file}"
            
            out_path = os.path.join(BASE, out_rel)
            out_dir = os.path.dirname(out_path)
            os.makedirs(out_dir, exist_ok=True)
            
            # Start from English HTML
            html = en_html
            
            # Update lang attribute
            html = update_lang_attr(html, lang)
            
            # Update canonical
            html = update_canonical(html, es_url if lang == 'es' else de_url)
            
            # Update og:url
            html = update_og_url(html, es_url if lang == 'es' else de_url)
            
            # Translate title and meta descriptions
            html = translate_title_desc(html, lang)
            
            # Translate nav and common UI text
            html = simple_translate(html, lang)
            
            # Translate JSON-LD text
            html = translate_json_ld_text(html, lang)
            
            # Add hreflang links (with all three languages)
            html = add_hreflang_to_head(html, en_url, es_url, de_url, lang)
            
            # Write the translated file
            with open(out_path, 'w') as f:
                f.write(html)
            translated_count += 1
    
    print(f"\nGenerated {translated_count} translated pages")
    
    # ─── Now update all English pages with proper hreflang ───────
    print(f"\nUpdating English hreflang links...")
    updated_en = 0
    for url_path, files in url_map.items():
        en_file = files.get('en')
        if not en_file:
            continue
        
        en_path = os.path.join(BASE, en_file)
        try:
            with open(en_path, 'r') as f:
                html = f.read()
        except:
            continue
        
        en_url = make_lang_url('en', url_path)
        es_url = make_lang_url('es', url_path)
        de_url = make_lang_url('de', url_path)
        
        new_html = add_hreflang_to_head(html, en_url, es_url, de_url, 'en')
        
        if new_html != html:
            with open(en_path, 'w') as f:
                f.write(new_html)
            updated_en += 1
    
    print(f"Updated {updated_en} English pages with es/de hreflang")
    
    # ─── Generate language sitemaps ─────────────────────────────
    print(f"\nGenerating sitemaps...")
    
    # English sitemap
    en_urls = []
    es_urls = []
    de_urls = []
    
    for url_path in sorted(url_map.keys()):
        en_url = make_lang_url('en', url_path)
        es_url = make_lang_url('es', url_path)
        de_url = make_lang_url('de', url_path)
        en_urls.append(en_url)
        es_urls.append(es_url)
        de_urls.append(de_url)
    
    languages = {'pages': en_urls, 'es': es_urls, 'de': de_urls}
    
    for suffix, urls in languages.items():
        filename = f"sitemap-{suffix}.xml" if suffix != 'pages' else "sitemap-pages.xml"
        lines = ['<?xml version="1.0" encoding="UTF-8"?>',
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
        for u in urls:
            lines.append(f'  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>')
        lines.append('</urlset>')
        
        with open(os.path.join(BASE, filename), 'w') as f:
            f.write('\n'.join(lines) + '\n')
        print(f"  {filename}: {len(urls)} URLs")
    
    # sitemap-index.xml (2026-08-16: sitemap-pseo.xml/image-sitemap.xml lines
    # REMOVED - pseo was a 100% subset of sitemap-pages.xml, image sitemap
    # held a single URL. Do not re-add retired children here.)
    index = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
             f'  <sitemap><loc>https://{DOMAIN}/sitemap-pages.xml</loc><lastmod>{TODAY}</lastmod></sitemap>',
             f'  <sitemap><loc>https://{DOMAIN}/sitemap-es.xml</loc><lastmod>{TODAY}</lastmod></sitemap>',
             f'  <sitemap><loc>https://{DOMAIN}/sitemap-de.xml</loc><lastmod>{TODAY}</lastmod></sitemap>',
             '</sitemapindex>']
    
    with open(os.path.join(BASE, 'sitemap-index.xml'), 'w') as f:
        f.write('\n'.join(index) + '\n')
    print(f"  sitemap-index.xml updated with es/de sitemaps")
    
    print(f"\n✅ i18n generation complete!")
    print(f"   Translated pages: {translated_count}")
    print(f"   English pages updated with hreflang: {updated_en}")

if __name__ == "__main__":
    build()
