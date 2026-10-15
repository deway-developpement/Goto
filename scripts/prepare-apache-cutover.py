#!/usr/bin/env python3
"""Prepare a reviewable, hash-guarded cutover bundle without changing Apache."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
out = args.output.resolve()
out.mkdir(parents=True, exist_ok=False)
vhost = Path('/etc/apache2/sites-available/000-default-le-ssl.conf')
htaccess = Path('/var/www/html/.htaccess')
include = Path('/etc/apache2/goto-web.inc.conf')
original = vhost.read_text()
anchor = '\tProxyPreserveHost On\n'
if original.count(anchor) != 1 or 'ServerName deway.fr' not in original:
    raise SystemExit('Unexpected HTTPS vhost; review it before preparing a cutover')
rule = 'RewriteRule ^goto/(.*)$ /wordpress/$1 [L]\n'
legacy = htaccess.read_text()
if legacy.count(rule) != 1 or include.exists():
    raise SystemExit('Unexpected rewrite/include state; review before proceeding')
(out / 'vhost.conf').write_text(original.replace(anchor, '\tInclude /etc/apache2/goto-web.inc.conf\n\n' + anchor))
(out / 'htaccess').write_text(legacy.replace(rule, ''))
shutil.copyfile(root / 'deploy/apache/goto-web.inc.conf', out / 'goto-web.inc.conf')
files = []
for key, target, candidate in [('vhost', vhost, 'vhost.conf'), ('rewrite', htaccess, 'htaccess'), ('include', include, 'goto-web.inc.conf')]:
    files.append({'key': key, 'before': hashlib.sha256(target.read_bytes()).hexdigest() if target.exists() else None,
                  'candidate': candidate, 'after': hashlib.sha256((out / candidate).read_bytes()).hexdigest()})
html = subprocess.check_output(['curl', '--noproxy', '*', '--fail', '--silent', '--show-error', '--max-time', '10', 'http://127.0.0.1:8113/'])
manifest = {'files': files, 'html_sha256': hashlib.sha256(html).hexdigest(),
            'revision': subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()}
(out / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Prepared {out}; no production files changed.')
