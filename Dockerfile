# syntax=docker/dockerfile:1.7
#
# Astro 5 + @astrojs/node (middleware mode), served by server.mjs.
#
# Four stages so the runtime image carries no build toolchain and no
# devDependencies. Nothing secret is baked in: RESEND_API_KEY is read at
# runtime from the container environment, which is what Dokploy's Environment
# tab provides. Do NOT pass it as a build arg — build args are readable in
# `docker history`.

# ---------- 1. Full dependency tree, including devDependencies ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- 2. Build ----------
# The build rasterises the article cover SVGs with sharp. sharp 0.34 ships
# prebuilt musl binaries and package-lock.json carries the linuxmusl x64 and
# arm64 variants, so `npm ci` above resolves them without a toolchain. If a
# future sharp ever fails to load here, the fix is `apk add --no-cache vips`
# in the deps stage — not switching off the og-image step.
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Produces dist/client (19 prerendered pages), dist/server (the on-demand
# routes) and dist/headers.json (the security headers server.mjs applies).
RUN npm run build

# ---------- 3. Production dependencies only ----------
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------- 4. Runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY server.mjs package.json ./

# uid 1000 already exists in the official image; creating another user is both
# unnecessary and a common source of permission problems.
USER node

# Documentation only — Dokploy routes by the Container Port field on the
# domain, not by EXPOSE.
EXPOSE 3000

# node:alpine has no curl, and a healthcheck whose binary is missing reports
# unhealthy forever — which, combined with FailureAction: rollback, makes every
# deploy roll back. Use the runtime that is definitely present.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.mjs"]
