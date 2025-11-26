import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "Parâmetro userId é obrigatório." },
        { status: 400 },
      );
    }

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const [
      appointmentsToday,
      totalServices,
      activeServices,
      customersAttended,
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
      db.appointment.count({
        where: { userId },
        distinct: ["customerId"],
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

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
    return NextResponse.json(
      { message: "Erro interno ao carregar dados do dashboard." },
      { status: 500 },
    );
  }
}
