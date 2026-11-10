import { z } from "zod";
import { resolveAuthContext, teamService } from "@/modules/identity";
import { apiSuccess, apiError, parseJsonBody } from "@/common/utils";

const transferOwnershipSchema = z.object({
  targetUserId: z.string().uuid("targetUserId must be a valid UUID"),
});

export async function POST(request: Request) {
  try {
    const context = await resolveAuthContext(request.headers);
    const body = await parseJsonBody(request, transferOwnershipSchema);

    const result = await teamService.transferOwnership(context, body.targetUserId);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
