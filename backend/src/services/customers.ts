import { db } from "../lib/prisma";

type CustomerDTO = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  company: string;
};

const isSuperAdmin = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user?.email) return false;
  const superEmail = process.env.SUPERADMIN_EMAIL;
  return superEmail ? user.email === superEmail : false;
};

export async function listCustomersByUser(requestingUserId: string) {
  const superAdmin = await isSuperAdmin(requestingUserId);

  const customers = await db.custumer.findMany({
    where: superAdmin ? {} : { userId: requestingUserId },
    include: {
      user: { select: { company: true } },
    },
    orderBy: { name: "asc" },
  });

  return customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    company: customer.user?.company ?? "—",
  })) as CustomerDTO[];
}

export async function createCustomer(
  requestingUserId: string,
  data: { name: string; email: string; phone: string; status?: "ACTIVE" | "INACTIVE" },
) {
  const superAdmin = await isSuperAdmin(requestingUserId);
  const targetUserId = superAdmin ? requestingUserId : requestingUserId;

  return db.custumer.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status ?? "ACTIVE",
      userId: targetUserId,
    },
  });
}

export async function updateCustomer(
  requestingUserId: string,
  data: { id: string; name: string; email: string; phone: string; status: "ACTIVE" | "INACTIVE" },
) {
  const superAdmin = await isSuperAdmin(requestingUserId);

  const existing = await db.custumer.findUnique({
    where: { id: data.id },
    select: { userId: true },
  });

  if (!existing) {
    throw new Error("CLIENT_NOT_FOUND");
  }

  if (!superAdmin && existing.userId !== requestingUserId) {
    throw new Error("FORBIDDEN");
  }

  return db.custumer.update({
    where: { id: data.id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
    },
  });
}
