FROM node:18-alpine AS base

# Configuração de ambiente comum
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN echo "prisma:generate-skip=true" > .npmrc
RUN echo "prisma:skip-postinstall=true" >> .npmrc
RUN echo "ignore-scripts=true" >> .npmrc
RUN npm install --omit=dev --no-fund --no-audit --ignore-scripts

FROM base AS setup
COPY --from=deps /app/node_modules ./node_modules
COPY scripts ./scripts
COPY db.example.json ./db.example.json
RUN node scripts/setup-db.js

FROM base AS builder
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=128"
ENV NEXT_DISABLE_LINT=1

COPY --from=deps /app/node_modules ./node_modules
COPY --from=setup /app/db.json ./db.json
COPY next.config.js jsconfig.json ./
COPY src ./src
COPY public ./public

RUN npm run build -- --no-lint

FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=setup /app/db.json ./db.json
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
