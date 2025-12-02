"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data_table";
import { CustomerColumns, type CustomerRow } from "./_columns/columns";
import { useAuth } from "@/contexts/AuthContext";
import { Notificationbt } from "../components/notficationh";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const CustomerPage = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRow | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

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

        const payload = (await response.json()) as { customers: CustomerRow[] };
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

  const resetForm = () => {
    setFormValues({
      name: "",
      email: "",
      phone: "",
      status: "ACTIVE",
    });
    setEditingCustomer(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (customer: CustomerRow) => {
    setEditingCustomer(customer);
    setFormValues({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);

    const payload = {
      ...formValues,
      id: editingCustomer?.id,
    };

    try {
      const method = editingCustomer ? "PUT" : "POST";
      const response = await fetch(`/api/customers?userId=${user.id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(json?.message || "Não foi possível salvar o cliente.");
      }

      if (editingCustomer) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...payload } : c)),
        );
      } else if (json.customer) {
        setCustomers((prev) => [...prev, json.customer]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar cliente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // TODO: implementar deleção (backend ainda não expõe DELETE)
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ProtectedRoute>
      <header>
        <Notificationbt />
      </header>
      <div className="space-y-6 p-6">
        <div className="">
          <p className="text-4xl font-bold">Clientes</p>
        </div>

        <div className="flex justify-between">
          {isLoading ? <p>Carregando clientes...</p> : <div />}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>Adicionar Cliente</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCustomer ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formValues.name}
                    onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formValues.email}
                    onChange={(e) => setFormValues((v) => ({ ...v, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Número</Label>
                  <Input
                    id="phone"
                    value={formValues.phone}
                    onChange={(e) => setFormValues((v) => ({ ...v, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formValues.status}
                    onValueChange={(val: "ACTIVE" | "INACTIVE") =>
                      setFormValues((v) => ({ ...v, status: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Ativo</SelectItem>
                      <SelectItem value="INACTIVE">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {error && !isLoading && <p className="text-sm text-red-500">{error}</p>}

        {!isLoading && !error && (
          <DataTable
            columns={CustomerColumns}
            data={tableData}
            meta={{ onEdit: openEdit, onDelete: handleDelete }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default CustomerPage;
