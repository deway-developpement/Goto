"""Exercise cutover failure/rollback using temporary files and mocked service/HTTP calls."""
import contextlib
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('cutover', Path(__file__).parents[1] / 'apply-apache-cutover.py')
cutover = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cutover)


class CutoverTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.bundle = self.root / 'plan'
        self.bundle.mkdir()
        self.targets = {key: self.root / key for key in ('vhost', 'rewrite', 'include')}
        self.original = {'vhost': b'old vhost', 'rewrite': b'old rewrite'}
        for key, content in self.original.items():
            self.targets[key].write_bytes(content)
        self.html = b'approved site'
        files = []
        for key, target in self.targets.items():
            candidate = self.bundle / key
            candidate.write_bytes(('new ' + key).encode())
            files.append({'key': key, 'before': cutover.sha(target), 'candidate': key, 'after': cutover.sha(candidate)})
        (self.bundle / 'manifest.json').write_text(json.dumps({'files': files, 'revision': 'test-only', 'html_sha256': hashlib.sha256(self.html).hexdigest()}))
        self.addCleanup(patch.stopall)
        patch.object(cutover, 'TARGETS', self.targets).start()
        patch.object(cutover.os, 'chown').start()
        self.run = patch.object(cutover.subprocess, 'run').start()
        self.curl = patch.object(cutover, 'curl', side_effect=self.response).start()
        self.output = contextlib.ExitStack()
        self.output.enter_context(contextlib.redirect_stdout(io.StringIO()))
        self.output.enter_context(contextlib.redirect_stderr(io.StringIO()))
        self.addCleanup(self.output.close)

    def response(self, path, https=True):
        if not https or path == '/goto/':
            return 200, self.html
        if path.startswith('/goto/') or path.startswith('/wordpress/'):
            return 410, b'gone'
        if path == '/goto-api/profile':
            return 401, b'not authenticated'
        return 200, b'baseline'

    def assert_original(self):
        for key, expected in self.original.items():
            self.assertEqual(self.targets[key].read_bytes(), expected)
        self.assertFalse(self.targets['include'].exists())

    def test_apply_and_guarded_manual_rollback(self):
        backup = cutover.apply(self.bundle, self.root / 'backups')
        for key, target in self.targets.items():
            self.assertEqual(target.read_bytes(), ('new ' + key).encode())
        cutover.restore(backup)
        self.assert_original()

    def test_failed_public_validation_restores_all_files(self):
        def failure(path, https=True):
            if path == '/goto/':
                return 502, b'failed public proxy'
            return self.response(path, https)
        self.curl.side_effect = failure
        with self.assertRaisesRegex(RuntimeError, 'HTTPS showcase'):
            cutover.apply(self.bundle, self.root / 'backups')
        self.assert_original()
        self.assertGreaterEqual(self.run.call_count, 5)

    def test_refuses_changed_live_configuration_before_writing(self):
        self.targets['rewrite'].write_bytes(b'newer unrelated edit')
        with self.assertRaisesRegex(RuntimeError, 'Hash changed'):
            cutover.apply(self.bundle, self.root / 'backups')
        self.assertEqual(self.targets['vhost'].read_bytes(), b'old vhost')
        self.assertEqual(self.targets['rewrite'].read_bytes(), b'newer unrelated edit')
        self.assertFalse(self.targets['include'].exists())
        self.run.assert_not_called()

    def test_manual_rollback_refuses_newer_edits(self):
        backup = cutover.apply(self.bundle, self.root / 'backups')
        self.targets['vhost'].write_bytes(b'newer administrator edit')
        with self.assertRaisesRegex(RuntimeError, 'changed after cutover'):
            cutover.restore(backup)
        self.assertEqual(self.targets['vhost'].read_bytes(), b'newer administrator edit')
        self.assertEqual(self.targets['rewrite'].read_bytes(), b'new rewrite')


if __name__ == '__main__':
    unittest.main()
