#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const trackerPath = fs.existsSync(path.join(root, "channel-attribution.js"))
  ? path.join(root, "channel-attribution.js")
  : path.join(root, "public", "channel-attribution.js");
const source = fs.readFileSync(trackerPath, "utf8");

function makeStorage() {
  const values = new Map();
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    entries() { return Object.fromEntries(values); },
  };
}

function run(url, { referrer = "", cookieJar = {}, dnt = "0" } = {}) {
  const localStorage = makeStorage();
  const sessionStorage = makeStorage();
  const captured = [];
  const registered = [];
  const registeredOnce = [];
  const listeners = {};
  const location = new URL(url);
  const document = { referrer };
  Object.defineProperty(document, "cookie", {
    get() { return Object.entries(cookieJar).map(([k, v]) => `${k}=${v}`).join("; "); },
    set(value) {
      const first = String(value).split(";", 1)[0];
      const i = first.indexOf("=");
      cookieJar[first.slice(0, i)] = first.slice(i + 1);
    },
  });
  const posthog = {
    capture(event, properties) { captured.push({ event, properties }); },
    register(properties) { registered.push(properties); },
    register_for_session(properties) { registered.push(properties); },
    register_once(properties) { registeredOnce.push(properties); },
  };
  const window = {
    location,
    localStorage,
    sessionStorage,
    posthog,
    history: { pushState() {}, replaceState() {} },
    addEventListener(name, fn) { listeners[name] = fn; },
    setTimeout(fn) { fn(); return 1; },
    setInterval(fn) { fn(); return 1; },
    clearInterval() {},
  };
  const context = {
    window,
    document,
    navigator: { doNotTrack: dnt, globalPrivacyControl: false },
    URL,
    URLSearchParams,
    Date,
    Math,
    Object,
    RegExp,
    String,
    JSON,
    encodeURIComponent,
    decodeURIComponent,
  };
  vm.runInNewContext(source, context, { filename: trackerPath });
  return { window, cookieJar, localStorage, sessionStorage, captured, registered, registeredOnce };
}

const jar = {};
const first = run(
  "https://gitdealflow.com/pricing?utm_source=reddit&utm_medium=social&utm_campaign=data-story&utm_content=proof&utm_term=vc&utm_id=post-42",
  { referrer: "https://www.reddit.com/r/datasets/comments/abc" , cookieJar: jar },
);
assert.equal(first.window.__GDF_ATTR_VERSION, "1");
assert.equal(typeof first.window.GDFattribution, "function");
const payload = first.window.GDFattribution("verify");
assert.equal(payload.utm_source, "reddit");
assert.equal(payload.utm_medium, "social");
assert.equal(payload.utm_campaign, "data-story");
assert.equal(payload.utm_content, "proof");
assert.equal(payload.utm_term, "vc");
assert.equal(payload.utm_id, "post-42");
assert.equal(payload.first_channel, "reddit");
assert.equal(payload.first_landing_path, "/pricing");
assert.equal(payload.referrer, "reddit.com");
assert.equal(first.captured.length, 1);
assert.equal(first.captured[0].event, "distribution_landing");
assert.equal(first.captured[0].properties.current_channel, "reddit");
assert.ok(first.registeredOnce.some((p) => p.gdf_first_source === "reddit"));
assert.ok(first.registered.some((p) => p.gdf_channel === "reddit"));
assert.ok(jar.gdf_ft_v1, "first-touch cookie was not written");
assert.doesNotMatch(JSON.stringify(payload), /comments\/abc|@/i, "payload leaked a full referrer path or email-like value");

const crossDomain = run("https://signals.gitdealflow.com/methodology", {
  referrer: "https://gitdealflow.com/pricing",
  cookieJar: jar,
});
const crossPayload = crossDomain.window.GDFattribution("verify-cross-domain");
assert.equal(crossPayload.first_source, "reddit");
assert.equal(crossPayload.first_channel, "reddit");
assert.equal(crossPayload.last_source, "reddit");

const aiReferral = run("https://gitdealflow.com/", {
  referrer: "https://gemini.google.com/app",
});
assert.equal(aiReferral.captured[0].properties.current_channel, "ai-referral");

const privateRun = run(
  "https://gitdealflow.com/?utm_source=x&utm_medium=social&utm_campaign=persona",
  { cookieJar: {}, dnt: "1" },
);
assert.deepEqual(privateRun.localStorage.entries(), {});
assert.equal(privateRun.window.GDFattribution("verify-private").utm_source, "x");

for (const needle of [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "gdf_first_", "gdf_last_", "register_once", "register_for_session", "distribution_landing",
]) {
  assert.ok(source.includes(needle), `tracker lost required token: ${needle}`);
}

console.log(`[verify-channel-attribution] PASS ${path.relative(root, trackerPath)}`);
