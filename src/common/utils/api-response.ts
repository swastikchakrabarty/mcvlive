import { NextResponse } from "next/server";
import { z } from "zod";
import { AppError, ValidationError, RateLimitError } from "@/common/errors";
import { logger } from "@/common/logger";

export interface StandardMeta {
  timestamp: string;
  requestId?: string;
  cursor?: {
    nextCursor?: string;
    hasMore: boolean;
    limit: number;
    total?: number;
  };
  [key: string]: unknown;
}

/**
 * Produces a standardized JSON success response envelope.
 */
export function apiSuccess<T>(data: T, meta?: Partial<StandardMeta>, status = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status },
  );
}

/**
 * Produces a standardized JSON error response envelope.
 * Guarantees zero internal stack trace exposure.
 */
export function apiError(
  error: unknown,
  statusOverride?: number,
  customHeaders?: Record<string, string>,
  requestId?: string,
): NextResponse {
  // Allow Next.js dynamic prerender bailouts to propagate naturally
  if (
    error instanceof Error &&
    (error.message.includes("bail out of prerendering") ||
      error.message.includes("Dynamic server usage") ||
      (error as { digest?: string }).digest?.includes("DYNAMIC_SERVER_USAGE"))
  ) {
    throw error;
  }

  const timestamp = new Date().toISOString();
  const responseHeaders = new Headers(customHeaders);

  // 1. Rate Limiting Error (Layer 11)
  if (error instanceof RateLimitError) {
    responseHeaders.set("Retry-After", error.retryAfterSeconds.toString());
    responseHeaders.set("X-RateLimit-Remaining", "0");

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.errorCode,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
          timestamp,
        },
        meta: requestId ? { requestId, timestamp } : undefined,
      },
      { status: 429, headers: responseHeaders },
    );
  }

  // 2. Known Application Error (AppError hierarchy)
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.errorCode,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
          timestamp,
        },
        meta: requestId ? { requestId, timestamp } : undefined,
      },
      { status: statusOverride || error.statusCode, headers: responseHeaders },
    );
  }

  // 3. Direct Zod Validation Error
  if (error instanceof z.ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: `Request validation failed: ${details.length} issue(s) detected`,
          details,
          timestamp,
        },
        meta: requestId ? { requestId, timestamp } : undefined,
      },
      { status: 400, headers: responseHeaders },
    );
  }

  // 4. JSON Parsing Syntax Error (Malformed/Garbage Body)
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Malformed JSON payload: The request body could not be parsed as valid JSON",
          timestamp,
        },
        meta: requestId ? { requestId, timestamp } : undefined,
      },
      { status: 400, headers: responseHeaders },
    );
  }

  // 5. Generic / Unhandled Internal Error
  logger.error("UNHANDLED_INTERNAL_ERROR", error, undefined, requestId);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected internal error occurred. Please try again later.",
        timestamp,
      },
      meta: requestId ? { requestId, timestamp } : undefined,
    },
    { status: statusOverride || 500, headers: responseHeaders },
  );
}

/**
 * Safely parses and validates a JSON request body using a Zod schema.
 * Throws clean 400 ValidationError or SyntaxError for malformed payloads.
 */
export async function parseJsonBody<T>(request: Request, schema: z.ZodSchema<T>): Promise<T> {
  const rawText = await request.text();

  if (!rawText || rawText.trim().length === 0) {
    throw new ValidationError("Request payload cannot be empty");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    throw new SyntaxError("Malformed JSON body");
  }

  const result = schema.safeParse(parsedJson);

  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join(".") || "body",
      message: i.message,
    }));
    throw new ValidationError(
      `Validation failed: ${details.map((d) => `${d.field}: ${d.message}`).join("; ")}`,
      details,
    );
  }

  return result.data;
}

/**
 * Cursor Encoding / Decoding for Paginated Lists
 */
export function encodeCursor(item: { id: string; createdAt: Date | string }): string {
  const dateStr = item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt;
  const payload = JSON.stringify({ id: item.id, createdAt: dateStr });
  return Buffer.from(payload, "utf-8").toString("base64url");
}

export function decodeCursor(cursor: string): { id: string; createdAt: Date } | null {
  try {
    const json = Buffer.from(cursor, "base64url").toString("utf-8");
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed.id === "string" && typeof parsed.createdAt === "string") {
      return { id: parsed.id, createdAt: new Date(parsed.createdAt) };
    }
    return null;
  } catch {
    return null;
  }
}
