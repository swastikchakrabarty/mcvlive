import crypto from "node:crypto";
import { eq, and, isNull, count } from "drizzle-orm";
import { getDb, organizationMembers, users, invitations } from "@/db";
import { ValidationError, NotFoundError, ConflictError, ForbiddenError } from "@/common/errors";
import { assertCan, type AuthContext } from "./authorization";
import type { UserRole } from "./types";

export interface InviteMemberInput {
  email: string;
  role: UserRole;
}

export interface AcceptInviteInput {
  inviteToken: string;
  acceptingUserId?: string;
  fullName?: string;
}

export class TeamService {
  /**
   * Invites a new team member by email with a strict 7-day token expiration.
   */
  async inviteMember(context: AuthContext, input: InviteMemberInput, customDb = getDb()) {
    assertCan(context, "member:invite");

    const email = input.email.trim().toLowerCase();
    const role = input.role;

    // Validate email format
    if (!email || !email.includes("@")) {
      throw new ValidationError("A valid email address is required for team invitation");
    }

    // Role-specific constraints: Only Owner can invite another Owner
    if (role === "owner" && context.role !== "owner") {
      throw new ForbiddenError("Only an existing organization Owner can invite a new Owner");
    }

    // 1. Check if user is already an active member of this organization
    const [existingUser] = await customDb
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deleted_at)))
      .limit(1);

    if (existingUser) {
      const [existingMembership] = await customDb
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organization_id, context.organizationId),
            eq(organizationMembers.user_id, existingUser.id),
            isNull(organizationMembers.deleted_at),
          ),
        )
        .limit(1);

      if (existingMembership) {
        throw new ConflictError(`User '${email}' is already an active member of this organization`);
      }
    }

    // 2. Generate secure 7-day invitation token
    const rawInviteToken = `mcv_inv_${crypto.randomBytes(32).toString("hex")}`;
    const tokenHash = crypto.createHash("sha256").update(rawInviteToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day expiration window

    // 3. Persist invitation record
    const [invitation] = await customDb
      .insert(invitations)
      .values({
        organization_id: context.organizationId,
        email,
        role,
        token_hash: tokenHash,
        invited_by: context.user.id,
        status: "pending",
        expires_at: expiresAt,
      })
      .returning();

    if (!invitation) {
      throw new Error("Failed to create invitation record");
    }

    return {
      invitationId: invitation.id,
      organizationId: context.organizationId,
      email: invitation.email,
      role: invitation.role as UserRole,
      expiresAt: invitation.expires_at.toISOString(),
      inviteToken: rawInviteToken, // returned once to allow emailing/testing
    };
  }

  /**
   * Accepts a pending invitation using the pre-shared token.
   */
  async acceptInvite(input: AcceptInviteInput, customDb = getDb()) {
    const { inviteToken, acceptingUserId, fullName } = input;

    if (!inviteToken) {
      throw new ValidationError("Invitation token is required");
    }

    const tokenHash = crypto.createHash("sha256").update(inviteToken).digest("hex");

    // 1. Query invitation
    const [invitation] = await customDb
      .select()
      .from(invitations)
      .where(and(eq(invitations.token_hash, tokenHash), isNull(invitations.deleted_at)))
      .limit(1);

    if (!invitation || invitation.status !== "pending") {
      throw new NotFoundError("Invitation token is invalid or has already been used");
    }

    // 2. Verify 7-day expiration invariant
    if (new Date() > invitation.expires_at) {
      await customDb
        .update(invitations)
        .set({ status: "expired", updated_at: new Date() })
        .where(eq(invitations.id, invitation.id));

      throw new ValidationError("Invitation token has expired. Invitations are valid for 7 days.");
    }

    // 3. Resolve or create user account for accepting invitee
    let userId = acceptingUserId;

    if (!userId) {
      const [existingUser] = await customDb
        .select()
        .from(users)
        .where(and(eq(users.email, invitation.email), isNull(users.deleted_at)))
        .limit(1);

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const [newUser] = await customDb
          .insert(users)
          .values({
            email: invitation.email,
            full_name: fullName || invitation.email.split("@")[0] || "Team Member",
          })
          .returning();

        if (!newUser) throw new Error("Failed to provision user for invitation");
        userId = newUser.id;
      }
    }

    // 4. Create membership
    const [membership] = await customDb
      .insert(organizationMembers)
      .values({
        organization_id: invitation.organization_id,
        user_id: userId,
        role: invitation.role,
      })
      .returning();

    // 5. Update invitation status to accepted
    await customDb
      .update(invitations)
      .set({ status: "accepted", updated_at: new Date() })
      .where(eq(invitations.id, invitation.id));

    return {
      membershipId: membership?.id,
      organizationId: invitation.organization_id,
      userId,
      role: invitation.role as UserRole,
      acceptedAt: new Date().toISOString(),
    };
  }

  /**
   * Modifies an existing team member's role within hierarchical permission boundaries.
   */
  async changeMemberRole(
    context: AuthContext,
    input: { targetUserId: string; newRole: UserRole },
    customDb = getDb(),
  ) {
    assertCan(context, "member:update_role");

    const { targetUserId, newRole } = input;

    // Promotion to Owner must strictly use transferOwnership
    if (newRole === "owner") {
      throw new ValidationError(
        "Direct assignment to 'owner' is prohibited. Use ownership transfer.",
      );
    }

    // Admins cannot edit roles of Owners or other Admins
    if (context.role === "admin") {
      const [targetMember] = await customDb
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organization_id, context.organizationId),
            eq(organizationMembers.user_id, targetUserId),
            isNull(organizationMembers.deleted_at),
          ),
        )
        .limit(1);

      if (!targetMember) {
        throw new NotFoundError("Member not found in organization");
      }

      if (targetMember.role === "owner" || targetMember.role === "admin") {
        throw new ForbiddenError("Admins cannot modify roles of Owners or fellow Admins");
      }
    }

    // Retrieve target membership
    const [target] = await customDb
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organization_id, context.organizationId),
          eq(organizationMembers.user_id, targetUserId),
          isNull(organizationMembers.deleted_at),
        ),
      )
      .limit(1);

    if (!target) {
      throw new NotFoundError("Member not found in organization");
    }

    // Safety guard: The last remaining Owner cannot be demoted
    if (target.role === "owner") {
      const [ownerCount] = await customDb
        .select({ total: count() })
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organization_id, context.organizationId),
            eq(organizationMembers.role, "owner"),
            isNull(organizationMembers.deleted_at),
          ),
        );

      if ((ownerCount?.total ?? 0) <= 1) {
        throw new ValidationError(
          "Safety guard: The last remaining organization Owner cannot be demoted",
        );
      }
    }

    const [updated] = await customDb
      .update(organizationMembers)
      .set({ role: newRole, updated_at: new Date() })
      .where(eq(organizationMembers.id, target.id))
      .returning();

    return {
      membershipId: updated?.id,
      userId: targetUserId,
      newRole,
      updatedAt: updated?.updated_at.toISOString(),
    };
  }

  /**
   * Removes a member from the organization, revoking access immediately via soft-delete.
   */
  async removeMember(context: AuthContext, targetUserId: string, customDb = getDb()) {
    assertCan(context, "member:remove");

    // 1. Query target membership
    const [target] = await customDb
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organization_id, context.organizationId),
          eq(organizationMembers.user_id, targetUserId),
          isNull(organizationMembers.deleted_at),
        ),
      )
      .limit(1);

    if (!target) {
      throw new NotFoundError("Member not found in organization");
    }

    // 2. Safety guard: The last remaining Owner cannot be removed
    if (target.role === "owner") {
      const [ownerCount] = await customDb
        .select({ total: count() })
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organization_id, context.organizationId),
            eq(organizationMembers.role, "owner"),
            isNull(organizationMembers.deleted_at),
          ),
        );

      if ((ownerCount?.total ?? 0) <= 1) {
        throw new ValidationError("Safety guard: The last organization Owner cannot be removed");
      }
    }

    // 3. Admin boundary: Admins cannot remove Owners or fellow Admins
    if (context.role === "admin" && (target.role === "owner" || target.role === "admin")) {
      throw new ForbiddenError("Admins cannot remove Owners or fellow Admins");
    }

    // 4. Soft-delete membership (immediately revokes session via auth resolution)
    await customDb
      .update(organizationMembers)
      .set({ deleted_at: new Date(), updated_at: new Date() })
      .where(eq(organizationMembers.id, target.id));

    return {
      revoked: true,
      membershipId: target.id,
      userId: targetUserId,
      organizationId: context.organizationId,
    };
  }

  /**
   * Transfers organization ownership from the current Owner to another member.
   */
  async transferOwnership(context: AuthContext, targetUserId: string, customDb = getDb()) {
    assertCan(context, "organization:transfer_ownership");

    if (context.user.id === targetUserId) {
      throw new ValidationError("Cannot transfer ownership to yourself");
    }

    // Verify target user is an active member of this organization
    const [target] = await customDb
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organization_id, context.organizationId),
          eq(organizationMembers.user_id, targetUserId),
          isNull(organizationMembers.deleted_at),
        ),
      )
      .limit(1);

    if (!target) {
      throw new NotFoundError("Target user is not an active member of this organization");
    }

    // Promote target to Owner and demote current Owner to Admin
    await customDb
      .update(organizationMembers)
      .set({ role: "owner", updated_at: new Date() })
      .where(eq(organizationMembers.id, target.id));

    await customDb
      .update(organizationMembers)
      .set({ role: "admin", updated_at: new Date() })
      .where(eq(organizationMembers.id, context.membershipId));

    return {
      transferred: true,
      previousOwnerId: context.user.id,
      newOwnerId: targetUserId,
      organizationId: context.organizationId,
    };
  }

  /**
   * Allows a member to leave the organization, protecting the last remaining Owner.
   */
  async leaveOrganization(context: AuthContext, customDb = getDb()) {
    assertCan(context, "member:leave");

    // Safety guard: Last remaining Owner cannot leave
    if (context.role === "owner") {
      const [ownerCount] = await customDb
        .select({ total: count() })
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organization_id, context.organizationId),
            eq(organizationMembers.role, "owner"),
            isNull(organizationMembers.deleted_at),
          ),
        );

      if ((ownerCount?.total ?? 0) <= 1) {
        throw new ValidationError(
          "Safety guard: The last remaining organization Owner cannot leave without transferring ownership first",
        );
      }
    }

    // Soft-delete caller's membership
    await customDb
      .update(organizationMembers)
      .set({ deleted_at: new Date(), updated_at: new Date() })
      .where(eq(organizationMembers.id, context.membershipId));

    return {
      left: true,
      userId: context.user.id,
      organizationId: context.organizationId,
    };
  }

  /**
   * Lists all active members of the organization.
   */
  async listMembers(context: AuthContext, customDb = getDb()) {
    assertCan(context, "member:read");

    const rows = await customDb
      .select({
        membershipId: organizationMembers.id,
        userId: users.id,
        email: users.email,
        fullName: users.full_name,
        role: organizationMembers.role,
        joinedAt: organizationMembers.created_at,
      })
      .from(organizationMembers)
      .innerJoin(users, eq(organizationMembers.user_id, users.id))
      .where(
        and(
          eq(organizationMembers.organization_id, context.organizationId),
          isNull(organizationMembers.deleted_at),
          isNull(users.deleted_at),
        ),
      );

    return rows.map((r) => ({
      membershipId: r.membershipId,
      userId: r.userId,
      email: r.email,
      fullName: r.fullName,
      role: r.role as UserRole,
      joinedAt: r.joinedAt.toISOString(),
    }));
  }

  /**
   * Lists pending invitations for the organization.
   */
  async listInvitations(context: AuthContext, customDb = getDb()) {
    assertCan(context, "member:read");

    const rows = await customDb
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.organization_id, context.organizationId),
          eq(invitations.status, "pending"),
          isNull(invitations.deleted_at),
        ),
      );

    return rows.map((inv) => ({
      id: inv.id,
      email: inv.email,
      role: inv.role as UserRole,
      status: inv.status,
      expiresAt: inv.expires_at.toISOString(),
      createdAt: inv.created_at.toISOString(),
    }));
  }
}

export const teamService = new TeamService();
