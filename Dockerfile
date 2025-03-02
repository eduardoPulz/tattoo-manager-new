FROM node:18-alpine AS base

# Configuração de variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Evitar tentativas de usar o Prisma
ENV PRISMA_SKIP_POSTINSTALL=1
ENV PRISMA_GENERATE_SKIP=1
# Configurações para reduzir uso de memória
ENV NODE_OPTIONS="--max-old-space-size=512"

# Diretório de trabalho
WORKDIR /app

# Instalar dependências
FROM base AS dependencies
COPY package.json package-lock.json ./
COPY scripts ./scripts
# Instalar sem scripts pós-instalação
RUN npm install --production=false --ignore-scripts --no-fund --no-audit

# Construir a aplicação
FROM dependencies AS builder
COPY . .
RUN mkdir -p public
RUN node scripts/generate-env.js
RUN node scripts/setup-db.js
# Otimizar o processo de build para economizar memória
RUN NEXT_TELEMETRY_DISABLED=1 npm run build

# Executar a aplicação
FROM base AS runner

# Copiar apenas os arquivos necessários
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/db.json ./db.json

# Criar diretório public
RUN mkdir -p public

# Garantir que o db.json seja gravável
RUN chmod 777 db.json

# Expor a porta
EXPOSE 3000

# Comando para executar com memória limitada
CMD ["npm", "start"]
