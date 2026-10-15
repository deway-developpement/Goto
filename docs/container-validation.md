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
| Served WEB HTML/assets compared against a fresh build; Android/iOS against source files | Identical |
| Hidden files, Dockerfile, missing path and asset directory listing | HTTP 404 |
| Compose rendering using example-only values | Passed; no host ports or builds |
| Both new workflows checked with actionlint 1.7.11 | Passed |
| Shell syntax and Git whitespace | Passed |
| Generated website compared with the previous validated v8 image content | Every output file identical |

Local image sizes (uncompressed): WEB about 52 MB including downloads; API about 316 MB.
The API image excludes `.env`, local uploads, SQL dumps, source-only migration tools and development dependencies.
The source migrations are compiled into `dist/migrations` for explicit maintenance commands.
GraphQL schema generation stays in memory in production; the CLI datasource never synchronizes the schema.

Not yet exercised: the release event, authenticated GHCR pushes/private pulls, package administration,
physical-device app execution, production schema compatibility/migration, Caddy/DNS cutover or deployment.
The workflow controls package visibility and tests before publishing; actual package privacy must be
confirmed after the first successful publication. No release or package is created by these local tests.

Source/build separation:
- `web/src/` contains stable source filenames; `web/dist/` is generated and ignored.
- Docker runs the dependency-free Python build, and copies only its output into scratch.
- All previous runtime files are reproduced byte for byte, including HTML, CSS, JS and downloads.
- Three build-contract tests pass: no source writes, reproducible clean output, font/CSS invalidation,
  and refusal to build in-place/inside a source directory.
- Container smoke checks fetch every generated asset and reject unversioned source asset URLs.

Apache deployment preparation:
- Apache 2.4.66 standalone configuration on loopback: syntax and actual requests passed.
- /goto/ HTML matches the backend; browser checks at 1440/900/390 px load all assets and pass CSP/interactions.
- gzip, immutable successful assets, non-cacheable missing assets, canonical URL, retired WordPress/Pricing,
  APK/ZIP range responses and unchanged native API routes verified through the Apache candidate.
- Four isolated cutover tests cover successful restore, failed-public-check rollback, and refusal
  to overwrite concurrent edits. No root/production files are changed by these tests.
- Current live baseline: /goto/ 200 (WordPress), API GraphQL 200 with Query, profile 401, root 301, Atomic 200.
- Actual Apache activation requires interactive sudo on this host. WEB-only Compose binds loopback;
  the native API, its process/service and its database stay unchanged.
