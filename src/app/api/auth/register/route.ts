import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  company: string;
  phone: string;
  plan: string;
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
    const { name, email, password, company, phone, plan } =
      (await request.json()) as CreateUserPayload;

    if (!name || !email || !password || !company || !phone || !plan) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Email inválido" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email já cadastrado" },
        { status: 409 }
      );
    }

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        company,
        phone,
        plan,
        passwordHash: hashPassword(password),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Usuário cadastrado com sucesso!",
        user: sanitizeUser(createdUser),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
