import importlib.util
import unittest
from pathlib import Path

root = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("sitemap_validator", root / "_validate_sitemap.py")
assert spec is not None and spec.loader is not None
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)


class SitemapLocalModeTest(unittest.TestCase):
    def test_local_route_check_returns_http_like_status(self):
        result = validator.check_local("https://gitdealflow.com/for/data-providers")
        self.assertEqual(result["status"], 200)


if __name__ == "__main__":
    unittest.main()
