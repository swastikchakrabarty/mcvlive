import { eq, and, isNull } from "drizzle-orm";
import { getDb, organizations, workspaces } from "@/db";
import { NotFoundError, ForbiddenError, ValidationError } from "@/common/errors";
import type { OrganizationTenant, WorkspaceEnvironment, TenantStatus } from "./types";

export class TenancyService {
  /**
   * Retrieves an organization details with strict tenant caller verification
   */
  async getTenantById(
    tenantId: string,
    callerTenantId?: string,
    customDb = getDb(),
  ): Promise<OrganizationTenant> {
    if (!tenantId) {
      throw new ValidationError("tenantId is required");
    }

    if (callerTenantId && callerTenantId !== tenantId) {
      throw new ForbiddenError(
        "Cross-tenant access violation: Caller cannot access foreign organization",
      );
    }

    const [org] = await customDb
      .select()
      .from(organizations)
      .where(and(eq(organizations.id, tenantId), isNull(organizations.deleted_at)))
      .limit(1);

    if (!org) {
      throw new NotFoundError("Organization", tenantId);
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      status: org.status as TenantStatus,
      domain: org.domain || undefined,
      createdAt: org.created_at.toISOString(),
      settings: {
        enforceMfa: true,
        rateLimitRps: 100,
      },
    };
  }

  /**
   * Lists workspaces strictly isolated to the specified tenant
   */
  async listWorkspaces(tenantId: string, customDb = getDb()): Promise<WorkspaceEnvironment[]> {
    if (!tenantId) {
      throw new ValidationError("tenantId is required");
    }

    const records = await customDb
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.organization_id, tenantId), isNull(workspaces.deleted_at)));

    return records.map((w) => ({
      id: w.id,
      tenantId: w.organization_id,
      name: w.name,
      slug: w.slug,
      environmentType: w.environment_type as "production" | "staging" | "sandbox",
      apiKeyPrefix: w.api_key_prefix,
      createdAt: w.created_at.toISOString(),
    }));
  }

  /**
   * Retrieves a single workspace, strictly enforcing tenant ownership
   */
  async getWorkspaceById(
    tenantId: string,
    workspaceId: string,
    customDb = getDb(),
  ): Promise<WorkspaceEnvironment> {
    if (!tenantId || !workspaceId) {
      throw new ValidationError("Both tenantId and workspaceId are required");
    }

    const [ws] = await customDb
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.id, workspaceId), isNull(workspaces.deleted_at)))
      .limit(1);

    // If workspace does not exist or belongs to another tenant, throw NotFoundError to prevent information leakage
    if (!ws || ws.organization_id !== tenantId) {
      throw new NotFoundError("Workspace", workspaceId);
    }

    return {
      id: ws.id,
      tenantId: ws.organization_id,
      name: ws.name,
      slug: ws.slug,
      environmentType: ws.environment_type as "production" | "staging" | "sandbox",
      apiKeyPrefix: ws.api_key_prefix,
      createdAt: ws.created_at.toISOString(),
    };
  }
}

export const tenancyService = new TenancyService();
