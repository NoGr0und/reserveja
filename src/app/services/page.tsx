"use client";

import { useEffect, useState } from "react";
import { Notificationbt } from "@/app/components/notficationh";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Cardser, type ServiceCard } from "@/app/components/cards";
import AddServiceButton from "@/app/components/add_service_button";
import { useAuth } from "@/contexts/AuthContext";
const initialServices: ServiceCard[] = [];

const ServicesPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<ServiceCard[]>(initialServices);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/services?userId=${user.id}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar os serviços.");
        }

        const payload = await response.json();
        setServices(payload.services ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Erro ao carregar serviços.");
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();

    return () => controller.abort();
  }, [user?.id]);

  const handleAddService = (service: ServiceCard) => {
    setServices((prev) => [service, ...prev]);
  };

  return (
    <ProtectedRoute>
      <header>
        <Notificationbt />
        <div className="flex items-center justify-between p-6">
          {" "}
          <div className="">
            <p className="text-4xl font-bold">Meus Servicos</p>
            <h1 className="text-muted-foreground">
              Gerencie os serviços que você oferece
            </h1>
          </div>
          <div>
            <AddServiceButton onAdd={handleAddService} />
          </div>
        </div>
      </header>
      <div>
        {isLoading && (
          <p className="p-6 text-sm text-muted-foreground">
            Carregando serviços...
          </p>
        )}
        {error && !isLoading && (
          <p className="p-6 text-sm text-red-500">{error}</p>
        )}
        {!isLoading && !error && <Cardser services={services} />}
      </div>
    </ProtectedRoute>
  );
};

export default ServicesPage;
