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
        const response = await fetch(
          `/api/dashboard?userId=${user.id}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Não foi possível carregar o dashboard.");
        }

        const payload = await response.json();
        setMetrics(payload.metrics);
        setUpcomingAppointments(payload.upcomingAppointments ?? []);
        setServices(payload.services ?? []);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
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
    </ProtectedRoute>
  );
};

export default Dashboard;
