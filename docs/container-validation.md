# Local integration validation — 15 October 2026

Baseline: `main` at `a0083250390014e8ede3c92f4a259258dbeee507`.
Integration branch: `feat/static-web-release-images`. Production checkout and services untouched.

| Check | Result |
| --- | --- |
| API Docker build, Node 22 / lockfile / production dependencies | Passed |
| WEB Docker build, scratch/darkhttpd | Passed |
| API with disposable MySQL 8.4 | Healthy GraphQL endpoint |
| GraphQL user creation, native bcrypt login and JWT profile | Passed |
| API restart | User can still log in; upload files persist |
| API and WEB with read-only root, no capabilities, non-root user | Passed |
| Served WEB HTML and Android/iOS files compared against approved sources | Identical |
| Hidden files, Dockerfile, missing path and asset directory listing | HTTP 404 |
| Compose rendering using example-only values | Passed; no host ports or builds |
| Both new workflows checked with actionlint 1.7.11 | Passed |
| Shell syntax and Git whitespace | Passed |
| Static website source compared with approved v8 | Assets/downloads identical; one HTML blank line has whitespace normalized |

Local image sizes (uncompressed): WEB about 52 MB including downloads; API about 316 MB.
The API image excludes `.env`, local uploads, SQL dumps, source-only migration tools and development dependencies.
The source migrations are compiled into `dist/migrations` for explicit maintenance commands.
GraphQL schema generation stays in memory in production; the CLI datasource never synchronizes the schema.

Not yet exercised: the release event, authenticated GHCR pushes/private pulls, package administration,
physical-device app execution, production schema compatibility/migration, Caddy/DNS cutover or deployment.
The workflow controls package visibility and tests before publishing; actual package privacy must be
confirmed after the first successful publication. No release or package is created by these local tests.
