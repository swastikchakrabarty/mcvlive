/**
 * Sales Module — Public Facade Interface
 */

export * from "./types";

export interface SalesService {
  createQuote(params: {
    organizationId: string;
    productId: string;
    seats: number;
  }): Promise<import("./types").Quote>;
  getLicense(licenseKey: string): Promise<import("./types").SoftwareLicense | null>;
}

export const salesModule = {
  name: "sales",
  description: "Enterprise software sales, quotes, checkout, subscriptions, and licensing",
} as const;
