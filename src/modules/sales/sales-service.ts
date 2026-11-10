import { eq, and, isNull } from "drizzle-orm";
import { getDb, quotes, licenses } from "@/db";
import { NotFoundError, ValidationError } from "@/common/errors";
import type { Quote, SoftwareLicense, LicenseStatus } from "./types";

export class SalesService {
  /**
   * Retrieves a quote strictly scoped to the tenant
   */
  async getQuoteById(organizationId: string, quoteId: string, customDb = getDb()): Promise<Quote> {
    if (!organizationId || !quoteId) {
      throw new ValidationError("Both organizationId and quoteId are required");
    }

    const [q] = await customDb
      .select()
      .from(quotes)
      .where(and(eq(quotes.id, quoteId), isNull(quotes.deleted_at)))
      .limit(1);

    if (!q || q.organization_id !== organizationId) {
      throw new NotFoundError("Quote", quoteId);
    }

    return {
      id: q.id,
      organizationId: q.organization_id,
      productId: "prod_vector_core",
      tier: q.tier,
      seats: q.seats,
      subtotalUsd: q.subtotal_minor / 100,
      discountUsd: q.discount_minor / 100,
      totalUsd: q.total_minor / 100,
      expiresAt: q.expires_at.toISOString(),
    };
  }

  /**
   * Lists all quotes for a tenant
   */
  async listQuotes(organizationId: string, customDb = getDb()): Promise<Quote[]> {
    if (!organizationId) {
      throw new ValidationError("organizationId is required");
    }

    const records = await customDb
      .select()
      .from(quotes)
      .where(and(eq(quotes.organization_id, organizationId), isNull(quotes.deleted_at)));

    return records.map((q) => ({
      id: q.id,
      organizationId: q.organization_id,
      productId: "prod_vector_core",
      tier: q.tier,
      seats: q.seats,
      subtotalUsd: q.subtotal_minor / 100,
      discountUsd: q.discount_minor / 100,
      totalUsd: q.total_minor / 100,
      expiresAt: q.expires_at.toISOString(),
    }));
  }

  /**
   * Retrieves a software license strictly scoped to the tenant
   */
  async getLicenseById(
    organizationId: string,
    licenseId: string,
    customDb = getDb(),
  ): Promise<SoftwareLicense> {
    if (!organizationId || !licenseId) {
      throw new ValidationError("Both organizationId and licenseId are required");
    }

    const [lic] = await customDb
      .select()
      .from(licenses)
      .where(and(eq(licenses.id, licenseId), isNull(licenses.deleted_at)))
      .limit(1);

    if (!lic || lic.organization_id !== organizationId) {
      throw new NotFoundError("Software license", licenseId);
    }

    return {
      id: lic.id,
      organizationId: lic.organization_id,
      licenseKey: lic.license_key,
      tier: lic.tier,
      status: lic.status as LicenseStatus,
      validUntil: lic.valid_until.toISOString(),
      issuedAt: lic.valid_from.toISOString(),
      metadata: lic.entitlements as Record<string, unknown>,
    };
  }
}

export const salesService = new SalesService();
