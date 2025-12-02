export type ServiceStatus = "ACTIVE" | "INACTIVE";

export const serviceTypeOptions = [
  {
    label: "Ativo",
    value: "ACTIVE" as ServiceStatus,
  },
  {
    label: "Inativo",
    value: "INACTIVE" as ServiceStatus,
  },
];
