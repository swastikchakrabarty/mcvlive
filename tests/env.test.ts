import { describe, it, expect, beforeEach } from "vitest";
import { validateEnv, resetEnvCache } from "@/common/config/env";

describe("Environment Runtime Validation", () => {
  const validMockEnv = {
    NODE_ENV: "development",
    PORT: "3000",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    NEXT_PUBLIC_API_URL: "http://localhost:3000/api",
    DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/mcv_test",
    DIRECT_URL: "postgresql://postgres:postgres@localhost:5432/mcv_test",
    CLERK_SECRET_KEY: "sk_test_mock_clerk_key",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_mock_clerk_pub",
    STRIPE_SECRET_KEY: "sk_test_mock_stripe_key",
    STRIPE_WEBHOOK_SECRET: "whsec_mock_stripe_secret",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_mock_stripe_pub",
  };

  beforeEach(() => {
    resetEnvCache();
  });

  it("should successfully parse and validate a complete, valid environment object", () => {
    const config = validateEnv(validMockEnv);
    expect(config.NODE_ENV).toBe("development");
    expect(config.PORT).toBe(3000);
    expect(config.DATABASE_URL).toContain("postgresql://");
    expect(config.CLERK_SECRET_KEY).toBe("sk_test_mock_clerk_key");
    expect(config.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });

  it("should fail loudly and throw when DATABASE_URL is missing", () => {
    const invalidEnv = { ...validMockEnv, DATABASE_URL: undefined };
    expect(() => validateEnv(invalidEnv)).toThrowError(/DATABASE_URL/);
  });

  it("should fail loudly when DATABASE_URL is not a postgresql connection string", () => {
    const invalidEnv = { ...validMockEnv, DATABASE_URL: "mysql://user:pass@localhost:3306/db" };
    expect(() => validateEnv(invalidEnv)).toThrowError(
      /DATABASE_URL must be a valid postgres connection string/,
    );
  });

  it("should fail loudly when CLERK_SECRET_KEY is missing", () => {
    const invalidEnv = { ...validMockEnv, CLERK_SECRET_KEY: undefined };
    expect(() => validateEnv(invalidEnv)).toThrowError(/CLERK_SECRET_KEY/);
  });

  it("should fail loudly when STRIPE_SECRET_KEY is missing", () => {
    const invalidEnv = { ...validMockEnv, STRIPE_SECRET_KEY: undefined };
    expect(() => validateEnv(invalidEnv)).toThrowError(/STRIPE_SECRET_KEY/);
  });

  it("should fail loudly when NEXT_PUBLIC_APP_URL is not a valid URL", () => {
    const invalidEnv = { ...validMockEnv, NEXT_PUBLIC_APP_URL: "not-a-valid-url" };
    expect(() => validateEnv(invalidEnv)).toThrowError(/NEXT_PUBLIC_APP_URL must be a valid URL/);
  });
});
