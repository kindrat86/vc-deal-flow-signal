#!/Users/sipi/.local/bin/python3.11
"""Publish and verify replies 2-6 for the 2026-08-21 X methodology thread."""
from __future__ import annotations

import json
import subprocess
import time
from pathlib import Path

ROOT = "https://x.com/sipiteno/status/2090639979533705553"
THREAD = [
    "3/4 Deploy frequency spike\n\nCommit velocity is up 150% or more against the prior 14-day window.\n\nThe comparison is against the team's own baseline, not against another company.",
    "4/4 Framework migration\n\nGeneral acceleration that does not meet another signal threshold.\n\nUseful context: public repositories miss private work, and commit activity does not measure code quality.",
    "This week's report covers public GitHub activity across 350+ startups in 15 sectors.\n\nUse it to decide what to investigate, then verify the company, the team, and the market yourself.\n\nLive report: https://signals.gitdealflow.com/weekly?utm_source=x&utm_medium=organic&utm_campaign=weekly-methodology-chart&utm_content=2026-08-21\n\nSource: https://signals.gitdealflow.com/methodology",
]
OUT = Path("distribution/x-weekly-methodology-thread-2026-08-21-published.json")


def osa(script: str) -> str:
    result = subprocess.run(["osascript", "-e", script], text=True, capture_output=True, timeout=60)
    if result.returncode:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return result.stdout.strip()


def write_js(path: Path, source: str) -> None:
    path.write_text(source, encoding="ascii")


def call_js(tab_index: int, js_path: Path) -> str:
    return osa(
        'tell application "Safari" to do JavaScript (read POSIX file "' + str(js_path) + '") '
        + f'in tab {tab_index} of window 2'
    )


def new_tab(url: str) -> int:
    return int(osa(
        'tell application "Safari" to tell window 2 to make new tab at end of tabs '
        + f'with properties {{URL:"{url}"}}\n'
        + 'tell application "Safari" to tell window 2 to return count of tabs'
    ))


def close_tab(tab_index: int) -> None:
    osa(f'tell application "Safari" to close tab {tab_index} of window 2')


def paste_js(text: str) -> str:
    return """(function () {
const text = %s;
const el = document.querySelector('[data-testid=\\"tweetTextarea_0\\"]');
if (!el) return JSON.stringify({error:'NO_TEXTAREA'});
el.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));
el.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));
el.dispatchEvent(new MouseEvent('click',{bubbles:true}));
el.focus();
const dt = new DataTransfer(); dt.setData('text/plain', text);
const ev = new Event('paste',{bubbles:true,cancelable:true});
Object.defineProperty(ev,'clipboardData',{value:dt}); el.dispatchEvent(ev);
return JSON.stringify({dispatched:true});
})()""" % json.dumps(text, ensure_ascii=True)


def verify_compose_js() -> str:
    return """(function(){const e=document.querySelector('[data-testid=\\"tweetTextarea_0\\"]');const b=document.querySelector('[data-testid=\\"tweetButtonInline\\"]');return JSON.stringify({text:e?e.innerText:'',enabled:b?(!b.disabled&&b.getAttribute('aria-disabled')!=='true'):false});})()"""


def click_js() -> str:
    return """(function(){const b=document.querySelector('[data-testid=\\"tweetButtonInline\\"]');if(!b)return JSON.stringify({error:'NO_BUTTON'});if(b.disabled||b.getAttribute('aria-disabled')==='true')return JSON.stringify({error:'DISABLED'});b.click();return JSON.stringify({clicked:true});})()"""


def toast_js() -> str:
    return """(function(){const x=document.querySelector('[data-testid=\\"toast\\"]');return x?x.textContent:''})()"""


def find_js(snippet: str) -> str:
    return """(function(){const wanted=%s;for(const a of document.querySelectorAll('article[data-testid=\\"tweet\\"]')){const b=a.querySelector('[data-testid=\\"tweetText\\"]');if(b&&b.innerText.includes(wanted)){const l=a.querySelector('a[href*=\\"/status/\\"]');return JSON.stringify({found:true,text:b.innerText,href:l?l.getAttribute('href'):''});}}return JSON.stringify({found:false});})()""" % json.dumps(snippet, ensure_ascii=True)


def set_url(tab_index: int, url: str) -> None:
    osa(f'tell application "Safari" to set URL of tab {tab_index} of window 2 to "{url}"')


published: list[dict[str, str]] = []
parent = ROOT
for index, text in enumerate(THREAD, 4):
    tab = new_tab(parent)
    time.sleep(5)
    base = Path(f"/tmp/gdf_x_reply_{index}")
    write_js(base.with_suffix('.paste.js'), paste_js(text))
    write_js(base.with_suffix('.verify.js'), verify_compose_js())
    write_js(base.with_suffix('.click.js'), click_js())
    write_js(base.with_suffix('.toast.js'), toast_js())
    injected = json.loads(call_js(tab, base.with_suffix('.paste.js')))
    if injected.get('error'):
        raise RuntimeError(f"post {index}: {injected}")
    time.sleep(3)
    compose = json.loads(call_js(tab, base.with_suffix('.verify.js')))
    if compose.get('text', '').strip() != text or not compose.get('enabled'):
        raise RuntimeError(f"post {index}: compose verification failed: {compose}")
    clicked = json.loads(call_js(tab, base.with_suffix('.click.js')))
    if clicked.get('error'):
        raise RuntimeError(f"post {index}: {clicked}")
    time.sleep(6)
    toast = call_js(tab, base.with_suffix('.toast.js'))
    if 'Your post was sent' not in toast:
        raise RuntimeError(f"post {index}: no sent toast: {toast!r}")
    set_url(tab, 'https://x.com/sipiteno/with_replies')
    time.sleep(7)
    write_js(base.with_suffix('.find.js'), find_js(text[:32]))
    found = json.loads(call_js(tab, base.with_suffix('.find.js')))
    if not found.get('found') or found.get('text', '').strip() != text:
        raise RuntimeError(f"post {index}: live verification failed: {found}")
    parent = 'https://x.com' + found['href']
    published.append({'post': str(index), 'url': parent, 'text': text})
    close_tab(tab)

OUT.write_text(json.dumps({'root': ROOT, 'replies': published}, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'root': ROOT, 'replies': published}, indent=2))
