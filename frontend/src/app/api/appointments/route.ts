import { NextRequest, NextResponse } from "next/server";
import {
  createAppointment,
  listAppointmentsByUser,
  updateAppointment,
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
      status?: string;
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
      status: body.status,
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

export async function PUT(request: NextRequest) {
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
      id?: string;
      customerId?: string;
      serviceId?: string;
      scheduledFor?: string;
      status?: string;
    };

    if (!body.id) {
      return NextResponse.json(
        { message: "ID do agendamento é obrigatório." },
        { status: 400 },
      );
    }

    try {
      const appointment = await updateAppointment({
        userId,
        id: body.id,
        customerId: body.customerId,
        serviceId: body.serviceId,
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : undefined,
        status: body.status,
      });

      return NextResponse.json({ appointment }, { status: 200 });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "APPOINTMENT_NOT_FOUND") {
          return NextResponse.json({ message: "Agendamento não encontrado." }, { status: 404 });
        }
        if (err.message === "FORBIDDEN") {
          return NextResponse.json({ message: "Sem permissão para alterar este agendamento." }, { status: 403 });
        }
      }
      throw err;
    }
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Erro interno ao atualizar agendamento.",
      },
      { status: 500 },
    );
  }
}
