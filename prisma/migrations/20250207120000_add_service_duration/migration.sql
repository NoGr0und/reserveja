-- Adiciona campo de duração em minutos para serviços
ALTER TABLE "Service"
ADD COLUMN IF NOT EXISTS "durationMinutes" INTEGER NOT NULL DEFAULT 60;

-- Garante que o campo de tempo tenha um valor padrão para criações futuras
ALTER TABLE "Service"
ALTER COLUMN "time" SET DEFAULT NOW();
