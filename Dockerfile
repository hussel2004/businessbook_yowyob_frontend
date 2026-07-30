# =============================================================================
# BUSINESSBOOK FRONTEND - Production Dockerfile (multi-stage, CI-cachable)
# =============================================================================

# --- deps -------------------------------------------------------------------
# Layer isolee sur le lockfile : Docker ne relance npm ci que si
# package-lock.json change, au lieu de retelecharger node_modules a chaque
# build.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- builder ------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Variables NEXT_PUBLIC_* : injectees au build, pas au runtime
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_ORS_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_ORS_API_KEY=$NEXT_PUBLIC_ORS_API_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- runner -------------------------------------------------------------
# Image finale : uniquement la sortie standalone (node_modules trace, pas
# le node_modules complet).
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
