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
  MousePointer2,
  Settings,
  User2,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ItemsSidebar = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Servicos",
    url: "/dashboard/services",
    icon: Clock,
  },
  {
    title: "Agendamentos",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Clientes",
    url: "#",
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
  return (
    <Sidebar side="left">
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary p-4 text-center text-3xl font-bold">
            <div className="flex items-center justify-center gap-2">
              <MousePointer2 className="text-blue-600" />
              <span>Reserve Ja</span>
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-4">
              {ItemsSidebar.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
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
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
