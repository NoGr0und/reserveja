import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Eye } from "lucide-react";
import type { ServiceCard } from "./cards";

export type UpcomingAppointmentCard = {
  id: string;
  customerName: string;
  serviceName: string;
  scheduledFor: string | Date;
};

type BdashcardProps = {
  upcomingAppointments: UpcomingAppointmentCard[];
  services: ServiceCard[];
};

const formatDateTime = (value: string | Date) => {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

export function Bdashcard({ upcomingAppointments, services }: BdashcardProps) {
  const router = useRouter();

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-1 sm:p-6 lg:grid-cols-2">
      {" "}
      <Card className="flex min-h-64 w-full flex-col justify-start pt-6 pb-6">
        <CardHeader className="flex flex-col items-start space-y-0">
          <CardTitle className="flex justify-items-start text-sm font-medium">
            <p className="font-bold">Próximos Agendamentos</p>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <h1>Seus agendamentos para hoje</h1>
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>

        <CardContent className="flex flex-grow flex-col">
          <div className="flex flex-grow flex-col gap-3">
            {upcomingAppointments.length === 0 && (
              <div className="flex flex-grow items-center justify-center">
                <p className="text-muted-foreground text-center font-bold">
                  Nenhum Agendamento para Hoje
                </p>
              </div>
            )}

            {upcomingAppointments.length > 0 && (
              <ul className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="rounded-md border border-white/5 bg-muted/10 p-3"
                  >
                    <p className="text-sm font-semibold">
                      {appointment.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.serviceName} •{" "}
                      {formatDateTime(appointment.scheduledFor)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => router.push("/appointments")}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver Todos os Agendamentos
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="flex min-h-64 w-full flex-col justify-start pt-6 pb-6">
        <CardHeader className="flex flex-col items-start space-y-0">
          <CardTitle className="flex justify-items-start text-sm font-medium">
            <p className="font-bold">Meus Servicos</p>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <h1>Serviços que você oferece</h1>
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>

        <CardContent className="flex flex-grow flex-col">
          <div className="flex flex-grow flex-col gap-3">
            {services.length === 0 && (
              <div className="flex flex-grow items-center justify-center">
                <p className="text-muted-foreground text-center font-bold">
                  Nenhum serviço cadastrado
                </p>
              </div>
            )}

            {services.length > 0 && (
              <ul className="space-y-3">
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="rounded-md border border-white/5 bg-muted/10 p-3"
                  >
                    <p className="text-sm font-semibold">{service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {service.description || "Sem descrição"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => router.push("/services")}
            >
              <Eye className="mr-2 h-4 w-4" />
              Gerenciar Servicos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
