#!/usr/bin/env python3
"""
Deactivate the 4 retired founding-rate Stripe payment links.

Documented in payment-links.md as "must never appear on any page" — they were
retired on 2026-07-02 but still accept checkouts at the closed founding rates.
Deactivating a payment link is REVERSIBLE (active=true re-enables it) and does
NOT affect existing subscriptions: founding members keep grandfathered rates.

Uses the vault Stripe key; run with the portfolio venv:
  ~/portfolio/.venv/bin/python3 deactivate-founding-links.py
"""
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path.home() / "portfolio"))
from lib.vault import Vault  # noqa: E402

RETIRE = {
    "https://buy.stripe.com/28E7sK48H04U8ou07u0x200": "Dashboard founding monthly EUR 9.97",
    "https://buy.stripe.com/4gM00ifRpcRG2069I40x202": "Insider founding monthly EUR 97",
    "https://buy.stripe.com/aFa28qgVt3h65ci8E00x206": "Dashboard founding annual EUR 99",
    "https://buy.stripe.com/9B628q8oX7xmcEK9I40x207": "Insider founding annual EUR 970",
}
# Suffixes of the 10 current-pricing links that must STAY active (payment-links.md)
CURRENT = ["0x209", "0x203", "0x20b", "0x20c", "0x20d", "0x20e", "0x204", "0x205", "0x208", "0x20a"]

key = Vault().get_key("STRIPE_SECRET_KEY")
assert key, "no STRIPE_SECRET_KEY in vault"


def api(path, data=None):
    req = urllib.request.Request(
        f"https://api.stripe.com/v1{path}",
        data=urllib.parse.urlencode(data).encode() if data else None,
        headers={"Authorization": f"Bearer {key}"},
    )
    return json.load(urllib.request.urlopen(req))


links = api("/payment_links?limit=100")["data"]
for pl in links:
    if pl["url"] in RETIRE:
        if pl["active"]:
            r = api(f"/payment_links/{pl['id']}", {"active": "false"})
            print(f"DEACTIVATED  {RETIRE[pl['url']]}  ({pl['url'][-12:]}) -> active={r['active']}")
        else:
            print(f"already off  {RETIRE[pl['url']]}")

still = [pl for pl in api("/payment_links?limit=100")["data"] if pl["active"] and pl["url"][-5:] in CURRENT]
print(f"\ncurrent-pricing links still active: {len(still)}/10 (must be 10)")
