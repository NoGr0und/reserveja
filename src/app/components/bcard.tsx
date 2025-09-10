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

export function Bdashcard() {
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
          <div className="flex flex-grow items-center justify-center">
            <p className="text-muted-foreground text-center font-bold">
              Nenhum Agendamento para Hoje
            </p>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full bg-transparent">
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
          <div className="flex flex-grow items-center justify-center">
            <p className="text-muted-foreground text-center font-bold">
              * Falta Adicionar o BD pra fazer esse
            </p>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full bg-transparent">
              <Eye className="mr-2 h-4 w-4" />
              Gerenciar Servicos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
