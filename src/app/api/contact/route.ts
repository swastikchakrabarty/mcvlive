import { NextRequest } from "next/server";
import { z } from "zod";
import { apiSuccess, apiError, parseJsonBody } from "@/common/utils/api-response";

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
  try {
    const data = await parseJsonBody(req, contactSchema);

    // Generate unique inquiry reference tracking ID
    const referenceId = `MCV-LEAD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const receivedAt = new Date().toISOString();

    // Log structured corporate lead event (safe, no secrets)
    console.info(
      JSON.stringify({
        level: "INFO",
        type: "INQUIRY_REGISTERED",
        referenceId,
        businessName: data.businessName,
        ownerName: data.ownerName,
        companyEmail: data.companyEmail,
        budget: data.budget,
        tierSelected: data.tierSelected || "Not specified",
        receivedAt,
        destination: "info@morelandchambers.com",
      }),
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
      undefined,
      201,
    );
  } catch (err: unknown) {
    return apiError(err);
  }
}
