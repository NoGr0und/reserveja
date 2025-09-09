"use client";

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/sd";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Rotas onde a sidebar deve ser ocultada
  const hideSidebarRoutes = ['/login', '/cadastro'];
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  // TODO: Futuramente, a lógica pode ser baseada em:
  // 1. Estado de autenticação real (JWT válido)
  // 2. Permissões do usuário (admin, user, guest)
  // 3. Configurações do usuário (preferências de UI)
  // 4. Dados do backend sobre layout da aplicação

  if (shouldHideSidebar) {
    // Layout sem sidebar para páginas de autenticação
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // Layout com sidebar para páginas autenticadas
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
