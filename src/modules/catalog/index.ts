/**
 * Catalog Module — Public Facade Interface
 */

export * from "./types";

export interface CatalogService {
  listProducts(): Promise<import("./types").CatalogProduct[]>;
  getBlueprintBySlug(slug: string): Promise<import("./types").ArchitectureBlueprint | null>;
}

export const catalogModule = {
  name: "catalog",
  description: "Software products, Architecture blueprints, and Vector solution catalog",
} as const;
