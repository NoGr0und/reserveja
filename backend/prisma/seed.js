import { PrismaClient, ServiceType } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();
const KEY_LENGTH = 64;

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derivedKey}`;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL nao definida. Configure o .env antes de rodar o seed.",
    );
    process.exit(1);
  }

  const email = process.env.SUPERADMIN_EMAIL || "admin@super.com";
  const password = process.env.SUPERADMIN_PASSWORD || "change-me-now";
  const name = process.env.SUPERADMIN_NAME || "Super Admin";
  const company =
    process.env.SUPERADMIN_COMPANY || "Reserveja LTDA - Administracao";
  const phone = process.env.SUPERADMIN_PHONE || "(11) 90000-0000";
  const plan = process.env.SUPERADMIN_PLAN || "empresarial";

  if (!process.env.SUPERADMIN_PASSWORD) {
    console.warn(
      "SUPERADMIN_PASSWORD não definido; usando senha placeholder 'change-me-now'. Altere para um valor seguro em produção.",
    );
  }

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

  const userRecord = await prisma.user.findUnique({ where: { email } });

  if (userRecord) {
    const servicesCount = await prisma.service.count({
      where: { userId: userRecord.id },
    });

    if (servicesCount === 0) {
      await prisma.service.createMany({
        data: [
          {
            name: "Consulta Premium",
            description: "Atendimento completo com follow-up",
            price: 200,
            type: ServiceType.ACTIVE,
            userId: userRecord.id,
            time: new Date(),
            durationMinutes: 60,
          },
          {
            name: "Consulta Express",
            description: "Atendimento rápido para demandas simples",
            price: 120,
            type: ServiceType.ACTIVE,
            userId: userRecord.id,
            time: new Date(),
            durationMinutes: 30,
          },
        ],
      });
    }

    const customersCount = await prisma.custumer.count({
      where: { userId: userRecord.id },
    });

    let customerId = null;
    if (customersCount === 0) {
      const customer = await prisma.custumer.create({
        data: {
          name: "Cliente Demo",
          email: "cliente.demo@reserveja.com",
          phone: "(11) 91111-1111",
          userId: userRecord.id,
        },
      });
      customerId = customer.id;
    } else {
      const firstCustomer = await prisma.custumer.findFirst({
        where: { userId: userRecord.id },
      });
      customerId = firstCustomer?.id ?? null;
    }

    const firstService = await prisma.service.findFirst({
      where: { userId: userRecord.id },
      orderBy: { createdAt: "asc" },
    });

    const appointmentsCount = await prisma.appointment.count({
      where: { userId: userRecord.id },
    });

    if (appointmentsCount === 0 && customerId && firstService?.id) {
      const now = new Date();
      const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      await prisma.appointment.create({
        data: {
          customerId,
          serviceId: firstService.id,
          userId: userRecord.id,
          scheduledFor: inTwoHours,
        },
      });
    }
  }

  console.log(`Super admin disponivel em ${email}`);
}

main()
  .catch((error) => {
    console.error("Erro ao criar super admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
