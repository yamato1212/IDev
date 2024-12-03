FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=web --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# pnpmのバージョンを固定
RUN corepack enable
RUN corepack prepare pnpm@8.9.0 --activate

# First install dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock || true
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml || true
COPY --from=builder /app/out/package-lock.json ./package-lock.json || true

# エラーハンドリングを追加
RUN if [ -f "pnpm-lock.yaml" ]; then \
    pnpm install --frozen-lockfile; \
    else \
    echo "pnpm-lock.yaml not found" && exit 1; \
    fi

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm dlx turbo run build --filter=web

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# 必要なファイルのみをコピー
COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Static files and standalone build
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "apps/web/server.js"]