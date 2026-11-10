import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb, closeDbPool, workspaces, invitations } from "@/db";
import { runSeed } from "@/db/seed";
import {
  can,
  assertCan,
  resolveAuthContext,
  teamService,
  type AuthContext,
  type Action,
} from "@/modules/identity";
import { UnauthorizedError, ForbiddenError, NotFoundError, ValidationError } from "@/common/errors";
import {
  GET as getWorkspaceRoute,
  DELETE as deleteWorkspaceRoute,
} from "@/app/api/workspaces/[id]/route";
import { GET as getMembersRoute } from "@/app/api/team/members/route";
import { eq, and, isNull } from "drizzle-orm";

describe("Layer 4: Authentication, RBAC & Central Authorization Tests", () => {
  let seeded: Awaited<ReturnType<typeof runSeed>>;
  const db = getDb();

  let org1OwnerContext: AuthContext;
  let org1AdminContext: AuthContext;
  let org1MemberContext: AuthContext;
  let org2ViewerContext: AuthContext;

  beforeAll(async () => {
    seeded = await runSeed(db);

    const org1Id = seeded.org1.org.id;
    const org2Id = seeded.org2.org.id;

    // Org 1 Users
    const u1_owner = seeded.org1.users[0]!;
    const u1_admin = seeded.org1.users[1]!;
    const u1_member = seeded.org1.users[2]!;

    // Org 2 Users
    const u2_viewer = seeded.org2.users[2]!;

    org1OwnerContext = await resolveAuthContext(
      { "x-user-id": u1_owner.id, "x-organization-id": org1Id },
      db,
    );
    org1AdminContext = await resolveAuthContext(
      { "x-user-id": u1_admin.id, "x-organization-id": org1Id },
      db,
    );
    org1MemberContext = await resolveAuthContext(
      { "x-user-id": u1_member.id, "x-organization-id": org1Id },
      db,
    );
    org2ViewerContext = await resolveAuthContext(
      { "x-user-id": u2_viewer.id, "x-organization-id": org2Id },
      db,
    );
  });

  afterAll(async () => {
    await closeDbPool();
  });

  // ===========================================================================
  // 1. UNAUTHENTICATED REQUESTS RECEIVE HTTP 401
  // ===========================================================================
  describe("Authentication Guard & Session Extraction (401)", () => {
    it("should reject requests missing credentials with UnauthorizedError (401)", async () => {
      await expect(resolveAuthContext({}, db)).rejects.toThrow(UnauthorizedError);
    });

    it("should reject invalid/non-existent user tokens with UnauthorizedError (401)", async () => {
      await expect(
        resolveAuthContext({ authorization: "Bearer invalid_non_existent_token" }, db),
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should return HTTP 401 from route handler when unauthenticated", async () => {
      const dummyReq = new Request("http://localhost:3000/api/team/members", {
        headers: {},
      });
      const res = await getMembersRoute(dummyReq);
      expect(res.status).toBe(401);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("UNAUTHORIZED");
    });
  });

  // ===========================================================================
  // 2. CENTRAL AUTHORIZATION `can()` & `assertCan()` RBAC CHECKS
  // ===========================================================================
  describe("Central Authorization Helper `can()` & Matrix Compliance", () => {
    it("Owner should have full capabilities across all resources", () => {
      const actions: Action[] = [
        "organization:read",
        "organization:update",
        "organization:delete",
        "organization:transfer_ownership",
        "member:read",
        "member:invite",
        "member:update_role",
        "member:remove",
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
      ];

      for (const action of actions) {
        expect(can(org1OwnerContext, action)).toBe(true);
      }
    });

    it("Admin can manage workspaces and team invites, but cannot transfer ownership or delete organization", () => {
      expect(can(org1AdminContext, "workspace:create")).toBe(true);
      expect(can(org1AdminContext, "workspace:delete")).toBe(true);
      expect(can(org1AdminContext, "member:invite")).toBe(true);
      expect(can(org1AdminContext, "member:update_role")).toBe(true);
      expect(can(org1AdminContext, "billing:read")).toBe(true);

      // Disallowed actions for Admin
      expect(can(org1AdminContext, "organization:transfer_ownership")).toBe(false);
      expect(can(org1AdminContext, "organization:delete")).toBe(false);
      expect(can(org1AdminContext, "license:revoke")).toBe(false);
      expect(can(org1AdminContext, "billing:manage")).toBe(false);
    });

    it("Member can deploy workspaces and upload storage, but cannot delete workspaces or invite members", () => {
      expect(can(org1MemberContext, "workspace:read")).toBe(true);
      expect(can(org1MemberContext, "workspace:create")).toBe(true);
      expect(can(org1MemberContext, "workspace:update")).toBe(true);
      expect(can(org1MemberContext, "storage:upload")).toBe(true);

      // Disallowed actions for Member
      expect(can(org1MemberContext, "workspace:delete")).toBe(false);
      expect(can(org1MemberContext, "member:invite")).toBe(false);
      expect(can(org1MemberContext, "member:remove")).toBe(false);
      expect(can(org1MemberContext, "billing:read")).toBe(false);
    });

    it("Viewer has strict read-only access and zero mutating capabilities", () => {
      expect(can(org2ViewerContext, "workspace:read")).toBe(true);
      expect(can(org2ViewerContext, "storage:read")).toBe(true);
      expect(can(org2ViewerContext, "quote:read")).toBe(true);

      // Disallowed actions for Viewer
      expect(can(org2ViewerContext, "workspace:create")).toBe(false);
      expect(can(org2ViewerContext, "workspace:update")).toBe(false);
      expect(can(org2ViewerContext, "workspace:delete")).toBe(false);
      expect(can(org2ViewerContext, "storage:upload")).toBe(false);
      expect(can(org2ViewerContext, "storage:delete")).toBe(false);
      expect(can(org2ViewerContext, "member:invite")).toBe(false);
      expect(can(org2ViewerContext, "billing:read")).toBe(false);
    });

    it("assertCan should throw ForbiddenError (403) when user lacks permissions", () => {
      expect(() => assertCan(org1MemberContext, "workspace:delete")).toThrow(ForbiddenError);
      expect(() => assertCan(org2ViewerContext, "storage:upload")).toThrow(ForbiddenError);
      expect(() => assertCan(org1AdminContext, "organization:transfer_ownership")).toThrow(
        ForbiddenError,
      );
    });
  });

  // ===========================================================================
  // 3. BROKEN OBJECT-LEVEL AUTHORIZATION (BOLA/IDOR) & CROSS-TENANT LEAK DEFENSE
  // ===========================================================================
  describe("Anti-BOLA/IDOR & Cross-Tenant Resource Isolation (404 Not Found)", () => {
    it("assertCan must throw NotFoundError (404) when targeting a resource from a foreign organization", () => {
      const foreignWorkspace = {
        id: "ws_foreign_999",
        name: "Foreign Production",
        organization_id: seeded.org2.org.id, // Belongs to Org 2
      };

      // Org 1 Owner targeting Org 2's workspace:
      // Even though Org 1 Owner has 'workspace:delete' role permission,
      // it MUST throw NotFoundError (404) to avoid leaking existence of Org 2's asset.
      expect(() => assertCan(org1OwnerContext, "workspace:delete", foreignWorkspace)).toThrow(
        NotFoundError,
      );
      expect(() => assertCan(org1OwnerContext, "workspace:read", foreignWorkspace)).toThrow(
        NotFoundError,
      );
    });

    it("Direct API call altering foreign resource ID across tenant boundaries returns HTTP 404", async () => {
      const org2WorkspaceId = (
        await db
          .select()
          .from(workspaces)
          .where(
            and(eq(workspaces.organization_id, seeded.org2.org.id), isNull(workspaces.deleted_at)),
          )
          .limit(1)
      )[0]!.id;

      // Org 1 Owner sends DELETE /api/workspaces/[org2WorkspaceId]
      const request = new Request(`http://localhost:3000/api/workspaces/${org2WorkspaceId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": org1OwnerContext.user.id,
          "x-organization-id": org1OwnerContext.organizationId,
        },
      });

      const response = await deleteWorkspaceRoute(request, {
        params: Promise.resolve({ id: org2WorkspaceId }),
      });

      // Must return 404 (NOT 403, preventing resource enumeration)
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("NOT_FOUND");
    });

    it("Direct API call reading foreign resource ID across tenant boundaries returns HTTP 404", async () => {
      const org2WorkspaceId = (
        await db
          .select()
          .from(workspaces)
          .where(
            and(eq(workspaces.organization_id, seeded.org2.org.id), isNull(workspaces.deleted_at)),
          )
          .limit(1)
      )[0]!.id;

      // Org 1 Member sends GET /api/workspaces/[org2WorkspaceId]
      const request = new Request(`http://localhost:3000/api/workspaces/${org2WorkspaceId}`, {
        method: "GET",
        headers: {
          "x-user-id": org1MemberContext.user.id,
          "x-organization-id": org1MemberContext.organizationId,
        },
      });

      const response = await getWorkspaceRoute(request, {
        params: Promise.resolve({ id: org2WorkspaceId }),
      });

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("NOT_FOUND");
    });

    it("Direct API call from unauthorized role on own resource returns HTTP 403 Forbidden", async () => {
      const org1WorkspaceId = (
        await db
          .select()
          .from(workspaces)
          .where(
            and(
              eq(workspaces.organization_id, org1MemberContext.organizationId),
              isNull(workspaces.deleted_at),
            ),
          )
          .limit(1)
      )[0]!.id;

      // Org 1 Member tries to DELETE own workspace (Member cannot delete workspace)
      const request = new Request(`http://localhost:3000/api/workspaces/${org1WorkspaceId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": org1MemberContext.user.id,
          "x-organization-id": org1MemberContext.organizationId,
        },
      });

      const response = await deleteWorkspaceRoute(request, {
        params: Promise.resolve({ id: org1WorkspaceId }),
      });

      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("FORBIDDEN");
    });
  });

  // ===========================================================================
  // 4. TEAM COLLABORATION FEATURES & SAFETY GUARDS
  // ===========================================================================
  describe("Team Collaboration Services & Invariant Guards", () => {
    it("should create an invitation with a strict 7-day expiration", async () => {
      const inviteRes = await teamService.inviteMember(
        org1OwnerContext,
        {
          email: "new.developer@apexsovereign.io",
          role: "member",
        },
        db,
      );

      expect(inviteRes.invitationId).toBeDefined();
      expect(inviteRes.inviteToken).toContain("mcv_inv_");
      expect(inviteRes.role).toBe("member");

      const expiresAt = new Date(inviteRes.expiresAt).getTime();
      const now = Date.now();
      const diffDays = (expiresAt - now) / (1000 * 60 * 60 * 24);

      // Verify approximately 7 days expiration
      expect(diffDays).toBeGreaterThan(6.9);
      expect(diffDays).toBeLessThanOrEqual(7.1);
    });

    it("should accept a valid invitation and create active membership", async () => {
      const inviteRes = await teamService.inviteMember(
        org1OwnerContext,
        {
          email: "accept.test@apexsovereign.io",
          role: "admin",
        },
        db,
      );

      const acceptRes = await teamService.acceptInvite(
        {
          inviteToken: inviteRes.inviteToken,
          fullName: "Acceptance Test User",
        },
        db,
      );

      expect(acceptRes.membershipId).toBeDefined();
      expect(acceptRes.organizationId).toBe(org1OwnerContext.organizationId);
      expect(acceptRes.role).toBe("admin");

      // Verify user can now authenticate and resolve context
      const newContext = await resolveAuthContext(
        {
          "x-user-id": acceptRes.userId,
          "x-organization-id": acceptRes.organizationId,
        },
        db,
      );
      expect(newContext.role).toBe("admin");
    });

    it("should reject an expired invitation (>7 days) with ValidationError", async () => {
      // 1. Create invitation
      const inviteRes = await teamService.inviteMember(
        org1OwnerContext,
        {
          email: "expired.invite@apexsovereign.io",
          role: "viewer",
        },
        db,
      );

      // 2. Artificially expire the invitation in DB (set expires_at to yesterday)
      await db
        .update(invitations)
        .set({ expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000) })
        .where(eq(invitations.id, inviteRes.invitationId));

      // 3. Attempting to accept expired invitation must fail
      await expect(
        teamService.acceptInvite({ inviteToken: inviteRes.inviteToken }, db),
      ).rejects.toThrow(ValidationError);
    });

    it("Owner can change member role, but Admin cannot modify Owners or Admins", async () => {
      // Owner promotes member to viewer
      const targetUserId = org1MemberContext.user.id;
      const changeRes = await teamService.changeMemberRole(
        org1OwnerContext,
        {
          targetUserId,
          newRole: "viewer",
        },
        db,
      );
      expect(changeRes.newRole).toBe("viewer");

      // Admin tries to change Owner role -> must throw ForbiddenError (403)
      await expect(
        teamService.changeMemberRole(
          org1AdminContext,
          {
            targetUserId: org1OwnerContext.user.id,
            newRole: "member",
          },
          db,
        ),
      ).rejects.toThrow(ForbiddenError);
    });

    it("Safety guard: Cannot remove the last organization Owner", async () => {
      await expect(
        teamService.removeMember(org1OwnerContext, org1OwnerContext.user.id, db),
      ).rejects.toThrow(/last organization Owner cannot be removed/);
    });

    it("Removing a member immediately revokes their session (zero-latency revocation)", async () => {
      // 1. Invite and accept a member to test removal
      const invite = await teamService.inviteMember(
        org1OwnerContext,
        {
          email: "to.be.revoked@apexsovereign.io",
          role: "member",
        },
        db,
      );
      const accepted = await teamService.acceptInvite({ inviteToken: invite.inviteToken }, db);

      // 2. Verify member has active session
      const validContext = await resolveAuthContext(
        { "x-user-id": accepted.userId, "x-organization-id": org1OwnerContext.organizationId },
        db,
      );
      expect(validContext.role).toBe("member");

      // 3. Remove the member
      await teamService.removeMember(org1OwnerContext, accepted.userId, db);

      // 4. Attempting to authenticate or resolve context immediately fails with 401 Unauthorized!
      await expect(
        resolveAuthContext(
          { "x-user-id": accepted.userId, "x-organization-id": org1OwnerContext.organizationId },
          db,
        ),
      ).rejects.toThrow(UnauthorizedError);
    });

    it("Owner can transfer ownership to another member", async () => {
      const targetUserId = org1AdminContext.user.id;

      const transferRes = await teamService.transferOwnership(org1OwnerContext, targetUserId, db);

      expect(transferRes.transferred).toBe(true);
      expect(transferRes.newOwnerId).toBe(targetUserId);

      // Verify target is now Owner
      const newOwnerContext = await resolveAuthContext(
        { "x-user-id": targetUserId, "x-organization-id": org1OwnerContext.organizationId },
        db,
      );
      expect(newOwnerContext.role).toBe("owner");

      // Transfer ownership back to maintain test baseline
      await teamService.transferOwnership(newOwnerContext, org1OwnerContext.user.id, db);
    });

    it("Safety guard: Last Owner cannot leave organization without transferring ownership", async () => {
      await expect(teamService.leaveOrganization(org1OwnerContext, db)).rejects.toThrow(
        /last remaining organization Owner cannot leave/,
      );
    });
  });
});
