#!/usr/bin/env python3
"""
i18n Generator for gitdealflow.com — Spanish (es) and German (de).
V2: Fixes homepage URL mapping, cleans up schema URLs, better translation handling.
"""

import os, re, json, shutil
from datetime import date

BASE = os.path.expanduser("~/signals-gitdealflow/landing")
DOMAIN = "gitdealflow.com"
CANONICAL = f"https://{DOMAIN}"
TODAY = date.today().isoformat()

# ─── Translation maps ──────────────────────────────────────────

MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"]
MONTHS_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
MONTHS_DE = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]

COMMON_NAV = {
    "Pricing": ("Precios", "Preise"),
    "Get free signal": ("Obtén señal gratis", "Kostenloses Signal erhalten"),
    "Live signals": ("Señales en vivo", "Live-Signale"),
    "See pricing & start tracking →": ("Ver precios y empezar →", "Preise ansehen & starten →"),
}

TITLE_TRANSLATIONS = {
    "See Which Startups Are Heating Up 21–47 Days Before the Round — the Velocity Verdict": (
        "Descubre qué startups se calientan 21–47 días antes de la ronda — el Veredicto de Velocidad",
        "Entdecken Sie, welche Startups 21–47 Tage vor der Runde heiß laufen — das Velocity-Verdikt"
    ),
    "Startup Signals 21-47 Days Before the Round": (
        "Señales de Startups 21-47 Días Antes de la Ronda",
        "Startup-Signale 21-47 Tage vor der Runde"
    ),
    "The Velocity Verdict: five startups accelerating on GitHub, every Sunday — 21 to 47 days before the round.": (
        "El Veredicto de Velocidad: cinco startups acelerando en GitHub, cada domingo — 21 a 47 días antes de la ronda.",
        "Das Velocity-Verdikt: fünf Startups, die auf GitHub beschleunigen, jeden Sonntag — 21 bis 47 Tage vor der Runde."
    ),
    "About GitDealFlow — The Signal Behind the Velocity Verdict": (
        "Acerca de GitDealFlow — La Señal Detrás del Veredicto de Velocidad",
        "Über GitDealFlow — Das Signal hinter dem Velocity-Verdikt"
    ),
    "GitDealFlow — Startup Signals 21-47 Days Before the Round": (
        "GitDealFlow — Señales de Startups 21-47 Días Antes de la Ronda",
        "GitDealFlow — Startup-Signale 21-47 Tage vor der Runde"
    ),
    "GitDealFlow — The Velocity Verdict": (
        "GitDealFlow — El Veredicto de Velocidad",
        "GitDealFlow — Das Velocity-Verdikt"
    ),
    "GitDealFlow — Free startup signal checker": (
        "GitDealFlow — Comprobador gratuito de señales de startups",
        "GitDealFlow — Kostenloser Startup-Signal-Checker"
    ),
    "GitDealFlow — VC Deal Flow Signal & Startup Tracker": (
        "GitDealFlow — Señal de Flujo de Acuerdos VC y Rastreador de Startups",
        "GitDealFlow — VC-Deal-Flow-Signal & Startup-Tracker"
    ),
    "GitDealFlow | Deal Flow Signal &amp; Startup Tracker": (
        "GitDealFlow | Señal de Flujo de Acuerdos y Rastreador de Startups",
        "GitDealFlow | Deal-Flow-Signal & Startup-Tracker"
    ),
    "GitDealFlow vs ": ("GitDealFlow vs ", "GitDealFlow vs "),
}

DESC_TRANSLATIONS = {}
for k, v in TITLE_TRANSLATIONS.items():
    DESC_TRANSLATIONS[k] = v

# ─── Utility functions ─────────────────────────────────────────

def url_path_from_file(rel_path):
    """Convert a relative file path to a clean URL path.
    index.html -> /
    sectors/fintech/index.html -> /sectors/fintech
    london/index.html -> /london
    vs/crunchbase/index.html -> /vs/crunchbase
    about.html -> /about
    """
    if rel_path.endswith('.html'):
        rel_path = rel_path[:-5]
    if rel_path == 'index':
        return '/'
    if rel_path.endswith('/index'):
        rel_path = rel_path[:-6]
    if rel_path == '' or rel_path == '/':
        return '/'
    return '/' + rel_path

def make_lang_url(lang, url_path):
    """Build a full URL for a given language path."""
    if url_path == '/' or url_path == '':
        return f"https://{DOMAIN}/" if lang == 'en' else f"https://{DOMAIN}/{lang}/"
    if lang == 'en':
        return f"https://{DOMAIN}{url_path}"
    return f"https://{DOMAIN}/{lang}{url_path}"

def extract_page_meta(html):
    """Extract title and description from HTML."""
    title = ""
    m1 = re.search(r'<title>(.*?)</title>', html, re.DOTALL)
    if m1: title = m1.group(1).strip()
    desc = ""
    m2 = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.DOTALL)
    if m2: desc = m2.group(1).strip()
    m2b = re.search(r'<meta\s+content=["\'](.*?)["\']\s+name=["\']description["\']', html, re.DOTALL)
    if m2b: desc = m2b.group(1).strip()
    return title, desc

def translate_date(text, lang):
    for i, en in enumerate(MONTHS_EN):
        text = text.replace(en, MONTHS_ES[i] if lang == 'es' else MONTHS_DE[i])
    return text

def translate_title(title, lang):
    """Translate page titles using known mappings."""
    idx = 1 if lang == 'es' else 2
    for orig, pair in TITLE_TRANSLATIONS.items():
        if orig in title:
            return title.replace(orig, pair[idx-1])
    # Fallback: translate date and common terms
    result = translate_date(title, lang)
    # Translate "The Data Nerd"
    if lang == 'es':
        result = result.replace("The Data Nerd", "El Nerd de los Datos")
    elif lang == 'de':
        result = result.replace("The Data Nerd", "Der Daten-Nerd")
    return result

def translate_desc(desc, lang):
    """Translate descriptions using known mappings + fallbacks."""
    idx = 1 if lang == 'es' else 2
    for orig, pair in DESC_TRANSLATIONS.items():
        if orig in desc:
            return desc.replace(orig, pair[idx-1])
    result = translate_date(desc, lang)
    if lang == 'es':
        result = result.replace("The Data Nerd", "El Nerd de los Datos")
    elif lang == 'de':
        result = result.replace("The Data Nerd", "Der Daten-Nerd")
    return result

def has_decent_content(html):
    body = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
    body = re.sub(r'<style[^>]*>.*?</style>', '', body, flags=re.DOTALL)
    body = re.sub(r'<[^>]+>', ' ', body)
    body = re.sub(r'\s+', ' ', body).strip()
    return len(body) > 100

def is_translatable_slug(slug):
    skip_patterns = [
        'yandex_', 'google', 'startupranking', 'sector-sweep', 
        'insider', 'firstlook', 'dashboard', 'thanks',
        'embed', 'widget', 'schema/', 
        '.xml', '.txt', '.json', '.md', '.js', '.css',
        'webmanifest', 'icon', 'png', 'jpg', 'svg',
        'apple-touch',
        '.vercel/output'
    ]
    for pat in skip_patterns:
        if pat in slug:
            return False
    return True

def add_hreflang_to_head(html, en_url, es_url, de_url):
    """Remove existing hreflang lines and add correct ones after </title>."""
    html = re.sub(r'\s*<link\s+rel=["\']alternate["\']\s+hreflang=["\'][^"\']+["\']\s+href=["\'][^"\']+["\'][^>]*/?>\s*', '', html)
    
    hreflang_block = f"""
    <link rel="alternate" hreflang="en" href="{en_url}">
    <link rel="alternate" hreflang="es" href="{es_url}">
    <link rel="alternate" hreflang="de" href="{de_url}">
    <link rel="alternate" hreflang="x-default" href="{en_url}">"""
    
    html = re.sub(r'(</title>)', r'\1' + hreflang_block, html, count=1)
    return html

def update_lang_attr(html, lang):
    return re.sub(r'<html\s+lang=["\'][^"\']+["\']', f'<html lang="{lang}"', html, count=1)

def update_canonical(html, canonical_url, lang):
    """Update canonical URL to include language path."""
    # Current canonical will be like https://gitdealflow.com/london
    # For es: https://gitdealflow.com/es/london
    html = re.sub(r'<link\s+rel=["\']canonical["\']\s+href=["\'][^"\']+["\']', 
                  f'<link rel="canonical" href="{canonical_url}"', html)
    return html

def update_og_url(html, url):
    html = re.sub(r'<meta\s+property=["\']og:url["\']\s+content=["\'][^"\']+["\']',
                  f'<meta property="og:url" content="{url}"', html)
    return html

def update_title_desc(html, title, desc):
    """Replace title and all meta description variants."""
    # Title
    html = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', html, count=1)
    
    # Meta description
    html = re.sub(r'(<meta\s+name=["\']description["\']\s+content=["\'])(.*?)(["\'])',
                  lambda m: m.group(1) + desc + m.group(3), html, count=1)
    html = re.sub(r'(<meta\s+content=["\'])(.*?)(["\']\s+name=["\']description["\'])',
                  lambda m: m.group(1) + desc + m.group(3), html, count=1)
    
    # OG title/description
    html = re.sub(r'(<meta\s+property=["\']og:title["\']\s+content=["\'])(.*?)(["\'])',
                  lambda m: m.group(1) + title + m.group(3), html, count=1)
    html = re.sub(r'(<meta\s+property=["\']og:description["\']\s+content=["\'])(.*?)(["\'])',
                  lambda m: m.group(1) + desc + m.group(3), html, count=1)
    
    # Twitter title/description
    html = re.sub(r'(<meta\s+name=["\']twitter:title["\']\s+content=["\'])(.*?)(["\'])',
                  lambda m: m.group(1) + title + m.group(3), html, count=1)
    html = re.sub(r'(<meta\s+name=["\']twitter:description["\']\s+content=["\'])(.*?)(["\'])',
                  lambda m: m.group(1) + desc + m.group(3), html, count=1)
    
    return html

def update_schema_urls(html, lang, base_url):
    """Update URLs inside JSON-LD to point to the right language version."""
    def _replace_url(match):
        text = match.group(0)
        # Replace gitdealflow.com/... with lang-specific version where appropriate
        # But keep canonical URLs pointing to the lang version
        if f"https://{DOMAIN}/es/" not in text and f"https://{DOMAIN}/de/" not in text:
            if lang == 'es':
                text = re.sub(rf'https://{DOMAIN}/(?!es/)', rf'https://{DOMAIN}/es/', text)
            elif lang == 'de':
                text = re.sub(rf'https://{DOMAIN}/(?!de/)', rf'https://{DOMAIN}/de/', text)
        return text
    
    html = re.sub(r'<script type="application/ld\+json">.*?</script>', _replace_url, html, flags=re.DOTALL)
    return html

# ─── Main processing ──────────────────────────────────────────

def build():
    print("GitDealFlow i18n Generator v2")
    print("=" * 50)
    
    # Collect all HTML files (excluding es/de dirs and .vercel)
    html_files = []
    for root, dirs, files in os.walk(BASE):
        dirs[:] = [d for d in dirs if d not in ('node_modules', 'es', 'de', '.vercel')]
        for f in files:
            if f.endswith('.html'):
                rel = os.path.relpath(os.path.join(root, f), BASE)
                html_files.append(rel)
    
    html_files.sort()
    print(f"Found {len(html_files)} English HTML files")
    
    # Process each file
    english_processed = 0
    translated_written = 0
    
    for rel in html_files:
        if not is_translatable_slug(rel):
            print(f"  SKIP: {rel}")
            continue
        
        en_path = os.path.join(BASE, rel)
        try:
            with open(en_path, 'r') as f:
                en_html = f.read()
        except:
            print(f"  ERROR reading {en_path}")
            continue
        
        if not has_decent_content(en_html):
            print(f"  SKIP (thin): {rel}")
            continue
        
        url_path = url_path_from_file(rel)
        en_url = make_lang_url('en', url_path)
        es_url = make_lang_url('es', url_path)
        de_url = make_lang_url('de', url_path)
        
        title, desc = extract_page_meta(en_html)
        es_title = translate_title(title, 'es') if title else title
        es_desc = translate_desc(desc, 'es') if desc else desc
        de_title = translate_title(title, 'de') if title else title
        de_desc = translate_desc(desc, 'de') if desc else desc
        
        # ─── Update English with correct hreflang ───────
        en_updated = add_hreflang_to_head(en_html, en_url, es_url, de_url)
        if en_updated != en_html:
            with open(en_path, 'w') as f:
                f.write(en_updated)
            english_processed += 1
        
        # ─── Generate Spanish ───────────────────────────
        if rel == 'index.html':
            es_rel = 'es/index.html'
        elif rel.endswith('/index.html'):
            es_rel = f'es/{rel}'
        else:
            es_rel = f'es/{rel}'
        
        es_path = os.path.join(BASE, es_rel)
        os.makedirs(os.path.dirname(es_path), exist_ok=True)
        
        es_html = en_html
        es_html = update_lang_attr(es_html, 'es')
        es_html = update_canonical(es_html, es_url, 'es')
        es_html = update_og_url(es_html, es_url)
        es_html = update_title_desc(es_html, es_title, es_desc)
        es_html = update_schema_urls(es_html, 'es', es_url)
        es_html = add_hreflang_to_head(es_html, en_url, es_url, de_url)
        
        # Translate navigation text
        for en_text, (es_text, _) in COMMON_NAV.items():
            es_html = es_html.replace(en_text, es_text)
        
        with open(es_path, 'w') as f:
            f.write(es_html)
        translated_written += 1
        
        # ─── Generate German ─────────────────────────────
        if rel == 'index.html':
            de_rel = 'de/index.html'
        elif rel.endswith('/index.html'):
            de_rel = f'de/{rel}'
        else:
            de_rel = f'de/{rel}'
        
        de_path = os.path.join(BASE, de_rel)
        os.makedirs(os.path.dirname(de_path), exist_ok=True)
        
        de_html = en_html
        de_html = update_lang_attr(de_html, 'de')
        de_html = update_canonical(de_html, de_url, 'de')
        de_html = update_og_url(de_html, de_url)
        de_html = update_title_desc(de_html, de_title, de_desc)
        de_html = update_schema_urls(de_html, 'de', de_url)
        de_html = add_hreflang_to_head(de_html, en_url, es_url, de_url)
        
        for en_text, (_, de_text) in COMMON_NAV.items():
            de_html = de_html.replace(en_text, de_text)
        
        with open(de_path, 'w') as f:
            f.write(de_html)
        translated_written += 1
    
    print(f"\nUpdated {english_processed} English pages with es/de hreflang")
    print(f"Generated {translated_written} translated pages ({translated_written//2} es + {translated_written//2} de)")
    
    # Generate language sitemaps
    print(f"\nGenerating sitemaps...")
    
    # Always include homepage
    seen = set()
    en_urls = []
    es_urls = []
    de_urls = []
    
    # Homepage always first
    en_urls.append(make_lang_url('en', '/'))
    es_urls.append(make_lang_url('es', '/'))
    de_urls.append(make_lang_url('de', '/'))
    
    for rel in html_files:
        if not is_translatable_slug(rel) or rel.startswith(('es/', 'de/')):
            continue
        # Skip very thin pages (but index.html is always OK)
        if rel != 'index.html' and not has_decent_content(open(os.path.join(BASE, rel), 'r').read()):
            continue
        url_path = url_path_from_file(rel)
        if url_path in seen or url_path == '/':
            continue
        # Skip 404 pages
        if '404' in url_path.split('/')[-1]:
            continue
        seen.add(url_path)
        en_urls.append(make_lang_url('en', url_path))
        es_urls.append(make_lang_url('es', url_path))
        de_urls.append(make_lang_url('de', url_path))
    
    def write_sitemap(filename, urls):
        lines = ['<?xml version="1.0" encoding="UTF-8"?>',
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
        for u in urls:
            lines.append(f'  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>')
        lines.append('</urlset>')
        with open(os.path.join(BASE, filename), 'w') as f:
            f.write('\n'.join(lines) + '\n')
    
    write_sitemap('sitemap-pages.xml', en_urls)
    write_sitemap('sitemap-es.xml', es_urls)
    write_sitemap('sitemap-de.xml', de_urls)
    
    index = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
             f'  <sitemap><loc>https://{DOMAIN}/sitemap-pages.xml</loc><lastmod>{TODAY}</lastmod></sitemap>',
             f'  <sitemap><loc>https://{DOMAIN}/sitemap-pseo.xml</loc><lastmod>{TODAY}</lastmod></sitemap>',
             f'  <sitemap><loc>https://{DOMAIN}/sitemap-es.xml</loc><lastmod>{TODAY}</lastmod></sitemap>',
             f'  <sitemap><loc>https://{DOMAIN}/sitemap-de.xml</loc><lastmod>{TODAY}</lastmod></sitemap>',
             f'  <sitemap><loc>https://{DOMAIN}/image-sitemap.xml</loc><lastmod>{TODAY}</lastmod></sitemap>',
             '</sitemapindex>']
    
    with open(os.path.join(BASE, 'sitemap-index.xml'), 'w') as f:
        f.write('\n'.join(index) + '\n')
    
    print(f"  sitemap-pages.xml: {len(en_urls)} URLs")
    print(f"  sitemap-es.xml: {len(es_urls)} URLs")
    print(f"  sitemap-de.xml: {len(de_urls)} URLs")
    print(f"\n✅ i18n v2 generation complete!")

if __name__ == "__main__":
    build()
