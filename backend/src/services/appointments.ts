import { db } from "../lib/prisma";

const ensureAppointmentStatusColumn = async () => {
  try {
    await db.$executeRawUnsafe(
      'ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT \'PENDING\';',
    );
  } catch (err) {
    console.error("Falha ao garantir coluna status em Appointment:", err);
  }
};

export async function listAppointmentsByUser(userId: string) {
  await ensureAppointmentStatusColumn();
  const appointments = await db.appointment.findMany({
    where: { userId },
    include: {
      customer: { select: { name: true } },
      service: { select: { name: true } },
    },
    orderBy: { requestedAt: "desc" },
  });

  return appointments.map((appointment) => ({
    id: appointment.id,
    customerName: appointment.customer.name,
    serviceName: appointment.service.name,
    requestedAt: appointment.requestedAt,
    scheduledFor: appointment.scheduledFor,
    status: appointment.status ?? "PENDING",
  }));
}

export async function createAppointment(params: {
  userId: string;
  customerId: string;
  serviceId: string;
  scheduledFor: Date;
  status?: string;
}) {
  await ensureAppointmentStatusColumn();
  // Opcional: validar se customer e service pertencem ao usuário
  const [customer, service] = await Promise.all([
    db.custumer.findUnique({ where: { id: params.customerId } }),
    db.service.findUnique({ where: { id: params.serviceId } }),
  ]);

  if (!customer || !service) {
    throw new Error("Cliente ou serviço não encontrado.");
  }

  if (customer.userId && customer.userId !== params.userId) {
    throw new Error("Sem permissão para usar este cliente.");
  }
  if (service.userId !== params.userId) {
    throw new Error("Sem permissão para usar este serviço.");
  }

  const appointment = await db.appointment.create({
    data: {
      userId: params.userId,
      customerId: params.customerId,
      serviceId: params.serviceId,
      scheduledFor: params.scheduledFor,
      status: params.status ?? "PENDING",
    },
    include: {
      customer: { select: { name: true } },
      service: { select: { name: true } },
    },
  });

  return {
    id: appointment.id,
    customerName: appointment.customer.name,
    serviceName: appointment.service.name,
    requestedAt: appointment.requestedAt,
    scheduledFor: appointment.scheduledFor,
    status: appointment.status ?? "PENDING",
  };
}

export async function updateAppointment(params: {
  userId: string;
  id: string;
  customerId?: string;
  serviceId?: string;
  scheduledFor?: Date;
  status?: string;
}) {
  await ensureAppointmentStatusColumn();
  const existing = await db.appointment.findUnique({
    where: { id: params.id },
    select: { userId: true },
  });
  if (!existing) throw new Error("APPOINTMENT_NOT_FOUND");
  if (existing.userId !== params.userId) throw new Error("FORBIDDEN");

  const appointment = await db.appointment.update({
    where: { id: params.id },
    data: {
      customerId: params.customerId,
      serviceId: params.serviceId,
      scheduledFor: params.scheduledFor,
      status: params.status,
    },
    include: {
      customer: { select: { name: true } },
      service: { select: { name: true } },
    },
  });

  return {
    id: appointment.id,
    customerName: appointment.customer.name,
    serviceName: appointment.service.name,
    requestedAt: appointment.requestedAt,
    scheduledFor: appointment.scheduledFor,
    status: appointment.status ?? "PENDING",
  };
}
