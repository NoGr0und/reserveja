import { db } from "../lib/prisma";

export async function listCustomersByUser(userId: string) {
  return db.custumer.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}
