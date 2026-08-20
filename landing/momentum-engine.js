(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GDFMomentum = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function clamp(value, low, high) {
    return Math.max(low == null ? 0 : low, Math.min(high == null ? 100 : high, value));
  }

  function normalizeQuery(value) {
    return String(value || "")
      .trim()
      .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
      .replace(/\/+$/, "")
      .replace(/\.git$/, "");
  }

  function tractionOf(stars) {
    return clamp((100 * Math.log10((Number(stars) || 0) + 1)) / 5);
  }

  function recencyOf(pushedAt, nowMs) {
    var now = nowMs == null ? Date.now() : nowMs;
    var pushed = Date.parse(pushedAt);
    var days = Number.isFinite(pushed) ? Math.max(0, (now - pushed) / 86400000) : Infinity;
    if (days <= 2) return 100;
    if (days <= 7) return 88;
    if (days <= 30) return 68;
    if (days <= 90) return 40;
    if (days <= 180) return 22;
    return 8;
  }

  function analyseCommits(weeks) {
    if (!Array.isArray(weeks) || !weeks.length) return null;
    var commits = weeks.map(function (week) {
      return Number(week && week.total) || 0;
    });
    var count = commits.length;
    var last4 = commits.slice(-4);
    var prior12 = commits.slice(-16, -4);
    var mean4 = last4.length
      ? last4.reduce(function (sum, value) { return sum + value; }, 0) / last4.length
      : 0;
    var mean12 = prior12.length
      ? prior12.reduce(function (sum, value) { return sum + value; }, 0) / prior12.length
      : 0;
    var acceleration = mean12 > 0 ? mean4 / mean12 : mean4 > 0 ? null : 0;
    var total52 = commits.reduce(function (sum, value) { return sum + value; }, 0);
    var activeWeeks = commits.filter(function (value) { return value > 0; }).length;
    var trend = commits.slice(-26);
    var sx = 0;
    var sy = 0;
    var sxx = 0;
    var sxy = 0;
    var k = trend.length;
    for (var index = 0; index < k; index += 1) {
      sx += index;
      sy += trend[index];
      sxx += index * index;
      sxy += index * trend[index];
    }
    var denominator = k * sxx - sx * sx;
    var slope = denominator ? (k * sxy - sx * sy) / denominator : 0;
    var mean = k ? sy / k : 0;
    return {
      series: commits,
      mean4: mean4,
      mean12: mean12,
      accel: acceleration,
      total52: total52,
      activeWeeks: activeWeeks,
      trendPerWeek: mean > 0 ? slope / mean : null,
      weeks: count,
    };
  }

  function velocityFromAcceleration(acceleration, tractionFallback) {
    if (acceleration == null || !Number.isFinite(acceleration)) {
      return Math.round(clamp(Number(tractionFallback) || 0));
    }
    return Math.round(clamp(50 + 100 * (acceleration - 1)));
  }

  function scoreMomentum(parts) {
    var traction = clamp(Number(parts && parts.traction) || 0);
    var recency = clamp(Number(parts && parts.recency) || 0);
    var velocity = clamp(Number(parts && parts.velocity) || 0);
    return Math.round(0.4 * traction + 0.35 * recency + 0.25 * velocity);
  }

  return {
    clamp: clamp,
    normalizeQuery: normalizeQuery,
    tractionOf: tractionOf,
    recencyOf: recencyOf,
    analyseCommits: analyseCommits,
    velocityFromAcceleration: velocityFromAcceleration,
    scoreMomentum: scoreMomentum,
  };
});
