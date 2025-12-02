-- Converte o tipo para texto para evitar dependência de enum ausente
ALTER TABLE "client" ALTER COLUMN "status" TYPE TEXT;
ALTER TABLE "client" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
