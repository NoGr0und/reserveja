"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  ChevronUp,
  Clock,
  Home,
  LogOut,
  Settings,
  User2,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { BrandLogo } from "@/components/BrandLogo";
import { usePathname } from "next/navigation";

const ItemsSidebar = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Servicos",
    url: "/services",
    icon: Clock,
  },
  {
    title: "Agendamentos",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Clientes",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Configuracao",
    url: "#",
    icon: Settings,
  },
];

export default ItemsSidebar;

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    // TODO: Futuramente, aqui pode ser adicionada lógica para:
    // 1. Invalidar token JWT no backend
    // 2. Limpar dados sensíveis do localStorage
    // 3. Registrar evento de logout para auditoria
    logout();
  };

  return (
    <Sidebar
      side="left"
      className="border-r border-[#1c1f2a] bg-[#0f1116] text-white"
    >
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel className="px-5 py-4">
            <BrandLogo
              size={32}
              className="justify-start text-xl font-semibold tracking-tight"
              textClassName="text-white"
            />
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2 px-2 py-4">
              {ItemsSidebar.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-[#1a1f2c] hover:text-white data-[active=true]:bg-[#1f2635] data-[active=true]:text-white"
                    data-active={pathname === item.url}
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-[#1a1f2c] hover:text-white">
                  <User2 /> {user?.name || "Usuário"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Conta</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Faturamento</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
