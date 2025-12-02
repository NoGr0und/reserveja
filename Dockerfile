# Stage 1 - Install dependencies (cached separate from source for faster builds)
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Stage 2 - Build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY frontend ./frontend
COPY backend ./backend

# Gera o client Prisma e compila a aplicação
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate --schema ./backend/prisma/schema.prisma \
  && npm run build

# Stage 3 - Produção
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_SHARP_PATH=/usr/lib
ENV NEXT_TELEMETRY_DISABLED=1

# Copia arquivos essenciais para execução
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend ./frontend
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

RUN npm prune --omit=dev

EXPOSE 3000

# Executa migrações, seed e inicia o servidor Next.js
CMD ["sh", "-c", "npx prisma migrate deploy --schema ./backend/prisma/schema.prisma && npx prisma db seed --schema ./backend/prisma/schema.prisma && npm run start"]
