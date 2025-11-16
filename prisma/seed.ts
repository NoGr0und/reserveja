import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPERADMIN_EMAIL ?? "admin@super.com";
  const password = process.env.SUPERADMIN_PASSWORD ?? "Adm1n@36579";

  const name = process.env.SUPERADMIN_NAME ?? "Super Admin";
  const company =
    process.env.SUPERADMIN_COMPANY ?? "Reserveja LTDA - Administração";
  const phone = process.env.SUPERADMIN_PHONE ?? "(11) 90000-0000";
  const plan = process.env.SUPERADMIN_PLAN ?? "empresarial";

  const passwordHash = hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      company,
      phone,
      plan,
      passwordHash,
    },
    create: {
      email,
      name,
      company,
      phone,
      plan,
      passwordHash,
    },
  });

  console.log(`Super admin disponível em ${email}`);
}

main()
  .catch((error) => {
    console.error("Erro ao criar super admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
