"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data_table";
import { AppointmentColumns, type AppointmentRow } from "./_columns/columns";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Notificationbt } from "../components/notficationh";

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const tableData = useMemo(() => appointments, [appointments]);

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
