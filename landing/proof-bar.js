/* Public proof for paid landing pages. Values are fetched from the scorecard API, never copied into page HTML. */
(function () {
  "use strict";
  var endpoint = "https://signals.gitdealflow.com/api/proof";

  function formatDate(value) {
    var date = new Date(value + "T00:00:00Z");
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  }

  function update(node, proof) {
    var score = proof && proof.scorecard;
    if (!score || typeof score.published !== "number") return;
    node.hidden = false;
    node.querySelector("[data-proof-date]").textContent = formatDate(proof.asOf.slice(0, 10));
    node.querySelector("[data-proof-counts]").textContent = score.published + " published picks, " + score.graded + " graded, " + score.hits + " hits, " + score.misses + " misses, " + score.pending + " pending.";
  }

  function hide(node) { node.hidden = true; }

  var nodes = document.querySelectorAll("[data-gdf-public-proof]");
  if (!nodes.length || !window.fetch) return;
  fetch(endpoint, { mode: "cors", credentials: "omit" })
    .then(function (response) { return response.ok ? response.json() : Promise.reject(new Error("proof unavailable")); })
    .then(function (proof) { nodes.forEach(function (node) { update(node, proof); }); })
    .catch(function () { nodes.forEach(hide); });
})();
