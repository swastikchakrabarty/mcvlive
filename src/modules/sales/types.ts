/**
 * Sales Domain Model & Types
 */

export type LicenseStatus = "active" | "expired" | "revoked" | "provisioning";
export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed";

export interface SoftwareLicense {
  id: string;
  organizationId: string;
  licenseKey: string;
  tier: string;
  status: LicenseStatus;
  validUntil: string;
  issuedAt: string;
  metadata?: Record<string, unknown>;
}

export interface Quote {
  id: string;
  organizationId: string;
  productId: string;
  tier: string;
  seats: number;
  subtotalUsd: number;
  discountUsd: number;
  totalUsd: number;
  expiresAt: string;
}

export interface CheckoutSessionParams {
  organizationId: string;
  quoteId: string;
  successUrl: string;
  cancelUrl: string;
}
