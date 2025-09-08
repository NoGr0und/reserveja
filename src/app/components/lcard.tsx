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

export function Dashcards() {
  return (
    <div className="grid items-center gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
      {" "}
      <Card className="w-95 justify-center py-4">
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
          <p className="text-3xl font-bold text-blue-500">0</p>
        </CardContent>
        <CardFooter>0 Pendencias</CardFooter>
      </Card>
      <Card className="w-95 justify-center py-4">
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
          <p className="text-3xl font-bold text-blue-500">2</p>
        </CardContent>
        <CardFooter>2 Ativos</CardFooter>
      </Card>
      <Card className="w-95 justify-center py-4">
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
          <p className="text-3xl font-bold text-blue-500">1</p>
        </CardContent>
        <CardFooter>1 Cliente</CardFooter>
      </Card>
      <Card className="w-95 justify-center py-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <CardDescription></CardDescription>
          <CardAction>
            <CircleDollarSign className="text-muted-foreground h-4 w-4" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-500">R$ 0,00</p>
        </CardContent>
        <CardFooter>Servicos Comcluidos</CardFooter>
      </Card>
    </div>
  );
}
