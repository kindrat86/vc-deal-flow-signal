import importlib.util
import unittest
from pathlib import Path

root = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("sitemap_rebuilder", root / "_rebuild_sitemap.py")
assert spec is not None and spec.loader is not None
rebuilder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rebuilder)


class SitemapLastmodTest(unittest.TestCase):
    def test_committed_file_gets_git_commit_date(self):
        """content-calendar.html is long-committed; its lastmod must be a real
        git commit date (YYYY-MM-DD), not checkout mtime and not None."""
        lm = rebuilder.get_lastmod(root / "content-calendar.html")
        self.assertIsNotNone(lm)
        self.assertRegex(lm, r"^\d{4}-\d{2}-\d{2}$")

    def test_git_dates_map_is_populated(self):
        dates = rebuilder._load_git_dates()
        self.assertGreater(len(dates), 100)
        self.assertTrue(any(k.startswith("landing/") for k in dates))

    def test_never_committed_file_returns_none(self):
        """A file with no git history must return None (no fabricated dates)."""
        self.assertIsNone(rebuilder.get_lastmod(root / "no-such-file-zzz.html"))


if __name__ == "__main__":
    unittest.main()
