/**
 * Analytics Domain Model & Types
 */

export type AuditAction =
  | "user.login"
  | "user.logout"
  | "license.issued"
  | "license.revoked"
  | "quote.created"
  | "apikey.generated"
  | "settings.updated";

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  actorId: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface MetricDataPoint {
  metric: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}
