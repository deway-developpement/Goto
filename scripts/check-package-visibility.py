#!/usr/bin/env python3
"""Refuse release pushes to an existing non-private GHCR package."""
import json
import os
from urllib.error import HTTPError
from urllib.request import Request, urlopen

owner = os.environ['GITHUB_REPOSITORY_OWNER']
owner_kind = 'orgs' if os.environ['PACKAGE_OWNER_TYPE'] == 'Organization' else 'users'
for name in ('goto-api', 'goto-web'):
    request = Request(
        f'https://api.github.com/{owner_kind}/{owner}/packages/container/{name}',
        headers={'Authorization': f'Bearer {os.environ["GH_TOKEN"]}',
                 'Accept': 'application/vnd.github+json',
                 'X-GitHub-Api-Version': '2022-11-28'},
    )
    try:
        with urlopen(request, timeout=30) as response:
            package = json.load(response)
    except HTTPError as error:
        if error.code == 404:
            print(f'{name}: absent or inaccessible; first GHCR publication defaults to private.')
            continue
        raise SystemExit(f'{name}: unable to verify visibility (HTTP {error.code}); no push.')
    if package.get('visibility') != 'private':
        raise SystemExit(f'{name}: package is not private; change its settings before releasing.')
    print(f'{name}: private.')
