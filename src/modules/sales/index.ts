/**
 * Sales Module — Public Facade Interface
 */

export * from "./types";
export * from "./sales-service";
export * from "./feature-gate";
export * from "./webhook-service";

export const salesModule = {
  name: "sales",
  description: "Enterprise software sales, quotes, checkout, subscriptions, and licensing",
} as const;
