import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST as contactHandler } from "@/app/api/contact/route";

describe("Contact Ingress API (/api/contact)", () => {
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
});
