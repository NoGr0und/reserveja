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
import { Clock, DollarSign, Pencil, Trash } from "lucide-react";

export function Cardser() {
  return (
    <div className="grid gap-5 p-6 lg:grid-cols-3">
      <Card className="w-130 justify-center py-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col">
            <CardTitle className="text-sm font-bold">Corte + Barba</CardTitle>
            <CardDescription>
              Corte de cabelo masculino + barba completa
            </CardDescription>
          </div>
          <CardAction>
            <Badge className="bg-green-500 text-white">Ativo</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex justify-between">
          <div className="flex">
            {" "}
            <Clock />
            <p>60 minutos</p>
          </div>
          <div className="flex">
            <DollarSign />
            <p>R$ 45.00</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {" "}
          <div>
            {" "}
            <Button variant="outline" className="mt-4 w-full bg-transparent">
              <Pencil />
              Gerenciar Servico
            </Button>
          </div>
          <div>
            {" "}
            <Button variant="outline" className="bg-transparent">
              <Trash className="text-red-600" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className="w-130 justify-center py-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col">
            <CardTitle className="text-sm font-bold">Corte Simples</CardTitle>
            <CardDescription>Corte de cabelo masculino</CardDescription>
          </div>
          <CardAction>
            <Badge className="bg-green-500 text-white">Ativo</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex justify-between">
          <div className="flex">
            {" "}
            <Clock />
            <p>30 minutos</p>
          </div>
          <div className="flex">
            <DollarSign />
            <p>R$ 25.00</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {" "}
          <div>
            {" "}
            <Button variant="outline" className="mt-4 w-full bg-transparent">
              <Pencil />
              Gerenciar Servico
            </Button>
          </div>
          <div>
            {" "}
            <Button variant="outline" className="bg-transparent">
              <Trash className="text-red-600" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
