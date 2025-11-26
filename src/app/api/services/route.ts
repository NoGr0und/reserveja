import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ServiceType } from "@prisma/client";
import { db } from "@/lib/prisma";

const postSchema = z.object({
  userId: z.string().min(1, "userId é obrigatório"),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  description: z.string().trim().optional(),
  price: z.number().int().nonnegative("Preço precisa ser positivo"),
  type: z.nativeEnum(ServiceType),
  durationMinutes: z.number().int().positive("Duração precisa ser maior que zero"),
});

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

    const services = await db.service.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar serviços." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = postSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const service = await db.service.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        price: data.price,
        type: data.type,
        durationMinutes: data.durationMinutes,
        time: new Date(),
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json(
      { message: "Erro interno ao criar serviço." },
      { status: 500 },
    );
  }
}
