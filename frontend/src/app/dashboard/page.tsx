 "use client";

import { useEffect, useState } from "react";
import { Dashcards, type DashboardMetrics } from "../components/lcard";
import {
  Bdashcard,
  type UpcomingAppointmentCard,
} from "../components/bcard";
import { Notificationbt } from "../components/notficationh";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AddServiceButton from "../components/add_service_button";
import { useAuth } from "@/contexts/AuthContext";
import type { ServiceCard } from "../components/cards";

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    appointmentsToday: 0,
    pendingToday: 0,
    totalServices: 0,
    activeServices: 0,
    customersAttended: 0,
    revenueTotal: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    UpcomingAppointmentCard[]
  >([]);
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        setError(null);
        const response = await fetch(
          `/api/dashboard?userId=${user.id}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(
            payload?.message ?? "Não foi possível carregar o dashboard.",
          );
        }

        const payload = await response.json();
        setMetrics(payload.metrics);
        setUpcomingAppointments(payload.upcomingAppointments ?? []);
        setServices(payload.services ?? []);

        // Garantir que a lista de serviços está atualizada (fallback na rota dedicada)
        const servicesResp = await fetch(`/api/services?userId=${user.id}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        if (servicesResp.ok) {
          const servicesJson = await servicesResp.json();
          setServices(servicesJson.services ?? payload.services ?? []);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Erro ao carregar dashboard:", error);
        setError("Não foi possível carregar o dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();

    return () => controller.abort();
  }, [user?.id]);

  return (
    <ProtectedRoute>
      <header>
        <Notificationbt />
        <div className="flex items-center justify-between p-6">
          {" "}
          <div className="">
            <p className="text-4xl font-bold">Dashboard</p>
            <h1 className="text-muted-foreground">Bem-Vindo</h1>
          </div>
          <div>
            <AddServiceButton />
          </div>
        </div>
      </header>

      <div>
        <div>
          <Dashcards metrics={metrics} />
          <Bdashcard
            upcomingAppointments={upcomingAppointments}
            services={services}
          />
        </div>
        <div></div>
      </div>
      {isLoading && (
        <div className="p-6 text-sm text-muted-foreground">
          Atualizando dados do dashboard...
        </div>
      )}
      {error && !isLoading && (
        <div className="p-6 text-sm text-red-500">{error}</div>
      )}
    </ProtectedRoute>
  );
};

export default Dashboard;
