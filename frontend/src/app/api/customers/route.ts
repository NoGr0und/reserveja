import { NextRequest, NextResponse } from "next/server";
import {
  createCustomer,
  listCustomersByUser,
  updateCustomer,
} from "@backend/services/customers";

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
      name?: string;
      email?: string;
      phone?: string;
      status?: "ACTIVE" | "INACTIVE";
    };

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { message: "Nome, email e telefone são obrigatórios." },
        { status: 400 },
      );
    }

    const customer = await createCustomer(userId, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      status: body.status ?? "ACTIVE",
    });

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Erro interno ao criar cliente.",
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
      name?: string;
      email?: string;
      phone?: string;
      status?: "ACTIVE" | "INACTIVE";
    };

    if (!body.id || !body.name || !body.email || !body.phone || !body.status) {
      return NextResponse.json(
        { message: "ID, nome, email, telefone e status são obrigatórios." },
        { status: 400 },
      );
    }

    try {
      const customer = await updateCustomer(userId, {
        id: body.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        status: body.status,
      });

      return NextResponse.json({ customer }, { status: 200 });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "CLIENT_NOT_FOUND") {
          return NextResponse.json({ message: "Cliente não encontrado." }, { status: 404 });
        }
        if (err.message === "FORBIDDEN") {
          return NextResponse.json({ message: "Sem permissão para alterar este cliente." }, { status: 403 });
        }
      }
      throw err;
    }
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Erro interno ao atualizar cliente.",
      },
      { status: 500 },
    );
  }
}
