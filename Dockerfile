FROM node:18-alpine

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=256"

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY next.config.js ./
COPY jsconfig.json ./

# Configuração para evitar problemas com Prisma
RUN echo "prisma:generate-skip=true" > .npmrc
RUN echo "prisma:skip-postinstall=true" >> .npmrc
RUN echo "ignore-scripts=true" >> .npmrc

RUN npm install --omit=dev --no-fund --no-audit --ignore-scripts

COPY src ./src
COPY public ./public
COPY scripts ./scripts

RUN mkdir -p public
RUN node scripts/generate-env.js
RUN node scripts/setup-db.js

# Desativar o linting durante o build
ENV NEXT_DISABLE_LINT=1
RUN npm run build --no-lint

EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
