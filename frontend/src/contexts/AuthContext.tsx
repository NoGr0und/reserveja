"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  plan: string;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  nomeEmpresa: string;
  numero: string;
  plano: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_STORAGE_KEY = "user";
const DEFAULT_ERROR = "Não foi possível processar sua solicitação.";

const persistUser = (user: User | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Erro ao carregar usuário do localStorage:", error);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data?.message || DEFAULT_ERROR,
        };
      }

      setUser(data.user);
      persistUser(data.user);

      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: DEFAULT_ERROR };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: RegisterData
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.nome,
          email: userData.email,
          password: userData.senha,
          company: userData.nomeEmpresa,
          phone: userData.numero,
          plan: userData.plano,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data?.message || DEFAULT_ERROR,
        };
      }

      setUser(data.user);
      persistUser(data.user);

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return { success: false, message: DEFAULT_ERROR };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
