import importlib.util
import unittest
from pathlib import Path

root = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("sitemap_rebuilder", root / "_rebuild_sitemap.py")
assert spec is not None and spec.loader is not None
rebuilder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rebuilder)


class SitemapLastmodTest(unittest.TestCase):
    def test_sitemap_lastmod_does_not_depend_on_checkout_mtime(self):
        self.assertIsNone(rebuilder.get_lastmod(root / "content-calendar.html"))


if __name__ == "__main__":
    unittest.main()
