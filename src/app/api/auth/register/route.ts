import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company, phone, plan } = await request.json();

    // Validação básica
    if (!name || !email || !password || !company || !phone || !plan) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validação de senha
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Aqui você implementaria a lógica real de cadastro
    // Por exemplo, verificar se o email já existe, salvar no banco de dados, etc.
    
    // Simulação de cadastro bem-sucedido
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      company,
      phone,
      plan,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      user: newUser
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
