"use client";

import { ColumnDef } from "@tanstack/react-table";

export type AppointmentRow = {
  id: string;
  customerName: string;
  serviceName: string;
  requestedAt: string;
  scheduledFor: string;
  status: string;
};

const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions,
) => {
  try {
    return new Intl.DateTimeFormat("pt-BR", options).format(
      new Date(dateString),
    );
  } catch {
    return "-";
  }
};

export const AppointmentColumns: ColumnDef<AppointmentRow>[] = [
  {
    accessorKey: "customerName",
    header: "Cliente",
  },
  {
    accessorKey: "serviceName",
    header: "Serviço",
  },
  {
    accessorKey: "requestedAt",
    header: "Horário do Pedido",
    cell: ({ getValue }) =>
      formatDate(getValue() as string, {
        dateStyle: "short",
        timeStyle: "short",
      }),
  },
  {
    accessorKey: "scheduledFor",
    header: "Dia do Serviço",
    cell: ({ getValue }) =>
      formatDate(getValue() as string, {
        dateStyle: "full",
      }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue, table, row }) => {
      const onEdit = (table.options.meta as any)?.onEdit as
        | ((appointment: AppointmentRow) => void)
        | undefined;
      const value = (getValue() as string) ?? "";
      const map: Record<string, { label: string; className: string }> = {
        CONFIRMED: { label: "Confirmado", className: "text-green-500" },
        PENDING: { label: "Pendente", className: "text-yellow-400" },
        CANCELLED: { label: "Cancelado", className: "text-red-500" },
      };
      const entry = map[value] ?? { label: value || "Pendente", className: "text-yellow-400" };
      return (
        <button
          type="button"
          onClick={() => onEdit?.(row.original)}
          className="underline-offset-2 hover:underline"
        >
          <span className={entry.className}>{entry.label}</span>
        </button>
      );
    },
  },
];
