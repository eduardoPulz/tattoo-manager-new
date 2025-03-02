FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json ./
COPY package-lock.json ./
COPY next.config.js ./
COPY jsconfig.json ./

# Instalar dependências
RUN npm install --omit=dev --no-fund --no-audit

# Copiar código fonte e scripts
COPY src ./src
COPY public ./public
COPY scripts ./scripts
COPY db.example.json ./db.example.json

# Configurar ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=256"

# Configurar banco de dados
RUN node scripts/setup-db.js

# Construir a aplicação
RUN npm run build

EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
