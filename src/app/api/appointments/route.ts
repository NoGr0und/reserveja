import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

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

    const appointments = await db.appointment.findMany({
      where: { userId },
      include: {
        customer: {
          select: { name: true },
        },
        service: {
          select: { name: true },
        },
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    return NextResponse.json({
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        customerName: appointment.customer.name,
        serviceName: appointment.service.name,
        requestedAt: appointment.requestedAt,
        scheduledFor: appointment.scheduledFor,
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar agendamentos." },
      { status: 500 },
    );
  }
}
