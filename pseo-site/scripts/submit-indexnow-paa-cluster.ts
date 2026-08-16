/**
 * IndexNow ping for the PAA FAQ pages (§40, commit 01d373ca).
 * 13 URLs whose FAQ/H3 content changed: 11 /vs pairs + 1 answer + 1 acquirer.
 * Run after the deploy is verified live.
 */
const KEY = "22dfd6f8f816469b8c216bc7eaf8b936";
const HOST = "signals.gitdealflow.com";
const URLS = [
  "/vs/harmonic-ai-vs-pitchbook",
  "/vs/harmonic-ai-vs-dealroom",
  "/vs/specter-vs-harmonic-ai",
  "/vs/harmonic-ai-vs-tracxn",
  "/vs/harmonic-ai-vs-crunchbase",
  "/vs/cb-insights-vs-crunchbase",
  "/vs/crunchbase-vs-pitchbook",
  "/vs/dealroom-vs-pitchbook",
  "/vs/pitchbook-vs-tracxn",
  "/vs/affinity-vs-pitchbook",
  "/vs/affinity-vs-harmonic-ai",
  "/answers/how-to-find-startups-before-they-fundraise",
  "/acquirer/vista-equity-partners",
].map((p) => `https://${HOST}${p}`);

async function main() {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: URLS }),
  });
  console.log("IndexNow:", res.status, res.statusText, `(${URLS.length} urls)`);
  process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
}
main();
