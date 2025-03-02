FROM node:18-alpine

WORKDIR /app

# Copiar apenas o essencial
COPY package.json ./
COPY src ./src
COPY public ./public
COPY next.config.js ./

# Instalar apenas o necessário
RUN npm install --only=production

# Desativar telemetria
ENV NEXT_TELEMETRY_DISABLED=1

# Criar arquivo .env
RUN echo "NODE_ENV=development" > .env

# Criar arquivo db.json vazio
RUN mkdir -p /app/data
RUN echo '{"funcionarios":[],"servicos":[],"agendamentos":[]}' > /app/data/db.json

# Porta
EXPOSE 3000

# Iniciar em modo de desenvolvimento
CMD ["npx", "next", "dev"]
