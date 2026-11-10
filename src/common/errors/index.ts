/**
 * Standard Application Error Hierarchy for Morland Chambers Vector (MCV)
 */

export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, isOperational = true, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode = "VALIDATION_ERROR";

  constructor(message = "Invalid request payload", details?: unknown) {
    super(message, true, details);
  }
}

export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = "UNAUTHORIZED";

  constructor(message = "Authentication required to access this resource") {
    super(message, true);
  }
}

export class ForbiddenError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = "FORBIDDEN";

  constructor(message = "Insufficient permissions to perform this operation") {
    super(message, true);
  }
}

export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = "NOT_FOUND";

  constructor(resource = "Resource", identifier?: string | number) {
    super(
      identifier
        ? `${resource} with identifier '${identifier}' was not found`
        : `${resource} not found`,
      true,
    );
  }
}

export class ConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = "CONFLICT";

  constructor(message = "Resource state conflict detected") {
    super(message, true);
  }
}

export class InternalServerError extends AppError {
  public readonly statusCode = 500;
  public readonly errorCode = "INTERNAL_SERVER_ERROR";

  constructor(message = "An unexpected internal server error occurred", details?: unknown) {
    super(message, false, details);
  }
}

export class RateLimitError extends AppError {
  public readonly statusCode = 429;
  public readonly errorCode = "RATE_LIMIT_EXCEEDED";
  public readonly retryAfterSeconds: number;

  constructor(
    message = "Too many requests. Rate limit exceeded. Please try again later.",
    retryAfterSeconds = 60,
    details?: unknown,
  ) {
    super(message, true, details);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
