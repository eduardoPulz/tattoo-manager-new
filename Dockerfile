FROM node:18-alpine

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=256"

WORKDIR /app

COPY package.json ./
COPY next.config.js ./

# Configuração para evitar problemas com Prisma
RUN echo "prisma:generate-skip=true" > .npmrc
RUN echo "prisma:skip-postinstall=true" >> .npmrc
RUN echo "ignore-scripts=true" >> .npmrc

RUN npm install --omit=dev --no-fund --no-audit --ignore-scripts

COPY scripts ./scripts
COPY src ./src

RUN mkdir -p public
RUN node scripts/generate-env.js
RUN node scripts/setup-db.js
RUN chmod 777 db.json

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
