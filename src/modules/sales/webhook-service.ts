import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb, webhookEvents, organizations, invoices, licenses } from "@/db";
import { ValidationError } from "@/common/errors";

export interface StripeEventPayload {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

export class WebhookService {
  private readonly webhookSecret: string;

  constructor(
    webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ||
      "whsec_mcv_test_webhook_signing_secret_key",
  ) {
    this.webhookSecret = webhookSecret;
  }

  /**
   * Cryptographically verifies Stripe webhook signature (HMAC-SHA256).
   */
  verifySignature(payload: string, signatureHeader: string): boolean {
    if (!signatureHeader) return false;

    // Signature header format: t=1612345678,v1=abc123...
    const parts = signatureHeader.split(",");
    const timestampPart = parts.find((p) => p.startsWith("t="));
    const signaturePart = parts.find((p) => p.startsWith("v1="));

    if (!timestampPart || !signaturePart) return false;

    const timestamp = timestampPart.substring(2);
    const expectedSignature = signaturePart.substring(3);

    const signedPayload = `${timestamp}.${payload}`;
    const computedSignature = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(signedPayload)
      .digest("hex");

    const computedBuf = Buffer.from(computedSignature, "hex");
    const expectedBuf = Buffer.from(expectedSignature, "hex");

    if (computedBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedBuf, expectedBuf);
  }

  /**
   * Generates a valid test signature header for automated integration tests.
   */
  generateTestSignature(payload: string, timestamp = Math.floor(Date.now() / 1000)): string {
    const signedPayload = `${timestamp}.${payload}`;
    const signature = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(signedPayload)
      .digest("hex");
    return `t=${timestamp},v1=${signature}`;
  }

  /**
   * Processes an incoming Stripe webhook event with strict idempotency tracking.
   * If the event ID was already processed, immediately returns { duplicate: true } with zero side effects.
   */
  async processStripeWebhook(
    rawPayload: string,
    signatureHeader: string,
    customDb = getDb(),
  ): Promise<{ success: boolean; duplicate: boolean; eventId: string; type: string }> {
    // 1. Verify Cryptographic Signature
    const isValid = this.verifySignature(rawPayload, signatureHeader);
    if (!isValid) {
      throw new ValidationError("Invalid cryptographic webhook signature");
    }

    let event: StripeEventPayload;
    try {
      event = JSON.parse(rawPayload);
    } catch {
      throw new ValidationError("Malformed JSON webhook payload");
    }

    const { id: eventId, type: eventType, data } = event;

    if (!eventId || !eventType) {
      throw new ValidationError("Webhook payload is missing 'id' or 'type'");
    }

    // 2. Strict Idempotency Check:
    // Query database for previously recorded event ID
    const [existingEvent] = await customDb
      .select()
      .from(webhookEvents)
      .where(eq(webhookEvents.event_id, eventId))
      .limit(1);

    if (existingEvent) {
      // Event already logged: return immediately with zero duplicate side effects
      return {
        success: true,
        duplicate: true,
        eventId,
        type: eventType,
      };
    }

    // 3. Record event in 'processing' state
    await customDb.insert(webhookEvents).values({
      event_id: eventId,
      provider: "stripe",
      event_type: eventType,
      status: "processing",
      payload: event as unknown as Record<string, unknown>,
    });

    try {
      const obj = data.object;
      const organizationId =
        obj.metadata && typeof obj.metadata === "object"
          ? ((obj.metadata as Record<string, unknown>).organizationId as string | undefined)
          : undefined;

      // 4. Handle Subscription State Transitions
      switch (eventType) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const tier =
            ((obj.metadata as Record<string, unknown>)?.tier as string) || "enterprise_standard";
          const status = (obj.status as string) || "active";
          const customerId = obj.customer as string;
          const subscriptionId = obj.id as string;

          if (organizationId) {
            await customDb
              .update(organizations)
              .set({
                subscription_tier: tier,
                subscription_status: status === "active" ? "active" : "trialing",
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                updated_at: new Date(),
              })
              .where(eq(organizations.id, organizationId));
          }
          break;
        }

        case "customer.subscription.deleted": {
          if (organizationId) {
            await customDb
              .update(organizations)
              .set({
                subscription_status: "canceled",
                updated_at: new Date(),
              })
              .where(eq(organizations.id, organizationId));
          }
          break;
        }

        case "invoice.payment_succeeded": {
          const paymentIntentId = (obj.payment_intent as string) || `pi_auto_${Date.now()}`;
          const amountPaid = typeof obj.amount_paid === "number" ? obj.amount_paid : 10000;
          const invoiceNumber = (obj.number as string) || `INV-STRIPE-${Date.now()}`;

          if (organizationId) {
            // Upsert / insert invoice
            await customDb.insert(invoices).values({
              organization_id: organizationId,
              invoice_number: invoiceNumber,
              stripe_payment_intent_id: paymentIntentId,
              amount_due_minor: amountPaid,
              amount_paid_minor: amountPaid,
              currency: (obj.currency as string)?.toUpperCase() || "USD",
              status: "paid",
              paid_at: new Date(),
            });

            // Ensure license is active
            const [existingLicense] = await customDb
              .select()
              .from(licenses)
              .where(eq(licenses.organization_id, organizationId))
              .limit(1);

            if (existingLicense) {
              await customDb
                .update(licenses)
                .set({ status: "active", updated_at: new Date() })
                .where(eq(licenses.id, existingLicense.id));
            }
          }
          break;
        }

        case "invoice.payment_failed": {
          if (organizationId) {
            await customDb
              .update(organizations)
              .set({
                subscription_status: "past_due",
                updated_at: new Date(),
              })
              .where(eq(organizations.id, organizationId));
          }
          break;
        }

        case "charge.refunded": {
          const paymentIntent = obj.payment_intent as string;
          if (paymentIntent) {
            await customDb
              .update(invoices)
              .set({
                status: "refunded",
                updated_at: new Date(),
              })
              .where(eq(invoices.stripe_payment_intent_id, paymentIntent));
          }
          break;
        }

        default:
          // Unhandled event type acknowledged safely
          break;
      }

      // 5. Mark event successfully processed
      await customDb
        .update(webhookEvents)
        .set({
          status: "processed",
          organization_id: organizationId || null,
          processed_at: new Date(),
          updated_at: new Date(),
        })
        .where(eq(webhookEvents.event_id, eventId));

      return {
        success: true,
        duplicate: false,
        eventId,
        type: eventType,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown webhook processing error";
      await customDb
        .update(webhookEvents)
        .set({
          status: "failed",
          error_message: errorMsg,
          updated_at: new Date(),
        })
        .where(eq(webhookEvents.event_id, eventId));

      throw err;
    }
  }
}

export const webhookService = new WebhookService();
