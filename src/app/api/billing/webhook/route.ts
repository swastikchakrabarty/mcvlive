import { webhookService } from "@/modules/sales";
import { apiSuccess, apiError } from "@/common/utils";

export async function POST(request: Request) {
  try {
    const rawPayload = await request.text();
    const signature = request.headers.get("stripe-signature") || "";

    const result = await webhookService.processStripeWebhook(rawPayload, signature);

    return apiSuccess(result, undefined, 200);
  } catch (error) {
    return apiError(error);
  }
}
