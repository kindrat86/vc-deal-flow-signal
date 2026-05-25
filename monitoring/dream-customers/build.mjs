#!/usr/bin/env node
/**
 * Build monitoring/dream-customers/dashboard.html from data.json.
 *
 * Why a build step instead of a runtime fetch: the dashboard is opened from
 * file:// (no localhost server), and Chrome blocks `fetch('./data.json')`
 * under file:// for cross-origin reasons. Inlining the data into a single
 * self-contained HTML file sidesteps that entirely.
 *
 * Idempotent — safe to run on every cron tick.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = join(here, "data.json");
const outPath = join(here, "dashboard.html");

const data = JSON.parse(readFileSync(dataPath, "utf8"));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Dream Customers CRM</title>
<style>
  * { box-sizing: border-box; }
  body { margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#0b1220; color:#e2e8f0; }
  header { padding:14px 20px; border-bottom:1px solid #1e293b; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
  header h1 { margin:0; font-size:16px; font-weight:600; color:#f1f5f9; }
  header .meta { font-size:11px; color:#64748b; }
  header .actions { display:flex; gap:8px; align-items:center; }
  header button, header select { background:#1e293b; color:#cbd5e1; border:1px solid #334155; border-radius:6px; padding:6px 10px; font-size:12px; cursor:pointer; }
  header button:hover { background:#334155; }
  .board { display:flex; gap:10px; padding:14px; overflow-x:auto; min-height: calc(100vh - 60px); align-items:flex-start; }
  .col { width:280px; flex:0 0 280px; background:rgba(15,23,42,0.5); border:1px solid #1e293b; border-radius:8px; display:flex; flex-direction:column; }
  .col.drag-over { border-color:#0ea5e9; background:#082f49; }
  .col h2 { margin:0; padding:10px 12px; border-bottom:1px solid #1e293b; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:#cbd5e1; display:flex; justify-content:space-between; align-items:center; }
  .col h2 .count { font-family:ui-monospace,Menlo,monospace; color:#64748b; font-weight:400; }
  .col .cards { padding:8px; display:flex; flex-direction:column; gap:6px; min-height:80px; }
  .col .empty { color:#475569; font-size:11px; text-align:center; padding:18px 0; }
  .card { background:#111a2e; border:1px solid #1e293b; border-radius:6px; padding:8px 10px; font-size:12.5px; cursor:grab; transition:border-color .12s; }
  .card:hover { border-color:#334155; }
  .card.dragging { opacity:0.4; }
  .card.fresh { border-left:3px solid #f59e0b; }
  .card .name { font-weight:600; color:#f1f5f9; }
  .card .handle { color:#0ea5e9; font-size:11px; }
  .card .handle a { color:inherit; text-decoration:none; }
  .card .handle a:hover { text-decoration:underline; }
  .card .firm { color:#94a3b8; font-size:10.5px; margin-top:2px; }
  .card .bottom { display:flex; align-items:center; justify-content:space-between; gap:6px; margin-top:6px; }
  .card .chips { display:flex; gap:4px; }
  .chip { font-size:9.5px; padding:1px 5px; border-radius:3px; line-height:1.4; }
  .chip.seg-A { background:rgba(99,102,241,0.18); color:#a5b4fc; }
  .chip.seg-B { background:rgba(16,185,129,0.18); color:#6ee7b7; }
  .chip.seg-D { background:rgba(245,158,11,0.18); color:#fcd34d; }
  .chip.seg-F { background:rgba(244,63,94,0.18); color:#fda4af; }
  .chip.conf-HIGH { background:rgba(34,197,94,0.12); color:#86efac; border:1px solid rgba(34,197,94,0.4); }
  .chip.conf-MEDIUM { background:transparent; color:#fcd34d; border:1px dashed rgba(245,158,11,0.5); }
  .chip.conf-LOW { background:transparent; color:#64748b; border:1px dotted #475569; }
  .counter { display:flex; align-items:center; gap:3px; font-size:11px; }
  .counter button { width:18px; height:18px; padding:0; border:0; background:#1e293b; color:#cbd5e1; border-radius:3px; cursor:pointer; font-size:11px; line-height:1; }
  .counter button:hover { background:#334155; }
  .counter button:disabled { opacity:0.3; cursor:not-allowed; }
  .counter .n { min-width:18px; text-align:center; font-family:ui-monospace,Menlo,monospace; color:#cbd5e1; }
  .card .signal { margin-top:6px; padding-top:6px; border-top:1px solid #1e293b; font-size:10.5px; color:#94a3b8; line-height:1.4; }
  .card .signal .tweet { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; color:#cbd5e1; margin-top:2px; }
  .card .signal .when { color:#f59e0b; font-weight:600; }
  .card .signal .when.cool { color:#64748b; font-weight:400; }
  .drawer-mask { position:fixed; inset:0; background:rgba(0,0,0,0.6); display:none; z-index:50; }
  .drawer { position:fixed; top:0; right:0; bottom:0; width:380px; background:#0b1220; border-left:1px solid #1e293b; padding:16px; overflow-y:auto; z-index:51; display:none; }
  .drawer.open, .drawer-mask.open { display:block; }
  .drawer h3 { margin:0 0 14px; font-size:13px; color:#f1f5f9; display:flex; justify-content:space-between; align-items:center; }
  .drawer label { display:block; margin-bottom:12px; font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:0.8px; }
  .drawer textarea, .drawer select, .drawer input { width:100%; background:#0b1220; border:1px solid #334155; color:#e2e8f0; padding:6px 8px; border-radius:4px; font-size:13px; font-family:inherit; margin-top:4px; }
  .drawer textarea { min-height:140px; resize:vertical; font-family:ui-monospace,Menlo,monospace; font-size:11.5px; }
  .drawer .actions { display:flex; gap:8px; justify-content:flex-end; margin-top:16px; padding-top:12px; border-top:1px solid #1e293b; }
  .drawer .actions button { background:#0ea5e9; color:#0b1220; border:0; padding:6px 12px; border-radius:4px; font-size:12px; font-weight:600; cursor:pointer; }
  .drawer .actions button.secondary { background:#1e293b; color:#cbd5e1; }
  .toast { position:fixed; bottom:16px; right:16px; background:#1e293b; border:1px solid #334155; padding:8px 12px; border-radius:6px; font-size:12px; z-index:100; opacity:0; transition:opacity .2s; }
  .toast.show { opacity:1; }
  .filter-bar { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
  .filter-bar label { font-size:11px; color:#64748b; }
  .filter-bar input { width:140px; }
</style>
</head>
<body>
<header>
  <div>
    <h1>Dream Customers CRM</h1>
    <div class="meta" id="meta">73 contacts · last cron run: <span id="cron-when">never</span></div>
  </div>
  <div class="actions filter-bar">
    <label>Segment <select id="filter-seg"><option value="">all</option><option>A</option><option>B</option><option>D</option><option>F</option></select></label>
    <label>Search <input id="filter-q" type="text" placeholder="name / handle / firm"></label>
    <button id="reset-state" title="Clear local stage/notes/counter for every contact">reset local</button>
    <button id="export-json" title="Download local state as JSON">export</button>
  </div>
</header>

<div class="board" id="board"></div>

<div class="drawer-mask" id="mask"></div>
<aside class="drawer" id="drawer">
  <h3>Edit contact <button id="close" class="secondary" style="background:#1e293b;color:#94a3b8;border:0;font-size:18px;line-height:1;cursor:pointer;">×</button></h3>
  <div id="drawer-body"></div>
</aside>
<div class="toast" id="toast"></div>

<script id="data" type="application/json">${JSON.stringify(data).replace(/<\//g, "<\\/")}</script>

<script>
(function () {
  const STAGES = [
    { key: "sourced", label: "Sourced" },
    { key: "followed", label: "Followed" },
    { key: "engaged", label: "Engaged" },
    { key: "acknowledged", label: "Acknowledged" },
    { key: "outreach_sent", label: "Outreach Sent" },
    { key: "in_conversation", label: "In Conversation" },
    { key: "trial", label: "Trial Signup" },
    { key: "paying", label: "Paying" },
    { key: "champion", label: "Champion" },
  ];

  const DATA = JSON.parse(document.getElementById("data").textContent);
  const LS_KEY = "dream-customers/v1";

  function loadLocal() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
    catch { return {}; }
  }
  function saveLocal(state) {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  const local = loadLocal();
  // Schema of local: { [handle]: { stage, counter, notes } }
  function get(handle) {
    if (!local[handle]) local[handle] = { stage: "sourced", counter: 0, notes: "" };
    return local[handle];
  }

  function toast(msg, ms = 2200) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), ms);
  }

  function relTime(iso) {
    if (!iso) return null;
    const ms = Date.now() - new Date(iso).getTime();
    if (isNaN(ms)) return null;
    const m = Math.floor(ms / 60000);
    if (m < 1) return "just now";
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    const d = Math.floor(h / 24);
    return d + "d ago";
  }
  function isFresh(iso) {
    if (!iso) return false;
    return Date.now() - new Date(iso).getTime() < 12 * 3600 * 1000;
  }

  let filterSeg = "";
  let filterQ = "";

  function matchesFilter(c) {
    if (filterSeg && c.segment !== filterSeg) return false;
    if (filterQ) {
      const q = filterQ.toLowerCase();
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.handle.toLowerCase().includes(q) &&
        !(c.firm || "").toLowerCase().includes(q)
      ) return false;
    }
    return true;
  }

  function render() {
    document.getElementById("cron-when").textContent = relTime(DATA.generated_at) || "never";
    document.getElementById("meta").innerHTML =
      DATA.contacts.length + " contacts · last cron run: <span id=\\"cron-when\\">" +
      (relTime(DATA.generated_at) || "never") + "</span>";

    const board = document.getElementById("board");
    board.innerHTML = "";
    const byStage = Object.fromEntries(STAGES.map((s) => [s.key, []]));
    for (const c of DATA.contacts) {
      if (!matchesFilter(c)) continue;
      const u = get(c.handle);
      const stage = byStage[u.stage] ? u.stage : "sourced";
      byStage[stage].push(c);
    }
    for (const s of STAGES) {
      const col = document.createElement("section");
      col.className = "col";
      col.dataset.stage = s.key;
      const cards = byStage[s.key];
      col.innerHTML =
        '<h2>' + s.label + ' <span class="count">' + cards.length + '</span></h2>' +
        '<div class="cards"></div>';
      const cardsEl = col.querySelector(".cards");
      if (cards.length === 0) {
        cardsEl.innerHTML = '<div class="empty">drop here</div>';
      } else {
        for (const c of cards) cardsEl.appendChild(makeCard(c));
      }
      attachDropTargets(col);
      board.appendChild(col);
    }
  }

  function makeCard(c) {
    const u = get(c.handle);
    const el = document.createElement("article");
    el.className = "card" + (isFresh(c.last_tweet_at) ? " fresh" : "");
    el.draggable = true;
    el.dataset.handle = c.handle;
    let signal = "";
    if (c.last_tweet_at) {
      const when = relTime(c.last_tweet_at);
      const cls = isFresh(c.last_tweet_at) ? "" : "cool";
      signal = '<div class="signal"><span class="when ' + cls + '">posted ' +
        escapeHtml(when || "") + '</span>' +
        (c.last_tweet_text ? '<div class="tweet">' + escapeHtml(c.last_tweet_text) + '</div>' : "") +
        '</div>';
    }
    el.innerHTML =
      '<div class="name">' + escapeHtml(c.name) + '</div>' +
      '<div class="handle"><a href="https://x.com/' + encodeURIComponent(c.handle) +
        '" target="_blank" rel="noopener">@' + escapeHtml(c.handle) + '</a></div>' +
      (c.firm || c.role
        ? '<div class="firm">' + escapeHtml([c.firm, c.role].filter(Boolean).join(" · ")) + '</div>'
        : "") +
      '<div class="bottom">' +
        '<div class="chips">' +
          (c.segment ? '<span class="chip seg-' + c.segment + '">' + c.segment + '</span>' : "") +
          (c.confidence ? '<span class="chip conf-' + c.confidence + '">' + c.confidence.toLowerCase() + '</span>' : "") +
        '</div>' +
        '<div class="counter">' +
          '<button data-delta="-1"' + (u.counter <= 0 ? " disabled" : "") + ' title="decrement comment count">−</button>' +
          '<span class="n">' + u.counter + '</span>' +
          '<button data-delta="1" title="increment comment count">+</button>' +
        '</div>' +
      '</div>' +
      signal;

    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", c.handle);
      el.classList.add("dragging");
    });
    el.addEventListener("dragend", () => el.classList.remove("dragging"));
    el.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) return;
      openDrawer(c);
    });
    el.querySelectorAll(".counter button").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const delta = Number(b.dataset.delta);
        u.counter = Math.max(0, u.counter + delta);
        saveLocal(local);
        render();
      });
    });
    return el;
  }

  function attachDropTargets(col) {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      col.classList.add("drag-over");
    });
    col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
    col.addEventListener("drop", (e) => {
      e.preventDefault();
      col.classList.remove("drag-over");
      const handle = e.dataTransfer.getData("text/plain");
      if (!handle) return;
      const u = get(handle);
      const newStage = col.dataset.stage;
      if (u.stage === newStage) return;
      u.stage = newStage;
      saveLocal(local);
      render();
      toast(handle + " → " + STAGES.find((s) => s.key === newStage).label);
    });
  }

  function openDrawer(c) {
    const u = get(c.handle);
    const body = document.getElementById("drawer-body");
    body.innerHTML =
      '<div style="font-size:13px;margin-bottom:14px;">' +
        '<div style="font-weight:600;color:#f1f5f9;">' + escapeHtml(c.name) + '</div>' +
        '<a href="https://x.com/' + encodeURIComponent(c.handle) +
          '" target="_blank" rel="noopener" style="color:#0ea5e9;font-size:12px;">@' +
          escapeHtml(c.handle) + ' ↗</a>' +
        '<div style="color:#94a3b8;font-size:11.5px;margin-top:2px;">' +
          escapeHtml([c.firm, c.role].filter(Boolean).join(" · ")) + '</div>' +
      '</div>' +
      '<label>Stage <select id="d-stage">' +
        STAGES.map((s) => '<option value="' + s.key + '"' +
          (s.key === u.stage ? " selected" : "") + '>' + s.label + '</option>').join("") +
      '</select></label>' +
      '<label>Comments left <input type="number" min="0" id="d-counter" value="' + u.counter + '"></label>' +
      '<label>Notes <textarea id="d-notes" placeholder="What did they say? What\\'s the next move?">' +
        escapeHtml(u.notes || "") + '</textarea></label>' +
      (c.last_tweet_at
        ? '<div style="font-size:11px;color:#64748b;margin-top:8px;">Last tweet ' +
            relTime(c.last_tweet_at) + (c.last_tweet_text
              ? '<div style="color:#cbd5e1;margin-top:4px;font-size:11px;">' +
                escapeHtml(c.last_tweet_text) + '</div>'
              : "") +
          '</div>'
        : "") +
      '<div class="actions">' +
        '<button class="secondary" id="d-cancel">cancel</button>' +
        '<button id="d-save">save</button>' +
      '</div>';
    document.getElementById("d-cancel").addEventListener("click", closeDrawer);
    document.getElementById("d-save").addEventListener("click", () => {
      u.stage = document.getElementById("d-stage").value;
      u.counter = Math.max(0, parseInt(document.getElementById("d-counter").value, 10) || 0);
      u.notes = document.getElementById("d-notes").value;
      saveLocal(local);
      closeDrawer();
      render();
      toast("Saved");
    });
    document.getElementById("drawer").classList.add("open");
    document.getElementById("mask").classList.add("open");
  }
  function closeDrawer() {
    document.getElementById("drawer").classList.remove("open");
    document.getElementById("mask").classList.remove("open");
  }
  document.getElementById("close").addEventListener("click", closeDrawer);
  document.getElementById("mask").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  document.getElementById("filter-seg").addEventListener("change", (e) => {
    filterSeg = e.target.value; render();
  });
  document.getElementById("filter-q").addEventListener("input", (e) => {
    filterQ = e.target.value; render();
  });
  document.getElementById("reset-state").addEventListener("click", () => {
    if (!confirm("Clear all local stage/notes/counter state?")) return;
    localStorage.removeItem(LS_KEY);
    for (const k of Object.keys(local)) delete local[k];
    render();
    toast("Local state cleared");
  });
  document.getElementById("export-json").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(local, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "dream-customers-state-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  render();
})();
</script>
</body>
</html>
`;

writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${html.length} bytes, ${data.contacts.length} contacts)`);
