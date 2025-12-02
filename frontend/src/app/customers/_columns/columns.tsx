"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash, Pencil } from "lucide-react";

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  company: string;
};

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const CustomerColumns: ColumnDef<CustomerRow>[] = [
  {
    accessorKey: "name",
    header: "Nome do Cliente",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Número",
  },
  {
    accessorKey: "company",
    header: "Empresa",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      const isActive = value === "ACTIVE";
      return (
        <span className={isActive ? "text-green-600" : "text-red-500"}>
          {isActive ? "Ativo" : "Inativo"}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row, table }) => {
      const customer = row.original;
      const meta = table.options.meta as
        | { onEdit?: (customer: CustomerRow) => void; onDelete?: (id: string) => void }
        | undefined;

      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => meta?.onEdit?.(customer)}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => meta?.onDelete?.(customer.id)}
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
