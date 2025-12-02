import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./backend/prisma/schema.prisma",
  // Carrega variáveis tanto de .env quanto de .env.local na raiz
  envFilePath: [".env", ".env.local"],
});
