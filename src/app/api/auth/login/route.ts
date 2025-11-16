import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

type LoginPayload = {
  email: string;
  password: string;
};

const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  plan: string;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  company: user.company,
  phone: user.phone,
  plan: user.plan,
});

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as LoginPayload;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
