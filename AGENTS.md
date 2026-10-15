# Repository Guidelines

## Project Structure & Module Organization
This repository contains these applications:

- `app/`: Expo React Native client. Entry point is `app/App.jsx`; UI lives in `app/src/components`, shared providers in `app/src/providers`, services in `app/src/services`, and static assets in `app/assets`.
- `web/`: static English showcase with local HTML/CSS/JS assets, a scratch/darkhttpd image and no npm dependencies.
- `api/`: NestJS GraphQL API. Runtime code lives in `api/src`, grouped by domain (`hike/`, `user/`, `photo/`, etc.). Database migrations and SQL helpers live in `api/migrations`.

Keep editable web sources under `web/src/` with stable asset names. Run `python3 web/tools/build.py`
to generate ignored `web/dist/`; Docker runs this build automatically. Never commit generated files.
`deploy/` contains pull-only server manifests; `scripts/smoke-*.sh` exercise images using isolated resources.
Keep new API/mobile code inside existing feature folders. Add mobile frontend assets under `app/assets/images` or `app/assets/maps`, not beside components.

## Build, Test, and Development Commands
Install dependencies in each package:

- `cd app && npm install`: install mobile app dependencies.
- `cd app && npm run start`: start Expo locally.
- `cd app && npm run start:local`: start Expo iOS with local config.
- `cd api && npm install`: install API dependencies.
- `cd api && npm run start:dev`: run the API in watch mode on port `3000`.
- `cd api && npm run build`: compile NestJS to `api/dist`.
- `cd api && npm run lint`: run ESLint with autofix on TypeScript sources.
- `cd api && npm run test` or `npm run test:cov`: run Jest tests and coverage.

## Coding Style & Naming Conventions
Both packages use 4-space indentation and a 100-character line width. The app enforces single quotes, semicolons, and 4-space JSX indentation through ESLint. The API uses Prettier and `@typescript-eslint`; prefer single quotes and trailing commas where valid.

Follow the current naming pattern: React components in PascalCase files such as `Home.jsx`, services/stores in lower camel or dotted names such as `auth.service.js`, and Nest modules as `*.module.ts`, `*.service.ts`, `*.resolver.ts`, `*.entity.ts`.

## Testing Guidelines
API tests use Jest with `*.spec.ts` naming. Keep unit tests close to the source in `api/src` unless a dedicated `api/test` suite is added. The frontend currently has no committed automated tests; include manual verification steps for UI changes.

## Commit & Pull Request Guidelines
Recent history mostly follows Conventional Commit prefixes such as `feat(scope): ...` and `fix(scope): ...`. Continue that pattern and avoid vague subjects like `Update`.

Pull requests should include:

- a short summary of user-visible or API behavior changes,
- linked issue or context when available,
- screenshots or screen recordings for `app/` UI changes,
- migration notes for schema or database changes in `api/`.

## Configuration Tips
Do not commit secrets. Treat `app/.env`, Expo keys in `app/app.json`, and API database settings in `api/src/ormconfig.ts` as environment-specific configuration.
