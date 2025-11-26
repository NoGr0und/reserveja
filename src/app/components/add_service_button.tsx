"use client";

import { useState } from "react";
import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ServiceType } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceTypeOptions } from "../_constants/services";
import type { ServiceCard } from "./cards";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "o Nome e Obrigatorio!",
  }),
  description: z.string().trim().min(1, {
    message: "a Descrição e Obrigatoria!",
  }),
  price: z.coerce
    .number({
      invalid_type_error: "Informe um número válido",
      required_error: "O valor é obrigatório",
    })
    .int("Insira apenas valores inteiros")
    .nonnegative("O valor precisa ser positivo"),
  type: z.nativeEnum(ServiceType, {
    required_error: "o Tipo e Obrigatorio!",
  }),
  durationValue: z.coerce
    .number({
      invalid_type_error: "Informe um número válido",
      required_error: "O tempo é obrigatório",
    })
    .int("Use apenas números inteiros")
    .positive("O tempo precisa ser maior que zero"),
  durationUnit: z.enum(["hours", "minutes"], {
    required_error: "Informe se o tempo é em horas ou minutos",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type AddServiceButtonProps = {
  onAdd?: (service: ServiceCard) => void;
};

const normalizeDuration = (value: number, unit: "hours" | "minutes") =>
  unit === "hours" ? value * 60 : value;

const AddServiceButton = ({ onAdd }: AddServiceButtonProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      type: ServiceType.ACTIVE,
      durationValue: 0,
      durationUnit: "hours",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user?.id) {
      return;
    }

    setIsSaving(true);
    const newService: ServiceCard = {
      id: globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID()
        : `service-${Date.now()}`,
      name: data.name,
      description: data.description,
      durationMinutes: normalizeDuration(data.durationValue, data.durationUnit),
      price: data.price,
      status: data.type,
    };

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: newService.name,
          description: newService.description,
          price: newService.price,
          type: newService.status,
          durationMinutes: newService.durationMinutes,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar serviço.");
      }

      const payload = await response.json();
      onAdd?.({
        ...newService,
        id: payload.service?.id ?? newService.id,
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-full bg-blue-500 font-bold text-white">
          Adicionar Servico <ArrowDownUpIcon className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Servico</DialogTitle>
          <DialogDescription>Insira as informacoes abaixo</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome..." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva o serviço..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="Digite o Valor..."
                      value={field.value === 0 ? "" : field.value || ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(value === "" ? 0 : Number(value));
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o Tipo da Transacao..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Tempo</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="durationValue"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          step={1}
                          placeholder="Tempo"
                          value={field.value === 0 ? "" : field.value || ""}
                          onChange={(event) => {
                            const value = event.target.value;
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationUnit"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Unidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hours">Horas</SelectItem>
                            <SelectItem value="minutes">Minutos</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceButton;
