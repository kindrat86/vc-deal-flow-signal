/**
 * VC Deal Flow Signal — Chrome Extension Content Script
 * Injects a GitHub signal badge on Crunchbase and Wellfound company pages.
 */

(function () {
  const API_BASE = "https://signals.gitdealflow.com/api/signal";
  const BADGE_ID = "vcdfs-signal-badge";

  function safeUrl(url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "https:" && parsed.hostname === "signals.gitdealflow.com") {
        return parsed.href;
      }
    } catch {}
    return "https://signals.gitdealflow.com";
  }

  // Prevent double injection
  if (document.getElementById(BADGE_ID)) return;

  /**
   * Extract company name from the current page.
   */
  function getCompanyName() {
    const url = window.location.href;

    // Crunchbase: /organization/company-name
    if (url.includes("crunchbase.com/organization/")) {
      const match = url.match(/\/organization\/([^/?#]+)/);
      if (match) return match[1].replace(/-/g, " ");
    }

    // Wellfound: /company/company-name
    if (url.includes("wellfound.com/company/")) {
      const match = url.match(/\/company\/([^/?#]+)/);
      if (match) return match[1].replace(/-/g, " ");
    }

    return null;
  }

  /**
   * Fetch signal data from the API.
   */
  async function fetchSignal(companyName) {
    try {
      const res = await fetch(
        `${API_BASE}?company=${encodeURIComponent(companyName)}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || typeof data !== 'object' || typeof data.status !== 'string') return null;
      return data;
    } catch {
      return null;
    }
  }

  /**
   * Status badge configuration.
   */
  const STATUS_CONFIG = {
    accelerating: {
      label: "Accelerating",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.12)",
      borderColor: "rgba(16, 185, 129, 0.3)",
    },
    steady: {
      label: "Steady",
      color: "#94a3b8",
      bgColor: "rgba(148, 163, 184, 0.12)",
      borderColor: "rgba(148, 163, 184, 0.3)",
    },
    decelerating: {
      label: "Decelerating",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.12)",
      borderColor: "rgba(245, 158, 11, 0.3)",
    },
    no_data: {
      label: "No signal data",
      color: "#64748b",
      bgColor: "rgba(100, 116, 139, 0.08)",
      borderColor: "rgba(100, 116, 139, 0.2)",
    },
  };


  /**
   * Create and inject the badge.
   */
  function injectBadge(data) {
    const config = STATUS_CONFIG[data.status] || STATUS_CONFIG.no_data;

    const badge = document.createElement("div");
    badge.id = BADGE_ID;
    badge.className = "vcdfs-badge";
    badge.setAttribute('role', 'status');
    badge.setAttribute('aria-label', 'Git Deal Flow Signal data');

    // Build badge inner using DOM methods to avoid innerHTML with dynamic data
    const inner = document.createElement("div");
    inner.className = "vcdfs-badge-inner";
    inner.style.background = config.bgColor;
    inner.style.borderColor = config.borderColor;

    const dot = document.createElement("span");
    dot.className = "vcdfs-dot";
    dot.style.background = config.color;

    const label = document.createElement("span");
    label.className = "vcdfs-label";
    label.style.color = config.color;
    label.textContent = config.label;

    const brand = document.createElement("span");
    brand.className = "vcdfs-brand";
    brand.textContent = "via VC Deal Flow Signal";

    inner.append(dot, label, brand);
    badge.appendChild(inner);

    // Tooltip with metrics — use textContent for API-sourced data
    if (data.status !== "no_data" && data.commitVelocity14d != null) {
      const tooltip = document.createElement("div");
      tooltip.className = "vcdfs-tooltip";
      tooltip.setAttribute('role', 'tooltip');
      tooltip.id = 'vcdfs-tooltip';
      badge.setAttribute('aria-describedby', 'vcdfs-tooltip');

      const rows = [
        { label: "Commits (14d)", value: data.commitVelocity14d },
        { label: "Velocity change", value: data.velocityChange, color: config.color },
        { label: "Contributors", value: data.contributors },
      ];
      if (data.signalType) {
        rows.push({ label: "Signal", value: data.signalType });
      }

      for (const row of rows) {
        const div = document.createElement("div");
        div.className = "vcdfs-tooltip-row";
        const sp = document.createElement("span");
        sp.textContent = row.label;
        const strong = document.createElement("strong");
        strong.textContent = row.value;
        if (row.color) strong.style.color = row.color;
        div.append(sp, strong);
        tooltip.appendChild(div);
      }

      const link = document.createElement("a");
      link.className = "vcdfs-tooltip-link";
      link.setAttribute('href', safeUrl(data.sectorUrl));
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.textContent = "View full sector rankings \u2192";
      tooltip.appendChild(link);

      badge.appendChild(tooltip);
    } else if (data.status === "no_data") {
      const tooltip = document.createElement("div");
      tooltip.className = "vcdfs-tooltip";

      const p = document.createElement("p");
      p.style.cssText = "color:#94a3b8;font-size:12px;margin:0";
      p.textContent = "We don't track this company yet.";
      tooltip.appendChild(p);

      const link = document.createElement("a");
      link.className = "vcdfs-tooltip-link";
      link.setAttribute('href', 'https://signals.gitdealflow.com');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.textContent = "Browse 400+ tracked startups \u2192";
      tooltip.appendChild(link);

      badge.appendChild(tooltip);
    }

    // Find injection target
    let target = null;

    // Crunchbase: look for the main company name heading
    if (window.location.href.includes("crunchbase.com")) {
      target =
        document.querySelector('[class*="profile-name"]') ||
        document.querySelector("h1") ||
        document.querySelector('[data-test="entity-title"]');
    }

    // Wellfound
    if (window.location.href.includes("wellfound.com")) {
      target =
        document.querySelector("h1") ||
        document.querySelector('[class*="company-name"]');
    }

    if (target && target.parentNode) {
      target.parentNode.insertBefore(badge, target.nextSibling);
    } else {
      // Fallback: fixed position in top-right
      badge.style.position = "fixed";
      badge.style.top = "70px";
      badge.style.right = "20px";
      badge.style.zIndex = "10000";
      document.body.appendChild(badge);
    }
  }

  /**
   * Main entry point.
   */
  async function main() {
    const companyName = getCompanyName();
    if (!companyName) return;

    const data = await fetchSignal(companyName);
    if (data) {
      injectBadge(data);
    } else {
      injectBadge({ status: "no_data" });
    }
  }

  // Wait for page to settle (SPAs like Crunchbase load content dynamically)
  if (document.readyState === "complete") {
    setTimeout(main, 1500);
  } else {
    window.addEventListener("load", () => setTimeout(main, 1500));
  }

  // SPA navigation detection
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      const oldBadge = document.getElementById('vcdfs-signal-badge');
      if (oldBadge) oldBadge.remove();
      setTimeout(main, 1500);
    }
  });
  observer.observe(document.body, { subtree: true, childList: true });
})();
