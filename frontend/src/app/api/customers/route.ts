import { NextRequest, NextResponse } from "next/server";
import { listCustomersByUser } from "@backend/services/customers";

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

    const customers = await listCustomersByUser(userId);

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar clientes." },
      { status: 500 },
    );
  }
}
