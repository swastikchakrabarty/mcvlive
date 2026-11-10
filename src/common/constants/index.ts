/**
 * Global Platform Constants for Morland Chambers Vector (MCV)
 */

export const PLATFORM_NAME = "Morland Chambers Vector" as const;
export const PLATFORM_CODE = "MCV" as const;
export const PLATFORM_VERSION = "0.1.0" as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const SUPPORTED_LOCALES = ["en-US", "en-GB", "de-DE", "fr-FR", "ja-JP"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
