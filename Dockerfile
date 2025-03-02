FROM node:18-alpine

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY package.json ./
COPY next.config.js ./

RUN npm install --omit=dev --no-fund --no-audit

COPY scripts ./scripts
COPY src ./src

RUN mkdir -p public
RUN node scripts/generate-env.js
RUN node scripts/setup-db.js
RUN chmod 777 db.json

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
