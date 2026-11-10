import { z } from "zod";

/**
 * Server Environment Variables Schema
 */
export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),

  // Database persistence
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (val) => val.startsWith("postgres://") || val.startsWith("postgresql://"),
      "DATABASE_URL must be a valid postgres connection string (postgresql://...)",
    ),
  DIRECT_URL: z.string().optional(),

  // Authentication & IAM
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),

  // Commerce & Payments
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Caching & Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

/**
 * Client Environment Variables Schema (must be prefixed with NEXT_PUBLIC_)
 */
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

/**
 * Combined Application Environment Schema
 */
export const appEnvSchema = serverEnvSchema.merge(clientEnvSchema);

export type AppEnv = z.infer<typeof appEnvSchema>;

/**
 * Format Zod validation errors into an enterprise-standard formatted report
 */
function formatEnvErrors(issues: z.ZodIssue[]): string {
  const lines: string[] = [
    "\n" + "=".repeat(80),
    "CRITICAL RUNTIME ERROR: INVALID ENVIRONMENT CONFIGURATION",
    "=".repeat(80),
    "The Morland Chambers Vector application failed to initialize due to missing or",
    "malformed environment variables. Please check your .env.local file or server",
    "secrets configuration. Refer to .env.example for required definitions.\n",
    "FAILED VALIDATION CHECKS:",
  ];

  for (const issue of issues) {
    const key = issue.path.join(".") || "UNKNOWN_VARIABLE";
    lines.push(`  ✖ [${key}]: ${issue.message}`);
  }

  lines.push("=".repeat(80) + "\n");
  return lines.join("\n");
}

let cachedEnv: AppEnv | null = null;

/**
 * Validates environment variables at application startup.
 * Throws a loud descriptive error if any required variables are missing or malformed.
 */
export function validateEnv(rawEnv: Record<string, string | undefined> = process.env): AppEnv {
  // If running in development and keys aren't set, provide transparent development defaults
  // unless explicitly running strict validation
  const result = appEnvSchema.safeParse(rawEnv);

  if (!result.success) {
    const errorMessage = formatEnvErrors(result.error.issues);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  cachedEnv = result.data;
  return result.data;
}

/**
 * Retrieve validated runtime environment variables.
 * Automatically validates on initial invocation.
 */
export function getEnv(): AppEnv {
  if (!cachedEnv) {
    return validateEnv(process.env);
  }
  return cachedEnv;
}

/**
 * Reset cached environment (useful for unit tests)
 */
export function resetEnvCache(): void {
  cachedEnv = null;
}
