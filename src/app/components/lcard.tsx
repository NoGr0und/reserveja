import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Calendar, CircleDollarSign, Clock, Users } from "lucide-react";

export type DashboardMetrics = {
  appointmentsToday: number;
  pendingToday: number;
  totalServices: number;
  activeServices: number;
  customersAttended: number;
  revenueTotal: number;
};

type DashcardsProps = {
  metrics: DashboardMetrics;
};

export function Dashcards({ metrics }: DashcardsProps) {
  return (
    <div className="grid items-center gap-4 p-4 sm:grid-cols-1 sm:p-6 md:grid-cols-2 lg:grid-cols-4">
      {" "}
      <Card className="w-full justify-center py-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Agendamentos Hoje
          </CardTitle>
          <CardDescription></CardDescription>
          <CardAction>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{metrics.appointmentsToday}</p>
        </CardContent>
        <CardFooter>{metrics.pendingToday} Pendencias</CardFooter>
      </Card>
      <Card className="w-full justify-center py-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Servicos
          </CardTitle>
          <CardDescription></CardDescription>
          <CardAction>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{metrics.totalServices}</p>
        </CardContent>
        <CardFooter>{metrics.activeServices} Ativos</CardFooter>
      </Card>
      <Card className="w-full justify-center py-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Clientes Atendidos
          </CardTitle>
          <CardDescription></CardDescription>
          <CardAction>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{metrics.customersAttended}</p>
        </CardContent>
        <CardFooter>{metrics.customersAttended} Cliente(s)</CardFooter>
      </Card>
      <Card className="w-full justify-center py-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <CardDescription></CardDescription>
          <CardAction>
            <CircleDollarSign className="text-muted-foreground h-4 w-4" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-700">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
            }).format(metrics.revenueTotal)}
          </p>
        </CardContent>
        <CardFooter>Servicos Comcluidos</CardFooter>
      </Card>
    </div>
  );
}
