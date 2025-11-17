import { ServiceType } from "@prisma/client";

export const serviceTypeOptions = [
  {
    label: "Ativo",
    value: ServiceType.ACTIVE,
  },
  {
    label: "Inativo",
    value: ServiceType.INACTIVE,
  },
];
