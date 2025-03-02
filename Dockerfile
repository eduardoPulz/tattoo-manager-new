FROM node:18-alpine

# Configuração básica
WORKDIR /app

# Copiar apenas o necessário para instalar dependências
COPY package.json ./
COPY package-lock.json ./

# Instalar apenas dependências de produção
RUN npm install --omit=dev --no-fund --no-audit

# Copiar o restante dos arquivos
COPY . .

# Configuração de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=64"

# Configurar banco de dados
RUN node scripts/setup-db.js

# Construir a aplicação com configurações mínimas
RUN npm run build -- --no-lint

EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
