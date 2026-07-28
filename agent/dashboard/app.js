/**
 * Agent HQ Dashboard — App
 * Client-side JavaScript for the Agent HQ control interface.
 * Communicates with the agent's Express API.
 */

const API = "/api";

// ─── State ──────────────────────────────────────────────────

let currentView = "overview";
let agentData = null;
let refreshInterval = null;

// ─── Init ───────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupActions();
  startRefresh();
  loadView("overview");
});

// ─── Navigation ─────────────────────────────────────────────

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) loadView(view);
    });
  });
}

function loadView(view) {
  currentView = view;

  // Update nav
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view);
  });

  // Update sections
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("active", section.id === `view-${view}`);
  });

  // Load view-specific data
  switch (view) {
    case "overview": refreshOverview(); break;
    case "signals": refreshSignals(); break;
    case "briefs": refreshBriefs(); break;
    case "approvals": refreshApprovals(); break;
    case "tools": refreshTools(); break;
  }
}

// ─── Actions ─────────────────────────────────────────────────

function setupActions() {
  document.getElementById("btn-trigger")?.addEventListener("click", triggerCycle);
  document.getElementById("btn-pause")?.addEventListener("click", togglePause);
  document.getElementById("btn-approve-all")?.addEventListener("click", approveAll);
}

async function triggerCycle() {
  const btn = document.getElementById("btn-trigger");
  btn.textContent = "⏳ Starting…";
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/agent/trigger`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      showToast("Cycle started", "success");
    } else {
      showToast(data.message || "Failed to start", "error");
    }
  } catch (err) {
    showToast("Error: " + err.message, "error");
  }

  btn.textContent = "▶ Run Now";
  btn.disabled = false;
  setTimeout(refreshOverview, 1000);
}

async function togglePause() {
  const btn = document.getElementById("btn-pause");
  const isPaused = agentData?.agent?.status === "paused";

  try {
    const endpoint = isPaused ? "resume" : "pause";
    const res = await fetch(`${API}/agent/${endpoint}`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      showToast(isPaused ? "Agent resumed" : "Agent paused", "success");
      btn.textContent = isPaused ? "⏸️ Pause" : "▶ Resume";
      setTimeout(refreshOverview, 500);
    }
  } catch (err) {
    showToast("Error: " + err.message, "error");
  }
}

async function approveAll() {
  try {
    const res = await fetch(`${API}/approvals`);
    const data = await res.json();
    let count = 0;
    for (const approval of data.approvals || []) {
      await fetch(`${API}/approvals/${approval.id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });
      count++;
    }
    showToast(`${count} approvals resolved`, "success");
    refreshApprovals();
    refreshOverview();
  } catch (err) {
    showToast("Error: " + err.message, "error");
  }
}

async function resolveApproval(id, approved) {
  try {
    await fetch(`${API}/approvals/${id}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    refreshApprovals();
    refreshOverview();
  } catch (err) {
    showToast("Error: " + err.message, "error");
  }
}

// ─── Data Refresh ───────────────────────────────────────────

function startRefresh() {
  refreshAll();
  refreshInterval = setInterval(refreshAll, 10000); // 10s auto-refresh
}

async function refreshAll() {
  try {
    const res = await fetch(`${API}/agent/status`);
    agentData = await res.json();
    updateGlobalState();
    if (currentView === "overview") refreshOverviewDOM();
  } catch (err) {
    // Silently retry on next interval
  }
}

function updateGlobalState() {
  if (!agentData) return;

  // Status indicator
  const status = agentData.agent?.status || "unknown";
  const dot = document.querySelector(".status-dot");
  const label = document.getElementById("status-label");

  dot.className = "status-dot";
  if (status === "running") dot.classList.add("running");
  else if (status === "idle") dot.classList.add("active");
  else if (status === "error") dot.classList.add("error");
  else if (status === "paused") dot.classList.add("paused");

  if (label) label.textContent = status;

  // Approval badge
  const approvalCount = agentData.pendingApprovals || 0;
  const badge = document.getElementById("nav-approval-count");
  if (badge) {
    badge.textContent = approvalCount;
    badge.style.display = approvalCount > 0 ? "inline" : "none";
  }
}

// ─── View: Overview ─────────────────────────────────────────

function refreshOverview() {
  fetch(`${API}/agent/status`)
    .then((r) => r.json())
    .then((data) => {
      agentData = data;
      updateGlobalState();
      refreshOverviewDOM();
    })
    .catch(() => {});
}

function refreshOverviewDOM() {
  if (!agentData) return;

  const a = agentData.agent || {};
  const s = agentData.scheduler || {};

  // Agent status
  setText("agent-status", a.status || "—");
  setText("agent-cycle", (a.cycle || "—").toUpperCase());
  setText("agent-last-run", formatTime(a.lastRunAt));
  setText("agent-next-run", formatTime(a.nextRunAt));

  const errorRow = document.getElementById("agent-error-row");
  const errorText = document.getElementById("agent-last-error");
  if (a.lastError) {
    if (errorRow) errorRow.style.display = "flex";
    setText("agent-last-error", a.lastError);
  } else {
    if (errorRow) errorRow.style.display = "none";
  }

  // Scheduler
  setText("sched-weekly", s.weeklyEnabled ? "✅ Active" : "❌ Inactive");
  setText("sched-midweek", s.midweekEnabled ? "✅ Active" : "❌ Inactive");
  setText("sched-executing", s.isExecuting ? "⏳ Running…" : "Idle");

  // Cycle budget
  const budget = agentData.cycleBudget || {};
  setText("cycle-llm-calls", `${budget.llmCalls || 0}/10`);

  // Top signals
  renderTopSignals(agentData.topSignals || []);

  // Recent briefs
  renderRecentBriefs(agentData.recentBriefs || []);
}

function renderTopSignals(signals) {
  const container = document.getElementById("top-signals-list");
  if (!container) return;

  if (!signals.length) {
    container.innerHTML = '<div class="empty-state">No signals yet — run a cycle first</div>';
    return;
  }

  container.innerHTML = signals
    .map(
      (s, i) => `
    <div class="signal-item">
      <div class="signal-left">
        <span class="signal-rank">#${i + 1}</span>
        <div class="signal-info">
          <span class="signal-name">${esc(s.name)}</span>
          <span class="signal-meta">
            <span>${esc(s.sector)}</span>
            <span class="signal-tag">${esc(s.signalType)}</span>
          </span>
        </div>
      </div>
      <div class="signal-right">
        <span class="signal-score ${s.raiseLikelihood || 'moderate'}">${s.score}</span>
        <span class="signal-tier">${s.raiseLikelihood || '—'}</span>
      </div>
    </div>`
    )
    .join("");
}

function renderRecentBriefs(briefs) {
  const container = document.getElementById("recent-briefs-list");
  if (!container) return;

  if (!briefs.length) {
    container.innerHTML = '<div class="empty-state">No briefs yet</div>';
    return;
  }

  container.innerHTML = briefs
    .map(
      (b) => `
    <div class="brief-item">
      <div class="brief-title">${esc(b.title)}</div>
      <div class="brief-meta">
        <span>${esc(b.cycle || "—")}</span>
        <span class="brief-status ${b.status}">${b.status}</span>
        ${b.publishedAt ? `<span>Published: ${formatTime(b.publishedAt)}</span>` : ""}
      </div>
    </div>`
    )
    .join("");
}

// ─── View: Signals ──────────────────────────────────────────

function refreshSignals() {
  fetch(`${API}/agent/status`)
    .then((r) => r.json())
    .then((data) => {
      const container = document.getElementById("all-signals-list");
      if (!container) return;
      const signals = data.topSignals || [];
      if (!signals.length) {
        container.innerHTML = '<div class="empty-state">No signals yet</div>';
        return;
      }
      renderTopSignalsInContainer(container, signals);
    });
}

function renderTopSignalsInContainer(container, signals) {
  container.innerHTML = signals
    .map(
      (s, i) => `
    <div class="signal-item">
      <div class="signal-left">
        <span class="signal-rank">#${i + 1}</span>
        <div class="signal-info">
          <span class="signal-name">${esc(s.name)}</span>
          <span class="signal-meta">
            <span>${esc(s.sector)}</span>
            <span class="signal-tag">${esc(s.signalType)}</span>
          </span>
        </div>
      </div>
      <div class="signal-right">
        <span class="signal-score ${s.raiseLikelihood || 'moderate'}">${s.score}</span>
        <span class="signal-tier">${s.raiseLikelihood || '—'}</span>
      </div>
    </div>`
    )
    .join("");
}

// ─── View: Briefs ───────────────────────────────────────────

function refreshBriefs() {
  // Latest brief
  fetch(`${API}/briefs/latest`)
    .then((r) => r.json())
    .then((data) => {
      const container = document.getElementById("latest-brief-content");
      if (!container) return;

      if (!data.found || !data.brief) {
        container.innerHTML = '<div class="empty-state">No published briefs yet</div>';
        return;
      }

      const b = data.brief;
      let html = `
        <div class="brief-item">
          <div class="brief-title">${esc(b.title)}</div>
          <div class="brief-meta">
            <span>Period: ${esc(b.period)}</span>
            <span>${b.highlights?.length || 0} highlights</span>
          </div>
          <p style="margin-top:12px;color:var(--text-secondary);font-size:14px;line-height:1.6;">${esc(b.summary || "")}</p>
      `;

      if (b.highlights) {
        html += '<div style="margin-top:16px;">';
        b.highlights.forEach((h, i) => {
          html += `
            <div class="signal-item">
              <div class="signal-left">
                <span class="signal-rank">#${h.rank || i + 1}</span>
                <div class="signal-info">
                  <span class="signal-name">${esc(h.name)}</span>
                  <span class="signal-meta">
                    <span>${esc(h.sector)}</span>
                    <span class="signal-tag">${esc(h.signalType)}</span>
                  </span>
                </div>
              </div>
              <div class="signal-right">
                <span class="signal-score ${h.raiseLikelihood || 'moderate'}">${h.accelerationScore}</span>
              </div>
            </div>
          `;
        });
        html += "</div>";
      }

      html += "</div>";
      container.innerHTML = html;
    });

  // Brief history
  fetch(`${API}/briefs`)
    .then((r) => r.json())
    .then((data) => {
      const container = document.getElementById("briefs-history-list");
      if (!container) return;
      const briefs = data.briefs || [];
      if (!briefs.length) {
        container.innerHTML = '<div class="empty-state">No briefs in history</div>';
        return;
      }
      container.innerHTML = briefs
        .map(
          (b) => `
        <div class="brief-item">
          <div class="brief-title">${esc(b.title)}</div>
          <div class="brief-meta">
            <span>${esc(b.cycle || "—")}</span>
            <span class="brief-status ${b.status}">${b.status}</span>
            ${b.publishedAt ? `<span>${formatTime(b.publishedAt)}</span>` : ""}
            <span>${formatTime(b.createdAt)}</span>
          </div>
        </div>`
        )
        .join("");
    });
}

// ─── View: Approvals ────────────────────────────────────────

function refreshApprovals() {
  fetch(`${API}/approvals`)
    .then((r) => r.json())
    .then((data) => {
      const container = document.getElementById("approvals-list");
      if (!container) return;

      const approvals = data.approvals || [];
      if (!approvals.length) {
        container.innerHTML = '<div class="empty-state">No pending approvals</div>';
        return;
      }

      container.innerHTML = approvals
        .map(
          (a) => `
        <div class="approval-item">
          <div>
            <div class="approval-summary">${esc(a.summary)}</div>
            <div class="approval-meta">${esc(a.approvalType)} · ${formatTime(a.createdAt)}</div>
          </div>
          <div class="approval-actions">
            <button class="btn btn-sm btn-success" onclick="resolveApproval(${a.id}, true)">✓ Approve</button>
            <button class="btn btn-sm btn-danger" onclick="resolveApproval(${a.id}, false)">✕ Reject</button>
          </div>
        </div>`
        )
        .join("");
    });
}

// ─── View: Tools ────────────────────────────────────────────

function refreshTools() {
  fetch(`${API}/tools`)
    .then((r) => r.json())
    .then((data) => {
      const container = document.getElementById("tools-list");
      if (!container) return;

      const tools = data.tools || [];
      if (!tools.length) {
        container.innerHTML = '<div class="empty-state">No tools registered</div>';
        return;
      }

      container.innerHTML = tools
        .map(
          (t) => `
        <div class="tool-item">
          <div class="tool-name">${esc(t.name)}</div>
          <div class="tool-desc">${esc(t.description)}</div>
          <span class="tool-category ${t.category}">${esc(t.category)}</span>
        </div>`
        )
        .join("");
    });
}

// ─── Helpers ────────────────────────────────────────────────

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, type) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; padding: 12px 20px;
      border-radius: 8px; font-size: 14px; font-weight: 600; z-index: 999;
      transition: opacity 0.3s ease; opacity: 1; font-family: var(--font);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.background = type === "success" ? "var(--success)" : "var(--error)";
  toast.style.color = "#fff";
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 3000);
}

// Expose for inline handlers
window.resolveApproval = resolveApproval;
