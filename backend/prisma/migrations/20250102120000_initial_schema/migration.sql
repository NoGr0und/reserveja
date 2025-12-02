-- Habilita UUID no Postgres
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum para status do servico
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ServiceType') THEN
        CREATE TYPE "ServiceType" AS ENUM ('ACTIVE', 'INACTIVE');
    END IF;
END $$;

-- Usuarios do sistema
CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "company" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Servicos oferecidos
CREATE TABLE IF NOT EXISTS "Service" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "time" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "type" "ServiceType" NOT NULL,
    "userId" UUID NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "Service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Clientes (Custumer)
CREATE TABLE IF NOT EXISTS "client" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NOT NULL,
    "userId" UUID,
    CONSTRAINT "client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Agendamentos
CREATE TABLE IF NOT EXISTS "Appointment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "customerId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "requestedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "scheduledFor" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "client" ("id") ON DELETE CASCADE,
    CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE,
    CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Índices para consultas mais rápidas
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User" ("email");
CREATE INDEX IF NOT EXISTS "Service_userId_idx" ON "Service" ("userId");
CREATE INDEX IF NOT EXISTS "client_userId_idx" ON "client" ("userId");
CREATE INDEX IF NOT EXISTS "Appointment_userId_idx" ON "Appointment" ("userId");
