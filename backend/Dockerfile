FROM node:20-slim AS builder

WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install --production=false

COPY . .

RUN echo "=== BEFORE MERGE: prisma ===" && ls -R prisma
RUN node prisma/prisma-merge.js
RUN echo "=== AFTER MERGE: schema.prisma ===" && cat prisma/schema.prisma

RUN npx prisma generate
RUN npm run build


FROM node:20-slim
WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main.js"]
