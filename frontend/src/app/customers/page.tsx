"use client";

import { useEffect, useMemo, useState } from "react";
import type { Custumer } from "@prisma/client";
import { DataTable } from "@/components/ui/data_table";
import { CustomerColumns } from "./_columns/columns";
import { useAuth } from "@/contexts/AuthContext";
import { Notificationbt } from "../components/notficationh";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const CustomerPage = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Custumer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setCustomers([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/customers?userId=${user.id}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(
            payload?.message ?? "Não foi possível carregar os clientes.",
          );
        }

        const payload = (await response.json()) as { customers: Custumer[] };
        setCustomers(payload.customers ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "Erro inesperado.");
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();

    return () => controller.abort();
  }, [user?.id]);

  const tableData = useMemo(() => customers, [customers]);

  return (
    <ProtectedRoute>
      <header>
        <Notificationbt />
      </header>
      <div className="space-y-6 p-6">
        <div className="">
          <p className="text-4xl font-bold">Clientes</p>
        </div>

        {isLoading && <p>Carregando clientes...</p>}
        {error && !isLoading && <p className="text-sm text-red-500">{error}</p>}

        {!isLoading && !error && (
          <DataTable columns={CustomerColumns} data={tableData} />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default CustomerPage;
