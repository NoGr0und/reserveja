"use client";

import { useState } from "react";
import { Notificationbt } from "@/app/components/notficationh";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Cardser, type ServiceCard } from "@/app/components/cards";
import AddServiceButton from "@/app/components/add_service_button";
const initialServices: ServiceCard[] = [];

const ServicesPage = () => {
  const [services, setServices] = useState<ServiceCard[]>(initialServices);

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
        <Cardser services={services} />
      </div>
    </ProtectedRoute>
  );
};

export default ServicesPage;
