# =============================================================================
# BUSINESSBOOK FRONTEND - Local Build Dockerfile (Fast)
# =============================================================================

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install necessary descriptors (but skip npm ci)
COPY package.json package-lock.json ./
# RUN npm ci --only=production

# Copy locally built artifacts and dependencies
COPY node_modules ./node_modules
COPY .next ./.next
COPY public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "start"]
