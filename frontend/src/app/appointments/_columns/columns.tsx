"use client";

import { ColumnDef } from "@tanstack/react-table";

export type AppointmentRow = {
  id: string;
  customerName: string;
  serviceName: string;
  requestedAt: string;
  scheduledFor: string;
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
];
