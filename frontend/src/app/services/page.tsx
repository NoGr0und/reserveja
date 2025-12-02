"use client";

import { useEffect, useState } from "react";
import { Notificationbt } from "@/app/components/notficationh";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Cardser, type ServiceCard } from "@/app/components/cards";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddServiceButton from "@/app/components/add_service_button";
import { useAuth } from "@/contexts/AuthContext";
const initialServices: ServiceCard[] = [];

const ServicesPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<ServiceCard[]>(initialServices);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceCard | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceCard | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  const handleSaveService = (savedService: ServiceCard) => {
    setServices((prevServices) => {
      const existingServiceIndex = prevServices.findIndex(
        (s) => s.id === savedService.id,
      );
      // Se o serviço já existe, atualiza ele na lista
      if (existingServiceIndex > -1) {
        const updatedServices = [...prevServices];
        updatedServices[existingServiceIndex] = savedService;
        return updatedServices;
      }
      // Se for um novo serviço, adiciona no início da lista
      return [savedService, ...prevServices];
    });
    setServiceToEdit(null); // Limpa o estado de edição após salvar
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    const response = await fetch(`/api/services?id=${serviceToDelete.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove o serviço da lista no estado local
      setServices((prevServices) =>
        prevServices.filter((s) => s.id !== serviceToDelete.id),
      );
    } else {
      console.error("Falha ao excluir o serviço."); // Tratar erro (ex: mostrar uma notificação)
    }
    setIsDeleteDialogOpen(false);
    setServiceToDelete(null);
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
            <AddServiceButton
              serviceToEdit={serviceToEdit}
              onSave={handleSaveService}
              onOpenChange={(isOpen) => {
                if (!isOpen) setServiceToEdit(null); // Limpa o estado de edição ao fechar o modal
              }}
            />
          </div>
        </div>
      </header>
      <div>
        {isLoading && (
          <p className="text-muted-foreground p-6 text-sm">
            Carregando serviços...
          </p>
        )}
        {error && !isLoading && (
          <p className="p-6 text-sm text-red-500">{error}</p>
        )}
        {!isLoading && !error && (
          <Cardser
            services={services}
            onEdit={setServiceToEdit} // Passa a função para definir o serviço a ser editado
            onDelete={(serviceId) => {
              // Abre o diálogo de confirmação para exclusão
              const service = services.find((s) => s.id === serviceId);
              if (service) {
                setServiceToDelete(service);
                setIsDeleteDialogOpen(true);
              }
            }}
          />
        )}
      </div>

      {/* Dialog de confirmação para exclusão */}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              serviço &quot;{serviceToDelete?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setServiceToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
};

export default ServicesPage;
