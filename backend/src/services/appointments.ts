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
