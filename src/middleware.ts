import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public route prefixes that do not require authentication
const PUBLIC_PATHS = [
  "/api/health",
  "/api/health/live",
  "/sign-in",
  "/sign-up",
  "/_next",
  "/favicon.ico",
  "/api/team/invites/accept", // Token-based invite acceptance endpoint
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes without authentication
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  // 2. Intercept protected API routes
  if (pathname.startsWith("/api/")) {
    const authHeader = request.headers.get("authorization");
    const headerUserId = request.headers.get("x-user-id");
    const headerOrgId = request.headers.get("x-organization-id");

    const hasAuthToken = (authHeader && authHeader.startsWith("Bearer ")) || Boolean(headerUserId);

    if (!hasAuthToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required: Missing or invalid authorization token",
            timestamp: new Date().toISOString(),
          },
        },
        { status: 401 },
      );
    }

    // Attach resolved identity tracking headers to request
    const requestHeaders = new Headers(request.headers);
    if (headerUserId) {
      requestHeaders.set("x-authenticated-user-id", headerUserId);
    }
    if (headerOrgId) {
      requestHeaders.set("x-resolved-org-id", headerOrgId);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
