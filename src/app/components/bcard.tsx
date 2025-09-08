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
    <div className="grid gap-6 p-6 lg:grid-cols-2">
      {" "}
      <Card className="flex h-90 min-h-64 flex-col justify-start pt-6 pb-6">
        <CardHeader className="flex flex-col items-start space-y-0">
          <CardTitle className="flex justify-items-start text-sm font-medium">
            <p className="font-bold">Próximos Agendamentos</p>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <h1>Seus agendamentos para hoje</h1>
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {" "}
            <p className="text-muted-foreground pt-15 text-center font-bold">
              Nenhum Agendamento para Hoje
            </p>
          </div>
          <div className="pt-17">
            {" "}
            <Button variant="outline" className="mt-4 w-full bg-transparent">
              <Eye />
              Ver Todos os Agendamentos
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="flex h-90 min-h-64 flex-col justify-start pt-6 pb-6">
        <CardHeader className="flex flex-col items-start space-y-0">
          <CardTitle className="flex justify-items-start text-sm font-medium">
            <p className="font-bold">Meus Servicos</p>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <h1>Serviços que você oferece</h1>
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {" "}
            <p className="text-muted-foreground pt-15 text-center font-bold">
              * Falta Adicionar o BD pra fazer esse
            </p>
          </div>
          <div className="pt-17">
            {" "}
            <Button variant="outline" className="mt-4 w-full bg-transparent">
              <Eye />
              Gerenciar Servicos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
