import { describe, it, expect, beforeAll } from "vitest";
import { GET as getHealth } from "@/app/api/health/route";
import { GET as getLiveness } from "@/app/api/health/live/route";
import { PLATFORM_NAME, PLATFORM_VERSION } from "@/common/constants";

describe("Health Check Endpoints", () => {
  beforeAll(() => {
    Object.assign(process.env, {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/mcv_test",
      CLERK_SECRET_KEY: "sk_test_mock_clerk_key",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_mock_clerk_pub",
      STRIPE_SECRET_KEY: "sk_test_mock_stripe_key",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
  });

  describe("GET /api/health/live", () => {
    it("should return HTTP 200 with alive status and process uptime", async () => {
      const response = await getLiveness();
      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body.status).toBe("alive");
      expect(typeof body.uptime).toBe("number");
      expect(body.timestamp).toBeDefined();
    });
  });

  describe("GET /api/health", () => {
    it("should return HTTP 200 with complete system diagnostics", async () => {
      const response = await getHealth();
      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body.status).toBe("ok");
      expect(body.platform).toBe(PLATFORM_NAME);
      expect(body.version).toBe(PLATFORM_VERSION);
      expect(body.uptime).toBeDefined();
      expect(body.uptime.formatted).toBeDefined();
      expect(body.system).toBeDefined();
      expect(body.system.memory.rssMb).toBeGreaterThan(0);
      expect(body.checks.runtimeEnv.status).toBe("ok");
      expect(body.checks.process.status).toBe("ok");
    });
  });
});
