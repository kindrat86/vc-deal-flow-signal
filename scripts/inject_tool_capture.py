#!/usr/bin/env python3
"""Inject the GDF Sunday-signup capture block into calculator tool pages.

Places a styled email-capture card directly under the results block of each
calculator, wired to the proven /api/subscribe endpoint (same payload shape
as the Momentum Checker's #gdf-capture form), hidden until results render.

Idempotent: skips any file that already contains id="gdf-tool-capture".
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

LANDING = Path(__file__).resolve().parent.parent / "landing"

# file -> (source label for attribution, result element id)
PAGES = {
    "tools/runway-calculator.html": ("runway-calculator", "results"),
    "tools/burn-rate-analyzer.html": ("burn-rate-analyzer", "results"),
    "tools/deal-flow-funnel.html": ("deal-flow-funnel", "results"),
    "tools/investment-calculator/index.html": ("investment-calculator", "result-card"),
}

CAPTURE_CSS = """
  /* GDF tool capture (launch-day 2026-08-29) */
  .gdf-capture-card { border:1px solid var(--accent,#60a5fa); background:linear-gradient(135deg, var(--accent-dim,rgba(96,165,250,.15)), transparent 60%); }
  .gdf-capture-card h2 { font-size:1.25rem; font-weight:700; text-align:center; margin:0 0 8px; }
  .gdf-capture-card p.sub { text-align:center; color:var(--text-muted,#94a3b8); font-size:.92rem; margin:0 auto 16px; max-width:520px; }
  .gdf-capture-card form { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
  .gdf-capture-card input[type="email"] { flex:1 1 240px; max-width:360px; background:var(--bg-input,#0f172a); border:1px solid var(--border,#334155); color:var(--text,#e2e8f0); padding:13px 16px; border-radius:8px; font-size:1rem; font-family:inherit; min-height:48px; }
  .gdf-capture-card button { font:inherit; font-size:.98rem; font-weight:600; padding:13px 22px; min-height:48px; border-radius:8px; border:1px solid var(--accent,#60a5fa); background:var(--accent,#60a5fa); color:#fff; cursor:pointer; }
  .gdf-capture-card button:hover { background:var(--accent-hover,#3b82f6); }
  .gdf-capture-msg { text-align:center; font-size:.85rem; color:var(--text-muted,#94a3b8); margin:12px 0 0; }
  .gdf-capture-card .fineprint { text-align:center; font-size:.8rem; color:var(--text-muted,#94a3b8); margin:8px 0 0; }
"""

CAPTURE_HTML = """
  <div class="card gdf-capture-card" id="gdf-tool-capture" style="display:none;margin-top:24px">
    <h2>Want the five teams accelerating fastest, every Sunday?</h2>
    <p class="sub">You ran the numbers. The Sunday email flags the five startups accelerating hardest on GitHub, each with the plain-English why. The documented examples show the pattern 21 to 47 days before public fundraise announcements. Free, no card, one click to leave.</p>
    <form id="gdf-tool-capture-form">
      <input type="email" id="gdf-tool-capture-email" required inputmode="email" autocomplete="email" enterkeyhint="send" placeholder="you@example.com" aria-label="Email address">
      <button type="submit">Get this Sunday's 5 names</button>
    </form>
    <p class="gdf-capture-msg" id="gdf-tool-capture-msg" role="status"></p>
    <p class="fineprint">One email a week. Unsubscribe anytime. Check your inbox to confirm.</p>
  </div>
"""

CAPTURE_JS = """
  <script>
  (function(){
    var box=document.getElementById('gdf-tool-capture');
    if(!box) return;
    var form=document.getElementById('gdf-tool-capture-form');
    var emailEl=document.getElementById('gdf-tool-capture-email');
    var msgEl=document.getElementById('gdf-tool-capture-msg');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var v=(emailEl.value||'').trim();
      if(!v){ msgEl.textContent='Enter an email address to continue.'; msgEl.style.color='#f87171'; return; }
      var qs=new URLSearchParams(window.location.search);
      var stored={}; try{ stored=JSON.parse(sessionStorage.getItem('gdf_attr')||'{}'); }catch(_){}
      var body={
        email:v, source:'__SOURCE__',
        utm_source:qs.get('utm_source')||stored.utm_source||'',
        utm_medium:qs.get('utm_medium')||stored.utm_medium||'',
        utm_campaign:qs.get('utm_campaign')||stored.utm_campaign||'',
        referrer:stored.referrer||document.referrer||'',
        landing_path:stored.landing_path||(window.location.pathname+window.location.search),
        tz:(function(){ try{ var t=Intl.DateTimeFormat().resolvedOptions().timeZone; return (typeof t==='string'&&t.indexOf('/')!==-1)?t:''; }catch(_){return '';} })(),
        website:''
      };
      var btn=form.querySelector('button');
      var orig=btn.textContent; btn.disabled=true; btn.textContent='Sending...';
      fetch('https://signals.gitdealflow.com/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
        .then(function(r){return r.json();})
        .then(function(d){
          btn.disabled=false; btn.textContent=orig;
          if(d&&d.ok){ msgEl.textContent='Check your inbox to confirm. The five names land Sunday.'; msgEl.style.color='#34d399'; emailEl.value=''; }
          else { msgEl.textContent='Something went wrong. Try again, or email signal@gitdealflow.com.'; msgEl.style.color='#f87171'; }
        })
        .catch(function(){ btn.disabled=false; btn.textContent=orig; msgEl.textContent='Something went wrong. Try again.'; msgEl.style.color='#f87171'; });
    });
    function reveal(){
      if(!box) return;
      if(document.getElementById('__RESULT_ID__') && document.getElementById('__RESULT_ID__').classList.contains('show')){ box.style.display='block'; }
    }
    // reveal when results show: hook calculate + watch the class change
    var _orig = window.calculate;
    if(typeof _orig==='function'){ window.calculate=function(){ var out=_orig.apply(this,arguments); setTimeout(reveal,50); return out; }; }
    var mo=new MutationObserver(function(){ reveal(); });
    var res=document.getElementById('__RESULT_ID__');
    if(res){ mo.observe(res,{attributes:true,attributeFilter:['class']}); }
  })();
  </script>
"""

def inject(path: Path, source: str, result_id: str) -> str:
    s = path.read_text(encoding="utf-8")
    if 'id="gdf-tool-capture"' in s:
        return "already-injected"
    if f'id="{result_id}"' not in s:
        return "no-results-anchor"

    # 1) CSS: append inside the last <style> block
    i = s.rfind("</style>")
    if i == -1:
        return "no-style-block"
    s = s[:i] + CAPTURE_CSS + s[i:]

    # 2) HTML: insert the capture card right after the closing of the results div.
    #    The results div closes right before the FAQ card. Find the FAQ card anchor.
    faq = s.find('class="card faq"')
    if result_id == "result-card":
        faq = s.find('class="powered-by"')
    if faq == -1:
        # fallback: insert before the footer
        foot = s.find('class="footer"')
        if foot == -1:
            return "no-insert-anchor"
        anchor = foot
        # walk back to the start of the footer's containing div line
        start = s.rfind("<div", 0, anchor)
    else:
        start = s.rfind("<div", 0, faq)
    s = s[:start].rstrip() + "\n\n" + CAPTURE_HTML.lstrip("\n") + s[start:]

    # 3) JS: insert before the lazy pixels loader script (or before </body>)
    pix = s.find("requestIdleCallback(_load")
    if pix != -1:
        j = s.rfind("<script>", 0, pix)
    else:
        j = s.rfind("</body>")
    capture_js = CAPTURE_JS.replace("__SOURCE__", source).replace("__RESULT_ID__", result_id)
    s = s[:j].rstrip() + "\n\n" + capture_js.lstrip("\n") + s[j:]

    path.write_text(s, encoding="utf-8")
    return "injected"

def main() -> int:
    rc = 0
    for rel, (source, result_id) in PAGES.items():
        p = LANDING / rel
        if not p.exists():
            print(f"MISSING {rel}")
            rc = 1
            continue
        print(f"{rel}: {inject(p, source, result_id)}")
    return rc

if __name__ == "__main__":
    sys.exit(main())
