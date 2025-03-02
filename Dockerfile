FROM node:18-alpine AS base

# Configuração básica
WORKDIR /app

# Etapa 1: Instalar dependências
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install --omit=dev --no-fund --no-audit

# Etapa 2: Configurar banco de dados
FROM base AS setup
COPY --from=deps /app/node_modules ./node_modules
COPY scripts ./scripts
COPY db.example.json ./db.example.json
RUN node scripts/setup-db.js

# Etapa 3: Construir aplicação
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=setup /app/db.json ./db.json
COPY package.json package-lock.json ./
COPY next.config.js jsconfig.json ./
COPY src ./src
COPY public ./public

# Configuração extrema para economizar memória
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=32"
ENV NEXT_DISABLE_LINT=1

# Construir em etapas para economizar memória
RUN mkdir -p .next
RUN npx next build --no-lint

# Etapa 4: Aplicação final
FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=setup /app/db.json ./db.json
COPY package.json next.config.js ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
