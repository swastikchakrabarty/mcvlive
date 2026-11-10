/**
 * Tenancy Module — Public Facade Interface
 */

export * from "./types";

export interface TenancyService {
  getTenantById(tenantId: string): Promise<import("./types").OrganizationTenant | null>;
  listWorkspaces(tenantId: string): Promise<import("./types").WorkspaceEnvironment[]>;
}

export const tenancyModule = {
  name: "tenancy",
  description: "Multi-tenant organization lifecycle, workspace partitioning, and tenant boundaries",
} as const;
