"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data_table";
import { AppointmentColumns, type AppointmentRow } from "./_columns/columns";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Notificationbt } from "../components/notficationh";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [formValues, setFormValues] = useState({
    customerId: "",
    serviceId: "",
    scheduledFor: "",
  });

  useEffect(() => {
    if (!user?.id) {
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/appointments?userId=${user.id}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(
            payload?.message ?? "Não foi possível carregar os agendamentos.",
          );
        }

        const payload = (await response.json()) as {
          appointments: AppointmentRow[];
        };

        setAppointments(payload.appointments ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "Erro inesperado.");
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();

    return () => controller.abort();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const controller = new AbortController();

    const fetchOptions = async () => {
      try {
        const [custResp, servResp] = await Promise.all([
          fetch(`/api/customers?userId=${user.id}`, {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(`/api/services?userId=${user.id}`, {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);

        if (custResp.ok) {
          const custJson = await custResp.json();
          setCustomers(
            (custJson.customers ?? []).map((c: any) => ({ id: c.id, name: c.name })),
          );
        }
        if (servResp.ok) {
          const servJson = await servResp.json();
          setServices(
            (servJson.services ?? []).map((s: any) => ({ id: s.id, name: s.name })),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    };

    fetchOptions();
    return () => controller.abort();
  }, [user?.id]);

  const tableData = useMemo(() => appointments, [appointments]);

  const handleCreate = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/appointments?userId=${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: formValues.customerId,
          serviceId: formValues.serviceId,
          scheduledFor: formValues.scheduledFor,
        }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(json?.message || "Não foi possível criar o agendamento.");
      }

      if (json.appointment) {
        setAppointments((prev) => [json.appointment, ...prev]);
      }
      setIsModalOpen(false);
      setFormValues({ customerId: "", serviceId: "", scheduledFor: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado ao criar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <header>
        <Notificationbt />
      </header>

      <div className="space-y-6 p-6">
        <div className="">
          <p className="text-4xl font-bold">Agendamentos</p>
          <p className="text-muted-foreground text-sm">
            Visualize os clientes, serviços e horários solicitados.
          </p>
        </div>
        <div className="flex justify-end">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsModalOpen(true)}>Novo agendamento</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar agendamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select
                    value={formValues.customerId}
                    onValueChange={(val) => setFormValues((v) => ({ ...v, customerId: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Serviço</Label>
                  <Select
                    value={formValues.serviceId}
                    onValueChange={(val) => setFormValues((v) => ({ ...v, serviceId: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data e hora do serviço</Label>
                  <Input
                    type="datetime-local"
                    value={formValues.scheduledFor}
                    onChange={(e) =>
                      setFormValues((v) => ({ ...v, scheduledFor: e.target.value }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && <p>Carregando agendamentos...</p>}
        {error && !isLoading && <p className="text-sm text-red-500">{error}</p>}

        {!isLoading && !error && (
          <DataTable columns={AppointmentColumns} data={tableData} />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AppointmentsPage;
