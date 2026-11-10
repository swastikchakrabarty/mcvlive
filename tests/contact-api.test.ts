import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST as contactHandler } from "@/app/api/contact/route";
import { rateLimiter } from "@/common/security/rate-limiter";
import { maskEmail, maskName, sanitizeLogData } from "@/common/logger";

describe("Contact Ingress API (/api/contact) & Security Hardening", () => {
  beforeEach(() => {
    rateLimiter.reset();
  });
  it("should process a valid corporate contact inquiry and return HTTP 201", async () => {
    const validPayload = {
      businessName: "Apex Sovereign Holdings Ltd",
      ownerName: "Julian Morland",
      companyEmail: "julian@apexsovereign.com",
      budget: "$30,000 – $60,000 (High-Throughput Web Application)",
      tierSelected: "100_advance",
      message: "We require immediate deployment of a multi-tenant client portal.",
    };

    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await contactHandler(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.received).toBe(true);
    expect(body.data.referenceId).toMatch(/^MCV-LEAD-/);
    expect(body.data.destination).toBe("info@morelandchambers.com");
    expect(body.data.details.businessName).toBe(validPayload.businessName);
    expect(body.data.details.ownerName).toBe(validPayload.ownerName);
    expect(body.data.details.companyEmail).toBe(validPayload.companyEmail);
  });

  it("should return HTTP 400 with VALIDATION_ERROR when required fields are missing", async () => {
    const invalidPayload = {
      businessName: "A", // too short
      ownerName: "", // missing
      companyEmail: "not-an-email", // invalid
      budget: "", // missing
    };

    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidPayload),
    });

    const res = await contactHandler(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details).toBeDefined();
  });

  it("should return HTTP 400 with BAD_REQUEST when body contains malformed JSON", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ unquoted_key: invalid ",
    });

    const res = await contactHandler(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("BAD_REQUEST");
  });

  it("should process fixed pricing tier inquiries (Tier 1 $200, Tier 2 $800, Tier 3 $2,500)", async () => {
    const enterpriseTierPayload = {
      businessName: "Metropolitan Healthcare Consortium",
      ownerName: "Dr. Eleanor Vance",
      companyEmail: "e.vance@metrohealth.org",
      budget: "$2,500 USD (Tier 3: Complete Enterprise System)",
      tierSelected: "complete_enterprise",
      message: "Need hospital patient management and RBAC access control system.",
    };

    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enterpriseTierPayload),
    });

    const res = await contactHandler(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.details.budget).toBe("$2,500 USD (Tier 3: Complete Enterprise System)");
  });

  describe("Playbook Layer 11: Rate Limiting & Abuse Defense", () => {
    it("should enforce IP-based rate limiting (rejecting with 429 and Retry-After after 5 requests)", async () => {
      const payload = {
        businessName: "Abuse Defense Test Corp",
        ownerName: "Marcus Sterling",
        companyEmail: "test1@sterlingsystems.com",
        budget: "$800 USD (Tier 2: E-Commerce Store)",
        tierSelected: "ecommerce_store",
      };

      const ipHeader = { "x-forwarded-for": "198.51.100.42" };

      // Send 5 permitted requests
      for (let i = 0; i < 5; i++) {
        const req = new NextRequest("http://localhost:3000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...ipHeader },
          body: JSON.stringify({ ...payload, companyEmail: `user_${i}@sterlingsystems.com` }),
        });
        const res = await contactHandler(req);
        expect(res.status).toBe(201);
      }

      // 6th request from same IP must be rejected with 429
      const blockedReq = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...ipHeader },
        body: JSON.stringify({ ...payload, companyEmail: "user_blocked@sterlingsystems.com" }),
      });

      const blockedRes = await contactHandler(blockedReq);
      expect(blockedRes.status).toBe(429);
      expect(blockedRes.headers.get("Retry-After")).toBeDefined();
      expect(Number(blockedRes.headers.get("Retry-After"))).toBeGreaterThan(0);

      const body = await blockedRes.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("RATE_LIMIT_EXCEEDED");
      expect(body.error.message).toContain("IP address");
    });

    it("should enforce Email-based rate limiting (rejecting with 429 after 3 requests with same email)", async () => {
      const email = "frequent.buyer@sovereignholdings.ch";
      const payload = {
        businessName: "Sovereign Holdings Switzerland",
        ownerName: "Helena Weiss",
        companyEmail: email,
        budget: "$200 USD (Tier 1: Bespoke Landing Page)",
        tierSelected: "landing_page",
      };

      // Send 3 permitted requests from distinct rotating IPs
      for (let i = 0; i < 3; i++) {
        const req = new NextRequest("http://localhost:3000/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": `203.0.113.${10 + i}`,
          },
          body: JSON.stringify(payload),
        });
        const res = await contactHandler(req);
        expect(res.status).toBe(201);
      }

      // 4th request from a fresh IP with the same email must be rate-limited
      const blockedReq = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "203.0.113.99",
        },
        body: JSON.stringify(payload),
      });

      const blockedRes = await contactHandler(blockedReq);
      expect(blockedRes.status).toBe(429);
      expect(blockedRes.headers.get("Retry-After")).toBeDefined();

      const body = await blockedRes.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("RATE_LIMIT_EXCEEDED");
      expect(body.error.message).toContain("email address");
    });
  });

  describe("Playbook Layer 13: Structured Logging & PII Redaction", () => {
    it("masks email addresses and personal signatory names in log events", () => {
      expect(maskEmail("julian@apexsovereign.com")).toBe("j***n@apexsovereign.com");
      expect(maskEmail("ab@domain.com")).toBe("a***@domain.com");
      expect(maskName("Julian Morland")).toBe("J*** M***");
      expect(maskName("Dr. Eleanor Vance")).toBe("D*** E*** V***");

      const rawEvent = {
        businessName: "Apex Sovereign Holdings Ltd",
        ownerName: "Julian Morland",
        companyEmail: "julian@apexsovereign.com",
        stripeApiKey: "sk_live_very_secret_token_12345",
        password: "super_secret_password",
      };

      const sanitized = sanitizeLogData(rawEvent) as Record<string, unknown>;
      expect(sanitized.businessName).toBe("Apex Sovereign Holdings Ltd"); // Corporate name preserved
      expect(sanitized.ownerName).toBe("J*** M***"); // Owner name masked
      expect(sanitized.companyEmail).toBe("j***n@apexsovereign.com"); // Email masked
      expect(sanitized.stripeApiKey).toBe("[REDACTED]"); // Secret redacted
      expect(sanitized.password).toBe("[REDACTED]"); // Password redacted
    });
  });
});
