import { NextResponse } from "next/server";
import { getEnv } from "@/common/config/env";
import { PLATFORM_NAME, PLATFORM_VERSION } from "@/common/constants";
import { formatUptime } from "@/common/utils";

/**
 * System Readiness & Comprehensive Health Check Endpoint
 * Verifies process uptime, runtime environment validation, and system memory state.
 */
export async function GET() {
  const startTime = Date.now();

  let envStatus: "ok" | "error" = "ok";
  let envError: string | undefined;

  try {
    getEnv();
  } catch (err) {
    envStatus = "error";
    envError = err instanceof Error ? err.message : "Environment validation failed";
  }

  const memory = process.memoryUsage();
  const uptimeSeconds = process.uptime();

  const isHealthy = envStatus === "ok";
  const statusCode = isHealthy ? 200 : 503;

  const responsePayload = {
    status: isHealthy ? ("ok" as const) : ("degraded" as const),
    platform: PLATFORM_NAME,
    version: PLATFORM_VERSION,
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptimeSeconds),
      formatted: formatUptime(uptimeSeconds),
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      memory: {
        rssMb: Math.round(memory.rss / (1024 * 1024)),
        heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024)),
        heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
        externalMb: Math.round(memory.external / (1024 * 1024)),
      },
    },
    checks: {
      runtimeEnv: {
        status: envStatus,
        ...(envError ? { message: envError } : {}),
      },
      process: {
        status: "ok" as const,
      },
    },
    latencyMs: Date.now() - startTime,
  };

  return NextResponse.json(responsePayload, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Content-Type": "application/json",
    },
  });
}
