import { NextResponse } from "next/server";

/**
 * Liveness Probe Endpoint
 * Fast heartbeat for load balancers, container orchestrators, and uptime monitors.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "alive",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
    },
  );
}
