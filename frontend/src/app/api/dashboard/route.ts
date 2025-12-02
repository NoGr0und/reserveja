import { NextRequest, NextResponse } from "next/server";
import { loadDashboard } from "@backend/services/dashboard";

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

    const dashboard = await loadDashboard(userId);

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
    return NextResponse.json(
      { message: "Erro interno ao carregar dados do dashboard." },
      { status: 500 },
    );
  }
}
