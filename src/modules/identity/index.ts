/**
 * Identity Module — Public Facade Interface
 */

export * from "./types";
export * from "./authorization";
export * from "./auth-context";
export * from "./team-service";

export interface IdentityService {
  verifySession(token: string): Promise<import("./types").IdentitySession | null>;
  getUserProfile(userId: string): Promise<import("./types").UserProfile | null>;
}

export const identityModule = {
  name: "identity",
  description: "Identity, Authentication, RBAC, and IAM bounded context",
} as const;
