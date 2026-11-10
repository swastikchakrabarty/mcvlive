import { NextRequest } from "next/server";
import { z } from "zod";
import { apiSuccess, apiError, parseJsonBody } from "@/common/utils/api-response";
import { rateLimiter, getClientIp } from "@/common/security/rate-limiter";
import { RateLimitError } from "@/common/errors";
import { logger } from "@/common/logger";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { jobQueue } from "@/modules/jobs/job-queue";

export const contactSchema = z.object({
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters." })
    .max(100, { message: "Business name must not exceed 100 characters." }),
  ownerName: z
    .string()
    .min(2, { message: "Owner's name must be at least 2 characters." })
    .max(100, { message: "Owner's name must not exceed 100 characters." }),
  companyEmail: z
    .string()
    .email({ message: "Please provide a valid corporate email address." })
    .max(120, { message: "Email must not exceed 120 characters." }),
  budget: z
    .string()
    .min(2, { message: "Please specify your expected budget or price point." })
    .max(100, { message: "Budget description must not exceed 100 characters." }),
  tierSelected: z.string().optional(),
  message: z.string().max(2000).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export async function POST(req: NextRequest) {
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  try {
    // 1. IP-level rate limiting (max 5 requests per 15 minutes per IP address)
    const clientIp = getClientIp(req);
    const ipCheck = rateLimiter.check(
      `ip:${clientIp}`,
      { windowMs: 15 * 60 * 1000, maxRequests: 5 },
      "Too many inquiries submitted from this IP address. Rate limit exceeded. Please wait 15 minutes before submitting another inquiry.",
    );

    if (!ipCheck.success) {
      logger.security(
        "RATE_LIMIT_BLOCKED_IP",
        "Abuse defense: IP rate limit exceeded",
        { clientIp, retryAfter: ipCheck.retryAfter },
        requestId,
      );
      throw new RateLimitError(ipCheck.reason, ipCheck.retryAfter, {
        retryAfter: ipCheck.retryAfter,
        limit: ipCheck.limit,
      });
    }

    // 2. Validate request payload via strict Zod schema
    const data = await parseJsonBody(req, contactSchema);
    const normalizedEmail = data.companyEmail.toLowerCase().trim();

    // 3. Email-level rate limiting (max 3 inquiries per 15 minutes per email)
    const emailCheck = rateLimiter.check(
      `email:${normalizedEmail}`,
      { windowMs: 15 * 60 * 1000, maxRequests: 3 },
      "Too many inquiries submitted for this email address. Please allow our partners time to respond.",
    );

    if (!emailCheck.success) {
      logger.security(
        "RATE_LIMIT_BLOCKED_EMAIL",
        "Abuse defense: Email rate limit exceeded",
        { companyEmail: normalizedEmail, retryAfter: emailCheck.retryAfter },
        requestId,
      );
      throw new RateLimitError(emailCheck.reason, emailCheck.retryAfter, {
        retryAfter: emailCheck.retryAfter,
        limit: emailCheck.limit,
      });
    }

    // 4. Generate unique inquiry reference tracking ID
    const referenceId = `MCV-LEAD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const receivedAt = new Date().toISOString();

    // 5. Commit record to PostgreSQL database (Pillar 1)
    const [savedLead] = await db
      .insert(leads)
      .values({
        reference_id: referenceId,
        business_name: data.businessName,
        owner_name: data.ownerName,
        company_email: normalizedEmail,
        budget: data.budget,
        tier_selected: data.tierSelected || "ecommerce_store",
        message: data.message || null,
        ip_address: clientIp,
        status: "new",
      })
      .returning();

    // 6. Concurrently dispatch structured notification email to info@morelandchambers.com
    await jobQueue.sendEmail({
      to: "info@morelandchambers.com",
      subject: `[MCV Acquisition] New Lead: ${data.businessName} (Ref: ${referenceId})`,
      template: "lead_acquisition_alert",
      leadId: savedLead?.id,
      referenceId,
      businessName: data.businessName,
      ownerName: data.ownerName,
      companyEmail: normalizedEmail,
      budget: data.budget,
      tierSelected: data.tierSelected || "100_advance",
      receivedAt,
    });

    // 7. Emit structured JSON audit log with automated PII redaction
    logger.info(
      "INQUIRY_REGISTERED",
      {
        leadId: savedLead?.id,
        referenceId,
        businessName: data.businessName,
        ownerName: data.ownerName,
        companyEmail: data.companyEmail,
        budget: data.budget,
        tierSelected: data.tierSelected || "Not specified",
        receivedAt,
        destination: "info@morelandchambers.com",
        clientIp,
      },
      requestId,
    );

    return apiSuccess(
      {
        received: true,
        referenceId,
        id: savedLead?.id,
        destination: "info@morelandchambers.com",
        message:
          "Inquiry successfully received. Our senior architecture partners will contact you within 24 hours.",
        details: {
          id: savedLead?.id,
          referenceId,
          businessName: data.businessName,
          ownerName: data.ownerName,
          companyEmail: data.companyEmail,
          budget: data.budget,
          tierSelected: data.tierSelected || null,
        },
      },
      { requestId },
      201,
    );
  } catch (err: unknown) {
    return apiError(err, undefined, undefined, requestId);
  }
}
