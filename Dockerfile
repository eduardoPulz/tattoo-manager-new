FROM node:18-alpine

# Configuração de variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Diretório de trabalho
WORKDIR /app

# Copiar apenas arquivos essenciais primeiro para aproveitar o cache
COPY package.json ./
COPY next.config.js ./

# Instalar dependências de produção somente
RUN npm install --omit=dev --no-fund --no-audit

# Copiar o restante dos arquivos
COPY scripts ./scripts
COPY src ./src

# Criar diretório public e db.json
RUN mkdir -p public
RUN node scripts/generate-env.js
RUN node scripts/setup-db.js
RUN chmod 777 db.json

# Compilar a aplicação com memória limitada
RUN NODE_OPTIONS="--max-old-space-size=256" npm run build

# Expor a porta
EXPOSE 3000

# Iniciar a aplicação
CMD ["npm", "start"]
