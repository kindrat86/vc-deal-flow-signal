from __future__ import annotations

import importlib.util
import json
import time
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "activation_report.py"
spec = importlib.util.spec_from_file_location("activation_report", SCRIPT)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class FakeResponse:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def read(self) -> bytes:
        return json.dumps({"results": [["ok"]]}).encode()


def test_query_retries_after_transient_read_timeout(monkeypatch):
    attempts = 0

    def fake_urlopen(*_args, **_kwargs):
        nonlocal attempts
        attempts += 1
        if attempts == 1:
            raise TimeoutError("The read operation timed out")
        return FakeResponse()

    monkeypatch.setattr(module.urllib.request, "urlopen", fake_urlopen)
    monkeypatch.setattr(time, "sleep", lambda _seconds: None)

    assert module.q("test-key", "SELECT 1") == [["ok"]]
    assert attempts == 2
