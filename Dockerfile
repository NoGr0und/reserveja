# Stage 1 - Install dependencies (cached separate from source for faster builds)
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Stage 2 - Build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera o client Prisma e compila a aplicação
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate \
  && npm run build

# Stage 3 - Produção
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_SHARP_PATH=/usr/lib
ENV NEXT_TELEMETRY_DISABLED=1

# Copia arquivos essenciais para execução
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

RUN npm prune --omit=dev

EXPOSE 3000

# Executa migrações, seed e inicia o servidor Next.js
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start"]
