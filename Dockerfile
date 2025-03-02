FROM node:18-alpine AS base

# Configuração de variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Evitar tentativas de usar o Prisma
ENV PRISMA_SKIP_POSTINSTALL=1
ENV PRISMA_GENERATE_SKIP=1

# Diretório de trabalho
WORKDIR /app

# Instalar dependências
FROM base AS dependencies
COPY package.json package-lock.json ./
COPY scripts ./scripts
# Instalar sem scripts pós-instalação
RUN npm install --production=false --ignore-scripts

# Construir a aplicação
FROM dependencies AS builder
COPY . .
RUN mkdir -p public
RUN node scripts/generate-env.js
RUN node scripts/setup-db.js
RUN npm run build

# Executar a aplicação
FROM base AS runner

# Copiar os arquivos necessários
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/src ./src
# Criar diretório public
RUN mkdir -p public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/db.json ./db.json

# Garantir que o db.json seja gravável
RUN chmod 777 db.json

# Expor a porta
EXPOSE 3000

# Comando para executar
CMD ["npm", "start"]
