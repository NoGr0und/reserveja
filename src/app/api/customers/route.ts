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

    const customers = await db.custumer.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar clientes." },
      { status: 500 },
    );
  }
}
