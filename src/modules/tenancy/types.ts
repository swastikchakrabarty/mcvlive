/**
 * Tenancy Domain Model & Types
 */

export type TenantStatus = "active" | "suspended" | "provisioning";

export interface OrganizationTenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  domain?: string;
  createdAt: string;
  settings: {
    enforceMfa: boolean;
    allowedIpRanges?: string[];
    rateLimitRps: number;
  };
}

export interface WorkspaceEnvironment {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  environmentType: "production" | "staging" | "sandbox";
  apiKeyPrefix: string;
  createdAt: string;
}
