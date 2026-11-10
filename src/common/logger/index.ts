/**
 * Production Structured Logger with PII Redaction & Request ID Tracing
 *
 * Conforms to Playbook Layer 13:
 * - Emits machine-readable, single-line JSON log events.
 * - Automatically redacts secrets, credentials, authentication tokens, and PII (emails, personal names).
 * - Incorporates unique request tracing IDs for distributed log correlation.
 */

export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SECURITY";
  type: string;
  requestId?: string;
  message?: string;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    code?: string;
    stack?: string;
  };
}

/**
 * Masks an email address: julian@apexsovereign.com -> j***n@apexsovereign.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "[INVALID_EMAIL]";
  const [local, domain] = email.split("@");
  if (!local || !domain) return "[REDACTED_EMAIL]";

  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

/**
 * Masks personal names: "Julian Morland" -> "J*** M***"
 */
export function maskName(name: string): string {
  if (!name || typeof name !== "string") return "[REDACTED]";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => (part.length > 0 ? `${part[0]}***` : ""))
    .join(" ");
}

const SENSITIVE_KEYS_REGEX =
  /password|secret|token|authorization|cookie|api_?key|private_?key|credit_?card|cvv/i;
const EMAIL_KEYS_REGEX = /email|companyEmail|userEmail/i;
const PERSONAL_NAME_KEYS_REGEX = /ownerName|signatoryName|fullName|userName|contactName/i;

/**
 * Recursively redacts sensitive keys and PII in data objects before logging.
 */
export function sanitizeLogData(input: unknown): unknown {
  if (input === null || input === undefined) return input;

  if (typeof input === "string") {
    // Redact raw JWT tokens or bearer tokens if embedded in strings
    if (input.startsWith("Bearer ") || input.length > 200) {
      if (/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(input)) {
        return "[REDACTED_JWT]";
      }
    }
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeLogData);
  }

  if (typeof input === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(input as Record<string, unknown>)) {
      if (SENSITIVE_KEYS_REGEX.test(key)) {
        sanitized[key] = "[REDACTED]";
      } else if (EMAIL_KEYS_REGEX.test(key) && typeof val === "string") {
        sanitized[key] = maskEmail(val);
      } else if (PERSONAL_NAME_KEYS_REGEX.test(key) && typeof val === "string") {
        sanitized[key] = maskName(val);
      } else {
        sanitized[key] = sanitizeLogData(val);
      }
    }
    return sanitized;
  }

  return input;
}

class StructuredLogger {
  public info(type: string, data?: Record<string, unknown>, requestId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "INFO",
      type,
      ...(requestId ? { requestId } : {}),
      ...(data ? { data: sanitizeLogData(data) as Record<string, unknown> } : {}),
    };
    console.info(JSON.stringify(entry));
  }

  public warn(
    type: string,
    message: string,
    data?: Record<string, unknown>,
    requestId?: string,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "WARN",
      type,
      message,
      ...(requestId ? { requestId } : {}),
      ...(data ? { data: sanitizeLogData(data) as Record<string, unknown> } : {}),
    };
    console.warn(JSON.stringify(entry));
  }

  public error(
    type: string,
    error: unknown,
    data?: Record<string, unknown>,
    requestId?: string,
  ): void {
    const errObj =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
          }
        : {
            name: "UnknownError",
            message: String(error),
          };

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "ERROR",
      type,
      ...(requestId ? { requestId } : {}),
      error: errObj,
      ...(data ? { data: sanitizeLogData(data) as Record<string, unknown> } : {}),
    };
    console.error(JSON.stringify(entry));
  }

  public security(
    type: string,
    message: string,
    data?: Record<string, unknown>,
    requestId?: string,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "SECURITY",
      type,
      message,
      ...(requestId ? { requestId } : {}),
      ...(data ? { data: sanitizeLogData(data) as Record<string, unknown> } : {}),
    };
    console.warn(JSON.stringify(entry));
  }
}

export const logger = new StructuredLogger();
