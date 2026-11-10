import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb, closeDbPool, organizations, webhookEvents, invoices, backgroundJobs } from "@/db";
import { runSeed } from "@/db/seed";
import { resolveAuthContext } from "@/modules/identity";
import { webhookService } from "@/modules/sales/webhook-service";
import { hasFeature, assertFeature } from "@/modules/sales/feature-gate";
import { jobQueue } from "@/modules/jobs";
import { POST as createWorkspaceRoute } from "@/app/api/workspaces/route";
import { POST as webhookRoute } from "@/app/api/billing/webhook/route";
import { ForbiddenError } from "@/common/errors";
import { eq } from "drizzle-orm";

describe("Layer 5: APIs, Validation, Webhooks & Background Jobs", () => {
  let seeded: Awaited<ReturnType<typeof runSeed>>;
  const db = getDb();
  let ownerContext: Awaited<ReturnType<typeof resolveAuthContext>>;

  beforeAll(async () => {
    seeded = await runSeed(db);
    const org1Id = seeded.org1.org.id;
    const u1_owner = seeded.org1.users[0]!;

    ownerContext = await resolveAuthContext(
      { "x-user-id": u1_owner.id, "x-organization-id": org1Id },
      db,
    );
  });

  afterAll(async () => {
    await closeDbPool();
  });

  // ===========================================================================
  // 1. INPUT VALIDATION & GARBAGE JSON (CLEAN 400 ERROR, NO STACK TRACES)
  // ===========================================================================
  describe("Input Validation & Malformed JSON Protection", () => {
    it("should return clean 400 BAD_REQUEST when malformed/garbage JSON is sent (no stack traces)", async () => {
      const garbagePayload = "{ invalid_json_syntax: missing_quotes, ";

      const request = new Request("http://localhost:3000/api/workspaces", {
        method: "POST",
        headers: {
          "x-user-id": ownerContext.user.id,
          "x-organization-id": ownerContext.organizationId,
          "Content-Type": "application/json",
        },
        body: garbagePayload,
      });

      const response = await createWorkspaceRoute(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("BAD_REQUEST");
      expect(json.error.message).toContain("Malformed JSON payload");
      expect(json.error.timestamp).toBeDefined();

      // STRICT ENTERPRISE STANDARD: Zero internal stack trace exposure
      expect(json.error.stack).toBeUndefined();
      expect(json.stack).toBeUndefined();
    });

    it("should return clean 400 VALIDATION_ERROR when payload violates Zod schema", async () => {
      const invalidPayload = JSON.stringify({
        name: "A", // too short (min 2)
        slug: "INVALID SLUG WITH SPACES", // violates regex
      });

      const request = new Request("http://localhost:3000/api/workspaces", {
        method: "POST",
        headers: {
          "x-user-id": ownerContext.user.id,
          "x-organization-id": ownerContext.organizationId,
          "Content-Type": "application/json",
        },
        body: invalidPayload,
      });

      const response = await createWorkspaceRoute(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("VALIDATION_ERROR");
      expect(json.error.details).toBeDefined();
      expect(json.error.details.length).toBeGreaterThan(0);
      expect(json.error.stack).toBeUndefined();
    });
  });

  // ===========================================================================
  // 2. CRYPTOGRAPHIC WEBHOOKS & STRICT IDEMPOTENCY REPLAY TEST
  // ===========================================================================
  describe("Stripe Webhook Cryptographic Verification & Idempotency", () => {
    it("should reject webhooks with invalid signatures", async () => {
      const rawPayload = JSON.stringify({
        id: "evt_test_fake_sig",
        type: "invoice.payment_succeeded",
        data: { object: {} },
      });

      const request = new Request("http://localhost:3000/api/billing/webhook", {
        method: "POST",
        headers: {
          "stripe-signature": "t=1600000000,v1=invalid_fake_signature_hash",
        },
        body: rawPayload,
      });

      const response = await webhookRoute(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("VALIDATION_ERROR");
      expect(json.error.message).toContain("Invalid cryptographic webhook signature");
    });

    it("should process a valid webhook event and replay it with zero duplicate records created", async () => {
      const orgId = seeded.org1.org.id;
      const eventId = `evt_payment_test_${Date.now()}_unique`;

      const rawPayload = JSON.stringify({
        id: eventId,
        type: "invoice.payment_succeeded",
        data: {
          object: {
            id: `in_stripe_mock_${Date.now()}`,
            number: `INV-TEST-REPLAY-${Date.now()}`,
            payment_intent: `pi_test_${Date.now()}`,
            amount_paid: 2500000,
            currency: "usd",
            metadata: { organizationId: orgId },
          },
        },
      });

      const signature = webhookService.generateTestSignature(rawPayload);

      // --- FIRST EXECUTION ---
      const firstReq = new Request("http://localhost:3000/api/billing/webhook", {
        method: "POST",
        headers: { "stripe-signature": signature },
        body: rawPayload,
      });

      const firstRes = await webhookRoute(firstReq);
      expect(firstRes.status).toBe(200);

      const firstJson = await firstRes.json();
      expect(firstJson.success).toBe(true);
      expect(firstJson.data.duplicate).toBe(false);
      expect(firstJson.data.eventId).toBe(eventId);

      // Count invoices created for this invoice number
      const invoicesFirstCount = await db
        .select()
        .from(invoices)
        .where(eq(invoices.organization_id, orgId));

      const matchingFirst = invoicesFirstCount.filter((inv) =>
        inv.invoice_number.startsWith("INV-TEST-REPLAY-"),
      );
      expect(matchingFirst.length).toBe(1);

      // --- SECOND EXECUTION (REPLAY OF IDENTICAL WEBHOOK) ---
      const secondReq = new Request("http://localhost:3000/api/billing/webhook", {
        method: "POST",
        headers: { "stripe-signature": signature },
        body: rawPayload,
      });

      const secondRes = await webhookRoute(secondReq);
      expect(secondRes.status).toBe(200);

      const secondJson = await secondRes.json();
      expect(secondJson.success).toBe(true);
      expect(secondJson.data.duplicate).toBe(true); // Flagged as duplicate!
      expect(secondJson.data.eventId).toBe(eventId);

      // Verify ZERO duplicate invoice records created
      const invoicesSecondCount = await db
        .select()
        .from(invoices)
        .where(eq(invoices.organization_id, orgId));

      const matchingSecond = invoicesSecondCount.filter((inv) =>
        inv.invoice_number.startsWith("INV-TEST-REPLAY-"),
      );
      expect(matchingSecond.length).toBe(1); // Exactly 1, zero duplicates!

      // Verify webhook_events table only has 1 record for this eventId
      const recordedEvents = await db
        .select()
        .from(webhookEvents)
        .where(eq(webhookEvents.event_id, eventId));
      expect(recordedEvents.length).toBe(1);
    });

    it("should update organization subscription state upon subscription webhook events", async () => {
      const orgId = seeded.org2.org.id;
      const eventId = `evt_sub_upgrade_${Date.now()}`;

      const rawPayload = JSON.stringify({
        id: eventId,
        type: "customer.subscription.updated",
        data: {
          object: {
            id: "sub_stripe_vector_sovereign_123",
            customer: "cus_stripe_enterprise_456",
            status: "active",
            metadata: {
              organizationId: orgId,
              tier: "vector_sovereign",
            },
          },
        },
      });

      const signature = webhookService.generateTestSignature(rawPayload);

      const req = new Request("http://localhost:3000/api/billing/webhook", {
        method: "POST",
        headers: { "stripe-signature": signature },
        body: rawPayload,
      });

      const res = await webhookRoute(req);
      expect(res.status).toBe(200);

      // Verify organization record in database was updated
      const [updatedOrg] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, orgId))
        .limit(1);

      expect(updatedOrg?.subscription_tier).toBe("vector_sovereign");
      expect(updatedOrg?.subscription_status).toBe("active");
      expect(updatedOrg?.stripe_subscription_id).toBe("sub_stripe_vector_sovereign_123");
    });
  });

  // ===========================================================================
  // 3. CENTRALIZED FEATURE GATING (`hasFeature`, `assertFeature`)
  // ===========================================================================
  describe("Centralized Feature Gating Engine", () => {
    it("should correctly gate features by subscription tier", () => {
      const starterOrg = {
        id: "org_starter",
        subscription_tier: "starter",
        subscription_status: "active",
      };

      const enterpriseOrg = {
        id: "org_enterprise",
        subscription_tier: "enterprise_standard",
        subscription_status: "active",
      };

      const sovereignOrg = {
        id: "org_sovereign",
        subscription_tier: "vector_sovereign",
        subscription_status: "active",
      };

      // Starter tier checks
      expect(hasFeature(starterOrg, "custom_vector_blueprints")).toBe(false);
      expect(hasFeature(starterOrg, "dedicated_nodes")).toBe(false);
      expect(() => assertFeature(starterOrg, "dedicated_nodes")).toThrow(ForbiddenError);

      // Enterprise Standard tier checks
      expect(hasFeature(enterpriseOrg, "custom_vector_blueprints")).toBe(true);
      expect(hasFeature(enterpriseOrg, "audit_export_api")).toBe(true);
      expect(hasFeature(enterpriseOrg, "dedicated_nodes")).toBe(false); // only in sovereign

      // Vector Sovereign tier checks
      expect(hasFeature(sovereignOrg, "dedicated_nodes")).toBe(true);
      expect(hasFeature(sovereignOrg, "sla_guarantee_99_99")).toBe(true);
      expect(hasFeature(sovereignOrg, "unlimited_workspaces")).toBe(true);
      expect(() => assertFeature(sovereignOrg, "dedicated_nodes")).not.toThrow();
    });

    it("should revoke all features if subscription status is canceled or unpaid", () => {
      const canceledOrg = {
        id: "org_canceled",
        subscription_tier: "vector_sovereign",
        subscription_status: "canceled",
      };

      expect(hasFeature(canceledOrg, "dedicated_nodes")).toBe(false);
      expect(hasFeature(canceledOrg, "custom_vector_blueprints")).toBe(false);
      expect(() => assertFeature(canceledOrg, "dedicated_nodes")).toThrow(ForbiddenError);
    });
  });

  // ===========================================================================
  // 4. ASYNCHRONOUS BACKGROUND JOBS QUEUE & EXPONENTIAL BACKOFF
  // ===========================================================================
  describe("Asynchronous Background Jobs Queue", () => {
    it("should enqueue a job with idempotency and execute it successfully", async () => {
      const orgId = seeded.org1.org.id;
      const idempotencyKey = `job_email_${Date.now()}`;

      // 1. Enqueue job
      const enqueueRes = await jobQueue.enqueueJob(
        {
          jobType: "send_email",
          organizationId: orgId,
          idempotencyKey,
          payload: {
            to: "client@morlandchambers.com",
            subject: "Your Vector Architecture License Key",
            template: "license_delivered",
          },
        },
        db,
      );

      expect(enqueueRes.jobId).toBeDefined();
      expect(enqueueRes.duplicate).toBe(false);
      expect(enqueueRes.status).toBe("pending");

      // 2. Re-enqueue with same idempotencyKey -> returns duplicate
      const duplicateRes = await jobQueue.enqueueJob(
        {
          jobType: "send_email",
          organizationId: orgId,
          idempotencyKey,
          payload: { to: "client@morlandchambers.com", subject: "duplicate", template: "test" },
        },
        db,
      );
      expect(duplicateRes.duplicate).toBe(true);
      expect(duplicateRes.jobId).toBe(enqueueRes.jobId);

      // 3. Execute job
      const execRes = await jobQueue.executeJob(enqueueRes.jobId, db);
      expect(execRes.success).toBe(true);

      // Verify job record is completed
      const [jobRecord] = await db
        .select()
        .from(backgroundJobs)
        .where(eq(backgroundJobs.id, enqueueRes.jobId))
        .limit(1);

      expect(jobRecord?.status).toBe("completed");
      expect(jobRecord?.completed_at).toBeDefined();
      expect(jobRecord?.last_error).toBeNull();
    });

    it("should execute failed jobs with exponential backoff and transition to failed when maxAttempts exhausted", async () => {
      const orgId = seeded.org1.org.id;
      const idempotencyKey = `job_failing_${Date.now()}`;

      // Register a failing test handler
      jobQueue.registerHandler("failing_test_job", async () => {
        throw new Error("Simulated external service timeout (503 Service Unavailable)");
      });

      // Enqueue job with maxAttempts: 2
      const { jobId } = await jobQueue.enqueueJob(
        {
          jobType: "failing_test_job" as unknown as Parameters<
            typeof jobQueue.enqueueJob
          >[0]["jobType"],
          organizationId: orgId,
          idempotencyKey,
          payload: {},
          maxAttempts: 2,
        },
        db,
      );

      // First attempt -> fails, scheduled for retry (backoff)
      const res1 = await jobQueue.executeJob(jobId, db);
      expect(res1.success).toBe(false);

      const [afterFirst] = await db
        .select()
        .from(backgroundJobs)
        .where(eq(backgroundJobs.id, jobId));
      expect(afterFirst?.status).toBe("pending");
      expect(afterFirst?.attempts).toBe(1);
      expect(afterFirst?.last_error).toContain("Simulated external service timeout");

      // Second attempt -> reaches maxAttempts (2), transitions to 'failed' (Dead Letter Queue)
      const res2 = await jobQueue.executeJob(jobId, db);
      expect(res2.success).toBe(false);

      const [afterSecond] = await db
        .select()
        .from(backgroundJobs)
        .where(eq(backgroundJobs.id, jobId));
      expect(afterSecond?.status).toBe("failed");
      expect(afterSecond?.attempts).toBe(2);
      expect(afterSecond?.last_error).toContain("Simulated external service timeout");
    });
  });
});
