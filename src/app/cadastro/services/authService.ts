interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  nomeEmpresa: string;
  numero: string;
  plano: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    empresa: string;
    plano: string;
  };
}

export const registerService = async (data: RegisterData): Promise<RegisterResponse> => {
  try {
    // Simulação de chamada para API
    // Aqui você substituiria pela sua API real
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.nome,
        email: data.email,
        password: data.senha,
        company: data.nomeEmpresa,
        phone: data.numero,
        plan: data.plano,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Erro ao realizar cadastro'
      };
    }

    const result = await response.json();
    
    return {
      success: true,
      message: 'Cadastro realizado com sucesso!',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        empresa: result.user.company,
        plano: result.user.plan,
      }
    };
  } catch (error) {
    console.error('Erro no serviço de cadastro:', error);
    return {
      success: false,
      message: 'Erro de conexão. Tente novamente.'
    };
  }
};

// Função para validar email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar senha
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos um número' };
  }
  
  return { isValid: true };
};

// Função para validar telefone brasileiro
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};
