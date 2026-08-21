import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const home = read("index.html");
const dashboard = read("dashboard.html");
const thanks = read("subscribe-thanks.html");

assert.match(home, /See the full Dashboard, (?:€|&euro;)490\/year/);
assert.match(home, /The full ranked weekly desk for investors who want more than five names\./);
assert.match(home, /dashboard_cta_clicked/);
assert.match(home, /dashboard_offer_viewed/);
const hero = home.slice(home.indexOf('id="hero-flow"'), home.indexOf('id="hero-quiz"'));
assert.doesNotMatch(hero, /Tweet Teardown/);

assert.match(dashboard, /€490\/year/);
assert.match(dashboard, /https:\/\/buy\.stripe\.com\/aFa5kC34DeZOawC6vS0x20c/);
assert.match(dashboard, /dashboard_offer_viewed/);
assert.match(dashboard, /dashboard_cta_clicked/);
assert.match(dashboard, /dashboard_checkout_started/);
assert.match(dashboard, /Is this a funding prediction\?/);
assert.match(dashboard, /219 startup-period observations across 55 startups/);

assert.match(thanks, /See the full Dashboard, €490\/year/);
assert.match(thanks, /dashboard_upgrade_email_clicked/);

console.log("annual Dashboard funnel contract passes");
