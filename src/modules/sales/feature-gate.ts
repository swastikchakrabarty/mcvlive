import { ForbiddenError } from "@/common/errors";

export type FeatureFlag =
  | "dedicated_nodes"
  | "custom_vector_blueprints"
  | "sla_guarantee_99_99"
  | "audit_export_api"
  | "unlimited_workspaces"
  | "priority_support";

export type SubscriptionTier = "starter" | "enterprise_standard" | "vector_sovereign";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "unpaid";

export interface SubscribableOrganization {
  id: string;
  subscription_tier?: string;
  subscriptionTier?: string;
  subscription_status?: string;
  subscriptionStatus?: string;
}

const TIER_FEATURES: Record<SubscriptionTier, ReadonlySet<FeatureFlag>> = {
  starter: new Set<FeatureFlag>([]),
  enterprise_standard: new Set<FeatureFlag>([
    "custom_vector_blueprints",
    "audit_export_api",
    "priority_support",
  ]),
  vector_sovereign: new Set<FeatureFlag>([
    "dedicated_nodes",
    "custom_vector_blueprints",
    "sla_guarantee_99_99",
    "audit_export_api",
    "unlimited_workspaces",
    "priority_support",
  ]),
};

/**
 * Checks if an organization is entitled to a specific feature flag based on its subscription tier and status.
 */
export function hasFeature(org: SubscribableOrganization, feature: FeatureFlag): boolean {
  if (!org) return false;

  const status = (org.subscription_status ||
    org.subscriptionStatus ||
    "active") as SubscriptionStatus;
  const tier = (org.subscription_tier || org.subscriptionTier || "starter") as SubscriptionTier;

  // Canceled or unpaid organizations lose premium entitlements
  if (status === "canceled" || status === "unpaid") {
    return false;
  }

  const features = TIER_FEATURES[tier];
  return features ? features.has(feature) : false;
}

/**
 * Asserts that the organization has the requested feature enabled, throwing ForbiddenError if not.
 */
export function assertFeature(org: SubscribableOrganization, feature: FeatureFlag): void {
  const tier = org.subscription_tier || org.subscriptionTier || "starter";
  if (!hasFeature(org, feature)) {
    throw new ForbiddenError(
      `Feature '${feature}' is not available on tier '${tier}'. Please upgrade your subscription plan.`,
    );
  }
}
