/**
 * Catalog Domain Model & Types
 */

export type ProductTier = "starter" | "enterprise_standard" | "vector_sovereign";

export interface ArchitectureBlueprint {
  id: string;
  slug: string;
  title: string;
  description: string;
  tier: ProductTier;
  capabilities: string[];
  specification: {
    recommendedLatencyP95Ms: number;
    maxQps: number;
    encryptionStandard: string;
  };
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  blueprints: ArchitectureBlueprint[];
  basePriceUsdMonthly: number;
}
