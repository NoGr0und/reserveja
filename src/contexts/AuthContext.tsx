"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// TODO: Futuramente substituir por dados reais do backend/banco de dados
interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  plan?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  nomeEmpresa: string;
  numero: string;
  plano: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// TODO: Futuramente substituir por usuários reais do banco de dados
const TEMPORARY_USERS = [
  {
    id: '1',
    name: 'Admin Usuário',
    email: 'admin@exemplo.com',
    password: '123456', // Em produção, isso seria um hash
    company: 'Empresa Admin',
    plan: 'profissional'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há usuário logado no localStorage ao carregar
  useEffect(() => {
    // TODO: Futuramente substituir por verificação de token JWT válido
    // Verificar se estamos no cliente para evitar problemas de hidratação
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Erro ao carregar usuário do localStorage:', error);
          localStorage.removeItem('user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    try {
      // TODO: Futuramente substituir por chamada real à API/banco de dados
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = TEMPORARY_USERS.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          company: foundUser.company,
          plan: foundUser.plan
        };
        
        setUser(userData);
        // TODO: Futuramente salvar token JWT ao invés de dados do usuário
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        return { success: true };
      } else {
        return { success: false, message: 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    try {
      // TODO: Futuramente substituir por chamada real à API/banco de dados
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se email já existe
      const existingUser = TEMPORARY_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, message: 'Email já cadastrado' };
      }
      
      // Criar novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.nome,
        email: userData.email,
        company: userData.nomeEmpresa,
        plan: userData.plano
      };
      
      // TODO: Em produção, salvar no banco de dados
      // Por enquanto, apenas simular sucesso
      setUser(newUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      
      return { success: true, message: 'Cadastro realizado com sucesso!' };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // TODO: Futuramente invalidar token JWT no backend
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
