import { NextRequest, NextResponse } from "next/server";
import { register } from "@backend/services/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company, phone, plan } =
      (await request.json()) as {
        name: string;
        email: string;
        password: string;
        company: string;
        phone: string;
        plan: string;
      };

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

    try {
      const createdUser = await register({
        name,
        email,
        password,
        company,
        phone,
        plan,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Usuário cadastrado com sucesso!",
          user: createdUser,
        },
        { status: 201 }
      );
    } catch (err) {
      if (err instanceof Error && err.message === "EMAIL_EXISTS") {
        return NextResponse.json(
          { message: "Email já cadastrado" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { message: "Erro ao cadastrar usuário" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
