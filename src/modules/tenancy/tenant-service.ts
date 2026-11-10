import crypto from "node:crypto";
import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod";
import { getDb, organizations, workspaces } from "@/db";
import { NotFoundError, ForbiddenError, ValidationError } from "@/common/errors";
import { assertCan, type AuthContext } from "@/modules/identity";
import type { OrganizationTenant, WorkspaceEnvironment, TenantStatus } from "./types";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  environmentType: z.enum(["production", "staging", "sandbox"]).default("sandbox"),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

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

  /**
   * Creates a new workspace environment with strict Zod validation and central assertCan() check.
   */
  async createWorkspace(
    context: AuthContext,
    input: unknown,
    customDb = getDb(),
  ): Promise<WorkspaceEnvironment> {
    assertCan(context, "workspace:create");

    const validated = createWorkspaceSchema.parse(input);
    const apiKeyPrefix = `mcv_${validated.environmentType}_${validated.slug.substring(0, 8)}_`;
    const rawSecret = crypto.randomBytes(24).toString("hex");
    const apiKeyHash = crypto.createHash("sha256").update(rawSecret).digest("hex");

    const [created] = await customDb
      .insert(workspaces)
      .values({
        organization_id: context.organizationId,
        name: validated.name,
        slug: validated.slug,
        environment_type: validated.environmentType,
        api_key_prefix: apiKeyPrefix,
        api_key_hash: apiKeyHash,
      })
      .returning();

    if (!created) {
      throw new Error("Failed to create workspace");
    }

    return {
      id: created.id,
      tenantId: created.organization_id,
      name: created.name,
      slug: created.slug,
      environmentType: created.environment_type as "production" | "staging" | "sandbox",
      apiKeyPrefix: created.api_key_prefix,
      createdAt: created.created_at.toISOString(),
    };
  }

  /**
   * Deletes a workspace with central assertCan() check and strict tenant isolation.
   */
  async deleteWorkspace(
    context: AuthContext,
    workspaceId: string,
    customDb = getDb(),
  ): Promise<{ deleted: boolean; id: string }> {
    if (!workspaceId) {
      throw new ValidationError("workspaceId is required");
    }

    const [ws] = await customDb
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.id, workspaceId), isNull(workspaces.deleted_at)))
      .limit(1);

    if (!ws) {
      throw new NotFoundError("Workspace", workspaceId);
    }

    // Central authorization assert:
    // Throws 404 if ws belongs to foreign organization (Anti-BOLA)
    // Throws 403 if role lacks permission
    assertCan(context, "workspace:delete", ws);

    await customDb
      .update(workspaces)
      .set({ deleted_at: new Date(), updated_at: new Date() })
      .where(eq(workspaces.id, ws.id));

    return { deleted: true, id: ws.id };
  }
}

export const tenancyService = new TenancyService();
