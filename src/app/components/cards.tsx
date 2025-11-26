import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ServiceType } from "@prisma/client";
import { Clock, DollarSign, Pencil, Trash } from "lucide-react";

export type ServiceCard = {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  status: ServiceType;
};

type CardserProps = {
  services?: ServiceCard[];
};

const getDurationLabel = (durationMinutes: number) => {
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return "Tempo não informado";
  }

  if (durationMinutes % 60 === 0) {
    return `${durationMinutes / 60} ${durationMinutes === 60 ? "hora" : "horas"}`;
  }

  return `${durationMinutes} minutos`;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

export function Cardser({ services = [] }: CardserProps) {
  if (!services.length) {
    return (
      <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center">
        Nenhum serviço cadastrado ainda. Use o botão &quot;Adicionar
        Serviço&quot; para criar um novo.
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-1 sm:p-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id} className="w-full justify-center py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex flex-col">
              <CardTitle className="text-sm font-bold">
                {service.name}
              </CardTitle>
              <CardDescription>
                {service.description || "Sem descrição disponível"}
              </CardDescription>
            </div>
            <CardAction>
              <Badge
                className={
                  service.status === ServiceType.ACTIVE
                    ? "bg-green-500 text-white"
                    : "bg-red-400 text-white"
                }
              >
                {service.status === ServiceType.ACTIVE ? "Ativo" : "Inativo"}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <p className="text-sm">
                {getDurationLabel(service.durationMinutes)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <p className="text-sm font-semibold">
                {formatCurrency(service.price)}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Pencil className="mr-2 h-4 w-4" />
              Gerenciar Serviço
            </Button>
            <Button
              variant="outline"
              className="flex-shrink-0 bg-transparent px-3"
            >
              <Trash className="h-4 w-4 text-red-600" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
