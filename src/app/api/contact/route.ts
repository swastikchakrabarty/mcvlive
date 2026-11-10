import { NextRequest } from "next/server";
import { z } from "zod";
import { apiSuccess, apiError, parseJsonBody } from "@/common/utils/api-response";
import { rateLimiter, getClientIp } from "@/common/security/rate-limiter";
import { RateLimitError } from "@/common/errors";
import { logger } from "@/common/logger";

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
    // 1. IP-level rate limiting (5 inquiries per 60 seconds)
    const clientIp = getClientIp(req);
    const ipCheck = rateLimiter.check(
      `ip:${clientIp}`,
      { windowMs: 60 * 1000, maxRequests: 5 },
      "Too many requests from this IP address. Please wait before submitting another inquiry.",
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

    // 2. Validate request payload
    const data = await parseJsonBody(req, contactSchema);
    const normalizedEmail = data.companyEmail.toLowerCase().trim();

    // 3. Email-level rate limiting (3 inquiries per 10 minutes)
    const emailCheck = rateLimiter.check(
      `email:${normalizedEmail}`,
      { windowMs: 10 * 60 * 1000, maxRequests: 3 },
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

    // 5. Emit structured JSON audit log with PII redaction
    logger.info(
      "INQUIRY_REGISTERED",
      {
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
        destination: "info@morelandchambers.com",
        message:
          "Inquiry successfully received. Our senior architecture partners will contact you within 24 hours.",
        details: {
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
