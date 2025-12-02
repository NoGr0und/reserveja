import { NextRequest, NextResponse } from "next/server";
import {
  createAppointment,
  listAppointmentsByUser,
} from "@backend/services/appointments";

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

    const appointments = await listAppointmentsByUser(userId);

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar agendamentos." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "Parâmetro userId é obrigatório." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as {
      customerId?: string;
      serviceId?: string;
      scheduledFor?: string;
    };

    if (!body.customerId || !body.serviceId || !body.scheduledFor) {
      return NextResponse.json(
        { message: "Cliente, serviço e data são obrigatórios." },
        { status: 400 },
      );
    }

    const appointment = await createAppointment({
      userId,
      customerId: body.customerId,
      serviceId: body.serviceId,
      scheduledFor: new Date(body.scheduledFor),
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Erro interno ao criar agendamento.",
      },
      { status: 500 },
    );
  }
}
