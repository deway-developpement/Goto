#!/usr/bin/env bash
# Only creates/removes resources belonging to this test run.
set -euo pipefail
image=${1:?Usage: smoke-web.sh IMAGE}
name="goto-web-smoke-${RANDOM}-$$"
tmp=$(mktemp -d)
cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; rm -rf "$tmp"; }
trap cleanup EXIT
root=$(cd "$(dirname "$0")/.." && pwd)
docker run -d --name "$name" --read-only --cap-drop ALL \
    --security-opt no-new-privileges --memory 32m --pids-limit 16 \
    -p 127.0.0.1::8080 "$image" >/dev/null
port=$(docker inspect --format '{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' "$name")
base="http://127.0.0.1:$port"
curl --fail --silent --show-error --retry 10 --retry-connrefused --retry-delay 1 "$base/" > "$tmp/index.html"
# Verify the approved HTML exactly, not just an HTTP status.
cmp "$root/web/site/index.html" "$tmp/index.html"
for file in goto-android.apk goto-ios.zip; do
    curl --fail --silent --show-error "$base/downloads/$file" > "$tmp/$file"
    cmp "$root/web/site/downloads/$file" "$tmp/$file"
done
for path in /.git/config /Dockerfile /missing /assets/; do
    code=$(curl --silent --output /dev/null --write-out '%{http_code}' "$base$path")
    test "$code" = 404 || { echo "Unexpected access: $path ($code)" >&2; exit 1; }
done
test "$(docker inspect --format '{{.Config.User}}' "$name")" = '65532:65532'
echo 'WEB: approved HTML, both unchanged builds, hidden paths and non-root read-only runtime passed.'
