import { eq, and, isNull } from "drizzle-orm";
import { getDb, users, organizationMembers } from "@/db";
import { UnauthorizedError } from "@/common/errors";
import type { AuthContext } from "./authorization";
import type { UserRole } from "./types";

/**
 * Resolves the authenticated user and active organization context from request headers or credentials.
 * Throws UnauthorizedError (401) if unauthenticated or if membership in organization was revoked.
 */
export async function resolveAuthContext(
  headers: Headers | Record<string, string | undefined>,
  customDb = getDb(),
): Promise<AuthContext> {
  const getHeader = (key: string): string | undefined => {
    if ("get" in headers && typeof headers.get === "function") {
      return headers.get(key) || undefined;
    }
    return (headers as Record<string, string | undefined>)[key];
  };

  const authHeader = getHeader("authorization");
  const headerUserId = getHeader("x-user-id");
  const headerOrgId = getHeader("x-organization-id");

  let userId: string | undefined = headerUserId;

  // 1. Parse Bearer token if provided
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    // Support testing tokens format: "test_token_<userId>" or raw user ID
    if (token.startsWith("test_token_")) {
      userId = token.replace("test_token_", "");
    } else if (token.length > 0) {
      userId = userId || token;
    }
  }

  // 2. Reject if no valid identity identifier found
  if (!userId) {
    throw new UnauthorizedError("Authentication required: Missing or invalid credentials");
  }

  // Validate UUID syntax before querying database
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(userId)) {
    throw new UnauthorizedError("Authentication failed: Malformed credentials token");
  }

  // 3. Resolve user record from database
  const [userRecord] = await customDb
    .select()
    .from(users)
    .where(and(eq(users.id, userId), isNull(users.deleted_at)))
    .limit(1);

  if (!userRecord) {
    throw new UnauthorizedError(
      "Authentication failed: User account not found or has been deactivated",
    );
  }

  // 4. Resolve active organization membership
  let memberQuery = customDb
    .select()
    .from(organizationMembers)
    .where(
      and(eq(organizationMembers.user_id, userRecord.id), isNull(organizationMembers.deleted_at)),
    );

  if (headerOrgId) {
    memberQuery = customDb
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.user_id, userRecord.id),
          eq(organizationMembers.organization_id, headerOrgId),
          isNull(organizationMembers.deleted_at),
        ),
      );
  }

  const [membership] = await memberQuery.limit(1);

  if (!membership) {
    throw new UnauthorizedError(
      headerOrgId
        ? `Access denied: User is not an active member of organization '${headerOrgId}'`
        : "Access denied: User has no active organization memberships",
    );
  }

  return {
    user: {
      id: userRecord.id,
      email: userRecord.email,
      fullName: userRecord.full_name,
    },
    organizationId: membership.organization_id,
    role: membership.role as UserRole,
    membershipId: membership.id,
  };
}
