import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Aqui você implementaria a lógica real de autenticação
    // Por exemplo, verificar no banco de dados, validar senha, etc.
    
    // Simulação de autenticação
    if (email === 'admin@exemplo.com' && password === '123456') {
      return NextResponse.json({
        success: true,
        token: 'jwt-token-exemplo',
        user: {
          id: '1',
          email: email,
          name: 'Usuário Admin'
        }
      });
    }

    return NextResponse.json(
      { message: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
