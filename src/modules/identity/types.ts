/**
 * Identity Domain Model & Types
 */

export type UserRole = "superadmin" | "org_admin" | "evaluator" | "billing" | "member";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface OrganizationMembership {
  id: string;
  organizationId: string;
  userId: string;
  role: UserRole;
  createdAt: string;
}

export interface IdentitySession {
  userId: string;
  user: UserProfile;
  activeOrganizationId?: string;
  role?: UserRole;
  permissions: string[];
}
