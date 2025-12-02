import { NextRequest, NextResponse } from "next/server";
import { listAppointmentsByUser } from "@backend/services/appointments";

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
