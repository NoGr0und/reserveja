"use client";

import { Custumer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const CustomerColumns: ColumnDef<Custumer>[] = [
  {
    accessorKey: "name",
    header: "Nome Do Cliente",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Numero",
  },
];
