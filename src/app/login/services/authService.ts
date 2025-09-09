interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const loginService = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Simulação de chamada para API
    // Aqui você substituiria pela sua API real
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Erro ao fazer login'
      };
    }

    const data = await response.json();
    
    // Salvar token no localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return {
      success: true,
      token: data.token,
      user: data.user
    };
  } catch (error) {
    console.error('Erro no serviço de login:', error);
    return {
      success: false,
      message: 'Erro de conexão. Tente novamente.'
    };
  }
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('authToken');
  }
  return false;
};

// Função para fazer logout
export const logoutService = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
};
