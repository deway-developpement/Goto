"""Build contract: immutable sources, closed asset references and cache invalidation."""
import hashlib
import importlib.util
from pathlib import Path
import re
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('web_build', Path(__file__).parents[1] / 'tools/build.py')
web_build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(web_build)


def snapshot(root):
    return {str(p.relative_to(root)): p.read_bytes() for p in root.rglob('*') if p.is_file()}


class BuildTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.source = self.root / 'src'
        self.output = self.root / 'dist'
        assets = self.source / 'assets'
        assets.mkdir(parents=True)
        (self.source / 'index.html').write_text('<link href="assets/style.css"><script src="assets/site.js"></script>')
        (assets / 'style.css').write_text('@font-face{src:url(font.woff2)}body{color:black}')
        (assets / 'site.js').write_text('console.log("hello");')
        (assets / 'font.woff2').write_bytes(b'font-fixture')
        downloads = self.source / 'downloads'
        downloads.mkdir()
        (downloads / 'fixture.zip').write_bytes(b'archive-fixture')

    def test_reproducible_build_without_changing_sources(self):
        original = snapshot(self.source)
        web_build.build(self.source, self.output)
        first = snapshot(self.output)
        self.assertEqual(snapshot(self.source), original)
        for name, content in first.items():
            if name.startswith('assets/'):
                digest = re.search(r'\.([0-9a-f]{12})\.[^.]+$', name)
                self.assertIsNotNone(digest)
                self.assertEqual(digest.group(1), hashlib.sha256(content).hexdigest()[:12])
        html = (self.output / 'index.html').read_text()
        for name in re.findall(r'(?:href|src)="([^"]+)"', html):
            self.assertTrue((self.output / name).is_file())
        css = next((self.output / 'assets').glob('style.*.css')).read_text()
        self.assertTrue((self.output / 'assets' / re.search(r'url\(([^)]+)\)', css).group(1)).is_file())
        self.assertEqual((self.output / 'downloads/fixture.zip').read_bytes(), b'archive-fixture')
        (self.output / 'stale.txt').write_text('old build')
        web_build.build(self.source, self.output)
        self.assertEqual(snapshot(self.output), first)
        self.assertEqual(snapshot(self.source), original)

    def test_font_change_invalidates_css_and_html_but_not_js(self):
        web_build.build(self.source, self.output)
        first = snapshot(self.output)
        (self.source / 'assets/font.woff2').write_bytes(b'changed-font')
        web_build.build(self.source, self.output)
        second = snapshot(self.output)
        self.assertNotEqual(first['index.html'], second['index.html'])
        self.assertNotEqual(sorted(n for n in first if n.endswith('.css')), sorted(n for n in second if n.endswith('.css')))
        self.assertEqual(sorted(n for n in first if n.endswith('.js')), sorted(n for n in second if n.endswith('.js')))
        self.assertFalse((self.output / 'assets/font.woff2').exists())

    def test_refuses_in_place_or_nested_output(self):
        original = snapshot(self.source)
        for output in (self.source, self.source / 'dist', self.root):
            with self.assertRaises(ValueError):
                web_build.build(self.source, output)
        self.assertEqual(snapshot(self.source), original)


if __name__ == '__main__':
    unittest.main()
