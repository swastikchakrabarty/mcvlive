import { ForbiddenError, NotFoundError } from "@/common/errors";
import type { UserRole } from "./types";

export type Action =
  // Organization actions
  | "organization:read"
  | "organization:update"
  | "organization:delete"
  | "organization:transfer_ownership"
  // Team & Member actions
  | "member:read"
  | "member:invite"
  | "member:update_role"
  | "member:remove"
  | "member:leave"
  // Workspace actions
  | "workspace:read"
  | "workspace:create"
  | "workspace:update"
  | "workspace:delete"
  // Quote & Sales actions
  | "quote:read"
  | "quote:create"
  | "quote:accept"
  // License actions
  | "license:read"
  | "license:provision"
  | "license:revoke"
  // Storage actions
  | "storage:read"
  | "storage:upload"
  | "storage:delete"
  // Billing actions
  | "billing:read"
  | "billing:manage"
  // Audit log actions
  | "audit_log:read";

export interface TenantResource {
  id?: string;
  organization_id?: string;
  organizationId?: string;
  [key: string]: unknown;
}

export interface AuthContext {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  organizationId: string;
  role: UserRole;
  membershipId: string;
}

/**
 * Static Role Permissions Matrix as defined in docs/permissions.md
 */
const ROLE_PERMISSIONS: Record<UserRole, ReadonlySet<Action>> = {
  owner: new Set<Action>([
    "organization:read",
    "organization:update",
    "organization:delete",
    "organization:transfer_ownership",
    "member:read",
    "member:invite",
    "member:update_role",
    "member:remove",
    "member:leave",
    "workspace:read",
    "workspace:create",
    "workspace:update",
    "workspace:delete",
    "quote:read",
    "quote:create",
    "quote:accept",
    "license:read",
    "license:provision",
    "license:revoke",
    "storage:read",
    "storage:upload",
    "storage:delete",
    "billing:read",
    "billing:manage",
    "audit_log:read",
  ]),

  admin: new Set<Action>([
    "organization:read",
    "organization:update",
    "member:read",
    "member:invite",
    "member:update_role",
    "member:remove",
    "member:leave",
    "workspace:read",
    "workspace:create",
    "workspace:update",
    "workspace:delete",
    "quote:read",
    "quote:create",
    "quote:accept",
    "license:read",
    "license:provision",
    "storage:read",
    "storage:upload",
    "storage:delete",
    "billing:read",
    "audit_log:read",
  ]),

  member: new Set<Action>([
    "organization:read",
    "member:read",
    "member:leave",
    "workspace:read",
    "workspace:create",
    "workspace:update",
    "quote:read",
    "license:read",
    "storage:read",
    "storage:upload",
  ]),

  viewer: new Set<Action>([
    "organization:read",
    "member:read",
    "member:leave",
    "workspace:read",
    "quote:read",
    "license:read",
    "storage:read",
  ]),
};

/**
 * Checks whether the given context has permission to perform an action on a resource.
 * Enforces both role permissions and strict organization boundary checks.
 */
export function can(
  context: AuthContext,
  action: Action,
  resource?: TenantResource | string,
): boolean {
  if (!context || !context.role || !context.organizationId) {
    return false;
  }

  // 1. Role capability check
  const permissions = ROLE_PERMISSIONS[context.role];
  if (!permissions || !permissions.has(action)) {
    return false;
  }

  // 2. Object-level tenant scoping check (BOLA / IDOR protection)
  if (resource && typeof resource === "object") {
    const resourceOrgId = resource.organization_id || resource.organizationId;
    if (resourceOrgId && resourceOrgId !== context.organizationId) {
      return false;
    }
  }

  return true;
}

/**
 * Asserts authorization, throwing the appropriate error:
 * - Throws 404 (NotFoundError) if the target object belongs to a foreign organization (Anti-BOLA/IDOR).
 * - Throws 403 (ForbiddenError) if the user is authenticated in the organization but lacks the permission.
 */
export function assertCan(
  context: AuthContext,
  action: Action,
  resource?: TenantResource | string,
): void {
  if (!context || !context.user) {
    throw new ForbiddenError("Unauthenticated: Active session is missing");
  }

  // 1. BOLA / IDOR Defense Check:
  // If target resource belongs to another organization, NEVER return 403 (which leaks existence).
  // Return 404 NotFoundError immediately.
  if (resource && typeof resource === "object") {
    const resourceOrgId = resource.organization_id || resource.organizationId;
    if (resourceOrgId && resourceOrgId !== context.organizationId) {
      const resourceName = typeof resource.name === "string" ? resource.name : "Resource";
      throw new NotFoundError(resourceName, resource.id);
    }
  }

  // 2. Permission capability check:
  if (!can(context, action, resource)) {
    throw new ForbiddenError(
      `Access denied: User with role '${context.role}' is not authorized to perform '${action}'`,
    );
  }
}
