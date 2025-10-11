# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app

# Install dependencies based on the pnpm lockfile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod && pnpm store prune

# Copy build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts

# Add a non-root user for security
RUN addgroup -g 1001 nextjs && \
    adduser -D -G nextjs -u 1001 nextjs && \
    chown -R nextjs:nextjs /app
USER nextjs

EXPOSE 3000
CMD ["pnpm", "start"]
