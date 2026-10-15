#!/usr/bin/env bash
# Disposable database/network/volume: never connects to an existing MySQL instance.
set -euo pipefail
image=${1:?Usage: smoke-api.sh IMAGE}
root=$(cd "$(dirname "$0")/.." && pwd)
prefix="goto-api-smoke-${RANDOM}-$$"
api="$prefix-api"
db="$prefix-db"
volume="$prefix-data"
tmp=$(mktemp -d)
cleanup() {
    status=$?
    if (( status != 0 )); then docker logs --tail 60 "$api" 2>/dev/null || true; fi
    docker rm -f "$api" "$db" >/dev/null 2>&1 || true
    docker volume rm "$volume" >/dev/null 2>&1 || true
    docker network rm "$prefix" >/dev/null 2>&1 || true
    rm -rf "$tmp"
    exit "$status"
}
trap cleanup EXIT
cat > "$tmp/api.env" <<'ENV'
NODE_ENV=production
JWT_SECRET=local-container-smoke-only-not-a-production-secret
JWT_EXPIRES_IN=30min
JWT_REFRESH_EXPIRES_IN=30d
DATABASE_HOST=database
DATABASE_PORT=3306
DATABASE_USERNAME=goto_test
DATABASE_PASSWORD=local-smoke-db-password
DATABASE_NAME=GotoSmoke
RESET_DB_ON_START=false
RESET_DB_ON_SHUTDOWN=false
ENV
docker network create --internal "$prefix" >/dev/null
docker volume create "$volume" >/dev/null
docker run -d --name "$db" --network "$prefix" --network-alias database \
    --tmpfs /var/lib/mysql:rw,size=512m --memory 1g \
    -e MYSQL_ROOT_PASSWORD=local-smoke-root-password \
    -e MYSQL_DATABASE=GotoSmoke -e MYSQL_USER=goto_test \
    -e MYSQL_PASSWORD=local-smoke-db-password \
    mysql:8.4 --innodb-buffer-pool-size=32M --max-connections=30 --performance-schema=OFF >/dev/null
ready=false
for attempt in $(seq 1 60); do
    if docker exec "$db" mysql -ugoto_test -plocal-smoke-db-password \
        -D GotoSmoke -e 'SELECT 1' >/dev/null 2>&1; then ready=true; break; fi
    sleep 2
done
$ready || { echo 'Disposable MySQL did not become ready' >&2; exit 1; }
# The production entrypoint never creates/synchronizes a schema. Initialize ONLY this
# newly created test database from the current entities, independently of legacy migrations.
docker run --rm --network "$prefix" --env-file "$tmp/api.env" --entrypoint node "$image" -e \
    "const ds=require('./dist/src/ormconfig').default;ds.setOptions({synchronize:true,migrations:[]});ds.initialize().then(()=>ds.destroy()).catch(e=>{console.error(e.message);process.exit(1)});"
docker run -d --name "$api" --network "$prefix" --env-file "$tmp/api.env" \
    --read-only --cap-drop ALL --security-opt no-new-privileges --init \
    --mount "type=volume,source=$volume,target=/app/data" \
    --tmpfs /tmp:rw,nosuid,noexec,size=32m --memory 512m --pids-limit 128 "$image" >/dev/null
ready=false
for attempt in $(seq 1 60); do
    if test "$(docker inspect --format '{{.State.Health.Status}}' "$api")" = healthy; then ready=true; break; fi
    sleep 2
done
$ready || { echo 'API did not become healthy' >&2; exit 1; }
docker exec -i "$api" node - < "$root/scripts/smoke-api-client.cjs"
# The upload volume must be writable by the non-root process.
docker exec "$api" node -e "const fs=require('fs');fs.writeFileSync('data/photos/smoke.txt','persistent');fs.writeFileSync('data/tracks/smoke.txt','persistent');"
docker restart "$api" >/dev/null
for attempt in $(seq 1 60); do
    if test "$(docker inspect --format '{{.State.Health.Status}}' "$api")" = healthy; then break; fi
    sleep 2
done
docker exec -i "$api" node - verify < "$root/scripts/smoke-api-client.cjs"
docker exec "$api" node -e "const fs=require('fs');for(const p of ['photos','tracks'])if(fs.readFileSync('data/'+p+'/smoke.txt','utf8')!=='persistent')process.exit(1);"
test "$(docker inspect --format '{{.Config.User}}' "$api")" = node
echo 'API: persistent upload directories and non-root read-only runtime passed.'
