import { DataTable } from "@/components/ui/data_table";
import { CustomerColumns } from "./columns";
import { db } from "@/lib/prisma";

const CustomerPage = async () => {
  const Customers = await db.custumer.findMany();

  return (
    <div className="space-y-6 p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
      </div>

      <DataTable columns={CustomerColumns} data={Customers} />
    </div>
  );
};

export default CustomerPage;
