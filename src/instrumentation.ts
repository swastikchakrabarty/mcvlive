/**
 * Next.js Server Lifecycle Instrumentation Hook
 * Executes at application startup before any request is handled.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Perform startup runtime environment validation
    const { getEnv } = await import("@/common/config/env");
    getEnv();
  }
}
