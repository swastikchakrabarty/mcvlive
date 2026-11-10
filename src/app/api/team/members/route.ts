import { z } from "zod";
import { resolveAuthContext, teamService } from "@/modules/identity";
import { apiSuccess, apiError, parseJsonBody } from "@/common/utils";

const inviteMemberSchema = z.object({
  email: z.string().email("A valid email address is required"),
  role: z.enum(["owner", "admin", "member", "viewer"]),
});

export async function GET(request: Request) {
  try {
    const context = await resolveAuthContext(request.headers);
    const members = await teamService.listMembers(context);
    return apiSuccess(members);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await resolveAuthContext(request.headers);
    const body = await parseJsonBody(request, inviteMemberSchema);

    const result = await teamService.inviteMember(context, body);
    return apiSuccess(result, undefined, 201);
  } catch (error) {
    return apiError(error);
  }
}
