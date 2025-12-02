import { db } from "../lib/prisma";

export async function listAppointmentsByUser(userId: string) {
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
  }));
}

export async function createAppointment(params: {
  userId: string;
  customerId: string;
  serviceId: string;
  scheduledFor: Date;
}) {
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
  };
}
