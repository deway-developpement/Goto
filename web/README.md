# Gotò — static showcase

English single-page site, reproducing the original white/black layout, DM Sans typeface,
cyan copilot accent, vertical photo carousel, pill-shaped buttons, and draggable before/after
landscape comparison. The original carousel sits above the centered slogan. A keyboard-accessible vertical four-stop explorer
shows unmodified, higher-resolution app screens extracted from the supplied project defense PDF.
A lightweight, shadow-free CSS device frame handles the transparent outline; no precomposited black rectangles.
Each feature pairs its screen with an existing photograph from the original site. The former team section is replaced by compact, expandable footer credits. The photographic download banner follows the original black/white/cyan palette.
Copilot places its text before the comparison, alternating with the app explorer; both stack at 960 px.
On screens wider than 960 px and at least 650 px tall, Inside Gotò stays in view while native
scrolling advances four screens. Phone/photo crossfades overlap for a smooth change; route markers
move into place. Manual clicks remain selected until the next deliberate scroll (80 px).
Compact or short viewports use a vertical four-step story with a sticky, proportionally smaller visual.
Reduced motion removes pinning and transitions; all compact story text remains readable.
Download actions appear only once, as Android and iOS, with a small file-size label beneath each platform.
The carousel pauses on hover and keyboard focus; no pause button is displayed. Pricing, plans, subscriptions, newsletter,
and placeholder reviews have been removed. A small vanilla JavaScript file powers the original vertical carousel and before/after comparison. No CMS, database, JavaScript framework or runtime package manager.

## Container

`darkhttpd` 1.17 is compiled statically from the unmodified, vendored upstream source.
The final `scratch` image runs as UID/GID 65532, with a read-only filesystem and no capabilities.
It includes the public site, the provided Android APK and the provided iOS Simulator ZIP. Neither app build is rebuilt. The ZIP metadata declares iPhoneSimulator, not an iPhone installation or TestFlight distribution.

Local preview:

```sh
docker compose -f compose.preview.yaml up -d --build
```

Open http://127.0.0.1:18088/. To stop this preview only:

```sh
docker compose -f compose.preview.yaml down
```

## Behind the shared Caddy

1. Place this directory in the chosen application checkout.
2. Set `CADDY_NETWORK` to the existing Docker network used by the edge Caddy (default `caddy`).
3. Start the site: `docker compose up -d --build`.
4. Merge `Caddyfile.example` into the edge configuration, validate, then reload Caddy.

The production Compose file publishes no host ports. Only Caddy on the shared network reaches
`goto-web:8080`. If Caddy is installed natively rather than in Docker, use a loopback port mapping
and `reverse_proxy 127.0.0.1:18088` instead. Do not expose the backend port to the Internet.

Caddy handles HTTPS, gzip/zstd compression and browser-cache policy. This works while acting as
a reverse proxy; it does not require serving the files directly or adding a proxy-cache module.
Versioned assets have a one-year immutable cache; HTML and downloads use `no-cache` (store,
but revalidate before reuse). darkhttpd supports Last-Modified/If-Modified-Since and byte ranges,
including resumable APK downloads. The APK and simulator ZIP are already compressed archives, so they are not recompressed.

The original WordPress service has not been changed or removed. At cutover, handle only the old
vitrine paths; preserve `/goto-api/`. Removed pricing paths return 410 in the example edge config,
and have no corresponding files or navigation in the site.

## Editing

Edit `site/index.html` and the CSS in `site/assets/`. Images and fonts are local to the site.
After changing an asset, run:

```sh
python3 tools/version-assets.py
```

The helper changes filenames based on their contents and updates HTML/CSS references, avoiding
stale assets with the long cache policy. Rebuild the image afterwards.

To replace the APK, copy it to `site/downloads/goto-android.apk`, regenerate the `.sha256` file,
and update the visible size in HTML. The Apple archive is an x86_64 iPhoneSimulator build, version 1.0.0, with iOS 13.0 minimum declared.
It is a simulator artifact, not a TestFlight or iPhone installer. No Apple Developer membership
or store distribution is part of this project. Simulator execution and APK compatibility, login and hiking functionality require
device testing; HTTP-download checks do not verify application behaviour.

## Sources

- Existing site: https://deway.fr/goto/ — original photos, logo, typography and section concepts.
- Application: https://github.com/deway-developpement/Goto.
- Provided poster: “All the world's hikes in your pocket”.
- Provided project report: screenshots and feature descriptions. Automatic photo-to-GPX conversion
  is described as future work, and is not advertised as available.
- Provided Android APK, SHA-256: `b881bf33ad75220ac2b6fc06ee7e5be64cef645df41be2b26b4d77a765aa298a`.
- `vendor/darkhttpd/SOURCE.md` identifies the upstream server version and ISC license.

## Monorepo releases

This site is integrated as `web/` alongside `api/` and the existing Expo `app/`.
The [container release guide](../docs/container-releases.md) describes PR checks,
private GHCR publication on releases and explicit server promotion by digest.
Use `../deploy/compose.yaml` for the two-service pull-only deployment. The Compose files here remain
standalone web build/preview examples. The edge upstream is `goto-web:8080`.
