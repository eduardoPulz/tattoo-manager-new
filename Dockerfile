FROM node:18-alpine

WORKDIR /app

# Copiar apenas package.json e instalar dependências
COPY package.json ./
RUN npm install --only=production

# Copiar apenas os arquivos essenciais
COPY src ./src
COPY public ./public
COPY next.config.js ./
COPY scripts ./scripts
COPY db.example.json ./db.example.json

# Configurar banco de dados
RUN node scripts/setup-db.js

# Configuração para economizar memória
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=256"

# Iniciar diretamente sem build
EXPOSE 3000
CMD ["npm", "start"]
