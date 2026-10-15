# Goto
The hiking app you need

## Vitrine et images de release

- `web/` : vitrine anglaise validée, HTML/CSS/JS natifs, servie par darkhttpd dans `scratch`.
- `api/` : API NestJS, image Node 22 non root, fichiers persistants dans `/app/data`.
- `app/` : POC Expo conservé, sans build mobile dans cette CI.
- PR et push `main` : builds et tests isolés des deux conteneurs.
- Release publiée `vX.Y.Z` : tests puis publication des packages GHCR privés `goto-api` et `goto-web`.
- `deploy/compose.yaml` : déploiement par pull de digests derrière Caddy ; promotion explicite côté infra.

Voir [les releases et le déploiement](docs/container-releases.md),
[la vitrine](web/README.md) et [la validation de l’intégration](docs/container-validation.md).

## Développement local

Prérequis : Node.js 22, npm et MySQL local (Docker reste une option).

```bash
# Avec le serveur MySQL local Homebrew
mysql -h 127.0.0.1 -u root -e \
  "CREATE DATABASE IF NOT EXISTS Goto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Terminal 1 : démarrer l'API GraphQL
cd api
# Première installation uniquement : cp .env.example .env
npm ci --legacy-peer-deps
npm run start:dev

# Terminal 2 : démarrer le client iOS sur l'API locale
cd app
npm ci --legacy-peer-deps
npm run start:local
```

Si Docker Desktop est disponible, la base peut également être lancée avec
`docker compose up -d --wait database`. Dans ce cas, configurez
`DATABASE_PASSWORD=root` dans `api/.env`.

L'API répond sur `http://localhost:3000` et GraphQL sur
`http://localhost:3000/graphql`. Pour un appareil physique, remplacez `localhost` dans
`EXPO_PUBLIC_API_URL` par l'adresse IP locale de la machine.

Les données MySQL sont persistées dans le volume Docker `goto-mysql-data`. Les options
`RESET_DB_ON_START` et `RESET_DB_ON_SHUTDOWN` restent désactivées par défaut afin de ne pas
effacer les données locales.

### Presentation vidéo

https://github.com/deway-developpement/Goto/assets/54858036/28c98a4d-dec8-49ef-9a69-d2c9c8526b23
