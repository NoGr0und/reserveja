"use client";

import { Button } from "@/components/ui/button";
import { Custumer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";

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
  {
    accessorKey: "actions",
    header: "",
    cell: () => {
      return (
        <div className="">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
