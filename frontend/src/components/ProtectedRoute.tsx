"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // TODO: Futuramente, aqui pode ser adicionada lógica para:
    // 1. Verificar se o token JWT ainda é válido
    // 2. Verificar permissões específicas do usuário
    // 3. Redirecionar para diferentes páginas baseado no tipo de usuário
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não renderizar nada se não estiver autenticado (será redirecionado)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
