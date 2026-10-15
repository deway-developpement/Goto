# Current deployment: Apache and the static showcase

The first cutover keeps the existing URL **https://deway.fr/goto/** and native Apache.
`deploy/compose.apache.yaml` runs only the approved WEB image on `127.0.0.1:8113`.
It does not deploy/restart the API, create a database, change DNS or start Caddy.

Include `deploy/apache/goto-web.inc.conf` inside the existing `deway.fr` HTTPS virtual host,
before the existing proxies. Remove only the root `.htaccess` rule rewriting `/goto/` to
`/wordpress/`; preserve every other route and the `/goto-api/` proxy.
The include provides the canonical trailing slash, retired Pricing responses, gzip, immutable
versioned assets and revalidation for HTML/downloads. Direct WordPress URLs return Gone and
the physical WordPress directory is denied, including its overrides.

The WordPress files and database are retained for rollback; no PHP module is disabled globally.
Other PHP sites may still need it. Delete/archive the old data separately after the cutover is accepted.

The current host requires interactive administrator authentication. Prepare and review the guarded
cutover bundle, then apply it with `scripts/apply-apache-cutover.py`. It checks the old file hashes,
checks the running backend, backs up the three affected files, runs `apache2ctl configtest` and
reloads Apache. It verifies the real HTTPS site locally with SNI and checks the API/other route statuses.
A failure restores the old files and reloads the previous configuration. Keep the printed backup path.
The script reads no WordPress database credentials and neither drops data nor stops the API.

Caddy remains a future target; `deploy/compose.yaml` and `web/Caddyfile.example` document that target.

References: [Apache reverse proxy](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#proxypass),
[conditional response headers](https://httpd.apache.org/docs/2.4/mod/mod_headers.html#header).
