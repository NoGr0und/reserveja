import { Notificationbt } from "@/app/components/notficationh";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Cardser } from "@/app/components/cards";
import AddServiceButton from "@/app/components/add_service_button";

const services = () => {
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
            <AddServiceButton />
          </div>
        </div>
      </header>
      <div>
        <Cardser />
      </div>
    </ProtectedRoute>
  );
};

export default services;
