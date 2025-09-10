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
    <div className="grid gap-4 p-4 sm:grid-cols-1 sm:p-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="w-full justify-center py-4">
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
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <p className="text-sm">60 minutos</p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <p className="text-sm font-semibold">R$ 45.00</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" className="flex-1 bg-transparent">
            <Pencil className="mr-2 h-4 w-4" />
            Gerenciar Servico
          </Button>
          <Button
            variant="outline"
            className="flex-shrink-0 bg-transparent px-3"
          >
            <Trash className="h-4 w-4 text-red-600" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="w-full justify-center py-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col">
            <CardTitle className="text-sm font-bold">Corte Simples</CardTitle>
            <CardDescription>Corte de cabelo masculino</CardDescription>
          </div>
          <CardAction>
            <Badge className="bg-green-500 text-white">Ativo</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <p className="text-sm">30 minutos</p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <p className="text-sm font-semibold">R$ 25.00</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" className="flex-1 bg-transparent">
            <Pencil className="mr-2 h-4 w-4" />
            Gerenciar Servico
          </Button>
          <Button
            variant="outline"
            className="flex-shrink-0 bg-transparent px-3"
          >
            <Trash className="h-4 w-4 text-red-600" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
