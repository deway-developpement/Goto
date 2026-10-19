# Node 22 LTS; keep build and runtime on the same libc for native bcrypt.
FROM node:26-bookworm-slim@sha256:298992629d69bbd5b2b03ad57094d8e4fcb3a8eeb7c4e25d29de656519568913 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund
COPY tsconfig*.json nest-cli.json ./
COPY src/ ./src/
COPY config/ ./config/
COPY migrations/*.ts ./migrations/
RUN npm run build && npm prune --omit=dev --legacy-peer-deps --no-audit --no-fund

FROM node:26-bookworm-slim@sha256:298992629d69bbd5b2b03ad57094d8e4fcb3a8eeb7c4e25d29de656519568913
LABEL org.opencontainers.image.source="https://github.com/deway-developpement/Goto"
LABEL org.opencontainers.image.description="Goto GraphQL API"
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=build --chown=node:node /app/dist/ ./dist/
RUN mkdir -p data/photos data/tracks && chown -R node:node data
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 CMD ["node", "-e", "fetch('http://127.0.0.1:'+process.env.PORT+'/graphql',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query:'{ __typename }'})}).then(async r=>{const b=await r.json();process.exit(r.ok&&b.data?.__typename==='Query'?0:1)}).catch(()=>process.exit(1))"]
CMD ["node", "dist/src/main.js"]
