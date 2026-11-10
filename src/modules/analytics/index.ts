/**
 * Analytics Module — Public Facade Interface
 */

export * from "./types";

export interface AnalyticsService {
  recordAuditLog(entry: Omit<import("./types").AuditLogEntry, "id" | "timestamp">): Promise<void>;
  queryAuditLogs(tenantId: string): Promise<import("./types").AuditLogEntry[]>;
}

export const analyticsModule = {
  name: "analytics",
  description: "Enterprise audit trails, usage telemetry, and platform performance monitoring",
} as const;
