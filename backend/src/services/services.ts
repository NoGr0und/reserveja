import { ServiceType } from "@prisma/client";
import { db } from "../lib/prisma";

type UpsertServiceInput = {
  id?: string;
  userId: string;
  name: string;
  description?: string | null;
  price: number;
  type: ServiceType;
  durationMinutes: number;
};

export async function listServicesByUser(userId: string) {
  return db.service.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createService(input: UpsertServiceInput) {
  return db.service.create({
    data: {
      userId: input.userId,
      name: input.name,
      description: input.description,
      price: input.price,
      type: input.type,
      durationMinutes: input.durationMinutes,
      time: new Date(),
    },
  });
}

export async function updateService(input: UpsertServiceInput & { id: string }) {
  return db.service.update({
    where: { id: input.id, userId: input.userId },
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      type: input.type,
      durationMinutes: input.durationMinutes,
    },
  });
}

export async function deleteService(id: string) {
  await db.service.delete({ where: { id } });
}
