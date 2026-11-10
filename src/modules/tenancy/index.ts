/**
 * Tenancy Module — Public Facade Interface
 */

export * from "./types";
export * from "./tenant-service";

export const tenancyModule = {
  name: "tenancy",
  description: "Multi-tenant organization lifecycle, workspace partitioning, and tenant boundaries",
} as const;
