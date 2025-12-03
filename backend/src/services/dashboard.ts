import { db } from "../lib/prisma";

const ensureAppointmentStatusColumn = async () => {
  try {
    await db.$executeRawUnsafe(
      'ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT \'PENDING\';',
    );
  } catch (err) {
    // Se não conseguir aplicar, seguirá a consulta e o erro será tratado no caller
    console.error("Falha ao garantir coluna status em Appointment:", err);
  }
};

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export async function loadDashboard(userId: string) {
  await ensureAppointmentStatusColumn();

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [
    appointmentsToday,
    totalServices,
    activeServices,
    customerIds,
    revenueAppointments,
    upcomingAppointments,
    services,
  ] = await Promise.all([
    db.appointment.count({
      where: {
        userId,
        scheduledFor: { gte: todayStart, lte: todayEnd },
      },
    }),
    db.service.count({ where: { userId } }),
    db.service.count({ where: { userId, type: "ACTIVE" } }),
    db.appointment.findMany({
      where: { userId },
      select: { customerId: true },
    }),
    db.appointment.findMany({
      where: { userId },
      include: {
        service: { select: { price: true } },
      },
    }),
    db.appointment.findMany({
      where: { userId, scheduledFor: { gte: todayStart } },
      include: {
        customer: { select: { name: true } },
        service: { select: { name: true } },
      },
      orderBy: { scheduledFor: "asc" },
      take: 5,
    }),
    db.service.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const revenueTotal = revenueAppointments.reduce(
    (sum, appointment) => sum + (appointment.service?.price ?? 0),
    0,
  );
  const customersAttended = new Set(customerIds.map((c) => c.customerId)).size;

  return {
    metrics: {
      appointmentsToday,
      pendingToday: Math.max(appointmentsToday, 0),
      totalServices,
      activeServices,
      customersAttended,
      revenueTotal,
    },
    upcomingAppointments: upcomingAppointments.map((item) => ({
      id: item.id,
      customerName: item.customer.name,
      serviceName: item.service.name,
      scheduledFor: item.scheduledFor,
    })),
    services: services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      status: service.type,
      durationMinutes: service.durationMinutes ?? 0,
    })),
  };
}
