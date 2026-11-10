import { z } from "zod";
import { teamService } from "@/modules/identity";
import { apiSuccess, apiError, parseJsonBody } from "@/common/utils";

const acceptInviteSchema = z.object({
  inviteToken: z.string().min(1, "inviteToken is required"),
  acceptingUserId: z.string().uuid().optional(),
  fullName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request, acceptInviteSchema);
    const result = await teamService.acceptInvite(body);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
