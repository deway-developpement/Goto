#!/usr/bin/env python3
"""Apply a reviewed Gotò cutover bundle, or restore its guarded backup."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import shutil
import stat
import subprocess
import sys
import tempfile

TARGETS = {
    'vhost': Path('/etc/apache2/sites-available/000-default-le-ssl.conf'),
    'rewrite': Path('/var/www/html/.htaccess'),
    'include': Path('/etc/apache2/goto-web.inc.conf'),
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.exists() else None


def curl(path, https=True):
    command = ['curl', '--noproxy', '*', '--silent', '--show-error', '--max-time', '20']
    if https:
        command += ['--resolve', 'deway.fr:443:127.0.0.1']
        url = 'https://deway.fr' + path
    else:
        url = 'http://127.0.0.1:8113' + path
    result = subprocess.check_output(command + ['--write-out', '\n%{http_code}', url])
    body, code = result.rsplit(b'\n', 1)
    return int(code), body


def install(candidate, target, mode, uid, gid):
    with tempfile.NamedTemporaryFile(dir=target.parent, prefix='.goto-cutover-', delete=False) as handle:
        temporary = Path(handle.name)
    try:
        shutil.copyfile(candidate, temporary)
        os.chmod(temporary, mode)
        os.chown(temporary, uid, gid)
        os.replace(temporary, target)
    finally:
        temporary.unlink(missing_ok=True)


def restore(backup):
    state = json.loads((backup / 'state.json').read_text())
    for item in state:
        target = TARGETS[item['key']]
        if sha(target) != item['after']:
            raise RuntimeError(f'{target} changed after cutover; refusing to overwrite it')
    for item in state:
        target = TARGETS[item['key']]
        if item['before'] is None:
            target.unlink(missing_ok=True)
        else:
            install(backup / (item['key'] + '.original'), target, item['mode'], item['uid'], item['gid'])


def apply(bundle, backup_root=Path('/var/backups/goto-web')):
    manifest = json.loads((bundle / 'manifest.json').read_text())
    if len(manifest['files']) != len(TARGETS) or {item['key'] for item in manifest['files']} != set(TARGETS):
        raise RuntimeError('The plan must contain exactly the three known target files')
    for item in manifest['files']:
        target = TARGETS[item['key']]
        candidate = bundle / item['candidate']
        if candidate.parent != bundle or target.is_symlink():
            raise RuntimeError('Unexpected path or symlink in plan')
        if sha(target) != item['before'] or sha(candidate) != item['after']:
            raise RuntimeError(f'Hash changed for {target}; prepare a new plan instead of overwriting')
    code, body = curl('/', https=False)
    if code != 200 or hashlib.sha256(body).hexdigest() != manifest['html_sha256']:
        raise RuntimeError('The running WEB backend does not match the reviewed build')
    preserve = ['/goto-api/profile', '/goto-api/graphql?query=%7B__typename%7D', '/', '/atomic-bayttle/']
    baseline = {path: curl(path)[0] for path in preserve}
    subprocess.run(['apache2ctl', 'configtest'], check=True)
    backup = backup_root / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S.%fZ')
    backup.mkdir(parents=True, mode=0o700)
    os.chmod(backup_root, 0o700)
    state = []
    for item in manifest['files']:
        target = TARGETS[item['key']]
        entry = dict(item)
        if target.exists():
            info = target.stat()
            entry.update(mode=stat.S_IMODE(info.st_mode), uid=info.st_uid, gid=info.st_gid)
            shutil.copyfile(target, backup / (item['key'] + '.original'))
        state.append(entry)
    (backup / 'state.json').write_text(json.dumps(state, indent=2) + '\n')
    installed = []
    try:
        for item in state:
            target = TARGETS[item['key']]
            if sha(target) != item['before']:
                raise RuntimeError(f'{target} changed before installation')
            install(bundle / item['candidate'], target, item.get('mode', 0o644), item.get('uid', 0), item.get('gid', 0))
            installed.append(item)
        subprocess.run(['apache2ctl', 'configtest'], check=True)
        subprocess.run(['systemctl', 'reload', 'apache2'], check=True)
        code, body = curl('/goto/')
        if code != 200 or hashlib.sha256(body).hexdigest() != manifest['html_sha256']:
            raise RuntimeError('HTTPS showcase did not return the reviewed static HTML')
        for path in ['/goto/pricing', '/goto/pricing/', '/goto/index.php/pricing', '/wordpress/', '/wordpress/wp-login.php']:
            if curl(path)[0] != 410:
                raise RuntimeError(f'{path}: expected 410 Gone')
        for path, expected in baseline.items():
            if curl(path)[0] != expected:
                raise RuntimeError(f'Existing route changed: {path}')
        (backup / 'result.json').write_text(json.dumps({'status': 'active', 'revision': manifest['revision'], 'preserved_statuses': baseline}, indent=2) + '\n')
    except BaseException:
        # Restore only files actually written, guarded against concurrent unrelated edits.
        (backup / 'state.json').write_text(json.dumps(installed, indent=2) + '\n')
        restore(backup)
        subprocess.run(['apache2ctl', 'configtest'], check=True)
        subprocess.run(['systemctl', 'reload', 'apache2'], check=True)
        print(f'Cutover rolled back. Backup: {backup}', file=sys.stderr)
        raise
    print(f'Active: https://deway.fr/goto/\nBackup: {backup}\nRollback: sudo python3 {Path(__file__).resolve()} --rollback {backup}')
    return backup


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--plan', type=Path)
    parser.add_argument('--rollback', type=Path)
    args = parser.parse_args()
    if os.geteuid() != 0:
        raise SystemExit('Run this reviewed cutover script with sudo; no production files changed.')
    if bool(args.plan) == bool(args.rollback):
        parser.error('Choose exactly one of --plan or --rollback')
    if args.rollback:
        restore(args.rollback.resolve())
        subprocess.run(['apache2ctl', 'configtest'], check=True)
        subprocess.run(['systemctl', 'reload', 'apache2'], check=True)
        print('Previous Apache configuration restored.')
    else:
        apply(args.plan.resolve())


if __name__ == '__main__':
    main()
