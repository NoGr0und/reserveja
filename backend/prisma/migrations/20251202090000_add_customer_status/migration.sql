-- Adiciona status ao cliente
ALTER TABLE "client" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ACTIVE';
