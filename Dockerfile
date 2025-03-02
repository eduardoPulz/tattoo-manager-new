FROM node:18-alpine

WORKDIR /app

# Copiar apenas o essencial
COPY package.json ./
COPY src ./src
COPY public ./public
COPY next.config.js ./
COPY scripts ./scripts
COPY db.example.json ./db.example.json

# Instalar apenas o necessário
RUN npm install --only=production

# Configurar banco de dados
RUN node scripts/setup-db.js

# Desativar telemetria
ENV NEXT_TELEMETRY_DISABLED=1

# Porta
EXPOSE 3000

# Iniciar em modo de desenvolvimento
CMD ["npm", "run", "dev"]
