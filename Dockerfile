FROM node:18-alpine AS base

# Configuração de variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package.json ./

# Instalar dependências
FROM base AS dependencies
RUN npm install --production=false

# Construir a aplicação
FROM dependencies AS builder
COPY . .
RUN npm run build

# Executar a aplicação
FROM base AS runner

# Copiar os arquivos necessários
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts

# Garantir que o db.json seja gravável
RUN touch db.json && chmod 777 db.json

# Expor a porta
EXPOSE 3000

# Comando para executar
CMD ["npm", "start"]
