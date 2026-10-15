# API and WEB container releases

The repository keeps `api/`, `app/` and `generator/` in place and adds `web/` for the approved English showcase.
There is no mobile build or store publication in this pipeline.

## What runs

| Trigger | Result |
| --- | --- |
| PR to `main`, or push to `main` affecting containers | Build API and WEB; exercise both images; no registry login/push |
| Published release `v1.0.0` or `v1.0.0-rc.1` | Build both images from the release tag, test both, then publish the exact tested images to GHCR |
| Production update | Explicit promotion of successful release digests in the infrastructure configuration, followed by pull/recreate |

Images are `linux/amd64`, matching the current server target. A release publishes:

- `ghcr.io/deway-developpement/goto-api:1.0.0`
- `ghcr.io/deway-developpement/goto-web:1.0.0`
- A `sha-<full-commit>` tag for each image.

There is no floating `latest` tag. Use the `image@sha256:...` references printed in the release job summary for deployment and rollback.
Both tests must pass before the first push. Registry pushes are not atomic: if a push fails, wait for a fully successful rerun before promoting either image.

## Private packages in a public repository

GHCR creates a new package as private by default, independently of source-repository visibility.
The workflow uses the repository's `GITHUB_TOKEN` with `packages: write`; no publisher PAT is needed.
OCI source labels associate the two packages with this repository.
Before building a release, a preflight refuses an existing package whose visibility is not `private`.
A 404 can mean absent or inaccessible; a pre-existing inaccessible package can still reject the eventual push.
No step changes package visibility or exports built images as downloadable workflow artifacts.
The public repository still exposes its source and the deliberately public website downloads.

Before the first release, organization/package settings must permit Actions to create packages.
For an existing package, grant this repository Actions access and ensure visibility is private.
A server pulling private images needs a GitHub account with package read access and a classic PAT scoped to `read:packages`.
Run `docker login ghcr.io` on the deployment host with that account; keep its credential outside Git and workflow inputs.
Do not paste the token into issues or PRs.

References: [GitHub Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry),
[package visibility](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility).

## Local validation

Run from the repository root with Docker and `curl` installed:

```bash
docker build -t goto-api:ci api
docker build -t goto-web:ci web
bash scripts/smoke-api.sh goto-api:ci
bash scripts/smoke-web.sh goto-web:ci
```

API smoke tests create a disposable internal Docker network, MySQL 8.4 container and upload volume.
They initialize ONLY that fresh test schema from current TypeORM entities, start the production image
with a read-only filesystem as `node`, test GraphQL user creation, bcrypt login and a JWT-protected profile,
then restart and verify user/upload persistence. Cleanup targets only that invocation's resources.
They do not test historical migrations against production data.

WEB sources live in `web/src/`; `python3 web/tools/build.py` generates ignored `web/dist/`.
Docker performs this step automatically, so fingerprinted CSS/JS and other generated assets are never committed.
The build contract tests cover source immutability, reproducible clean output, font/CSS cache invalidation
and rejection of in-place builds.

WEB smoke tests run the scratch/darkhttpd image as UID/GID 65532, with no capabilities and a read-only root.
They compare served HTML and every asset against a fresh local build, verify both downloads against source files,
and ensure hidden paths/listings and unbuilt source URLs are inaccessible.
The browser validation of the approved v8 is recorded in [web/VALIDATION.md](../web/VALIDATION.md).

## Current first cutover behind Apache

Use [the Apache cutover guide](apache-cutover.md) and `deploy/compose.apache.yaml` for the
current WEB-only deployment. The native API remains unchanged. The following two-service Caddy
configuration describes the later migration target.

## Pull-only server configuration

`deploy/compose.yaml` consumes images only. It has no build sections, published host ports,
embedded database or automatic migration command. The root `compose.yaml` remains the existing local development database.
The deployment uses the existing Caddy network, a separate shared database network and an existing persistent API data volume.

1. Record a successful release's two digests in the infrastructure repository (for Watson, `watson-infra`).
2. Supply the keys from `deploy/.env.example`. The API env file is a server-side absolute path,
   outside Git; use `api/.env.example` for the key names, actual MySQL hostname and a dedicated application account.
   `NODE_ENV=production` and database-reset flags are forced in Compose.
3. Before the first cutover, back up the database and existing API uploads. Compare the production schema
   with this modernized API revision and review a migration plan. Existing historical migrations are not
   certified by the smoke test. Neither `synchronize` nor migrations run at API startup in production.
4. Prepare the named `goto-api-data` volume and migrate existing `data/photos` and `data/tracks` into it,
   retaining ownership for UID/GID 1000. The volume is external so a typo/missing preparation fails rather
   than silently creating an empty replacement. Keep the original uploads for rollback.
5. From the infrastructure checkout, validate, pull and recreate explicitly:

```bash
docker compose --env-file /etc/goto/compose.env -f deploy/compose.yaml config --quiet
docker compose --env-file /etc/goto/compose.env -f deploy/compose.yaml pull
docker compose --env-file /etc/goto/compose.env -f deploy/compose.yaml up -d --wait
```

The `deploy/compose.yaml` path must refer to the versioned manifest copied/managed by the infrastructure repository.
Do not run the existing root development Compose on the production server.
The API health check posts a real GraphQL query; inspect health and test login/uploads before redirecting production traffic.

API migrations are compiled into the image for an explicitly approved maintenance operation:

```bash
# Review against the chosen database only after backups and a migration plan.
docker compose --env-file /etc/goto/compose.env -f deploy/compose.yaml run --rm goto-api npm run migration:show:prod
# Only when the reviewed migrations are intended for that database:
docker compose --env-file /etc/goto/compose.env -f deploy/compose.yaml run --rm goto-api npm run migration:run:prod
```

The CLI datasource has schema synchronization disabled. No reset/seed SQL is copied into the image.

## Caddy and rollback

Merge the static site's [Caddy example](../web/Caddyfile.example) into the shared edge configuration,
updating its upstream to `goto-web:8080`. The example domain remains a proposal until DNS/cutover is agreed.
Caddy owns TLS, compression, browser caching, security headers and retired Pricing responses.
Both edge services remain reachable by Docker DNS; no extra Nginx container is needed.

Keep the historical `/goto-api/` endpoint when migrating clients. For that route, the relevant block
inside the existing domain can strip the prefix and proxy to the new service:

```caddyfile
handle_path /goto-api/* {
    reverse_proxy goto-api:3000
}
```

Scope the showcase redirect to its own paths so it never captures `/goto-api/`.
Do not replace the whole shared Caddyfile with the showcase example.
For rollback, restore both previous image digests and recreate the services, preserving the upload volume.
A schema-changing release requires its own database-compatible rollback plan; changing images does not undo migrations.
